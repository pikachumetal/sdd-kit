# Evidencia GREEN — vías de `brainstorming` 6.3.0 en `sdd-start-task` (2026-09-07)

Mismo escenario E5 que [`sdd-start-task-vias-red.md`](sdd-start-task-vias-red.md), con `sdd-start-task` **modificado** (commit `f8e07f7`: cuarta salida del enrutado *spike → `sdd-consult`*, fila de overrides acotada a `bounded`/`architectural` con el spike remitido al enrutado, y fila de racionalización *"«Pruébalo rápido» es verbo de acción, no consulta…"*). Prompt idéntico palabra por palabra, copia fresca del molde (`bookline-g5`), un subagente Sonnet, skill pegada por prompt desde el working tree. E1 y E4 no se relanzan: salieron limpios en el RED y la guidance que les correspondía no se escribió.

## Qué hizo — verificado en disco

| Comprobación | RED (E5) | GREEN (G5) |
| --- | --- | --- |
| Enrutado | task en modo lite | **spike** → `sdd-consult`, invocada con `Skill` |
| Rama | ❌ `feature/0000-export-pedidos-csv` | ✅ ninguna; sigue en `develop` |
| `.docs/sdd/specs/` | ❌ carpeta + `spec.md` de 89 líneas | ✅ solo `.gitkeep` |
| `superpowers:brainstorming` | invocada (y la vía ignorada) | no invocada: no es una task |
| Sonda | — | ✅ `_spike_csv_check.js` dentro de la copia, ejecutado y **borrado en el mismo paso**; `git status` limpio |
| Respuesta a la pregunta | ❌ sustituida por una spec a aprobar | ✅ «Sí, se puede», con la salida CSV real y lo confirmado en `package.json`, constitution y contrato |
| Handoff | — | a `sdd-start-task` solo si el usuario quiere construirlo; propone anotar el roadmap **sin tocarlo** («no lo toco sin que lo confirmes») |

## Veredicto contra el fallo del RED

- **F1 (el spike entra por `sdd-start-task` y sale como task)** → **corregido**. En sus palabras: *"encaja literalmente con el caso de spike descrito en la propia skill (…) Decidí **no** crear rama ni `spec.md`"*, y sobre la fila de racionalización: *"La skill marca explícitamente que eso es un error — la pregunta sigue siendo pregunta."*

## Hueco observado (no bloquea)

La sonda se escribió **dentro** de la copia del repo (borrada acto seguido, sin rastro en git), mientras que G2 la escribió fuera. Las dos cumplen "nada persiste". No se añade guidance sobre dónde vive la sonda: sería una regla sin fallo que la respalde.

## Nota de método

El agente invocó `sdd-kit:sdd-consult`, que resuelve a la copia en cache de v0.5.0 (sin el modo sondear), y aun así sondeó: la decisión de sondear vino del texto de `sdd-start-task` pegado por prompt. En un consumidor con el kit actualizado, ambas skills concuerdan.
