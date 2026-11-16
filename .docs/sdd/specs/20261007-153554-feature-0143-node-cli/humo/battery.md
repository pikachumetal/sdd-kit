# Humo de la 0143 — las skills editadas ejecutan la CLI

Una skill por escenario, n = 1, Sonnet, molde `salas`. Pasa si su primera skill es la esperada y el stream muestra la llamada a `cli/bin/sdd.js` con la ruta del plugin sustituida (sin `${CLAUDE_PLUGIN_ROOT}` literal) y el verbo del paso, con salida 0.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| h1 | sdd-start-feature | Usa la skill sdd-kit:sdd-start-feature para añadir un filtro por sala al comando libres. Haz solo el paso 1 (contexto, con el índice de capacidades) y para antes de preguntarme nada. | salas | `sdd-kit:sdd-start-feature` | 1 | 1/1 | sonnet | 0143, `capability index` |
| h2 | sdd-consult | Usa la skill sdd-kit:sdd-consult: ¿qué capacidades documentadas tiene este proyecto? | salas | `sdd-kit:sdd-consult` | 1 | 1/1 | sonnet | 0143, `capability index` |
| h3 | sdd-start-patch | Usa la skill sdd-kit:sdd-start-patch para esto: si cancelo una reserva que no existe me dice «cancelada» igual. Haz solo hasta reservar el id del patch y para. | salas | `sdd-kit:sdd-start-patch` | 1 | 1/1 | sonnet | 0143, `id next` |
| h4 | sdd-roadmap | Usa la skill sdd-kit:sdd-roadmap y comprueba si el roadmap tiene la forma de la plantilla. No cambies nada. | salas | `sdd-kit:sdd-roadmap` | 1 | 1/1 | sonnet | 0143, `roadmap check` |
| h5 | sdd-end-release | Usa la skill sdd-kit:sdd-end-release. Ejecuta solo la comprobación del roadmap de su entrada y para; no cierres nada. | salas | `sdd-kit:sdd-end-release` | 1 | 1/1 | sonnet | 0143, `roadmap check` |
| h6 | sdd-end-feature | Usa la skill sdd-kit:sdd-end-feature. Ejecuta solo su paso que regenera el estimation-log y para; no cierres nada más. | salas | `sdd-kit:sdd-end-feature` | 1 | 1/1 | sonnet | 0143, `estimation log` |
| h7 | sdd-end-patch | Usa la skill sdd-kit:sdd-end-patch. Ejecuta solo la validación de capacidades de su cierre y para; no cierres nada más. | salas | `sdd-kit:sdd-end-patch` | 1 | 1/1 | sonnet | 0143, `capability check` |
| h8 | sdd-init-greenfield | Usa la skill sdd-kit:sdd-init-greenfield. Ejecuta solo el paso que genera el estimation-log del proyecto y para; no me entrevistes. | salas | `sdd-kit:sdd-init-greenfield` | 1 | 1/1 | sonnet | 0143, `estimation log` |
| h9 | sdd-init-brownfield | Usa la skill sdd-kit:sdd-init-brownfield. Ejecuta solo la verificación del roadmap de la migración v2.3.0 y para; no migres nada. | salas | `sdd-kit:sdd-init-brownfield` | 1 | 1/1 | sonnet | 0143, `roadmap check` |
| h10 | sdd-templates | Usa la skill sdd-kit:sdd-templates: dime con qué orden se ve la ayuda de la CLI del kit y ejecútala. | salas | `sdd-kit:sdd-templates` | 1 | 1/1 | sonnet | 0143, `--help` |
