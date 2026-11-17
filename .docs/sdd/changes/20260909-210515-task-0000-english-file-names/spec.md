---
id: 20260909-210515-task-0000-english-file-names
task: 0000
title: Nombres de fichero en inglés — funcional/ pasa a capabilities/
mode: full
status: done
created: 2026-09-09
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-09
---

# Spec — Nombres de fichero en inglés: `funcional/` pasa a `capabilities/`

## Decisiones que he tomado yo — valida estas

1. **Review de spec: dos revisores, ejecutada** — señales: contrato público, `MODIFIED`, tres o más capacidades, migración. 16 hallazgos, 5 Críticos. Ver `### Hallazgos de la review`.
2. **`funcional/` pasa a `capabilities/`, no a `functional/`** — traduce el concepto, no la palabra: el kit ya define el contenido como «una capacidad por fichero, un sustantivo del dominio». Consecuencia asumida e irreversible: el vocabulario del equipo pasa de «el funcional» a «la capacidad», y las specs históricas seguirán diciendo `funcional/`.
3. **Se corrige `v1.0.0.md` en sitio Y se escribe `v1.1.0.md`.** No basta lo primero: el `README.md` de migraciones aplica «solo las migraciones posteriores a la versión declarada», así que un proyecto cuyo `sdd-kit.json` ya diga `1.0.0` no volverá a ejecutar `v1.0.0.md` jamás y nunca recibiría la corrección. No es hipotético: **este mismo repo declara `{"version": "1.0.0"}` y tiene `funcional/`**. `v1.0.0.md` corregido sirve a quien aún no migró; `v1.1.0.md`, idempotente por predicado (`si existe funcional/`), sirve a quien ya lo hizo.
4. **El ciclo RED→GREEN de Art. I se satisface con un test mecánico, no con una campaña de agentes.** Es la decisión de mayor riesgo constitucional de esta spec: el Art. I dice literalmente que aplica «también a recortes, **traducciones** y pequeños ajustes». La sostengo porque un rename no cambia la conducta que la skill induce —solo una cadena—, y un RED que no puede fallar no es un test. El RED real es mecánico y sí falla hoy. Si rechazas esta decisión, la task crece a campaña A/B sobre 9 skills.
5. **Los ficheros de `.docs/sdd/funcional/` NO se reescriben por sustitución mecánica.** Su contenido son requisitos vivos, y un requisito solo cambia vía el `MODIFIED` que fusiona `sdd-end-task` al cerrar esta misma task. Mecánico es solo el `git mv` de la carpeta y de los ficheros. Sin esta separación, la task violaría la capacidad que ella misma declara.
6. **El histórico sellado no se reescribe**: `.docs/sdd/specs/`, `.docs/sdd/releases/`, `.docs/sdd/changelog.md` y las secciones de releases cerradas de `roadmap.md` siguen diciendo `funcional/`, porque describen lo que se entregó de verdad. Reescribirlos falsearía un changelog Keep a Changelog ya sellado. Consecuencia: el test no puede ser una lista negra de exclusiones — va por **lista blanca** de rutas vivas.
7. **Alcance: los nombres públicos del kit más las 4 capacidades de este repo.** No reinterpreto el Art. III, que no admite cualificación: el kit lo incumple hoy en 27 ficheros y esta task no los arregla todos. Los ~40 nombres internos restantes (`skills/*/references/*.md`, `tests/*-red.md`, fixtures) quedan como **deuda declarada en el roadmap**, no como excepción a la regla.
8. **El slug inglés de esta carpeta es una excepción puntual, no la nueva norma.** El naming de `specs/` lo fija el Art. IV y cambiarlo es «cambio mayor»; esta task no lo reabre. El motivo del slug: escribirlo en castellano sería repetir el fallo dentro de la task que lo arregla.
9. **Se trabaja en `master`** — el repo no tiene `develop` ni un solo merge en su historial. No invento git-flow que este proyecto nunca ha usado.

### Hallazgos de la review

**Lente dominio**

1. **Aceptado** — Crítico · falta el `MODIFIED` de «Un proyecto ya inicializado se migra, no se re-inicializa», que dice «ni vuelca `funcional/`» → declarado en el delta de `migration`.
2. **Aceptado** — Crítico · `migration` cambia dónde aterriza el fichero heredado y no lleva «Reglas de la capacidad» → subsección añadida a `migration`.
3. **Aceptado** — Crítico · la regla «Idioma de los nombres» inventaba la cualificación «que el kit fija a un proyecto», ausente del Art. III → redacción igualada al texto literal del artículo; la restricción de alcance pasa a ser decisión explícita (7), no un recorte de la regla.
4. **Aceptado** — Importante · el Intent solo justificaba lo «fijado a consumidores» y el Scope añadía las capacidades propias → Intent extendido con el argumento del dogfooding (Art. VII).
5. **Aceptado** — Importante · la sección `estimation` no llevaba marcador ni escenario → eliminada del delta; el rename de su fichero es mecánico y no toca ningún requisito.
6. **Aceptado** — Importante · el rename mecánico reescribiría requisitos vivos saltándose el `MODIFIED` de `sdd-end-task` → decisión 5.
7. **Aceptado** — Menor · la decisión de alcance del testing vivía enterrada en el Approach → subida a decisión 4.
8. **Aceptado** — Menor · convención inconsistente del `(antes: …)` → se cita el título estable cuando el título cambia, y el fragmento literal del cuerpo cuando el título se conserva. Aplicado a los 5 `MODIFIED`.

**Lente técnica**

9. **Aceptado** — Crítico · la cifra «34 ficheros» no se sostenía; el recuento real con el criterio descrito es **27** → corregida en el Approach.
10. **Aceptado** — Crítico · excluir solo `specs/` deja dentro `changelog.md`, `roadmap.md` y `releases/v1.0.0/*`: o se falsea un changelog sellado, o el test no pasa nunca → decisión 6, y el test pasa a lista blanca.
11. **Aceptado** — Importante · `README.md` de la raíz cita `funcional` en el catálogo de plantillas y quedaba fuera → añadido al Scope y a la lista blanca del test.
12. **Aceptado** — Importante · la exención del RED→GREEN de agentes estaba en prosa y no en las decisiones → decisión 4.
13. **Aceptado** — Crítico · corregir `v1.0.0.md` en sitio no alcanza a quien ya declaró `1.0.0`, y este repo es ese caso → decisión 3: se escribe además `v1.1.0.md`.
14. **Aceptado** — Importante · el test solo vigilaba `funcional` y `changelog-cliente`, dejando sin defensa los otros tres renames → vigila los seis tokens.
15. **Aceptado** — Menor · no se decía si el slug inglés sienta precedente → decisión 8.
16. **Aceptado** — Menor · `estimation` era el único bloque sin GIVEN/WHEN/THEN → eliminado del delta (hallazgo 5).

## Intent

El Art. III de la constitution exige «nombres de skill y de fichero en inglés kebab-case». El kit lo incumple en 27 ficheros, y de forma más grave en los nombres que **fija a los proyectos consumidores**: la carpeta `funcional/`, su fichero de legado `legado.md`, el placeholder `funcional/<capacidad>.md` y `changelog-cliente.md`.

No es un descuido puntual: el placeholder lo propaga por diseño. `funcional-template.md` define capacidad como «sustantivo del dominio», y en un equipo que trabaja en castellano ese hueco produce nombres castellanos por sí solo — este mismo repo tiene 4 capacidades y 3 salieron en castellano. El agravante: `onboarding.md` registra que la entrevista de init pregunta al proyecto por «el idioma de los nombres». El kit hace esa pregunta a terceros y nunca se la aplicó.

Por eso el rename alcanza también a las capacidades de este repo, que no son «nombres que el kit fija» sino nombres que el kit **produjo en sí mismo** con la plantilla defectuosa: son la evidencia del fallo, y el Art. VII (dogfooding) impide arreglar la plantilla para terceros y dejar el propio repo como contraejemplo.

La ventana es ahora: ningún consumidor ha migrado a v1.0.0 todavía, así que nada está roto ahí fuera.

## Scope

- **Entra**: `funcional/` → `capabilities/`; `funcional/legado.md` → `capabilities/legacy.md`; placeholder `funcional/<capacidad>.md` → `capabilities/<capability>.md`; `changelog-cliente.md` → `client-changelog.md`; las plantillas `funcional-template.md` → `capability-template.md` y `changelog-cliente-template.md` → `client-changelog-template.md`; las 4 capacidades de este repo (`estimacion.md` → `estimation.md`, `migracion.md` → `migration.md`, `flujo-de-task.md` → `task-flow.md`, `onboarding.md` sin cambio); las referencias a esos nombres en `skills/`, en los documentos de anclaje vivos de `.docs/sdd/` y en `README.md`; `migrations/v1.0.0.md` corregido en sitio y `migrations/v1.1.0.md` nuevo; el test que impide la regresión.
- **No entra**: el histórico sellado (`.docs/sdd/specs/`, `.docs/sdd/releases/`, `.docs/sdd/changelog.md`, las secciones de releases cerradas de `roadmap.md`), que sigue nombrando `funcional/` porque describe lo entregado; los ~40 nombres internos de este repo que el kit no fija a nadie (`skills/*/references/*.md`, `tests/*-red.md` y `*-green.md`, fixtures), que van a deuda; los slugs de `specs/` históricas; renombrar skills, ya en inglés.

## Approach

Rename con `git mv` más sustitución de referencias en las rutas vivas, verificado por un test que no existía.

**Dos velocidades, porque el contenido no es homogéneo.** El `git mv` de ficheros y carpetas es mecánico. La sustitución de texto también, salvo en `.docs/sdd/capabilities/`: ahí el contenido son requisitos vivos y solo cambia vía los `MODIFIED` que fusiona `sdd-end-task` al cerrar esta task. Mezclarlo sería saltarse la capacidad que esta misma spec declara.

**El test.** El Art. I exige RED→GREEN y menciona las traducciones, pero un rename no cambia la conducta que una skill induce, así que una campaña de agentes mediría algo que no puede fallar. El RED mecánico sí falla:

1. **Test Pester nuevo** que recorre una **lista blanca de rutas vivas** —`skills/`, `README.md` y los documentos de anclaje vivos de `.docs/sdd/`— y falla si aparece cualquiera de los seis tokens renombrados: `funcional`, `changelog-cliente`, `legado`, `estimacion`, `migracion`, `flujo-de-task`. Lista blanca y no lista negra porque el histórico sellado debe seguir diciendo los nombres viejos (decisión 6). Falla hoy en 27 ficheros y pasa cuando el rename está completo; se suma a los 136 Pester del repo. Es la defensa permanente contra el fallo original: un nombre que se cuela sin que nadie lo vea.
2. **Verificación de conducta solo donde el rename sí la cambia**: las migraciones, porque alteran lo que se ejecuta en proyectos ajenos. Dos fixtures, uno por ruta de entrada: un proyecto con `funcional.md` heredado y sin marcador (ruta `v1.0.0.md`), y un proyecto con `funcional/legado.md` ya creado y `sdd-kit.json` en `1.0.0` (ruta `v1.1.0.md`). Ambas desembocan en `capabilities/legacy.md` con su nota.

Qué ficheros, en qué orden, modelo y effort por task y coste estimado son contenido de `plan.md`.

## Delta de comportamiento

### Capacidad: `task-flow` *(antes `flujo-de-task`)*

**MODIFIED — Los documentos de anclaje nombran `capabilities/`** (antes: "Los documentos de anclaje nombran `funcional/`")
- GIVEN cualquier skill o plantilla que cite la carpeta de capacidades
- WHEN se lee el contexto SDD
- THEN la referencia es a la carpeta `capabilities/` y a sus capacidades

**MODIFIED — Brownfield no vuelca `capabilities/`** (antes: "Brownfield no vuelca `funcional/`")
- GIVEN un proyecto existente inicializado con `sdd-init-brownfield`
- WHEN se generan los documentos de anclaje
- THEN `capabilities/` no se crea ni se rellena: aparece con la primera task que toque una capacidad

**MODIFIED — El cierre fusiona el delta en la verdad viva** (título estable; antes decía: "cada `ADDED` se añade a `funcional/<capacidad>.md`")
- GIVEN una task cerrándose vía `sdd-end-task` con un delta en su spec
- WHEN se ejecuta el paso de fusión
- THEN cada `ADDED` se añade a `capabilities/<capability>.md`, cada `MODIFIED` sustituye el requisito anterior, cada `REMOVED` lo quita, y el walkthrough referencia los escenarios del delta como casos del smoke
- AND `sdd-end-task` no crea ningún fichero de capacidad que la spec no haya declarado

**MODIFIED — El delta declara el comportamiento por capacidad** (título estable; antes decía: "si la capacidad no existe en `funcional/`, su creación aparece en «Decisiones a validar»")
- GIVEN una spec que cambia comportamiento observable
- WHEN se escribe su sección de delta
- THEN cada requisito va bajo una capacidad nombrada, marcado `ADDED`, `MODIFIED (antes: …)` o `REMOVED (motivo)`, con al menos un escenario `GIVEN / WHEN / THEN`
- AND si la capacidad no existe en `capabilities/`, su creación aparece en "Decisiones a validar"
- AND si un requisito introduce datos, nombres, topes, avisos o una condición de conflicto nuevos, la capacidad lleva su subsección «Reglas de la capacidad» con solo las entradas que cambian; `sdd-end-task` sustituye o añade cada entrada por su nombre
- AND la lente dominio reclama las entradas que falten y marca como Crítico una regla que contradiga la constitution

**MODIFIED — La consulta lee la capacidad, no las specs** (título estable; antes decía: "WHEN existe `funcional/<capacidad>.md`")
- GIVEN una pregunta de comportamiento ("¿qué hace hoy X?") en `sdd-consult`
- WHEN existe `capabilities/<capability>.md`
- THEN la respuesta se ancla en ese fichero, no en la reconstrucción a partir de specs históricas

**Reglas de la capacidad**
- **Idioma de los nombres**: nombres de skill y de fichero en inglés kebab-case (Art. III, literal). El contenido de los documentos sigue en castellano.
- **Dónde viven los datos**: las capacidades viven en `.docs/sdd/capabilities/`, un fichero por capacidad.
- **Límites** / **Avisos** / **Regla ante conflicto**: no aplica — este delta no los toca.

### Capacidad: `migration` *(antes `migracion`)*

**MODIFIED — El `funcional.md` heredado se conserva como legado** (título estable; antes decía: "el fichero pasa a `funcional/legado.md`")
- GIVEN un proyecto con `funcional.md`
- WHEN se aplica la migración a v1.0.0
- THEN el fichero pasa a `capabilities/legacy.md` con una nota de excepción temporal, y ninguna capacidad se crea de golpe

**MODIFIED — Un proyecto ya inicializado se migra, no se re-inicializa** (título estable; antes decía: "no regenera los documentos de anclaje ni vuelca `funcional/`")
- GIVEN un proyecto con `.docs/sdd/` y la petición «actualízame al kit»
- WHEN el agente invoca `sdd-init-brownfield`
- THEN lee `sdd-kit.json` (o asume anterior a v0.2.0 si no existe), aplica en orden las migraciones posteriores a esa versión hasta la mayor disponible, con gate por fichero, y escribe el marcador al final
- AND no regenera los documentos de anclaje ni vuelca `capabilities/`

**ADDED — Un proyecto que ya migró a v1.0.0 recibe el rename por `v1.1.0.md`**
- GIVEN un proyecto cuyo `sdd-kit.json` declara `1.0.0` y que tiene `funcional/` en disco
- WHEN se aplica la migración a v1.1.0
- THEN `funcional/` pasa a `capabilities/`, `legado.md` a `legacy.md` y `changelog-cliente.md` a `client-changelog.md`, con gate por ser rename masivo
- AND si el proyecto no tiene `funcional/`, el paso se salta y se dice — la migración es idempotente

**Reglas de la capacidad**
- **Dónde viven los datos**: las migraciones viven en `skills/sdd-init-brownfield/references/migrations/vX.Y.Z.md`; la versión aplicada, en `.docs/sdd/sdd-kit.json` del proyecto.
- **Idioma de los nombres**: los nombres que una migración crea o renombra en el proyecto van en inglés kebab-case (Art. III).
- **Límites** / **Avisos** / **Regla ante conflicto**: no aplica.

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-09 | aprobada en conversación (frontmatter corregido en el cierre) |
