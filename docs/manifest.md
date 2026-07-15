# Product Manifest

This file is your project's identity card — the one doc every agent session
reads first (see `CLAUDE.md`/`AGENTS.md`). It starts empty on purpose: the
`/liftoff` skill fills it in during onboarding. Every unfilled field is marked
`<!-- liftoff:fill -->` right after it, so a skill can find what's left
programmatically (`grep liftoff:fill docs/manifest.md`) — remove the marker
on the same line once you fill the field, don't delete the heading.

## Product name

<!-- liftoff:fill -->

## One-liner

What this product does, in one sentence a stranger would understand.

<!-- liftoff:fill -->

## Target user

Who this is for — one concrete persona, not "everyone."

<!-- liftoff:fill -->

## Domain entities

The core nouns of the product (e.g. "trips, days, waypoints, gear lists").
These map to `src/db/schema.ts` tables once Step 4 of `/liftoff` runs.

<!-- liftoff:fill -->

## Current phase

One of: `idea` / `building v1` / `live` / `paused`.

<!-- liftoff:fill -->

## Chat language

The language the agent speaks with you in chat (artifacts stay English).
To change it later, edit the value below (or just ask the agent to switch).

Russian

## Key URLs

| What       | URL                   |
| ---------- | --------------------- |
| Production | <!-- liftoff:fill --> |
| Staging    | <!-- liftoff:fill --> |
| Repo       | <!-- liftoff:fill --> |

## Status

This manifest still has unfilled fields — run `/liftoff` to complete
onboarding. Once every field above is filled, this line should read: "Manifest
complete — see `docs/roadmap.md` for what's next."
