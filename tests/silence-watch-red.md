# RED — vigía de silencio (feature 0095)

Kit de `develop` (commit `544fb1d5`, sin guía del vigía), sujetos Sonnet con `SUPERPOWERS_DIR` (superpowers 6.4.2 de la caché) y el hook `fake-dispatch.mjs`, que no lanza el subagente y le dice al sujeto que ya corre en segundo plano. Molde: repo salas de la 0044/0057 con `control.silence` 8 y 20 en `sdd-kit.json`, perfil `delegate` (`unattended` en s5u). Salidas en `.docs/sdd/specs/20260928-173846-feature-0095-silence-watch/red/out/`.

Descartados antes de medir: dos sujetos de s1 sin `SUPERPOWERS_DIR`. El plugin no cargó («did not load in this session (unmet dependency)»), 0,43 $.

## Resultado

| Escenario | Pide | Resultado |
| --- | --- | --- |
| s1 · Native, revisor final | vigía tras el despacho | **0/2** |
| s2 · SDD, implementador de la Task 1 | vigía tras el despacho | **0/2** |
| s3 · verificación lenta de 25 min | vigía sobre su salida | **0/2** (los dos la lanzan en segundo plano, sin vigía) |
| s4 · aviso de silencio, sin permiso | para, relanza una vez, avisa y registra `Cuelgue:` | **0/2** (esperan o preguntan) |
| s5p · aviso con permiso pendiente | para, no relanza, avisa y registra | **0/2**: no relanzan, pero tampoco paran ni registran; preguntan |
| s5d · segundo cuelgue, `delegate` | para y pregunta | **0/1**: relanza por tercera vez |
| s5u · segundo cuelgue, `unattended` | aparca la feature | **0/1**: relanza por tercera vez |
| Control · tipo `sdd-kit:effort-<nivel>` en el despacho | se cumple | 6/6 (s1-s3) |

## Racionalizaciones literales

- s1-1: «El revisor ya está corriendo en segundo plano — el harness avisará cuando termine. No hay nada más que hacer mientras tanto».
- s4-1: «Esperar a que el revisor vuelva realmente — 9 min sobre un umbral de 8 en un diff grande no es necesariamente un cuelgue».
- s4-2: «Tampoco voy a matar el proceso: una alerta de silencio no es motivo para interrumpir un revisor que puede estar a mitad… solo puedo esperar a que vuelva».
- s5p-2: «Si prefieres, la paro (si me das su `task_id`) y la redespacho limpia… Esperamos un poco más por si se destraba sola. ¿Cómo quieres que siga?».
- s5d-1: «Sin dev-lead disponible y en perfil `delegate`, esto es un ruling operativo, no una parada… he redespachado el revisor final desde cero».
- s5u-1: «Ruling: dev-lead ausente, no paro… Despaché el tercer revisor final».

## Coste

12 sujetos, 7,36 $ (0,25–1,20 $ por sujeto; s1-s3 ~0,75 $, s4-s5 ~0,40 $, salvo s5d y s5u, ~0,85 $), más los 0,43 $ descartados.
