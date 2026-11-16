---
id: 20261102-150308-feature-0028-close-notice-pending
feature: 0028
title: El aviso de cierre dice qué queda pendiente
mode: full
status: draft
created: 2026-11-02
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice qué queda pendiente

🦆 Hoy, al cerrar una feature, el aviso solo dice qué se cierra. Con esta spec dirá también qué filas del roadmap siguen abiertas: al cerrar la 0010 diría «Se cierra: 0010 Motivo al cancelar. Queda pendiente: 0011 Anular reservas de otros; 1 Avisos por correo antes de la reserva». Cambia una sola frase del paso 1 de la skill `aviso-cierre` y se prueba con sujetos, RED primero, porque la constitution no deja editar una skill sin esa prueba.

Validación: agente — la skill la lee un agente y lo que cambia lo miden los sujetos de la batería; ninguna persona vería nada más. *(Es decisión mía: ✋ 1.)*

## Capacidades

- Ninguna, porque herramientas: una skill del kit del proyecto, no comportamiento de `salas`. `capabilities/` no existe (`sdd capability index` → «Sin capacidades»).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: ninguna de las ocho (sin capacidad, sin contrato, sin `MODIFIED`, sin datos, sin dependencia, sin rol; leí la skill y el ticket enteros) · tamaño: ~3 líneas en 1 fichero (`skills/aviso-cierre/SKILL.md`)
- Mínimo razonable: ninguna — no deja nada sin cubrir que un revisor pudiera mirar en una frase de una línea.

1. **Validación `agente`**, no `dev-lead` — el paso 1 de la skill lo lee un agente y los sujetos miden su salida. Si quieres verlo tú, cámbialo.
2. **«Pendiente» = las filas del roadmap con estado ⏳**, menos la que se cierra. El ticket dice «quedaba una fila abierta» sin decir cuál cuenta: elijo el estado ⏳ de la tabla «Próximo». Quedan fuera el Backlog (ideas sin compromiso) y la Deuda técnica.
3. **Texto del aviso**: una línea nueva tras la de qué se cierra, `Queda pendiente: <id> <ítem>; <id> <ítem>`, con el id y el título de cada fila tal como están en el roadmap, en el orden del roadmap. Sin filas pendientes: `No queda nada pendiente en el roadmap.` — que diga que no queda nada también es información, y evita que el silencio parezca un olvido.
4. **Redacción del paso 1**: `1. Di qué se cierra y qué queda pendiente: las filas ⏳ del roadmap, menos la que cierras.` Los pasos 2 en adelante no cambian.
5. **Batería**: se reutilizan `c1` y `c2` de `tests/batteries/aviso-cierre/battery.md` (n = 2 cada una, Sonnet, 4 sujetos). **No he leído sus fixtures**: el RED solo vale si en `c1` queda al menos una fila ⏳ y en `c2` ninguna; si no, hay que ajustarlas antes del RED y la previsión de coste no cambia.
6. **Previsión de coste**: 0,70 $ por sujeto (`tech-stack.md`), no los 0,31 $ del patch 0006, porque es el precio declarado del proyecto; el total sale de ahí. «Controles» a cero, porque la batería no declara controles.
7. **Tope de coste** (Art. 5): si la prueba supera los 11,20 $ de la previsión, una tanda de REFACTOR incluida, se para y decide el dev-lead.
8. **Sin tabla de topes de palabras**: el proyecto no tiene ningún test que limite las palabras de la skill (`test/` solo trae `app.test.js` y `cancel.test.js`).
9. **Sin delta ni fusión que probar**: no hay capacidad, así que `sdd capability merge` no tiene qué fusionar.
- Política de modelos: revisores de la spec — ninguno · ejes de la revisión final — Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos — Sonnet (`tech-stack.md`), por tandas (RED, GREEN, REFACTOR) · en paralelo hasta `control.maxParallelAgents` (no declarado en `sdd-kit.json`: el valor por defecto del kit) — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario.

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente, por el ticket de campo .docs/sdd/field-reports/20260914-aviso.md §1»
- El RED aún no se ha medido — «el RED aún no se ha medido»

## Intent

Al cerrar la 0005, el aviso dijo qué se cerraba y la persona no supo que quedaba una fila abierta; costó una parada del dev-lead (ticket `20260914-aviso.md` §1). Queremos que el aviso diga también qué sigue abierto. Éxito, medible: en los sujetos de `c1`, con una fila ⏳ abierta, el aviso la nombra con su id y su título en el 100 % de las ejecuciones; en `c2`, sin ninguna, dice que no queda nada. Fracasaría aunque técnicamente funcione si el aviso lista como pendiente algo que no es ⏳ (el Backlog, la deuda) o si se calla cuando no queda nada.

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md` (✋ 4); la prueba con sujetos de esa edición, RED antes que GREEN.
- No entra: el paso 2 (correr el gate) ni el `description` de la skill; el contenido del roadmap; qué hace `sdd-archive` con las filas al cerrar; avisar de la Deuda técnica o del Backlog.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Paso 1: «Di qué se cierra.» pasa a decir también qué queda pendiente | `skills/aviso-cierre/SKILL.md:8` | Scope y ✋ 4 |
| Nombre `aviso-cierre` y el aviso | `tests/batteries/aviso-cierre/battery.md:1`, `.docs/sdd/tech-stack.md:6`, `.docs/sdd/specs/20260915-090000-patch-0006-aviso/patch.md:3` | Sin cambio: nombran la skill o su coste, no el texto del paso 1 (✋ 5 y 6 las usan) |

- Filas que implementa: 0028 → nada: no tiene fila en `.docs/sdd/roadmap.md`; comprobado con `grep -rn "0028" . --exclude-dir=.git` (cero resultados) y `grep -rn -i "aviso-cierre\|qué se cierra\|queda pendiente\|aviso de cierre"` (solo los sitios de la tabla y el ticket).

## Approach

Una frase más en el paso 1 de la skill. El detalle (qué se lee del roadmap, el formato de la línea) lo fija ✋ 2 y 3; cómo se redacta para que un sujeto lo cumpla lo decide el RED: si los sujetos ya lo hacen sin la frase nueva, se vuelve aquí antes de escribir nada.

## Dónde se prueba

- Aviso con una fila ⏳ abierta: sujetos de `c1`, la skill ejecutada de punta a punta en la costura más alta, como el patch 0006; se lee el mensaje que emiten.
- Aviso sin filas pendientes: sujetos de `c2`, igual.
- El gate de cierre (`node --test && node scripts/lint.mjs`) no cambia y corre entero al cerrar.

## Términos y ADR

- Términos resueltos: pendiente — fila del roadmap con estado ⏳ distinta de la que se cierra (✋ 2)
- ADR candidatas: ninguna

## Previsión de coste

Precio: 0,70 $ por sujeto de `aviso-cierre` (`tech-stack.md`). Batería: `tests/batteries/aviso-cierre/battery.md`, `c1` (n=2) + `c2` (n=2) = 4 sujetos por tanda.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 4 (`c1`, `c2`) | 2,80 |
| GREEN | 4 (`c1`, `c2`) | 2,80 |
| Una tanda de REFACTOR | 4 (`c1`, `c2`) | 2,80 |
| Controles | 0 — la batería no declara controles | 0,00 |
| Medición tras la revisión final | 4 (`c1`, `c2`) | 2,80 |
| Suma | 16 sujetos | 11,20 |

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
