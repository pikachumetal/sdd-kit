---
id: 20260910-072132-patch-0000-estimation-parser-tolerante
task: 0000
title: Patch — el parser del log de estimación pierde filas por el formato del bloque de tiempo
type: patch
status: done
created: 2026-09-10
branch: master
commit: fb95bee
---

# Patch 0000 — el parser del log de estimación pierde filas por el formato del bloque de tiempo

## 1. Síntoma

Detectado migrando LegalRep.pro al kit v1.1.0. Al regenerar su `estimation-log.md`:

```text
WARNING: Bloque de tiempo presente pero sin esfuerzo real legible:
20260909-103500-patch-0000-wizard-validation-feedback. Fila excluida.
```

El artefacto tiene el bloque de tiempo completo y legible por una persona:

```markdown
## 6. Tiempo

- Tipo: frontend
- Estimación de implementación (del plan): 1.5h
- Esfuerzo real: 1.2h
```

El proyecto lo tenía inventariado como deuda abierta en su `roadmap.md`, con el mismo diagnóstico
para un segundo caso: un walkthrough escrito con «≈ 2,5 h» tampoco entraba en el log.

## 2. Causa raíz

Dos huecos independientes, los dos en `skills/sdd-templates/scripts/Build-EstimationLog.ps1`:

1. **Etiquetas.** `Read-Patch` buscaba solo la forma reducida de la plantilla (`- Estimación:` /
   `- Real:`), mientras `Read-Walkthrough` conocía las formas largas
   (`- Estimación de implementación (del plan):` / `- Esfuerzo real:`). Un `patch.md` escrito con
   las etiquetas largas —cosa que la plantilla no prohíbe y que pasa cuando el patch se redacta
   junto a un walkthrough— no casaba con ninguna de las dos, así que `Real` salía `$null` y
   `Get-Rows` excluía la fila con el aviso de arriba.
2. **Marca de aproximación.** `ConvertTo-Hours` toleraba delante de la cifra espacios, negrita
   markdown y `~`, pero no `≈` ni `≃`. La coma decimal ya estaba resuelta: de la deuda original
   solo quedaba vivo el símbolo.

El efecto es el mismo en los dos casos y es el que hace daño: la fila desaparece del log con un
WARNING, y el factor de calibración se calcula sobre un conjunto incompleto sin que nadie lo note.

## 3. Fix

- **Fichero**: `skills/sdd-templates/scripts/Build-EstimationLog.ps1`
- **Cambio**: las etiquetas pasan a dos constantes de script (`$script:EstimateLabel`,
  `$script:RealLabel`) que comparten `Read-Walkthrough` y `Read-Patch`, con las formas largas
  primero para que el motor de regex no corte en la alternativa corta; `ConvertTo-Hours` acepta
  `≈` y `≃` junto a `~` como prefijo de la cifra.

## 4. Verificación

Agente: suite Pester del script, con fixtures nuevas en `tests/fixtures/estimation-log/tolerante/`
(root propio, para no alterar las medianas que verifican los tests de agregados del root
`proyecto`).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes del fix: los dos casos nuevos fallan, los 30 previos pasan | ✅ `Tests Passed: 30, Failed: 2` |
| 2 | `patch.md` con etiquetas largas → fila con ratio, sin WARNING | ✅ |
| 3 | Walkthrough con «≈ 3 h» / «≈ 2,5 h» → 3 / 2.5 / 0.83 | ✅ |
| 4 | GREEN sin regresión en el resto de la suite | ✅ `Tests Passed: 32, Failed: 0` |
| 5 | Regeneración real sobre LegalRep.pro (76 specs) | ✅ entra la fila que faltaba; el resto del log no cambia |

## 5. Tiempo (ligero)

- Estimación: 0,5h
- Real: 0,5h
