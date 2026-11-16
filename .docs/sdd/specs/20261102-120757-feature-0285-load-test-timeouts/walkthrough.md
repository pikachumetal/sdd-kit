---
id: 20261102-120757-feature-0285-load-test-timeouts
feature: 0285
title: Walkthrough — Los tests de cli:test no vencen a 5 s con varias suites a la vez
spec: ./spec.md
status: done
created: 2026-11-02
---

# Walkthrough — Los tests de cli:test no vencen a 5 s con varias suites a la vez

## 1. Cambios realizados

- **Tope por fichero** (`cf103b6b`): `vi.setConfig({ testTimeout: 20_000 })` con su motivo en `kit/subject-output-privacy`, `estimation/statistics`, `estimation/layout`, `roadmap/check`, `session/clock`, `watch/loop` y `temp-dir`. Ningún fichero pasa a `*.slow.test.ts`.
- **`watch/loop`** (`cf103b6b`): «con -- da SILENCIO…» reintenta con `vi.waitFor` hasta 10 s, en vez de esperar 800 ms fijos.
- **`tech-stack.md`** (`cf103b6b`, ajustada en el cierre): la carga que da el fallo y la excepción a la regla de `*.slow.test.ts`.
- **Batería** (`90848166`): escenario `w4` de `sdd-implement` y fila `Wc`, con su RED en `tests/baseline-commit-0285-red.md`.
- `skills/sdd-worktrees/SKILL.md` no cambia (decisión 1 de la spec).

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 0,75 h
- Esfuerzo real: 0,60 h — reloj de la sesión 0,82 h desde 2026-11-02T11:57Z, sin 13 min de espera al dev-lead (2 esperas)
- Desviación: -0,15 h (-20 %)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 9.001.486 — claude-opus-5-5 9.001.486
- Tokens de subagentes: 1.207.295 en 2 despachos — Eje Código de la revisión final 0285 claude-sonnet-5-5 366.992 / 1 min; Eje Spec de la revisión final 0285 claude-opus-5-5 840.303 / 3 min
- Coste de la sesión: 5,47 $ (hilo 4,27 $ + subagentes 1,21 $)
- Coste de sujetos: 0,73 $ en 2 sujetos Sonnet — RED de `w4` 0,73 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- _Ninguna_ frente a la spec aprobada, que ya sacaba el Step 3 del alcance. Frente a la petición: el Step 3 no se edita (RED limpio, Art. I) y el criterio de hecho añade 8 suites a la vez, las dos aprobadas por el dev-lead en el gate.

### Decisiones tomadas sin el dev-lead

- Eje Arquitectura no, decidido al despachar — sin módulo, dependencia, contrato ni datos — coste si está mal: una revisión que no salió.
- El rojo de `watch/loop` «con -- lanza el comando…» (1 de 48 suites) no se arregla ni abre fila — sin causa: 3 rondas sin repetirse y 3.000 hijos con 150 a la vez, todos con 0; es un solo caso y va al ticket — coste si está mal: un commit reintentado y, si es de `sdd watch`, un bug sin abrir.
- `20_000` repetido en 7 ficheros, sin constante común — es el patrón de `claim.slow` y `molds`, y un valor por fichero se ajusta solo — coste si está mal: tocar 7 líneas.
- `w4` se queda en la batería sin guía — el recorte quita la guía, no su escenario — coste si está mal: una fila de más.
- El reintento de `watch/loop` admite un verde falso si un hijo vivo se salta una ventana de 300 ms — improbable, y el mutante dio rojo — coste si está mal: un hijo sin parar sin detectar en esa pasada.

## 4. Verificación

### 4.1 Builds

- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió, cli:typecheck: corrió, cli:test: corrió 1862/1874 (12 saltados por la propia suite), «Tasks: 3 completed» · 115 s, frente a 109 s de la referencia del patch 0247 y 170 s de la línea base sin filtro, con otras sesiones en la máquina; tope 5 min · configuración: la del gate · sobre `cf103b6b`. No leí los recuentos de `kit:test-headless`.
- Línea base: `moon run kit:test-headless cli:typecheck cli:test` en un worktree desanclado de `b04870fc`, verde, 170 s.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-02 · medidas de carga de la tabla · mutantes 2/2 en rojo · revisión final Spec opus+high con hallazgos · Código sonnet+high sin Important, sobre `cf103b6b`; pasada de fix revisada en el hilo (9 líneas añadidas y 9 quitadas, documentación y comentarios).

| Criterio | Evidencia | Resultado |
| --- | --- | --- |
| `moon run cli:test` con CPU cerca del 80 % no da `Test timed out in 5000ms` | ejecución real, con `--force` y quemadores | 3/3 verdes, 1862 passed, CPU media 84, 80 y 77 %, 22-29 s |
| 8 suites a la vez no dan `Test timed out in 5000ms` | ejecución real, 6 rondas | 0 de 48 con timeout, antes 3 de 8; CPU media 92-93 %, 39-46 s |
| Un test lento sigue dando rojo fuera de esos ficheros | ejecución real, mutante de 6 s | `Test timed out in 5000ms` |
| `watch/loop` da rojo si el hijo no se para | ejecución real, mutante sin `stop()` | `expected true to be false`, a los 10 s |
| Gate por debajo de 5 min | ejecución real | 115 s |
| `w4` | batería de `sdd-implement` | 2/2 sin juntar commit y línea base; solo `w4-1` siguió el Step 3 |

Medida previa, sin el arreglo: 1 suite sola 9 s; con quemadores, CPU media 64-98 %, 11-16 s y 0 timeouts en 5 pasadas; 4 suites, 19 s en verde; 12 suites con tope de 60 s, un máximo de 8,7 s. Tras el arreglo, el máximo medido con 8 suites fue de 9,7 s.

### 4.3 Residuales / deuda generada

- **1 rojo de otra clase en 48 suites**: `watch/loop` > «con -- lanza el comando y termina con él, sin SILENCIO» (`expected 'TERMINADO: node -e setTimeout(()=>{},…'`), en la ronda 3 tras el arreglo. El valor recibido salió truncado, así que la causa no se conoce. Queda en el ticket.
- No probado: el solape real de un pre-commit con la línea base en una sesión larga.

## 5. Aprendizajes

- El porcentaje de CPU no predice este fallo; lo da el número de suites a la vez → `tech-stack.md`, «Conjunto rápido».

Retro: documento o skill desmentido → la fila de deuda y el ticket atribuían el fallo a la CPU alta, y la medida lo desmiente; corregido con la frase nueva (`.docs/sdd/tech-stack.md`)

## 6. Adendas
