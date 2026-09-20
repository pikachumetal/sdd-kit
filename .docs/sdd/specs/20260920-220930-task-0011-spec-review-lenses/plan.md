---
id: 20260920-220930-task-0011-spec-review-lenses
task: 0011
title: Plan de implementación — Review de spec: lentes sin solape y propuesta que ayuda a decidir
spec: ./spec.md
status: draft
created: 2026-09-21
---

# Plan de implementación — Review de spec: lentes sin solape

## Decisiones que he tomado yo — valida estas

1. **El fixture de la campaña lo escribe el hilo, no un subagente** — es el instrumento de medida (los siete puntos del encargo plantados uno a uno, más un nombre de proyecto real en un ejemplo). Es el equivalente de «los tests los escribe el hilo antes de despachar»: si lo escribe quien luego redacta la guidance, mide lo que la guidance hace; si lo escribe otro, mide su interpretación.
2. **Ejecución en línea de las tres ediciones** (Task 3), desviación declarada del default del Art. IV: el entregable son ~40 líneas de guidance en un fichero que ya he leído entero, y el juicio de redacción es el trabajo. Los subagentes de esta task son **sujetos de medida**, no implementadores.
3. **Modelo de los sujetos: Sonnet effort medium**, el que `review-spec.md` §3 prescribe para los revisores. Medir con otro modelo mediría otra cosa.
4. **Campaña de 4 sujetos por brazo, 8 en total**: dos revisores (una lente cada uno) y dos sujetos de propuesta de nivel. Dos runs por escenario es el mínimo del kit para no leer un veredicto de n=1 (aprendizaje T2.1).
5. **Coste estimado de la campaña: ~520k tokens de subagente, del orden de 1,5–2,5 $** (revisor de spec ≈ 100k según el ticket 0009; sujeto de propuesta ≈ 30k), en dos oleadas paralelas de 4. Reloj de la task ≈ 1,5–2 h, casi todo redacción: los sujetos corren en paralelo y su duración no suma (aviso 3 de `estimation.md`).
6. **Riesgo alto declarado: el fixture puede medir de menos.** Si los revisores del brazo RED no reproducen el solape del campo (4/18), no se escribe el reparto: se recorta la task a la propuesta de nivel y al punto de ejemplos, y se vuelve a pedir aprobación (Art. I).
7. **Revisión final de rama con un subagente** (Task 6) sobre el diff completo, con la cabecera de `encargo-revision.md`. Para una rama de ediciones de guidance, el hallazgo que nadie más ve es la contradicción entre dos ficheros (T20.3).

**Goal**: dejar `review-spec.md` con un encargo cuyos puntos no se solapan entre lentes, una propuesta de nivel que el dev-lead pueda decidir sin preguntar, y un punto que mire los ejemplos de la spec contra la constitution.

**Architecture**: tres ediciones de forma sobre un único `references/` más una frase en la plantilla que lo nombra. No hay código: la verificación es una campaña de sujetos Sonnet sobre una fixture con defectos plantados, RED contra el fichero vigente y GREEN contra el reescrito, mismos escenarios y mismo fixture.

**Tech Stack**: Markdown (skills y plantillas). Suite del repo: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` (valida anatomía de skills, enlaces relativos y manifests). Sujetos: subagentes `general-purpose` con la skill pegada por prompt.

**Spec**: `./spec.md`

## Restricciones globales

- **Art. I — ley de hierro**: ninguna edición de la skill sin RED documentado antes. Un baseline que no falla recorta el alcance y se vuelve a pedir aprobación; no se fuerza el fallo.
- **Art. II — la forma sigue al fallo**: los tres cambios son de forma (el agente cumple pero con la forma equivocada) → receta/contrato de cómo ES el output, no prohibiciones ni tablas de racionalizaciones.
- **Art. III — idioma**: texto humano en castellano con ortografía correcta; nombres de fichero en inglés kebab-case (`spec-review-lenses-red.md`).
- **Art. VIII — una sola fuente de plantillas**: `spec-template.md` se edita en `skills/sdd-templates/templates/`; ninguna copia en ningún sitio.
- **Art. IX — relación con superpowers**: antes de escribir guidance nueva, comprobar si superpowers ya la cubre; si la cubre, se cita.
- **Política de modelos** (Art. IV): modelo **y** effort explícitos en todo despacho; gama media como suelo para revisores e implementadores que parten de prosa; `fable` y `opus xhigh` prohibidos por defecto. El criterio es turnos, no precio por token.
- **Modo de ejecución por defecto**: `subagent-driven-development`; la ejecución en línea es excepción y va declarada por task con motivo (aquí, Task 3 y Task 5).
- **Art. X — calidad de código** (literal, viaja a todo implementador y revisor):
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes.
  - El revisor marca el incumplimiento como Important, no como estilo.
- **Fuera del alcance de esta task** (no se toca): la tabla de señales de `review-spec.md` §1, el nivel que cada recuento propone, `encargo-revision.md`, la constitution y `NamingConvention.Tests.ps1`.

---

## Phase -1 — Pre-Implementation Gates

- [x] **Simplicity gate**: lo más simple que cumple es editar un solo `references/` y una frase de la plantilla. Descartado: fichero nuevo por lente (dos ficheros que divergen), script que valide la forma de la propuesta (nada que parsear).
- [x] **YAGNI gate**: no se abstrae nada. El encargo tiene dos formas porque hay dos casos reales (un revisor / dos revisores), no por simetría.
- [x] **Brownfield gate**: retrocompatible — una spec ya escrita con la propuesta en una línea sigue siendo válida; el cambio afecta a las specs nuevas. Sin refactor oportunista: los otros dos cambios pendientes sobre este fichero son de la task 0003.
- [x] **Constitution check**: Art. I (campaña antes de editar), Art. II (forma), Art. III, Art. VIII, Art. IX (superpowers no cubre la review de spec: es artefacto del kit).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/spec-review-lenses-red.md` — evidencia del baseline: solape entre lentes, propuesta sin para-qué, nombre real no marcado.
- `tests/spec-review-lenses-green.md` — mismos escenarios con el fichero reescrito, veredicto contra cada fallo del RED.
- Fixture en el scratchpad de sesión (no se versiona): `spec.md` con defectos plantados, `constitution.md`, `mission.md`, `capabilities/<dos capacidades>.md`.

**Modificar**:

- `skills/sdd-start-task/references/review-spec.md` — §2 pasa de línea a bloque decidible; §3 reparte los puntos en dos formas de encargo con frontera explícita y añade el punto de ejemplos contra la constitution en la lente dominio.
- `skills/sdd-templates/templates/spec-template.md` — la frase de ayuda del bloque de decisiones: la propuesta de review es un bloque, no una línea.

**NO se tocan**:

- `review-spec.md` §1 y §4 — la tabla de señales y la incorporación de hallazgos funcionan; §1 lo reescribe la task 0003.
- `encargo-revision.md`, `walkthrough-template.md` — la línea del walkthrough («Review de spec: no | 1 revisor (lente) | 2 revisores · hallazgos N, aceptados M») sigue valiendo sin cambios.
- `.docs/sdd/constitution.md` — la regla general de citar evidencia sin nombre propio es de la task 0002.

### 1.2–1.5 Modelo de datos, migraciones, contratos API, UX

No aplica. Sin schema, sin migración (`.docs/sdd/` no cambia de estructura) y sin interfaz de usuario.

### 1.6 Dependencias

- `capabilities/task-flow.md` — la fusión del delta al cerrar toca tres requisitos de esta capacidad.
- Tickets de origen: `field-reports/20260920-task-0009-init-instantiator.md` §4 y §16, `field-reports/20260920-task-0006a-ui-subagents.md` §13, petición 36 del acta de la v1.1.0.
- Ninguna librería ni servicio nuevo.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El fixture no reproduce el solape del campo (4/18) | Media | Alto — sin RED no se escribe el reparto | Los siete puntos plantados uno a uno y con un defecto visible desde los dos ángulos; si aun así no solapa, se recorta la task a los otros dos cambios y se vuelve al gate |
| El GREEN produce líneas por lente **genéricas** («comprobaría contradicciones con capacidades») en vez de ancladas a la spec | Media | Medio — la propuesta seguiría sin ayudar a decidir | El requisito lo exige («ninguna de esas líneas es genérica: cita un requisito, una sección o un valor de esta spec») y el GREEN lo cuenta como criterio propio, no como adorno |
| Conflicto en `spec-template.md` con la task 0003 | Media | Bajo | Una sola frase, aviso en el walkthrough y en el roadmap; el roadmap ya declara el fichero caliente |
| El reparto hace perder un Crítico que hoy caza la lente que lo pierde | Baja | Alto | Criterio de aceptación explícito: ningún Crítico del RED desaparece en el GREEN |

### 1.8 Rollout

Directo: entra en la release 1.2.0 con el resto de las tasks del tramo. No hay migración — una spec ya escrita no se reescribe.

### 1.9 Excepciones a la constitution

Ninguna. La ejecución en línea de las Tasks 3 y 5 es la excepción prevista por el propio Art. IV, declarada con motivo en su campo `Ejecución`.

---

## 2. Tasks

Seis tasks, registro vivo en `tasks.md`.

### Task 1 — Fixture de la campaña

**Modelo**: n/a (hilo principal)
**Ejecución**: en línea — es el instrumento de medida, equivalente a los tests RED que el hilo escribe antes de despachar
**Tests RED**: n/a (esta task ES el test)

**Ficheros**: crear en el scratchpad de sesión `fixture/spec.md`, `fixture/constitution.md`, `fixture/mission.md`, `fixture/capabilities/*.md`

- [ ] **Step 1**: proyecto ficticio neutro (sin nombre de cliente real del equipo), con dos capacidades escritas en la forma del kit y una constitution con artículo de idioma y una regla de producto verificable.
- [ ] **Step 2**: `spec.md` de una task del proyecto ficticio con **un defecto plantado por punto del encargo**: (1) un `ADDED` que cambia un requisito existente de la capacidad, (2) un THEN no verificable, (3) algo que el Intent promete y el Scope no lista, (4) una decisión tomada en el Approach que no está en «Decisiones a validar», (5) un rol nuevo descrito solo por lo que hace, (5 bis) un tope y un aviso nuevos sin «Reglas de la capacidad», (6) un formato de fichero nuevo sin declarar, (7) **un ejemplo que usa el nombre de un proyecto real del equipo**.
- [ ] **Step 3**: verificación en disco de que los siete defectos están y de que el fixture no telegrafía la conducta buscada (nada en la constitution del fixture habla de lentes, duplicados ni ejemplos).
- [ ] **Step 4**: commit del plan y del registro; el fixture no se versiona (es desechable, `architecture.md`).

### Task 2 — Campaña RED (4 sujetos)

**Modelo**: Sonnet, effort medium — el que `review-spec.md` §3 prescribe para los revisores de spec
**Ejecución**: por subagente (4 en paralelo, una oleada)
**Tests RED**: esta task ES el RED

**Ficheros**: ninguno del repo; salida a notas del scratchpad

- [ ] **Step 1**: dos sujetos-revisor con el encargo **vigente** de §3, uno por lente, sobre el mismo fixture.
- [ ] **Step 2**: dos sujetos-propuesta: reciben `review-spec.md` vigente y el fixture, y escriben la línea de propuesta de nivel para esa spec.
- [ ] **Step 3**: recuento — hallazgos por lente, duplicados entre lentes (mismo defecto reportado por los dos), Críticos, si alguno marca el nombre de proyecto real, y si la propuesta dice para qué sirve cada lente y cuál es el mínimo.
- [ ] **Step 4**: veredicto del RED. Si no hay solape ni fallo de forma, **parar** y volver al gate con el alcance recortado (decisión 6).

### Task 3 — Reescritura de `review-spec.md` y frase de la plantilla

**Modelo**: n/a (hilo principal)
**Ejecución**: en línea — ~40 líneas de guidance en un fichero ya leído entero; el juicio de redacción es el trabajo (decisión 2)
**Tests RED**: el fixture de la Task 1 y el recuento del RED son el contrato

**Ficheros**: modificar `skills/sdd-start-task/references/review-spec.md`, `skills/sdd-templates/templates/spec-template.md`

- [ ] **Step 1**: §2 — bloque de propuesta con nivel, señales, una línea por lente candidata (qué comprobaría **en esta spec** y la señal que lo motiva) y opción mínima razonable **con su descubierto**. Con ejemplo de la forma, que es lo que la hace llegar (T11: el artefacto vence a la prosa).
- [ ] **Step 2**: §3 — dos formas de encargo declaradas: con dos revisores, puntos disjuntos (dominio 1, 3, 5, 5 bis, 7; técnica 2, 4, 6) más la prohibición de invadir el punto de la otra lente; con un revisor, la lista completa.
- [ ] **Step 3**: §3 — punto nuevo (7) en la lente dominio: ejemplos, valores y fixtures contra la constitution, y sin cliente, proyecto o persona reales donde un ejemplo neutro sirva igual.
- [ ] **Step 4**: `spec-template.md` — la propuesta de review es el **bloque** que abre «Decisiones a validar».
- [ ] **Step 5**: suite verde (`Invoke-Pester -Path tests`) y commit.

### Task 4 — Campaña GREEN (4 sujetos)

**Modelo**: Sonnet, effort medium — el mismo del RED; cambiar de modelo invalidaría la comparación
**Ejecución**: por subagente (4 en paralelo, una oleada)
**Tests RED**: mismos escenarios y mismo fixture que la Task 2

**Ficheros**: ninguno del repo; salida a notas del scratchpad

- [ ] **Step 1**: dos sujetos-revisor con el encargo **reescrito**, uno por lente, sobre el mismo fixture.
- [ ] **Step 2**: dos sujetos-propuesta con el `review-spec.md` reescrito.
- [ ] **Step 3**: recuento con los mismos criterios: duplicados < 10 %, ningún Crítico del RED perdido, el nombre real marcado, y la propuesta con las líneas por lente ancladas a la spec (no genéricas) y el mínimo con su descubierto.
- [ ] **Step 4**: si algún criterio falla, REFACTOR del texto y re-verificación del escenario que falló, documentada en el mismo fichero de evidencia (`architecture.md`).

### Task 5 — Evidencia

**Modelo**: n/a (hilo principal)
**Ejecución**: en línea — la evidencia la escribe quien leyó las salidas
**Tests RED**: n/a

**Ficheros**: crear `tests/spec-review-lenses-red.md`, `tests/spec-review-lenses-green.md`

- [ ] **Step 1**: RED con método, fixture, tabla de resultados por escenario, citas textuales de los duplicados y de la propuesta, y positivos que no requieren guidance.
- [ ] **Step 2**: GREEN con veredicto contra cada fallo del RED y los refactors si hubo.
- [ ] **Step 3**: suite verde y commit.

### Task 6 — Revisión final de rama

**Modelo**: Sonnet, effort medium — gama media como suelo para revisores (Art. IV); el diff es Markdown de guidance, no código
**Ejecución**: por subagente
**Tests RED**: n/a

**Ficheros**: ninguno

- [ ] **Step 1**: encargo con la cabecera de `encargo-revision.md` (Restricciones globales de este plan como primera sección) y el diff completo de la rama contra `develop`.
- [ ] **Step 2**: incorporar los hallazgos Crítico e Importante; los Menores, con motivo escrito si se rechazan.
- [ ] **Step 3**: suite verde y commit.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 0,7h
- Estimación de implementación: 1,5–2h (reloj de pared; los 8 sujetos corren en paralelo y su duración no suma — aviso 3 de `estimation.md`). Coste de subagentes: ~520k tokens, del orden de 1,5–2,5 $
- Base de la estimación: seis tasks, tres ediciones de guidance en un fichero ya leído, dos campañas de cuatro sujetos y dos ficheros de evidencia (≈ 10 min cada uno). La guidance va **condicionada al RED**: si el baseline no solapa, el suelo baja a 1h. Referencia: T11 gates-y-reviews (misma familia, 21 sujetos) y T12 review-reforzada (2 sujetos, solo RED)
- Confianza: media

---

## 3. Validación final

- [ ] Suite verde: `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`
- [ ] Los tres criterios del GREEN cumplidos (duplicados < 10 %, ningún Crítico perdido, nombre real marcado, propuesta anclada)
- [ ] Cada requisito del delta tiene su escenario en la campaña (§4)
- [ ] Cierre vía `sdd-end-task` tras la validación del dev-lead

---

## 4. Self-review (cobertura spec → tasks)

- MODIFIED «La spec propone su propio nivel de review por complejidad» → Task 3 Step 1 + Step 4; medido en Tasks 2 y 4, sujetos-propuesta. ✓
- MODIFIED «La review adversarial tensa la spec antes del gate» → Task 3 Step 2; medido en Tasks 2 y 4, sujetos-revisor (duplicados y Críticos). ✓
- ADDED «La review mira los ejemplos de la spec contra la constitution» → Task 3 Step 3; medido con el defecto 7 del fixture. ✓
- Tabla de señales de §1 y nivel propuesto por recuento → N/A (confirmado en spec: es de la task 0003). ✓
- Regla de citar evidencia sin nombre propio en la constitution → N/A (task 0002). ✓
