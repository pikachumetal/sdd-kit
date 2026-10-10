# GREEN — `sdd-implement` (feature 0147)

Mismos escenarios que el [RED](sdd-implement-red.md), con el kit de la rama (copia del árbol de trabajo en el scratchpad). Batería: [`tests/batteries/sdd-implement/`](batteries/sdd-implement/battery.md); salidas en [`green/out/`](../.docs/sdd/specs/20261010-174401-feature-0147-implement-fork/green/out/).

## Task 2 — lo movido, sin cambiar reglas (`u1`, `u2`)

`u1` y `u2` vienen de la batería de `sdd-start-feature` (0146): miden la acción update, que se movió del paso 6 a `sdd-implement`. Su petición sigue entrando por `sdd-start-feature` («Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 6…»), porque eso mide también el traspaso.

| Ronda | Paso 6 de `sdd-start-feature` | `u1` | `u2` | Coste |
| --- | --- | --- | --- | --- |
| 0 | Una línea: «invoca `sdd-implement` con `Skill`: ejecuta el plan…» | 0/2 | 0/2 | ~1,3 $ |
| 1 | «**lo primero de este paso, también al retomar una task a medias, es invocar `sdd-implement` con `Skill`; no implementes ni resuelvas nada de la task desde aquí**», más su red flag y su racionalización | 2/2 | 2/2 | ~2,7 $ |

- **Ronda 0**: ninguno de los cuatro sujetos invocó `sdd-implement`. Se quedaron en `sdd-start-feature` y resolvieron el desvío a su manera: sin 🦆 ni ✋, con la nota en `tasks.md` y no en `spec.md`, o con la enmienda «sin aprobar» en `delegate`. El veredicto de la puerta salió verde (la primera skill era `sdd-start-feature`), y por eso la conducta se lee aparte. Salidas de la ronda 0 fuera de la evidencia versionada: sustituidas por la ronda 1.
- **Ronda 1**: los cuatro invocan `sdd-kit:sdd-implement` tras `sdd-start-feature`. Los cuatro paran con 🦆 y «✋ Me salí del plan en la Task 2: …», y dejan el THEN corregido en su sitio de `spec.md` con su línea en «Enmiendas» antes de la aprobación. En `u2`, los dos añaden `### Task 3 — enmienda 2026-10-10: --por <nombre> en cancelar` al plan y anotan en `tasks.md` la Task 1 como `afectada por enmienda 2026-10-10 → Task 3`. Como matiz, `u2-2` junta la Task 2 y la Task 3 en un mismo commit, y lo dice en «Rulings».

Aprendizaje: **una línea de traspaso a otra skill no basta para que el sujeto la invoque**. Hace falta decir que es lo primero del paso y prohibir seguir desde ahí. Va a `tech-stack.md` en el cierre.

## Task 3 — reglas nuevas de implement

| Regla | Escenario | Ronda 0 | Ronda 1 | Ronda 2 |
| --- | --- | --- | --- | --- |
| Decálogo en el encargo | `r1b` | **2/2**: los dos sacan el informe a funciones propias (≤ 15 líneas) con una tabla de agrupaciones; `run` crece 2-3 líneas | — | — |
| Decálogo despachado tal cual (SDD) | `h2` | no medible: `tools.txt` no guarda el prompt del despacho y el stream crudo se sobrescribió | **2/2 despachos** lo llevan (stream crudo) | 2/2 despachos |
| Recuperación tras corte por cuota | `r4` | **2/2**: los dos leen `task-2-report.md`, no relanzan al implementador, despachan la revisión de la Task 2 y dejan `Task 2: Ruling: recuperación tras corte por cuota — …` | 1/1 | 1/1 |
| Workspace anunciado | `h1`, `h2`, `r4` | 0/4 (la línea a mitad del paso 2 de la preparación) | 1/3: sale en `h1`; no en `h2` ni al retomar (`r4-3`). Regla subida a «tu siguiente mensaje», con red flag | 2/3: sale en `h2` y al retomar (`r4-3`, con `· retomo en la Task 2`); no en `h1`. Regla también al principio de la skill |
| Commits por ruta, bucles Native y SDD (humo) | `h1`, `h2` | limpios: `git add <rutas>`, ledger con `complete` por task, implementador y revisión por task con «Restricciones de código», fix por subagente | limpios | limpios |

El anuncio del workspace queda en **3 de 6** en las rondas reforzadas y no se itera más (coste): fila de deuda «Esperar 2.º ticket», con la salida de sacarlo a la CLI (`sdd workspace` imprime la línea y el hilo la copia), como el anuncio de `sdd-propose` (4/6, 0160).
