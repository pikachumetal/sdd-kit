# Roadmap — <proyecto>

> Índice vivo del proyecto: qué viene, qué se debe y qué se cerró. Lo leen las skills del kit: `sdd-start-release` (Backlog y deuda técnica), `sdd-end-task` (marca la fila de la task), `sdd-end-patch` (tabla de Patches) y `sdd-end-release` (colapsa la sección de una release a resumen y enlaces). **Las secciones y las cabeceras de tabla van literales**: una columna renombrada rompe a la skill que la lee. Estados de fila: ⏳ pendiente · 🔄 en curso · ✅ hecho y validado · 🧪 validación diferida a <disparador> · ⏸️ aparcada: <motivo>. Con ids de secuencia (`ids.mode: sequence`), el id de una task planificada se reserva aquí. Borra los bloques de ayuda (`>`) al redactar.

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |
| <id> | <qué> | ⏳ |

> Una release abierta con `sdd-start-release` añade aquí debajo su sección `## Release <N>`, con una fila por task y su id reservado; `sdd-end-release` la colapsa al cerrar.

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| <id> | <qué> | <quién o qué lo pidió> |

## Deuda técnica

> Solo ingeniería. Las peticiones de producto van al Backlog, nunca aquí.

| Ítem | Impacto | Destino |
| --- | --- | --- |
| <qué falta o está mal, con la evidencia> | <alto · medio · bajo, y por qué> | <task, patch o cuándo> |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas

> Las releases ya colapsadas por `sdd-end-release`, más reciente arriba: una subsección `### vX.Y.Z — <fecha>` por release, con su resumen y enlaces. Nace vacía.
