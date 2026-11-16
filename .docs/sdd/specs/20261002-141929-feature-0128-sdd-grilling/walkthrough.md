---
id: 20261002-141929-feature-0128-sdd-grilling
feature: 0128
title: Walkthrough — sdd-grilling, el método de preguntas del kit
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-03
---

# Walkthrough — `sdd-grilling`, el método de preguntas del kit

## 1. Cambios realizados

- **Skill nueva `sdd-grilling`**, en inglés (`skills/sdd-grilling/SKILL.md`, 649 de 650 palabras) y con `NOTICE`, que lleva la MIT íntegra de `mattpocock/skills`. `THIRD_PARTY_NOTICES.md` sirve de índice. Contenido:
  - una decisión por turno;
  - buscar fuera antes de preguntar, con subagente si hace falta la web;
  - formato fijo en texto para el diseño y diálogo para lo operativo;
  - el número de alternativas lo pone la decisión;
  - la recomendada, con una razón del caso y su coste;
  - descubrimiento sin ancla;
  - escena con datos;
  - rebatir una vez;
  - «decide tú» sin inventar el descubrimiento;
  - rechazo en prosa;
  - sin usuario, la regla de quien la invoca;
  - cierre en tres listas;
  - interrogar hasta que nada quede supuesto en silencio;
  - la dependiente espera.

  Commits `a299ba80` y el de cierre.
- **Las seis llamantes** (`sdd-consult`, `sdd-roadmap`, las dos init, `sdd-config` y el paso 4 de `sdd-start-feature`) cambian su regla de preguntas por la invocación de `sdd-grilling`. En `sdd-start-feature`, `brainstorming` sigue llevando el flujo. Commits `6cc7dc7c` y el de cierre.
- **Infraestructura de pruebas**:
  - `subject_converse` en `tests/headless/lib.sh` (persona en Haiku con hoja de respuestas, tope de turnos y su coste en el último RESULTADO) y el modo `last` de `extract.mjs`, con 4 tests en seco;
  - batería `tests/batteries/sdd-grilling/` con 11 escenarios, rúbrica de 16 filas y procedencia.

  Commit `6b4175cb`.
- **Documentos**:
  - enmienda del Art. III (las skills se escriben en inglés);
  - `mission.md`, `architecture.md`, `tech-stack.md`, `README.md` y `CLAUDE.md`;
  - capacidad nueva `interviewing` y `MODIFIED` en `configuration`, `onboarding` y `feature-flow`;
  - backlog B11 (rondas como preferencia personal) y B12 (idioma de la documentación configurable);
  - cuatro filas de deuda.
- **Topes**: `sdd-grilling` 650, kit 54.530 y `sdd-start-feature` 20.215, todos con decisión del dev-lead escrita en la spec.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 6h
- Esfuerzo real: 3,5h — aproximado. Sale de las marcas de los commits (2026-10-02, 16:35–17:40, y 2026-10-03, 11:30–12:45) más las campañas en segundo plano, que corrían mientras el hilo esperaba. El brainstorm y la spec, del 2026-10-01 y el 2026-10-02, no cuentan aquí (~3h).
- Desviación: −2,5h (−42 %)
- Causa de la desviación: la campaña salió mucho más barata y rápida de lo previsto (~14 $ frente a ~48 $). Los sujetos de una entrevista se paran en el primer o el segundo turno (0,1–0,4 $), no en los ~1 $ supuestos, y la batería reutilizó el molde y `battery.sh` sin escribir infraestructura nueva, salvo `subject_converse`. Las tres re-revisiones posteriores a la revisión final añadieron ~1h.
- Modelo del hilo: Opus 5.5, effort no registrado (brainstorm, spec, plan y ejecución en Native, en toda la feature). El dev-lead aprobó sin la opción de bajar la sesión a gama media.
- Tokens del hilo: 87.988.196 — claude-opus-5-5 87.468.005; claude-sonnet-5-5 520.191
- Tokens de subagentes: 7.891.429 en 6 despachos — Re-revisión 2 tramo 0128 tras fixes claude-opus-5-5 1.586.776 / 4 min; Revisión spec 0128 lente dominio claude-sonnet-5-5 128.025 / 0 min; Re-revisión tramo 0128 tras enmiendas claude-opus-5-5 3.276.974 / 5 min; Revisión spec 0128 lente técnica claude-sonnet-5-5 205.126 / 1 min; Re-revisión 3 tramo 0128 final claude-opus-5-5 172.041 / 0 min; Revisión final rama 0128 sdd-grilling claude-opus-5-5 2.522.487 / 7 min
- Coste de la sesión: 41,13 $ (hilo 35,42 $ + subagentes 5,71 $)
- Coste de sujetos: 14,2 $ en 49 sujetos de batería (Sonnet, y persona en Haiku) y 32 llamadas de micro-test (Sonnet). RED 3,74 $; GREEN 4,44 $; REFACTOR 2,57 $; controles de las enmiendas ~1,9 $; micro-tests ~1,5 $.
- Review de spec: 2 revisores (dominio y técnica, Sonnet) · 20 hallazgos, 19 aceptados.

## 3. Desviaciones del plan

- **g3 con `TURN2` «sí»**: sin él, el sujeto se quedaba en la pregunta de carril y la escena no se medía.
- **g6 con un tercer turno**: el rechazo tiene que caer en una decisión de diseño, no en la de carril.
- **u1**: se corrigió su «Esperado» (la puerta fue `sdd-start-feature`). Su control C4 («la puerta no es `sdd-grilling`») pasó igual.
- **Micro-tests extra**:
  - m3: buscar fuera, porque en la batería `sdd-consult` no siempre carga la skill;
  - m4: la mezcla por costumbre.
- **Tres re-revisiones tras la revisión final**: lo pide el paso 9 del cierre, porque cada pasada de arreglos tocaba texto de la skill. La tercera pasada se revisó en el hilo (ver rulings).
- **Dos enmiendas de la spec aprobadas por el dev-lead el 2026-10-03** (en `spec.md`, «Enmiendas»):
  - recuperar el núcleo de `grilling` y que el número de alternativas lo ponga la decisión;
  - quitar la fila de `overrides-superpowers.md` y añadir «(invócala con `Skill`)» en el paso 4.

### Decisiones tomadas sin el dev-lead

- `task-done` apuntó como completa la Task 1 con un test rojo, porque `Invoke-Pester` sin `-CI` sale con 0. Se borró la línea, se arregló el test (dependía de la codificación de la consola) y se repitió con `-CI` — coste si está mal: ninguno.
- `Skills.Tests.ps1` acepta también «Use when» al principio de la `description`, por la enmienda del Art. III — coste si está mal: una línea de test.
- g3 lleva `TURN2` «sí» y se relanzó solo g3 — coste si está mal: ~0,5 $.
- En el Scope, la fila de `overrides-superpowers.md` pasaba el tope. Se registró como ruling, pero **era un desvío**: lo señaló la revisión final y el dev-lead lo decidió después con una enmienda.
- REFACTOR con 4 contras tras el GREEN:
  - la escapatoria «no verificado» al buscar fuera;
  - una pregunta tras ➡️ es una segunda decisión;
  - los anuncios, en el idioma del usuario;
  - «no creo que lo quieras» es relleno.

  Coste si está mal: ~2 $.
- «La skill nueva» en `tech-stack.md` no cabe en su tope de anclaje. `architecture.md` ya la lista, y `tech-stack.md` ya no nombra `grilling` como dependencia — coste si está mal: una línea.
- Después de la tercera re-revisión, la skill volvió a «(scope, level, money)», el texto que revisó la revisión final y midió el GREEN, porque `control-profiles.md` no define qué es del usuario. El resto del tramo es evidencia y spec: se revisó en el hilo, sin abrir una cuarta re-revisión — coste si está mal: una línea de la skill ya medida.

## 4. Verificación

### 4.1 Builds

- Suite completa: `pwsh -NoProfile -Command "Invoke-Pester tests -CI -Output Minimal"` → 1.310 pasados, 0 fallos, 10 omitidos · 426 s (sobre `69909936`).
- Tras los arreglos posteriores se ejecutó el pre-commit en cada commit (960 pasados, 0 fallos) y, en cada pasada, `WordBudget`, `Skills`, `PathLength` y `SubjectOutputPrivacy`.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-03 · suite 1.310/1.310 · RED/GREEN de la batería (49 sujetos) con la rúbrica en `tests/sdd-grilling-green.md` · micro-tests m1–m4 · revisión final opus effort high sobre `69909936` más tres re-revisiones opus de los tramos posteriores, juntados en el commit de cierre, sin Critical y con sus Important arreglados. Lo «no probado» se lista abajo. El uso real lo darán los tickets de `sdd-feedback`.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Una decisión por turno | ejecución real (batería) | RED 4 de 16 fallan → GREEN 1 de 13 con la skill cargada, que el REFACTOR arregla; micro m4 3 de 3 frente a un control con segunda pregunta 3 de 3 |
| La dependiente espera | no probado | sin escenario propio |
| Formato fijo en texto; operativa con diálogo | ejecución real | formato ❓/🅰️🅱️/➡️ en g1, g3, g7, g8 y g9; la parte operativa no se puede probar en headless (no hay `AskUserQuestion`) |
| Alternativas reales; el número lo pone la decisión | ejecución real + micro | relleno: GREEN 1 (g1-1) → 0 tras el REFACTOR; «dos más una 🔀» no se reproduce en la batería ni en m4: su evidencia es de campo (5 de 7 preguntas del agente en Opus en esta sesión); «una sola alternativa» sin probar |
| La recomendada con razón del caso | ejecución real | RED 2 de 9 → 0 |
| Descubrimiento sin ancla | ejecución real + micro | RED 4 de 4 → 0 de 2; micro m2 5 de 5 sin guía → 0 de 5 |
| Escena concreta | ejecución real | RED 2 de 2 → 0 de 1 con alternativas (g3-2) |
| Rebatir una vez | ejecución real (control) | 0 de 2 en RED y GREEN |
| Busca fuera antes de preguntar | micro (ejecución real con `WebSearch`) | 0 de 3 sin guía → 3 de 3 con la skill (texto de la pasada de fix de la primera re-revisión, juntada en el cierre); por el camino real de la batería, no probado: `sdd-consult` no cargó la skill en g9; el disparador del subagente (pasada de la segunda re-revisión), sin medir |
| «Decide tú» | ejecución real | RED 2 de 2 inventan el problema → 0 de 2 |
| Rechazo en prosa | ejecución real | 1 de 2 → 0 de 2 en el REFACTOR (g6-2 no cargó la skill) |
| Cuándo para (tres listas) | ejecución real (persona en bucle) | RED 2 de 2 → 0 de 2, y control tras la enmienda 1 de 1 |
| Sin usuario, no pregunta | no probado | lo cubren los requisitos «sin usuario» de `configuration` y `onboarding`, que no cambian |
| Idioma del usuario | ejecución real | anuncio «Using … para» de `using-superpowers` antes de cargar ninguna skill: 3 de 17 / 3 de 19 / 3 de 6 → deuda |
| `configuration` MODIFIED | ejecución real (g7) | una clave por turno, con la recomendada del catálogo |
| `onboarding` MODIFIED | ejecución real (g2, g8) | una pregunta de la lista por turno |
| `feature-flow` ADDED | ejecución real (g3) | `brainstorming` carga `sdd-grilling`: 5 de 6 antes del paso 4 nuevo, y 1 de 1 después |

### 4.3 Residuales / deuda generada

Cuatro filas de deuda en el roadmap:
- el anuncio de `using-superpowers` sale en inglés;
- la invocación de `sdd-grilling` no carga siempre (`sdd-consult` contesta directamente);
- `sdd-roadmap` hace varias preguntas a la vez fuera de su entrevista;
- `sdd-init-greenfield` pregunta «en el orden de la lista», que choca con «primero la que más cambia el resto».

Backlog: B11 y B12.

Minors de la revisión diferidos:
- la condición de parada de `subject_converse` busca un `?` en cualquier sitio del texto;
- no se comprueba si falla `subject_resume`;
- `extract.mjs last` no protege el `JSON.parse`;
- `sdd-config`, en el catálogo de g7, promete «no escribo nada» y escribe los defaults;
- sin `AskUserQuestion` (en Codex o por `npx`), la decisión operativa no tiene forma definida.

## 5. Aprendizajes

- **El molde de una plantilla ancla la forma.** La plantilla de la pregunta enseñaba dos alternativas y nombraba 🔀, y el propio agente cayó en «dos más una mezcla» en 5 de 7 preguntas. La batería no lo vio porque mide preguntas sueltas → `tests/batteries/sdd-grilling/battery.md` (procedencia) y la regla de la skill.
- **Recortar para caber en un tope tira primero lo que no tiene un fallo medido detrás, y eso puede ser el núcleo de la skill.** Las cuatro piezas de `grilling` se perdieron así, y las devolvió el dev-lead al comparar con el original → fila de la 0121 en el roadmap (adelgazar con baterías), y queda dicho en la spec (enmienda del 2026-10-03).
- **`Invoke-Pester` sin `-CI` sale con 0 aunque haya fallos, y `task-done` lo apunta como completo** → `tech-stack.md`, «La verificación de una task Native en este repo, sin color» (fundida con la línea que la repetía).
- **Un revisor puede apoyar un arreglo en una premisa falsa** («cita `control-profiles`»). Contrastar la cita con el fichero antes de aplicarla lo evitó en la tercera vuelta → ya cubierto por «reproducir antes de arreglar» de `sdd-start-feature`; sin cambio.

## 6. Adendas
