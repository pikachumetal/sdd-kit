# Feedback sobre sdd-kit: sesión de la task 0004 (filtro por etiqueta)

Para quien mantiene el kit. Proyecto Horizon Notes, `sdd-kit` 1.1.0 (canal plugin), `superpowers` 6.3.0, task en modo `lite`, `ids.mode: sequence`. Sesión del 2026-09-19, de 08:40 a 09:35.

## Cómo leer este documento

Las fuentes son `session-log.md` (la bitácora del desarrollador) y el estado del repo, contrastados con las skills del kit. No tengo la transcripción de la sesión, así que no puedo decir si un paso ausente lo saltó el agente o lo provocó el kit. En cada punto separo lo que afirma la bitácora, lo que he comprobado en disco y lo que queda sin poder decir.

La bitácora no registra ningún fallo. Dice que ningún gate estorbó y que tests y smoke pasaron a la primera. Todo lo de la sección «Lo que ha fallado» sale de contrastarla con el repo, no de la propia bitácora.

## Lo que ha funcionado

1. **Gate de spec.** `spec.md` guarda la aprobación con hora (2026-09-19T08:52), coherente con la bitácora. Comprobado.
2. **Tests antes del encargo.** Según la bitácora, `tests/tagFilter.test.js` existía en rojo cuando se despachó al implementador, que es lo que pide el paso 6 de `sdd-start-task`. No puedo comprobar que se commiteara antes: el repo tiene un solo commit (`base`).
3. **Fusión del delta en la capacidad.** `capabilities/search.md` se creó con los dos requisitos ADDED y su entrada en Historial, como describe `aprendizajes-skills.md`. Hay una salvedad en el fallo 3.
4. **Sin preguntas repetidas.** Según la bitácora, `sdd-end-task` no volvió a pedir nada que `sdd-start-task` ya hubiera recogido, y la validación del paso 0 fue inmediata.
5. **Lite abarató lo previsto.** No hay `plan.md` ni `tasks.md`, y la bitácora no cuenta que el cierre los reclamara.

## Lo que ha fallado

### 1. El cierre no está completo en disco, pero la bitácora lo da por cerrado (alta)

La entrada de las 09:35 dice «Marco la task como cerrada». En el repo:

- No existe `walkthrough.md`, ni en la carpeta de la spec ni en ningún otro sitio, ni ignorado por git. La bitácora dice que «sale corto». Sin él fallan también los pasos 1 y 2 (tiempo real).
- `changelog.md` tiene `[Unreleased]` vacío (paso 7).
- `roadmap.md` sigue con 0004 «en curso» (paso 8).
- La bitácora no menciona la revisión de skills (paso 5), el code-review (paso 9) ni el cierre de rama (paso 10).

Son justo los red flags de `sdd-end-task`, incluida la racionalización «es una task lite, el cierre también va ligero». No sé si el agente los saltó, si no se guardaron o si la bitácora se adelantó a lo que ocurrió. Sí sé que las entradas de 09:24 a 09:35 describen como hechos pasos cuyo resultado no está en disco.

Propuesta: que `sdd-end-task` termine con una comprobación mecánica que liste los artefactos esperados según el modo y su estado, y que «cerrada» solo se diga cuando todos existan.

### 2. `estimation-log.md` escrito a mano, con riesgo de perder las filas (alta)

La bitácora dice «Anoto en `estimation-log.md`». El paso 3 prohíbe añadir filas a mano, salvo que no haya `pwsh`, y obliga a decirlo en el informe. En este equipo hay `pwsh`. Lo que hay en disco no lo generó `Build-EstimationLog.ps1`:

- Cabecera `AUTO-GENERADO por sdd-end-task. No editar a mano`; el script escribe `AUTO-GENERADO por Build-EstimationLog.ps1 (sdd-kit)`.
- Columnas `Task | Estimado | Real | Desviación`; el script escribe `Fecha | Task | Tipo | Est (h) | Real (h) | Ratio | Carpeta` y una sección de calibración.
- La fila de 0004 no tiene walkthrough de origen, porque no existe.
- La verificación de la migración v1.0.0 exige que la primera línea empiece por `<!-- AUTO-GENERADO por Build-EstimationLog.ps1 (sdd-kit)`. Este proyecto declara 1.1.0 y no lo cumple.

Lo he probado en una copia temporal, sin tocar el repo: ejecutar el script sobre el proyecto tal cual genera 0 filas y ningún aviso. El script solo avisa si el log existente no empieza por `<!-- AUTO-GENERADO`, y este sí empieza así. Como `specs/` no tiene ningún walkthrough, las filas de 0002, 0003 y 0004 se perderían en silencio la próxima vez que el paso 3 se ejecute como manda el kit.

Propuesta: que el script avise cuando el log regenerado tiene menos filas que el existente, o que se niegue a sobrescribir en ese caso.

### 3. La spec aprobada no sigue la plantilla, y el gate se quedó sin contenido (alta)

Comparada con `spec-template.md`:

- Falta «Decisiones que he tomado yo — valida estas», que es lo primero que el gate manda presentar y donde se declara una capacidad nueva. `search` no existía y se creó al cierre sin que apareciera declarada en ningún sitio.
- Falta «Estimación y esfuerzo», obligatorio en lite si existe `estimation.md`. El «estimado 1h» solo aparece en el log, así que no hay estimación previa a la implementación que auditar.
- El delta lista solo títulos (`ADDED — Filtro por etiqueta`), sin GIVEN/WHEN/THEN. Los escenarios que hay en `capabilities/search.md` se escribieron en la fusión, sin pasar por el gate. Y la regla de «un test por THEN» del paso 6 no tenía THENs de los que partir.
- El frontmatter difiere: `approvals` con `gate/by/at` en lugar de `approvers` con `role/name/approved_at`, `created` con hora y offset, sin `author`, y sin la tabla de Aprobaciones.
- El nombre de carpeta `20260919-084000-…` usa la hora local. `created` es 08:40+02:00, o sea 06:40 UTC, y `nombrado.md` exige UTC.

Hipótesis, sin evidencia: la plantilla vive en otra skill (`sdd-templates`) y, si no se carga, la spec se improvisa con la forma general. Propuesta: que `sdd-start-task` exija leer la plantilla antes de redactar, o que `sdd-end-task` compare las secciones obligatorias de la spec antes de fusionar el delta.

### 4. Modo lite: activación sin rastro y ejecución sin dónde declararse (media)

- El kit pide proponer lite citando las condiciones una a una y esperar confirmación explícita. La entrada de las 08:42 solo confirma el alcance funcional (una etiqueta, sin autocompletado). La spec dice `mode: lite`, sin rastro de las condiciones ni de la confirmación.
- La bitácora dice a las 08:55 que se despacha «un único subagente» y el resumen de coste habla de «un único subagente implementador (el propio hilo en línea, modo lite)». No puede ser las dos cosas. El kit reserva la ejecución en línea al campo `Ejecución` del plan, y lite no tiene plan, así que no hay dónde declararla. El paso 9 de `sdd-end-task` («solo si la task se ejecutó en línea») queda sin poder decidirse, y no hay rastro de ninguna revisión: ni `review-final.md` ni mención de `requesting-code-review`.
- El paso 6 manda copiar «Restricciones globales» del plan en cada encargo. En lite no hay plan, y el texto del kit no dice qué las sustituye. No sé si las cinco reglas de la constitution llegaron al implementador.
- Coste: 96k tokens para un módulo de 23 líneas y tres tests. La bitácora no desglosa en qué se fueron. Lo dejo como dato.

### 5. «Pasó a la primera» no dice que esté bien (media)

Comprobado ejecutando las funciones con Node:

```
extractTags('Nota #reunión y #año')          -> ['reuni', 'a']
filterByTag([{ body: '#reunión' }], 'reunión') -> 0 notas
```

`\w` no cubre caracteres acentuados y el proyecto está en castellano (artículo 1 de la constitution). Ni la spec, ni los tres tests, ni el smoke («una etiqueta real») lo cubrían, y la bitácora cita el «pasó a la primera» dos veces como señal positiva. No atribuyo el bug al kit. Lo que sí le toca es que lite no pide ningún escenario de borde y que el kit no define qué debe incluir el smoke más allá de «ejecutado y documentado». No lo he corregido: es una decisión del proyecto.

### 6. La rama no coincide con el id de la task (baja, sin confirmar)

La rama actual es `feature/0007` y la task es la 0004, que tiene fila en el roadmap. En `sequence` el id sale de esa fila (`nombrado.md`). 0007 sería el siguiente id libre (el roadmap llega a 0006), que es lo que devuelve `Get-NextSddId.ps1` cuando no hay fila. La bitácora no habla de la rama. Puede ser un artefacto del snapshot, con un solo commit.

## Qué haría falta para cerrar las dudas

- La transcripción de 09:20 a 09:35: si `sdd-end-task` se ejecutó entero, si se escribió un `walkthrough.md`, y si el paso 3 corrió el script o se hizo a mano.
- Si `sdd-templates` se cargó al redactar la spec.
- Cómo se creó la rama y con qué id.

## Límites de esta revisión

- No he podido correr la suite Jest: el repo no tiene `package.json` ni Jest instalado, aunque `tech-stack.md` manda `npm install` y `npm test`. Solo ejecuté las funciones directamente.
- El script de estimación lo probé únicamente sobre una copia temporal.
- No he modificado nada del proyecto salvo crear este documento.
