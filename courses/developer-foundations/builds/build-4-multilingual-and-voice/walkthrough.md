# Build 4 — Walkthrough: Multilingual & Voice Switching

> Estimated time: 1.5 hours focused. Read the [lesson](lesson.md) first.

## Goal

Extend the Build 3 chat with three query-prefix levers: language, segment, resource scope. Demo each lever flipping the answer in real time.

## 1. Open the Build 3 project (5 min)

```bash
cd build-3-chat
npm run dev
```

Confirm the Build 3 chat still works. You'll layer onto it.

## 2. Vibe-code the prefix builder (15 min)

Open your AI assistant:

```
In src/lib/buildPrefix.ts, export a function:

buildPrefix(opts: { language?: string; segment?: string; resourceTitle?: string }): string

That returns:
- "Respond in {language}: " if language is set and not "English"
- "The user is a {segment}. Frame your answer accordingly. " if segment is set
- 'Regarding the resource titled "{resourceTitle}": ' if resourceTitle is set
- The three concatenated in order (empty strings dropped)

Return empty string if no opts set.
```

Save the prompt as `prompt-log.md`.

## 3. Add UI controls (30 min)

Brief the AI:

```
Update MultiSurfaceChat.tsx to add three new UI controls above the chat input:

1. Language dropdown: ["English", "Spanish", "French", "German", "Japanese", "Mandarin"]
   - State: useState<string>("English")
2. Segment radio: 3 options chosen for my corpus (you pick reasonable defaults
   for an outdoor-retail KB: "Weekend Adventurer", "Thru-Hiker", "Alpine Pro")
   - State: useState<string>("Weekend Adventurer")
3. Resource context: optional text input
   - State: useState<string>("")

Layout: three controls in a horizontal row above the existing persona toggle.

In the submit handler, build the prefix using buildPrefix({ language, segment, resourceTitle }),
prepend it to the raw query, then call streamAsk(finalQuery, promptConfig).

Don't remove anything from the existing component. Just add.
```

## 4. Test each lever in isolation (20 min)

Run the dev server. Test:

**Language:**
- Same query: "What should I buy?"
- English: get the English answer.
- French: get the French answer.
- Japanese: get the Japanese answer.

**Segment:**
- Same query, language = English.
- Weekend Adventurer: friendly, beginner framing.
- Alpine Pro: technical, expert framing.

**Resource scope:**
- Set Resource Context to the title of a specific document in your KB.
- Ask "summarise this".
- Confirm the model focuses on that resource (will reference paragraphs from it disproportionately).

**Combined:**
- Set Language=Spanish, Segment=Alpine Pro, Resource=<doc title>.
- Ask a question.
- Answer should be in Spanish, framed for alpine pros, focused on the named resource.

If any lever doesn't work, brief the AI: *"The {language|segment|scope} lever isn't affecting the answer. Verify the prefix is being passed to streamAsk and not just concatenated into the prompt config."*

## 5. Wire the language list as a prop / config (10 min)

Brief the AI:

```
Make the language list configurable via a prop on MultiSurfaceChat. Default to the
six-language list. The brand team should be able to add or remove languages without
modifying component code.
```

This is the customer-brand-team handoff pattern again — language list is config, not code.

## 6. Demo recording (10 min)

Record yourself:

1. (30 sec) "Three query-prefix levers, three customer questions, no new infrastructure."
2. (60 sec) Language flip — same query, English then French.
3. (60 sec) Segment flip — same query, Weekend Adventurer then Alpine Pro.
4. (45 sec) Resource scope — ask "summarise this" with a specific document title.
5. (45 sec) Combined — Spanish + Alpine Pro + named resource. One answer, three prefixes.
6. (15 sec) "Tier 2 closed. Cost: 15 lines of code, vibe-coded in 60 minutes."

Upload to `#build-clinic-submissions`.

## Verification checklist

- [ ] `buildPrefix.ts` working.
- [ ] Language dropdown switches answer language in 3+ languages.
- [ ] Segment radio changes answer framing.
- [ ] Resource scope biases the model toward the named resource.
- [ ] All three combine cleanly when set together.
- [ ] Language list is config, not hardcoded.
- [ ] `prompt-log.md` saved.
- [ ] Recording submitted.

## Next

[Build 5 — Structured Outputs](../build-5-structured-outputs/) — the most important Build in the course. `answer_json_schema` and the moat-building tier.
