---
id: 20261109-095053-feature-0016-close-notice
feature: 0016
title: El aviso de cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-11-09
author: Fixture
approvers:
  - name: TBD  # el dev-lead valida la frase del paso 1 en el cierre
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, la skill `aviso-cierre` solo dice qué se cierra: «Cierro la 0016, el aviso de cierre». Con este cambio dirá además qué queda sin hacer: «Cierro la 0016. Pendiente: validar con el dev-lead la frase del aviso». Si no queda nada, lo dice: «nada pendiente». Es una frase más en el paso 1 de `skills/aviso-cierre/SKILL.md`; el paso 2 (correr el gate) no cambia. Como toca una skill, entra por RED → GREEN con sujetos (previsión: 14 sujetos, 9,80 $).

Validación: dev-lead — la skill la lee una persona y lo que se mide en los sujetos es que el aviso sale; si la frase del paso 1 dice lo que el dev-lead quería, solo lo juzga él.

## Capacidades

- Ninguna, porque herramientas: es el texto de una skill del proyecto; `capabilities/` no existe y no hay comportamiento de producto que cambie.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna (sin capacidad nueva, contrato público, `MODIFIED`, datos ni dependencia) · tamaño: ~2 líneas en 1 fichero
- Revisor único (sonnet, siete puntos): si «qué queda pendiente» de Intent está definido sin ambigüedad en Scope y en la decisión 2, y si «Dónde se prueba» puede dar un RED con c1 y c2 (señal: área sin explorar: no he leído los escenarios c1 y c2)
- Mínimo razonable: sin revisor — deja sin cubrir que «pendiente» esté bien acotado y que la batería lo ejercite, que es lo que haría fallar el RED

1. **Qué es «pendiente»**: lo que, al cerrar, sigue sin hacer o sin validar de esa feature (tasks sin terminar y validaciones sin hacer; es lo que ejercitan c1 y c2, nada más). El dev-lead dijo «qué queda pendiente» sin más; esta definición es mía.
2. **Literal del paso 1**: «1. Di qué se cierra y qué queda pendiente; si no queda nada, di «nada pendiente».» — el literal es mío; mantiene la numeración y el paso 2 intactos.
3. **Enfoque**: editar el paso 1 en sitio, frente a añadir un paso nuevo «Di qué queda pendiente» (renumeraría el gate y contradice «el paso 1 dice también») y frente a una skill nueva (un fichero más para una frase). Ver Approach.
4. **Escenarios de prueba — SIN MEDIR, lo decides tú en el gate**: reutilizo c1 y c2 de `tests/batteries/aviso-cierre/battery.md`, n=2 cada uno. Sus enunciados no están en el repo (la batería solo trae la tabla `Id | Paso | n | Modelo`), así que no sé qué cierre provoca cada uno; si no dejan algo pendiente, el RED no exhibirá el fallo. Propongo que la Task 1 escriba los enunciados en `tests/batteries/aviso-cierre/scenarios.md` (nombre del fichero mío): c1 con un pendiente conocido y c2 sin nada pendiente (sirve de control del «inventar pendientes»). `battery.md` no cambia (mismas filas, n y modelo), así que la previsión de abajo vale tal cual: es la salida literal de `scripts/plan.mjs`. Si prefieres otros escenarios, la previsión se rehace.
5. **Criterio de acierto**: lo juzga la persona que corre la batería leyendo la salida del sujeto, sin regex. RED: c1 0/2 con aviso que nombra la Task 2 pendiente. GREEN: c1 2/2 y c2 2/2 (c2: dice «nada pendiente» y no inventa ninguno). Umbrales míos.
6. **Estado de base de los sujetos**: un commit limpio con el cambio ya hecho o sin hacer según la tanda; el paso 2 se da por bueno si el sujeto corre el gate e informa su resultado, verde o no (un fallo ajeno a la skill no invalida el sujeto).
7. **Coste**: 9,80 $ es el tope de la prueba; la medición tras la revisión final cuenta dentro. `scripts/lint.mjs` solo comprueba tabuladores en `src/app.js` y el gate es el de `operations.md`, no solo el `node --test` del art. 2.
8. **Controles a cero**: c2 hace de control (nada pendiente, decisión 4); no hay más escenarios; la fila va a 0 $.
9. **Sin tabla de topes de palabras**: el proyecto no tiene test que limite palabras en `skills/`.
- Política de modelos: revisor de la spec, uno en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: sujetos Sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` (sin fijar en `sdd-kit.json`) — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** (Crítico) — c1 y c2 sin leer, el RED podría no exhibir el fallo → decisión 4 reescrita: enunciados no están en el repo, la Task 1 los escribe (c1 con pendiente, c2 sin) y entra en Scope; la elección de escenarios queda para el gate.
- **Aceptado** — pendiente sin criterio verificable / sin escenarios GIVEN/WHEN/THEN → c1 y c2 con THEN observable en «Dónde se prueba».
- **Aceptado** — paso 2 solo medido por el sujeto → «Paso 2 intacto»: diff limitado a la línea 8.
- **Aceptado** — «; nada más» del 🦆 no sale del literal → quitado del ejemplo.
- **Aceptado** — validación del dev-lead sin registro → condición de cierre en «Dónde se prueba» y nota en `approvers`.
- **Aceptado** — minutos de art. 5 → línea de «Minutos: sin medir» bajo la previsión.
- **Aceptado** — sin control para «inventar pendientes» → c2 hace de control (decisión 8).
- **Rechazado** — separar decisiones de proceso y de contenido → motivo: el apartado es una lista única por diseño de la plantilla.
- **Rechazado** — `git grep` sin salida adjunta → motivo: está ejecutado en esta sesión (única coincidencia `SKILL.md:8`).

### Hallazgos de la segunda ronda

- **Aceptado** (Crítico) — previsión sin enunciados → `battery.md` no cambia y la previsión es la salida de `plan.mjs` (decisión 4); minutos siguen sin medir.
- **Aceptado** (Crítico) — THEN no comprobables → criterio de acierto en la decisión 5; los THEN ya no exigen el literal `Pendiente:`.
- **Aceptado** — ficheros de la batería ocultos → `scenarios.md` en Scope y decisión 4; umbrales en la 5; definición de pendiente acotada (decisión 1); estado de base y tope de coste (6 y 7); `description` declarada exacta.
- **Rechazado** — quién es el dev-lead frente a la misión → motivo: la misión dice que un solo usuario usa la herramienta, y «dev-lead» es el rol con que esa persona decide en el flujo; no hay segundo firmante.

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente»
- La entrevista está hecha; la spec se escribe ya — «La entrevista ya está hecha; decidido con el dev-lead»

## Intent

Hoy el paso 1 de `aviso-cierre` dice solo qué se cierra, y quien lee el aviso no ve qué queda abierto tras el cierre. Se quiere que el mismo paso 1 diga también qué queda pendiente, o «nada pendiente». Éxito: en los sujetos de c1 y c2 con la skill cambiada, el aviso nombra lo cerrado y lo pendiente (o «nada pendiente»), y con la skill de hoy no lo hace (RED). Fracaso aunque funcione: que el aviso invente pendientes que no existen, o que el paso 2 (correr el gate) deje de ejecutarse.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` (decisión 2); los enunciados de c1 y c2 en `tests/batteries/aviso-cierre/` (decisión 4); su prueba con sujetos RED → GREEN (constitución, art. 5).
- No entra: el paso 2; la `description` de la skill («Usar al cerrar una feature.» sigue siendo exacta); `battery.md`; los demás ficheros de `skills/`; un paso nuevo; cualquier cambio de `src/`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` (único sitio: `git grep -niE "qué se cierra"` fuera de `.docs/sdd/specs` y `tests/*.md`) | Scope y decisión 2: pasa al literal nuevo |

- Filas que implementa: 0016 → ningún fichero la nombra; el roadmap no tiene fila 0016 (id reservado con `sdd id claim`) | nada: comprobado con `git grep -n "0016" -- . ':!.docs/sdd/specs'`

## Approach

- A. Editar el paso 1 en sitio — cuesta una frase en un fichero; la skill sigue con dos pasos y el gate no se mueve.
- B. Añadir un paso «Di qué queda pendiente» — cuesta renumerar el gate a paso 3 y contradice lo decidido («el paso 1 dice también»).
- C. Skill nueva solo para el pendiente — cuesta un fichero y una `description` más para una frase, y obligaría a invocar dos skills al cerrar.
- Elegido: A — es lo que dijo el dev-lead: «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente».

El cambio es el literal de la decisión 2. La skill no dice cómo averiguar lo pendiente: lo deduce de la feature que cierra (decisión 1).

## Dónde se prueba

- Aviso de cierre: sujetos Sonnet sobre `tests/batteries/aviso-cierre/battery.md`, escenarios c1 y c2, que cierran una feature entera; RED con la skill de hoy, GREEN con la nueva (constitución, art. 5):
  - c1 — GIVEN una feature con la Task 2 sin terminar · WHEN el sujeto cierra con la skill nueva · THEN el aviso dice qué cierra y nombra la Task 2 como pendiente; con la skill de hoy no dice lo pendiente (RED).
  - c2 — GIVEN una feature con todo hecho y validado · WHEN el sujeto cierra con la skill nueva · THEN el aviso dice qué cierra y «nada pendiente», sin inventar pendientes.
  - Ambos — THEN tras el aviso el sujeto corre el gate (`node --test && node scripts/lint.mjs`) e informa su resultado (paso 2).
- Paso 2 intacto: el diff de `skills/aviso-cierre/SKILL.md` toca solo la línea 8.
- Validación de la frase: el dev-lead la juzga en el cierre (`Validación: dev-lead`); sin su visto bueno no se cierra.

## Términos y ADR

- Términos resueltos: pendiente — lo que sigue sin hacer o sin validar de la feature al cerrarla (decisión 1)
- ADR candidatas: ninguna

## Previsión de coste

Comando de `tech-stack.md`: `SCENARIOS="<escenarios>" N=<n> node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md`. Si la prueba supera el total, una tanda más de REFACTOR incluida, se para y decide el dev-lead (constitución, art. 5).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| GREEN | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| Una tanda de REFACTOR | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| Controles | sin escenarios de control en la batería | 0 |
| Medición tras la revisión final | `SCENARIOS="c1 c2" N=1` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| Suma | 14 sujetos | 9,80 |

Minutos: sin medir (el comando de previsión no los da y `estimation.md` no tiene histórico de `aviso-cierre`); la primera tanda de RED los mide y se declaran antes de la de GREEN.

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
