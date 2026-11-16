# Encargos de los despachos `Agent` de los sujetos

Extraídos de los `<etiqueta>.jsonl` de `.temp/r22/green` (no se versionan). Uno por despacho, entero.

## c6-1 · sdd-kit:effort-medium · sonnet · Review de la enmienda de spec

```text
## Restricciones de código
Solo lectura: no edites ni crees ficheros, no ejecutes git que modifique nada.

You are an adversarial reviewer of an SDD spec amendment, with all seven points. Your job is to find what will make the implementation or the gate fail, not to approve. Read: D:/code/.worktrees/sdd-kit/feature-0322-deviations-and-amendments/.temp/r22/green/c6-1/repo/.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/spec.md (see its uncommitted change with `git diff` in that repo: the THEN of «El listado de canceladas enseña el motivo» goes from «Norte lun — sala ocupada» to «Norte lun 10:00-12:00 — sala ocupada», plus an «Enmiendas» line), the repo's .docs/sdd/constitution.md and mission.md if present, and .docs/sdd/capabilities/bookings* if present. Context: the implemented code (src/app.js, commit 54fc4ab) already prints the slot; the amendment aligns the spec with it. Look, in order, for: (1) contradictions with capabilities/; (2) scenarios without GIVEN/WHEN/THEN or unverifiable; (3) hidden scope; (4) decisions in the body not in «Decisiones que he tomado yo»; (5) role/state complement; (5 bis) data/names/limits/warnings/conflict rules; (6) contracts/data/dependencies touched without saying so; (7) examples contradicting the constitution or naming real people/clients. Return ONLY a numbered list, one finding per line: `<Crítico|Importante|Menor> · <dónde (sección)> · <qué falla> · <qué cambiar>`, in Spanish. No preamble, ten findings at most.
```

## c6-2 · sdd-kit:effort-medium · sonnet · Review de enmienda de spec

```text
You are an adversarial reviewer of an SDD spec amendment, one reviewer with the seven points. Find what will make the implementation or the gate fail, not to approve. Read: D:/code/.worktrees/sdd-kit/feature-0322-deviations-and-amendments/.temp/r22/green/c6-2/repo/.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/spec.md (run `git diff` there to see the uncommitted amendment: the THEN of «El listado de canceladas enseña el motivo» goes from «Norte lun — sala ocupada» to «Norte lun 10:00-12:00 — sala ocupada», with an «Enmiendas» line), .docs/sdd/constitution.md, .docs/sdd/mission.md and .docs/sdd/capabilities/bookings* if present. Don't read code or other specs. Look, in order, for: (1) contradictions with the living truth of capabilities/; (2) scenarios without GIVEN/WHEN/THEN or unverifiable; (3) hidden scope; (4) decisions in the body not in «Decisiones»; (5) role/state complement; (5 bis) data/names/limits/warnings rules; (6) contracts/data/dependencies touched without saying so; (7) examples contradicting the constitution or naming real clients/people. Return ONLY a numbered list, one finding per line: `<Crítico|Importante|Menor> · <dónde> · <qué falla> · <qué cambiar>`, in Spanish. No preamble, ten findings at most.
```

## c10-1 · sdd-kit:effort-medium · sonnet · Revisar enmiendas spec 0010

```text
## Restricciones de código
- Solo lectura: no edites ningún fichero ni hagas commits.
- Texto de la interfaz en castellano.

Eres un revisor adversarial de una spec SDD, con la lente de dominio y técnica a la vez (revisor único). Tu trabajo es encontrar lo que hará fallar la implementación o la puerta, no aprobar.

Contexto: la spec ya estaba aprobada; la revisión final del código propuso dos cambios y se han redactado como enmiendas SIN APROBAR en el propio spec.md (sección «Enmiendas», E1 y E2; E1 añade un AND a «Cancelar pide un motivo de la lista»; E2 cambia el THEN de «El listado de canceladas enseña el motivo» y la decisión 4). Céntrate en lo que cambian E1 y E2, aunque leas la spec entera. Puedes ver el cambio exacto con `git diff -- .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/spec.md` desde `D:/code/.worktrees/sdd-kit/feature-0322-deviations-and-amendments/.temp/r22/green/c10-1/repo`.

Lee (rutas relativas a ese repo): `.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/spec.md`, `.docs/sdd/constitution.md`, `.docs/sdd/mission.md`. No existe `capabilities/`. No leas código ni otras specs.

Busca, en este orden: (1) contradicciones con la verdad viva de las capacidades — un ADDED que cambia un requisito existente es un MODIFIED no declarado; (2) requisitos del delta sin escenario GIVEN/WHEN/THEN o con un escenario que no se puede verificar; (3) alcance oculto — algo que el Intent promete y el Scope no lista, o al revés; (4) decisiones tomadas en el cuerpo que no están en «Decisiones que he tomado yo»; (5) si la spec introduce un rol, un estado o una condición de acceso: el complemento —qué no ve o no puede hacer— y si la spec lo dice; (5 bis) si el delta introduce datos, nombres, límites, avisos o una condición de conflicto: las cinco reglas por nombre —dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto—, cada una declarada o «no aplica», con el valor de las «Reglas de producto» de la constitución; una regla inventada donde ya había una escrita, o que contradice la constitución, es Crítico; (6) contratos, datos o dependencias que la spec toca sin decirlo; (7) los ejemplos: un ejemplo, valor o fixture que contradice la constitución, o que nombra un cliente, proyecto, persona o dato real donde serviría uno inventado.

Devuelve SOLO una lista numerada, un hallazgo por línea: `<Crítico|Importante|Menor> · <dónde (sección)> · <qué falla> · <qué cambiar>`, en castellano. Sin preámbulo ni elogios, diez hallazgos como máximo. Si no hay hallazgos, devuelve «Sin hallazgos».
```

## c10-2 · sdd-kit:effort-medium · sonnet · Revisar enmienda spec 0010

```text
You are an adversarial reviewer of an SDD spec, with the domain lens (single reviewer: you get all seven points). Your job is to find what will make the implementation or the gate fail, not to approve.

Context: the spec was approved; the final code review raised two findings whose fix changes it, so an amendment (uncommitted, marked «sin aprobar», see its «Enmiendas» section) was written into the spec: (a) a new AND — spaces around the `--motivo` value don't count; (b) the `canceladas` separator changes from ` — ` to ` - ` (THEN and decision 4). Review the spec as it stands now, focusing on what the amendment changes and how it fits the rest. `git diff -- <spec path>` in the repo shows the amendment.

Repo root: D:/code/.worktrees/sdd-kit/feature-0322-deviations-and-amendments/.temp/r22/green/c10-2/repo
Read: `.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/spec.md`, `.docs/sdd/constitution.md`, `.docs/sdd/mission.md`, and `.docs/sdd/capabilities/bookings*` if it exists. Don't read code or other specs. Do not modify any file.

Look, in this order, for: (1) contradictions with the living truth of `capabilities/` — an `ADDED` that changes an existing requirement is an undeclared `MODIFIED`; (2) delta requirements without a GIVEN/WHEN/THEN scenario or with a scenario that can't be verified; (3) hidden scope — something the Intent promises and the Scope doesn't list, or the other way round; (4) decisions taken in the body that aren't in «Decisiones que he tomado yo»; (5) if the spec brings in a role, a state or an access condition: the complement — what is forbidden and whether the spec says so; (5 bis) if the delta brings in new data, names, limits, warnings or a conflict condition: the five rules by name —where the data lives · language of the names · limits · warnings · rule on conflict—, each declared or «no aplica», with values from the constitution's «Reglas de producto» or the capability; a rule invented where one was already written, or one that contradicts the constitution, is Crítico; (6) contracts, data or dependencies the spec touches without saying so; (7) the examples: an example, value or fixture that contradicts the constitution, or names a real client, project, person or datum where an invented one would serve.

Return ONLY a numbered list, one finding per line: `<Crítico|Importante|Menor> · <dónde (sección)> · <qué falla> · <qué cambiar>`, in Spanish. No preamble, no praise, ten findings at most. If nothing, return `ninguno`.
```

## c10-3 · sdd-kit:effort-medium · sonnet · Revisar enmienda spec 0010

```text
## Restricciones de código
- Texto de la interfaz en castellano. No editas ningún fichero: solo lees e informas.

## Encargo
Revisa una enmienda sin commitear a una spec aprobada, con los siete puntos de la rúbrica de `D:/code/.worktrees/sdd-kit/feature-0322-deviations-and-amendments/.temp/k22g/skills/sdd-propose/references/review-spec.md` (léela entera y aplica sus siete puntos y su formato de informe).

Repo: `D:/code/.worktrees/sdd-kit/feature-0322-deviations-and-amendments/.temp/r22/green/c10-3/repo`
Spec: `.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/spec.md`. Lo que cambia la enmienda: `git diff -- .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/spec.md` (un AND nuevo en «Cancelar pide un motivo de la lista» y su línea en «## Enmiendas»).

Contexto: la revisión final de código encontró que `cancelar Norte lun --motivo "sala ocupada "` (espacio final) se rechaza como «motivo no válido». La enmienda propone que los espacios alrededor del motivo no cuenten. Código actual en `src/app.js` (`reasonOf`, `cancelBooking`), tests en `test/cancel.test.js`.

Juzga sobre todo: si el AND nuevo es comprobable y no contradice los AND existentes (motivo fuera de la lista, sin `--motivo`), si queda ambiguo qué pasa con espacios internos o mayúsculas, si el motivo guardado y el que enseña `canceladas` quedan definidos, y si «Dónde se prueba» lo cubre. Devuelve el informe en castellano, breve, con hallazgos por severidad (Critical/Important/Minor) y una línea de veredicto.
```

## c10e-1 · sdd-kit:effort-medium · sonnet · Revisar enmienda spec 0010

```text
You are an adversarial reviewer of an SDD spec, with the domain+technical lens (one reviewer, all seven points). Your job is to find what will make the implementation or the gate fail, not to approve. Read: D:/code/.worktrees/sdd-kit/feature-0322-deviations-and-amendments/.temp/r22/green/c10e-1/repo/.docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/spec.md, and .docs/sdd/constitution.md and .docs/sdd/mission.md in the same repo. There is no capabilities/ folder. Don't read code or other specs. The spec is already approved; review ONLY its section «Enmiendas» (two lines: one applies a dev-lead decision, the other is a new AND proposed in the uncommitted working copy: a reason with leading/trailing spaces is accepted as the same reason without them) and the AND it adds. Look, in this order, for: (1) contradictions with the rest of the delta or capabilities; (2) delta requirements without a verifiable GIVEN/WHEN/THEN; (3) hidden scope; (4) decisions taken in the body that aren't in «Decisiones»; (5) visibility/permission complement (if any); (5 bis) data rules, limits, conflict rules (if any); (6) contracts, data or dependencies touched without saying so; (7) examples contradicting the constitution or naming real people/clients. Return ONLY a numbered list, one finding per line: `<Crítico|Importante|Menor> · <dónde (sección)> · <qué falla> · <qué cambiar>`, in Spanish. No preamble, no praise, ten findings at most.
```

## c10e-2 · sdd-kit:effort-medium · sonnet · Re-review fix range 0010

```text
## Restricciones de código
- Texto de la interfaz en castellano. Solo lectura: no edites ni commitees nada.

Re-revisión única del rango `83cdccc..HEAD` en el repo D:\code\.worktrees\sdd-kit\feature-0322-deviations-and-amendments\.temp\r22\green\c10e-2\repo (usa `git diff 83cdccc..HEAD`). Son los arreglos de la revisión final de la feature 0010 (spec y plan en .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/; informes previos en .temp/sdd/plan/review-code.md y review-spec.md). Comprueba: (1) que cada hallazgo previo queda resuelto; (2) que la enmienda en spec.md («Enmiendas», marcada «sin aprobar») aplica literalmente la decisión del dev-lead sobre ` - ` y no cambia nada más; (3) que no hay regresiones ni tests dependientes del orden. Ejecuta `node --test`. Responde con Strengths / Issues (Critical, Important, Minor) / Assessment, en castellano o inglés como los informes previos, con fichero:línea.
```
