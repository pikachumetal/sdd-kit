---
kit_version: 1.1.0
superpowers_version: 6.3.0
lane: task
id: 0004
mode: lite
date: 2026-09-21
---

# Ticket para el kit — task 0004: task lite sin fricciones, hasta la validación

## Contexto

- Carril y modo: task lite
- Skills del kit usadas: `sdd-start-task` (pasos 1–7), `sdd-templates` (plantilla de spec), `sdd-feedback`. `sdd-end-task` aún no ejecutada. De superpowers: `brainstorming`; se despacharon un implementador y un revisor de task (la bitácora no nombra la skill que los despachó).
- Proyecto: aplicación web pequeña, una sola persona, Node 20 con JavaScript plano y Jest; dos tasks anteriores en el `estimation-log`.
- Modelo del hilo: no registrado
- Modelos de los subagentes: no registrado
- Coste en reloj: 40 min (08:40–09:20, sesión del 2026-09-19), hasta la validación; sin cierre.
- Coste en tokens: 137k en subagentes (96k el implementador, 41k el revisor de task); hilo principal sin medir.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

Sin hallazgos

## Lo que hice por iniciativa propia

- Llevar una bitácora con hora por paso y tokens por subagente desde el arranque. Ninguna skill la pide. Funcionó: dio el tiempo real sin reconstruirlo y las cifras de coste de este ticket. Hueco: el hilo principal quedó sin contador. Candidato a regla: abrir la bitácora al invocar `sdd-start-task`; contrarresta la racionalización «Dejo el tiempo en blanco, no lo sé exacto».
- Repartir un THEN compuesto en dos tests. El THEN del primer escenario tiene dos cláusulas verificables (solo los elementos que cumplen el filtro; sin distinguir mayúsculas) y salió un test por cada una, no uno por THEN. Sin coste visible y pasaron a la primera, pero es un único caso, sin contraste. Candidato a regla: un test por cláusula verificable del THEN.

## Funcionó, no tocar

- **Enrutado a lite** (`skills/sdd-start-task/SKILL.md` paso 2, `references/modo-lite.md`): la propuesta citó las condiciones del predicado una por una y esperó confirmación. Tardó 3 minutos (08:40–08:43) y el modo aguantó hasta la validación.
- **Brainstorming y override de `bounded`** (paso 4, `references/overrides-superpowers.md`): dos preguntas, ambas acabaron como decisiones de la spec. La skill clasificó el cambio como acotado y aun así hubo `spec.md` con su gate, como manda el override.
- **Spec ligera con las decisiones arriba** (paso 4, plantilla de spec): aprobada en 2 minutos y sin cambios (08:50–08:52). Declaró la capacidad nueva en «Decisiones» aunque el proyecto aún no tenía `capabilities/`, y el bloque de estimación de lite iba dentro de la spec.
- **Tests RED del hilo antes del despacho** (paso 6): un test por THEN escrito y commiteado por el hilo principal, con su ruta como contrato. El implementador los pasó a la primera y el revisor de task no encontró nada. Límite: el cambio era trivial (dos funciones puras), así que no demuestra que el paso evite lo que se midió; solo que no añadió fricción.
- **Validación del trabajo** (paso 7): se presentó qué había, cómo probarlo y el smoke; quien valida dijo qué probó y que funcionaba. El smoke cubrió los escenarios de la spec más la variante de mayúsculas. La separación validación/cierre permitió parar con la task validada y sin cerrar.

## Errores míos, no huecos del kit

- Ninguno que la bitácora recoja.
