# Vibe-Coding Guide for Developer Foundations

> Read this **before** starting Build 0. It's the mental model that makes the rest of the course work — especially if you're a citizen developer, starter developer, or anyone who's never run `npm install` in your life.

## Who this course is for

You don't need to be a software engineer. You need to be **able to read, follow step-by-step instructions, and ask an AI for help when something doesn't work**. That's it.

Many partners completing this course are:

- Solution engineers / pre-sales — comfortable in demos, less so in code editors.
- Product managers and BAs — fluent in customer problems, not fluent in TypeScript.
- Sales engineers and partner SEs — can sketch architectures but haven't shipped React in years.
- Career-switchers and citizen developers — first technical course they've taken.

This course is built so all of you can finish it. The trick: **you don't write the code**. Your AI assistant does. You direct it, verify it, ship it.

## What "vibe coding" actually means

Vibe coding is **letting an AI write the code while you stay in control of the judgement calls**.

Your job:

1. **Understand what you're trying to build** — what problem the customer has and which ARAG primitive solves it.
2. **Tell the AI clearly what you want** — the endpoint, what goes in, what comes out, how you'll verify it works.
3. **Read the output** — does the code do what you asked? Does it actually run? Does it use the right API call?
4. **Fix things by talking** — if something doesn't work, paste the error into the AI and tell it what happened. The AI fixes it. You re-run.

You are **the boss**. The AI is **the junior engineer who never gets tired**. The course is set up to make you a great boss.

## What you need before you start

| Thing | What it is | How to get it |
|---|---|---|
| A terminal | The black-window thing where you type commands. macOS: **Terminal** app. Windows: **PowerShell** or **WSL**. Linux: you know. | Already on your machine — open it. |
| Node.js (a JavaScript runtime) | What runs the code you'll generate | Download from [nodejs.org](https://nodejs.org) — pick the LTS version. Run the installer. Done. |
| Git | A way to save and share code | macOS: comes with Xcode tools. Windows: [git-scm.com/download](https://git-scm.com/download). |
| An AI coding assistant | The thing that writes the code for you | Pick one: **Claude Code** (CLI), **Cursor** (editor), **GitHub Copilot** (autocomplete), **ChatGPT** or **Claude.ai** (web). |
| A code editor | Where you read and tweak generated code | **VS Code** is free and the easiest: [code.visualstudio.com](https://code.visualstudio.com). Cursor is VS Code with AI baked in. |
| A Progress ARAG sandbox account | Your KB and credentials | Provided by your partner manager. If you don't have it, ask in `#partner-onboarding`. |

If you've never used a terminal: **don't panic**. You'll type maybe 5 commands per Build, and we'll explain every one. If a command confuses you, paste it into your AI assistant and ask *"what does this command do?"* — that's a perfectly legitimate move in this course.

## Pick your AI assistant

Any of these work. Pick one, get comfortable with it, stick with it through the course.

| Tool | Best for | What it feels like | Free? |
|---|---|---|---|
| **Claude Code** | Whole-project tasks; running terminal commands | A terminal chat where Claude can read your files and run commands | Subscription |
| **Cursor** | Editing code in a familiar editor | VS Code with AI baked in; press Cmd+K and tell it what to do | Free tier + paid |
| **GitHub Copilot** | Inline autocomplete as you type | Suggestions appear as ghost text in your editor | Subscription (free for students) |
| **ChatGPT / Claude.ai (web)** | Asking questions, brainstorming, debugging | A web chat — copy-paste code in and out | Free tier + paid |

If you're brand-new to all of this, the friendliest combo is **Cursor + Claude.ai (web)**. Cursor for editing; Claude.ai for the "explain this to me" conversations.

The Builds work with all of them. Where a walkthrough says "ask your AI to do X" — use whichever tool you picked.

## The four-step loop (this is the whole course)

Every walkthrough in this course follows the same shape. Get used to it now.

### 1. Brief

Open your AI. Give it:

- **What you want built** (one sentence).
- **What ARAG endpoint to call** (we tell you which one in every Build).
- **What goes in and what comes out** (we give you the body shape and response shape).
- **How you'll know it works** (e.g., "I should see a streaming answer in the terminal").

A good brief is **specific**. Don't say "write me an ARAG client." Say "write me a Node.js script `ask.mjs` that calls `POST /v1/kb/{kbId}/ask` with this header and this body, parses the NDJSON stream like so, and prints answer text token-by-token."

The course walkthroughs give you the exact brief text. Copy it. Paste it into your AI.

### 2. Read

The AI produces code. **Read it before you run it.** Three checks, every time:

- Does it use plain `fetch`, not some made-up SDK? (See "Failure modes" below.)
- Does the auth header say `X-NUCLIA-SERVICEACCOUNT`? (Not `Authorization`.)
- Does the URL look like `{NUCLIA_API_URL}/kb/{kbId}/<endpoint>`?

If yes, run it. If not, tell the AI what's wrong and let it fix it.

### 3. Run

Type the command. Look at the output. We'll tell you what to expect — if the output matches, great. If not, you've found a bug.

### 4. Iterate

When something doesn't work:

- **Copy the entire error message** out of the terminal.
- **Paste it into your AI** with a one-line "this is what I expected vs what I got."
- The AI explains the error and proposes a fix.
- Apply the fix. Re-run.

This loop — brief, read, run, iterate — is **every Build in the course**. By Build 3 it'll be muscle memory.

## What the AI handles for you (the citizen-developer principle)

You will *not* hand-roll dev tooling in this course. The AI does it.

Specifically — anything in the **scaffolding / dependencies / config-file** category is the AI's job, not yours. You don't write the commands; you don't memorise the syntax; you don't open `tailwind.config.js` to edit a JSON array. You paste a brief that says *"install and configure X as part of your work,"* and the AI handles it. Examples that come up repeatedly across the Builds:

| Job | Who does it | How it shows up in a Build |
|---|---|---|
| Install npm packages (e.g. `react-force-graph-2d`, `dotenv`, anything else) | The AI | A line in the brief: *"Install <package> as a dependency before writing the component."* |
| Set up Tailwind CSS (install, init, edit `tailwind.config.js`, edit `src/index.css`) | The AI | A paragraph in the brief: *"Set up Tailwind CSS in this project first — install, init, configure content paths, replace `src/index.css` with the three @tailwind directives."* |
| Create folders that don't exist yet (`src/lib/`, `src/components/`, etc.) | The AI | A line in the brief: *"Create the folder if it doesn't exist."* |
| Wire env vars into the build (Vite's `import.meta.env`, etc.) | The AI | Specified in the brief alongside the API call. |
| Write TypeScript types, JSON Schemas, response interfaces | The AI | The brief says "Full TypeScript types." |

**How the two AI tool families handle this:**

- **Claude Code / Cursor** can run shell commands and edit files directly. Paste the brief and they perform the install + config end-to-end. You watch.
- **ChatGPT / Claude.ai (web)** can't touch your machine. They will give you **the commands to run and the file contents to paste** — copy them across one at a time, then come back to the chat and say *"done, ran fine"* (or paste any error). Either way you're not designing the command line.

What you *do* type by hand, every Build:

- `npm create vite@latest ...` — the project-scaffolding command in Step 1 of each project Build. Three commands total per Build (create, `cd`, `npm install`).
- `npm run dev` — to start the dev server and see your work.
- `git` commands when you save your work.

That's the floor. Everything else — dependency installs, config edits, file scaffolding — is the AI's job. If a walkthrough ever has you editing `tailwind.config.js` or running `npm install -D ...` by hand, **that's a bug**. Paste the step into your AI and ask it to do that work for you instead.

## Four AI failure modes to watch for

These are the four ways AI assistants reliably go wrong on ARAG tasks. Spot them every time.

### 1. The AI invents an SDK that doesn't exist

If your AI writes `import { Nuclia } from 'nuclia'` or `from nuclia import Client` — **stop**. There's no first-party Nuclia npm or pip package. ARAG is HTTP. Tell the AI:

> "There's no Nuclia SDK. Rewrite this using plain `fetch` against the API documented in my brief."

### 2. The AI uses the wrong auth header

It's `X-NUCLIA-SERVICEACCOUNT: Bearer <jwt>`. Not `Authorization`. Not `X-API-Key`. Not a session cookie. If you see anything else, tell the AI to fix it.

### 3. The AI assumes the wrong response shape

`/find` returns `{ resources: {...}, best_matches: [...] }`. `/ask` (streaming) returns NDJSON of `{item: {type, ...}}` per line. The AI's "memory" of these shapes is fuzzy — it'll sometimes invent fields. If the code crashes on a missing field, paste the actual response into the AI and tell it to fix the parser.

### 4. The AI forgets `additionalProperties: false`

In Build 5 (Structured Outputs) we use JSON Schema constraints. Every `object` schema needs `additionalProperties: false` at every nesting level. The AI forgets this about 70% of the time. We've built a helper that auto-injects it; we cover this in Build 5.

## Getting unstuck (the universal pattern)

When something doesn't work and you don't know why, follow this script:

1. **Stop fiddling.** Don't change three things at once.
2. **Copy the entire error message and the command that produced it.** Both.
3. **Paste them into your AI** with: *"I ran `<command>` and got `<error>`. I expected `<what you expected>`. What's wrong and how do I fix it?"*
4. **Read what the AI says before changing anything.** It usually explains the problem in plain English.
5. **Apply the suggested fix.** Re-run.
6. **If it still fails**, paste the new error and repeat.

Don't try to be clever. Don't try to memorise commands. Don't apologise for asking the AI "stupid" questions. The AI doesn't get bored. It doesn't judge. Use it.

## Verification habits (build these from Build 0)

Three habits that separate partners who ship from partners who get stuck:

- **Always test endpoints with `curl` (or Postman) first**, before asking the AI to wrap them in code. If `curl` works but the AI's code doesn't, you know the AI's code is wrong (not your KB).
- **Always read the AI's code** before running it. Three-check pattern above.
- **Always save the prompt that produced working code.** We ask for `prompt-log.md` in each Build. It's your institutional knowledge. Two months later you'll need the same component and the prompt is what reproduces it.

## What's not vibe-codeable

A few things you do yourself, by hand. AI doesn't help:

- **Provisioning a KB** in the Nuclia dashboard — that's a dashboard click, 5 minutes.
- **Ingesting documents** — drag-and-drop in the dashboard.
- **Configuring labelsets** — dashboard UI.
- **Picking the BYO-LLM endpoint** — dashboard config.
- **Authoring the words inside a JSON Schema** (the field names, the descriptions) — you write the schema; the AI implements the code that uses it.
- **Authoring `callToAction` and `searchResultDisplay` copy** — the content team writes it (with AI assistance for ideation, but the brand voice is theirs).

The distinction: **structure is yours; keystrokes are the AI's.**

## What about production code?

The walkthroughs produce **demo-grade** code — enough to verify behaviour and submit for the reviewer to sign off. Production code (the capstone, customer engagements) needs more: auth proxying through your backend, observability, error handling, rate-limit-aware clients, BYO-LLM routing. All covered in Build 11 (Production Readiness).

To productionise demo-grade code: ask the AI *"add error handling, retry logic with exponential backoff, structured logging, and a 15-second timeout to this code."* The AI knows how. You still verify it.

## TL;DR

- You are the boss. The AI is the junior engineer.
- Every Build follows: **brief → read → run → iterate**.
- When stuck: **paste the error into your AI and ask**. There's no penalty for not knowing.
- Catch the four AI failure modes (fake SDK, wrong header, wrong shape, missing `additionalProperties`).
- Save your prompts.

Now go to [Build 0](builds/build-00-hello-arag/).
