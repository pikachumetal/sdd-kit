---
id: 20260920-220930-task-0011-spec-review-lenses
task: 0011
title: Walkthrough — Review de spec: lentes sin solape y propuesta que ayuda a decidir
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-21
---

# Walkthrough — Review de spec: lentes sin solape y propuesta que ayuda a decidir

## 1. Cambios realizados

- **`skills/sdd-start-task/references/review-spec.md`** (`62f49f5`, `ddba5e0`, `d6c6c8c`):
  - §2: la propuesta de nivel pasa de una línea a un **bloque**: nivel, señales, una línea por lente que dice qué comprobaría **en esa spec** y qué señal lo motiva, y la opción mínima razonable con lo que deja sin cubrir. Lleva un ejemplo completo de otro dominio (facturación).
  - §3: los puntos del encargo **se reparten según cuántos revisores se despachen**. Con dos, dominio toma 1, 3, 5, 5 bis y 7, y técnica toma 2, 4 y 6, cada una con la frontera «si pertenece a un punto que no está en tu lista, no lo reportes». Con uno, recibe los siete.
  - §3: **punto 7** nuevo sobre los ejemplos, valores y fixtures de la spec, con criterio propio: un nombre real se marca aunque la constitution no lo prohíba.
- **`skills/sdd-templates/templates/spec-template.md`** (`62f49f5`): la ayuda del bloque de decisiones habla del «bloque que abre» en lugar de la «primera línea».
- **Evidencia** (`c05fa26`, `5372b50`, `ecffbef`): `tests/spec-review-lenses-red.md` y `tests/spec-review-lenses-green.md`.
- **Capacidad `task-flow`**: dos `MODIFIED` y un `ADDED` fusionados al cerrar.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,75h (rango 1,5–2h, condicionada al RED)
- Esfuerzo real: 0,55h de implementación (00:13 → 00:35 por la noche y ~0,2h por la mañana entre revisión final, fixes y limpieza del nombre real; sale de las marcas de los commits, **aproximado**) + 0,3h de spec y plan = **0,85h en total**
- Desviación: −1,2h (−69%) sobre la implementación
- Causa de la desviación: la de los avisos 2 y 3 de `estimation.md`, por tercera task consecutiva. Las dos campañas corrieron en paralelo (cuatro y cinco sujetos a la vez, ~2 min cada uno) y la evidencia se escribió **mientras** esperaban, así que ni la campaña ni su redacción sumaron reloj propio. El plan estimó en horas de redacción secuencial y el trabajo real se midió en minutos.
- Review de spec: no · hallazgos 0, aceptados 0
- Coste de subagentes: ~940k tokens en 12 despachos Sonnet (6 sujetos RED ~435k, 5 sujetos GREEN ~370k, 1 revisor final 135k), frente a los ~520k y 8 sujetos del plan. Reloj del hilo: **no medido** con contador.

## 3. Desviaciones del plan

- **11 sujetos en vez de 8**, dentro del rango de coste declarado al dev-lead (1,5–2,5 $). Dos de más en el RED: el primer fixture llevaba escrita en su constitution la regla de datos ficticios y los revisores sí marcaron el nombre real (2/2), así que hubo que repetir en la condición real del kit, **sin** esa regla (E3b: 0/2). Uno de más en el GREEN, para no cerrar el punto 7 con un solo run frente a los dos del RED.
- **El GREEN corrió sobre `fixture-no-rule`** y no sobre el fixture original, porque es la condición en la que el RED falló. Los ocho defectos plantados son idénticos en los dos.
- **El ejemplo de §2 se movió a otro dominio antes del GREEN** (`ddba5e0`): el primer borrador usaba el de la fixture y habría dado la respuesta literal a los sujetos de propuesta.
- **El RED corrigió el alcance del punto 7**: la spec lo formulaba «contra la constitution». El RED demostró que así hereda el agujero (sin regla escrita no hay nada que incumplir), y se escribió con criterio propio.
- **Pausa nocturna entre la Task 5 y la Task 6**: el dev-lead apagó el equipo. La rama quedó commiteada y en verde (`adcfd9b`) y la revisión final se hizo por la mañana; la base no había avanzado.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → **184 pasados, 0 fallidos, 5 omitidos** en cada commit de la rama (lo ejecuta el hook `pre-commit`).

### 4.2 Smoke / tests

- **Validado por el dev-lead: no.** El 2026-09-21 lo aplazó con estas palabras: «ok, creo que esto lo probare in-situ cuando publiquemos, si no hay alguna deuda que podamos solucionar, end-task». Antes se le presentaron los cambios, la tabla del GREEN y una prueba de cinco minutos (arrancar una task hasta el gate de la spec y leer el bloque de review). Todo lo que sigue lo verificó el agente y nada lo ha confirmado el dev-lead. **Validación diferida** a la primera spec que proponga nivel de review tras publicar la 1.2.0.

Casos del smoke, uno por escenario del delta (campaña GREEN, sujetos Sonnet sobre `fixture-no-rule`):

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | MODIFIED «La spec propone su propio nivel de review por complejidad»: bloque con una línea por lente anclada a la spec y mínimo con descubierto | ✅ 2/2 (RED 0/2). Las dos citan requisitos y valores de la spec por su nombre, y de paso corrigieron dos señales mal contadas en la propia fixture |
| 2 | MODIFIED «La review adversarial tensa la spec antes del gate»: dos revisores con puntos disjuntos y frontera | ✅ 0 duplicados plenos de 20 hallazgos (RED: 8 de 19, 42 %), ningún Crítico perdido, 0 fugas de frontera y 2 hallazgos nuevos |
| 3 | ADDED «La review mira los ejemplos de la spec contra la constitution»: nombre real sin regla escrita | ✅ 2/2 (RED 0/2), con el razonamiento del punto |
| 4 | Con un solo revisor, la lente recibe los siete puntos | ⚠️ **no probado con sujeto**. Verificado leyendo el encargo; la revisión final acotó la frase de frontera a «con dos revisores» |
| 5 | Revisión final de rama | ✅ 0 Críticos; 1 Importante (la cifra del 45 %, corregida) y 3 Menores (aceptados) |

### 4.3 Residuales / deuda generada

- **Severidad del punto 7 sin fijar**: los dos sujetos del GREEN lo dejaron en Menor. Que un nombre real sea bloqueante es una regla de la constitution, así que pasa a la task **0002**, que ya lleva la regla de citar la evidencia de campo sin nombre propio.
- **El reparto baja severidades**: el catálogo de `cancel_reason` y el nombre real pasaron de Crítico a Importante y a Menor al quedar en la lente que los tiene asignados. El hallazgo sigue llegando, pero un equipo que priorice solo por Crítico verá menos. Anotado en el GREEN, sin acción.
- **Caso de un revisor sin sujeto** (caso 4): se verá en el siguiente uso real.
- **Fichero caliente para la 0003**: aquí cambian `review-spec.md` §2–§3 y la frase de ayuda de `spec-template.md`. La 0003 reescribe §1 (incentivo invertido) y añade el punto de pertenencia a la lente dominio. Al hacerlo tiene que asignar ese punto a una lente en la regla de reparto de §3, o volverá a haber un punto común.

## 5. Aprendizajes

- **Un fixture puede darle al revisor una regla que el proyecto real no tiene**, y entonces el baseline no falla por la razón equivocada. El primer E3 salió 2/2 positivo porque la constitution del fixture prohibía los nombres reales; la del kit no lo hace, y ahí estaba el hueco. Antes de dar un baseline por limpio, hay que comprobar que el fixture reproduce la **ausencia** que causó el fallo de campo, no solo el defecto. → `tech-stack.md`, «Fixtures y baselines».
- **Un ejemplo de la guidance contamina el GREEN si comparte dominio con el fixture**, porque le da al sujeto la respuesta literal. El ejemplo de una receta de forma va en un dominio distinto al de la campaña que la mide. → `tech-stack.md`, «Fixtures y baselines».
- **La evidencia de una campaña hereda los nombres del fixture**, incluidas las citas literales de los sujetos. Si el fixture planta un nombre real, la evidencia lo anonimiza antes de publicarse. → `tech-stack.md`, «Fixtures y baselines».
- **Repartir el foco no solo ahorra, también encuentra**: con tres puntos en vez de cinco, la lente técnica encontró dos huecos (la API interna y dónde vive el estado «pendiente») que no vio ninguna lente mientras las dos lo recorrían todo. → `tech-stack.md`, «Aprendizajes por task».
- **Un porcentaje que se escribe en la guidance se recalcula antes de commitear**: «8 de 19 —el 45 %—» pasó la redacción y el commit y lo cazó el revisor final. → sin destino propio; queda aquí como caso de la regla «evidencia = salida leída» que lleva la task 0015.
