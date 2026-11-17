---
id: 20261112-163111-feature-0016-close-notice
feature: 0016
title: El aviso de cierre dice también qué queda pendiente
mode: full
profile: delegate
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — El aviso de cierre dice también qué queda pendiente

🦆 Hoy, al cerrar una feature, la skill `aviso-cierre` solo dice qué se cierra: «Cerrada: avisos por correo antes de la reserva». Con este cambio, el aviso dice además qué queda sin hacer: «Cerrada: avisos por correo antes de la reserva» y, debajo, «Pendiente: el aviso por SMS (Task 3, sin hacer)»; y si no queda nada, lo dice: «Pendiente: nada». Se consigue ampliando el paso 1 de la skill, y se prueba con sujetos antes y después, como manda la constitución.

Validación: agente — el único efecto observable es el texto que escribe la skill al cerrar, y lo miden los sujetos de la batería; ninguna persona vería algo que la batería no mida (decisión 7).

## Capacidades

- Ninguna, porque herramientas (la skill `aviso-cierre` es utillaje del proyecto, no comportamiento de salas que vea quien reserva; el kit trata las skills fuera de `capabilities/`, y esta no tiene entrada en ella).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna de la tabla (sin capacidad, contrato, `MODIFIED`, datos ni dependencias; área tocada leída en esta sesión) · tamaño: ~3 líneas de skill + ~10 de batería en 2 ficheros
- Técnica+dominio (sonnet): si los THEN de «Dónde se prueba» los distingue un sujeto sin adivinar y si la «Previsión de coste» cumple el art. 5 de la constitución (señal: edición de skill con sujetos)
- Mínimo razonable: no revisar la spec — dejaría sin mirar que el RED pueda fallar de verdad con el texto actual del paso 1 y que `c2` distinga «nada» de un pendiente inventado

1. Redacción del paso 1: «Di qué se cierra y qué queda pendiente, en dos líneas: «Cerrada: <qué>» y «Pendiente: <lo que el cierre ya conoce: las tareas sin hacer de la feature; no lo inventes>»; si no queda nada, escribe «Pendiente: nada».» — el dev-lead fijó el contenido (qué queda pendiente), no la frase; esta es la mía y lleva la forma (dos líneas), el límite (solo lo conocido) y el caso «nada» para que un cierre sin pendientes no omita la línea.
2. «Pendiente» recoge solo las tareas sin hacer de la feature, que el cierre conoce; deuda y demás quedan fuera (no hay dónde se declare en este proyecto) y el sujeto no inventa — mío; un pendiente inventado es peor que ninguno.
3. El paso 2 («Corre el gate») no cambia — mío, no estaba en lo decidido.
4. Id 0016: la rama `feature/0016-close-notice` ya lo reservó y `ROADMAP.md` no tiene fila con ese id (`git grep 0016` solo da la rama); no añado fila, que es de `sdd-roadmap` si el dev-lead la quiere. `sdd id claim` dijo «la 0016 vale (contador local)»: sin remoto, un clon que reserve el mismo id colisionaría al publicar.
5. Escenarios: `c1` y `c2` de `battery.md` no describían su contenido. Los fijo aquí (ver «Dónde se prueba») y `battery.md` gana una sección «Escenarios» con su texto, que es el prompt que recibe el sujeto: el estado de las tasks viaja en ese texto, sin fichero de fixture aparte. Sin barras verticales en ese texto, para no confundir a `scripts/plan.mjs`, que lee las filas de la tabla; el plan lo comprueba corriendo `plan.mjs` tras añadirla. Es lo único que se toca de la batería (n=2 cada uno, como hoy).
6. Enfoque: A (elegido), frente a B y C (ver Approach).
7. Validación `agente` — mía: ningún humano observa algo que la batería no mida; el dev-lead no nombró la validación y no ha dicho la frase de aprobación por delegación, así que `agente` no se concede solo: lo decide este gate.
8. Previsión de coste: una tanda de REFACTOR y la «Medición tras la revisión final» con N=1 las incluyo yo, porque la constitución las computa y la tanda de REFACTOR es el tope; ~3 min por sujeto es mi estimación, `sin medir` (en el 0006 no se midieron minutos). «Controles» a cero: el RED con el texto actual ya hace de control.
9. Ejemplo del 🦆 y de los fixtures: la fila 0008 del roadmap («Avisos por correo antes de la reserva»), neutra frente a la terminología de PRODUCT (cancelación/anulación).
10. Política de modelos: revisor de la spec en Sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de la batería en Sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar.
11. Criterio de comparación: la línea «Pendiente: nada» se compara tras quitar espacios de los bordes y un punto final; mayúsculas, no. Es el mismo criterio en el Intent, en c2 y en la decisión 1 — mío.
12. Gate en los escenarios: «corre el gate» = el comando literal `node --test && node scripts/lint.mjs` visible en la transcripción del sujeto tras el aviso; no se exige que dé verde en el fixture — mío.
13. Coherence pass: sin delta que fusionar (no hay capacidad), así que `sdd capability merge` sobre copia no aplica; el resto del pase está hecho y consta en «Lo que se retira o cambia de forma».
14. Constitución 5: la previsión va en la spec y, si la prueba la supera —una tanda de REFACTOR incluida—, se para y decide el dev-lead.

### Hallazgos de la review

1. **Aceptado** — Crítico: c1/c2 sin contenido, THEN no verificable → fixtures definidos con datos exactos en «Dónde se prueba» y copiados a `battery.md` (decisión 5; Scope).
2. **Aceptado** — Crítico: nada distingue un pendiente real de uno inventado → c2 exige «Pendiente: nada» **y ninguna otra cosa** tras «Pendiente:»; c1 exige exactamente el pendiente del fixture, y cualquier otro falla.
3. **Aceptado** — Importante: solo viñetas → escenarios GIVEN/WHEN/THEN en «Dónde se prueba».
4. **Aceptado** — Importante: «paso 2 intacto» lo prueba el repo, no la batería → cada escenario añade AND: el sujeto corre el gate tras el aviso (se ve en su transcripción).
5. **Aceptado** — Importante: la redacción no llevaba forma ni límite → decisión 1 reescrita; el Approach dice «~3 líneas».
6. **Aceptado** — Importante: faltaban minutos → columna Minutos en la previsión (estimación mía, `sin medir`, decisión 8).
7. **Aceptado** — Importante: decisiones no listadas → decisiones 7 y 8; la línea «Mínimo razonable» ya dice lo que deja sin mirar.
8. **Aceptado** — Menor: «docs» sin respaldo → «herramientas», con su razón.
9. **Aceptado** — Menor: id y fila de roadmap → decisión 4 dice el riesgo y quién crea la fila.
10. **Aceptado** — Menor: ejemplo fuera de la terminología → decisión 9.

Segunda ronda (un Crítico no hubo; sin tercera):

11. **Aceptado** — Importante: no se dice dónde vive el fixture → el estado viaja en el texto del escenario, y se comprueba `plan.mjs` (decisión 5; Scope).
12. **Aceptado** — Importante: `profile: delegate` vs decisión 7 → decisión 7 reescrita; no decía que la spec no fuera delegate, sino que la delegación de la aprobación no se ha dicho.
13. **Aceptado** — Importante: c1 sin «sin deuda» y dos formas → c1 declara sin deuda ni otras tasks pendientes, y basta nombrar «Task 3» o «SMS».
14. **Aceptado** — Importante: «deuda declarada» sin definir → fuera del paso 1; solo tasks sin hacer (decisiones 1 y 2).
15. **Aceptado** — Importante: la previsión no dice cuántos GREEN cubre → asume GREEN al primer intento; revisores aparte, ~0,3 $ por ronda, fuera del art. 5 (que cuenta sujetos).
16. **Aceptado** — Menor: medición final fuera del Scope → entra en Scope.
17. **Aceptado** — Menor: argumento contra B → corregido: lo que se desplaza es el gate.
18. **Aceptado** — Menor: «corre el gate» sin criterio → decisión 12.
19. **Aceptado** — Menor: «línea exacta» vs punto final → decisión 11.
20. **Aceptado** — Menor: «sin review» y citas sin verificar → línea reformulada; `patch.md:3` y `operations.md:16` las verifiqué yo con `git grep` en el pase de coherencia.

### Decisiones tomadas con el dev-lead

- El paso 1 de `skills/aviso-cierre/SKILL.md` dice también qué queda pendiente — «decidido con el dev-lead: el paso 1 de skills/aviso-cierre/SKILL.md dice también qué queda pendiente».
- La spec se escribe y se presenta para aprobar — «Escribe la spec en su carpeta y preséntamela para aprobar».

## Intent

Hoy el aviso de cierre, `skills/aviso-cierre/SKILL.md` paso 1, solo dice qué se cierra. Quien lo lee no sabe si el trabajo queda completo o si algo se arrastra a otra feature. Se quiere que el mismo aviso lo diga. Éxito: en 2 de 2 sujetos de c1 el aviso nombra exactamente el pendiente del fixture; en 2 de 2 de c2 escribe «Pendiente: nada» y nada más tras los dos puntos (decisión 11). Fracaso aunque funcione en apariencia: que el sujeto invente pendientes, o que omita la línea cuando no hay.

## Scope

- Entra: reescribir el paso 1 de `skills/aviso-cierre/SKILL.md` (decisión 1); añadir a `tests/batteries/aviso-cierre/battery.md` una sección «Escenarios» con c1 y c2 de abajo (decisión 5); su prueba con sujetos RED → GREEN (constitución, art. 5) y la medición tras la revisión final de `sdd-verify`, que va en la previsión.
- No entra: el paso 2; otras skills; `capabilities/`; una fila de roadmap para el 0016 (decisión 4); cambiar las filas ya existentes de la tabla de la batería (Id, Paso, n, Modelo).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Paso 1 `Di qué se cierra.` (cambia de forma) | `skills/aviso-cierre/SKILL.md:8` | Scope: se reescribe (decisión 1) |
| Nombre `aviso-cierre` | `.docs/sdd/steering/operations.md:16` (comando de previsión) | Nada: nombra la skill, no su texto |
| `aviso-cierre` / `Di qué se cierra` en evidencias | `.docs/sdd/specs/20260915-090000-patch-0006-aviso/patch.md:3`, `tests/batteries/aviso-cierre/battery.md:1` | Nada: evidencia histórica y título de la batería |

- Filas que implementa: nada: comprobado con `git grep -n "0016"` en todo el repo, fuera de `.docs/sdd/changes/` (sin hits); y `git grep -niE "(pasos?|steps?) [0-9]+\b"` fuera de evidencias, sin hits (nadie cita «paso 2»).

## Approach

- A. Ampliar el paso 1 en la misma frase, con la forma y el caso «nada» explícitos — cuesta ~3 líneas; el cuerpo de la skill sigue en dos pasos.
- B. Añadir un paso nuevo «2. Di qué queda pendiente» y desplazar el gate a 3 — cuesta renumerar el gate (hoy nadie cita «paso 2»); el paso 1 queda como está y la frase del dev-lead habla de él.
- C. Plantilla fija de aviso en un fichero aparte — cuesta un fichero para dos líneas; sobredimensionado.
- Elegido: A — es lo que dijo el dev-lead («el paso 1 … dice también qué queda pendiente») y no renumera nada.

## Dónde se prueba

Superficie: sujeto Sonnet de la batería `aviso-cierre`, que cierra una feature entera y recorre los dos pasos.

**c1 — cierre con pendiente.** GIVEN la feature «Avisos por correo antes de la reserva» con 3 tasks, la 1 y la 2 hechas y la Task 3 («aviso por SMS») sin hacer, y sin más tasks pendientes ni deuda declarada · WHEN el sujeto aplica `aviso-cierre` · THEN el aviso trae la línea «Cerrada: …» y una línea «Pendiente: …» que nombra «Task 3» o «SMS» (basta una) y ningún otro pendiente · AND el sujeto corre el gate después del aviso (criterio de la decisión 12).

**c2 — cierre sin pendientes.** GIVEN la misma feature con las 3 tasks hechas y ninguna deuda declarada · WHEN el sujeto aplica `aviso-cierre` · THEN el aviso trae «Cerrada: …» y la línea «Pendiente: nada» (criterio de la decisión 11); cualquier otro texto tras «Pendiente:» falla · AND el sujeto corre el gate después del aviso (criterio de la decisión 12).

**RED.** Con el texto actual c1 y c2 deben fallar (no hay línea «Pendiente»); si c2 pasara con el texto actual, el escenario no distingue y se rehace antes del GREEN.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: no hay capacidad afectada (ver «Capacidades»).

## Previsión de coste

| Tanda | Sujetos (batería) | $ | Minutos (sin medir) |
| --- | --- | --- | --- |
| RED | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 | ~12 |
| GREEN | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 | ~12 |
| Una tanda de REFACTOR | `SCENARIOS="c1 c2" N=2` → `suma: 4 sujetos · coste previsto: 2.80 $` | 2.80 | ~12 |
| Controles | a cero: el RED con el texto actual ya hace de control | 0 | 0 |
| Medición tras la revisión final | `SCENARIOS="c1 c2" N=1` → `suma: 2 sujetos · coste previsto: 1.40 $` | 1.40 | ~6 |
| Suma | 14 sujetos | 9.80 | ~42 |

La tabla asume el GREEN al primer intento: otro GREEN la supera y para (decisión 14). Los revisores de spec van aparte (~0,3 $ por ronda, dos rondas hechas), porque el art. 5 cuenta sujetos. Precio por sujeto: 0,70 $, de `operations.md`; el `patch.md` del 0006 apuntó ~0,31 $, y aquí manda `operations.md`, que es lo que da el comando. Minutos: ~3 por sujeto, estimación mía (decisión 8).

## Enmiendas

Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
