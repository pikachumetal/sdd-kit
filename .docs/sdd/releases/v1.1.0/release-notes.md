---
release: v1.1.0
title: sdd-kit v1.1.0 — un solo idioma para los nombres que el kit pone en tu proyecto
created: 2026-09-20
---

# sdd-kit v1.1.0 — un solo idioma para los nombres que el kit pone en tu proyecto

*20 de septiembre de 2026 (en uso desde el 9 de septiembre)*

## Resumen

Los ficheros y carpetas que el kit crea en tu proyecto pasan a tener nombre en inglés, igual que las skills: se acabó la mezcla de `capabilities` con `funcional`. Un proyecto que ya trabajaba con la versión anterior se pone al día con una orden, y el registro de estimaciones deja de perder filas en silencio.

## Novedades

- **Para quien trabaja en un proyecto con el kit**: el comportamiento del producto vive en `capabilities/`, con un fichero por capacidad, y las novedades para el cliente en `client-changelog.md`. El contenido sigue en el idioma del proyecto; lo que cambia es el nombre del fichero.
- **Para quien actualiza un proyecto existente**: la actualización se hace sola y es segura de repetir. Si alguna capacidad tiene el nombre en castellano, el asistente te propone el nombre en inglés y espera a que tú lo decidas: es vocabulario de tu producto, no del kit.
- **Para quien mira las estimaciones**: el registro recoge también los arreglos pequeños escritos con el formato largo o con cifras aproximadas («≈ 1,5 h»). Antes se quedaban fuera con un aviso y el factor de calibración salía de un conjunto incompleto.
- **Para quien mantiene el kit**: un test vigila que ningún nombre en castellano vuelva a colarse en lo que el kit distribuye.

## Problemas conocidos

- Quien crea una capacidad **nueva** todavía no ve la regla del nombre en inglés: hoy solo se aplica al actualizar. Si el asistente te propone un nombre en castellano, corrígelo; queda resuelto en la próxima versión.
- El asistente puede no crear una capacidad cuando toca, o meter un dominio nuevo dentro de una capacidad existente. Pregúntale por la capacidad al aprobar cada spec. Es la prioridad de la próxima versión.
- En tareas de interfaz, las suites en verde no garantizan que la pantalla se vea bien: pide al asistente que la abra en un navegador antes de dar nada por terminado.

## Fuera de alcance de esta entrega

Todo lo que el uso real ha destapado entre el 16 y el 20 de septiembre —39 peticiones, recogidas en el [acta](feedback.md)— entra en la próxima versión, no en esta.

## Próximos pasos

- Por nuestra parte: abrir la próxima versión, partida en tramos, empezando por las capacidades.
- Por vuestra parte: al terminar una tarea con el kit, pedidle al asistente un ticket con lo que le ha costado —qué pasó, por qué el kit no lo evitó y qué propone— y hacédnoslo llegar. Los cinco recibidos hasta ahora son la base de la próxima versión. Y si habéis migrado Alybo o MDT, decidnos cómo fue.
