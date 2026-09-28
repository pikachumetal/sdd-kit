# RED — paquete del revisor final con ficheros borrados (patch 0094)

`encargo-revision.md` §Revisor final con el kit de la rama en `e338512`. El lanzador es el de referencia (`tests/headless/run.sh`) con [`red/subject.sh`](../.docs/sdd/specs/20260928-154618-patch-0094-review-package-slim/red/subject.sh). Un sujeto Sonnet headless aislado (`SUPERPOWERS_DIR`, superpowers 6.4.2), 2026-09-28. Salidas en [`red/out/`](../.docs/sdd/specs/20260928-154618-patch-0094-review-package-slim/red/out/).

El molde `legal` calca la rama del [ticket de la feature 0000 de LegalRep](../.docs/sdd/field-reports/20260928-141407-feature-0000-retire-visual-gate.md) §3: `feature/0000` borra una spec de 500 líneas y cinco fixtures de 150, trae su `spec.md` (250 líneas) y su `plan.md` (350) y cambia filas de roadmap de ~2,6 KB en una línea. El script extrae la receta y «Cómo revisar» del kit que mide, rellena los huecos, genera el paquete en `.superpowers/sdd/spec/` del molde y despacha al sujeto como revisor final con «Cómo revisar» delante.

## Escenario `v1`

Criterio (del ticket): (a) el paquete no contiene el cuerpo de los borrados, (b) los lista por nombre, (c) ningún `Read` del revisor devuelve `exceeds maximum allowed tokens (25000)`. Controles: (d) sin la carpeta de la spec de la feature en el paquete, (e) el revisor no rehace el diff con git ni ejecuta nada.

| Sujeto | Paquete | (a) | (b) | (c) | (d) | (e) |
| --- | --- | --- | --- | --- | --- | --- |
| [v1-1](../.docs/sdd/specs/20260928-154618-patch-0094-review-package-slim/red/out/v1-1.tools.txt) | 235.036 bytes, 2.018 líneas (LegalRep: 235.524) | ❌ 500 líneas `LEGACY-LINE-` | ❌ sin sección | ✅ ningún error | ❌ 600 líneas de `spec.md` y `plan.md` | ✅ ni `git diff` ni suite |

19 turnos, 0,56 $. Antes hubo un intento con el workspace fuera del molde: `Read` pidió un permiso que nadie concede, se paró a mitad y no dejó línea de resultado (~0,3 $ estimados). El `subject.sh` pone ahora el workspace dentro del molde, como el de superpowers.

## Veredicto

- **(a), (b) y (d): el fallo se reproduce.** La receta es determinista: el paquete lleva los 500 + 750 líneas de los borrados y la spec y el plan de la feature, 235 KB como en LegalRep.
- **(c): 0 de 1.** El primer `Read`, sin `limit`, no falló: el harness lo cortó en 270 líneas (40 KB). En LegalRep el revisor pasó `limit: 700` y ese tramo pasaba de 25.000 tokens. El sujeto esquivó el error por la conducta del harness con un `Read` sin `limit`, no por el kit, y leyó el paquete a saltos: 680 de sus 2.018 líneas (`offset: 390, limit: 260`, `1152, 90`, `646, 60`). La guía de los tramos de 400 líneas se escribe igual por el fallo de campo (1 de 1, con tres tamaños probados antes del cuelgue) y porque la pidió el dev-lead en el enunciado del patch. No se lanzó otra tanda con Opus, el modelo del revisor de campo: pasaba del techo de la previsión.
