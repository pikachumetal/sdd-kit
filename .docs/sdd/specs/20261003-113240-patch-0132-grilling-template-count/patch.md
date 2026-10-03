---
id: 20261003-113240-patch-0132-grilling-template-count
task: 0132
title: Patch — la plantilla de sdd-grilling muestra de 1 a N alternativas
type: patch
solution: dev-lead
status: done
created: 2026-10-03
branch: feature/0132-grilling-template-count
commit: bfef7b00
---

# Patch 0132 — La plantilla de `sdd-grilling` muestra de 1 a N alternativas

## Capacidades

- Modificadas: `interviewing` — el formato fijo numera las alternativas de 1 a N y deja de enseñar exactamente dos (🅰️ 🅱️).

## 1. Síntoma

El dev-lead, el 2026-10-03, tras el cierre de la 0128: «al poner el ejemplo como A/B la IA siempre acabará cayendo». Lo había visto en la sesión de la 0128: el agente (Opus) planteaba «dos soluciones y una híbrida» en 5 de sus 7 preguntas. La plantilla de la pregunta enseñaba exactamente 🅰️ y 🅱️.

Medido con la plantilla de `develop`, en Opus y con micro-tests (`micro/out/`):
- Una decisión con cuatro usos (formato de exportación): **dos alternativas más una 🔀 en 3 de 12**, y solo dos sin mezcla en otra.
- Dónde guardar las reservas: 2 alternativas en 4 de 4 (JSON y SQLite). No separa el ancla de que haya dos opciones reales.

## 2. Solución fijada

El dev-lead: «es dar a entender en el ejemplo que se de 1 a N, o de A a Z… el icono de Z lo puedes poner tú». Lo que da por existente, el bloque de plantilla en `skills/sdd-grilling/SKILL.md`, existe.

## 3. Fix

- **Fichero(s)**: `skills/sdd-grilling/SKILL.md`, `.docs/sdd/capabilities/interviewing.md` (delta de abajo), `tests/sdd-grilling-template.md`.
- **Cambio**: la plantilla pasa de 🅰️/🅱️ a `1️⃣ <recommended>`, `… from 1 to N, as the decision has` y `<N>️⃣ <other>`, y ➡️ recomienda 1️⃣. La regla de la cuenta deja de distinguir «dos, letras» de «tres o más, números». Queda en 649 de 650 palabras.
- **Decisiones**:
  - Mostrar de 1 a N en el ejemplo — dev-lead.
  - Números en vez de letras, y sin una 2️⃣ fija en el ejemplo (no enseñar ningún «dos»); así se acaban los dos sistemas de iconos que dieron el 🅲 de g7 — sin el dev-lead. Es de método, no cambia lo que el usuario del producto ve, y el dev-lead dijo «el icono lo puedes poner tú».
  - Ampliar la medida a n=12 antes de publicar — dev-lead («¿al final no vas a volver a medir?»).

## 4. Verificación

| Comprobación | Evidencia | Resultado |
| --- | --- | --- |
| Exportar con cuatro usos, «dos más una 🔀» | micro-test Opus, n=12 por plantilla | `develop` 3 de 12 → nueva **0 de 12** |
| Exportar, los tres formatos reales ofrecidos | ídem | 8 de 12 → **12 de 12**, con la mezcla como alternativa numerada en 6 |
| `mover` (un solo camino defendible): lo dice y lo confirma | ídem | 10 de 12 → 9 de 12 (sin cambio fuera del ruido; las que dan dos alternativas proponen una defendible, `--a <franja>`) |
| Dónde guardar (dos opciones reales) | micro-test Opus, n=4 | 2 alternativas en 4 de 4 con las dos plantillas |
| Topes y anatomía | `Invoke-Pester tests/WordBudget.Tests.ps1, tests/Skills.Tests.ps1 -CI` | verde |

Validación en campo: 2026-10-03 · micro-test Opus n=12 por celda (dos más 🔀: 3 de 12 → 0 de 12; camino único 10 → 9 de 12) · WordBudget y Skills en verde · el uso real lo dirán los tickets de `sdd-feedback`

Coste: ~8 $ en 56 llamadas de Opus. El método y el detalle están en `tests/sdd-grilling-template.md`.

## Delta de capacidad

### Capacidad: `interviewing`

**MODIFIED — Una decisión de diseño va en texto con formato fijo; una operativa, con diálogo** (antes: «cada alternativa con su icono (🅰️, 🅱️, 🔀 para una mezcla)»)
- GIVEN una decisión cuyas alternativas solo se entienden con su consecuencia explicada (más de una línea por alternativa: un coste, una escena, un argumento), como el diseño del RED con o sin persona en bucle
- WHEN el agente la pregunta
- THEN la escribe en texto, no con `AskUserQuestion`: ❓ título y cuerpo, las alternativas numeradas de 1 a N, tantas como tenga la decisión (1️⃣, 2️⃣…; 🔀 para una mezcla que se defiende sola), la recomendada como primera alternativa, y ➡️ la recomendada con su razón
- AND los iconos solo marcan alternativas de esa pregunta: para referirse a una de una pregunta anterior usa su nombre («primer turno»), no su icono
- AND una decisión operativa, cuyas alternativas se entienden en una línea sin explicar nada (aprobar o pedir cambios, seguir o parar, confirmar carril y perfil), va con `AskUserQuestion`, la recomendada primero
- AND unas etiquetas cortas no hacen operativa una decisión de diseño: «¿1️⃣ o 2️⃣?» con costes distintos detrás va en texto

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Real: 1h (micro-tests en dos tandas, la segunda pedida por el dev-lead)
