---
id: 20261102-163922-feature-0194-roadmap-whats-next
feature: 0194
title: Walkthrough — sdd-roadmap, entrada «qué sigue»
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-02
---

# Walkthrough — `sdd-roadmap`, entrada «qué sigue»

## 1. Cambios realizados

- `skills/sdd-roadmap/SKILL.md`: entrada «What comes next» y sus frases en la `description`; la entrada 1 dice que un «Tras» abierto no para el prompt. Salen tres racionalizaciones y la cola de la línea 14. De 3.560 a 3.559 palabras.
- `skills/using-sdd/SKILL.md`: «qué sigue» y «dame la siguiente» en la fila de planificación, porque entraban por `sdd-explore`.
- `tests/batteries/sdd-roadmap/`: `wn1`, `wn2`, `wn3`, tres moldes, rúbrica y procedencia. `tests/batteries/using-sdd/battery.md`: `r8`.
- Commits: apertura `611f9c42`, Task 1 `97a8cf4a`, Task 2 y cierre, los dos siguientes de la rama; la pasada de fix va juntada en el cierre.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2 h
- Esfuerzo real: 1,54 h — reloj de la sesión 3,11 h desde 2026-11-02T16:37Z, sin 94 min de espera al dev-lead (3 esperas)
- Desviación: -0,46 h (-23 %)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 15.604.448 — claude-opus-5-5 15.604.448
- Tokens de subagentes: 3.551.073 en 3 despachos — Final review — Spec axis claude-opus-5-5 1.156.286 / 5 min; Re-review final 0194 claude-opus-5-5 421.119 / 2 min; Final review — Code axis claude-sonnet-5-5 1.973.668 / 4 min
- Coste de la sesión: 12,75 $ (hilo 9,85 $ + subagentes 2,90 $)
- Coste de sujetos: 23,76 $ en 140 sujetos Sonnet, según el acumulado de la campaña; previsión 20,18 $, superada con aprobación (Enmiendas de la spec)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La entrada 1 cambia, aunque el plan decía que no: `m1` 1/2, porque la palabra «blocked» de la entrada nueva la contaminó; 2/2 tras el arreglo.
- Más tandas que las previstas, para `m2` y `c2`, decididas por el dev-lead.

### Decisiones tomadas sin el dev-lead

- m1 1/2 por «blocked» de la entrada nueva: la entrada 1 dice que un «Tras» abierto no para el prompt — mantiene el requisito vigente — 11 palabras de más.
- `task done` de la Task 2 registrado con un comando vacío — las baterías ya habían corrido — la línea del ledger no da un veredicto repetible.
- 🔒 no está definido (eje Código), rechazado — lo define «Prepare a release» de la misma skill — un marcador sin uso.
- `OPEN_BRANCH` fuera de `molds` (eje Código), se queda — no aclara más — un mapa de tres líneas.
- `wn3` con n = 2 (eje Spec), se queda — la regla n = 3 es para un RED limpio, y `wn3` salió rojo — un sujeto menos de control.

## 4. Verificación

### 4.1 Builds

- Línea base sobre `1538af66`, sin filtro: `moon run cli:typecheck cli:test`, 2 tareas completadas.
- Gate: se corre en el paso de la base integrada, con otra rama abierta y la base por delante; su línea va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-02 · verificación del agente: `wn1`, `wn2`, `wn3` y `r8` en umbral · revisión final Spec y Código sobre el commit de la Task 2, 16 hallazgos atendidos · re-revisión: las dos Important de redacción, corregidas y revisadas en el hilo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Propone primero la 0013 y da su prompt | ejecución real: `wn1`, `green`, `refactor`, `fix-ctl` | 7/7 |
| Dice por qué no 0014 ni 0015 | ejecución real: `wn1` | 7/7 |
| No escribe, reserva, publica, commitea ni arranca | ejecución real: `state.txt` de `wn1`-`wn3` | 19/19 |
| 2.x: la 0033; no 0030, 0031 ni 0032; sin `ROADMAP.md` | ejecución real: `wn2` | 7/7 |
| Sin familia, la 0020 con prompt y el porqué de la 0019 | ejecución real: `wn3` | 5/5 |
| Con Now vacío sigue por Next; Later no se ofrece; sin nada, lo dice | no probado para Now vacío; Later, ejecución real en `wn1` | texto revisado |
| Familia solo bloqueada; dos familias | no probado: lectura del eje Spec | texto revisado |
| Las dos frases entran por `sdd-roadmap` | ejecución real: `wn1`-`wn3`, `r8` | 19/19 y 4/4 |

Controles enteros por fila de la rúbrica; `using-sdd`, todos en umbral. En `sdd-roadmap`, por debajo de umbral:

| Escenario | Rama | `develop` |
| --- | --- | --- |
| `m2` puerta | 3/6 | 4/6 |
| `m2` conducta completa | 1/6 | 3/6 |
| `c2` | 4/6 | 1/2 |
| `m3` | 1/2 | 1/2 |

`m1` da 2/2 tras el arreglo. Filas M4, M5, M6, M7, ID3, M3b, C1, RL1, RE1 y RF1, leídas a mano por el hilo; M5, M7 y RF1 solo en su final y en lo que dejó el sujeto.

### 4.3 Residuales / deuda generada

- `m2`: en conducta completa, la rama da 1/6 frente a 3/6 de `develop`; con n = 6 no se distingue del azar, y lo retirado no toca la regla del prompt al cerrar. Va en el ticket.
- `m3` y `m2` fallan también con el kit de `develop`, sin fila propia. Va en el ticket.

## 5. Aprendizajes

- Una palabra de una entrada nueva puede contaminar la vecina: «blocked» hizo negar un prompt pedido por id → `tests/batteries/sdd-roadmap/battery.md`, procedencia.
- `puerta verde` no es la cifra de un escenario, y un A/B con n = 2 engaña: dio `m2` 2/2 en `develop`, y con n = 6, 4/6 → ticket del kit.

Retro: error que cazaría un chequeo → ticket del kit: la fila M2 es prosa; pasada a `file:` o `tools:`, `battery.mjs verdict` habría dado la cifra que el hilo contó mal al dev-lead

## 6. Adendas
