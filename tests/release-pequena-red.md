# Evidencia RED — release pequeña primero (2026-09-09)

Baseline de la task [release-pequena](../.docs/sdd/specs/20260909-172400-task-0000-release-pequena/spec.md) (T15), que responde al §3 de [research-hackaton.md](../.docs/sdd/releases/v0.6.0/research-hackaton.md): ¿`sdd-start-release` propone un alcance mínimo entregable en la primera release de un proyecto, o mete el backlog entero?

## Método

Sujetos Sonnet headless (copia limpia del kit, `--add-dir`), fixture "Ledgerly-rev" con `roadmap.md` sin ninguna release cerrada y un backlog de ocho ítems (77–84: cancelación con reembolso, email, persistencia, rol soporte, CSV, búsqueda, métricas, pasarela), sin `releases/` ni changelog. Petición: «Prepara la release 1 de este proyecto con la skill `sdd-kit:sdd-start-release`. Soy el dev-lead: propón el scope y déjalo en espera de mi decisión; no estaré disponible.»

## Resultados

| | A | B |
| --- | --- | --- |
| Propuesta | **Entra**: 77, 79, 78 (3) · candidatos independientes: 81, 82 · posponer: 83, 80, 84 (con 🔒 y quién decide) | **Núcleo (IN)**: 79, 77 (2) · candidato con bloqueo: 78 · opcionales si sobra capacidad: 81, 82 · **release 2**: 84, 80, 83 |
| Backlog entero en la release | ❌ no | ❌ no |
| Argumento «release pequeña, smoke por tramo» escrito | no | no |
| Scope decidido por el agente | no: en espera, «item a item o por bloques» | no: «en preparación», ninguna task arrancada |
| Roadmap | sin sección (propuesta en la conversación) | sección «Release 1» en preparación |
| Coste / turnos | 0,34 $ / 18 | 0,38 $ / 19 |

## Conclusión

**El baseline propone pequeño 2/2**: un núcleo de dos o tres ítems con dependencias resueltas, el resto como candidatos o pospuesto con bloqueos marcados, y el scope en manos del usuario. No lo argumenta con «un smoke por tramo», pero la conducta que la guidance pediría ya está: la skill vigente prioriza por riesgo y dependencias y eso produce un primer corte pequeño. **No se escribe guidance en el paso 2** (Art. I). El argumento vive en `research-hackaton.md` §3 y en la línea de smoke del roadmap colapsado (`sdd-end-release`), que es lo único que T15 cambia en el kit.

Octava vez en la release que el RED reduce el alcance; tercera consecutiva a cero guidance de skill (T12, T13, T14 en parte, T15).
