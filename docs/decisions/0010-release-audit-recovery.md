# ADR 0010: Recover the dependency gate for the client article release

## Context

The 2026-10-12 publication attempt found the main dependency graph failing
`pnpm audit --audit-level high`. These findings also explain the pre-existing
quality-job failure in the Renovate runs. Publishing the approved articles
requires the repository's existing CI gate to pass.

## Decision

- Upgrade Next and its lint plugin from 16.3.5 to the patched 16.3.8 release.
  Keep the resolved Sentry 10.75.2 and shadcn 4.21.0 versions already used by
  main; do not introduce a framework minor upgrade or downgrade those packages.
- Refresh the affected transitive ranges: sharp 0.35.5, source-map-js 1.2.2
  and the MCP SDK 1.32.1 resolve without new overrides.
- Override handlebars within its existing major to 4.7.10. The latest
  eslint-plugin-boundaries 7.2.0 still pins the vulnerable 4.7.9 release.
- Override only `get-uri>basic-ftp` to 6.2.3. The affected paths are dev-only
  Lighthouse proxy dependencies; get-uri's latest registry release still
  requests basic-ftp 5.x. The installed get-uri 6.0.5 calls Client access,
  lastMod, list, downloadTo and close; those methods were verified against the
  resolved 6.2.3 module. The 6.0 breaking change rejects separate transfer hosts
  by default, and this project's Lighthouse collection uses HTTP localhost.
- Temporarily ignore only GHSA-vfj7-8cjw-p6xm. The registry's latest braces
  release is 3.0.3; the audit's stated patched range (>=3.0.4) has no published
  version available. All five findings are marked dev-only, through lint or
  shadcn tools. Their glob patterns come from repository configuration; no
  application entry point accepts request-supplied brace patterns.

Existing extract-zip exceptions remain unchanged. No blanket severity
suppression or release-age bypass is introduced. Remove the braces exception
once a patch is published; remove overrides when upstream ranges adopt fixes.

## Sources and verification

- [Next ImageResponse advisory](https://github.com/advisories/GHSA-vcvr-r3jv-pc5j)
  and [image-optimisation advisory](https://github.com/advisories/GHSA-cjq9-62q9-8jv4).
- [Sharp advisory](https://github.com/advisories/GHSA-wq5f-xc86-pv6w),
  [source-map-js advisory](https://github.com/advisories/GHSA-68fv-2mgg-jv7q),
  [MCP SDK advisory](https://github.com/advisories/GHSA-6qxp-vccf-f47h),
  [Handlebars advisory](https://github.com/advisories/GHSA-8r5x-fm3f-whwj).
- [Basic FTP 6.0 release notes](https://github.com/patrickjuchli/basic-ftp/releases/tag/v6.0.0)
  and [patched releases](https://github.com/patrickjuchli/basic-ftp/releases).
- [Braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), registry
  checks with `pnpm view braces version` (`3.0.3`) and dependency checks for
  eslint-plugin-boundaries/get-uri in the current session.

After resolution, audit exits 0: `Severity: 2 low | 1 moderate | 3 high (3 ignored)`.
The three ignored findings are the two documented extract-zip advisories and
the dev-only braces advisory above. Full release gates and Lighthouse CI remain
required before merge.

## Status

`accepted` — routine gate recovery within the user's explicit autonomous
publication instruction.
