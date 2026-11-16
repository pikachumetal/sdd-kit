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

🦆 Al cerrar una feature, el aviso dirá qué filas del roadmap siguen abiertas, una línea por fila con su número y su título: «queda pendiente la 0011 — Anular reservas de otros». Hoy solo dice qué se cierra. Cambia el paso 1 de la skill `aviso-cierre` y aprieta la prueba que lo comprueba.

Validación: agente — solo cambia una skill.

## Capacidades

- Nuevas: `aviso-cierre` — lo que dice el aviso de cierre

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`aviso-cierre`) · tamaño: ~15 líneas en 2 ficheros
- Dominio+técnica (sonnet): si el escenario de varias filas abiertas fija qué se nombra y si `C1-A` falla con un «pendiente» sin id ni título (señal: capacidad nueva)
- Mínimo razonable: sin review — deja sin cubrir que el aviso pasara en verde sin nombrar ninguna fila

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. Enfoque: una frase en el paso 1, frente a añadir un paso 3 o reescribir la skill (ver Approach).
3. **Regla con varias filas abiertas** (antes sin decidir): el aviso nombra **todas** las filas con estado ⏳ de `## Now` de `ROADMAP.md`, una línea por fila, con su id y el título en negrita de «Tarea». Descarto «solo la relacionada por «Tras»»: la 0011 de la Intent tiene «Tras» vacío y no saldría. Hoy saldrían la 0010, la 0011 y la 0008. **Es la decisión que más conviene que valides.**
4. Sin filas abiertas, el aviso no menciona pendientes pero sigue diciendo qué se cierra.
4 bis. La fila de la feature que se cierra no cuenta como pendiente, aunque siga ⏳ hasta que `sdd-archive` la mueva; las filas con otro estado (✅…) tampoco. El aviso lleva el título sin los asteriscos de negrita y sin tope de filas.
5. La batería entra en el Scope: `C1-A` pasa a exigir el id y el título del fixture, no solo «pendiente». Los valores del escenario y de la rúbrica son inventados (0042 · «Exportar informes»), distintos del ejemplo del Intent, para que el agente no los copie.
6. `c2` (hoy sin fila en la rúbrica) prueba el caso sin filas abiertas: gana su fila `C2-A`. La previsión pasa a c1 + c2.
7. Política de modelos: un revisor de la spec en Sonnet (más una segunda ronda por los Críticos aceptados) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la prueba: Sonnet, 2 por escenario y tanda · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte.
8. Comprobado en una copia de `.docs/sdd` con esta versión: `sdd capability merge` → tres requisitos añadidos a `aviso-cierre.md` («El aviso dice qué se cierra», «El aviso nombra las filas abiertas», «Sin filas abiertas no hay pendientes»), salida 0. El repo no tiene `capabilities/`: la capacidad se crea en el cierre.
9. `sin medir`: el RED con la rúbrica nueva sobre la skill de hoy; se mide en la Task 1. Tampoco se miden los minutos: `plan.mjs` solo da sujetos y dólares. Tope de la prueba: 5,60 $ (la suma de abajo); si se supera, una tanda de REFACTOR incluida, se para y decide el dev-lead (constitución 5).
10. Coste previsto con `plan.mjs` (`SCENARIOS="c1 c2" N=2`): `suma: 4 sujetos · coste previsto: 2.80 $` por tanda.

### Hallazgos de la review

1. **Aceptado** (Crítico) — con varias filas abiertas la regla no estaba fijada → decisión 3 y escenario de varias filas en el delta.
2. **Aceptado** (Crítico) — `C1-A` pasaba con «pendiente» a secas → la batería entra en el Scope, decisión 5.
3. **Aceptado** — el THEN copiaba el ejemplo real → escenarios y rúbrica con valores inventados (0042 · «Exportar informes»); el caso real queda solo en la Intent.
4. **Aceptado** — decisiones sin resolver → resueltas en las decisiones 3 y 5, trasladadas al Scope y al delta; es el gate quien las valida.
5. **Aceptado** — «No entra: el roadmap» chocaba con leerlo → Scope aclara que se lee, no se edita; «Reglas de la capacidad» declara la ruta y las columnas.
6. **Aceptado** — faltaban las cinco reglas → sección «Reglas de la capacidad».
7. **Aceptado** — la previsión no cubría los escenarios nuevos → decisión 6 y tabla rehechas con c1 + c2.
8. **Aceptado** — la frase nueva del paso 1 no recogía la regla → la tabla de lo que cambia de forma la incluye.
9. **Aceptado** — la decisión 3 repetía el Approach y mezclaba política de modelos → renumeradas; la política queda como línea propia (decisión 7), que pide el perfil `delegate`.
10. **Aceptado** — ejemplos reales en el escenario → ver 3.

### Hallazgos de la segunda ronda (Crítico aceptado → un revisor Sonnet relée la spec; sin tercera ronda)

1. **Aceptado** (Crítico) — nada impedía nombrar filas no ⏳ → el escenario añade la 0044 ✅ que no debe salir; la rúbrica `C1-A` lo exige.
2. **Aceptado** (Crítico) — «no contiene pendiente» pasaba con un aviso vacío → el THEN exige que diga qué se cierra; `C2-A` también.
3. **Aceptado** — «falta `ROADMAP.md`» sin escenario ni prueba → la regla sale de «Reglas de la capacidad»: no se promete lo que no se prueba.
4. **Aceptado** — «literal» y «sin tope» sin precisar → decisión 4 bis: título sin asteriscos, sin tope.
5. **Aceptado** — la fila que se cierra seguiría ⏳ → decisión 4 bis y escenario con la 0041 que se cierra.
6. **Aceptado** — faltaba el requisito de lo que ya hacía el paso 1 → ADDED «El aviso dice qué se cierra».
7. **Rechazado** — la política de modelos fuera de la numeración y sin autoconfirmación → el perfil `delegate` pide esa línea en ✋ y su aprobación es la confirmación por diseño del kit; no se da por confirmada antes de aprobar.
8. **Aceptado** — minutos y tope → decisión 9: minutos sin medir, tope de 5,60 $.
9. **Rechazado** — «aceptar todo es sospechoso» → la primera ronda fue real (dos Críticos y ocho Importantes/Menores en esta sesión) y cada hallazgo señalaba un hueco comprobable; el gate lo ve entero.
10. **Rechazado** — retitular el ejemplo → «Anular reservas de otros» es el título literal de la fila 0011 del roadmap, que es la fuente del caso.

Decisiones tomadas con el dev-lead: ninguna registrada en esta sesión.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título, y cualquier otra fila abierta, cada una en su línea.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra las filas abiertas de `## Now` (se leen de `ROADMAP.md`, no se edita).
- Entra: `tests/batteries/aviso-cierre/battery.md` — `C1-A` exige id y título del fixture; fila nueva `C2-A` para el caso sin filas abiertas.
- No entra: el formato del roadmap ni ninguna edición de `ROADMAP.md`.

## Reglas de la capacidad

- Dónde vive el dato: `ROADMAP.md`, tabla `## Now`, columnas «Id», «Tarea» (título en negrita) y «Estado»; solo lectura.
- Idioma de los textos: castellano (constitución 4): «queda pendiente la <id> — <título>».
- Límites: todas las filas ⏳ de Now salvo la de la feature que se cierra, sin tope; el título, sin los asteriscos de negrita.
- Avisos: sin filas ⏳ el aviso no menciona pendientes y sigue diciendo qué se cierra.
- Conflicto: la fila de la feature que se cierra puede seguir ⏳: no se nombra.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a «1. Di qué se cierra y, de `## Now` de `ROADMAP.md`, cada fila ⏳ que queda abierta: «queda pendiente la <id> — <título>».» |
| `C1-A`: `text: /pendiente/` | `tests/batteries/aviso-cierre/battery.md` | Scope: exige también el id y el título del fixture |

- Filas que implementa: nada: comprobado con `git grep -n "0031"`

## Approach

- A. Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero. Coste: una línea editada.
- B. Un paso nuevo entre el 1 y el 2 — separaría el aviso en dos mensajes y cambiaría la numeración que la skill ya tiene. No encaja con un aviso que hoy es una sola frase.
- C. Reescribir la skill — desproporcionado para añadir un dato al aviso.
- Elegido: A, por ser la forma mínima.

## Dónde se prueba

- Varias filas abiertas: `c1` de `tests/batteries/aviso-cierre/battery.md`, fila `C1-A`, n = 2.
- Sin filas abiertas: `c2`, fila `C2-A`, n = 2.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso dice qué se cierra

- GIVEN el cierre de la feature 0041 «Cerrar temporada»
- WHEN se avisa
- THEN el aviso dice qué se cierra: «0041 — Cerrar temporada»

#### ADDED — El aviso nombra las filas abiertas

- GIVEN el cierre de la 0041 «Cerrar temporada» (⏳ en Now) y un roadmap con las filas 0042 «Exportar informes» ⏳, 0043 «Importar socios» ⏳ y 0044 «Archivar salas» ✅
- WHEN se avisa
- THEN el aviso dice «queda pendiente la 0042 — Exportar informes» y «queda pendiente la 0043 — Importar socios», cada una en su línea, y no nombra la 0044 ni la 0041 como pendientes

#### ADDED — Sin filas abiertas no hay pendientes

- GIVEN el cierre de la 0041 «Cerrar temporada» (⏳ en Now) y ninguna otra fila ⏳ en Now
- WHEN se avisa
- THEN el aviso dice qué se cierra y no contiene «pendiente»

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| GREEN | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 |
| Controles | 0: el RED corre con la skill de hoy y la rúbrica nueva | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 |
| Suma | 8 sujetos | 5,60 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
