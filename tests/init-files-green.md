# GREEN — lo que crean las init (task 0019)

Mismos frentes que [`init-files-red.md`](init-files-red.md), ahora con el kit de la rama.

**Método**:
- Siete escenarios de un turno y 2 sujetos Sonnet headless cada uno, lanzados con [`green/run.sh`](../.docs/sdd/specs/20260922-211157-task-0019-init-files/green/run.sh) y `driver.py`.
- Moldes en `green/molds/`, generados por `make_molds.py`. En G4 el molde redirige la memoria con `autoMemoryDirectory` a una carpeta propia, así que ningún sujeto toca la memoria real de la máquina.
- Salidas en `green/out/<etiqueta>/`. Cada una tiene `transcript.md`, `tools.txt` y `state.txt`, y la foto de disco sin el punto inicial (`docs/`, `claude/`, `gitignore`, `memory/`).

## Veredicto por THEN

| Escenario | THEN | Resultado | Evidencia |
| --- | --- | --- | --- |
| G1 greenfield, estructura | log generado por el script, 0 filas, sin copia del script | **2/2** | `g1a`, `g1b`: primera línea `<!-- AUTO-GENERADO por Build-EstimationLog.ps1 (sdd-kit)`, `state.txt` «ninguno» |
| G1 | `.gitignore` con `.playwright-mcp/` y `.superpowers/` | **2/2** | `g1a/gitignore`, `g1b/gitignore` |
| G1 | `.claude/settings.json` con `"autoMemoryEnabled": false` | **2/2 intentado con el contenido correcto; escritura bloqueada por el harness** | `Write` con `{"autoMemoryEnabled": false}`; el harness responde «Claude requested permissions to write to …\.claude\settings.json, but you haven't granted it yet» y el sujeto pide el permiso al usuario |
| G2 brownfield, estructura | log del script y `.gitignore` conservando `node_modules/` | **2/2** | `g2a`, `g2b` |
| G2 | fusión de `settings.json` sin perder `permissions` | **2/2 intentado correcto; escritura bloqueada por el harness** | `Edit` con `{"permissions": {"allow": ["Bash(npm test)"]}, "autoMemoryEnabled": false}` |
| G3 clave a `true` | pregunta antes de cambiarla y no la cambia | **2/2** | `g3a`, `g3b`: «¿Lo pongo en `false` … o lo dejo como está?»; `claude/settings.json` sigue en `true` |
| G4 migración, sin dev-lead | configuración aplicada; tabla de entradas con destino; 0 borrados; pendiente con cómo reanudar | **1/2 → 2/2 tras el REFACTOR** | `g4a` listó las entradas sin destino; `g4b` sí. Tras el REFACTOR, `g4ra` y `g4rb` presentan la tabla («ya está en `tech-stack.md`» ×2 y un destino propuesto) y las 4 entradas siguen en `memory/` |
| G4b migración, gate aprobado | la entrada nueva volcada, las 3 borradas, sin duplicar | **2/2** | `g4c`, `g4d`: «martes y jueves» en `constitution.md`, `memory/` solo con `MEMORY.md`, «Sonnet» una sola vez en `tech-stack.md` |
| G5 pregunta 21 | la siguiente pregunta es la del proyecto de referencia, sola | **2/2** | `g5a`, `g5b`: «Pregunta 21: ¿Replica patrones de otro proyecto…?» |
| G6 tabla de release | cabecera literal | **2/2** | `g6a`, `g6b`: `\| id \| Task \| Origen \| Ficheros que toca \| Estado \|` |
| G6 | la celda «Ficheros que toca» nombra ficheros o módulos | **1/2 → 2/2 tras el REFACTOR** | `g6b` escribió «por definir»; tras el REFACTOR, `g6ra` y `g6rb` escriben `src/invoice.js` |

## REFACTOR

- **G4, dev-lead ausente**: el paso 4 de `v1.2.0.md` decía «presentar una tabla» bajo el gate, y `g4a` lo leyó como algo que se hace solo con el dev-lead delante. Ahora dice «Si el dev-lead no está, la tabla va igual en el informe y no se borra nada». Re-verificado 2/2 (`g4ra`, `g4rb`).
- **G6, «por definir»**: la plantilla no decía qué hacer sin código previsto. `sdd-start-release` paso 5 dice ahora que la celda nombra los ficheros o módulos leídos del código y, si aún no existen, la carpeta o el módulo donde irán, «nunca «por definir»». La regla va en el `SKILL.md` y no solo en la ayuda de la plantilla, porque es lo que decide. Re-verificado 2/2 (`g6ra`, `g6rb`).

## Observación del harness

En `claude -p`, Claude Code pide permiso explícito para escribir `.claude/settings.json` aunque el modo sea `acceptEdits`. Los ocho sujetos que tenían que escribirlo (G1, G2 y G4) prepararon el contenido correcto y pidieron el permiso o dejaron el paso pendiente con cómo reanudarlo. En una sesión interactiva ese permiso es un prompt al usuario. Por eso la escritura efectiva del fichero queda como **no probado** en ejecución real: está verificado el contenido intentado, no el fichero escrito. No hace falta guidance: 8/8 lo gestionaron bien.

## Coste

GREEN: 6,32 $ en la primera ronda (14 sujetos) y 1,82 $ en la re-verificación (4 sujetos), 8,14 $ en total. Con el RED (1,87 $), la task lleva 10,01 $ de un techo de 25 $.
