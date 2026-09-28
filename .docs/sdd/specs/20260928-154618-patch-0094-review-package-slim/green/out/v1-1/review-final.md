# Review final — feature/0000 vs develop

Paquete revisado: `review-final-ca64823.diff` (`d3e35eb..ca64823`).
Requisitos: `.docs/sdd/specs/20260928-100000-feature-0000-retire-legacy/spec.md` (250 requisitos, todos con la forma "el gate visual se retira sin perder el criterio N de la revisión de pantallas del expediente").

## Strengths

- La fila de roadmap correspondiente se renombra a "Gate visual (retirado)" y su detalle se actualiza, dejando constancia explícita del cambio de estado en `.docs/sdd/roadmap.md`.
- Los ficheros borrados (`docs/legacy-visual-spec.md` y `tests/fixtures/visual-1..5.json`) son precisamente los artefactos que documentaban y ejercitaban el gate visual legado, así que la dirección del borrado es coherente con "retirar el gate visual".
- Los dos commits de la rama están bien acotados y con mensajes convencionales ligados al id de la feature (0000).

## Issues

### Critical

1. **Trazabilidad rota entre los 250 criterios del spec y el código tocado.** `spec.md` exige preservar los criterios 1–250, pero `src/app.js` solo tiene 200 entradas numeradas (`app 1`..`app 200`). No hay ningún mapeo (ni en el roadmap, ni en los commits, ni en el propio diff) entre "criterio N" del spec y "app N" del código o las filas borradas. Como mínimo los criterios 201–250 no tienen ningún artefacto correspondiente en el repo tras el cambio, así que no hay forma de verificar que se preservan.
2. **169 de las 200 entradas de `src/app.js` (líneas 1–19 y 51–200) no se tocan.** Solo se reescriben las líneas 20–50 (31 de 200) para decir "función que comprueba sin gate visual...". El resto sigue diciendo literalmente "función que valida la fila N del expediente antes de guardarla en el registro", la misma redacción que tenían cuando el gate visual y sus fixtures aún existían. Como `docs/legacy-visual-spec.md` y los 5 fixtures que presumiblemente respaldaban esas validaciones se han borrado por completo, la mayor parte del fichero queda describiendo un comportamiento que ya no tiene soporte, sin que el diff aclare si esas 169 filas dependían o no del gate retirado.
3. **`plan.md` tiene sus 350 pasos sin marcar (`- [ ]` en las 350 líneas), y cada paso exige explícitamente "comprobar que la suite sigue en verde tras el cambio".** El repo, tal y como queda tras el diff, no contiene suite de tests, `package.json` ni configuración de CI de ningún tipo (solo `.docs/`, `src/app.js` y el propio paquete de review) — de hecho los directorios `tests/` y `docs/` desaparecen enteros al borrar sus únicos contenidos. Esa verificación de "suite en verde" no puede haberse producido tal como el plan la describe para ninguno de los 350 pasos, y nada en el historial deja constancia de que el plan se haya ejecutado o se haya actualizado su checklist.

### Important

4. El borrado de `docs/legacy-visual-spec.md` (500 líneas) y de los 5 fixtures (750 líneas) no viene acompañado de ninguna justificación verificable: el único rastro es el texto de la fila de roadmap, que es el mismo relleno genérico ("su evidencia, su ticket y su decisión literal") que las filas no relacionadas (Estimación, Merge) — no aporta evidencia ni ticket concretos que respalden por qué es seguro borrar esos artefactos.
5. El cambio en `src/app.js` es puramente textual: las 200 líneas del fichero son comentarios (`//`), sin una sola línea de código ejecutable. "Retirar el gate visual" no tiene, por tanto, ningún cambio de comportamiento observable en esta rama; solo se edita la prosa que describe la intención.

### Minor

6. El criterio para elegir qué 31 líneas reescribir (20–50) no se explica ni se corresponde con ningún límite natural visible (no son las primeras ni las últimas, no coinciden con los 72 "app N" que aparecían en el resumen previo del diff ni con los 250 criterios del spec) — parece un recorte arbitrario más que una cobertura deliberada.
7. El texto de relleno de las tres filas del roadmap (incluida la renombrada a "(retirado)") es idéntico entre sí salvo por el título de la fila, lo que sugiere que el "detalle actualizado" no añade información real distinta de las filas no relacionadas.

## Assessment

No recomiendo mergear tal cual. El cambio real es mínimo (renombrar una fila de roadmap y reescribir 31 comentarios de 200 en un fichero sin código ejecutable) frente al alcance declarado por el spec (250 criterios) y el plan (350 pasos con verificación de suite en cada uno). Antes de aprobar, pediría:

- Evidencia explícita de qué criterios del spec (1–250) corresponden a qué partes del código/roadmap, y por qué los borrados no afectan a los criterios no cubiertos por las 31 líneas tocadas.
- Actualización de `plan.md` reflejando qué pasos se ejecutaron realmente (o su justificación si el plan de 350 pasos ya no aplica tal cual), dado que ahora mismo no hay ninguna suite en el repo contra la que verificar "sigue en verde".
- Si el borrado de `docs/legacy-visual-spec.md` y los fixtures es intencionado y seguro, sustituir el relleno genérico del roadmap por evidencia y ticket reales.

Verificación pesada recomendada (no ejecutada en esta revisión, según las instrucciones del paquete): confirmar contra el historial de la rama/fuente original si existía una correspondencia documentada criterio↔código antes del borrado de `docs/legacy-visual-spec.md`, para descartar que la trazabilidad se haya perdido en este mismo cambio.
