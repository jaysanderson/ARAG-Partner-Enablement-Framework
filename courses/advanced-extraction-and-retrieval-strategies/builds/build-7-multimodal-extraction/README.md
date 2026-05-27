# Build 7 — Multimodal Extraction

> Part of [Advanced Extraction & Retrieval Strategies](../../README.md) — the AE&RS Specialist course in the [Progress Agentic RAG Partner Enablement Framework](../../../../README.md).
>
> **Why this Build matters:** Enterprise corpora are 60–80% video, audio, scanned PDFs, and images. Partners who can only do text retrieval are leaving the majority of customer value on the table. This Build unlocks media, training, broadcast, healthcare-imaging, and field-service customers.

## At a glance

| | |
|---|---|
| **Owning track(s)** | Solution (Should), Deliver (Must) |
| **Prerequisite** | [Build 6 — Data-augmentation agents at depth](../build-6-data-augmentation-agents/) |
| **Estimated effort** | 12–16 hours focused |

## What the partner does

Ingests a video corpus (10+ videos) and a scanned-PDF corpus (10+ documents). Verifies utterance extraction with timestamp anchoring (`data.files.*.extracted.metadata.paragraphs[]` with `start_seconds[0]` and `end_seconds[0]`). Wires transcript-sync UI (click transcript → seek video; video timeupdate → highlight active paragraph). Builds a search experience that returns video-timestamp deep links. Documents audio diarization (speaker boundaries, where supported). Confirms OCR pipeline handles scanned PDFs. Verifies image classification (per-paragraph labels). Demonstrates DASH MPD streaming with the auth-injecting `RequestModifier` pattern.

## Pass rubric

1. Video utterance extraction working with timestamps verifiable in `/find` responses.
2. Scanned PDF retrieval working (OCR layer demonstrated).
3. Transcript ↔ video sync working end-to-end.
4. Audio diarization documented.
5. Hit rate > 70% on a 20-query golden set of timestamp queries ("find the moment X is mentioned").
6. Recorded demo deep-linking to a specific second of a video resource.

## Asset delivered

Multimodal extraction recipe book (per-content-type playbook covering ingest, verification, retrieval, and deep-link UX).

## Reference reading

-

---

## Workspace

This folder is the working space for everything supporting Build 7. Drop materials here as they are built:

- `walkthrough.md` — per-modality (video / audio / scanned PDF / image) walkthrough
- `recipe-book.md` — multimodal extraction recipe book deliverable
- `golden-set-timestamps.md` — timestamp-query golden set
- `dash-player/` — DASH player  with auth injection
- `slides/` — slide deck
- `verification.md` — reviewer checklist

## See also

- Parent course: [Advanced Extraction & Retrieval Strategies](../../README.md)
- Previous build: [Build 6 — Data-augmentation agents at depth](../build-6-data-augmentation-agents/)
- Next build: [Build 8 — Composite & agentic retrieval patterns](../build-8-composite-agentic-patterns/)
