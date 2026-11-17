# RED previo a la spec — task 0019

Regla de `tech-stack.md`: cada frente de campo se reproduce antes de presentar la spec. Se usan dos sujetos si el frente es una conducta, y verificación con fichero y línea si es estructural.

## Frentes estructurales

| Frente | Evidencia | Resultado |
| --- | --- | --- |
| «Ficheros que toca» | `control-profiles.md:52` la lee; `roadmap-template.md` no tiene ninguna tabla con esa columna | falla |
| `autoMemoryEnabled` | 0 menciones en `skills/` | falla |
| `.playwright-mcp/` y `.superpowers/` | 0 menciones en `skills/`; ninguna init toca `.gitignore` | falla |
| Test migración ↔ init | solo hay comprobaciones sueltas por clave (`ControlProfiles.Tests.ps1`, `TaskIds.Tests.ps1`), ninguna general | falla |

## Frente 4 — el script de estimación (conducta, streams reutilizados)

No se lanzan sujetos nuevos. `tech-stack.md` admite un stream previo como baseline, y las campañas de init de las tasks 0012, 0013 y 0020 dejaron `estimation-log.md` en disco. Resultado: **0 de 10 lo generaron con `Build-EstimationLog.ps1`**.

| Campaña | Sujetos | `estimation-log.md` |
| --- | --- | --- |
| 0012 (`red/out/e1a`, `e1b`; `green/out/e1a`, `e4a`–`e4d`) | 6 | 0 bytes |
| 0020 (`red/out/bf-a`, `bf-b`; `green/out/g1-a`, `g1-b`) | 4 | cabecera inventada; `bf-b` escribe «Generado por `Build-EstimationLog.ps1`» sin haberlo ejecutado |

Ninguno de los 10 escribe `.claude/settings.json` ni toca `.gitignore`.

Control del script: se ejecutó sobre un proyecto con `.docs/sdd/specs/` vacía. Terminó con exit 0, escribió la cabecera `<!-- AUTO-GENERADO por Build-EstimationLog.ps1 (sdd-kit) …` y dejó la tabla sin filas.

## Frente 5 — proyecto de referencia en `sdd-start-task` (conducta, 2 sujetos)

- **Molde** (`molds/ref/`): `billing-api` recién arrancado, sin código de dominio, con `.docs/sdd/`. Su constitution dice en «Convenciones»: «**Proyecto de referencia**: `../orders-api`. billing-api replica sus patrones.». Al lado, `orders-api` con capas por módulo, casos de uso con `execute()` y un `Result` sin excepciones.
- **Petición**: arrancar la task 0001 del roadmap (módulo de pagos), con la primera pregunta ya respondida y el dev-lead ausente del brainstorming.
- **Lanzador**: `driver.py`, un turno y sin persona. El kit es una copia limpia del working tree en `02da87b`.
- **Criterio de fallo**: la spec propone su propio diseño sin leer ni citar `../orders-api`.

| Sujeto | Lecturas de `orders-api` antes del brainstorming | La spec cita `orders-api` | Coste |
| --- | --- | --- | --- |
| `r1` | 8 | sí: decisiones 1, 4, 5 y Approach («calcado de `../orders-api` — la constitution dice que billing-api replica sus patrones») | 1,00 $ |
| `r2` | 9 | sí: decisión 6 y Approach («porque la constitution lo fija como proyecto de referencia») | 0,87 $ |

**2 de 2 pasan sin guidance.** Con el campo escrito en la constitution, `sdd-start-task` ya compara con el proyecto de referencia antes de proponer. Por eso la task no toca `sdd-start-task`: el fallo de campo era la ausencia del dato en los docs, y eso lo arregla el campo.

**Posible falso negativo, a deuda.** En el molde, el campo dice «replica sus patrones» y la task es la primera del proyecto. En campo, la task portaba patrones de un proyecto espejo y el hilo propuso una versión simplificada. Un campo más escueto (solo la ruta), o una task que no parezca un portado, podrían no disparar la lectura.

Salidas: `out/r1/`, `out/r2/`: la spec escrita, `tools.txt` con las tool calls y `state.txt`. El lanzador falló al tomar la foto de `r1` porque un evento traía `content` como texto; se corrigió el parser y las dos fotos se regeneraron desde los streams, sin relanzar los sujetos.
