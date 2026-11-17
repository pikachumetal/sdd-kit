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

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~3 líneas en 2 ficheros (la frase del paso 1 y las filas de rúbrica de `c1`)
- Dominio y técnica (sonnet, los siete puntos): si el THEN se puede verificar con la rúbrica y si el aviso depende del roadmap sin decirlo (señal: capacidad nueva)
- Mínimo razonable: este mismo — deja sin cubrir qué hace el aviso con 0 o varias filas abiertas, que la spec deja fuera

Política de modelos: un revisor de la spec en sonnet (ya despachado) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de `c1` en sonnet, por tandas de 2 · en paralelo hasta `control.maxParallelAgents`

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. El paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta del roadmap con su id y su título.
3. Forma del aviso: «queda pendiente la <id> — <título>».
4. Se nombra **una** fila: la primera abierta. Con 0 o con varias abiertas no se define nada nuevo (fuera de alcance).
5. «Fila abierta»: fila de `.docs/sdd/roadmap.md`, sección «Próximo», con estado ⏳. La skill lee ese fichero; si no existe, no hay nada que nombrar.
6. Batería: `c1`, n = 2 (ya existe en la batería).
7. Coste: la constitución pide también minutos; `plan.mjs` no los da, así que van como `sin medir`.
8. «0011 — Anular reservas de otros» es el dato real de este roadmap; el escenario lo usa como fixture de la batería.
9. Perfil `delegate` y modo `full` vienen del proyecto (`sdd-kit.json`) y de la regla 5 de la constitución (editar una skill exige prueba con sujetos); no los rebajo.

Resultado de `sdd capability merge` sobre una copia de `.docs/sdd`: `aviso-cierre.md: añadido «El aviso nombra la fila abierta»`.

### Hallazgos de la review

1. **Aceptado** — la rúbrica `/pendiente/` deja pasar «no queda nada pendiente» → se añaden filas `text: /0011/` y `text: /Anular reservas de otros/`.
2. **Aceptado** — faltan minutos en la previsión → columna Minutos, `sin medir`, y decisión 7.
3. **Aceptado** — 0 o varias filas abiertas → Scope acotado a una fila, decisión 4.
4. **Aceptado** — la lectura del roadmap no estaba declarada → Scope y decisión 5.
5. **Aceptado** — decisiones del cuerpo fuera del ✋ → decisiones 3 a 6; «fila abierta» definida en Términos.
6. **Rechazado** — pedía el requisito base «dice qué se cierra» → la spec cubre solo lo que cambia; ese comportamiento ya existe y no cambia.
7. **Aceptado** — Approach sin alternativa → alternativa descartada: el paso 2.
8. **Aceptado** — Destino y «Filas que implementa» → Destino «se sustituye por…»; la 0031 no tiene fila en el roadmap.
9. **Rechazado** — pedía rebajar perfil y modo → decisión 9; el aprobador sale al aprobar la spec.
10. **Aceptado** — ejemplos como dato → decisión 8.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta (una), leyéndola de `.docs/sdd/roadmap.md`; las filas de rúbrica de `c1` en `tests/batteries/aviso-cierre/battery.md`.
- No entra: editar el roadmap; qué hace el aviso con 0 o con varias filas abiertas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Se sustituye por «1. Di qué se cierra y qué fila queda abierta, con su id y su título.» |

- Filas que implementa: nada: la 0031 no tiene fila en el roadmap; comprobado con `git grep -n "0031"`

## Approach

- Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.
- Descartada: ponerlo en el paso 2 — ese paso corre el gate, después del aviso.
- Elegido: una frase en el paso 1.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, n = 2, con tres filas de rúbrica: `` `text: /pendiente/` ``, `` `text: /0011/` `` y `` `text: /Anular reservas de otros/` ``: cada una falla si el aviso del sujeto no lo dice.

## Términos y ADR

- Términos resueltos: «fila abierta» = fila de «Próximo» en `roadmap.md` con estado ⏳
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta

- GIVEN un cierre con la fila 0011 abierta en el roadmap
- WHEN se avisa
- THEN el aviso dice «queda pendiente la 0011 — Anular reservas de otros»

## Previsión de coste

| Tanda | Sujetos (batería) | Minutos | $ |
| --- | --- | --- | --- |
| RED | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | sin medir | 1,40 |
| GREEN | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | sin medir | 1,40 |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | sin medir | 0 |
| Controles | 0: el RED corre con la skill de hoy | sin medir | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | sin medir | 0 |
| Suma | 4 sujetos | sin medir | 2,80 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
