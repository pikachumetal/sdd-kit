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

**Evidencia**: O3 · una persona en la recepción · fila O3 de `research.md` (O2 pasó a la Task 3)

### Task 3 — Medir O2 (memoria con 1.000 reservas)

**Evidencia**: O2 · `medidas/o2-memoria.txt`, de `node medidas/medir-libres.mjs --memoria` (10 repeticiones) · fila O2 de `research.md`
