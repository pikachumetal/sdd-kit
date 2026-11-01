---
id: 20261101-140903-feature-0272-using-sdd-templates-english
feature: 0272
title: Plan de implementación — using-sdd y sdd-templates en inglés
spec: ./spec.md
status: done
created: 2026-11-01
---

# Plan de implementación — `using-sdd` y `sdd-templates` en inglés

## Decisiones que he tomado yo — valida estas

1. Modelo y effort: el hilo, en Native, con el modelo de la sesión; sujetos en Sonnet, como declara la batería; revisión final con los ejes de `sdd-verify` — el texto ya está escrito y aprobado en la tabla de reglas de la spec.
2. Ejecución: native — ver la línea de abajo.
3. La comparación de literales es un script en el scratchpad, no un test: compara con el castellano, que deja de existir al cerrar, y no protege nada después.
4. La Task 1 no lanza sujetos: la medición entera va en la Task 2, para no pagar dos veces la batería.
5. Riesgos altos: que el texto en inglés cambie el idioma de la respuesta o una puerta; lo mide la Task 2. Coste: ~1 h y 12,9 $ de techo (~6 $ con lo medido en la 0206).
6. Review Focus: 2 entradas que la spec no fija; ver la sección.

**Goal**: dejar las dos skills en inglés con las reglas intactas, y medir que enrutan igual.

**Architecture**: los dos `SKILL.md` se sustituyen por los drafts aprobados, con la misma estructura línea a línea. `battery.md` cita los literales nuevos. La medición usa la batería existente y un sujeto suelto para el humo.

**Tech Stack**: Markdown de skills, Vitest en `cli/test/kit/`, baterías en `tests/batteries/`.

**Spec**: `./spec.md`

**Ejecución**: native, porque 2 tasks encadenadas sobre el mismo texto, un error lo cazan los tests y la batería, y el plan cabe en un contexto. Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con el método SDD de sdd-implement sobre el mismo ledger. La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para los ejes Spec y Arquitectura de la revisión final.

**Eje Arquitectura**: no — solo cambia el idioma de dos `SKILL.md`; no añade módulo, dependencia ni contrato.

## Restricciones globales

### De código

- Art. III: las skills en inglés, con la frase `Write everything the user reads in the language of their message`; `battery.md` y la evidencia, en castellano.
- Art. X: sin comentarios que repitan el código ni que citen documentos.
- El texto de las skills es el de la tabla de reglas de la spec; una regla que deba cambiar va a una fila del roadmap, no entra aquí.
- Las frases del usuario y los literales de la decisión 2 de la spec no se traducen.

### De proceso

- Sujetos en Sonnet, hasta 3 en paralelo (`control.maxParallelAgents`). Un rojo no se relanza: se lee. Si lo gastado pasa de 13 $, para.
- Commits en castellano con el tipo en inglés, con la atribución de la sesión.

## Review Focus

- Un sujeto al que la skill en inglés le hace responder en inglés a una petición en castellano → la respuesta sigue en castellano · Task 2, lectura de `texts.txt` de cada sujeto que responde.
- Una ADR calcada con sus secciones traducidas al inglés → conserva los encabezados de la plantilla · Task 2, `sdd decision check` sobre el fichero del humo.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: sustituir dos ficheros y medir; nada más simple cumple la spec.
- [x] **YAGNI gate**: sin batería nueva ni test nuevo.
- [x] **Brownfield gate**: misma estructura y mismas filas.
- [x] **Constitution check**: cumple Art. III y Art. VIII; las plantillas no se tocan.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Modificar**:

- `skills/using-sdd/SKILL.md` — texto en inglés.
- `skills/sdd-templates/SKILL.md` — texto en inglés.
- `tests/batteries/using-sdd/battery.md` — filas 52-56 de «Procedencia de las reglas», con los literales nuevos.

**Crear**:

- `.docs/sdd/specs/20261101-140903-feature-0272-using-sdd-templates-english/green/` — evidencia de sujetos.
- `tests/english-using-templates-green.md` — resumen de la medición.

**NO se tocan**:

- `skills/sdd-templates/templates/` — fuera de alcance.
- `tests/*-red.md` anteriores — evidencia histórica.
- `tests/batteries/using-sdd/subject.mjs` y los moldes — la medición debe correr sobre lo mismo que la 0206.

### 1.6 Dependencias

Batería de la 0206 como línea base (`enrutado-entera/`, 24/24).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Una frase cae en otra puerta | baja | alto | batería entera; un rojo se lee y, si pide más que el inglés, para |
| Respuesta en inglés a una petición en castellano | media | medio | frase del Art. III y lectura de `texts.txt` |
| Artefacto con la plantilla traducida | baja | medio | frase de `sdd-templates` y `sdd decision check` |

### 1.8 Rollout

Directo, con `sdd merge --push`.

### 1.9 Excepciones a la constitution

Ninguna.

---

## 2. Tasks

### Task 1 — Reescribir las dos skills

**Tras**: —
**Modelo**: el hilo, en Native, con el modelo de la sesión.
**Tests RED**: no aplica: la conducta ya está cubierta por `skills.test.ts`, `word-budget.test.ts` y la batería, y la línea base es la de la 0206.
**Superficies**: docs
**Verificación**: `moon run cli:test` → `Tests  … passed`, sin fallos en `cli/test/kit/`.
**Se prueba en la aplicación**: no, porque el kit se mide con sujetos, en la Task 2.

**Interfaces**:
- Consume: los textos de la tabla de reglas de `spec.md`.
- Produce: los dos `SKILL.md` en inglés, con `## Gates` y `## Doubt rule` en `using-sdd`.

**Ficheros**: modificar `skills/using-sdd/SKILL.md`, `skills/sdd-templates/SKILL.md`, `tests/batteries/using-sdd/battery.md`.

- [ ] **Step 1: Implementación** — sustituir los dos `SKILL.md` por el texto de la columna «Después». En `battery.md`, «Regla de duda» pasa a «`Doubt rule`», y las cuatro filas de racionalización citan: «They want it done, so it's a feature», «I'll save it to memory for future sessions», «It's a typo or a version bump: a direct edit», «They've been assigned to me: I'll do them one after another».
- [ ] **Step 2: Comparación** — por script, en el scratchpad, contra `git show develop:<skill>`: todo lo que va entre «» sigue, salvo las cuatro racionalizaciones; los tramos de código solo difieren en los huecos de la decisión 2; `sdd-kit:*` y los enlaces, iguales. Esperado: sin diferencias fuera de esas.
- [ ] **Step 3: Verificación** — la de arriba.
- [ ] **Step 4: Commit de la task**.

### Task 2 — Medir enrutado y calco

**Tras**: Task 1
**Modelo**: el hilo, con sujetos en Sonnet, como declara la batería.
**Tests RED**: línea base de la 0206.
**Superficies**: tooling
**Verificación**: `node tests/headless/battery.mjs run` con `BATTERY=using-sdd`, `KIT_DIR` en el worktree y `PHASE=green`: cada fila ≥ umbral, salvo `r1`, por la enmienda de la spec. Humo: `sdd decision check` → sin fallos.
**Se prueba en la aplicación**: no, porque son sujetos sobre moldes.

**Interfaces**:
- Consume: los dos `SKILL.md` de la Task 1.
- Produce: `tests/english-using-templates-green.md`, con el veredicto por fila, la lectura en prosa y el coste.

**Ficheros**: crear `tests/english-using-templates-green.md` y la carpeta `green/`.

- [ ] **Step 1: Batería** — lanzar los 34 sujetos.
- [ ] **Step 2: Lectura** — `d1`: una sola pregunta, recomendación primero. `s1`: nada en memoria. Todos los sujetos que responden: idioma castellano.
- [ ] **Step 3: Humo** — un sujeto con `tests/batteries/using-sdd/mold-salas`: «Escribe la ADR de que las reservas se guardan en un fichero JSON y no en una base de datos.» Pasa si invoca `sdd-kit:sdd-templates` y `sdd decision check --path <molde>/.docs/sdd` no da fallos.
- [ ] **Step 4: Evidencia y commit** — resumen con el coste real frente a los 13 $.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,4 h
- Estimación de implementación: 1 h
- Base de la estimación: 2 tasks, texto ya escrito, batería de ~15 min según la 0206
- Confianza: alta

---

## 3. Validación final

- [ ] Gate de cierre, una vez y en el hilo principal: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop`
- [ ] Verificación de los criterios de la spec
- [ ] Spec satisfecha: cada línea de «Dónde se prueba» tiene su task
- [ ] Cierre de rama según el flujo del proyecto (`sdd-archive`)

---

## 4. Self-review (cobertura spec → tasks)

- Enrutado y `description` de `using-sdd` → Task 2, batería entera. ✓
- Filas en prosa → Task 2, Step 2. ✓
- Calco de plantilla → Task 2, Step 3. ✓
- Frases del usuario intactas → Task 1, Step 2. ✓
- Órdenes, enlaces y literales de la CLI → Task 1, Step 2 y `skills.test.ts`. ✓
- Topes → Task 1, Verificación, y gate de cierre. ✓
- Filas de «Lo que se retira o cambia de forma» → Task 1, Step 1. ✓
- Delta de comportamiento → N/A (sin delta). ✓
- Review Focus → Task 2, Steps 2 y 3. ✓
