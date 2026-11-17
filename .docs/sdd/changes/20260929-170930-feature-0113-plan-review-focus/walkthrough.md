---
id: 20260929-170930-feature-0113-plan-review-focus
feature: 0113
title: Walkthrough — El plan lleva su Review Focus y el revisor final lo recibe
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-29
---

# Walkthrough — El plan lleva su Review Focus y el revisor final lo recibe

## 1. Cambios realizados

- **Plantilla del plan** (`skills/sdd-templates/templates/plan-template.md`, `dc5683b5` y `200fe574`):
  - Sección `## Review Focus` entre «Restricciones globales» y «Phase -1». Su ayuda cita a `writing-plans`. Cada línea lleva la entrada, el comportamiento esperado, la task y el test, o la verificación que la cubre. Una sección vacía dice «ninguna: comprobado» y no se borra.
  - Una línea que la resume en la ayuda de «Decisiones que he tomado yo».
  - Una fila por línea en el self-review §4.
- **Encargo del revisor final** (`skills/sdd-start-feature/references/encargo-revision.md`): si el plan tiene la sección, el encargo lleva `## Review Focus` tras «Cómo revisar», con la copia literal, y avisa de que remitir al plan no basta. La pasada de fix (`200fe574`) añadió «el test o la verificación que la fija».
- **Tests**: `tests/PlanReviewFocus.Tests.ps1`, con 9 literales.
- **Evidencia**: [`tests/plan-review-focus-red.md`](../../../../tests/plan-review-focus-red.md) y [`tests/plan-review-focus-green.md`](../../../../tests/plan-review-focus-green.md), con 15 sujetos headless.
- **Capacidad `feature-flow`**:
  - Requisito nuevo: «El plan lleva su Review Focus y viaja al revisor final».
  - «Los tests de la spec preceden al implementador» incluye ahora las líneas del Review Focus.
- **Docs vivos**: dos aprendizajes de campañas en `tech-stack.md` (§ Sujetos headless).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación: 4 h (1,5 h de texto y tests más ~2,5 h de campaña, del plan)
- Esfuerzo real: 1,3 h — reloj del hilo aproximado, sacado de las marcas de los commits (apertura 19:15, último commit 19:52, cierre ~20:30). Los ~20 min previos de spec y plan, desde el patch parado, van aparte.
- Desviación: -2,7 h (-68 %)
- Causa de la desviación: la campaña corrió en segundo plano mientras el hilo implementaba y revisaba, y cada sujeto tardó 2-5 min. El RED canceló la Task 2. La estimación sumaba la campaña en serie.
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y ejecución; sin bajar a gama media)
- Tokens del hilo: 37.885.091 — claude-opus-5-5 37.885.091 (la sesión entera: incluye el patch parado y el arranque antes de renombrar la rama)
- Tokens de subagentes: 4.274.609 en 6 despachos — Revisor final 0113 claude-opus-5-5 1.365.558 / 4 min; Re-revisión 0113 200fe574..e4451c29 claude-opus-5-5 1.443.512 / 3 min; Re-revisión 0113 e4451c29..ec234ac8 claude-opus-5-5 598.146 / 1 min; Re-revisión 0113 e4451c29..ec234ac8 (relanzada) claude-opus-5-5 276.944 / 0 min; Re-revisión 0113 e4451c29..ec234ac8 (Sonnet) claude-sonnet-5-5 222.602 / 1 min; Re-revisión 0113 ec234ac8 sin capturas claude-opus-5-5 367.847 / 1 min
- Coste de la sesión: 15,40 $ (hilo 11,83 $ + subagentes 3,57 $)
- Coste de sujetos: 12,03 $ en 15 sujetos Sonnet y Opus — RED Sonnet 2,98 $ (6); RED Opus 4,25 $ (4); GREEN Opus 3,90 $ (4); control de la pasada de fix Opus 0,89 $ (1)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Task 2 cancelada y alcance de la Task 1 recortado por el RED**, con la enmienda de la spec aprobada por el dev-lead («Apruebo la enmienda (Recomendada)»). Quedan fuera el paso 6 y la racionalización de `sdd-start-feature/SKILL.md`, la frase del implementador de `encargo-revision.md` y la ayuda de «Tests RED»: el baseline las cumplía.
- **RED y GREEN con Opus**: el plan preveía Sonnet. Sonnet no reprodujo el fallo (0 de 6), y el dev-lead aprobó medir con Opus.
- **15 sujetos, uno por encima del techo de 14**: el control de la pasada de fix, aprobado por el dev-lead.
- **La segunda re-revisión se relanzó tres veces** por cortes de los safeguards de la API: dos en Opus y una en Sonnet. Se cerró con Opus sin abrir las salidas de los sujetos, como decidió el dev-lead.

### Decisiones tomadas sin el dev-lead

- La guía entra solo donde el escenario del RED falla (Approach de la spec, Art. I) — coste si está mal: un Opus que no mete los tests del Review Focus en «Tests RED», que el control e del GREEN cumplió 1/1.
- El GREEN usa 4 sujetos Opus (p×2, r×1, e×1) para no pasar del techo de 14 — coste si está mal: r y e con n=1 en la primera medida.
- El test `plan-template self-review lists each Review Focus line` comprueba el prefijo de la fila tras la pasada de fix — coste si está mal: ninguno, porque el final lo fija el test nuevo del §4.
- Deferred minors de la revisión final:
  - La línea de «Decisiones» no dice qué escribir con un Review Focus vacío.
  - El ejemplo de `bookings` va fuera del placeholder.
- Deferred minors de las re-revisiones:
  - Un test fija «no se borra» y no «ninguna: comprobado», aunque otro lo fija.
  - En la evidencia del GREEN: el redondeo de 12,02 $ frente a los 12,03 $ del lanzador.
  - En la evidencia del GREEN: el control e mezcla criterios que el RED no midió.
  - En la evidencia del GREEN: una frase ambigua sobre la fila por línea.
  - En la evidencia del GREEN: «mejora frente al RED» sin fuente.
  - La deuda de la fila por línea, que va al roadmap.

## 4. Verificación

### 4.1 Builds

- Suite completa: `Invoke-Pester` sobre `tests/` sin la etiqueta `Slow` → 820 pasan, 0 fallan, 9 omitidos · 25 s.
- `tests/PlanReviewFocus.Tests.ps1` → 9/9.
- Revisión final (`sdd-kit:effort-high` + `opus`) sobre `dc5683b5`: With fixes, con 0 Critical, 1 Important (arreglado RED→GREEN en `200fe574`) y 2 Minor.
- Re-revisiones:
  - `200fe574..e4451c29`: 0 Critical, 0 Important, 6 Minor; los de redacción se aplicaron en `ec234ac8`.
  - `e4451c29..ec234ac8`: limpia, 5 Minor.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-29 · «ya sabess, diferido al uso, fedback, comit merge» · disparador: el primer plan de una feature del kit escrito con Opus tras el merge, a cargo del dev-lead, que comprueba que trae `## Review Focus` y su línea en «Decisiones».

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| El plan tiene `## Review Focus` entre «Restricciones globales» y «Phase -1», con entrada, comportamiento, task y test | ejecución real (GREEN p-1 y p-2, Opus) | 2/2; RED Opus 1/2 |
| «Decisiones que he tomado yo» lo resume en una línea | ejecución real | 2/2; RED 0/4 |
| El self-review lleva una fila por línea con su task y su test | ejecución real | parcial: 2/2 nombran los tests, pero en una fila agregada; con una fila por línea, 0/2 (deuda) |
| El encargo del revisor final lleva la sección literal | ejecución real (GREEN r-2 y r-3; los encargos del revisor final de esta feature) | 2/2; RED Opus 1/2 |
| Los tests del hilo cubren uno por THEN y uno por línea del Review Focus de la task | ejecución real (e: Sonnet 2/2 en el RED, Opus 1/1 en el GREEN) | sin guía nueva, cumple |

### 4.3 Residuales / deuda generada

- La fila del self-review §4 sale agregada y no una por línea (GREEN 0/2 con la forma de la plantilla): medir si hace falta la forma por línea → fila de deuda en el roadmap.
- Los minors diferidos de la sección 3 → fila de deuda en el roadmap, junto a la anterior.

## 5. Aprendizajes

- Una sección que pide superpowers y que la plantilla del kit no tiene se pierde según el modelo: Sonnet la saca de `writing-plans` y Opus sigue la plantilla del kit. Se mide con los dos. → `tech-stack.md` (§ Sujetos headless)
- Un revisor que abre los encargos capturados de los sujetos (`agent-prompts.txt`) puede caer por los safeguards de la API (`[reasoning_extraction]`). El hilo le pasa las líneas extraídas. → `tech-stack.md` (§ Sujetos headless)

## 6. Adendas
