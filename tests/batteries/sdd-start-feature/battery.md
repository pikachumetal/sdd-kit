# Batería de regresión — `sdd-start-feature`

Cómo para el kit en la validación de una feature. Nace en la feature 0146 como batería de humo de las reglas que esa feature añade a `sdd-start-feature`; desde la 0160, los escenarios de spec y plan (s1, g1, r1, p1) viven en la batería de `sdd-propose`, que se quedó con esos pasos, y desde la 0147 los del paso 6 (`u1`, `u2`), en la de `sdd-implement`; aquí queda el del paso 7. Cada escenario sitúa al sujeto en un paso del flujo, con los artefactos de ese punto ya escritos por `subject.sh`, y la petición empieza por «Invoca la skill sdd-kit:sdd-start-feature y sigue: », porque un escenario de mitad de flujo sin ella no carga la skill (`tech-stack.md`, «Un escenario de mitad de flujo carga la skill»). El **paso** es el del flujo que se mide.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-start-feature`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`). Un molde, `reservas` (`mold-reservas/`): la app de salas de `using-sdd` con un `PRODUCT.md` cuyo glosario distingue **Cancelación** (la anula el cliente) de **Anulación** (la anula el responsable de sala), los comandos `cancelar` y `anular`, dos ficheros de test y una constitution cuyo gate es `node --test` entero; `tech-stack.md` no tiene §Testing. Perfil `delegate`. Las features del roadmap del molde son la 0010 (motivo al cancelar) y la 0011 (anular reservas de otros); sus artefactos están en `fixtures/`.

Montaje por escenario, en `subject.sh`: `v1a` y `v1b`, con la 0010 implementada, revisada y con dos rulings en `tasks.md` (`v1b`, además, con `validation.mode: field`).

**Dos veredictos.** `battery.sh` da el de la puerta (la primera skill invocada, columna «Esperado»). El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt` y los ficheros que deja cada sujeto con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| v1a | validation | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 7. La 0010 está implementada y la revisión final está limpia: sigue. | reservas | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | propuesta 0131, §propose: la forma ✋ en la validación |
| v1b | validation | Invoca la skill sdd-kit:sdd-start-feature y sigue: paso 7. La 0010 está implementada y la revisión final está limpia: sigue. | reservas-campo | `sdd-kit:sdd-start-feature` | 2 | 2/2 | sonnet | propuesta 0131, §propose: la forma ✋ en el mensaje final de la validación en campo |

## Rúbrica

Una fila por conducta; «falla» con la cita literal o el fichero.

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| V1 🦆 y ✋ en la validación | v1a, v1b | el mensaje de la validación (en v1b, el previo a invocar `sdd-end-feature`) no empieza por un párrafo con 🦆 seguido de `✋ Me salí del plan en…` con los dos rulings de `tasks.md` |
| L Idioma | todos | algún mensaje al usuario en inglés |

## Procedencia de las reglas

Cada regla que la 0146 añade a `skills/sdd-start-feature/`, de dónde viene y qué escenario la cubre. Se rellena con el RED y el GREEN (`tests/sdd-start-feature-0146-red.md`, `-green.md`).

| Regla | Origen | Escenarios |
| --- | --- | --- |
| Paso 7 y mensaje final de `sdd-end-feature`: la validación —y con `field`, el mensaje que invoca el cierre o el mensaje final del cierre— abre con el 🦆 y «✋ Me salí del plan en…» | RED V1 4/4; GREEN v1b ronda 0, 0/2, y ronda 1, 1/2 (sin mensaje previo al cierre) | v1a, v1b |
