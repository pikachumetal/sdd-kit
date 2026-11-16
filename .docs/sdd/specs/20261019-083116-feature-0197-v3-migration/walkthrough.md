---
id: 20261019-083116-feature-0197-v3-migration
feature: 0197
title: Walkthrough — Migración v3.0.0, los documentos a la estructura de la 3.0.0
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-19
---

# Walkthrough — Migración v3.0.0: los documentos a la estructura de la 3.0.0

## 1. Cambios realizados

- **Partición** (apertura): la 0197 se partió al arrancarla en dos. Esta hace la estructura, el roadmap y la deuda, la plantilla y los topes; la 0199 hace los textos, el gate B6, el aviso de plantillas y el marcador. Tres filas de deuda pasaron a la 0199, y la 0198 va tras ella.
- **Migración** (Tasks 1 y 2, rehecha en la pasada de fix): `skills/sdd-upgrade/references/migrations/v3.0.0.md`, en cuatro pasos con el patrón de la v2.3.0 (predicado, punto de partida, tabla, gate, aplicar):
  - traslados: `changelog.md` → `CHANGELOG.md`, y la constitution, la arquitectura y la estimación a `steering/`, con el log regenerado;
  - producto y operaciones: `mission.md` → `PRODUCT.md`, y `tech-stack.md` y `environments.md` → `steering/operations.md`;
  - roadmap y deuda, con un solo gate: `ROADMAP.md` y `steering/debt.md`;
  - enlaces, buscados como enlaces Markdown con su tabla de correspondencias.
  
  Nada se inventa: el Tamaño lo da el dev-lead; la fecha de una deuda sale del commit que la añadió, y si no, la pide; la evidencia, del «Ítem», y sin ella la fila va a «Por triar».
- **Batería** (Task 1 y pasada de fix): molde `mold-v2x`, un proyecto 2.x completo en dos commits con fechas pasadas; persona `persona-v2x.md`; escenarios `v1` y `v2`; rúbrica V1 a V6.
- **Plantilla y topes** (Task 3): `roadmap-template.md` queda deprecada y se borra en la 4.0.0 (decisión del dev-lead; `AnchorTemplates` lo fija y el Backlog gana la B20). Los topes de `sdd-templates` (1.700 y 15.300) y del kit (87.500) vuelven, re-medidos sobre la base integrada con la 0185.
- **Cierre**: delta fusionado en `migration`; changelog; roadmap (0197 ✅, la deuda l.415 saldada, notas en las filas 0177 y 0199); estimation-log.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3,5h
- Esfuerzo real: 2 h — aproximado con las marcas de la sesión y de los commits: del arranque (2026-10-18, 13:50) a la partición y la pregunta de la plantilla (~0,3 h), y del 2026-10-19 de las 10:15 al cierre (~1,7 h). `sdd session tokens` midió 15,00 h para la rama, porque la sesión es la misma que la de la 0157 y cuenta desde su arranque, con el corte de luz dentro
- Desviación: −1,5 h (−43 %)
- Causa de la desviación: la campaña fue más barata y rápida de lo previsto (13 sujetos, 2,92 $ frente a ~6 $), y las tasks se solaparon con el RED, el GREEN y el gate en segundo plano.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 67.882.681 — claude-opus-5-5 67.882.681 (la sesión entera, con la 0157)
- Tokens de subagentes: 11.542.398 en 6 despachos — Eje Código revisión final 0197 claude-sonnet-5-5 2.733.349 / 6 min; Eje Arquitectura revisión final 0197 claude-opus-5-5 4.257.189 / 4 min; Re-revisión única de la 0197 claude-opus-5-5 108.257 / 0 min, en curso; Revisor de dominio de la spec 0197 claude-opus-5-5 419.637 / 2 min; Eje Spec revisión final 0197 claude-opus-5-5 3.474.225 / 5 min; Revisor técnico de la spec 0197 claude-sonnet-5-5 549.741 / 1 min
- Coste de la sesión: 33,82 $ (hilo 27,04 $ + subagentes 6,78 $), la sesión entera con la 0157
- Coste de sujetos: 2,92 $ en 13 sujetos sonnet (con la persona en haiku) — RED 0,24 $; GREEN 0,78 $; pasada de fix 1,90 $
- Review de spec: 2 revisores · hallazgos 20, aceptados 20

## 3. Desviaciones del plan

- La pasada de fix reescribió `v3.0.0.md`. Cambió los siete pasos del plan por cuatro: los traslados en uno, y el roadmap y la deuda en uno.
- La Task 3 tocó `tests/AnchorTemplates.Tests.ps1`, que el plan no listaba.
- La campaña llegó a 13 sujetos frente a 8: la pasada de fix repitió los escenarios viejos para ver si regresaban.

### Decisiones tomadas sin el dev-lead

- La línea base es el pre-commit de la apertura (`kit:test-fast` 1221 y `cli:test` 1020), y el gate completo corre al cierre — coste si mal: un rojo de la base se vería al cierre.
- El RED corrió 2 sujetos y no 1, porque la batería usa la n del escenario — coste si mal: ninguno.
- El molde no lleva un patch anterior a la release en «Patches»: un roadmap 2.x válido no puede tenerlo. Esa receta y el THEN «no aparece el 0017» quedan por lectura — coste si mal: esa receta sin sujeto.
- La frase «Además…» de `**Escribe**:` va sin backticks, como la v2.0.0, porque `MigrationInitParity` lee como tokens lo que va entre backticks en esa línea — coste si mal: ninguno.
- La decisión 1 de la spec decía que un proyecto migrado antes de la 0199 se quedaría en 2.3.4. El GREEN muestra que `sdd-upgrade` lo marca 3.0.0 igual; queda anotado en la fila 0199 — coste si mal: un proyecto migrado con el kit de `develop` en ese hueco tendría que aplicar a mano los pasos de la 0199.
- La saldada posterior a la última release va a «Lista» con su prefijo, como dice el THEN aprobado. Quién la saca es del corte 3.0.0 (fila 0177) — coste si mal: una fila saldada se lee como pendiente hasta el primer corte.
- Las `validaciones pendientes:` de una release cerrada no tienen lector en la 3.0.0; el corte las rescata (fila 0177) — coste si mal: nadie reclama una validación diferida vieja.
- La deuda `parcial` anterior a la release ya no sale: va a su sección. La decisión 9 la sacaba; ningún THEN la nombraba — coste si mal: ninguno.
- `AnchorTemplates` gana un `It` para la deprecación — coste si mal: ninguno.
- `h1` sale rojo en la puerta con el kit nuevo: la orden del hook manda directo a `sdd-upgrade`. La conducta es correcta y no se relanza — coste si mal: `h1` deja de medir el traspaso desde `sdd-init`.
- 13 sujetos frente a los 8 previstos: lo aceptaste tras la revisión («Acepto el exceso (Recomendada)», 2026-10-19); el dinero quedó por debajo (2,92 $ de ~6 $).
- La re-revisión dejó 2 Important: los punteros en code span de `CLAUDE.md` que el paso de enlaces no ve, y el `git log -S` entre comillas simples, que corrige el literal del plan y de la spec porque con comillas dobles un ítem con backticks ejecuta comandos. Dejó además 6 Minor del texto de `v3.0.0.md`. Van a la 0199, que acaba la migración — coste si mal: un proyecto migrado en el hueco queda con punteros muertos en su `CLAUDE.md`.

**Minors diferidos**:
- `h1` ya no mide el traspaso desde `sdd-init`.
- No hay un Pester que fije el texto de `v3.0.0.md`.
- `sdd-upgrade` marca y commitea aunque la «Verificación» falle; es conducta previa de la skill.

## 4. Verificación

### 4.1 Builds

- Pre-commit de cada commit (`kit:test-fast` + `cli:test`): verde en los cinco.
- Suite completa: `moon run kit:test cli:typecheck cli:test --force`, `moon run cli:test-slow --force` y `moon run cli:test-min --force`, por separado, sobre `5c12563` → `kit:test` 1304/1304, typecheck verde, `cli:test` 1029/1029, `cli:test-slow` 188/188 y `cli:test-min` 1217/1217, en 8 min. La pasada de fix solo cambió Markdown, la batería y el molde; su pre-commit dio `kit:test-fast` 1224 y `cli:test` 1029.
- Sobre la base integrada con develop (con la 0185), por partes y con --force: kit:test 1324/1324, typecheck verde, cli:test 1032/1032, cli:test-slow 188/188 y cli:test-min 1220/1220, en 10 min.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-19 · suite completa · campaña de 13 sujetos (RED v1 0/2; GREEN v1 2/2 y v2 1/1; pasada de fix v1 2/2, v2 1/1 y los escenarios viejos o1, o2 y m1 sin regresión) · revisión final en tres ejes sobre 5c12563 y re-revisión (10 de 10 resueltos; 2 Important y 6 Minor nuevos, adjudicados a la 0199)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `migration` · «no regenera desde cero»: los reestructura con tabla y gate | ejecución real (`v1`: tablas antes de mover) | ✅ |
| `PRODUCT.md` con sus cuatro encabezados y «**Franja**:» | ejecución real (`v1-1`, `v1-2`) | ✅ |
| `steering/operations.md` con Comandos, Testing y Entornos; sin «Tecnologías» | ejecución real | ✅ |
| La decisión abierta como fila de Later con el `B<n>` siguiente | ejecución real (B4) | ✅ |
| Sin `mission.md`, `tech-stack.md` ni `environments.md`, con `git show <sha>:` en el informe y el commit | ejecución real | ✅ |
| Los documentos de estado a `steering/` con el enlace a la ADR corregido; el log regenerado | ejecución real | ✅ |
| Enlaces de `CLAUDE.md` y `README.md` corregidos; la ADR intacta y listada | ejecución real | ✅ |
| `specs/`, `capabilities/`, `decisions/` y `releases/` en su sitio | ejecución real | ✅ |
| La 0021 y la 0022 en Now con brief, «Tras» y Tamaño `M` del dev-lead | ejecución real | ✅ |
| El patch posterior con `✅` y `**Carril:** patch` | ejecución real (0023) | ✅ |
| La B3 en Later | ejecución real | ✅ |
| La 0016 de `validaciones pendientes:` no entra, y la tabla la nombra | ejecución real | ✅ |
| El patch anterior no aparece | no probado (un roadmap 2.x válido no lo tiene; por lectura) | — |
| El Tamaño se pide antes de escribirlo | ejecución real | ✅ |
| `Roadmap válido` sobre el resultado | ejecución real | ✅ |
| Deuda: Lista con destino 0022 y el ticket como evidencia; la saldada con su prefijo | ejecución real | ✅ |
| Deuda: `sin fila` y `versión siguiente` en Por triar, `**Esperar**` en En espera, `**Descartada**` en Descartadas con su motivo | ejecución real | ✅ |
| Fecha de cada deuda = la de su commit | ejecución real (2026-09-15 y 2026-09-01) | ✅ |
| Sin el dev-lead, nada se mueve ni se commitea | ejecución real (`v2-1`) | ✅ |
| Reglas: `git show` para recuperar, nombres de la raíz en mayúsculas, fundir con gate | ejecución real (las dos primeras); la tercera, por lectura (el molde no trae un `PRODUCT.md` previo) | ✅ / — |

### 4.3 Residuales / deuda generada

- La fila 0177 recibe lo que hereda el corte 3.0.0: las saldadas en «Lista» y las `validaciones pendientes:`.
- La fila 0199 recibe que un proyecto migrado entre la 0197 y la 0199 queda en 3.0.0 sin sus pasos.
- La B20: borrar `roadmap-template.md` en la 4.0.0.
- Los minors diferidos de §3, que van a la 0199 y a la 0152.

## 5. Aprendizajes

- **El gate de cierre por partes no da los timeouts del lento.** Corrido junto, `cli:test-min` dio 3 timeouts en la 0157; en tres `moon run` seguidos, 8 min y en verde → `.docs/sdd/tech-stack.md` está en su tope (18.796 de 18.800). Hay que condensar para meterlo, y va como fila de deuda.
- **Un molde que mide una fecha de commit se commitea con `GIT_AUTHOR_DATE` en el pasado**, si no la fecha del commit y la de hoy coinciden → `tests/batteries/sdd-upgrade/subject.sh` (comentario) y el párrafo de moldes de la batería.
- **Revisión de skills**: abiertas `.claude/skills/` (`skill-creator`, `writing-for-agents` y `writing-skills`); ninguna afirma algo que esta feature desmienta → no aplica.

## 6. Adendas
