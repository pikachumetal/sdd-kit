---
kit_version: 2.3.0
superpowers_version: 6.4.2
lane: patch
id: 20261003-120530-patch-0132-grilling-template-count
task: 0132
mode:
date: 2026-10-03
---

# Ticket para el kit — patch 0132: la plantilla de `sdd-grilling` muestra de 1 a N alternativas

- Contexto: patch de petición cerrada (la solución la fijó el dev-lead), Opus 5.5, sin subagentes; micro-tests en Opus.
- Coste: 1 h frente a 0,5 h estimadas, por una segunda tanda de micro-tests que pidió el dev-lead (de n=4 a n=12); ~8 $ en 56 llamadas de Opus.
- Iniciativa: el primer RED (n=4, dos mensajes) no separaba «hay dos opciones reales» de «el ejemplo ancla en dos», y se añadió un tercer mensaje con cuatro usos claros que sí lo separa. Candidato a regla: un micro-test de forma necesita un caso donde la forma correcta y la anclada den resultados distintos.

## Menores

- `Build-EstimationLog.ps1` exige los encabezados literales de §5 de `patch-template.md` («Tiempo (ligero)», «Estimación:», «Real:»); con «Estimado: … · Real: …» en una línea no lee el patch y no avisa — `skills/sdd-templates/scripts/Build-EstimationLog.ps1`.
