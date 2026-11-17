---
id: 20260929-133151-feature-0096-closing-off-critical-path
feature: 0096
title: Walkthrough — El cierre fuera del camino crítico
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-29
---

# Walkthrough — El cierre fuera del camino crítico

## 1. Cambios realizados

- **Revisor final en segundo plano y aislado** (`65804fa`): el paso 6 de `sdd-start-feature` despacha el revisor final en cuanto existe el commit de la última task, antes de arrancar la aplicación para la verificación visual. Lo ancla en un worktree desanclado `review-<id>-<sha corto>`, y el paso 7 presenta la validación cuando vuelve. La receta y la frase del encargo están en «Revisor final» de `encargo-revision.md`, también para la re-revisión de un tramo. Las filas de `executing-plans` y `subagent-driven-development` de `overrides-superpowers.md` dicen que la revisión no espera a la verificación visual.
- **Borradores de cierre mientras revisa** (`5347902`): el paso 7 escribe, sin commitear, `walkthrough.md` sin la verificación ni el tiempo, el delta fusionado en `capabilities/` y la entrada del changelog; el paso 0 de `sdd-end-feature` parte de ellos.
- **Todo sha de `tasks.md` alcanzable** (`c0255d0`): antes de juntar el cierre, las líneas `Pasada de fix:`, `Re-revisión:` y `Revisión final:` del tramo se reescriben como «juntada en el cierre», y el último revisado pasa a ser el commit de cierre en sus tres definiciones (paso 7 de `sdd-start-feature`, paso 9 de `sdd-end-feature`, `control-profiles.md`) y en `commit-milestones.md`.
- **Pasada de fix de la revisión final** (juntada en el cierre): un commit del hilo sin task abierta va a la re-revisión del tramo si la revisión final ya salió, en el paso 6, `control-profiles.md` y `overrides-superpowers.md`.
- **Evidencia**: RED (`c9c4ff9`) y GREEN (`3a9b503`), más el escenario c4 de la pasada de fix, con 17 sujetos; tests de literales en `tests/ClosingOffCriticalPath.Tests.ps1`.
- **Roadmap**: la 0096 se partió y el revisor proporcional pasó a la 0108; dos filas de deuda nuevas (los shas que cita el walkthrough y el borrador commiteado mientras revisa).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,7h — reloj del hilo por las marcas de los commits (apertura 15:36, último commit 17:10), sin contar spec y plan (~0,5h, 15:05-15:36, aproximado)
- Desviación: -2,3h (-58 %)
- Causa de la desviación: los sujetos salieron más baratos y rápidos que la previsión (≈0,55 $ y ≈6 min de media, frente a ~2 $ y 15 min), y los moldes se reutilizaron de la 0091 y la 0099 casi sin cambios
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y ejecución)
- Tokens del hilo: 43.881.549 — claude-opus-5-5 43.881.549
- Tokens de subagentes: 3.419.003 en 1 despacho — Revisor final 0096 claude-opus-5-5 3.419.003 / 8 min
- Coste de la sesión: 16,83 $ (hilo 14,78 $ + subagentes 2,05 $)
- Coste de sujetos: 9,39 $ en 17 sujetos Sonnet — RED 5,19 $ (c1-c3 4,10 $, c4 1,09 $); GREEN 4,20 $ (c1-c3 3,82 $, c4 0,38 $)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Enmienda 1, aprobada por el dev-lead (2026-09-29)**: se retiró la guía de «cambiado después de tu prueba». El RED c2 pasó 2/2, porque el paso 1 de `sdd-end-feature` ya separa lo verificado por el agente de lo reportado por el usuario. La Task 3 se quedó solo con los borradores.
- **Enmienda 2, aprobada por el dev-lead (2026-09-29)**, por el Important de la revisión final: un commit del hilo hecho mientras revisa el revisor, seguido de una pasada de fix, podía quedar sin revisar. Se midió con c4 (techo subido de 15 a 17 sujetos, también por el dev-lead). El RED salió limpio 2/2 con la petición realista, así que la cadena del último revisado no lleva excepción; solo se corrigieron las tres frases que mandaban ese commit a «la revisión final».

### Decisiones tomadas sin el dev-lead

- c2 relanzado con `clean-review.mjs` (un hook que devuelve un veredicto limpio) tras un primer sujeto descartado, que paró antes de lo medido por no tener revisor — coste si está mal: 0,42 $.
- La enmienda y el registro de la Task 1 fueron en el commit de la Task 2, el hito siguiente — coste si está mal: ninguno.
- El RED de la Task 4 se vio fallar después de editar, contra los ficheros de la base `5347902` extraídos con `git show` (5/5 fallan), con la copia del test intacta — coste si está mal: ninguno.
- Sin REFACTOR por el borrador que un sujeto del GREEN commiteó con `git add .docs/sdd/specs` (1/2); fila de deuda con «Esperar 2.º caso» — coste si está mal: un borrador en la rama antes de validar.
- Sin excepción en la cadena del último revisado para el Important de la revisión final: RED c4 limpio 2/2 — coste si está mal: un commit sin revisar si un agente sigue la cadena al pie de la letra.
- `PostFinalReview.Tests.ps1` (l. 35) pasa al literal nuevo, porque fijaba la frase que el revisor marcó como falsa — coste si está mal: ninguno.
- Minors diferidos de la revisión final: en el paso 6, «con el `HEAD` que revisó» debería ser «el sha en que se ancló su worktree»; falta la forma reescrita de `Revisión final:` en el paso 10 y en `commit-milestones.md`; no se dice cómo encontrar el commit de cierre si se retoma en otra sesión; la fila 0096 del roadmap prometía «cambiado después de tu prueba» (anotado al cerrarla).

## 4. Verificación

### 4.1 Builds

- Suite completa: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → 1076 correctos, 0 fallos, 10 omitidos · 387 s (sobre la pasada de fix; sobre `3a9b503`, 1073 correctos en 407 s)
- Revisión final: `sdd-kit:effort-high` + `opus`, en el worktree desanclado `review-0096-3a9b5036` y en segundo plano mientras se escribían estos borradores. With fixes: 0 Critical, 1 Important, 5 Minor. Pasada de fix con su test RED→GREEN (3 fallos contra `3a9b503`), sin re-revisión.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-29 · «Diferir a la próxima feature» · disparador: el cierre de la próxima feature Native de un proyecto del equipo, a cargo del dev-lead

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| El revisor final sale antes de arrancar la aplicación | ejecución real (GREEN c1 2/2; esta feature) | ✅ |
| Borradores de cierre mientras revisa, sin commitear | ejecución real (GREEN c1 2/2; esta feature) | ✅, 1 de 2 sujetos commiteó el walkthrough (deuda) |
| La validación se presenta cuando vuelve el revisor | ejecución real (esta feature) | ✅ |
| En SDD, el disparador es el commit juntado de la última task | no probado: solo se midió Native | — |
| Worktree desanclado, frase del encargo y `git worktree remove` | ejecución real (GREEN c1, c2, c4; esta feature) | ✅ |
| El informe no cita commits posteriores | no probado: sin commits durante la revisión en esta feature, y el despacho estaba denegado en c1 | — |
| La re-revisión se ancla en el último sha del tramo | ejecución real (GREEN c2 2/2) | ✅ |
| Lo cambiado tras la validación se separa de lo validado | ejecución real (GREEN c2 2/2) | ✅ |
| El último revisado cubre «juntada en el cierre» | suite (`ClosingOffCriticalPath.Tests.ps1`) | ✅ |
| La pasada de fix exime solo sus propios commits | ejecución real (GREEN c4 1/1) | ✅ |
| Todo sha de `tasks.md` alcanzable tras el cierre | ejecución real (GREEN c3 2/2; esta feature) | ✅ |

### 4.3 Residuales / deuda generada

- El walkthrough cita shas del tramo que el cierre junta (RED c2) → fila de deuda, «Esperar 2.º caso».
- Un commit del hilo mientras revisa arrastra los borradores (GREEN c1-1) → fila de deuda, «Esperar 2.º caso».
- Suite de más de 6 min (387 s), por debajo del umbral de 10 min.

## 5. Aprendizajes

- Un hook que deniega `Agent` hace parar al sujeto cuando el paso siguiente depende del veredicto: para medir lo que viene después de una revisión hace falta un hook que devuelva un veredicto (`clean-review.mjs`) → `tech-stack.md` («Sujetos headless»), volcado.
- `git worktree add` de este repo en el scratchpad falla con «Filename too long»: las rutas de los moldes versionados pasan del límite de Windows. Para ver una base, `git show <sha>:<ruta>` de los ficheros que hacen falta, o `-c core.longpaths=true` → `tech-stack.md` («Sujetos headless»), volcado.

## 6. Adendas
