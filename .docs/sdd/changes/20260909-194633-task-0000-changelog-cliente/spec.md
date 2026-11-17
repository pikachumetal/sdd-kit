---
id: 20260909-194633-task-0000-changelog-cliente
task: 0000
title: Changelog de cliente además del técnico (T18)
mode: lite
status: approved
created: 2026-09-09
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-09
---

# Spec — Changelog de cliente además del técnico (T18)

> **Estado**: approved (2026-09-09).
> **Siguiente paso**: modo lite → implementación directa tras aprobar.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: **sin review** — señales: ninguna. Modo lite (el flujo existe: paso 5 de `sdd-end-release` y pregunta (d) de la entrevista; sin contrato público; sin schema; carril release más una pregunta de init; ≤ media jornada).

1. **Qué es**: `.docs/sdd/changelog-cliente.md`, acumulado por versión y más reciente arriba, en lenguaje de cliente. Cada versión lleva el Resumen y las Novedades de sus release notes, **derivadas de ellas, no redactadas aparte**: dos textos de cliente por release divergen; uno destilado del otro no. El changelog técnico sigue siendo el exhaustivo (principio «dos audiencias, dos documentos»); el de cliente es el índice acumulado de lo que el cliente ya recibió.
2. **Opt-in por proyecto, por predicado**: existe si el proyecto lo quiere. La entrevista de `sdd-init-*` pregunta «¿changelog? ¿y de cliente?»; `sdd-end-release` lo actualiza **si existe** (paso 5 bis, en `references/notas-y-roadmap.md`), igual que el técnico se sella si existe. Sin fichero, nada cambia.
3. **Plantilla** `changelog-cliente-template.md` en `sdd-templates` (Art. VIII): cabecera con audiencia y regla de derivación, y la forma de cada sección de versión (`## vX.Y.Z — <fecha> — <título de las release notes>`, Resumen, Novedades). Índice de `sdd-templates` actualizado (el test de Pester lo exige).
4. **RED**: fixture Ledgerly con una release anterior cerrada (`releases/v1.2.0/release-notes.md`), `changelog-cliente.md` con la sección v1.2.0, changelog técnico con `[Unreleased]` lleno y la task 71 cerrada con walkthrough. Dos sujetos cierran v1.3.0 con `sdd-end-release` (dev-lead ausente: pasos 1–6, el 7 pendiente). Se mira si `changelog-cliente.md` gana la sección v1.3.0 derivada de las release notes nuevas, sin IDs ni jerga. Si el baseline ya lo hace 2/2 (el fichero existe y es evidente), la guidance del paso 5 bis sobra y queda solo la plantilla y la pregunta de init (Art. I).
5. **GREEN**: misma fixture con el kit nuevo; umbral 2/2 con la sección derivada (mismo Resumen y Novedades que las release notes) y el técnico intacto en su forma.
6. **Dogfooding**: el kit estrena su `changelog-cliente.md` al cerrar esta release, con la sección de la versión que se cierra; las anteriores quedan enlazadas a sus release notes en una línea, no se reescriben.
7. **Sin delta en `funcional/`**: el kit no tiene capacidad de release en `funcional/` (T15 lo anotó como candidata «carril-release»); crearla para una sección de una task sigue siendo lo que la plantilla prohíbe. Se mantiene la nota.

## Intent

El dev-lead decidió en el cierre de v0.6.0 que el kit lleve changelog de cliente además del técnico. Hoy el cliente recibe release notes por versión, cada una en su carpeta; no hay un documento acumulado que un cliente lea de arriba abajo para saber qué ha cambiado desde que empezó. Un segundo changelog redactado aparte divergiría del primero; uno derivado de las release notes no.

## Scope

- Entra: plantilla; paso 5 bis en `notas-y-roadmap.md` (solo si el RED lo respalda); pregunta en la entrevista de `sdd-init-greenfield` y en `generacion.md`; RED y GREEN con dos sujetos; `changelog-cliente.md` del kit.
- No entra: reescribir las release notes anteriores; automatizar la derivación con un script; el email de entrega (ya existe como borrador en la carpeta de la release).

## Approach

Derivar, no redactar: el paso 5 ya produce las release notes; el 5 bis copia su Resumen y Novedades bajo la versión en el acumulado. Medir primero si un agente con el fichero delante ya lo hace.

## Delta de comportamiento

Sin delta (decisión 7).

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,15 h
- Estimación de implementación: 0,6 h (rango 0,4–0,9)
- Base de la estimación: fixture de release (10 min), RED 2 runs (~2,5 $, ~6 min de reloj), plantilla + paso + pregunta (10 min), GREEN 2 runs, evidencia dos ficheros (15 min). Anclas: T15 0,25 h, T16 0,35 h.
- Confianza: media (primera campaña sobre `sdd-end-release`)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-09 | aprobada (chat, 7 decisiones sin cambios) |
