---
status: accepted
date: 2026-09-12
rutas:
  - src/**
---

# La lista de salas es fija

## Contexto y problema

Las salas cambian una vez al año.

## Opciones consideradas

- Lista en el código
- Fichero de configuración

## Decisión

Lista en el código: Norte y Sur.

### Consecuencias

- Añadir una sala es un cambio de código.

### Confirmación

`rooms` es una constante.
