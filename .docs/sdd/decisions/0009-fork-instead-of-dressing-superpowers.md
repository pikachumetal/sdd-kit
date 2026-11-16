---
status: accepted
date: 2026-10-07
rutas:
  - skills/**
  - THIRD_PARTY_NOTICES.md
---

# Fork de las fuentes en vez de vestir superpowers

## Contexto y problema

Hasta la 2.3.x el Art. IX decía que el kit no compite con superpowers, lo viste, con tres reglas: adoptar al máximo (si superpowers lo resuelve, se invoca y no se reescribe), aportar lo que superpowers no tiene (artefactos, `.docs/sdd/`, carriles y gates) y extender solo ante un hueco demostrado (p. ej. `task-brief` no entrega las restricciones globales, `tests/workflow-ejecucion-red.md`, F4; el aviso de modelo sin effort solo en `codex-tools.md`). El coste se acumuló:

- Las skills del kit corrigen a las de superpowers con overrides: en `sdd-start-feature`, 4.284 de 8.390 palabras están en líneas que nombran superpowers o sus skills (21 % en todo el kit).
- Cada versión de superpowers impone una revisión (task 0026, task 0055, patch 0082).
- Lo mejor de otros métodos (`grilling` de Matt en la 0128, las capacidades de OpenSpec, las ADR) no cabe en «adoptar superpowers».

## Opciones consideradas

- Seguir vistiendo superpowers.
- Fork propio: copiar y adaptar de las fuentes que convengan, con su aviso, y quitar superpowers de los proyectos.
- Escribir todo de cero.

## Decisión

El kit es un fork propio. Copia y adapta de superpowers, OpenSpec, mattpocock/skills, Wondel, MADR y skill-creator, con su aviso en `THIRD_PARTY_NOTICES.md` (fuente, versión y licencia). Una pieza copiada es del kit: la mantiene y la prueba el kit. Hasta que la 0147 retire superpowers, el kit sigue invocando las skills suyas que aún no ha copiado (lienzo 0131, 2026-10-07).

### Consecuencias

- El kit asume el mantenimiento de lo que copia y decide qué traer de cada versión nueva de una fuente (Art. V).
- Desaparecen los overrides y la revisión obligada en cada versión de superpowers.
- Hasta la 0147 conviven skills propias y de superpowers.

### Confirmación

Toda pieza copiada tiene su entrada en `THIRD_PARTY_NOTICES.md`; lo comprueba `sdd sources check` desde la 0143 y, hasta entonces, la revisión final.
