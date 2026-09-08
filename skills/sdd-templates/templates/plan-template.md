---
id: <yyyyMMdd-HHmmss>-task-<id>-<slug>
task: <id>
title: Plan de implementación — <título de la spec>
spec: ./spec.md
status: draft
created: <YYYY-MM-DD>
---

# Plan de implementación — <título>

> Compatible con `superpowers:writing-plans`. Ejecución: `superpowers:subagent-driven-development`
> (default del kit); una task va en línea solo si lo declara con motivo en su campo `Ejecución`.
> Borra los bloques de ayuda (`>`) al redactar.

**Goal**: <una frase con el objetivo de implementación>

**Architecture**: <2-3 frases sobre el enfoque técnico y por qué>

**Tech Stack**: <el del proyecto — ver `.docs/sdd/tech-stack.md`; recorta a lo que toca esta feature>

**Spec**: `./spec.md`

## Restricciones globales

> Copia **literal** de las restricciones de la spec que atan a todas las tasks —versiones mínimas, límites de dependencias, naming, valores exactos— más los artículos de la constitution que aplican. Una línea por restricción. Escribe "ninguna" si no hay.
>
> Incluye aquí la **política de modelos** del proyecto (criterio de asignación y modelos prohibidos por defecto) y el **modo de ejecución** por defecto.
>
> ⚠️ Una task NO hereda esta sección por su cuenta: un ejecutor que solo ve su task no la lee. Quien despacha debe entregársela — ver el paso de implementación de `sdd-start-task`.

- <restricción, con el valor exacto de la spec>

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: ¿se puede hacer más simple?
- [ ] **YAGNI gate**: ¿se abstrae algo con menos de 3 usos reales?
- [ ] **Brownfield gate** *(si el proyecto es brownfield)*: ¿retrocompatible? ¿respeta el patrón del módulo? ¿sin refactor oportunista fuera de scope?
- [ ] **Constitution check**: el plan respeta los artículos relevantes de `.docs/sdd/constitution.md`.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `path/al/fichero` — responsabilidad.

**Modificar**:

- `path/al/existente` — qué cambia.

**NO se tocan** (constancia de lo que deliberadamente queda intacto):

- `path/...` — por qué se deja como está.

### 1.2 Modelo de datos *(si aplica)*

Cambios de schema; si es grande → `data-model.md`.

### 1.3 Migraciones *(si aplica)*

Mecanismo y nomenclatura del proyecto (ver `tech-stack.md` y skills de nivel 2).

### 1.4 Contratos API *(si aplica)*

Endpoints, shape request/response.

---

## 2. Tasks

> Cada task es ejecutable y acotada. La verificación de cada task sigue la política del
> proyecto (`tech-stack.md` §Testing): TDD si hay tests automáticos; smoke manual documentado
> si no los hay. Si hay más de una task → crear `tasks.md` (registro vivo).

### Task 1 — <nombre>

**Modelo**: <modelo **y** effort, los dos explícitos — declarar solo el modelo es una trampa: el effort cae al defecto de ese modelo, no al tuyo. Gama media como suelo si hay que interpretar prosa; el tier más barato solo si esta task ya trae el código escrito o es un arreglo mecánico. `fable` y `opus xhigh` exigen justificación escrita aquí mismo>
**Ejecución**: <omitir si va por agente, que es el default; `en línea` + motivo si esta task se desvía>

**Ficheros**: crear/modificar `path/...`

- [ ] **Step 1: Implementación** — descripción concreta; código real cuando ayude, sin placeholders.
- [ ] **Step 2: Build** — comando de build del proyecto. Esperado: verde, sin errores.
- [ ] **Step 3: Verificación** — test (si TDD) o smoke manual con resultado esperado.
- [ ] **Step 4: Commit** — convención del proyecto, referenciando el ticket.

---

## Estimación y esfuerzo *(OBLIGATORIO si existe `.docs/sdd/estimation.md` — no borrar)*

> Se rellena al cerrar spec+plan. Unidad: horas (admite decimales).

- Tipo: <frontend | backend | fullstack | migration | docs | infra/tooling | chore>
- Esfuerzo spec + plan: <Xh>
- Estimación de implementación: <Yh>
- Base de la estimación: <nº de tasks, complejidad, incertidumbres, referencia del estimation-log>
- Confianza: alta / media / baja

---

## 3. Validación final

- [ ] Build verde con los comandos del proyecto
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-task`)

---

## 4. Self-review (cobertura spec → tasks)

- <requisito de la spec> → Task <n>. ✓
- <aspecto sin cambios> → N/A (confirmado en spec). ✓
