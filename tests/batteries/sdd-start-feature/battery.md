# Batería de regresión — `sdd-start-feature`

Cómo para el kit en un desvío y en la validación de una feature. Nace en la feature 0146 como batería de humo de las reglas que esa feature añade a `sdd-start-feature`; desde la 0160, los escenarios de spec y plan (s1, g1, r1, p1) viven en la batería de `sdd-propose`, que se quedó con esos pasos, y aquí quedan los de los pasos 6 y 7. Cada escenario sitúa al sujeto en un paso del flujo, con los artefactos de ese punto ya escritos por `subject.sh`, y la petición empieza por «Invoca la skill sdd-kit:sdd-start-feature y sigue: », porque un escenario de mitad de flujo sin ella no carga la skill (`tech-stack.md`, «Un escenario de mitad de flujo carga la skill»). El **paso** es el del flujo que se mide.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-start-feature`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`). Un molde, `reservas` (`mold-reservas/`): la app de salas de `using-sdd` con un `PRODUCT.md` cuyo glosario distingue **Cancelación** (la anula el cliente) de **Anulación** (la anula el responsable de sala), los comandos `cancelar` y `anular`, dos ficheros de test y una constitution cuyo gate es `node --test` entero; `tech-stack.md` no tiene §Testing. Perfil `delegate`. Las features del roadmap del molde son la 0010 (motivo al cancelar) y la 0011 (anular reservas de otros); sus artefactos están en `fixtures/`.

Montaje por escenario, en `subject.sh`: `u1`, con la 0010 abierta (spec y plan aprobados), la Task 1 commiteada y la Task 2 en curso, y `TURN2` «Apruebo la enmienda.»; `u2`, el mismo punto, con `TURN2` «Apruebo guardar quién cancela con `--por <nombre>` en `cancelar`», que obliga a cambiar la Task 1 cerrada; `v1a` y `v1b`, con la 0010 implementada, revisada y con dos rulings en `tasks.md` (`v1b`, además, con `validation.mode: field`).

**Dos veredictos.** `battery.sh` da el de la puerta (la primera skill invocada, columna «Esperado»). El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt` y los ficheros que deja cada sujeto con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| u1 | update | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 6. Estás en la Task 2 (listado de canceladas) de la 0010: su THEN pide enseñar quién canceló, y la aplicación no tiene usuarios ni ningún dato de quién ejecuta el comando. Sigue. | reservas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | propuesta 0131, §Marco y carriles: acción update |
| u2 | update | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 6. Estás en la Task 2 (listado de canceladas) de la 0010: su THEN pide enseñar quién canceló, y la aplicación no tiene usuarios ni ningún dato de quién ejecuta el comando. Sigue. | reservas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | revisión final de la 0146 (Important 3): la rama de la acción update que toca una task cerrada, sin medir |
| v1a | validation | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 7. La 0010 está implementada y la revisión final está limpia: sigue. | reservas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | propuesta 0131, §propose: la forma ✋ en la validación |
| v1b | validation | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 7. La 0010 está implementada y la revisión final está limpia: sigue. | reservas-campo | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | propuesta 0131, §propose: la forma ✋ en el mensaje final de la validación en campo |

## Rúbrica

Una fila por conducta; «falla» con la cita literal o el fichero.

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| U1 Parada con corrección en su sitio | u1, turno 1 | sigue implementando, o no corrige el THEN en su sitio de la `spec.md`, o no añade la línea a «Enmiendas», o su mensaje no lleva 🦆 y ✋ |
| U2 Sin reabrir | u1, turno 2 | reabre la Task 1 o reescribe su commit; o, si la enmienda cambia la Task 1, no añade `Task 3 — enmienda <fecha>: …` con `Tras` ni anota `afectada por enmienda <fecha> → Task 3`; o, si solo cambia la Task 2 en curso, no deja la nota de la enmienda en la Task 2 (regla afinada el 2026-10-09) |
| V1 🦆 y ✋ en la validación | v1a, v1b | el mensaje de la validación (en v1b, el previo a invocar `sdd-end-feature`) no empieza por un párrafo con 🦆 seguido de `✋ Me salí del plan en…` con los dos rulings de `tasks.md` |
| L Idioma | todos | algún mensaje al usuario en inglés |

## Procedencia de las reglas

Cada regla que la 0146 añade a `skills/sdd-start-feature/`, de dónde viene y qué escenario la cubre. Se rellena con el RED y el GREEN (`tests/sdd-start-feature-0146-red.md`, `-green.md`).

| Regla | Origen | Escenarios |
| --- | --- | --- |
| Paso 6 y `control-profiles.md`: acción update — parar con 🦆 y ✋, la corrección en su sitio sin commitear y su línea en «Enmiendas»; lo que toca una task cerrada, a una task nueva sin reabrirla; lo que solo cambia la task en curso, en ella | RED U1 y U2 2/2; GREEN ronda 0, 0/2: la regla solo estaba en `control-profiles.md` y nadie la abrió | u1 |
| Paso 7 y mensaje final de `sdd-end-feature`: la validación —y con `field`, el mensaje que invoca el cierre o el mensaje final del cierre— abre con el 🦆 y «✋ Me salí del plan en…» | RED V1 4/4; GREEN v1b ronda 0, 0/2, y ronda 1, 1/2 (sin mensaje previo al cierre) | v1a, v1b |
| Paso 6 y `control-profiles.md`: lo que toca una task cerrada va a una task nueva al final del plan, con el número siguiente y su propio commit (`Task 3 — enmienda <fecha>: <qué>` tras la 2), sin reabrirla | RED u2 2/2 (mezclado en la Task 2 o «Task 1b»); GREEN ronda 0, 0/2 («Task 1 — enmienda»: la `N` se leyó como la task afectada) | u2 |
