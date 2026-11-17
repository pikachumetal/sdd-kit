# Walkthrough — Documentos de flujo SDD (greenfield + brownfield + anexo)

> Cierre retroactivo (2026-07-09, mismo día): la tarea se ejecutó antes de existir este repo; se documenta aquí al migrar la spec (Art. VII).

## 1. Cambios realizados

- `Flux … — Projectes greenfield.md` — evolución del documento original: documentos de anclaje con tabla de mapeo desde su `Claude.md`, ciclo por tarea con gates, verificación en 3 niveles, carril hotfix, "cuándo NO usar SDD", trazabilidad con datos anónimos.
- `Flux … — Projectes brownfield.md` — onboarding del codebase (estado real, no ideal), reglas de oro brownfield, verificación centrada en regresión, evidencia METR contextualizada con su actualización de 2026.
- `Flux … — Annex: evidència i referències.md` — dossier completo: estado del arte, convergencia de industria, mapeo Anthropic↔flujo del equipo, evidencia cuantitativa (con matices honestos), evidencia pro-planificación (TOSEM +25,4%, From Plan to Action, Agentless, telemetría Claude Code, DORA), resultados internos anonimizados, riesgos reconocidos, 26 fuentes clasificadas.
- Investigación previa: 6 agentes (4 repos internos + skills + estado del arte web) + 2 búsquedas dirigidas posteriores (encuesta METR, evidencia cuantitativa pro-SDD).

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación: — (no hubo plan formal; el plan vivía en la spec §9)
- Esfuerzo real: ~3 h (aproximado — incluye investigación, grilling y redacción de los 3 documentos)
- Desviación: N/A (sin estimación previa)

## 3. Desviaciones del plan

- El anexo creció respecto a lo previsto: se añadió a posteriori la sección "Evidència a favor de la planificació" (petición del usuario: buscar evidencia cuantitativa pro-SDD) y la encuesta METR de mayo 2026.
- Cambio de convención a mitad de ejecución: `docs/` → `.docs/` (decisión 15, aplicada retroactivamente a los tres documentos).

## 4. Verificación

- Revisión del usuario documento a documento (checkpoint tras cada uno): greenfield ✅, brownfield ✅, anexo ✅.
- Enlaces del anexo verificados por lectura directa de fuente primaria el 2026-07-09.
- Cita de METR blindada tras la actualización 2026 (fechada + matiz de evidencia débil).

## 5. Aprendizajes

- Reconocer límites explícitamente ("cuándo NO usar SDD", el matiz de Thoughtworks) refuerza la credibilidad técnica de un documento de proceso → incorporado como doctrina en los documentos y en el diseño del kit.
- La evidencia externa citable (fuentes primarias, clasificadas por fiabilidad) sostiene un documento de proceso mejor que la opinión → método aplicado en el anexo.
- La decisión "una tarea, un contexto" y el tamaño ≤1 jornada salieron de observación de campo → volcadas a los documentos y a `sdd-start-task`.
