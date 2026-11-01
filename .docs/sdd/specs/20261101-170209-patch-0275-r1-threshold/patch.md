---
id: 20261101-170209-patch-0275-r1-threshold
task: 0275
title: Patch — `r1` lleva un umbral que su tasa sostiene, y un rojo de enrutado se contrasta con el texto anterior
type: patch
solution: dev-lead
status: done
created: 2026-11-01
branch: patch/0275-r1-threshold
commit: <hash>
---

# Patch 0275 — `r1` lleva un umbral que su tasa sostiene, y un rojo de enrutado se contrasta con el texto anterior

## Capacidades

- Ninguna, porque ninguna capacidad describe el umbral de `r1` ni cómo se lee un rojo de batería: viven en `tests/batteries/using-sdd/battery.md` y en `tech-stack.md`.

## 1. Síntoma

Fila 0275: «`r1` tiene n = 2 y umbral 2/2, pero acierta ~70 % en los dos idiomas (A/B de 14 sujetos: 11/14 y 9/14): sale en rojo cerca de la mitad de las veces con cualquier texto. Costó 4,60 $ y dos paradas.»

## 2. Solución fijada

Dev-lead, prompt de arranque, 2026-11-01: «`r1` pasa a n = 4 y umbral 2/4; y la regla de .docs/sdd/tech-stack.md "Un rojo no se relanza para sacar verde" dice que un rojo de enrutado tras una edición se contrasta con un A/B contra el texto anterior.»

Lo que da por existente, comprobado: la fila `r1` y la regla, tal como las cita; la medida, en `tests/english-using-templates-green.md`; y `battery.mjs` lee el umbral de la celda `Umbral`, sin exigir que sea igual a n.

## 3. Fix

- **Fichero(s)**: `tests/batteries/using-sdd/battery.md`, `.docs/sdd/tech-stack.md`
- **Cambio**: `r1` lleva n = 4 y umbral 2/4, con la medida en su procedencia. La regla termina en «uno de enrutado tras una edición, con A/B contra el texto anterior».
- **Decisiones**:
  - n = 4, umbral 2/4, sin sujetos nuevos; se acepta que una regresión a 30 % pase el 35 % de las veces, porque la cubre el A/B — dev-lead (prompt de arranque)
  - La regla sustituye texto y no sube el saldo de `tech-stack.md` — dev-lead (prompt de arranque)
  - «La procedencia vive en la batería, no en la skill» se funde con la línea anterior, que ya dice que `battery.md` la lleva — sin el dev-lead (método)
  - Se queda «para sacar verde»: distingue relanzar del A/B, que también lanza sujetos — sin el dev-lead (método)
- **Saldo de palabras**: `tech-stack.md` 21596 → 21596 (`wc -w`), y las dos líneas tocadas, 165 → 165. Lo paga la frase de la procedencia fundida (−10) y «de origen» (−2), frente a las 12 palabras nuevas.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `battery.mjs verdict` con el mismo resultado de juguete (`r1-1` a `sdd-roadmap`, `r1-2` a `sdd-propose`), con la fila de antes | ✅ reproduce: `r1 · 1/2 · umbral 2/2 · rojo` |
| 2 | La fila de ahora, con 2 de 4 a `sdd-roadmap` | ✅ `r1 · 2/4 · umbral 2/4 · verde` |
| 3 | La fila de ahora, con 1 de 4 | ✅ `r1 · 1/4 · umbral 2/4 · rojo` |
| 4 | Binomial: rojo por azar con 70 %, y paso con 30 % | ✅ 8,37 % (el criterio de la fila pide menos de uno de cada diez) y 34,83 % |
| 5 | `npx vitest run test/kit/headless/battery.test.ts` | ✅ `Tests  27 passed (27)` |

## 5. Tiempo (ligero)

- Estimación: 0,25 h + ~10 min de gate de cierre (patch 0278)
- Inicio: 2026-11-01T17:02Z
- Coste de sujetos: no aplica, sin sujetos nuevos
