# Build 08 — Widget Deployment

> Part of [Search Configuration & Widget Deployment](../../README.md) — the partner-facing course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).

## At a glance

| | |
|---|---|
| **Capability** | Style a widget with `csspath` CSS, ship a local no-proxy quick test, vibe-code a minimal production proxy backend, and turn on Synchronized configuration so a dashboard edit reaches an already-embedded widget live |
| **Tier mapped to** | Tier 1 & 4 |
| **Prerequisite** | [Build 07 — Widget Configuration](../build-07-widget-configuration/) |
| **Estimated effort** | 2.5 hours focused |

## Start here

1. **[lesson.md](1-lesson.md)** — `csspath` styling and the `!important` gotcha, the no-proxy quick test recap, the production proxy pattern, and Synchronized configuration end to end.
2. **[walkthrough.md](2-walkthrough.md)** — style a Build 07 widget, deploy it locally with no proxy, vibe-code a minimal proxy backend and re-point the widget at it, then enable Synchronized configuration and prove a dashboard edit lands live.
3. **[quiz.md](3-quiz.md)** — 5 multiple-choice.

## What you can do after this Build

- Inject custom CSS into a widget via the `csspath` attribute, and know when `!important` is required to override an already-styled internal element.
- Ship a quick local demo with no proxy and state precisely when that's acceptable (sandbox/demo) and when it isn't (anything with a real customer's traffic).
- Vibe-code a minimal proxy backend that injects a service-account key server-side, and re-point a widget's endpoint at it so the browser never holds the key — the one build in this course with real vibe-coding instead of dashboard-only work.
- Enable Synchronized configuration on a widget's embed snippet and explain, precisely, what it does: the generated snippet references the KB's stored configuration live, so a later change to that configuration's Search, Generative Answer, Result Display, or Routing settings shows up in the already-embedded widget on next load — no new snippet, no redeploy.
- Use the dashboard's own widget preview to verify a configuration change before touching a deployed page.

## See also

- Parent: [Search Configuration & Widget Deployment](../../README.md)
- Previous: [Build 07 — Widget Configuration](../build-07-widget-configuration/)
- Next: [Build 09 — Capstone](../build-09-capstone/)
