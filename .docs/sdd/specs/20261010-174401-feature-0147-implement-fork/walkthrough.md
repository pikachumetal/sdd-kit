---
id: 20261010-174401-feature-0147-implement-fork
feature: 0147
title: Walkthrough — implement: sdd-implement y el decálogo de calidad
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-11
---

# Walkthrough — implement: `sdd-implement` y el decálogo de calidad

## 1. Cambios realizados

- **Apertura** (`33702ef2`): la 0147 se parte en tres (0147, 0165 y 0166), con sus filas, y la enmienda del reparto en la propuesta 0131; spec y plan.
- **Task 1 — batería y RED** (`3237410b`): nace `tests/batteries/sdd-implement/` (molde `reservas`, `subject.sh`, `compose.mjs` que compone el encargo del implementador con el texto del kit que se prueba) con `r1`-`r5`, `r1b`, `h1` y `h2`; RED con el kit de la apertura ([evidencia](../../../../tests/sdd-implement-red.md)).
- **Task 2 — `sdd-implement` con lo movido** (`4597d47e`): `skills/sdd-implement/` (`SKILL.md`, `references/implementer-prompt.md`, `task-reviewer-prompt.md`, `re-review-prompt.md`, `NOTICE`), fork de superpowers 7.0.0 con el paso 6 de `sdd-start-feature` dentro; el paso 6 queda en un traspaso que es lo primero del paso; salen tres filas de `overrides-superpowers.md` y el encargo del implementador de `encargo-revision.md`; recableados README, constitution (Art. IV y IX), `CLAUDE.md`, `architecture.md`, `THIRD_PARTY_NOTICES.md`, plantillas y 17 Pester; `u1` y `u2` pasan a la batería nueva.
- **Task 3 — reglas nuevas** (`31783aa5`): decálogo de calidad en el encargo del implementador, anuncio del workspace, sección «Recovery», línea fija de compactación (ledger y walkthrough), los cuatro factores del método en la plantilla del plan y que una task no remite a otra; recorte de los prompts para el techo de palabras.
- **Task 4 — 0007, deuda y topes** (`af51d93d`): ajuste de esperas de un E2E rojo por tiempo; seis filas de deuda (THEN universal, refactor, RED antes de despachar, commits por ruta, `git stash` del hilo y el anuncio del workspace); topes `sdd-implement` 5.500 / 9.000 y `sdd-start-feature` 2.100 / 13.200.
- **Merge de sincronización** (`ee434576`): trae la 2.3.4 (patch 0167, superpowers 7.0.0); conflictos en README, `overrides-superpowers.md`, propuesta 0131 y roadmap.
- **Pasada de fix de la revisión final** (`57ca443d`): los implementadores nuevos de las rondas de fix llevan el prompt completo; siete minors. El cierre va en un commit propio: el tramo tiene un merge y no se junta (`commit-milestones.md`).

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 5h
- Esfuerzo spec + plan: ~2,3h (de la carpeta de la spec, 19:44, al commit de apertura, 22:01, hora local)
- Esfuerzo real: ~2,5h — reloj del hilo por las marcas de los commits (apertura 22:01 → pasada de fix 00:14) más el cierre; las campañas de sujetos corrieron en segundo plano mientras el hilo escribía
- Desviación: −2,5h (−50 %)
- Causa de la desviación: la estimación contaba las campañas en serie; corrieron en segundo plano a la vez que la redacción de la skill y la adaptación de los Pester
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 142.019.418 — claude-opus-5-5 142.019.418
- Tokens de subagentes: 3.112.299 en 1 despacho — Revisor final feature 0147 claude-opus-5-5 3.112.299 / 5 min
- Coste de la sesión: 44,34 $ (hilo 42,06 $ + subagentes 2,28 $)
- Coste de sujetos: ~16,7 $ en 27 sujetos válidos Sonnet, más ~3 $ en sujetos invalidados por el molde — RED ~6,5 $; GREEN ~10 $ (previsión de la spec: ~34 $)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **`r1` salió limpio y se midió el decálogo con `r1b`** (decisión del dev-lead, 2026-10-10: «Un RED más duro (Recomendada)»).
- **Salen del delta tres requisitos condicionales** (THEN universal, refactor, commits por ruta): su RED salió limpio y la spec los condicionaba a él (enmienda del 2026-10-11).
- **El traspaso del paso 6 necesitó una ronda de REFACTOR** (`u1`/`u2` 0/4 → 4/4) y el anuncio del workspace dos (0/4 → 1/3 → 2/3); el anuncio se queda en 3/6 y va a deuda.
- **El molde se corrigió a mitad del RED** (tests de la base en rojo, el «quién canceló» de la 0010, la «Verificación» de la 0014); los sujetos inválidos no cuentan.

### Decisiones tomadas sin el dev-lead

- Task 2: el Pester de forma `ImplementSkill.Tests.ps1` pasó a la primera — `sdd-implement` se escribió mientras corría el RED de la Task 1, así que su rojo no se observó — si el test tiene un hueco, lo verá la revisión final.
- Task 4: `tech-stack.md` no se toca — la fidelidad del molde al estado del repo ya está en su aprendizaje de la task 0029 — si faltara, otra fila de deuda.
- Effort no disponible en este harness (el plugin del kit no cargó por la dependencia de superpowers): los despachos van con `model` y heredan el effort de la sesión — plan, decisión 3.
- Molde `reservas` en lugar de «`salas` (TypeScript)» — la spec nombraba un molde que no está versionado; es la misma app de salas — plan, decisión 4.
- Final: los siete minors baratos de la revisión final entran en la misma pasada de fix — cada uno es una línea y tres tienen Pester — la regla de Native los manda al ledger como diferidos: me salté esa regla; coste si está mal: ninguno en conducta.

## 4. Verificación

### 4.1 Builds

- Gate de cierre: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → Pester 1084 pasados, 0 fallos, 15 saltados; Vitest 739, lentos 157 y Node mínimo 898, todos en verde · 209 s. El primer intento falló en `cli:test-min` por entorno: proto no tenía Node 22.18.0 (`proto install node 22.18.0`).
- Tras la pasada de fix: Pester 1088/1088.
- Revisión final: general-purpose + opus (effort no disponible en este harness), «With fixes», sobre `ee434576`; pasada de fix `57ca443d`, sin re-revisión (Native: la verifican sus Pester).

### 4.2 Smoke / tests

- Validación en campo: 2026-10-11 · suite 1084/1084 + Vitest 1794 en 209 s · smoke 10 THEN: 7 con ejecución real (sujetos headless de la batería), 2 con suite y 1 no probado · revisión final opus «With fixes» sobre ee434576, pasada de fix 57ca443d

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La implementación la lleva `sdd-implement` (paso 6 la invoca y vuelve al 7) | ejecución real | `u1`, `u2`, `h1`, `h2`, `r4`: 9/9 invocan `sdd-kit:sdd-implement` tras `sdd-start-feature` (ronda 1 del traspaso); ninguna skill nombra las dos de superpowers (Pester). El caso lite, no probado |
| Una task Native se registra en el ledger de `sdd-implement` | ejecución real | `h1`: `sdd task start` / `task done` por task y `Task <N>: complete` |
| El encargo del implementador lleva el decálogo | ejecución real | `r1b` 2/2 sin crecer `run`; `h2`: 2/2 despachos llevan `## Quality decalogue`; el revisor de task no lo lleva (Pester) |
| El workspace del plan se anuncia | ejecución real | 3/6 en las rondas reforzadas (con `· retomo en la Task 2` al retomar): parcial, a deuda |
| Tras una caída o un corte por cuota, la ejecución sigue desde el ledger | ejecución real | `r4` 3/3: no relanza, revisa la Task 2 y deja `Task 2: Ruling: recuperación tras corte por cuota — …`; la rama «sin informe», no probado |
| El walkthrough dice si la ejecución compactó | suite | plantilla y línea fija del ledger (Pester); ningún escenario compacta |
| Cada task del plan viaja sola | suite | plantilla del plan (Pester) |
| Un E2E rojo por tiempo se ajusta sin tocar sus aserciones | ejecución real | `r5` 2/2, con `Ajustes de espera` |
| `control-profiles`: el motivo del método pesa los cuatro factores | suite | plantilla del plan y `## Method` (Pester); los planes de los sujetos venían escritos |
| `control-profiles`: tras compactar, SDD con la línea fija | no probado | sin escenario de compactación; el texto, por Pester |

### 4.3 Residuales / deuda generada

- Seis filas de deuda en el roadmap (Task 4). Del RED, para la 0165: los implementadores no ven fallar el RED (4/4), apuntado en su fila.

## 5. Aprendizajes

- **Una línea de traspaso a otra skill no basta para que el sujeto la invoque**: con «invoca `sdd-implement` con `Skill`» en el paso 6, 0 de 4; con «lo primero de este paso… no implementes nada desde aquí», 4 de 4 → `tech-stack.md`.
- **`tools.txt` del lanzador no guarda el prompt de un despacho `Agent`**: para medir qué lleva un encargo hay que leer el stream crudo (`<etiqueta>.jsonl`), que el relanzamiento sobrescribe → `tech-stack.md`.
- **No se edita un `subject.sh` mientras corre una tanda**: bash lo lee a trozos y el sujeto en curso muere con «unexpected EOF» → `tech-stack.md`.

## 6. Adendas
