---
id: 20261108-175809-feature-0016-close-notice
feature: 0016
title: El aviso de cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-11-08
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, la skill `aviso-cierre` solo dice qué se cierra. Con este cambio dirá además qué queda sin hacer: si una feature se cierra con una validación sin pasar, el aviso la nombra; si no queda nada, dice que no queda nada. Se logra ampliando una sola línea del paso 1 de la skill y probándola con sujetos antes y después, porque el proyecto no admite editar una skill sin su prueba.

Validación: dev-lead — el aviso lo lee una persona y lo que cuenta como «pendiente» es una lectura suya; el agente solo puede medir que el aviso lo nombra.

## Capacidades

- Ninguna, porque herramientas (el cambio es el texto de una skill del proyecto; no hay `capabilities/` y no se toca comportamiento del producto de reservas).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet), con los siete puntos — señales: ninguna de las ocho (sin capacidad nueva, contrato público, `MODIFIED`, datos, dependencia ni reglas de visibilidad; zona no explorada: ninguna) · tamaño: ~1 línea de la skill y esta spec, en 2 ficheros
- Dominio y técnica juntas (sonnet): si «pendiente» queda definido sin contradecir el paso 2 («Corre el gate») ni la batería c1/c2, y si la previsión de coste suma bien (señal: tamaño pequeño, sin `MODIFIED`)
- Mínimo razonable: sin revisor — deja sin mirar si «pendiente» admite dos lecturas que la spec no vio
- Despachado: el nivel propuesto (un revisor). Volvió con 10 hallazgos, ninguno Crítico: sin segunda ronda.

1. **Enfoque elegido: reescribir el paso 1 en su sitio**, como pidió el dev-lead. Descartados: añadir un paso 2 «Di qué queda pendiente» (renumera el gate y el dev-lead dijo que iba en el paso 1) y una plantilla para la lista de pendientes (sobra para una línea).
2. **Texto del paso 1**: «1. Di qué se cierra y qué queda pendiente.» El paso 2 («2. Corre el gate.») no cambia. El literal es mío; el dev-lead fijó el contenido, no la frase. No fijo un formato del aviso (ni un rótulo `Pendiente:`): lo que se exige es que lo pendiente se nombre y que, si no hay nada, se diga.
3. **Qué es «pendiente»**: lo de la feature que este cierre deja sin hacer y que el sujeto ve en lo que se le da —un escenario sin cumplir, una task sin cerrar, una validación sin pasar—. No cuenta lo que ya está cerrado ni las aprobaciones de la propia spec. Es mi lectura: el dev-lead no la acotó.
4. **Criterio de la prueba** (los escenarios de «Dónde se prueba» son míos): RED = con el texto viejo, el mensaje de cierre de un sujeto con algo sin hacer no lo nombra; GREEN = con el texto nuevo, lo nombra, y un sujeto sin nada sin hacer dice que no queda nada.
5. **Dónde se prueba**: con la batería existente `tests/batteries/aviso-cierre/battery.md` (c1 y c2, 2 sujetos cada uno, sonnet), sin escenarios nuevos en la batería. No veo el texto de c1 ni de c2 —la batería solo trae id, paso, n y modelo—; si no pueden exhibir los dos casos del criterio 4, el RED lo dirá y se decide entonces con el dev-lead.
6. **Tandas de REFACTOR y de medición tras la revisión final**: entran en el Scope y en la previsión porque la constitution (regla 5) pide declarar el techo con una tanda de REFACTOR incluida; la de medición repite el GREEN tras la revisión final.
7. **Previsión de coste**: 11,20 $ en total, a 0,70 $ por sujeto (`tech-stack.md`), no a los ~0,31 $ medidos en el patch 0006: es el techo que la regla 5 pide declarar antes del primer sujeto; a lo medido saldría ~4,96 $. Controles a 0: nadie pidió controles. **Minutos: `sin medir`**: el repo no tiene ninguna medida, así que no hay techo de minutos; aprobar la spec es aceptar que la parada de la regla 5 se aplica solo en dólares.
8. **Validación `dev-lead`**: una persona lee el aviso; en duda, dev-lead.
9. **El `description` de la skill («Usar al cerrar una feature.») no cambia**: el cambio fijado por el dev-lead es el del paso 1.
10. **Los ejemplos del Intent** son inventados («una validación sin pasar»); no nombran ningún dato real del proyecto.
- Política de modelos (solo en `delegate`): revisor de la spec: uno, sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería: sonnet, por tandas de 4 · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

1. **Aceptado** — La prueba no se puede verificar: sin escenarios ni criterio RED/GREEN → decisión 4 y «Dónde se prueba» con dos casos (con pendiente, sin pendiente).
2. **Aceptado** — El 🦆 y el Intent prometían un formato `Pendiente: …` que el paso no exige → retirado el literal del 🦆 y del Intent; decisión 2 dice que no fijo formato.
3. **Aceptado** — Minutos sin techo → decisión 7: `sin medir`, y aprobar la spec acepta el techo solo en dólares.
4. **Aceptado** — REFACTOR y medición final no estaban en Scope ni en ✋ → entran en Scope y decisión 6.
5. **Aceptado** — La sección mezclaba opciones de review sin elegir y decisiones sin numerar → elegido «un revisor» y anotado lo despachado; la validación, el `description` y los ejemplos pasan a decisiones numeradas (8, 9, 10); la política de modelos queda como línea propia, como pide la plantilla.
6. **Aceptado** — «Pendiente» incluía cosas que un sujeto no ve → decisión 3 lo acota a lo que el sujeto ve en lo que se le da.
7. **Aceptado** — El gate venía de ningún sitio → «Dónde se prueba» cita `operations.md` («Gate de cierre»).
8. **Aceptado** — El ejemplo de producción era un dato supuesto → el 🦆 y el Intent usan «una validación sin pasar», genérico (decisión 10).
9. **Aceptado** — El tamaño no encajaba con el Scope → «~1 línea de la skill y esta spec, en 2 ficheros»; la spec es el único otro fichero y no es parte del Scope de la skill.
10. **Rechazado** — «Sin delta» ignora que la skill cambia lo que el agente emite → la plantilla admite «Ninguna, porque herramientas» para el texto de una skill del proyecto, y no hay `capabilities/` donde un requisito pudiera vivir; el comportamiento observable de la skill se fija en los dos casos de «Dónde se prueba», que es donde el proyecto prueba sus skills (patch 0006).

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «decidido con el dev-lead: el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente»
- La entrevista ya está hecha y se salta; la spec se escribe y se presenta para aprobar — «La entrevista ya está hecha»

## Intent

Hoy el cierre de una feature solo declara qué se cierra, y quien lo lee no sabe qué se queda sin hacer. Importa porque un cierre que calla lo pendiente parece completo. Éxito: el aviso de cada cierre nombra lo que queda pendiente —o dice que no queda nada— sin que nadie lo pregunte. Fracasaría, aunque la skill pareciera correcta, si el sujeto cierra una feature con cosas sin hacer y dice que no queda nada, o si el aviso crece hasta tapar lo que se cierra.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` (`1. Di qué se cierra.` → `1. Di qué se cierra y qué queda pendiente.`) y su prueba con sujetos (RED → GREEN → una tanda de REFACTOR → medición tras la revisión final, constitution regla 5).
- No entra: el paso 2 (el gate), el `description` de la skill, la batería (sus escenarios), el gate de cierre de `operations.md` y cualquier otra skill.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| El literal `1. Di qué se cierra.` | `skills/aviso-cierre/SKILL.md:8` | Scope: se reescribe a `1. Di qué se cierra y qué queda pendiente.` |
| La skill `aviso-cierre` nombrada fuera de su fichero | `tests/batteries/aviso-cierre/battery.md:1` (título) y `.docs/sdd/tech-stack.md:6` (coste por sujeto) | Decisiones 5 y 7: se leen, no cambian; el texto del paso no aparece en ninguno |

- Filas que implementa: 0016 → ningún fichero la nombra | nada: comprobado con `git grep -nE "0016|qué se cierra|queda pendiente|pendiente" -- . ':!.docs/sdd/specs'` (único hit: `skills/aviso-cierre/SKILL.md:8`) y `ls .docs/sdd/capabilities` (la carpeta no existe, no hay capacidad que lo nombre). El roadmap no tiene fila 0016: el id sale de la rama y de `sdd id claim` («sin remoto: la 0016 vale (contador local)»).

## Approach

Reescribir en su sitio el paso 1 de la skill: una frase añadida; el resto del fichero queda como está. La skill se prueba con la batería existente antes (RED, con el texto viejo, para exhibir que el aviso calla lo pendiente) y después (GREEN, con el nuevo), más una tanda de REFACTOR y la medición tras la revisión final (decisión 6). Cómo se redacta el brief de los sujetos y cuántas tasks salen es del plan.

## Dónde se prueba

- El aviso nombra lo pendiente: con sujetos Sonnet sobre la batería `tests/batteries/aviso-cierre/battery.md` (c1 y c2), como el patch 0006; se lee el mensaje de cierre de cada sujeto. Dos casos:
  - Con algo sin hacer (p. ej. una validación sin pasar): el mensaje de cierre lo nombra como pendiente.
  - Sin nada sin hacer: el mensaje dice que no queda nada pendiente.
- El paso 2 sigue ahí: tras el aviso, el mismo cierre corre el gate de `operations.md` («Gate de cierre»: `node --test && node scripts/lint.mjs`).

## Términos y ADR

- Términos resueltos: pendiente — lo de la feature que este cierre deja sin hacer y que el sujeto ve en lo que se le da (decisión 3) · cierre — el de una feature con `aviso-cierre`, no el de la release
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: el cambio es el texto de una skill del proyecto, no comportamiento observable del producto (Capacidades: «Ninguna, porque herramientas»). No hay `sdd capability merge` que probar sobre una copia.

## Previsión de coste

Precio por sujeto: 0,70 $ (`tech-stack.md`). Batería: `tests/batteries/aviso-cierre/battery.md`, c1 y c2 con n=2 cada una = 4 sujetos por tanda (`SCENARIOS="c1 c2" N=2 node scripts/plan.mjs …`: 4 sujetos · 2,80 $).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 4 (c1, c2 × 2) | 2,80 |
| GREEN | 4 (c1, c2 × 2) | 2,80 |
| Una tanda de REFACTOR | 4 (c1, c2 × 2) | 2,80 |
| Controles | 0 — nadie pidió controles | 0,00 |
| Medición tras la revisión final | 4 (c1, c2 × 2) | 2,80 |
| Suma | 16 | 11,20 |

Minutos: `sin medir` (decisión 7). Si la prueba supera 11,20 $, una tanda de REFACTOR incluida, se para y decide el dev-lead (constitution, regla 5).

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
