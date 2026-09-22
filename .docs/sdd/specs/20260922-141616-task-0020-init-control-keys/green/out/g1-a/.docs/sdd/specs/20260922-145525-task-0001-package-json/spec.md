---
id: 20260922-145525-task-0001-package-json
task: 0001
title: Crear package.json mínimo
mode: lite
profile: delegate
status: approved
created: 2026-09-22
author: agente SDD
approvers:
  - role: dev-lead
    name: TBD
    approved_at: null
---

# Spec — Crear package.json mínimo

> **Estado**: draft.
> **Siguiente paso**: modo lite → implementación directa.

## Decisiones que he tomado yo — valida estas

Ninguna: todo lo relevante se decidió con el dev-lead durante el onboarding y el brainstorming de esta task (ver abajo).

### Decisiones tomadas con el dev-lead

- Sin `"type": "module"`, CommonJS tal cual está el código — «Opción (a): sin "type": "module". Es lo más simple para un proyecto personal pequeño sin dependencias, y CommonJS funciona perfectamente.»
- Campos del `package.json`: `name`, `version: "0.1.0"`, `description`, `private: true`, `main`, `scripts.test`, `engines.node`, sin `dependencies` — «Sí, apruebo.»
- Sin campo `license` (uso personal) — «Solo una cosa: déjalo sin license (es uso personal)... Lo demás, perfecto.»

## Intent

El proyecto no tiene `package.json`: el README fija Node 22 solo en prosa, y no hay forma estándar de declarar metadatos, versión de Node soportada ni el comando de test. Se quiere un `package.json` mínimo que documente eso sin añadir dependencias ni cambiar el código existente (CommonJS).

## Scope

- Entra: crear `package.json` en la raíz con metadatos básicos, `engines.node` y `scripts.test`.
- No entra: añadir dependencias, convertir el código a ESM, `license`, publicar el paquete, lockfile.

## Approach

Fichero de configuración estático, sin lógica. Se calcan los valores ya decididos en `tech-stack.md` (Node 22, comando `node --test`) y `mission.md` (descripción de una línea).

## Delta de comportamiento

No aplica: cambio de packaging/tooling, sin comportamiento observable en `statusline.js` ni en `lib/`. No se crea ni se toca ninguna capacidad en `capabilities/`.

### Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec: 0.1h
- Estimación de implementación: 0.1h
- Base de la estimación: fichero único, sin lógica, sin tests que escribir (nada que probar salvo `node --test` siga funcionando)
- Confianza: alta

## Enmiendas

_Ninguna todavía._

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-22 | aprobado: «Sí, apruebo la spec. Refleja correctamente lo que acordamos en el onboarding.» |
