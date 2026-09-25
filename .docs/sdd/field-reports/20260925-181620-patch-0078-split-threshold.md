---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: patch
id: 20260925-181620-patch-0078-split-threshold
task: 0078
mode:
date: 2026-09-25
---

# Ticket para el kit — patch 0078: umbral para proponer partir una feature, con tramo 4-5

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch` (parado en el paso 0), `sdd-feedback`
- Proyecto: el propio repo del kit (skills en Markdown, tests en Pester, un solo dev-lead)
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet en los 8 sujetos headless del RED/GREEN
- Coste en reloj: ~0,6 h hasta el paso 0 del cierre
- Coste en tokens: no medido; sujetos 2,23 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La opción «Diferir» de la pregunta de validación no cumple por sí sola las condiciones de la validación diferida

- **Qué pasó**: en el paso 0 de `sdd-end-patch` pregunté con `AskUserQuestion` y tres opciones: «Validado», «Diferir la validación» y «No funciona». El dev-lead eligió «Diferir» sin texto. Faltaban dos de las tres condiciones de `control-profiles.md#validación-diferida`: su frase («dice, con su frase, que probará más tarde») y el disparador con dueño. Hizo falta otro turno para pedirlas, y el cierre quedó parado.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md` paso 0; `skills/sdd-start-feature/references/control-profiles.md` § Validación diferida; lo mismo en el paso 7 de `sdd-start-feature`.
- **Por qué el kit no lo evitó**: el paso 0 manda una pregunta cerrada, pero una de sus tres salidas pide texto libre (frase y disparador). Nada dice que la opción de diferir lleve ya un disparador propuesto. Tampoco dice que elegirla cuente como la frase, como sí hace el paso 2 de `sdd-start-feature` con «apruebo la spec por delegación» («Elegirla es la frase literal»).
- **Coste**: un turno más del dev-lead y un cierre a medias (rama sin fusionar).
- **Propuesta**: la opción de diferir lleva el disparador con dueño que propone el agente («Lo pruebo en <disparador>, a mi cargo»). Elegirla es la frase literal y el disparador. Si el dev-lead quiere otro disparador, lo escribe en «Other».
- **Criterio de aceptación**: GIVEN un patch en `delegate` en el paso 0 del cierre, WHEN el agente pregunta la validación, THEN la opción de diferir nombra un disparador con dueño, y elegirla sin texto deja en `patch.md` §4 una línea `Validación diferida:` completa, sin otro turno. Hoy 1 de 1 (esta sesión) necesitó ese turno.

### 2. Un delta `MODIFIED` no alcanza el literal repetido en «Reglas de la capacidad»

- **Qué pasó**: el requisito «La primera pregunta propone partir una feature grande» de `capabilities/control-profiles.md` lleva su delta. El mismo umbral está además en prosa, en «Reglas de la capacidad» → «Límites» («Umbral para proponer partir una feature: más de 3 tasks internas previstas»). El delta no lo cubre: lo dejé anotado a mano en `patch.md` §3 para que el cierre lo cambie.
- **Dónde en el kit**: `skills/sdd-end-feature/references/aprendizajes-skills.md` (fusión del delta), paso 1 de `sdd-end-patch`, `skills/sdd-templates/scripts/Test-Capabilities.ps1`.
- **Por qué el kit no lo evitó**: la fusión va por el título del requisito. La sección de reglas no tiene clave de fusión, y el validador no busca en ella el literal viejo.
- **Coste**: bajo en esta sesión. Si nadie lo lee en la nota, la capacidad se contradice a sí misma.
- **Propuesta**: el paso 1 de `sdd-end-patch` y el cierre de feature buscan en toda la capacidad el literal que el delta sustituye («más de 3 tasks internas»), no solo el bloque del requisito.
- **Criterio de aceptación**: GIVEN una capacidad con un umbral en un requisito y repetido en «Reglas de la capacidad», WHEN un patch fusiona un `MODIFIED` que cambia el umbral, THEN tras el cierre no queda ninguna aparición del literal viejo en la capacidad.

### 3. El test de presupuesto del conjunto rápido falla dentro de la suite completa

- **Qué pasó**: `Invoke-Pester -Path tests` dio 850/851. Falló `FastSuiteBudget.Tests.ps1:23` («tarda menos del umbral»), con `SubjectOutputPrivacy.Tests.ps1` a 7,4 s. Solo pasa, y el pre-commit dio 771/0 al rato.
- **Dónde en el kit**: `tests/FastSuiteBudget.Tests.ps1`.
- **Por qué el kit no lo evitó**: el test mide el tiempo en la misma máquina y a la vez que el resto de la suite. Con carga (aquí, justo después de una campaña de sujetos) supera el umbral sin que el código cambie.
- **Coste**: ruido en la verificación: hubo que re-ejecutarlo aparte y explicarlo en `patch.md`.
- **Propuesta**: que la suite completa lo excluya (tag propio) y que solo lo corra el pre-commit, o que tome la mejor de dos mediciones.
- **Criterio de aceptación**: GIVEN la suite completa lanzada justo después de otra carga pesada, WHEN termina, THEN no falla ningún test de tiempo sin haber cambiado ningún fichero de `tests/`.

### 4. La fila del roadmap nombraba el «paso 5» de `sdd-roadmap`, que es otro

- **Qué pasó**: la fila 0078 dice `sdd-roadmap` (paso 5). El paso 5 del checklist es «Publica la reserva». El umbral está en el punto 5 de «Qué entrada es». Lo resolví leyendo la skill; la petición del dev-lead también decía «paso 5».
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md` (dos listas numeradas: «Qué entrada es» y «Checklist»); la columna de ficheros de la fila la escribe `sdd-roadmap` o `sdd-consult`.
- **Por qué el kit no lo evitó**: la skill tiene dos listas numeradas y ninguna regla pide citar la sección al nombrar un punto.
- **Coste**: bajo (una lectura), pero una sesión en paralelo, limitada a «solo el paso 5», podría editar el punto equivocado.
- **Propuesta**: cuando una fila nombra un paso de una skill con más de una lista numerada, lleva la sección («`sdd-roadmap`, «Qué entrada es» 5»).
- **Criterio de aceptación**: GIVEN una fila nueva que limita el alcance a un punto de `sdd-roadmap`, WHEN se escribe, THEN nombra la sección además del número.

## Lo que hice por iniciativa propia

- Reutilicé el molde de la 0014 (`red/molde`) con una fila 0012 por escenario y la rama `feature/0012`, y medí solo la primera pregunta (`MAX_TURNS=30`). El GREEN reutilizó el mismo `red/subject.sh`. Salió barato (2,23 $ los 8 sujetos) y los dos escenarios se distinguían bien.
- Lancé dos `run.sh` en paralelo, con `SUBJECT=1` y `SUBJECT=2`, sobre los mismos escenarios. Los techos compartidos (`SUBJECT_CAP`, `COST_CAP`) siguieron contando bien.
- Anoté en `patch.md` que el recuento final del lanzador coincide con los sujetos que corrieron. Es el disparador de la validación diferida del patch 0079: esta campaña de la ola 1 lo cumple, y el dev-lead puede cerrarlo con ella.
- En el RED dejé escrito un fallo que no era el esperado: el sujeto que no partió llegó ahí rebajando el recuento («unas 3» tasks para cinco subcomandos). Es el otro fallo que produce un umbral sin criterio.

## Funcionó, no tocar

- `SPEC_DIR` absoluto tras el patch 0079: las salidas cayeron en `red/out/` y `green/out/`, y los recuentos del lanzador salieron bien.
- La regla del paso 0 de `sdd-end-patch` («"los tests pasan" no son validación»): paré antes de tocar `patch.md` y el merge, aunque el bloque `merge` y `delegate` autorizaban fusionar.

## Errores míos, no huecos del kit

- El primer `git commit` falló: pasé el mensaje con un here-string de PowerShell a `-F -` sin tubería, y git lo tomó como pathspec. Lo repetí con un heredoc en Bash.
- En la pregunta de validación ofrecí «Diferir» sabiendo que pedía frase y disparador, sin proponer ninguno (el hallazgo 1 es el hueco del kit que lo permite).
