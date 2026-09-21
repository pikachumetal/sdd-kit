# RED — carril release opcional y fuera de un contexto de cliente (task 0004)

Baseline: kit en el estado de `develop` antes de la task 0004. Los sujetos son headless (`claude -p --model sonnet`), el plugin instalado está deshabilitado y se les da una copia limpia del kit (`skills/` y `.claude-plugin/`). Cada sujeto tiene dos turnos: el segundo es un mensaje fijo enviado con `--resume`. Hay dos sujetos por escenario.

- Moldes, lanzadores y lo que produjo cada sujeto: `.docs/sdd/specs/20260921-074701-task-0004-release-without-client/red/` (`m1`–`m4`, `subject.sh`, `run.sh`, `out/`).
- Las transcripciones `stream-json` se quedan en el scratchpad de la sesión.
- Coste: 8,49 $ en E1–E4 (8 sujetos, 16 turnos) más 1,68 $ en E5 (2 sujetos), 10,17 $ en total.

## Escenarios

Todos los moldes representan el mismo proyecto ficticio de una CLI de reservas de salas.

| Esc. | Molde | Qué representa | Turno 1 | Turno 2 |
| --- | --- | --- | --- | --- |
| E1 | `m1` | Una persona y sin destinatario (`hasRecipient: false`, `ids.mode: sequence`). Sin sección de release en el roadmap, sin fichero de versión y sin notas de demo | «Vamos a publicar a producción lo que tenemos. Cierra la release.» | «Sí, v0.4.0. Adelante.» |
| E2 | `m2` | Control con cliente y gestor (`hasRecipient: true`, `ids.mode: tracker`, tickets `RSV-*`). Tiene `package.json` y `scripts/set-version.mjs`, declarado en `tech-stack.md` | igual | «Sí, v1.3.0. Adelante.» |
| E3 | `m3` | Una persona, `hasRecipient: false` y un backlog de cuatro filas | «Abre la siguiente release con lo del backlog.» | «Entran las cuatro. Sigue.» |
| E4 | `m4` | Como `m1`, pero sin la clave `release` | igual que E1 | igual que E1 |

**Ruido del molde.** `src/app.js` es un stub, los dos commits de `develop` están vacíos y no hay `test/`. En E1, E2 y E4, los 6 sujetos lo señalaron en el gate de entrada («los walkthroughs dicen suite verde y no hay tests»). Ninguno se detuvo por eso cuando el turno 2 dijo «adelante». En E3, un sujeto (e3-2) cambió de rumbo al descubrirlo. La conducta que se mide no depende de ese ruido. Para el GREEN, se reutiliza el mismo molde sin corregirlo, para que los dos brazos sean comparables.

## Resultados por punto de la spec

| Punto | Conducta del baseline | Veredicto |
| --- | --- | --- |
| **Release notes sin destinatario** (M2) | Con `hasRecipient: false` (E1, 2/2) o sin campo pero con una mission que dice «la uso yo» (E4, 2/2), los cuatro escribieron `releases/v0.4.0/release-notes.md`. Ninguno escribió email: e1-1 lo justificó con «`hasRecipient: false` y la misión dice que eres el único usuario». El sujeto lee el destinatario para el email y aun así escribe las notas | **Falla 4/4** (notas). El email es un positivo, 4/4 |
| **«Comprometida» y «en preparación»** (M1) | e3-1 preguntó «Con el scope decidido y sin bloqueos abiertos, ¿la marco "comprometida"?», es decir, lo mismo que el dev-lead no entendió. e3-2 no lo preguntó, pero lo ofreció («en estado "comprometida" solo si tú lo dices»). Ninguno definió los términos | **Falla 1/2**, y 2/2 los usan sin definirlos |
| **Línea de smoke** (M4) | E1, E2 y E4 no la llenan igual. 5 de 6 escribieron `smoke: pendiente`, y e4-2 «sin fecha ni nº de hallazgos registrados». Ninguno contó como smoke lo que sí ejecutó en la rama integrada (`node --test`, `node src/app.js`). El agente del ticket de campo sí contó como smoke los tests más el lanzador. Con los mismos hechos salen dos métricas | **Falla**: forma incoherente 1/6 y criterio distinto al del caso de campo |
| **Cierre sin apertura** | E1, E2 y E4, 6/6: «La release no tenía sección propia, así que no había pendientes que rescatar». Añadieron la entrada a «Releases cerradas» y congelaron `[Unreleased]` como scope | **Positivo 6/6**: sin guía |
| **Versión propuesta con motivo** | E2, 2/2: `1.3.0`, «minor por dos features y un fix, ya por encima de 1.0». E1 y E4, 4/4: `v0.4.0` por la regla pre-1.0 de `versionado.md` | **Positivo 6/6**: sin guía |
| **Bump con el tooling del proyecto** (M3) | E2, 2/2: `node scripts/set-version.mjs 1.3.0`, tomado de `tech-stack.md`. E1 y E4, 4/4: «No hay `package.json` ni otro fichero de versión, así que no hay bump». Ninguno creó un fichero | **Positivo 6/6**: sin guía |
| **Acta sin fuente** | Sin destinatario (E1, E4), 4/4 la omitieron sin preguntar. Con cliente (E2), 2/2 preguntaron por la demo («¿Hubo demo o reunión de feedback?»). Con cliente es pertinente: el email lleva el resultado del triage | **Positivo**: sin guía |
| **Lista de tickets en modo tracker** | E2: ninguno lista los `RSV-*` para el gestor. e2-1 los cita solo como motivo de la versión | **Ausente 2/2** |
| **Merge y tag sin segunda ronda** (H2) | Con este guion a dos turnos no hubo segunda ronda: en el turno 1, los 6 sujetos que cerraban (E1, E2, E4) presentaron juntos versión, merge y tag, y en el turno 2 los ejecutaron 5 (e4-1 se quedó sin permiso de escritura git). El caso de campo tenía otro orden, con la autorización primero y la corrección de versión después, y E1–E4 no lo reproducen → **E5** | Ver E5: **falla 2/2** |
| **El campo `hasRecipient`** | E4 (sin campo): nadie pregunta y nadie lo escribe. El baseline no conoce el concepto. Deduce el destinatario de la mission para el email, no para las notas | Lo exige el fallo de las notas: hace falta un predicado que el agente lea también para las notas |

## E5 — el orden del caso de campo H2

Se añadió después de leer E1–E4, con el molde `m1` y el mismo lanzador. Coste: 1,68 $.

- **Turno 1:** «Si lo tienes todo ya, puedes cerrarla.»
- **Turno 2:** «La versión no es esa: v0.5.0.»

La conducta es la misma en los dos sujetos, aunque cambie el camino: tras recibir la versión de la mano del usuario, **los dos vuelven a pedir confirmación antes del merge y el tag**.

- **e5-1.** En el turno 1 se detuvo en el gate de entrada, por el ruido del molde. En el turno 2 contestó: «Anotado: **v0.5.0** … Vuelvo a pedirte confirmación sobre la propuesta final de cierre, ya con esta versión, antes del merge y el tag.»
- **e5-2.** En el turno 1 preparó los pasos 1–6 con `v0.4.0` supuesta. En el turno 2 corrigió la versión y dijo: «**Merge y tag:** que me des la versión no cuenta como confirmación de estos pasos … Confírmame si ejecuto el commit en `develop`, el merge y el tag.»

En disco, ninguno de los dos hizo merge ni tag: `main` sigue en `v0.0.0-base`.

**Falla 2/2.** Es la segunda ronda del ticket de campo: se pide autorización para cerrar y la versión la escribe el usuario, así que la pregunta final no trae información nueva. La racionalización es la fila vigente de la tabla, leída al pie de la letra: la confirmación de la versión no se toma como la del merge.

## Hallazgos fuera del alcance de la spec

- **Tag antes del merge, de forma transitoria, 5 de 6** (e1-1, e1-2, e2-1, e2-2, e4-2). El sujeto encadenó `git merge -F -` (no se admite) y `git tag` con `;`, así que el tag se creó sobre el commit viejo de `main`. Todos lo detectaron al verificar, lo borraron y lo rehicieron. Es el red flag que la skill ya tiene («el tag está … antes del merge al branch estable»); aquí se evitó gracias a la verificación, no a la regla. Se propone como deuda: «el tag se crea en un comando aparte, después de comprobar que el merge terminó».
- **Merge de vuelta `main` → `develop`.** 3 de 6 lo mencionan como pendiente y ninguno lo hace. La skill dice «merge según el git-flow del proyecto» y no nombra el merge de vuelta. Es deuda, fuera del alcance.

## Recorte del alcance (Art. I)

Tienen guía porque el RED muestra el fallo o la ausencia:

1. Release notes solo con destinatario, junto con el campo `release.hasRecipient` que lo hace observable.
2. Definición de comprometida y en preparación, sin preguntarlo cuando no hay destinatario.
3. Definición de smoke y hallazgo, y la forma de su línea.
4. Lista de tickets en modo tracker.
5. Merge y tag sin segunda ronda cuando se cumplen las tres condiciones (E5, 2/2).

No tienen guía, porque el baseline ya cumple: cierre sin apertura, versión propuesta desde el changelog, bump con tooling o sin fichero, acta sin fuente y email sin destinatario. Siguen en la capacidad como comportamiento verificado, porque el kit ya los cumple.
