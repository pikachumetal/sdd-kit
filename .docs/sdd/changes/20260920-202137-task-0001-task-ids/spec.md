---
id: 20260920-202137-task-0001-task-ids
task: 0001
title: Ids de task y numeración sin gestor de tickets
mode: full
status: approved
created: 2026-09-20
author: Àngel Delgado (con Claude Opus 5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-20
---

# Spec — Ids de task y numeración sin gestor de tickets

## Decisiones que he tomado yo — valida estas

1. **Review de spec propuesta: dos revisores** (lente dominio + lente técnica) — señales: capacidad nueva · contrato público (`sdd-kit.json` y el naming del Art. IV) · `MODIFIED` · tres capacidades · datos y migración. Contrato público + datos fuerza dos revisores por rúbrica. **Los he activado ya** sin preguntarte, por tu encargo de autonomía: 16 hallazgos, 4 Críticos, todos aceptados (detalle al final del bloque).
2. **Capacidad nueva `capabilities/task-ids.md`** — el id cruza task, patch, release, consult e init; repartir sus reglas entre cuatro capacidades garantiza que se contradigan, que es justo el fallo que esta release viene a arreglar. Cubre tasks y patches porque comparten secuencia.
3. **El modo se llama `ids.mode`, con valores `tracker` y `sequence`, en inglés** — el roadmap los enunció como «gestor | secuencia», pero son claves de un fichero de datos, no prosa: `sdd-kit.json` ya lleva `version`, `channel` y `updated` en inglés (Art. III: nombres técnicos en inglés, texto humano en castellano). Si los prefieres en castellano, son dos literales.
4. **Ausencia del campo `ids` = modo `tracker`** — el comportamiento de hoy, así que ningún proyecto ya inicializado cambia de conducta al actualizar el kit. La migración v1.2.0 pregunta el modo; si no estás, queda pendiente explícito y el proyecto sigue en `tracker`.
5. **En modo `tracker` se conserva `0000` para trabajo sin ticket** — quitarlo obligaría a inventar ids justo donde el gestor manda. El problema que esta task resuelve es el de los proyectos sin gestor.
6. **Se toca el Art. IV de la constitution** — el artículo fija literalmente «id de ticket (0000 si no hay)», así que el modo `sequence` lo contradice mientras no se reescriba, y `sdd-end-task` solo fusiona el delta en `capabilities/`: nada actualizaría el artículo por su cuenta. Esta spec es la «spec dedicada» que el propio Art. IV exige para un cambio mayor, y la task revisa las skills afectadas; el texto del artículo entra en el Scope.
7. **El script se llama `Get-NextSddId.ps1` y vive en `skills/sdd-templates/scripts/`** — junto a `Build-EstimationLog.ps1`, precedente de código ejecutable del kit invocado por las skills. Es de solo lectura: calcula y escribe por salida estándar, no reserva ni toca ficheros, y **no hace `git fetch`** (una llamada de red rompería el determinismo del script y su test).
8. **El script escanea ramas por id, no por prefijo `feature/`** — un patch puede salir como `feature/*` o `hotfix/*` (`sdd-start-patch:12`), y tasks y patches comparten secuencia: buscar solo `feature/<id>` dejaría ciego el anti-colisión justo entre carriles. El patrón es el id de cuatro dígitos en un segmento del nombre de rama, local o remota.
9. **La rama es el acto de reserva del trabajo no planificado** — el script calcula pero no reserva, así que dos agentes simultáneos podrían leer el mismo número; quien arranca sin fila de roadmap crea primero la rama con el id y solo después la carpeta de artefactos. Es la marca que el siguiente cálculo ya ve. Residual aceptado: dos arranques en el mismo segundo siguen siendo posibles, y se resuelven con la regla ante conflicto.
10. **La reserva planificada sigue siendo humana y del hilo principal** — el script propone, el roadmap reserva. Un agente de task en su worktree no se autoasigna un id: lo lee de su fila.
11. **`sdd-consult` sigue sin poder escribir ids** — puede calcular y proponer el siguiente, pero la reserva es del carril. El anti-carril no produce artefactos.
12. **`parent: <id>` entra en `spec-template.md` y `patch-template.md`** — es la alternativa a los sufijos `0006a`: la relación entre una task partida y su origen vive en el frontmatter y en el roadmap, no en el id. Toca las plantillas canónicas (Art. VIII), de ahí que lo decida aquí.
13. **Agotar la secuencia (`9999`) queda fuera de alcance** — un proyecto con 9 999 tasks tiene otros problemas antes.
14. **Slug de esta carpeta en inglés** (`task-ids`) — Art. III; no adelanto la deuda de los slugs en castellano (task 0016), pero tampoco añado una fila nueva.

### Hallazgos de la review

**Aceptados (lente técnica)**
1. *Crítico · Art. IV no se toca* → añadido al Scope y a la decisión 6: el artículo se reescribe en esta task.
2. *Crítico · falta la evidencia RED/GREEN del Art. I* → «Entra» lista ahora el ciclo RED→GREEN por skill tocada.
3. *Importante · `sdd-start-task` y `sdd-start-patch` no estaban en Scope* → las cuatro skills de carril, las dos init, `nombrado.md` y las dos plantillas están enumeradas.
4. *Importante · `parent:` decidido en el cuerpo* → subido a «Decisiones que he tomado yo» (decisión 12).
5. *Importante · escenario del campo `ids` autocontradictorio* → partido en dos: proyecto inicializado con el kit nuevo y proyecto no migrado.
6. *Importante · `tracker` y `sequence` en un solo escenario* → un escenario por modo.
7. *Importante · el aviso de ids duplicados no tenía escenario* → `ADDED — El script avisa de un id duplicado y no devuelve ninguno`.
8. *Menor · contrato de lectura del roadmap sin especificar* → declarado en «Reglas de la capacidad» (columna de id de tabla, `task-<id>-`, `patch-<id>-`, segmento de rama).
9. *Menor · ramas remotas obsoletas* → decisión 7: el script no hace fetch, y el requisito lo dice.
10. *Menor · agotar `9999`* → decisión 13, fuera de alcance explícito.

**Aceptados (lente dominio)**
1. *Crítico · Art. IV desactualizado sin paso que lo corrija* → mismo cambio que el hallazgo técnico 1.
2. *Crítico · el script ciego a las ramas de patch* → decisión 8: escaneo por id, no por prefijo.
3. *Importante · ventana de carrera del script* → decisión 9 y `ADDED — La rama reserva el id del trabajo no planificado`, con el residual aceptado por escrito.
4. *Importante · el `MODIFIED` de `onboarding` recortaba el requisito vigente* → texto vigente conservado íntegro; solo se añade la línea AND.
5. *Menor · script invocado en modo `tracker`* → THEN propio: avisa y no devuelve id.
6. *Menor · changelog y estimation-log* → aclarado en Approach como efecto colateral, sin tocar su formato.

## Intent

Hoy `<id>` es el ticket del gestor y `0000` cuando no hay (`nombrado.md:7`, `spec-template.md:3`, `patch-template.md:3`, `sdd-start-patch:36`). En los proyectos con Azure DevOps funciona; en los personales **todo** sale `0000`, y eso rompe tres cosas verificadas: la rama es `feature/<ticket>`, así que dos tasks sin ticket en worktrees paralelos chocan en `feature/0000`; la columna Task del `estimation-log` deja de discriminar; y el `<id>` del changelog no señala nada. A la vez, dos skills prohíben en seco «inventar ids» (`sdd-consult:37`, `sdd-start-release:31,47,58`), que es exactamente lo que un proyecto sin gestor necesita hacer. Esta task decide el modo de numeración **por proyecto**, lo guarda donde ya vive la configuración del kit y reconcilia la prohibición con el caso legítimo.

## Scope

- **Entra**: campo `ids` en `sdd-kit.json` · cláusula del modo `sequence` en el Art. IV de la constitution del kit · pregunta de numeración en la entrevista de `sdd-init-greenfield` y `sdd-init-brownfield` · lectura del modo en `sdd-start-task` (con `nombrado.md`), `sdd-start-patch`, `sdd-start-release` (con `roadmap-fuente.md`) y `sdd-consult` · script `Get-NextSddId.ps1` con sus tests Pester · reserva del id en el roadmap al planificar · una sola secuencia para tasks y patches · `parent:` en `spec-template.md` y `patch-template.md` en vez de sufijos `0006a` · migración `migrations/v1.2.0.md` · capacidad `capabilities/task-ids.md` · **ciclo RED→GREEN documentado en `tests/` por cada skill tocada** (Art. I).
- **No entra**: renombrar carpetas de `specs/` ya escritas (histórico sellado) · cambiar la convención de ramas del proyecto · slugs en castellano (task 0016) · el formato del `estimation-log` (task 0010) ni del changelog · integración con ningún gestor de tickets real · agotamiento de la secuencia en `9999`.

## Approach

El modo de ids es un **dato del proyecto**, no una decisión del agente: se pregunta una vez en la init, se guarda en `sdd-kit.json` y todas las skills lo leen de ahí. Sobre ese dato, dos vías: con gestor no cambia nada; sin gestor, la secuencia la **reserva una persona en el roadmap** al planificar la release —la única forma de que dos worktrees no cojan el mismo número— y un script determinista de solo lectura cubre el trabajo sin fila, donde la rama con el id hace de marca de reserva. La prohibición de inventar ids no se quita: se precisa, distinguiendo el origen legítimo (gestor, o secuencia del proyecto) de elegir un número a ojo. Los dos daños colaterales que cita el Intent —la columna Task del `estimation-log` y el `<id>` del changelog— se arreglan **por tener ids reales**, sin tocar el formato de ninguno de los dos.

## Delta de comportamiento

### Capacidad: `task-ids`

**ADDED — El proyecto declara cómo numera su trabajo**
- GIVEN un proyecto inicializado o migrado con el kit v1.2.0 o posterior
- WHEN se lee `.docs/sdd/sdd-kit.json`
- THEN el fichero lleva `"ids": { "mode": "tracker" | "sequence" }`

**ADDED — Un proyecto sin campo `ids` numera como hasta ahora**
- GIVEN un proyecto cuyo `sdd-kit.json` no tiene campo `ids`
- WHEN una skill del kit necesita el modo de ids
- THEN el modo efectivo es `tracker` y ninguna conducta cambia respecto a la versión anterior del kit

**ADDED — La entrevista de init decide el modo de ids**
- GIVEN una init greenfield o brownfield en el bloque (d) de proceso
- WHEN el agente pregunta por el gestor de tickets
- THEN pregunta a continuación cómo se numeran las tasks: ids del gestor (`tracker`) o secuencia propia del proyecto (`sequence`)
- AND escribe la respuesta en `sdd-kit.json`; «no sé» deja `tracker`

**ADDED — Tasks y patches comparten una sola secuencia**
- GIVEN un proyecto en modo `sequence`
- WHEN se asigna el id de una task o de un patch
- THEN sale de la misma secuencia correlativa: un id nunca se repite entre carriles

**ADDED — En modo secuencia el id lo reserva el hilo principal al planificar**
- GIVEN un proyecto en modo `sequence` con una release en planificación
- WHEN `sdd-start-release` escribe las tasks en el roadmap
- THEN cada fila lleva su id reservado, correlativo y explícito
- AND el agente que abre el worktree de una task toma el id de su fila y no lo recalcula

**ADDED — Una task no planificada obtiene su id con un script determinista**
- GIVEN un proyecto en modo `sequence` y una task o patch sin fila en el roadmap
- WHEN se invoca `Get-NextSddId.ps1` desde la raíz del proyecto
- THEN devuelve por salida estándar el siguiente id libre en cuatro dígitos: el mayor id encontrado en `.docs/sdd/specs/`, en `.docs/sdd/roadmap.md` y en los nombres de rama locales y remotos, más uno
- AND el script no escribe nada y no hace `git fetch`: lee las referencias tal como están en el repositorio
- AND `0000` no cuenta como id ocupado: un proyecto cuyo histórico es todo `0000` recibe `0001`

**ADDED — El script avisa de un id duplicado y no devuelve ninguno**
- GIVEN un proyecto en modo `sequence` donde dos carpetas de `specs/` distintas llevan el mismo id
- WHEN se invoca `Get-NextSddId.ps1`
- THEN escribe el id duplicado y las rutas implicadas por salida de error, y no devuelve ningún id por salida estándar

**ADDED — El script avisa si el proyecto no está en modo secuencia**
- GIVEN un proyecto en modo `tracker` (declarado o por ausencia del campo `ids`)
- WHEN se invoca `Get-NextSddId.ps1`
- THEN avisa de que el proyecto numera con el gestor y no devuelve ningún id

**ADDED — La rama reserva el id del trabajo no planificado**
- GIVEN un proyecto en modo `sequence` y un arranque sin fila de roadmap
- WHEN el agente ya tiene el id que le dio el script
- THEN crea la rama con ese id **antes** de crear la carpeta de artefactos, y esa rama es lo que el siguiente cálculo ve como id ocupado

**ADDED — Una task partida toma el siguiente id, no un sufijo**
- GIVEN una task que se parte en dos durante la planificación o la ejecución
- WHEN se nombra la segunda mitad
- THEN recibe el siguiente id libre de la secuencia, nunca un sufijo tipo `0006a`
- AND su `spec.md` (o `patch.md`) lleva `parent: <id>` en el frontmatter y el roadmap declara la relación

**ADDED — En modo gestor el id es el del ticket**
- GIVEN un proyecto en modo `tracker` y una skill que necesita un id (`sdd-start-task`, `sdd-start-patch`, `sdd-start-release`, `sdd-consult`)
- WHEN el trabajo tiene ticket en el gestor
- THEN el id es el del ticket, y `0000` cuando el trabajo no tiene ticket

**ADDED — En modo secuencia el id sale de la reserva o del script**
- GIVEN un proyecto en modo `sequence` y una skill que necesita un id
- WHEN el trabajo tiene fila en el roadmap
- THEN el id es el reservado en esa fila; sin fila, el que devuelve `Get-NextSddId.ps1`
- AND en ningún modo se elige un número a ojo, y `sdd-consult` puede calcular y proponer el siguiente id pero no lo reserva ni lo escribe en ningún artefacto

**Reglas de la capacidad**
- **Dónde viven los datos**: el modo vive en `.docs/sdd/sdd-kit.json` (campo `ids.mode`); la reserva de cada id vive en la fila del roadmap o en el nombre de la rama; ninguna skill guarda un contador aparte.
- **Idioma de los nombres**: claves y valores de `sdd-kit.json` en inglés (`ids.mode`, `tracker`, `sequence`), como el resto del fichero; el texto de las skills sigue en castellano.
- **Límites**: cuatro dígitos con ceros a la izquierda (`0001`–`9999`); `0000` reservado como comodín de «sin ticket» en modo `tracker`.
- **Avisos**: ids duplicados entre artefactos y proyecto en modo `tracker` se avisan por salida de error, y en los dos casos el script no devuelve id.
- **Regla ante conflicto**: manda la fila del roadmap sobre el cálculo del script — es la reserva humana. Si dos arranques simultáneos toman el mismo id, el segundo en darse cuenta renumera su carpeta y su rama (su trabajo aún no está mergeado) y lo anota en el roadmap.
- **Contrato de lectura del roadmap**: el script reconoce un id en la primera columna de una fila de tabla (`| 0001 |`), en los nombres de artefacto (`task-<id>-`, `patch-<id>-`) y en un segmento del nombre de rama (`feature/0001`, `hotfix/0001-slug`). Cualquier otra aparición de cuatro dígitos (fechas, versiones) no cuenta.

### Capacidad: `onboarding`

**MODIFIED — La entrevista fija las cinco reglas de producto** (antes: "THEN el agente ha preguntado por las cinco reglas por nombre (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto) y la constitution propuesta lleva la sección «Reglas de producto» con las cinco: respondida, «pendiente» si el dev-lead no sabe, o «no aplica» si él lo dice")
- GIVEN una init greenfield o brownfield en su entrevista
- WHEN se cierra el bloque de producto
- THEN el agente ha preguntado por las cinco reglas por nombre (dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto) y la constitution propuesta lleva la sección «Reglas de producto» con las cinco: respondida, «pendiente» si el dev-lead no sabe, o «no aplica» si él lo dice
- AND una regla que difiere por capacidad se lista por capacidad dentro de su entrada
- AND el bloque de proceso ha decidido además el modo de ids del proyecto, que se escribe en `sdd-kit.json`

### Capacidad: `migration`

**MODIFIED — El proyecto declara la versión del kit que tiene** (antes: "THEN existe `.docs/sdd/sdd-kit.json` con `version`, `channel` y `updated`")
- GIVEN un proyecto inicializado con `sdd-init-greenfield` o `sdd-init-brownfield`
- WHEN termina la inicialización
- THEN existe `.docs/sdd/sdd-kit.json` con `version`, `channel`, `updated` e `ids`

**ADDED — La migración a v1.2.0 pregunta el modo de ids**
- GIVEN un proyecto que migra a v1.2.0 y cuyo `sdd-kit.json` no tiene campo `ids`
- WHEN se aplica `migrations/v1.2.0.md`
- THEN el paso es un **gate**: presenta los dos modos al dev-lead y escribe su respuesta
- AND si el dev-lead no está, el paso queda pendiente explícito y el proyecto sigue funcionando en `tracker`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-20 | aprobada («ok, adelante») |
