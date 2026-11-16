---
id: 20261016-105021-feature-0149-archive
title: Tasks — archive: sdd-archive, cierre único de feature y patch
spec: ./spec.md
plan: ./plan.md
created: 2026-10-16
---

# Tasks — archive: `sdd-archive`, cierre único de feature y patch (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0149-archive`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Tronco de `sdd-archive`, rama de feature y enrutado | done | 7d0b66cd | el enrutado (`r1`, `r2`) se mide en la Task 5, con las skills viejas retiradas |
| 2 | Rama de patch y de hotfix | done | 3bc6cd16 | |
| 3 | Receta de merge, base integrada y rojo ajeno | done | 21eb46ca | `a3` partido en `a3` y `a3r` |
| 4 | Registros, ADR, «qué sigue» y guardas | done | f5d52697 | |
| 5 | Retirada de `sdd-end-feature` y `sdd-end-patch` | done | 8e591124 | |

## Verificación por task

- [x] Task 1 — `ArchiveSkill`, `WordBudget`, `Skills` (313/0); `a1` GREEN 2/2 tras un REFACTOR
- [x] Task 2 — `ArchiveSkill`, `WordBudget`, `PatchLane` (135/0); `a2` y `a4` GREEN 2/2 tras un REFACTOR
- [x] Task 3 — `ArchiveSkill`, `WordBudget`, `SyncMerge` (134/0); `a3`, `a3r` y `w1` GREEN 2/2 tras dos REFACTOR
- [x] Task 4 — `ArchiveSkill`, `WordBudget` (138/0); `a5` a `a9` GREEN 2/2
- [x] Task 5 — gate de cierre `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` (exit 0); `r1` y `r2` 1/1

Revisión final: Spec opus+high, 8 Important · Código sonnet+high, 2 Important · Arquitectura opus+high, 3 Important, sobre 8e591124
Pasada de fix: juntada en el cierre, 13 hallazgos RED→GREEN
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 11 de 13 resueltos, 2 abiertos y 2 Important nuevos adjudicados

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Task 1: Ruling: base dfce41a6 trae la fila de deuda «Al cerrar una pieza de una feature partida…» con destino 0149 — la cubre la decisión 14 de la spec; se salda al cerrar — coste si es erróneo: una fila sin saldar
- Task 1: Ruling: SKILL.md escrito antes de su Pester; el RED del Pester se demostró contra kit-develop (0 de 20) y el de la conducta lo da a1 — y el patrón del workaround corregido antes del GREEN ([^.]* cortaba en operations.md) — coste si es erróneo: un test que no ve un fallo del texto
- Task 1: Ruling: el GREEN de a1, r1 y r2 eligió sdd-end-feature/sdd-end-patch porque siguen en el kit hasta la Task 5 — apartado en green-premature/ (0,90 $); a1 pide sdd-archive por su nombre (como c3 de sdd-verify) y r1/r2 pasan a la verificación de la Task 5 — coste si es erróneo: el enrutado no se mide hasta el final
- Task 1: Ruling: A3 se puntúa por la fila de deuda, no por tech-stack.md: ningún sujeto, ni el RED, escribe el workaround en el stack, así que la regla queda como control con su origen de campo (ticket 0010b §3) — coste si es erróneo: la regla no tiene RED propio
- Task 2: Ruling: RED de a4 descartado (red-discarded/): la petición nombraba «el hotfix del login» y v3.0.1 sobre un molde de la 0008 en v0.3.0; corregida a «hotfix 0008», v0.3.1, y TURN2 dice que contesta a la migración — coste si es erróneo: 0,5 $ de un sujeto
- Task 2: Ruling: la copia RED difiere solo en añadir records.md a la lista de referencias de anatomía (nace en el REFACTOR) — coste si es erróneo: ninguno
- Task 4: Ruling: el test de commit-milestones.md buscaba la frase en inglés y el fichero es castellano; corregido antes del GREEN — coste si es erróneo: ninguno
- Task 4: Ruling: SKILL.md de sdd-archive en 3596/3600 y el total en ~5937/6000: sin el margen de ~300 para la pasada de fix que preveía la spec. Para caber, estimation.md se funde en el SKILL (regla del ±30 %), el detalle de capacidades del patch pasa a records.md y las citas de evidencia van a la batería — coste si es erróneo: una pasada de fix que no cabe pide subir el tope al dev-lead
- Task 4: Ruling: commit-milestones.md pierde dos citas de evidencia (tickets 0089/0099/0029 y native-adapt-red) para que sdd-start-feature quepa en su total (11464) — coste si es erróneo: la procedencia queda en los tickets y en tests/native-adapt-red.md
- Task 5: Ruling: RoadmapClosing exigía que el cierre no copiara el prefijo de la plantilla; sdd-archive lo lleva literal porque, por remisión, 1 de 2 sujetos de a2 marcó la deuda con «✅» y con el literal 2 de 2 la cerraron bien — coste si es erróneo: dos copias del formato que pueden divergir
- Task 5: Ruling: la ADR 0015 nombra en rutas skills/sdd-end-feature/SKILL.md, que se retira; las ADR son inmutables, así que no se edita y VerifySkill deja de comprobar que cubre sdd-archive; fila de deuda al cerrar para que el dev-lead decida si la sustituye otra ADR — coste si es erróneo: decision index no ofrece la 0015 a quien toque sdd-archive
- Task 4: minor (deferred): «qué sigue» y la línea `ADR: … → decisions/…` se parafrasean (a5 0/2 literal, a6 1/2); subir los literales al SKILL.md no cabe en el tope de 3600 — lo decide el dev-lead
- Final: Ruling: dos tests de las Tasks 1 y 3 cambian en la pasada de fix: el del 4.1 (lo sustituye el de la enmienda aprobada, sha de la validación) y el del informe de rojo (`<merge.into>` en lugar de `develop`, Minor 4 del eje Spec) — coste si es erróneo: ninguno, los dos siguen la regla nueva
- Final: Ruling: la Task 4 quitó 'estimation.md' de la lista de referencias de un Pester RED de la Task 1 al fundir esa referencia en el SKILL.md (eje Código, I2) — el test sigue comprobando que existen las referencias que la skill enlaza — coste si es erróneo: ninguno
- Final: Ruling: las rutas de las ADR 0005 y 0015 nombran skills retiradas y las ADR son inmutables (eje Arquitectura, I3) — la ADR candidata de la 0149 lleva rutas skills/sdd-archive/** y cita las dos; fila de deuda para que el dev-lead decida si se sustituyen — coste si es erróneo: decision index no ofrece la 0005 ni la 0015 a quien toque sdd-archive
- Final: minor (deferred): aprendizajes-skills.md conserva los números de paso de sdd-end-feature y sigue en castellano — a la 0152, con la traducción (Art. III)
- Final: minor (deferred): patch-template.md no tiene campo proposal: aunque «qué sigue» lo lee del patch.md — a la 0152
- Final: minor (deferred): dónde va el commit del arreglo si el rojo es de la rama tras el merge de sincronización — hueco de la spec, a la 0152
- Final: minor (deferred): la receta repite en prosa el predicado de solo-docs y la unión de registros que ya tiene la CLI — a la 0193 (un verbo de sincronización que reutilice las dos piezas)
- Final: minor (deferred): sdd decision check no avisa de un glob de rutas que no casa con ningún fichero — a la 0193 o la 0152
- Final: minor (deferred): la rúbrica de a4 no mide el --check --into ni el git fetch previo, y los casos «sin frase», «sin publicar» y «sin migrations/» solo los fija un Pester
- Final: Ruling: el test de la Task 2 «comprueba la rama estable con merge --check --into» pasa a buscar `--check --into <stable>` porque el pre-check del hotfix sube a las comprobaciones previas (Minor 9 del eje Spec) — coste si es erróneo: ninguno
- Final: Ruling: I5 Spec (literal de «qué sigue», a5 1/2 exacto) queda abierto — el literal ya vive en el mensaje final; a5-2 parafrasea la forma, no el contenido — coste si es erróneo: un mensaje final con la familia dicha con otras palabras
- Final: Ruling: I3 Arquitectura (rutas de las ADR 0005 y 0015) lo cubre el cierre: la ADR 0016 lleva rutas skills/sdd-archive/** y cita las dos, y la deuda gana su fila — coste si es erróneo: ninguno
- Final: Ruling: el sha de la validación (4.1 y --verified-at) cae en el tramo que el squash del cierre junta cuando hay pasada de fix (re-revisión, Important nuevo 1) — no se arregla tras la re-revisión; fila de deuda para que el dev-lead decida qué sha se cita (el de la última task con el mismo código, como hizo a3n-1, o el del commit de cierre) — coste si es erróneo: el walkthrough cita un sha inalcanzable hasta que se decida
- Final: Ruling: la cláusula «even if the user is away or only said «cierra»» de la validación en campo, quitada al recortar (re-revisión, Important nuevo 2), vuelve en el commit de cierre — sin revisar en ✋ — coste si es erróneo: una frase que nadie revisó en una regla con RED propio
- Final: Ruling: la aserción de KitFeedback.Tests.ps1 sigue la frase nueva de la oferta del ticket tras el recorte — coste si es erróneo: ninguno, la regla es la misma
- Final: minor (deferred): la red flag del descarte pide teclear `discard` y la comprobación previa da por buena la respuesta «descártalo» — unificar en la 0152
- Final: minor (deferred): con merge.removeWorktree: true, la línea de terminado y el párrafo del ticket siguen dando por vivo un worktree ya borrado — a la 0152
