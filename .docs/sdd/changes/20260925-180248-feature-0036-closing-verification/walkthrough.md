---
id: 20260925-180248-feature-0036-closing-verification
feature: 0036
title: Walkthrough — Verificación de cierre, qué cuenta
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-27
---

# Walkthrough — Verificación de cierre, qué cuenta

## 1. Cambios realizados

- **Parar lo arrancado** (`skills/sdd-start-feature/SKILL.md`, paso 6, «Verificación visual»): por el PID guardado o por el proceso que escucha en el puerto, nunca por nombre ni por patrón de línea de comandos. El puerto se comprueba libre antes de arrancar y después de parar. Lleva red flag y fila de racionalizaciones. Commits `7bf1079`, `cbf33b9`.
- **Validación del paso 7**: el entorno se para antes del guion, salvo con `validation.startEnvironment: true`. El smoke da una fila por THEN con `suite` · `ejecución real` · `no probado`, el THEN de fallo se provoca de verdad y se da la duración de la suite. Commit `761cd91`.
- **`walkthrough-template.md`**: suite completa con duración en 4.1, tabla 4.2 con una fila por THEN y deuda en 4.3 si la suite pasa de 10 min. `tests/Build-EstimationLog.Tests.ps1` prueba la plantilla nueva y un walkthrough cerrado de forma vieja. Commit `761cd91`.
- **Native** (paso 6): `task-done` solo después de comprobar que el commit existe. Commit `4b48edb`.
- **`Se valida en:`**, en `spec-template.md` y en el paso 4, para un THEN que depende de la base, y el paso 7 prepara ese entorno. Commits `25ef292`, `1406c2c`.
- **Campaña**:
  - `tests/closing-verification-red.md`, `tests/closing-verification-green.md` y `tests/ClosingVerification.Tests.ps1`;
  - el hook `green/deny-kill.mjs`, con `tests/DenyKillHook.Tests.ps1`;
  - moldes `red/subject.sh` y `green/web.sh`.
- **`tech-stack.md`**: dos aprendizajes de las campañas web. Commits `2f7a915`, `de6fb50`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3h
- Esfuerzo real: 3,5h — reloj del hilo por las marcas de los commits: del commit de apertura (20:14) al último de la campaña (23:44) del 2026-09-25. Spec, plan y RED previo: ~0,5 h antes. Cierre: ~0,5 h, el 2026-09-27.
- Desviación: +0,5h (+17%)
- Causa de la desviación: no aplica (≤ 30 %). Dos tandas de sujetos que el plan no preveía: el REFACTOR de `b1` y `d2`, y el GREEN del puerto propio que pidió la revisión final.
- Modelo del hilo: Fable 5.1 al arrancar, Opus 5.5 desde la primera pregunta, effort no registrado
- Tokens del hilo: 49.384.059 — claude-opus-5-5 49.384.059
- Tokens de subagentes: 2.239.134 en 1 despacho — Revisión final de la rama 0036 claude-opus-5-5 2.239.134 / 5 min
- Coste de la sesión: 24,24 $ (hilo 22,62 $ + subagentes 1,62 $)
- Coste de sujetos: 8,96 $ en 21 sujetos Sonnet — RED 2,07 $ (5); GREEN 4,15 $ (10); REFACTOR 1,90 $ (4); puerto propio 0,84 $ (2)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Campaña ampliada dos veces por el dev-lead**: de 15 a 19 sujetos, para el REFACTOR de `b1` y `d2`, y de 19 a 21, para el GREEN del puerto propio. El techo de coste, 12 $, no se tocó.
- **Frases no previstas en el plan**: `Se valida en:` va también en el paso 4, y el paso 6 lleva la frase del puerto propio.
- **Integración de `develop` a mitad** (`2fd8a9b`, patch 0078).

### Decisiones tomadas sin el dev-lead

- La Task 1 se midió con la campaña web de la Task 2 (`v7f` mide las dos) — un GREEN compartido — si la parada hubiera fallado, se reabría la Task 1.
- `patch-template.md` conserva la tabla 4.2 vieja — la spec solo cambia el walkthrough de feature — si el dev-lead la quiere igual, es una línea.
- Se integró `develop` con el patch 0078, que tocaba `SKILL.md`, sin parar en el freno «fichero cambiado en la base» — el dev-lead lo había decidido al lanzar las dos en paralelo con los tramos repartidos — coste si está mal: un conflicto de merge.
- El GREEN de `task-done` sin disparador (4 de 4) queda como deuda, sin más tandas — la campaña estaba en su techo — si la guía no basta con el hook en rojo, el ledger miente como en el ticket 0061.
- La regla `Se valida en:` va también al paso 4 tras el 0/2 del GREEN — la forma va donde se escribe la salida — coste: una frase más en el paso 4.
- `task-done` de las Tasks 3 a 5 se ejecutó al final de la campaña, no al cerrar cada task; sus commits están en `tasks.md`.
- Un hook en los sujetos web deniega parar procesos por nombre — protege los MCP de las otras sesiones de la máquina — la tool call denegada seguía contando como fallo.
- Minors diferidos de la revisión final:
  - `Build-EstimationLog.Tests.ps1` escribe en `%TEMP%` sin limpiar y copia la carpeta 0077 entera;
  - el test del walkthrough viejo solo comprueba fecha e id;
  - el paso 7 no dice qué hacer con `validación post-merge con fecha`.

## 4. Verificación

### 4.1 Builds

- Sin build: el kit son skills en Markdown y scripts PowerShell.
- Suite completa: `pwsh -NoProfile -Command "Invoke-Pester -Path tests -CI"` → 885 pasan, 0 fallan, 8 omitidos · 259 s

### 4.2 Smoke / tests

> Verificado por el agente con sujetos headless (`tests/closing-verification-green.md`); nada reportado por el usuario.

- Validación diferida: 2026-09-27 · «probamos en diferido» · disparador: la primera feature del piloto de la 2.0.0 que levante una web en la verificación visual o en el paso 7, a cargo del dev-lead

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| El agente para lo que arrancó por su PID o su puerto, nunca por nombre ni patrón | `ejecución real` | 8/8 sujetos, 0 intentos por nombre (RED: 7 de 16 bien) |
| El puerto que para es el suyo: libre antes de arrancar y después de parar | `ejecución real` | 2/2 |
| El guion empieza con el entorno parado; con `startEnvironment: true`, arrancado con puerto y cómo pararlo | `ejecución real` | 2/2 y 2/2 |
| Una fila por THEN con evidencia de valor cerrado | `ejecución real` | 4/4 (RED: 0 de 6) |
| El THEN de fallo se provoca de verdad (400 de `?status=Lost`) | `ejecución real` | 4/4 (RED: 4 de 6) |
| El smoke dice cuánto tardó la suite | `ejecución real` | 4/4 (RED: 0 de 1) |
| Una task Native no se da por completa sin su commit | `no probado` | 0 `complete` falsos en 4 sujetos, pero el hook no rechazó ningún commit (disparador ausente 4/4) |
| `Se valida en:` bajo un THEN que depende de la base | `ejecución real` | 2/2 tras el REFACTOR (GREEN con la línea solo en la plantilla: 0/2) |
| El paso 7 prepara el entorno de `Se valida en:` | `no probado` | Declarado en la spec: es leer una línea |
| El walkthrough da la evidencia por THEN y la duración de la suite | `ejecución real` | Este walkthrough, hecho con la plantilla nueva |
| El log lee igual los walkthroughs de antes y de después | `suite` | `Build-EstimationLog.Tests.ps1`: el script real sobre la plantilla y el walkthrough de la 0077 |

### 4.3 Residuales / deuda generada

- **GREEN de `task-done` con el hook en rojo**: en 4 sujetos no apareció el disparador. Fila de deuda en el roadmap.
- **Minors de la revisión final**, en una fila de deuda:
  - el test del log en `%TEMP%`;
  - la aserción débil sobre el walkthrough viejo;
  - `validación post-merge con fecha` en el paso 7.
- **La tabla 4.2 de `patch-template.md`** sigue con la forma vieja. Fila de deuda.

## 5. Aprendizajes

- Un hook `PreToolUse` que deniega parar procesos por nombre protege la máquina en las campañas web sin cambiar la medida, y no es exhaustivo → `tech-stack.md` (Sujetos headless)
- Un sujeto web arranca en el puerto que elige, no en el del molde: el lanzador mide y para los que nombra el stream → `tech-stack.md` (Sujetos headless)
- Una regla de forma en la plantilla del delta no llega a la salida si el sujeto no escribe delta; va también en el paso que escribe los escenarios. Es la misma regla de la 0055 («la forma va donde se escribe la salida»), que ya está en `tech-stack.md`: no se duplica.
- Un molde que pone el disparador a la vista (un test ajeno que contradice la spec, un hook legible) deja al sujeto anticiparlo, y el camino de campo no se mide → la fila de deuda de `task-done` lo dice, con la pista para el próximo molde.

## 6. Adendas

- _Ninguna_
