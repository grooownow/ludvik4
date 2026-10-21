import { Fragment } from "react";

// The home H1. On desktop it is set in the owner's chosen lines and allowed to
// run past its column into the illustration's white margin (the robot art has
// plenty of air), so the headline stays at three lines; on smaller screens it
// wraps naturally. The lines are joined with spaces, so the heading's text
// and accessible name are the plain title.

export function HeroTitle({
  title,
  lines,
}: {
  title: string;
  lines?: readonly string[];
}) {
  return (
    <h1 className="relative z-10 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:w-max">
      {lines
        ? lines.map((line, index) => (
            // The space is a direct child of the h1: wrapped in its own span
            // it is trimmed out of the accessible name ("автоматизацияи").
            <Fragment key={line}>
              {index > 0 ? " " : null}
              <span className="lg:block lg:whitespace-nowrap">{line}</span>
            </Fragment>
          ))
        : title}
    </h1>
  );
}
