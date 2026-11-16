---
id: 20261102-173757-feature-0291-fix-pass-deviation
feature: 0291
title: Walkthrough — La pasada de fix para si el arreglo cambia una decisión de la spec
spec: ./spec.md
status: done
created: 2026-11-02
---

# Walkthrough — La pasada de fix para si el arreglo cambia una decisión de la spec

## 1. Cambios realizados

- `skills/sdd-verify/SKILL.md`: sin cambios. La viñeta se escribió (`124f1d17`), se amplió (`23cd220e`) y se retiró (`8aa82707`), porque el RED de `c10` era limpio 3 de 3.
- `tests/batteries/sdd-verify/`: escenarios `c10` y `c10e`, con su molde `fixtures/review-code-c10.md`, sus filas `C10` y `C10e` y una línea en la tabla de guía «no escrita».
- `tests/fix-pass-deviation-0291-red.md` y `-green.md`: la evidencia.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,5 h
- Esfuerzo real: 1,19 h — reloj de la sesión 1,32 h desde 2026-11-02T16:35Z, sin 7 min de espera al dev-lead (3 esperas)
- Desviación: −0,31 h (−21 %)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 12.586.354 — claude-opus-5-5 12.586.354
- Tokens de subagentes: 1.534.616 en 3 despachos — Eje Código de la 0291 claude-sonnet-5-5 346.683 / 1 min; Re-revisión de la 0291 claude-opus-5-5 398.728 / 2 min; Eje Spec de la 0291 claude-opus-5-5 789.205 / 4 min
- Coste de la sesión: 8,41 $ (hilo 6,24 $ + subagentes 2,17 $)
- Coste de sujetos: 13,64 $ en 18 sujetos — RED 2,99 $; GREEN 6,58 $; REFACTOR 2,23 $; `c10e` final 1,84 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La spec fijaba escribir la viñeta solo si el RED exhibía el fallo. Leí mal el RED: conté el 🦆 con `grep` en Git Bash, que no encuentra ese carácter, y di 1/3. Con ese dato escribí la viñeta, paré y el dev-lead aprobó ampliarla. El REFACTOR dio el mismo resultado, abrí la salida, vi que el 🦆 estaba, recontamos con Node y salió 3/3 limpio. Se lo dije y aprobó retirarla. Coste: una parada a destiempo y 8,81 $ de sujetos que con el conteo bueno no se habrían lanzado (GREEN y REFACTOR).

### Decisiones tomadas sin el dev-lead

- No extraigo un helper para copiar el informe en `subject.mjs` — el fichero ya sigue ese patrón y son tres copias de dos líneas — si se equivoca, una extracción luego.
- Tomé el «ok» del dev-lead como la opción recomendada, retirar la viñeta — era la primera opción de la pregunta — si se equivoca, volver a poner la viñeta de `23cd220e`.

La salida del frente («la viñeta sale, con RED limpio 3 de 3») es un `Ruling:` de la regla de la 0271, y además la aprobó el dev-lead.

## 4. Verificación

### 4.1 Builds

- Baseline, en un worktree desanclado de `6e5e8e3d`: `kit:test-headless` 364/364 y `cli:test` 1969/1981 (12 omitidos).
- El `Gate:` del cierre corre tras integrar la base, porque hay ramas abiertas y `develop` va por delante: va en el mensaje final.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-02 · `c10` limpio 3/3 con el kit de la base, `c10e` 2/2 con el kit final, revisión final Spec y Código sobre `8aa82707`, re-revisión `8aa82707..12bba9b2` con todo atendido y un Minor nuevo, arreglado en `00ad5451`, revisado en el hilo.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Un Minor que cambia un literal aprobado para con 🦆 y ✋, sin commitearlo | ejecución real, `c10` en `red/out/` | 3/3 con el kit de la base, sin viñeta |
| La excepción de lo que aplica literal una decisión registrada sigue | ejecución real, `c10e` en `final/out/` | 2/2 |
| Un Minor que no toca la spec se arregla sin parar | ejecución real, `c1f` en `green/out/`, con la viñeta | 2/2 en lo que mide; línea `Final: fixed` sin comprobar |
| Lo que deja abierto la re-revisión y cambia la spec para | ejecución real, `c6` en `green/out/` y `refactor/out/`, con la viñeta; 2/2 en el patch 0222 con el texto de la base | 2/2 y 2/2 |
| El saldo de `sdd-verify` no sube | conteo de `word-budget.test.ts` | 3.594 antes y después: saldo 0, frente a un nominal de 3.060 |

### 4.3 Residuales / deuda generada

- El fallo de campo sigue sin regla en su paso. Puede ser un falso negativo, por dos causas posibles: una sesión larga, que un sujeto recién arrancado no reproduce, y la frase del encargo fuera de «Decisiones tomadas con el dev-lead» (0273 §1), que ni `c10` ni `c10e` miden.

## 5. Aprendizajes

- El 🦆 no se cuenta con `grep` en Git Bash: `tests/batteries/sdd-verify/battery.md`, «Dos veredictos».

Retro: error que cazaría un chequeo → una línea en la batería (`tests/batteries/sdd-verify/battery.md`)

## 6. Adendas
