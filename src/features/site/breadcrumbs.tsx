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
}: {
  items: BreadcrumbItem[];
  homeLabel?: string;
}) {
  return (
    <nav
      aria-label={homeLabel === "Главная" ? "Хлебные крошки" : "Breadcrumbs"}
      className="text-muted-foreground font-mono text-sm"
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link href="/" className="hover:text-foreground">
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
