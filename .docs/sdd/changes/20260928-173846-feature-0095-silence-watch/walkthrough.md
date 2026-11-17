---
id: 20260928-173846-feature-0095-silence-watch
feature: 0095
title: Walkthrough — El vigía de silencio detecta un subagente colgado sin que nadie pregunte
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-28
---

# Walkthrough — El vigía de silencio detecta un subagente colgado sin que nadie pregunte

## 1. Cambios realizados

- **Script** (`0f286e4b`, pasada de fix `13b19739`): `skills/sdd-templates/scripts/Watch-SubagentSilence.ps1`.
  - Busca el transcript de un subagente por la `description` de su despacho, en `agent-*.meta.json`. Solo cuentan los despachos de hasta 60 s antes de arrancar el vigía.
  - Con `-Path`, vigila en su lugar la salida de un comando.
  - Lee `control.silence` de `sdd-kit.json`. Un valor inválido o un JSON roto caen al default, 8 y 20.
  - Aplica `longCommandMinutes` si hay un `Bash` o `PowerShell` sin `tool_result`, aunque vaya en paralelo con otra llamada, y `betweenStepsMinutes` en el resto.
  - Termina con `SILENCIO:` y su diagnóstico (último evento, herramienta y parámetros, `PreToolUse`, petición de permiso, tokens de salida), con `TERMINADO:` o con `SIN TRANSCRIPT:`.
  - La búsqueda de carpetas pasa a `TranscriptPaths.ps1`, compartida con `Measure-SessionTokens.ps1`. Tests: `tests/Watch-SubagentSilence.Tests.ps1` (20).
- **Guía** (`73f30c29`, `13b19739`):
  - `control-profiles.md` tiene una sección `## Vigía de silencio`: cuándo lanzarlo, qué hacer con cada primera línea y los seis pasos ante un cuelgue.
  - El paso 6 de `sdd-start-feature` lleva la orden.
  - `encargo-revision.md` (revisor final y re-revisión), `review-spec.md` §3 y el paso 9 de `sdd-end-feature` remiten a la sección.
  - `sdd-config` P5 y las dos remisiones de `control-profiles.md` dejan de mandar a la 0022. Tests estáticos: `tests/SilenceWatch.Tests.ps1`.
- **Docs**: `mission.md` (la frase de los frenos) y la fila 0022 del roadmap, que se queda sin el vigía.
- **Evidencia**: `tests/silence-watch-red.md` y `tests/silence-watch-green.md`; lanzadores y salidas en `red/`, `green/` y `control/`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 4,5h
- Esfuerzo real: 2,2h. Es el reloj del hilo, aproximado con las marcas de los commits: de la apertura (19:45) al cierre (~21:55). La spec y el plan llevaron ~1h antes.
- Desviación: -2,3h (-51 %)
- Causa de la desviación: la estimación suponía una campaña de ~2,5 h y una REFACTOR. La campaña corrió en ~1,5 h sin REFACTOR, con los sujetos en serie. El script no necesitó más que la pasada de fix de la revisión final.
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 38.395.194 — claude-opus-5-5 38.395.194
- Tokens de subagentes: 1.868.584 en 2 despachos — Smoke vigía 0095 claude-haiku-4-5-20251001 260.658 / 1 min; Revisor final 0095 claude-opus-5-5 1.607.926 / 4 min
- Coste de la sesión: 14,46 $ (hilo 13,24 $ + subagentes 1,23 $)
- Coste de sujetos: 13,93 $ en 28 sujetos Sonnet — RED 7,36 $ (12) · GREEN 5,66 $ (13) · control 0,48 $ (1) · descartados por el entorno 0,43 $ (2)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La verificación de la Task 1 se ejecutó con el Git Bash de Program Files lanzado desde PowerShell: desde la herramienta Bash fallan 3 tests de `Measure-SessionTokens`, una deuda ya apuntada en el roadmap.
- Los tests estáticos van en `tests/SilenceWatch.Tests.ps1`, un fichero nuevo, y no en `ControlProfiles.Tests.ps1`.
- El paso 7 de `sdd-start-feature` no se editó: la re-revisión usa el encargo del revisor final, que ya lleva el vigía.
- La pasada de fix marcó `Watch-SubagentSilence.Tests.ps1` con `-Tag 'Slow'` y le añadió `Clear-GitEnv`, dos convenciones de la suite que el test nuevo incumplía.

### Decisiones tomadas sin el dev-lead

- **Helper del test**: `Invoke-Watcher` devolvía un array de un elemento desenrollado. Se corrigió con la coma unaria, sin tocar las aserciones. Coste si está mal: ninguno, la copia RED lo muestra.
- **`task-done` desde PowerShell**, por la deuda de Git Bash. Coste si está mal: un fallo real enmascarado; lo descarta que pasen 34/34 con el mismo código.
- **Campaña de 26 sujetos válidos y 13,93 $**, frente a 22 y ~13 $ previstos, dentro del techo de 28 sujetos o 18 $. Coste si está mal: ~1 $.
- **Tres Minor de la revisión final subidos a Important** por su efecto: `Format-EventTime` lanzaba al diagnosticar, un `meta.json` corrupto tumbaba todos los vigías y `-Worktree` por `cwd` daba `SIN TRANSCRIPT`. Coste si está mal: tres tests de más.
- **Sin otra tanda tras el sujeto de control de s3**: lanzó el vigía del revisor final, pero ejecutó la verificación lenta en primer plano, sin vigía `-Path`. Coste si está mal: una verificación lenta real sin vigía.
- **Minor diferidos de la revisión final**:
  - `Get-Diagnosis` da el permiso por pendiente con cualquier `PermissionRequest` posterior.
  - «Último evento» da la hora de la llamada vigilada, no la del último evento.
  - `Format-Head` y `New-ToolUse` tienen 4 parámetros.
  - Con `-Path`, un fichero que no existe da el mensaje de «sin transcript».
  - El transcript se vuelve a parsear entero cada 30 s.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → 1017 passed, 0 failed · 412 s (desde la herramienta PowerShell).
- Pre-commit (conjunto rápido) en cada commit: 763/0.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-28 · «si sabes la respuesta ... diferido al uso del kit, feedback, merge, commit ...» · disparador: el primer despacho vigilado en un proyecto real con la versión del kit que publica esta feature, a cargo del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Tras cada despacho y cada verificación lenta, el vigía en segundo plano, sin umbrales en la orden | ejecución real | vigía sobre el revisor final real: `EN MARCHA: Revisor final 0095 escribió hace 0 min (umbral 8 min, betweenStepsMinutes)`; sujetos GREEN 6/6 |
| El umbral depende de la herramienta que espera (8 min 30 s con `Read`, 20 min 30 s con `PowerShell`, `betweenStepsMinutes: 5`, defaults) | suite | 5 tests en verde, más 5 de umbrales inválidos |
| El aviso dice qué hacía el subagente y cuánto gastó | suite | `13:26:12Z`, `Read`, `review-final-0f264440.diff`, `offset 500`, `limit 420`, `sin PreToolUse`, `sin petición de permiso`, `1200 tokens de salida` |
| Se para, se relanza una vez y se cuenta sin que nadie pregunte | ejecución real (sujetos, aviso simulado) | GREEN 2/2 |
| Permiso pendiente o segundo cuelgue no se relanzan | ejecución real (sujetos, aviso simulado) | GREEN 4/4: `no relanzado: permiso`, `parado: segundo cuelgue`, `⏸️ aparcada: cuelgue repetido del revisor final` |
| Un subagente que termina no da falso aviso | ejecución real | `TERMINADO: Smoke vigía 0095 devolvió su resultado`; ver el límite de 4.3 |
| Sin transcript, el vigía lo dice | ejecución real | `SIN TRANSCRIPT: no existe; el vigía de silencio no funciona en esta sesión` |

### 4.3 Residuales / deuda generada

- **`TERMINADO` antes de tiempo con un subagente que espera su propio trabajo en segundo plano**: el smoke real dio `TERMINADO` a los 15 s con un subagente que había dejado su `sleep` en segundo plano y cerrado el turno. Al reanudarse, ya nadie lo vigila. Va a la tabla de deuda del roadmap.
- **Los sujetos headless no cargan el kit sin `SUPERPOWERS_DIR`** en esta máquina: el plugin declara la dependencia de superpowers y, con `--plugin-dir`, no se resuelve. Va a `tech-stack.md`.
- Los cinco Minor diferidos de §3.

## 5. Aprendizajes

- Un sujeto headless con `--plugin-dir` del kit necesita `SUPERPOWERS_DIR`: sin él, «did not load in this session (unmet dependency)» → `tech-stack.md`
- `run.sh` lanza en paralelo todos los escenarios de `SCENARIOS`; para ir en serie, una llamada por escenario → `tech-stack.md`
- El límite de `TERMINADO` con trabajo propio en segundo plano → `roadmap.md` (deuda técnica)

## 6. Adendas
