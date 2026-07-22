# Blog content

Everything for one article lives together here:

```
src/content/blog/
  <slug>.mdx          ← the article (the ONLY thing the site renders)
  <slug>/             ← its companion assets (NOT rendered — see below)
    card.png          full-res cover source (web copy → public/blog/<slug>/card.jpg)
    vc.md dzen.md x.md  off-site adaptations for the coworker to publish
```

**Why `.md` and the `<slug>/` folders are safe here.** The loader
(`src/features/blog/articles.ts`) does a non-recursive `readdirSync` and keeps
only top-level files ending in `.mdx`. Everything else — `.md` files, this
README, and the `<slug>/` subfolders — is ignored: never a post, never a route,
never in the sitemap/RSS/llms.txt.

**Editorial standards & publishing flow:** `docs/rules/content.md`.
**Off-site distribution (who publishes what, per-platform framing):**
`docs/playbooks/distribution.md`.
**What to write next (semantic core → clusters → waves):**
`docs/content-plan.md`.

## Article map

Cover source is `<slug>/card.png` (web copy: `public/blog/<slug>/card.jpg`).
Off-site status — ✅ live · 📝 draft ready · — n/a · ✕ dropped. Coworker flips a
cell to ✅ with the posted URL (mirror of the matrix in `distribution.md`).

| slug                    | on site | vc.ru | Дзен | X (@groownow) |
| ----------------------- | ------- | ----- | ---- | ------------- |
| agents-ready-project    | ✅ live | ✅    | 📝   | 📝            |
| spec-driven-development | ✅ live | 📝    | 📝   | 📝            |
| github-spec-kit         | ✅ live | 📝    | 📝   | 📝            |
| agents-md-primer        | ✅ live | —     | 📝   | 📝            |
| cursor-rules            | ✅ live | —     | 📝   | 📝            |

Habr was dropped (see `distribution.md` → Dropped). X profile/brand assets live
in `docs/brand/`.
