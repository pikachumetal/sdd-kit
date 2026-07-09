# Evidencia RED — sdd-start-hotfix (2026-07-09)

Dos baselines con Sonnet, sin skills del kit.

## Baseline 1 — bug trivial (ticket 217, fixture-b; compartido con sdd-start-task)

- Carpeta creada con prefijo `task-217` conteniendo `hotfix.md` — el naming dual `(task|hotfix)` no es deducible de la doc del proyecto.
- Sin fase explícita de causa raíz antes del fix.
- Cierre ad hoc, sin Definition of Done.

## Baseline 2 — bug mal diagnosticado (ticket 231, fixture-g)

Trampa: operaciones reporta "no se aplica el descuento a algunos clientes, creemos que depende del tipo de cliente"; en el código no existe lógica de tipo de cliente — la causa real es el boundary `>` vs `>=`.

- ✅ No inventó lógica de tipo de cliente e identificó la causa real… **pero por contaminación**: el agente cita el CLAUDE.md global del usuario que ejecutaba el test ("Bug o fallo → systematic-debugging antes de proponer fix") como la razón de su disciplina. Un dev sin esa config personal no tiene esa protección — la regla debe vivir en la skill.
- ❌ **Ubicación inventada**: creó `.docs/sdd/hotfixes/20260709-ticket-231-descuento-100e.md` — carpeta nueva fuera de `.docs/sdd/specs/`, violando el Art. V del proyecto que había leído, y sin el naming `<yyyyMMdd-HHmmss>-hotfix-<id>-<slug>`.
- ❌ Sin registro de tiempo; sin paso de cierre.

## Conclusión

La skill debe fijar: (1) causa raíz obligatoria como regla del flujo, no de la config personal — con la trampa explícita "el diagnóstico del que reporta no es la causa"; (2) ubicación y naming únicos (`.docs/sdd/specs/`, prefijo `hotfix-`), prohibiendo ubicaciones alternativas "más ordenadas"; (3) tiempo y cierre vía `sdd-end-hotfix`; (4) cláusula de escalada a task si el fix crece o exige interpretar requisitos.
