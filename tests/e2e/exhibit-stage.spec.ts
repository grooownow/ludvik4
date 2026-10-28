import { expect, test } from "@playwright/test";

/**
 * The exhibit label sits right of the mascot's head (docs/specs/
 * immersive-home.md). On short or ultra-wide desktop screens it must neither
 * cover the mascot nor leave the viewport. Desktop only: phones get the
 * portrait still, where the label has room above the mascot.
 */
for (const viewport of [
  { width: 1280, height: 600 },
  { width: 2560, height: 1080 },
  { width: 1440, height: 900 },
  // A desktop window a touch taller than wide is "portrait" to CSS, but it
  // still has room beside the head: the label stays there (owner, 2026-10-23).
  { width: 740, height: 780 },
]) {
  test(`label clears the mascot at ${viewport.width}×${viewport.height}`, async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "desktop layout only");
    await page.setViewportSize(viewport);
    await page.goto("/");

    const stage = (await page
      .getByRole("region", { name: "Ludvik" })
      .boundingBox())!;
    const label = (await page.getByTestId("exhibit-label").boundingBox())!;

    // The mascot is sized by the shorter side h and centred. Its outline, in
    // units of h from the centre (measured from the still's alpha): antenna
    // and upper head reach 0.115 right up to 0.30 above the centre, the head
    // 0.15 down to the centre, the belly 0.18 down to 0.27 below it; the right
    // arm ring spans 0.17–0.31 right, from 0.01 above to 0.09 below.
    const cx = stage.x + stage.width / 2;
    const cy = stage.y + stage.height / 2;
    const h = Math.min(stage.width, stage.height);
    const band = (right: number, from: number, to: number, left = -right) => ({
      left: cx + left * h,
      right: cx + right * h,
      top: cy - from * h,
      bottom: cy - to * h,
    });
    const boxes = [
      band(0.115, 0.3, 0.12),
      band(0.15, 0.12, 0),
      band(0.18, 0, -0.27),
      band(0.31, 0.01, -0.09, 0.17),
    ];
    for (const box of boxes) {
      const overlaps =
        label.x < box.right &&
        label.x + label.width > box.left &&
        label.y < box.bottom &&
        label.y + label.height > box.top;
      expect(overlaps, JSON.stringify({ label, box })).toBe(false);
    }
    expect(label.x + label.width).toBeLessThanOrEqual(viewport.width);
    expect(label.y).toBeGreaterThanOrEqual(0);
  });
}

// The still and the live shader must frame the mascot the same way on a phone
// too: both stills carry the phone framing (exhibit-gate.ts → stageFraming).
test("on a phone the still is framed like the live scene", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "phone layout only");
  await page.goto("/");
  const stage = (await page
    .getByRole("region", { name: "Ludvik" })
    .boundingBox())!;
  // The stage layer: it shares the mascot layer's framing but does not rock,
  // so its box is the framing exactly.
  const img = page
    .getByRole("region", { name: "Ludvik" })
    .locator("img")
    .first();
  await expect(img).toHaveJSProperty("complete", true);
  const box = (await img.boundingBox())!;
  // The still's frame centre is the mascot's centre.
  expect((box.x + box.width / 2 - stage.x) / stage.width).toBeCloseTo(0.53, 2);
  expect((box.y + box.height / 2 - stage.y) / stage.height).toBeCloseTo(
    0.43,
    2,
  );
  expect(box.width / stage.width).toBeCloseTo(1.38, 2);
});

test("on a phone the label is small and sits top right, beside the head", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "portrait phone layout only");
  await page.goto("/");
  const stage = (await page
    .getByRole("region", { name: "Ludvik" })
    .boundingBox())!;
  const label = (await page.getByTestId("exhibit-label").boundingBox())!;
  // Beside the head (owner, 2026-10-24): in the upper third, under the menu.
  expect(label.y).toBeGreaterThan(stage.y + stage.height * 0.12);
  expect(label.y + label.height).toBeLessThan(stage.y + stage.height * 0.4);
  expect(label.x).toBeGreaterThanOrEqual(0);
  expect(label.x + label.width).toBeLessThanOrEqual(stage.x + stage.width);
  // A dense museum label at the right edge, not a wide card.
  expect(label.x).toBeGreaterThan(stage.x + stage.width * 0.4);
  expect(label.width).toBeLessThan(stage.width * 0.5);
});

// The still and the live shader must frame the mascot identically: the
// shader sizes it by the shorter side, so object-cover must scale the still
// by that same side (height on landscape, width on portrait) — otherwise the
// crossfade shows two mascots of different sizes.
for (const viewport of [
  { width: 2560, height: 1080, side: "height" },
  { width: 1920, height: 960, side: "height" },
  { width: 1024, height: 768, side: "height" },
  { width: 390, height: 844, side: "width" },
] as const) {
  test(`still scales by the ${viewport.side} at ${viewport.width}×${viewport.height}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");
    // Both still layers share the framing; check the stage layer.
    const img = page
      .getByRole("region", { name: "Ludvik" })
      .locator("img")
      .first();
    await expect(img).toHaveJSProperty("complete", true);
    const { scale, byWidth, byHeight } = await img.evaluate(
      (el: HTMLImageElement) => {
        const box = el.getBoundingClientRect();
        const w = box.width / el.naturalWidth;
        const h = box.height / el.naturalHeight;
        return { scale: Math.max(w, h), byWidth: w, byHeight: h };
      },
    );
    expect(scale).toBeCloseTo(
      viewport.side === "height" ? byHeight : byWidth,
      5,
    );
  });
}

test("the still mascot rocks where the live scene does not run", async ({
  page,
}) => {
  // CI has no GPU, so the live scene never starts: the fallback is on show.
  await page.goto("/");
  const mascot = page.locator("img.exhibit-mascot");
  await expect(mascot).toHaveAttribute("data-rocking", "true");
  const first = await mascot.evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(700);
  const later = await mascot.evaluate((el) => getComputedStyle(el).transform);
  expect(later).not.toBe(first);
});

// Rubber-band overscroll (macOS/iOS) reveals what is behind the page: the
// stage's top colour above and the footer plum below — never a white strip.
for (const [path, top] of [
  ["/", "rgb(255, 224, 250)"],
  ["/contact", "rgb(255, 255, 255)"],
] as const) {
  test(`overscroll behind ${path} continues the page at both ends`, async ({
    page,
  }) => {
    await page.goto(path);
    const layer = await page.evaluate(() => {
      const style = getComputedStyle(document.body, "::before");
      return { position: style.position, image: style.backgroundImage };
    });
    expect(layer.position).toBe("fixed");
    expect(layer.image).toContain(top);
    expect(layer.image).toContain("rgb(20, 4, 12)");
  });
}
