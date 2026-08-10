"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentPropsWithoutRef, MouseEvent, Ref } from "react";

/**
 * Scrolling for in-page anchors, done by us instead of by the router.
 *
 * A plain `<Link href="/#contact">` only works the first time. Click it again
 * and the destination equals the URL you are already on: the browser fires no
 * `hashchange` (the hash did not change) and Next treats the navigation as a
 * no-op, so nothing moves. On a landing page that is the ordinary path —
 * click the CTA, scroll back up to read something, click the CTA again, dead
 * button. Measured on production 2026-08-10: first click scrolled to y=3918,
 * second click left the page at y=0.
 *
 * Owning the scroll makes the behaviour independent of what the URL already
 * says. When the target is not on this page — the same header CTA renders on
 * /privacy and on blog posts, where `#contact` does not exist — the click
 * falls through to `<Link>` and stays a real navigation.
 */

function scrollTo(target: HTMLElement) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });

  // Native hash navigation also moves focus, which is how keyboard and screen
  // reader users know they arrived. Sections are not focusable by default, so
  // lend the target a tabindex; `preventScroll` keeps focus() from teleporting
  // past the smooth scroll we just started.
  if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
}

/**
 * True for clicks the browser should keep handling itself: modified clicks
 * open new tabs or windows, and hijacking those is a well-earned annoyance.
 */
function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

type AnchorLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  /** Either "#id" or "/path#id". */
  href: string;
  ref?: Ref<HTMLAnchorElement>;
};

export function AnchorLink({ href, onClick, ...props }: AnchorLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    // `<Button asChild>` composes its own handler onto ours through Radix's
    // Slot; run it first and respect it if it already handled the click.
    onClick?.(event);
    if (event.defaultPrevented || !isPlainLeftClick(event)) return;

    const hashAt = href.indexOf("#");
    if (hashAt < 0) return;

    const id = href.slice(hashAt + 1);
    const target = document.getElementById(id);
    // Not on this page: let <Link> navigate to the page that has it.
    if (!target) return;

    event.preventDefault();

    // Keep the address bar honest without going through the router. Read
    // through `document.URL` rather than `window.location`: the lint rule
    // banning the latter is about navigating by assigning to it, and nothing
    // here navigates — parsing the current URL keeps search params verbatim,
    // so a `?utm_*` visit stays attributable. A history entry is added only
    // when the hash actually changes, which is what a native anchor does.
    const url = new URL(document.URL);
    const write = url.hash === `#${id}` ? "replaceState" : "pushState";
    url.hash = id;
    window.history[write](window.history.state, "", url);

    scrollTo(target);
  }

  return <Link href={href as Route} onClick={handleClick} {...props} />;
}

/**
 * The wordmark. On any other page it is a normal link home; on the home page
 * itself it means "back to the top", which a bare `<Link href="/">` does not
 * deliver: it strips the hash but Next then restores the scroll position it
 * remembered for `/`, dropping you back at the section you were trying to
 * leave (measured: hash cleared, y=3918).
 */
export function HomeLink({ onClick, ...props }: AnchorLinkProps) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented || !isPlainLeftClick(event)) return;
    if (pathname !== "/") return;

    event.preventDefault();

    const url = new URL(document.URL);
    if (url.hash) {
      url.hash = "";
      window.history.pushState(window.history.state, "", url);
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  return <AnchorLink onClick={handleClick} {...props} />;
}
