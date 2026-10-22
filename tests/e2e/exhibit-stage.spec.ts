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

    // The mascot is sized by the shorter side (the stage height here) and
    // centred: body + head within ±19% of that height around the centre,
    // 18–80% down; the right arm ring spans 17–31% right of centre, 46–59% down.
    const cx = stage.x + stage.width / 2;
    const h = stage.height;
    const boxes = [
      {
        left: cx - 0.19 * h,
        right: cx + 0.19 * h,
        top: stage.y + 0.18 * h,
        bottom: stage.y + 0.8 * h,
      },
      {
        left: cx + 0.17 * h,
        right: cx + 0.31 * h,
        top: stage.y + 0.46 * h,
        bottom: stage.y + 0.59 * h,
      },
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

test("on a phone the label sits below the mascot", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "portrait phone layout only");
  await page.goto("/");
  const stage = (await page
    .getByRole("region", { name: "Ludvik" })
    .boundingBox())!;
  const label = (await page.getByTestId("exhibit-label").boundingBox())!;
  // The portrait still puts the mascot's base at ~63% of the stage height.
  expect(label.y).toBeGreaterThan(stage.y + stage.height * 0.66);
  expect(label.x).toBeGreaterThanOrEqual(0);
  expect(label.x + label.width).toBeLessThanOrEqual(stage.x + stage.width);
});
