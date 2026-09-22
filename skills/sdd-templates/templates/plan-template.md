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

## Decisiones que he tomado yo — valida estas

> Es lo único que el dev-lead necesita leer para aprobar el plan; el resto es para el ejecutor. Una línea por decisión: **modelo y effort por task** (y por qué), **ejecución** (agente por defecto; en línea solo con motivo), **decisiones técnicas que la spec no fija**, **riesgos altos** y **coste estimado** (horas y, si se despacha, orden de magnitud en tokens o dinero).

1. <decisión> — <por qué>

**Goal**: <una frase con el objetivo de implementación>

**Architecture**: <2-3 frases sobre el enfoque técnico y por qué>

**Tech Stack**: <el del proyecto — ver `.docs/sdd/tech-stack.md`; recorta a lo que toca esta feature>

**Spec**: `./spec.md`

## Restricciones globales

> Copia **literal** de las restricciones de la spec que atan a todas las tasks —versiones mínimas, límites de dependencias, naming, valores exactos— más los artículos de la constitution que aplican. Una línea por restricción. Escribe "ninguna" si no hay.
>
> Incluye aquí la **política de modelos** del proyecto (criterio de asignación y modelos prohibidos por defecto) y el **modo de ejecución** por defecto. Copia también, **literal**, el artículo de calidad de código de la constitution del proyecto (en el kit, Art. X: sin comentarios que repitan el código ni que citen documentos —constitution, spec, task, capacidad—, clean code, umbrales): viaja en el encargo del implementador **y de cada revisor**. Si la constitution del proyecto no tiene ese artículo, escribe aquí las dos reglas de comentarios igualmente.
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

> Los valores de comportamiento (tiempos, límites, cuotas, avisos) viven solo en `capabilities/`. Si una task documenta `tech-stack.md`, `architecture.md` o `environments.md`, dice dónde está la pieza técnica y enlaza la capacidad, sin copiar el valor.

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

### 1.5 UX *(si aplica)*

> Recibido de la spec ligera, que ya no lo lleva. Frontend: componentes, wireframes o capturas.

### 1.6 Dependencias

> Specs previas, servicios externos, librerías. Recibido de la spec ligera.

### 1.7 Riesgos

> Recibidos de la spec ligera, que ya no los lleva: lo técnico vive aquí.

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |

### 1.8 Rollout

> Cómo llega a producción: toggle, orden de despliegue, entrega al cliente. "Directo" si no hay nada especial.

### 1.9 Excepciones a la constitution

> Si el plan necesita desviarse de un artículo: artículo · por qué · plan de remediación · aprobado por. Recibido de la spec ligera. "Ninguna" si no hay.

---

## 2. Tasks

> Cada task es ejecutable y acotada. La verificación de cada task sigue la política del
> proyecto (`tech-stack.md` §Testing): TDD si hay tests automáticos; smoke manual documentado
> si no los hay. Si hay más de una task → crear `tasks.md` (registro vivo).

### Task 1 — <nombre>

**Modelo**: <modelo **y** effort, los dos explícitos — declarar solo el modelo es una trampa: el effort cae al defecto de ese modelo, no al tuyo. Gama media como suelo si hay que interpretar prosa; el tier más barato solo si esta task ya trae el código escrito o es un arreglo mecánico. `fable` y `opus xhigh` exigen justificación escrita aquí mismo>
**Ejecución**: <omitir si va por agente, que es el default; `en línea` + motivo si esta task se desvía>
**Tests RED**: <hilo principal · `ruta/del/test`, escritos y commiteados antes de despachar; `en línea`: TDD del propio hilo>

> Un test por escenario (THEN) de la spec; el implementador los recibe como contrato. Recomendación, no regla: siembra por API, una sola aserción de negocio por test; los recorridos largos, para el smoke de release.

**Interfaces**:
- Consume: <lo que usa de tasks anteriores o de §1: nombres, firmas y formatos exactos; «nada» si no usa nada>
- Produce: <lo que las tasks siguientes usan de esta: nombres, firmas y formatos exactos>

> La task viaja sola: `task-brief` extrae solo su texto, así que no remite a otras secciones del plan («ver §1.4»). Copia aquí las firmas, tablas y textos que necesita.


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
