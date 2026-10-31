import type { Route } from "next";
import Link from "next/link";
import { Fragment } from "react";

export type BreadcrumbItem = {
  label: string;
  href?: Route;
};

export function Breadcrumbs({
  items,
  homeLabel = "Главная",
  homeHref = "/",
  ariaLabel,
}: {
  items: BreadcrumbItem[];
  homeLabel?: string;
  /** The home of the page's language: "/", "/es", "/ru". */
  homeHref?: string;
  ariaLabel?: string;
}) {
  return (
    <nav
      aria-label={
        ariaLabel ??
        (homeLabel === "Главная" ? "Хлебные крошки" : "Breadcrumbs")
      }
      className="text-muted-foreground font-mono text-sm"
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link href={homeHref as Route} className="hover:text-foreground">
            {homeLabel}
          </Link>
        </li>
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;

          return (
            <Fragment key={`${item.href ?? "current"}-${item.label}`}>
              <li aria-hidden="true">/</li>
              <li>
                {item.href && !isCurrent ? (
                  <Link href={item.href} className="hover:text-foreground">
                    {item.label}
                  </Link>
                ) : (
                  <span aria-current={isCurrent ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
