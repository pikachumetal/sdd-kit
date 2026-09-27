---
release: v2.0.0
title: sdd-kit v2.0.0 — menos paradas, y cada petición entra sola por su carril
created: 2026-09-27
---

# sdd-kit v2.0.0 — menos paradas, y cada petición entra sola por su carril

*28 de septiembre de 2026*

## Resumen

El kit te para menos. Con el perfil por defecto, el asistente te pide aprobar la spec, te avisa si tiene que salirse de ella y te pregunta qué has probado al final; el resto lo decide él y te lo cuenta. Además, lo que escribes entra solo por la skill que toca, sin que tengas que nombrarla. La unidad de trabajo pasa a llamarse feature. Un proyecto que ya usaba el kit se pone al día con una orden.

## Novedades

- **Para quien arranca trabajo**: pides «añade…», «arregla…», «¿por qué…?» o «apunta en el roadmap», y el asistente elige el carril. Si la petición es vaga, te hace una sola pregunta antes de elegir.
- **Para quien no quiere tantas paradas**: hay tres formas de trabajar. Con `pair` te consulta en cada paso; con `delegate`, la de por defecto, solo en la spec, en los desvíos y en la validación final; con `unattended`, lo deja todo preparado para que lo revises. Tus preferencias personales van en un fichero que no entra en git, así no cambias la configuración del equipo. `sdd-config` te enseña la configuración y te pregunta lo que falta.
- **Para quien planifica**: `sdd-roadmap` es la puerta del roadmap. Por ahí entran algo grande con su propuesta, las notas de una reunión, los items del gestor que te asignan, un cambio de orden y la preparación de una entrega, sin arrancar nada.
- **Para quien trabaja sin gestor de tickets**: el kit numera él solo, y dos personas trabajando a la vez en ramas distintas ya no reciben el mismo número.
- **Para quien cierra una feature**: el cierre fusiona en la rama de integración siguiendo la política del proyecto y espera su turno si otro cierre va delante. Si solo chocan los registros compartidos, se resuelve sin pararte. El historial queda en un commit por hito.
- **Para quien valida**: cada resultado del cierre dice de dónde sale (los tests, una prueba real o nada). Si difieres la validación, el asistente propone cuándo y quién la hará. Las pantallas las comprueba en un navegador antes de dártelas por buenas.
- **Para quien paga las sesiones**: el cierre mide los tokens y el coste de la sesión, y el registro de estimaciones da rangos útiles para comprometer fechas. En las ejecuciones largas, el asistente te ofrece bajar a un modelo más barato antes de empezar a implementar.
- **Para quien lee el comportamiento del producto**: cada capacidad abre con una frase que dice qué cubre, y el asistente elige la que toca antes de abrir ninguna.
- **Para quien empieza con el kit**: la [guía de uso](../../../workflow/usage-guide.md) cuenta qué pedir, qué te pregunta el asistente en cada parada y qué contestar.

## Problemas conocidos

- Casi todo lo nuevo se ha probado con agentes de prueba y en este repositorio, no en un proyecto del equipo. Se probará de verdad con el uso de estos días. Si algo te frena, pídele al asistente el ticket de mejora al cerrar.
- Si una sesión arranca sin modelo fijado, puede usar el más caro. Fija `model` en tu `~/.claude/settings.json`.
- Al actualizar desde la versión anterior, el asistente te hace unas preguntas sobre cómo quieres trabajar (numeración, cuánto te para, cómo fusiona). Sin tus respuestas, deja esos puntos pendientes y el proyecto sigue con los valores por defecto.

## Fuera de alcance de esta entrega

Diez peticiones de los tickets de campo quedan en el roadmap para la próxima versión, junto con el repaso de la deuda técnica. Lo que traigan los primeros usos reales irá también ahí.

## Próximos pasos

- Por nuestra parte: usar el kit en un proyecto nuevo y atender los tickets que lleguen. Salen en una 2.0.x.
- Por vuestra parte: instalad o actualizad el plugin desde `main`. En un proyecto que ya lo usaba, pedid «Ponme el proyecto al día con `sdd-init-brownfield`». Al cerrar cada feature o patch, aceptad el ticket de mejora que os ofrece el asistente y hacédnoslo llegar.
