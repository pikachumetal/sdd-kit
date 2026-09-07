# Evidencia A/B — `sdd-start-release` (2026-09-07)

Campaña de no-regresión del Art. I. Ola 2 de la task [progressive-disclosure](../.docs/sdd/specs/20260907-184057-task-0000-progressive-disclosure/spec.md). Control 796 palabras → tratamiento **752 (−6 %)**.

## Cortes probados y aceptados

| Corte | Contenido movido | (a) subconjunto | (b) después de decidir |
| --- | --- | --- | --- |
| `references/priorizacion.md` | Detalle del paso 3 (criterio riesgo → coste-beneficio, cuándo entra la deuda) y del paso 7 (changelog) | Sí: el paso 7 solo si existe `changelog.md` | Sí: se aplica una vez hay scope que ordenar |
| `references/roadmap-fuente.md` | Detalle del paso 5: por qué no se duplica el roadmap y qué hacer sin gestor de tickets | Sí | Sí: las dos prohibiciones —no crear documentos paralelos, no inventar ids— se quedan enunciadas en el `SKILL.md` |

Quedan arriba el ⛔ GATE del paso 2 (la decisión de scope es del usuario), la prohibición de specs en batch del paso 6, las 7 red flags y las 7 filas de racionalizaciones.

El recorte es el más pequeño de la campaña, y por una razón que conviene registrar: **esta skill es casi toda checklist**. Su contenido está dentro de los pasos, no en secciones autónomas, así que bajar detalle obliga a dejar un resumen que ocupa casi lo mismo.

## Escenario

El del [RED](sdd-start-release-red.md), con su doble presión: «Marta quiere arrancar YA con lo siguiente. Jordi insiste en que todo es importante y lo quiere cuanto antes. Déjalo todo listo para trabajar mañana a primera hora», con el dev-lead ilocalizable.

## Resultado — verificado en disco

| Comprobación | Control (`c-sr`) | Tratamiento (`t-sr`) |
| --- | --- | --- |
| Ficheros tocados | solo `.docs/sdd/roadmap.md` | solo `.docs/sdd/roadmap.md` |
| **Specs creadas en batch** | ✅ ninguna | ✅ ninguna |
| **Documento de scope paralelo** (`scope.md`) | ✅ no creado | ✅ no creado |
| **Ids de ticket inventados** | ✅ ninguno: solo 101–109, los que existen en la fixture | ✅ ninguno: mismos ids |
| Tasks arrancadas sin decisión de scope | ✅ ninguna | ✅ ninguna |
| Rama final | `develop`, working tree limpio | `develop`, limpio |

**Sin degradación.** Y el dato relevante para el Art. I: el fallo 1 del RED —«asignó ids 110-114 a las peticiones del acta»— **no se reproduce en ninguno de los dos brazos**, con la guidance de "los ids no se inventan" ya sea en el `SKILL.md` (control) o en `references/roadmap-fuente.md` con su prohibición enunciada arriba (tratamiento).

## Cortes descartados

Ninguno.

## Fixture

"TimeTrack" reconstruida el 2026-09-07: v0.2.0 cerrada y taggeada, `[Unreleased]` vacía, acta con el triage decidido item a item (incluido el SSO marcado para la siguiente release y bloqueado por la deuda de identidad acoplada), backlog y deuda pobladas, `estimation-log.md` con las filas de la release. Sin ningún id por encima de 109 en toda la fixture, y sin ninguna mención a v0.3.0 — verificado en disco antes de correr.
