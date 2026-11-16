---
status: accepted
date: 2026-09-10
rutas:
  - src/**
---

# Las reservas viven en memoria del proceso

## Contexto y problema

`salas` es una herramienta de terminal para una sola persona, que la arranca, reserva y la cierra. Hubo que decidir si las reservas se guardaban en algún sitio.

## Opciones consideradas

- En memoria del proceso
- Un fichero JSON en el disco
- SQLite

## Decisión

En memoria del proceso: cada arranque empieza vacío. Guardarlas obliga a decidir dónde vive el fichero, qué pasa con dos terminales a la vez y cómo se migra el formato, y nadie lo ha pedido.

### Consecuencias

- Sin ficheros ni dependencias; los tests no limpian nada.
- Cerrar la terminal pierde las reservas.

### Confirmación

`src/` no importa `node:fs` ni ningún paquete de base de datos.
