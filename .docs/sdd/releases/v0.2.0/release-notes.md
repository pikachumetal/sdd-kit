---
release: v0.2.0
title: sdd-kit v0.2.0 — El kit aprende a cerrar releases
created: 2026-07-21
---

# sdd-kit v0.2.0 — El kit aprende a cerrar releases

*21 de julio de 2026*

## Resumen

Con esta versión el flujo cubre el ciclo completo entre entregas: además de arrancar y cerrar tareas y hotfixes, el kit ahora guía la apertura de la siguiente release y su cierre — acta de feedback, retrospectiva, notas para el cliente y sellado del changelog. Y las plantillas dejan de copiarse a cada proyecto: una sola fuente, siempre al día.

## Novedades

- **Para quien planifica la siguiente entrega**: `sdd-start-release` convierte el feedback acumulado, el backlog y la deuda en una propuesta ordenada con bloqueos marcados — qué entra lo decides tú, ítem a ítem, y solo se refina lo que se va a empezar.
- **Para quien cierra una entrega**: `sdd-end-release` produce el acta con el triage del feedback, la retrospectiva con números reales, las notas de release para el cliente y el changelog sellado. El merge y el tag nunca se ejecutan sin tu confirmación.
- **Para todos los proyectos**: se acabó la carpeta `templates/` local que se quedaba vieja — los artefactos se calcan directamente de las plantillas del kit, incluidas dos nuevas (acta de release y notas de cliente).

## Problemas conocidos

- El kit aún se instala desde ruta local (no hay repositorio remoto del equipo); hasta que lo haya, recibir esta versión requiere acceso a la máquina donde vive el repo.

## Fuera de alcance de esta entrega

- La pasada de recorte de las skills más largas y el refactor con la fricción del estreno real: siguen previstos para una versión posterior.
- Las skills técnicas por stack (nivel 2): fuera del kit por diseño.

## Próximos pasos

- Por nuestra parte: publicar el repositorio remoto del equipo y decidir su visibilidad.
- Por vuestra parte: cuando haya remoto, `/plugin marketplace update` para recibir las novedades; mientras tanto, reinstalar desde la ruta local si necesitáis el carril release ya.
