---
id: 20261012-220057-feature-0173-form-for-omissions-and-refactor-stop
feature: 0173
title: Walkthrough — Art. II: la forma para un elemento omitido y cuándo parar el REFACTOR de una skill
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-13
---

# Walkthrough — Art. II: la forma para un elemento omitido y cuándo parar el REFACTOR de una skill

## 1. Cambios realizados

- **Escenarios `o1` y `o2`** (`45a38e3`, `fd4e5b7`): en la batería de `sdd-implement`, sobre `mold-kit`, la feature 0020 (`guardar-nota` debe responder con la ruta) con su humo en rojo por omisión; `o2` trae además una ronda en prosa ya fallada 0/3. `form_rules` copia al molde el Art. II y la regla de parada del kit que se prueba, así que cada escenario sirve de RED y de GREEN.
- **`sdd-implement`** (`ae7cad0`): en el paso 2 del bucle Native, ante un humo de una skill que falla, se lee la regla de forma de la constitution, se nombra la clase del fallo y la ronda se escribe en esa forma. Tope de la skill a 5.560 palabras (total 9.160).
- **Art. II y ADR 0014** (pasada de fix `c85e641`): la fila «Elemento omitido → hueco obligatorio en la plantilla que rellena, no un recordatorio en prosa», traída de `writing-skills` de superpowers, con su aviso en `THIRD_PARTY_NOTICES.md` y el tope de la constitution a 2.230. La rúbrica `O1` queda desempatada: un marcador solo dentro de la ruta, en una frase que pide incluirla, es prosa.
- **No entran**: la regla de parada tras una ronda 0/N (RED `o2` limpio) y el recorte del techo de coste que la compensaba. En el cierre, la entrada del techo de coste de `tech-stack.md` sí se queda en una frase, para hacer sitio al aprendizaje de abajo.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5 h
- Esfuerzo real: 1,6 h — reloj del hilo por las marcas de los commits, de la apertura (`875e509`, 08:58) al cierre (~10:35); sin la espera a la aprobación de la spec. Spec y plan: ~0,5 h la noche anterior.
- Desviación: −0,9 h (−36 %)
- Causa de la desviación: cada tanda de sujetos tardó ~5 min y las tres tareas fueron de texto; la Task 3 que entró por enmienda y la pasada de fix sumaron ~45 min, menos de lo que se ahorró.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 48.704.849 — claude-opus-5-5 48.704.849
- Tokens de subagentes: 1.372.411 en 1 despacho — Revisión final rama 0173 claude-opus-5-5 1.372.411 / 4 min
- Coste de la sesión: 19,70 $ (hilo 18,31 $ + subagentes 1,39 $)
- Coste de sujetos: 3,52 $ en 14 sujetos sonnet — RED `o1` 0,94 $ (4); RED `o2` 0,54 $ (2); GREEN con la frase sola 1,03 $ (4, `green-v1/`); GREEN con la fila y la frase 1,00 $ (4)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Entró una Task 3 que el plan no tenía: la frase de `sdd-implement`, por la causa que midió el RED de `o1` (sujetos que no abren la constitution). Enmienda aprobada: «Meterla en la 0173 ahora» y «Apruebo (Recomendada)».
- La fila del Art. II salió por una enmienda y volvió en la pasada de fix: la primera calificación del RED de `o1` fue a ojo; con la rúbrica escrita falla 3/4, también uno de los que leyeron el artículo.
- La ADR es `0014-form-for-omissions.md` y no `…-and-refactor-stop.md`: la regla de parada no entró.

### Decisiones tomadas sin el dev-lead

- Task 0: Ruling: skills — la sesión carga el plugin de la caché (anterior, sin sdd-implement, sdd-tdd ni sdd-worktrees): se siguen las de la rama leídas con Read — sin coste
- Task 0: Ruling: effort — `sdd-kit:effort-high` está entre los agentes de la sesión: el revisor final va con su tipo y `opus`
- Task 1: Ruling: una tanda más de o1 (o1-3, o1-4) antes del veredicto — 2 sujetos no separan «la regla vigente basta» de «no la leyó» — ~0,5 $, dentro del techo de 10 sujetos y 5 $
- Task 1: Ruling: la fila del Art. II no entra (Art. I y decisión del dev-lead «1») — corregido en la pasada de fix (abajo)
- Task 2: Ruling: la regla de parada no entra (Art. I, Approach de la spec: cada regla entra solo si su RED falla) — con el Art. II vigente leído, la segunda ronda ya cambia de forma 2/2; sin ADR para ella ni el recorte que la compensaba
- Task 3: Ruling: enmienda aprobada («Meterla en la 0173 ahora», «Apruebo (Recomendada)») — regla en sdd-implement, paso 2 del bucle Native; tope 5560 (total 9160); previsión 14 sujetos
- Final: Ruling: Important 1 aceptado — recalificados los 10 sujetos con la rúbrica escrita: RED o1 3/4 fallan (lectores 1/2), RED o2 2/2 limpio, GREEN con la frase sola o1 2/2 y o2 1/2 — la fila del Art. II entra, como pedía la spec aprobada («1»: si o1 falla, la fila entra)
- Final: Ruling: Declined «la frase solo está en el bucle Native; SDD no la recibe» — la spec la fija en el paso 2 del bucle Native — si importa, un REFACTOR de skill en SDD repite el fallo de o1; va a deuda
- Final: Ruling: Declined «el fixture de o2 no trae ledger de la ronda 1» — la rúbrica mide la forma de la ronda, no el ledger — sin coste
- Final: Ruling: la ADR se llama 0014-form-for-omissions.md — la regla de parada no entró — sin coste
- Final: minor (deferred): form_rules escribe un tech-stack.md vacío y CLAUDE.md lo anuncia, porque la regla de parada no entró
- Final: minor (deferred): el commit de la Task 1 trae los fixtures y la rama de o2 que el plan asignaba a la Task 2
- Final: minor (deferred): la verificación de la Task 3 no corrió Battery.Tests.ps1; lo cubre el gate final

## 4. Verificación

### 4.1 Builds

- Gate de cierre (`no declarado` en `tech-stack.md`; el de la 0165 y la 0166): `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` sobre `ae7cad0` → Pester 1.169/1.169, CLI 757/757, lentos 157/157, Node mínimo 918/918 · ~7 min. Tras la pasada de fix, `moon run kit:test` sobre `c85e641` → Pester 1.169/1.169 · 3,4 min. La baseline sobre `875e509` salió igual de verde, `FastSuiteBudget` incluido.
- `sdd decision check --path .docs/sdd` → «Decisiones válidas»; `sdd roadmap check` → válido.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-13 · gate de cierre en verde · smoke con ejecución real por sujetos headless (GREEN `o1` 2/2 y `o2` 2/2, con la plantilla en un bloque y su hueco) · revisión final opus effort high sobre `ae7cad0` (2 Important arreglados en `c85e641`).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `o1`: la ronda ante una omisión es un hueco en la plantilla, no una frase | ejecución real (GREEN `o1` 2/2; RED 3/4 en prosa) | ✅ |
| `o2`: una ronda 0/N no se repite con la misma forma | ejecución real (GREEN `o2` 2/2; RED 2/2 limpio, por eso la regla de parada no entra) | ✅ |
| Tope de la constitution | suite (`WordBudget.Tests.ps1`) | ✅ |

### 4.3 Residuales / deuda generada

- La frase de `sdd-implement` solo está en el bucle Native: en SDD el implementador no la recibe (fila de deuda, «Esperar 2.º ticket»).
- Los sujetos relanzan su propio `claude -p` para el humo y ese gasto queda fuera de `COST_CAP` y `SUBJECT_CAP` (fila de deuda, «Actuar»).
- `.agents/skills/writing-skills`, la skill de desarrollo de este repo, ya traía la fila «Omits a required element» (línea 469), y en la 0166 el hilo no la cargó. La frase de `sdd-implement` cubre el caso del humo de una skill; cargar `writing-skills` al editar una skill no lo pide nada.

## 5. Aprendizajes

- Cada sujeto se califica con la rúbrica escrita, literal: a ojo, dos recetas en prosa contaron como plantilla y una enmienda sacó una fila que el RED pedía; lo cazó la revisión final → `tech-stack.md`, «Baterías por skill».
- El RED de `o1` separó dos causas que en la 0166 parecían una: no leer la regla (2 sujetos) y leerla y quedarse en una receta en prosa (1). Cada una tiene su texto: la frase de `sdd-implement` y la fila del Art. II, y el GREEN las necesita juntas (con la frase sola, `o2` 1/2).
- Revisión de skills: se revisó al editarla `sdd-implement`; nada más que llevar a otra skill.

## 6. Adendas
