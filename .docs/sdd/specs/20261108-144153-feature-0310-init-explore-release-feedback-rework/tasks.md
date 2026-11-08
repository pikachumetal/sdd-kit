---
id: 20261108-144153-feature-0310-init-explore-release-feedback-rework
title: Tasks — sdd-init, sdd-explore, sdd-end-release, sdd-feedback y add-to-changelog con las tres reglas de la ADR 0022
spec: ./spec.md
plan: ./plan.md
created: 2026-11-08
---

# Tasks — sdd-init, sdd-explore, sdd-end-release, sdd-feedback y add-to-changelog con las tres reglas de la ADR 0022 (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0310-init-explore-release-feedback-rework`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `sdd-init`: P8 | done | `09f226c` | `n2` 1/1, secciones y etiquetas literales de la plantilla |
| 2 | `sdd-end-release` y `add-to-changelog`: P6 y S686 | done | `e7be078` | `r4` 1/1, `smoke: pendiente` y una línea por entrada |
| 3 | `sdd-feedback`: P7 y la fila P | done | `d265042`, fix juntado en el cierre | REFACTOR `fb1` 1/2 (rojo en P); arreglo del paso 5 en la pasada de fix, `fb1` 2/2 en `fix/` |

## Verificación por task

- [x] Task 1 — `n2` de `sdd-init` con `N=1` y lectura a mano de las cabeceras de `operations.md`
- [x] Task 2 — `r4` de `sdd-retro` con `N=1` y lectura a mano del `CHANGELOG.md` sellado
- [x] Task 3 — `fb1` de `sdd-feedback` con `N=1` (GREEN) y con `N=2` (REFACTOR); tras la pasada de fix, `fb1` con `N=2` en `fix/`

Revisión final: Spec opus+high, no lista · Código sonnet+high, lista · Arquitectura no (plan), sobre d265042
Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN (Critical 1, privacidad de `fb1`: rojo en `refactor/fb1-2`, verde en `fix/`) y 4 Minors con la suite (Código 1, 2, 3 y Spec «fila P estrecha»); el resto, en Rulings
Re-revisión: juntada en el cierre (rango desde d265042), sdd-kit:effort-high + opus, quedan hallazgos — un Important nuevo (el arreglo del Minor Código 2 cambió el literal de la decisión 3 en `release-notes.md:11`), deshecho en el cierre (sin revisar: vuelve al literal de la spec); cuatro Minors nuevos, en Rulings

## Fixes adicionales (trabajo descubierto fuera de scope; el tercero abre el freno de alcance)

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

- Task 2: Ruling: empiezo la Task 2 mientras corre el sujeto n2 de la Task 1 — n2 corre sobre una copia fija del kit (git archive de 09f226cd) y las tasks no comparten ficheros — si fallara, n2 se relanza sin coste de código
- Task 1: Ruling: el rango de la línea complete llega a e7be078 porque la Task 2 ya estaba commiteada; el de la Task 1 es f05cee2..09f226c — sin coste: el revisor final mira la rama entera
- Task 3: Ruling: empiezo la Task 3 mientras corre r4 de la Task 2 — r4 corre sobre la copia fija de e7be078 — sin coste si fallara
- Task 2: Ruling: el «fatal: a branch named 'develop' already exists» de r4 es del molde (subject.mjs:107 tras initRepo), no de esta rama — no se toca: fuera de Scope — si fuera de la rama, lo vería el sujeto de develop
- Task 2: Ruling: battery.mjs verdict filtra por paso y no por SCENARIOS, y el paso release incluye r6, no lanzado; la verificación de task done comprueba solo la línea de r4 — sin coste: r6 no mide nada de esta task
- Task 2: Ruling: el «fatal: a branch named 'develop' already exists» de r4 es del molde (subject.mjs:107 tras initRepo), no de esta rama — fuera de Scope, no se toca — si fuera de la rama, saldría también con el kit de develop
- Final: Ruling: Minor Código 4 (fila P sin RED/GREEN propio) — su evidencia es la de esta feature: fb1-2 rojo en refactor/ y fb1 verde en green/ y fix/ — sin coste: la evidencia queda en la carpeta de la spec
- Final: Ruling: Minor Código 5 (smoke: pendiente en SKILL.md:22 y en el paso 3) — son dos casos distintos (sin respuesta del usuario / no corrió smoke) y ya estaban; kit:own no la da — si fuera repetición, la cogería la 0311
- Final: Ruling: Minor Spec (cabeceras de tabla sin medir en n2) — operations-template.md no tiene tablas; medirlo pide un escenario que presente ROADMAP.md, fuera de la previsión — si la init deja cabeceras de tabla no literales, lo verá un ticket de campo
- Final: Ruling: Minor Spec (ledger con líneas duplicadas) — el ledger es efímero y se borra; la lectura de r4 duplicada sale de un Add-Content que corrió tras un task done fallido — sin coste
- Final: Ruling: no verificado Spec «RED decidido con sdd-agent-writing» — se invocó en la fase de spec (antes de la compactación) y su resultado es la decisión 9 — sin coste
- Final: Ruling: no verificado Spec «n2 omite Frontend y Entornos» — comprobado en n2-1.texts.txt: «No hay interfaz… ## Frontend no aplica» y «No hay scripts de entorno» — sin coste
- Final: Ruling: no verificado Spec kit checks y word-budget — kit:own/copies/skill-size corridos en d265042 (línea de Checks); word-budget y dist van en cli:test del gate de cierre
- Final: Ruling: declinado «smoke: pendiente if none ran» frente a la línea 22 — r4 se comportó bien y el texto ya estaba en la referencia — sin coste
- Final: Ruling: declinado ADR 0020 sin repetir h y a — r4 cubre «una línea por fila»; el corte no cambió de forma — si fallara, lo verá la próxima release
- Final: Ruling: la campaña cierra en 1,65 $ frente al COST_CAP de 1,58 de la enmienda — fb1-2 costó 0,28 $ y no los 0,20 de fix/fb1-1; battery.mjs comprueba el techo antes de lanzar, no después — sin coste adicional: era el último sujeto aprobado
- Final: Ruling: el «What to Check» del eje Código va resumido (calidad y comentarios) con puntero a code-reviewer-prompt.md para los cinco libros — el rango es prosa de skill y una rúbrica, sin código — si el revisor necesitara las tablas, las tiene en la ruta
- Final: Ruling: Minor Código 2 (referente de «the number») — manda el literal de la decisión 3; el <N> está definido en SKILL.md:28, que la referencia acompaña — si un agente no ata «the number» a <N>, lo verá un ticket de campo
- Final: Ruling: Minor re-revisión (literal del paso 5 fuera de la enmienda) — la enmienda nombra el paso 5 y el dev-lead la aprobó tras leer el cambio; el antes y el después van al walkthrough y están en el commit de cierre — sin coste
- Final: Ruling: Minor re-revisión (coste 1,65 $ frente a 1,58 de la enmienda) — se dijo al dev-lead; va al walkthrough y al ticket — 0,07 $ de más, ya gastados
- Final: Ruling: Minor re-revisión (tabla de topes de sdd-feedback en 656) — el walkthrough da la cifra final (+9 del paso 5, bajo 800) — sin coste
- Final: Ruling: Minor re-revisión (fila P sin «Norte» ni «reserva» en singular; Procedencia sin remitir a la evidencia) — «reserva» choca con el vocabulario del kit («reserva el id»); Norte no salió en ningún sujeto; la evidencia está en la carpeta de la spec — si un sujeto filtra el nombre de la sala, P no lo cogerá
- Final: Ruling: no verificado de la re-revisión (cabeceras de tabla de la decisión 2) — sin sujeto que lo mida; el walkthrough lo dice como no verificado
