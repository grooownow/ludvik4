import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { internationalWork } from "./international-content";

/** Two-per-row visual product cards shared by the EN home and /work. */
export function InternationalWorkGrid() {
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2">
      {internationalWork.map((item) => (
        <Link
          key={item.slug}
          href={(item.cardLink?.href ?? `/work/${item.slug}`) as Route}
          {...(item.cardLink?.newTab
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="border-border bg-card hover:border-primary/40 overflow-hidden rounded-2xl border transition-colors"
        >
          <Image
            src={item.image}
            alt={item.imageAlt}
            width={1200}
            height={675}
            sizes="(min-width: 640px) 480px, 100vw"
            className="aspect-video w-full object-cover object-top"
          />
          <div className="p-6">
            <p className="text-primary font-mono text-xs">{item.kind}</p>
            <h3 className="mt-2 text-xl font-bold">{item.title}</h3>
            <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
              {item.description}
            </p>
            {item.cardLink ? (
              <span className="sr-only"> (opens in a new tab)</span>
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
