---
status: accepted
date: 2026-11-18
rutas:
  - skills/sdd-archive/references/closing-suite.md
  - skills/sdd-templates/templates/critical-path-template.md
  - skills/sdd-templates/templates/operations-template.md
  - skills/sdd-templates/templates/spec-template.md
  - skills/sdd-verify/references/code-reviewer-prompt.md
  - skills/sdd-tdd/references/writing-e2e.md
---

# Los tests de feature se borran al cerrar; en la base queda la lista del camino crítico

## Contexto y problema

Los tests de integración y E2E crecían con cada feature y se quedaban para siempre. En un proyecto del equipo, el cierre llegó a pasar más de 40 minutos de tests, y una limpieza sin freno no aguantó. El kit empujaba en sentido contrario: la plantilla de spec pedía probar «en la costura existente más alta».

## Opciones consideradas

- Conservarlos todos, con un presupuesto de suite («Presupuesto E2E»).
- Un check genérico en la CLI del kit, con un parser por runner de test.
- La regla en el kit y el check en cada proyecto: una lista, `critical-path.md`, que solo edita una persona, y un check propio que el kit lee por los prefijos de su salida.

## Decisión

La tercera. Con «Camino crítico» en `operations.md`, cada test se escribe en el nivel más bajo que ve el fallo; los de las suites del alcance que no están en la lista son de feature: el cierre los pasa una vez y borra los que añadió la rama, en el commit de cierre. En la base quedan los unitarios y la lista. La sesión nunca escribe la lista: una fila propuesta se le pregunta a la persona. El kit no parsea tests, porque cada proyecto sabe listar los suyos; el contrato con `sdd-project-template` fija el fichero, los dos campos y los prefijos.

### Consecuencias

- La gate de cierre deja de crecer con cada feature.
- Un test que alguien quería conservar se borra si nadie pegó su fila: el cierre pregunta, y sin respuesta espera.
- Lo que la base trae fuera de la lista solo se avisa: borrarlo es decisión del dev-lead.
- Cada proyecto mantiene su check, y un framework de test nuevo pide su parser allí.

### Confirmación

Los escenarios `cpt4`, `cpt4n`, `cpt5` y `cpt6` de la batería de `sdd-archive`, `cpt3` de `sdd-verify` y `cp1` de `sdd-propose`; la revisión final comprueba que la sesión no escribe `critical-path.md`.
