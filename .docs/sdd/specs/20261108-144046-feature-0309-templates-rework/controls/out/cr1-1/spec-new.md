---
id: 20261109-091533-feature-0028-aviso-cierre-pendiente
feature: 0028
title: El aviso de cierre dice también qué queda pendiente
mode: full
status: draft
created: 2026-11-09
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, `aviso-cierre` solo dice qué se cierra: al cerrar la 0005 nadie supo que quedaba una fila abierta del roadmap, y costó una parada del dev-lead. Con este cambio el aviso dirá además qué queda: al cerrar la 0010 con la 0011 y la fila 1 aún en ⏳, dice «se cierra la 0010; quedan pendientes la 0011 y la 1». Se hace editando una sola frase del paso 1 de la skill, y como es una skill se prueba con sujetos: primero se mide el fallo (RED), después se escribe la frase (GREEN).

Validación: dev-lead — el aviso lo lee una persona y lo que le sirve es que se entienda; el agente no puede medir eso por ella.

## Capacidades

- Ninguna, porque herramientas (una skill del propio proyecto; no cambia lo que hace `salas`).

## ✋ Decisiones que he tomado yo — valida estas

**Preguntas abiertas — sin respuesta, la spec no se puede aprobar tal cual:**

- **P1 (✋ 2).** ¿De qué tabla del roadmap era la fila que quedó abierta en la 0005? Si era de Backlog o de deuda, la definición de «pendiente» y el oráculo de c3 cambian antes del RED.
- **P2 (✋ 7).** Una cifra de minutos para la previsión, anotada en la tabla antes de aprobar. Medirla durante el RED no vale: el Art. 5 pide declararla antes del primer sujeto.
- **P3 (✋ 4).** ¿Dónde está el texto de los escenarios c1 y c2? Si no existe, se sacan de la previsión con una enmienda: quedan 12 sujetos y 8,40 $ en total.

Review de spec propuesta: un revisor — señales: ninguna de las ocho (sin capacidad nueva, sin contrato público, sin `MODIFIED`, sin datos, sin dependencia, sin reglas de visibilidad; lo que toca lo he leído) · tamaño: ~3 líneas en 2 ficheros (`skills/aviso-cierre/SKILL.md`, `tests/batteries/aviso-cierre/battery.md`)
- Revisor único (sonnet): si «pendiente = filas ⏳ de «Próximo»» (decisión 2) cubre el caso de la 0005 del ticket sin contar de más, y si c3 y c4 (Dónde se prueba) exhiben de verdad el fallo del ticket
- Mínimo razonable: sin review — deja sin mirar si la definición de «pendiente» contradice cómo el roadmap marca sus filas

1. **Enfoque: A frente a B y C** (ver Approach).
2. **Qué cuenta como pendiente**: las filas de «Próximo» del roadmap con ⏳, salvo la que se cierra. No cuentan «Backlog» (ideas sin planificar) ni «Deuda técnica». El ticket dice «una fila abierta» sin decir de qué tabla, y el roadmap actual no tiene fila de la 0005: **necesito que me digas de qué tabla era esa fila**; si era de Backlog o de deuda, esta definición no cubre el caso que motiva el cambio y se enmienda antes del RED.
3. **Sin nada pendiente, el aviso lo dice**: «no queda nada pendiente». Es un literal mío y sirve de guía, no de oráculo: el oráculo de c4 acepta cualquier frase que diga que no queda nada (Dónde se prueba).
4. **Se añaden c3 y c4 a la batería** (`| c3 | cierre | 2 | sonnet |` y `| c4 | cierre | 2 | sonnet |`). c1 y c2 no los he podido leer: `battery.md` solo lista sus ids y el texto de sus escenarios no está en el repo, así que lo que cubren y si el literal que cambia los afecta está **sin medir**; el plan debe leerlos antes del RED.
5. **Entra, si el RED lo exhibe, la edición de la skill** (c3 y c4 entran siempre, porque son lo que mide). El ticket es un solo caso sin medir. Si los sujetos ya hacen lo que se pide sin la frase nueva, la skill no se edita (Art. 5) y la spec se enmienda; si falla solo una mitad (lista lo pendiente pero no dice «no queda nada», o al revés), la edición cubre solo esa mitad.
6. **La frase final de la skill la fija el GREEN**, no esta spec; el candidato de Approach es un punto de partida.
7. **Previsión de coste: 24 sujetos, 16,80 $ al precio de `tech-stack.md` (~0,70 $ por sujeto).** El patch 0006 (`specs/20260915-090000-patch-0006-aviso/patch.md`) registra «4 sujetos, ~1,24 $ (~0,31 $ por sujeto)»: con ese precio serían unos 7,4 $; he usado el declarado porque es el que fija el comando de previsión. **Minutos: sin medir.** El Art. 5 pide declararlos y ningún patch ni walkthrough del proyecto registra tiempo por sujeto; no quiero inventarlos. **Para aprobar necesito una cifra tuya** (P2), anotada en la tabla antes del primer sujeto. Si la prueba, REFACTOR incluida, supera la previsión, se para y decide el dev-lead (Art. 5).
8. **Validación: dev-lead**, no agente (la frase de delegación no la nombra).
9. **Sin `§Frontend`, sin tope de palabras, sin capacidad nueva, sin delta**: no hay pantalla, el proyecto no limita palabras de ningún fichero que edito (búsqueda de «palabras|word» en `test/`, `scripts/` y `package.json`: sin resultados) y `capability index` dice «Sin capacidades». Por eso no se prueba el delta en una copia: no hay delta.
10. **El sujeto encuentra el roadmap por sí mismo** en c3 y c4 (el fixture lo deja en `.docs/sdd/roadmap.md`, no se lo paso en el prompt): así se mide el uso real. Si no lo lee, es un fallo del RED.
11. **Forma del aviso**: un solo mensaje, con lo cerrado primero y lo pendiente después. Es decisión mía: sin un orden fijo el oráculo no distingue un aviso que entierra lo cerrado.
12. **El oráculo juzga solo el aviso del paso 1.** El paso 2 («Corre el gate») queda fuera de c3 y c4: los fixtures no traen un `node --test` real que ejecutar, y el Art. 2 aplica al cierre de esta feature, no a los sujetos. Decisión mía.
13. **Los escenarios c3 y c4 los crea el plan** (prompt y fixture de roadmap, junto a `battery.md` en `tests/batteries/aviso-cierre/`), antes del RED. No existen todavía.
- Política de modelos: revisores de la spec en sonnet (uno, más el de la segunda ronda) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería (Sonnet) por tandas de 8, en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar; lo que no nombra se confirma aparte

### Hallazgos de la review

Primera ronda (sonnet, un revisor):

1. **Aceptado** — Crítico · minutos sin declarar → columna de minutos en la tabla de coste, `sin medir`, y ✋ 7 pide la cifra. No la invento.
2. **Aceptado** — Crítico · el escenario «sin pendientes» no tenía fixture ni sujetos → c4 en la batería y en la previsión (24 sujetos, 16,80 $).
3. **Aceptado** — Importante · pass/fail sin definir → oráculo por escenario en Dónde se prueba.
4. **Aceptado** — Importante · «filas no abiertas» y «orden» sin medir → el fixture de c3 incluye una fila de Backlog y una de deuda; falla si salen, y falla si lo cerrado no va antes que lo pendiente.
5. **Aceptado en parte** — Importante · definición de pendiente sin evidencia → ✋ 2 te pregunta de qué tabla era la fila de la 0005; la definición no cambia hasta que respondas.
6. **Aceptado en parte** — Importante · c1 y c2 sin leer → siguen sin leerse (su texto no está en el repo, y `tests/` no tiene más ficheros); queda declarado en ✋ 4 y el plan los lee antes del RED.
7. **Rechazado** — Importante · «decidido con el dev-lead» sin respaldo → la fuente es tu mensaje de esta sesión, y la frase va literal; el ticket va citado aparte como origen.
8. **Aceptado** — Importante · Scope contradictorio → separado en incondicional (c3, c4) y condicional (la edición de la skill), con el caso de media falla (✋ 5).
9. **Aceptado** — Importante · ¿se le da el roadmap al sujeto? → ✋ 10: lo encuentra él.
10. **Aceptado** — Menor · fuente de 0,31 $ → enlazado el `patch.md` del 0006 en ✋ 7 (existe, aunque el roadmap solo liste el 0007 en Patches).

Segunda ronda (sonnet, un revisor; no hay tercera):

1. **Aceptado** — Crítico · medir los minutos en el RED contradice el Art. 5 → quitada esa opción; P2 exige la cifra antes de aprobar.
2. **Aceptado** — Crítico · los prompts y fixtures de c3 y c4 eran trabajo oculto → Scope y ✋ 13: los crea el plan, junto a `battery.md`, antes del RED.
3. **Aceptado** — Importante · c1 y c2 sin texto ni oráculo → P3: dime dónde están, o se sacan de la previsión (12 sujetos, 8,40 $).
4. **Aceptado** — Importante · el fixture de c4 no cuadraba con «salvo la que se cierra» → en c4 la única ⏳ es la fila que se cierra.
5. **Aceptado** — Importante · el oráculo de c3 presupone la definición de ✋ 2 → c3 queda condicionado a P1.
6. **Aceptado** — Importante · «la 1» es ambigua en el oráculo → menciones por título literal.
7. **Aceptado** — Importante · orden y forma del aviso no estaban en ✋ → ✋ 11.
8. **Aceptado** — Importante · qué pasa con el gate del paso 2 → ✋ 12.
9. **Aceptado en parte** — Menor · la viñeta «el RED aún no se ha medido» no es una decisión → quitada de esa sección (ya consta en Intent y en ✋ 5); la otra se queda, porque la frase es literal tuya de esta sesión.
10. **Aceptado** — Menor · preguntas abiertas dispersas → reunidas al inicio del bloque ✋ (P1–P3).

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente, por el ticket de campo `.docs/sdd/field-reports/20260914-aviso.md` §1 — «decidido con el dev-lead: el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente, por el ticket de campo .docs/sdd/field-reports/20260914-aviso.md §1»

## Intent

Hoy el paso 1 de `aviso-cierre` dice «Di qué se cierra». Al cerrar la 0005 el aviso dijo qué se cerraba y la persona no supo que quedaba una fila abierta: una parada del dev-lead (ticket §1, un solo caso, sin medir). Se quiere que el aviso diga también qué queda pendiente, para que quien cierra no tenga que mirar el roadmap. Éxito: con la 0010 cerrada y la 0011 y la fila 1 en ⏳, el aviso nombra las dos; con nada abierto, dice que no queda nada. Fracaso aunque «funcione»: un aviso que lista filas que no están abiertas, o que entierra qué se cierra bajo la lista de lo pendiente.

## Scope

- Entra siempre: los escenarios c3 y c4 —su fila en `tests/batteries/aviso-cierre/battery.md`, su prompt y su fixture de roadmap, creados por el plan antes del RED (✋ 13)— porque son lo que mide el RED.
- Entra, si el RED lo exhibe: la edición del paso 1 de `skills/aviso-cierre/SKILL.md` para que diga también qué queda pendiente; si solo falla una mitad, solo esa mitad (✋ 5).
- No entra: el paso 2 (el gate) · otras skills · cambios al roadmap o a sus estados · un script que calcule lo pendiente · avisar de Backlog o deuda técnica.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal del paso 1: «Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` (único sitio: `git grep -niE "qué se cierra\|Di qué"` fuera de `.docs/sdd/specs/`, `.docs/sdd/field-reports/` y `tests/*.md`; en `tests/` solo hay `batteries/aviso-cierre/battery.md`, que no lo contiene) | Scope: la frase pasa a decir también qué queda pendiente; el literal exacto lo fija el GREEN (✋ 6) |

- Filas que implementa: 0028 → no la nombra ningún fichero | nada: comprobado con `git grep -n "0028" -- . ':!.docs/sdd/specs' ':!.docs/sdd/field-reports'` (sin resultados; no hay fila 0028 en `roadmap.md`)

## Approach

- **A. Una cláusula en el paso 1** — cuesta una frase más en una skill de dos pasos; se prueba con un sujeto que cierra una feature. El aviso sigue siendo un solo mensaje.
- B. Un paso nuevo entre el 1 y el 2 («Di qué queda pendiente») — cuesta una numeración nueva, y un paso aparte es el que un sujeto se salta o dice después del gate, que es lo que el ticket quiere evitar.
- C. Un script que lea el roadmap y liste las filas ⏳ — cuesta código nuevo y su test para una frase; y la skill ya obliga a mirar el roadmap solo si se lo dice, lo que c3 y c4 miden (✋ 10).
- Elegido: **A** — es lo único que el ticket pide («el paso 1 dice también…») y no añade piezas; B y C se reconsideran solo si el GREEN no consigue que lo pendiente salga en el aviso.

Candidato de punto de partida para el GREEN (no fijado): «1. Di qué se cierra y qué queda pendiente: las filas con ⏳ de «Próximo» del roadmap, o que no queda nada pendiente.» La skill se escribe después de medir el RED.

## Dónde se prueba

Por sujetos, en la costura más alta que existe (un sujeto cierra una feature entera con la skill, como `aviso-cierre` hoy). El sujeto localiza `.docs/sdd/roadmap.md` por sí mismo (✋ 10).

- **c3, aviso con pendientes**, n=2 *(condicionado a P1)*. Fixture: roadmap con las filas 0010, 0011 y 1 de «Próximo» en ⏳, la fila `B1` en Backlog y una deuda en «Deuda técnica». El sujeto cierra la 0010. Oráculo (pasa si y solo si): el aviso menciona «Anular reservas de otros» (la 0011) y «Avisos por correo antes de la reserva» (la fila 1), por su título literal; no menciona «Exportar reservas a calendario (.ics)» (`B1`) ni «Sin validación del formato de franja horaria» (la deuda); y dice la 0010 como lo cerrado antes de lo pendiente (✋ 11).
- **c4, aviso sin pendientes**, n=2. Fixture: roadmap donde la única fila ⏳ de «Próximo» es la que se cierra (la 0010). Oráculo: el aviso dice qué se cierra y, con cualquier frase, que no queda nada pendiente; no menciona ningún título de fila como pendiente.
- **Regresión: c1 y c2**, n=2 cada uno, como hoy (qué cubren: sin medir, ✋ 4).

## Términos y ADR

- Términos resueltos: pendiente — fila de «Próximo» del roadmap con ⏳ que no es la que se cierra
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: «Ninguna, porque herramientas» en Capacidades.

## Previsión de coste

Comando de `tech-stack.md` ejecutado sobre una copia de `battery.md` con las filas de c3 y c4 ya añadidas (aún no están en la batería real; el plan las añade antes del RED).

| Tanda | Sujetos (batería) | $ | Minutos |
| --- | --- | --- | --- |
| RED | `SCENARIOS="c1 c2 c3 c4" N=2` → `suma: 8 sujetos · coste previsto: 5.60 $` | 5,60 | sin medir (✋ 7) |
| GREEN | `SCENARIOS="c1 c2 c3 c4" N=2` → `suma: 8 sujetos · coste previsto: 5.60 $` | 5,60 | sin medir |
| Una tanda de REFACTOR | `SCENARIOS="c1 c2 c3 c4" N=2` → `suma: 8 sujetos · coste previsto: 5.60 $` | 5,60 | sin medir |
| Controles | — | 0 (la spec no edita otra skill ni declara controles) | 0 |
| Medición tras la revisión final | — | 0 (solo si la revisión final edita la skill; entonces la prueba supera la previsión y se para, ✋ 7) | 0 |
| Suma | 24 sujetos | 16,80 | sin medir |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
