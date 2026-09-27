---
release: v2.0.0
title: sdd-kit v2.0.0 — planificar, hacer y entregar, con menos paradas
created: 2026-09-27
---

# sdd-kit v2.0.0 — planificar, hacer y entregar, con menos paradas

*28 de septiembre de 2026*

## Resumen

La 2.0.0 reorganiza el kit alrededor de tres verbos: **planificar** con `sdd-roadmap`, **hacer** con `sdd-start-feature` o `sdd-start-patch` y **entregar** con `sdd-end-release`. Lo que escribes entra solo por la skill que toca, sin que tengas que nombrarla. El asistente te para menos: con el perfil por defecto solo te pregunta al aprobar la spec, cuando tiene que salirse de ella y en la validación final. La unidad de trabajo pasa a llamarse feature. Un proyecto que ya usaba el kit se pone al día con una orden.

Es una versión grande. Salió de las 39 peticiones que dejó el uso de la 1.1.0 en tres proyectos y de los tickets de campo que los agentes escribieron durante estas dos semanas.

## Novedades

### Planificar: una sola puerta al roadmap

- **Para quien trae trabajo sin hacerlo todavía**: `sdd-roadmap` reconoce lo que le llevas y deja el roadmap listo, sin abrir rama, spec ni código. Distingue cinco entradas:
  - Algo grande y difuso. Te entrevista, escribe una propuesta con las reglas de negocio y sus ejemplos con datos, y la parte en features con su orden.
  - Algo concreto. Una fila, sin propuesta.
  - Los items que el PM creó en Azure DevOps o Jira, también los que te han asignado. Entran con su id del gestor. Si alguno es grande, te propone ya cómo partirlo para que el PM cree los hijos.
  - Las notas de una reunión con el cliente. Guarda el acta literal, convierte lo nuevo en filas y marca como aparcado lo que el cliente descarta, sin borrarlo.
  - Reordenar o cambiar lo que hay («la 14 va tras la 12»). Si cambia una regla ya acordada, añade una enmienda fechada y solo reparte lo pendiente.
- **Para quien prepara una entrega**: «prepara la release 3» también entra por `sdd-roadmap`. Hace el inventario, lo ordena por riesgo, marca los bloqueos y te deja decidir qué entra.
- **Para quien trabaja sin gestor de tickets**: el kit numera él solo. El id se reserva, no se calcula a ojo, y dos personas trabajando a la vez en ramas distintas ya no reciben el mismo número. Si una rama se creó sin id, se renombra sola al reservarlo.

### Hacer: cada petición por su carril

- **Para quien pide cosas al asistente**: al empezar cada sesión, el kit le dice por qué skill entra cada petición. «Añade…» va a una feature, «hay un bug…» a un patch, «¿por qué…?» a una consulta y «apunta en el roadmap» a planificar. Pasa por delante de las skills de superpowers, así que ya no hace falta pedirlo en el `CLAUDE.md`. Si la petición es vaga, te hace una sola pregunta antes de elegir.
- **Para quien no quiere tantas paradas**: hay tres perfiles. Con `pair` te consulta en cada paso. Con `delegate`, el de por defecto, solo para en la spec, en los desvíos y en la validación final. Con `unattended` lo deja todo preparado para que lo revises. En la primera pregunta de cada feature puedes aprobar la spec por delegación y verla en la validación.
- **Para quien quiere saber por dónde va**: cada cambio de paso abre con un aviso en llano («Ahora: … Queda: …, ~min»).
- **Para quien teme que el asistente se desmadre**: si descubre un tercer arreglo fuera del plan, si una decisión cambia lo que ve el usuario y la spec no la fija, o si otra rama ha tocado lo que está editando, para y te pregunta.
- **Para quien parte trabajo**: el umbral para proponer partir una feature tiene criterio. Con tres tasks o menos, nunca. Con más de cinco, siempre. Con cuatro o cinco, solo si tocan capacidades o superficies distintas o llevan migración.
- **Para quien arregla un fallo**: si el patch no reproduce el fallo, para sin abrir nada. Si el fallo medido no es el que decía el reporte, sigue con el medido y te lo dice.
- **Para quien ejecuta un plan**: por defecto el plan se ejecuta en la propia sesión, así puedes corregir sobre la marcha. Los planes largos pasan a subagentes. Cada task del plan dice cómo se prueba en la aplicación, y los escenarios de reglas de negocio llevan datos.

### Validar de verdad

- **Para quien valida una feature**: cada resultado del cierre dice de dónde sale: los tests, una ejecución real o nada. La validación trae un guion de pruebas numerado con el resultado esperado de cada paso, y un «sí» sin más cuenta como validación.
- **Para quien no puede probar en el momento**: puedes diferir la validación. El asistente propone un disparador concreto («lo pruebo en <el uso más próximo>, a cargo de <quien valida>»), la feature se cierra igual y su fila queda marcada 🧪 hasta que digas qué probaste.
- **Para quien entrega pantallas**: el asistente las comprueba en un navegador antes de darlas por buenas, con capturas y cada medida al lado de su valor esperado. Si no tiene el MCP de Playwright, usa el paquete `playwright`.
- **Para quien levanta servicios en las pruebas**: el asistente para lo que arrancó por su PID o su puerto, nunca por nombre.

### Cerrar y fusionar

- **Para quien cierra una feature o un patch**: el cierre fusiona en `develop` siguiendo la política del proyecto (con o sin `--no-ff`, con o sin push). Espera su turno si otro cierre va delante. Si solo chocan los registros compartidos (changelog, roadmap y registro de estimaciones), los resuelve sin pararte. Un hook en rojo ya no se confunde con un conflicto.
- **Para quien lee el historial**: cada feature queda en un commit de apertura, uno por task y uno de cierre, y cada patch en un fix y un cierre.
- **Para quien revisa**: la revisión final de rama la hace un revisor con el modelo más capaz sobre un paquete con la base del momento. Si después de ella entra otro commit, el cierre revisa ese tramo antes de dar nada por cerrado.
- **Para quien mantiene el comportamiento del producto**: el cierre de un patch actualiza también la capacidad que cambia, y al final del cierre te dice si la feature ha terminado y qué worktree puedes borrar.

### Coste y estimación

- **Para quien paga las sesiones**: el cierre mide los tokens y el coste de la sesión, del hilo y de los subagentes, con los transcripts de Claude Code. Funciona también con la configuración fuera de `~/.claude`.
- **Para quien estima**: el registro de estimaciones da la media, el rango p25–p75, el p80 para comprometer fechas y la tendencia del ratio, por tipo y por release. Con pocos datos, lo dice. Ya no lee «30 min» como 30 horas ni fecha una fila con el día de apertura.
- **Para quien quiere gastar menos**: con la sesión en el modelo más caro y un plan de varias tasks, el asistente te ofrece parar antes de implementar para bajar a Sonnet.

### Capacidades

- **Para quien lee el comportamiento del producto**: cada capacidad abre con una frase que dice qué cubre. El asistente consulta el índice y elige la capacidad que toca antes de abrir ninguna. Las capacidades ya no llevan historial: quién cambió qué lo dicen git y cada spec.
- **Para quien escribe specs**: cada spec y cada patch empiezan diciendo qué capacidades crean o modifican, o por qué ninguna, y un validador lo comprueba al cerrar.

### Configuración y arranque de proyectos

- **Para quien tiene sus manías**: tus preferencias personales (perfil, método de ejecución, cómo arrancar el entorno) van en `.docs/sdd/sdd-kit.local.json`, fuera de git, y no cambian la configuración del equipo. `sdd-config` te enseña la configuración y te pregunta lo que falta, de una en una.
- **Para quien arranca un proyecto nuevo**: la entrevista de `sdd-init-greenfield` hace una pregunta por turno y también pregunta qué queda fuera de alcance y qué términos del dominio se fijan. Funciona igual sobre un proyecto creado desde la plantilla del equipo.
- **Para quien inicializa un proyecto**: las dos init dejan desactivada la memoria automática (lo aprendido va a los docs, que están en git), ignoran los temporales de las herramientas y generan el registro de estimaciones. Los documentos de anclaje salen de sus plantillas, no copiados de otro proyecto.

### Instalación y actualización

- **Para quien instala**: superpowers se instala desde el marketplace de su autor, `superpowers-marketplace`, y no desde `claude-plugins-official`, que lo fija a una versión vieja. Queda validada la 6.4.2.
- **Para quien actualiza un proyecto que ya usaba el kit**: pide «Ponme el proyecto al día con `sdd-init-brownfield`». Una sola migración cambia los nombres de las skills en tus docs vivos, quita el historial de las capacidades y les escribe el propósito, declara el marketplace de superpowers y te pregunta, de una en una, cómo quieres trabajar.
- **Para quien empieza con el kit**: la [guía de uso](../../../workflow/usage-guide.md) cuenta qué pedir, qué te pregunta el asistente en cada parada y qué contestar.

## Cambios que rompen

- `sdd-start-task` y `sdd-end-task` pasan a ser `sdd-start-feature` y `sdd-end-feature`, sin alias. Las carpetas `-task-` de antes se siguen leyendo y no se renombran.
- `sdd-start-release` desaparece. Preparar una release y replanificar pasan a `sdd-roadmap`.
- El acta de la reunión con el cliente sale del cierre de la release y pasa a `sdd-roadmap`.

## Problemas conocidos

- Casi todo lo nuevo se ha probado con agentes de prueba y en este repositorio, no en un proyecto del equipo. Se probará de verdad con el uso de estos días. Si algo te frena, pídele al asistente el ticket de mejora al cerrar.
- Si una sesión arranca sin modelo fijado, puede usar el más caro. Fija `model` en tu `~/.claude/settings.json`.
- Al actualizar desde la versión anterior, el asistente te hace unas preguntas sobre cómo quieres trabajar (numeración, cuánto te para, cómo fusiona). Sin tus respuestas, deja esos puntos pendientes y el proyecto sigue con los valores por defecto.
- Paralelizar dentro de un plan todavía no tiene detector: si partes una feature entre varios agentes a la vez, revisa el resultado con cuidado.

## Fuera de alcance de esta entrega

Diez peticiones de los tickets de campo quedan en el roadmap para la próxima versión, junto con el repaso de la deuda técnica. Entre ellas están el paralelismo dentro del plan, las tasks abiertas al arrancar y los tickets de mejora con menos ruido. Lo que traigan los primeros usos reales irá también ahí.

## Próximos pasos

- Por nuestra parte: usar el kit en un proyecto nuevo, atender los tickets que lleguen y sacarlos en una 2.0.x.
- Por vuestra parte: instalad o actualizad el plugin desde `main`. En un proyecto que ya lo usaba, pedid «Ponme el proyecto al día con `sdd-init-brownfield`». Al cerrar cada feature o patch, aceptad el ticket de mejora que os ofrece el asistente y hacédnoslo llegar.
