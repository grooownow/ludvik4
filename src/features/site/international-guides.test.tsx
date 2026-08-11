import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getInternationalGuide } from "./international-content";
import {
  InternationalGuideIndexView,
  InternationalGuideView,
} from "./international-pages";

describe("International guides", () => {
  it("lists all three decision tools on the guide hub", () => {
    render(<InternationalGuideIndexView />);

    expect(
      screen.getByRole("link", { name: /Build a website project brief/i }),
    ).toHaveAttribute("href", "/guides/website-project-brief");
    expect(
      screen.getByRole("link", { name: /Score an automation opportunity/i }),
    ).toHaveAttribute("href", "/guides/automation-priority-scorecard");
    expect(
      screen.getByRole("link", { name: /Scope an MVP around one journey/i }),
    ).toHaveAttribute("href", "/guides/mvp-scope-one-user-journey");
  });

  it("renders a useful guide, its related service and Article schema", () => {
    const guide = getInternationalGuide("automation-priority-scorecard");
    expect(guide).toBeDefined();

    const { container } = render(
      <InternationalGuideView guide={guide!} baseUrl="https://ludvik4.dev" />,
    );

    expect(
      screen.getByRole("heading", { name: "How to use the scorecard" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Explore workflow automation/ }),
    ).toHaveAttribute("href", "/services/workflow-automation");
    expect(container.innerHTML).toContain('"@type":"Article"');
  });
});
