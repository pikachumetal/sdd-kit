---
id: 20261102-151640-feature-0028-close-notice-pending
feature: 0028
title: El aviso de cierre dice también qué queda pendiente
mode: full
status: draft
created: 2026-11-02
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, `aviso-cierre` solo dice qué se cierra. Con esta spec, el paso 1 dice además qué queda abierto: al cerrar la 0005 con la fila 0006 aún sin hacer, el aviso añadiría «queda pendiente: 0006 (libres por franja)». Así la persona no se entera por casualidad de que sigue habiendo trabajo, y el dev-lead no tiene que parar a preguntarlo. Se cambia una línea de `skills/aviso-cierre/SKILL.md`, y antes de tocarla se mide con sujetos si el fallo ocurre de verdad.

Validación: agente — es una skill que solo lee el agente al cerrar; los sujetos de la batería miden lo que ve la persona (el texto del aviso) y un humano no observaría nada más. *(Propuesta mía, va a ✋.)*

## Capacidades

Ninguna, porque herramientas: es una skill del propio proyecto y `capabilities/` no existe (`sdd capability index` → «Sin capacidades»). No hay delta.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: 0 de 8 (sin capacidad, sin contrato público, sin `MODIFIED`/`REMOVED`, sin datos, sin dependencia; el área la he leído entera) · tamaño: ~1 línea en 1 fichero
- Mínimo razonable: es ya el mínimo; deja sin mirar solo si «pendiente» está bien definido (decisión 1), que es precisamente lo que valida el dev-lead aquí.

1. **Qué cuenta como «pendiente»**: las filas abiertas del roadmap que quedan tras este cierre y que cuelgan de lo que se cierra (la misma feature partida, `parent`), no todo «Próximo» — si no, el aviso listaría siempre 0010, 0011 y la 1 y no avisaría de nada. El ticket dice «una fila abierta» pero no cuál; esta es mi lectura.
2. **Si no queda nada**: el aviso lo dice («no queda nada pendiente»), en vez de callar. Sin esto no se distingue «nada pendiente» de «se me olvidó mirar».
3. **Redacción del paso 1** (literal propuesto): «1. Di qué se cierra y qué queda pendiente: las filas abiertas del roadmap que cuelgan de lo cerrado, o "no queda nada pendiente".» El paso 2 (`Corre el gate.`) no cambia.
4. **Validación `agente`** (línea de arriba): mía, la apruebas con la spec.
5. **Previsión de coste**: la tabla de abajo usa 0,70 $ por sujeto (`tech-stack.md`) y 4 sujetos por tanda (batería `aviso-cierre`: c1 ×2, c2 ×2). Los minutos (~6 por tanda con los sujetos en paralelo) son una estimación mía, sin medir.
6. **Sin id de fila**: la 0028 no tiene fila en `roadmap.md` (la rama ya la lleva, `sdd id claim`: «la 0028 vale»). No la añado: es planificación, de `sdd-roadmap`.
7. **Sin revisor de spec**: 0 señales, nivel «ninguna» (ver bloque de arriba).

- Política de modelos: revisores de la spec: ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería: Sonnet (`tech-stack.md`), por tandas de 4 · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — por el ticket de campo `.docs/sdd/field-reports/20260914-aviso.md` §1; «el RED aún no se ha medido». *(Paráfrasis de lo dicho al arrancar; sin frase literal más allá del encargo.)*

## Intent

Hoy el paso 1 de `aviso-cierre` dice «Di qué se cierra.». El ticket de campo (§1) cuenta que, al cerrar la 0005, el aviso dijo qué se cerraba y la persona no supo que quedaba una fila abierta; coste: una parada del dev-lead. Se quiere que el aviso diga también qué queda pendiente. Éxito: cerrando una feature con una fila abierta que cuelga de ella, el aviso la nombra sin que nadie pregunte; fracaso aunque «funcione»: que liste filas ajenas al cierre hasta ahogar el aviso, o que calle cuando no queda nada.

**El fallo no está medido.** Lo sabemos por un ticket, no por una batería: la causa (que la skill no lo pida) es hipótesis hasta que el RED la exhiba.

## Scope

- Entra: —
- Entra, si el RED lo exhibe: el paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente (decisiones 1–3).
- No entra: tocar el paso 2 (el gate); mirar otro roadmap que no sea el del proyecto; añadir la fila 0028 al roadmap; cualquier cambio de `src/`.
- Si el RED no exhibe el fallo (los sujetos ya avisan de lo pendiente sin que la skill lo pida), no se edita la skill: se para, se dice y decide el dev-lead.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Línea «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` | Scope (solo si el RED lo exhibe) · decisión 3 |
| Nombre de la skill `aviso-cierre` | `tests/batteries/aviso-cierre/battery.md:1`, `.docs/sdd/tech-stack.md:6`, `.docs/sdd/specs/20260915-090000-patch-0006-aviso/patch.md:3` | Sin cambio: nombran la skill, no su paso 1. La batería, si el RED lo pide, se amplía con un caso (a decidir en el plan) |

- Filas que implementa: 0028 (sin fila en el roadmap, ver decisión 6) → nada más la nombra: comprobado con `grep -rn "0028"` en el repo (solo el nombre de la rama).

## Approach

Test-first, como manda el Art. V de la constitución: (1) el RED mide con sujetos si, cerrando una feature con una fila abierta, el aviso actual calla lo pendiente; (2) si lo exhibe, se edita el paso 1 con la redacción de la decisión 3; (3) el GREEN repite la medida; (4) una tanda de REFACTOR si hace falta. Qué casos añade la batería y cómo se montan los sujetos lo fija el plan.

## Dónde se prueba

- Que el aviso nombre lo pendiente: con sujetos Sonnet sobre `skills/aviso-cierre`, como los casos c1/c2 de la batería actual (`tests/batteries/aviso-cierre/battery.md`), con un cierre que deja una fila abierta y otro que no deja ninguna.
- Que el gate siga corriendo (paso 2): lo cubren los mismos sujetos; el gate real, `node --test && node scripts/lint.mjs`, no cambia (no se toca `src/`).

## Términos y ADR

- Términos resueltos: pendiente — fila abierta del roadmap que cuelga de lo que se cierra (decisión 1)
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta (ver «Capacidades»).

## Previsión de coste

Declarada antes del primer sujeto (Art. V). Si la prueba la supera, una tanda de REFACTOR incluida, se para y decide el dev-lead. Precio: 0,70 $ por sujeto (`tech-stack.md`); batería `aviso-cierre`: c1 ×2 + c2 ×2 = 4 sujetos por tanda.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 4 (c1 ×2, c2 ×2) · ~6 min | 2,80 |
| GREEN | 4 (c1 ×2, c2 ×2) · ~6 min | 2,80 |
| Una tanda de REFACTOR | 4 (c1 ×2, c2 ×2) · ~6 min | 2,80 |
| Controles | 0 — no hay casos de control más allá de c1/c2 | 0,00 |
| Medición tras la revisión final | 0 — el edit es de una línea; la revisión final no mide con sujetos salvo que cambie la skill | 0,00 |
| Suma | 12 sujetos · ~18 min | 8,40 |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
