---
id: 20260907-151234-task-0000-alineacion-superpowers
task: 0000
title: Alineación del kit con superpowers 6.3.0
mode: full
status: approved
created: 2026-09-07
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-07
---

# Spec — Alineación del kit con superpowers 6.3.0

## 1. Contexto

- **Problema u oportunidad**: superpowers ha cambiado desde que se escribieron las skills del kit y el kit no lo ha absorbido. Estado confirmado el 2026-09-07 (superpowers 6.3.0 instalado, `RELEASE-NOTES.md`):
  - `brainstorming` 6.3.0 clasifica cada petición en tres vías —**spike / bounded / architectural**— y obliga a anunciarla antes de la primera pregunta. `bounded` prescribe "no spec file, no implementation plan document"; `spike` termina en una recomendación, no en código. El kit tiene una fila de override ("la clasificación no gobierna los artefactos del kit") que el roadmap registra como **escrita pero no probada**, y ningún carril para spikes.
  - `writing-plans` exige en la cabecera del plan un puntero `Spec:` (la plantilla del kit ya lo tiene) y un bloque **Global Constraints** (restricciones de la spec copiadas literalmente para que lleguen a cada task). La plantilla del kit no lo tiene; su Phase -1 "constitution check" cubre solo una parte.
  - En superpowers "SDD" significa *Subagent-Driven Development* (`.superpowers/sdd/`, ledger, `task-brief`). En el kit significa *Spec-Driven Development*. Las dos siglas conviven en la misma sesión.
  - El kit no declara contra qué versión de superpowers está validado, ni tiene mecanismo para revisar la compatibilidad en cada release.
  - Estado del arte (fuente web, 2026-09-07): OpenSpec v1.11.0 (brownfield-first, delta specs, `verify`), Spec Kit v0.8.7. Ninguno estandariza el layout; convergen conceptos (delta, escenarios verificables, verify, archive). El kit no vigila estas referencias de forma sistemática.
  - Tamaño: superpowers **no** acorta skills (`brainstorming` 2324 palabras, `subagent-driven-development` 4823); mantiene pequeño lo que se carga siempre (`using-superpowers`, 485) y parte el resto en `SKILL.md` + auxiliares leídos en el punto de uso. Cambia la lectura del ítem 2 del roadmap ("<500 palabras").
- **Stakeholders**: el dev-lead que mantiene el kit; los devs que lo usan en proyectos del equipo (Alybo, ai-hackathon) y que hoy ya tienen instalado superpowers 6.3.0.
- **Restricciones conocidas**: compatibilidad con los proyectos que ya usan el kit (sin cambios de naming ni de carpetas); Art. I para toda guidance; Art. IV (ninguna convención cambia); distribución local-only (sin remoto).

## 2. Objetivo

- **Qué construimos (one-liner)**: que el kit enrute las vías de `brainstorming` 6.3.0 a sus carriles sin perder la `spec.md`, absorba el spike en `sdd-consult`, propague las restricciones de la spec al plan, y declare y vigile la versión de superpowers contra la que está validado.
- **Definición de éxito**:
  1. Con superpowers 6.3.0 real, una feature pequeña que `brainstorming` clasifica `bounded` termina con `spec.md` y su gate de aprobación (modo lite o full), demostrado con ciclo RED→GREEN en `tests/`.
  2. Una petición spike ("¿se puede X? pruébalo rápido") se resuelve en `sdd-consult` sin carpeta, rama ni código conservado, y `sdd-start-task` la enruta allí.
  3. Un `plan.md` escrito desde una spec con restricciones globales las lleva en un bloque propio que llega a las tasks.
  4. El README declara la versión de superpowers validada y la constitution obliga a revisarla en cada release del kit.
  5. El roadmap registra el alcance de v0.6.0 (T1 alineación, T2 progressive disclosure, T3 workflow y ejecución) y v0.7.0 (worktrees, brownfield + `funcional.md`), las referencias de vigilancia y la relectura del ítem 2.
- **NO objetivos**: reestructurar skills largas (T2); T3 — ejecución por defecto con `subagent-driven-development` y política de modelos forzada por el kit (campo `Modelo` por task en el plan, aprobado con el plan; el más barato que resuelve bien; nunca `fable` ni `opus xhigh` por defecto — hoy esa política vive solo en Alybo, `.claude/CLAUDE.md:50-75`, y el kit dice lo contrario), más `test-driven-development`, `requesting-code-review` y cierre en `develop` local; entorno por worktree; `sdd-init-brownfield` con ideas de OpenSpec y `funcional.md` vivo (v0.7.0); eliminar `sdd-consult`.

## 3. Decisión clave

**Opción elegida — mapeo explícito vías → carriles, guidance condicionada al RED.**

La fila de override actual se sustituye por un mapeo que convierte la vía anunciada en entrada del enrutado del kit, en vez de competir con él:

| Vía de `brainstorming` | Carril del kit |
| --- | --- |
| `spike` | `sdd-consult` (sin artefactos) |
| `bounded` | `sdd-start-patch` si es bug determinista; **modo lite** si es feature pequeña (el predicado lite decide) |
| `architectural` | task en modo full |

Con la instrucción: "anuncia la vía de `brainstorming` y, acto seguido, el carril o modo del kit que le corresponde". En el kit toda task conserva `spec.md` y su gate en los dos modos: el diseño que superpowers presenta en chat en `bounded` es lo que el modo lite **persiste** como spec corta (secciones 1–4 + estimación + aprobación). Sin ese registro, estimación, walkthrough y changelog —el diferencial del kit frente al estado del arte— se quedan sin datos.

**Por qué no más skills**: cada skill nueva suma su `description` a la lista cargada en todas las sesiones y añade un salto de invocación que el agente puede saltarse (RED del modo lite: 2/2 omisiones de `brainstorming`). La unidad de descomposición es el fichero auxiliar dentro de la skill, no la skill (decisión que gobierna T2).

**Alternativas descartadas**:

- *Mantener la fila actual y solo re-testarla* — no dice qué hacer con la vía anunciada; queda como resultado posible si el RED no falla (Art. I).
- *Eliminar `sdd-consult` y apoyarse en el spike de `brainstorming`* — trabajos distintos: `brainstorming` solo arranca ante trabajo creativo; una pregunta de comprensión nunca entra en él. Consult nació de un RED real (v0.3.0). Descartado por el usuario.
- *`bounded` → `sdd-start-patch` siempre* — manda features pequeñas por un carril que gatea causa raíz, no diseño; superpowers `bounded` sí conserva el gate de diseño. Descartado por el usuario.
- *No invocar `brainstorming` en lite* — el paso 4 nombra la skill a propósito; el RED del lite mostró que sin esa orden se omite.

## 4. Especificación funcional

**Como** dev que arranca una task con superpowers 6.3.0, **quiero** que la vía que anuncia `brainstorming` se traduzca al carril del kit, **para** no perder la spec ni el gate por seguir la regla de superpowers.

Comportamiento esperado:

1. **Enrutado por vías** (`sdd-start-task`, paso 2 y tabla de overrides): el mapeo de la sección 3. La guidance final la fija el RED: si el baseline con 6.3.0 conserva `spec.md` al anunciar `bounded`, la fila actual se mantiene y no se añade texto.
2. **Spike en `sdd-consult`**: nuevo modo "sondear" junto a "entender" y "pensar": explorar y probar es lícito; todo lo construido se etiqueta desechable; la salida es una recomendación en la conversación; nada persiste. Racionalización a cubrir: "el spike funciona, lo dejo" → conservar el código es una petición nueva que se enruta al carril. Guidance condicionada al RED.
3. **Desambiguar SDD**: una frase en el overview de `sdd-start-task` (Spec-Driven; `subagent-driven-development` de superpowers es el modo de ejecución, no el proceso — T3 regula cuándo se usa). Candidata: se escribe solo si el RED exhibe confusión.
4. **Bloque "Restricciones globales" en `plan-template.md`**, tras Tech Stack: restricciones de la spec copiadas literalmente (versiones, límites, naming, valores exactos) más los artículos de la constitution que aplican; "ninguna" si no hay. Fallo de forma → receta (Art. II). `sdd-end-task` no lo comprueba: los planes existentes sin el bloque siguen válidos.
5. **README §Dependencias**: "validado contra superpowers 6.3.0 (2026-09-07); el mapeo de vías se re-testa en cada minor de superpowers". `tech-stack.md` no repite nada (README es la fuente única).
6. **Constitution Art. V**: cada release del kit revisa la compatibilidad con la versión instalada de superpowers y actualiza la versión validada del README.
7. **Roadmap**: alcance v0.6.0 / v0.7.0 en "Próximo"; sección "Referencias de vigilancia" (`RELEASE-NOTES.md` de superpowers, `openspec.dev/changelog`, releases de `github/spec-kit`); ítem 2 reescrito como progressive disclosure (`SKILL.md` + `references/`, borrar solo prosa muerta; el límite de palabras aplica a lo siempre cargado). La vigilancia vive solo en el kit: los proyectos consumidores no vigilan superpowers, así que `sdd-start-release` no cambia.

Edge cases:

- `brainstorming` sube la vía a mitad de task (ratchet) → coincide con "lite sube a full, nunca al revés"; sin guidance nueva.
- Proyecto consumidor con superpowers < 6.3.0 (sin vías) → el mapeo no se activa; el enrutado actual sigue funcionando.
- Spike que produce un hallazgo que merece durar → regla 4 de `sdd-consult` (salida durable propuesta y aprobada), sin `research.md`.

## 5. Datos

No aplica: Markdown y manifests, sin schema ni migraciones.

## 6. UX

No aplica. La superficie visible es el texto de las skills, la plantilla de plan y el README.

## 7. Constraints técnicos

### 7.1 Compatibilidad con la constitution

- [x] **Art. I** — las ediciones de `sdd-start-task`, `sdd-consult` y `plan-template.md` exigen RED→GREEN en `tests/`; README, constitution y roadmap no son guidance y no lo arrastran.
- [x] **Art. II** — enrutado y spike: fallo de disciplina → tabla de racionalizaciones; bloque de restricciones: fallo de forma → receta.
- [x] **Art. III** — castellano con ortografía correcta; nombres en inglés kebab-case.
- [x] **Art. IV** — ninguna convención cambia: mismo naming, mismas carpetas, bloque de plantilla opcional.
- [x] **Art. V** — sin bump aquí; changelog en `[Unreleased]`. La task añade al artículo la revisión de compatibilidad por release.
- [x] **Art. VI** — commits bilingües.
- [x] **Art. VII** — esta task es el dogfooding.
- [x] **Art. VIII** — la plantilla se edita solo en `skills/sdd-templates/templates/`.

### 7.2 Dependencias

- superpowers 6.3.0 instalado (`installed_plugins.json`), con su `brainstorming` y `writing-plans` actuales.
- Task `modo-lite` (v0.5.0): define el predicado lite y la fila de override que aquí se sustituye.
- Método de test del tech-stack: fixture desechable, skill del working tree pegada por prompt, verificación en disco, pregunta a posteriori.

### 7.3 Excepciones a la constitution

Ninguna.

## 8. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El RED no exhibe el fallo en alguno de los escenarios | Media | Bajo | Evidencia válida de que esa guidance sobra: recorta el alcance (Art. I), como en modo-lite y dependencias-declaradas |
| El agente anuncia `bounded` y obedece "no spec file" pese al mapeo | Media | Alto | Es justo lo que el GREEN debe demostrar; si persiste, la racionalización textual del baseline entra en la tabla |
| Superpowers cambia las vías en la próxima minor | Media | Medio | El README fija la versión validada y el Art. V obliga a re-testar por release |
| `sdd-start-task` crece más (hoy 1403 palabras) | Alta | Bajo | Asumido: T2 reestructura por progressive disclosure justo después |

## 9. Rollout

Directo en `master`. Entra en v0.6.0 cuando `sdd-end-release` selle `[Unreleased]`.

## 10. Open questions

Ninguna. Decisiones cerradas con el usuario el 2026-09-07: mantener `sdd-consult`; `bounded` → patch o lite según naturaleza; T2 como progressive disclosure en vez de recorte; vigilancia solo en el kit; orden v0.6.0 = T1, T2, T3.

## 11. Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-07 | aprobada |
