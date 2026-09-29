---
id: 20260929-113512-patch-0103-silence-watch-once-message
task: 0103
title: Patch — `Watch-SubagentSilence.ps1 -Once` no encuentra un despacho de hace más de 60 s
type: patch
status: done
created: 2026-09-29
branch: feature/0103-silence-watch-once-message
commit: <hash>
---

# Patch 0103 — `Watch-SubagentSilence.ps1 -Once` no encuentra un despacho de hace más de 60 s

## Capacidades

- Ninguna, porque ninguna capacidad describe `-Once` de `Watch-SubagentSilence.ps1` (el escenario «Sin transcript, el vigía lo dice» de `feature-flow` es del vigía continuo, que no cambia).

## 1. Síntoma

Reportado (fila de deuda del roadmap, [ticket de la feature 0027 de document-manager](../../field-reports/20260929-103242-feature-0027-borrar-ficheros.md) §4): con `-Once`, un subagente despachado hace 5 min y en marcha da «SIN TRANSCRIPT: …; el vigía de silencio no funciona en esta sesión», con el vigía continuo funcionando.

Medido (test nuevo sobre un transcript de fixture, meta.json de hace 5 min y `.jsonl` escrito hace 1 min):

```
Expected like wildcard 'EN MARCHA:*' to match 'SIN TRANSCRIPT: Revisor final 0095; el vigía de silencio no funciona en esta sesión', but it did not match.
```

Igual al reportado.

## 2. Causa raíz

`Find-Transcript` (`Watch-SubagentSilence.ps1`) descarta los `agent-*.meta.json` con `LastWriteTimeUtc` anterior a `StartedAt - DispatchMarginSeconds` (60 s). El margen existe para el vigía continuo, que se lanza en el turno del despacho y no debe coger un despacho anterior con la misma description. El `meta.json` se escribe al despachar y no vuelve a cambiar, así que con `-Once`, que se lanza en cualquier momento, todo despacho de hace más de 60 s queda fuera, y el veredicto cae en la rama `SIN TRANSCRIPT`.

## 3. Fix

- **Fichero(s)**: `skills/sdd-templates/scripts/Watch-SubagentSilence.ps1`, `tests/Watch-SubagentSilence.Tests.ps1`
- **Cambio**: con `-Once`, `Find-Transcript` no aplica el margen y toma el despacho más reciente con esa description (el `Sort-Object` ya existía); el continuo sigue con los 60 s. El test «no toma un despacho anterior con la misma description» afirmaba el margen a través de `-Once`: pasa a comprobar que `-Once` toma el más reciente de dos despachos con la misma description.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `-Once` con despacho de hace 5 min en marcha (test nuevo) | ✅ RED `SIN TRANSCRIPT:` antes del fix; GREEN `EN MARCHA:` después |
| 2 | `-Once` con dos despachos de igual description: uno de hace 30 min callado y otro reciente | ✅ `EN MARCHA:` (toma el reciente) |
| 3 | Suite completa `Invoke-Pester tests/` | ✅ 1050 verdes, 10 skipped; 1 rojo en `FastSuiteBudget` (35 s frente a 30 s, `SubjectOutputPrivacy.Tests.ps1`, fichero no tocado) que pasa en 2 de 2 repeticiones sueltas: tiempo con carga, no del fix |

Sin cobertura automática: el margen de 60 s del vigía continuo. Probarlo exige correr sin `-Once` y esperar la gracia de 2 min.

## 5. Tiempo (ligero)

- Estimación: —
- Real: 0.4h
