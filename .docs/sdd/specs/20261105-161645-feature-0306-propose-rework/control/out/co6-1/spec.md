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

## 🦆 En corto

Hoy, al cerrar una feature, corren dos skills: `aviso-cierre` (dice qué se cierra y corre el gate) y `resumen-cierre` (cuenta commits y lista filas del roadmap). Se borra `aviso-cierre` y `resumen-cierre` hace también lo que ella hacía, en el mismo orden de siempre: dice qué se cierra, corre el gate y después da el resumen. Quien cierra ve un solo mensaje, y un gate en rojo sigue parando el cierre antes del resumen.

## Capacidades

- Modificadas: `closing` — el aviso de cierre y el gate los da `resumen-cierre`; `quality-gate` — deja de citar el gate por un número de paso.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: `MODIFIED` (tres requisitos en dos capacidades) · tamaño: ~20 líneas en 4 ficheros
- Dominio (sonnet): que el gate no se pierda al retirar `aviso-cierre` y que `closing` y `quality-gate` sigan diciendo lo mismo (señal: MODIFIED)
- Técnica (sonnet): que la numeración de `resumen-cierre` y los escenarios sean verificables (señal: MODIFIED)
- Mínimo razonable: un revisor — con un `MODIFIED` la rúbrica no baja de dos

Política de modelos: dos revisores de la spec en sonnet (dominio y técnica), en paralelo hasta `control.maxParallelAgents`, más una segunda ronda de un revisor en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos: ninguno.

1. **El gate no se pierde.** El enunciado no lo dice, pero `aviso-cierre` corre el gate (su paso 2) y `quality-gate` exige que corra una vez en el cierre. Decido que pasa a `resumen-cierre`. Alternativa descartada: dejarlo huérfano (el cierre quedaría sin gate).
2. **Orden de `resumen-cierre`: línea de apertura sin número, 1. gate, 2. commits, 3. filas del roadmap.** Es el orden que había (decir qué se cierra → gate → resumen), así un gate en rojo para el cierre antes de dar un mensaje de éxito. Alternativa descartada, de la primera versión: gate como paso 3 tras el resumen (un resumen de éxito que luego se contradice con un gate en rojo). Coste de la elegida: los pasos del resumen pasan de 1-2 a 2-3 y se modifica «El resumen va al final».
3. **Qué ve quien cierra con el gate en rojo:** la línea «qué se cierra», el nombre del test que falló y nada más; no hay resumen hasta que el gate pase. Hoy esto pasa porque el gate corre en otra skill, antes que `resumen-cierre`; al fusionarlas, la parada pasa a ser responsabilidad de `resumen-cierre` y el AND «no da el resumen» del THEN de «Un gate en rojo para el cierre» es un añadido de esta spec, no una renumeración. Se prueba con un test roto (ver «Dónde se prueba»).
4. **`quality-gate` deja de citar «el paso 2» por número** y habla de «el gate de `resumen-cierre`». Así no vuelve a romperse cuando se renumere. Su comportamiento no cambia.
5. **La retoma del cierre**: la cláusula «no se repite aunque el cierre se retome» queda con su redacción original, solo cambia a qué gate se refiere el WHEN; el texto de las skills no dice cómo se detecta que el gate ya corrió, ni hoy ni después, así que la cláusula sigue sin escenario propio. el texto de las skills no dice cómo se detecta que el gate ya corrió, ni hoy ni después de este cambio. No lo resuelvo aquí; queda fuera de Scope.
6. **La fila 0030 del roadmap** no se edita aquí: la mueve `sdd-archive` al cerrar.
7. **No existe manifiesto ni índice de skills** fuera de las carpetas `skills/*/SKILL.md` (el repo solo tiene `package.json` sin lista de skills): comprobado con `git grep`.

Delta probado sobre una copia de `.docs/sdd` (`sdd capability merge`): `closing.md: sustituido «Quien cierra sabe qué se cierra»` · `closing.md: sustituido «El resumen va al final»` · `quality-gate.md: sustituido «El gate corre una sola vez»` · `quality-gate.md: sustituido «Un gate en rojo para el cierre»`. El `capabilities/` del repo no cambia.

### Hallazgos de la review

Ronda 1 (dominio, 8 hallazgos; técnica, 9):

- **Aceptado** (dominio 1, Crítico) — el «AND no corre ninguna otra skill de aviso» era una condición nueva no declarada → quitado del delta.
- **Aceptado** (dominio 2, Crítico) — ningún requisito de `closing` decía que `resumen-cierre` corre el gate → MODIFIED de «El resumen va al final» con el gate en el paso 1.
- **Aceptado** (dominio 3 y técnica 1, 9) — «sin cambio» era falso para «El resumen va al final» → ahora es MODIFIED y está en el Scope y en la tabla.
- **Aceptado** (dominio 4, 5 y técnica 4) — un gate en rojo después del resumen contradecía el Intent → el gate pasa al paso 1 (decisiones 2 y 3) y el THEN de «Un gate en rojo» añade que no hay resumen.
- **Aceptado** (dominio 7 y técnica 7) — citar por línea y por número de paso → citado por requisito; `quality-gate` ya no cita número.
- **Aceptado** (técnica 2) — «el paso 3» sin skill → los escenarios nombran a `resumen-cierre`.
- **Aceptado** (técnica 5 y 8) — decisión no listada y manifiestos → decisiones 5 y 7.
- **Aceptado** (técnica 6) — «Dónde se prueba» no verificable → grep del orden y ejecución con test roto.
- **Aceptado** (dominio 8) — la línea de apertura sin escenario propio → cubierta en el THEN de «Quien cierra sabe qué se cierra» y en Scope.
- **Rechazado** (dominio 6 y técnica 3) — escenarios de retoma y cómo se detecta que el gate ya corrió → la cláusula se conserva con su redacción original y su mecánica sigue sin existir hoy; inventarla es otra feature. Queda dicho en la decisión 5 y en «No entra». Si la quieres dentro, es decisión tuya.

Ronda 2 (un revisor, 9 hallazgos):

- **Rechazado** (1, 2 Crítico parcial y 9) — verificar la retoma o sacar la cláusula → misma razón que arriba; sí se acepta la parte medible: «Dónde se prueba» cuenta las ejecuciones del gate en un cierre normal. Se reconoce que el requisito reescrito contiene la cláusula: su redacción no cambia.
- **Aceptado** (3) — el orden apertura→gate no tenía escenario → AND en «El resumen va al final».
- **Aceptado** (4) — GIVEN «una feature cerrada» chocaba con un gate en rojo → «un cierre en marcha».
- **Aceptado** (5 y 6) — «lo que ocurre hoy» no era exacto y el AND es un añadido → decisión 3 reescrita y línea en Scope.
- **Aceptado** (8) — los encabezados de los cuatro MODIFIED coinciden literalmente: el merge los sustituyó por título.
- **Sin acción** (7) — la numeración de `aviso-apertura` no se ha tocado ni comprobado.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje. Éxito: tras el cierre hay un único mensaje que dice qué se cierra, y el gate corre una vez y antes del resumen. Sería un fallo, aunque «funcione», que el cierre acabase sin gate, o que diera el resumen antes de un gate en rojo.

## Scope

- Entra:
  - se retira `skills/aviso-cierre/` (carpeta entera);
  - `skills/resumen-cierre/SKILL.md`: abre con la línea «Di qué se cierra.» sin numerar; paso 1 «Corre el gate.», paso 2 «Cuenta los commits de la rama.», paso 3 «Lista las filas del roadmap que salda.»;
  - `.docs/sdd/capabilities/closing.md`: los requisitos «Quien cierra sabe qué se cierra» y «El resumen va al final»;
  - `.docs/sdd/capabilities/quality-gate.md`: los requisitos «El gate corre una sola vez» y «Un gate en rojo para el cierre» dejan de citar el paso por número.
- Es parte del Scope el añadido «con el gate en rojo no se da el resumen» (decisión 3).
- No entra: cambiar `aviso-apertura`; cambiar qué comprueba el gate; la mecánica de retoma del cierre (decisión 5); editar la fila 0030 del roadmap.

## Lo que se retira o cambia de forma

Cada hit se cita por requisito o fichero, no por línea (las líneas envejecen).

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` (nombre y título) | se borra la carpeta |
| «`aviso-cierre` dice qué se cierra» | `closing`, requisito «Quien cierra sabe qué se cierra» | MODIFIED de esta spec |
| «Corre el gate» (paso 2 de `aviso-cierre`) | `skills/aviso-cierre/SKILL.md` | pasa a `resumen-cierre`, paso 1 |
| «el paso 1 cuenta…», «el paso 2 lista…» de `resumen-cierre` | `closing`, requisito «El resumen va al final» | MODIFIED de esta spec: pasos 2 y 3, y el gate en el 1 |
| «el paso 2» del cierre | `quality-gate`, requisitos «El gate corre una sola vez» y «Un gate en rojo para el cierre» | MODIFIED de esta spec: sin número, nombra a `resumen-cierre` |
| «paso 2 de `aviso-apertura`» | `closing`, requisito «La apertura avisa de la rama» | sin cambio: es otra skill |
| fila 0030 | `roadmap.md`, tabla Próximo | la mueve `sdd-archive` al cerrar |

- Filas que implementa: 0030 → solo la del roadmap (`git grep -n 0030` en todo el repo, fuera de esta carpeta de spec). La primera versión decía «nada» y no era cierto.
- `git grep` de `aviso-cierre`, `aviso de cierre` y `0030` en todo el repo: sin más apariciones en `README.md`, `PRODUCT.md`, `src/`, `test/` ni `scripts/`. `git grep -niE "(pasos?|steps?) <n>"` en `capabilities/`: los únicos hits que cambian son los de la tabla.

## Approach

`resumen-cierre` hereda de `aviso-cierre` la línea de apertura y el gate, en el orden que ya tenía el cierre, y conserva el resumen detrás. Se borra `aviso-cierre`. Las dos capacidades se actualizan para decir lo mismo que las skills.

## Dónde se prueba

- Orden de la skill: `grep -n "" skills/resumen-cierre/SKILL.md` muestra la línea de apertura y los pasos 1 (gate), 2 (commits), 3 (filas), en ese orden.
- Una sola vez: un cierre normal con el gate verde muestra una sola ejecución de `node --test` en su salida.
- Gate en rojo: con un test roto a propósito, correr el cierre: para y nombra el test, sin imprimir el resumen.
- Nada queda de la skill retirada: `git grep -n aviso-cierre` sin resultados fuera de `.docs/sdd/specs/`.

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

- GIVEN un cierre en marcha
- WHEN corre `resumen-cierre`
- THEN la línea de apertura «qué se cierra» sale antes del paso 1
- AND el paso 1 corre el gate
- AND el paso 2 cuenta los commits de la rama
- AND el paso 3 lista las filas del roadmap que salda

### Capacidad: `quality-gate`

#### MODIFIED — El gate corre una sola vez

- GIVEN un cierre en marcha
- WHEN `resumen-cierre` llega al gate
- THEN el gate corre una vez, y no se repite aunque el cierre se retome

#### MODIFIED — Un gate en rojo para el cierre

- GIVEN el gate de `resumen-cierre` con un test en rojo
- WHEN acaba
- THEN el cierre para y dice qué test falló
- AND `resumen-cierre` no da el resumen de commits ni de filas

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
