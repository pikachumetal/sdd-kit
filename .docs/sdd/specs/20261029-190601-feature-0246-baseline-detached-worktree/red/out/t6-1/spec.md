---
id: 20261014-100000-feature-0022-scripts-to-node
feature: 0022
title: Los scripts del repo, a Node
mode: full
profile: delegate
status: approved
created: 2026-10-14
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: 2026-10-14
---

# Spec — Los scripts del repo, a Node

## Capacidades

- Modificadas: `tooling` — los scripts de `scripts/` corren con Node, sin bash.

## Decisiones que he tomado yo — valida estas

1. Sin decisiones propias.

## Intent

En los portátiles Windows del equipo no hay bash, y los scripts de `scripts/` no arrancan. Se quieren todos en Node.

## Scope

- Entra: todo script de `scripts/` que hoy corre con bash.
- No entra: cambiar lo que hace cada script.

## Dónde se prueba

- Sin bash: un test en `test/no-bash.test.js` que recorre `scripts/`, como `test/cancel.test.js`.
- Cada script: lo que imprime al ejecutarlo con `node`.

## Delta de comportamiento

### Capacidad: `tooling`

**ADDED — Ningún script del repo necesita bash**
- GIVEN los scripts de `scripts/`
- WHEN se buscan los que corren con bash
- THEN no queda ninguno: cada uno corre con `node`
- AND `node scripts/deploy.mjs` imprime `desplegado`, como hacía `scripts/deploy.sh`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | 2026-10-14 | aprobada |
