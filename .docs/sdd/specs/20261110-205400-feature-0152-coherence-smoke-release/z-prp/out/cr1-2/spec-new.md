---
id: 20261112-163123-feature-0028-close-notice-pending
feature: 0028
title: El aviso de cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, `aviso-cierre` solo dice qué se cierra: al cerrar la 0005 la persona no supo que quedaba una fila abierta en el roadmap y el dev-lead tuvo que parar. Tras el cambio, el aviso diría además qué queda pendiente (p. ej. «Se cierra la 0005. Queda abierta la 0008 · Avisos por correo»). Se consigue ampliando el paso 1 de `skills/aviso-cierre/SKILL.md`, y solo si el RED mide antes que hoy falla (el ejemplo es ilustrativo: lo que se comprueba son las aserciones de ✋ 6).

Validación: dev-lead — es el texto que lee una persona al cerrar; lo valida el dev-lead tras el GREEN y antes del REFACTOR, no solo la batería.

## Capacidades

- Ninguna, porque herramientas (el cambio es el texto de una skill del proyecto; el proyecto no tiene `capabilities/`).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna de la rúbrica (sin capacidad nueva, sin contrato público, sin `MODIFIED`, sin datos, sin dependencia; el fichero que edita sí lo he leído) · tamaño: ~2 líneas en 1 fichero
- Técnica (sonnet): que el paso 1 nuevo mande a una fuente concreta de lo pendiente y que los escenarios c1 y c2 puedan exhibir el fallo (señal: ninguna; lo motiva el ticket sin medir)
- Mínimo razonable: sin review — deja sin mirar si la frase del paso 1 es medible por la batería

1. Enfoque: ampliar el paso 1 en su sitio, frente a (B) un paso 2 nuevo «Di qué queda pendiente» y (C) no tocar la skill y tratarlo como hábito del dev-lead. B parte el aviso en dos pasos que el agente puede saltarse por separado y desplaza «Corre el gate» a 3; C deja el ticket abierto. Es el enfoque central.
2. Literal del paso 1, propuesto: «1. Di qué se cierra y qué queda pendiente: toda fila de `ROADMAP.md` cuyo Estado no es ✅.» El «dónde mirar» (`ROADMAP.md`) y la definición los he añadido yo: el ticket no los dice.
3. «Pendiente» = toda fila de `ROADMAP.md` (Now, Next y Later) cuyo Estado no es ✅; hoy el roadmap solo usa ⏳ y ✅. El literal del paso 1 lleva esa misma definición. No cuento deuda (`debt.md`) ni tareas internas de la feature: el ticket habla de «una fila abierta».
4. La edición entra solo si el RED exhibe el fallo: el ticket está sin medir. Exhibirlo = al menos 2 de los 4 sujetos de RED cierran sin nombrar una fila abierta que su `ROADMAP.md` tiene (con n=2 por escenario y un modelo no determinista, un solo fallo podría ser azar). Si no se exhibe, la skill no se edita: la feature se cierra sin cambio y el ticket vuelve al dev-lead. Un escenario nuevo no se inventa: se pregunta, y repite la previsión de coste y de minutos antes del primer sujeto. Umbral mío.
5. `sin medir`: `tests/batteries/aviso-cierre/battery.md` solo trae las filas c1 y c2 (paso «cierre», n=2, Sonnet); no he visto qué fixture trae cada una ni si el `ROADMAP.md` del sujeto tiene filas abiertas. Si no la tienen, el RED no puede exhibir nada y es el primer hallazgo de la task 1.
6. Éxito del GREEN, mío, con tres aserciones por sujeto: (a) el aviso dice qué se cierra («Se cierra la NNNN», id del cierre); (b) con filas abiertas, nombra el id exacto de cada una y su título (reconocible, puede ir resumido), y ningún id que no esté en su `ROADMAP.md` ni ninguna fila ✅; sin filas abiertas, no nombra pendientes; (c) hasta 3 filas abiertas, no pasa de 5 líneas (tope mío, para que la lista no tape el «qué se cierra»); con más, una línea por fila abierta y el tope no aplica. Las aserciones las comprueba la sesión leyendo el cierre de cada sujeto, sin tocar `battery.md`; si la batería hubiera de cambiar, se pregunta. Exijo 4 de 4 sujetos (más estricto que el 2 de 4 del RED, a propósito: el RED decide si hay fallo y no puede pasarse de sensible; el GREEN decide si el arreglo es fiable); si uno falla, es la tanda de REFACTOR, que repite c1 y c2 con las mismas aserciones; si tampoco llega a 4 de 4, se para y decide el dev-lead. La primera task comprueba qué casos trae c1 y c2 (con y sin filas abiertas) antes de gastar un sujeto: si menos de 2 de los 4 sujetos de RED tendrían una fila abierta, el RED no puede exhibir nada, se para, se pregunta al dev-lead por el escenario que falta y se repite la previsión antes del primer sujeto.
7. Sin delta de `capabilities/`: no hay capacidad que fusionar, así que no hay copia de prueba que correr. Sin topes de palabras: el proyecto no tiene test de topes.
8. Previsión de coste y parada: 12 sujetos, 8,40 $ y ~45 min en total (los minutos, ~15 por tanda de 4 sujetos, son estimación mía, sin medir); si el RED no exhibe el fallo, la feature acaba tras él: 4 sujetos, 2,80 $, ~15 min (RED, GREEN y una tanda de REFACTOR, 4 sujetos cada una; constitución art. 5: si lo supera, REFACTOR incluida, se para y decide el dev-lead). Sin controles ni medición tras la revisión final: no los veo necesarios, a cero.
9. Dónde vive el trabajo: `.docs/sdd/changes/` (carpeta de este cambio); la 0028 no tiene fila en `ROADMAP.md`: la rama la reservó, y `sdd id claim` la dio por buena (sin remoto, contador local). El riesgo de colisión de id al publicar lo asumo yo y lo valida el dev-lead al aprobar.
- Política de modelos: revisor de la spec en Sonnet (uno) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos: Sonnet, por tandas de 4, sin paralelizar más de `control.maxParallelAgents`

### Hallazgos de la review

1. **Aceptado** (Crítico) — sin criterio medible ni casos con y sin fila abierta → ✋ 6 con tres aserciones, y la task 1 comprueba los casos de c1 y c2 antes del RED. **Rechazado** lo de escribir GIVEN/WHEN/THEN: no hay delta de capacidades, el contrato es la batería.
2. **Aceptado** (Crítico) — resultado alternativo y contradicción sobre escenarios → Scope y ✋ 4: «sin cambio, ticket devuelto» y escenario nuevo solo preguntado.
3. **Aceptado** — umbral de un solo sujeto → ✋ 4: 2 de 4.
4. **Aceptado** — aserciones y REFACTOR → ✋ 6.
5. **Aceptado** — dos definiciones de «pendiente» → ✋ 2 y 3 unificadas; el formato real del roadmap (⏳, ✅) comprobado.
6. **Aceptado** — minutos y repetir previsión → ✋ 8 y ✋ 4.
7. **Rechazado** — fila 0028 en el roadmap: el aviso que se prueba es el de los sujetos con su propio `ROADMAP.md`, no el de esta feature; el id local sin remoto queda dicho en ✋ 9.
8. **Aceptado** — validador y momento → cabecera «Validación».
9. **Rechazado** — la línea «Mínimo razonable» es parte fija del bloque (`review-spec.md` §2), no una duda mía.
10. **Aceptado** — ejemplo del 🦆 marcado como ilustrativo.

#### Segunda ronda

1. **Aceptado** (Crítico) — quién evalúa las aserciones → ✋ 6: la sesión lee el cierre de cada sujeto; `battery.md` no se toca.
2. **Aceptado** (Crítico) — RED inalcanzable sin casos con fila abierta → ✋ 6: se para antes del primer sujeto si menos de 2 de 4 la tendrían, y se pregunta.
3. **Aceptado** — minutos por fila y coste si acaba tras el RED → ✋ 8 y tabla.
4. **Aceptado** — límite de 5 líneas con muchas filas → ✋ 6 (c).
5. **Aceptado** — «abiertas» ambiguo → literal de ✋ 2 con la definición.
6. **Aceptado** — frase de quitar `ROADMAP.md` del literal → eliminada de ✋ 2.
7. **Aceptado** — asimetría 4/4 y REFACTOR sin salida → ✋ 6.
8. **Aceptado** — riesgo de colisión de id → ✋ 9.
9. **Rechazado** — autoría: la sección entera es «decisiones que he tomado yo — valida estas», y ✋ 2, 4, 6 y 8 están ahí para que las valide el dev-lead; lo suyo, con su frase, está en «Decisiones tomadas con el dev-lead».
10. **Aceptado** — fila ✅ listada como pendiente → ✋ 6 (b).

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente, por el ticket de campo .docs/sdd/field-reports/20260914-aviso.md §1; el RED aún no se ha medido»
- Entrevista ya hecha — «La entrevista ya está hecha; decidido con el dev-lead»

## Intent

Al cerrar una feature, `aviso-cierre` dice qué se cierra y calla lo demás. Ticket de campo (`field-reports/20260914-aviso.md` §1): al cerrar la 0005 la persona no supo que quedaba una fila abierta; coste, una parada del dev-lead. Se quiere que el mismo aviso diga también qué queda pendiente, para que quien cierra no tenga que averiguarlo. Éxito: el aviso nombra la fila abierta cuando la hay. Fracaso aunque «funcione»: un aviso que inventa pendientes cuando no hay, o que tapa el «qué se cierra» con una lista larga.

## Scope

- Entra: nada hasta que el RED mida (ver «Entra, si el RED lo exhibe»). Si el RED no exhibe el fallo, el resultado es «sin cambio en la skill, ticket devuelto al dev-lead».
- Entra, si el RED lo exhibe: el paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente (el literal, en ✋ 2); su RED, su GREEN y una tanda de REFACTOR con los escenarios c1 y c2.
- No entra: el paso 2 («Corre el gate»); `debt.md`; los ficheros de `tests/batteries/` (salvo que el RED pida un escenario, y eso se pregunta); cualquier skill del kit.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Paso 1 «Di qué se cierra.» cambia de redacción | `skills/aviso-cierre/SKILL.md:8` (única aparición fuera de las carpetas de evidencia, `git grep -n "Di qué se cierra"`) | Scope, decisión 2 |

- Filas que implementa: nada: comprobado con `git grep -n "0028"` (sin hits) y sin fila en `ROADMAP.md`.

## Approach

- A. Ampliar el paso 1 en su sitio — una frase más; el agente lee un solo paso.
- B. Paso 2 nuevo «Di qué queda pendiente» — dos pasos que se saltan por separado; «Corre el gate» pasa a 3.
- C. No tocar la skill — deja el ticket sin saldar.
- Elegido: A — es el único que cambia una línea y conserva la numeración que ya prueba la batería.

## Dónde se prueba

- Aviso de cierre: por la batería existente `tests/batteries/aviso-cierre/battery.md` (c1 y c2, sujetos Sonnet), como el patch 0006. Sin test de código: la skill no tiene.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

_Sin delta: el proyecto no tiene capacidades._

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 (~15 min) |
| GREEN | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 (~15 min) |
| Una tanda de REFACTOR | `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 (~15 min) |
| Controles | ninguno previsto | 0 |
| Medición tras la revisión final | ninguna prevista | 0 |
| Suma | 12 sujetos | 8,40 (~45 min) |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
