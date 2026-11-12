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

Review de spec propuesta: un revisor — señales: capacidad nueva (`aviso-cierre`) · tamaño: ~2 líneas en 1 fichero (`skills/aviso-cierre/SKILL.md`), sin contrato público ni `MODIFIED`
- Dominio y técnica juntas (sonnet): si el THEN «queda pendiente la 0011 — Anular reservas de otros» lo atrapa la fila `C1-A` de la batería, cuya rúbrica es `text: /pendiente/` (señal: capacidad nueva)
- Mínimo razonable: este mismo — un revisor con los siete puntos; no deja nada sin cubrir

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. El paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta del roadmap con su id y su título.
3. Enfoque: una frase en el paso 1, frente a añadir un paso 2 nuevo (ver Approach).
4. Delta probado sobre una copia de `.docs/sdd` fuera del repo: `aviso-cierre.md: añadido «El aviso nombra la fila abierta»`. En esta fase `capabilities/` del repo no cambia; la integra `sdd-archive` al cerrar.
5. Pasada de coherencia: `git grep -n "0031" -- . ':!.docs/sdd/specs'` sin resultados; «Di qué se cierra» solo aparece en `skills/aviso-cierre/SKILL.md` (más la cita de esta spec); la previsión de 2 sujetos a 1,40 $ coincide con lo que da `scripts/plan.mjs`.
6. Rúbrica `C1-A`: la de `c641e38` (`text: /pendiente/`) pasa con cualquier aviso que contenga «pendiente». Entra en el Scope endurecerla antes del RED a `text: /pendiente.*0011.*Anular reservas de otros/`. Es un cambio sobre lo que el dev-lead ya fijó: recházalo si prefieres la rúbrica actual. Sin medir: no he corrido sujetos antes de la puerta.
7. La skill lee la fila abierta de `ROADMAP.md` (el fixture de `c1` es el `ROADMAP.md` del repo, donde la 0011 está ⏳ en Now). Reglas de la capacidad: dato en `ROADMAP.md` · nombres en castellano (constitución 4) · límites: no aplica (id y título tal cual) · avisos: no aplica · conflicto: con ninguna fila abierta el paso 1 no añade la frase (no inventa fila).
8. **Sin decidir, pregunta para ti:** hoy el roadmap tiene tres filas ⏳ (0010, 0011, 0008). «La fila que queda abierta» no dice cuál nombrar. Recomiendo que el aviso nombre todas las ⏳ de Now, cada una con id y título, con la 0011 entre ellas (el THEN y rúbrica siguen valiendo); alternativa: solo la relacionada con lo que se cierra, pero el roadmap no trae ese vínculo (`Tras` está vacío).
9. Minutos: `scripts/plan.mjs` no los da; sin medir (estimo ~10 min por tanda de 2 sujetos). `c2` queda fuera: esta spec no lo cita.
10. Política de modelos: un revisor de la spec en sonnet (más una segunda ronda en sonnet) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería `c1`, 2 por tanda, en sonnet · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico: la rúbrica `C1-A` pasa sin el comportamiento → entra en el Scope y en «Dónde se prueba», endurecida a id y título (decisión 6).
- **Aceptado** — Crítico: la batería era alcance oculto → añadida al Scope.
- **Aceptado** — el GIVEN no tenía fuente → decisión 7 (`ROADMAP.md` como fixture) y decisión 8 (varias filas abiertas, pendiente de ti).
- **Aceptado** — faltaban las cinco reglas → decisión 7; ningún escenario nuevo para 0 filas (queda como regla de conflicto, sin medir).
- **Rechazado** — `ADDED` oculta un comportamiento previo → no hay `capabilities/` y el «Di qué se cierra» de hoy no es un requisito de capacidad; la capacidad nace con este requisito.
- **Aceptado** — «`capabilities/` no cambia» chocaba con la integración al archivar → decisión 4 reescrita.
- **Aceptado** — minutos, `c2` y controles → decisión 9; el control es el propio RED, que corre con la skill de hoy (ya en la previsión).
- **Aceptado** — review pegado a la lista y modelos incoherentes → bloque separado y decisión 10 aclarada.
- **Rechazado** — «Anular» choca con la terminología → es el título literal de la fila 0011 de `ROADMAP.md`.
- **Aceptado** — el `git grep` de coherencia → acotado (decisión 5).

### Hallazgos de la segunda ronda

- **Aceptado** — Crítico: la columna de la batería se llama «Falla si»; no sé si `text: /…/` marca el fallo al casar o al no casar (no hay otra rúbrica ni documentación en el repo que lo fije) → queda como condición: la primera tarea del plan fija esa lectura antes del RED y escribe la regla en el sentido que haga fallar a la skill de hoy.
- **Aceptado** — Crítico: la decisión 8 sigue sin resolver, y el THEN y la rúbrica están fijados a la 0011 → va al gate como pregunta; la respuesta puede cambiar el THEN. La 4ª ⏳ (0004, en Later) queda fuera de «las de Now» por lo que dice la propia recomendación.
- **Rechazado** — escenarios nuevos para 0 filas y varias filas → es el mismo punto de la primera ronda: más escenarios son más sujetos y coste; dependen de la respuesta a la 8.
- **Aceptado** — la rúbrica no distingue «queda pendiente» de «se cierra» → al fijar la lectura (primer punto), la regla exige «pendiente» y el id juntos: `/pendiente.*0011.*Anular reservas de otros/`.
- **Rechazado** — minutos en la tabla, ejes y revisores en la política, n = 2, gate `node --test`, ejemplo 0005, 0031 sin fila → son de forma o de proceso y no cambian lo que se construye; la 0031 no tiene fila porque nació de la rama (decisión del dev-lead, `git grep` lo confirma).

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta; la rúbrica `C1-A` de `tests/batteries/aviso-cierre/battery.md` pasa a `text: /pendiente.*0011.*Anular reservas de otros/`.
- No entra: el roadmap, la fila `c2` de la batería.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a «1. Di qué se cierra y qué fila queda abierta, con su id y su título.» |

- Filas que implementa: nada: comprobado con `git grep -n "0031"`

## Approach

- Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.
- Elegido: una frase en el paso 1.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, fila `C1-A` (endurecida: id y título), n = 2.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta

- GIVEN un cierre con la fila 0011 abierta en el roadmap
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
