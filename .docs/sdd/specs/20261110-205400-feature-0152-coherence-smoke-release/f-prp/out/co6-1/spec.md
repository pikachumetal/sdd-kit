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

- Modificadas: `closing` — el aviso de cierre lo da `resumen-cierre` y su orden queda fijado; `quality-gate` — el gate de cierre lo corre `resumen-cierre`, no `aviso-cierre`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores (dominio y técnica, ambos sonnet) — señales: MODIFIED (cuatro requisitos en `closing` y `quality-gate`) · tamaño: ~15 líneas en 4 ficheros.

Política de modelos: sin cambios, la del proyecto.

1. `resumen-cierre` gana un paso 3 «Di qué se cierra», con las palabras que tenía en `aviso-cierre`.
2. `resumen-cierre` gana un paso 4 «Corre el gate»: `aviso-cierre` era el único sitio que lo corría (su paso 2), y retirarla sin moverlo dejaría el cierre sin gate. Orden: qué se cierra y luego el gate, el de `aviso-cierre`.
3. `quality-gate` pasa de «paso 2» a «paso 4 de `resumen-cierre`» en dos requisitos (`MODIFIED`), porque su «paso 2» era el de `aviso-cierre`. El comando del gate lo sigue fijando `operations.md` (hoy `node --test && node scripts/lint.mjs`); la spec no lo toca. La constitución dice solo «`node --test` entero en verde»: discrepancia previa, fuera de esta feature.
4. `closing` «El resumen va al final» pasa a `MODIFIED`: los pasos 1 y 2 del resumen siguen primero y los pasos 3 y 4 vienen después. Se mantiene su título aunque el resumen ya no sea literalmente lo último; ✋ valida si prefieres renombrarlo. El paso 2 solo lista las filas que salda, no las marca, así que un gate en rojo en el paso 4 no deja nada saldado.
5. «No se repite aunque el cierre se retome» es una promesa que ya tenía `quality-gate`; esta feature no cambia cómo se cumple (la skill es texto y no guarda estado). `sin medir`: no se prueba la retoma.
6. La fila 0030 se salda al cerrar (`ROADMAP.md`, lo hace el cierre, no esta spec). Las cinco reglas de la capacidad —dónde viven los datos, idioma de los nombres, límites, avisos, regla ante conflicto—: no aplica, el cambio solo mueve dos pasos de texto entre skills y no crea datos.
7. Enfoque: A, frente a B y C (ver Approach).
8. El paso 3 dice «qué se cierra» antes de que corra el gate del paso 4: si el gate sale en rojo, el cierre para y el mensaje ya se dio. Es el orden que ya tenía `aviso-cierre` para sus dos pasos; ✋ valida si prefieres el gate antes (entonces serían los pasos 3 y 4 al revés).
9. Changelog, versión y manifiestos: no aplica ahora; la entrada del changelog la pone el cierre de la release. No hay alias ni aviso de retirada: quien invoque `aviso-cierre` deja de encontrarla.
10. Sin test automático: son skills en markdown y no hay test que las enumere (`git grep` en todo el repo, `scripts/` y `test/` incluidos, no da más referencias); se comprueba con `git grep` y leyendo `resumen-cierre`.

Pasada de coherencia: la tabla de «Lo que se retira» estaba vacía y el paso 2 de `aviso-cierre` («Corre el gate») no tenía destino; corregido en las decisiones 2 y 3. Delta probado en una copia de `.docs/sdd`: `closing.md` sustituidos «Quien cierra sabe qué se cierra» y «El resumen va al final»; `quality-gate.md` sustituidos «El gate corre una sola vez» y «Un gate en rojo para el cierre». Sin medir: la retoma del cierre (decisión 5).

### Hallazgos de la review

- **Aceptado** — el gate quedaba definido como `node --test && node scripts/lint.mjs`, que choca con la constitución → decisión 3: la fuente es `operations.md` y la discrepancia es previa.
- **Aceptado** — el paso 4 cambia el orden de «El resumen va al final» → `MODIFIED` y decisión 4.
- **Aceptado** — decisiones del cuerpo fuera de la lista (no tocar `operations.md`, pasos 1 y 2, fila 0030, mismas palabras) → decisiones 1, 3, 6.
- **Aceptado** — el enfoque C se describía de dos maneras → unificado en el Approach.
- **Aceptado** — líneas citadas que se quedan obsoletas → tabla por texto, no por número de línea.
- **Aceptado** — `ROADMAP.md` ausente del Scope → decisión 6.
- **Aceptado** — sin «no aplica» de datos/límites → decisión 6.
- **Aceptado** — el paso 3 anuncia el cierre antes del gate → decisión 8.
- **Aceptado** — faltaban las cinco reglas por nombre, changelog/retirada, el `git grep` acotado a `skills` y el título sin ✋ → decisiones 6 y 9, «Dónde se prueba» y el título.
- **Rechazado** — alinear aprobador y perfil con `PRODUCT.md` (Laura, dev-lead) → el aprobador viene dado en la spec del dev-lead; no lo cambio sin que lo pida.
- **Rechazado** — separar «Entra» de lo que hace el cierre → ya lo dice cada línea.
- **Rechazado** — pedir marca de estado para «una sola vez» y escenario de retoma → promesa previa; añadir estado es otra feature (decisión 5).
- **Rechazado** — un THEN observable por contenido y un test para el paso 3 → el THEN es el que ya tenía `aviso-cierre` y no hay test de skills en markdown (decisión 8).
- **Rechazado (Crítico, con motivo)** — el gate en rojo deja filas saldadas → el paso 2 solo las lista (decisión 4).
- **Rechazado** — mínimo razonable deja sin cubrir el gate → se despacharon los dos revisores.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` gana el paso 3 (qué se cierra) y el paso 4 (corre el gate); `ROADMAP.md` (la fila 0030 la salda el cierre); `.docs/sdd/capabilities/closing.md` y `.docs/sdd/capabilities/quality-gate.md` se actualizan con el delta de esta spec al cerrar.
- No entra: cambiar `aviso-apertura`; cambiar el gate (`operations.md`, constitución) ni los pasos 1 y 2 de `resumen-cierre`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` (carpeta) | `skills/aviso-cierre/SKILL.md` | se borra |
| «Di qué se cierra» (su paso 1) | `skills/aviso-cierre/SKILL.md`, paso 1 | pasa a paso 3 de `resumen-cierre` |
| «Corre el gate» (su paso 2) | `skills/aviso-cierre/SKILL.md`, paso 2 | pasa a paso 4 de `resumen-cierre` |
| `aviso-cierre` en THEN | `.docs/sdd/capabilities/closing.md`, «Quien cierra sabe qué se cierra» | `MODIFIED` de esta spec |
| «paso 2» como el gate | `.docs/sdd/capabilities/quality-gate.md`, «El gate corre una sola vez» y «Un gate en rojo para el cierre» | `MODIFIED` de esta spec: pasa a «paso 4 de `resumen-cierre`» |
| «El resumen va al final» | `.docs/sdd/capabilities/closing.md` | `MODIFIED` de esta spec: los pasos 3 y 4 vienen después de los pasos 1 y 2 |
| la fila 0030 | `ROADMAP.md`, fila 0030 | es la fila que esta spec implementa; se salda al cerrar |

- Filas que implementa: 0030 → ninguna otra referencia: `git grep -n 0030` fuera de las carpetas de evidencia solo da la propia fila de `ROADMAP.md`. `git grep -niE "aviso-cierre"` da `closing.md` y la propia skill, ya en la tabla.

## Approach

`resumen-cierre` acaba con un paso 3 «Di qué se cierra» y un paso 4 «Corre el gate», con las mismas palabras que tenían en `aviso-cierre`; los pasos 1 y 2 siguen igual. Se retira `skills/aviso-cierre/`.

Enfoques: (A, elegido) mover los dos pasos de `aviso-cierre` a `resumen-cierre` en su orden: no pierde el gate y no toca los pasos 1 y 2 que `closing` ya fija. (B) no retirar la skill: contradice la fila 0030. (C) poner el gate como paso 2 nuevo desplazando los actuales: cambia dos THEN de `closing` sin necesidad.

## Dónde se prueba

- el mensaje de cierre: leyendo la salida de `resumen-cierre`.
- que `aviso-cierre` ya no existe: `git grep -n aviso-cierre` en todo el repo, fuera de la carpeta de esta spec, sin resultados.
- que `skills/resumen-cierre/SKILL.md` lleva «Di qué se cierra» como paso 3 y «Corre el gate» como paso 4, en ese orden (`git grep -n` de las dos frases).
- el gate: el cierre sigue corriendo `node --test && node scripts/lint.mjs` una vez, desde `resumen-cierre`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `resumen-cierre` dice qué se cierra en su paso 3

#### MODIFIED — El resumen va al final

- GIVEN una feature cerrada
- WHEN corre `resumen-cierre`
- THEN el paso 1 cuenta los commits de la rama
- AND el paso 2 lista las filas del roadmap que salda
- AND los pasos 3 (qué se cierra) y 4 (el gate) vienen después de ellos

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
