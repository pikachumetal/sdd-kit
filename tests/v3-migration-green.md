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

## Pasada de fix de la revisión final

Los tres ejes (Spec, Código y Arquitectura) coincidieron en tres cosas:
- la búsqueda de enlaces del paso de enlaces no podía salir verde;
- el molde no pasaba `capability check`;
- la fecha de la deuda no se distinguía de la de hoy.

Señalaron además el orden entre los pasos de producto, roadmap y deuda, que con un gate rechazado dejaba un proyecto a medio migrar, y la deuda `parcial` que se perdía.

La pasada de fix reescribe `v3.0.0.md`:
- los traslados en un solo paso con su tabla;
- roadmap y deuda en un solo paso, con un solo gate, y el `git rm` del roadmap al final;
- las decisiones abiertas, al paso del roadmap;
- cada paso empieza por su predicado;
- una búsqueda de enlaces Markdown con su tabla de correspondencias;
- la `parcial`, a su sección por su «Destino»;
- las formas de `**Actuar**` de este repo;
- el Impacto que se pierde, nombrado;
- una «Verificación» que no frena por fallos previos de las capacidades, como la v2.0.0.

El molde gana:
- una capacidad válida;
- la 0024 «tras 0015», un id que no queda en `ROADMAP.md` ni en `CHANGELOG.md`;
- dos commits con fechas pasadas: 2026-09-01, y 2026-09-15 para la fila de TypeScript.

La rúbrica gana V6 (cierre) y se endurecen V1 a V3.

| Sujeto | Puerta | Conducta | Veredicto |
| --- | --- | --- | --- |
| `v1-1`, `v1-2` | `sdd-upgrade` | Estructura completa con `capability check` en verde. La 0024 lleva `—` en «Tras». Las fechas de la deuda son 2026-09-15 (TypeScript) y 2026-09-01 (el resto). Tamaño `M` tras pedirlo. Cierran con `sdd upgrade --mark 3.0.0` y el commit `chore(sdd): migrar al kit v3.0.0` | V1-V4 ✅, V6 ✅ |
| `v2-1` | `sdd-upgrade` | Con el dev-lead ausente, nada se mueve | V5 ✅ |
| `o1-1`, `o1-2`, `o2-1`, `m1-1` | `sdd-propose` / `sdd-upgrade` | Control de regresión con `v3.0.0.md` en el kit: ofrecen «hasta la 3.0.0», aplican la 2.3.4 con su commit y dejan la 3.0.0 pendiente sin nadie que apruebe sus tablas | ✅ |
| `h1-1` | `sdd-upgrade` (esperada `sdd-init`) | Con «Usa la skill sdd-kit:sdd-init. Ponme el proyecto al día.» entra directo por `sdd-upgrade`, por la orden del hook. Migra a 2.3.4 con `--mark` y su commit | puerta ❌, conducta ✅ |

8 sujetos, 1,90 $. Campaña total: 13 sujetos y 2,92 $, frente a una previsión de 8 sujetos y ~6 $. Se pasa en sujetos, porque la pasada de fix repitió los escenarios viejos para comprobar que no regresaban, y queda por debajo en dinero.
