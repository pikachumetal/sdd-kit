# Batería de regresión — `sdd-roadmap`

Cómo entra el trabajo en el roadmap antes de hacerlo. Nace en la feature 0161 como humo (Art. I: una edición de una skill de la 2.3.x sin batería lleva humo) y mide lo que la 0161 le añade: el cierre da el prompt de arranque de la fila que va primero, y «dame el prompt de la <id>» lo da sin escribir nada; la fila de deuda del dimensionado la abre la 0161.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-roadmap`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`) y con 30 turnos como máximo. Dos moldes sobre el de `tests/batteries/using-sdd/mold-salas`, con `control.profile: delegate` y `merge.push: true` en el marcador: `salas`, tal cual, y `salas-0013`, con la fila pendiente 0013 «Aviso semanal a los responsables» (`proposal: 0010`, tras 0012) y la propuesta 0010 (`proposal-0010.md`), cuya enmienda cambia el aviso de las 9:00 a las 8:00.

**Dos veredictos.** `battery.sh` da el de la puerta (la primera skill invocada, columna «Esperado»). El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt`, `state.txt` y el `roadmap.md` que deja cada sujeto con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| m1 | prompt | dame el prompt de la 0013 | salas-0013 | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | feature 0161; enmienda de la propuesta 0131 del 2026-10-08: el prompt de arranque con forma fija |
| m2 | closing | El cliente quiere un módulo de informes: ocupación por sala, exportar a Excel y un aviso semanal a los responsables. Decide tú los detalles. | salas | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | feature 0161: el cierre da el prompt de la fila que va primero (nació para medir el dimensionado, que salió por el RED) |

## Rúbrica

Una fila por conducta; «falla» con la cita literal o el fichero.

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| M1 Prompt de una fila | m1 | el prompt no tiene esta forma: título «0013 — Aviso semanal a los responsables»; `Base: develop`; la rama `feature/0013-<slug>` sola en su bloque; el carril; un segundo bloque que arranca la 0013 con `sdd-propose`, nombra la propuesta 0010 y lleva el aviso a las 8:00 de la enmienda, «Perfil delegate» y «Al fusionar, `sdd merge --push`»; o escribe en el roadmap, reserva, publica o commitea |
| M2 Prompt en el cierre | m2 | el mensaje final no da el prompt de arranque de la primera fila y la frase «si prefieres hacerlo en esta sesión, di "arráncalo"» |
| L Idioma | todos | algún mensaje al usuario en inglés |

## Procedencia de las reglas

Las reglas que añade la 0161 a `skills/sdd-roadmap/SKILL.md`, de dónde viene cada una y qué escenario la cubre. Las anteriores tienen su evidencia en `tests/sdd-roadmap-red.md` y `-green.md`.

| Regla | Origen | Escenarios |
| --- | --- | --- |
| Entrada «Dar el prompt de una fila»: lee la fila, la propuesta con sus enmiendas y `sdd-kit.json`, y da el prompt de la plantilla sin escribir nada | `tests/sdd-explore-0161-red.md`, m1: 2 de 2 entraron por `sdd-consult` y dieron un prompt sin forma; GREEN 2/2 | m1 |
| Paso 7: el cierre da el prompt de la fila que va primero y la frase «arráncalo» | `tests/sdd-explore-0161-red.md`, m2 y m3: 4 de 4 cerraron nombrando la skill, sin prompt; GREEN m2 2/2 | m2 |
| «Algo concreto»: un patch pendiente es fila de «Próximo» con «Patch:» | decisión del dev-lead (2026-10-10, imputación de horas); sin RED: es la forma de fila vigente con un prefijo | no medido |
| `description`: «dame el prompt de la <id>» | RED m1 (entró por `sdd-consult`); GREEN m1 2/2 | m1, y r6 de `using-sdd` |

**Retirado**: m3 (reparto de usuarios, rol, autoría y migración) medía el dimensionado de cada fila, que salió por el RED (0 de 4 filas grandes). Su enrutado además varía sin cambio del kit: con el kit de la apertura entró 2 de 2 por `sdd-roadmap` en el RED y 2 de 2 por `sdd-propose` al repetirlo (`ab/out/` de la 0161), y las dos puertas son defendibles.
