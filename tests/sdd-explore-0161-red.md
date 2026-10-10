# RED — feature 0161: explore, el paso por el roadmap y el prompt de arranque

Kit del commit de apertura (`5badc040`, `git archive` al scratchpad), Sonnet, superpowers 6.4.2 en `SUPERPOWERS_DIR`. Baterías `tests/batteries/sdd-explore/` (e2, e3), `tests/batteries/sdd-roadmap/` (m1, m2, m3) y `tests/batteries/sdd-propose/` (a5). Salidas en `.docs/sdd/specs/20261009-153540-feature-0161-explore-launch-prompt/red/out/`. 14 sujetos, 2,92 $.

La puerta de `battery.sh` sale roja por construcción en e2, e3 y m1 (la skill se llama `sdd-consult`, o la petición entra por ella). La conducta se lee con la rúbrica de cada batería.

## Resultado por escenario

| Escenario | Fila | Resultado | Cita |
| --- | --- | --- | --- |
| e2-1 | E2 | falla | `sdd-consult` da un prompt sin base, sin la rama en su bloque, sin carril, perfil ni «al fusionar»: «trátalo con sdd-propose (clasifícalo tú; probablemente patch)» |
| e2-2 | E2 | falla | prompt libre: «Trabaja desde `develop` en una rama `feature/<id>` / patch según te clasifique sdd-propose», sin título, carril ni perfil |
| e3-1 | E3 | falla | `sdd-consult` → `sdd-propose` → `brainstorming` → `sdd-grilling` en la misma sesión, sin fila: «Estoy en el diseño de la feature «filtrar libres por planta»» |
| e3-2 | E3 | falla | `sdd-consult` → `sdd-propose` → `brainstorming`: «Sigo con el diseño de la feature», sin pasar por el roadmap |
| m1-1 | M1 | falla | entra por `sdd-consult`; prompt en un bloque sin base, rama, carril, perfil ni «al fusionar» (sí aplica la enmienda: «el aviso se envía a las 8:00») |
| m1-2 | M1 | falla | entra por `sdd-consult`; «Arranca la 0013: Aviso semanal a los responsables», sin la forma fija |
| m2-1 (1.ª tanda) | M2 | falla (prompt) · limpio (tamaño) | tres filas (0009-0011) sin tasks previstas y pequeñas; cierra con «La primera fila a arrancar es la **0009**, con `sdd-propose`», sin prompt |
| m2-2 (1.ª tanda) | M2 | falla (prompt) · limpio (tamaño) | tres filas pequeñas; «La que va primero es la 0009; se arranca con `sdd-propose`», sin prompt |
| m2-1, m2-2 (2.ª tanda) | M2 | falla (prompt) · limpio (tamaño) | la segunda tanda sobrescribió la primera en `red/out/` (misma etiqueta); misma conducta |
| m3-1 | M2 | falla (prompt) · limpio (tamaño) | parte usuarios, rol y autoría con migración en tres filas sin que nadie lo pida; «la fila que va primero es la **0009**, y se arranca con `sdd-propose`» |
| m3-2 | M2 | falla (prompt) · limpio (tamaño) | cuatro filas (login, rol, autoría, migración); «Arranca 0009 con `sdd-propose` cuando quieras» |
| a5-1 | A5 | limpio | la spec lleva `--planta` y «sin `--planta`, lista todas» en «Decisiones tomadas con el dev-lead», con su literal; no las pregunta |
| a5-2 | A5 | limpio | «Tus decisiones: la opción se llama `--planta`; sin ella se listan todas las salas.»; no las pregunta |

## Lectura por regla

- **explore da el prompt de un config con la forma fija** — 2/2 fallan: lo dan, pero cada uno con su forma, y el carril queda abierto («probablemente patch»). La regla entra.
- **lo que acaba en trabajo pasa por el roadmap** — 2/2 fallan: `sdd-consult` traspasa a `sdd-propose` y la sesión entra en el diseño sin fila. La regla entra.
- **«dame el prompt de la <id>»** — 2/2 fallan: la frase entra por `sdd-consult` y el prompt sale sin forma. La regla entra, y la frase va a la `description` de `sdd-roadmap` y a `using-sdd`.
- **el cierre del roadmap da el prompt de la primera fila** — 4/4 fallan: nombran la fila y la skill, sin prompt. La regla entra.
- **el roadmap dimensiona cada fila** — 0 de 4 filas grandes: m3, el caso que partiría `sdd-propose` (x1), sale partido en 3 y 4 filas sin la regla. Sale por el Art. I (enmienda del 2026-10-10); fila de deuda «Esperar 2.º ticket» con la 0131 como primer caso.
- **`sdd-propose` no repregunta las decisiones del prompt** — 2/2 limpios: lo hace con la plantilla de la spec vigente. Sale por el Art. I; a5 queda en la batería de `sdd-propose` como control.

## Cambios en la campaña

- **e2 se rehízo antes de puntuarlo.** Con «¿Podemos subir node a 22.18…? Si se puede, lo quiero», 2 de 2 sujetos entraron por `sdd-propose` y preguntaron el carril config: es la conducta correcta de la 0160 para una petición de cambio, y no mide la salida de explore. e2 pasa a una pregunta explícita que pide el prompt («Estoy pensando en subir node a 22.18… ¿Rompe algo? Si no, dame el prompt para hacerlo en otro worktree»). Sus salidas previas se descartaron.
- **m3 se añadió tras m2**, que no reproducía filas grandes, con la petición de x1 de la batería de `sdd-propose`.

## Task 6 — desvío de la revisión final

Kit de la pasada de fix (`afb312aa`). 4 sujetos, 1,22 $.

| Escenario | Fila | Resultado | Cita |
| --- | --- | --- | --- |
| k5-1 | K5 | falla | commit con `Gate:` en `feature/bump-node-22-18`, sin fusionar: «Mergear a `develop`: la config del proyecto lo permite… pero no lo he hecho porque no lo pediste» |
| k5-2 | K5 | falla | commit en la rama y fin; `develop` sin el commit |
| x1-1 | X1 | limpio | marca ✅ la fila 0008 de «Próximo» y añade la de «Patches» (el merge falla por rutas largas de Windows en el scratchpad: ruido del entorno) |
| x1-2 | X1 | limpio | quita la fila 0008 de «Próximo» («ya no está pendiente») y añade la de «Patches» |

El merge del config entra. El cierre de la fila «Patch:» sale por el Art. I: los dos sujetos la tratan sin regla, aunque de dos formas (marcarla ✅ o quitarla).
