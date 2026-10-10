---
name: sdd-explore
description: Use when the user asks about their project with .docs/sdd/ — how something works, why, whether something can be done, where a change would go, how to approach it («¿cómo funciona…?», «¿se puede…?», «no lo pillo», «¿cómo enfocarías…?», «¿qué hacemos ahora?») — without starting work. Not for a change of any size (sdd-propose), planning without doing (sdd-roadmap) or investigating a failure (superpowers:systematic-debugging).
argument-hint: "<pregunta>"
---

# sdd-explore

## Overview

The **anti-lane**: ask, understand or think **with the project's context loaded**, without producing artifacts. No spec, plan, branch or closing. Its value is twofold: **answers anchored in the anchor documents**, not in assumptions, and **the discipline of not over-triggering** the process for what was only a question. Write everything the user reads in their language, skill announcements included.

Unlike Gate 1 of `sdd-propose`, here **the question IS the statement**: exploring the code (semble, Grep, Read) is allowed from the start, as far as the question needs.

## How it works (light, no gates)

1. **Context proportional to the question** — read the relevant anchor documents (`mission`, `constitution`, `tech-stack`, `roadmap`, `architecture`, `capabilities/<capability>`, minutes in `releases/`) before answering, and the code if the question needs it. If the question is about behavior and `capabilities/` exists, pick the capability with `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" capability index --path .docs/sdd` before opening any, and read the one its purpose points to. Proportion: a structure question reads `architecture` and the code; a «¿qué hacemos ahora?» reads `roadmap` and the minutes. **Always tell what the doc says from what you infer.**
2. **Pick the mode:**
   - **Understand / explain** («¿por qué…?», «¿dónde tocaría…?», «¿esto cómo va?») → read and answer. **No interrogation**: grilling a one-off question annoys as much as over-triggering.
   - **Probe / test feasibility** («¿se puede…?», «pruébalo rápido», output = an answer) → explore and try what you need, but everything you build is **throwaway and labeled so**; the output is a recommendation in the conversation. Nothing persists: no spec folder, no branch, no kept code.
   - **Think / structure / stress-test a direction** («¿cómo enfocarías X?», «pensémoslo bien») → `sdd-grilling` (invoke it with `Skill`; no artifacts, not tied to SDD). **NEVER `superpowers:brainstorming`**: it is the engine that builds features and ends in spec → plan → implementation; applied to a question, it turns it into what it wasn't.
3. **Zero artifacts by default** — no spec folder, no branch, no code touched, no editing `roadmap` or docs «on the way». The answer lives in the conversation.
4. **Optional durable output (with approval)** — if the question uncovers an outdated anchor document or produces a decision worth recording, **propose it** and wait for the user's OK; only then write it, in the document it belongs to. Updating a doc **is not** «taking the chance to leave it done».
5. **Hand-off when it becomes work** — if the conversation asks to really do it, or to leave the evidence (a table of measurements), **say so and move to the lane**: a change of any size → `sdd-propose`, which classifies it; planning, adding to the roadmap or preparing a release → `sdd-roadmap`; investigating a failure → `superpowers:systematic-debugging`. The destination lane **gates and assigns the id**. Explore **doesn't** do the work itself.

## Red flags — STOP, this is no longer exploring

- You're about to create a folder in `.docs/sdd/specs/` (or a `patch.md`, or a branch) from explore.
- You're **reproducing a lane by hand** (copying a spec's or a patch's naming) instead of invoking its skill.
- You're about to write a **ticket id you made up** because «it's the next free one».
- You're about to edit `roadmap`, `changelog` or an anchor document without the user's approval.
- You launched an interrogation (`sdd-grilling`) at a question that was answered by reading and answering.
- You reached for `brainstorming` «just to think it through».

| Rationalization | Reality |
| --- | --- |
| «They ask me to "fix it" directly, so I create the `patch.md`» | «Fix it» triggers the hand-off, not permission to build the artifact. Move to the lane, which gates the root cause and the id. |
| «I pick the next free ticket id and mark it tentative» | Explore can **compute and propose** the next id with `sdd id next`, but doesn't reserve it or write it in any artifact: reserving belongs to the lane. |
| «I reproduce the naming convention by hand, I know it» | Reproducing a lane by hand skips its gates. If it's work, invoke the lane; if not, there's no artifact. |
| «Since I looked at the roadmap and it's outdated, I update it on the way» | Durable output is proposed and approved. Editing «on the way» is exactly what explore doesn't do. |
| «To structure this I use brainstorming» | Brainstorming builds features (it ends in a spec). To structure or stress-test a direction without artifacts: `sdd-grilling`. |
| «A probe, even a quick one, is already implementing: I won't touch code, I send it to the feature lane» | Probing isn't implementing. «Zero artifacts» forbids what persists, not the throwaway test that answers the question. Refusing to probe and opening a feature is over-triggering. |
