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

## Capacidades

- Modificadas: `closing` — el aviso de cierre lo da `resumen-cierre`.
- Modificadas: `quality-gate` — el gate lo corre `resumen-cierre`, ya no `aviso-cierre` (ver ✋ 2 y 3).

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: MODIFIED (tres requisitos de `closing` y `quality-gate`) · tamaño: ~40 líneas en 4 ficheros
- Dominio (sonnet): si la delta de `quality-gate` apunta al paso correcto y si «El resumen va al final» sigue siendo cierto con los pasos 3 y 4 (señal: MODIFIED)
- Técnica (sonnet): si los THEN de «Quien cierra sabe qué se cierra» y «Un gate en rojo para el cierre» se pueden comprobar y qué cubre «Dónde se prueba» (señal: MODIFIED)
- Mínimo razonable: solo dominio — deja sin mirar si los THEN pasarían sin el comportamiento

1. `resumen-cierre` gana un paso 3 con lo que se cierra y un paso 4 con el gate.
2. **`aviso-cierre` también corre el gate (su paso 2), y retirarla lo dejaría sin quien lo corra.** Propongo que ese paso pase a `resumen-cierre` como paso 4, con el texto «Corre el gate de cierre (`operations.md`)», para que no haya dos gates posibles. Alternativa descartada: dejar el gate sin paso de skill y fiarlo solo a la constitución y a `operations.md`; perdería la parada de `quality-gate` («un gate en rojo para el cierre»), que hoy depende de ese paso.
3. En `quality-gate`, los dos requisitos que dicen «el paso 2» del cierre pasan a decir «el paso 4 de `resumen-cierre`» (escenarios de «El gate corre una sola vez» y «Un gate en rojo para el cierre»), nombrando ya la skill. Lo he leído como que ese «paso 2» es el de `aviso-cierre` («Corre el gate»): ese requisito habla de correr el gate, y el «paso 2» de `resumen-cierre` lista filas. `quality-gate.md` no nombra la skill, así que **valida esto**.
4. Enfoque: A (mover los dos pasos a `resumen-cierre`), frente a B (conservar `aviso-cierre` y retirar solo su paso 1) y C (retirar el aviso sin mover el gate); ver Approach.
5. Orden de los pasos: 1 y 2 conservan su número porque `closing` los cita; 3 «Di qué se cierra» va después (no antes) por no renumerar; 4 «Corre el gate» va el último: el cierre dice qué se cierra y, si el gate sale en rojo, para y lo dice. Si prefieres el gate antes del mensaje, se intercambian el 3 y el 4. El paso 4 vive en `quality-gate`, no en `closing`: la delta de `closing` recoge los pasos 1 a 3.
6. «El resumen va al final» conserva su título: el resumen sigue siendo lo último que se hace en el cierre; se amplía a tres pasos (MODIFIED); el 4, el gate, va en `quality-gate`. Si prefieres retitularlo, dímelo.
7. El gate vigente es el de `operations.md` (`node --test && node scripts/lint.mjs`); la constitución dice solo `node --test`. Divergencia anterior a esta feature, fuera de Scope: no se toca.
8. «No se repite aunque el cierre se retome» no cambia: lo garantiza el cierre (`sdd-archive`), no el texto de la skill; esta feature solo cambia dónde está el paso. Esa parte queda `sin medir`.
9. La fila 0030 del roadmap se marca ✅ al cerrar, como cualquier fila; no hay más filas que esta feature salde.
10. Política de modelos: revisores de la spec: dos (dominio en sonnet, técnica en sonnet; la spec no toca reglas de negocio ni roles) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
11. Delta probada sobre una copia de `.docs/sdd` con `sdd capability merge`: sale bien (sustituye «Quien cierra sabe qué se cierra», «El resumen va al final», «El gate corre una sola vez» y «Un gate en rojo para el cierre»); `capabilities/` del repo no se ha tocado.

### Hallazgos de la review

- **Aceptado** (Crítico, dominio) — el «paso 2» de `quality-gate` es ambiguo y puede romper un requisito vigente → ahora los dos MODIFIED nombran «el paso 4 de `resumen-cierre`» y ✋ 3 explica la lectura y pide validarla.
- **Aceptado** (Crítico, dominio) — «El resumen va al final» queda incoherente con los pasos 3 y 4 → nuevo `MODIFIED` en `closing` con los cuatro pasos; ✋ 6 conserva el título.
- **Aceptado** (Crítico, técnica) — el THEN del paso 3 pasaba sin el comportamiento → ahora exige el orden (3 después de 1 y 2) y «Dónde se prueba» lo comprueba con un `grep` de los cuatro pasos.
- **Aceptado** (Crítico, técnica) — «no se repite aunque se retome» sin mecanismo → es comportamiento que no cambia: ✋ 8 lo declara `sin medir` y lo atribuye al cierre.
- **Aceptado** (Importante) — falta decidir el orden de los pasos (✋ 5); el gate de constitución y de `operations.md` difieren (✋ 7); cobertura del paso 4 en `closing` (cuarto AND de «El resumen va al final»); carpetas excluidas del `git grep` nombradas.
- **Segunda ronda — Aceptado**: el THEN de «Quien cierra sabe qué se cierra» pierde la referencia al paso (el orden lo cubre «El resumen va al final»); el paso 4 sale del requisito de `closing` y vive en `quality-gate` (✋ 5); el Scope dice que los pasos 1 y 2 no cambian y que la skill hoy no menciona el gate; el paso 4 fija el texto «Corre el gate de cierre (`operations.md`)»; el `grep` de pasos nombra el texto de cada uno; el `git grep` corre tras aplicar la delta.
- **Segunda ronda — Rechazado**: «gate en rojo sin comprobación» y «no se repite sin mecanismo» (los dos ya declarados `sin medir` en ✋ 8: la parada y la idempotencia son del cierre, y el requisito solo cambia de número de paso); «lectura del paso 2 como supuesto pendiente» (ya es la ✋ 3, que pide validarla); «sacar la review de ✋» (la plantilla la pide ahí).
- **Rechazado** (Importante, técnica 4) — pruebas ejecutables que corran el gate: el repo no tiene tests de skills y esta feature no cambia el gate; añadir un test sería otra feature.
- **Rechazado** (Menor, dominio 7) — el aprobador «Laura» es el dev-lead de la feature, no un ejemplo.
- **Rechazado** (Menor, técnica 10) — la política de modelos va en ✋ por contrato de la plantilla.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje. Éxito: tras el cierre existe una sola skill, `resumen-cierre`, que dice qué se cierra, cuenta los commits, lista las filas y corre el gate; y un gate en rojo sigue parando el cierre. Sería un fallo, aunque «funcione», que `aviso-cierre` desaparezca y el gate deje de correr sin que nadie lo note.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` dice también qué se cierra (paso 3) y corre el gate (paso 4); sus pasos 1 y 2 no cambian y hoy no dice nada del gate.
- Entra: `.docs/sdd/capabilities/closing.md` (un THEN nombra `aviso-cierre` y «El resumen va al final» lista dos pasos) y `.docs/sdd/capabilities/quality-gate.md` (dos escenarios con «el paso 2») se ajustan por la delta, al cerrar.
- No entra: cambiar `aviso-apertura`.
- No entra: el texto del gate (`node --test && node scripts/lint.mjs`, en `operations.md`), que no cambia.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` (carpeta) | `skills/aviso-cierre/SKILL.md` | se borra |
| su paso 1, «Di qué se cierra» | `skills/aviso-cierre/SKILL.md` | pasa a `resumen-cierre`, paso 3 |
| su paso 2, «Corre el gate» | `skills/aviso-cierre/SKILL.md` | pasa a `resumen-cierre`, paso 4 |
| `aviso-cierre` en un THEN | `.docs/sdd/capabilities/closing.md:13` | `MODIFIED` en la delta: pasa a `resumen-cierre` |
| «el paso 2» del cierre | `.docs/sdd/capabilities/quality-gate.md:18` y `:23` | `MODIFIED` en la delta: pasa a «el paso 4» (ver ✋ 3) |
| fila 0030 | `ROADMAP.md:9` | se marca ✅ al cerrar |
| «paso 1» / «paso 2» de `resumen-cierre` | `.docs/sdd/capabilities/closing.md:25-26` | no cambian de número; el requisito gana el paso 3 (`MODIFIED` «El resumen va al final») |

- Filas que implementa: 0030 → nada que salde: `git grep -niE "aviso-cierre|0030"` fuera de `.docs/sdd/specs/` (la evidencia) da solo `ROADMAP.md:9` (la propia fila), `closing.md:13` y la carpeta de la skill; ni `README.md`, `CHANGELOG.md`, `package.json` ni `scripts/` la citan.

## Approach

- **A (elegida)**: `resumen-cierre` pasa a tener cuatro pasos: 1 y 2 siguen igual, 3 «Di qué se cierra», 4 «Corre el gate»; se borra `aviso-cierre`. Es la que da un solo mensaje sin perder el gate.
- B: conservar `aviso-cierre` solo con «Corre el gate» y quitarle lo de decir qué se cierra. Deja dos skills de cierre, que es justo lo que se quiere evitar.
- C: retirar `aviso-cierre` y mover solo «Di qué se cierra». El gate quedaría sin paso que lo corra y `quality-gate` describiría un paso que no existe.

## Dónde se prueba

Son skills de texto: se comprueban leyendo el fichero, con comprobaciones de texto repetibles.

- los cuatro pasos y su orden: `grep -nE "^[0-9]\. " skills/resumen-cierre/SKILL.md` (supone la lista numerada `N.` que ya usa la skill) devuelve exactamente cuatro líneas, en este orden: «Cuenta los commits…», «Lista las filas…», «Di qué se cierra», «Corre el gate de cierre (`operations.md`)».
- que `aviso-cierre` ya no existe: `git ls-files skills/aviso-cierre` vacío, y, una vez aplicada la delta, `git grep -n aviso-cierre -- . ':!.docs/sdd/specs'` solo devuelve la fila 0030 de `ROADMAP.md` (queda como historia).
- que el gate sigue parando el cierre: el gate sigue siendo el de `operations.md` y su requisito en `quality-gate.md` apunta al paso 4 de `resumen-cierre`; la parada en rojo y «no se repite» las da el cierre (`sdd-archive`) y no se vuelven a medir aquí (`sin medir`, ✋ 8).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `resumen-cierre` dice qué se cierra

#### MODIFIED — El resumen va al final

- GIVEN una feature cerrada
- WHEN corre `resumen-cierre`
- THEN el paso 1 cuenta los commits de la rama
- AND el paso 2 lista las filas del roadmap que salda
- AND el paso 3 dice qué se cierra

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
