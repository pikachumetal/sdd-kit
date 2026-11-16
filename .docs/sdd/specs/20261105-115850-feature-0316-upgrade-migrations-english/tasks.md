---
id: 20261105-115850-feature-0316-upgrade-migrations-english
title: Tasks — Las migraciones de sdd-upgrade en inglés
spec: ./spec.md
plan: ./plan.md
created: 2026-11-05
---

# Tasks — Las migraciones de sdd-upgrade en inglés (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0316-upgrade-migrations-english`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Literales de forma y las migraciones cortas | done | `af186c9f` | |
| 2 | v2.0.0 y v2.3.0 | done | `e6acaa75` | |
| 3 | v3.0.0 y el humo | done | `73c4b25e` | humo `m1` 1/1 y `v1` 2/2, 1,39 $ |

## Verificación por task

- [x] Task 1 — `moon run cli:test` → 2210 passed · 12 skipped (2222); `kit:own` filtrado a sus migraciones → 0 líneas
- [x] Task 2 — `moon run cli:test` → 2210 passed · 12 skipped (2222); `kit:own` filtrado a v2.0.0 y v2.3.0 → 0 líneas
- [x] Task 3 — `moon run cli:test` → 2210 passed · 12 skipped (2222); `kit:own` filtrado a `migrations/` → 0 líneas; humo `m1` 1/1 y `v1` 2/2, puerta verde y rúbrica leída por el hilo

Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (plan), sobre 73c4b25e
Pasada de fix: juntada en el cierre, 7 hallazgos (grep antes → después; frases de skill, sin test de frase por la ADR 0019)

Re-revisión: 73c4b25e..cierre (juntada en el cierre), sdd-kit:effort-high + opus, limpia (7/7 resueltos, nada roto)

## Rulings

- Task 1: Ruling: la traducción literal de la verificación de v1.0.0 («only legacy.md (except …)») da el rojo «absoluta con excepción» de kit:own — la reescribo como «legacy.md, plus the capabilities that tasks created later, if any», mismo sentido — si está mal: una frase de una verificación vieja
- Task 3: Ruling: la tabla del paso 6 de v3.0.0 da 2 falsos positivos de castellano en kit:own (el texto va en código con doble comilla invertida, que la heurística no quita); la heurística está fuera de alcance, así que paso las dos parejas de líneas a bloques text, con el mismo texto y «with the rest of the line the same» — si está mal: la forma del paso 6 cambia de tabla a bloques; lo mira el eje Spec
- Task 3: Ruling: ««Datos», pendiente salvo que el dev-lead lo diga» del paso 2 pasa a «if the dev-lead doesn't say it», y no «unless», porque la celda ya lleva «only» y kit:own la daría como absoluta con excepción — mismo sentido — si está mal: una celda
- Final: Ruling: Now, Next, Later y §Testing sin «…» (eje Spec, Minor) — son nombres en inglés de la plantilla, iguales en los dos idiomas, y kit:own no los marca; citarlos no cambia lo que escribe el agente — si está mal: añadir comillas en 6 sitios
- Final: Ruling: not.toContain('**Writes**:') de migration-init-parity es menos discriminante que **Escribe**: (eje Código, Minor) — ninguna init lleva hoy esa etiqueta, y si una la llevara el test fallaría en voz alta, no en silencio — si está mal: un rojo falso en una init futura
- Final: Ruling: fixture v2.3.5.md mixto (eje Código, Minor) — decisión 4 de la spec: solo su forma, el texto sigue en castellano — si está mal: m2 lee una migración mixta
- Final: Ruling: battery.md de sdd-upgrade (V6 «cuando la Verificación lo permite») y de sdd-archive (**Escribe**) citan literales viejos (eje Código, Minor) — es prosa en castellano de las rúbricas y el molde de sdd-archive lleva su propia línea **Escribe**; decisión 4 — si está mal: una rúbrica describe un literal que ya no existe
- Final: Ruling: /pending/i de check.test.ts tan laxo como /pendiente/i (eje Código, Minor) — no es regresión — si está mal: nada nuevo
- Task 3: Ruling: el humo corrió v1 con la n de la batería (2), no la n = 1 de la spec: 3 sujetos, 1,39 $, por encima de la fila GREEN (1,1 $) y dentro del tope de 2,2 $ — no se repite tras el fix, porque el fix solo cambia literales que v1 no lee — si está mal: 0,55 $ de más
- Final: el ruling de la Task 1 sobre la verificación de v1.0.0 queda sustituido por el fix de la revisión final («no file other than `legacy.md` and …»), que recupera el «solo» de la fuente

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

Ninguno.
