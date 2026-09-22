---
kit_version: 1.1.0
superpowers_version: 6.3.0
lane: task
id: 0004
mode: lite
date: 2026-09-21
---

# Ticket para el kit — task 0004: task lite de un filtro puro, sin fricciones registradas

## Contexto

- Carril y modo: task lite
- Skills del kit usadas: `sdd-start-task` (pasos 1–7 y `references/modo-lite.md`), `superpowers:brainstorming`, plantilla de spec de `sdd-templates`. Implementador y revisor de task despachados como subagentes (la bitácora no cita `superpowers:subagent-driven-development` por nombre). `sdd-end-task` pendiente.
- Proyecto: aplicación de front pequeña, JavaScript plano sobre Node 20, tests con Jest, varias tasks previas cerradas con estimation-log, 1 persona que desarrolla y usa
- Modelo del hilo: no registrado en la bitácora
- Modelos de los subagentes: no registrado en la bitácora
- Coste en reloj: 40 min (08:40–09:20), de la carga de contexto a la validación; el cierre queda fuera
- Coste en tokens: implementador 96k, revisor de task 41k; hilo principal sin medir

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

Sin hallazgos

## Lo que hice por iniciativa propia

- **Bitácora de sesión con hora por paso y coste por subagente.** Ninguna skill del kit la pide (no hay mención en `skills/`); la bitácora no dice si la pidió el usuario o la llevó el ejecutor. Funcionó: dio el reloj real (40 min) y los tokens por subagente sin reconstruirlos después, y es la única fuente de este ticket. Candidato a regla: `skills/sdd-start-task/references/nombrado.md` (módulo `estimation.md`) exige tiempo real en el walkthrough, y la red flag del walkthrough con el tiempo en blanco está en `skills/sdd-start-task/SKILL.md`; esta es la forma barata de tenerlo.

## Funcionó, no tocar

- **Enrutado a lite citando el predicado** (`skills/sdd-start-task/SKILL.md` paso 2, `references/modo-lite.md`). La skill citó las cinco condiciones una por una y esperó confirmación; las condiciones se comprobaron una a una y se cumplían todas. Costó unos 3 minutos (08:40–08:43) y no hubo discusión sobre el modo.
- **Brainstorming invocado con `Skill` y spec con «Decisiones que he tomado yo — valida estas» arriba** (paso 4). Dos preguntas al usuario, decisiones (incluida la capacidad nueva declarada) en el bloque de validación, spec aprobada sin cambios en unos 2 minutos (08:50–08:52). Spec lite con el bloque de estimación dentro, con la referencia del estimation-log como base.
- **Tests RED escritos por el hilo principal antes del despacho** (paso 6, `references/encargo-revision.md`, «Tests RED»). El encargo del implementador nombró solo la ruta del test como contrato: los tests pasaron a la primera y el revisor de task no encontró nada. Sin idas y vueltas entre implementador y hilo.
- **Gate de validación del trabajo** (paso 7). Se presentó qué hay, cómo probarlo y el smoke (tres casos: valor real, mismo valor en mayúsculas, sin valor elegido). El usuario probó él mismo dos de los tres casos en la vista y dijo qué había probado. No añadió espera: el gate no estorbó.
- **Parada antes del cierre** (paso 8): la sesión paró tras la validación y dejó `sdd-end-task` para después, tal como fija la skill.

## Errores míos, no huecos del kit

- Ninguno registrado en la bitácora.
