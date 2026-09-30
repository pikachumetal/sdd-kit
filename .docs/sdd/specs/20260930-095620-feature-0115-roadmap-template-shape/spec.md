---
id: 20260930-095620-feature-0115-roadmap-template-shape
feature: 0115
title: El roadmap en la forma de la plantilla
mode: full
status: approved
created: 2026-09-30
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-30
---

# Spec — El roadmap en la forma de la plantilla

## Capacidades

- Modificadas: `roadmap` — cambia cuánto dura una fila saldada y gana los requisitos de forma: secciones de la plantilla, sin prosa, cabeceras y estados literales, y dónde queda una validación pendiente de una release cerrada
- Modificadas: `migration` — gana la migración a v2.3.0, que lleva un roadmap existente a la forma con gate

## Decisiones que he tomado yo — valida estas

```text
Review de spec hecha: dos revisores (dev-lead, 2026-09-30) — señales: contrato público (el formato de `roadmap.md` lo leen cinco skills y `Get-NextSddId.ps1`), datos o migración (`migrations/v2.3.0.md` reescribe el roadmap de cada proyecto), área no explorada (`sdd-roadmap` y `sdd-end-release` solo leídas por grep) · tamaño: ~450 líneas en 12 ficheros, sin contar este roadmap
- Dominio: cruce de la sección de release, «Próximo» y las filas saldadas con `release-flow`, `planning` y `roadmap` (señal: contrato público)
- Técnica: los caminos de la migración, la paridad con las init y quién más lee el roadmap (señal: migración + contrato público)
- Mínimo razonable: un revisor con los siete puntos — habría dejado sin ver que «Release siguiente» contradecía a `planning`
```

1. **Roadmap estricto.** Solo las secciones de la plantilla, en su orden: «Próximo», `## Release <N>` (cero o más), «Backlog», «Deuda técnica», «Patches» y «Releases cerradas». Ninguna sección propia del proyecto.
2. **Sin prosa fuera de «Releases cerradas».** Fuera de ella solo se admiten líneas en blanco, el título `# Roadmap`, los encabezados `##` y filas de tabla. Una cita `>`, una lista o un comentario HTML cuentan como prosa. Única excepción: una sección `## Release <N>` admite una línea con el estado de la release («en preparación» o «comprometida»), que `sdd-roadmap` ya escribe. El orden entre filas vive en «tras NNNN», dentro de «Ítem».
3. **No hay sección nueva para el trabajo sin release.** Retiro `## Release siguiente`, que propuse antes de la review: contradecía a `planning` y a `release-flow`. El kit ya tiene los dos sitios: una feature que se va a hacer es una fila de «Próximo» con su id (`sdd-roadmap`), y una release preparada es `## Release <N>` con la versión que dice el usuario. `<N>` es una versión con puntos (`1.3`, `2.3.0`); nunca la supone el agente.
4. **Una decisión pendiente es una fila de «Backlog»**, con la numeración del Backlog del proyecto y sin id de la secuencia de features. El Backlog es lo que aún no se ha decidido hacer. En el RED, un sujeto reservó `0025` y `0026` para dos decisiones.
5. **Una fila saldada sale en el corte de release.** Hasta entonces conserva su prefijo. El validador la marca cuando su fecha es igual o anterior a la de la última release cerrada, que es la primera subsección `### v…` de «Releases cerradas». Aplica a «Deuda técnica» y a «Backlog», con los prefijos `Feature`, `Task` y `Patch`. Es un cambio del requisito vigente, que dejaba las filas saldadas para siempre.
6. **Una fila ✅ de «Próximo» sale igual en el corte**, pero el validador no la comprueba: su fecha no tiene formato fijo. Un descarte se queda como `⏸️ aparcada: descartada por <quién>, <fecha>`, que es como lo escribe `sdd-roadmap`; `❌` no es un estado.
7. **Una feature publicada no sigue en una sección abierta.** El validador marca la fila de «Próximo» o de `## Release <N>` cuyo id aparece como palabra entera en el texto de una subsección `### v…` de «Releases cerradas». Solo mira el texto de las releases cerradas: un «tras 0021» en otra fila abierta no cuenta.
8. **Las validaciones pendientes de una release cerrada van en una línea de su subsección**: `validaciones pendientes: 0016, 0017`. El disparador y el dueño siguen en el walkthrough o el `patch.md`, que no se tocan. El script no comprueba esa línea, porque «Releases cerradas» es la zona de prosa; la mide el GREEN. En esta feature solo la escribe la migración. Que la escriba `sdd-end-release` al colapsar, y el cambio de `release-flow` que eso pide, es de la 0123.
9. **El validador es `Test-Roadmap.ps1`**, en `sdd-templates/scripts/`, con la interfaz de `Test-Capabilities.ps1`: una línea por fallo, que dice la regla incumplida, y código de salida 1. La lógica de tablas de `tests/RoadmapStructure.Tests.ps1` pasa al script y el test lo llama.
10. **Quién hace cumplir la forma.** La plantilla manda borrar sus bloques de ayuda, así que las reglas no llegan al roadmap de un proyecto. En este repo las hace cumplir el pre-commit, porque `RoadmapStructure.Tests.ps1` ejecuta el script contra el roadmap. En los proyectos, hasta la 0123, solo la migración y quien lo ejecute a mano.
11. **La migración va en `migrations/v2.3.0.md`.** Es una minor: script nuevo y un cambio en la forma de un documento de `.docs/sdd/`. Si el corte decide otra versión, el fichero se renombra en el corte.
12. **Sin fichero de volcado en los proyectos.** Cambio lo que te dije: una copia del roadmap entero es idéntica a `git show <sha>:.docs/sdd/roadmap.md`, y un `roadmap-archive-<fecha>.md` sería un documento sin dueño, el tipo que el Art. XI prohíbe. La migración exige que `roadmap.md` esté commiteado antes de empezar y apunta ese sha en su informe y en el cuerpo de su commit.
13. **En este repo sí hay fichero**: `roadmap-before.md` en la carpeta de esta spec. Tiene dueño (la feature), no se edita, y deja buscables con `grep` las filas podadas y las decisiones.
14. **El aviso de «migraciones pendientes» sonará en este repo hasta el corte.** `v2.3.0.md` existirá con el marcador en 2.2.0, y el marcador lo sube el corte. Aquí se aplica solo el paso del roadmap. Subirlo antes cambiaría el aviso por el de «kit cargado menor que el del proyecto», que manda actualizar el plugin y es peor.
15. **Las init no cambian.** La línea `**Escribe**:` de `v2.3.0.md` declara `roadmap.md`, que las init ya escriben calcando la plantilla, y el marcador. Un proyecto nuevo nace en la forma.
16. **Principio nuevo en la constitution, Art. XI — Documentos acotados**: todo documento de `.docs/sdd/` es de estado (se reescribe) o un artefacto de evento (un fichero por evento, que no se edita), y declara quién lo escribe, quién lo lee y qué lo acota. La tabla con esas columnas va en `architecture.md`; donde hoy no hay cota, dice «sin cota» y la fila del roadmap que lo arregla.
17. **Las decisiones salen del roadmap con la regla del dev-lead**: reglas y descartes al documento de anclaje de su tema, lo de una release a su resumen en «Releases cerradas», y lo que ya está escrito en su sitio solo sale. No se crea `decisions.md`. Ninguna capacidad recibe texto por esta vía; si la tabla del gate lo pidiera, es un desvío.
18. **«Referencias de vigilancia» pasa a `tech-stack.md`**, con CodeMySpec, MySpec y el esquema `spec-driven-with-adr` de OpenSpec añadidos.
19. **Enlaces internos.** Los 20 enlaces `#versión-siguiente` de este roadmap se reescriben a la sección destino. Los de specs, walkthroughs y tickets históricos no se tocan: caen al principio del fichero.
20. **Quién más lee el roadmap, y qué le pasa.** `Get-NextSddId.ps1` lee cualquier fila que empieza por `| NNNN |`, en la sección que sea: no le afecta. El freno de alcance busca la cabecera con «Ficheros que toca», que no cambia. `sdd-end-release` colapsa `## Release <N>`, que es la forma que ya conoce.
21. **Tres filas nuevas en el roadmap**, fuera de esta feature: la propuesta «documentos acotados» (arquitectura y stack por temas al estilo ADR, umbral de partición en capacidades, constitution y `CLAUDE.md` sin anécdotas), los topes de palabras de los documentos de anclaje como ampliación de la 0120, y «fila de una línea con el enunciado en `specs/`».
22. **Campaña (Art. I).** Textos nuevos que un agente ejecuta o consulta, y su medida:

    | Texto | Camino | Medida |
    | --- | --- | --- |
    | Paso del roadmap de `v2.3.0.md` | Dev-lead ausente: roadmap sin tocar, tabla en el informe, sin commit ni marcador | g1, 2 sujetos |
    | Paso del roadmap de `v2.3.0.md`, con `roadmap-template.md` | Gates aprobados de antemano: roadmap migrado, validador en verde, controles C1 a C7 del RED | g2, 2 sujetos |
    | Paso del roadmap de `v2.3.0.md` | Roadmap que ya pasa el validador: el paso se salta y se dice | g3, 1 sujeto |
    | Bloques de ayuda de `roadmap-template.md` al apuntar una fila nueva | No se mide aquí: quien apunta es `sdd-roadmap`, que edita y mide la 0123 | — |
    | Fila nueva del índice de `sdd-templates/SKILL.md` | No se mide: ninguna skill ejecuta el script en esta feature; la migración lo nombra con su ruta | `Skills.Tests.ps1` |

    **Previsión ajustada, que apruebas con la spec**: 9 sujetos Sonnet en total (2 de RED ya gastados, 5 de GREEN, 2 de reserva), ~4 $, techo 10 $. Aceptaste 6 sujetos y ~6 $; salen a 0,30 $ cada uno, la mitad de lo previsto, y el GREEN necesita tres escenarios en vez de uno.
23. **Parada prevista en la ejecución**: el gate de la migración sobre este roadmap. Antes de mover nada te presento la tabla de destinos y espero tu sí. Incluye dos decisiones que son tuyas: si las 18 features pendientes van a `## Release 2.3.0` (conservan sus cinco columnas; es lo que recomiendo) o a «Próximo», y qué filas duplicadas se funden.

### Hallazgos de la review

Dominio:

- **Aceptado** — «Release siguiente» es un `MODIFIED` no declarado de `release-flow` y `planning` → retirada; el trabajo va a «Próximo» o a `## Release <N>`, que ya existen (decisión 3).
- **Aceptado** — «Una fila saldada sale en el corte» es un `MODIFIED` del prefijo contable → declarado `MODIFIED`, con la cláusula de `Task` reescrita.
- **Aceptado** — `## Release 1.3` de `planning` fallaría, y el estado de la release no tenía sitio → se admite una versión con puntos y una línea de estado (decisiones 2 y 3).
- **Aceptado en parte** — la línea de validaciones pendientes cruza con el smoke de `release-flow` → aquí solo la escribe la migración; el `MODIFIED` de `release-flow` es de la 0123 (decisión 8).
- **Aceptado** — reglas de la capacidad incompletas → «Idioma de los nombres» y «Regla ante conflicto» añadidas en `roadmap`, y «Dónde viven los datos» en `migration`.
- **Rechazado** — «dev-lead ausente» modifica la regla de gates → el punto 5 del README de migraciones ya dice «sin commit ni marcador» con gates pendientes; el escenario lo repite.
- **Aceptado** — paridad con las init y anclajes fuera del Scope → decisiones 15 y 17, y Scope.
- **Aceptado** — prohibiciones sin escenario → escenarios de sección duplicada, orden y `❌`.
- **Aceptado** — el volcado en un proyecto es un documento sin dueño → sin fichero (decisión 12).
- **Aceptado** — plantilla sin medir y previsión cambiada sin tu sí → decisión 22.

Técnica:

- **Aceptado** — el hook avisará de migración pendiente → declarado como esperado (decisión 14) y en el escenario del dev-lead ausente.
- **Aceptado** — falta la línea `**Escribe**:` → requisito con su AND.
- **Aceptado** — reintento y rechazo de la tabla sin escenario → sin volcado no hay duplicado; escenario de rechazo añadido.
- **Aceptado** — celdas sin dato → valor literal `—` y escenario.
- **Aceptado** — frontera de la fecha, elección de la última release y secciones → `<=`, primera subsección, «Deuda técnica» y «Backlog».
- **Aceptado** — regla de la feature publicada fuera de las decisiones y sin patrón → decisión 7 y escenario negativo.
- **Aceptado** — línea de validaciones sin comprobación → declarada sin comprobar por script (decisión 8).
- **Aceptado** — «prosa» sin predicado → definido (decisión 2), con escenarios de orden y duplicado.
- **Aceptado** — lectores y anclas sin declarar → decisiones 10, 19 y 20.
- **Aceptado en parte** — la plantilla cambia conducta → g2 la mide con la migración; apuntar filas nuevas es de la 0123 (decisión 22).

### Decisiones tomadas con el dev-lead

- Partir la feature: la 0115 se queda con la forma y el mantenimiento pasa a la 0123 — «Partirla (Recomendada)», 2026-09-30
- Modo full, perfil `delegate`, con parada en la spec — «Full, delegate, paro en la spec (Recomendada)», 2026-09-30
- El roadmap no lleva prosa y no se pierde ningún dato — «no creo que sea el sitio roadmap, lo que no quiero es perder datos», 2026-09-30
- Sin `decisions.md`; cada decisión a su sitio — «si hacemos un decision sin template será un cajón de sastre y es un doc nuevo, que alguien tiene que leer», 2026-09-30
- Todo documento estructurado, con dueño y acotado — «todo documento tiene que tener un "dueño" o carril que lo lee y lo mantiene. No puede haber documentos que puedan crecer al infinito», 2026-09-30
- Los ADR y `tech-stack.md`, después de esta feature — «ok, vamos con el roadmap, y luego miraremos lo del adr», 2026-09-30
- Campaña de la migración aceptada con 6 sujetos, ~6 $ y techo 10 $ — la misma frase, 2026-09-30
- Review de spec con dos revisores — «Dos revisores en paralelo», 2026-09-30
- Las features pendientes de este repo van a `## Release 2.3.0` — «## Release 2.3.0 (Recomendada)», 2026-09-30
- Tabla de destinos de la migración de este roadmap (`migration-gate.md`) — «Apruebo la tabla (Recomendada)», 2026-09-30
- Las 🧪 de este repo se cierran en bloque como «validación en campo» — fila 0115 del roadmap, dev-lead, 2026-09-29

## Intent

El roadmap de este repo tiene 494 líneas y 46.309 palabras, con una sección de trabajo que no es de la plantilla, 42 filas de deuda saldadas que nadie quitó, tablas de releases ya publicadas y unas 25 decisiones en prosa. Nada lo comprueba: la plantilla dice que las secciones van literales, pero manda borrar su propia ayuda, y ningún script mira las secciones. El RED muestra que dos agentes con la misma petición dejan dos roadmaps distintos, borran sin copia y no comprueban el resultado. Se quiere una forma única, un script que la verifique y una migración que lleve a ella sin perder datos, probada sobre este roadmap.

## Scope

- Entra: `roadmap-template.md` con qué va y qué no va en cada sección
- Entra: `Test-Roadmap.ps1` en `sdd-templates/scripts/`, su fila en el índice de `sdd-templates/SKILL.md` y sus tests Pester con fixtures
- Entra: `tests/RoadmapStructure.Tests.ps1` pasa a llamar al script
- Entra: `migrations/v2.3.0.md` con el paso del roadmap y su línea `**Escribe**:`
- Entra: este roadmap migrado, con `roadmap-before.md` en la carpeta de esta spec y las decisiones del 2026-09-29 (poda, duplicados, la 0015 disuelta, «2.0.1» → «versión siguiente» en «Destino», las 🧪 cerradas como validación en campo)
- Entra: Art. XI en `constitution.md`, la tabla de documentos en `architecture.md`, las referencias de vigilancia en `tech-stack.md` y el índice de `CLAUDE.md`
- Entra: los documentos de anclaje que la tabla del gate nombre como destino de una decisión (`constitution.md`, `mission.md`, `tech-stack.md`, `architecture.md`)
- Entra: las tres filas nuevas del roadmap de la decisión 21
- No entra: `sdd-end-release`, `sdd-roadmap`, `sdd-end-feature` y `sdd-end-patch`. Ninguna skill ejecuta el validador todavía, y ningún cierre saca las filas saldadas en el corte: es la 0123
- No entra: `release-flow` ni `planning`. Sus requisitos no cambian aquí
- No entra: `sdd-init-greenfield` ni `sdd-init-brownfield`
- No entra: limpiar `tech-stack.md`, partir capacidades grandes ni quitar anécdotas de la constitution
- No entra: adendas en walkthroughs o `patch.md` históricos
- No entra: el bump de `plugin.json`, el marcador de este repo y el changelog sellado, que son del corte

## Approach

La plantilla fija la forma y el script la comprueba con mensajes que dicen la regla. La migración es una receta de destinos con tres seguros: parte de un roadmap commiteado y apunta su sha, presenta la tabla de destinos como gate y termina ejecutando el validador. No añade conceptos al kit: usa «Próximo» y `## Release <N>` como ya los definen `planning` y `release-flow`. Lo que el baseline ya hace bien no se escribe como guía y se mide como control en el GREEN. El principio de documentos acotados queda escrito y aplicado solo al roadmap; los demás documentos quedan inventariados con su fila.

## Delta de comportamiento

### Capacidad: `roadmap`

**MODIFIED — Cerrar una fila de deuda o de backlog deja un prefijo contable** (antes: la fila saldada seguía en el roadmap sin límite)
- GIVEN una fila de «Deuda técnica» o de «Backlog» del roadmap que una feature o un patch salda entera o en parte
- WHEN se cierra con `sdd-end-feature` o con `sdd-end-patch`
- THEN la celda «Ítem» empieza por `**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**`, o por `**[<Feature|Patch> <id>, <AAAA-MM-DD>: parcial — <enlace>; queda: <lo pendiente>]**` si queda algo, con el enlace al `walkthrough.md` o al `patch.md`
- AND el texto con que se abrió la fila sigue detrás del prefijo, sin reescribir
- AND `grep -E '\| \*\*\[(Feature|Task|Patch) [^],]+, [0-9]{4}-[0-9]{2}-[0-9]{2}: saldada — '` sobre el roadmap lista esa fila si está saldada, y no la lista si es `parcial`
- AND la fila saldada dura hasta el corte de la release siguiente: el `grep` cuenta lo saldado desde la última release cerrada
- AND el prefijo `Task` de antes de la 2.0.0 se sigue leyendo igual que `Feature` y ya no se escribe

**ADDED — Una fila saldada antes de la última release está de más**
- GIVEN una fila de «Deuda técnica» que empieza por `**[Patch 0018, 2026-09-10: saldada — …]**`, una de «Backlog» por `**[Task 0012, 2026-09-20: saldada — …]**`, otra de «Deuda técnica» por `**[Feature 0030, 2026-09-25: saldada — …]**`, y `### v1.2.0 — 2026-09-20` como primera subsección de «Releases cerradas»
- WHEN se ejecuta `pwsh -NoProfile -File Test-Roadmap.ps1 -Path .docs/sdd`
- THEN escribe `roadmap.md: línea <n>: fila saldada el 2026-09-10, no posterior a la v1.2.0 (2026-09-20): sale en el corte` y la misma línea para la del 2026-09-20, y sale con 1
- AND la fila del 2026-09-25 no da fallo, ni una fila `parcial` de cualquier fecha
- AND sin ninguna subsección en «Releases cerradas», ninguna fila saldada da fallo

**ADDED — El título de una release cerrada lleva versión y fecha**
- GIVEN un roadmap con `### v1.2.0 - 2026-09-20` (guion corto) en la línea 37, bajo «Releases cerradas»
- WHEN se ejecuta `Test-Roadmap.ps1`
- THEN escribe `roadmap.md: línea 37: «v1.2.0 - 2026-09-20» no es «### v<versión> — <AAAA-MM-DD>»` y sale con 1
- AND `### v1.2.0 — 20 de septiembre` y `### Notas` dan el mismo fallo, cada uno con su título
- AND `### v1.2.0 — 2026-09-20` no da fallo

**ADDED — Un patch publicado sale de «Patches» en el corte**
- GIVEN una fila de «Patches» con fecha `2026-09-20`, otra con `2026-09-22`, y `### v1.2.0 — 2026-09-20` como primera subsección de «Releases cerradas»
- WHEN se ejecuta `Test-Roadmap.ps1`
- THEN escribe `roadmap.md: línea <n>: patch del 2026-09-20, no posterior a la v1.2.0 (2026-09-20): sale en el corte` y sale con 1
- AND la fila del 2026-09-22 no da fallo
- AND sin ninguna subsección en «Releases cerradas», ninguna fila de «Patches» da fallo

**ADDED — El roadmap solo lleva las secciones de la plantilla**
- GIVEN un roadmap con las secciones «Próximo», «Versión siguiente», «Backlog», «Deuda técnica», «Decisiones tomadas», «Patches» y «Releases cerradas»
- WHEN se ejecuta `Test-Roadmap.ps1`
- THEN escribe `roadmap.md: línea <n>: sección «Versión siguiente» fuera de la plantilla` y la misma línea para «Decisiones tomadas», y sale con 1
- AND un roadmap con «Próximo», «Release 2.3.0», «Backlog», «Deuda técnica», «Patches» y «Releases cerradas», en ese orden, escribe `Roadmap válido` y sale con 0; también sin ninguna sección de release, y con «Release 1.3» y «Release 1.4» seguidas
- AND un roadmap sin «Patches» escribe `roadmap.md: falta la sección «Patches»` y sale con 1
- AND con «Backlog» antes que «Próximo» escribe `roadmap.md: línea <n>: «Próximo» va antes que «Backlog»`, y con dos «Release 1.3» escribe `roadmap.md: línea <n>: sección «Release 1.3» repetida`
- AND `## Release próxima` o `## Release` a secas escriben `roadmap.md: línea <n>: «Release próxima» no lleva versión: «## Release <versión>»`

**ADDED — El roadmap no lleva prosa fuera de las releases cerradas**
- GIVEN un roadmap con el párrafo «Criterio de orden (dev-lead, 2026-09-21): primero lo que ven los usuarios» en la línea 13, bajo `## Backlog`, y una cita `> nota` en la línea 30, bajo `## Patches`
- WHEN se ejecuta `Test-Roadmap.ps1`
- THEN escribe `roadmap.md: línea 13: prosa en «Backlog»; fuera de «Releases cerradas» el roadmap solo lleva tablas` y la misma línea para la 30 en «Patches», y sale con 1
- AND el resumen, la línea de smoke y la línea `validaciones pendientes:` bajo `### v1.2.0 — 2026-09-20` no dan fallo
- AND una sola línea «en preparación» entre `## Release 1.3` y su tabla no da fallo; una segunda línea de texto en esa sección, sí

**ADDED — Las cabeceras de tabla y los estados son los de la plantilla**
- GIVEN una sección de release cuya tabla empieza por `| id | Task | Tamaño | Estado |`, una fila de «Próximo» con el estado `pendiente` y otra con `❌ descartado`
- WHEN se ejecuta `Test-Roadmap.ps1`
- THEN escribe `roadmap.md: línea <n>: la cabecera de «Release 1.3» debe ser «| id | Feature | Origen | Ficheros que toca | Estado |»`, y para cada una de las dos filas `roadmap.md: línea <n>: estado «<texto>» no admitido: ⏳, 🔄, ✅, 🧪 validación diferida a…, ⏸️ aparcada: …`, y sale con 1
- AND una fila suelta, una fila vacía o una cabecera descuadrada con su separador dan los mensajes que hoy da `tests/RoadmapStructure.Tests.ps1`, con el prefijo `roadmap.md: `
- AND los tests fijan el número de línea exacto de cada fixture

**ADDED — Una feature publicada no sigue como fila de una sección abierta**
- GIVEN una fila `| 0021 | … | 🧪 validación diferida al primer correo real |` en `## Release 1.3`, una fila `| 0024 | … tras 0021 … | ⏳ |` en la misma sección, y `### v1.2.0 — 2026-09-20` con el resumen «Aviso por correo al liberar una sala (0021) y el patch 0020»
- WHEN se ejecuta `Test-Roadmap.ps1`
- THEN escribe `roadmap.md: línea <n>: la 0021 ya está en la v1.2.0: su fila sale de «Release 1.3»` y sale con 1
- AND la fila 0024 no da fallo

**ADDED — Una release cerrada guarda sus validaciones pendientes en una línea**
- GIVEN un roadmap con la 0016 y la 0017 en `🧪 validación diferida`, las dos publicadas en la 1.1.0, ya cerrada
- WHEN la migración a v2.3.0 termina
- THEN la subsección `### v1.1.0 — 2026-09-05` lleva la línea `validaciones pendientes: 0016, 0017`, y el disparador y el dueño de cada una siguen en su walkthrough
- AND una release sin validaciones pendientes no lleva la línea

**Reglas de la capacidad**
- **Dónde viven los datos**: el formato de cierre, en el bloque de ayuda de «Deuda técnica» de `roadmap-template.md` de `sdd-templates`; los cierres lo citan. La cabecera de la tabla de release, en el bloque de ayuda de la sección «Release N» de la misma plantilla. Qué va en cada sección, en los bloques de ayuda de esa plantilla; lo comprueba `Test-Roadmap.ps1` de `sdd-templates/scripts/`.
- **Idioma de los nombres**: estados `saldada` y `parcial`, la etiqueta `validaciones pendientes:` y los mensajes del validador, en castellano, como el resto del roadmap.
- **Límites**: el roadmap solo lleva las secciones de la plantilla y, fuera de «Releases cerradas», solo tablas. Una fila saldada y una fila de «Patches» duran hasta el corte de la release siguiente.
- **Avisos**: una línea por fallo del validador, con la regla incumplida.
- **Regla ante conflicto**: una fila lleva un solo prefijo; un cierre posterior lo sustituye. Una feature que está en una release cerrada no tiene fila en una sección abierta: manda la release cerrada.

### Capacidad: `migration`

**ADDED — La migración a v2.3.0 lleva el roadmap a la forma de la plantilla**
- GIVEN un proyecto en 2.2.0 con `roadmap.md` commiteado en `284d195`, que falla `Test-Roadmap.ps1` (sección «Versión siguiente», decisiones en prosa, una fila saldada antes de la última release), y el dev-lead presente
- WHEN pide «ponme el proyecto al día»
- THEN el agente presenta una tabla con cada bloque que sale o se mueve y su destino, y espera la aprobación antes de cambiar `roadmap.md`
- AND tras aprobar, `Test-Roadmap.ps1` escribe `Roadmap válido` y sale con 0
- AND el informe y el cuerpo del commit de la migración llevan `git show 284d195:.docs/sdd/roadmap.md` como la forma de ver el roadmap anterior
- AND si el dev-lead cambia un destino de la tabla, se aplica el suyo; si la rechaza, `roadmap.md` queda sin tocar y el paso, pendiente
- AND con `roadmap.md` sin commitear, el paso para antes de la tabla y lo dice
- AND `v2.3.0.md` declara en su línea `**Escribe**:` `roadmap.md` y el marcador, y `tests/MigrationInitParity.Tests.ps1` sigue en verde sin cambiar las init

**ADDED — Con el dev-lead ausente, la migración del roadmap queda pendiente**
- GIVEN el mismo proyecto y una petición que dice que el dev-lead no está
- WHEN el agente llega al paso del roadmap
- THEN deja `roadmap.md` sin tocar y pone la tabla de destinos en el informe como pendiente, con cómo reanudarla
- AND no hay commit de la migración ni cambia el marcador de `sdd-kit.json`, como fija el procedimiento de migraciones para un gate sin resolver
- AND la sesión siguiente sigue avisando de migraciones pendientes hasta la 2.3.0

**ADDED — Un roadmap que ya tiene la forma no se migra**
- GIVEN un proyecto en 2.2.0 cuyo roadmap pasa `Test-Roadmap.ps1`
- WHEN se aplica `v2.3.0.md`
- THEN el paso del roadmap se salta, el informe lo dice, `roadmap.md` no cambia y el marcador sube a 2.3.0

**ADDED — La migración del roadmap no inventa datos**
- GIVEN un roadmap con la 0022 y la 0024 pendientes en «Versión siguiente», en una tabla de cinco columnas y sin versión decidida; la 0021 con 🧪 y publicada en la 1.2.0; y la decisión pendiente «si las reservas de más de 4 horas necesitan aprobación de recepción»
- WHEN la migración propone los destinos
- THEN la tabla pregunta si hay una release en preparación y con qué versión: con «sí, la 1.3», la 0022 y la 0024 van a `## Release 1.3` con sus cinco columnas; con «no», van a «Próximo» con «Origen: …» y «Ficheros: …» al final de su celda «Ítem»
- AND el agente no propone un número de versión por su cuenta
- AND la 0021 sale de la sección abierta y su id entra en `validaciones pendientes:` de la v1.2.0
- AND la decisión pendiente es una fila de «Backlog» con el número siguiente del Backlog, sin id de la secuencia de features
- AND una celda que la tabla destino exige y el roadmap anterior no traía lleva `—`

**Reglas de la capacidad**
- **Dónde viven los datos**: las migraciones viven en `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md`; la versión aplicada, en `.docs/sdd/sdd-kit.json` del proyecto; lo que escribe cada migración, en su línea `**Escribe**:`. La memoria automática, en `~/.claude/projects/<project>/memory/` (o en `autoMemoryDirectory` si el proyecto la redefine), una por repositorio y compartida por sus worktrees; cada entrada es un fichero de memoria indexado en `MEMORY.md`. El roadmap anterior a la migración a v2.3.0, en el commit que nombran el informe y el commit de la migración.

## Enmiendas

- 2026-09-30 — El validador exige que cada título bajo «Releases cerradas» sea `### v<versión> — <AAAA-MM-DD>` (requisito nuevo «El título de una release cerrada lleva versión y fecha»), y la receta de la migración dice que el resumen de una release no nombra por su id lo que no se publicó — la revisión final reprodujo que un título con guion corto apagaba en silencio las reglas de corte, y que un resumen que nombra una feature no publicada hace que el validador pida quitar su fila pendiente — aprobada: «Sí, enmienda (Recomendada)» y «Sí, 1 sujeto más (Recomendada)»; la campaña pasa a 10 sujetos

- 2026-09-30 — Un patch ya publicado sale de «Patches» en el corte, con la regla de fecha de las filas saldadas, y el validador lo comprueba (requisito nuevo «Un patch publicado sale de «Patches» en el corte» y una fila más en la receta de la migración) — el GREEN dio cuatro tratamientos de la tabla en cuatro sujetos, y en este repo tiene 45 filas sin cota — aprobada: «Sí, enmienda (Recomendada)»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-30 | aprobada: «ok aprobado» |
