---
name: sdd-roadmap
description: Use when something must go into the roadmap of a project with .docs/sdd/ without doing it yet — «organízalo para el equipo», «apunta en el roadmap», «no lo arranques», items the PM created in the tracker (Azure DevOps, Jira), including the ones assigned to you to do, notes from a client meeting, «reordena», «la X va tras la Y», «el cliente ha cambiado una regla de algo ya planificado, actualiza lo que haga falta», «prepara la release N», «qué entra en la siguiente entrega», «dame el prompt de la <id>» — or to triage the technical debt or a ticket («tria el ticket», «triaje de la deuda», the «Por triar» rows). Not for doing the work now (that is sdd-propose) nor for closing a release (that is sdd-end-release).
---

# sdd-roadmap

## Overview

The kit has three verbs: **plan** (`sdd-roadmap`) → **do** (`sdd-propose`) → **deliver** (`sdd-end-release`). This skill is the only door into the roadmap: the user brings something, the skill recognizes what it is and leaves the roadmap ready for someone else to start it, with the definition of anything big in a proposal (`proposal.md`) that is never rewritten. Write everything the user reads in their language, skill announcements included.

**Central principle: proposing is not deciding.** You bring the changes in order with your recommendation; what goes in, in what order and what is discarded is the user's decision.

**`sdd-roadmap` starts nothing: no branch, no feature folder, no spec, no code.** It ends in the roadmap, and in `proposal.md` if needed. The final message says which row goes first and gives its launch prompt; with «dame el prompt de la <id>», it gives only that prompt.

## Which form

With `ROADMAP.md` at the root, the project is on the **3.0.0 form**: Now, Next and Later, with the shape of [now-next-later-template.md](../sdd-templates/templates/now-next-later-template.md); the debt lives in `.docs/sdd/steering/debt.md`, with the shape of [debt-template.md](../sdd-templates/templates/debt-template.md); proposals go under `.docs/sdd/changes/<ts>-proposal-<id>-<slug>/`. Without `ROADMAP.md`, it is the **2.x form**: `.docs/sdd/roadmap.md`, with the shape of `roadmap-template.md`, and proposals under `.docs/sdd/specs/`. Never create `ROADMAP.md` or `debt.md` in a 2.x project. The equivalences:

| 3.0.0 | 2.x |
| --- | --- |
| Now and Next | «Próximo» |
| Later (`B<n>`) | «Backlog» (`B<n>`) |
| «Tras» | «tras NNNN» in the «Ítem» cell |
| The `**Requisitos:**` of the brief (the proposal's path) | «`proposal: <id>`» in the «Ítem» cell |
| A patch in Now, with `**Carril:** patch` | «Próximo», with «Patch:» at the start of the item |
| Preparing a release | `## Release <N>` with «Ficheros que toca» |
| Lista | `**Actuar**` in the «Destino» of «Deuda técnica» |
| En espera | `**Esperar 2.º ticket**`, with what is missing |
| Descartada | `**Descartada**`, with its reason |
| Por triar | does not exist: triage decides one of the three |

## Which entry it is (you decide, without asking)

Look at what the request brings, in this order:

1. **Give a row's prompt** — «dame el prompt de la <id>»: read the row, its proposal with its amendments and `.docs/sdd/sdd-kit.json`, check with step 1 whether its branch is open, and give the launch prompt traced from [launch-prompt-template.md](../sdd-templates/templates/launch-prompt-template.md). Nothing else: you don't write, reserve, publish or commit. If the row is closed (✅, 🧪) or in flight (🔄 or an open `feature/<id>-*` branch), say so instead of giving the prompt (`tests/sdd-explore-0161-red.md`, m1). A Later row gives no prompt: say it is in Later and that raising it to Next reserves it an id and writes its brief.
2. **Tracker items** — `ids.mode: tracker` in `.docs/sdd/sdd-kit.json` and ticket ids in the request.
3. **A meeting** — notes or minutes of a meeting with the client.
4. **Prepare a release** — «prepara la release N», «qué entra en la siguiente entrega».
5. **Reorder or change** — it only talks about rows that already exist: «reordena», «la X va tras la Y», «quita la Z», or it changes the definition of an existing proposal.
6. **Triage** — «tria el ticket», «triaje de la deuda», or the rows of «Por triar» in `debt.md`.
7. Everything else, by size: **Something concrete** if it fits in one feature; **Something big** if it foresees more than one (the same threshold `sdd-propose` uses to propose splitting: more than 5 internal tasks, or 4 or 5 that touch different capabilities or surfaces —DB, UI, API— or any with a migration; with 3 or fewer, never).

Against `sdd-propose` the verb decides: doing it now («añade», «hazme», «arréglalo») is `sdd-propose`; leaving it noted («apunta», «organízalo», «planifica», «no lo arranques») is this skill.

## Checklist (create a todo per step)

1. **Real state** — read `ROADMAP.md` of the integration branch (`git show develop:ROADMAP.md`, or the one the constitution sets; without it, `.docs/sdd/roadmap.md`) and `.docs/sdd/steering/debt.md`, and, **for each `feature/*` branch** that `git branch --all` lists, the same files (`git show <branch>:<path>`): what a branch split or reserved is only in its roadmap. Read `ids.mode` too and, if you are going to write rules or name capabilities, run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" capability index --path .docs/sdd` and read the ones that, by their purpose, are touched: a file's name doesn't say where a rule lives (`tests/capabilities-index-red.md`, r). With that state, in **any** entry: a feature in flight (branch `feature/<id>` open or 🔄) is not touched —neither its row nor its spec—, even if the new thing is on its topic: it goes to a new row «tras» it. A feature closed (✅ or 🧪) in the integration branch doesn't receive new work either: it goes to a new row.
2. **What each entry leaves** — the section below that matches.
3. **Propose and wait** — in `pair` and `delegate`, present the rows, the proposal and the split before writing them, and wait for the user's decision. A «decide tú» or «no hay nadie a quien preguntar» is a delegated decision: write, and leave the decisions you took in the proposal or in the commit body. In `unattended`, the most conservative option, registered the same way.
4. **Ids** — in `sequence`, the N new ids (N + 1 if there is a proposal) come from **one** reservation: `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" id next --project-root "<root>" --reserve --count N`. Without `--reserve` the script only proposes, and another worktree can take the same one. In `tracker`, the tracker sets the id. A Later row takes the next `B<n>` of its own numbering, not an id from the script. Never a number by eye.
5. **Check the form** — after writing in the roadmap and before committing, run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" roadmap check --path .docs/sdd`: it checks `ROADMAP.md` or `roadmap.md` and `debt.md`. A failure on a line you wrote you fix in the roadmap, never in the validator. A failure on a line you didn't touch you don't fix: list it in your message as inherited form, pending the «Roadmap en la forma de la plantilla» step of the migration to v2.3.0 (`tests/release-close-roadmap-red.md`, P3).
6. **Publish the reservation** — run `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" roadmap publish --project-root "<root>" --message "<message>" <the paths you touched>`: `ROADMAP.md` and `.docs/sdd/steering/debt.md`, or `.docs/sdd/roadmap.md` (plus the `proposal.md` if there is one). It commits only those files in the integration branch, with the lock of `sdd merge`, in the worktree where it is checked out or in a temporary one if it is in none. The branch comes from `merge.into` in `sdd-kit.json`, or from `--into`. Until that commit the reservation doesn't exist for the other worktrees.
7. **Close** — say which row goes first and give its launch prompt, traced from [launch-prompt-template.md](../sdd-templates/templates/launch-prompt-template.md), also with «apunta, no lo arranques»: the prompt starts nothing. A triage that left no row says where each item went instead. End with «si prefieres hacerlo en esta sesión, di "arráncalo"», in the user's language; with «arráncalo», invoke `sdd-propose` with that row. Without that phrase, don't start it (`tests/sdd-explore-0161-red.md`, m2).

## What each entry leaves

### Something big

Interview with the `sdd-grilling` skill (invoke it with `Skill`): **the interview never ends in a spec** or a plan; it ends in `proposal.md` and in roadmap rows.

- The proposal lives in `<ts>-proposal-<id>-<slug>/proposal.md` (under `.docs/sdd/changes/` in 3.0.0, under `.docs/sdd/specs/` in 2.x), traced from `proposal-template.md` of the `sdd-templates` skill with `source: interview`.
- Every business rule carries an example with input and output data.
- The split lists the features in their order, each with its id and its dependency.
- Each feature is a roadmap row. In 3.0.0, the proposal's path goes in the `**Requisitos:**` of its brief and the dependency in «Tras». In 2.x, «`proposal: <id>`» and «tras NNNN» go in the «Ítem» cell.
- The rules do **not** go to the roadmap: the roadmap is the index every skill reads; the definition lives in the proposal.

### Something concrete

One row, without a proposal. In 3.0.0 it is a row of Now or Next if it will be done, with its id, title, one-liner, brief and size; or of Later, with its `B<n>`, if it is not decided, or in the template section the user names. Raising a Later row to Next reserves it an id (step 4) and writes its brief and size. A pending patch is a row of Now with `**Carril:** patch` in its brief. In 2.x it is a row of «Próximo» with its id, or of «Backlog» if not, or in the template section the user names, and a pending patch has «Patch:» at the start of the item; the «Patches» section is the register of the closed ones. A single-feature epic is a feature.

A new row in 3.0.0 gets a size, with the splitting threshold of `sdd-propose`: `S` — a patch, a lite or 3 tasks or fewer; `M` — 4 or 5 tasks; `L` — more than 5, and it is split when it starts. It is required in Now and Next; in Later it may be `—` (`tests/sdd-roadmap-0150-red.md`, m5).

If the user asks for a section that is not in the template of its form («abre una sección "Ideas del cliente"»), you don't create it: the row goes to the equivalent section of the template —what is not yet decided to do, to Later (2.x: Backlog)— and your message says the template doesn't admit it and where it went (`tests/release-close-roadmap-red.md`, P1).

### Tracker items

- Each item enters with **its** tracker id. You reserve nothing with the script.
- A row that already exists is not touched: if an item seems to duplicate a row, you ask; you don't delete, replace or merge without asking.
- A big item (several features) is split **now**: in the same answer you propose the children so the PM creates them in the tracker. In the roadmap you don't write made-up ids for them: the item's row carries the proposed split until they exist.

### A meeting

- Proposal with `source: meeting`: date, attendees and the **literal notes** in «Acta», and each new rule in «Reglas de negocio» with its example with data.
- Each new thing the client asks for is a row with a reserved id, pointing to the proposal (3.0.0: its path in `**Requisitos:**`; 2.x: «`proposal: <id>`»).
- What the client discards stays `⏸️ aparcada: descartada por <quién>, <fecha>`: it is not deleted.
- The order the client asks for applies to the pending rows.
- You don't open a release section that nobody asked for, nor add a version to the title of Now.

### Reorder or change

- You change only the rows the request names; the rest stays the same.
- A dependency goes in the «Tras» column (2.x: in the «Ítem» cell as «tras NNNN», with no new column and no owner column). The order of the rows is the priority.
- **If the definition of a proposal changes**: you add a dated entry in «Enmiendas» (which rule changes, the old and the new value with its example with data, who asked for it) and you **don't rewrite** «Reglas de negocio» or the minutes. You re-split **only what is pending**: a closed feature (✅ or 🧪) or one in flight (branch `feature/<id>` open or 🔄) is not touched, and what the change asks of it goes to a new row «tras» it. A new feature also enters the proposal's split; one that is parked is marked there, not deleted.

### Prepare a release

1. **Inventory** — Later (2.x: Backlog), the technical debt (the «Lista» of `debt.md`; 2.x: «Deuda técnica»), and the minutes and action items of the previous release's retro if `.docs/sdd/releases/<last>/feedback.md` exists. Technical debt enters only if it is a verifiable prerequisite of an item in scope or by the user's explicit decision, not in bulk.
2. **Order** — risk first, then cost-benefit, counting dependencies, with the **blocks marked** (🔒 + which decision is missing + who must make it).
3. **Scope** — the user decides, item by item or by blocks. A stakeholder's pressure («todo es importante») is registered, not obeyed.
4. **Recipient** — if `sdd-kit.json` has no `release.hasRecipient`, ask once whether the release is delivered to someone other than who makes it and write the answer in that field, merging without touching the rest; with the field present, apply its value without asking. You never write it without an explicit answer.
5. **State** — **comprometida** (scope promised to the recipient, normally with a date) only if the user says so and there are no external blocks; otherwise **en preparación**. With `release.hasRecipient: false`, always en preparación, without asking.
6. **Section** — in 3.0.0, the title of Now becomes `## Now — <version> · en preparación` or `## Now — <version> · comprometida`, with the version the user gives, never an assumed one; the rows in scope go in Now in the decided order (the order is the priority), each brief with its `**Toca:**`, and what is pending and doesn't enter goes to Next; the line `Perfil de control: <perfil>` stays under `## Now`. In 2.x, `## Release <N>` in the roadmap, with the literal header of `roadmap-template.md`: `| id | Feature | Origen | Ficheros que toca | Estado |`. The `**Toca:**` and the «Ficheros que toca» cell name the planned files or modules, read from the code; if they don't exist yet, the folder or module where they will go, never «por definir»: the scope brake uses them to see overlaps. In `sequence`, each row with its reserved id (step 4 of the checklist). Without a tracker, the roadmap is the only source of the scope; with a tracker, the source is the tracker.

### Triage

Triage decides the state of each item of the technical debt (3.0.0: `debt.md`; 2.x: «Deuda técnica» of `roadmap.md`). Each item of «Por triar» goes to exactly one of three states. Step 3 of the checklist applies: you propose and wait; with «decide tú», you write and leave what was decided in the commit body.

- **«En espera»** — with «Falta» `reproducirlo` or `2.º caso`.
- **«Lista»** — with «Evidencia» and «Destino».
- **«Descartadas»** — with «Motivo».

The rules:

- Nothing goes to «Lista» without being reproduced or without a second case: an item you could not reproduce goes to «En espera», with «Falta» `reproducirlo` (`tests/sdd-roadmap-0150-red.md`, m3).
- The «Evidencia» of a «Lista» row is the command that reproduces it, with its output, or the links to the two cases; the report or the line of code is not enough (m3).
- The «Destino» of a «Lista» row is the id of a row of Now or Next, new or existing, or `sin fila`; never empty. A new row is written like any concrete thing, and the `**Salda:**` of a brief names only «Lista» rows.
- A row of «En espera» that `sdd roadmap check` warns expires is proposed in «Descartadas», with «Motivo» `caducada`. A release is a version `X.Y.0` of the changelog: patches don't count (m3).
- «Origen» links the ticket; «Fecha» is the day (`AAAA-MM-DD`) the row enters its state and is kept while it stays there, so expiry doesn't restart.
- The second case of a discarded row enters «Por triar» as a new row, with both origins.
- In `unattended`, what you can't decide stays in «Por triar», and the rest is registered in the commit.
- With `ROADMAP.md` and no `debt.md`, triage creates `.docs/sdd/steering/debt.md` tracing `debt-template.md`.
- In 2.x nothing stays «por triar»: each item becomes a row of «Deuda técnica» whose «Destino» starts with `**Actuar**`, `**Esperar 2.º ticket**` or `**Descartada**`, per the table above.

## Red flags — STOP

- You're about to create a branch, a feature folder or a `spec.md` from this skill.
- You're about to open a section that is not in the template of its form because the user asked, or to commit without `sdd roadmap check` having passed over what you wrote.
- You're about to delete a row, replace it with a tracker item or merge two without the user saying so.
- You're about to leave the business rules of something big in a block of the roadmap.
- You're about to note a big tracker item with «trocear al arrancarlo» instead of proposing the split now.
- You're about to take in a meeting without keeping its literal notes.
- You're about to rewrite a rule of a proposal instead of adding a dated amendment.
- You're about to reopen a closed or in-flight feature because the definition changed.
- You're about to edit the row or the spec of a feature in flight to put new work in it.
- You're about to write in the roadmap an id that doesn't come from the tracker or from `sdd id next --reserve`.
- You're about to mark a release «comprometida» without the user saying so, or with external blocks open.
- You're planning with the roadmap of your worktree without having read the integration branch's and the `feature/*` branches'.
- You're about to propose in «Lista» an item you didn't reproduce or that has no evidence.

| Rationalization | Reality |
| --- | --- |
| «Each feature gets its spec and plan when it starts; I leave the common decisions in a block of the roadmap» | The roadmap is the index every skill reads. The rules and their why go to `proposal.md`, with examples with data (`tests/sdd-roadmap-red.md`, p1). |
| «The Azure item and the row are the same; I keep one row» | Deleting or replacing a row is the user's decision, not a cleanup (p3). Ask about the duplicate. |
| «It's an epic; it gets split when it starts» | When it starts nobody looks at the whole roadmap. The split is proposed now, so the PM creates the children (p3). |
| «The notes are already reflected in the rows» | The rows say what to do, not what the client said. Without minutes, the next discussion has nothing to read from (p4). |
| «The 0012 is discarded; I remove it from the roadmap» | A discard is `⏸️ aparcada: descartada por <quién>, <fecha>`. Deleting it loses the why (p4). |
| «The proposal's example was incomplete; I rewrite it» | The proposal is historical: the change goes to «Enmiendas» with its date. Rewriting it erases what was agreed before (p10). |
| «Now that the change is clear, I start the feature and write the spec» | Planning is not doing. `sdd-roadmap` ends in the roadmap (p10). |
| «"Prepara la release" is closing the release» | Preparing is deciding what goes in; closing is `sdd-end-release` (p6). |
| «The minutes' triage already decided it; I mark the release comprometida» | The triage decided the destination of each request; committing the milestone, its order and its state is another decision of the user. |
| «The client said everything is important» | Verbal emphasis is not prioritization. It is registered and decided with product criteria. |
| «I carry all the technical debt, so it gets paid off» | Debt enters by prerequisite or by explicit decision, not by inertia: it inflates the scope. |
| «I freeze the scope in a separate document» | The versioned roadmap is already auditable. The proposal is the definition of the big thing, not a copy of the scope. |
| «The note is on the topic of the feature in flight; I group it in its row» | Its branch is editing that row and that spec. Grouping it there causes the conflict on closing and changes an approved scope: it goes to a new row «tras» it. |
| «The roadmap of my worktree is the real state» | It is your base's. Another branch may have closed, split or reserved; without reading it, you repeat ids or extend closed features. |
| «I put the next free number to get ahead» | A made-up id is confused with a reserved one forever. The id comes from the tracker or from `sdd id next --reserve`. |
| «The report says it fails and cites the line; it goes to Lista» | A report is a claim, not a reproduction: «Lista» needs the command and its output, or «En espera» with `reproducirlo` (`tests/sdd-roadmap-0150-red.md`, m3). |
| «The size is not clear; I leave `—`» | In Now and Next the size is required: estimate it with the splitting threshold (`tests/sdd-roadmap-0150-red.md`, m5). |
