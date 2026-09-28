---
release: v2.1.0
title: sdd-kit v2.1.0 — retoques visuales sin ceremonia y agentes que no se cuelgan en silencio
created: 2026-09-29
---

# sdd-kit v2.1.0 — retoques visuales sin ceremonia y agentes que no se cuelgan en silencio

*29 de septiembre de 2026*

## Resumen

La 2.1.0 sale de los primeros días de uso de la 2.0.0 en proyectos del equipo. Un retoque que solo cambia cómo se ve una pantalla deja de pasar por el ciclo completo, el asistente vigila a los agentes que lanza y te avisa si uno se queda colgado, y la revisión final ya no falla en proyectos con ramas grandes.

## Novedades

- **Para quien pide un retoque visual**: mover unos botones, cambiar un margen o un color ya no abre una feature con spec y revisión. Entra como un patch corto: el asistente apunta la intención en una frase, hace el cambio y te enseña una captura para que lo valides. Vale solo si el cambio toca plantillas o estilos y nada más. Si cambia textos, lógica, datos o cómo responde la pantalla, sigue siendo una feature, y el asistente te lo dice.
- **Para quien espera a que termine un agente**: mientras un agente trabaja o corre un comando largo, el asistente vigila que siga dando señales. Si pasa demasiado tiempo en silencio, lo para, lo relanza una vez y te avisa con lo que ha visto. Si se vuelve a colgar, para o aparca esa parte en lugar de esperar sin fin. Los minutos de espera se pueden ajustar por proyecto.
- **Para quien cierra una rama grande**: la revisión final ya no se atasca con ramas que borran mucho código. El paquete que lee el revisor deja fuera lo que no necesita y se lee por partes.

## Problemas conocidos

- Si la sesión carga una versión del kit anterior a la del proyecto, nada te avisa todavía, y una tarea puede ir entera con el flujo viejo. Tras actualizar el plugin, reinicia la sesión y comprueba que el asistente usa `sdd-start-feature` y `sdd-end-feature`.
- Los agentes que dejan trabajo propio en segundo plano y dan su turno por terminado se ven como terminados, y el asistente deja de vigilarlos. Los pasos del kit no trabajan así, pero puede pasar con agentes propios.

## Fuera de alcance de esta entrega

Lo que más frena hoy el trabajo diario queda para la próxima versión, en este orden: el aviso de versión del kit al arrancar la sesión, un cierre que no deje al usuario esperando tras validar, y pruebas que solo repitan lo afectado.

## Próximos pasos

- Por nuestra parte: sacar el aviso de versión y después el cierre sin esperas.
- Por vuestra parte: actualizad el plugin y reiniciad la sesión. No hace falta migrar nada en los proyectos. Cuando hagáis un retoque visual, pedidlo tal cual («pasa los botones a la derecha») y contadnos si entró por el camino corto. Al cerrar cada tarea, aceptad el ticket de mejora que os ofrece el asistente.
