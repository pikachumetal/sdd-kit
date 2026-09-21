---
id: 20260920-220930-task-0011-spec-review-lenses
task: 0011
title: Review de spec — lentes sin solape y propuesta que ayuda a decidir
mode: full
status: approved
created: 2026-09-21
author: Claude Opus 5 (1M context)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-21
---

# Spec — Review de spec: lentes sin solape y propuesta que ayuda a decidir

## Decisiones que he tomado yo — valida estas

1. **Review de spec propuesta: sin review — señales: `MODIFIED` (2 requisitos de `task-flow`) y, discutible, contrato público (la forma de la propuesta la nombra `spec-template.md` y la registra `walkthrough-template.md`)**. Para qué serviría cada lente aquí: *dominio* comprobaría que los dos `MODIFIED` citan literal el texto vigente de `task-flow` y que el requisito nuevo pertenece a esa capacidad y no a otra; *técnica* comprobaría que el cambio de forma de la propuesta no deja a `spec-template.md` y `walkthrough-template.md` describiendo un formato que ya no existe. Mínimo razonable y elegido: **ninguna** — 2 señales, sin datos ni dependencias, y el dominio se ha leído entero en esta sesión (`capabilities/task-flow.md`, los tres tickets de origen, la referencia vigente). Deja sin cubrir la verificación independiente de los literales del `MODIFIED`, que asumo yo. *(Este bloque es, a propósito, la forma que la task propone: dogfooding del entregable.)*
2. **Modo full, no lite** — el predicado de lite lo habilitaría (flujo existente y legible, sin schema, un área), pero la campaña de sujetos del Art. I no cabe en media jornada y el roadmap la tasa `M`. Con plan, porque lo que hay que decidir es el diseño de la campaña, no el texto.
3. **El reparto de puntos aplica solo con dos revisores.** Con un revisor la lente única recibe **todos** los puntos: el ticket 0009 §4 reparte para no duplicar, y repartir también en el caso de un revisor dejaría cuatro puntos sin nadie. El encargo pasa a tener dos formas declaradas.
4. **El punto nuevo de constitution va a la lente dominio, no a las dos** — ponerlo en ambas garantiza el duplicado que esta task viene a quitar. Con un revisor único siempre se cubre (decisión 3).
5. **La frontera entre lentes se escribe como prohibición explícita** («si el hallazgo pertenece al punto de la otra lente, no lo reportes»), no solo como reparto de puntos: un hueco es visible desde los dos ángulos, y el reparto por sí solo no impide que los dos lo cuenten.
6. **Toco `spec-template.md` con una frase** (la propuesta pasa de línea a bloque). Es fichero caliente de la task 0003; el aviso va en el walkthrough y en el roadmap.
7. **Fuera de esta task**: la regla general «la evidencia de campo se cita sin nombre propio» en la constitution (es de la 0002), ampliar `NamingConvention.Tests.ps1` al contenido de `skills/` (0016), y los dos cambios que la 0003 hace sobre este mismo fichero (incentivo invertido de la rúbrica, punto de pertenencia de capacidad). Esta task no reescribe la tabla de señales.
8. **Campaña con subagentes-sujeto, no sesiones headless** — el revisor de spec es un subagente ordinario que no despacha a nadie, así que el método barato (skill pegada por prompt) mide lo mismo. Coste declarado en el plan.

## Intent

La review de spec funciona —18 hallazgos aceptados en la task 0009, dos `MODIFIED` no declarados cazados— pero paga de más y no ayuda a decidir. Los puntos 1–4 del encargo son comunes a las dos lentes: 4 de 18 hallazgos salieron duplicados, a ~100k tokens por revisor. Y la rúbrica entrega un número («dos revisores, 6 señales») que deja al dev-lead preguntando «¿es necesario?» sin nada con lo que responder, así que el agente improvisa el coste/beneficio en el turno siguiente. Tercer hueco, medido en campo: una spec usó el nombre de un proyecto real como ejemplo y ningún revisor lo marcó, porque el encargo no mira los ejemplos.

## Scope

- Entra: `skills/sdd-start-task/references/review-spec.md` — §2 (forma de la propuesta), §3 (encargo con puntos repartidos, frontera entre lentes, punto de ejemplos contra la constitution).
- Entra: una frase de `skills/sdd-templates/templates/spec-template.md` — la propuesta es un bloque, no una línea.
- Entra: evidencia `tests/spec-review-lenses-red.md` y `tests/spec-review-lenses-green.md` (Art. I).
- No entra: la tabla de señales de §1, el nivel que cada recuento propone, ni el incentivo invertido de declarar una capacidad (0003).
- No entra: la regla de citar evidencia de campo sin nombre propio en la constitution (0002) ni el test de convención sobre el contenido de `skills/` (0016).
- No entra: las reviews de task y de rama (`encargo-revision.md`) ni el coste de los revisores de implementación (0005, 0006).

## Approach

Tres cambios sobre el mismo fichero, todos de **forma** (Art. II: el fallo no es de disciplina, es que el output sale con la forma equivocada), más una frase en la plantilla que lo nombra.

1. **Encargo en dos formas declaradas.** Con dos revisores, los puntos van disjuntos —dominio: contradicciones con `capabilities/`, alcance oculto, complemento de visibilidad, las cinco reglas y los ejemplos contra la constitution; técnica: escenarios no verificables, decisiones ocultas, contratos/datos/dependencias— y cada encargo lleva la prohibición de invadir el punto del otro. Con un revisor, la lente única recibe la lista completa.
2. **La propuesta se presenta como bloque decidible**: nivel, señales contadas, una línea por lente candidata que dice **qué comprobaría en esta spec citando la señal que lo motiva**, y la opción mínima razonable **con lo que deja sin cubrir**. Lo que convierte la propuesta en decisión no es el coste sino el descubierto.
3. **Punto nuevo en la lente dominio**: los ejemplos, valores y fixtures de la spec no contradicen la constitution del proyecto y no identifican un cliente, proyecto o persona reales donde un ejemplo neutro serviría igual.

La verificación es una campaña de sujetos con la misma spec fixture para los dos brazos, con hallazgos plantados que cubren los siete puntos más un nombre de proyecto real en un ejemplo. Se mide: porcentaje de hallazgos duplicados entre lentes, que no se pierda ningún Crítico al repartir, si algún revisor marca el nombre real, y si la propuesta de nivel sale anclada a la spec o genérica.

## Delta de comportamiento

### Capacidad: `task-flow`

**MODIFIED — La spec propone su propio nivel de review por complejidad** (antes: "THEN la primera línea de «Decisiones a validar» dice el nivel propuesto (sin review · un revisor con su lente · dos revisores) y las señales contadas que lo justifican / AND el usuario activa o rechaza; en modo lite no se propone")
- GIVEN una spec en modo full recién redactada
- WHEN el agente la presenta en el gate
- THEN el bloque que abre «Decisiones a validar» dice el nivel propuesto (sin review · un revisor con su lente · dos revisores), las señales contadas que lo justifican, **una línea por lente candidata con qué comprobaría en esta spec y la señal que lo motiva**, y la **opción mínima razonable con lo que deja sin cubrir**
- AND ninguna de esas líneas es genérica: cita un requisito, una sección o un valor de esta spec
- AND el usuario activa o rechaza; en modo lite no se propone

**MODIFIED — La review adversarial tensa la spec antes del gate** (antes: "THEN cada hallazgo aparece en «Decisiones a validar» como aceptado (con el cambio en la spec) o rechazado con motivo, antes de pedir la aprobación")
- GIVEN un nivel de review activado por el usuario
- WHEN el agente despacha el revisor con la spec, la constitution, la mission y las capacidades tocadas
- THEN cada hallazgo aparece en «Decisiones a validar» como aceptado (con el cambio en la spec) o rechazado con motivo, antes de pedir la aprobación
- AND con dos revisores cada lente recibe puntos disjuntos y el encargo le prohíbe reportar lo que pertenece al punto de la otra
- AND con un revisor la lente única recibe todos los puntos

**ADDED — La review mira los ejemplos de la spec contra la constitution**
- GIVEN una spec cuyos ejemplos, valores o fixtures citan datos concretos
- WHEN la lente dominio la revisa
- THEN marca el ejemplo que contradiga la constitution del proyecto y el que identifique un cliente, proyecto o persona reales donde un ejemplo neutro serviría igual

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-21 | aprobada en el gate único spec+plan (opción «8 sujetos, ~2 $», cuya descripción decía «Aprobar esto aprueba spec y plan») |
