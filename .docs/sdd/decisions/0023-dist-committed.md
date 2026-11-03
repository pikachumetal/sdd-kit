---
status: accepted
date: 2026-11-03
rutas:
  - dist/**
  - build/**
  - .claude-plugin/marketplace.json
---

# dist/ commiteado en develop, y el marketplace apunta a él

## Contexto y problema

Hasta la 2.3.4, la entrada del marketplace era `"source": "."`, y Claude Code copiaba en la caché de cada proyecto el repo entero. En una instalación de prueba con Claude Code 2.1.317 (feature 0300) eso fueron 20.117 ficheros y 109 MB, con `.docs/`, `tests/` y `cli/test/` incluidos. Además, la propuesta 0301 necesita que la fuente de una skill admita marcas que el agente no ve. Por eso la fuente se queda en `skills/` y un build genera `dist/`, que es lo que viaja. Faltaba decidir dónde vive `dist/`.

## Opciones consideradas

- `dist/` commiteado en `develop`, con `"source": "./dist"`.
- `dist/` ignorado en `develop` y publicado en el corte a una rama `dist`, con `{"source":"github","repo":"pikachumetal/sdd-kit","ref":"dist"}`.

## Decisión

`dist/` commiteado. La prueba de instalación no distinguió entre las dos: las dos dejaron la caché en 234 ficheros (1,6 MB) y actualizaron desde la 2.3.4 sin pasos. Tres razones deciden:

- La forma commiteada se probó tal como la recibe un usuario. La rama `dist` solo se probó con una fuente `url` contra el mismo repo, nunca con `github`.
- No añade un paso de publicación en el corte.
- El test que compara `dist/` con lo que sale del build corre en cada commit.

### Consecuencias

- El Art. VIII de la constitution pasa de «Ninguna copia, ni en este repo ni en los proyectos» a «Ninguna copia a mano». La de `dist/` no puede derivar sin que nadie se entere, que es el porqué de la [ADR 0008](0008-single-template-source.md). Esta ADR acota la 0008 y no la sustituye.
- Cada cambio de `skills/`, `agents/`, `hooks/` o `cli/` se commitea dos veces, la fuente y su copia en `dist/`. Para que no pese:
  - `.gitattributes` marca `dist/**` con `-diff linguist-generated`, así que el diff de una rama no sale doble.
  - `.ignore` lleva `dist/`, así que `rg` y el Grep del agente no lo buscan salvo que se nombre.
- Quien sube la versión o edita la fuente reconstruye con `moon run kit:build`, o el pre-commit falla.

### Confirmación

`cli/test/kit/dist.test.ts`, en `cli:test` (pre-commit y CI): `dist/` es lo que sale del build, no tiene marcas y solo lleva la lista blanca de `build/dist.ts`.
