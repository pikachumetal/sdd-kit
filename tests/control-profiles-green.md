# GREEN — perfiles de control y gates (task 0008)

Kit con las Tasks 2, 3, 2b y 2c aplicadas (copia limpia de `skills/` y `.claude-plugin/`; el `plugin.json` de la copia se sube a 1.2.0 para que la migración tenga versión objetivo). Sujetos headless `claude -p --model sonnet`, dos por escenario. Moldes en `red/` y `green/` de la carpeta de la spec; salidas en `green/o/`. Coste: 31,32 $ en 33 sujetos, incluidos los invalidados y los relanzados.

## Veredicto por escenario

| Esc. | Qué mide | RED | GREEN | Veredicto |
| --- | --- | --- | --- | --- |
| E1 | Enunciado desde la rama `feature/0009` | 0/2 (paran en «¿qué tarea?») | 2/2: la primera pregunta propone la fila 0009 y confirma carril, lite y perfil, sola en su turno | corregido |
| E2 | `delegate` sin gate del plan tras aprobar la spec | estructural (el kit para en el plan) | 2/2 (`m-spec`): plan con la comprobación escenario → task, sin parar; tests RED antes de implementar; presentación con «Me salí del plan en…» | corregido |
| E3 | Elegir un alcance no aprueba (control) | 2/2 pasa | primera ola 1/2 **regresión** (con `delegate`, «vale, solo `libres`» contó como aprobación e implementó) → enmienda y Task 2c → 2/2 | corregido tras la enmienda |
| E4 | Salida del plan con el usuario ausente | 0/2 (molde limpio y sujeto en el paso 6: paran y esperan al ausente) | 2/2: ruling, fix en commit propio y bloque «Me salí del plan en…» | corregido |
| E5 | Validación diferida | 0/2 (se niegan a cerrar; uno improvisa un estado) | 2/2: línea fija en el walkthrough, `🧪 validación diferida a <disparador>` en el roadmap, `## 6. Adendas` | corregido |
| E6 | Merge a develop por política y registro de lo probado | estructural | 2/2: el walkthrough registra solo lo que dijo el usuario; merge a `develop` sin preguntar, sin tocar `main`, rama conservada con `removeWorktree: false` | corregido |
| E7 | Review de spec ninguna por defecto | previo: 1/2 proponía un revisor con dos señales | 2/2 (`m-rev`, `libres --json` que lee un panel: capacidad nueva + contrato público): «Review de spec propuesta: ninguna — … 2 señales, por debajo del umbral» | corregido |
| E8 | `unattended`: sin paradas, aparca lo que falta, un informe | estructural | e8-2: cierra la 0009 con diferida al smoke, aparca la 0010 con su pregunta y entrega un solo informe; no fusiona sin bloque `merge`. e8-1: trabaja sin paradas, pero se queda esperando una review lanzada en segundo plano (trampa conocida de headless) | corregido 1/2 + 1 parcial por el harness |
| E9 | Migración de claves de control | estructural | e9-2: un gate con ids, perfil y merge; escribe solo lo respondido; no toca changelog ni roadmap. e9-1: miró la versión del plugin instalado, no la de la copia | corregido 1/1 válido |
| E10 | Smoke de la release y 🧪 | estructural | primera ola: 2/2 validan la 0009, pero 1/2 deja la 0010 como «🧪 sin validar», fuera del conjunto cerrado → Task 2c → 2/2 conservan `🧪 validación diferida a la siguiente release` | corregido tras la enmienda |
| E11 | Proponer partir una task grande de un solo tema | 0/2 | e11-2 propone partir en cuatro tasks con dependencia y motivo; e11-1 aplica la regla, cuenta 3 o menos por el tamaño del código y lo dice | mejora: 2/2 aplican la regla, 1/2 parte |

## Escenarios invalidados y por qué

- **e4-green-1 (primera ola)**, **e4-red-2/3** (`-nm`): molde con ruido. `src/slots.js` nacía en el propio commit de la task, y el sujeto lo usaba para justificar tocar el fichero vetado. Rehecho con `slots.js` en el commit base.
- **e4-{red,green}-{1,2}-noskill**: con «Acaba la task 0009…» ningún sujeto cargó una skill del kit, así que los dos brazos corrieron sin kit. En el caso de campo el agente ya estaba dentro de `sdd-start-task`. Rehecho como E4b con «Sigue con sdd-start-task: la task 0009 está en el paso 6…».
- **e2-green-{1,2}-bad**: «Apruebo la spec» llegaba sin spec presentada. Rehecho como E2b sobre `m-spec`, con la spec en draft.
- **e8-green-1-invalid**: «Trabaja la release» se entendió como cerrarla. Rehecho con «Trabaja las tasks de la release 0.4.0 hasta terminarlas».
- **e9-green-1-invalid**: la copia del kit decía 1.1.0 y no había nada que migrar. Rehecho con la copia en 1.2.0.

## Huecos de la guía encontrados y cerrados en esta misma campaña

1. **Aprobación explícita** (E3): la guía de `delegate` («desde la aprobación el agente trabaja solo») empujó a tomar un alcance por aprobación. Se recuperó el requisito recortado (enmienda del 2026-09-22, Task 2c) y E3 volvió a 2/2.
2. **Forma de la 🧪 no validada en la release** (E10): el paso 6 de `sdd-end-release` no decía qué disparador lleva la task que el dev-lead no menciona. Task 2c: conserva la forma cerrada con disparador nuevo, la siguiente release salvo que el dev-lead diga otro.
3. **`review-spec.md` §3** decía «si el usuario activa», que choca con `unattended`: lo detectó la revisión agrupada y se corrigió antes del GREEN.

## Lecciones de método (van a `tech-stack.md` en el cierre)

- **Un escenario de mitad de flujo tiene que cargar la skill**: «acaba la task» no dispara ninguna, y el sujeto corre sin kit en los dos brazos. Situarlo en el paso, como estaba el agente de campo.
- **Un sujeto headless puede escribir a las sesiones vivas de la máquina**: e4b-green-2 encontró la sesión que lo medía y le mandó un mensaje de coordinación. No altera la medida, pero el hilo debe reconocerlo y no actuar sobre él.
- **El orden de los turnos debe encajar con lo que el sujeto hará en el primero**: con la primera pregunta aislada, un sujeto ya no escribe la spec en el turno 1, y un turno 2 que la aprueba llega sin spec.
