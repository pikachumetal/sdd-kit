---
release: v3.0.2
title: sdd-kit v3.0.2 — menos tests que mantener y sin el panel de validación
created: 2026-11-18
---

# sdd-kit v3.0.2 — menos tests que mantener y sin el panel de validación

*18 de noviembre de 2026*

## Resumen

Esta versión recoge tres arreglos que pidió el uso real del kit. Un proyecto puede dejar de acumular tests de integración y E2E con cada feature, la validación manual vuelve a ser un guion en texto, y el kit avisa cuando una capacidad crece demasiado.

## Novedades

- **Para quien tiene una gate de cierre que no para de crecer**: si vuestro proyecto declara «Camino crítico» en `operations.md` y tiene su check (lo traen los templates), en la base quedan solo los unitarios y los tests de la lista `critical-path.md`, que edita una persona. Los demás tests de integración y E2E de una feature se pasan una vez al cerrar y se borran. Antes de borrar uno que la spec propuso para la lista, el cierre os pregunta si pegáis la fila. Sin «Camino crítico», todo sigue como estaba.
- **Para quien valida a mano**: el cierre ya no abre ninguna página ni panel. Os da el guion de pruebas en texto, paso a paso, y contestáis «validado» o el número del paso que falla.
- **Para quien ve specs muy largas**: `sdd capability check` avisa de una capacidad de más de 5.000 palabras y recomienda partirla por propósito con `sdd-propose`. Una capacidad enorme es la que hace crecer las specs que la tocan.

## Próximos pasos

- Por vuestra parte: actualizad el kit, reiniciad la sesión y pedid «actualízame al kit»; no cambia nada en vuestro proyecto salvo la versión. Si os sale el aviso de tamaño, partid esa capacidad cuando os venga bien.
