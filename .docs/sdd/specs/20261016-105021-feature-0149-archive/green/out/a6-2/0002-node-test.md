---
status: accepted
date: 2026-09-20
rutas:
  - test/**
---

# Los tests usan node:test

## Contexto y problema

Sin dependencias.

## Opciones consideradas

- node:test
- vitest

## Decisión

node:test.

### Consecuencias

- Sin dependencias.

### Confirmación

La suite del proyecto es `node --test`; la revisión comprueba que no entra ninguna dependencia de tests.
