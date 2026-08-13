# Blog content

Everything for one article lives together here:

```
src/content/blog/
  <slug>.mdx          ← the article (the ONLY thing the site renders)
  en/<slug>.mdx       ← English localization (EN build only)
  <slug>/             ← its companion assets (NOT rendered — see below)
    card.png          full-res cover source (web copy → public/blog/<slug>/card.jpg)
    vc.md dzen.md x.md  off-site adaptations for the coworker to publish
```

**Why `.md` and the `<slug>/` folders are safe here.** The loader
(`src/features/blog/articles.ts`) selects the build market, does a non-recursive
`readdirSync`, and keeps only files ending in `.mdx`. Everything else — `.md`
files, this README, and companion folders — is ignored. RU never walks `en/`;
EN never loads top-level RU articles.

**Editorial standards & publishing flow:** `docs/rules/content.md`.
**Off-site distribution (who publishes what, per-platform framing):**
`docs/playbooks/distribution.md`.
**What to write next (semantic core → clusters → waves):**
`docs/content-plan.md`.

## Article map

Cover source is `<slug>/card.png` (web copy: `public/blog/<slug>/card.jpg`).
Off-site status — ✅ live · 📝 draft ready · ⏳ waiting for platform quota · —
n/a · ✕ dropped. Coworker flips a cell to ✅ with the posted URL (mirror of the
matrix in `distribution.md`).

| slug                                        | on site  | vc.ru | Дзен | X (@groownow) |
| ------------------------------------------- | -------- | ----- | ---- | ------------- |
| agents-ready-project                        | ✅ live  | ✅    | 📝   | 📝            |
| agents-md-vs-claude-md-vs-cursor-rules      | ✅ live  | —     | —    | —             |
| spec-driven-development-vs-vibe-coding      | 📝 draft | —     | —    | —             |
| github-spec-kit-vs-application-skeleton     | 📝 draft | —     | —    | —             |
| spec-first-spec-anchored-spec-as-source     | 📝 draft | —     | —    | —             |
| cursor-rules-best-practices                 | 📝 draft | —     | —    | —             |
| spec-driven-development                     | ✅ live  | 📝    | 📝   | 📝            |
| github-spec-kit                             | ✅ live  | 📝    | 📝   | 📝            |
| agents-md-primer                            | ✅ live  | —     | 📝   | 📝            |
| cursor-rules                                | ✅ live  | —     | 📝   | 📝            |
| stoimost-lendinga-2026                      | ✅ live  | ⏳    | 📝   | —             |
| chto-podgotovit-pered-zakazom-lendinga      | ✅ live  | 📝    | 📝   | —             |
| avtomatizatsiya-obrabotki-zayavok           | ✅ live  | 📝    | 📝   | —             |
| ai-avtomatizatsiya-malogo-biznesa           | ✅ live  | 📝    | 📝   | —             |
| mvp-etapy-sroki-pervyy-reliz                | ✅ live  | 📝    | 📝   | —             |
| stoimost-razrabotki-mvp                     | ✅ live  | 📝    | 📝   | —             |
| lending-ili-mnogostranichnyy-sayt           | ✅ live  | 📝    | 📝   | —             |
| vnutrennee-veb-prilozhenie-dlya-biznesa     | ✅ live  | 📝    | 📝   | —             |
| lending-vs-tilda                            | ✅ live  | 📝    | 📝   | —             |
| mvp-ili-vnutrenniy-instrument               | ✅ live  | 📝    | 📝   | —             |
| no-code-avtomatizatsiya-ili-custom-workflow | ✅ live  | 📝    | 📝   | —             |

Habr was dropped (see `distribution.md` → Dropped). X profile/brand assets live
in `docs/brand/`.
