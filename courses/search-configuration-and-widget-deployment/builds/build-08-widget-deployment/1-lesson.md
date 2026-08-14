# Build 08 — Lesson: Widget Deployment

> Read time: 12 minutes.

## Why this is in the course

Build 07 gave you the full option spread of the widget configurator — every field you can set through the dashboard's panels. None of that answers the three questions a customer's engineering team actually asks before go-live: *"can it match our brand," "how do we ship this without exposing our API key," and "if we change something later, do we have to redeploy?"* This Build is the answer to all three, in order: CSS styling, a proxy, and Synchronized configuration.

It's also the one Build in this course that isn't dashboard-only. Everywhere else you change a dashboard option and read the API-equivalent request it produces. Here you vibe-code a small backend — the same discipline Foundations trained, applied to one narrow, high-stakes surface: keeping a service-account key off the browser.

Three deployment modes, in the order you'll build them:

| Mode | Where the JWT/key lives | Right for |
|---|---|---|
| No-proxy quick test | Baked into the generated snippet, in the page source | Local sandbox/demo only — a file only you load |
| Production proxy | Server-side only, injected by your backend | Any real customer traffic, any hosted page |
| Synchronized configuration | Orthogonal to the above — a property of *what the snippet references*, not where the key lives | Any deployment where the underlying configuration will change after go-live |

The first two are about **where the credential lives**. The third is about **whether the snippet is a frozen snapshot or a live reference**. A production deployment typically wants both a proxy and Synchronized configuration on at once — they solve different problems and stack cleanly.

## Styling: `csspath` and the `!important` gotcha

The configurator's display options (Build 07) cover layout, theme, and the built-in option set. For anything past that — brand fonts, brand colours, spacing that matches a customer's existing site — you inject your own CSS.

The mechanism is one attribute on the widget tag itself: **`csspath`**, pointing to a CSS file URL. There's no `<link rel="stylesheet">` involved — the widget reads the file at `csspath` and applies it inside its own shadow-rendered markup.

```html
<nuclia-search-bar
  knowledgebox="YOUR_KB_UUID"
  zone="aws-eu-1"
  apikey="YOUR_SERVICE_ACCOUNT_JWT"
  csspath="/aurora-widget-theme.css"
></nuclia-search-bar>
```

> **Important.** If the CSS property you're trying to set is already defined inside the widget, your rule only wins if you use `!important`. The widget ships with its own baseline styles; a plain CSS rule in your `csspath` file loses to that baseline on specificity or declaration order. Force the override:
>
> ```css
> /* aurora-widget-theme.css */
> .thumbnail-container {
>   width: 220px !important;
> }
> ```

> **Gotcha.** The single most common "my CSS does nothing" report from partners is exactly this — a rule that targets a real element, is spelled correctly, is definitely loading, and still doesn't apply, because it's missing `!important` against an internal default. Before you assume the selector is wrong or the file isn't loading, add `!important` and reload.

## Step 1 of deployment: the no-proxy quick test

You already did this once, in [Developer Foundations Build 2](../../../developer-foundations/builds/build-02-drop-in-widgets/) — a local `index.html` on your Desktop, the configurator's generated snippet pasted in, opened by double-click. No hosting, no deploy, no public URL. Build 08 reuses that exact pattern rather than re-teaching it; if any of the last sentence is unfamiliar, go re-read Foundations Build 2 Steps 1 and 6 before continuing.

The one thing worth restating precisely, because it's the hinge this whole Build turns on:

**When the no-proxy pattern is fine:** a local file on your own machine, a sandbox Knowledge Box, a demo you're driving yourself. The service-account JWT embedded directly in the generated snippet is fine for this — sandbox/demo only, never production. Nobody but you ever loads the page.

**When it isn't fine:** the moment that HTML file is reachable by anyone who isn't you — hosted, shared, put in front of a real customer's traffic — the JWT in the page source is a credential anyone can read from "View Source" and reuse against your Knowledge Box. That's the line. It has nothing to do with how polished the page looks and everything to do with who can load it.

## Step 2 of deployment: the production proxy

[Foundations Build 11](../../../developer-foundations/builds/build-11-production-readiness/) states the non-negotiable production rule: ARAG calls proxy through the partner's backend so the JWT never reaches client-side code. Build 08 is where you actually build that proxy, at the minimum scope needed to make a widget production-safe — not the fuller production-readiness conversation (residency, BYO-LLM, rate limits) Build 11 covers; that's out of scope here.

The mechanism, confirmed straight from the docs: **behind a proxy**, you keep your Knowledge Box's real API key server-side. The proxy injects the key into the request header before forwarding to ARAG, so the call isn't rejected — but the key is never present in your frontend code. The scenario this solves: a client-facing application where exposing your ARAG API key is not an option. Users' requests hit your backend with no key attached; your backend attaches the real key and talks to ARAG on their behalf.

Concretely, for a widget deployment, the proxy is a small backend endpoint that:

1. Receives the widget's request with **no** API key attached.
2. Injects the real service-account key server-side.
3. Forwards the request to ARAG.
4. Returns ARAG's response back to the widget.

Then you point the widget's endpoint attribute at your proxy instead of directly at ARAG, so the browser never holds the key at all — there's nothing in the page source to leak, because the key was never shipped to the page in the first place.

Brief your AI assistant per this course's parent Foundations conventions: no ARAG SDK import, plain `fetch` server-side, the service-account header set only in backend code:

```
X-NUCLIA-SERVICEACCOUNT: Bearer <jwt>
```

Any simple stack works — a small Node/Express endpoint is the easiest starting point, but the shape is the same regardless of language: one route, no key on the client, `fetch` on the server.

## Step 3 of deployment: Synchronized configuration

The embed dialog — the same **Code panel** you've used since Foundations Build 2 — has a toggle labelled **Synchronized configuration**. Turning it on changes what the generated snippet actually contains.

With it **off**, the snippet bakes a frozen snapshot of your current dashboard settings straight into the widget tag's attributes. Change something later on the Search tab, the Generative Answer tab, Result Display, or Routing, and the already-deployed widget keeps running the old snapshot — you'd have to regenerate the snippet and repaste it wherever it's embedded.

With it **on**, the snippet instead references the Knowledge Box's stored, persisted configuration — the same named `search_configuration` object from [Build 00](../build-00-named-search-configurations/), which Progress's own Persistent Configuration feature keeps stored for KB-Admins so every caller reads the same live settings. A widget built this way doesn't carry a frozen copy of your settings — it carries a reference. Change the underlying configuration in the dashboard, and the next time the already-embedded widget loads, it reflects the change. No new snippet. No redeploy. No touching the page that's already live on a customer's site.

This is the payoff of the named-configuration pattern Build 00 introduced on day one of this course: the widget was always "just" a pointer at a stored configuration. Synchronized configuration is what makes that pointer live instead of frozen.

> **Don't confuse this with the KB's Synchronize page.** The dashboard has a separate **Synchronize** section for pulling source documents in from cloud storage — Google Drive, SharePoint, S3, and similar connectors. That's an ingestion feature, nothing to do with widget configuration. Same word, two unrelated dashboard surfaces — worth knowing the difference so you don't go looking for widget sync settings in the ingestion tab.

## Verify fast: the dashboard's own preview

Before you wire up a proxy or paste a snippet anywhere, the dashboard lets you preview a widget and test its functionality directly, without embedding it in a standalone page at all. That's the fastest verification loop available to you — use it to confirm a CSS change rendered, a display option landed, or a filter behaves as expected, before you touch a deployed page at all.

It's especially useful for Synchronized configuration: after you change something on the underlying search configuration, use the dashboard preview first to confirm the change actually took effect on that configuration, before you go reload the separately-deployed widget to prove it propagated. Two checks, two different questions — did the configuration change save correctly, and did an already-embedded widget pick it up live.

## Common pitfalls

- **Forgetting `!important` and assuming the CSS file isn't loading.** Check the Network tab first — if the file loads with a 200, the CSS is fine, the specificity fight is what's losing.
- **Shipping the no-proxy pattern past a demo.** The line isn't "does it look production-ready" — it's "can anyone but me load this page." The moment the answer is yes, you need the proxy from Step 2.
- **A proxy that still trusts a client-supplied key.** If your backend route reads any key-shaped value from the incoming request instead of only from its own environment variables, you haven't actually removed the credential from the browser's reach — you've just moved where it's read from.
- **Copying the snippet before enabling Synchronized configuration.** The toggle only affects snippets generated after it's on. A snippet copied earlier is still the frozen kind, permanently, until you regenerate it.
- **Looking for widget sync settings on the Synchronize page.** Wrong feature — see the disambiguation note above.

## What's next

[Build 09 — Capstone](../build-09-capstone/) — deploy the Aurora Outfitters widget without a proxy, deploy it again behind one, and prove a dashboard configuration change reaches the already-embedded widget live. Everything in this Build, at capstone scale.
