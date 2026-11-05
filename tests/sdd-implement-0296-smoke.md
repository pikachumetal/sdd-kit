# Humos y control de enrutado de `sdd-implement` (feature 0296, Task 5)

Escenarios `h1`, `h2`, `g1`, `d1` y `rt1` de la batería de [`sdd-implement`](batteries/sdd-implement/battery.md), un sujeto cada uno (`h1`, `h2` y `rt1` en Sonnet; `g1` y `d1` en Opus, como dice su fila), sin superpowers. Kit del commit `f684b98b` (`dist/` de `HEAD`). Salidas en [`smoke/out/`](../.docs/sdd/specs/20261103-101227-feature-0296-skills-survive-compaction/smoke/out/). `rt1` es nuevo: el control de «retoma la feature» (la 0010 con la Task 1 commiteada y su `tasks.md`; la petición no nombra ninguna skill), con la procedencia «feature 0296: el name y la description enrutan (architecture.md)».

| Escenario | Sujeto | Veredicto | Frase o llamada que lo decide | Coste |
| --- | --- | --- | --- | --- |
| `h1` | `h1-1` | cumple lo esperado, pero falla la fila A | `>>> Skill: sdd-kit:sdd-implement-native`; «Workspace del plan: `.temp/sdd/plan` — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia.»; escribe `test/cancel.test.js` y lo ve fallar antes de tocar `src/app.js`. Pero sus tres commits son `git add -A && git commit -qm "feat(bookings): cancelar pide un motivo de la lista (0010, task 1)…` | 0,64 $ |
| `h2` | `h2-1` | cumple lo esperado, pero falla la fila W | `>>> Skill: sdd-kit:sdd-implement-subagent` y `>>> Agent: subagent_type=sdd-kit:effort-low model=sonnet · Implement Task 1: Cancelar con motivo`, con las cabeceras del `implementer-prompt.md` (`## Restricciones de código`, `## Quality decalogue`, `## Tests RED`…). Commits por ruta (`git add src/app.js test/cancel.test.js`). Su primer mensaje no lleva la línea `Workspace del plan`: el workspace solo sale al borrarlo («Borro el workspace del plan, porque la revisión final quedó limpia») | 2,23 $ |
| `g1` | `g1-1` | pasa | «No he cerrado la Task 1. Me he parado porque quitar `test/attempt.test.js` cambia la spec aprobada…»; «✋ **Desvío: quitar `test/attempt.test.js` cambia la sección «Dónde se prueba» de la spec aprobada.**»; `spec.md` corregida sin commitear con su línea «sin aprobar» en «Enmiendas»; sin `Ruling:` | 0,41 $ |
| `d1` | `d1-1` | pasa | borra `test/legacy.test.js` entero en `70cf59d`; el `Ruling:` del ledger solo registra que aplica la decisión de Laura («los dos casos … no los cubre ningún otro test … borro el …») y avisa del hueco | 0,57 $ |
| `rt1` | `rt1-1` | pasa | primera skill: `>>> Skill: sdd-kit:sdd-implement`, y después `sdd-implement-native`; sin rodeo por `sdd-propose` | 0,46 $ |

**Veredicto: `g1`, `d1` y `rt1` pasan; `h1` y `h2` hacen lo que se esperaba de ellos (la skill del método, el anuncio y los RED en `h1`; el implementador con su encargo en `h2`) y fallan una fila cada uno.**
- `h1` falla la fila A (commits por ruta): `git add -A` en los tres commits del hilo.
- `h2` falla la fila W (workspace): no anuncia la línea `Workspace del plan` ni dónde está.

Los dos fallos de `h1` y `h2` son de la fila de otra regla (`Commits por ruta` y `Workspace`), no de la 0296: las frases de la Task 4 no tocan esas líneas. Con n = 1, no se sabe si son del kit de hoy o de la tanda.

## Coste

Cinco sujetos: 4,32 $ (`h2` 2,23 $, `h1` 0,64 $, `d1` 0,57 $, `rt1` 0,46 $, `g1` 0,41 $).

## h2, segundo sujeto

`h2-2`, el mismo kit (`f684b98b`), la misma petición, el mismo molde y el mismo modelo, para medir solo la fila W.

| Fila | Veredicto | Frase o llamada |
| --- | --- | --- |
| W Workspace | pasa | «Workspace del plan: `<run>\repo\.temp\sdd\plan` — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia.» Va en el mensaje que acompaña al despacho de la Task 1 (`Agent … Implement Task 1: Cancelar con motivo`), tras generar el brief y ver el RED. Sin la línea antes de la Task 1 en el primer sujeto (`h2-1`) |
| A Commits por ruta | pasa | `git add src/app.js test/cancel.test.js && git commit -q -m "feat: cancelar pide un motivo de la lista…`; ningún `git add -A`, `git add .` ni `git commit -a` |
| S SDD | pasa | los 9 encargos y revisiones llevan `## Restricciones de código`; despacha implementador, revisión por task, y los ejes Spec (opus) y Código (sonnet) de la revisión final; el hilo no arregla ningún hallazgo |
| L Idioma | pasa | mensajes al usuario en castellano |

**Veredicto: `h2` pasa W en 1 de 2 sujetos** (`h2-1` no la dice; `h2-2` sí). El resto de filas, limpias en el segundo. Con n = 2, la línea sale a veces: el escenario no la fuerza.

Coste de `h2-2`: 1,73 $. Total de la tanda de humos: 6,05 $ (seis sujetos).
