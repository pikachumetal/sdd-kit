---
release: v1.0.0
title: Acta de release — v1.0.0
created: 2026-09-09
source: hallazgos del hackaton del equipo (2026-09-09) y dos consultas del dev-lead; sin demo de cliente
---

# Acta de release — v1.0.0 (2026-09-09)

Fuente: los dos documentos del hackaton del equipo, archivados al lado — [research-hackaton.md](research-hackaton.md) (hallazgos sobre dos retos reales, SifAcademy y SifRest) y la propuesta de reviews que vive como [`research.md` de T11](../../specs/20260909-131802-task-0000-gates-y-reviews/research.md)— más las consultas del dev-lead del 2026-09-07 (alineación con superpowers, progressive disclosure, workflow) y del 2026-09-09 (gates, disparo de skills). Sin demo ni cliente externo: el cliente del kit es el propio equipo.

**Versión.** La release se planificó y se trabajó como **v0.6.0, RC hacia 1.0.0**. En el cierre, el dev-lead decidió cerrarla directamente como **1.0.0**, contra la recomendación del agente (`versionado.md` reserva 1.0.0 para la puesta en producción y el kit sigue local-only). Los artefactos históricos (specs, walkthroughs, evidencia de tests) conservan el nombre v0.6.0 con el que se escribieron; los documentos vivos, el marcador y el fichero de migración pasan a 1.0.0.

## 1. Inventario y triage

Cada hallazgo del hackaton, con su sección de origen, y la decisión del dev-lead (todas tomadas en la sesión, item a item, al abrir las tasks; «Todo en v0.6.0 antes de cerrar»).

| # | Petición | Ref | Área | Recomendación | Decisión |
| --- | --- | --- | --- | --- | --- |
| 1 | Review adversarial de spec proporcional a la complejidad, con lentes | propuesta-reviews §4.1 | `sdd-start-task` | rúbrica + revisor por lente | **ya-cubierto** — T11 |
| 2 | Review reforzada opt-in por task (refutador) | propuesta-reviews §4.3 | `sdd-start-task` | solo si un RED con bug plantado lo justifica | **ya-cubierto** — T12: la review de superpowers con la cabecera de restricciones cazó el bug 4/4; sin cambio en el kit |
| 3 | Tests RED escritos por el hilo principal antes de despachar | research §1 | `sdd-start-task`, `plan-template` | paso + cabecera del implementador | **ya-cubierto** — T16 |
| 4 | Un E2E por escenario, siembra por API, una aserción | research §1.3 | `plan-template` | recomendación sin obligar | **ya-cubierto** — T16 (ayuda del campo `Tests RED`) |
| 5 | Las cinco reglas que el agente decide al azar | research §2 | `sdd-init-*`, `funcional-template`, `spec-template`, `review-spec` | bloque de entrevista + sección + lente | **ya-cubierto** — T17 |
| 6 | Release pequeña primero y smoke por tramo | research §3 | `sdd-start-release`, `sdd-end-release` | medir; línea de smoke | **ya-cubierto** — T15: el baseline ya propone pequeño 2/2; línea de smoke en el roadmap colapsado |
| 7 | Comentarios que citan documentos | research §4 | Art. X, `plan-template` | segunda regla de comentarios | **ya-cubierto** — T14 |
| 8 | Estimación: dos poblaciones y un ratio por proyecto | research §5 | `estimation.md` | anotar la evidencia | **ya-cubierto** — anotado en `estimation.md` (2026-09-09) |
| 9 | Defaults confirmados (1-2 subagentes, review no por defecto, restricciones en cada encargo) | research §6 | — | registrar | **ya-cubierto** — confirmación registrada aquí; sin cambio |
| 10 | Resumen para personas generado desde los artefactos | research §7 | `sdd-end-release` | sin prioridad | **backlog** — conveniencia, no calidad |
| 11 | Auto-lanzado de skills por `description` y dos vías del Gate 1 | consulta 2026-09-09 (compañero del dev-lead) | `sdd-start-task` | medir | **ya-cubierto** — T13: la `description` dispara sola 2/2; Gate 1 con dos vías |
| 12 | Validación del trabajo por el usuario antes de `sdd-end-*` | consulta 2026-09-09 | `sdd-start-task`, `sdd-end-task` | gate | **ya-cubierto** — T11 paso 7 |
| 13 | «NO COMENTARIOS AI SLOP», duplicado donde haga falta | consulta 2026-09-09 | Art. X | artículo que viaja literal | **ya-cubierto** — T7 (Art. X) y T14 |
| 14 | Changelog de cliente además del técnico | decisión pendiente del roadmap | `sdd-templates`, `sdd-init-*` | opt-in derivado de las release notes | **ya-cubierto** — T18 (decidido en este cierre) |

**Decisiones de release cerradas en esta sesión** (estaban «pendientes dentro de v0.6.0»):

- **Kit de nivel 2 → segundo plugin**, cuando un proyecto lo pida; el kit de proceso se queda agnóstico. Sin task.
- **Hosting → sigue local-only**; la decisión pasa a la siguiente release, sin plazo.
- **Changelog de cliente → sí**, opt-in por proyecto (T18).
- **Versión → 1.0.0** (ver arriba).

## 2. Cambios de requisito detectados

- **`funcional/flujo-de-task.md`** — «El delta declara el comportamiento por capacidad» pasó a `MODIFIED` en T17 (la review de dominio detectó un `ADDED` con el mismo GIVEN/WHEN); la capacidad `onboarding` nació en T17 y `migracion` en T10. Fusionados por `sdd-end-task`; nada pendiente.
- **`versionado.md`** — la decisión de cerrar 1.0.0 sin distribución contradice su regla. No se cambia la regla: queda como excepción registrada en esta acta.

## 3. Retro

- **Agregado de la release** (estimation-log, tasks del 2026-09-07 al 2026-09-09, T1–T18 sin el spike T9): estimado **23,1 h** · real **15,3 h** · ratio **0,66**. Dos patches sin estimación (0,15 h cada uno). Mediana global del log tras la release: 0,53 (20 artefactos con ratio); por tipo, docs 0,5 e infra/tooling 0,9. Desviación mayor: T2 progressive disclosure (3,5 h → 5,5 h, ratio 1,57: tres olas de A/B); menor: T3 y T10 (0,33).

- **Comprobación de los action items de v0.5.0**:
  - **[A6] Estimar la guidance condicionada al RED** — **aplicado**: el plan de T1 la expresó como rango condicional y las specs lite lo repiten («si el baseline ya…, no se escribe»). El ratio agregado sube de 0,18 (v0.5.0) a 0,66 y ya no lo domina la guidance desautorizada.
  - **[A7] Resolución de `superpowers` en entorno limpio** — **aplicado** con evidencia indirecta: `installed_plugins.json` de otro repo del equipo muestra `sdd-kit` instalado el 2026-09-07 y `superpowers` resuelto con `auto: true` en la misma instalación. Sin error `dependency-unsatisfied`.

- **Qué funcionó**:
  - **El RED recortó el alcance nueve veces** (T12, T13, T14 en parte, T15, T16 en parte, T18 y tres cortes en T2): guidance que se iba a escribir y el baseline ya hacía. Coste medio de una campaña: 1–2,5 $ y 5 min de reloj.
  - **Un artefacto bien formado es guidance**: la cabecera de encargo (T11), la sección del funcional (T17) y el fichero de cliente (T18) hicieron lo que la prosa no conseguía (el revisor final sin restricciones 3/3 en prosa → 3/3 con artefacto).
  - **El método headless creció sin romperse**: sujetos que despachan subagentes (T9), copia limpia del kit (T10), streams reutilizados como RED (T16), entrevista simulada con persona (T17) y cierre de release headless (T18).
  - **Los gates costaron menos que saltárselos**: parar a pedir validación 0,25 $ por sujeto; cerrar sin ella 0,7–1,1 $ (T11).
  - **Doce tasks y dos patches en tres días**, con Pester en verde en cada commit desde T8.

- **Qué corregir**:
  - **Las estimaciones de docs siguen altas** (mediana 0,5): la unidad real de un ciclo Art. I son minutos de campaña más redacción de evidencia; `estimation.md` ya lo dice, los planes aún estiman por encima.
  - **Una línea que pide un número invita a inventarlo** (T18: «smoke: 0 hallazgos» sin smoke en 1 de 2). Corregido nombrando la salida honesta; vigilar el patrón en otras plantillas.
  - **Dos verificaciones quedan sin medir por método**: la lente dominio con las cinco reglas (solo corre si el usuario la activa) y la entrevista de brownfield (comparte la frase con greenfield). Anotadas en `tests/reglas-capacidad-green.md`.
  - **1.0.0 sin distribución**: la versión dice producción y el kit sigue instalándose por ruta local. La primera migración real (Alybo, MDT) es la prueba de producción que la versión promete.

- **Action items nuevos** (verificables):
  - **[A8] Migrar Alybo y MDT con `sdd-init-brownfield`** — se verifica con el `sdd-kit.json` de cada proyecto en `1.0.0`, `funcional/legado.md`, sin `templates/` y con `chore(sdd): migrar al kit v1.0.0` en su historial, antes de la siguiente release del kit.
  - **[A9] Estimar los ciclos Art. I en minutos de campaña** — se verifica con que el ratio mediano de las tasks docs de la siguiente release esté entre 0,7 y 1,3.
  - **[A10] Medir la lente dominio con las cinco reglas** — se verifica con un GREEN en `tests/` donde el usuario (o su simulación) active la review sobre una spec con datos nuevos, en la primera task que toque `review-spec.md`.

- **Smoke de la release**: por tramo (GREEN E2E de cada task con el kit al día) y final (Pester 136/136, `claude plugin validate --strict`, implementación completa de una task con el kit en T16 A/B). Hallazgos por tramo saldados dentro de la release: 2 (patches de T7: etiqueta lite y residuales de la revisión final). Final: 0.

- **Compatibilidad con superpowers**: instalada 6.3.0, la misma validada el 2026-09-07 (README); el mapeo de vías y el bloque de restricciones no se re-testan porque no hubo minor nuevo.
