---
source: https://github.com/pikachumetal/sdd-kit/issues/1
author: rafafields (usuario humano del kit, no agente)
date: 2026-09-21
---

# Issue GH #1 — «Velocidad y otras mejoras»

Primer ticket de campo escrito por un usuario humano. Van dos piezas copiadas literales: el cuerpo del issue y el bloque que su agente añadió a su `CLAUDE.md` tras pedirle lo del issue (llegó por el dev-lead, 2026-09-21).

## Cuerpo del issue (literal)

Me ha pasado usando el kit:

- Me instala superpowers a nivel de proyecto y me da la sensación de que está usando skills de este en vez de las skills del kit. He probado a poner una instrucción en el claude.md para forzar que el kit vaya delante, a ver sin funciona, pero por si ayuda
- Para tareas sencillas aplica todo el flujo de aprobación de plan, spec, etc... estaria bien tener un control de HITL que me pregunte al arrancar cada tarea cuantos puntos de control quiero
- He paralelizado una tarea y el propio review al final me ha reconocido que no ha sido adecuado, porque se han generado errores al acabar un agente y no haber acabado otro. Tal vez tener un detector de cómo de paralelizable es una tarea ayude antes de que un usuario pida paralelizarla para evitar estos problemas

En general no me está generando errores, a cambio se siente un poco lento, tal vez estas sugerencias ayuden a mejorar la velocidad en la experiencia de desarrollo

## Bloque añadido a su `CLAUDE.md` (literal)

esto es lo que ha añadido a mi claude.md después de pedirle lo del issue 
 
Skills
Usa siempre los skills de sdd-kit antes que los de superpowers.
Flujo de trabajo
Al iniciar cada tarea: revisiones y puntos de control
Antes de redactar la spec, pregunta al dev-lead dos cosas (con AskUserQuestion) y anota sus respuestas en «Decisiones que he tomado yo» de la spec:
Revisiones de agentes:
Revisión de la spec: ninguna, 1 revisor o 2 revisores. Propón el nivel que salga de la rúbrica de sdd-kit como recomendado.
Revisión por task: sí o no.
Revisión final de la rama: sí o no.
Puntos de control del dev-lead (dónde paras a esperarle):
Siempre: aprobación de la spec y validación final del trabajo.
Opcionales: aprobación del plan y parada tras cada task.
Lo que elija manda sobre los valores por defecto de los skills para esa tarea. No vuelvas a preguntarlo a mitad de tarea.
Paralelismo de las tasks
Cada task del plan.md lleva un campo Paralelismo con una de estas clases, y el motivo:
Independiente: no comparte ficheros ni interfaces con ninguna otra task; se despacha en paralelo con cualquiera.
Paralelizable con N, M: solo comparte con esas tasks un contrato ya fijado en el plan (una API simulada en las pruebas, tipos declarados en «Interfaces»); va en paralelo con ellas.
En serie tras N: consume código que produce la task N, o edita los mismos ficheros (registro de dependencias, Program.cs, el proyecto de pruebas, que compila como una unidad).
Despacha en paralelo según esa clasificación. Las tasks en paralelo comparten la CPU de la misma máquina: con tasks cortas, en serie sale parecido.
