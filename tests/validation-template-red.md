# Plantilla de validación y quién valida — RED/GREEN (feature 0263)

Batería de `sdd-archive`, `t1`-`t3`, y de `sdd-start-feature`, `v1a` y `v1b`. Salidas en `.docs/sdd/specs/20261030-122825-feature-0263-validation-template/`. 27 sujetos Sonnet, 7,74 $, con un tope de 8 $ (la previsión era ~4 $: dos rondas de REFACTOR más y un control).

## RED (`red/`, kit de develop)

| Frente | Resultado |
| --- | --- |
| `t1` forma | sin 🦆 ni ✋, smoke tras el guion, sin rama, worktree ni entorno, suites sin separar |
| `t2` validar lo inútil | en una tarea que solo fija Node 22, pide ejecutar `cat .nvmrc` |
| La spec dice quién valida | estructural, sin sujeto: `spec-template.md` y `patch-template.md` no tienen el hueco |
| `AskUserQuestion` | no se mide: `claude -p` no la tiene, y ningún sujeto la buscó |

## GREEN

| Ronda | Escenario | Resultado |
| --- | --- | --- |
| `green` | `t1`, `g3` | rojo: «No hay entorno que arrancar: es una CLI», salida que daba la plantilla |
| `green` | `g1` | rojo: texto tras la frase final |
| `green` | `t3` | 2/2 sin guion; el id 0012 del molde chocaba con otra fila |
| `green2` | `g3` | 2/2 con el entorno arriba y en el guion; `g3-2` añade un aviso tras la frase final |
| `green2` | `t3` | 2/2 con `Validación por el agente:` en el walkthrough |
| `green2` | `g1` | 2/2 con los pasos del reporte primero; `g1-2` no lanza el panel, residual. Salida no guardada: el sujeto escribió el nombre de git de la máquina, leída del stream |
| `green2` | `v1a`, `v1b` | `v1b` 0/2: pregunta por un hueco de «Sin probar» con `field`; `v1a-1` para antes de presentar |
| `control-base` | `v1a`, `v1b`, kit anterior | `v1a-1` también saca el hueco del listado; `v1b-1` cierra sin preguntar: el retroceso de `v1b` es de la plantilla |
| `green3` | `t1` sobre `reservas-ui` | forma y final 2/2; `t1-1` da `env-up` en su terminal; `t1-2` arranca el entorno sin `startEnvironment`, residual |
| `green4` | `v1b` | 1/1 cierra sin preguntar, con el hueco en «Pendiente» |

## Clases de fallo

Las dos rondas fueron de forma (Art. II): una excepción sin contraejemplo («sin entorno que arrancar, omite») y un hueco que invitaba a preguntar. No se reescribió el texto: se puso el contraejemplo y se dijo qué hace el hueco.

## Sin medir

Spec aprobada por delegación con `agente`, `patch.md` con `agente` y la vuelta a `dev-lead` como desvío: reglas de una línea, leídas.
