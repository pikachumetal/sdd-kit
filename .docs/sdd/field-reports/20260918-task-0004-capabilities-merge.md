# La fusión del delta en `capabilities/` no es un paso visible del cierre, y falta la regla de reparto entre capacidad y docs de anclaje

**Versión del kit**: 1.1.0 (canal plugin, 2026-09-16)
**Detectado en**: `sdd-project-template`, task 0004 (auth), durante la task de documentación del plan, ejecutando `sdd-start-task` en modo full con `subagent-driven-development`.

## Resumen

Dos problemas relacionados, observados en una misma sesión:

1. `sdd-end-task` no tiene en su checklist ningún paso que nombre la fusión del delta de la spec en `capabilities/<capability>.md`. La instrucción existe, pero solo dentro de una referencia, como cláusula del paso «Aprendizajes → docs vivos».
2. El kit no dice qué contenido va en `capabilities/` y cuál en los docs de anclaje (`tech-stack.md`, `architecture.md`, `environments.md`) cuando una task actualiza ambos. El agente duplicó valores de comportamiento en `tech-stack.md` y ningún gate lo detectó; lo vio el dev-lead mirando la sesión.

## Qué pasó

- La spec aprobada declaraba una capacidad nueva (`auth`) y, en «Decisiones que he tomado yo», una línea del tipo: «Docs que toca: `tech-stack.md` (fila Auth y Email con el detalle real), `architecture.md`, `environments.md`…».
- El plan convirtió esa línea en una task de docs en línea, y anotó que las capacidades «las fusiona `sdd-end-task`, no esta task».
- Al ejecutar la task de docs, el agente escribió en `tech-stack.md` los valores de comportamiento de la capacidad: caducidad del token (10 min), intentos de código (5), cuota (10 por IP cada 10 min → `429`), enfriamiento (60 s), respuestas genéricas (`202`, `invalid_grant` único), lockout (5 fallos, 15 min).
- Esos mismos valores ya estaban en el delta de la spec (THEN y «Reglas de la capacidad → Límites») y acabarán en `capabilities/auth.md`. Resultado: dos fuentes de verdad para el mismo dato.
- El dev-lead preguntó por qué eso no estaba en `capabilities/`. El agente tuvo que abrir `sdd-end-task` y sus referencias para poder responder cuándo y dónde se fusiona.

## Evidencia en el kit

- `skills/sdd-end-task/SKILL.md`: checklist de pasos 0 a 10. Un `grep -i "capabilit\|capacidad\|fusi"` sobre el fichero no devuelve ninguna coincidencia. La lista «Red flags» tampoco menciona la capacidad.
- `skills/sdd-end-task/references/aprendizajes-skills.md`, paso 4: la fusión aparece como una cláusula más de «Aprendizajes → docs vivos»: «cambio de comportamiento observable → el delta de la spec se fusiona en `capabilities/<capability>.md` (ADDED añade, MODIFIED sustituye…)».
- Sí la nombran como responsabilidad de `sdd-end-task`: `skills/sdd-templates/SKILL.md` (tabla de plantillas), `templates/capability-template.md`, `templates/spec-template.md` («clave de fusión de `sdd-end-task`») y `skills/sdd-start-task/SKILL.md` paso 7 («ni fusión en `capabilities/`» sin validación).
- `templates/spec-template.md` tiene una «Regla de contenido» para spec frente a plan. No existe una regla equivalente para capacidad frente a docs de anclaje.
- `skills/sdd-start-task/references/review-spec.md`: el encargo del revisor no pide comprobar que los docs listados en Scope o en las decisiones no dupliquen el delta.

## Por qué importa

- **Riesgo de cierre sin fusión.** Un agente que ejecute el checklist de `sdd-end-task` sin abrir la referencia del paso 4 puede cerrar la task sin tocar `capabilities/`. No hay red flag que lo detecte. La capacidad es «la verdad viva del comportamiento» y es lo primero que lee la siguiente task.
- **Deriva de docs.** Sin regla de reparto, el comportamiento se copia en `tech-stack.md` o `architecture.md`. Cuando una spec futura haga `MODIFIED`, `sdd-end-task` actualiza la capacidad por título estable y nadie actualiza la copia.
- **Coste de sesión.** El agente no pudo responder de memoria a «¿en qué fase se escribe la capacidad?»; tuvo que leer tres ficheros del kit.

## Propuestas

1. **Paso propio en `sdd-end-task`.** Sacar la fusión del paso 4 y darle número: «Fusión del delta en `capabilities/`: por cada subsección "Capacidad:" de la spec, aplicar ADDED / MODIFIED / REMOVED por título estable y las "Reglas de la capacidad" por nombre; añadir la línea de Historial; crear el fichero con `capability-template.md` si la spec declara la capacidad nueva». Mantener el detalle del algoritmo en la referencia.
2. **Red flag y racionalización nuevas en `sdd-end-task`.** «La spec tiene "Delta de comportamiento" y no has tocado `capabilities/`.» / «"El comportamiento ya está en tech-stack" → los docs de anclaje no son la verdad viva del comportamiento».
3. **Regla de reparto.** Añadirla donde se decide qué docs toca una task (plantilla de spec, junto a la «Regla de contenido», y plantilla de plan en la sección de la task de docs):
   > Si describe comportamiento observable (valores, límites, avisos, respuestas, estados), va **solo** en `capabilities/`. `tech-stack.md`: tecnología, versiones y porqué técnico. `architecture.md`: dónde vive cada pieza y excepciones de estructura. `environments.md`: qué genera el entorno. Los docs de anclaje enlazan a la capacidad; no copian sus valores.
4. **Punto nuevo en el encargo del revisor de spec** (lente dominio o técnica): «los docs que la spec dice tocar, ¿duplican algo del delta? Un valor de comportamiento fuera de `capabilities/` es Importante».
5. **Declarar el orden.** Los docs de anclaje se escriben durante la implementación y la capacidad nace en el cierre, así que un enlace a `capabilities/<nueva>.md` cuelga en la rama hasta `sdd-end-task`. Basta una frase en `sdd-start-task` o en la plantilla de plan que lo dé por esperado. Alternativa de diseño a valorar: crear la capacidad como borrador (`status: draft`) al aprobar la spec y promoverla en el cierre.

## Criterios de aceptación

- `grep -i "capabilit" skills/sdd-end-task/SKILL.md` devuelve el paso de fusión y su red flag.
- Una sesión de prueba con una spec que declara capacidad nueva y una task de docs: el agente no escribe valores del delta en `tech-stack.md`, y al cerrar fusiona la capacidad sin que el usuario lo pida.
- El revisor de spec marca una decisión del tipo «`tech-stack.md` con el detalle real» cuando ese detalle es comportamiento.

## Lo que no es bug

Diferir la fusión hasta la validación del usuario es coherente con el resto del kit: la capacidad no debe cambiar por trabajo sin validar. El problema es la visibilidad del paso y la falta de regla de reparto, no el momento.
