---
name: using-sdd
description: Use at the start of any conversation in a project with .docs/sdd/, before answering, asking or invoking brainstorming — says which SDD kit skill each request enters through.
---

# using-sdd

## Overview

This project works with the SDD kit (`.docs/sdd/`). This is a project instruction and **takes precedence** over superpowers' rule of invoking `brainstorming` first: the entry gates are the kit's skills, which don't invoke `brainstorming` or `writing-plans`.
Write everything the user reads in the language of their message, skill announcements and the one-line notes between tool calls included, also while the reference you follow is in English.

## Gates

| What the user writes | Gate |
| --- | --- |
| No `.docs/sdd/` and wants to work with SDD, or an init in progress (`.docs/sdd/sdd-kit.json` with the `init` key): «sigue con la init» | `sdd-kit:sdd-init` |
| An initialized project wants to catch up with the kit («actualízame al kit», «ponme el proyecto al día»), or accepts the offer of the migrations notice | `sdd-kit:sdd-upgrade` |
| A question or a doubt: «¿cómo funciona…?», «¿se puede…?», «no lo pillo» | `sdd-kit:sdd-explore` |
| Planning without doing it yet: «apunta en el roadmap», «no lo arranques». Something big: several features at once, or one that `sdd-propose`'s splitting criterion would split; notes from a meeting; items from the tracker (Azure DevOps, Jira), including those assigned to you to do; reordering; preparing the next release; «dame el prompt de la <id>»; «qué sigue», «dame la siguiente» | `sdd-kit:sdd-roadmap` |
| A change, even a small one or one asked for as a patch: a feature («añade…», «hazme…», «let's build…», «es una tontería, hazlo rápido»), a failure, a presentation adjustment or removal, a dependency, CI or settings change, a typo or rename, an investigation that leaves measurements | `sdd-kit:sdd-propose`, before `brainstorming` |
| Creating a skill: «quiero una skill para…» | `sdd-kit:sdd-agent-writing` |
| Resuming a paused feature or patch: «retoma la feature», «sigue con la Task 3», «retoma el patch» | `sdd-kit:sdd-implement` |
| Closing the delivery of a version, preparing the client's notes | `sdd-kit:sdd-end-release` |
| How each person wants to work: «me paras mucho», «quiero menos preguntas», «déjamelo configurado para mí» | `sdd-kit:sdd-config`, never the agent's memory: memory stays on one PC and the kit doesn't read it |

## Doubt rule

If the request doesn't say what it is or how much it covers («hay que mejorar las reservas»), don't choose a gate: ask **one single question** about what it is and how much it covers, with your **recommendation first**, before invoking any entry skill.

| Rationalization | Reality |
| --- | --- |
| "They want it done, so it's a feature" | Wanting it done doesn't say the size. Without knowing what it is, the gate is a guess: ask. |
| "I'll save it to memory for future sessions" | The preference belongs to the kit: `sdd-config` writes it in `sdd-kit.local.json`, which every skill reads. |
| "It's a typo or a version bump: a direct edit" | There is no direct edit: `sdd-propose` classifies it, and config runs the tests before the commit. |
| "They've been assigned to me: I'll do them one after another" | Without a roadmap row there is no statement or id. `sdd-roadmap` records them and they start afterwards. |
