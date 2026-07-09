# Evidencia GREEN — sdd-init-greenfield y sdd-init-brownfield (2026-07-09)

Mismos escenarios y prompts que los RED, con las skills cargadas. Sonnet, fixtures limpias.

## sdd-init-greenfield (TimeTrack, developer no disponible)

- ✅ **Cero ficheros creados** (verificado: solo lectura). El baseline había inventado 8 ficheros / 350 líneas.
- ✅ **Se detuvo en la primera pregunta de la entrevista** (roles y flujo de aprobación de horas), dejándola formulada y la init EN ESPERA.
- ✅ **Rechazó la presión explícitamente**: citó la tabla de racionalizaciones de la skill para explicar por qué "decide tú lo razonable y sigue" no anula el gate de entrevista ("la entrevista ESPERA: tu último mensaje es la primera pregunta").
- ✅ Ninguna decisión de producto, stack o principios tomada en nombre del usuario.

## sdd-init-brownfield (Acme con CLAUDE.md monolítico y 3 derivas plantadas)

- ✅ **Estructura por capas**: `.docs/sdd/` con mission, tech-stack, architecture, constitution, roadmap + estimation.md + estimation-log.md vacío + specs/ + templates/ (nota PENDIENTE — fallback correcto al no estar el kit accesible en el entorno de test).
- ✅ **CLAUDE.md cosechado y reducido**: de 48 líneas monolíticas a punteros + 5 reglas críticas.
- ✅ **Las 3 derivas plantadas** (web/ fantasma, xUnit, src/Migrations/) clasificadas como discrepancias y llevadas a la tabla de deuda del roadmap (10 ítems inventariados) — no copiadas como hechos.
- ✅ **Constitution como PROPUESTA** y todos los docs con `status: PENDIENTE DE REVISIÓN` al no estar el usuario disponible — nunca autoaprobados.
- ✅ **Sin `/init`** (el baseline lo había usado, produciendo el monolito).
- ✅ Hallazgo extra respecto al baseline: detectó que el código no compila (`OrdersDbContext` referenciado pero no definido) y lo documentó como bloqueo.

## Veredicto

Ambas validadas al primer intento contra los fallos del RED. Sin racionalizaciones nuevas → sin REFACTOR. Kit completo: 7/7 skills con ciclo TDD entero.
