---
id: 20261030-112923-feature-0224-coherence-pass-and-cost-slot
feature: 0224
title: Walkthrough — La regla del entorno en la clasificación y el hueco «Previsión de coste» de la spec
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-30
---

# Walkthrough — La regla del entorno en la clasificación y el hueco «Previsión de coste» de la spec

## 1. Cambios realizados

- `skills/sdd-propose/SKILL.md` paso 2: antes de ejecutar nada, comprueba las dependencias en un comando propio; `skills/sdd-start-patch/SKILL.md` y el carril config dejan de repetirlo (2302ccfa).
- `skills/sdd-templates/templates/spec-template.md`: sección «Previsión de coste» con cinco filas y su suma (26580021).
- `.docs/sdd/roadmap.md`: la 0224 se parte, nace la 0264 con `parent: 0224`, y los destinos de deuda se reparten (721d05be).
- `tests/batteries/sdd-propose/`: escenarios `co1` a `co4`, sus moldes y `s1` en un paso propio.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 0,8 h
- Esfuerzo real: 0,79 h — reloj de la sesión 1,58 h desde 2026-10-30T11:25Z, sin 48 min de espera al dev-lead (3 esperas)
- Desviación: −0,01 h (−1 %)
- Compactación: no
- Modelo del hilo: Opus 5.5
- Tokens del hilo: 15.840.166 — claude-opus-5-5 15.840.166
- Tokens de subagentes: 3.207.679 en 3 despachos — Final review — Code axis claude-sonnet-5-5 1.439.144 / 2 min; Final review — Spec axis claude-opus-5-5 1.594.048 / 5 min; Single re-review of 0224 fix range claude-opus-5-5
- Coste de la sesión: 10,65 $ (hilo 7,79 $ + subagentes 2,86 $), medido antes de escribir este cierre
- Coste de sujetos: 7,21 $ en 22 sujetos sonnet — RED 1,36 $; GREEN 1,88 $; REFACTOR y GREEN de la Task 2 2,05 $; segunda ronda 0,76 $; medición final 1,16 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Tres frentes de la fila salieron por su RED limpio antes de la spec (`co1`, `co2`, `co3`), con la regla del dev-lead en la petición; sus filas de deuda no se saldan.
- La frase de la Task 1 cambió dos veces: el GREEN falló con las dos primeras.
- Una ronda de REFACTOR más de la prevista, dentro del techo en dólares (7,21 $ de 7,93 $).

### Decisiones tomadas sin el dev-lead

Las diez de `tasks.md` §Rulings, cada una con su coste si está mal. Saldo de palabras: `sdd-propose` de 5.353 a 5.352, `sdd-start-patch` de 1.940 a 1.891, `spec-template.md` de 1.914 a 1.912 (`wc -w`).

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 260/260 · cli:test: corrió 1672/1684 (12 saltados) · cli:typecheck: saltada (fuera de lo afectado), 58 s, sobre el commit de cierre

### 4.2 Smoke / tests

Verificado por el agente:

| THEN | Evidencia | Valor |
| --- | --- | --- |
| Patch o config corren `Project Setup` antes del primer test | `final/final/out/ws1-1.tools.txt`, `ws2-1.tools.txt` | ejecución real |
| La clasificación también | `green3/green3/out/ws3-1`, `ws3-2`: `pnpm install` antes del primer `node` | ejecución real |
| El paso 2 nombra el paso y los otros no lo repiten | `grep -rn "Project Setup" skills`: `sdd-propose:43` y `sdd-worktrees` | suite |
| «Previsión de coste» lleva las cinco filas | `co4-1` y `co4-2` en `green2`; `co4-1` en `final` | ejecución real |
| Cada cifra cita su batería y el precio, y el total es la suma | `co4-1`: 0,70 $ de `tech-stack.md`, 12,60 $ | ejecución real |
| Una spec que no edita una skill no lleva la sección | `s1-1`, `s1-2`, `co2`, `co3` | ejecución real |

No probado: `ws1`, `ws2` y `co4` con n = 2 sobre el texto final; corrieron con n = 1 por el techo. La batería entera se lanza al cortar la release.

Validación en campo: 2026-10-30 · sujetos y gate de arriba; revisión final y re-revisión cerradas, con 2 hallazgos abiertos por ruling y 5 Minor adjudicados.

### 4.3 Aprendizajes

- El veredicto de `battery.mjs` solo mira la puerta, y el lanzador a veces no guarda `tools.txt` ni `spec-new.md` («no se guarda»): `co2` salió rojo con la conducta correcta. Va al ticket.
- Una regla de orden sobre el primer comando falló dos veces en prosa y pasó como predicado observable, como ya dice el Art. II.

## 6. Adendas
