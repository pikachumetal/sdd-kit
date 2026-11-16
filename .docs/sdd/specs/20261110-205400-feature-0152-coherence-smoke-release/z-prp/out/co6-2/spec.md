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

🦆 Hoy, al cerrar una feature, se lanzan dos skills: `aviso-cierre` (dice qué se cierra y corre el gate) y `resumen-cierre` (cuenta commits y lista filas del roadmap). Tras este cambio solo queda `resumen-cierre`, con cuatro pasos: 1 commits, 2 filas, 3 «qué se cierra», 4 el gate. Quien cierra `feature/0030` ve un único mensaje y el gate sigue corriendo una vez, ahora como paso 4.

Validación: dev-lead — lo que cambia es el mensaje que lee quien cierra una feature, y un humano lo observa.

## Capacidades

- Modificadas: `closing` — el aviso de «qué se cierra» lo da `resumen-cierre`.
- Modificadas: `quality-gate` — el gate de cierre es el paso 4 de `resumen-cierre` (antes, el paso 2 de `aviso-cierre`).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: MODIFIED (tres requisitos en dos capacidades) · tamaño: ~25 líneas en 4 ficheros
- Dominio (sonnet): si el gate de cierre sigue corriendo una sola vez y parando en rojo tras moverlo al paso 4 (señal: MODIFIED de `quality-gate`)
- Mínimo razonable: sin review — deja sin mirar si algún requisito vivo sigue citando un paso que ya no existe

1. `resumen-cierre` gana un paso 3 «Di qué se cierra» (texto de `aviso-cierre` paso 1, sin cambios).
2. **El gate no se pierde**: `aviso-cierre` también tenía «2. Corre el gate», y la constitution fija «Gate de cierre: `node --test` entero en verde». Lo traslado a `resumen-cierre` como paso 4, tras el 3 (mismo orden que tenía). Alternativa descartada: dejarlo sin dueño, porque el cierre dejaría de pararse con un test en rojo.
3. Los dos requisitos de `quality-gate` que dicen «paso 2» pasan a decir «el paso 4 de `resumen-cierre`»; si no, apuntarían al paso «lista las filas», que no corre ningún gate.
4. «El resumen va al final» (`closing`) no cambia: sus pasos 1 y 2 siguen iguales y los nuevos 3 y 4 van detrás.
5. Enfoque: ampliar `resumen-cierre` (ver Approach), frente a renombrar `aviso-cierre` o dejar el gate en un hook aparte.
6. Orden del cierre: 1 commits, 2 filas, 3 qué se cierra, 4 gate. El gate va el último, como era el último de `aviso-cierre`; no se reordenan los pasos 1 y 2 vivos.
7. El paso 4 conserva el texto de `aviso-cierre`, «Corre el gate.», sin comando: remite al «Gate de cierre» de `operations.md:11` (`node --test && node scripts/lint.mjs`). Que ese gate sea más amplio que el «`node --test` entero» de la constitution es una divergencia anterior a esta feature y no se toca aquí.
- Verificación del delta: probado en una copia de `.docs/sdd` fuera del repo con `sdd capability merge`: `closing.md: sustituido «Quien cierra sabe qué se cierra»` · `quality-gate.md: sustituido «El gate corre una sola vez»` · `quality-gate.md: sustituido «Un gate en rojo para el cierre»`; sin rechazos.
- Política de modelos: revisor de la spec en sonnet (uno) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico · el orden del gate frente al resumen no estaba declarado → decisión 6: el gate es el último paso, tras el resumen; contar commits y listar filas no marca ninguna fila como saldada (eso lo hace el cierre de `sdd-archive`, no la skill), así que un gate en rojo no deja nada saldado a medias.
- **Rechazado** — Crítico · los escenarios se comprueban «leyendo la salida» → el proyecto no tiene arnés de pruebas para skills (`test/` solo cubre `src/`); inventar uno es otra feature. Se añade en «Dónde se prueba» una comprobación mecánica con `grep` de que el `SKILL.md` tiene los cuatro pasos en orden.
- **Rechazado** — Importante · «El resumen va al final» pasa a MODIFIED → el requisito solo dice lo que hacen sus pasos 1 y 2, y sigue siendo cierto tal cual; «al final» es el resumen frente al cierre, no la posición entre pasos (decisión 4).
- **Rechazado** — Importante · reescribir «Un gate en rojo» con filas y código de salida → inventaría comportamiento que ningún requisito vivo pide; este cambio solo reapunta el paso.
- **Rechazado** — Importante · el lint no figura en la constitution → `operations.md:11` fija el «Gate de cierre» como `node --test && node scripts/lint.mjs`; la constitution pide `node --test` entero en verde y no lo contradice.
- **Aceptado** — Importante · `ROADMAP.md` no estaba en el Scope → Scope y Intent lo nombran: la fila 0030 pasa a ✅ al cerrar y es la única mención que queda.
- **Aceptado** — Importante · «un solo mensaje» sin escenario → `AND` añadido al requisito `closing`.
- **Rechazado** — Menor · Laura y el perfil → Laura es la aprobadora ya fijada en la cabecera y `delegate` solo dice quién para en qué.
- **Aceptado** — Menor · hallazgos pendientes y mínimo → rellenados; el mínimo sigue dejando sin mirar los pasos citados, y por eso hay revisor.
- **Aceptado** — Menor · numeración de pasos como referencia → decisión 3 la declara y la comprobación con `grep` la ancla.

Segunda ronda (un revisor nuevo, sonnet; sin tercera):

- **Aceptado** — Crítico · el AND de `closing` está mal formulado → ahora «`aviso-cierre` ya no existe».
- **Rechazado** — Crítico · «no se repite aunque el cierre se retome» no se comprueba → es un requisito vivo que este cambio solo reapunta de paso; `aviso-cierre` tampoco guardaba estado, así que el comportamiento de retomar no cambia y queda fuera de esta feature.
- **Aceptado** — Importante · el `grep` no mira el texto de los pasos → «Dónde se prueba» comprueba también los textos de los pasos 3 y 4.
- **Aceptado** — Importante · el paso 4 no fija el comando → decisión 7: remite a `operations.md`; el lint cuenta como gate ahí.
- **Aceptado** — Importante · numeración de decisiones y delta probado como decisión → renumeradas 1-7 y la verificación del delta pasa a viñeta.
- **Rechazado** — Importante · «El resumen va al final» sin pasos 3 y 4 → ya rechazado en la primera ronda con su motivo.
- **Aceptado** — Importante · el `git grep` de «Dónde se prueba» no cubre el repo → ampliado al repo entero salvo `ROADMAP.md` y `.docs/sdd/specs/`.
- **Rechazado** — Menor · Laura y el dev-lead frente a `PRODUCT.md` → la cabecera y la aprobación son lo que el dev-lead dejó escrito en el borrador; este cambio no las toca.
- **Rechazado** — Menor · «al final» ambiguo → duplicado del anterior.
- **Aceptado** — Menor · divergencia constitution/`operations.md` → anotada en la decisión 7.

### Decisiones tomadas con el dev-lead

- Retirar la skill `aviso-cierre` — fila 0030 del roadmap, «Retirar la skill aviso-cierre».

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje. Éxito: `skills/aviso-cierre/` no existe, `resumen-cierre` da todo lo que daba `aviso-cierre` (incluido el gate) y ninguna capacidad ni documento vivo nombra ya `aviso-cierre` (salvo la fila 0030 de `ROADMAP.md`, que es esta feature, y las specs históricas). Fracaso aunque «funcione»: que el gate de cierre deje de correr sin que nadie lo note.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` gana el paso 3 (qué se cierra) y el paso 4 (corre el gate); `.docs/sdd/capabilities/closing.md` y `.docs/sdd/capabilities/quality-gate.md` se actualizan por el delta; la fila 0030 de `ROADMAP.md` pasa a ✅ al cerrar.
- No entra: cambiar `aviso-apertura`; cambiar `.docs/sdd/steering/` (la constitution y `operations.md` hablan del «gate de cierre», no de la skill, y siguen siendo ciertos).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` (todo el fichero) | Scope: se borra la carpeta |
| «`aviso-cierre` dice qué se cierra» | `.docs/sdd/capabilities/closing.md:13` | delta `closing`, `MODIFIED` |
| paso 1 de `aviso-cierre` («Di qué se cierra») | `skills/aviso-cierre/SKILL.md` | decisión 1: pasa a paso 3 de `resumen-cierre` |
| paso 2 de `aviso-cierre` («Corre el gate») | `skills/aviso-cierre/SKILL.md` | decisión 2: pasa a paso 4 de `resumen-cierre` |
| «cuando llega el paso 2» (el gate) | `.docs/sdd/capabilities/quality-gate.md:18` | delta `quality-gate`, `MODIFIED` |
| «el paso 2 con un test en rojo» | `.docs/sdd/capabilities/quality-gate.md:23` | delta `quality-gate`, `MODIFIED` |
| «el paso 2 lista las filas del roadmap» | `.docs/sdd/capabilities/closing.md:26` | sin cambio: es el paso 2 de `resumen-cierre`, que no se mueve (decisión 4) |
| «el paso 2 de `aviso-apertura`» | `.docs/sdd/capabilities/closing.md:18` | sin cambio: es otra skill |

- Filas que implementa: 0030 → `ROADMAP.md:9` la nombra (es la fila de esta feature; al cerrar pasa a ✅); ningún otro fichero fuera de `ROADMAP.md` la nombra: comprobado con `git grep -n 0030`. Búsquedas hechas: `git grep -niE "aviso-cierre|aviso_cierre|avisoCierre|aviso cierre"` (solo `closing.md:13`, `ROADMAP.md:9` y la propia skill) y `git grep -niE "(pasos?|steps?) [0-9]+\b" -- .docs/sdd/capabilities/ skills README.md` (los cuatro «paso 2» de la tabla; ningún otro paso numerado). `README.md`, `scripts/`, `src/` y `test/` no nombran la skill.

## Approach

- Ampliar `resumen-cierre` con los pasos 3 y 4 — cuesta tocar un solo fichero de skill y dos capacidades; los pasos 1 y 2 no se tocan.
- Renombrar `aviso-cierre` a `resumen-cierre` y fusionar — cuesta reescribir el paso 1 y 2 vivos y su requisito «El resumen va al final».
- Mover el gate a un hook o a `operations.md` solo — cuesta una pieza nueva para un paso de una línea.
- Elegido: ampliar `resumen-cierre`, porque es lo que pide la fila 0030 («dos skills que dicen casi lo mismo» → una) con el menor cambio sobre lo que ya funciona.

`skills/resumen-cierre/SKILL.md` queda con:

```text
1. Cuenta los commits de la rama.
2. Lista las filas del roadmap que salda.
3. Di qué se cierra.
4. Corre el gate.
```

## Dónde se prueba

- el mensaje de cierre: leyendo la salida de `resumen-cierre` (los cuatro pasos, en ese orden), y con `grep -nE "^[1-4]\. " skills/resumen-cierre/SKILL.md` que devuelva exactamente cuatro líneas, numeradas 1 a 4 (la numeración es referencia de `closing` y `quality-gate`), la 3 «Di qué se cierra.» y la 4 «Corre el gate.».
- que la skill retirada no existe: `test ! -e skills/aviso-cierre` y `git grep -n "aviso-cierre" -- . ':!ROADMAP.md' ':!.docs/sdd/specs'` sin resultados.
- el gate corre una sola vez y para en rojo: como hoy, con `node --test && node scripts/lint.mjs` (`operations.md`), ahora desde el paso 4.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `resumen-cierre` dice qué se cierra en su paso 3
- AND `aviso-cierre` ya no existe

### Capacidad: `quality-gate`

#### MODIFIED — El gate corre una sola vez

- GIVEN un cierre en marcha
- WHEN llega el paso 4 de `resumen-cierre`
- THEN el gate corre una vez, y no se repite aunque el cierre se retome

#### MODIFIED — Un gate en rojo para el cierre

- GIVEN el paso 4 de `resumen-cierre` con un test en rojo
- WHEN acaba
- THEN el cierre para y dice qué test falló

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
