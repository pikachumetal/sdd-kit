---
id: 20261102-151244-feature-0028-close-notice-pending
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

🦆 Hoy, al cerrar una feature, el aviso solo dice qué se cierra: «Se cierra la 0005». Con este cambio dirá además qué sigue abierto: «Se cierra la 0005. Queda pendiente: 0010 Motivo al cancelar, 0011 Anular reservas de otros, 1 Avisos por correo antes de la reserva». Así quien cierra no tiene que preguntar si queda algo. Por dentro, es una frase más en el paso 1 de `skills/aviso-cierre/SKILL.md`, probada con sujetos antes y después, como pide la constitución.

Validación: agente — es el texto de una skill y lo único observable es lo que miden los sujetos de la batería; una persona no vería nada que el agente no haya medido ya.

## Capacidades

- Ninguna, porque herramientas (se edita una skill; el producto `salas` no cambia).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: ninguna (no hay capacidad ni delta, ni contrato público, ni datos, ni dependencia; he leído la skill, la batería, el ticket y el roadmap) · tamaño: ~3 líneas de skill y una fila de batería en 2 ficheros
- Mínimo razonable: ninguna revisión — deja sin cubrir solo la redacción exacta de la frase, que mide el GREEN con sujetos.

1. **Qué cuenta como «pendiente»**: las filas de «Próximo» del roadmap que siguen abiertas, con su id y su título, menos la que se cierra. No cuentan el Backlog ni la Deuda técnica. El ticket dice «una fila abierta» sin más; esto es mi lectura. Si la quieres más ancha (Backlog incluido), dímelo.
2. **Redacción del paso 1** (literal propuesto): `1. Di qué se cierra y qué queda pendiente: las filas abiertas de «Próximo» del roadmap, con su id y título.` Sustituye a `1. Di qué se cierra.`
3. **Sin filas abiertas**: el aviso dice `Queda pendiente: nada.` Nadie dijo qué debe decir; es mi texto.
4. **Escenario nuevo `c3` en la batería** de `aviso-cierre`: cierre con el roadmap de este proyecto (0010, 0011 y 1 abiertas), n = 2, Sonnet. Los `c1` y `c2` existentes no se tocan y corren como regresión en GREEN.
5. **Criterio de éxito de c3**: 2 de 2 sujetos nombran las tres filas abiertas en el aviso; lo que la haría fracasar aunque funcione: que listen también el Backlog (B1) o la Deuda.
6. **Validación `agente`** (arriba): propongo `agente` porque el resultado es un texto medido por sujetos. Si prefieres verlo tú, cámbialo a `dev-lead`.
7. **Previsión de coste (constitución, art. 5)**: la cifra sale de `tech-stack.md` (~0,70 $ por sujeto). El patch 0006 midió ~0,31 $ por sujeto con otro escenario; uso la mayor, que es la que está declarada. Los minutos son suposición mía: no hay ninguno medido en el proyecto. Si la prueba supera la previsión, se para y decide el dev-lead.
8. **Un solo carril, sin partir**: ~3 tasks previstas (RED de c3, edición + GREEN, REFACTOR si hace falta), una sola superficie.
- Política de modelos: sin revisores de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos en Sonnet, por tandas (RED → GREEN, nunca mezcladas) · en paralelo hasta `control.maxParallelAgents` (sin fijar en `sdd-kit.json`: lo que no nombra se confirma aparte)

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «por el ticket de campo `.docs/sdd/field-reports/20260914-aviso.md` §1» (entrevista ya hecha, dicha al arrancar).
- El RED aún no se ha medido — dicho al arrancar. La spec no da ninguna cifra de RED; la primera task lo mide.

## Intent

Hoy el paso 1 de `aviso-cierre` dice «Di qué se cierra.» y nada más. Al cerrar la 0005, el aviso dijo qué se cerraba y la persona no supo que quedaba una fila abierta: costó una parada del dev-lead (ticket de campo `20260914-aviso.md` §1). Se quiere que el aviso diga también qué queda pendiente. Éxito: en el escenario c3, los sujetos nombran las filas abiertas. Fracaso aunque funcione: que el aviso arrastre el Backlog y la Deuda y la lista deje de servir. El ticket es una sola ocurrencia de campo y el RED aún no se ha medido: la edición de la skill va después de medirlo (constitución, art. 5).

## Scope

- Entra: el paso 1 de `skills/aviso-cierre/SKILL.md`; el escenario `c3` en `tests/batteries/aviso-cierre/battery.md`.
- No entra: el paso 2 («Corre el gate»), el Backlog y la Deuda en el aviso, y cualquier otra skill. Ningún cambio en `src/` ni en `capabilities/`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal `1. Di qué se cierra.` | `skills/aviso-cierre/SKILL.md:8` (único sitio: `grep "Di qué se cierra"` en el repo) | Scope; decisión 2 |

- Filas que implementa: 0028 (la rama; el roadmap no tiene fila 0028) → ningún fichero la nombra más allá de la rama y esta spec | nada: comprobado con `grep -rn "0028"` fuera de `.git` y del propio ticket. Menciones de `aviso-cierre` (`tech-stack.md:5` precio por sujeto, `patch.md` del 0006, la batería) no cambian: ninguna cita el literal del paso 1.

## Approach

Una frase añadida al paso 1 (decisión 2), sin tocar el paso 2. Orden de trabajo, por la constitución: medir primero el RED de `c3` con sujetos sobre la skill actual; editar después; GREEN con `c1`, `c2` y `c3`; una tanda de REFACTOR solo si algún sujeto falla.

## Dónde se prueba

- Aviso con filas abiertas: batería `aviso-cierre`, escenario nuevo `c3`, con sujetos Sonnet que cierran una feature (como `c1` y `c2`).
- Regresión del cierre sin cambios: `c1` y `c2` existentes.
- Gate de cierre del proyecto: `node --test && node scripts/lint.mjs` (no toca `src/`; se corre igual).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: el cambio no toca comportamiento observable del producto (Capacidades: «Ninguna, porque herramientas»). `sdd capability merge` no se corre: no hay delta que probar y el proyecto no tiene `capabilities/`.

## Previsión de coste

Precio por sujeto: ~0,70 $ (`tech-stack.md`, «Sujetos»). Baterías: `c3` (n = 2) en RED; `c1`, `c2` y `c3` (n = 2 cada una, 6 sujetos) en las tandas siguientes.

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 2 (`c3`) | 1,40 |
| GREEN | 6 (`c1`, `c2`, `c3`) | 4,20 |
| Una tanda de REFACTOR | 6 (`c1`, `c2`, `c3`) | 4,20 |
| Controles | 0 — no se toca otra skill que pueda romperse | 0 |
| Medición tras la revisión final | 0 — solo si la revisión final edita la skill; entonces se para y decide el dev-lead | 0 |
| Suma | 14 sujetos | 9,80 |

Minutos (suposición, ver decisión 7): ~5 por tanda, ~15 en total. Si se supera 9,80 $, se para y decide el dev-lead.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
