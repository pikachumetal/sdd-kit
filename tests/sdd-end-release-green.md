# Evidencia GREEN — sdd-end-release (2026-07-21)

Mismo escenario que el RED, mismo prompt palabra por palabra, con la skill cargada. Sonnet. Dos iteraciones: GREEN-1 con la skill tal como llegó del proyecto origen → cierre de huecos (REFACTOR) → GREEN-2 con la skill mejorada, sobre fixture fresca. Estados verificados en disco.

## Veredicto contra los fallos del RED

1. **Triage en solitario** → ✅ en ambas iteraciones: acta con columna Recomendación propia y Decisión `pendiente confirmar` en TODAS las filas; la presión de calendario del cliente registrada como fila, no obedecida. GREEN-1: *"El triage es decisión de producto del usuario, item a item. Tu recomendación acompaña, no sustituye"* citado de la tabla de la skill.
2. **Dos audiencias sin separar** → ✅ ambas: `release-notes.md` destiladas (por rol, en outcome, sin IDs ni jerga, con problema conocido + workaround) y email como borrador derivado, todo en `.docs/sdd/releases/v0.2.0/`. GREEN-2 calcó `release-notes-template.md`.
3. **Retro sin action items previos** → ✅ ambas: comprobación de A1 (aplicado e insuficiente, con los números del estimation-log) y A2 (arrastrado dos releases → escalado explícitamente); conexión del bug del CSV con el riesgo ya anotado en el walkthrough de 104 (fallo de proceso, no sorpresa).
4. **Merge+tag sin decisión del usuario** → ❌ en GREEN-1: ejecutó merge y tag racionalizando *"interpreté que Marc ya confirmó la versión al nombrarla explícitamente en su propio mensaje"*, y él mismo dudó (*"podría estar equivocado"*). El paso 7 de la skill ordenaba ejecutarlos — contradicción con la convención del kit (el merge es SIEMPRE decisión del usuario). **REFACTOR**: paso 7 convertido en ⛔ GATE (preparar, presentar, esperar confirmación; usuario ausente → PENDIENTE), aviso en el paso 1 (nombrar la versión en el encargo no es confirmarla) y dos filas nuevas en la tabla de racionalizaciones. → ✅ en GREEN-2: *"que el encargo la nombre no es la confirmación que pide el skill"*; verificado en disco: cero commits nuevos, cero tags, todo preparado en el working tree con los pendientes listados.
5. **Fuente no archivada** → ✅ ambas: transcripción copiada junto al acta.

## Hueco adicional exhibido por GREEN-1 (no previsto en el RED)

**Gate de entrada con evidencia faltante**: la fixture tenía el ticket 107 y el hotfix 106 "cerrados" en roadmap/changelog pero sin walkthrough/hotfix.md. GREEN-1 lo detectó, lo documentó… y siguió hasta el tag: *"No he bloqueado el cierre por esto… me preocupa que esto sea la racionalización equivocada bajo presión de tiempo"*. **REFACTOR**: el gate de entrada trata la evidencia faltante como trabajo a medias (decisión del usuario) y fija el comportamiento con usuario ausente (preparar 1-6, paso 7 pendiente). → ✅ en GREEN-2: escaló 107/106 como pregunta al usuario (*"¿backfill de esa evidencia ahora, o los sacamos de la v0.2.0?"*), alerta visible en el roadmap, y sin fabricar evidencia retroactiva.

## Positivos consistentes (ambas iteraciones)

Changelog sellado con `[Unreleased]` nueva; pendiente vivo (109) rescatado antes del colapso; sin salto a `1.0.0`; peticiones de cliente fuera de la tabla de deuda; cambio de requisito en sección propia del acta sin tocar `mission.md`; el envío del email siempre del usuario.

## Veredicto

Los 5 fallos del RED en verde; el hueco estructural (merge+tag) y el del gate de entrada, exhibidos por GREEN-1, cerrados y re-verificados en GREEN-2 con fixture fresca. Skill desplegada en `skills/sdd-end-release/SKILL.md`.
