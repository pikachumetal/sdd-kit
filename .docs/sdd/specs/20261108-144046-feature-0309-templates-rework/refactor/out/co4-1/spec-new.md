---
id: 20261109-085310-feature-0016-close-notice
feature: 0016
title: El aviso de cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-11-09
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, el aviso solo dice qué se cierra. Con este cambio dirá además qué queda sin hacer: por ejemplo «Pendiente: el listado de canceladas aún no enseña el motivo», o «Nada pendiente» si no queda nada. Quien cierra ve de un vistazo lo que se lleva la feature y lo que deja fuera. Se consigue ampliando el paso 1 de la skill `aviso-cierre`; dos escenarios nuevos de prueba cierran una feature con pendientes y otra sin ninguno. El paso 2 (correr el gate) no cambia.

Validación: agente — es el texto de una skill y su efecto lo miden los sujetos de la batería; ninguna persona vería algo que esa medida no vea.

## Capacidades

- Ninguna, porque herramientas (el cambio es el texto de una skill, no comportamiento del producto).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna contada · tamaño: ~40 líneas en 6 ficheros
- Único (sonnet): si «pendiente» (decisión 1) es observable por un sujeto con lo que recibe (decisión 9), y si la decisión 3 contradice el paso 2 (señal: ninguna; el Scope son tres líneas)
- Mínimo razonable: sin review — deja sin mirar si el literal nuevo se contradice con el resto de `SKILL.md`, que es de 10 líneas

1. **Qué es «pendiente»**: lo que la feature que se cierra deja sin hacer: las líneas de `## Scope → No entra` de su `spec.md` y las casillas `- [ ]` de su `plan.md`. Incluye exclusiones deliberadas del «No entra», no solo trabajo diferido: el aviso las lista como «fuera de esta feature», no como fallo. Valídalo, porque puede que quisieras solo lo diferido. No son las filas del roadmap ni la deuda técnica. El dev-lead dijo «también qué queda pendiente» y no dijo de qué; elegí lo más cercano a la feature porque una skill de cierre no debe leer el roadmap entero.
2. **Literal nuevo del paso 1**: el del Approach, que dice de dónde sale lo pendiente. El viejo era `1. Di qué se cierra.`
3. **Sin pendiente**: el aviso dice «Nada pendiente», no omite la mención, para que el silencio no se confunda con un olvido.
4. **Paso 2 intacto**: `2. Corre el gate.` no cambia. La cabecera y el `description` (`Usar al cerrar una feature.`) tampoco: comprobé que el `description` no menciona el paso 1.
5. **Enfoque**: A, frente a B y C (ver Approach).
6. **Validación `agente`**: la propongo yo; no hay frase del dev-lead que la nombre, por eso va aquí para que la apruebes o la cambies.
7. **Previsión de coste**: precio de 0,70 $ por sujeto, el de `tech-stack.md:6` («Un sujeto de `aviso-cierre` cuesta ~0,70 $, porque cierra una feature entera»). El patch 0006 anotó ~0,31 $ por sujeto; sigo `tech-stack.md` porque es el documento del proyecto que fija el precio y la cifra mayor protege el tope. Con 0,31 $ el total sería 7,44 $ en vez de 16,80 $: te lo dejo a la vista. Los 16,80 $ ya incluyen una tanda de REFACTOR: pasarlos obliga a parar y decidir (art. 5). Minutos: ~3 por sujeto, `sin medir` (nadie los midió en el patch 0006); 24 sujetos en serie son ~72 min, y ese es el techo. `plan.mjs` ya lo ejecuté para `c1 c2` (salida en la tabla); `c3` y `c4` los calculo a mano porque sus filas aún no existen.
8. **Dos escenarios nuevos** en `tests/batteries/aviso-cierre/battery.md` (`| c3 | cierre | 2 | sonnet |` y `| c4 | cierre | 2 | sonnet |`), con sus ficheros en `tests/batteries/aviso-cierre/c3/` y `c4/` (cada uno con un `spec.md` y un `plan.md` mínimos): `c3` cierra una feature con una línea en «No entra» y una casilla `- [ ]` en el plan, y GREEN es que el aviso nombra esas dos cosas concretas; `c4` cierra una feature sin ninguna de las dos, y GREEN es «Nada pendiente» sin inventar nada. No he visto qué cierran `c1` y `c2` (la batería solo lista sus ids): si ninguno deja pendientes, solo podrían mostrar «Nada pendiente» y el RED no distinguiría el texto viejo del nuevo. `c1` y `c2` no se editan; la comprobación nueva se les aplica al leer su salida, `sin medir`.
9. **Qué recibe el sujeto**: la `spec.md` y el `plan.md` de la feature que cierra (en `c3` y `c4`, sus ficheros). El patch 0006 no dice qué recibían sus sujetos, así que esto es decisión mía. Si la feature no tiene plan (un patch), «pendiente» es solo su «No entra»; ese caso queda `sin probar`, y también el de un plan con casillas pero sin «No entra».
10. **Formato del aviso**: lo lee una persona, no un programa: la herramienta es de una sola persona (`mission.md`), que es también el dev-lead que aprueba. Por eso cambiar su forma no rompe nada. La rama es `feature/0016-close-notice`, creada desde `develop` (mismo commit).
- Política de modelos: revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos por tandas, en paralelo hasta `control.maxParallelAgents`. Al aprobar la spec, esta línea es la confirmación de paralelizar.

### Hallazgos de la review

Primera ronda:
- **Aceptado** — Crítico: `c1`/`c2` desconocidos no distinguen el texto viejo del nuevo → escenarios nuevos (decisión 8), en el Scope y en la previsión.
- **Aceptado** — Crítico: el sujeto no tiene de dónde leer el «No entra» y las tasks → decisión 9.
- **Aceptado** — REFACTOR ambigua en el coste → decisión 7 aclara que los 16,80 $ la incluyen.
- **Aceptado** — 0,70 $ frente a 0,31 $ sin justificar → decisión 7 cita `tech-stack.md:6` y deja la discrepancia a la vista.
- **Aceptado** — faltan los minutos del art. 5 → decisión 7 y columna de la tabla, marcados `sin medir`.
- **Aceptado** — `description` sin comprobar → comprobado y dicho en la decisión 4.
- **Aceptado** — feature sin tasks sin decidir → decisión 9.
- **Aceptado** — formato del aviso sin consumidores dichos → decisión 10.
- **Aceptado** — ejemplos presentados como reales → el 🦆 y el Approach los dan como ejemplo.
- **Rechazado** — `SKILL.md:8` afirmado sin leer → lo leí al clasificar: línea 8, `1. Di qué se cierra.`; el RED lo reconfirma igualmente.

Segunda ronda (la última):
- **Aceptado** — Crítico: `c3` sin ficheros ni criterio de GREEN → decisión 8 y Scope: `c3/` con `spec.md` y `plan.md`, y qué debe nombrar el aviso.
- **Aceptado** — Crítico: nada detecta un pendiente inventado → escenario `c4` (decisión 8), en Scope, coste y «Dónde se prueba».
- **Aceptado** — de dónde sale lo pendiente → el literal lo dice (`## Scope → No entra` y casillas `- [ ]`) y la decisión 9 quita la cita al patch 0006.
- **Aceptado** — «No entra» no es siempre trabajo sin hacer → decisión 1 lo declara y lo deja a validar.
- **Aceptado** — casos sin plan o solo con casillas, sin escenario → decisión 9: `sin probar`.
- **Aceptado** — minutos y paralelo → techo de 72 min en serie, sin «bastante menos».
- **Aceptado** — orden del aviso sin comprobar → quitado de la decisión 3.
- **Aceptado** — el `git grep` no prueba que no haya consumidores → quitado; se apoya en `mission.md`.
- **Aceptado** — art. 2, rama y dev-lead → «Controles» dice qué gate corre, y la decisión 10 la rama y que el dev-lead es la misma persona.
- **Rechazado** en parte — `plan.mjs` sin ejecutar → sí lo ejecuté para `c1 c2` (2,80 $ con N=2, a 0,70 $ por sujeto); para `c3` y `c4` no se puede hasta que existan sus filas.

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «decidido con el dev-lead: el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente»

## Intent

Hoy el paso 1 solo pide decir qué se cierra, y quien lee el aviso no sabe qué se queda fuera. Importa porque lo que no entró se pierde si nadie lo nombra al cerrar. Tras el cambio, el aviso nombra lo cerrado y lo pendiente. Fracasaría, aunque funcione, si el aviso inventara pendientes que la feature no tiene, o si el gate del paso 2 dejara de correr.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` pide decir también qué queda pendiente, con «Nada pendiente» cuando no hay.
- Entra: las filas `c3` y `c4` de `tests/batteries/aviso-cierre/battery.md` y sus ficheros en `tests/batteries/aviso-cierre/c3/` y `c4/` (decisión 8).
- No entra: el paso 2; los escenarios `c1` y `c2`; leer el roadmap o la deuda técnica; otras skills.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| El literal `1. Di qué se cierra.` | `skills/aviso-cierre/SKILL.md:8` | Scope y decisión 2 |

- Filas que implementa: 0016 → nada: comprobado con `git grep -nE "0016|close-notice|pendiente" -- . ':!.docs/sdd/specs'` (sin resultados); la feature no tiene fila en el roadmap.

## Approach

- A. Ampliar la frase del paso 1 y fijar en ella de dónde sale «pendiente» — una línea editada; se prueba con los sujetos de `aviso-cierre`.
- B. Añadir un paso nuevo entre el 1 y el 2 solo para lo pendiente — renumera el gate y cuesta más palabras en una skill de 10 líneas.
- C. Dejar la frase tal cual y confiar en que el sujeto lo infiera — es lo que el RED debe mostrar que no ocurre.
- Elegido: A — es lo que dijo el dev-lead (el paso 1 dice también qué queda pendiente) y no toca el paso 2.

El paso 1 queda: `1. Di qué se cierra y qué queda pendiente (lo que la feature deja sin hacer: las líneas de «No entra» de su spec.md y las casillas «- [ ]» de su plan.md; si no hay nada, «Nada pendiente»).`

## Dónde se prueba

- El aviso nombra lo cerrado y lo pendiente: con los sujetos de la batería `aviso-cierre`, escenarios `c1`, `c2`, `c3` y `c4`; RED con el texto actual, GREEN con el nuevo. `c3` comprueba que se nombra un pendiente real y `c4` que no se inventa ninguno.
- El gate sigue corriendo: la misma salida de los sujetos, que muestra el paso 2.
- Sin probar: una feature sin plan (patch) y un plan con casillas pero sin «No entra» (decisión 9).

## Términos y ADR

- Términos resueltos: pendiente — lo que la feature que se cierra deja sin hacer (decisión 1)
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: el proyecto no tiene `capabilities/` y el cambio es el texto de una skill.

## Previsión de coste

Cada fila cita `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $`, más `c3` y `c4` con n = 2 cada una a mano (4 × 0,70 = 2,80 $: sus filas aún no existen, entran con la Task 1).

| Tanda | Sujetos (batería) | $ | Minutos (sin medir, ~3 por sujeto) |
| --- | --- | --- | --- |
| RED | `c1 c2` N=2 → 4 sujetos, 2,80 $ + `c3 c4` N=2 → 4 sujetos, 2,80 $ | 5,60 | ~24 |
| GREEN | `c1 c2` N=2 → 4 sujetos, 2,80 $ + `c3 c4` N=2 → 4 sujetos, 2,80 $ | 5,60 | ~24 |
| Una tanda de REFACTOR | `c1 c2` N=2 → 4 sujetos, 2,80 $ + `c3 c4` N=2 → 4 sujetos, 2,80 $ | 5,60 | ~24 |
| Controles | a cero: no hay otra skill ni escenario que este cambio pueda romper; el gate de cierre `node --test && node scripts/lint.mjs` corre al cerrar y no lleva sujetos | 0,00 | 0 |
| Medición tras la revisión final | a cero: no hay topes de palabras ni medición posterior que pida el proyecto | 0,00 | 0 |
| Suma | 24 sujetos | 16,80 | ~72 |

Si la prueba supera esta previsión, una tanda de REFACTOR incluida, se para y decide el dev-lead (constitution, art. 5).

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
