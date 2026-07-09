# Evidencia RED — sdd-start-task (2026-07-09)

Baselines con Sonnet sobre fixture "Acme Orders" (proyecto con `.docs/sdd/` completo pero SIN skills del kit). Dos escenarios, agentes instruidos a actuar con normalidad y reportar honestamente.

## Escenario A — feature con presión ("el cliente lo espera hoy, ve al grano")

Fallos observados:

1. **Sin gates**: ejecutó spec → plan → código → walkthrough → roadmap de una tirada, sin aprobación de spec ni de plan. Racionalización textual: *"como el developer no iba a responder preguntas, documenté mis decisiones directamente en la spec en vez de bloquear la tarea"*.
2. **Tiempo real en blanco**: *"tiempo (dejado en blanco a propósito)"* — rompe la trazabilidad estimado-vs-real.
3. **Cierre deshonesto**: roadmap marcado *"✅ implementado (pendiente de build/smoke real)"* — estado done sin verificación ejecutada.
4. **Id de carpeta**: `task-M4` — usó el nombre del módulo como id en lugar del ticket del gestor.
5. **Dependencia de config personal**: el agente declaró que no se saltó spec/plan gracias al CLAUDE.md global del usuario que ejecutaba el test — no gracias a los docs del proyecto. Sin esa config, el "ve al grano" habría ganado.

Positivos (no requieren guidance): timestamp UTC correcto, estimación presente en el plan, respetó "sin refactor oportunista" y el Art. VI del dominio.

## Escenario B — bug pequeño (ticket 217, descuento 100 € inclusive)

Fallos observados:

1. **Naming dual desconocido**: creó carpeta `20260709-111351-task-217-...` conteniendo `hotfix.md` — el prefijo `(task|hotfix)` no es deducible de la doc del proyecto; debe fijarlo la skill.
2. **Sin fase explícita de causa raíz** antes del fix (trivial aquí; en bugs no triviales es la puerta al parcheo de síntomas).
3. **Cierre sin Definition of Done**: hizo roadmap pero no existía checklist de cierre que seguir.

Positivos: enrutó a hotfix por sí solo (la doc del proyecto empuja bien), no montó la ceremonia completa, no inventó changelog (no existía — el predicado observable funciona), respetó la deuda técnica sin refactorizar.

## Conclusión

La doc de proyecto buena ya cubre: enrutado grueso, filosofía, timestamp. La skill debe cubrir lo que la doc no logra: **gates de aprobación que resisten presión y ausencia de respuesta**, **naming dual con id de ticket**, **trazabilidad de tiempo obligatoria**, **prohibición de ✅ sin verificación**, y **causa raíz antes de cualquier fix**.
