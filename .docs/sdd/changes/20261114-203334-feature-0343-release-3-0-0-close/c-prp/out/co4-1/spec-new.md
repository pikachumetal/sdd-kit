---
id: 20261115-200653-feature-0016-close-notice
feature: 0016
title: aviso-cierre dice también qué queda pendiente
mode: full
status: draft
created: 2026-11-15
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — aviso-cierre dice también qué queda pendiente

🦆 Al cerrar una feature, la skill `aviso-cierre` hoy solo dice qué se cierra. Con este cambio dirá además qué queda por hacer: por ejemplo, con un roadmap de ejemplo, si cierras la 0010, el aviso añade «Queda pendiente: 0011 Anular reservas de otros, 0008 Avisos por correo antes de la reserva, 0004 Exportar reservas a calendario (.ics)»; si no queda nada, dice «No queda nada pendiente». Por dentro es una frase más en el paso 1 de `skills/aviso-cierre/SKILL.md`, y una batería de sujetos que comprueba que el modelo la cumple.

Validación: dev-lead — es el texto de una skill que lee un agente; no hay delegación que nombre `agente`, y la lectura de «pendiente» (decisión 1) es suya.

## Capacidades

- Ninguna, porque herramientas (edición de una skill; el proyecto no tiene `capabilities/`: `sdd capability index` → «Sin capacidades»).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: ninguna de la rúbrica (sin capacidad nueva, sin contrato público, sin `MODIFIED`, sin datos, sin dependencia) · tamaño: ~25 líneas en 3 ficheros
- Revisor único (sonnet), lente de dominio y técnica juntas: si «pendiente» queda dicho sin ambigüedad en el paso 1, si el THEN de c4 («No queda nada pendiente») no contradice a c3, y si la previsión de coste cuadra con `scripts/plan.mjs` (señal: ninguna; lo motivan el valor de la decisión 1 y el artículo 5 de la constitution)
- Mínimo razonable: sin review — deja sin mirar el hueco entre la frase del paso 1 y los THEN de c3 y c4, que es donde falla un sujeto sin que cambie el texto

1. **«Pendiente» = las filas de `ROADMAP.md` que no están ✅ y no son la que se cierra**, de las tres secciones (Now, Next, Later). La entrevista dijo «qué queda pendiente» sin decir de qué; tomo el roadmap porque es lo que el dev-lead mira al cerrar. Alternativa descartada: lo pendiente de la propia feature (tasks sin hacer, validación diferida), que al cerrar siempre está vacío. **Si querías otra lectura, esta es la decisión a cambiar.**
2. **Texto de la frase** en el paso 1: «1. Di qué se cierra y qué queda pendiente: las filas de `ROADMAP.md` que no están ✅, salvo la que se cierra, en el orden del roadmap, como «Queda pendiente: <id> <título>, <id> <título>» y nada más tras la lista; si no hay ninguna, «No queda nada pendiente».» La fila que se cierra es la del id de la rama `feature/<id>` o el que diga quien cierra. Un solo paso: el dev-lead dijo el paso 1, así que no se renumera el 2.
3. **Literal de salida**: «Queda pendiente: <id> <título>, <id> <título>…» (el prefijo literal y nada más tras la lista) y, vacío, «No queda nada pendiente». Nadie lo dijo; lo he fijado para que la batería tenga un THEN observable.
4. **Orden**: el del roadmap (Now, Next, Later, de arriba abajo); va dicho en la frase.
5. **Por qué lo quiere el dev-lead** no se dijo (la entrevista no lo recoge): supongo que ver, al cerrar, qué sigue sin abrir el roadmap. Pendiente: se resuelve con tu respuesta al aprobar.
6. **Enfoque**: frase en el paso 1 con su fuente y su caso vacío, frente a «solo `y qué queda pendiente`» y frente a un fichero de referencia (ver Approach).
7. **Batería**: dos filas nuevas, `c3` (cierre con pendientes) y `c4` (cierre sin pendientes), `n = 2`, `sonnet`, en `tests/batteries/aviso-cierre/battery.md`; `c1` y `c2` quedan como controles.
8. **«No ✅» incluye los demás estados del roadmap** (⏳, 🔄, ⏸️, 🧪): todo lo que no está cerrado cuenta como pendiente. La spec depende del formato actual de `ROADMAP.md` (tres secciones Now, Next y Later, marcador ✅, filas con id y título): si cambia, cambia esta spec.
9. **Fixture de roadmap dentro de la batería**: c3 y c4 llevan su propio `ROADMAP.md` de ejemplo en la fila, para no depender del roadmap vivo; criterio de paso: 2 de 2 sujetos por fila. En RED, c3 y c4 fallan porque no aparece «Queda pendiente:» (c3) ni «No queda nada pendiente» (c4).
10. **Previsión de coste**: 14 sujetos, 9,80 $ en total; las filas de abajo. Minutos: `sin medir` (`scripts/plan.mjs` no los da); el plan los declara antes del primer sujeto, como pide el art. 5.
- Política de modelos: revisor de la spec en sonnet, uno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica (sin código de producto) · sujetos de la batería en sonnet, por tandas de 2 y 4 (RED, GREEN, REFACTOR, controles, medición) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico: la frase no excluía la fila que se cierra → «salvo la que se cierra» en la frase y cómo se identifica (decisión 2).
- **Aceptado** — Crítico: los THEN de c3 y c4 dependían del roadmap vivo → fixture dentro de la fila (decisión 9 y «Dónde se prueba»).
- **Aceptado** — Importante: sin criterio de paso → 2 de 2 y observable de RED (decisión 9, Intent).
- **Aceptado** — Importante: c3 no exigía el literal ni cerraba el invento de filas → prefijo literal «y nada más» y «no añade otra fila» (decisión 3, c3).
- **Aceptado** — Importante: formato de `ROADMAP.md` y otros estados → decisión 8.
- **Rechazado** — Importante: decisión 5 abierta y «dev-lead» frente a PRODUCT.md → la suposición queda como ✋ pendiente a propósito (el motivo no se dijo y no lo invento); «dev-lead» es el rol del kit que aprueba, aquí la misma persona que desarrolla.
- **Aceptado** — Menor: orden → «en el orden del roadmap» en la frase. **Aceptado** — Menor: esquema de lentes → un revisor. **Aceptado** — Menor: los grep excluyen `changes/`.
- Segunda ronda (sin Críticos; no hay tercera): **Aceptado** — Importante: el literal «Queda pendiente:» no estaba en la frase → entra en el paso 1 (decisión 2); fixture completo con secciones, orden y una fila 🧪 que ejercita la decisión 8; ❌ fuera (no es un estado del roadmap); THEN de c1 y c2 escrito; la 0010 «no aparece tras “Queda pendiente:”»; el 🦆 dice que es un ejemplo; una línea sobre cómo corre la batería respecto a `node --test`. **Aceptado** — Importante: minutos → `sin medir`, el plan los declara (decisión 10). **Rechazado** — Menor: título «Anular reservas de otros» frente a PRODUCT.md → es el título real de la fila 0011 del roadmap, no un ejemplo inventado. **Rechazado** — Menor: bloquear la aprobación por la decisión 5 → va marcada en ✋ y se contesta al aprobar.
- **Rechazado** — Menor: c1 y c2 en RED → pasan hoy por definición (son el comportamiento actual); los controles tras el cambio miden si lo rompen, y correrlos antes costaría 1,40 $ más sin cambiar ninguna decisión. La descripción del frontmatter se confirmó cierta y no se toca.

### Decisiones tomadas con el dev-lead

- Esta spec nace con la entrevista ya hecha — «La entrevista ya está hecha; decidido con el dev-lead: el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente.»

## Intent

Hoy el paso 1 de `aviso-cierre` dice «Di qué se cierra.» y nada más: quien cierra una feature no ve qué sigue sin abrir `ROADMAP.md`. El cambio es que el mismo paso 1 diga también qué queda pendiente. Éxito: en la batería, al cerrar una feature, 2 de 2 sujetos enumeran lo pendiente del roadmap (c3) o dicen que no queda nada (c4), y los controles c1 y c2 siguen como están. Anti-objetivo: que el aviso invente pendientes, o los saque de otro sitio que no sea `ROADMAP.md`, aunque «técnicamente diga algo».

## Scope

- Entra: la frase del paso 1 de `skills/aviso-cierre/SKILL.md` (decisión 2).
- Entra: las filas `c3` y `c4` en `tests/batteries/aviso-cierre/battery.md`, con su fixture de roadmap y su criterio (decisiones 7 y 9).
- No entra: el paso 2 («Corre el gate.»), renumerar pasos, ficheros de referencia, la descripción del frontmatter («Usar al cerrar una feature.» sigue siendo cierta), `operations.md`, el roadmap (no hay fila 0016).
- No entra: contar como pendiente lo de la propia feature (decisión 1).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Línea `1. Di qué se cierra.` | `skills/aviso-cierre/SKILL.md:8` (único hit de `git grep "qué se cierra"` fuera de `specs/` y `changes/`) | Scope: se sustituye por la frase de la decisión 2 |

- Filas que implementa: 0016 no tiene fila → ningún fichero la nombra: comprobado con `git grep -n 0016 -- . ':!.docs/sdd/specs' ':!.docs/sdd/changes'` (sin hits).

## Approach

- **A. Frase en el paso 1 con su fuente (`ROADMAP.md`, filas no ✅) y su caso vacío** — dos líneas de texto; el sujeto tiene un THEN comprobable en ambos casos; no renumera.
- **B. Solo «y qué queda pendiente»** — una palabra más, pero «pendiente» queda a la interpretación del sujeto (roadmap, tasks, deuda): c3 pasaría o fallaría según de dónde lo saque, y no hay forma de decir cuál es el fallo.
- **C. Fichero de referencia con la definición de pendiente** — sobredimensionado para una frase; añade un fichero que leer en cada cierre (cuesta tokens por sujeto, ~0,70 $ ya).
- Elegido: **A** — es la única que fija la fuente y el caso vacío sin salir del paso 1, que es lo que decidió el dev-lead.

Texto del paso 1 resultante (ver decisión 2); el paso 2 queda igual.

## Dónde se prueba

- Cierra mostrando pendientes (c3): sujeto de la batería `aviso-cierre`, con este `ROADMAP.md` de ejemplo dentro de la fila — Now: `0010` Motivo al cancelar ⏳, `0011` Anular reservas de otros ⏳, `0008` Avisos por correo antes de la reserva ⏳, `0007` La cancelación borraba reservas de otro día ✅; Next: `0012` Informe mensual de uso 🧪; Later: `0004` Exportar reservas a calendario (.ics) ⏳ — y se cierra la 0010 → el aviso contiene «Queda pendiente: 0011 Anular reservas de otros, 0008 Avisos por correo antes de la reserva, 0012 Informe mensual de uso, 0004 Exportar reservas a calendario (.ics)», en ese orden; la 0010 y la 0007 no aparecen tras «Queda pendiente:» y no se añade otra fila.
- Cierra sin pendientes (c4): `ROADMAP.md` de ejemplo con la 0010 ⏳ (la que se cierra) y la 0007 ✅ como únicas filas → el aviso dice «No queda nada pendiente» y no contiene «Queda pendiente:».
- Lo que ya hacía (c1, c2): controles; el THEN es que el aviso sigue diciendo qué se cierra y la sesión sigue corriendo el gate, sin inventar pendientes que su contexto no tenga.
- La batería se corre con sujetos (`operations.md`), no entra en `node --test`; el gate de cierre sigue siendo `node --test && node scripts/lint.mjs`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

_Sin delta: la spec no toca capacidades (ver «Capacidades»)._

## Previsión de coste

Constitución, art. 5: previsión declarada antes del primer sujeto; si la prueba la supera, una tanda de REFACTOR incluida, se para y decide el dev-lead. `c3` y `c4` son filas nuevas: la previsión se midió sobre una copia de la batería con ellas añadidas.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c3 c4" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| GREEN | `SCENARIOS="c3 c4" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2,80 |
| Una tanda de REFACTOR | `SCENARIOS="c3 c4" N=1 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| Controles | `SCENARIOS="c1 c2" N=1 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| Medición tras la revisión final | `SCENARIOS="c3 c4" N=1 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| Suma | 14 sujetos | 9,80 |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
