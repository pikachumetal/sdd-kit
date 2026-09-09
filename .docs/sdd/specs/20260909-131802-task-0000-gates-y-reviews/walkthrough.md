---
id: 20260909-131802-task-0000-gates-y-reviews
task: 0000
title: Walkthrough — Gates y reviews proporcionales (T11)
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-09
---

# Walkthrough — Gates y reviews proporcionales (T11)

## 1. Cambios realizados

- **Plantillas** (`7ab1457`): `plan-template` abre con «Decisiones que he tomado yo» y exige el artículo de calidad de código en Restricciones globales; `spec-template` pide el nivel de review como primera decisión y la subsección de hallazgos; `walkthrough-template` registra la review de spec (§2) y la validación del dev-lead (§4.2).
- **`sdd-start-task/references/review-spec.md`** (`8d71997`): rúbrica de ocho señales (la octava, «reglas de visibilidad o permiso», de [research.md](research.md) §4.1) y tres niveles; encargo del revisor por lente con la pregunta del complemento; incorporación de hallazgos antes del gate.
- **`sdd-start-task/references/encargo-revision.md`** (`b1b4c4d`): cabecera obligatoria de todo encargo de revisión con el bloque de Restricciones globales como primera sección.
- **`sdd-start-task/SKILL.md`** (`b1b4c4d`): paso 4 enlaza la rúbrica; paso 6 remite a la cabecera; paso 7 nuevo ⛔ Validación del trabajo (con la definición de validar); cierre renumerado a 8; dos red flags y dos racionalizaciones. **`sdd-end-task/SKILL.md`**: el pre-check no arranca sin validación del usuario.
- **Evidencia**: `tests/gates-reviews-red.md` (`fea3262`, `bc29b48`) y `tests/gates-reviews-green.md`. **Docs**: glosario en `mission.md`, método en `tech-stack.md` (`7ed59ae`); `research.md` del dev-lead en esta carpeta; T12 y T13 en el roadmap.
- **Cierre**: `funcional/flujo-de-task.md` con seis `ADDED`, changelog, roadmap, log regenerado.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2 h (rango 1,5–3)
- Esfuerzo real: **~1,8 h** (aproximado: plan aprobado 14:10 UTC, último commit de evidencia 15:50 UTC, cierre ~16:05 UTC; 21 sujetos headless, ~25 $, tres iteraciones del paso 6 y dos del paso 7). Spec + plan: ~0,85 h (carpeta 13:18 UTC → plan 14:10 UTC, con la decisión 9 añadida en el gate).
- Desviación: −0,2 h (−10 %)
- Causa de la desviación: no obligatoria. Lo que la mantuvo cerca del estimado fue lo imprevisto: dos guidances necesitaron más de una redacción (validación: 0/2 → 2/2; restricciones al revisor final: 0/3 en prosa → 3/3 con artefacto) y E5 se repitió tres veces por una fixture que telegrafiaba y por el camino de pregunta de `brainstorming`.
- Review de spec: no · hallazgos 0 (la spec de T11 se escribió antes de que existiera la rúbrica; la primera spec con review será la de T12)

## 3. Desviaciones del plan

- **Paso 4 reducido a un enlace** (plan: rúbrica y despacho en prosa): E1b demostró que con `review-spec.md` legible el baseline propone, despacha e incorpora la review solo. Art. I.
- **Paso 5 sin cambios** (plan: presentar el plan por sus decisiones): E2 lo hace por la plantilla.
- **Paso 6 en tres iteraciones**: destinatarios nombrados (2/5), acción concreta con red flag (2/3), cabecera de encargo como artefacto (3/3). El plan preveía una frase.
- **Paso 7 en dos redacciones**: la primera («espera la validación explícita») dejó 0/2 y un walkthrough con una validación inventada; la segunda define validar y nombra la racionalización «pedir cerrar no es validar».
- **Decisión 10 añadida a mitad de task** (señal de visibilidad, propuesta del dev-lead con `research.md`): su RED no falla en la fixture (3/3 declaran o preguntan el complemento en forma mínima); se conserva como criterio de la rúbrica por la evidencia externa de SifAcademy. **Excepción al Art. I, argumentada**: no es guidance de conducta sino una entrada de la clasificación, y el GREEN mide que con ella el revisor exige el complemento completo (8 hallazgos).
- **`--add-dir` descubierto en E1**: sin él, el sujeto headless no lee los `references/` del plugin ni ejecuta sus scripts. E1 se repitió; el método queda corregido en `tech-stack.md`.
- **Fixture `e4` con tres incoherencias** que el pre-check de `sdd-end-task` detectó (decisión de spec no implementada, «5/5» siendo 3/3, hash inventado): se corrigió y E4 se repitió como E4b.
- **Validación del dev-lead**: dada en la conversación tras la presentación del gate («validado, cierra T11»), sin detalle de qué probó. Se registra tal cual.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → **Passed: 136, Failed: 0, Skipped: 5** en cada commit (hook).

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-09 · en la conversación, tras la presentación del gate de validación (primer uso del paso 7); validó sobre lo presentado y reportado por el agente, sin detallar qué probó.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Escenario «La spec propone su propio nivel de review por complejidad» | ✅ verificado: E1b RED (con `--add-dir`) y E1a/E1b GREEN 2/2 proponen nivel con señales; E5c propone un revisor con la señal nueva |
| 2 | Escenario «La review adversarial tensa la spec antes del gate» | ✅ verificado: 4/4 runs con review despachan por lente e incorporan hallazgos como aceptado/rechazado (E1b RED: 9+2; E1a/E1b GREEN; E5c: 8) |
| 3 | Escenario «El plan presenta primero las decisiones» | ✅ verificado: E2 RED y GREEN 2/2 por la plantilla; Art. V copiado literal |
| 4 | Escenario «El artículo de calidad de código viaja a implementadores y revisores» | ✅ verificado con `stream-json`: RED 1/5 → GREEN E3 2/5 → E3c 2/3 → **E3d 3/3** con `encargo-revision.md` |
| 5 | Escenario «El trabajo se valida con el usuario antes de cerrar» | ✅ verificado: RED E4/E4b cierran sin pedir validación (E4b entera, con merge al final); GREEN E4a/E4b 0/2 con la primera redacción (una validación inventada); **E4c/E4d 2/2** paran, presentan y esperan, a 0,25 $ frente a 0,7–1,1 $ |
| 6 | Escenario «La review de dominio pregunta por el complemento de visibilidad» | ✅ verificado con matiz: baseline 3/3 lo plantea en forma mínima; con la señal, revisor y complemento completo (E5c) |
| 7 | Escenario «El walkthrough registra la review de spec» | ✅ este walkthrough lleva la línea (§2) y la de validación (§4.2) |
| 8 | Smoke del método: despacho de subagentes y `stream-json` con `input.prompt` | ✅ verificado antes de E3 |

### 4.3 Residuales / deuda generada

Ninguna. Lo descubierto va a tasks abiertas antes de cerrar la release: **T12** (review reforzada opt-in, `research.md` §4.3, condicionada a RED con bug plantado) y **T13** (disparo de las skills: `description` como disparador medido en headless, regla en el `CLAUDE.md` del proyecto vía `init-*`, y Gate 1 con dos vías explícitas: invocación sola → contexto y parar; con enunciado → contexto y seguir).

## 5. Aprendizajes

- **Cuarta y quinta vez que el artefacto vence a la prosa**: la review de spec la hace el baseline con `review-spec.md` legible (E1b), y el bloque de restricciones solo llegó al revisor final cuando fue una cabecera de encargo (E3d) tras dos redacciones en prosa. → `tech-stack.md` (§Tests): antes de escribir un paso, escribir el artefacto que lo hace innecesario.
- **Una guidance de disciplina necesita definir el término**: «espera la validación» no bastó porque «cierra la tarea» se leyó como validación; definir validar («que el usuario diga qué probó») y nombrar la racionalización lo llevó de 0/2 a 2/2. → Art. II ya lo dice (prohibición + racionalizaciones); anotado como ejemplo en `tech-stack.md`.
- **`--add-dir` es parte del método headless**; sin él el sujeto no lee `references/` ni ejecuta scripts del plugin. → `tech-stack.md`.
- **`stream-json` hace observable el traspaso**: por primera vez se vio a qué encargos llega un bloque. → `tech-stack.md`.
- **Una fixture que telegrafía invalida el baseline** (E5 con el artículo de la constitution) y **el camino de pregunta de `brainstorming` puede impedir que el sujeto llegue al artefacto medido** (E5b): la petición debe cerrar las dudas de alcance por adelantado. → `tech-stack.md`.
- **Un gate bien escrito cuesta menos que saltárselo**: parar a pedir validación, 0,25 $; cerrar sin ella, 0,7–1,1 $. → `estimation.md`.
