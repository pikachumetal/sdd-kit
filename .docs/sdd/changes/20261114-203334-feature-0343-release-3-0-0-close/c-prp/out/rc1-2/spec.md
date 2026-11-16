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

🦆 Al cerrar una feature, el aviso dirá qué fila del roadmap sigue abierta, con su número y su título: «queda pendiente la 0011 — Anular reservas de otros». Hoy solo dice qué se cierra. Cambia el paso 1 de la skill `aviso-cierre`, que pasa a leer `ROADMAP.md`. Solo cubre el caso de una única fila abierta.

Validación: agente — solo cambia una skill.

## Capacidades

- Nuevas: `aviso-cierre` — lo que dice el aviso de cierre

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~15 líneas en 2 ficheros
- Dominio+técnica (sonnet): si la rúbrica `/0011 — Anular reservas de otros/` y el fixture de `c1` comprueban el THEN completo (señal: capacidad nueva)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir nada de este alcance

### Decisiones

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. El paso 1 de `skills/aviso-cierre/SKILL.md` lee `ROADMAP.md` y nombra la fila abierta con el formato literal «queda pendiente la <id> — <título>». «Fila abierta»: fila con estado ⏳ en cualquier sección (Now, Next, Later), sin contar la de la feature que se cierra.
3. Con una única fila abierta, el aviso nombra esa. Con varias (hoy el roadmap real tiene en ⏳ la 0010, la 0011 y la 0008 en Now, y la 0004 en Later) o con ninguna, esta feature no define qué dice: no entra. La frase del paso 1 lo dice con «si queda una única fila abierta», así que el hueco consta en la skill y no hay comportamiento sin definir en silencio.
4. La prueba añade a `c1`, en `tests/batteries/aviso-cierre/battery.md`, un fixture (un `ROADMAP.md` de prueba en el que la 0011 es la única fila ⏳ aparte de la que se cierra) y la fila de rúbrica `` `text: /queda pendiente la 0011 — Anular reservas de otros/` ``: la frase entera, no una palabra suelta. El formato exacto del fixture y de la rúbrica en `battery.md` (hoy solo tiene la tabla de ids) y cómo se aísla al sujeto del `ROADMAP.md` real —el fixture va en su encargo— los fija el plan: pendiente.
5. Enfoque: una frase en el paso 1, frente a un paso nuevo entre el 1 y el 2 (ver Approach).
6. Minutos: ~15 min aproximados (4 sujetos y la edición de la frase), sin medir. Validación por agente, sin REFACTOR (0 sujetos: la frase es la forma mínima) y sin controles (el RED corre con la skill de hoy).
7. Política de modelos: un revisor de la spec en sonnet (alcance pequeño, sin reglas de negocio) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: sujetos del RED y del GREEN, por tandas · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte.
8. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` → `aviso-cierre.md: añadido «El aviso nombra la fila abierta cuando es única»`, sin rechazos.

### Hallazgos de la review

- **Aceptado** — Crítico: la rúbrica `/0011/` no comprueba el título → rúbrica `/0011 — Anular reservas de otros/` (decisión 4).
- **Aceptado** — Crítico: el GIVEN «única fila abierta» no se da con el roadmap real → fixture de `c1` en Scope y en «Dónde se prueba» (decisión 4).
- **Aceptado** — frase en singular sin condición → «si queda una única fila abierta» (tabla de cambios, decisión 3).
- **Aceptado** — dependencia de lectura no declarada → `ROADMAP.md`, estado ⏳ (decisión 2, Scope).
- **Aceptado** — minutos y tope de coste → tope en la previsión; los minutos van «sin medir» (`plan.mjs` no los da).
- **Aceptado** — decisiones sueltas en el cuerpo → decisión 6.
- **Aceptado** — gate de cierre y RED → GREEN → línea en «Dónde se prueba».
- **Rechazado** — la capacidad no recoge «Di qué se cierra» → el delta de esta feature es lo que cambia; lo anterior no lo toca y no hay requisito que su cambio modifique.
- **Rechazado** — el título «Anular reservas de otros» no está verificado → es el texto de la fila 0011 de `ROADMAP.md`; el fixture usa el mismo.
- **Rechazado** — la salida de `capability merge` no está comprobada → se ejecutó sobre una copia y se vuelve a ejecutar tras estos cambios (decisión 8).

### Hallazgos de la segunda review

- **Aceptado** — tope incoherente con la constitución → 4,20 $ con una tanda de REFACTOR.
- **Aceptado** — minutos «sin medir» → ~15 min aproximados, en la decisión 6.
- **Aceptado** — formato del aviso sin fijar → frase literal «queda pendiente la <id> — <título>» en la skill, el THEN y la rúbrica.
- **Aceptado** — «fila abierta» sin definir → decisión 2: ⏳ en cualquier sección, sin la fila que se cierra; consta en el GIVEN.
- **Aceptado** — mecanismo del fixture → el plan fija el formato en `battery.md` y el aislamiento del sujeto; queda «pendiente» en la decisión 4.
- **Aceptado** — título del requisito → «cuando es única».
- **Rechazado** — capacidad sin «Di qué se cierra» → repetido de la primera ronda; la capacidad nace con lo nuevo a propósito.
- **Aceptado** — salida del merge → rehecha tras estos cambios.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` lee `ROADMAP.md` y nombra la fila abierta; el fixture y la fila de rúbrica de `c1` en `tests/batteries/aviso-cierre/battery.md`.
- No entra: modificar el roadmap; qué dice el aviso con varias filas abiertas o con ninguna.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a «1. Di qué se cierra y, si en `ROADMAP.md` queda una única fila abierta (⏳), nómbrala como «queda pendiente la <id> — <título>».» |

- Filas que implementa: nada: comprobado con `git grep -n "0031"` (sin resultados fuera de `.docs/sdd/specs/`). «Di qué se cierra» solo aparece en `skills/aviso-cierre/SKILL.md`: comprobado con `git grep -n "Di qué se cierra"`

## Approach

- Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero.
- Descartado: un paso nuevo entre el 1 y el 2 — alarga la skill para una sola frase.
- Elegido: una frase en el paso 1.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, n = 2, con el fixture de un roadmap en el que la 0011 es la única fila ⏳ aparte de la que se cierra y la fila de rúbrica `` `text: /queda pendiente la 0011 — Anular reservas de otros/` ``: falla si el aviso del sujeto no dice esa frase.
- Secuencia: RED con la skill de hoy, GREEN con la frase nueva; al cerrar, gate `node --test && node scripts/lint.mjs` en verde.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta cuando es única

- GIVEN un cierre en el que la 0011 es la única fila ⏳ del roadmap, sin contar la de la feature que se cierra
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

Tope: 4,20 $ (6 sujetos: los 4 previstos y una tanda de REFACTOR de 2); si la prueba lo supera, se para y decide el dev-lead. Minutos: ~15, aproximados (`plan.mjs` no los calcula).

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
