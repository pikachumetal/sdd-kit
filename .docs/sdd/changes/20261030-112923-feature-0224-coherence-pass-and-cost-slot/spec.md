---
id: 20261030-112923-feature-0224-coherence-pass-and-cost-slot
feature: 0224
title: La regla del entorno en la clasificación y el hueco «Previsión de coste» de la spec
mode: full
profile: delegate
status: done
created: 2026-10-30
author: agente con el dev-lead
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-30
---

# Spec — La regla del entorno en la clasificación y el hueco «Previsión de coste» de la spec

🦆 Quien arranca un cambio en un worktree recién abierto ya no ve un `Cannot find package 'fecha'` al reproducir el fallo: el kit instala antes de ejecutar nada, también al clasificar. Y una spec que edita una skill trae una tabla de coste con cinco filas (RED, GREEN, una tanda de REFACTOR, controles y medición tras la revisión final) y su suma, donde la 0221 preveía 12 sujetos y acabó en 24. Tres arreglos que traía la fila se quedan fuera, porque un sujeto sin ellos ya hizo lo correcto.

## Capacidades

- Modificadas: `routing` — «Los carriles patch y config preparan el entorno antes del primer test»: la regla pasa a la clasificación.
- Modificadas: `feature-flow` — requisito nuevo, «La spec que edita una skill con sujetos prevé su coste».

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (1) · tamaño: ~25 líneas en 3 ficheros, más la batería
- Mínimo razonable: ninguna — deja sin mirar si otro requisito vivo nombra el sitio de la regla; lo he buscado yo (`Project Setup` en `capabilities/`: solo `routing.md:263`).

1. **Tres frentes salen de la spec por el RED, con tu regla de la petición** («Si un frente sale limpio, sácalo de la spec y dilo»). Un sujeto Sonnet por frente, kit de `6984dc2e`, 1,36 $ en total (`red/red/out/`):
   - **`ADDED` contra un requisito vivo** (`co1`): limpio. El sujeto leyó la capacidad, vio «Un comando con varios días trata cada día aparte» y lo pasó a `MODIFIED`. No se cambia «For each MODIFIED».
   - **Topes en el repaso** (`co2`): limpio. Midió el tope de la carpeta, 52 / 60, y escribió la tabla sin que el repaso lo pida. No se añade (b).
   - **Test movido a una tarea con caché** (`co3`): limpio. Su decisión 1 dice que los `inputs` de `fast` no cubren `git ls-files`. No se añade (d).
2. **Esos tres siguen siendo posibles falsos negativos.** Los moldes son pequeños y el fallo de campo salió en capacidades de cientos de líneas y sesiones largas; `tech-stack.md` avisa de ello. Por eso sus filas de deuda no se saldan: pasan a «Esperar otro caso», con el veredicto `co1`, `co2` o `co3`. Es menos de lo que pedía tu prompt, que las daba por saldadas aquí. Si prefieres otra tanda con un molde más duro, ~0,35 $ por sujeto, dilo en «Cambios».
3. **(e) se queda, más estrecho que lo que pedía la fila.** `co4` falló la fila CO4 solo en parte: no previó controles ni medición tras la revisión final, y sí usó ~0,70 $ de `tech-stack.md` y contó una tanda de REFACTOR. El hueco lleva las cinco filas de todos modos: es un elemento omitido (Art. II) y el mismo hueco fija el precio.
4. **La 0255 no lleva sujetos nuevos antes de la spec.** Su RED ya existe a coste cero: `ws3-1` de `red2/` y de `green/` en la carpeta de la 0253 corren `node --test` antes de instalar.
5. **Corte distinto del de tu prompt: esta parte también edita `skills/sdd-start-patch/SKILL.md`**, una frase borrada. La 0255 es mover la regla, y sin borrarla allí se quedaría duplicada. Saldo de esa skill: baja.
6. **«Un patch que añade texto…» no se salda aunque lo pidieras**: además del frente `co2`, su mitad de patch («mide el tope antes de commitear y nombra lo recortado en `patch.md` §3») vive en `sdd-start-patch`. Esa mitad pasa a la 0264.
7. **Id de la segunda parte: 0264**, reservado con `sdd id next --reserve`. Lleva (a), lo que queda de (c) y la 0250, sin la línea `Evidencia:`, con `parent: 0224`. Tamaño S. Aún no tiene `Patch:`: son varios tests de comportamiento nuevo.
8. **Filas de deuda con «Actuar → 0224» que la fila no nombraba** pasan también a la 0264: «En lite, la apertura llega después de la primera edición», la parcial de la 0199, «El paso 6 de `sdd-roadmap` commitea…» y «Al partir una fila…». Si no, apuntarían a una fila cerrada sin arreglarse.
9. **Predicado del hueco**: `*(solo si la spec edita una skill que se prueba con sujetos)*`, como «Topes de palabras». Los proyectos consumidores sin sujetos lo borran.
10. **Lo que paga el hueco en `sdd-templates`** (Principio «una pieza entra, otra sale»): salen de `spec-template.md` las ayudas «**Siguiente paso**» y «**Modo lite**», que ya dicen `sdd-propose` y `sdd-templates/SKILL.md:73`, la ayuda de «Estimación y esfuerzo», las de «Scope» y «Approach» y «Si ningún test limita lo que edita, borra la sección». Son pasos de contexto, no instrucciones que se midan aparte; `co4` y `s1` hacen de control.
11. **Tamaño de la fila 0224**: de M a S.
- Prueba del delta en una copia de `.docs/sdd`: `capability merge` → routing.md: sustituido «Los carriles patch y config preparan el entorno antes del primer test» · feature-flow.md: añadido «La spec que edita una skill con sujetos prevé su coste».
- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no aplica · sujetos sonnet, en una tanda por escenario · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar

### Decisiones tomadas con el dev-lead

- Partir la 0224 y hacer aquí solo la primera parte — «con lo que me dices de la 224» (2026-10-30)
- La línea `Evidencia:` no se añade a `launch-prompt-template.md` — «La línea `Evidencia:` que pide (c) en launch-prompt-template.md: no se añade»
- El saldo de palabras de cada skill editada queda igual o baja — «El saldo de palabras de cada skill editada queda igual o baja (regla 6 de CLAUDE.md)»
- Un frente con dos casos de campo se reproduce antes de la spec y sale si queda limpio — «Si un frente sale limpio, sácalo de la spec y dilo»

## Intent

La regla del entorno vive en dos pasos que corren después del primer punto que ejecuta código: la clasificación de `sdd-propose`. Y la previsión de coste de una spec no tiene hueco, así que omite tandas enteras: 0221, 12 sujetos previstos y 24 reales, con tres paradas por dinero; 0236, ~11 $ previstos y 23,78 $ reales, con dos paradas. Éxito: ningún sujeto de `ws3` ejecuta código antes de instalar, y la spec de una skill sale con las cinco filas y su suma. Fracasaría si alarga una skill: el saldo de palabras de las tres queda igual o baja.

## Scope

- Entra: `skills/sdd-propose/SKILL.md` (paso 2 y paso 2 de «Config lane»), `skills/sdd-start-patch/SKILL.md` (paso 1), `skills/sdd-templates/templates/spec-template.md`, `tests/batteries/sdd-propose/`, `.docs/sdd/roadmap.md`, las capacidades `routing` y `feature-flow`.
- No entra: (b), (d) y «For each MODIFIED» (decisión 1); (a), (c) y la 0250, que van a la 0264; la forma del prompt de arranque, de la 0262.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Antes de ejecutar el código o un test, prepara el entorno» | `skills/sdd-start-patch/SKILL.md:21` | Scope: se borra |
| «Prepare the environment with Step 2 of `sdd-worktrees`» | `skills/sdd-propose/SKILL.md:72` | Scope: pasa al paso 2 |
| AND «`sdd-start-patch` y el carril config de `sdd-propose` nombran ese paso» | `capabilities/routing.md:264` | delta, `MODIFIED` |
| Ayudas «**Siguiente paso**» y «**Modo lite**» de la spec | `spec-template.md:24-25` | decisión 10; el lite sigue en `sdd-templates/SKILL.md:73` |
| Ayudas de «Scope», «Approach» y «Estimación y esfuerzo» y «borra la sección» de «Topes» | `spec-template.md` | decisión 10; los cubren `spec-writing.md:15-16` y sus encabezados; `co2` y `co3` omiten bien las secciones condicionales |
| «—the branch a launch prompt opened—» y la cita de `k5` | `skills/sdd-propose/SKILL.md`, «Config lane» paso 5 | Scope: pagan el saldo; la cita sigue en la batería |

- Filas que implementa: 0224, 0255 → `.docs/sdd/roadmap.md` (fila 0224, reducida; fila 0255, cerrada) y las filas de deuda que apuntan a ellas; nada más: comprobado con `grep -rln 0224 skills .docs/sdd/capabilities .docs/sdd/*.md tests/batteries` → solo `roadmap.md`.

## Approach

La regla se mueve, sin regla nueva: una frase en el paso 2 de `sdd-propose`, que cubre «reproduce a reported failure» y los gates de los carriles posteriores, sustituye a las otras dos. El hueco sigue la forma de «Topes de palabras».

## Dónde se prueba

- Entorno antes del primer código: batería de `sdd-propose`, `ws3` con n = 2 y `ws1` y `ws2` de control (`WS`).
- Hueco de coste: batería de `sdd-propose`, `co4` con n = 2 (`CO4`), `s1` de control.
- Tres frentes retirados: `co1`, `co2` y `co3` se quedan en la batería como controles de no regresión, n = 1 (se repiten en el GREEN, `tech-stack.md`).
- Saldo de palabras: `wc -w` antes y después, en el walkthrough.

## Previsión de coste (Art. I)

Precio: 0,34 $ por sujeto de spec (medido en este RED: 1,36 $ / 4) y 0,39 $ por sujeto `ws` (0253: 2,33 $ / 6). `tech-stack.md` da ~0,70 $ solo para `sdd-archive`, que cierra una feature entera.

| Tanda | Sujetos | $ |
| --- | --- | --- |
| RED, ya gastado | 4 (`co1`-`co4`) | 1,36 |
| GREEN | 7: `ws3` ×2, `co4` ×2, `co1`, `co2`, `co3` | 2,48 |
| Una tanda de REFACTOR | 4: los dos escenarios que pueden fallar | 1,46 |
| Controles | 5: `ws1` ×2, `ws2` ×2, `s1` | 1,90 |
| Medición tras la revisión final | 2 | 0,73 |
| Suma | 22 | 7,93 |

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `routing`

#### MODIFIED — Los carriles patch y config preparan el entorno antes del primer test

- GIVEN un worktree recién creado por un prompt de lanzamiento, sin `node_modules`, en un proyecto cuyas dependencias se instalan con `pnpm install`
- WHEN el carril patch va a correr su primer test, o el carril config su gate
- THEN antes corre el paso 2 de `sdd-worktrees` («Project Setup»), con el gestor de paquetes del proyecto, y el test no falla por un módulo que falta
- AND la clasificación de `sdd-propose` también: al reproducir un fallo, ningún `node --test` ni `node src/…` va antes de `pnpm install`
- REMOVED AND `sdd-start-patch` y el carril config de `sdd-propose` nombran ese paso; no copian sus órdenes
- AND el paso 2 de `sdd-propose` nombra ese paso, sin copiar sus órdenes, y `sdd-start-patch` y el carril config no lo repiten

### Capacidad: `feature-flow`

#### ADDED — La spec que edita una skill con sujetos prevé su coste

- GIVEN un repo con `tests/batteries/aviso-cierre/` y `tech-stack.md` con «un sujeto de `aviso-cierre` cuesta ~0,70 $», y una spec que edita `skills/aviso-cierre/SKILL.md`
- WHEN el agente escribe la spec
- THEN «Previsión de coste» lleva las filas RED, GREEN, una tanda de REFACTOR, controles y medición tras la revisión final, cada una con sus sujetos y sus dólares
- AND cada cifra cita su batería y el precio de `tech-stack.md`, y el total es la suma de las filas
- AND una spec que no edita una skill probada con sujetos no lleva la sección

## Topes de palabras

Medido con el conteo de `cli/test/kit/word-budget.test.ts`. Sin cambio en ningún tope: el saldo de cada skill queda igual o baja.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-propose` | 5.356 / 5.250 y 6.900 / 6.800 (con el margen del 25 %: 6.562 y 8.500) | 1.206 y 1.600 | sin cambio |
| `sdd-start-patch` | 1.940 / 2.300 (con margen: 2.875) | 935 | sin cambio |
| `sdd-templates` | 1.663 / 1.700 y 16.064 / 15.720 (con margen: 2.125 y 19.650) | 462 y 3.586 | sin cambio |

## Enmiendas

- 2026-10-30 — la decisión 10 y «Lo que se retira» nombran todos los recortes hechos para no subir el saldo, sin requisito ni THEN nuevos — lo pidieron los ejes Spec y Código — sin aprobar

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-30 | aprobada: «Apruebo» |
