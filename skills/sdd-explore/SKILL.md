---
name: sdd-explore
description: Use when the user asks about their project with .docs/sdd/ — how something works, why, whether something can be done, where a change would go, how to approach it («¿cómo funciona…?», «¿se puede…?», «no lo pillo», «¿cómo enfocarías…?», «¿qué hacemos ahora?») — without starting work. Not for a change of any size (sdd-propose), planning without doing (sdd-roadmap) or fixing a failure (sdd-propose).
argument-hint: "<pregunta>"
---

# sdd-explore

## Overview

The **anti-lane**: ask, understand or think **with the project's context loaded**, without producing artifacts. No spec, plan, branch or closing. Its value is twofold: **answers anchored in the anchor documents**, not in assumptions, and **the discipline of not over-triggering** the process for what was only a question.
<!-- kit: incluye user-language -->

Unlike Gate 1 of `sdd-propose`, here **the question IS the statement**: exploring the code (semble, Grep, Read) is allowed from the start, as far as the question needs.

## How it works (light, no gates)

1. **Context proportional to the question** — read the relevant anchor documents (`PRODUCT.md`, `ROADMAP.md`, `steering/`, `capabilities/<capability>`, minutes in `releases/`) before answering, and the code if the question needs it. If the question is about behavior and `capabilities/` exists, pick the capability with `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" capability index --path .docs/sdd` before opening any, and read the one its purpose points to. Proportion: a structure question reads `architecture` and the code; a «¿qué hacemos ahora?» reads `ROADMAP.md` and the minutes. **Always tell what the doc says from what you infer.**
2. **Pick the mode:**
   - **Understand / explain** («¿por qué…?», «¿dónde tocaría…?», «¿esto cómo va?») → read and answer. **No interrogation**: grilling a one-off question annoys as much as over-triggering.
   - **Probe / test feasibility** («¿se puede…?», «pruébalo rápido», output = an answer) → explore and try what you need, but everything you build is **throwaway and labeled so**; the output is a recommendation in the conversation. Nothing persists: no spec folder, no branch, no kept code.
   - **Think / structure / stress-test a direction** («¿cómo enfocarías X?», «pensemos cómo…») → first thing: invoke `sdd-grilling` with `Skill`. Its interview covers the why, if neither the user nor the project says it, then the direction; at its stop, confirm the direction with one question. **NEVER superpowers' `brainstorming`**: it ends in a spec.
3. **Zero artifacts by default** — no spec folder, no branch, no code touched, no editing `roadmap` or docs «on the way». The answer lives in the conversation.
4. **Optional durable output (with approval)** — if the question uncovers an outdated anchor document or produces a decision worth recording, **propose it** and wait for the user's OK; only then write it, in the document it belongs to. Updating a doc **is not** «taking the chance to leave it done».
5. **When it becomes work, it goes to the roadmap** — once the conversation ends in work («si se puede, lo quiero», «arréglalo», «quiero la tabla de medidas»), say so, name the lane you see and hand it over; the roadmap sizes and splits it:
   - **Feature, patch or spike** → invoke `sdd-roadmap` with `Skill` and hand it what was said: what, why, each decision taken with its literal, and the lane you see. The roadmap writes the row or rows, reserves the id and closes with the launch prompt. You don't write the row, reserve an id or invoke `sdd-propose`: work without a row is work nobody can track.
   - **Config** (dependencies, CI, settings, a typo outside visible text: no row) → give its launch prompt yourself, traced from [launch-prompt-template.md](../sdd-templates/templates/launch-prompt-template.md): no id, branch `feature/<slug>`, `Carril: config`.
<!-- kit: incluye start-here-offer -->
   - Planning without doing («apúntalo, no lo hagas») → `sdd-roadmap`. A failure to fix is a patch: the first bullet.

   «Hazlo ya, aquí» doesn't skip the roadmap: the row comes first, and its «arráncalo» starts it in this session.

## Red flags — STOP, this is no longer exploring

- You're about to create a folder in `.docs/sdd/changes/` (or a `patch.md`, or a branch) from explore.
- You're **reproducing a lane by hand** (copying a spec's or a patch's naming) instead of invoking its skill.
- You're about to write a **ticket id you made up** because «it's the next free one».
- You're about to edit `roadmap`, `changelog` or an anchor document without the user's approval.
- You're about to invoke `sdd-propose` for a feature, a patch or a spike that has no roadmap row.
- You launched an interrogation (`sdd-grilling`) at a question that was answered by reading and answering.
- You reached for `brainstorming` «just to think it through».

| Rationalization | Reality |
| --- | --- |
| «They ask me to "fix it" directly, so I create the `patch.md`» | «Fix it» triggers the hand-off, not permission to build the artifact. It goes to the roadmap as a patch row, or as a feature if the approach needs interpreting, and `sdd-propose` gates the root cause when it starts. |
| «I pick the next free ticket id and mark it tentative» | Explore can **compute and propose** the next id with `sdd id next`, but doesn't reserve it or write it in any artifact: `sdd-roadmap` reserves it, and a config's prompt goes without one. |
| «I reproduce the naming convention by hand, I know it» | Reproducing a lane by hand skips its gates. If it's work, it goes to the roadmap; if not, there's no artifact. |
| «Since I looked at the roadmap and it's outdated, I update it on the way» | Durable output is proposed and approved. Editing «on the way» is exactly what explore doesn't do. |
| «To structure this I use brainstorming» | Brainstorming builds features (it ends in a spec). To structure or stress-test a direction without artifacts: `sdd-grilling`. |
| «A probe, even a quick one, is already implementing: I won't touch code, I send it to the feature lane» | Probing isn't implementing. «Zero artifacts» forbids what persists, not the throwaway test that answers the question. Refusing to probe and opening a feature is over-triggering. |
