---
status: accepted
date: 2026-09-01
rutas:
  - test/**
---

# Los tests corren con node --test

## Contexto y problema

Hacía falta un runner de tests.

## Opciones consideradas

- node --test
- Vitest

## Decisión

node --test: viene con Node y no añade dependencias.

### Consecuencias

- Sin mocks avanzados.

### Confirmación

`package.json` no declara runner de tests.
