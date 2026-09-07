---
id: 20260907-151234-task-0000-alineacion-superpowers
task: 0000
title: Walkthrough — Alineación del kit con superpowers 6.3.0
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-07
---

# Walkthrough — Alineación del kit con superpowers 6.3.0

## 1. Cambios realizados

| Área | Ficheros | Commit |
| --- | --- | --- |
| Artefactos SDD | `spec.md`, roadmap (alcance v0.6.0) | `75ec3be` |
| Apertura de la release (fuera de la task, pero provocada por ella) | `roadmap.md` — sección Release v0.6.0 | `cf47e8c` |
| Plan, registro vivo, T5 fusionada | `plan.md`, `tasks.md`, `roadmap.md` | `86ae6d1` |
| Docs del kit | `README.md` (versión validada), `constitution.md` (Art. V), `roadmap.md` (Referencias de vigilancia) | `928aad2` |
| Evidencia RED | `tests/sdd-start-task-vias-red.md`, `tests/sdd-consult-spike-red.md`, `tests/plan-template-restricciones-red.md` | `14bab87` |
| Guidance | `skills/sdd-start-task/SKILL.md` (4ª salida del enrutado, override acotado, racionalización), `skills/sdd-consult/SKILL.md` (modo sondear, racionalización), `skills/sdd-templates/templates/plan-template.md` (bloque Restricciones globales) | `f8e07f7` |
| Evidencia GREEN | los tres `tests/*-green.md` | `082038d` |

En sustancia: el kit declara y vigila la versión de superpowers validada; el spike tiene carril (`sdd-start-task` lo enruta, `sdd-consult` lo sondea sin artefactos); el plan lleva las restricciones de la spec copiadas literalmente. Lo que el RED no respaldó **no se escribió**: ni el mapeo completo de vías ni la frase de desambiguación de "SDD". Diff total de guidance: 11 líneas en 3 ficheros.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Esfuerzo spec + plan: estimado 1,5 h · real ~1,5 h (aprox.; incluye la consulta previa, el brainstorming, la spec, la apertura de la release y el plan, hasta `86ae6d1` 17:55)
- Estimación de implementación (del plan): **2 h – 4 h**, condicionada al RED (A6 aplicado: Tasks 3 y 4 = 0 h si ningún RED fallaba)
- Esfuerzo real: **~0,5 h** (de `86ae6d1` 17:55 a `082038d` 18:20, más el cierre)
- Desviación: −1,5 h respecto al suelo del rango (**−75%**)
- Causa de la desviación (obligatoria):
  1. **El suelo del rango seguía inflado.** A6 pedía condicionar la guidance al RED, y se hizo; pero el suelo (Task 1 + Task 2 = 2 h) también sobreestimaba: la Task 1 fueron tres ediciones de una línea y la Task 2, cinco subagentes de 2–6 minutos en paralelo más la redacción. Una campaña RED cuesta ≈ (nº de escenarios × 5 min de subagente, en paralelo) + 10 min de redacción por fichero, no 1,5 h.
  2. **Tres GREEN en paralelo**, misma economía.
  3. La única parte no prevista (E5) costó un run más y una sección de RED.

Nota de calibración: cuarto ciclo consecutivo con ratio < 0,4 (0,25). La causa ya no es solo "guidance que el RED desautoriza": es que la unidad de coste de un ciclo Art. I con subagentes en paralelo es de **minutos**, y la estimación sigue pensando en horas de trabajo secuencial. → `estimation.md`.

## 3. Desviaciones del plan

- **Task 3 aplicó menos de lo previsto**: el Step 1 (tabla de mapeo vías → carriles) y el Step 2 (frase SDD) no se ejecutaron porque E1 y E4 salieron limpios. En su lugar, un cambio no previsto en el plan: cuarta salida del enrutado + fila de overrides acotada, justificado por E5.
- **Se añadió un quinto escenario (E5) durante el RED**: el criterio de éxito 2 de la spec ("`sdd-start-task` la enruta allí") no tenía escenario propio. Fue el único de `sdd-start-task` que falló.
- **La task se arrancó antes de abrir la release.** El scope de v0.6.0 se decidió dentro del brainstorming de esta task; el usuario lo advirtió y se abrió formalmente con `sdd-start-release` a mitad del plan (`cf47e8c`), incorporando A6 y A7, que de otro modo se habrían perdido. Ver aprendizajes.
- Sin REFACTOR en el GREEN: ningún escenario destapó hueco de la propia skill.

## 4. Verificación

### 4.1 Builds

No aplica (Markdown). Equivalentes ejecutados: `grep -rn "6\.3\.0"` (solo README y constitution; nada en `tech-stack`); `head -4` de las dos skills tocadas (frontmatter `---`/`name`/`description` intacto); `git diff --stat` de la Task 3 (11 inserciones, 2 borrados, 3 ficheros).

### 4.2 Smoke / tests

Todo **verificado por el agente en disco** (fixture "Bookline" en el scratchpad, una copia por escenario, superpowers 6.3.0 real resuelto por el harness, skills del working tree pegadas por prompt):

| # | Caso (criterio de éxito de la spec) | Resultado |
| --- | --- | --- |
| 1 | Feature pequeña que `brainstorming` clasifica `bounded` termina con `spec.md` y gate (E1, E4) | ✅ 2/2 en el RED sin cambios: `feature/*`, `spec.md` (111 y 62 líneas), sin `plan.md`, código intacto, parada en el gate. La fila de override existente basta; deuda "no probado" saldada |
| 2a | Spike en `sdd-consult` se resuelve sin carpeta, rama ni código conservado (E2 → G2) | ❌ RED: la skill vetaba la sonda. ✅ GREEN: dos scripts desechables fuera del repo, borrados; `git status` limpio; respuesta con salida CSV real |
| 2b | `sdd-start-task` enruta el spike a `sdd-consult` (E5 → G5) | ❌ RED: rama + carpeta + spec lite. ✅ GREEN: `sdd-consult` invocada, sonda borrada, sin rama ni spec, `develop` limpio |
| 3 | Plan desde spec con restricciones las lleva en bloque propio (E3 → G3) | ⚠️ RED: 3/4 contrastadas, `Node >= 20` "por arrastre". ✅ GREEN: bloque con 4/4 literales + Arts. II–V |
| 4 | README declara versión validada; Art. V obliga a revisarla | ✅ por lectura (`README.md:57`, `constitution.md:25`) |
| 5 | Roadmap con alcance v0.6.0/v0.7.0 (luego RC), referencias de vigilancia, ítem 2 releído | ✅ `cf47e8c`, `928aad2` |
| 6 | "SDD" se lee como Spec-Driven (E4) | ✅ RED limpio: sin `.superpowers/`, sin dispatch. Frase no escrita |

### 4.3 Residuales / deuda generada

- **T3 debe re-testar el bloque "Restricciones globales" con un plan multi-task** y ejecución por subagentes: con una sola task no se ejercita el caso en que el bloque importa (ejecutores que solo ven su task). Anotado en la fila de T3 del roadmap.
- **Dónde vive la sonda de un spike** (dentro de la copia y borrada, o fuera): las dos formas cumplen "nada persiste". Sin guidance: sería regla sin fallo.
- Las copias `bookline-*` del scratchpad son desechables y no se versionan.

### 4.4 Revisión de skills

`.claude/skills/` no existe en este repo (solo `.claude/settings.json`); las skills del kit viven en `skills/` y son el objeto de la task: dos editadas y una plantilla, todas bajo Art. I. No se crea ninguna skill nueva — decisión registrada en el roadmap: la unidad de descomposición es el auxiliar dentro de la skill (T2), no la skill.

## 5. Aprendizajes

- **Un scope de varias tasks que sale de una consulta es `sdd-start-release`, no `sdd-start-task`.** Esta task decidió el alcance de v0.6.0 dentro de su brainstorming; al abrir la release después aparecieron A6 y A7, que la task había ignorado. → `sdd-consult` (handoff, paso 5: ya nombra `sdd-start-release`; el fallo fue del agente, no del texto — se registra aquí y en el acta de la release; guidance solo si un RED lo reproduce).
- **Un criterio de éxito sin escenario propio se detecta al redactar el RED, y puede ser el único que falle.** E5 se añadió a mitad de campaña. → `tech-stack.md` §Tests.
- **El subagente puede invocar con `Skill` la copia en cache de la misma skill que se le pega por prompt** (2/3 GREEN invocaron `sdd-kit:sdd-consult` v0.5.0) y aun así seguir el texto pegado. La entrega por prompt sigue gobernando la conducta; conviene anotarlo en la evidencia cuando ocurre. → `tech-stack.md` §Tests.
- **Superpowers real + skills del kit por prompt** es la combinación que prueba la integración de verdad: `brainstorming`/`writing-plans` 6.3.0 los resolvió el harness y el kit se probó en su versión del working tree. → `tech-stack.md` §Tests.
- **La unidad de coste de un ciclo Art. I con subagentes en paralelo son minutos**, no horas: la estimación debe contar escenarios × minutos + redacción, no horas secuenciales. → `estimation.md`.
- **Un baseline limpio en lo previsto y un fallo en lo contrario** (E2: no fabricó artefactos, pero se negó a sondear): la guidance correcta era un modo nuevo, no una prohibición. Confirma el Art. II y lo ya registrado en `tech-stack` (task modo-lite). → sin destino nuevo.
- **La unidad de descomposición es el auxiliar dentro de la skill, no una skill nueva** (decisión del brainstorming, ya en el roadmap como decisión tomada; gobierna T2). → `architecture.md` cuando T2 la materialice.
- **El carril consult ahora tiene tres modos** (entender, sondear, pensar). → `mission.md` (glosario).
