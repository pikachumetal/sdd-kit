---
id: 20260927-150813-feature-0091-closing-review-edges
feature: 0091
title: Walkthrough — Bordes del cierre frente a la revisión final
spec: ./spec.md
status: done
created: 2026-09-27
---

# Walkthrough — Bordes del cierre frente a la revisión final

## 1. Cambios realizados

- **`skills/sdd-end-feature/SKILL.md`**:
  - El paso 0 manda hacer el paso 9 antes de escribir nada.
  - El paso 9 compara `HEAD` con el último commit revisado. Ese commit es el segundo sha de la `Re-revisión:` más reciente; si no hay, el de `Pasada de fix:`; si no hay, el `sobre` de `Revisión final:`.
  - Si `HEAD` avanzó con commits que no se revisan en el hilo, despacha la re-revisión del tramo antes del walkthrough. El paso lleva copiadas las condiciones de «revisado en el hilo» (`9e71ea6`, `ee4f0dc`).
- **`skills/sdd-start-feature/SKILL.md`**:
  - El paso 6 apunta `Pasada de fix: <sha corto>, <n> hallazgos RED→GREEN` y cuenta el tramo desde el último revisado.
  - En el paso 7, la pasada de fix de la propia revisión final no abre re-revisión; un commit posterior sí, desde la pasada.
- **`skills/sdd-start-feature/references/control-profiles.md`**: «Ruling» recoge la misma excepción.
- **Tests**: `tests/PostFinalReview.Tests.ps1` gana 6 anclas, más la que vigila que no vuelva el literal `<revisión final>..HEAD`. La evidencia está en `tests/closing-review-edges-red.md` y `-green.md`, y el molde en `red/subject.sh`.
- **Capacidades**: se fusionan `feature-flow` («El cierre no repite la revisión final de Native» y «Un commit del hilo posterior a la revisión final se revisa antes de la validación») y `control-profiles` («Salir del plan es un ruling visible»).
- **Aprendizaje**: va a `tech-stack.md`, en «Sujetos headless».

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (de la spec): 2h
- Esfuerzo real: 1,6h. Es el reloj del hilo, aproximado con las marcas de los commits: apertura a las 17:09 y pasada de fix a las 18:33, más ~15 min de cierre. La spec llevó ~0,3 h aparte.
- Desviación: -0,4h (-20%)
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 23.513.095 — claude-opus-5-5 23.513.095. Se midieron con `-ProjectsRoot "$env:CLAUDE_CONFIG_DIR\projects"`: sin él, «no medido», porque el patch 0090 aún no está en `develop`.
- Tokens de subagentes: 1.645.906 en 1 despacho — Revisión final feature 0091 claude-opus-5-5 1.645.906 / 3 min
- Coste de la sesión: 10,17 $ (hilo 8,99 $ + subagentes 1,19 $)
- Coste de sujetos: 19,18 $ en 23 sujetos Sonnet — RED 9,99 $ (10); GREEN 7,67 $ (10); controles tras la pasada de fix 1,52 $ (3). Un primer GREEN de 10 sujetos, que no terminó ninguno, queda sin medir.
- Review de spec: no (modo lite)

## 3. Desviaciones del plan

- **La pieza (3), el revisor final en lite, se recortó.** Es una enmienda de la spec aprobada por el dev-lead. El RED no reprodujo el fallo: 3 de 3 sujetos válidos despachan el revisor final antes de la validación, y lo sacan del propio `SKILL.md`.
- **`NativeAdapt.Tests.ps1` no cambió**: sus anclas siguen en el texto nuevo. La decisión 8 de la spec decía lo contrario y se corrigió.

### Decisiones tomadas sin el dev-lead

- **`l2` ×2 en el RED**, antes de proponer el recorte: el sujeto implementa y sigue solo, que es la condición de la 0086. Así la propuesta de recorte no se apoyaba en un escenario que apuntaba al paso 7. Coste si está mal: 2,18 $.
- **El GREEN se relanzó en dos tandas de 5** después de que 10 sujetos a la vez agotaran los procesos de la máquina. Coste si está mal: ninguno. El intento perdido no queda medido.
- **Se metieron 3 Minor de la revisión final en la pasada de fix** (el segundo sha de la `Re-revisión:`, dónde se apunta sin `tasks.md` y la alternativa de lite en «Ruling»), en vez de diferirlos. Son texto de la misma regla, y diferirlos dejaba deuda antes del corte. Coste si está mal: ninguno, porque 3 sujetos de control dieron 3/3.
- **No se itera el «lo dice al presentar» de `r1` (1/2).** La conducta que cuesta un revisor Opus, no despacharlo, sale 2/2. Coste si está mal: un agente que no avisa de que no re-revisa, sin coste de revisores.
- **La pasada de fix de esta feature no abrió re-revisión**, por su propia regla: la verificó su TDD (el Pester del literal viejo, RED→GREEN) y no hubo commits posteriores.

## 4. Verificación

### 4.1 Builds

- Suite completa (`Invoke-Pester -Path tests`, `Slow` incluidos) sobre el working tree de `9e71ea6`: 957 tests pasados y 0 fallos · 323 s. La pasada de fix posterior solo cambió texto de skills y una prueba Pester.
- Pre-commit (conjunto rápido de Pester) en `ee4f0dc`: 728 tests pasados y 0 fallos, ~28 s.
- `Test-Capabilities.ps1 -Artifact spec.md` tras fusionar: «Capacidades válidas: 14».

### 4.2 Smoke / tests

- Validación diferida: 2026-09-27 · «Diferir al corte 2.0.0» («Validación diferida al smoke del corte de la 2.0.0, a cargo del dev-lead») · disparador: el smoke del corte de la 2.0.0, a cargo del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Cierre sin commits posteriores: no re-revisa | ejecución real | e0 2/2 |
| Cierre con commit en `src/`: re-revisión del tramo antes del walkthrough, y la línea `Re-revisión:` | ejecución real | e1 de 0/2 a 2/2, y control tras la pasada 1/1 |
| El último revisado sigue el orden `Re-revisión:` → `Pasada de fix:` → `sobre` | ejecución real (tramo desde la pasada) · suite (segundo sha) | r2 2/2 + 1/1 |
| Sin `Revisión final:`, `requesting-code-review` | suite | ancla de `NativeAdapt.Tests.ps1` |
| Re-revisión antes de presentar, y el THEN de la validación ya presentada (0085) | ejecución real (p1) · no probado (p2, texto sin tocar) | p1 1/1 + 1/1 |
| Tramo con solo commits de docs de menos de 20 líneas: sin revisor | no probado en esta feature | medido en la 0085 (s1, s3) |
| La pasada de fix no abre re-revisión y lo dice | ejecución real | no despacha 2/2; **lo dice 1/2 (parcial)** |
| Un commit posterior a la pasada sí, sobre `<pasada>..HEAD` | ejecución real | r2 2/2 + 1/1 |
| «Ruling»: la pasada no entra en la re-revisión del tramo | suite | Pester `PostFinalReview` |

### 4.3 Residuales / deuda generada

- `run.sh` no limita cuántos sujetos corren a la vez → fila de «Deuda técnica» del roadmap (patch, 2.0.1), a partir del [ticket de la feature](../../field-reports/20260927-164130-feature-0091-closing-review-edges.md) §1.

- El «lo dice al presentar» de la pasada de fix queda en 1/2. No se abre fila: no cuesta revisores.
- Una re-revisión que vuelve con Important abre, con su fix, otra re-revisión: no tiene la excepción de la pasada de la revisión final. Lo apuntó la revisión final en «Declined to judge». Es una conducta de la 0085 que esta spec no toca, y no se abre fila.
- `capabilities/control-profiles.md`, en «Salir del plan es un ruling visible», conserva `<revisión final>..HEAD` en su THEN, tal como lo copió la spec. La viñeta nueva de la pasada lo precisa.

## 5. Aprendizajes

- Más de 5 sujetos headless a la vez agotan los procesos de Windows (`fork: Resource temporarily unavailable`), no termina ninguno y la sesión del hilo se cae. → `tech-stack.md`, «Sujetos headless».
- Un RED limpio en un escenario que apunta al paso que ya contiene la conducta no basta para recortar: antes se lanza el escenario con la condición del campo (`l2`). → ya lo cubre el Art. I («antes de recortar… se mira de dónde sacó cada sujeto la conducta»); no se duplica.

## 6. Adendas

- _Ninguna._
