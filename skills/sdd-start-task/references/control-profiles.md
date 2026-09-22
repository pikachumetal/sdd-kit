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

Un desvío cambia la spec aprobada: un requisito, un THEN, el Scope o un «No entra». Todo lo demás que se aparta del plan sin tocar la spec —un fichero de «NO se tocan», otro orden, un fix del hilo principal— es un **ruling**, no un desvío.

**Desvío** (cambia la spec):
- `pair` y `delegate`: el agente para, propone el cambio como entrada de `## Enmiendas` en `spec.md` y espera la aprobación. No sigue con la enmienda sin aprobar.
- `unattended`: elige la opción más conservadora, la registra como enmienda sin aprobar y sigue. Si ninguna opción evita bloquear la task, la aparca (`⏸️ aparcada: <motivo>`).

**Ruling** (no cambia la spec):
- El agente no para: decide, registra el ruling (qué decidió, por qué, qué cuesta si se equivoca) y sigue. Arbitra así la contradicción entre «decide con el usuario» y las «Rulings, not stalls» de `subagent-driven-development`: con el usuario ausente, el agente no se queda esperando una pregunta que nadie va a responder.
- Todo commit del hilo principal —incluido un fix improvisado para esquivar un fichero vetado— entra en el alcance de la revisión de la task en curso o, si no queda ninguna abierta, en la de la revisión final de rama. Un fix sin commit propio, o mezclado sin marcar entre el resto de decisiones, no pasa por revisión.
- La presentación de la validación abre con el bloque «Me salí del plan en…», separado del resto de decisiones.

## Validación diferida

Diferir cuenta solo con las tres condiciones a la vez:
1. El usuario está presente y tiene el trabajo delante (no ausente sin respuesta).
2. Dice, con su frase, que probará más tarde.
3. Nombra un disparador con dueño: una task, una release o un uso con dueño.

Con las tres, el agente no se niega a cerrar ni inventa un estado nuevo — la forma es esta, y solo esta:
- Walkthrough: `Validación diferida: <fecha> · «<frase literal>» · disparador: <task, release o uso con dueño>`
- Roadmap: `🧪 validación diferida a <disparador>` (no ✅)

Sin las tres condiciones no hay diferido: la task sigue EN ESPERA con el smoke documentado.

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
