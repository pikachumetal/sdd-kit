---
id: 20261020-115102-feature-0203-single-id-sequence
feature: 0203
title: Walkthrough — Ids, una sola numeración y el push a la integración como árbitro
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-20
---

# Walkthrough — Ids, una sola numeración y el push a la integración como árbitro

## 1. Cambios realizados

- **Later y Backlog con id de la secuencia** (`a26cd90c`):
  - `sdd roadmap check` lee `ids.mode`. En `sequence`, todo id de Now, Next y Later es de cuatro cifras distinto de `0000`. En `tracker`, un `B<n>` da «ya no se usa: usa el del ticket o 0000».
  - El aviso de id repetido no mira `0000`.
  - `now-next-later-template.md`, `roadmap-template.md`, `sdd-roadmap` y la migración v3.0.0 dejan la numeración propia de Later. Subir de Later a Next conserva el id.
- **Base del claim** (`3382a02e`):
  - `renumberLines` reescribe un id solo en las líneas que no vienen tal cual del remoto.
  - `unpublishedReservations` da los ids que añaden los commits sin publicar.
  - `sdd id next` cuenta las etiquetas `sdd-id/*`.
- **`sdd id claim`** (`f776ad67`): fetch, renumeración con un commit `chore(roadmap)`, integración con la limpieza de registros de `sdd merge`, push con 3 intentos, etiqueta con la integración protegida, contador local sin remoto, y renombrado y fast-forward de la rama.
- **Skills de arranque** (`b9915e91`): `sdd-propose` paso 3 y `sdd-start-patch` paso 2 ejecutan el claim antes de crear la carpeta. `nombrado.md` dice que el id reservado es provisional. Se añaden la fila de la CLI en `sdd-templates` y la frase de la guía de uso.
- **Task 5, enmienda del 2026-10-20 y pasada de fix** (`18714959`):
  - las carpetas propias con el id tomado se mueven con `git mv`, y sus rutas en las filas también;
  - una fila de `origin/develop` que tu `develop` no tiene se da por tuya, con su título en la salida;
  - con `merge.push: false`, el id se fija con la etiqueta;
  - `--id` de cuatro cifras;
  - el cerrojo de merge espera 30 min;
  - una integración sin rama en el remoto da «sin remoto»;
  - relanzar sin fila no cuenta la propia carpeta;
  - `cli/src/merge/integration.ts` reúne `runGit`, el worktree de destino y el cerrojo, que comparten claim y `roadmap publish`.
- **Sin `merge.push`, solo la etiqueta** (juntado en el cierre, tras la re-revisión): como el cierre, solo `merge.push: true` publica `develop`.
- **Cierre**: el delta de cinco capacidades, la ADR 0018, la entrada del changelog, el aprendizaje del hook `pre-receive` en `tech-stack.md`, el roadmap y el estimation-log.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 6 h (spec y plan, 2,5 h)
- Esfuerzo real: 2,20 h — reloj de la sesión 3,54 h desde 2026-10-20T11:20Z, sin 80 min de espera al dev-lead (11 esperas)
- Desviación: −3,8 h frente a la implementación (−63 %)
- Causa de la desviación: la estimación contaba la campaña y la revisión como trabajo del hilo. Las dos corrieron en segundo plano, con el hilo trabajando mientras: los 16 sujetos y los 3 ejes con su re-revisión. El reloj tampoco cuenta el tiempo de los despachos solapado con el del hilo.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 109.447.676 — claude-opus-5-5 109.447.676
- Tokens de subagentes: 10.102.961 en 6 despachos — Review spec 0203 técnica claude-sonnet-5-5 143.215 / 1 min; Final review — Architecture axis claude-opus-5-5 2.676.808 / 5 min; 0203 final re-review claude-opus-5-5 1.666.854 / 5 min; Final review — Code axis claude-sonnet-5-5 2.019.316 / 4 min; Final review — Spec axis claude-opus-5-5 3.104.017 / 6 min; Review spec 0203 dominio claude-opus-5-5 492.751 / 3 min
- Coste de la sesión: 40,05 $ (hilo 32,29 $ + subagentes 7,76 $)
- Coste de sujetos: 4,97 $ (16 sujetos Sonnet de la campaña, fuera de lo anterior; previsión ~16 $ y ~20 sujetos)
- Review de spec: dos revisores (dominio opus, técnica sonnet, effort medium), 20 hallazgos aceptados

## 3. Desviaciones del plan

Dos enmiendas aprobadas, las dos en la spec, más la Task 5 que las implementa:
- La de la revisión final, con cuatro decisiones del dev-lead: la tercera fuente fuera de las skills, las carpetas renumeradas, la fila publicada con su título y `merge.push: false` con la etiqueta.
- La de la re-revisión: sin la clave `merge.push`, tampoco se publica `develop`.

### Decisiones tomadas sin el dev-lead

Los rulings de `tasks.md` (`## Rulings`), en resumen:
- El baseline del gate salió en rojo solo por `FastSuiteBudget`, con la máquina cargada. El gate final sin carga sale en verde.
- La frase de `sdd-roadmap` que nombra `sdd id claim` pasó de la Task 1 a la Task 4, porque el verbo aún no existía.
- `renumber.ts` se escribió antes de correr su RED. El RED se comprobó con un stub: 5 de 7 tests en rojo.
- La firma `unpublishedReservations` sustituye a `unpublishedIds` del plan, porque el claim necesita los commits.
- La guarda de «rama: ya existe» se queda sin test: solo se da en una carrera.
- Los tests corrigieron expectativas mías de ids (`0204`, el siguiente libre real) y el hook `pre-receive` en cuarentena.
- El eje Arquitectura salió en Opus, como fija `sdd-verify`, y no en Sonnet, como decía por error la línea «Política de modelos» de la spec.
- Los encargos de los ejes fueron en ficheros del workspace.
- La fontanería duplicada se extrajo a medias: `pushInto` no se funde con `pushDestination`.
- Los 2 Important de duplicación de la re-revisión se adjudican sin segunda pasada de fix.

## 4. Verificación

### 4.1 Builds

- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → `cli:test` 1118/1118, `cli:test-slow` 294/294, `cli:test-min` 1412/1412, `kit:test` 1330 pass / 0 fail · 1125 s · sobre `18714959`. Tras el cambio de `merge.push`, juntado en el cierre: `cli:typecheck`, `cli:test` 1118/1118 y `claim.slow.test.ts` 29/29.
- Revisión final:
  - Spec opus+high, with fixes (2 Important, 9 Minor).
  - Código sonnet+high, with fixes (3 Important, 9 Minor).
  - Arquitectura opus+high, with fixes (6 Important, 5 Minor), sobre `b9915e91`.
  - La re-revisión (opus+high) dio los 11 Important por ADDRESSED y dejó 3 nuevos: 2 adjudicados y 1 decidido por el dev-lead y arreglado. Queda 1 sin revisar: el cambio de `merge.push`, juntado en el cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-20 · gate completo verde sobre `18714959`, más `cli:test` y `claim.slow` sobre el cambio de `merge.push` · campaña de 16 sujetos (id3 2/2, id1 e id4 4/4, id2 2/2, humo y tramo 3/3) · ejecución real del claim sobre el molde `reservas-remoto` y de `roadmap check`/`id claim` en un proyecto temporal · 1 sin revisar (el cambio de `merge.push`)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Al arrancar, el claim publica la reserva y la rama apunta a la `develop` publicada | suite | `claim.slow.test.ts`, «publishes the reservation» |
| Relanzado: «ya estaba…; nada que publicar» | suite | «is idempotent» |
| Las otras reservas se listan con «también publica» | suite | «lists the other unpublished reservations» |
| `develop` sacado con cambios: «destino con cambios…», código 1 | suite | «refuses a dirty develop worktree» |
| Otro clon publicó el id: «la 0203 pasa a 0204», chore, referencias y rama | ejecución real | molde `reservas-remoto` con la CLI real: «id: la 0012 ya la tiene otro en origin/develop; la 0012 pasa a 0013», rama `feature/0013-export-csv`; y la suite («renumbers when another clone…», «…already merged the remote», «renumbers every taken reservation») |
| Una carpeta propia se mueve y sus rutas se reescriben | suite | «renames a reserved folder with the id», «rewrites artifact paths» |
| Rama con commits propios o sucia | suite | «keeps the branch with own commits», «does not fast-forward a dirty branch» |
| El remoto avanzó: se vuelve a comprobar; tras 3, código 1 y `develop` como estaba | suite | «rechecks when the remote moved…», «gives up after 3 attempts», «rolls back on a merge conflict» |
| Integración protegida y etiqueta de otro clon | suite | «fixes the id with a tag…», «renumbers when the tag belongs…», «takes the moved path…» |
| Sin `merge.push: true`, solo la etiqueta | suite | «…with merge.push false», «…without merge.push» |
| Sin remoto o sin rama en el remoto: «sin remoto: la 0012 vale (contador local)» | ejecución real | `sdd id claim` en un repo sin remoto → código 0; suite: «…when the remote lacks the integration branch» |
| Subcarpeta: «sin comprobar en el remoto…» | suite | «skips the remote in a subfolder project» |
| Sin fila: libre, tomado por otra rama, fila publicada con su título, idempotente | suite | «checks a branch id without a row», «renumbers a taken branch id…», «takes a published row…», «is idempotent without a row…» |
| `tracker`: aviso y código 1 | ejecución real | `sdd id claim` con `ids.mode: tracker` → «El proyecto no está en modo 'sequence'…», código 1 |
| `--id 12`: código 2 | ejecución real | «--id debe ser un id de cuatro cifras: '12'», código 2 |
| `roadmap check` con `B3` en Later, en `sequence` y en `tracker` | ejecución real | «el id «B3» no es de la secuencia: resérvale uno con sdd id next --reserve» y «el id «B3» ya no se usa: usa el del ticket o 0000», código 1 |
| `sdd id next` cuenta las etiquetas | suite | «counts sdd-id tags» |
| `--help` lista `id next` e `id claim` | ejecución real | `node cli/bin/sdd.js --help` |
| `sdd-roadmap`: Later con id de la reserva, que se conserva al subir | ejecución real | campaña `id3` GREEN 2/2 |
| El arranque reclama el id (feature y patch con fila) y usa el de la rama sin fila | ejecución real | campaña `id1` e `id4` GREEN 4/4, `id2` 2/2 |
| La migración v3.0.0 da ids de una reserva | no probado | sin sujeto; la migración cierra con `sdd roadmap check`, que rechaza `B<n>` |

### 4.3 Residuales / deuda generada

- 1 sin revisar: sin `merge.push` solo la etiqueta, juntado en el cierre (25 líneas, con su test).
- Los Minor diferidos del ledger (`tasks.md`, `## Rulings`) van a una fila de deuda: la duplicación del patrón de rutas y del escaneo de ids, y los tests de los ANDs «sin fila» de carpeta.

## 5. Aprendizajes

- Un hook `pre-receive` de un remoto *bare* de test no puede mover refs: git lo ejecuta en cuarentena. «El remoto avanzó» salía como «integración protegida» sin que nada fallara. Queda en `tech-stack.md`.
- Un RED limpio repetido (`id2`, 2/2) quitó una frase de la spec aprobada. La regla del Art. I manda, pero es un desvío y se pregunta: lo cazó el eje Spec.
- La identidad por «la base común» se rompe en cuanto `develop` integra el remoto. Lo vio la revisión de dominio de la spec antes de escribir código, y queda en la ADR 0018.

## 6. Adendas
