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

Validación: agente — cambia una skill y una fila de su rúbrica.

## Capacidades

- Nuevas: `aviso-cierre` — lo que dice el aviso de cierre

## ✋ Decisiones que he tomado yo — valida estas

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. El paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta del roadmap con su id y su título.
3. Enfoque: una frase en el paso 1, frente a un paso nuevo y a una plantilla del aviso (ver Approach).
4. La rúbrica de `c1` hoy es una sola fila, `C1-A` (`text: /pendiente/`), y solo mira «pendiente»; el THEN pide tres cosas. En la Task 1, antes del RED, la dejo en tres filas: `C1-A` (el id `0011`), `C1-B` (el título `Anular reservas de otros`) y `C1-C` (`pendiente`). Compruebo cómo se lee «Falla si» corriendo la rúbrica contra textos escritos a mano: uno correcto y uno al que le falta cada cosa por separado (sin id, sin título, sin «pendiente»). Control sin sujetos, coste 0. Si «Falla si» se lee al revés o el fixture no trae la 0011, se enmienda la spec antes del RED. Sin medir: no he corrido la rúbrica.
5. Comprobado en una copia de `.docs/sdd` fuera del repo: `sdd capability merge` sale con 0 y dice «aviso-cierre.md: añadido «El aviso nombra la fila abierta»».
6. Política de modelos: un revisor de la spec en Sonnet (la spec no toca reglas de negocio ni roles) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: los 2 sujetos de cada tanda de `c1`, en Sonnet · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
7. Fixture de `c1`: el sujeto corre en el repo y su `ROADMAP.md` ya trae la 0011 abierta con su título; la Task 1 lo comprueba antes del RED. Sin medir.
8. Qué es «la fila abierta»: la que el escenario del cierre señala (en `c1`, la 0011). El `ROADMAP.md` de hoy tiene tres filas ⏳ (0010, 0011, 0008), así que el roadmap solo no basta para elegir una: cómo elige la skill entre varias, o qué dice con ninguna, no se decide aquí (No entra) y queda anotado para otra fila. ✋ **Validala o dime cómo elegir.**
9. Riesgo aceptado: `c2` (misma batería y misma skill) no se corre en esta feature; el cambio podría degradarlo sin que se vea.
10. Gate de la previsión: la RED debe fallar con la rúbrica apretada; si pasa, o si cualquier tanda extra supera los 2,80 $, se para y decide el dev-lead (constitución 5).
11. `capabilities/aviso-cierre.md` no existe hoy: lo crea `sdd-archive` al integrar el delta.

Review de spec propuesta: un revisor — señales: capacidad nueva (`aviso-cierre`) · tamaño: ~3 líneas en 2 ficheros (la skill y la rúbrica)
- Dominio y técnica juntas (sonnet): si el THEN de «El aviso nombra la fila abierta» se puede comprobar con la rúbrica `C1-A`, y si la spec no decide nada fuera de este ✋ (señal: capacidad nueva)
- Mínimo razonable: este nivel ya es el mínimo de una feature full — no queda nada por recortar sin quitar la review

### Hallazgos de la review

- **Aceptado** — Crítico: la rúbrica pasa con «pendiente: 0011» sin título, y «Falla si» es ambiguo → decisión 4: exige id y título y se comprueba la lectura con dos textos a mano.
- **Aceptado** — Crítico: no consta el fixture de `c1` → decisión 7 y comprobación en la Task 1.
- **Aceptado** — THEN con frase literal frente a Approach C → el THEN pide contenido y la frase queda como ejemplo.
- **Aceptado** — cero o varias filas abiertas → decisión 8 y No entra.
- **Aceptado** — el roadmap como dato de entrada → Scope.
- **Aceptado** — minutos y revisiones en la previsión → nota bajo la tabla.
- **Rechazado** — separar la política de modelos en ítems: es el formato de la plantilla; la justificación se queda porque la spec no toca roles.
- **Aceptado** — validación inexacta → cabecera corregida.
- **Aceptado** — GIVEN alineado con el caso de la 0005.
- **Aceptado** — control de la rúbrica → decisión 4, control a coste 0.

#### Segunda ronda

- **Aceptado** — «abierta» no la define el roadmap (hoy hay tres ⏳) → decisión 8 reescrita, para tu validación.
- **Aceptado** — la rúbrica admite una sola expresión por fila → decisión 4: tres filas y controles por omisión.
- **Aceptado** — el RED debe fallar con la rúbrica apretada → decisión 10.
- **Aceptado** — `c2` sin cubrir → decisión 9 (riesgo aceptado).
- **Aceptado** — salida si fallan las comprobaciones de la Task 1 → decisión 4.
- **Aceptado** — la capacidad la crea `sdd-archive` → decisión 11.
- **Aceptado** — techo de coste → decisión 10.
- **Rechazado** — separar la confirmación de paralelizar: es la forma de la plantilla de la política de modelos.
- **Rechazado** — reformular el GIVEN/THEN sin 0005/0011: sin ids reales la rúbrica no tiene qué comprobar; ya van como caso.
- **Rechazado** — nombre de rama: ya existe y sigue `feature/<id>` con un sufijo legible.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: el aviso nombra la 0011 con su título.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra la fila abierta; la fila `C1-A` de `tests/batteries/aviso-cierre/battery.md` exige también `0011` (decisión 4).
- El roadmap es entrada: la skill lee `ROADMAP.md` (la tabla de «Now», filas con estado ⏳) y no lo modifica.
- No entra: cambiar el roadmap; elegir entre varias filas abiertas o el caso de ninguna (decisión 8); correr `c2` (decisión 9).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | Scope: pasa a «1. Di qué se cierra y qué fila queda abierta, con su id y su título.» |

- Filas que implementa: nada: comprobado con `git grep -n "0031"`

## Approach

- A. Una frase en el paso 1 — la skill tiene dos pasos y el aviso sale del primero; cambia una línea.
- B. Un paso nuevo entre el 1 y el 2 — separa el aviso de la fila, pero renumera el «Corre el gate» y gasta un paso para una frase.
- C. Una plantilla literal del aviso — fija el texto exacto, pero la skill no lleva plantillas hoy y el aviso dejaría de adaptarse a cada cierre.
- Elegido: A, por ser la forma mínima.

## Dónde se prueba

- El paso 1: `c1` de `tests/batteries/aviso-cierre/battery.md`, fila `C1-A`, n = 2.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta

- GIVEN el cierre de la 0005, con la fila 0011 abierta en el roadmap
- WHEN se avisa
- THEN el aviso menciona la 0011, su título «Anular reservas de otros» y que sigue pendiente (por ejemplo: «queda pendiente la 0011 — Anular reservas de otros»)

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| GREEN | `SCENARIOS="c1" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 |
| Controles | 0 sujetos: la rúbrica se prueba con dos textos escritos a mano (decisión 4) | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 |
| Suma | 4 sujetos | 2,80 |

Minutos: ~10 por tanda de 2 sujetos en paralelo, ~20 en total. No cuentan en la suma: el revisor de la spec (1 sujeto Sonnet, ya gastado) y los ejes de la revisión final, que se declaran al planificar.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
