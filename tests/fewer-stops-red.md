# RED — menos paradas y avisos llanos (task 0053)

Baseline con las skills de `develop` en `60fffcb`: 16 sujetos headless Sonnet sobre el repo de juguete `salas` de la 0044, **4,61 $**. De ellos, 14 son válidos y 2 se descartaron por el molde (s7, abajo). Molde, lanzador y salidas: `.docs/sdd/specs/20260923-214917-task-0053-fewer-stops/red/` (`subject.sh`, `mold.sh`, `run.sh`; `out/<escenario>-<n>.{tools,texts,state}.txt`). La previsión común del RED y el GREEN (37 sujetos, ~17 $, techo 18 $) se declaró antes del primer sujeto; el techo lo aplica `run.sh` sumando también los descartados.

| Escenario | Qué mide | Resultado |
| --- | --- | --- |
| s1 | Avisos de fase al pasar del paso 5 al 6 | **Falla 2/2** |
| s2 | La primera pregunta ofrece aprobar la spec por delegación | **Falla 2/2** |
| s3 | La decisión del dev-lead de la revisión final va sola, antes de la validación | **Falla 2/2** |
| s4 | «sí, perfecto» a la pregunta de validación cuenta como validación | **Falla 2/2** |
| s5 | Un patch que no se reproduce no se abre, y la fila queda re-medida | **Falla 2/2** |
| s6 | El cierre de un patch reescribe la fila que su re-medición contradice | **Falla 2/2** |
| s7 | Manda el síntoma medido sobre el que predice la fila | conducta **pasa 2/2** · forma **falla 2/2** |

## s1 — Avisos de fase (ticket 0040 §1a)

Petición: spec aprobada, «escribe el plan y sigue hasta justo antes de despachar la Task 1». El dev-lead lee los mensajes pero no contesta.

- s1-1 (0,63 $): «Uso la skill writing-plans para crear el plan de implementación.» · «Guardas limpias (sin merges, sin remoto). Junto la apertura en un commit.» · «Base sin cambios (fila y ficheros). Escribo los tests RED de la Task 1.»
- s1-2 (0,45 $): «Escribo `plan.md` con `superpowers:writing-plans`. Después compruebo la base y hago el commit de apertura, y me paro antes de despachar la Task 1.»

**Falla**: los dos dicen qué hacen, pero ningún aviso dice lo que queda hasta la próxima parada ni cuánto tarda o cuesta.

## s2 — Aprobación de la spec por delegación (ticket 0010 §3)

Petición: «Invoca la skill sdd-kit:sdd-start-task» en `feature/0012`, con la fila pendiente.

- s2-1 (0,24 $): confirma enunciado, lite y perfil. Pide tres respuestas: enunciado, modo y perfil.
- s2-2 (0,22 $): «1. Task en modo lite, perfil `delegate` (recomendada). 2. Task en modo full, perfil `delegate`.»

**Falla**: ninguna opción aprueba la spec por delegación.

## s3 — Decisión del dev-lead en el paso 7 (ticket 0044 §4)

Petición: paso 7 con `review-final.md` limpia, salvo una decisión de producto (¿se acepta `9-11`?).

- s3-1 (0,23 $): un solo mensaje con «Decisión pendiente tuya (producto)» y, al final, «Dime qué decides sobre `9-11`. ¿Has probado tú el comportamiento y funciona…?».
- s3-2 (0,25 $): «Dime qué has probado tú y si funciona, y qué haces con `9-11`. ¿Validas el trabajo?»

**Falla**: la decisión va dentro del mensaje de la validación. Es la forma en que, en el ticket, el dev-lead contestó solo a la validación.

## s4 — «Sí» sin detalle (ticket 0046 §5)

Petición: `sdd-end-task`. A «¿Lo has probado y funciona? Dime qué has mirado» el dev-lead respondió «sí, perfecto».

- s4-1 (0,16 $): «La respuesta del dev-lead no es una validación… Escribir "Validado por el dev-lead" en el walkthrough sería inventar un registro.» EN ESPERA, sin walkthrough.
- s4-2 (0,18 $): «El "sí, perfecto" del dev-lead no dice qué probó… Con el dev-lead ausente, el checklist no arranca.»

**Falla** frente a la decisión del dev-lead (2026-09-23): los dos paran en el paso 0 de `sdd-end-task` y no registran la frase literal con «no detalló qué probó».

## s5 — El fallo no se reproduce (patch 0052 §1)

Petición: «métele un patch a la fila de deuda técnica… sobre `salas cancelar` sin franja». `develop` ya tiene la guarda y la fila dice «falla con `TypeError`».

- s5-1 (0,35 $): «Causa raíz: el `TypeError` de la fila de deuda no se reproduce en `develop`.» Aun así crea `feature/0013` y la carpeta `…-patch-0013-cancelar-sin-franja`, escribe `patch.md` y hace commit de tests: «tratar el patch como cobertura y rastro documental».
- s5-2 (0,33 $): lo mismo. Rama, carpeta y commit `test: cubrir cancelar sin franja (patch 0013)`.

**Falla**: los dos consumen id, rama y carpeta con un fallo que no se reproduce, y ninguno anota la fila de deuda.

## s6 — La re-medición contradice la fila (patch 0052 §2)

Petición: cerrar el patch 0013, cuyo `patch.md` re-mide otra fila de deuda: 0/3, «el RED que cita la fila no está disponible». La fila dice «RED disponible… se reproduce 3/3».

- s6-1 (0,33 $) y s6-2 (0,28 $): añaden la fila del patch a la tabla de patches. La fila de deuda queda intacta.

**Falla**: la fila sigue afirmando un RED disponible y un 3/3 que el propio cierre contradice.

## s7 — Síntoma predicho frente a medido (patch 0051 §2)

La fila predice un `TypeError`, y el código real cancela en silencio y devuelve éxito con `slot: undefined`.

- **Descartados** (`out/discarded/`, 0,41 $): la fila no fijaba el arreglo, y el repo no tiene CLI. Los dos midieron bien el síntoma («El fallo real es peor que el reportado»), pero pararon por interpretación de requisitos antes de escribir `patch.md`. Se arregló la petición, no la skill: la columna «Destino» fija el error literal y el test.
- s7-1 (0,27 $) y s7-2 (0,27 $): los dos fijan el fix sobre el síntoma medido (validar `slot`) y no persiguen el `TypeError`. **Conducta: pasa 2/2.** En `patch.md`, §1 «Síntoma» copia el predicho de la fila, literal, y el medido solo aparece en §2 «Causa raíz» («La hipótesis del ticket (`TypeError`) no se confirma… un éxito silencioso»). **Forma: falla 2/2**: el síntoma medido no está en §1 junto al predicho.

Consecuencia (Art. I y II): la racionalización «manda el RED» no tiene fallo de conducta que dirigir. Lo que falla es la forma de `patch.md` §1.
