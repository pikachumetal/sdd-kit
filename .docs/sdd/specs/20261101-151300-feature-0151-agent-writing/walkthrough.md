---
id: 20261101-151300-feature-0151-agent-writing
feature: 0151
title: Walkthrough — sdd-agent-writing
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — `sdd-agent-writing`

## 1. Cambios realizados

- `skills/sdd-agent-writing/`: `SKILL.md`, `references/skill-mechanics.md`, `references/skill-testing.md` y `NOTICE`, fork de `writing-for-agents` y `writing-skills` (f939b475; la pasada de fix va en el cierre).
- `tests/batteries/sdd-agent-writing/` y `tests/sdd-agent-writing-green.md`.
- `using-sdd`: fila de la puerta para crear una skill. El cierre deja de citar superpowers; `README.md` declara 0 skills suyas (ee22ad7a).
- Retiradas las copias de desarrollo de `.agents/skills/`; los avisos pasan a la lista del plugin (851f0364).
- Roadmap: la 0151 se parte en 0151, 0276 y 0277; siete filas de deuda pasan a esperar un 2.º ticket.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2,5 h
- Esfuerzo real: 0,89 h — reloj de la sesión 1,27 h desde 2026-11-01T15:07Z, sin 22 min de espera al dev-lead (3 esperas)
- Desviación: −1,61 h (−64 %)
- Causa de la desviación: el plan contó el fork como escritura de ~8.000 palabras; montarlo con un script desde las fuentes y correr sujetos a 0,12-0,2 $ fue mucho más rápido.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 17.630.045 — claude-opus-5-5 17.630.045
- Tokens de subagentes: 4.750.126 en 3 despachos — Final re-review 0151 claude-opus-5-5 680.182 / 4 min; Final review — Spec axis claude-opus-5-5 1.205.845 / 6 min; Final review — Code axis claude-sonnet-5-5 2.864.099 / 3 min
- Coste de la sesión: 13,02 $ (hilo 8,98 $ + subagentes 4,04 $)
- Coste de sujetos: 10,88 $ en 63 sujetos Sonnet — RED 2,61 $; GREEN y controles de `sdd-agent-writing` el resto, con el tramo de `using-sdd`. Previsión: 45 sujetos y 18,66 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Enmienda aprobada: tope de la skill de 8.470 a 8.760 palabras, para devolver las piezas de la fuente que exige la ADR 0013.
- Review Focus 1: `e1` se midió mal dos veces, porque el arnés nombraba la skill. Sin nombrarla, 2/2 van a `sdd-propose`.
- 63 sujetos frente a 45 previstos; no se avisó al pasar de 45. El dev-lead lo supo en la parada de la enmienda.

### Decisiones tomadas sin el dev-lead

- En T1, la puerta de `p1` solo se exige si la `description` basta — el §4 del plan la sitúa en T2 — un sujeto más.
- Retirado el ruling que aceptaba que editar una skill entrara por `sdd-agent-writing` — se apoyaba en una medida con la skill nombrada por el arnés — si es erróneo, editar una skill en un proyecto no la carga.
- Retirado el ruling del tramo de `using-sdd` a 7 sujetos — se lanzó entero — ninguno.
- El título del requisito de `routing` nombra «instrucciones para un agente» y su WHEN solo crear una skill — la `description` cubre `AGENTS.md` y `CLAUDE.md`; no se cambia la spec — un `AGENTS.md` no tiene escenario.
- Sin URL en el puntero a la guía de Anthropic — la fuente no trae una que comprobar — el agente tiene que buscarla.

### Sin revisar

- La segunda pasada, tras la re-revisión, va en el commit de cierre y no tiene otra revisión independiente: devuelve «Quick Reference», «The Bottom Line», «Real-World Impact», el principio y «Directory Structure», acota también la checklist, limpia el `NOTICE` y corrige README y evidencia.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 286/286 · cli:test: corrió 1708/1719, 11 saltados · cli:typecheck: corrió · 1 min 21 s · configuración: la del gate · sobre el commit de cierre.
- Línea base en worktree desanclado, sin filtro: las 3 tareas en verde, 1 min 10 s.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · suite 1708/1719 y 286/286 · batería con `p1`, `p2`, `e1`, `t1` y `b1` en verde y controles f1, b2, h1, m1 y c1 · tramo `sdd-propose` de `using-sdd` 10/10 filas · revisión final Spec y Código sobre 851f0364, re-revisión con 1 Important y Minors, arreglados en la segunda pasada, 1 sin revisar.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Primera skill invocada es `sdd-agent-writing` | ejecución real, `green5` p1 2/2, sin nombrarla | ok |
| `description` dice solo cuándo usarla | ejecución real, `green4/out/p1-2/skill.md`, 1 de 2 sujetos con copia | ok, parcial |
| No da la skill por hecha sin escenario | ejecución real, `scenario.md` en p1 | ok |
| Traspaso: nombra, lo primero del paso y prohíbe seguir | ejecución real, `green` t1 2/2, cuerpo anterior a la segunda pasada | ok |
| Previsión con REFACTOR y partida | ejecución real, `green` b1: 13 y 16 sujetos | ok |
| El total no sale en 4,50 $ | ejecución real, `green` b1: 6,5 $ y 8 $ | ok |
| Crear una skill va a `sdd-kit:sdd-agent-writing`, no a `sdd-propose` | ejecución real, p1 y p2 | ok |

No probado con el cuerpo final: `t1`, `b1`, `f1`, `b2`, `h1`, `m1` y `c1`.

### 4.3 Residuales / deuda generada

- Retirar la dependencia de superpowers: fila 0279.
- «Al editar una skill no se carga…»: parcial; en un proyecto nada la carga al editar.
- Siete frentes con RED limpio: esperan un 2.º ticket, como posible falso negativo.
- Una edición de skill sin escenario en un proyecto: `m1` y `f1` escriben o proponen un `scenario.md` al editar.

## 5. Aprendizajes

- Un escenario de puerta nunca lleva la skill en la petición: si el arnés la nombra, mide el arnés → `tech-stack.md`, «Baterías por skill».
- Un fork montado con un script deja fuera piezas sin que nadie las decida: la tabla de procedencia se contrasta con la fuente línea a línea → `tests/batteries/sdd-agent-writing/battery.md`, que ya la lleva.
- Skills del proyecto: `.claude/skills/` solo tiene `skill-creator`; sin patrón ni contradicción que llevar.

## 6. Adendas

- Ninguna.
