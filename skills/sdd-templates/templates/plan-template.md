---
id: <yyyyMMdd-HHmmss>-task-<id>-<slug>
task: <id>
title: Plan de implementación — <título de la spec>
spec: ./spec.md
status: draft
created: <YYYY-MM-DD>
---

# Plan de implementación — <título>

> Compatible con `superpowers:writing-plans`. El método lo recomienda su handoff y va en la línea
> `Ejecución` de abajo, para el plan entero ([tabla de gates](../../sdd-start-task/references/control-profiles.md)).
> Borra los bloques de ayuda (`>`) al redactar.

## Decisiones que he tomado yo — valida estas

> Es lo único que el dev-lead necesita leer para aprobar el plan; el resto es para el ejecutor. Una línea por decisión: **modelo y effort por task** (y por qué), **ejecución** (el método que recomienda el handoff y por qué), **decisiones técnicas que la spec no fija**, **riesgos altos** y **coste estimado** (horas y, si se despacha, orden de magnitud en tokens o dinero).

1. <decisión> — <por qué>

**Goal**: <una frase con el objetivo de implementación>

**Architecture**: <2-3 frases sobre el enfoque técnico y por qué>

**Tech Stack**: <el del proyecto — ver `.docs/sdd/tech-stack.md`; recorta a lo que toca esta feature>

**Spec**: `./spec.md`

**Ejecución**: <native | subagent>, porque <motivo del plan> · o, con `execution` fijado en `sdd-kit.json`: <valor>, fijado en sdd-kit.json · con native, añade: Si esta sesión se retomó tras una compactación (empieza por «This session is being continued from a previous conversation») y quedan dos o más tasks sin su línea `complete` en el ledger, no las hagas tú: despacha las que quedan con subagent-driven-development sobre el mismo ledger. · con native, añade también: La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.

## Restricciones globales

> Dos bloques. Una línea por restricción; "ninguna" si un bloque no tiene.
>
> ⚠️ Una task NO hereda esta sección por su cuenta: un ejecutor que solo ve su task no la lee. Quien despacha le entrega el bloque «De código» — ver el paso de implementación de `sdd-start-task`.

### De código

> Viaja al implementador y a cada revisor. Copia **literal** de las restricciones de la spec que atan a todas las tasks —versiones mínimas, límites de dependencias, naming, valores exactos— y el artículo de calidad de código de la constitution del proyecto (en el kit, Art. X: sin comentarios que repitan el código ni que citen documentos —constitution, spec, task, capacidad—, clean code, umbrales). Si la constitution del proyecto no tiene artículo de calidad, escribe aquí las dos reglas de comentarios igualmente.
>
> El gate completo del proyecto (la suite entera, el lint de todo el repo) **no va aquí**: este bloque viaja a cada implementador y lo convertiría en obligación de cada task. Cada task declara su verificación; el gate va en §3, una vez.

- <restricción, con el valor exacto de la spec>

### De proceso

> El bloque «De proceso» es para quien despacha: no viaja al encargo de ningún revisor, porque un revisor audita lo que lee y convierte en hallazgo una regla que no es del código (medido en `tests/proportional-review-red.md`). Aquí van la **política de modelos** del proyecto (criterio de asignación y modelos prohibidos por defecto), el **modo de ejecución** por defecto y las reglas de atribución de commits.

- <regla de proceso>

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

> Cada task es ejecutable y acotada, y verifica solo lo que toca: sus superficies dicen qué
> comandos corre (`tech-stack.md` §Testing: TDD si hay tests automáticos; smoke manual documentado
> si no los hay). El gate completo corre una vez, en §3. Si hay más de una task → crear `tasks.md`
> (registro vivo).
>
> **Tasks verticales** (orientación, no regla): en un plan que cambia una aplicación, cada task acaba en algo que el usuario puede probar en ella: una rebanada que atraviesa las capas que necesita (migración, API, pantalla), no una capa. «BD y API» seguida de «pantalla» deja la primera task sin nada que probar ni que enseñar en la parada tras la task. Si una task no puede, su línea «Se prueba en la aplicación» dice por qué: una base común que usan varias funcionalidades, una migración de datos sin cambio visible o un refactor. Las capas de una sola funcionalidad no son base común: «BD y API de facturas» con la pantalla de subida en la task siguiente es partir por capas; la primera task lleva la subida de punta a punta, de la tabla al botón. Sin tamaño fijo en horas.

### Task 1 — <nombre>

**Modelo**: <modelo **y** effort, los dos explícitos, con el despacho literal: `subagent_type: sdd-kit:effort-<low|medium|high>` + `model: <sonnet|opus>` — `Agent` no tiene parámetro de effort y, sin tipo, el subagente hereda el de la sesión. Con Haiku, que no admite effort: `general-purpose` + `model: haiku`. Si el harness no expone el effort (kit sin sus agentes, otro harness): «effort: no disponible en este harness, hereda el de la sesión». Gama media como suelo si hay que interpretar prosa; el tier más barato solo si esta task ya trae el código escrito o es un arreglo mecánico. `fable` y `opus xhigh` exigen justificación escrita aquí mismo>
**Tests RED**: <hilo principal · `ruta/del/test`, escritos antes de despachar y sin commitear: van en el commit de la task; Native: TDD del propio hilo>

> Un test por escenario (THEN) de la spec; el implementador los recibe como contrato. Recomendación, no regla: siembra por API, una sola aserción de negocio por test; los recorridos largos, para el smoke de release.

**Superficies**: <las que toca esta task, de BD · backend · frontend · tooling · docs>
**Verificación**: <los comandos de esas superficies y ninguno más>
**Verificación visual**: <omitir si la task no cambia lo que se ve · pantalla o ruta · estados · temas · qué mirar>
**Verificación lenta**: <omitir si ningún comando de «Verificación» pasa de 10 min · comando · duración>
**Se prueba en la aplicación**: <omitir si el plan no cambia ninguna aplicación · qué hace el usuario y qué ve al acabar la task, con los datos de la spec: «el gestor sube `marzo.pdf` y lo ve en el listado de facturas como Pendiente» · o «no, porque <base común | migración | refactor>: <motivo>»>

> BD es migraciones, persistencia o dialecto; un servicio que usa la BD sin cambiar su acceso es backend. La suite de BD solo entra en «Verificación» si las superficies incluyen BD. Una constitution que pide «todo verde en cada task» se cumple con las superficies de la task: el gate completo no va aquí, va en §3. «Verificación visual» es obligatoria si la task cambia lo que se ve: qué mirar es alineación, separación a bordes y contraste, en cada estado y tema; la hace el hilo principal en un navegador. Un comando de más de 10 min va en «Verificación lenta» y no en «Verificación»: lo lanza el hilo principal en segundo plano, no el implementador.

**Interfaces**:
- Consume: <lo que usa de tasks anteriores o de §1: nombres, firmas y formatos exactos; «nada» si no usa nada>
- Produce: <lo que las tasks siguientes usan de esta: nombres, firmas y formatos exactos>

> La task viaja sola: `task-brief` extrae solo su texto, así que no remite a otras secciones del plan («ver §1.4»). Copia aquí las firmas, tablas y textos que necesita.

**Ficheros**: crear/modificar `path/...`

- [ ] **Step 1: Implementación** — descripción concreta; código real cuando ayude, sin placeholders.
- [ ] **Step 2: Build** — el build de las superficies de la task. Esperado: verde, sin errores.
- [ ] **Step 3: Verificación** — los comandos de «Verificación» de esta task (tests si TDD, smoke manual si no), con resultado esperado.
- [ ] **Step 4: Commit de la task** — uno solo, al quedar limpia su revisión: los intermedios se juntan (`sdd-start-task/references/commit-milestones.md`). Convención del proyecto, referenciando el ticket.

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

- [ ] Gate de cierre, una vez y en el hilo principal: <el gate completo del proyecto: build, suite entera, lint>
- [ ] Verificación de los criterios de éxito de la spec (§2)
- [ ] Spec satisfecha: cada requisito tiene su task (ver Self-review)
- [ ] Cierre de rama según el flujo del proyecto (`sdd-end-task`)

---

## 4. Self-review (cobertura spec → tasks)

- <requisito de la spec> → Task <n>. ✓
- <aspecto sin cambios> → N/A (confirmado en spec). ✓
