---
id: 20261019-083116-feature-0197-v3-migration
title: Tasks — Migración v3.0.0, los documentos a la estructura de la 3.0.0
spec: ./spec.md
plan: ./plan.md
created: 2026-10-19
---

# Tasks — Migración v3.0.0 (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0197-v3-migration`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Molde, RED y pasos de estructura | done | 5738728 | RED v1 2 sujetos |
| 2 | Roadmap y deuda, y GREEN | done | 396a5f1 | GREEN v1 2/2, v2 1/1 |
| 3 | Plantilla deprecada y topes | done | 5c12563 | AnchorTemplates gana el It de la deprecación |

## Verificación por task

- [x] Task 1 — `Invoke-Pester tests/MigrationInitParity.Tests.ps1 -CI`: 31/31
- [x] Task 2 — `MigrationInitParity` 31/31; batería `sdd-upgrade` (v1, v2) 3/3
- [x] Task 3 — `Invoke-Pester tests/WordBudget.Tests.ps1, tests/AnchorTemplates.Tests.ps1 -CI`: 140/140

## Revisión

Revisión final: Spec opus+high, with fixes · Código sonnet+high, with fixes · Arquitectura opus+high, with fixes, sobre 5c12563
Re-revisión: 5c12563..juntada en el cierre, sdd-kit:effort-high + opus, 10 de 10 ADDRESSED; 2 Important y 6 Minor nuevos, adjudicados (a la 0199)
Pasada de fix: juntada en el cierre, 10 hallazgos (los de ejecución, medidos con la campaña v1 2/2, v2 1/1, o1 2/2, o2 1/1, m1 1/1; los de lectura, sin RED)

## Fixes adicionales

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

Task 1: Ruling: línea base = el pre-commit de la apertura (63a11931: kit:test-fast 1221 y cli:test 1020, verdes); el gate completo (~25 min) corre al cierre — coste si mal: un rojo de la base se vería en el cierre
Task 1: Ruling: el RED corrió 2 sujetos y no 1 (battery.sh usa la n del escenario) — 0,24 $ — coste si mal: ninguno
Task 1: Ruling: el molde no lleva un patch anterior a la última release en «Patches»: un roadmap 2.x válido no puede tenerlo (sale en el corte), así que esa fila de la receta solo se mide por lectura — coste si mal: la receta de los patches anteriores queda sin sujeto
Task 1: Ruling: la frase «Además…» del **Escribe** va sin backticks, como la v2.0.0: MigrationInitParity lee como tokens todo lo que va entre backticks en la línea — coste si mal: ninguno
Task 2: Ruling: la decisión 1 de la spec decía que sin paso de marcador el proyecto quedaría en 2.3.4; el GREEN (v1-2) muestra que sdd-upgrade cierra la versión con --mark 3.0.0 igual. Hasta la 0199, un proyecto migrado con el kit de develop quedaría en 3.0.0 sin los pasos de la 0199. Se anota en la fila 0199; solo afecta al kit de develop — coste si mal: un proyecto migrado en ese hueco tendría que aplicar a mano los pasos de la 0199
Task 2: Ruling: GREEN limpio a la primera (3/3); la reserva de REFACTOR no se usa; campaña 5 sujetos, 1,02 $ — coste si mal: ninguno
Task 3: Ruling: AnchorTemplates exigía «2.x: la retira la 0157» en el índice; con la deprecación, su caso de roadmap-template pasa a un It propio que exige la marca de deprecación — el plan no lo listaba entre los ficheros — coste si mal: ninguno
Final: Ruling: (Arquitectura I2) una fila de deuda saldada posterior a la última release va a «Lista» con su prefijo, como dice la decisión 9 y el THEN aprobado; sacarla cambiaría un THEN (desvío). Quién la saca en la 3.0.0 es del corte de release: se anota en la fila 0177 — coste si mal: una fila saldada se lee como pendiente hasta el primer corte 3.0.0
Final: Ruling: (Arquitectura I5) las `validaciones pendientes:` de una release cerrada se quedan sin lector en la 3.0.0 (su disparador sigue en el walkthrough); se anota en la fila 0177 para que el corte 3.0.0 las rescate — coste si mal: una validación diferida de una release vieja no la reclama nadie
Final: Ruling: (Arquitectura I1) una fila de deuda `parcial` anterior a la última release ya no sale: va a su sección por su «Destino», con el «Ítem» reescrito a lo que queda — la decisión 9 la sacaba y perdía deuda abierta; ningún THEN la nombra — coste si mal: ninguno
Final: Ruling: (Spec I4) el THEN «no aparece el 0017» de la spec no se puede medir: un roadmap 2.x válido no tiene en «Patches» un patch anterior a la última release; queda por lectura — coste si mal: la receta de los patches anteriores sin sujeto
Final: Ruling: (Spec M11) la decisión 1 de la spec dice que el proyecto se quedaría en 2.3.4 sin paso de marcador; el GREEN muestra que `sdd-upgrade` lo marca 3.0.0. Va al walkthrough y a la fila 0199, sin enmienda: no cambia ningún THEN — coste si mal: ninguno
Final: Ruling: (Código I7) los escenarios viejos de sdd-upgrade con v3.0.0.md en el kit: o1, o2 y m1 en verde; h1 rojo en la puerta porque la orden del hook («si la petición ya pide ponerse al día, invoca sdd-upgrade») gana a «Usa la skill sdd-kit:sdd-init»; la conducta (migrar con --mark y commit) es correcta; no es de esta feature y no se relanza — coste si mal: h1 deja de medir el traspaso desde sdd-init
Final: Ruling: la campaña llega a 13 sujetos frente a los 8 de la previsión (Art. I pide parar y que decida el dev-lead): la pasada de fix repitió los escenarios viejos para ver si regresaban; el dinero quedó en 2,92 $ de ~6 $. No paré: va al mensaje final — coste si mal: 5 sujetos (~1 $) sin la decisión del dev-lead
Final: minor (deferred): (h1) el escenario h1 ya no mide el traspaso desde el predicado 3 de sdd-init con migraciones pendientes: la orden del hook manda directo a sdd-upgrade
Final: minor (deferred): (Código M6) sin Pester que fije el texto de v3.0.0.md; la cubre la batería
Final: minor (deferred): (Spec, no juzgado) sdd-upgrade marca y commitea aunque la Verificación falle (conducta previa de la skill)
Final: Ruling: (re-revisión, Important) el paso 4 solo casa enlaces Markdown: un CLAUDE.md 2.x con punteros en code span (`.docs/sdd/roadmap.md`) queda roto con la Verificación en verde — va a la 0199, que es quien toca los textos de CLAUDE.md, AGENTS.md y README.md; anotado en su fila — coste si mal: un proyecto migrado entre la 0197 y la 0199 queda con punteros muertos en su CLAUDE.md
Final: Ruling: (re-revisión, Important de letra) `git log -S'<…>'` con comillas simples y sin marcas, frente al `-S"<…>"` del plan y la spec: con comillas dobles un ítem con backticks ejecuta comandos en bash; el texto de v3.0.0.md es el bueno y este ruling corrige el literal del plan (Restricciones) y de la spec (decisión 9) — coste si mal: ninguno
Final: Ruling: (re-revisión, Minors) el predicado del paso 4 sin el paso 3, las decisiones abiertas que se pierden si el paso 3 queda pendiente tras aplicar el 2, la Verificación del grep con enlaces entre hermanos de steering/, la `parcial` posterior que también va a su sección (extiende el ruling de la anterior), cómo enseñar el diff del log antes del gate (`sdd estimation log --out`) y los enlaces relativos de la Evidencia en debt.md — van a la fila 0199, que acaba v3.0.0.md — coste si mal: casos raros con pérdida o enlace roto hasta la 0199
Final: Ruling: exceso de la campaña (13 sujetos frente a 8, 2,92 $ de ~6 $) aceptado por el dev-lead: «Acepto el exceso (Recomendada)», 2026-10-19 — coste si mal: ninguno
