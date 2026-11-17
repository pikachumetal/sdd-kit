---
id: 20260927-182418-feature-0092-usage-guide
feature: 0092
title: Walkthrough — Guía de uso del kit para los devs del equipo
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-27
---

# Walkthrough — Guía de uso del kit para los devs del equipo

## 1. Cambios realizados

- **Guía de uso** (`9bf7def`, `0410928` y el commit de cierre): `.docs/workflow/usage-guide.md`, siete secciones para el dev de un proyecto con el kit instalado (la idea en una página, un día normal, qué contestar al agente, validar y diferir, trabajo en paralelo, cierre y ticket, problemas típicos). Responde las doce confusiones de los tickets de campo del 2026-09-27 que tabula la spec, con cada regla contrastada con `skills/`. Pasada de humanizer registrada en `tasks.md`.
- **Test** (`9bf7def`, `3714291` y el commit de cierre): `tests/WorkflowDocs.Tests.ps1` vigila la guía, compara el marcador como igual o posterior a `plugin.json` (`Test-MarkerCurrent`), retira `sdd-(start|end)-task`, comprueba que los enlaces relativos de los cuatro documentos resuelven (`Get-BrokenRelativeLink`) y que el README enlaza la guía.
- **Greenfield, brownfield y anexo al día con la 2.0.0** (`d118b23` y el commit de cierre): fuera los subagentes por defecto, los tests RED commiteados antes de despachar, la release con inventario y triaje, el historial de capacidades y el gate del plan fuera de `pair`; entran `using-sdd`, los perfiles, Native por defecto, `sdd-roadmap` para el feedback, la release como corte y el diferido. Marcadores a v2.0.0.
- **README, `CLAUDE.md` y `tech-stack.md`** (`3714291`): la guía como punto de entrada, el plan sin parada en `delegate`, catorce skills, y el marcador igual o posterior.
- **Roadmap**: la fila 0092 y el alcance congelado los escribió el dev-lead en `develop` (`3d81a55`); el merge de sincronización `3199942` se quedó con su versión.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 4 h
- Esfuerzo real: 0,6 h — reloj del hilo aproximado con las marcas de los commits: apertura a las 20:27 y pasada de fix a las 20:52 (hora local), más ~10 min de suite completa y validación. Spec y plan, ~0,4 h aparte.
- Desviación: −3,4 h (−85 %)
- Causa de la desviación: la estimación supuso un ritmo de redacción humano para ~300 líneas de guía y el contraste con diez skills. El hilo ya tenía las skills y los tickets leídos del brainstorming, y escribió la guía de una pasada; la revisión final (5 min) encontró los matices que faltaban.
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 31.121.679 — claude-opus-5-5 31.121.679
- Tokens de subagentes: 3.162.347 en 1 despacho — Revisión final de la rama 0092 claude-opus-5-5 3.162.347 / 5 min
- Coste de la sesión: 13,45 $ (hilo 11,27 $ + subagentes 2,18 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La Task 1 se abrió dos veces: la primera paró en el freno «fila cambiada en la base» y, tras el merge de sincronización, volvió a arrancar sobre `3199942`.
- La decisión 10 de la spec (añadir la fila al roadmap) quedó sin efecto por enmienda aprobada: la fila ya la había escrito el dev-lead.
- El test de existencia pasó de una lista a mano a `It 'existe <_>' -ForEach $AllDocs` en la pasada de fix.

### Decisiones tomadas sin el dev-lead

- La lista de obsoletos del test usa la regex `sdd-(start|end)-task` en vez del literal `sdd-start-task` — el guard de `FeatureRename.Tests.ps1` prohíbe el literal fuera de su lista y el pre-commit rechazó el commit; la regex detecta lo mismo y además `sdd-end-task` — coste si está mal: ninguno.
- Los Minor 1 a 11 de la revisión final se reclasificaron a Important y entraron en la pasada de fix — la lente de la spec hace Important toda regla mal contada o sin respaldo en `skills/`, y el 11 incumplía «sin duplicación» del Art. X — coste si está mal: ~25 líneas de docs de más.
- El pie de la guía, que habla a quien mantiene el kit, se queda — coherencia con greenfield y brownfield — coste si está mal: una frase.
- `base: conflicto en` sigue tratado en la guía como «relanza una vez», igual que `merge-recipe.md` — es un hueco de la skill, y la spec deja fuera arreglar skills; va a deuda — coste si está mal: un dev relanza un merge que no se arregla así.
- Deferred minor de la revisión final: la fila de la Task 4 de `tasks.md` sin completar; se completó en la pasada de fix.

## 4. Verificación

### 4.1 Builds

- Sin build (documentación y Pester).
- Suite completa: `Invoke-Pester -Path tests` desde la herramienta PowerShell → 983 pasados, 0 fallos, 10 saltados · 295 s, sobre la pasada de fix. Antes de la pasada de fix, sobre `0410928`: 980/0, 298 s.
- Revisión final: `sdd-kit:effort-high` + opus sobre `6036e51..0410928`, «With fixes» (1 Important, 13 Minor); pasada de fix en el commit de cierre, sin re-revisión (Native: la verifica la propia pasada, y `HEAD` no avanzó desde ella).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-27 · «Diferir: lo pruebo en el smoke del corte de la 2.0.0, a cargo del dev-lead» · disparador: el smoke del corte de la 2.0.0, a cargo del dev-lead

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| C1 — marcador igual o posterior | ejecución real | En una copia fuera del repo: con `plugin.json` en 2.0.1 fallan los tres documentos; con greenfield en v1.0.0 falla solo greenfield; la copia intacta pasa 20/20 |
| C2 — guía vigilada | ejecución real | Sin la guía falla `existe usage-guide.md`; con «sdd-start-task» añadido falla «no nombra artefactos que el kit ya no produce» |
| C3 — enlaces y README | ejecución real | `[x](brownfeld.md)` falla nombrando `brownfeld.md`; el README sin el enlace falla |
| C4 — siete secciones y enlaces a los tres documentos | suite | «tiene las siete secciones numeradas en orden» y «enlaza los otros tres documentos»; las cinco anclas, comprobadas por el revisor final con el slug de GitHub |
| C5 — confusiones respondidas | ejecución real | Leída fila a fila contra su sección y contrastada por el revisor final con `skills/`; su Important (delegación en `pair`) quedó arreglado en la pasada de fix |
| C6 — greenfield y brownfield sin la 1.1.0 | ejecución real | La búsqueda de las siete frases dio 5 coincidencias antes (`tasks.md`) y 0 después |
| C7 — humanizer | ejecución real | Pasada con `humanizer:humanizer` 3.0.0, seis cambios registrados en `tasks.md` |

### 4.3 Residuales / deuda generada

- `Get-BrokenRelativeLink` comprueba el fichero, no el ancla `#…`: fila de deuda en el roadmap.
- `merge-recipe.md` trata `base: conflicto en` como «relanza una vez»: fila de deuda en el roadmap.
- El resto del README de salida (Estado, la fila de `sdd-start-feature` con «gate de aprobación en cada paso») sigue siendo el punto 5 del corte de la 2.0.0.

## 5. Aprendizajes

- Un test que lista nombres retirados choca con `FeatureRename.Tests.ps1`, que prohíbe el literal viejo en cualquier fichero fuera de su lista: la lista se escribe como regex que no casa consigo misma (`sdd-(start|end)-task`) → `tech-stack.md`, «CI local».
- El marcador de `.docs/workflow/` vale si es igual o posterior a `plugin.json`, porque los documentos se revisan antes del corte → `tech-stack.md`, «Vigencia de `.docs/workflow/`» (hecho en `3714291`).
- Revisión de skills: este trabajo no reveló un patrón para una skill nueva ni desmintió lo que dice ninguna; los dos huecos que vio el revisor (anclas, `base:`) van a deuda.

## 6. Adendas
