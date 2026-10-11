---
id: 20261011-194235-patch-0172-brainstorming-pieces
task: 0172
title: Patch — tres piezas de brainstorming que la 0168 quitó sin motivo
type: patch
solution: dev-lead
status: done
created: 2026-10-11
branch: patch/0172-brainstorming-pieces
commit: 375b4c4a
---

# Patch 0172 — tres piezas de `brainstorming` que la 0168 quitó sin motivo

## Capacidades

- Modificadas: `interviewing` — el boceto también enseña flujos y diagramas

## 1. Síntoma

Al revisar la 0168 contra la [ADR 0013](../../decisions/0013-fork-keeps-source-text.md) (un fork conserva el texto de su fuente salvo por tres motivos), tres piezas de `brainstorming` 7.0.0 aparecen en su anexo como «Descartada» sin motivo ni prueba: los **anti-goals** («sin fallo que la pida»), **«Show, don't tell» para flujos, secuencias y diagramas** («sin fallo que lo pida») y **«Think wide privately»** («la forma de `sdd-grilling` enseña las alternativas», que no es lo mismo: enseñar opciones no es filtrar antes). La segunda, además, contra lo que el dev-lead decidió en la 0168: «creo que artifacts cubre, 1», que sustituía el visual companion entero, no solo las pantallas.

## 2. Solución fijada

Decidida pieza a pieza por el dev-lead en un grilling, 2026-10-11:

1. **Anti-goals**: territorio de la entrevista, no pregunta literal; el registro, en Intent como éxito medible; lo que suponga el agente, a ✋ — «si, tu recomendación».
2. **Flujos y diagramas**: la regla del boceto de `sdd-grilling` recupera los dos casos de la fuente — «1, con archify para los diagramas y artifacts… archify es el preferido pero si no está usa un artifact».
3. **Think wide privately**: literal en `sdd-grilling`, «Shape of a question», antes de escribir las opciones — «1».

Lo que da por existente, comprobado en `develop` (`394c5570`): «What the spec covers» en `skills/sdd-propose/references/spec-writing.md`, la regla del boceto («For how a screen looks or feels, show it…») y «Shape of a question» en `skills/sdd-grilling/SKILL.md`.

## 3. Fix

- **Fichero(s)**: `skills/sdd-propose/references/spec-writing.md`, `skills/sdd-templates/templates/spec-template.md`, `skills/sdd-grilling/SKILL.md`, `tests/WordBudget.Tests.ps1`, `tests/batteries/sdd-grilling/{battery.md,subject.sh}`
- **Cambio** (más `skills/sdd-templates/templates/spec-template.md`, ayuda de Intent, por el humo `ag`): `spec-writing.md` recupera los anti-goals como territorio de la entrevista y añade a Intent «measurable where it can be (what would make it a failure even if it technically works)»; `sdd-grilling` recupera «think wide privately» literal y amplía el boceto a flujos y estructuras (skill de diagramas, `archify` la preferida; si no, Artifact; sin ninguno, texto con su motivo).
- **Decisiones**:
  - Las tres soluciones de §2 — dev-lead
  - El tope de `sdd-grilling` sube de 750 a 900 palabras, lo que mide el texto recuperado (ADR 0013: el tope sigue al texto de la fuente) — dev-lead, por la ADR 0013
  - Sin delta para los anti-goals ni para «think wide»: ninguna capacidad describe el contenido de Intent, y el filtro previo no se observa desde fuera — sin el dev-lead (no cambia lo que el usuario ve)
  - El humo, dos escenarios nuevos en la batería de `sdd-grilling` (`fl`, `ag`), y dos rondas de REFACTOR para que las piezas se cumplan: la ayuda de Intent de la plantilla nombra el éxito medible, y el boceto de un flujo se enseña antes de preguntar — sin el dev-lead (método; no cambia lo que el dev-lead fijó, solo lo hace efectivo)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `fl`: una feature con un flujo de estados; ¿se enseña el flujo como diagrama antes de preguntar? | Ronda 0 y 1: 0/3, el flujo en una lista de texto (`green-r0/out/fl-a`, `fl-b`, `fl-c`). Ronda 2, con «A decision about a flow… shows it before asking»: **2/2** dibujan el diagrama de estados (Mermaid) antes de preguntar; `fl-1` dice por qué va en texto (sin skill de diagramas ni Artifact en `claude -p`), `fl-2` no lo dice (Minor) |
| 2 | `ag`: «empieza ya» sobre una feature; ¿el Intent dice qué es el éxito, medible, y qué la haría fracasar aunque funcione? | Ronda 0: 0/1, Intent sin éxito (`green-r0/out/ag-a`). Ronda 1, con la ayuda de Intent de `spec-template.md`: **2/2** («El éxito: cancelar la reserva ocupante deja la sala reservada a tu nombre… Fracasaría aunque funcionara si…») |
| 3 | «Think wide privately» | No se observa desde fuera (es el filtro previo del agente): texto de la fuente recuperado literal, sin escenario (ADR 0013) |
| 4 | `Skills.Tests.ps1` y `WordBudget.Tests.ps1` | 247/247 en verde |

Validación en campo: 2026-10-11 · humo `fl` 2/2 y `ag` 2/2 con ejecución real por sujetos headless (tras dos rondas de REFACTOR) · pre-commit en verde (Pester 1.079)

## 5. Tiempo (ligero)

- Estimación: 0,75 h
- Inicio: 2026-10-11T19:42Z
- Real: 0,4 h desde que se abrió (más ~25 min de grilling antes, con el dev-lead)

## 6. Delta de capacidad

### Capacidad: `interviewing`

**MODIFIED — Escena concreta en las decisiones de producto**
- GIVEN una decisión sobre lo que ve o hace quien usa el producto (pegar un vínculo cuando el plugin no ve el portapapeles)
- WHEN el agente la pregunta
- THEN cada alternativa lleva una escena con datos y lo que se ve en cada paso («pegas `https://…/doc/42` → sale la tarjeta "Informe Q3"»), y la limitación técnica se cuenta por su efecto, no por su causa
- AND si la decisión es cómo se ve o cómo se siente una pantalla, deja de preguntar y propone enseñar un boceto: un Artifact con las opciones si la pantalla aún no existe; si existe, sobre la app real con lo que declara `§Frontend` (el detector en vivo, o una captura de la pantalla actual junto a la variante), y sin `§Frontend`, un Artifact
- AND si la app no se puede levantar o no hay acceso, o el harness no tiene Artifact, describe cada opción en texto con su escena y dice por qué no la enseña
- AND un flujo o una secuencia de pasos, o una estructura que se ve mejor que se lee (un diagrama, una línea de tiempo, un mapa), también se enseña: con una skill de diagramas si la sesión la tiene (`archify`, la preferida), y si no, con un Artifact con el diagrama; sin ninguno de los dos, en texto, diciendo por qué no lo dibuja
