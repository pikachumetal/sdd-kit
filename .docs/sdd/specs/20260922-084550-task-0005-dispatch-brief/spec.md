---
id: 20260922-084550-task-0005-dispatch-brief
task: 0005
title: Despacho a subagentes — el encargo del implementador
mode: full
status: approved
created: 2026-09-22
author: agente
approvers:
  - role: dev-lead
    name: dev-lead
    approved_at: 2026-09-22
---

# Spec — Despacho a subagentes: el encargo del implementador

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (un requisito de `task-flow`), contrato público (la forma de la task en `plan-template.md`, que lee `task-brief` de superpowers)
- Mínimo razonable: ninguna — deja sin cubrir si el campo `Interfaces` choca con cómo `task-brief` corta la task; lo cubre el GREEN, que extrae una task real con el script.

1. **No se hace el script que compone el encargo** (la pieza que daba nombre a la fila). El fallo que lo justificaba —el mensaje de fix sale sin las restricciones— no se reproduce: 2 de 2 sujetos con el kit las llevan al fix y a la re-revisión ([RED](red/README.md), E1). Sin fallo no se escribe guidance (Art. I), y un script es código con tests que mantener. Queda en deuda como posible falso negativo (en campo fue un `SendMessage` a un agente vivo) y su ahorro de tokens se mide con la task 0010.
2. **Entran tres reglas fijas en el encargo del implementador**, las tres reproducidas: no silenciar un gate (4 de 4 lo hicieron: uno editó la configuración y tres disfrazaron el valor), no relanzar un test rojo sin capturar nombre y mensaje (1 de 2), nunca `git stash` (3 de 4).
3. **No entra «busca solo dentro del repo y sin procesos en background»**: 0 de 4 lo hicieron. A deuda como posible falso negativo (en campo salió en una sesión de 8 tasks).
4. **En modo lite, el bloque de Restricciones globales sale de la constitution**: el artículo de calidad de código y la política de modelos, literales. No se añade un bloque nuevo a `spec-template.md`: la spec lite seguiría igual de corta y la fuente ya existe.
5. **Cada task del plan lleva `Interfaces: Consume / Produce`**, el bloque que ya trae `superpowers:writing-plans` (se adopta, Art. IX), y la regla de que una task no remite a otras secciones del plan: copia los valores que necesita.
6. **Capacidad del delta: `task-flow` (existente)** — el despacho es un paso del flujo de la task, como el requisito vigente «El artículo de calidad de código viaja a implementadores y revisores». Alternativa descartada: una capacidad `dispatch` nueva para tres requisitos que no traen reglas propias.
7. **La task se partió en tres** (0005, 0021, 0022) en la primera pregunta; el roadmap ya lo recoge (`43867be`, renumeradas al integrar `develop`: la 0012 había tomado antes la 0019 y la 0020).

### Decisiones tomadas con el dev-lead

- Partir la fila 0005 en 0005, 0021 y 0022 — opción «Partir en 3 (Recomendado)».
- El método de la task lo decide el agente — «te voy a decir si a lo que me recomiendes... necesitamos que los cambios que metemos en el kit aporten calidad al kit, nos aporten valor y aligerar lo máximo sin perder calidad».

## Intent

Hoy el implementador recibe las restricciones y el contrato de tests, pero nada le dice qué hacer cuando un gate le estorba, un test ajeno falla o necesita apartar trabajo: en el RED silenció el gate 4 de 4 veces y usó `git stash`, cuya pila comparten todos los worktrees, 3 de 4. Además, los contratos entre tasks no viajan con la task y en modo lite no hay de dónde sacar las restricciones. Se quiere un encargo que cierre esos huecos sin añadir piezas nuevas.

## Scope

- Entra: tres reglas fijas en el encargo del implementador; fuente de las Restricciones globales en lite; `Interfaces: Consume / Produce` por task y regla de que la task viaja sola.
- No entra: script o plantilla que componga el encargo (decisión 1); regla de búsqueda fuera del repo y procesos en background (decisión 3); todo lo de revisión y effort (task 0021); paralelismo y frenos (task 0022); lint de los tests RED del hilo (task 0007).

## Approach

Todo va en los dos ficheros que ya gobiernan el despacho: `encargo-revision.md` gana las reglas fijas y la fuente lite, y `plan-template.md` el campo `Interfaces` y la regla de redacción. El paso 6 de `sdd-start-task` solo cambia la frase que dice de dónde sale el bloque. RED ya medido; el GREEN repite E2 con la cabecera nueva y mide un despacho en lite.

## Delta de comportamiento

### Capacidad: `task-flow`

**MODIFIED — El artículo de calidad de código viaja a implementadores y revisores** (antes: solo desde un plan con Restricciones globales)
- GIVEN un plan con Restricciones globales que copian el artículo de calidad de código de la constitution, o una task en modo lite, que no tiene plan
- WHEN se despacha un implementador, un revisor de task o el revisor final
- THEN el encargo lleva ese bloque literal como primera sección
- AND en modo lite el bloque lo forman el artículo de calidad de código y la política de modelos de la constitution, copiados literales

**ADDED — El implementador no esquiva lo que le frena**
- GIVEN un implementador despachado con el encargo del kit
- WHEN un gate o un checker le avisa, un test que no es suyo falla, o necesita ver el código sin su cambio
- THEN no edita la configuración del gate ni disfraza el código para que el aviso desaparezca: para y lo reporta con el mensaje literal
- AND antes de relanzar un test rojo captura su nombre y su mensaje, y no le atribuye causa sin evidencia
- AND no usa `git stash`: aparta trabajo con un commit WIP o lee la versión de la base con `git show`

**ADDED — Cada task del plan viaja sola**
- GIVEN un plan cuyas tasks usan firmas, formatos o valores que fija otra task o una sección del plan
- WHEN se extrae una task para su encargo
- THEN el texto de la task lleva `Interfaces: Consume / Produce` con los nombres y firmas exactos, y los valores que necesita copiados, sin remitir a otras secciones

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | dev-lead | 2026-09-22 | aprobada: «entiendo que la spec la has generado con datos yo solo tengo sensaciones del sdd-kit asi que te lo apruebo» |
