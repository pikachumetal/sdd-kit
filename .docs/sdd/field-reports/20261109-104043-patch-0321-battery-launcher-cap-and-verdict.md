---
kit_version: 2.3.4
lane: patch
id: 20261109-104043-patch-0321-battery-launcher-cap-and-verdict
task: 0321
mode:
date: 2026-11-09
---

# Ticket para el kit — patch 0321: el lanzador de baterías, el techo gastado, el veredicto con SCENARIOS, el precio del sujeto y el uso de plan

- Contexto: patch de cuatro fallos de `tests/headless/`, hilo en Opus 5.5 y un revisor en Sonnet 5.5 con effort medium; reproducciones en proceso y con el CLI real en seco, sin sujetos de pago.
- Coste: 0,28 h frente a 1 h estimada más 0,07 h de gate; 6,87 $ de sesión, 0,44 $ del revisor (`sdd session tokens`, §5 de `patch.md`).
- Por iniciativa propia: antes de abrir el patch medí cada caso de la fila con el código de hoy, y tras la revisión corrí un mutante por rama nueva (`Math.min`, sin la media, sin mirar `SUBJECT_COST`, `refuseSpentCap` sin condición), cada uno con `Tests  1 failed`. Las dos cosas funcionaron: dos de las cuatro premisas de la fila ya no se reproducían.

## Menores

- La fila 0321, triada el 2026-11-09, decía «hoy sale con 0 y la vigilancia lo lee como éxito (reproducido en la 0314)», pero `battery.mjs run` sale con 3 sin sujetos desde `94a0c4e9` (2026-11-02). La rama de la 0310 midió `verdict` sin `N` antes de integrar la 0320. El triaje copió la evidencia del ticket sin volver a medir con la base de ese día. Lo midió la apertura del patch (§1 de `patch.md`) — `skills/sdd-roadmap/` (triaje de un ticket), no localizado el paso.
- `patch-lane.md` dice «si hace falta dos o más tests de comportamientos nuevos, no es un patch», y un patch de cuatro fallos deterministas con un test cada uno me hizo dudar del carril. El ejemplo de la regla son comportamientos nuevos, no fallos, y seguí como patch — `skills/sdd-propose/references/patch-lane.md`, «Fixed solution».
- `patch-flow.md` paso 3 saca del carril cualquier decisión «sin el dev-lead» sobre lo que el usuario ve. Extender el mensaje de uso de `plan` a `field` y `verdict`, por tener la misma causa en `main`, encajaba como decisión, y lo reescribí como parte de la causa raíz. La regla no distingue arreglar la causa en su sitio de decidir algo nuevo — `skills/sdd-implement/references/patch-flow.md` paso 3.
- `.claude/hooks/heredoc-guard.mjs` bloqueó un heredoc de Bash que añadía tests. La regla ya estaba en `tech-stack.md`, «El texto con escapes…», y la repetí con `Edit` — no aplica al kit que se instala.
