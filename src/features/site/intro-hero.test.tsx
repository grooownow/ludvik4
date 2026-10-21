import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getMarketContent } from "./content";
import { IntroHero } from "./intro-hero";

const en = getMarketContent("en");
const ru = getMarketContent("ru");

function artwork() {
  return screen.getByRole("img", { name: "Ludvik4" });
}

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
  });

  it("shows the candy artwork, with no style switcher", () => {
    render(<IntroHero content={en} />);
    expect(artwork()).toHaveAttribute(
      "src",
      "/intro/intro-candy-desktop-1304.webp",
    );
    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("shows the plain artwork without the live scene where WebGL is missing", () => {
    // jsdom has no WebGL and no matchMedia: exactly the fallback path.
    render(<IntroHero content={en} />);
    expect(artwork()).toBeVisible();
    expect(screen.queryByTestId("intro-scene")).not.toBeInTheDocument();
  });
});
