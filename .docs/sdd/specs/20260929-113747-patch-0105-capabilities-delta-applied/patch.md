---
id: 20260929-113747-patch-0105-capabilities-delta-applied
task: 0105
title: Patch — el validador comprueba que el delta de capacidades se fusionó
type: patch
status: done
created: 2026-09-29
branch: feature/0105-capabilities-delta-applied
commit: a807b8d7
---

# Patch 0105 — el validador comprueba que el delta de capacidades se fusionó

## Capacidades

- Modificadas: `capabilities` — cambia «El validador de capacidades»

## 1. Síntoma

Fila de deuda del roadmap «Nada comprueba que el delta de capacidades se aplicó» ([ticket de la feature 0027 de document-manager](../../field-reports/20260929-103242-feature-0027-borrar-ficheros.md) §3, 2026-09-29), solo la parte en Actuar: la fusión del cierre la hizo un script improvisado que no aplicó dos `MODIFIED` con el encabezado `**MODIFIED — título** (antes: «…»)` en varias líneas, y `Test-Capabilities.ps1` no lo habría detectado: «valida la forma, no que el delta se aplicara».

Medido: una spec con `**MODIFIED — Reservar una franja** (antes: «la reserva queda⏎guardada»)` y un THEN nuevo, sobre una capacidad `bookings` sin fusionar, pasa con `Capacidades válidas: 1` y código 0. Igual un `ADDED` que no está en la capacidad (tests nuevos de `tests/Test-Capabilities.Tests.ps1` en rojo: `Expected '…del delta no coincide con capabilities/bookings.md' to be found in collection Capacidades válidas: 1`).

## 2. Causa raíz

`Test-ArtifactBlock` de `skills/sdd-templates/scripts/Test-Capabilities.ps1` solo lee del delta los nombres de las líneas `### Capacidad: \`<nombre>\`` y los compara con el bloque «Capacidades» y con los ficheros de `capabilities/`. No lee los requisitos `**ADDED —**` ni `**MODIFIED —**` de cada subsección, así que nunca los busca en su capacidad.

Mirar solo el título no basta para el fallo del ticket: un `MODIFIED` conserva el título (es la clave de fusión), y sin fusionar el requisito viejo sigue ahí con el mismo título. Lo que delata un `MODIFIED` sin aplicar son sus líneas de escenario.

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/scripts/Test-Capabilities.ps1`, `skills/sdd-templates/SKILL.md` (la fila del script), `tests/Test-Capabilities.Tests.ps1`, `.docs/sdd/capabilities/capabilities.md` (al cerrar).
- **Cambio**: con `-Artifact`, el validador recorre cada `**ADDED —**` y `**MODIFIED —**` de cada `### Capacidad:` —uniendo el encabezado hasta cerrar la negrita, así que un título o un `(antes: …)` partidos en varias líneas cuentan enteros— y exige que su capacidad tenga un `### <título>` con las mismas líneas `- GIVEN`/`WHEN`/`THEN`/`AND`, en orden. Falla con `«<título>» del delta no está en capabilities/<nombre>.md` o `… no coincide con …`. `REMOVED`, las reglas, las notas `>` y `Se valida en:` no se comparan.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Pester: `MODIFIED` sin fusionar con el `(antes: …)` en dos líneas falla nombrando el título | ✅ RED (pasaba con `Capacidades válidas: 1`) → verde |
| 2 | Pester: el mismo `MODIFIED` fusionado, con una nota `>` en medio, pasa | ✅ |
| 3 | Pester: dos `ADDED` sin fusionar, uno con el título partido en dos líneas, fallan con el título entero | ✅ RED → verde |
| 4 | Suite completa del kit | ✅ 1052/1053; el fallo, `FastSuiteBudget` (35,5 s por carga de la suite completa, culpa a `SubjectOutputPrivacy`), pasa solo en otra ejecución |
| 5 | `-Artifact` sobre los 12 artefactos más recientes del repo | ✅ 8 pasan; 0085 y 0098 fallan en requisitos que la 0091 y la 0099 modificaron después (esperado: se ejecuta al cerrar); 0091 falla por «el segundo sha», una edición de `feature-flow.md` posterior sin delta: fallo real, no falso positivo |

Validación diferida: 2026-09-29 · «Diferir: lo pruebo en el próximo cierre con delta, a cargo del dev-lead» · disparador: el próximo cierre de una feature o un patch con delta de capacidades, a cargo del dev-lead

Decisión tomada sin el dev-lead: la fila pedía nombrar el título que «no está en su capacidad»; se comparan también las líneas de escenario, porque un `MODIFIED` sin fusionar deja su título en la capacidad y solo así se detecta (§2).

## 5. Tiempo (ligero)

- Estimación: 0.5h
- Real: 0.6h

## 6. Delta de capacidad

### Capacidad: `capabilities`

**MODIFIED — El validador de capacidades** (antes: «con `-Artifact` … falla si falta el bloque `## Capacidades`, si sus nombres no coinciden …»)
- GIVEN `.docs/sdd/capabilities/bookings.md` cuyo requisito `### Consultar salas libres` tiene GIVEN y WHEN pero no `- THEN`
- WHEN se ejecuta `pwsh -NoProfile -File <sdd-templates>/scripts/Test-Capabilities.ps1 -Path .docs/sdd`
- THEN sale con código 1 y escribe `bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)`
- AND también falla, nombrando fichero y, si aplica, requisito, ante: un título que no es `# Capacidad — <nombre del fichero sin .md>`; una sección `##` distinta de `## Propósito`, `## Requisitos` y `## Reglas de la capacidad` (una `## Historial` incluida); una marca de delta (`**ADDED —`, `**MODIFIED —`, `**REMOVED —`) en la capacidad; un bloque `**Reglas de la capacidad**` en negrita, que es la forma del delta; una sección de reglas a la que falte alguna de sus cinco entradas por nombre
- AND ante `## Historial` el mensaje es `bookings.md: sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0`
- AND sin `## Propósito` escribe `bookings.md: falta la sección «Propósito»`; con la sección vacía, o solo con la ayuda `>` y el hueco `<…>` de la plantilla, `bookings.md: «Propósito» está vacío: escribe en una o dos frases qué cubre la capacidad`; con un propósito de 412 caracteres, medidos sobre el propósito en una sola línea como lo escribe el índice, `bookings.md: «Propósito» tiene 412 caracteres; el máximo es 300 (una o dos frases)`; y con `## Propósito` detrás de otra sección, `bookings.md: «Propósito» debe ser la primera sección`
- AND con `-Artifact <spec.md|patch.md>`, que se ejecuta después de fusionar el delta, falla si falta el bloque `## Capacidades`, si sus nombres no coinciden con las subsecciones `### Capacidad:` del delta, si no nombra ninguna capacidad ni dice «Ninguna, porque…» (`<a>: el bloque «Capacidades» está vacío: declara las capacidades o «Ninguna, porque <motivo>»`), si dice «Ninguna» y hay delta, si una capacidad del bloque no tiene fichero en `capabilities/`, o si un `patch.md` declara `- Nuevas:`
- AND con `-Artifact`, un `**ADDED — Cancelar una reserva**` del delta de `bookings` sin fusionar falla con `spec.md: «Cancelar una reserva» del delta no está en capabilities/bookings.md`, y un `**MODIFIED — Reservar una franja**` cuyas líneas `- GIVEN`, `- WHEN`, `- THEN` y `- AND` no son, en orden, las de ese requisito en la capacidad, con `spec.md: «Reservar una franja» del delta no coincide con capabilities/bookings.md`; el título cuenta entero aunque el encabezado, con su `(antes: «…»)`, ocupe varias líneas
- AND sin fallos escribe `Capacidades válidas: <n>` y sale con 0; sin carpeta `capabilities/`, o con la carpeta vacía, y sin `-Artifact`, escribe `Sin capacidades que validar` y sale con 0
