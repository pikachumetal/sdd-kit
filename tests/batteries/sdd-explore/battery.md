# Batería de regresión — `sdd-explore`

Pensar con el contexto del proyecto cargado, sin dejar artefactos propios: entender, sondear con una prueba desechable o estructurar con `sdd-grilling`. Nace en la feature 0161 como humo (Art. I: renombrar `sdd-consult` es editarla y se vuelve a medir su entrada), y mide además la salida cuando la conversación acaba en trabajo: una feature o un patch pasan por `sdd-roadmap`, y un config da su prompt de arranque directo. Los controles de pensar viven en la batería de `sdd-grilling` (g1, g9, k1).

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-explore`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`) y con 30 turnos como máximo. Un molde, `salas` (el de `tests/batteries/using-sdd/mold-salas`), con `control.profile: delegate` y `merge.push: true` en el marcador y `engines` en `package.json`. Si el kit que se prueba no tiene la skill esperada (el RED), la guarda de `subject_init` comprueba `using-sdd`.

**Dos veredictos.** `battery.sh` da el de la puerta (la primera skill invocada, columna «Esperado»; en el RED sale rojo por construcción, porque la skill se llama `sdd-consult`). El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt` y `state.txt` con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| e1 | control | ¿Dónde se cancelan las reservas? | salas | `sdd-kit:sdd-explore` | 2 | 2/2 | sonnet | batería de `sdd-grilling`, k1: entender sin interrogatorio ni artefactos |
| e2 | config | Estoy pensando en subir node a 22.18 en los engines de package.json. ¿Rompe algo? Si no, dame el prompt para hacerlo en otro worktree. | salas | `sdd-kit:sdd-explore` | 2 | 2/2 | sonnet | feature 0161: un config sale con su prompt de arranque |
| e3 | roadmap | ¿Se podría filtrar libres por planta? Si se puede, lo quiero. | salas | `sdd-kit:sdd-explore` | 2 | 2/2 | sonnet | feature 0161 (dev-lead, 2026-10-10): lo que acaba en trabajo pasa por el roadmap |

## Rúbrica

Una fila por conducta; «falla» con la cita literal o el fichero.

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| E1 Entender | e1 | crea rama, carpeta o fila; lanza una entrevista; o no dice dónde se cancela (`src/app.js`, el comando `cancelar`) |
| E2 Prompt de config | e2 | no termina con el prompt de arranque con esta forma: título sin id ni «—»; `Base: develop`; la rama `feature/<slug>` sola en su bloque; `Carril: config`; un segundo bloque que arranca con `sdd-propose` y lleva «Nada que saldar», «Perfil delegate» y «Al fusionar, `sdd merge --push`»; o escribe una fila, reserva un id o toca `package.json`; o no termina con «si prefieres hacerlo en esta sesión, di "arráncalo"» |
| E3 Pasa por el roadmap | e3 | tras responder no invoca `sdd-roadmap` (`tools.txt`); o invoca `sdd-propose`, crea rama o carpeta, o da un prompt de arranque sin fila |
| L Idioma | todos | algún mensaje al usuario en inglés |

## Procedencia de las reglas

Cada regla de `skills/sdd-explore/SKILL.md`, de dónde viene y qué escenario la cubre. Se rellena con el RED y el GREEN de la 0161 (`tests/sdd-explore-0161-red.md`, `-green.md`).

| Regla | Origen | Escenarios |
| --- | --- | --- |
| Overview, pasos 1-4, red flags y tabla: traducción de `sdd-consult` | tabla «Reglas que se mueven» de la spec de la 0161; evidencia de cada regla en `tests/sdd-consult-red.md` y `-green.md` | e1, y g1, g9, k1 de `sdd-grilling` |
| Paso 5: feature, patch y spike pasan por `sdd-roadmap`; explore no escribe la fila ni invoca `sdd-propose` | `tests/sdd-explore-0161-red.md`, e3: 2 de 2 traspasaron a `sdd-propose` sin fila; GREEN 2/2 | e3 |
| Paso 5: un config da su prompt de arranque con la plantilla, sin id, y la frase «arráncalo» | `tests/sdd-explore-0161-red.md`, e2: 2 de 2 dieron un prompt sin la forma fija; GREEN 2/2 | e2 |
| Red flag: invocar `sdd-propose` para una feature o un patch sin fila | RED e3 (la conducta del traspaso) | e3 |
