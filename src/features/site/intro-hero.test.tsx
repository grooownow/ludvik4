import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getMarketContent } from "./content";
import { IntroHero } from "./intro-hero";
import { INTRO_VARIANT_STORAGE_KEY } from "./intro-variants";

const en = getMarketContent("en");
const ru = getMarketContent("ru");

function artwork() {
  return screen.getByRole("img", { name: "Ludvik4" });
}

beforeEach(() => {
  window.localStorage.clear();
});
afterEach(() => {
  window.localStorage.clear();
});

describe("IntroHero", () => {
  it("renders each market's copy over the artwork", () => {
    const { unmount } = render(<IntroHero content={en} />);
    expect(
      screen.getByText("Founder-led product studio · Europe · Worldwide"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, el) =>
          el?.tagName === "P" &&
          el.textContent === "Websites · Workflow automation · Web apps",
      ),
    ).toBeInTheDocument();
    unmount();

    render(<IntroHero content={ru} />);
    expect(
      screen.getByText("Продуктовая студия · Веб-разработка под ключ"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: "Стиль заставки" }),
    ).toBeInTheDocument();
  });

  it("starts on the candy artwork and switches to fuchsia", async () => {
    render(<IntroHero content={en} />);
    const switcher = screen.getByRole("group", { name: "Intro style" });
    const candy = within(switcher).getByRole("button", { name: "Candy" });
    const fuchsia = within(switcher).getByRole("button", { name: "Fuchsia" });

    expect(candy).toHaveAttribute("aria-pressed", "true");
    expect(artwork()).toHaveAttribute(
      "src",
      "/intro/intro-candy-desktop-1304.webp",
    );

    await userEvent.click(fuchsia);

    expect(fuchsia).toHaveAttribute("aria-pressed", "true");
    expect(candy).toHaveAttribute("aria-pressed", "false");
    expect(artwork()).toHaveAttribute(
      "src",
      "/intro/intro-fuchsia-desktop-1304.webp",
    );
    expect(window.localStorage.getItem(INTRO_VARIANT_STORAGE_KEY)).toBe(
      "fuchsia",
    );
  });

  it("restores the visitor's stored choice", async () => {
    window.localStorage.setItem(INTRO_VARIANT_STORAGE_KEY, "fuchsia");
    render(<IntroHero content={en} />);

    expect(
      await screen.findByRole("button", { name: "Fuchsia", pressed: true }),
    ).toBeInTheDocument();
    expect(artwork()).toHaveAttribute(
      "src",
      "/intro/intro-fuchsia-desktop-1304.webp",
    );
  });

  it("ignores a stored value that is not a known variant", () => {
    window.localStorage.setItem(INTRO_VARIANT_STORAGE_KEY, "neon");
    render(<IntroHero content={en} />);

    expect(
      screen.getByRole("button", { name: "Candy", pressed: true }),
    ).toBeInTheDocument();
  });

  it("shows the plain artwork without the drop where WebGL is missing", () => {
    // jsdom has no WebGL and no matchMedia: exactly the fallback path.
    render(<IntroHero content={en} />);
    expect(artwork()).toBeVisible();
    expect(screen.queryByTestId("intro-scene")).not.toBeInTheDocument();
  });
});
