# Batería de regresión — `sdd-start-feature`

Cómo escribe y presenta el kit la spec y el plan de una feature, y cómo para en un desvío y en la validación. Nace en la feature 0146 como batería de humo de las reglas que esa feature añade a `sdd-start-feature`; la heredará la skill de propose (0160). Cada escenario sitúa al sujeto en un paso del flujo, con los artefactos de ese punto ya escritos por `subject.sh`, y la petición empieza por «Invoca la skill sdd-kit:sdd-start-feature y sigue: », porque un escenario de mitad de flujo sin ella no carga la skill (`tech-stack.md`, «Un escenario de mitad de flujo carga la skill»). El **paso** es el del flujo que se mide.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-start-feature`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`). Un molde, `reservas` (`mold-reservas/`): la app de salas de `using-sdd` con un `PRODUCT.md` cuyo glosario distingue **Cancelación** (la anula el cliente) de **Anulación** (la anula el responsable de sala), los comandos `cancelar` y `anular`, dos ficheros de test y una constitution cuyo gate es `node --test` entero; `tech-stack.md` no tiene §Testing. Perfil `delegate`. Las features del roadmap del molde son la 0010 (motivo al cancelar) y la 0011 (anular reservas de otros); sus artefactos están en `fixtures/`.

Montaje por escenario, en `subject.sh`: `s1` en la rama `feature/0010-cancel-reason`, sin carpeta; `g1` y `p1`, con la spec de la 0010 escrita (`p1`, aprobada); `r1`, en `feature/0011-void-others` con su spec escrita; `u1`, con la 0010 abierta (spec y plan aprobados), la Task 1 commiteada y la Task 2 en curso, y `TURN2` «Apruebo la enmienda.»; `v1a` y `v1b`, con la 0010 implementada, revisada y con dos rulings en `tasks.md` (`v1b`, además, con `validation.mode: field`). En `claude -p` no existe `AskUserQuestion` (comprobado en la 0146: el sujeto la busca con `ToolSearch`, no la encuentra y pregunta en prosa), así que G1 y R1 puntúan el intento o las opciones que presenta.

**Dos veredictos.** `battery.sh` da el de la puerta (la primera skill invocada, columna «Esperado»). El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt` y los ficheros que deja cada sujeto con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| s1 | spec | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 4. La entrevista ya está hecha; decidido con el dev-lead: al cancelar una reserva se elige un motivo de una lista (cambio de planes, sala ocupada, otro) y el listado de canceladas lo enseña. Sin review. Escribe la spec en su carpeta y preséntamela para aprobar. | reservas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | propuesta 0131, §propose: 🦆, ✋ exhaustivo y «Dónde se prueba» |
| g1 | gate | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 4. La spec de la 0010 está escrita y repasada, sin review. Preséntamela para aprobar. | reservas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | opus | ticket de la feature 0060 del template §3: gate en prosa sin la opción de bajar de modelo |
| r1 | review | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 4. La spec de la 0011 está escrita. Cuenta las señales y decide la review antes de presentármela. | reservas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | enmienda de la propuesta 0131 del 2026-10-07: modelo del revisor de dominio |
| p1 | plan | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 5. La spec de la 0010 está aprobada: escribe el plan. | reservas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | propuesta 0131, §propose (tasks con dependencias); 0097 (verificación sin §Testing) |
| u1 | update | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 6. Estás en la Task 2 (listado de canceladas) de la 0010: su THEN pide enseñar quién canceló, y la aplicación no tiene usuarios ni ningún dato de quién ejecuta el comando. Sigue. | reservas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | propuesta 0131, §Marco y carriles: acción update |
| v1a | validation | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 7. La 0010 está implementada y la revisión final está limpia: sigue. | reservas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | propuesta 0131, §propose: la forma ✋ en la validación |
| v1b | validation | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 7. La 0010 está implementada y la revisión final está limpia: sigue. | reservas-campo | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | propuesta 0131, §propose: la forma ✋ en el mensaje final de la validación en campo |

## Rúbrica

Una fila por conducta; «falla» con la cita literal o el fichero.

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| S1 🦆 y ✋ arriba | s1 | la `spec.md` no tiene un párrafo que empiece por 🦆 antes de «## Capacidades», o no tiene `## ✋ Decisiones que he tomado yo — valida estas` justo después de «Capacidades» |
| S2 ✋ exhaustivo | s1 | un valor que la petición no fija (un tope, un texto, un orden, un nombre de comando) aparece en el cuerpo de la spec y no en el bloque de decisiones |
| S3 Secciones | s1 | falta «## Dónde se prueba» con una línea por comportamiento, o falta «## Términos y ADR» |
| G1 Gate con opciones | g1 | la pregunta del gate no intenta `AskUserQuestion` (la llamada o su búsqueda con `ToolSearch`, en `tools.txt`), o las opciones que presenta no incluyen «Apruebo (Recomendada)», «Cambios» y la de parar antes de la Task 1 para bajar la sesión a gama media |
| R1 Modelo del revisor | r1 | las opciones de la pregunta de review no llevan el modelo del revisor de dominio, o no recomiendan Opus |
| P1 Dependencias | p1 | alguna task del `plan.md` no lleva `**Tras**:`, o el plan no dice que las tasks se ejecutan en orden, sin paralelo |
| P2 Verificación por superficie | p1 | la «Verificación» de alguna task lleva el gate de la constitution (`node --test` entero) en vez del comando de su superficie que da «Dónde se prueba» (`node --test test/cancel.test.js`) |
| U1 Parada con corrección en su sitio | u1, turno 1 | sigue implementando, o no corrige el THEN en su sitio de la `spec.md`, o no añade la línea a «Enmiendas», o su mensaje no lleva 🦆 y ✋ |
| U2 Task nueva | u1, turno 2 | reabre la Task 1 o reescribe su commit, o no añade al plan `Task 3 — enmienda <fecha>: …` con su `Tras`, o no anota `afectada por enmienda <fecha> → Task 3` en `tasks.md` |
| V1 🦆 y ✋ en la validación | v1a, v1b | el mensaje de la validación (en v1b, el previo a invocar `sdd-end-feature`) no empieza por un párrafo con 🦆 seguido de `✋ Me salí del plan en…` con los dos rulings de `tasks.md` |
| L Idioma | todos | algún mensaje al usuario en inglés |

## Procedencia de las reglas

Cada regla que la 0146 añade a `skills/sdd-start-feature/`, de dónde viene y qué escenario la cubre. Se rellena con el RED y el GREEN (`tests/sdd-start-feature-0146-red.md`, `-green.md`).

| Regla | Origen | Escenarios |
| --- | --- | --- |
