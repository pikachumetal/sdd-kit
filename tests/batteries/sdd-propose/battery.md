# Batería de regresión — `sdd-propose`

La entrada única del kit: cómo clasifica `sdd-propose` un cambio en uno de cinco carriles (config, patch, lite, feature, spike), cuándo anuncia y cuándo pregunta, y cómo escribe la spec y el plan. Nace en la feature 0160, completa (Art. I: skill de entrada y de propose), y hereda de la batería de `sdd-start-feature` los escenarios de spec y plan de la 0146 (s1, g1, r1, p1). El **paso** agrupa los escenarios por regla: `ceremony`, `config`, `spike`, `plan` y `control`; `config-gate` es solo de GREEN.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-propose`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`). Un molde, `reservas` (`mold-reservas/`): el de la 0146 (glosario con **Cancelación** y **Anulación**, comandos `cancelar` y `anular`, constitution con el gate `node --test`) más `.docs/sdd/operations.md`, cuyo «Gate de cierre» es `node --test && node scripts/lint.mjs` —distinto del de la constitution, para que se vea de dónde sale—, `.docs/sdd/estimation.md` y `package.json` con `engines`. Perfil `delegate`. Los artefactos de las features 0010 y 0011 están en `fixtures/`.

**Montaje por escenario**, en `subject.sh`: `a1` en `develop` con un `sdd-kit.local.json` que trae `merge.push`, clave de política que el fichero local no fija; `a2` y `a3`, con el fallo plantado (`findBooking` busca solo por sala, y «cancelar Norte mar» cancela la reserva del lunes y responde «cancelada Norte mar»); `k3`, en `main`; `k4`, con un test en rojo; `p2`, `s1`, `g1`, `r1`, `p1` y `c1`, en la rama de su feature con sus artefactos, como en la batería de `sdd-start-feature`. `TURN2`: «Sí, como patch.» en `a2`, «Sí.» en `k1`, `k3` y `k4`.

**Petición por fase.** En el RED la skill no existe: `subject.sh` pasa `using-sdd` a la guarda de `subject_init` y, en las peticiones que nombran `sdd-propose`, la sustituye por `sdd-start-feature`, que es donde viven hoy esos pasos. En `claude -p` no existe `AskUserQuestion` (feature 0146): una pregunta cuenta si el sujeto la intenta o la hace en prosa con sus opciones.

**Dos veredictos.** `battery.sh` da el de la puerta (la primera skill invocada, columna «Esperado»). El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt`, `state.txt` y los ficheros que deja cada sujeto con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| a1 | ceremony | Quiero que el responsable de sala pueda anular reservas de otros. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | propuesta 0131, §Marco y carriles: full anuncia y sigue |
| a2 | ceremony | Si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | propuesta 0131: patch pregunta; 0130: estimación previa del patch |
| a3 | ceremony | patch: si cancelo Norte el martes, que no tengo reservado, me dice "cancelada Norte mar" y me quita la del lunes. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | propuesta 0131: se respeta el carril de la petición si concuerda |
| a4 | ceremony | patch: avisa cuando una sala pase de 10 reservas en un día. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | propuesta 0131: si la investigación ve un carril más pesado, pregunta |
| k1 | config | Sube la versión mínima de node a 22.18 en los engines de package.json. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | enmienda de la propuesta 0131 del 2026-10-09: carril config |
| k3 | config | Sube la versión mínima de node a 22.18 en los engines de package.json. | reservas-main | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | revisión de la spec 0160 (dominio 7): config en la rama estable |
| k4 | config-gate | Sube la versión mínima de node a 22.18 en los engines de package.json. | reservas-rojo | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | revisión de la spec 0160 (técnica 4): config con el gate en rojo |
| k2 | spike | ¿Aguanta el comando libres con 1.000 reservas? Quiero la tabla de medidas. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | propuesta 0131: spike con evidencia frente a explore |
| p2 | plan | Invoca la skill sdd-kit:sdd-propose y sigue: paso 5. La spec de la 0010 está aprobada: escribe el plan. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | ticket de la feature 0146 (menores): el plan inventa el comando de su gate |
| s1 | control | Invoca la skill sdd-kit:sdd-propose y sigue: paso 4. La entrevista ya está hecha; decidido con el dev-lead: al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña. Sin review. Escribe la spec en su carpeta y preséntamela para aprobar. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | batería de `sdd-start-feature`, s1 (feature 0146) |
| g1 | control | Invoca la skill sdd-kit:sdd-propose y sigue: paso 4. La spec de la 0010 está escrita y repasada, sin review. Preséntamela para aprobar. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | opus | batería de `sdd-start-feature`, g1 (feature 0146) |
| r1 | control | Invoca la skill sdd-kit:sdd-propose y sigue: paso 4. La spec de la 0011 está escrita. Cuenta las señales y decide la review antes de presentármela. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | batería de `sdd-start-feature`, r1 (feature 0146) |
| p1 | control | Invoca la skill sdd-kit:sdd-propose y sigue: paso 5. La spec de la 0010 está aprobada: escribe el plan. | reservas-sin-ops | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | batería de `sdd-start-feature`, p1 (feature 0146); traspaso (feature 0160) |
| l1 | control | Que el comando libres acepte también la planta. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | `tests/sdd-start-task-lite-green.md`: lite se ofrece citando las condiciones |
| x1 | control | Quiero usuarios con login, que el responsable de sala tenga su rol, que cada reserva guarde quién la hizo y migrar las reservas de ahora a un usuario genérico. | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | `tests/control-profiles-red.md` (E11), `tests/split-threshold-red.md`, `tests/fewer-stops-red.md` (s2): partir y aprobar por delegación |
| c1 | control | /sdd-kit:sdd-propose | reservas | `sdd-kit:sdd-propose` | 2 | 2/2 | sonnet | `tests/control-profiles-red.md` (E1): la fila de la rama es el enunciado |

## Rúbrica

Una fila por conducta; «falla» con la cita literal o el fichero.

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| A1 Anuncia y sigue | a1 | pregunta el carril, el modo o el perfil antes de la primera pregunta de diseño; o no nombra el carril y el perfil con el nivel del que sale; o no avisa de `merge.push` en `sdd-kit.local.json`; o no da la frase «apruebo la spec por delegación» |
| A2 Patch pregunta | a2 | crea rama, carpeta o id antes de preguntar el carril; o la pregunta no lleva delante un párrafo que empiece por 🦆; o no lleva la estimación en horas; o, tras el turno 2, `patch.md` §5 no tiene `- Estimación:` y `- Inicio:` antes del commit del fix |
| A3 Carril de la petición | a3 | pregunta el carril (patch o feature) antes de investigar el fallo |
| A4 Carril por debajo | a4 | sigue como patch; o anuncia feature sin preguntar; o no nombra lo que tendría que decidir él (el texto del aviso, dónde sale) |
| K1 Config | k1, k3, k4 | edita antes de preguntar; o commitea sin correr `node --test && node scripts/lint.mjs`; o el cuerpo del commit no lleva una línea `Gate:` con el comando y su resultado; o crea carpeta en `specs/`, id o entrada de changelog; en k3, commitea en `main`; en k4, commitea con el gate en rojo |
| K2 Spike | k2 | entra por `sdd-consult`, o no dice que es un spike, o pregunta el carril |
| P2 Gate del plan | p2 | la línea del gate de cierre de §3 del `plan.md` no dice `node --test && node scripts/lint.mjs` |
| P3 Traspaso | p1 (GREEN de la Task 3) | con el plan escrito, no invoca `sdd-start-feature` ni dice que sigue con él |
| S1, S2, S3, G1, R1, P1 | s1, g1, r1, p1 | las filas de la batería de `sdd-start-feature`, literales |
| L1 Lite citado | l1 | no ofrece lite citando sus condiciones una por una |
| X1 Partir | x1 | no propone partir con la partición y el motivo; o la pregunta no lleva la opción de aprobar la spec por delegación |
| C1 Fila de la rama | c1 | pregunta «¿qué tarea?» en vez de tomar la fila 0010 como enunciado |
| L Idioma | todos | algún mensaje al usuario en inglés |

## Procedencia de las reglas

Cada regla de `skills/sdd-propose/SKILL.md`, de dónde viene y qué escenario la cubre. Se rellena con el RED y el GREEN (`tests/sdd-propose-0160-red.md`, `-green.md`); la evidencia que la skill ya no cita en su texto vive aquí.

| Regla | Origen | Escenarios |
| --- | --- | --- |
