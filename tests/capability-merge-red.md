# RED — la fusión del delta de capacidades (feature 0124)

Baseline con el kit de `develop` (2.2.0 más la 2.3.0 en preparación, sin `Merge-CapabilityDelta.ps1` ni guía), 2026-10-01. Sujetos Sonnet headless (`tests/headless/run.sh`, `SUPERPOWERS_DIR` de la caché 6.4.2), molde sintético `salas` con `capabilities/bookings.md` en la forma de la plantilla. Subject: [`red/subject.sh`](../.docs/sdd/specs/20261001-130008-feature-0124-capability-delta-merge/red/subject.sh); salidas en [`red/out/`](../.docs/sdd/specs/20261001-130008-feature-0124-capability-delta-merge/red/out/). Previsión de la spec (decisión 13): 5 sujetos en el RED, 5 en el GREEN y 3 de reserva, ~4 $, techo 7 $ y 2 h. Gastado en el RED: 5 sujetos, 0,86 $, ~6 min.

La columna «validador de la rama» es `Test-Capabilities.ps1 -Artifact` de esta rama (con las comprobaciones de la Task 1) ejecutado sobre el molde al acabar el sujeto. El de `develop`, que es el que ejecutaron los sujetos, les dio `Capacidades válidas: 1` a los tres de fusión.

## Escenarios

- `f1` — «Estamos cerrando la feature 0031 […] con sdd-end-feature. […] haz solo el paso 4: lleva el delta de la spec a `capabilities/` y valida.» Delta de `bookings`: un `ADDED` con `- AND … por la decisión 1` y `- Se valida en: worktree con la base al día`, un `MODIFIED` con el `(antes: «…»)` partido en dos líneas, un `REMOVED` con `- motivo:` y la regla «Avisos».
- `p1` — «Estamos cerrando el patch 0032 […] con sdd-end-patch. […] Haz solo la parte «Capacidades» del paso 1». `patch.md` con un `MODIFIED` de «Reservar una franja» con el `(antes: …)` partido y `- Se valida en:`.
- `t1` — «Completa la sección «Delta de comportamiento» de […] spec.md para la capacidad bookings, con la forma de la plantilla del kit». Spec con cinco decisiones numeradas, tres de ellas reglas de negocio, y el Scope citándolas («con las reglas de las decisiones 2, 3 y 5»).

## Resultados

| Sujeto | Cómo fusionó | `Se valida en:` en la capacidad | Cita de la spec en la capacidad | `MODIFIED` aplicado, sin línea suelta | Líneas en blanco | Validador de la rama |
| --- | --- | --- | --- | --- | --- | --- |
| f1-1 | a mano, un `Write` del fichero entero | sí | sí («por la decisión 1») | sí | bien | 1 fallo («Se valida en:») |
| f1-2 | a mano, un `Write` del fichero entero | sí | sí («por la decisión 1») | sí | bien | 1 fallo («Se valida en:») |
| p1-1 | a mano, un `Edit` | sí | — | sí | bien | 1 fallo («Se valida en:») |

| Sujeto | Leyó `spec-template.md` | THEN o AND que citan «decisión N» |
| --- | --- | --- |
| t1-1 | sí, tras invocar `sdd-templates` | 0 |
| t1-2 | sí, tras invocar `sdd-templates` | 0 |

## Fallos (los que la guía tiene que cerrar)

- **La fusión a mano copia el bloque entero del delta, con lo que es del delta**: 3 de 3 sujetos llevaron `- Se valida en:` a la capacidad viva, y 2 de 2 en `f1` la cita «por la decisión 1». Lo dicen así: «añadido, con su `AND` y su «Se valida en»» (f1-1); «Añadí también la línea `Se valida en: worktree con la base al día`, que venía en el delta» (p1-1). La regla que siguen es la de `aprendizajes-skills.md`, «MODIFIED sustituye entero el requisito», y en `f1-1` el sujeto la abrió expresamente.
- **El validador de `develop` lo da por bueno**: los tres cerraron con «`Capacidades válidas: 1`, exit 0». Con el de la rama, los tres fallan.

## Lo que el RED ya cumplía (filas de control del GREEN)

- 3 de 3 aplicaron el `MODIFIED` sin dejar suelta la segunda línea del `(antes: …)` y quitaron el `REMOVED` sin su `- motivo:`.
- 3 de 3 dejaron las líneas en blanco de la plantilla: el molde ya las traía, y escribieron calcando. Los tickets de campo las perdieron con scripts propios sobre capacidades más largas; aquí no se reproduce.
- 3 de 3 ejecutaron `Test-Capabilities.ps1 -Artifact` antes de dar el paso por hecho.
- 3 de 3 se limitaron al paso pedido, sin commitear.

## `t1`: baseline limpio

0 de 2 sujetos citaron decisiones por número en un THEN, aunque la spec las numeraba y el Scope las citaba así. Los dos sacaron la conducta de `spec-template.md`, que abrieron tras invocar `sdd-templates`: su regla de «datos concretos de entrada y de salida» los llevó a escribir el valor (`No es tu reserva`, `Demasiado tarde para cancelar`) en vez de la referencia. No es una fuente incidental: todo sujeto que escribe un delta abre esa plantilla. **Según el Art. I y la decisión 13 de la spec, la línea de `spec-template.md` no se escribe**, y `t1` se repite en el GREEN como control. La cita sí aparece cuando el agente **copia** un delta que ya la trae (`f1`, y los tres casos de campo, que acabaron en la capacidad al fusionar): eso lo para `Merge-CapabilityDelta.ps1`, que la rechaza y pide reescribir el delta.
