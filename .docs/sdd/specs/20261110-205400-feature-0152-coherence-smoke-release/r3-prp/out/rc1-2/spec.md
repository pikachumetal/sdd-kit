---
id: 20261012-090000-feature-0031-close-notice-row
feature: 0031
title: El aviso de cierre nombra la fila que queda abierta
mode: full
profile: delegate
status: draft
created: 2026-10-12
author: agente con el dev-lead
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre nombra la fila que queda abierta

🦆 Al cerrar una feature, el aviso dirá qué fila del roadmap sigue abierta, con su número y su título: «queda pendiente la 0011 — Anular reservas de otros». Hoy solo dice qué se cierra. Cambia el paso 1 de la skill `aviso-cierre`.

Validación: agente — solo cambia una skill.

## Capacidades

- Nuevas: `aviso-cierre` — lo que dice el aviso de cierre

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~1 línea de skill + 1 fila de batería en 2 ficheros
- Dominio y técnica (sonnet): si la fila de rúbrica de `c1` falla de verdad sin la frase del paso 1 y no se cuela con la palabra «pendiente» sin nombrar la 0011 (señal: capacidad nueva)
- Mínimo razonable: ninguno por debajo de un revisor — deja sin mirar que el THEN pase sin el comportamiento

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. El paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta del roadmap con su id y su título, con esta forma fija: «queda pendiente la <id> — <título>».
3. «Abierta» = fila de `ROADMAP.md` con estado ⏳; el paso 1 solo la lee. Con cero filas abiertas o con varias el paso 1 no añade nada (la condición «una sola» va en su texto): queda fuera de esta feature y sin escenario ni prueba. Tampoco pruebo que el paso 1 lea el roadmap y no el id fijo 0011: el fixture de `c1` es uno solo y la prueba comprueba la frase y el título.
4. Validación por agente: solo cambia una skill.
5. Pasada de coherencia: la rúbrica de `c1` se ancla a la frase: `text: /queda pendiente la 0011/` y `text: /Anular reservas de otros/`, porque palabras sueltas pasan con «0011 no está pendiente». Previsión medida con `plan.mjs`: `c1 · 2 sujetos · 1.40 $` (coincide con la spec); los minutos quedan `sin medir`: `plan.mjs` no los da; al aprobar la spec aceptas esta excepción a la constitución 5, con el tope de 2,80 $ y una tanda de REFACTOR no prevista: si el GREEN falla una vez se para y decide el dev-lead. `git grep -n "0031"` sobre lo versionado: sin resultados. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` sale con 0 y crea `capabilities/aviso-cierre.md` en la copia con `añadido «El aviso nombra la fila abierta»`; el repo no cambia y la capacidad nace en el archive.
6. Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de `c1` por tandas (RED y GREEN, 2 cada una) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico: palabras sueltas en la rúbrica pasan con texto copiado → rúbrica anclada a «queda pendiente la 0011» más una fila por el título (decisión 5); el RED debe fallar por ausencia de esa frase y el walkthrough cita el fallo del sujeto.
- **Rechazado** — Crítico: variar el fixture con otro roadmap → `c1` es un cierre entero (~0,70 $ por sujeto) y un segundo fixture dobla la previsión de 2,80 $; el valor lo da el título, que ya sale del roadmap del fixture.
- **Aceptado** — cero o varias filas abiertas → fuera del Scope y en ✋ (decisión 3).
- **Aceptado** — «abierta» y el origen del dato → ✋ (decisión 3); el roadmap se lee, no se edita.
- **Aceptado** — validación y política de modelos como decisiones numeradas (4 y 6).
- **Aceptado** — minutos → `sin medir` (decisión 5). **Rechazado** — «Controles» confunde RED y control: el RED corre con la skill de hoy, por eso no hay control aparte.
- **Rechazado** — aprobador `TBD`: se rellena al aprobar la spec; es la plantilla.
- **Rechazado** — fixture con ids reales y glosario: 0005 y 0011 son filas de este roadmap y «Anular» es el término de la **Anulación** del glosario de `PRODUCT.md`.
- **Aceptado** — destino de la tabla de retiradas y texto literal comprobado contra `SKILL.md` («1. Di qué se cierra.»).
- **Aceptado** — el merge crea `aviso-cierre.md` en la copia (decisión 5).

- **Aceptado** (2.ª ronda) — Crítico: el título no prueba que se lea el roadmap → declarado sin probar en la decisión 3; **Rechazado** añadir fila de ausencia: exige un segundo fixture (misma razón de coste).
- **Aceptado** — con varias filas la frase era ambigua → el texto del paso 1 lleva «si hay una sola fila ⏳» (tabla de retiradas) y la decisión 3 declara cero y varias sin prueba; formato fijo de la frase → decisión 2; excepción de los minutos y parada si el GREEN falla → decisión 5.
- **Rechazado** — escenario del comportamiento de hoy («di qué se cierra»): sigue en el texto del paso 1 y esta feature solo describe lo que cambia; sin `capabilities/` previa, la capacidad nace con lo nuevo y el resto lo cubre `c2`. **Rechazado** — justificar `full` frente a patch (el carril se anunció al abrir; añade comportamiento visible) y mover las comprobaciones fuera de ✋ (la plantilla las pide ahí).

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta.
- No entra: editar el roadmap (solo se lee); el aviso con cero o con varias filas abiertas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Se reemplaza en esta feature (Scope) por «1. Di qué se cierra y, si hay una sola fila ⏳ en el roadmap, añade «queda pendiente la <id> — <título>».» |

- Filas que implementa: nada: comprobado con `git grep -n "0031"`

## Approach

- Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.
- Elegido: una frase en el paso 1.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, n = 2, con dos filas de rúbrica, `` `text: /queda pendiente la 0011/` `` y `` `text: /Anular reservas de otros/` ``: falla si el aviso del sujeto no dice «queda pendiente la 0011» o no nombra su título.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta

- GIVEN un cierre con la fila 0011 abierta (⏳) en el roadmap
- WHEN se avisa
- THEN el aviso dice «queda pendiente la 0011 — Anular reservas de otros»

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| GREEN | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 |
| Controles | 0: el RED corre con la skill de hoy | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 |
| Suma | 4 sujetos | 2,80 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
