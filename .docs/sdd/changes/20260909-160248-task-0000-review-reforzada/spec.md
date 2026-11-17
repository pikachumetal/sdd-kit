---
id: 20260909-160248-task-0000-review-reforzada
task: 0000
title: Review reforzada opt-in por task (T12)
mode: lite
status: approved
created: 2026-09-09
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-09
---

# Spec — Review reforzada opt-in por task (T12)

> **Estado**: approved (2026-09-09).
> **Siguiente paso**: modo lite → implementación directa tras aprobar.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: **sin review** — señales: ninguna (sin capacidad nueva, sin contrato público, sin `MODIFIED`/`REMOVED`, una capacidad, sin datos, sin dependencia; área leída). Modo lite.

1. **La decisión la toma el RED, no la spec** (tu `research.md` §4.4): fixture con un bug plantado del tipo SifAcademy 0001 —`publish(course)` sin guarda de estado, un curso oculto se re-publica— y tests que no lo cubren; baseline = las revisiones de `subagent-driven-development` con los encargos del kit (cabecera de `encargo-revision.md`). **Si la review de superpowers caza el bug en 2/2, no se añade nada**: `research.md` queda como fuente de la decisión y T12 cierra con ese resultado. Si no lo caza, se añade la review reforzada y el GREEN mide que una lente `correctness` lo caza.
2. **Si se añade, es opt-in por task y así de acotada** (`research.md` §4.3): campo `Review reforzada` junto a `Modelo`/`Ejecución` en `plan-template` (motivo: auth · roles y permisos · concurrencia · dinero o datos personales · sin tests RED previos; lentes; Sonnet/medium; tope 3); reglas en `sdd-start-task/references/review-reforzada.md`: se despacha **después** de las revisiones de superpowers sobre el diff completo, sin refutador automático (triage del hilo principal: dos lentes coincidentes = confirmado; Crítico/Importante se reproduce con un test RED antes de descartarlo), los Importantes entran en el fix, y el walkthrough registra lentes, hallazgos, confirmados, corregidos.
3. **Modo lite**: el flujo existe (`plan-template` y paso 6 de `sdd-start-task`), sin contrato público ni datos, un área, ≤ media jornada.
4. **Sin delta en `funcional/`** salvo que se añada la review: entonces un `ADDED` en `flujo-de-task` («Una task con riesgo declarado lleva review reforzada tras la de superpowers»), que el cierre fusiona.
5. **Fixture "Ledgerly-cursos"** calcada de la 0001 de SifAcademy en corto: `funcional/cursos.md` con «Solo un curso en borrador se publica»; task 90 implementada en `feature/90` con `publish` que ignora el estado; tests que cubren borrador→publicado y ocultar, no oculto→publicar; spec y plan aprobados con el Art. V de calidad en Restricciones. Dos sujetos headless por brazo.

## Intent

Los retos del equipo dejaron dos lecturas: la review adversarial multi-lente caza bugs graves cuando el implementador trabaja sin contrato cerrado (SifAcademy 0001, 0002, 0005) y devuelve cero o ruido caro cuando la spec y los tests RED ya lo fijan (0004, 0007; SifRest entero). El kit no sabe hoy si su review por defecto —la de superpowers con las restricciones del kit— caza un bug de transición de estado sin guarda. Se quiere saberlo y, solo si no lo caza, ofrecer una review reforzada opt-in, acotada y sin refutador automático.

## Scope

- Entra: fixture con bug plantado; RED con dos sujetos; si procede, campo en `plan-template`, `references/review-reforzada.md`, mención en el paso 6 y línea en el walkthrough; GREEN con dos sujetos; evidencia.
- No entra: review adversarial por defecto; refutador automático; más de tres lentes; cambios en `review-spec.md`.

## Approach

Primero medir. El artefacto (campo del plan y fichero de reglas) solo se escribe si el baseline falla; la guidance del paso 6 se limita a remitir al fichero. Un solo escenario con dos runs por brazo, sobre copia limpia del kit con `--add-dir` y `stream-json` para ver los encargos y los hallazgos.

## Delta de comportamiento

Sin delta salvo que el RED lo respalde (decisión 4).

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,2 h
- Estimación de implementación: 0,8 h (rango 0,5–1,2)
- Base de la estimación: fixture nueva (~15 min), RED 2 runs en paralelo (~10 min de reloj, ~5 $), evidencia (10 min); si el baseline falla, plantilla + fichero + GREEN (~25 min). Ancla: T10 0,5 h, T11 1,8 h con cuatro escenarios; este tiene uno.
- Confianza: media

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-09 | aprobada (chat, 5 decisiones sin cambios) |
