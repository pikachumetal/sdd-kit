---
id: 20261001-125120-feature-0050-feedback-less-noise
feature: 0050
title: Tickets de sdd-feedback con menos ruido
mode: lite
status: approved
created: 2026-10-01
author: Claude (sesión del dev-lead)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-01
---

# Spec — Tickets de `sdd-feedback` con menos ruido

> **Estado**: approved.
> **Siguiente paso**: modo lite → RED, edición de la skill y la plantilla, GREEN.

## Capacidades

- Modificadas: `kit-feedback` — un ticket por feature o patch, ticket mínimo si el cierre fue limpio, propuestas marcadas como verificadas o no, coste respaldado, menores en una lista, fuera «Errores míos», lint antes del commit

## Decisiones que he tomado yo — valida estas

1. **Cierre limpio, con un predicado observable**: no hay ningún hallazgo por encima del umbral de menores y el coste en reloj no pasa del techo de la estimación. Con ruling, desvío del plan, un paso del kit que falló o hubo que rodear, o una decisión que ningún paso del kit cubría, ya hay hallazgo. Entonces el ticket es el **mínimo**: la cabecera y tres líneas, sin más secciones. Las tres líneas son el contexto (carril, modo, modelo del hilo), el coste frente a la estimación, y «Nada que reportar» o lo hecho por iniciativa propia. Si hubo menores, van debajo en su lista. La forma sale de la propuesta 0119. Sustituye a «Sin hallazgos», que hoy deja el resto de secciones rellenas.
2. **Umbral de menor: menos de ~10 min de coste y una sola vez en la sesión.** Va en la sección final «Menores», una línea por menor con qué pasó y la ruta del kit. No lleva criterio de aceptación ni las demás líneas de un hallazgo. Si se repite en la sesión, o cuesta más, es hallazgo. El umbral es el de la consulta del 2026-09-23.
3. **«Verificada» es una línea propia de cada hallazgo**, después de la propuesta: `sí — <cómo>` (reproducido con un comando, o contrastado con `fichero:línea` del kit) o `sin verificar`. Si el hallazgo cita un fallo de ejecución (un error, un código de salida), «Qué pasó» da el comando exacto, el shell (PowerShell, Git Bash, WSL) y la línea de error. El caso de la 0026 §3: el mismo comando falla en PowerShell y funciona en Git Bash.
4. **Una causa de coste se respalda con la spec, el walkthrough o un commit (ruta o sha).** La frase del dev-lead sola no basta: en la 6304 §1 la causa venía de una frase del dev-lead, y al re-medirla no explicaba la desviación. Sin respaldo, se da la cifra y se marca la causa «sin respaldo».
5. **«Errores míos» desaparece de la plantilla.** Si una regla, un paso o una plantilla del kit pudo evitar el error, es un hallazgo con su ruta. Si no, no va al ticket. Un fallo del harness o del shell sin relación con el kit tampoco va (el `git commit -F -` de PowerShell del patch 0037). Ejemplo de error que pasa a hallazgo: el campo de la spec que el modelo de datos no tiene (6336). El repaso de coherencia del kit no lo contrasta.
6. **Un ticket por feature o patch.** El paso 4 amplía el ticket existente solo si es de la misma feature o patch. Si la sesión cierra otra, nace el suyo y el anterior no cambia (6336 §5). La oferta de `sdd-end-feature` paso 11 y `sdd-end-patch` paso 7 cambia «salvo que esta sesión ya haya generado el suyo» por «salvo que esta feature (este patch) ya tenga el suyo». En esos dos cierres no toco nada más, porque la 0124 edita `sdd-end-feature` paso 4 y `sdd-end-patch` paso 1 en paralelo.
7. **Lint antes del commit, paso nuevo en `sdd-feedback`.** Tras guardar, ejecuta sobre el ticket el lint de documentación del proyecto, el que declare `tech-stack.md` o el que corra su gate de docs o su pre-commit. Arregla lo que marque, por ejemplo partiendo las líneas largas. Si el proyecto no tiene lint de docs, lo dice en una línea al entregar el ticket. Caso de origen: la 0038 §1, un ticket con 12 líneas MD013 dejó en rojo la integración. `sdd-feedback` no commitea: el commit lo hace el cierre.
8. **No entra la clasificación del origen** (kit · override de superpowers · issue upstream · harness), de la consulta del 2026-09-23. El alcance del 2026-10-01 no la nombra. La decisión 5 ya saca el harness del ticket, y el triaje decide el destino. Si la quieres, es una línea más en la plantilla, pero añade texto sin un RED que la pida.
9. **La skill sigue sin citar evidencia.** Las reglas nuevas van sin «(ticket X)» dentro de `SKILL.md` y de la plantilla, en la línea de la propuesta 0119. La procedencia queda en esta spec y en `tests/`. Tope: `SKILL.md` no pasa de ~500 palabras (hoy 337).
10. **Campaña (Art. I), previsión de la feature entera.** Sujetos Sonnet headless sobre un molde sintético: un proyecto ficticio de notas, con `session-log.md` de la sesión y `tech-stack.md` que declara markdownlint con MD013 a 200. RED con la skill de esta rama antes de editarla, GREEN con la editada. Previsión: 4 sujetos en el RED, 4 en el GREEN y 2 de reserva, ~8 $ y ~1 h. Techo: 12 $ y 2 h. Una fila limpia en el RED no lleva guía y se repite como control en el GREEN.
    - `n1` (sesión con ruido). La sesión ya escribió el ticket de la feature A y ahora cierra la B. La B tiene:
      - un fallo de ejecución en PowerShell;
      - un coste por encima de lo estimado, con una causa que da el dev-lead y que el walkthrough contradice;
      - dos fricciones de ~5 min;
      - un error propio que el kit pudo evitar y otro de shell que no.

      Petición: «genera el ticket del kit de esta feature». Se mide una fila por decisión: 2, 3, 4, 5, 6 y 7. 2 sujetos por fase.
    - `l1` (cierre limpio): sesión sin fricción y coste dentro de la estimación. Se mide si sale el ticket mínimo (decisión 1). 2 sujetos por fase.
    - Filas de control en el GREEN, sobre los mismos sujetos: carpeta y nombre del fichero, privacidad (el molde lleva nombre de cliente), criterio de aceptación por hallazgo, sección de iniciativa propia.
    - Sin escenario: la frase de la oferta de los dos cierres (decisión 6). Cambia el sujeto de la condición y no añade conducta. La comprueba `tests/KitFeedback.Tests.ps1`, que se pone al día: «Errores» sale de las secciones exigidas y entran «Menores» y «Verificada».

### Decisiones tomadas con el dev-lead

- Feature lite, perfil `delegate` del proyecto, fila 0050 como enunciado, 2026-10-01 — opción «Lite, delegate (Recomendada)» de la primera pregunta.
- Parada en el gate de la spec, 2026-10-01 — opción «Paras en la spec (Recomendada)».
- Spec aprobada, 2026-10-01 — «Apruebo» (respuesta a la pregunta del gate).

## Intent

Los tickets de campo pesan entre 1.100 y 2.800 palabras, y la consulta del 2026-09-23 midió que solo un tercio es señal. Otro tercio repite lo conocido y el último es detalle de coste bajo. Además, el triaje ha copiado como decididas propuestas que nadie verificó, y causas de coste que no se sostenían. Se quiere un ticket corto cuando no hay nada que contar. Cuando sí lo hay, cada propuesta debe decir si está probada y cada causa de dónde sale, sin la sección de errores del agente. Y no debe romper el lint del proyecto.

## Scope

- Entra: `skills/sdd-feedback/SKILL.md`; `skills/sdd-templates/templates/kit-feedback-template.md`; la frase de la oferta en `skills/sdd-end-feature/SKILL.md` paso 11 y en `skills/sdd-end-patch/SKILL.md` paso 7; `tests/KitFeedback.Tests.ps1`; la evidencia en `tests/kit-feedback-noise-red.md` y `-green.md`; la capacidad `kit-feedback`.
- No entra: el resto de pasos de `sdd-end-feature` y `sdd-end-patch` (0124 y 0120 en paralelo); la clasificación del origen (decisión 8); migración, porque `.docs/sdd/kit-feedback/` no cambia de sitio ni de nombre; reescribir los tickets ya copiados en `field-reports/`, que no se editan.

## Approach

Se cambia la forma en la plantilla y la conducta en la skill. La plantilla gana la forma del ticket mínimo, la línea «Verificada» y la sección «Menores», y pierde «Errores míos». La skill gana el paso del lint y cinco reglas: cuándo toca el ticket mínimo, cuándo algo es menor, verificar, respaldar el coste, y qué error va o no va. Su paso 4 pasa a contar un ticket por feature o patch. RED antes de tocar nada, GREEN con los mismos escenarios.

## Delta de comportamiento

### Capacidad: `kit-feedback`

**MODIFIED — El ticket de mejora del kit vive en `.docs/sdd/kit-feedback/`** (antes: sin regla para una sesión con varias features)

- GIVEN un proyecto con `.docs/sdd/`
- WHEN `sdd-feedback` genera un ticket
- THEN lo escribe en `.docs/sdd/kit-feedback/<yyyyMMdd-HHmmss>-(feature|patch)-<id>-<slug>.md`, con el timestamp en UTC y el id del modo declarado en `sdd-kit.json`, calcado de `kit-feedback-template.md` del skill `sdd-templates`
- AND si la carpeta no existe la crea y avisa una sola vez de que puede ignorarse en git; no edita `.gitignore`
- AND si ya existe el ticket de esa misma feature o patch lo amplía; si la sesión ya escribió el de la feature A y ahora genera el de la B, nace `<ts>-feature-B-<slug>.md` y el de A no cambia

**MODIFIED — El ticket se escribe para un agente, no para una persona** (antes: sin marca de verificación ni respaldo del coste)

- GIVEN una sesión que acaba de ejecutar una feature o un patch
- WHEN se redacta el ticket
- THEN cada hallazgo lleva evidencia de lo que pasó en la sesión, el fichero **del kit** y el paso que lo origina —nunca un fichero del repo consumidor—, por qué el kit no lo evitó, una propuesta, la línea «Verificada» con `sí — <cómo>` o `sin verificar`, y un criterio de aceptación en forma de escenario
- AND si el hallazgo cita un fallo de ejecución, «Qué pasó» da el comando exacto, el shell y la línea de error: «`./scripts/check-docs.sh` en PowerShell → `The term './scripts/check-docs.sh' is not recognized`»
- AND una causa de coste cita la spec, el walkthrough o el commit que la respalda; con solo una frase del dev-lead, el coste da la cifra y marca la causa «sin respaldo»
- AND la cabecera declara la versión del kit (`.docs/sdd/sdd-kit.json`), la de superpowers, el carril, el modo y el coste en reloj y tokens, con «no medido» como valor honesto cuando no hay contador

**MODIFIED — «Sin hallazgos» es una salida válida** (antes: «Sin hallazgos» con el resto de secciones)

- GIVEN una sesión sin ningún hallazgo por encima del umbral de menores y con el coste en reloj dentro del techo de la estimación
- WHEN se invoca `sdd-feedback`
- THEN el ticket es el mínimo: la cabecera y tres líneas (contexto · coste frente a la estimación · «Nada que reportar» o lo hecho por iniciativa propia), sin las demás secciones, y no se inventa ninguna fricción para rellenar
- AND si hubo menores, van debajo en su lista

**MODIFIED — El hallazgo separa el hueco del kit del error del ejecutor** (antes: el error del ejecutor iba a su sección propia)

- GIVEN un fallo observado durante la sesión
- WHEN se clasifica en el ticket
- THEN si una regla, un paso o una plantilla del kit lo pudo evitar, es un hallazgo con su ruta del kit; si no —un error del agente que ninguna regla evitaría, o un fallo del harness o del shell sin relación con el kit—, no va al ticket
- AND lo que el agente hizo por iniciativa propia sin que el kit lo pidiera va en su sección, porque es candidato a regla nueva

**ADDED — Lo de coste bajo va en una lista de menores**

- GIVEN una fricción de menos de ~10 min que no se repitió en la sesión
- WHEN se redacta el ticket
- THEN va en la sección final «Menores», en una línea con qué pasó y la ruta del kit, sin criterio de aceptación
- AND si se repitió o costó más, es un hallazgo con todas sus líneas

**ADDED — El ticket pasa el lint de docs del proyecto antes del commit**

- GIVEN un proyecto que declara un lint de documentación (en `tech-stack.md`, su gate de docs o su pre-commit), por ejemplo markdownlint con MD013 a 200 caracteres
- WHEN `sdd-feedback` guarda el ticket
- THEN ejecuta ese lint sobre el ticket y lo arregla hasta que pasa, antes de que el cierre lo commitee
- AND sin lint de docs declarado, lo dice en una línea al entregar el ticket

**MODIFIED — El cierre de una feature y el de un patch ofrecen el ticket en la misma sesión** (antes: «si la sesión ya generó su ticket, la oferta no se repite»)

- GIVEN un cierre por `sdd-end-feature` o `sdd-end-patch` con el resto del checklist terminado
- WHEN el agente da el cierre por cerrado
- THEN ofrece generar el ticket con `sdd-feedback` en esa misma sesión, diciendo que al limpiar el contexto ese conocimiento se pierde
- AND la oferta no es un gate: sin respuesta, el cierre termina y no deja nada pendiente ni anotado en ningún artefacto
- AND si esa feature o ese patch ya tiene su ticket, la oferta no se repite; si la sesión generó el de otra feature, la oferta se hace igual

**Reglas de la capacidad**

- **Límites**: un ticket por feature o patch; los hallazgos van ordenados por coste observado y los menores, en una línea cada uno al final.

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,5 h
- Estimación de implementación: 1,5 h (rango 1–2,5 h)
- Base de la estimación: la 0002, que creó la skill y su campaña, tardó 1,3 h reales; la 0127, también de redacción y con campaña, 0,5 h frente a 1,5 h estimadas. Aquí hay dos escenarios con varias filas cada uno y un molde nuevo.
- Confianza: media

## Enmiendas

- 2026-10-01 — Decisión 9: el tope de `SKILL.md` pasa de ~500 a ~650 palabras. Queda en 611, con las reglas nuevas, las dos frases del REFACTOR y el predicado de cierre limpio de la pasada de fix. Recortar sin batería arriesga las fronteras que cerró el REFACTOR, y los topes los fija la 0120 — aprobada: opción «Enmienda: tope ~650 (Recomendada)».
- 2026-10-01 — Decisión 10: la campaña sube de 10 a 12 sujetos para el control `n1` + `l1` con la plantilla alineada tras la revisión final; el techo de 12 $ no cambia — aprobada: opción «Sí, 12 sujetos (Recomendada)».

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-01 | aprobada |
