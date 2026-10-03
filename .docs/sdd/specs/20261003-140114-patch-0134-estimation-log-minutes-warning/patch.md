---
id: 20261003-140114-patch-0134-estimation-log-minutes-warning
task: 0134
title: Patch — Build-EstimationLog.ps1 lee los minutos y avisa del patch que no puede leer
type: patch
solution: causa raíz
status: done
created: 2026-10-03
branch: hotfix/v2.3.1
commit: 146415b7
---

# Patch 0134 — Build-EstimationLog.ps1 lee los minutos y avisa del patch que no puede leer

## Capacidades

- Modificadas: `estimation` — cambia «El parseo tolera el formato real de las plantillas» (los minutos tras las horas suman) y «Un bloque presente sin esfuerzo real avisa» (también avisa un `patch.md` con el tiempo fuera del bloque)

## 1. Síntoma

Dos reportes del mismo script:

- [Ticket del patch 0094](../../field-reports/20260928-161223-patch-0094-review-package-slim.md) §5 (fila de deuda «`Build-EstimationLog.ps1` lee «~1 h 20 min» como 1 h sin avisar»): el parser toma el prefijo numérico y descarta el resto en silencio.
- Ticket del patch 0132 (en `develop`, `field-reports/20261003-120530-patch-0132-grilling-template-count.md`, «Menores»): «exige los encabezados literales de §5 de `patch-template.md` («Tiempo (ligero)», «Estimación:», «Real:»); con «Estimado: … · Real: …» en una línea no lee el patch y no avisa».

Medido sobre `main` (2.3.0) con dos `patch.md` sintéticos: `- Real: ~1 h 20 min` en §5 da `1` en la columna Real; un `patch.md` con `Estimado: 0,5 h · Real: 0,7 h` en una línea y sin sección «Tiempo» no da fila ni aviso.

## 2. Causa raíz

`skills/sdd-templates/scripts/Build-EstimationLog.ps1`:

- `ConvertTo-Hours` captura la primera cifra y la primera palabra como unidad (`1` y `h`) y devuelve la cifra en horas; lo que sigue (`20 min`) no se mira.
- `Read-Patch` devuelve `$null` sin más cuando no encuentra un encabezado `Tiempo`, y `Get-Rows` salta en silencio los artefactos sin bloque: es la conducta prevista para un `patch.md` que no mide el tiempo, pero también se traga uno que sí lo escribe, fuera del bloque. El aviso de «bloque presente sin esfuerzo real» solo salta con la sección presente.

## 3. Fix

- **Fichero(s)**:
  - `skills/sdd-templates/scripts/Build-EstimationLog.ps1`
  - `tests/Build-EstimationLog.Tests.ps1`
  - `.docs/sdd/capabilities/estimation.md` (fusión del delta, en el cierre)
- **Cambio**: en horas, si detrás vienen minutos (`1 h 20 min`, `1h 30min`, `1 h y 20 minutos`), se suman en sesentavos. Un `patch.md` sin sección «Tiempo» que escribe `Real:`, `Estimación:` o `Estimado:` en otra parte emite el warning `Tiempo fuera del bloque «Tiempo» de la plantilla, sin leer: <ruta>. Fila excluida.`; uno sin ninguna de esas etiquetas sigue sin aviso, como hasta ahora.
- **Decisiones**:
  - Avisar y no leer la forma de una línea: el dev-lead pidió «que avise del patch que no puede leer», no que la lea — dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | tests nuevos antes del fix: `~1 h 20 min` → 1.33, y aviso del patch con el tiempo en una línea | ❌ los dos, como se esperaba |
| 2 | `tests/Build-EstimationLog.Tests.ps1` tras el fix | ✅ 70/70 |
| 3 | regenerar el `estimation-log.md` de este repo | ✅ sin cambios y sin avisos: ningún `patch.md` del repo tenía el tiempo fuera del bloque |

Los casos los verificó el agente.

Validación en campo: 2026-10-03 · tests nuevos en RED antes del fix y 70/70 tras él · estimation-log del repo regenerado sin cambios · pre-commit 949/0

## 5. Tiempo (ligero)

- Real: 0,4h

## 6. Delta de capacidad

### Capacidad: `estimation`

**MODIFIED — El parseo tolera el formato real de las plantillas**
- GIVEN un bloque de tiempo con negrita, `~`, coma decimal, unidad con espacio o rango (`2 h (rango 1,5–3)`)
- WHEN el script lo lee
- THEN obtiene estimado 2 y el real correspondiente, sin descartar la fila
- AND un `walkthrough.md` con `Estimación: —` entra con estimado vacío y ratio vacío
- AND `hotfix.md` se lee como `patch.md` con tipo `hotfix`
- AND la unidad `h`, `hora` u `horas`, o ninguna, deja la cifra en horas; `min`, `mins`, `minuto` o `minutos` la dividen entre 60 (`30 min` → 0,5)
- AND los minutos que siguen a las horas se suman (`~1 h 20 min` → 1,33)
- AND otra unidad (`2 días`) deja la celda vacía y avisa con el texto y el fichero, sin adivinar la conversión; si es el real, la fila se excluye con el aviso del requisito siguiente

**MODIFIED — Un bloque presente sin esfuerzo real avisa**
- GIVEN un walkthrough o patch con sección de tiempo cuyo esfuerzo real no se puede leer
- WHEN se genera el log
- THEN el script emite un warning con la carpeta afectada y excluye la fila, en vez de descartarla en silencio
- AND un estimado ilegible no avisa: la fila entra con estimado vacío (requisito anterior)
- AND un `patch.md` sin sección «Tiempo» que escribe `Real:`, `Estimación:` o `Estimado:` en otra parte (`Estimado: 0,5 h · Real: 0,7 h` en una línea) también avisa con su ruta y no da fila; sin ninguna de esas etiquetas, se omite sin aviso
