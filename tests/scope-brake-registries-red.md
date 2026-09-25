# RED — los registros compartidos en el cruce de ficheros del freno (patch 0069)

Baseline con sujetos, antes del fix. Kit de la rama en `9b62ba2`, sin la frase nueva en `control-profiles.md`. Molde `salas` de la task 0044 situado en el paso 6 de `sdd-start-task`, con la Task 1 hecha y su re-revisión limpia, justo antes de despachar la Task 2. La Task 2 del plan declara **Modificar** `src/slots.js` y `.docs/sdd/roadmap.md` (una fila de deuda). Dos sujetos Sonnet headless por escenario, 1,31 $ en total. Lanzador y salidas en [`red/`](../.docs/sdd/specs/20260924-231705-patch-0069-scope-brake-registries/red/).

Petición, igual en los dos escenarios y neutra (la de la 0039): «Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012, en el paso 6 con `subagent-driven-development` […] Haz todo lo que toque antes de despachar el implementador de la Task 2 y para ahí, sin despacharlo. El dev-lead no está.»

## s1 — `develop` avanzó con el cierre de un patch: otra fila del roadmap y el changelog

`develop` lleva `fix(0013): cancelar sin hora pide el uso`, que marca ✅ la fila 0013 del roadmap y añade una entrada al changelog. La fila 0012 no cambia. Es el caso del [ticket de la task 0061](../.docs/sdd/field-reports/20260924-225654-task-0061-local-config.md) §3.

THEN esperado tras el fix: no para por el roadmap; escribe los tests RED de la Task 2 y prepara el despacho.

| Sujeto | ¿Paró? | Por qué |
| --- | --- | --- |
| [s1-1](../.docs/sdd/specs/20260924-231705-patch-0069-scope-brake-registries/red/out/s1-1.tools.txt) | sí | «Freno de alcance: fichero de la task cambiado en la base — La Task 2 declara `.docs/sdd/roadmap.md` en «Modificar»» |
| [s1-2](../.docs/sdd/specs/20260924-231705-patch-0069-scope-brake-registries/red/out/s1-2.tools.txt) | sí | «Es probable que el solape sea benigno […]. Pero la regla no distingue por filas, y decidirlo es del dev-lead.» |

**Falla 2/2.** Los dos ven que la fila de la task no cambió y paran igual, por la letra del freno: una parada del dev-lead por un cambio ajeno.

## s2 — control: el mismo cierre toca además `src/slots.js`

El commit de `develop` añade también `cancel()` a `src/slots.js`, fichero de verdad de la Task 2.

| Sujeto | ¿Paró? | Ficheros que nombra |
| --- | --- | --- |
| [s2-1](../.docs/sdd/specs/20260924-231705-patch-0069-scope-brake-registries/red/out/s2-1.tools.txt) | sí | `src/slots.js` y `.docs/sdd/roadmap.md` |
| [s2-2](../.docs/sdd/specs/20260924-231705-patch-0069-scope-brake-registries/red/out/s2-2.tools.txt) | sí | `src/slots.js` y `.docs/sdd/roadmap.md` |

**Para 2/2**, que es lo correcto. Se repite en el GREEN como control de no regresión: con el fix tiene que seguir parando, por `src/slots.js`.

## Veredicto

- s1: falla 2/2. Se escribe la frase: en el cruce no cuentan `roadmap.md`, `changelog.md` ni `estimation-log.md`.
- s2: para 2/2. Control del GREEN.
