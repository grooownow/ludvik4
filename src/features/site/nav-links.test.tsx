import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NavLinks } from "./nav-links";

const pathname = vi.hoisted(() => ({ value: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.value }));

const LINKS = [
  { href: "/#work", label: "Work" },
  { href: "/#collection", label: "Services" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

let observe: (
  entries: { target: Element; isIntersecting: boolean }[],
) => void = () => {};

beforeEach(() => {
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: typeof observe) {
        observe = cb;
      }
      observe() {}
      disconnect() {}
    },
  );
});
afterEach(() => vi.unstubAllGlobals());

describe("NavLinks", () => {
  it("marks the page link of the current route", () => {
    pathname.value = "/guides/website-project-brief";
    render(<NavLinks links={LINKS} />);
    expect(screen.getByRole("link", { name: "Guides" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "About" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("marks the home section that is on screen", () => {
    pathname.value = "/";
    const work = document.createElement("section");
    work.id = "work";
    document.body.append(work);
    render(<NavLinks links={LINKS} />);
    act(() => observe([{ target: work, isIntersecting: true }]));
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute(
      "aria-current",
      "location",
    );
    act(() => observe([{ target: work, isIntersecting: false }]));
    expect(screen.getByRole("link", { name: "Work" })).not.toHaveAttribute(
      "aria-current",
    );
    work.remove();
  });

  it("keeps section links pointing at the home anchors", () => {
    pathname.value = "/about";
    render(<NavLinks links={LINKS} />);
    expect(screen.getByRole("link", { name: "Work" })).toHaveAttribute(
      "href",
      "/#work",
    );
  });
});
