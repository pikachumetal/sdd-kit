---
status: accepted
date: 2026-09-15
rutas:
  - src/**
---

# Salida sin colores

## Contexto y problema

Algunas terminales de la oficina no muestran colores ANSI.

## Opciones consideradas

- Texto plano
- Colores ANSI

## Decisión

Texto plano.

### Consecuencias

- Nada de colores ni negritas.

### Confirmación

Ningún código ANSI en `src/`.
