---
id: 20261008-150000-feature-0030-retire-close-notice
feature: 0030
title: Retirar la skill aviso-cierre
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Retirar la skill aviso-cierre

🦆 Hoy, al cerrar una feature, salen dos mensajes: el de `aviso-cierre` («di qué se cierra» y «corre el gate») y el de `resumen-cierre` (commits y filas del roadmap). Con este cambio sale uno solo: `resumen-cierre` cuenta los commits, lista las filas, dice qué se cierra y corre el gate; `aviso-cierre` desaparece. Lo único delicado es el gate: si lo borráramos con la skill, nadie lo correría, así que se muda a `resumen-cierre`.

Validación: dev-lead — es lo que ve quien cierra una feature (el mensaje de cierre y el gate en rojo), y el gate en rojo y «no se repite al retomar» solo se observan con un cierre real.

## Capacidades

- Modificadas: `closing` — el aviso de cierre lo da `resumen-cierre`, no `aviso-cierre`, y el resumen pasa a tener cuatro pasos.
- Modificadas: `quality-gate` — el gate corre en el paso 4 de `resumen-cierre`, no en el paso 2 de `aviso-cierre`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores (dominio opus, técnica sonnet) — señales: MODIFIED (cuatro requisitos de dos capacidades), dos capacidades · tamaño: ~40 líneas en 4 ficheros
- Dominio (opus): si el gate en el paso 4 contradice «El resumen va al final» y qué pasa con lo ya anunciado si el gate falla (señal: MODIFIED)
- Técnica (sonnet): si los THEN del gate y de `closing` se pueden comprobar con lo que dice «Dónde se prueba» (señal: MODIFIED)
- Mínimo razonable: un solo revisor técnico — deja sin mirar la contradicción de orden entre `quality-gate` y `closing`

1. `resumen-cierre` gana un paso 3: «Di qué se cierra.» (el literal de hoy en `aviso-cierre`).
2. **El gate no se pierde: pasa a ser el paso 4 de `resumen-cierre`: «Corre el gate de cierre (`operations.md`); si falla, para, di qué test falló y no des la feature por cerrada.»** Hoy lo corre el paso 2 de `aviso-cierre` y `quality-gate` lo exige («El gate corre una sola vez», «Un gate en rojo para el cierre»); retirar la skill sin darle casa lo dejaría sin quien lo corra. Alternativa descartada: dejar que solo lo corra el cierre del kit (`sdd-archive`), que cambia lo que `quality-gate` promete y nadie lo ha pedido. **Orden, decidido por mí**: el gate va tras los pasos 1 a 3 porque los pasos 1 y 2 de `resumen-cierre` siguen igual. Coste: con el gate en rojo, el resumen ya ha salido; por eso el delta dice que la feature no se da por cerrada. Alternativa: el gate primero, que obliga a renumerar los pasos 1 y 2; dímelo y lo reordeno.
3. Enfoque: A (ampliar `resumen-cierre` con dos pasos al final), frente a B (dejar `aviso-cierre` como única) y C (dejar las dos): ver Approach.
4. «El resumen va al final» pasa a `MODIFIED`: describe los cuatro pasos y su GIVEN pasa de «una feature cerrada» a «un cierre en marcha», para que el gate pueda parar.
5. La `description` de `resumen-cierre` («Usar al acabar el cierre de una feature.») no cambia: cambiarla movería el momento en que corre. Con ello, quien disparaba `aviso-cierre` al cerrar pasa a disparar `resumen-cierre` al acabar el cierre; si prefieres el disparo «al cerrar», dímelo.
6. `quality-gate` pasa a nombrar la skill y el paso («el paso 4 de `resumen-cierre`»): hoy dice «el paso 2» sin skill, y con dos skills de cierre sería ambiguo. Acepto el acoplamiento al número, como el resto de `closing.md`.
7. `sin medir`: que el gate «no se repite aunque el cierre se retome» y que «para» con un test en rojo son comportamientos de un texto de skill, sin mecanismo que los fuerce hoy ni tras el cambio; este cambio los mueve de sitio y no los garantiza. Se comprueban en la validación con un cierre real.
- Política de modelos: revisores de la spec — dominio opus, técnica sonnet, en paralelo; segunda ronda, un revisor sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico (dominio): el gate tras un resumen de feature «cerrada» se contradice → `MODIFIED` de «El resumen va al final» con GIVEN «un cierre en marcha» y orden explícito (decisiones 2 y 4).
- **Aceptado** — Importante (dominio): con el gate en rojo ya se ha dicho qué se cierra → AND en el delta: la feature no se da por cerrada.
- **Aceptado** — Crítico (técnica): THEN del gate sin prueba observable → decisión 7, `sin medir`, y el paso 4 lleva la condición explícita.
- **Aceptado** — Importante: faltaba el `MODIFIED` de «El resumen va al final» → decisión 4.
- **Aceptado** — Importante: invocaciones y ficheros de `aviso-cierre` → comprobado: la carpeta solo tiene `SKILL.md` y `git grep` no halla ninguna invocación (tabla).
- **Aceptado** — Menor: sacar «no existe la skill» del delta de `closing` → pasa a «Dónde se prueba»; el comando del gate → se nombra el gate de cierre de `operations.md`.
- **Rechazado** — Menor (técnica): citar el paso por su efecto y no por número → decisión 6, se acepta el acoplamiento.
- **Rechazado** — Menor (dominio): «Laura» y «dev-lead» frente a `PRODUCT.md` → vienen del molde del proyecto; no los toco sin que lo pidas.

### Hallazgos de la segunda ronda (sin Críticos)

- **Aceptado** — Importante: el AND «no se da por cerrada» no estaba en el literal del paso 4 → ya va en el Scope y en el Approach.
- **Aceptado** — Importante: cambiar la `description` movía el disparo → no se cambia (decisión 5).
- **Aceptado** — Importante: la comprobación `git grep` fallaba por `ROADMAP.md:9` → se excluye en «Dónde se prueba».
- **Rechazado** — Importante: gate antes del aviso → es la alternativa de la decisión 2, que queda a tu elección; mantengo el orden porque los pasos 1 y 2 no se tocan.
- **Rechazado** — Importante: «una sola vez» sin mecanismo y relación con `sdd-archive` → el requisito no cambia de comportamiento, solo de sitio (decisión 7, `sin medir`); `sdd-archive` no está en este repositorio y no se toca.
- **Rechazado** — Menor: `operations.md` frente a la constitución → `operations.md` es el comando del gate de cierre del proyecto y la constitución lo remite ahí.
- **Rechazado** — Menor: «Laura» y la ruta de `PRODUCT.md` → está en la raíz y es una sola persona; los nombres del frontmatter son del molde.

### Decisiones tomadas con el dev-lead

- Retirar `aviso-cierre` y que el aviso de cierre lo dé `resumen-cierre` — fila 0030 del roadmap.

## Intent

Al cerrar una feature se lanzan dos skills de cierre, `aviso-cierre` y `resumen-cierre`, y quien cierra recibe dos mensajes. Quiere uno solo. Éxito: no existe `skills/aviso-cierre/`, y `resumen-cierre` dice lo que se cierra y corre el gate, con los pasos 1 y 2 como hoy. Fracaso aunque «funcione»: que el gate de cierre deje de correr porque vivía en la skill retirada.

## Scope

- Entra: se retira `skills/aviso-cierre/` entera (solo contiene `SKILL.md`); `skills/resumen-cierre/SKILL.md` añade el paso 3 «Di qué se cierra.» y el paso 4 «Corre el gate de cierre (`operations.md`); si falla, para, di qué test falló y no des la feature por cerrada.»; `.docs/sdd/capabilities/closing.md` y `.docs/sdd/capabilities/quality-gate.md` se actualizan por el delta al cerrar.
- No entra: cambiar `aviso-apertura` ni «La apertura avisa de la rama»; los pasos 1 y 2 de `resumen-cierre`; el comando del gate (`operations.md`).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` (nombre y carpeta) | `skills/aviso-cierre/SKILL.md:2,6` | Scope: se borra la carpeta |
| «Di qué se cierra.» (paso 1 de `aviso-cierre`) | `skills/aviso-cierre/SKILL.md:8` | Scope y decisión 1: pasa a ser el paso 3 de `resumen-cierre` |
| «Corre el gate.» (paso 2 de `aviso-cierre`) | `skills/aviso-cierre/SKILL.md:9` | Scope y decisión 2: pasa a ser el paso 4 de `resumen-cierre` |
| `description` «Usar al cerrar una feature.» | `skills/aviso-cierre/SKILL.md:3` | se va con la carpeta; `resumen-cierre` conserva la suya (decisión 5) |
| `aviso-cierre` como quien dice qué se cierra | `.docs/sdd/capabilities/closing.md:13` | delta, `MODIFIED` de «Quien cierra sabe qué se cierra» |
| «El resumen va al final» (GIVEN «una feature cerrada», solo dos pasos) | `.docs/sdd/capabilities/closing.md:22-27` | delta, `MODIFIED` (decisión 4) |
| «paso 2 de `aviso-apertura`» | `.docs/sdd/capabilities/closing.md:18` | se queda: es de `aviso-apertura` |
| «el paso 2» del gate, sin skill | `.docs/sdd/capabilities/quality-gate.md:18` | delta, `MODIFIED` de «El gate corre una sola vez» (decisión 6) |
| «el paso 2» del gate, sin skill | `.docs/sdd/capabilities/quality-gate.md:23` | delta, `MODIFIED` de «Un gate en rojo para el cierre» (decisión 6) |
| quien dispara `aviso-cierre` (hook, índice, manifiesto, test) | ninguno: `git grep -n aviso-cierre` solo da `closing.md:13`, `ROADMAP.md:9` y la propia skill | nada que retirar |

- Filas que implementa: 0030 → `ROADMAP.md:9` es su propia fila y se salda al cerrar; ningún otro fichero la nombra: comprobado con `git grep -n 0030 -- . ':!.docs/sdd/specs'`. `README.md`, `CHANGELOG.md` y `PRODUCT.md` no nombran `aviso-cierre`: comprobado con `git grep -niE "aviso-cierre|aviso de cierre"`.

## Approach

- A. Ampliar `resumen-cierre` con «Di qué se cierra.» y «Corre el gate…» como pasos 3 y 4 — cuesta dos líneas en una skill que ya existe; los pasos 1 y 2 no se tocan.
- B. Dejar `aviso-cierre` como única y retirar `resumen-cierre` — rompe el requisito «El resumen va al final» y la 0030 pide retirar `aviso-cierre`, no la otra.
- C. Dejar las dos skills — no resuelve el Intent: sigue habiendo dos mensajes.
- Elegido: A — es lo que pide la fila 0030 con el menor cambio.

`resumen-cierre` queda con cuatro pasos: 1 cuenta los commits, 2 lista las filas que salda, 3 dice qué se cierra, 4 corre el gate de cierre y, si falla, para y no da la feature por cerrada. Los pasos 3 y 4 son literales de skill: no hay mecanismo que obligue a ejecutarlos ni a no repetir el gate (decisión 7).

## Dónde se prueba

- el mensaje de cierre: leyendo la salida de `resumen-cierre`, como se prueba hoy.
- los pasos 3 y 4 y la `description`: leyendo `skills/resumen-cierre/SKILL.md`; que `skills/aviso-cierre/` ya no existe y que `git grep aviso-cierre -- . ':!.docs/sdd/specs' ':!ROADMAP.md'` no da nada (la fila 0030 de `ROADMAP.md` se salda al cerrar).
- el gate en rojo y que no se repite al retomar: con un cierre real en la validación (decisión 7, `sin medir`).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra (antes: "`aviso-cierre` dice qué se cierra")

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN el paso 3 de `resumen-cierre` dice qué se cierra

#### MODIFIED — El resumen va al final (antes: "GIVEN una feature cerrada")

- GIVEN un cierre en marcha
- WHEN corre `resumen-cierre`
- THEN el paso 1 cuenta los commits de la rama
- AND el paso 2 lista las filas del roadmap que salda
- AND el paso 3 dice qué se cierra
- AND el paso 4 corre el gate de cierre

### Capacidad: `quality-gate`

#### MODIFIED — El gate corre una sola vez (antes: "WHEN llega el paso 2")

- GIVEN un cierre en marcha
- WHEN llega el paso 4 de `resumen-cierre`
- THEN el gate corre una vez, y no se repite aunque el cierre se retome

#### MODIFIED — Un gate en rojo para el cierre (antes: "GIVEN el paso 2 con un test en rojo")

- GIVEN el paso 4 de `resumen-cierre` con un test en rojo
- WHEN acaba
- THEN el cierre para y dice qué test falló
- AND la feature no se da por cerrada

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
