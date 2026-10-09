# GREEN — `sdd-propose`, feature 0160

Batería `tests/batteries/sdd-propose/`, Sonnet salvo `g1` (Opus), kit de la rama copiado al scratchpad. Salidas en `.docs/sdd/specs/20261009-110857-feature-0160-single-entry-propose/green/out/`. La puerta la da `battery.sh`; la conducta, la rúbrica de la batería, leída en `texts.txt`, `tools.txt` y los ficheros de cada sujeto.

## Task 2 — lo movido y traducido, sin cambiar reglas (controles)

14 sujetos, 2026-10-09, ~4,8 $. Kit: `sdd-propose` con el Gate 1 y los pasos 1-5 de `sdd-start-feature` traducidos y el árbol del patch de `sdd-start-patch`; `sdd-start-feature` desde su paso 6.

| Control | Puerta | Conducta | Lectura |
| --- | --- | --- | --- |
| s1 (spec) | 2/2 | **2/2** | las dos `spec.md` llevan el 🦆 antes de «## Capacidades», «## ✋ Decisiones que he tomado yo — valida estas» justo después, «## Dónde se prueba» y «## Términos y ADR» (S1-S3) |
| g1 (gate, Opus) | 2/2 | **2/2** | presentan «Apruebo (Recomendada)», «Cambios» y la opción de parar antes de la Task 1 para bajar a gama media; sin `AskUserQuestion` en `claude -p`, en prosa con las opciones literales (G1) |
| r1 (review) | 2/2 | **2/2** | las opciones llevan el modelo y recomiendan Opus por la regla de permiso por rol: «Un revisor, siete puntos, Opus (Recomendada)» (r1-2, R1) |
| p1 (plan) | 2/2 | **2/2** en P1 | `**Tras**:` en todas las tasks (1 y 2); «sin paralelo» en el plan de dos tasks. P2 (control de una regla de `plan-template.md` que no cambia): p1-2 `node --test test/cancel.test.js`; p1-1, con una sola task, `node --test` entero |
| l1 (lite) | 2/2 | **2/2** | citan las condiciones una por una; l1-1 recomienda lite, l1-2 full porque «el esquema de datos sí cambia: las salas pasarían a tener planta» |
| x1 (partir) | 2/2 | **2/2** | proponen partir con la partición y el motivo («partirla en 3 features…», x1-2) y la opción de aprobar la spec por delegación |
| c1 (fila de la rama) | 0/2 | **2/2** | los dos toman la fila 0010 como enunciado sin preguntar «¿qué tarea?». La puerta sale roja porque «/sdd-kit:sdd-propose» carga la skill como comando, sin llamada a `Skill` que la batería pueda leer: la conducta muestra que la cargaron (el aviso de fase y el paso 2 de la skill, literales) |

**Veredicto**: sin regresión en lo movido. El ruido de P2 en p1-1 (un plan de una sola task cuya verificación es la suite entera) no viene de lo movido: la regla vive en `plan-template.md`, que esta task no toca, y en la 0146 salió por el RED.

**Molde corregido**: el `subject.sh` guardaba como `spec-new.md` la spec de la task 0005 del molde (la elegía por fecha de modificación); desde esta task guarda la de la carpeta de fecha mayor, que es la que crea el sujeto. Los veredictos de s1 se leyeron sobre la spec real, copiada a `green/out/s1-<n>/spec-new.md`.
