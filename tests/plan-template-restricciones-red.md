# Evidencia RED — restricciones globales en `plan-template` (2026-09-07)

Baseline con `plan-template.md` **sin modificar** (estado v0.5.0 + Task 1 de esta task, commit `928aad2`), sobre la fixture desechable "Bookline" (plataforma de pedidos en Node sin dependencias, `.docs/sdd/` con constitution, tech-stack, estimation y roadmap), con una **spec aprobada en disco** (`specs/20260907-000000-task-0000-filtro-estado/spec.md`, modo full) cuya sección 7.2 "Restricciones globales de la feature" fija cuatro restricciones con valor exacto: `Node >= 20`, estados exactos `pending | paid | shipped` validados con `isValidStatus` (sin duplicar la lista), prefijo `order-` en ficheros nuevos, y mensaje de error literal `invalid status: <valor>`.

## Método

- Molde **sin `.git`**; copia `bookline-e3` con `git init`, `develop`, rama `feature/0000` y la spec aprobada commiteada dentro de la copia.
- Un subagente Sonnet. **Entrega de la plantilla por prompt**: contenido íntegro de `skills/sdd-templates/templates/plan-template.md` del working tree. `writing-plans` (6.3.0) la resuelve el harness.
- **Prompt neutro**: rol de dev, ruta de la copia, la plantilla y la petición «La spec del filtro está aprobada. Escribe el plan de implementación calcando la plantilla.». Sin mencionar restricciones, bloques ni qué se espera que se propague.
- Verificación **en disco** del `plan.md`: presencia de cada restricción y sección en que aparece.
- Pregunta *a posteriori*, con el escenario cerrado: dónde puso las restricciones y por qué, si las consideró una a una, y cuál se le quedó fuera.

## Qué hizo el baseline — verificado en disco

`plan.md` de 176 líneas, calcado de la plantilla (Phase -1, 1.1–1.4, Task 1 con RED→GREEN→commit, estimación, validación, self-review). Invocó `superpowers:writing-plans` con `Skill` y respetó la ubicación y la plantilla del kit sobre el default de superpowers. Antes de dar por buenos los resultados esperados de los steps, ejecutó la lógica propuesta en una sandbox (`node -e`) contra el `order-api.js` real, sin tocar el repo. Solo `plan.md` sin trackear; `src/` y `tests/` intactos.

| Restricción de §7.2 | ¿Llega al plan? | Dónde |
| --- | --- | --- |
| Mensaje literal `invalid status: <valor>` | ✅ | Test del Step 1 (`assert.throws` con el mensaje exacto), código del Step 3, self-review con cita `(spec §7.2)` |
| `isValidStatus` reutilizado, lista no duplicada | ✅ | Architecture, Step 3 (`require`), self-review con cita `(spec §7.2)` |
| Prefijo `order-` en ficheros nuevos | ✅ | 1.1 «Crear: ninguno — la spec exige prefijo `order-` …», self-review N/A con cita |
| `Node >= 20`, sin APIs posteriores | ⚠️ pasiva | Solo en la línea Tech Stack, copiada de `tech-stack.md`; sin gate ni línea de self-review |

## Positivos que NO requieren guidance

- **Tres de cuatro restricciones se contrastan deliberadamente**, con cita a la sección de la spec, y llegan al código y al test del plan con el valor exacto.
- **La plantilla y la ubicación del kit se imponen** al default de `writing-plans` sin guidance adicional («preferencias del usuario sobre ubicación del plan tienen prioridad»).
- **Self-review spec → tasks** cubre requisitos, restricciones y NO objetivos uno a uno.
- **Verificación empírica antes de afirmar** («ejecuté la lógica propuesta en una sandbox para verificar los tres casos de la spec antes de darlos por buenos»). No es exigible por la plantilla; se registra como conducta positiva.

## Fallo reproducido (parcial)

### F1 — Una restricción llega por arrastre, no por contraste con la spec

En la pregunta a posteriori, el agente lo describió sin ambigüedad:

> *"La que **se quedó fuera de esa trazabilidad explícita** es **Node >= 20 / no usar APIs posteriores**: solo aparece de forma pasiva en la línea de 'Tech Stack' (copiada de `tech-stack.md`), sin gate ni línea de self-review propia con cita a §7.2. La cumplí de facto (…) pero llegó por arrastre de estilo, no por haberla contrastado deliberadamente contra la spec como hice con las otras tres. Es un hueco real de trazabilidad, aunque no de comportamiento."*

**Diagnóstico.** Fallo de **forma** (Art. II), y leve: el comportamiento es correcto, pero la plantilla no tiene un sitio donde las restricciones de la spec se copien **literalmente y todas**, así que la trazabilidad depende de que el agente las recorra por su cuenta — aquí 3 de 4. Con una sola task y un solo ejecutor el coste es nulo; con varias tasks y ejecutores que solo ven la suya (T3, ejecución por subagentes) la restricción que "llegó por arrastre" es la que no llega. La forma correcta es la receta: un bloque "Restricciones globales" tras Tech Stack con copia literal de la spec, que es además la cabecera que `writing-plans` 6.3.0 exige (`Global Constraints`). Evidencia **parcial** (1/4 en un escenario de una task): el GREEN debe mostrar 4/4 con cita; T3 re-testa con planes multi-task.

## Fallo NO reproducido

### Que las restricciones no lleguen a las tasks

No se reproduce: las cuatro llegan al plan y tres al código o al test con el valor exacto. La hipótesis original ("no llegan al plan como bloque ni a las tasks") falla solo en su mitad de forma (sin bloque), no en la de fondo.
