# Tasks — 0013 Precio en su módulo

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — `priceFor` en su módulo | hecha | 908bf05 (+ fix 02fd82f) |

Revisión final: autorrevisión por ejes (sin herramienta de subagentes) — Spec, Código y Arquitectura revisados por mí, sobre 02fd82f
Pasada de fix: 02fd82f, 1 hallazgo reproducido a mano (sin test commiteado)

## Rulings

Task 1: Ruling: trabajo en el sitio, sin worktree nuevo — GIT_DIR == GIT_COMMON pero ya en la rama feature/0013-price-module, no en main — si falla, se mueve la rama a un worktree
Task 1: Ruling: sin test RED nuevo — la spec fija «Dónde se prueba: test/price.test.js, sin cambios» (refactor, comportamiento ya cubierto por 5 tests en verde); añadir un test cambiaría esa línea de la spec — coste si falla: `priceFor` solo se prueba a través de `run('precio')`
Task 1: Ruling: las tarifas por sala viven en price.js (`rates`), `rooms` se queda en app.js para `libres` — así «sala desconocida» se decide en el módulo del precio — coste: el nombre de la sala está en dos sitios hasta la 0015
Final: Ruling: el fix no lleva test commiteado — la spec fija «Dónde se prueba: test/price.test.js, sin cambios» y un test nuevo la cambiaría — coste si falla: la regresión de claves heredadas no queda cubierta por la suite
Final: Ruling: sin re-revisión por subagente — no hay herramienta de subagentes y el fix es de código (no de solo docs) — coste si falla: el commit 02fd82f llega sin revisión independiente
