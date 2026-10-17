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

El gate de cierre es `node --test` (constitution, punto 2) y `package.json` no declara dependencias de test.
