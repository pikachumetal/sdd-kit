---
release: v2.3.4
title: sdd-kit v2.3.4 — el kit funciona con superpowers 7.0.0
created: 2026-10-10
---

# sdd-kit v2.3.4 — el kit funciona con superpowers 7.0.0

*10 de octubre de 2026*

## Resumen

superpowers 7.0.0, publicada el 9 de octubre, rehace la skill con la que el asistente os entrevista antes de escribir la spec de una feature. Esta versión ajusta el kit a ese cambio para que las features sigan saliendo igual que antes: con su spec y vuestra aprobación antes de construir nada. No tenéis que cambiar nada en vuestro proyecto.

## Novedades

- **Para quien arranca una feature**: con la 7.0.0, el asistente ofrecía en su primer mensaje saltarse las preguntas. Ya no lo ofrece. Si aun así le pedís que empiece ya, escribe la spec con lo que sabe, deja sus suposiciones en «Decisiones que he tomado yo» y espera vuestra aprobación como siempre. En las pruebas, 5 de 5 sesiones hacían la oferta antes del cambio y ninguna después.
- **Para quien arranca una feature pequeña**: la 7.0.0 trata algunos cambios como «tarea rápida» o «cambio pequeño en el chat», sin documento. En el kit toda feature sigue teniendo su spec y su aprobación, sea del tamaño que sea.
- **Para quien revisa la spec**: la 7.0.0 trae su propio revisor de la spec. El kit no lo usa: la revisión sigue siendo la del kit, con el nivel que os propone el asistente.

## Problemas conocidos

- El kit no fija la versión de superpowers que instaláis. Esta versión está probada con la 7.0.0; si sale otra antes que la siguiente del kit, puede volver a haber diferencias.

## Próximos pasos

- Por nuestra parte: la 3.0.0, que reorganiza el cierre de las releases y la planificación.
- Por vuestra parte: actualizad el kit y superpowers, y reiniciad la sesión. Al arrancar, el asistente os avisará de que el proyecto tiene una actualización pendiente. Pedidle «ponme el proyecto al día con `sdd-init-brownfield`»: esta vez solo avanza la versión que el proyecto tiene apuntada.
