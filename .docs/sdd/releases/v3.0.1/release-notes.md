---
release: v3.0.1
title: sdd-kit v3.0.1 — una sola carpeta para los documentos de cada cambio
created: 2026-11-17
---

# sdd-kit v3.0.1 — una sola carpeta para los documentos de cada cambio

*17 de noviembre de 2026*

## Resumen

Con la 3.0.0, los documentos de cada cambio (spec, plan, walkthrough) pasaron a nacer en `.docs/sdd/changes/`, pero los anteriores se quedaban en `.docs/sdd/specs/`. Con las dos carpetas a la vez, el asistente a veces creaba los nuevos en la vieja y costaba saber dónde mirar. Esta versión las junta: todo pasa a `changes/`.

## Novedades

- **Para quien actualiza un proyecto**: al pedir «actualízame al kit», el asistente mueve cada carpeta de `specs/` a `changes/` en un commit solo de renombrados y corrige los enlaces de los documentos que apuntaban a la carpeta vieja. Lo que hay dentro de cada carpeta no cambia.
- **Si algo no está listo para moverse**: con ficheros sin commitear, una carpeta vacía o un nombre que ya existe en `changes/`, se para sin mover nada y os dice qué resolver antes.
- **Para quien mira las estimaciones**: el registro de estimado frente a real sigue contando cada cambio en la versión en que nació, aunque su carpeta se haya movido.

## Problemas conocidos

- Un proyecto que viene de un template sin inicializar todavía recibe al arrancar el aviso de actualizar. En ese caso, haced primero la inicialización y después la actualización.

## Próximos pasos

- Por nuestra parte: que ese aviso distinga un template sin inicializar y os mande a la inicialización.
- Por vuestra parte: actualizad el kit, reiniciad la sesión y pedid «actualízame al kit». Revisad el commit de renombrados antes de publicarlo.
