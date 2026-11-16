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

- Modificadas: `closing` — el aviso de cierre lo da `resumen-cierre`, y su orden cambia; `quality-gate` — el gate lo corre `resumen-cierre`, no `aviso-cierre`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: MODIFIED (tres requisitos entre `closing` y `quality-gate`), dos capacidades · tamaño: ~40 líneas en 4 ficheros
- Dominio (opus): si el orden de `resumen-cierre` deja al gate parar un cierre en marcha y si «El resumen va al final» sigue siendo verdad (señal: MODIFIED)
- Técnica (sonnet): si los THEN del gate y del aviso se pueden comprobar sin que valga cualquier texto (señal: MODIFIED)
- Mínimo razonable: solo dominio — deja sin mirar si los THEN se verifican con algo observable

1. **Enfoque: A, frente a B y C** (ver Approach). Se borra la carpeta `skills/aviso-cierre/` entera.
2. **El gate de `aviso-cierre` no se pierde.** `aviso-cierre` tiene dos pasos: «Di qué se cierra» y «Corre el gate». Retirarla entera dejaría sin dueño al gate, y `quality-gate` lo ata a «el paso 2» en dos requisitos. Es la decisión central de la spec: si prefieres otra cosa, dilo.
3. **Orden nuevo de `resumen-cierre`** (decisión rehecha tras la review): 1 «Corre el gate», 2 «Di qué se cierra» (id y título de la feature y su rama), 3 «Cuenta los commits de la rama», 4 «Lista las filas del roadmap que salda». El gate va primero para que un test en rojo pare el cierre antes de decir que se cierra. El resumen sigue al final (pasos 3 y 4), pero los pasos que contaba como 1 y 2 pasan a 3 y 4: por eso «El resumen va al final» es un MODIFIED.
4. **Momento de `resumen-cierre`**: corre durante el cierre, no después. Su `description` pasa de «al acabar el cierre» a «al cerrar una feature», y los tres requisitos que la tocan parten del mismo estado: «un cierre en marcha».
5. **El gate es el «Gate de cierre» de `operations.md`** (`node --test && node scripts/lint.mjs`); la constitución dice solo `node --test`. No decido nada sobre el lint: el paso 1 dice «corre el gate de cierre del proyecto». Sin medir: no he corrido ese gate sobre esta rama.
6. **Al retomar**, «no se repite aunque el cierre se retome» ya lo exige `quality-gate` y no define mecanismo; en «El gate corre una sola vez» solo cambia el número de paso, y el mecanismo y qué pasa tras un rojo arreglado quedan fuera de alcance (no añado ninguna regla de rearranque).
7. **Cambios de comportamiento que introduce el delta, no solo de numeración**: (a) «Quien cierra sabe qué se cierra» pasa a exigir id, título y rama, y parte de un gate en verde; (b) «Un gate en rojo para el cierre» pasa a exigir que no corran los pasos 2 a 4, y cubre el lint además de los tests (el nombre de lo que falló sale de la salida del gate); (c) la `description` de `resumen-cierre` cambia solo el texto de cuándo se usa: no se prueba con escenario.
8. **Cómo se prueba**: las skills son texto y `test/` solo cubre `src/`; no añado test automático. Se comprueba leyendo `resumen-cierre/SKILL.md`, con `git grep aviso-cierre` vacío fuera de las specs y, a mano, forzando un test en rojo: la salida debe traer solo el paso 1 y el nombre del test.
9. `ROADMAP.md` no se toca al implementar: la fila 0030 se salda al archivar.
10. **Política de modelos:** sin cambios respecto al proyecto.
11. Delta probado en una copia de `.docs/sdd` con `sdd capability merge`: sustituye «Quien cierra sabe qué se cierra», «El resumen va al final», «El gate corre una sola vez» y «Un gate en rojo para el cierre» (ver «Verificación del delta»).

### Hallazgos de la review

- **Aceptado** — Crítico (dominio y técnica): con el gate en el paso 4 no puede parar el cierre, y «El resumen va al final» deja de ser verdad → gate al paso 1, MODIFIED declarado de «El resumen va al final», estado único «cierre en marcha» (decisiones 3 y 4).
- **Aceptado** — Crítico (técnica): el THEN del gate en rojo se cumplía con una frase → ahora exige que no corran los pasos 2 a 4 y que diga qué test falló.
- **Aceptado** — Importante (dominio y técnica): el paso «qué se cierra» no decía qué dice y se solapaba con las filas → paso 2 con id, título y rama; las filas siguen en el paso 4.
- **Aceptado** — Importante (técnica): decisiones del cuerpo fuera del ✋, encabezado sin marcador, resultado del merge sin mostrar y tabla por número de línea → ✋ completo, encabezado con ✋, bloque «Verificación del delta» y tabla por nombre de requisito.
- **Aceptado** — Importante (dominio): invocador de `aviso-cierre` sin nombrar → `git grep` no da ninguno fuera de la carpeta; queda en la tabla.
- **Aceptado** — Menor (técnica): ROADMAP no listado → decisión 9.
- **Aceptado** — Importante/Menor (ambas): lint frente a constitución → decisión 5.

Segunda ronda (un revisor, sin tercera):

- **Aceptado** — Crítico: «Quien cierra sabe qué se cierra» no era comprobable → THEN con id, título y rama de la feature, y cambio declarado en la decisión 7.
- **Aceptado** — Crítico: la decisión 6 inventaba una regla de rearranque que contradecía «no se repite» → quitada; el requisito solo cambia de número de paso.
- **Aceptado** — Importante: «no corren los pasos 2 a 4» y el lint son comportamiento nuevo → decisión 7 y THEN del gate en rojo ampliado a «el gate de cierre».
- **Aceptado** — Importante: nada probaba que el gate en rojo pare el cierre → comprobación manual en la decisión 8 y en «Dónde se prueba».
- **Aceptado** — Menor: «son los dos últimos pasos» sin relación con el gate en rojo → el escenario lo referencia.
- **Aceptado** — Menor: verificación del merge sin comando → comando escrito.
- **Rechazado** — Importante: mecanismo de «no se repite al retomar» en el delta → ya existía sin mecanismo; no se añade regla (decisión 6).
- **Rechazado** — Importante: escenario para la `description` → es solo texto de cuándo se usa la skill, declarado en la decisión 7.
- **Rechazado** — Menor: «Laura» y perfil `delegate` contra PRODUCT.md → es el aprobador de la plantilla del proyecto y el perfil viene de `sdd-kit.json`; si quieres otro aprobador, dilo.
- **Rechazado** — Crítico (técnica): definir el mecanismo de «no se repite al retomar» → el requisito ya existe sin mecanismo y no es de esta feature; decisión 6.
- **Rechazado** — Importante (dominio): «Laura» y «dev-lead» contradicen a PRODUCT.md → el nombre y el rol vienen de la plantilla del proyecto y de la propia sesión, no los introduce esta spec.
- **Rechazado** — Menor (técnica): «un solo mensaje» sin escenario → es el motivo del Intent, no un requisito; lo cubren los THEN del paso 2.

## Intent

Al cerrar una feature se lanzan dos skills (`aviso-cierre` y `resumen-cierre`) y nadie lee la segunda. Quien cierra quiere un solo mensaje. `aviso-cierre` no solo avisa: también corre el gate, y eso debe sobrevivir.

- Éxito: `git grep aviso-cierre` no da nada fuera de las specs, y `resumen-cierre` corre el gate, dice qué se cierra y da el resumen.
- Anti-objetivo: que el cierre diga que se cierra una feature con un test en rojo.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` con los cuatro pasos nuevos y su `description`; `.docs/sdd/capabilities/closing.md` y `quality-gate.md` (por el delta, al cerrar).
- No entra: cambiar `aviso-apertura`; `ROADMAP.md` (se salda al archivar); el mecanismo de «no se repite al retomar».

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` | se borra la carpeta |
| su paso «Di qué se cierra» | `skills/aviso-cierre/SKILL.md` | `resumen-cierre`, paso 2 |
| su paso «Corre el gate» | `skills/aviso-cierre/SKILL.md` | `resumen-cierre`, paso 1 |
| invocadores de `aviso-cierre` | `git grep aviso-cierre`: solo `closing.md` y su propia carpeta | no hay otros |
| `aviso-cierre` en «Quien cierra sabe qué se cierra» | `closing.md` | MODIFIED |
| «paso 1» y «paso 2» de `resumen-cierre` en «El resumen va al final» | `closing.md` | MODIFIED: pasan a 3 y 4 |
| «el paso 2» (gate) en «El gate corre una sola vez» | `quality-gate.md` | MODIFIED: paso 1 de `resumen-cierre` |
| «el paso 2» (gate) en «Un gate en rojo para el cierre» | `quality-gate.md` | MODIFIED: paso 1 de `resumen-cierre` |
| «paso 2 de `aviso-apertura`» en «La apertura avisa de la rama» | `closing.md` | no cambia: es otra skill |
| `description` de `resumen-cierre` («al acabar el cierre») | `skills/resumen-cierre/SKILL.md` | «al cerrar una feature» |

- Filas que implementa: 0030 → ninguna otra referencia: `git grep 0030` fuera de las specs solo da la propia fila de `ROADMAP.md`.

## Approach

Enfoque: A, frente a B y C.

- **A — fusionar en `resumen-cierre`, con el gate primero** (elegido): 1 gate, 2 qué se cierra, 3 commits, 4 filas. Un solo mensaje, nada se pierde y el gate puede parar el cierre; cuesta tocar dos capacidades y renumerar los pasos del resumen.
- **B — retirar y dejar caer el gate de la skill**: menos cambios, pero un test en rojo ya no pararía el cierre (anti-objetivo).
- **C — gate y «qué se cierra» al final (pasos 3 y 4)**: no renumera el resumen, pero el gate correría con la feature ya cerrada y no podría pararla. Descartado tras la review.

## Dónde se prueba

- El mensaje de cierre: leyendo `skills/resumen-cierre/SKILL.md` (pasos 1 a 4) y la salida de `resumen-cierre`.
- Que no queda rastro: `git grep aviso-cierre` vacío fuera de `.docs/sdd/specs/`.
- El gate: el «Gate de cierre» de `operations.md` en verde.
- El gate en rojo: forzar un test en rojo y comprobar que la salida de `resumen-cierre` solo trae el paso 1 y el nombre del test.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN un cierre en marcha con el gate en verde
- WHEN corre `resumen-cierre`
- THEN el paso 2 dice qué feature se cierra: su id, su título y su rama (para esta feature, `0030`, «Retirar la skill aviso-cierre» y `feature/0030-retire-close-notice`)

#### MODIFIED — El resumen va al final

- GIVEN un cierre en marcha con el gate en verde
- WHEN corre `resumen-cierre`
- THEN el paso 3 cuenta los commits de la rama
- AND el paso 4 lista las filas del roadmap que salda
- AND son los dos últimos pasos: no hay paso posterior al 4
- AND con el gate en rojo no corren, según «Un gate en rojo para el cierre»

### Capacidad: `quality-gate`

#### MODIFIED — El gate corre una sola vez

- GIVEN un cierre en marcha
- WHEN llega el paso 1 de `resumen-cierre`
- THEN el gate corre una vez, y no se repite aunque el cierre se retome

#### MODIFIED — Un gate en rojo para el cierre

- GIVEN el paso 1 de `resumen-cierre` con el gate de cierre en rojo (un test o el lint)
- WHEN acaba
- THEN el cierre para, no corren los pasos 2 a 4 y dice qué comprobación falló, con el nombre que da la salida del gate

## Verificación del delta

`cp -r .docs/sdd <tmp>/sdd && node <kit>/cli/bin/sdd.js capability merge --path <tmp>/sdd --artifact <esta spec>`, exit 0 (repetido tras la ronda 2):

```text
closing.md: sustituido «Quien cierra sabe qué se cierra»
closing.md: sustituido «El resumen va al final»
quality-gate.md: sustituido «El gate corre una sola vez»
quality-gate.md: sustituido «Un gate en rojo para el cierre»
```

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
