---
id: 20261108-180116-feature-0016-close-notice
feature: 0016
title: El aviso de cierre dice también qué queda pendiente
mode: full
status: draft
created: 2026-11-08
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, la skill `aviso-cierre` solo dice qué se cierra. Con el cambio dirá además qué queda pendiente: por ejemplo, al cerrar «Motivo al cancelar» avisará «Se cierra: motivo al cancelar. Pendiente: el listado de canceladas aún no enseña el motivo», y si no queda nada, «Se cierra: … Pendiente: nada». El cambio es una sola frase del paso 1 de `skills/aviso-cierre/SKILL.md`, y como edita una skill va con su prueba con sujetos (RED → GREEN) y ~8,40 $ previstos.

Validación: agente — la skill la ejecuta un agente y la batería con sujetos mide lo mismo que vería una persona (qué dice el aviso); sin pantalla ni flujo humano que observar.

## Capacidades

- Ninguna, porque herramientas (es el texto de una skill del proyecto, no comportamiento de las salas; `capabilities/` no existe).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna (sin capacidad, contrato, `MODIFIED` ni datos; área explorada: leí `SKILL.md` y la batería) · tamaño: ~25 líneas en 2 ficheros (la frase del paso 1 y los enunciados de c1 y c2 en la batería)
- Único (sonnet): si el nuevo texto del paso 1 distingue sin ambigüedad «pendiente» (decisión 2) de «nada pendiente» (decisión 3) y si c1 y c2 de la decisión 5 lo exhiben (señal: Scope pequeño, sin contrato)
- Mínimo razonable: sin revisor — deja sin cubrir que el literal admita dos lecturas, que sería lo que el RED tarda en delatar a ~2,80 $ la tanda

1. **Texto del paso 1**: «Di qué se cierra y qué queda pendiente, con el formato «Se cierra: … Pendiente: …». Pendiente es lo que la feature deja sin hacer, no el roadmap entero. Si no queda nada, escribe «Pendiente: nada».» — la frase del dev-lead fija el qué, no las palabras; el literal y el formato son míos (hallazgos 2 y 4: sin el formato y la definición en el texto, el agente no los conoce).
2. **Qué cuenta como pendiente**: lo que la feature que se cierra deja sin hacer (Scope no cumplido); no el roadmap entero — el aviso es de la feature, y listar `Próximo` lo haría ruido idéntico en cada cierre.
3. **Sin pendiente**: se dice «Pendiente: nada», no se omite la línea — un aviso que a veces calla es indistinguible de uno que se olvidó.
4. **Enfoques**: (a) una frase en el paso 1 (elegido: es lo decidido y lo mínimo); (b) un paso nuevo «3. Di qué queda pendiente» (descartado: el dev-lead lo ubicó en el paso 1 y un paso nuevo cambiaría la numeración y el gate); (c) una plantilla de aviso (descartada: sobredimensionada para una frase).
5. **Escenarios de la batería existente** (`tests/batteries/aviso-cierre/battery.md`, ids c1 y c2, n = 2 cada uno, Sonnet; la batería hoy solo tiene la tabla y la edición con sus enunciados es entregable de esta feature). Fixture: el propio enunciado del sujeto describe una feature inventada, «Recordatorio de reserva», con dos escenarios (1: el recordatorio sale 1 h antes; 2: el recordatorio se puede desactivar) y dice qué está implementado, sin depender de ningún fichero del repo; el sujeto cierra esa feature en este proyecto, cuyo `roadmap.md` trae las filas `Próximo` 0010, 0011 y «Avisos por correo antes de la reserva». **c1**: el escenario 2 no está implementado; aserción (por texto, la comprueba el hilo principal sobre la respuesta del sujeto): el aviso contiene `Se cierra:` y `Pendiente:` y nombra «desactivar», y no nombra ninguna fila de `Próximo` (0010, 0011, «Avisos por correo»). **c2**: los dos escenarios implementados; aserción: contiene `Pendiente: nada`. El plan redacta los enunciados con estas aserciones; van en secciones bajo la tabla de `battery.md`, no como filas con un número en la cuarta celda, y `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs …` debe seguir dando 2,80 $ tras editarla.
5 bis. **Criterios**: RED — la feature sigue si falla c2 en al menos 1 de 2 sujetos, o c1 en al menos 1 de 2 (el formato `Se cierra:`/`Pendiente:` tampoco existe sin la frase); si ni c1 ni c2 fallan, no se edita la skill y decide el dev-lead. GREEN — c1 y c2 pasan 2 de 2; con 1 de 2 en alguno, una tanda de REFACTOR (ya presupuestada), y si aún no llega a 2 de 2 se para y decide el dev-lead (Art. 5).
10. **La `description` de la skill** («Usar al cerrar una feature.») no cambia: el dev-lead solo tocó el paso 1.
6. **Validación `agente`** (ver la línea bajo el 🦆): la propongo yo; si prefieres `dev-lead`, cámbialo en el gate.
7. **Layout `specs/`**: `sdd-kit.json` dice 3.0.0 pero el proyecto sigue en layout 2.x (`.docs/sdd/specs/`, documentos sin `steering/`), así que la carpeta va en `specs/`, no en `changes/`. Si ya quieres migrar, es una tarea aparte (`sdd-upgrade`).
8. **Id 0016 sin fila de roadmap**: la rama `feature/0016-close-notice` ya lo reserva y `sdd id claim` respondió «sin remoto: la 0016 vale (contador local)». No añado fila; la feature se archiva con el cierre.
- Previsión de coste: ver tabla (constitución, Art. 5): 12 sujetos, ~36 min aproximados (~3 min por sujeto, sin medir; el patch 0006 no registró tiempos) y 8,40 $, con el precio de `tech-stack.md`. El revisor de la spec (y su segunda ronda) no entra en este presupuesto: no es un sujeto de la skill.
9. **Gate de cierre**: `node --test && node scripts/lint.mjs`, el de `operations.md`; la constitución, Art. 2, dice solo `node --test`, y `operations.md` añade `lint.mjs`.

### Hallazgos de la review

1. **Aceptado (Crítico)** — fixture y aserciones de c1/c2 sin fijar → decisión 5 los fija (fixture, aserciones literales).
2. **Aceptado (Crítico)** — el literal solo fijaba el caso vacío → decisión 1 ordena el formato «Se cierra: … Pendiente: …» en ambos casos.
3. **Aceptado** — qué hace falta para seguir si c1 pasa solo → decisión 5 bis.
4. **Aceptado** — la definición de pendiente no estaba en el texto de la skill y la exclusión del roadmap no tenía escenario → definición dentro del literal (decisión 1) y aserción negativa en c1; «"No entra" sin fila» sale de la decisión 2.
5. **Aceptado** — criterio de fracaso «lista el roadmap» sin verificación → aserción negativa de c1.
6. **Aceptado** — la batería con enunciados es entregable oculto → en Scope, en decisión 5 y en el tamaño.
7. **Aceptado** — faltaban los minutos del Art. 5 → decisión «Previsión de coste» y tabla, aproximados.
8. **Aceptado** — el coste del revisor → dicho aparte: no es sujeto de la skill.
9. **Aceptado** — la afirmación de `sdd id claim` → decisión 8 cita la salida literal.
10. **Aceptado** — el gate → decisión 9.

Segunda ronda (sin tercera):
1. **Aceptado (Crítico)** — fixture no ejecutable → decisión 5: la feature inventada «Recordatorio de reserva» va en el propio enunciado, sin ficheros nuevos.
2. **Rechazado (Crítico)** — las filas `Próximo` 0010, 0011 y «Avisos por correo» sí existen en `.docs/sdd/roadmap.md` (líneas 7–9, leído en esta sesión); la decisión 5 ahora lo dice.
3. **Aceptado** — formato de `battery.md` y evaluación → decisión 5 (secciones bajo la tabla, `plan.mjs` sigue dando 2,80 $, aserciones por texto).
4. **Aceptado** — «aparcado» y «menores diferidos» sin escenario → recortados de la definición y del literal.
5. **Aceptado** — umbrales RED/GREEN → decisión 5 bis.
6. **Rechazado** — `operations.md` está leído: su «Gate de cierre» es `node --test && node scripts/lint.mjs`; la decisión 9 ya declara la diferencia con el Art. 2.
7. **Rechazado** — la evidencia es `sdd-kit.json` (`"version": "3.0.0"`) y la ausencia de `steering/` en `.docs/sdd/`; el gate en «Dónde se prueba» es red de seguridad, no un criterio del Intent.
8. **Aceptado** — exclusión de la `description` → decisión 10.
9. **Rechazado** — `plan.mjs` se ejecutó y dio 2,80 $ por tanda; el fixture no añade coste, va en el enunciado.
10. **Rechazado** — el dev-lead es quien aprueba la spec; su nombre va en «Aprobaciones» al aprobar (`git config user.name`), no antes.

### Decisiones tomadas con el dev-lead

- Alcance: el paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «decidido con el dev-lead: el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente».
- La entrevista está hecha: no hay más preguntas de diseño — «La entrevista ya está hecha».

## Intent

`aviso-cierre` se usa al cerrar una feature. Hoy el aviso dice qué se cierra y nada de lo que queda sin hacer, así que quien lo lee no sabe si el cierre deja cabos. Éxito: en 2 de 2 sujetos de c1 el aviso cumple la aserción de la decisión 5, y en 2 de 2 de c2 dice «Pendiente: nada». Fracasaría, aunque «funcione», si el aviso listara el roadmap entero en cada cierre o si omitiera la línea cuando no hay pendiente.

## Scope

- Entra: la frase del paso 1 de `skills/aviso-cierre/SKILL.md` (decisión 1), los enunciados y aserciones de c1 y c2 en `tests/batteries/aviso-cierre/battery.md` (decisión 5) y su prueba con sujetos.
- No entra: el paso 2 («Corre el gate»), la `description` de la skill, nuevos pasos, `capabilities/`, el código de `src/` y las demás skills.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Literal «1. Di qué se cierra.» | `skills/aviso-cierre/SKILL.md:8` | Scope: se reescribe (decisión 1) |
| Tabla de la batería (sin enunciados) | `tests/batteries/aviso-cierre/battery.md` | Scope: se añaden enunciados y aserciones (decisión 5) |
| Nombre `aviso-cierre` | `.docs/sdd/tech-stack.md:6`, `tests/batteries/aviso-cierre/battery.md:1`, `.docs/sdd/specs/…patch-0006-aviso/patch.md:3` | Sin cambio: el nombre no cambia; el patch 0006 es evidencia histórica |

- Filas que implementa: nada: comprobado con `git grep -niE "0016|close-notice|queda pendiente"` fuera de `specs/` (sin resultados; la 0016 no tiene fila en `roadmap.md`).

## Approach

Una sola edición de texto en el paso 1, con el literal de la decisión 1, y una prueba RED → GREEN con sujetos Sonnet de la batería existente (c1, c2), según la constitución, Art. 5. Si el RED no exhibe el fallo (los sujetos ya dicen lo pendiente sin la frase), no se edita la skill: se para y decide el dev-lead.

## Dónde se prueba

- Que el aviso nombre lo pendiente (c1) y diga «Pendiente: nada» (c2): sujetos Sonnet que cierran una feature con la skill, como los de la batería `aviso-cierre` y el patch 0006.
- Que el gate sigue en verde: `node --test && node scripts/lint.mjs` (gate de cierre); no depende del cambio, es la red de seguridad.

## Términos y ADR

- Términos resueltos: pendiente — lo que la feature que se cierra deja sin hacer o aparcado (decisión 2).
- ADR candidatas: ninguna

## Delta de comportamiento

Ninguno: no hay capacidades (herramientas).

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 4 (c1 ×2, c2 ×2) · ~12 min | 2,80 |
| GREEN | 4 (c1 ×2, c2 ×2) · ~12 min | 2,80 |
| Una tanda de REFACTOR | 4 (c1 ×2, c2 ×2) · ~12 min | 2,80 |
| Controles | 0 — sin control propuesto | 0,00 |
| Medición tras la revisión final | 0 — no se mide aparte | 0,00 |
| Suma | 12 · ~36 min (aprox.) | 8,40 |

Precio: ~0,70 $ por sujeto (`tech-stack.md`; `SCENARIOS="c1 c2" N=2 node scripts/plan.mjs tests/batteries/aviso-cierre/battery.md` da 2,80 $ por tanda). El patch 0006 midió ~0,31 $ por sujeto: es más barato, pero la previsión usa el precio declarado. Si la prueba lo supera, REFACTOR incluido, se para y decide el dev-lead.

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
