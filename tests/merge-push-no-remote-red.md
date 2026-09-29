# RED: `-Push` sin remoto en el cierre (patch 0112)

La regla medida es el párrafo de `merge-recipe.md` §Push anterior al patch: «Si la rama destino no tiene remoto, no se pasa `-Push` (el script fallaría con `push:` antes de fusionar), y el mensaje final dice «push: no hecho: sin remoto»».

El baseline no se lanzó con sujetos. Son tres cierres reales de un proyecto del equipo que siguieron la receta vigente, con perfil `delegate`, `merge.push: true` y sin remoto. Es el RED a coste cero que admite `tech-stack.md` («Un stream previo puede ser el RED de otra task»).

| Ticket | Conducta | Cita |
| --- | --- | --- |
| [feature 0026 §5](../.docs/sdd/field-reports/20260928-105000-feature-0026-interfaz-y-pestanas.md) | pasó `-Push`; el script abortó antes de fusionar | «La receta sí dice que sin remoto no se pasa `-Push`, pero el paso 10 no lo repite» |
| [patch 0031 §2](../.docs/sdd/field-reports/20260929-143151-patch-0031-estilo-neutral-pierde-relleno.md) | pasó `-Push`; relanzó sin él | «la regla depende de que el ejecutor mire el remoto antes de llamar» |
| [feature 0032 §1](../.docs/sdd/field-reports/20260929-153416-feature-0032-subir-signalr.md) | pasó `-Push`; relanzó sin él | «la regla 3 […] se lee como suficiente, y la excepción del remoto queda fuera de la lista numerada» |

**Falla 3/3**. La excepción del remoto no se aplica: los tres agentes siguen la regla 3 y pasan `-Push`. El script lanza `push: no hay remoto configurado para 'develop'.` antes de fusionar, y el cierre necesita una segunda ejecución.

## Cambio

El patch quita la excepción en vez de reforzarla. El script, con `-Push` y sin remoto, fusiona en local y acaba con `push: no hecho: sin remoto` (RED/GREEN del script en `tests/Invoke-SddMerge.Tests.ps1`). La receta dice ahora que `-Push` se decide igual sin remoto y que el mensaje final cita esa línea. La conducta que los tres agentes tuvieron pasa a ser la correcta.

GREEN: [merge-push-no-remote-green.md](merge-push-no-remote-green.md).
