---
id: 20261120-090000-feature-0030-libres-load
title: Plan — ¿Aguanta `libres` 1.000 reservas?
spec: ./spec.md
status: approved
---

# Plan — ¿Aguanta `libres` 1.000 reservas?

**Ejecución**: native, porque un spike siempre va en Native

### Task 1 — Comparaciones de `libres` con la peor carga

**Evidencia**: O1 · `medidas/o1-libres.txt`, de `node medidas/medir-libres.mjs` · fila O1 de `research.md`

### Task 2 — Memoria y uso por una persona

**Evidencia**: O2 · `medidas/o2-memoria.txt`, de `node medidas/medir-libres.mjs --memoria` · O3 · una persona en la recepción · filas O2 y O3 de `research.md`

### Task 3 — Medir O2, que quedó sin medir (hallazgo de sdd-validate)

**Evidencia**: O2 · `medidas/o2-memoria.txt`, de `node medidas/medir-libres.mjs --memoria` (heap) y RSS del proceso · fila O2 de `research.md`

### Task 4 — Hallazgos de la revisión final (eje Spec)

**Evidencia**: O1 · `medidas/o1-libres.txt` sobre una copia fiel de `freeRooms` · O2 · `medidas/o2-memoria.txt` con heap y RSS antes y después de sembrar · filas O1, O2, O3 y secciones 3, 4 y 5 de `research.md`
