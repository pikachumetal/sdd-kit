---
status: accepted
date: 2026-10-17
rutas:
  - skills/sdd-init/**
  - cli/src/init/**
---

# El progreso de la init vive en la clave `init` de `sdd-kit.json`

## Contexto y problema

Una init se corta a medias: en campo, una sesión se reconstruyó del historial porque un fichero escrito no decía si el dev-lead lo había aprobado (ticket del statusline, B6, de la fila 0034). La init de la 3.0.0 escribe cada documento solo tras su aprobación, pero un proyecto puede traer de antes un `PRODUCT.md` de impeccable, un `CLAUDE.md` o un `CHANGELOG.md`, y la siguiente sesión tiene que distinguir lo que aprobó la init de lo que ya estaba.

## Opciones consideradas

- Deducirlo del disco: escrito = aprobado, con `sdd-kit.json` escrito el último como marca de init terminada.
- Un registro explícito en la clave `init` de `sdd-kit.json` (`approved` y `config`), que escribe y quita `sdd init`.
- Un fichero de progreso aparte en `.docs/sdd/`.

## Decisión

La clave `init` de `.docs/sdd/sdd-kit.json`. `sdd init --approved <ruta>` añade cada documento tras su «sí», `sdd init --config <json>` guarda las respuestas de `sdd-config`, y `sdd init --finish` las sube a la raíz, escribe la versión del kit y quita `init`. Solo cuenta como aprobado lo que lista `init.approved`. Deducirlo del disco tomaba como aprobados los ficheros previos (lo vio la revisión de dominio de la spec de la feature 0156), y un fichero aparte es un documento más sin lector fuera de la init.

### Consecuencias

- `sdd-kit.json` existe durante la init sin `version`: el hook no avisa de migraciones y `sdd-init` lo lee como init en curso, no como migración.
- Las respuestas de `sdd-config` sobreviven a un corte: no se vuelven a preguntar.
- Escribir el registro es mecánico y va a la CLI, no al texto de la skill.

### Confirmación

`cli/test/init/` (las tres acciones y la config previa a la primera aprobación), el escenario `n2` de `tests/batteries/sdd-init/` y el `i2` de la batería de `using-sdd`.
