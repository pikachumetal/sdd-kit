---
name: sdd-roadmap
description: Use when something must go into the roadmap of a project with .docs/sdd/ without doing it yet — «organízalo para el equipo», «apunta en el roadmap», «no lo arranques», items the PM created in the tracker (Azure DevOps, Jira), including the ones assigned to you to do, notes from a client meeting, «reordena», «la X va tras la Y», «el cliente ha cambiado una regla de algo ya planificado, actualiza lo que haga falta», «prepara la release N», «qué entra en la siguiente entrega», «dame el prompt de la <id>», «qué sigue», «dame la siguiente» — or to triage the technical debt or a ticket («tria el ticket», «triaje de la deuda», the «Por triar» rows). Not for doing the work now (that is sdd-propose) nor for closing a release (that is sdd-end-release).
---

# sdd-roadmap

## Overview

The kit has three verbs: **plan** (`sdd-roadmap`) → **do** (`sdd-propose`) → **deliver** (`sdd-end-release`). This skill is the only door into the roadmap: the user brings something, the skill recognizes what it is and leaves the roadmap ready for someone else to start it, with the definition of anything big in a proposal (`proposal.md`) that is never rewritten.
Write everything the user reads in the language of their message, skill announcements and the one-line notes between tool calls included, also while the reference you follow is in English.

**Central principle: proposing is not deciding.** You bring the changes in order with your recommendation; what goes in, in what order and what is discarded is the user's decision.

**`sdd-roadmap` starts nothing: no branch, no feature folder, no spec, no code.** It ends in the roadmap, and in `proposal.md` if needed. The final message says which row goes first and gives its launch prompt.

## Which form

The project is on the **3.0.0 form** when it has `ROADMAP.md` at the root: Now, Next and Later, with the shape of [now-next-later-template.md](../sdd-templates/templates/now-next-later-template.md); the debt lives in `.docs/sdd/steering/debt.md`, with the shape of [debt-template.md](../sdd-templates/templates/debt-template.md); proposals go under `.docs/sdd/changes/<ts>-proposal-<id>-<slug>/`. Without `ROADMAP.md` and with `.docs/sdd/roadmap.md`, it is in the 2.x form: stop before writing anything, say this skill needs the 3.0.0 form and offer `sdd-upgrade`. Never create `ROADMAP.md` or `debt.md` in it.

## Which entry it is (you decide, without asking)

Look at what the request brings, in this order:

1. **Give a row's prompt** — «dame el prompt de la <id>»: read the row, its proposal with its amendments and `.docs/sdd/sdd-kit.json`, check with step 1 whether its branch is open, and give the launch prompt traced from [launch-prompt-template.md](../sdd-templates/templates/launch-prompt-template.md). Nothing else: you don't write, reserve, publish or commit. If the row is closed or in flight (checklist step 1), say so instead of giving the prompt (`tests/sdd-explore-0161-red.md`, m1). A Later row gives no prompt: say it is in Later and that raising it to Next writes its brief. An open «Tras» doesn't stop it: give the prompt.
2. **What comes next** — «qué sigue», «dame la siguiente». After checklist step 1, offer first, in roadmap order, the open rows carrying the `parent:` or `proposal:` (its path in `**Requisitos:**`) of something started (a piece closed or in flight), then Now's other open rows in order, then Next's. Never offer, and say why: in flight, blocked («Tras» open or 🔒), a split mother (pieces carry its `parent:`), Later. Give the first one's prompt as in entry 1, the template's exact form, title included, without waiting; naming another gives that one's. Nothing to offer: say so. You write nothing.
3. **Tracker items** — `ids.mode: tracker` in `.docs/sdd/sdd-kit.json` and ticket ids in the request.
4. **A meeting** — notes or minutes of a meeting with the client.
5. **Prepare a release** — «prepara la release N», «qué entra en la siguiente entrega».
6. **Reorder or change** — it only talks about rows that already exist: «reordena», «la X va tras la Y», «quita la Z», or it changes the definition of an existing proposal.
7. **Triage** — «tria el ticket», «triaje de la deuda», or the rows of «Por triar» in `debt.md`.
8. Everything else, by size: **Something concrete** if it fits in one feature; **Something big** if it foresees more than one (the same threshold `sdd-propose` uses to propose splitting: more than 5 internal tasks, or 4 or 5 that touch different capabilities or surfaces —DB, UI, API— or any with a migration; with 3 or fewer, never).

Against `sdd-propose` the verb decides: doing it now («añade», «hazme», «arréglalo») is `sdd-propose`; leaving it noted («apunta», «organízalo», «planifica», «no lo arranques») is this skill.

## Checklist (create a todo per step)

1. **Real state** — read `ROADMAP.md` of the integration branch (`git show develop:ROADMAP.md`, or the one the constitution sets) and `.docs/sdd/steering/debt.md`, and, **for each `feature/*` branch** that `git branch --all` lists, the same files (`git show <branch>:<path>`): what a branch split or reserved is only in its roadmap. Read `ids.mode` too and, if you are going to write rules or name capabilities, run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" capability index --path .docs/sdd` and read the ones that, by their purpose, are touched: a file's name doesn't say where a rule lives (`tests/capabilities-index-red.md`, r). A row is in flight with 🔄 or an open `feature/<id>-*` branch, and closed with ✅ or 🧪 in the integration branch. In **any** entry, an in-flight or closed feature is not touched —neither its row nor its spec—, even if the new thing is on its topic: it goes to a new row, «tras» it if in flight.
2. **What each entry leaves** — the section below that matches.
3. **Propose and wait** — in `pair` and `delegate`, present the rows, the proposal and the split before writing them, and wait for the user's decision. A «decide tú» or «no hay nadie a quien preguntar» is a delegated decision: write, and leave the decisions you took in the proposal or in the commit body. In `unattended`, the most conservative option, registered the same way.
4. **Ids** — in `sequence`, the N new ids (N + 1 if there is a proposal) come from **one** reservation: `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" id next --project-root "<root>" --reserve --count N`. Without `--reserve` the script only proposes, and another worktree can take the same one. Later rows enter that reservation too, never `B<n>`. In `tracker`, the tracker sets the id; a Later row without ticket takes `0000`. Never a number by eye.
5. **Check the form** — after writing in the roadmap and before committing, run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" roadmap check --path .docs/sdd`: it checks `ROADMAP.md` and `debt.md`.
A failure on a line you wrote you fix in the roadmap, never in the validator. A failure on a line you didn't touch you don't fix, and it doesn't stop you: your final message lists them and says how many, as inherited form (`tests/release-close-roadmap-red.md`, K1 and P3).
6. **Publish the reservation** — run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" roadmap publish --project-root "<root>" --message "<message>" <the paths you touched>`: `ROADMAP.md` and `.docs/sdd/steering/debt.md` (plus the `proposal.md` if there is one). It commits only those files in the integration branch, with the lock of `sdd merge`, in the worktree where it is checked out or in a temporary one if it is in none. The branch comes from `merge.into` in `sdd-kit.json`, or from `--into`. Until that commit the reservation doesn't exist for the other worktrees; for another clone, until its start runs `sdd id claim`.
7. **Close** — say which row goes first and give its launch prompt, traced from [launch-prompt-template.md](../sdd-templates/templates/launch-prompt-template.md), also with «apunta, no lo arranques»: the prompt starts nothing. A triage that left no row says where each item went instead.
End with «si prefieres hacerlo en esta sesión, di "arráncalo"», in the user's language; with «arráncalo», invoke `sdd-propose` with the prompt you gave, and without it, start nothing (`tests/sdd-explore-0161-red.md`, m2).

## What each entry leaves

### Something big

First thing in this entry: read [references/proposal.md](references/proposal.md), the shape of the proposal and of its rows. Interview with the `sdd-grilling` skill (invoke it with `Skill`): **the interview never ends in a spec** or a plan; it ends in `proposal.md` and in roadmap rows. The rules do **not** go to the roadmap: the roadmap is the index every skill reads; the definition lives in the proposal.

### Something concrete

One row, without a proposal. It is a row of Now or Next if it will be done, traced from [now-next-later-template.md](../sdd-templates/templates/now-next-later-template.md): id, title, one-liner, the brief's five labels, `⏳` and size; or of Later, with its id, if it is not decided, or in the template section the user names. Raising a Later row to Next keeps its id and writes its brief and size. A pending patch is a row of Now with `**Carril:** patch` in its brief. Before writing `**Carril:** patch`, count the tests of new behavior the row asks for: with two or more it is not a patch but lite or feature, and its prompt opens `feature/<id>-<slug>`. A row born from the measures or conclusions of another change links that artifact (`patch.md` §N, `walkthrough.md`), with the figures it cites added there first, as a dated addendum if it is closed: a scratchpad is deleted. A single-feature epic is a feature.

A new row in 3.0.0 gets a size, with the splitting threshold of `sdd-propose`: `S` — a patch, a lite or 3 tasks or fewer; `M` — 4 or 5 tasks; `L` — more than 5: new work that big is «Something big» and is split now, so `L` only appears on an existing row (from a manager, or after re-estimating), which is split when it starts, with `sdd-propose`. It is required in Now and Next; in Later it may be `—` (`tests/sdd-roadmap-0150-red.md`, m5).

If the user asks for a section that is not in the template («abre una sección "Ideas del cliente"»), you don't create it: the row goes to the equivalent section of the template —what is not yet decided to do, to Later— and your message says the template doesn't admit it and where it went (`tests/release-close-roadmap-red.md`, P1).

### Tracker items

- Each item enters with **its** tracker id. You reserve nothing with the script.
- A row that already exists is not touched: if an item seems to duplicate a row, you ask; you don't delete, replace or merge without asking.
- A big item (several features) is split **now**: in the same answer you propose the children so the PM creates them in the tracker. In the roadmap you don't write made-up ids for them: the item's row carries the proposed split until they exist.

### A meeting

- Proposal with `source: meeting`: date, attendees and the **literal notes** in «Acta», and each new rule in «Reglas de negocio» with its example with data.
- Each new thing the client asks for is a row with a reserved id, pointing to the proposal (its path in `**Requisitos:**`).
- What the client discards stays `⏸️ aparcada: descartada por <quién>, <fecha>`: it is not deleted.
- The order the client asks for applies to the pending rows.
- You don't open a release section that nobody asked for, nor add a version to the title of Now.

### Reorder or change

- You change only the rows the request names; the rest stays the same.
- A dependency goes in the «Tras» column, with no owner column. The order of the rows is the priority.
- **If the definition of a proposal changes**: you add a dated entry in «Enmiendas» (which rule changes, the old and the new value with its example with data, who asked for it) and you **don't rewrite** «Reglas de negocio» or the minutes. You re-split **only what is pending**: a closed or in-flight feature (checklist step 1) is not touched, and what the change asks of it goes to a new row «tras» it. A new feature also enters the proposal's split; one that is parked is marked there, not deleted.

### Prepare a release

First thing in this entry: read [references/prepare-release.md](references/prepare-release.md), steps 2 to 6 (order, scope, recipient, state and the section). Step 1:

1. **Inventory** — Later, the technical debt (the «Lista» of `debt.md`), and the «Propuestas» and action items of the newest `.docs/sdd/releases/v*/retro.md`, if any. Technical debt enters only if it is a verifiable prerequisite of an item in scope or by the user's explicit decision, not in bulk.

### Triage

Triage decides the state of each item of the technical debt (`debt.md`). Each item of «Por triar» gets exactly one of three outcomes. Step 3 of the checklist applies: you propose and wait; with «decide tú», you write and leave what was decided in the commit body.

- **«En espera»** — with «Falta» `reproducirlo` or `2.º caso`.
- **«Lista»** — with «Evidencia» and «Destino».
- **Discarded** — the row leaves `debt.md`, its reason in the commit body.

The rules:

- **Second case, before choosing the state**: open the tickets of every debt row and of the batch; the rows' words don't decide. The same concrete change or concrete remedy makes one problem; sharing only the cause, `ninguno` or a retry (`relanza`) doesn't. Merge them into one «Lista» row, a link per case in «Origen» and «Evidencia».
- **«Causa»**, per row out of `Por triar`, the root that vanishes with the remedy (`debt-template.md` defines them): `entorno de la máquina`, `carga o paralelismo`, `herramienta del kit`, `regla lejos de su paso`, `decisión que no era del agente`, `fusión de registros`, `prueba o molde`, `defecto del producto`, `sin determinar` (never in «Lista»). Same mechanism under another cause: reclassify it. A row without one gets it when touched.
- **«Remedio temporal»**: with two cases, what solved it, from the tickets; `ninguno` only if you looked.
- **«Arreglo»**, the first that works, in order: `comprobación automática`, `conectar comprobación`, `mover regla`, and only last `línea nueva`; `—` only with `defecto del producto`.
- Nothing goes to «Lista» without being reproduced or without a second case: an item you could not reproduce goes to «En espera», with «Falta» `reproducirlo` (`tests/sdd-roadmap-0150-red.md`, m3).
- The «Evidencia» of a «Lista» row is the command that reproduces it, with its output, or the links to the two cases; the report or the line of code is not enough (m3).
- The «Destino» of a «Lista» row is the id of a row of Now or Next, new or existing, or `sin fila`; never empty. A new row is written like any concrete thing. A solution that row fixes —in its brief's «Decisiones ya tomadas»— is one you ran, on a copy outside the tree, with the real case the tickets cite (a command, a file:line, a sha) up to where the failure shows, the row's WHEN: yours as well as the ticket's; if you didn't, the row says «solución por confirmar». A solution that replaces a sentence quotes, literally from the file, the whole sentence that leaves and the whole sentence that enters, never a fragment or a description of the new text. The `**Salda:**` of a brief names only «Lista» rows.
- A row of «En espera» that `sdd roadmap check` warns expires is proposed for discarding, with reason `caducada`. A release is a version `X.Y.0` of the changelog: patches don't count (m3).
- «Origen» links the ticket; «Fecha» is the day (`AAAA-MM-DD`) the row enters its state and is kept while it stays there, so expiry doesn't restart.
- A discarded row's first case lives only in its ticket: its second case enters «Por triar» as a new row, with both origins.
- In `unattended`, what you can't decide stays in «Por triar», and the rest is registered in the commit.
- Without `debt.md`, triage creates `.docs/sdd/steering/debt.md` tracing `debt-template.md`.

## Red flags — STOP

- You're about to create a branch, a feature folder or a `spec.md` from this skill.
- You're about to delete a row, replace it with a tracker item or merge two without the user saying so.
- You're about to leave the business rules of something big in a block of the roadmap.
- You're about to note a big tracker item with «trocear al arrancarlo» instead of proposing the split now.
- You're about to reopen a closed or in-flight feature because the definition changed.
- You're about to mark a release «comprometida» without the user saying so, or with external blocks open.

| Rationalization | Reality |
| --- | --- |
| «Each feature gets its spec and plan when it starts; I leave the common decisions in a block of the roadmap» | The roadmap is the index every skill reads. The rules and their why go to `proposal.md`, with examples with data (`tests/sdd-roadmap-red.md`, p1). |
| «The Azure item and the row are the same; I keep one row» | Deleting or replacing a row is the user's decision, not a cleanup (p3). Ask about the duplicate. |
| «It's an epic; it gets split when it starts» | When it starts nobody looks at the whole roadmap. The split is proposed now, so the PM creates the children (p3). |
| «The proposal's example was incomplete; I rewrite it» | The proposal is historical: the change goes to «Enmiendas» with its date. Rewriting it erases what was agreed before (p10). |
| «The note is on the topic of the feature in flight; I group it in its row» | Its branch is editing that row and that spec. Grouping it there causes the conflict on closing and changes an approved scope: it goes to a new row «tras» it. |
