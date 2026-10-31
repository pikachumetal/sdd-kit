---
status: accepted
date: 2026-10-31
rutas:
  - skills/sdd-end-release/**
  - skills/add-to-changelog/**
  - skills/sdd-archive/**
---

# El changelog de la 3.0.0 se escribe en el corte, no en cada cierre

## Contexto y problema

En la forma 3.0.0, lo hecho queda en Now hasta cortar la release (propuesta 0131). Un cambio cerrado tendría dos registros si además escribiera su línea en `[Unreleased]`, y dos ramas chocarían en ese trozo del changelog.

## Opciones consideradas

- Cada cierre escribe su entrada y el corte solo saca la fila: quien cierra sabe la categoría, pero el hecho queda registrado dos veces.
- El corte escribe una línea por cada fila hecha de Now, con la categoría leída del artefacto.

## Decisión

El corte escribe el changelog con `add-to-changelog`. Es la lectura literal de la propuesta: la fila es el registro hasta el corte. En la forma 2.x, cada cierre sigue escribiendo su entrada.

### Consecuencias

- Un cambio sin fila en Now no se publica: el cierre le crea la fila, con su brief.
- Un id ya nombrado en `[Unreleased]` o en una versión sellada no gana segunda línea.
- Cuesta contexto en el corte, que lee cada artefacto para sacar la categoría.

### Confirmación

Un cierre con `ROADMAP.md` deja `CHANGELOG.md` sin tocar, y un corte deja una línea por fila publicada: escenarios `h` y `a` de `tests/sdd-end-release-0177-green.md`.
