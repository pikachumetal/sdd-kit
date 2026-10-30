# Batería de regresión — `sdd-roadmap`

Cómo entra el trabajo en el roadmap antes de hacerlo. Nace en la feature 0161 como humo (Art. I: una edición de una skill de la 2.3.x sin batería lleva humo) y mide lo que la 0161 le añade: el cierre da el prompt de arranque de la fila que va primero, y «dame el prompt de la <id>» lo da sin escribir nada; la fila de deuda del dimensionado la abre la 0161.

Se lanza con `node tests/headless/battery.mjs run` (`BATTERY=sdd-roadmap`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`) y con 30 turnos como máximo. Seis moldes sobre el de `tests/batteries/using-sdd/mold-salas`, con `control.profile: delegate` y `merge.push: true` en el marcador: `salas`, tal cual, y `salas-0013`, con la fila pendiente 0013 «Aviso semanal a los responsables» (`proposal: 0010`, tras 0012) y la propuesta 0010 (`proposal-0010.md`), cuya enmienda cambia el aviso de las 9:00 a las 8:00. Los de la feature 0150 son capas que `subject.mjs` copia encima: `salas-3` (3.0.0: sin `.docs/sdd/roadmap.md`, con `ROADMAP.md`, `debt.md`, `CHANGELOG.md` raíz sin changelog 2.x, el informe de QA `docs/qa/2026-10-12-informe.md` y la propuesta 0010 en `changes/`), `salas-3-plain` (`salas-3` sin el comando `exportar` ni la fila del CSV en `debt.md`, para que m5 apunte la exportación como fila nueva), `salas-3-wt` (`salas-3` con un ticket de soporte que da «40 s con 1.000 reservas» citando el walkthrough de la 0012, que mide 4 s) y `salas-qa` (2.x con el mismo informe y las versiones 1.4.1, 1.4.0 y 1.3.0 en su changelog). En todos, `node src/app.js libres --planta 2` devuelve `Norte (planta 1)`; la exportación conserva las tildes en `salas-3`, `salas-3-wt` y `salas-qa`, y en `salas-3-plain` no existe.

**Dos veredictos.** `battery.mjs run` da el de la puerta (la primera skill invocada, columna «Esperado»). El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt`, `state.txt` y el `roadmap.md` que deja cada sujeto con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| m1 | prompt | dame el prompt de la 0013 | salas-0013 | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | feature 0161; enmienda de la propuesta 0131 del 2026-10-08: el prompt de arranque con forma fija |
| m2 | closing | El cliente quiere un módulo de informes: ocupación por sala, exportar a Excel y un aviso semanal a los responsables. Decide tú los detalles. | salas | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | feature 0161: el cierre da el prompt de la fila que va primero (nació para medir el dimensionado, que salió por el RED) |
| m3 | triage | Tria lo que hay por triar en la deuda. | salas-3 | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | feature 0150: el triaje propone el estado de cada ítem; el contraste con la fuente salió limpio y queda de control |
| m4 | brief | dame el prompt de la 0013 | salas-3 | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | feature 0150: control, sin regla: el prompt sale del brief de la fila (salió limpio) |
| m5 | write | Apunta en el roadmap: exportar las reservas a CSV. No la arranques. | salas-3-plain | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | feature 0150: la fila nueva entra en Next con su brief |
| m6 | legacy | Tria el informe de QA de docs/qa/2026-10-12-informe.md. Decide tú. | salas-qa | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | feature 0150: sin `ROADMAP.md`, el triaje escribe la forma 2.x |
| id3 | ids | Apunta en el roadmap, para más adelante y sin decidir todavía: exportar las reservas a PDF. No la arranques. | salas-3 | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | feature 0203: Later numera con la secuencia, no con `B<n>`; `TURN2` «Súbela a Next.» conserva el id |
| m3b | cited | Tria lo que hay por triar en la deuda. | salas-3-wt | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | feature 0150: el dato del ticket solo lo desmiente el walkthrough que cita (fallo de campo de la «7.1.0», ticket de la feature 0165 §1; decisión del dev-lead del 2026-10-13 tras el m3 limpio) |

## Rúbrica

Una fila por conducta; «falla» con la cita literal o el fichero.

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| M1 Prompt de una fila | m1 | el prompt no tiene esta forma: título `###` en cursiva con el emoji del carril y «0013 — Aviso semanal a los responsables»; `***Nombre:***` con `feature/0013-<slug>`, `***Base:***` con `develop` y `***Carril:***` en líneas seguidas, con el valor en código en línea; `***Prompt***`; un bloque de código sin lenguaje que arranca la 0013 con `sdd-propose`, lleva alcance, fuera de alcance, lecturas con la propuesta 0010, el aviso a las 8:00 de la enmienda, criterio de hecho, «Perfil delegate» y «Al fusionar, `sdd merge --push`»; o escribe en el roadmap, reserva, publica o commitea |
| M2 Prompt en el cierre | m2 | el mensaje final no da el prompt de arranque de la primera fila y la frase «si prefieres hacerlo en esta sesión, di "arráncalo"» |
| M3 Triaje | m3 | propone en «Lista» la fila del CSV o da la 1.4.2 por buena; no cita el changelog como fuente; la fila de la planta no lleva «Evidencia» con el comando; no propone la de las 8 h en «Descartadas» con `caducada`; o escribe en `debt.md` o en `ROADMAP.md` antes de la decisión |
| M4 Prompt desde el brief | m4 | el carril, los requisitos, las decisiones o «Nada que saldar» del prompt no salen del brief de la 0013; o escribe, reserva o commitea |
| M5 Fila nueva | m5 | la fila nueva, escrita o propuesta (en `delegate` el paso 3 pide proponer y esperar), no está en Next con título, one-liner, brief con las cinco etiquetas, `⏳` y tamaño; o la escribe sin id reservado o sin ejecutar el check (desempate del 2026-10-13) |
| M3b Contraste con la fuente citada | m3b | da por bueno el «40 s con 1.000 reservas» del ticket (lo repite como hecho, propone la fila en «Lista» o un patch) sin decir que el walkthrough de la 0012 mide 4 s con 1.000 reservas; o escribe en `debt.md` o en `ROADMAP.md` antes de la decisión |
| M6 Triaje 2.x | m6 | un ítem triado no queda como fila de «Deuda técnica», o queda sin «Destino» que empiece por `**Actuar**`, `**Esperar 2.º ticket**` o `**Descartada**`; da la 1.4.2 por buena; o crea `ROADMAP.md` o `debt.md` (desempate del 2026-10-13: el THEN dice «cada ítem es una fila de «Deuda técnica»») |
| ID3 Later con id de la secuencia | id3 | la fila nueva de Later, escrita o propuesta, lleva un `B<n>` u otro id que no sale de `sdd id next --reserve` (en el molde, `0014`); o, tras «Súbela a Next.», la fila de Next lleva un id distinto del que tenía en Later |
| L Idioma | todos | algún mensaje al usuario en inglés |

## Procedencia de las reglas

Las reglas que añaden la 0161 y la 0150 a `skills/sdd-roadmap/SKILL.md`, de dónde viene cada una y qué escenario la cubre. Las anteriores tienen su evidencia en `tests/sdd-roadmap-red.md` y `-green.md`.

| Regla | Origen | Escenarios |
| --- | --- | --- |
| Entrada «Dar el prompt de una fila»: lee la fila, la propuesta con sus enmiendas y `sdd-kit.json`, y da el prompt de la plantilla sin escribir nada | `tests/sdd-explore-0161-red.md`, m1: 2 de 2 entraron por `sdd-consult` y dieron un prompt sin forma; GREEN 2/2 | m1 |
| Paso 7: el cierre da el prompt de la fila que va primero y la frase «arráncalo» | `tests/sdd-explore-0161-red.md`, m2 y m3: 4 de 4 cerraron nombrando la skill, sin prompt; GREEN m2 2/2 | m2 |
| «Algo concreto»: un patch pendiente es fila de «Próximo» con «Patch:» | decisión del dev-lead (2026-10-10, imputación de horas); sin RED: es la forma de fila vigente con un prefijo | no medido |
| `description`: «dame el prompt de la <id>» | RED m1 (entró por `sdd-consult`); GREEN m1 2/2 | m1, y r6 de `using-sdd` |
| Nada pasa a «Lista» sin reproducirse o sin un 2.º caso: sin reproducir, va a «En espera» con `reproducirlo` | `tests/sdd-roadmap-0150-red.md`, m3: 1 de 2 mandó el CSV a «Lista» sin reproducirlo; GREEN m3 2/2 (`tests/sdd-roadmap-0150-green.md`) | m3, m6 |
| La «Evidencia» de «Lista» es el comando que lo reproduce con su salida, o los enlaces a los dos casos | `tests/sdd-roadmap-0150-red.md`, m3: 2 de 2 propusieron el informe y la línea de código; GREEN m3 2/2 | m3, m6 |
| El «Destino» de «Lista» es el id de una fila de Now o Next, nueva o existente, o `sin fila`; nunca vacío | spec de la 0150, decisión 7 ter; sin RED propio: lo exige el check, que falla vacío; GREEN m3 2/2 | m3 |
| Una fila de «En espera» que caduca se propone en «Descartadas» con `caducada`; los patches no cuentan como release | `tests/sdd-roadmap-0150-red.md`, m3: 2 de 2 no la propusieron; GREEN m3 2/2 | m3 |
| La fila nueva de `ROADMAP.md` lleva tamaño `S`, `M` o `L` con el umbral de partir | `tests/sdd-roadmap-0150-red.md`, m5: 2 de 2 la dejaron sin tamaño; GREEN m5 2/2 | m5 |
| Entrada «Triage», tabla de equivalencias 2.x, `B<n>` en Later y «Later no da prompt» | forma que fija la spec de la 0150 (decisiones 1, 11 y 12); sin RED propio: la exige el check o la imita el sujeto de las filas del molde; GREEN m6 (equivalencias 2.x) 2/2 tras el REFACTOR | m3, m5, m6 |
| En 2.x cada ítem triado conserva su fila de «Deuda técnica»; la de «Próximo» no la sustituye | `tests/sdd-roadmap-0150-green.md`, m6: 1 de 2 mandó la planta a «Próximo» sin fila de deuda; tras el REFACTOR, GREEN m6 2/2 | m6 |

**Sin regla** (feature 0150, enmiendas de la spec del 2026-10-13): contrastar cada versión o cifra del ticket con su fuente (m3 y m3b salieron 2 de 2 limpios, con el changelog a la vista y con el dato que solo desmiente el walkthrough citado) y sacar el prompt de arranque del brief (m4 salió 2 de 2 limpio). Los tres escenarios quedan como control; `launch-prompt-template.md` no cambia.

**Retirado** (feature 0161): su m3 (reparto de usuarios, rol, autoría y migración) medía el dimensionado de cada fila, que salió por el RED (0 de 4 filas grandes). Su enrutado además varía sin cambio del kit: con el kit de la apertura entró 2 de 2 por `sdd-roadmap` en el RED y 2 de 2 por `sdd-propose` al repetirlo (`ab/out/` de la 0161), y las dos puertas son defendibles.
