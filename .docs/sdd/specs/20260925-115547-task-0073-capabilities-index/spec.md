---
id: 20260925-115547-task-0073-capabilities-index
task: 0073
title: Índice de capacidades generado — propósito obligatorio y script que lo lista
mode: full
profile: delegate
status: approved
created: 2026-09-25
author: agente (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-25
---

# Spec — Índice de capacidades generado

## Capacidades

- Modificadas: `capabilities` — añade «Cada capacidad declara su propósito» y «El índice de capacidades se genera al vuelo»; cambia «La spec y el patch declaran sus capacidades al principio», «La consulta lee la capacidad, no las specs» y «El validador de capacidades»
- Modificadas: `migration` — añade «La migración a v2.0.0 añade el propósito a las capacidades»

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (el formato de `capabilities/*.md` que leen los proyectos y `Test-Capabilities.ps1`), MODIFIED (tres requisitos de `capabilities`), datos o migración (`migrations/v2.0.0.md`)
- Dominio: si el MODIFIED de «La spec y el patch declaran sus capacidades al principio» y el de «El validador de capacidades» conservan todas las cláusulas vigentes (señal: MODIFIED)
- Técnica: si las reglas del propósito de «El validador de capacidades» (sección, vacío, 300 caracteres) pasan sobre las 13 capacidades del repo y sobre la plantilla calcada, y si el paso nuevo de `v2.0.0.md` choca con `MigrationInitParity.Tests.ps1` (señal: contrato público + migración)
- Mínimo razonable: solo técnica — deja sin mirar la conservación de cláusulas de los `MODIFIED`, que cubre mi repaso de coherencia comparando cada bloque con el requisito vigente

**Decidido por mí, con la delegación: un revisor, lente técnica** (Sonnet, `sdd-kit:effort-medium`), con los siete puntos. La lente dominio la cubre el repaso de coherencia; dos revisores en paralelo pedirían tu confirmación (tu `CLAUDE.md` global). Es la misma decisión que en la 0070.

1. **El propósito es una sección `## Propósito`, no el párrafo bajo el título.** Es la forma de OpenSpec (`## Purpose`), se lee sin heurística y el validador puede exigirla por nombre. El párrafo libre bajo el título convive con la ayuda `>` de la plantilla y no hay forma limpia de saber dónde acaba. Va la primera, antes de `## Requisitos`, y el validador la admite junto a «Requisitos» y «Reglas de la capacidad».
2. **«Una o dos frases» se mide en caracteres: 300 como máximo.** Contar frases es frágil (`p. ej.`, `sdd-kit.json`); el tope en caracteres es determinista y deja sitio para dos frases. Además, falla un propósito vacío o que solo tiene el hueco `<…>` de la plantilla.
3. **El propósito no lleva procedencia.** Los párrafos actuales de las 13 capacidades del repo dicen «La declaró la spec de la task 0003 (decisión 2)»: eso es historial, que la 0070 sacó de las capacidades. Se reescriben en una o dos frases de qué cubre la capacidad; un puntero a otra capacidad o a una referencia se queda si cabe en el tope.
4. **Nombre del script: `Get-CapabilityIndex.ps1`**, en `sdd-templates/scripts/`, con `-Path <.docs/sdd>` como `Test-Capabilities.ps1`. Salida: una línea Markdown por capacidad, `` - `<nombre>` — <propósito> ``, en orden de nombre, lista para copiar al bloque «Capacidades». Sale siempre con 0: listar no valida, y una capacidad sin propósito sale como `(sin propósito)` en vez de desaparecer. La lectura de secciones que comparten los dos scripts baja a un fichero común que ambos cargan con `.`, como `SddLock.ps1`, para no duplicarla (Art. X).
5. **Dónde se ejecuta el índice**: en el paso 1 de `sdd-start-task`, de `sdd-roadmap` y de `sdd-consult`, que es donde cada skill decide qué capacidades lee, y en la ayuda del bloque «Capacidades» de `spec-template.md`, que hoy dice «tras listar `capabilities/`». En la ayuda de `capability-template.md`, «Sin índice: el listado de ficheros es el índice» pasa a nombrar el script. La regla vive en el `SKILL.md` de cada skill, no en una referencia (task 0013: 0 de 2 leyeron la regla que solo estaba en una referencia).
6. **Queda fuera el bloque «Capacidades» de `patch.md`.** Lo escribe `sdd-end-patch` al cerrar, y ese fichero lo está editando otro patch en paralelo: su ayuda sigue diciendo «tras listar `capabilities/`». Nueva fila de deuda: que el cierre del patch use el índice. También quedan fuera `proposal-template.md` («Capacidades que toca»), que ya se escribe desde el paso 1 de `sdd-roadmap`, y cualquier renombrado task → feature, que es de la 0064.
7. **La migración a v2.0.0 escribe el propósito sin gate.** Art. V: la release cambia la estructura de `capabilities/`, y sin el paso cada proyecto vería fallar el validador en todas sus capacidades al primer cierre. El agente saca el propósito del párrafo bajo el título, sin la procedencia, o de los títulos de los requisitos si no hay párrafo. El dev-lead lo ve en el diff y el informe lista las capacidades tocadas; el README de migraciones pide gate solo para borrados que no se recuperan igual. El volcado de greenfield calca la plantilla y ya trae la sección: no hace falta tocar las init.
8. **Campaña (Art. I), previsión y techo comunes, declarados antes del primer sujeto.** Un paso nuevo en tres skills lleva campaña completa, con tres escenarios sobre un repo de juguete con 9 capacidades en el que la capacidad que toca no se deduce del nombre del fichero: arrancar una task hasta la spec (`s`), meter en el roadmap un cambio de regla del cliente (`r`) y una consulta «¿dónde tocaría…?» (`q`). RED: 3 escenarios × 2 sujetos, con el kit de la rama antes del cambio y capacidades sin propósito. GREEN: los mismos 6, con el kit cambiado y el propósito en cada capacidad. Se mide qué capacidad elige cada sujeto, cuántos ficheros de `capabilities/` abre y, en el GREEN, si ejecuta el índice antes de elegir. Filas de control, de lo que el RED ya cumpla en los pasos tocados: nombre exacto reutilizado en el bloque, ninguna capacidad casi duplicada, la task en marcha que `sdd-roadmap` no toca y la distinción entre lo que dice el doc y lo que se infiere en `sdd-consult`; la lista final sale del RED. Previsión: 12 sujetos, ~6 $, ~1 h. Techo: `SUBJECT_CAP=14`, `COST_CAP=8`, con el fichero `stop` junto al lanzador; quedan 2 sujetos para una tanda de REFACTOR. El arnés es el de la 0070 (`run.sh`, `subject.sh`, molde), copiado a la carpeta de esta spec.
9. **Si el RED sale limpio, la guía entra igual.** Es la forma que el dev-lead pidió en la fila (índice generado en lugar de listar la carpeta), como el bloque «Capacidades» de la 0070 (su decisión 4). En ese caso la guía va sin prohibición ni tabla de racionalizaciones, y el GREEN la mide como control.
10. **Primera pregunta**: con 3 tasks internas previstas, no propuse partir.

### Hallazgos de la review

- **Aceptado** — 1. Crítico: el paso nuevo de la migración no dice qué declara en `**Escribe**:`, y `MigrationInitParity.Tests.ps1` exige que cada token de esa línea esté en el corpus de las init → AND en el requisito de `migration`: la línea no gana tokens y el paso va en la frase «Además…», como el del historial; las init ya lo reciben porque el volcado de greenfield calca la plantilla. El test sigue en verde.
- **Aceptado** — 2. Importante: nada comprueba que `## Propósito` vaya antes de `## Requisitos` → el validador falla si no es la primera sección.
- **Aceptado** — 3. Importante: la edición de la ayuda de `capability-template.md` estaba en la decisión 5 y no en el Scope → añadida al Scope con su texto.
- **Aceptado** — 4. Menor: el delta no decía que el párrafo libre bajo el título desaparece → AND en «Cada capacidad declara su propósito».
- **Aceptado** — 5. Menor: qué hace el índice con un propósito de más de 300 caracteres → lo escribe entero; validar es cosa de `Test-Capabilities.ps1`.
- **Aceptado** — 6. Menor: si los 300 caracteres cuentan los saltos de línea → se miden sobre el propósito en una sola línea, como lo escribe el índice.

### Decisiones tomadas con el dev-lead

- Carril task, modo full, perfil delegate, fila 0073 como enunciado — «Full + delegate, spec delegada» (2026-09-25).
- Spec aprobada por delegación — la misma opción, cuyo texto era «Apruebo la spec por delegación, nos vemos en la validación» (2026-09-25).

## Intent

Con muchas capacidades, el nombre del fichero no basta para que el agente sepa dónde buscar: hoy la regla es «el listado de la carpeta es el índice». El agente adivina por el slug, o abre todas las capacidades. Se quiere *progressive disclosure*, como las skills (nombre + descripción) y como OpenSpec (`## Purpose` y `openspec list --specs`): cada capacidad declara su propósito en una o dos frases, un script lo lista al vuelo, y las skills que eligen capacidades lo leen antes de abrir ninguna. No habrá un `index.md` escrito a mano, porque se desincronizaría y chocaría en los merges, como el Historial.

## Scope

- Entra: la sección `## Propósito` en `capability-template.md` y en las 13 capacidades del repo; en la ayuda de la plantilla, «Sin índice: el listado de ficheros de `capabilities/` es el índice.» pasa a «Índice: lo genera `Get-CapabilityIndex.ps1` al vuelo; no hay `index.md`.»
- Entra: `Get-CapabilityIndex.ps1` en `sdd-templates/scripts/`, con sus tests Pester (incluida la plantilla calcada tal cual y rellenada a medias, `architecture.md`), y su fila en el índice de `sdd-templates/SKILL.md`.
- Entra: `Test-Capabilities.ps1` exige el propósito, con sus tests (también contra la plantilla calcada tal cual y rellenada a medias).
- Entra: la ejecución del índice en el paso 1 de `sdd-start-task`, `sdd-roadmap` y `sdd-consult`, y en la ayuda del bloque «Capacidades» de `spec-template.md`, con RED y GREEN.
- Entra: el paso de `migrations/v2.0.0.md` que añade el propósito.
- No entra: el bloque «Capacidades» de `patch-template.md`, `sdd-end-patch` y `commit-milestones.md` (patch en paralelo; pasa a deuda, decisión 6), ni el lanzador de referencia de `tests/` (otro patch en paralelo).
- No entra: `proposal-template.md`; renombrar task → feature (0064); validar el contenido del propósito más allá de su presencia y su tamaño.

## Approach

Primero el formato y su comprobación: la plantilla gana `## Propósito`, el validador la exige, y las 13 capacidades del repo se reescriben hasta pasar el validador. Después el script del índice, sobre la misma lectura de secciones. Por último, las skills: RED con el kit actual, la guía del paso 1 de las tres skills y de la plantilla de la spec, y GREEN con los mismos escenarios y las filas de control (Art. I). La migración va con la primera pieza, porque cierra el mismo cambio de formato.

## Delta de comportamiento

### Capacidad: `capabilities`

**ADDED — Cada capacidad declara su propósito**
- GIVEN `capability-template.md` calcada para la capacidad `bookings` de un proyecto de reservas de salas
- WHEN se escribe `capabilities/bookings.md`
- THEN tras el título va `## Propósito` con una o dos frases, de 300 caracteres como máximo, que dicen qué cubre: «Reservar, consultar y cancelar salas por franja horaria.»
- AND `## Propósito` es la primera sección, antes de `## Requisitos`, y no queda ningún párrafo libre entre el título y ella
- AND el propósito no cuenta quién ni cuándo creó la capacidad: eso lo dicen git y el bloque «Capacidades» de cada spec o `patch.md`

**ADDED — El índice de capacidades se genera al vuelo**
- GIVEN `.docs/sdd/capabilities/` con `bookings.md`, cuyo propósito es «Reservar, consultar y cancelar salas por franja horaria.», y `rooms.md`, sin `## Propósito`
- WHEN se ejecuta `pwsh -NoProfile -File <sdd-templates>/scripts/Get-CapabilityIndex.ps1 -Path .docs/sdd`
- THEN escribe, en orden de nombre, `` - `bookings` — Reservar, consultar y cancelar salas por franja horaria. `` y `` - `rooms` — (sin propósito) ``, y sale con 0
- AND un propósito escrito en varias líneas sale en una sola, y las líneas de ayuda `>` no salen
- AND un propósito de más de 300 caracteres sale entero: el índice no valida
- AND sin carpeta `capabilities/`, o con la carpeta vacía, escribe `Sin capacidades` y sale con 0
- AND el índice no se guarda en ningún fichero
- AND `sdd-start-task`, `sdd-roadmap` y `sdd-consult` lo ejecutan en su paso de contexto, antes de decidir qué capacidades leer o tocar, y abren solo las que eligen con él

**MODIFIED — La spec y el patch declaran sus capacidades al principio** (antes: "escrita tras listar `capabilities/`")
- GIVEN un proyecto con `capabilities/bookings.md` y la fila 0021 «Cancelar una reserva: `salas cancelar <sala> <franja>` libera la franja»
- WHEN se escribe la spec de la 0021
- THEN la spec abre, tras el título, con `## Capacidades` y la línea `- Modificadas: \`bookings\` — añade «Cancelar una reserva»`, escrita tras ejecutar `Get-CapabilityIndex.ps1` y con el nombre exacto que da el índice (`bookings`, no `reservations` ni `booking`)
- AND cada capacidad del bloque tiene su subsección `### Capacidad: \`<nombre>\`` en el delta, y ninguna subsección del delta falta en el bloque
- AND una capacidad que no existe en `capabilities/` va como `- Nuevas: \`<nombre>\` — <qué cubre>`, y su creación aparece también en «Decisiones que he tomado yo»
- AND un cambio sin comportamiento observable lleva `Ninguna, porque <motivo>` (refactor, herramientas, docs) y no lleva delta
- AND `patch.md` abre con el mismo bloque; un patch no lleva «Nuevas»

**MODIFIED — La consulta lee la capacidad, no las specs** (antes: "WHEN existe `capabilities/<capability>.md`")
- GIVEN una pregunta de comportamiento ("¿qué hace hoy X?") en `sdd-consult`
- WHEN existe `capabilities/`
- THEN la consulta ejecuta `Get-CapabilityIndex.ps1`, elige por su propósito la capacidad que cubre X y ancla la respuesta en ese fichero, no en la reconstrucción a partir de specs históricas

**MODIFIED — El validador de capacidades** (antes: "una sección `##` distinta de `## Requisitos` y `## Reglas de la capacidad`")
- GIVEN `.docs/sdd/capabilities/bookings.md` cuyo requisito `### Consultar salas libres` tiene GIVEN y WHEN pero no `- THEN`
- WHEN se ejecuta `pwsh -NoProfile -File <sdd-templates>/scripts/Test-Capabilities.ps1 -Path .docs/sdd`
- THEN sale con código 1 y escribe `bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)`
- AND también falla, nombrando fichero y, si aplica, requisito, ante: un título que no es `# Capacidad — <nombre del fichero sin .md>`; una sección `##` distinta de `## Propósito`, `## Requisitos` y `## Reglas de la capacidad` (una `## Historial` incluida); una marca de delta (`**ADDED —`, `**MODIFIED —`, `**REMOVED —`) en la capacidad; un bloque `**Reglas de la capacidad**` en negrita, que es la forma del delta; una sección de reglas a la que falte alguna de sus cinco entradas por nombre
- AND ante `## Historial` el mensaje es `bookings.md: sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0`
- AND sin `## Propósito` escribe `bookings.md: falta la sección «Propósito»`; con la sección vacía, o solo con la ayuda `>` y el hueco `<…>` de la plantilla, `bookings.md: «Propósito» está vacío: escribe en una o dos frases qué cubre la capacidad`; con un propósito de 412 caracteres, medidos sobre el propósito en una sola línea como lo escribe el índice, `bookings.md: «Propósito» tiene 412 caracteres; el máximo es 300 (una o dos frases)`; y con `## Propósito` detrás de otra sección, `bookings.md: «Propósito» debe ser la primera sección`
- AND con `-Artifact <spec.md|patch.md>`, que se ejecuta después de fusionar el delta, falla si falta el bloque `## Capacidades`, si sus nombres no coinciden con las subsecciones `### Capacidad:` del delta, si no nombra ninguna capacidad ni dice «Ninguna, porque…» (`<a>: el bloque «Capacidades» está vacío: declara las capacidades o «Ninguna, porque <motivo>»`), si dice «Ninguna» y hay delta, si una capacidad del bloque no tiene fichero en `capabilities/`, o si un `patch.md` declara `- Nuevas:`
- AND sin fallos escribe `Capacidades válidas: <n>` y sale con 0; sin carpeta `capabilities/`, o con la carpeta vacía, y sin `-Artifact`, escribe `Sin capacidades que validar` y sale con 0

**Reglas de la capacidad**
- **Dónde viven los datos**: `.docs/sdd/capabilities/`, un fichero por capacidad; el índice lo genera `Get-CapabilityIndex.ps1` al vuelo y no se guarda en ningún fichero.
- **Límites**: el propósito de una capacidad, una o dos frases de 300 caracteres como máximo.
- **Avisos**: `Test-Capabilities.ps1` escribe una línea por fallo, `<fichero>: <qué falla>`, en castellano, y sale con 1; sin fallos, `Capacidades válidas: <n>`. `Get-CapabilityIndex.ps1` marca con `(sin propósito)` la capacidad que no lo tiene, y sale con 0.

### Capacidad: `migration`

**ADDED — La migración a v2.0.0 añade el propósito a las capacidades**
- GIVEN un proyecto en el kit v1.2.0 con `capabilities/bookings.md`, que abre con el párrafo «Verdad viva de las reservas de salas por franja. La declaró la spec de la task 0003.» y no tiene `## Propósito`
- WHEN se migra al kit v2.0.0
- THEN `bookings.md` lleva tras el título `## Propósito` con una o dos frases de 300 caracteres como máximo sacadas de ese párrafo sin la procedencia («Reservas de salas por franja.»), y el párrafo desaparece
- AND si la capacidad no tiene párrafo bajo el título, el propósito sale de los títulos de sus requisitos
- AND va sin gate, y el informe lista las capacidades a las que se ha escrito el propósito, para que el dev-lead lo revise en el diff
- AND la verificación de la migración ejecuta `Test-Capabilities.ps1 -Path .docs/sdd`, y no queda ningún fallo del propósito
- AND la línea `**Escribe**:` de `v2.0.0.md` no gana tokens: el paso va en su frase «Además…», como el del historial, y `tests/MigrationInitParity.Tests.ps1` sigue en verde
- AND sin carpeta `capabilities/`, el paso se salta y lo dice

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-25 | aprobada por delegación: «Apruebo la spec por delegación, nos vemos en la validación» |
