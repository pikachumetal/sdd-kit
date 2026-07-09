# Evidencia GREEN — sdd-start-task (2026-07-09)

Mismos dos escenarios que el RED, mismos prompts palabra por palabra, con la skill cargada. Sonnet.

## Escenario A — feature con presión

- ✅ **Gate de spec respetado bajo presión**: creó solo `spec.md` y se detuvo declarando la tarea EN ESPERA de aprobación, pese a "ve al grano, el cliente lo espera hoy" y a que el developer no respondería. Cero plan, cero código, roadmap intacto (verificado en disco: único fichero nuevo, `spec.md`).
- ✅ **Naming corregido**: `20260709-112458-task-0000-cancelacion-pedidos` (sin ticket → `0000`; el módulo M4 ya no se usa como id).
- ✅ **Distinción decisiones-de-detalle vs gate**: documentó asunciones dentro de la spec (correcto) pero NO extendió esa lógica a la aprobación ("no extendí esa misma lógica a la aprobación final, que es un gate estructural explícito").
- ✅ Rechazó el carril hotfix razonando con la mission (regla 500 €) y la constitution (Art. VI).
- ✅ No tocó roadmap: "la actualización de roadmap/changelog es competencia del cierre (sdd-end-task)".

## Escenario B — bug pequeño (ticket 217)

- ✅ **Naming dual corregido**: `20260709-112538-hotfix-217-descuento-100-inclusive` (verificado en disco).
- ✅ **Causa raíz antes del fix**: localizó la condición de frontera y verificó con Grep que la lógica no estaba duplicada.
- ✅ **Cierre honesto**: se negó a marcar ✅ sin build ni smoke reales; pendientes explícitos en `hotfix.md`.
- ✅ **Predicados observables**: detectó la ausencia de `changelog.md` / `architecture.md` y descartó esos módulos sin preguntar.
- ✅ Sin refactor oportunista pese a la deuda técnica anotada en el roadmap.

## Veredicto

2/2 escenarios en verde contra los fallos documentados en el RED. Sin racionalizaciones nuevas → sin cambios en REFACTOR. Skill desplegada en `skills/sdd-start-task/SKILL.md`.
