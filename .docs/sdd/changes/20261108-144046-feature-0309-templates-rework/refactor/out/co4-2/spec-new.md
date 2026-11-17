---
id: 20261109-085926-feature-0016-close-notice
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

🦆 Hoy, al cerrar una feature, el agente solo dice qué se cierra. Con el cambio dirá además qué queda por hacer: al cerrar la 0016 con la 0010, la 0011 y la 1 sin hacer, el aviso será «Se cierra: aviso de cierre. Queda pendiente: 0010 Motivo al cancelar · 0011 Anular reservas de otros · 1 Avisos por correo antes de la reserva». Con el roadmap vacío dirá que no queda nada pendiente. Se consigue ampliando el paso 1 de `skills/aviso-cierre/SKILL.md`.

Validación: agente — es el texto de una skill y lo que cambia lo miden sujetos (batería `aviso-cierre`); ninguna persona observaría nada que esa medida no vea.

## Capacidades

- Ninguna, porque herramientas

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor — señales: ninguna de la tabla (sin capacidad nueva, sin contrato público, sin MODIFIED, sin datos) · tamaño: ~10 líneas en 3 ficheros
- Único (sonnet): si el literal nuevo del paso 1 dice de dónde sale «pendiente» sin ambigüedad (decisión 1) y si c3 distingue cerrar con filas ⏳ de cerrar sin ellas (señal: tamaño pequeño)
- Mínimo razonable: este mismo — deja sin cubrir nada que un segundo lente viera con otro ángulo
```

1. **«Pendiente» = solo las filas con ⏳ de «Próximo» en `.docs/sdd/roadmap.md`** — el dev-lead dijo «qué queda pendiente» sin decir de dónde sale. Hoy serían la 0010, la 0011 y la 1.
2. **No cuentan** «Backlog» ni «Deuda técnica»: son ideas y deuda, no trabajo planificado.
3. **La fila de la feature que se cierra, si aún figura en «Próximo», no se lista como pendiente** — se cierra en este momento.
4. **Literal del paso 1**: «Di qué se cierra y qué queda pendiente: las filas con ⏳ de «Próximo» en `roadmap.md`, salvo la de lo que se cierra, con su id y su título (el texto en negrita de la celda, o la celda entera si no lleva negrita); si no hay ninguna, di que no queda nada pendiente.»
5. **El paso 2 («Corre el gate.») no cambia.**
6. **Escenario nuevo c3 en la batería** (paso `cierre`, n=2, Sonnet), con un roadmap propio fijo (no el real, que cambia): «Próximo» con tres filas ⏳ (0010, 0011, 1) y la de lo que se cierra, más una fila de «Backlog» y una de «Deuda técnica» que NO deben salir; el criterio es exactamente esas tres. Los c1 y c2 existentes quedan como control.
7. **Enfoque**: A, ampliar el paso 1, frente a B (paso nuevo entre 1 y 2) y C (script que lee el roadmap) — ver Approach.
8. **Sin tabla de topes de palabras**: el proyecto no tiene ningún test que limite las de `SKILL.md`.
9. **Previsión de coste: 7,70 $ en 11 sujetos**, según la tabla de abajo; la constitución (art. 5) obliga a parar si la prueba la supera.
10. **Repaso de coherencia hecho**: `sdd capability merge --path <copia de .docs/sdd> --artifact spec.md` sobre una copia → «Sin delta que fusionar»; `git grep` de `0016` y `close-notice` fuera de las specs, sin resultados.

### Hallazgos de la review

- **Aceptado** — c1/c2 sin criterio de control → criterio y N=1 dichos en Intent
- **Aceptado** — c3 sin roadmap fijo → decisión 6: roadmap propio de la batería
- **Aceptado** — la fila propia no se comprueba → entra en el literal (decisión 4) y c3 la incluye
- **Aceptado** — backlog/inventadas sin medir → c3 con filas de Backlog y Deuda y «exactamente tres»
- **Aceptado** — título y estados sin decidir → decisiones 1 y 4: negrita o celda, solo ⏳
- **Aceptado** — faltan minutos (art. 5) → línea de minutos y tope, `sin medir`
- **Aceptado** — números de línea que caducan y `tech-stack.md` sin cerrar → quitados; `tech-stack.md` en «No entra»
- **Rechazado** — comando de merge incompleto → ya citado en la 10; la sección de retiradas se verificó con `git grep`, no solo de lectura
- **Rechazado** — aprobador sin nombrar → lo nombra el gate; el «dev-lead» es quien usa el kit en este proyecto, un solo usuario (misión)

- Política de modelos (solo en `delegate`): un revisor de la spec en Sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos en Sonnet, por tandas · en paralelo hasta `control.maxParallelAgents`

## Intent

Hoy el aviso de cierre (`skills/aviso-cierre/SKILL.md`, paso 1) solo dice qué se cierra: quien cierra no ve qué sigue pendiente sin abrir el roadmap. Se quiere que el mismo aviso lo diga. Éxito: en 2 de 2 sujetos de c3 el aviso nombra exactamente las tres filas ⏳ con id y título y ninguna más, y en c1 y c2 (1 sujeto cada uno basta: son controles, no medida) el aviso sigue diciendo qué se cierra, sin lista inventada, y corre el gate. Fracaso aunque «funcione»: que el aviso invente filas o liste el backlog como pendiente.

## Scope

- Entra: ampliar el paso 1 de `skills/aviso-cierre/SKILL.md` con el literal de la decisión 4; el escenario c3 en `tests/batteries/aviso-cierre/battery.md`; su RED y su GREEN con sujetos.
- No entra: tocar el paso 2 o `tech-stack.md`; leer «Backlog» o «Deuda técnica»; un script o un comando nuevos; cambiar el roadmap.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal «Di qué se cierra.» (paso 1) | `skills/aviso-cierre/SKILL.md`, paso 1 | Scope, decisión 4 |
| Nombre de la batería `aviso-cierre` (se le añade c3) | `tests/batteries/aviso-cierre/battery.md`, `.docs/sdd/tech-stack.md` | Scope: el nombre no cambia, solo crece; `tech-stack.md` no se toca |

- Filas que implementa: nada: comprobado con `git grep -nE "0016|close-notice" -- . ':!.docs/sdd/specs'`, sin la 0016 en el roadmap.

## Approach

- A. Ampliar el paso 1 — un literal más largo, ningún paso nuevo; el agente ya lee el roadmap al cerrar.
- B. Paso nuevo entre 1 y 2 — separa los dos avisos, pero renumera y alarga una skill de dos pasos.
- C. Script que lista las filas ⏳ — salida exacta, pero añade código a un proyecto «sin dependencias» y fuera de lo pedido.
- Elegido: A — lo fijó el dev-lead: «el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente».

## Dónde se prueba

- Aviso con pendientes: sujetos de la batería `aviso-cierre`, escenario c3, como c1 y c2 actuales (un sujeto cierra una feature entera).
- Aviso sin cambios: c1 y c2 como control.

## Términos y ADR

- Términos resueltos: pendiente — fila con ⏳ de «Próximo» en `roadmap.md`
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: no cambia comportamiento observable del producto (Capacidades: «Ninguna, porque herramientas»).

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="c3" N=2` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| GREEN | `SCENARIOS="c3" N=2` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| Una tanda de REFACTOR | `SCENARIOS="c3" N=2` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| Controles | `SCENARIOS="c1 c2" N=1` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1,40 |
| Medición tras la revisión final | `SCENARIOS="c1 c2 c3" N=1` → `suma: 3 sujetos · coste previsto: 2.10 $` | 2,10 |
| Suma | 11 sujetos | 7,70 |

Minutos: ~22 (11 sujetos × ~2 min, `sin medir`: la batería no registra tiempos). Tope que provoca la parada (constitución, art. 5): 7,70 $ o 22 min.

> Medido con `scripts/plan.mjs` sobre una copia de la batería con c3 añadida (la batería del repo aún no la tiene).

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
