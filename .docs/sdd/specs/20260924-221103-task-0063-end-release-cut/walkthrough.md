---
id: 20260924-221103-task-0063-end-release-cut
task: 0063
title: Walkthrough — sdd-end-release simplificado, solo el corte
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-25
---

# Walkthrough — `sdd-end-release` simplificado: solo el corte

## 1. Cambios realizados

- **Skill** (`ed9647c`, REFACTOR en `f456a08`): `skills/sdd-end-release/SKILL.md` pasa de 8 pasos a 5: congelar scope y versión · sellar el changelog · release notes y comunicación (solo con `release.hasRecipient: true`) · colapsar el roadmap · versión, tag y merge. El `SKILL.md` baja de 1468 a 1361 palabras (−7 %).
  - Salen el acta, el triaje y el «ack del triage», con su red flag y dos filas de la tabla. El Overview remite el feedback de una reunión a `sdd-plan` (task 0062).
  - La retro se ofrece en una línea en el paso 1 si existe `estimation-log.md`. Se hace solo si el usuario la pide y no retiene los demás pasos.
  - La `description` pierde «acaba de haber una demo de entrega con el cliente».
  - Gates, atajo de merge y tag y validación de las tasks 🧪, literales.
- **Referencias**: `references/acta-y-retro.md` pasa a `references/retro.md`, solo con la retro, en `releases/vX.Y.Z/retro.md`. `notas-y-roadmap.md` renumera los pasos (3 y 4) y cambia «acta solo si existe» por «retro solo si existe».
- **Plantilla y README**: `release-notes-template.md` ya no nombra el triaje, y la fila de `sdd-end-release` del README describe el corte.
- **Tests**: `tests/ReleaseFlow.Tests.ps1` gana tres comprobaciones de estructura: cinco pasos, ningún `feedback.md` y la remisión a `sdd-plan`.
- **Evidencia A/B** (`f456a08`, `aa9ded8`, `4476818`): `tests/sdd-end-release-ab.md`, sección de la 0063. Lanzador en `ab/` de esta carpeta, con `SUBJECT_CAP`, techo de coste y fichero `stop`.
- **Capacidad**: el delta de la spec, con su enmienda, se fusiona en `capabilities/release-flow.md` en el commit de cierre.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2 h. Es el punto medio del rango 1,5–2,5 h del plan.
- Esfuerzo real: 1,2 h — reloj del hilo aproximado por las marcas de los commits:
  - apertura a las 00:14;
  - recorte a las 00:16;
  - A/B a las 00:46, con la parada del tope de sujetos;
  - revisión final y arreglos hasta las 00:53;
  - tres sujetos más hasta las 00:58;
  - cierre ~0,3 h.

  La spec y el plan, ~0,3 h antes, quedan fuera de este número.
- Desviación: −0,8 h (−40 %)
- Causa de la desviación: los sujetos salieron más cortos de lo previsto (8–13 turnos y 0,2–0,35 $ cada uno, frente a los 0,6–0,9 $ de referencia) y los moldes de la 0004 y la 0008 se reutilizaron sin tocarlos. Es el sesgo de sobreestimar la campaña que ya advierte `estimation.md`.
- Modelo del hilo: Opus 5.5
- Tokens del hilo: no medido
- Tokens de subagentes: 135527 en 1 despacho — revisor final Opus (effort high) 136k / 4 min
- Coste de sujetos: 6,03 $ en 17 sujetos Sonnet — tanda 1 3,10 $ (8); repetición de A2 y A3 1,59 $ (4); REFACTOR 0,54 $ (2); extra de A2 0,80 $ (3)
- Review de spec: no

## 3. Desviaciones del plan

- **REFACTOR de la retro tras el A/B** (enmienda de la spec, aprobada: «Arreglo + 2 sujetos (Recomendada)»). En la primera tanda, el tratamiento de A2 preparó los pasos 1–4 en 1 de 2 sujetos con el dev-lead ausente. La frase cambia de «antes del paso 4, que la enlaza» a «no retiene los demás pasos». Con ella, 5/5.
- **La campaña pasó la previsión**: 17 sujetos frente a 8 previstos y un tope de 12. Los 5 de más los aprobó el dev-lead en dos veces, al llegar al tope y tras la revisión final («3 sujetos más de A2»). El coste, 6,03 $, queda por debajo del techo de 16 $.
- **Lanzador**: `ARMS="c t"` en lugar de `ARM=control|treatment`; las copias van en `<etiqueta>/` en lugar de `files/`; el coste queda en los `tools.txt` de cada turno. No cambia lo que se mide.

### Decisiones tomadas sin el dev-lead

- La frase que remite el feedback a `sdd-plan` va en el Overview, no en un paso — sin paso propio no cuenta como sexto — si A4 hubiera fallado, se habría subido al paso 1 (A4 la cumplió 1/1).
- Las copias de walkthrough de A3 se aplanan a `<etiqueta>/walkthrough-task-0009.md`, y el lanzador las copia así — las rutas llegaban a 140 caracteres y el pre-commit las rechazó — sin coste: la evidencia es la misma.
- De los hallazgos Minor de la revisión final, se corrigen el recuento de palabras, la línea de smoke de t-a3-1 y la fila de tickets de A2 — son datos erróneos o ausentes de la evidencia, no pulido — sin coste.
- Minor diferidos de la revisión final:
  - `SKILL.md:44` y `retro.md:5`, sin reenvolver y con dos dos puntos seguidos;
  - `ab/subject.sh` copia solo walkthroughs commiteados;
  - el `It` «no escribe el acta» solo mira `SKILL.md`, no `references/`;
  - `notas-y-roadmap.md:21` dice «sin abrir las actas».

## 4. Verificación

### 4.1 Builds

- Sin build (Markdown). `claude plugin validate` corre dentro de la suite (`Manifests.Tests.ps1`).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-25 · «ya sabes diferido, end, feeback, commit y merge» · disparador: el corte de la release 2.0.0 del kit con `sdd-end-release`, a cargo del dev-lead (lo concretó el agente: la frase no lo nombraba).
- Verificado por el agente:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Suite completa (`Invoke-Pester -Path tests -CI`, con `Slow`) | 606 en verde, 0 fallos, 6 saltados |
| 2 | RED de `ReleaseFlow.Tests.ps1` antes del recorte | 3 fallos esperados (8 pasos, `feedback.md`, sin `sdd-plan`); en verde tras el recorte; copia apartada idéntica (`git diff --no-index` vacío) |
| 3 | A1, sin destinatario: atajo de merge y tag | control 1/1 · tratamiento 1/1, con el tag anotado sobre el merge commit y el merge de vuelta |
| 4 | A2, con destinatario: prepara 1–4 con el dev-lead ausente | control 2/2 · tratamiento 1/2 antes del REFACTOR, 5/5 después |
| 5 | A3, tasks 🧪: validar el smoke antes de colapsar | control 2/2 · tratamiento 2/2 |
| 6 | A4, demo con transcripción: sin acta, remite a `sdd-plan` | tratamiento 1/1; el control escribe el acta (RED) |
| 7 | Revisión final de rama | `sdd-kit:effort-high` + Opus: «Sí, con arreglos». 1 Important corregido (causa del REFACTOR mal atribuida en la evidencia y la enmienda) |

### 4.3 Residuales / deuda generada

- `sdd-start-release`, `feedback-template.md` («La crea `sdd-end-release`»), `roadmap-template.md`, `mission.md` y `.docs/workflow/` siguen describiendo el acta en el cierre. Son de la 0062 o se releen al subir la versión del kit. La 0062, al llevarse el acta, decide también si la retro sale a su propia plantilla: hoy calca la sección «Retro» de `feedback-template.md`.
- Minor diferidos de la revisión final: los cuatro de §3.
- Revisión de skills: el repo no tiene `.claude/skills/`, y las del kit viven en `skills/`. Esta task solo cambia `sdd-end-release`. `sdd-start-release` sigue leyendo un acta que el cierre ya no escribe: lo recoge la 0062, que la retira.

## 5. Aprendizajes

- Una oferta opcional atada a un paso posterior («se hace si la pide, antes del paso 4») coincidió con que el cierre no avanzara con el usuario ausente (1/2). Sin la atadura, 5/5. → `tech-stack.md` (sujetos headless)
- La causa de una diferencia se cita del sujeto que falló. La primera redacción de la evidencia citaba a t-a2-2, que no falló, y lo vio la revisión final. → `tech-stack.md` (sujetos headless)
- `task-done` de `executing-plans` con Pester en color deja en el ledger «Binary file … matches» en vez del resultado. Con `-CI` y `NO_COLOR=1`, la línea sale limpia; `-CI` deja un `testResults.xml` en la raíz que hay que borrar. → `tech-stack.md` (entorno)
- Copiar ficheros del molde conservando su ruta (`<etiqueta>/.docs/sdd/specs/<carpeta>/walkthrough.md`) supera el límite de 140 caracteres; el lanzador aplana. → `tech-stack.md` (ya estaba la regla de rutas cortas; se añade el caso)

## 6. Adendas
