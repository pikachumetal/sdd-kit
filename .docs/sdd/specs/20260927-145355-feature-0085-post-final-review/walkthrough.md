---
id: 20260927-145355-feature-0085-post-final-review
feature: 0085
title: Walkthrough — Bordes de la revisión después de la revisión final de rama
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-27
---

# Walkthrough — Bordes de la revisión después de la revisión final de rama

## 1. Cambios realizados

- **Re-revisión del tramo** (`459a738`): el paso 7 de `skills/sdd-start-feature/SKILL.md` despacha, si `HEAD` avanzó desde la revisión final, un revisor con el encargo del revisor final sobre `<revisión final>..HEAD` antes de presentar. Si el commit llega con la validación ya presentada, lo hace antes de invocar `sdd-end-feature`. La línea `Revisión final:` de `tasks.md` guarda el commit revisado (`…, sobre <sha corto>`), y la re-revisión se apunta como `Re-revisión: <sha>..<sha>, <tipo> + <modelo>, <veredicto>`. «Ruling» de `references/control-profiles.md` lleva el mismo tercer caso.
- **Revisión en el hilo** (`788b2c2` y la pasada de fix del cierre): un commit del hilo con todos sus ficheros bajo `.docs/` o `*.md` de la raíz y de menos de 20 líneas (`git diff --numstat`; en un merge, solo lo que resolvió el hilo, con `git show --remerge-diff`) no despacha revisor y se anota como `revisado en el hilo: <sha> · <ficheros> · <n> líneas`. El umbral está en «Ruling» y, resumido, en los pasos 6 y 7.
- **Reproducir antes de arreglar** (`2c39f4a`): en el paso 6, ante un Critical o Important que afirma algo de ejecución, el primer paso del fix es un test en RED. En SDD, si no sale en un intento, el implementador vuelve con `NEEDS_CONTEXT`. No reproducirlo no descarta el hallazgo: el hilo decide y lo registra como ruling.
- **Tests**: `tests/PostFinalReview.Tests.ps1` (8 anclas), evidencia en `tests/post-final-review-red.md` y `tests/post-final-review-green.md`, y el sujeto `red/subject.sh` con el hook `red/deny-agent.mjs`, que deniega `Agent` y guarda su `prompt`.
- **Roadmap**: fila 0085 en «Versión siguiente», con `parent: 0032`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,4h — reloj del hilo, aproximado con las marcas de los commits (apertura 14:58, cierre 16:25)
- Desviación: -2,6h (-65 %)
- Causa de la desviación: las campañas corrieron con los dos sujetos de cada escenario en paralelo (~5 min por fase frente a los ~40 min por campaña que suponía el plan), y cada pieza era una o dos frases.
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 32.496.683 — claude-opus-5-5 32.496.683 (medido con `-ProjectsRoot` en `~/.claude-gco/projects`: el valor por defecto del script no sigue `CLAUDE_CONFIG_DIR`)
- Tokens de subagentes: 1.276.517 en 1 despacho — Revisión final de rama 0085 claude-opus-5-5 1.276.517 / 3 min
- Coste de la sesión: 12,39 $ (hilo 11,31 $ + subagentes 1,08 $)
- Coste de sujetos: 23,14 $ en 32 sujetos Sonnet — Task 1 8,43 $; Task 2 6,85 $; Task 3 5,55 $; pasada de fix 2,29 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La Task 2 necesitó dos tandas GREEN: con el umbral solo en `control-profiles.md`, un sujeto se comió el control de 26 líneas. El umbral pasó también a los pasos 6 y 7.
- El GREEN se lanza con el mismo `red/subject.sh` y `PHASE=green`; no hay `green/subject.sh`.
- La revisión final abrió una pasada de fix con un escenario nuevo, `s3`, y dos tandas más (`red`, `green3`).

### Decisiones tomadas sin el dev-lead

- Merge de sincronización `cd74a5b` con `develop` (patch 0084) antes del RED de la Task 1 — el lanzador arreglado permite fases en paralelo, y el merge no tuvo conflictos — coste si está mal: el rango de la Task 1 lleva un merge dentro.
- La línea `Revisión final: …, sobre <sha corto>` se escribe sin un fallo medido — el molde la trae en RED y GREEN, y sale de la decisión 2 de la spec aprobada — coste si está mal: una frase de formato sin RED propio.
- Sin `green/subject.sh`: el GREEN lanza `red/subject.sh` con `PHASE=green` — una sola copia del molde — coste si está mal: ninguno.
- El umbral de la revisión en el hilo se copia en los pasos 6 y 7, y el test «no copia el umbral» pasa a exigirlo — en el primer GREEN, s2-2 leyó en el hilo un commit de 26 líneas sin abrir la referencia — coste si está mal: el umbral en dos sitios.
- El RED de la Task 3 usa el kit de la rama tras la Task 2, y el hook guarda ahora el `prompt` de cada `Agent` — las Tasks 1 y 2 no tocan la ronda de fix — coste si está mal: ninguno para esa pieza.
- El criterio (a) de la Task 1 queda en 3/4 — p2-1 entra directo por `sdd-end-feature` y re-revisa dentro del cierre, antes del merge pero después de escribir el walkthrough, el roadmap y el changelog; el paso 9 de `sdd-end-feature` sigue diciendo «No lances otra» y queda pendiente en la fila 0085 — coste si está mal: un cierre que documenta antes del veredicto de la re-revisión.
- `SUBJECT_CAP` sube de 32 a 34 para la pasada de fix — el plan no preveía una tanda de fix — coste si está mal: dos sujetos más.
- Se mantiene el arreglo del Important 1 de la revisión final aunque `s3` salió 2/2 en el RED — los dos sujetos sacaron el conteo del merge de `control-profiles.md`, la misma referencia que s2-2 no abrió; en el GREEN, s3-1 lo sacó del paso — coste si está mal: media frase de más en dos pasos.
- El test de la errata usa `-MatchExactly` — `-Match` de PowerShell no distingue mayúsculas y daba rojo con «Si» — coste si está mal: ninguno.
- La pasada de fix de la revisión final no abre la re-revisión del tramo — es el bucle de fix de la propia revisión, verificado con TDD como pide `executing-plans` («Do not dispatch a re-review»); el paso 7 no lo distingue y queda pendiente en la fila 0085 — coste si está mal: un fix de la pasada sin segundo par de ojos.
- Deferred minors de la revisión final: el disparador del paso 7 compara solo con la línea `Revisión final:` y no con la última `Re-revisión:`; `Re-revisión:` no dice dónde va sin `tasks.md`; el ancla del paso 7 no fija «antes de invocar `sdd-end-feature`» ni la frase del tramo en `control-profiles.md`; «un hallazgo que se ve leyendo el diff» se solapa con «afirma algo de ejecución»; el plan dice 2 y 25 líneas en `s1` y `s2`, y la evidencia 1 y 26.

## 4. Verificación

### 4.1 Builds

- Sin build. Suite completa: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → 858 pasan, 0 fallan, 9 saltadas · ~35 s (en el pre-commit del cierre).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-27 · «cuando acabes, validacion diferida al uso, feedback, commit y merge» · disparador: la primera feature, del kit o de un proyecto, con un commit del hilo posterior a la revisión final, a cargo del dev-lead. El disparador lo concretó el agente; la frase la dijo el dev-lead mientras corría la implementación, antes de ver el resultado.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| control-profiles MODIFIED: el commit posterior entra en la re-revisión del tramo | ejecución real (sujetos `p1`, `p2` GREEN) | 4/4 revisan el tramo antes del merge; 3/4 antes de invocar el cierre |
| control-profiles MODIFIED: el commit pequeño de solo docs no despacha revisor y se anota | ejecución real (`s1` GREEN 2/2 en dos tandas, `s3` GREEN 2/2) | pasa; la línea literal sale 3 de 4 veces en las tandas finales, y el resto va en prosa |
| control-profiles MODIFIED: la validación abre con «Me salí del plan en…» | suite (sin cambio) | vigente |
| feature-flow ADDED: re-revisión del tramo antes de la validación, con `Re-revisión:` en `tasks.md` | ejecución real (`p1` GREEN) | 2/2 |
| feature-flow ADDED: con la validación ya presentada, antes de `sdd-end-feature` | ejecución real (`p2` GREEN) | 1/2 antes de invocarlo; 2/2 antes del merge |
| feature-flow ADDED: tramo solo de docs pequeños sin revisor | ejecución real (`s1`, `s3` GREEN) | 2/2 y 2/2 |
| feature-flow ADDED: el fix de un hallazgo de ejecución empieza por un RED; en SDD, `NEEDS_CONTEXT` | ejecución real (`f1` GREEN) | 2/2 |
| feature-flow ADDED: en Native el hilo no arregla sin RED y lo registra | ejecución real (`f2` RED y GREEN) | 2/2 en las dos fases |
| feature-flow ADDED: no reproducir no descarta; se registra como ruling | ejecución real (`f2` GREEN) | 2/2 |
| feature-flow ADDED: un hallazgo de lectura no lleva el paso | no probado | sin escenario propio (minor diferido) |

### 4.3 Residuales / deuda generada

- El paso 9 de `sdd-end-feature` no reconoce la re-revisión del tramo ni los commits hechos durante el cierre → fila 0085, pendiente fuera de la spec.
- El paso 7 no distingue la pasada de fix de la revisión final de un commit posterior → fila 0085, pendiente.
- Cinco minors diferidos (§3) → fila 0085, pendiente.
- `Measure-SessionTokens.ps1` no sigue `CLAUDE_CONFIG_DIR` → fila de deuda técnica.

## 5. Aprendizajes

- Una condición que un paso resume y remite a una referencia se pierde en el sujeto que no abre la referencia: el umbral de la revisión en el hilo tuvo que ir entero al paso (Task 2, s2-2; pasada de fix, s3-1) → `tech-stack.md`, sección de campañas.
- Denegar `Agent` con un `PreToolUse` que guarda el `prompt` mide el despacho y el encargo sin pagar el revisor → `tech-stack.md`, sección de campañas.
- `Measure-SessionTokens.ps1` busca los transcripts en `~/.claude/projects` aunque la sesión use otra carpeta de configuración → deuda técnica del roadmap.

## 6. Adendas
