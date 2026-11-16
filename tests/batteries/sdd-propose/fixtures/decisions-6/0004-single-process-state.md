---
status: accepted
date: 2026-09-10
rutas:
  - src/**
---

# El estado vive en un solo proceso

## Contexto y problema

salas la arranca una persona, reserva y la cierra. Hubo que decidir dónde vive su estado.

## Opciones consideradas

- En memoria del proceso
- Un fichero JSON o SQLite

## Decisión

En memoria: cada arranque empieza vacío. Guardar obliga a decidir dónde vive el fichero, dos terminales a la vez y cómo se migra el formato, y nadie lo ha pedido.

### Consecuencias

- Cerrar la terminal pierde las reservas.

### Confirmación

`src/` no importa `node:fs` ni ningún paquete de base de datos.
