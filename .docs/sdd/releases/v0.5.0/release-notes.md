---
release: v0.5.0
title: sdd-kit v0.5.0 — el proceso se adapta al tamaño del cambio
created: 2026-09-02
---

# sdd-kit v0.5.0 — el proceso se adapta al tamaño del cambio

*2 de septiembre de 2026*

## Resumen

Hasta ahora, cualquier cambio no trivial pagaba la misma ceremonia: spec, plan y lista de tareas, daba igual que fuera una feature entera o un ajuste acotado de media mañana. Esta versión introduce una vía corta para lo pequeño sin rebajar ni una de las verificaciones, y deja el kit listo para instalarse sin sorpresas: ahora declara por sí mismo qué necesita tener alrededor para funcionar.

## Novedades

- **Para quien arranca un cambio acotado**: puedes trabajar en modo lite — una spec corta y directa al grano, sin documento de plan ni lista de tareas. No es un atajo que se conceda solo: el asistente comprueba cinco condiciones observables (el flujo ya existe, no cambia contratos, no toca datos, cabe en un área, cabe en media jornada) y te lo **propone citándolas una a una**; decides tú. Y si a mitad de camino deja de cumplirse alguna, el trabajo sube a modo completo y se escribe el plan que faltaba. Nunca al revés. La aprobación de la spec, la verificación y el walkthrough con el tiempo real siguen siendo obligatorios: lo que se abarata es la planificación, nunca la comprobación.

- **Para quien instala el kit en su equipo**: el kit ya dice lo que necesita. Al instalarlo, la librería de skills de la que depende se resuelve e instala sola. Si por lo que sea no se puede, verás un error que nombra qué falta y el comando exacto para arreglarlo, en vez de un flujo que arranca a medias y falla más tarde en un sitio raro. Es un fallo ruidoso a propósito: preferimos que se pare a que trabaje mal en silencio.

- **Para quien consulta la documentación del kit**: los prerrequisitos están en un solo sitio, el README, con qué es obligatorio, qué es opcional y cómo se instala cada cosa. Antes estaban descritos en dos documentos distintos que ya habían empezado a contradecirse.

- **Para quien usa el kit para pensar en voz alta**: la vía de consulta —preguntar, entender o tensar una dirección sin generar artefactos— vuelve a funcionar entera. Una de sus dos ramas llevaba rota desde que se creó.

## Problemas conocidos

- **La resolución automática de la dependencia no se ha probado en una máquina limpia.** Está construida sobre la especificación oficial, pero no hemos podido observar una instalación desde cero. Si al instalar en un equipo nuevo el kit aparece deshabilitado, el mensaje de error dirá qué falta y cómo instalarlo: ese es el camino a seguir.

- **Sigue sin haber distribución centralizada.** El kit se instala apuntando a la carpeta local del repositorio. Mientras sea así, cada versión nueva llega a quien tenga esa carpeta, no por actualización automática.

## Fuera de alcance de esta entrega

- Ocho de las skills siguen conteniendo una instrucción heredada de una herramienta que la aplicación ya no activa por defecto. No afecta al resultado del trabajo, pero está identificado y pendiente.
- La skill de arranque de tarea sigue siendo notablemente más larga de lo recomendable, y esta entrega no la ha reducido.
- Una limitación del método de pruebas quedó al descubierto: hoy no sabemos montar un entorno de prueba en el que una skill esté genuinamente ausente, sólo uno en el que no se pueda invocar por su nombre. Acota qué podemos demostrar de cualquier comportamiento de reserva.

## Próximos pasos

- Por nuestra parte: reducir la skill de arranque de tarea, y retirar la instrucción heredada de las ocho skills afectadas.
- Por vuestra parte: nada obligatorio. Cuando la empresa decida distribuir el kit al resto del equipo, hará falta decidir dónde se aloja el repositorio — hasta entonces la instalación local es el camino soportado.
