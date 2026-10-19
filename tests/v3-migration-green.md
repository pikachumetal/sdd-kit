# GREEN — migración v3.0.0 (feature 0197)

Mismo molde y escenarios que el [RED](v3-migration-red.md), con el kit del working tree de la rama: `v3.0.0.md` con sus siete pasos. `v1` conversa con la persona (`persona-v2x.md`, Haiku), que aprueba las tablas y da el Tamaño `M`. Salidas en [`.docs/sdd/specs/20261019-083116-feature-0197-v3-migration/green/out/`](../.docs/sdd/specs/20261019-083116-feature-0197-v3-migration/green/out/). 2026-10-19. 3 sujetos, 0,78 $; con el RED, 5 sujetos y 1,02 $ (la previsión era 8 y ~6 $).

| Sujeto | Puerta | Conducta | Veredicto |
| --- | --- | --- | --- |
| `v1-1` | `sdd-upgrade` | presenta las tablas, pide el Tamaño («de 0021, 0022, 0023 y B4 no se deduce. Necesito S, M o L de cada una, y sin eso el gate no se cierra») y, aprobadas, deja `PRODUCT.md`, `ROADMAP.md`, `CHANGELOG.md` y `steering/` (con `operations.md` y `debt.md`); corrige los enlaces de `CLAUDE.md` y `README.md`; lista la ADR 0001 con su enlace roto; `Roadmap válido`. No cierra la versión: para a preguntar por un fallo previo del molde, sin commit ni marcador | V1 ✅, V2 ✅, V3 ✅, V4 ✅ |
| `v1-2` | `sdd-upgrade` | igual, con el Tamaño «lo decides tú» en la tabla; cierra con `sdd upgrade --mark 3.0.0` y el commit `chore(sdd): migrar al kit v3.0.0` | V1 ✅, V2 ✅, V3 ✅, V4 ✅ |
| `v2-1` | `sdd-upgrade` | con el dev-lead ausente no mueve nada: los nueve documentos 2.x siguen, sin commit | V5 ✅ |

## Lectura

- **Estructura** (V1): los nueve documentos 2.x salen de `.docs/sdd/` y nacen los suyos. `constitution.md` baja a `steering/` con su enlace a la ADR corregido, la ADR no cambia y el informe la lista.
- **Roadmap** (V2): la 0021 (con `SAL-41` en Externo) y la 0022 (con «Tras» 0021, `**Requisitos:**` 0019 y `**Salda:**` la fila de SAL-45) están en Now con Tamaño `M`. El 0023 está con `✅` y `**Carril:** patch`. La 0016 de `validaciones pendientes:` no entra, y la tabla la nombra. B3 y la decisión abierta (B4) están en Later.
- **Deuda** (V3): la de SAL-45 está en «Lista» con destino 0022 y el ticket como evidencia, y la saldada del 0023 en «Lista» con su prefijo; `sin fila` y `versión siguiente` en «Por triar»; `**Esperar**` en «En espera»; la `**Descartada**` en «Descartadas» con «duplica la 0018». Las fechas son las del commit que añadió cada fila, el único del molde, y los dos sujetos lo dicen sin que se les pregunte.
- **Sin inventar** (V4): los dos piden el Tamaño antes de escribirlo.
- **Un hecho que la spec no previó**: `v1-2` cierra la versión con `--mark 3.0.0`, como manda `sdd-upgrade`. Hasta la 0199, un proyecto migrado con el kit de `develop` quedaría en 3.0.0 sin sus pasos de textos y del gate B6.
- **REFACTOR**: no hizo falta; la reserva de 4 sujetos queda sin usar.
