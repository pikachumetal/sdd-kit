# Perfiles de control y gates

Cuánto para el agente lo elige el usuario con un perfil. Cada gate de la tabla dice qué hace en cada uno. Contrato de las tasks 0005, 0006, 0012, 0021 y 0022: no lo dupliques, enlázalo.

## Perfiles

- **`pair`** — para en todos los gates de la tabla.
- **`delegate`** *(default)* — para en la spec, los desvíos y la validación; sin gate en el plan.
- **`unattended`** — no para en ningún punto hasta terminar la release, salvo el merge a `main`, el tag y las acciones hacia fuera (push, PR, publicar), que siempre decide una persona.

La primera pregunta de la entrevista, sola en su turno, confirma el perfil vigente y ofrece cambiarlo para esa task.

## Precedencia

1. `profile:` en el frontmatter de `spec.md` — la task. Omitido, hereda.
2. `Perfil de control: <perfil>` justo bajo el encabezado de la sección de la release en el roadmap.
3. `control.profile` en `sdd-kit.json` — el proyecto. Default `"delegate"`.

Manda el primero que exista, de arriba abajo: task sobre release, release sobre proyecto.

**Cambio de perfil a media task**: una aprobación delegada («ve tú solo hasta el smoke», dicha en `pair`) cambia el perfil de la task. Se escribe `profile:` en el frontmatter y una fila en «Aprobaciones»: fecha y, en «Estado», `perfil → <perfil>: «<frase literal>»`. Sin esa frase literal el perfil no cambia — es la misma regla del atajo autoconcedido.

## Gates por perfil

| Punto | `pair` | `delegate` | `unattended` |
| --- | --- | --- | --- |
| Primera pregunta (carril, modo, lite, perfil, enunciado desde la rama) | pregunta | pregunta | decide y registra |
| Review de spec recomendada | pregunta antes de presentar | pregunta antes de presentar | decide y registra |
| Spec | para | para | la aprueba el agente con las decisiones registradas |
| Plan | para | sin gate: comprueba escenario → task y sigue | igual que `delegate` |
| Tras cada task | para | sigue | sigue |
| Desvío (cambio a la spec aprobada) | para · `## Enmiendas` | para · `## Enmiendas` | opción más conservadora, enmienda sin aprobar; si bloquea, `⏸️ aparcada` |
| Freno de alcance (3.er fix, salida observable, fila cambiada en la base) | para | para | opción conservadora, enmienda sin aprobar |
| Salida del plan | ruling + «Me salí del plan en…» | ruling + «Me salí del plan en…» | ruling + informe |
| Validación | para | para | diferida al smoke de la release (🧪) |
| Merge a develop | presenta la política y espera | aplica el bloque `merge` completo; sin él, pregunta | igual que `delegate` |
| Merge a main, tag, push, PR, publicar | persona | persona | persona |

Más:
- La regla del atajo autoconcedido: el agente nunca escribe, sin la frase literal del usuario, un `profile`, un `control.*` o un `merge` que quite una parada.
- «EN ESPERA» no es un estado del roadmap: es la task en curso esperando al usuario.
- La ruta «Merge y tag sin segunda ronda cuando la decisión ya está tomada» de `release-flow` no se deroga: ahí la decisión ya la tomó una persona.
- En `unattended`, una pregunta de la entrevista sin respuesta en los documentos del proyecto aparca la task, y al acabar la release hay un solo informe.

## Desvío

Un desvío cambia la spec aprobada: un requisito, un THEN, el Scope o un «No entra». Todo lo demás que se aparta del plan sin tocar la spec —un fichero de «NO se tocan», otro orden, un fix del hilo principal— es un **ruling**, no un desvío, salvo que caiga en un freno de alcance (ver «Frenos de alcance»): entonces se trata como un desvío.

**Desvío** (cambia la spec):
- `pair` y `delegate`: el agente para, propone el cambio como entrada de `## Enmiendas` en `spec.md` y espera la aprobación. No sigue con la enmienda sin aprobar.
- `unattended`: elige la opción más conservadora, la registra como enmienda sin aprobar y sigue. Si ninguna opción evita bloquear la task, la aparca (`⏸️ aparcada: <motivo>`).
- Si la enmienda añade ficheros, antes de pedir la aprobación la entrada nombra las tasks abiertas del roadmap (⏳, 🔄, ⏸️, 🧪) que declaran alguno de esos ficheros en «Ficheros que toca», o dice «solape no comprobable: el roadmap no declara ficheros» si el roadmap no la declara. Con la aprobación, la fila de la task añade esos ficheros.

**Ruling** (no cambia la spec):
- El agente no para: decide, registra el ruling (qué decidió, por qué, qué cuesta si se equivoca) y sigue. Arbitra así la contradicción entre «decide con el usuario» y las «Rulings, not stalls» de `subagent-driven-development`: con el usuario ausente, el agente no se queda esperando una pregunta que nadie va a responder.
- Todo commit del hilo principal —incluido un fix improvisado para esquivar un fichero vetado— entra en el alcance de la revisión de la task en curso o, si no queda ninguna abierta, en la de la revisión final de rama. Un fix sin commit propio, o mezclado sin marcar entre el resto de decisiones, no pasa por revisión.
- La presentación de la validación abre con el bloque «Me salí del plan en…», separado del resto de decisiones.
- Lo de arriba vale para lo que se aparta del plan sin tocar la spec —un fichero de «NO se tocan», otro orden, un fix del hilo principal— y no cae en un freno de alcance. Si cae en uno, se trata como un desvío: ver «Frenos de alcance».

## Frenos de alcance

Tres situaciones que no cambian la letra de la spec y aun así se tratan como un desvío: en `pair` y `delegate` su fila de la tabla para como la de «Desvío»; en `unattended` sigue con la opción conservadora y no aparca, porque ninguno de los tres bloquea la task. Sin estado nuevo del roadmap.

### 3.er fix descubierto

Disparador: el 3.er fix descubierto de la task, y cada tercero después (6.º, 9.º…). Cuenta las filas de «Fixes adicionales» de `tasks.md` o, sin `tasks.md`, los rulings de fix registrados — cuenta todo lo que se registra, tanto si se arregla como si se difiere. Cuenta el trabajo descubierto fuera del plan (un defecto del código previo, alcance que nadie pidió); un hallazgo de revisión sobre el código que la propia task acaba de escribir no cuenta: es su bucle de fix.

- `pair` y `delegate`: antes de arreglarlo o diferirlo, el agente para y pregunta con tres opciones: seguir en esta task, diferir a otra task (fila en el roadmap) o partir la task. La respuesta entra en `## Enmiendas`.
- `unattended`: lo difiere a una fila nueva del roadmap, lo registra como enmienda sin aprobar y sigue.

### Salida observable

Disparador: una decisión de ejecución que la spec no fija y que cambia la salida observable — lo que ve o recibe quien usa el producto: la respuesta de una API o de una CLI, el texto o el flujo de una UI, los ficheros generados, los nombres públicos (comandos, campos, rutas). Un nombre interno, la estructura, el orden de implementación o deshacer una regresión de la propia task (devuelve la salida a la que había) siguen siendo ruling; ejemplo: elegir entre dos formas internas de calcular un recargo de factura no dispara el freno, cambiar el campo que la factura muestra al cliente sí.

- `pair` y `delegate`: el agente para y pregunta con sus opciones antes de despachar. No la registra como ruling; la respuesta entra en `## Enmiendas`.
- `unattended`: elige la opción que deja la salida como la describe la spec o, si la spec calla, como está hoy. La registra como enmienda sin aprobar.

### Fila cambiada en la base

Disparador: antes de despachar cada task del plan, `git diff $(git merge-base HEAD <integración>) <integración> -- .docs/sdd/roadmap.md`, buscando la fila de la task en curso. Se compara siempre: sin remoto la base se mueve igual, porque otro worktree commitea en la rama local; con remoto, antes `git fetch` y se compara también `origin/<integración>`. Si cambió, es un posible desvío.

- `pair` y `delegate`: presenta el cambio y para.
- `unattended`: sigue con la spec aprobada y registra la fila nueva como enmienda sin aprobar.

## Validación diferida

Diferir cuenta solo con las tres condiciones a la vez:
1. El usuario está presente y tiene el trabajo delante (no ausente sin respuesta).
2. Dice, con su frase, que probará más tarde.
3. Nombra un disparador con dueño: una task, una release o un uso con dueño.

Con las tres, el agente no se niega a cerrar ni inventa un estado nuevo — la forma es esta, y solo esta:
- Walkthrough: `Validación diferida: <fecha> · «<frase literal>» · disparador: <task, release o uso con dueño>`
- Roadmap: `🧪 validación diferida a <disparador>` (no ✅)

Si el disparador falta o es vago («diferida», «se prueba en uso») y se cumplen las dos primeras, no vuelvas a preguntar: concreta tú el uso más próximo, con quien difiere como dueño, y escríbelo así: `disparador: <uso más próximo>, a cargo de <quien difiere>` (p. ej., «la primera exportación del informe mensual, a cargo del dev-lead»). Dilo en el mensaje de cierre para que lo corrija. Con eso la tercera condición queda cumplida.

Sin las dos primeras no hay diferido: la task sigue EN ESPERA con el smoke documentado.

En `unattended` el disparador es siempre el smoke de la release: no hacen falta las tres condiciones, el perfil ya lo fija.

Cuando el usuario valida lo diferido, el agente añade una adenda fechada en el walkthrough con solo lo que él dice que probó, y pasa la fila a ✅.

## unattended

- La spec la aprueba el agente, con las decisiones registradas en «Decisiones que he tomado yo».
- Si una pregunta de la entrevista no tiene respuesta en los documentos del proyecto, la task queda `⏸️ aparcada: <pregunta>` en el roadmap y el agente sigue con la siguiente task de la release.
- Al terminar la release, un solo informe: tasks cerradas, decisiones, enmiendas sin aprobar y tasks aparcadas.
- Los frenos (reintentos, tope de agentes en paralelo, vigía de silencio) no son de esta capacidad: los define la task 0022. Aquí solo se fijan las claves `control.maxParallelAgents` y `control.silence.*` que esa task lee.

## Estados del roadmap

Conjunto cerrado:

| Estado | Significa |
| --- | --- |
| `⏳` | pendiente |
| `🔄 en curso` | task abierta |
| `⏸️ aparcada: <motivo>` | parada, con el motivo escrito |
| `🧪 validación diferida a <disparador>` | verificada por el agente, validación pendiente con disparador conocido |
| `✅` | cerrada y validada |

«EN ESPERA» no es un estado del roadmap: es la task en curso esperando la respuesta del usuario.

## Claves de sdd-kit.json

| Clave | Tipo | Default |
| --- | --- | --- |
| `control.profile` | `pair` \| `delegate` \| `unattended` | `"delegate"` |
| `control.maxParallelAgents` | entero | `3` |
| `control.silence.betweenStepsMinutes` | entero | `8` |
| `control.silence.longCommandMinutes` | entero | `20` |
| `merge.into` | cadena (rama destino) | — |
| `merge.noFf` | booleano | — |
| `merge.removeWorktree` | booleano | — |

`merge` no tiene default: si falta el bloque o cualquiera de sus tres campos, el paso 10 del cierre pregunta como hoy — una política que nadie declaró entera no se aplica.

`control.maxParallelAgents` y `control.silence.*` solo se declaran aquí: su conducta la define la task 0022.

El agente nunca escribe, sin la frase literal del usuario, un `profile`, un `control.*` o un `merge` que quite una parada: sería concederse a sí mismo el atajo. Cuando el usuario lo pide, la frase y la fecha van en una fila de «Aprobaciones» (o en el commit, si el cambio es en `sdd-kit.json`).

## Preguntas de las claves de control

Las hacen `sdd-init-greenfield`, `sdd-init-brownfield` y la migración v1.2.0, con este texto: **una pregunta por turno**, cada una con su recomendación y su motivo. Se salta la que ya tiene su clave en `sdd-kit.json`. Se escribe solo lo que el usuario responde, y esa respuesta es su frase: anotarla no es el atajo autoconcedido.

| # | Pregunta | Recomendada y motivo | Escribe |
| --- | --- | --- | --- |
| 1 | ¿Con qué perfil de control trabajáis: `pair`, `delegate` o `unattended`? | Recomendado `delegate`: para en la spec, en los desvíos y en la validación, y se ahorra el gate del plan; con menos paradas, la 0.6.0 cerró tres tasks en un día | `control.profile` |
| 2 | Al cerrar una task, ¿fusiono a `<rama de integración>` con `--no-ff` y dejo que el worktree lo borre una persona? | Recomendado sí: `--no-ff` deja la task en un commit que se revierte de una vez, y borrar un worktree es irreversible si quedan cambios sin commit | «sí»: `merge` entero (`into`: la rama, `noFf: true`, `removeWorktree: false`); otra combinación dicha entera: esa; «no» o «no sé»: nada, y el cierre de task pregunta |
| 3 | ¿Os valen los frenos por defecto: hasta 3 agentes en paralelo, y aviso tras 8 minutos de silencio entre pasos o tras 20 en un comando largo? | Recomendado sí: son los defaults del kit; su conducta la define la task 0022 | «sí» o números propios: `control.maxParallelAgents`, `control.silence.betweenStepsMinutes`, `control.silence.longCommandMinutes`; «no sé»: nada, y rigen los defaults |

- **Rama de integración** de la pregunta 2: la de la convención de ramas (greenfield) o la que se ve en el repo (brownfield). Si la integración va directa a la rama estable, la pregunta no se hace y `merge` queda sin declarar: el merge a la rama estable lo decide siempre una persona.
- **Sin usuario**: las preguntas quedan pendientes explícitas en el informe o en el resumen de cierre, y rigen los defaults.
