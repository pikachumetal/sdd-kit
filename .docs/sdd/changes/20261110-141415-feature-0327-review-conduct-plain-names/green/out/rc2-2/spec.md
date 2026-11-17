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

🦆 Al cerrar una feature, el aviso dirá qué filas del roadmap siguen abiertas, cada una con su número y su título: «queda pendiente la 0011 — Anular reservas de otros». Si no queda ninguna, lo dice. Hoy solo dice qué se cierra. Cambia el paso 1 de la skill `aviso-cierre` y fortalece su prueba para que no pase con la palabra «pendiente» a secas.

Validación: agente — solo cambia una skill.

## Capacidades

- Nuevas: `aviso-cierre` — lo que dice el aviso de cierre

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet) + segunda ronda (sonnet) — señales: capacidad nueva · tamaño: ~15 líneas en 3 ficheros
- Todas las lentes (sonnet): si la rúbrica de `C1-A` falla sin el id y el título, y si la regla de «varias filas abiertas» está dicha (señal: capacidad nueva)
- Mínimo razonable: sin revisor — deja sin cubrir que la prueba pase con «pendiente» a secas, justo lo que halló el revisor

Política de modelos: revisor en Sonnet, sin reglas de negocio ni roles; sujetos en Sonnet (tech-stack).
Delta en copia: `sdd capability merge` sobre una copia de `.docs/sdd` → sale 0 y añade «El aviso nombra la fila abierta», «El aviso nombra todas las filas abiertas» y «El aviso dice cuándo no queda ninguna»; el repo no cambia. (Se repite al cambiar el delta, antes del gate.)

1. Capacidad nueva `aviso-cierre`, en kebab-case como la skill.
2. **Qué fila se nombra**: todas las filas ⏳ de «Próximo» del roadmap, una por línea, cada una `queda pendiente la <id> — <título>`. Alternativas descartadas: solo la primera (esconde las demás) o solo la «relacionada» (el roadmap no dice qué relaciona). **Esta es la decisión que más quiero que valides.**
3. **Título**: el texto en negrita de la columna «Ítem» (la 0011 es «Anular reservas de otros»), sin la descripción tras los dos puntos y sin truncar; si la celda no lleva negrita (la «1»), todo el texto de la celda. Los ids sin ceros («1») se dicen tal cual.
4. **Ninguna abierta**: el aviso dice «no queda ninguna fila abierta»; un roadmap sin sección «Próximo» o sin filas ⏳ equivale a ninguna abierta.
5. **Solo «Próximo»**: una fila ⏳ en Backlog o Patches no cuenta; y la fila de la propia feature que se cierra, si la tiene, no se nombra como pendiente (sin escenario propio: lo dejo sin cubrir, dime si lo quieres).
6. **Reglas de la capacidad** (las cinco): dónde vive el dato — el roadmap del proyecto; idioma — castellano, como el roadmap; límites, avisos y conflicto — no aplica: el aviso copia el roadmap, que es la única fuente; sin roadmap — no aplica, todo proyecto SDD lo tiene.
7. La 0031 no tiene fila en el roadmap: se hace por pedido directo del dev-lead; no hay fila que cerrar ni mover.
8. Ejemplo del Intent: la 0005 es la feature ya cerrada en `specs/`; la 0011 es la fila real del roadmap de hoy.
9. **Minutos de la previsión**: el proyecto no tiene dato de minutos por sujeto, así que van `sin medir`; o aceptas esa excepción a la regla 5 de la constitución, o me das una cota de minutos para parar y decidir si se supera.

### Hallazgos de la review

- **Aceptado** — C1-A pasa con «pendiente» a secas → la rúbrica pasa a exigir el id y el título (Scope, «Dónde se prueba»).
- **Aceptado** — el escenario fija la 0011 como literal → escenarios con otra fila abierta y con varias, para probar que el dato se lee del roadmap.
- **Aceptado** — `c2` y la fixture de `c1` sin declarar → `c2` queda fuera (sin rúbrica, no se toca); la fixture de `c1` es un roadmap con solo la 0011 abierta, y se edita la batería (Scope).
- **Aceptado** — faltan bordes (ninguna, varias) → escenarios nuevos y decisiones 2 y 4.
- **Aceptado** — decisiones tomadas en el cuerpo → pasan a ✋ (2 a 5); la antigua 2 duplicaba el Scope y se quita.
- **Aceptado** — datos del roadmap sin las cinco reglas → decisión 5.
- **Aceptado** — la batería y la capacidad no estaban en «Entra» → añadidas.
- **Aceptado** — destino de «lo que se retira» y paso 2 → frase exacta y paso 2 intacto declarados; decisión 6 explica el roadmap.
- **Aceptado, con matiz** — previsión sin minutos → no hay dato de minutos por sujeto en el proyecto: va como `sin medir` y es la decisión 9.
- **Aceptado** — cabecera y ejemplo → decisión 8; el aprobador lo rellena el gate.

Segunda ronda (un revisor, sin tercera):
- **Aceptado** — la «1» no lleva negrita → decisión 3; el escenario de varias filas la incluye.
- **Aceptado** — Intent contra la fixture recortada → el Intent y el escenario 1 dicen que es una fixture aparte.
- **Aceptado, con matiz** — minutos → decisión 9.
- **Aceptado** — filas de batería solo miran el literal → condiciones negativas y de formato en la rúbrica.
- **Aceptado** — `plan.mjs` y fixtures → `plan.mjs` no cambia (lee la tabla de la batería y conoce `c3` y `c4` en cuanto existen); las fixtures viven junto a la batería, su ruta se fija en el plan.
- **Aceptado, con matiz** — título sin negrita y solo «Próximo» → decisiones 3 y 5; la fila de la feature que se cierra queda sin escenario, dicho en la 5.
- **Aceptado** — cabecera de ✋ y delta → delta repetido con sus tres requisitos; política y delta quedan en líneas aparte.
- **Aceptado** — sin sección «Próximo» → decisión 4.
- **Aceptado** — frase del paso 1 en bloque de código y comprobar que sigue diciendo qué se cierra → «Lo que se retira» y rúbrica.
- **Rechazado** — mover los hallazgos a Enmiendas → el kit pide la subsección `### Hallazgos de la review` en ✋; el «Mínimo razonable» es el nivel más bajo defendible, no una decisión por elegir.

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba, y la persona no supo que la fila 0011 seguía abierta. Éxito: con un roadmap en que solo la 0011 está abierta (fixture de `c1`, aparte del roadmap de hoy, que tiene abiertas la 0010, la 0011 y la «1»), el aviso nombra la 0011 con su título; y si cambian las filas abiertas, el aviso cambia con ellas (no repite un literal).

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` nombra las filas abiertas; la rúbrica de `tests/batteries/aviso-cierre/battery.md` (fila `C1-A` más las filas de los dos escenarios nuevos `c3` y `c4`, con su fixture de roadmap, junto a la batería); la capacidad nueva `aviso-cierre`.
- No entra: el roadmap; el paso 2 de la skill («Corre el gate»), que queda intacto; el escenario `c2` de la batería; `scripts/plan.mjs`, que conoce `c3` y `c4` en cuanto están en la tabla de la batería.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md` paso 1 | pasa a (en bloque, literal): `1. Di qué se cierra y, por cada fila ⏳ de «Próximo» del roadmap, una línea «queda pendiente la <id> — <título>»; si no hay ninguna, «no queda ninguna fila abierta».` |
| Regla `text: /pendiente/` de `C1-A` | `tests/batteries/aviso-cierre/battery.md` | pasa a exigir el id y el título (ver «Dónde se prueba») |

- Filas que implementa: ninguna (ver ✋ 6); `git grep -n "0031"` no da nada fuera de esta spec.

## Approach

- A. Una frase en el paso 1 que lee el roadmap y nombra todas las filas abiertas — la skill tiene dos pasos y el aviso sale del primero.
- B. Un paso nuevo entre el 1 y el 2 solo para el aviso de filas — cambia la numeración y duplica el paso 1.
- Elegido: A.

## Dónde se prueba

- `c1` (roadmap con solo la 0011 abierta): fila `C1-A`, que falla si el texto no contiene `queda pendiente la 0011 — Anular reservas de otros`.
- `c3` (roadmap de hoy: 0010, 0011 y la «1» abiertas; B1 en Backlog): fila nueva `C3-A`, falla si falta cualquiera de las tres líneas, si nombra B1, si pone dos filas en una línea o si añade la descripción tras el título.
- `c4` (ninguna abierta): fila nueva `C4-A`, falla si no dice `no queda ninguna fila abierta` o si contiene `queda pendiente`.
- `C1-A` falla además si aparece otra línea `queda pendiente`, y las tres exigen que el aviso siga diciendo qué se cierra.
- El RED debe fallar con la skill de hoy en las tres filas.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `aviso-cierre`

#### ADDED — El aviso nombra la fila abierta

- GIVEN un cierre con la fila 0011 abierta en el roadmap y ninguna otra
- WHEN se avisa
- THEN el aviso dice «queda pendiente la 0011 — Anular reservas de otros»

#### ADDED — El aviso nombra todas las filas abiertas

- GIVEN un cierre con las filas 0010 («Motivo al cancelar»), 0011 («Anular reservas de otros») y «1» (sin negrita: «Avisos por correo antes de la reserva») abiertas en «Próximo», y B1 en Backlog
- WHEN se avisa
- THEN el aviso dice, una por línea, «queda pendiente la 0010 — Motivo al cancelar», «queda pendiente la 0011 — Anular reservas de otros» y «queda pendiente la 1 — Avisos por correo antes de la reserva», y no nombra B1

#### ADDED — El aviso dice cuándo no queda ninguna

- GIVEN un cierre sin ninguna fila abierta en el roadmap
- WHEN se avisa
- THEN el aviso dice «no queda ninguna fila abierta»

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `c1`, `c3`, `c4` con N=2: 6 sujetos; hoy `plan.mjs` solo conoce `c1` (2 sujetos, 1,40 $); `c3` y `c4` salen de 0,70 $ por sujeto de `tech-stack.md` — sin medir hasta que existan en la batería | 4,20 |
| GREEN | igual que RED | 4,20 |
| Una tanda de REFACTOR | 0: la frase es la forma mínima | 0 |
| Controles | 0: el RED ya es el control, corre con la skill de hoy | 0 |
| Medición tras la revisión final | 0: la revisión no toca la frase | 0 |
| Suma | 12 sujetos · minutos: sin medir (el proyecto no tiene dato por sujeto) | 8,40 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
