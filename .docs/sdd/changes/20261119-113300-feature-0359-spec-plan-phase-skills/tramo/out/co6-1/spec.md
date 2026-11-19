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

- Modificadas: `closing` — el aviso de cierre lo da `resumen-cierre`; `quality-gate` — el gate del cierre corre en `resumen-cierre`, no en `aviso-cierre`.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores (hecha) — señales: MODIFIED (cuatro requisitos), contrato entre skills (el «paso N» que citan dos capacidades) · tamaño: ~25 líneas en 5 ficheros
- Dominio (sonnet): si el MODIFIED de «Quien cierra sabe qué se cierra» deja `closing` coherente con «El resumen va al final» (señal: MODIFIED)
- Técnica (sonnet): si el gate sigue corriendo una sola vez y en el paso que citan los dos requisitos de `quality-gate` (señal: MODIFIED + paso numerado)
- Mínimo razonable: un solo revisor — deja sin mirar el segundo extremo, el «paso N» que citan las capacidades

1. `resumen-cierre` queda con cuatro pasos: 1 commits, 2 filas del roadmap, 3 corre el gate, 4 dice qué se cierra. El gate va antes de decir qué se cierra: si está en rojo el cierre para y el paso 4 no corre. Cambio de comportamiento a propósito: antes «di qué se cierra» salía antes del gate; ahora, con el gate en rojo, no se dice qué se cierra. Los pasos 1 y 2 sí salen aunque el gate falle.
2. **El gate de `aviso-cierre` (su paso 2) no se pierde: se traslada a `resumen-cierre` como paso 3.** Es la decisión central. Alternativa descartada: retirarlo del cierre, que obligaría a retirar los dos requisitos de `quality-gate` y deja el gate de cierre de la constitución sin ejecutor.
3. La carpeta `skills/aviso-cierre/` se borra sin dejar alias ni redirección.
4. La fila 0030 de `ROADMAP.md` se marca hecha al cerrar; no sale en la lista del paso 2 porque su «Salda» es nada.
5. «Qué se cierra» es el id y el título de la feature, para que el THEN se pueda comprobar.
- Política de modelos: revisores de la spec en sonnet (dominio y técnica, ya despachados) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Crítico: la decisión del gate sin resolver, tres numeraciones distintas (Approach «paso 3», recomendación «paso 4») → resuelta en 1–2; una sola numeración en Approach, delta y tabla.
- **Aceptado** — Crítico: `quality-gate` modificado sin declarar → declarada en Capacidades y con sus dos MODIFIED.
- **Aceptado** — Crítico: THEN que pasa con cualquier frase y «El resumen va al final» desactualizado → THEN con contenido comprobable (id y título) y MODIFIED de «El resumen va al final».
- **Aceptado** — Importante: gate en rojo y paso 4 → escenario en `quality-gate`; decisiones 3–5 añadidas a la lista; tabla con todos los hits de `git grep aviso-cierre`; «Dónde se prueba» con comprobaciones mecánicas.
- **Aceptado** — Importante: el Intent promete «un solo mensaje» → el THEN de `closing` añade que no se lanza una segunda skill de aviso.
- **Aceptado** — Importante (2.ª ronda): pasos 1–2 con gate en rojo, grep que daba hits de la propia spec, Scope sin lo que sí se hace → decisión 1 lo declara, el grep excluye `.docs/sdd/specs`, Scope y tabla completos (incluido `closing.md:21-26`), y una comprobación mecánica del paso 4.
- **Rechazado** — Crítico (2.ª ronda): «no se repite aunque se retome» choca con retomar tras un rojo → el texto ya es así en `quality-gate` vivo y esta feature solo cambia el número de paso; si molesta, es una fila de deuda aparte, no de la 0030.
- **Rechazado** — Importante (2.ª ronda): mecanismo que impide repetir el gate → mismo motivo, comportamiento ya vivo.
- **Rechazado** — Menor (2.ª ronda): renombrar «El resumen va al final» → renombrar un requisito vivo es otra feature.
- **Rechazado** — Importante: test automatizado de `node --test` para el delta: la «skill» es un texto que lee el agente y el repo no tiene forma de ejecutarla; se prueba con las comprobaciones mecánicas de «Dónde se prueba».
- **Rechazado** — Menor: el aprobador «Laura» no encaja con PRODUCT.md («no hay más usuarios ni desarrolladores»): lo puso quien abrió la feature; **lo dejo a tu decisión en el gate**.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` pasa a cuatro pasos (gate en el 3, qué se cierra en el 4); `.docs/sdd/capabilities/closing.md` y `.docs/sdd/capabilities/quality-gate.md` se actualizan con el delta; se marca hecha la fila 0030 de `ROADMAP.md` al cerrar.
- No entra: cambiar `aviso-apertura`; dejar un alias o redirección de `aviso-cierre`; tocar cómo se retoma el gate tras un rojo.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` (carpeta y nombre) | `skills/aviso-cierre/SKILL.md:2,6` | se borra la carpeta |
| `aviso-cierre` en un THEN | `.docs/sdd/capabilities/closing.md:13` | lo cambia el MODIFIED: pasa a `resumen-cierre` |
| el paso 2 «Corre el gate» de `aviso-cierre` | `skills/aviso-cierre/SKILL.md:9` | pasa a `resumen-cierre` paso 3 |
| «paso 2» como paso del gate | `.docs/sdd/capabilities/quality-gate.md:18,23` | lo cambian los MODIFIED de `quality-gate`: «paso 3 de `resumen-cierre`» |
| el requisito «El resumen va al final» | `.docs/sdd/capabilities/closing.md:21-26` | lo cambia el MODIFIED: pasos 3 y 4 |
| «di qué se cierra» (paso 1 de `aviso-cierre`) | `skills/aviso-cierre/SKILL.md:8` | pasa a `resumen-cierre` paso 4 |
| el nombre en el roadmap | `ROADMAP.md:9` | la fila propia (el título cita la skill); se marca hecha al cerrar |

- Filas que implementa: 0030 (`ROADMAP.md:9`, su «Salda» es nada): comprobado con `git grep -n 0030`, único hit fuera de las carpetas de evidencia.
- `git grep -nE "aviso-cierre"` fuera de `.docs/sdd/changes/` y de esta spec: cuatro hits (`closing.md:13`, `ROADMAP.md:9`, `skills/aviso-cierre/SKILL.md:2,6`), todos en la tabla.

## Approach

`resumen-cierre` pasa a cuatro pasos: los pasos 1 y 2 siguen igual, el 3 corre el gate (el que tenía `aviso-cierre`) y el 4 dice qué se cierra. Se borra `skills/aviso-cierre/`.

## Dónde se prueba

- `skills/aviso-cierre/` no existe, y `git grep aviso-cierre -- . ':!.docs/sdd/changes' ':!.docs/sdd/specs' ':!ROADMAP.md'` no devuelve nada.
- `skills/resumen-cierre/SKILL.md` tiene cuatro pasos numerados, el paso 3 es el gate y el paso 4 pide id y título (`grep -n "id" skills/resumen-cierre/SKILL.md` sobre ese paso). La excepción a «tests antes que código» es consciente: la skill es texto que lee el agente y `node --test` no la ejecuta.
- el mensaje de cierre: leyendo la salida de `resumen-cierre`, que nombra la feature por id y título.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra y el gate pasa
- THEN el paso 4 de `resumen-cierre` nombra la feature por su id y su título
- AND no se lanza ninguna otra skill de aviso de cierre

#### MODIFIED — El resumen va al final

- GIVEN una feature cerrada
- WHEN corre `resumen-cierre`
- THEN el paso 1 cuenta los commits de la rama
- AND el paso 2 lista las filas del roadmap que salda
- AND el paso 3 corre el gate
- AND el paso 4 dice qué se cierra

### Capacidad: `quality-gate`

#### MODIFIED — El gate corre una sola vez

- GIVEN un cierre en marcha
- WHEN llega el paso 3 de `resumen-cierre`
- THEN el gate corre una vez, y no se repite aunque el cierre se retome

#### MODIFIED — Un gate en rojo para el cierre

- GIVEN el paso 3 de `resumen-cierre` con un test en rojo
- WHEN acaba
- THEN el cierre para y dice qué test falló
- AND los pasos 1 y 2 ya han salido, y el paso 4 no corre

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
