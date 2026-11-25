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

### Task 3 — Memoria con la peor carga (vuelta de sdd-validate)

**Evidencia**: O2 · `medidas/o2-memoria.txt`, de 10 ejecuciones de `node medidas/medir-libres.mjs --memoria` · fila O2 de `research.md`

### Task 4 — Fix de la revisión final (vuelta de sdd-verify)

**Evidencia**: O2 · `medidas/o2-memoria.txt`, 10 ejecuciones con RSS y heap más la base de un Node vacío · filas O2 y O3, tabla de aguante y recomendación de `research.md`
