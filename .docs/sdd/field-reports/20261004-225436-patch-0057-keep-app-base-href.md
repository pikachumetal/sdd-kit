---
kit_version: 2.3.1
superpowers_version: 6.4.2
lane: patch
id: 20261004-225436-patch-0057-keep-app-base-href
task: 0057
mode:
date: 2026-10-05
---

# Ticket para el kit — patch 0057: el patch del smoke de release rompe el atajo del cierre, y el validador del roadmap deja pasar destinos y cierres fuera de la plantilla

## Contexto

- Carril y modo: patch (0057), dentro de una sesión de planificación y cierre: `sdd-roadmap` (más de
  veinte filas nuevas en una release comprometida), migración a 2.3.0, `sdd-end-patch` y
  `sdd-end-release` en perfil `unattended` ordenado por el dev-lead.
- Skills del kit usadas: `using-sdd`, `sdd-roadmap`, `sdd-consult`, `sdd-config`, `sdd-start-patch`,
  `sdd-end-patch`, `sdd-end-release`, `sdd-init-brownfield` (solo la migración), `sdd-templates`
  (`Test-Roadmap.ps1`, `Get-NextSddId.ps1`, `Merge-CapabilityDelta.ps1`, `Test-Capabilities.ps1`,
  `Build-EstimationLog.ps1`, `Invoke-SddMerge.ps1`).
- Proyecto: repo de templates de aplicación (monorepo Angular + .NET con tres dialectos de BD,
  tooling Node, dos `.docs/sdd/`: raíz y template que viaja), una persona.
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet (3 subagentes de auditoría de solo lectura, fuera del flujo del
  kit)
- Coste en reloj: no medido en la sesión; el patch 0057, 0,5 h
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `Test-Roadmap.ps1` da «Roadmap válido» con destinos de deuda y prefijos de cierre fuera de la plantilla, y el colapso de la release los arrastra

- **Qué pasó**: tres cierres de feature escribieron en «Deuda técnica» filas con «Destino» `Decidir
  dev-lead: …` o `Antes de la v0.1.0 (Art. VIII, viaja): patch a decidir por el dev-lead`, que no
  son ninguno de los tres valores de la plantilla (`Actuar`, `Esperar 2.º ticket`, `Descartada`).
  Otro cierre saldó una fila con el prefijo `**[Feature 0051, 2026-10-05: saldada, salvo el GO …
  — [walkthrough](…)]**`, que no casa con el `grep` de la plantilla (`: saldada — `). El validador
  dio `Roadmap válido` con todas ellas. En el colapso de `sdd-end-release`, la fila con el prefijo
  irregular no salió con las saldadas y hubo que quitarla a mano tras leer el roadmap colapsado.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Test-Roadmap.ps1` (no valida «Destino» ni el
  prefijo de cierre); `skills/sdd-templates/templates/roadmap-template.md` §«Deuda técnica»;
  `skills/sdd-end-feature/SKILL.md` (paso que escribe la deuda generada).
- **Por qué el kit no lo evitó**: la plantilla fija los valores y el formato, pero ningún script los
  comprueba, y los cierres de feature escriben la fila a mano.
- **Coste**: tres preguntas al dev-lead para dar destino a filas que el cierre dejó sin él, y una
  fila saldada que habría quedado viva en el roadmap colapsado. Sin respaldo de tiempo.
- **Propuesta**: que `Test-Roadmap.ps1` falle con una fila de «Deuda técnica» o «Backlog» cuyo
  «Destino» no empiece por `Actuar`, `Esperar 2.º ticket` o `Descartada`, y con una celda «Ítem» que
  empiece por `**[` sin casar con el formato de cierre (`saldada — ` o `parcial — …; queda:`).
- **Verificada**: sí — contrastado: `pwsh -NoProfile -File Test-Roadmap.ps1 -Path .docs/sdd` en
  PowerShell 7 escribió `Roadmap válido` con las cuatro filas presentes.
- **Criterio de aceptación**: GIVEN un roadmap con una fila de deuda de destino `Decidir dev-lead:
  patch` · WHEN se ejecuta `Test-Roadmap.ps1` · THEN falla nombrando la línea y los tres destinos
  admitidos; y GIVEN una fila con prefijo `**[Feature 0001, 2026-01-01: saldada, salvo X — …]**` ·
  THEN falla pidiendo `saldada — ` o `parcial — …; queda: …`.

### 2. El atajo del paso 5 de `sdd-end-release` se pierde por el patch que arregla un hallazgo del propio smoke

- **Qué pasó**: el dev-lead ordenó «cierra todo» en `unattended`, con versión y `hasRecipient:
  false` ya respondidos. El smoke de la release encontró un bloqueante, que se corrigió con un patch
  (0057) dentro de la release. La condición (c) del atajo («ningún item del scope se ha movido desde
  la orden de cierre») dejó de cumplirse por ese patch, y el merge a `main` y el tag necesitaron una
  pregunta más.
- **Dónde en el kit**: `skills/sdd-end-release/SKILL.md` paso 5, condición (c).
- **Por qué el kit no lo evitó**: la condición no distingue entre ampliar el alcance y corregir un
  hallazgo del smoke, que el mismo paso 4 cuenta como «corregido en la release».
- **Coste**: un turno más del dev-lead en un cierre ordenado como desatendido.
- **Propuesta**: que un patch nacido de un hallazgo del smoke de esta release (y contado en la línea
  `smoke: … N corregidos en la release`) no cuente como movimiento de alcance para la condición (c).
- **Verificada**: sí — contrastado con `skills/sdd-end-release/SKILL.md` paso 5 (c).
- **Criterio de aceptación**: GIVEN una orden de cierre con versión y `hasRecipient: false` y un
  smoke que encuentra un bloqueante corregido con un patch en la release · WHEN se llega al paso 5 ·
  THEN el agente ejecuta merge y tag citando la orden y la versión, sin otra pregunta.

### 3. `Merge-CapabilityDelta.ps1` sustituye un requisito `MODIFIED` y borra en silencio las líneas que el delta no copió

- **Qué pasó**: el delta `MODIFIED` del patch copió el requisito de una lectura parcial de la
  capacidad (`sed -n` que cortó antes de su último `AND`). El script lo fusionó con «sustituido» y
  el `AND` final desapareció de la capacidad viva. Se vio solo al leer el `git diff`; se repuso en el
  delta y se fusionó otra vez.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Merge-CapabilityDelta.ps1`;
  `skills/sdd-templates/templates/patch-template.md` §6 («un `MODIFIED` copia el bloque entero»).
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué bien (copia incompleta); el script
  no avisa de que el bloque nuevo pierde líneas del vivo.
- **Coste**: ~5 min, y una pérdida de requisito que sin mirar el diff habría llegado al commit.
- **Propuesta**: que el script, al sustituir un `MODIFIED`, liste las líneas `- AND`/`- THEN` del
  requisito vivo que no aparecen en el nuevo y falle salvo que el delta las retire de forma explícita
  (por ejemplo, con una línea `REMOVED-AND`).
- **Verificada**: sí — reproducido: el `git diff` de la capacidad tras la primera fusión mostraba la
  línea borrada.
- **Criterio de aceptación**: GIVEN un requisito vivo con cuatro `AND` y un delta `MODIFIED` que
  copia tres · WHEN se ejecuta `Merge-CapabilityDelta.ps1` · THEN falla nombrando el `AND` que se
  perdería y no escribe nada.

### 4. Una release comprometida no tiene freno al crecer su alcance

- **Qué pasó**: la sección `## Release 0.1.0`, marcada «comprometida», pasó en la última semana de
  unas treinta filas a más de cincuenta (un tercer dialecto, una integración de herramienta de
  diseño, una auditoría de buenas prácticas). Cada fila entró por `sdd-roadmap` con decisión del
  dev-lead, pero la verificación final se pospuso cada vez y el cierre llegó el día de la entrega.
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md` §«Preparar una release» y §«Algo concreto».
- **Por qué el kit no lo evitó**: la skill dice cómo comprometer una release, pero nada al añadir
  filas a una ya comprometida.
- **Coste**: sin respaldo de tiempo; la retro de la release lo recoge como action item.
- **Propuesta**: al añadir una fila a una sección `## Release <N>` comprometida, `sdd-roadmap`
  propone primero «Próximo» y, si el dev-lead la mete en la release, deja la decisión con su motivo en
  el cuerpo del commit.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una release «comprometida» y una petición nueva · WHEN entra por
  `sdd-roadmap` · THEN la recomendación por defecto es «Próximo», y si entra en la release el commit
  cita la decisión del dev-lead.

### 5. `Test-Capabilities.ps1` sigue reportando los punteros de capacidad como errores

- **Qué pasó**: en el cierre del patch, el validador volvió a listar título y «Requisitos» de cada
  capacidad puntero de la raíz, como en el ticket anterior del proyecto.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Test-Capabilities.ps1`.
- **Por qué el kit no lo evitó**: ya reportado; sigue sin cambio en 2.3.1.
- **Coste**: ruido que obliga a filtrar a mano qué falla en lo que el delta tocó.
- **Propuesta**: la del ticket anterior: validar el fichero enlazado por el puntero.
- **Verificada**: sí — reproducido con `Test-Capabilities.ps1 -Path .docs/sdd -Artifact <patch.md>`
  en PowerShell 7.
- **Criterio de aceptación**: GIVEN `capabilities/x.md` con solo un enlace a otra `capabilities/x.md`
  · WHEN se ejecuta el validador · THEN no reporta el puntero.

## Lo que hice por iniciativa propia

- Comprobar cada API de Angular en los tipos instalados (`@publicApi`/`@experimental`) en lugar de
  fiarme de artículos: dos artículos decían «experimental» de una API ya estable en la versión
  instalada.
- Spikes desechables antes de proponer (dónde resuelve la herramienta de diseño sus ficheros de
  contexto; limitaciones del proveedor de BD nuevo), borrados al acabar.
- Separar con `git stash` la preparación del cierre de la release antes de abrir un patch bloqueante,
  para que su merge no chocara con el changelog ya sellado.
- Verificación final sobre tres instancias recién creadas, una por dialecto, con la suite completa,
  el gate de frontend y los tests de BD: encontró el bloqueante que ninguna suite del repo veía.

## Funcionó, no tocar

- La tabla de destinos con gate de la migración a 2.3.0 y `Test-Roadmap.ps1` como prueba: el roadmap
  pasó a la forma cerrada en un turno y se mantuvo válido en cada commit posterior.
- `Get-NextSddId.ps1 -Reserve`: vio ids reservados en ramas no publicadas y no los repitió.
- `Invoke-SddMerge.ps1`: merge del patch en un comando, con la rama destino limpia.
- La línea `validaciones pendientes:` y la adenda por walkthrough: el cierre desatendido dejó cada
  validación con su disparador sin filas abiertas.

## Menores

- `Get-NextSddId.ps1 -Reserve` imprime `Assert-NoSharedIds` con formato de error (carpetas con
  sufijo anteriores a la secuencia) aunque reserva bien — `skills/sdd-templates/scripts/Get-NextSddId.ps1`.
- Un estado de fila «🧪 validación en la verificación final» (sin «diferida a») no pasó la
  migración y hubo que normalizarlo; ninguna skill de cierre lo escribe así hoy — no localizado.
