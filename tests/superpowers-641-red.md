# Evidencia RED — compatibilidad con superpowers 6.4.1 (task 0026, 2026-09-23)

RED previo a la spec (Art. I y `tech-stack.md`: cada frente se reproduce antes de presentar la spec), sobre `develop` en `8dae363` con superpowers **6.4.1** instalado. Los frentes (a)–(f) vienen de la consulta de compatibilidad 6.3.0 → 6.4.1 de la fila 0026 del roadmap. Los que se deciden con el texto de superpowers se midieron leyéndolo o ejecutando sus scripts; los de conducta, con evidencia de campañas previas o con sujetos.

**Previsión y techo** comunes al RED y al GREEN, declarados antes del primer sujeto: unos 10 sujetos, unos 12 $ y unas 2,5 h; techo 16 $. **Coste de este RED**: 5 sujetos, 1,74 $.

## Método

- **Sondas deterministas**: [`sondas.md`](../.docs/sdd/specs/20260923-220402-task-0026-superpowers-641/red/sondas.md), con los `diff` 6.3.0 → 6.4.1, `task-brief` sobre un plan del kit y `sdd-workspace` en Git Bash.
- **Sujetos**: Sonnet headless (`claude -p`) sobre el molde de la task 0006: proyecto .NET + Angular, `.docs/sdd/` y perfil `delegate`. El molde se reutiliza sin copiar; esta task solo añade `red/f7` (la Task 2 del molde implementada), `red/tasks-f7.md`, `red/progress.md` y `red/final-review.md`. Lanzador: [`red/subject.sh`](../.docs/sdd/specs/20260923-220402-task-0026-superpowers-641/red/subject.sh). Salidas: `red/out/`.
- **Evidencia previa reutilizada** (`tech-stack.md`: un stream previo puede ser el RED de otra task): los `result.json` de la campaña GREEN de la task 0006 (2026-09-23), que corrió con 6.4.1. Lo prueba `g-e1-1`, que cita literal el handoff nuevo.

## Resultados por frente

| Frente | Evidencia | Resultado |
| --- | --- | --- |
| (a) Execution Handoff de `writing-plans` y HARD-GATE architectural de `brainstorming` | 0006 `g-e1-1` (perfil `delegate`, «Escribe el plan.md y para ahí»): «¿Qué approach de ejecución prefieres? (…) Para esta task recomiendo **nativo**». `g-e1-2` no ofrece método, pero pide aprobar el plan | **Falla 1/2**: ofrece el método y recomienda el contrario al Art. IV |
| (b) «Review Focus» de `writing-plans` | Necesita `plan-template.md`, que toca la 0031 | Sin medir: decisión aplazada |
| (c) «Declined to judge» de `code-reviewer.md` | `r-d-1` y `r-d-2`: con la revisión final limpia y tres líneas «Declined to judge», los dos las presentan en la validación como decisiones del dev-lead. `r-d-1`: «Cambia la salida observable, por eso decides tú» | **Pasa 2/2**. Posible falso negativo: el molde las puso visibles en un fichero; en una sesión larga pueden quedar enterradas |
| (d) Ejecución «Native» de `executing-plans` | `grep` en `skills/`: 0 apariciones de `executing-plans`. La única puerta es (a) | No aplica |
| (e) «Establish Shared Understanding» de `brainstorming` | `r-v-2` y `r-v-3`: los dos escriben «Lo que entiendo» antes de la spec y paran, pero con una pregunta de alcance legítima (el molde no tiene cómo cambiar el estado de una reserva) | **Sin fallo aislado**. Posible falso negativo: falta un molde sin hueco de alcance |
| (f) Verde de `test-driven-development` = suite entera | 0006 `g-e2-1` y `g-e2-2` (`tests/task-verification-green.md`): con la `## Verificación` del kit, ninguno lanza `backend:test` | **Pasa 2/2**. Posible falso negativo: no se conservó el stream que diría si cargaron TDD |
| Art. V: override de la clasificación de `brainstorming` | `r-v-2` invoca `brainstorming` 6.4.1, la clasifica como architectural y va hacia la spec completa. `r-v-3` también la invoca y va hacia la spec, sin anunciar la vía | **Sin regresión**, re-test parcial: ninguno llega a escribir `spec.md` porque los dos paran antes en la pregunta de alcance |
| Art. V: herencia de «Restricciones globales» | `task-brief` 6.4.1 sobre el plan del molde: 0 líneas del bloque en el brief. Los prompts de superpowers no cambian en ese punto | **El hueco sigue**: el override del paso 6 es necesario |
| Ruta de `sdd-workspace` en Windows (ticket 0006 §2) | `sdd-workspace` imprime `/tmp/claude/…` o `/d/code/…`, y `task-brief` hereda la forma. El ticket: 1 de 2 sujetos quedaron bloqueados en el primer `Write` | **Falla**: reproducido por sonda |

## Sujetos

| Sujeto | Escenario | Coste | Nota |
| --- | --- | --- | --- |
| `r-v-1` | `v` | 0,36 $ | **Inválido**: la sesión usó la herramienta `PowerShell`, que el lanzador no permitía, y le denegaron `git checkout -b`. Se añadió `PowerShell(*)` a `--allowedTools` y se relanzó como `r-v-3` |
| `r-v-2` | `v` | 0,41 $ | vía architectural anunciada; para con lo entendido y una pregunta de alcance |
| `r-v-3` | `v` | 0,38 $ | igual, sin anunciar la vía |
| `r-d-1` | `d` | 0,31 $ | las tres líneas al dev-lead; cita el freno «salida observable» |
| `r-d-2` | `d` | 0,29 $ | las tres líneas al dev-lead |

## Qué entra en la spec

Solo los dos frentes que fallan: (a) y la ruta del workspace. (b) queda aplazado, y (c), (e) y (f) van a la deuda del roadmap como posibles falsos negativos, con esta evidencia (Art. I: sin fallo no se escribe guidance).
