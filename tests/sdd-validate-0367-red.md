# RED de la feature 0367 — `sdd-validate` en `delegate` para antes de `sdd-archive`

Kit de la base (`git archive 79899474c:dist`), `sonnet`, `N=2`. Salidas en `.docs/sdd/changes/20261125-155223-feature-0367-validate-no-stops-in-delegate/red/out/`. Línea `suma:` de la tanda: `red: 2 sujetos · 4.44 $`.

## `vf10` — molde `reservas-final-bug-campo`

| Sujeto | VF10 (a) vuelta | VF10 (b) `sdd-archive` | VF10 (c) `sdd merge` | Motivo literal de la parada |
| --- | --- | --- | --- | --- |
| vf10-1 | pasa: `git commit` del arreglo (`tools.txt` l. 235) sin pregunta antes | falla | falla | «La 0010 está validada, pero no la he cerrado: `sdd-archive` hace el merge a `develop` y tú solo me pediste validar.» · acaba en «Si quieres que cierre, dime «cierra» y sigo con `sdd-archive`.» |
| vf10-2 | pasa: `git commit` del arreglo (`tools.txt` l. 234) sin pregunta antes | falla | falla | «Paré aquí y no invoqué `sdd-archive`, porque squashea y mergea en `develop`. ¿Lo lanzo?» |

Los dos registran `Validación en campo:` en el borrador del walkthrough. Ninguna parada viene del molde.

## Lectura

- Clase del motivo (Approach §2 de la spec): **merge**, en los dos sujetos. Ninguno cita la falta de una sesión de Native ni `validation-modes.md`. La redacción del paso 5 dice que, en `delegate` con el bloque `merge` completo, el merge a `merge.into` es del cierre y no se pregunta.
- La vuelta a `sdd-implement` no para en ningún sujeto con «without asking» en el texto. La decisión 4 de la spec la quita igual: la cláusula (a) de `vf10`, `vf2` y `vf3` mide en el GREEN que la vuelta sigue sin parar sin esa frase.
- El vigilante de silencio dio `SILENCIO:` a los 20 min sobre la salida de la tanda: el `| Select-Object -Last 30` la retenía hasta el final; los sujetos seguían escribiendo en `RUNS_DIR`. No era un cuelgue.
