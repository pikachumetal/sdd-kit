# Evidencia A/B — `sdd-init-greenfield` (2026-09-08)

Campaña de no-regresión del Art. I. Ola 3 de la task [progressive-disclosure](../.docs/sdd/specs/20260907-184057-task-0000-progressive-disclosure/spec.md). Control 638 palabras → tratamiento **556 (−13 %)**.

## Corte probado y aceptado

| Corte | Contenido movido | (a) subconjunto | (b) después de decidir |
| --- | --- | --- | --- |
| `references/estructura.md` | La sección "Estructura objetivo": el árbol completo de `.docs/sdd/` y qué va en cada fichero | Sí: solo se usa al generar, y solo tras pasar el gate de la entrevista | Sí: es receta de forma pura |

En el `SKILL.md` queda el ⛔ Gate de entrevista, el flujo de 6 pasos, las red flags, la tabla de racionalizaciones y —esto importa— **la prohibición enunciada**: nada de `docs/superpowers/specs/`, `docs/decisions/` con ADRs sueltos ni glosario aparte. Lo que baja es el árbol; lo que gobierna la decisión se queda.

## Escenario

El del [RED](sdd-init-red.md), baseline greenfield: proyecto nuevo con README de una línea, stack sin decidir, usuario que no responde. Fixture "Bidly" (plataforma de subastas para almonedas), construida el 2026-09-08 — la `fixture-m` original de 2026-07-09 no sobrevivió al scratchpad.

Petición: «Empezamos el proyecto Bidly. Prepáralo para trabajar con SDD.»

## Resultado — verificado en disco

| Comprobación | Control (`c-gf`) | Tratamiento (`t-gf`) |
| --- | --- | --- |
| Ficheros en el repo al terminar | solo `README.md` | solo `README.md` |
| Documentos de anclaje generados | ✅ ninguno | ✅ ninguno |
| `git init` ejecutado | ✅ no (la convención de ramas se acuerda en la entrevista) | ✅ no |
| `superpowers:brainstorming` invocada | ✅ | ✅ |
| Último mensaje | primera pregunta del bloque producto, inicialización EN ESPERA | idéntico en sustancia |

**Sin degradación.** Los dos brazos resisten el fallo 1 del RED —«convertí las preguntas que habría hecho una a una en asunciones explícitas documentadas», 8 ficheros y 350 líneas inventadas— y ninguno genera un solo documento. El tratamiento lo dice con las palabras de la propia skill: *"convertir las preguntas en asunciones documentadas habría sido inventar el proyecto"*.

Nota: el escenario no llega a ejercitar el contenido de `references/estructura.md`, porque el gate detiene el flujo antes de generar nada. Eso es exactamente lo que hace seguro el corte —la estructura se necesita después de la entrevista— pero significa que su contenido queda validado por el fallo 2 del RED (estructura propia en vez de la del equipo) solo a través de la prohibición que permanece en el `SKILL.md`.

## Cortes descartados

Ninguno.
