# Capacidad — validation

## Propósito

la fase entre las tasks y el cierre: el gate, el guion recorrido, la revisión final y la validación del dev-lead, y el bucle de vuelta a `sdd-implement`

## Requisitos

### `sdd-validate` valida antes de pasar al cierre

- GIVEN la 0012 en `validation.mode: manual`, con sus tres tasks acabadas y commiteadas
- WHEN `sdd-implement` acaba la Task 3 e invoca `sdd-validate`
- THEN corre el gate de cierre una vez, después recorre el guion de pruebas entero tal como lo recorrerá el dev-lead, después despacha la revisión final sobre lo ya validado y por último presenta el mensaje de validación
- AND no invoca `sdd-archive` hasta que el dev-lead valida; con `validation.mode: field` o `Validación: agente` no para, y lo invoca cuando ha registrado su verificación
- AND con la validación diferida (`Diferir: lo pruebo en la primera exportación, a cargo del dev-lead`) o en `unattended`, registra `Validación diferida:` con su disparador y pasa a `sdd-archive`; si el dev-lead no responde, la feature queda en espera en `sdd-validate` con el smoke documentado
- AND un paso del guion que falla al recorrerlo, `cancelar Norte lun → «cancelada lun»` que, con la reserva del lunes creada, devuelve «no hay reserva lun», se arregla en una task con su test, antes de la revisión final
- AND el kit fija ese orden y que el agente recorra el guion; con qué herramienta lo recorre lo declara el proyecto, y la skill no nombra ninguna
- AND la validación se registra en el borrador del walkthrough (en un patch, §4 de `patch.md`) con una de `Validado:`, `Validación diferida:`, `Validación en campo:` o `Validación por el agente:`
- AND un patch o un hotfix recorren el mismo orden sin revisión final, y un spike lo recorre como dice «Un spike valida su evidencia en `sdd-validate`»

### Un fallo de la validación vuelve a una task y la vuelta corre solo lo que toca el arreglo

- GIVEN la 0012 con el gate en verde en `a1b2c3d`, la revisión final hecha y el dev-lead que responde «el paso 3 falla: `cancelar Norte lun` dice «cancelada lun» y me quita también la del martes»
- WHEN `sdd-validate` lo devuelve a `sdd-implement` y el agente lo arregla
- THEN el arreglo es una task con su test, que falla antes y pasa después
- AND corre el test nuevo y los que fallaron, el gate con `--base a1b2c3d`, los pasos del guion que toca el arreglo y, al ser posterior a la revisión final, la revisión de su diff
- AND no corre el gate entero, el guion entero ni la revisión final entera
- AND si el arreglo toca un fichero de «Sin filtro», corre el gate sin filtro
- AND lo mismo con un fallo del agente al recorrer el guion; un fallo de la revisión final sigue «La revisión se cierra una vez» (una sola pasada de fix) y después corre el gate con `--base` y los pasos del guion que toca
- AND la revisión de su diff la hace un revisor `sdd-kit:effort-high` + `sonnet`, una sola vez, y un hallazgo suyo que queda abierto va a ✋ como `sin revisar: <sha>`
- AND una vuelta anterior a la revisión final (un fallo del gate o del guion del agente) no lleva revisión propia: la cubre la revisión final, que sale después
- AND tras la vuelta la validación sigue desde el paso que falló, y no pasa a `sdd-archive` hasta que el dev-lead valida; un cambio que el dev-lead pide después de validar sigue «Lo cambiado tras la validación se separa de lo validado» y no repite la validación
- AND en un spike, la task de la vuelta lleva «Evidencia» en vez de test, corre el gate solo si toca un fichero fuera de su carpeta de `changes/`, y en lugar de los pasos del guion vuelve a contrastar las filas que toca

### Un hotfix valida en `sdd-validate` como un patch

- GIVEN el patch 0008 con el fix commiteado en `hotfix/0008-cancel-missing`, salida de `main`, y `validation.mode: field`
- WHEN el agente retoma el hotfix con `sdd-implement`
- THEN invoca `sdd-validate`, que corre el gate de cierre, recorre el guion y registra `Validación en campo:` en `patch.md` §4, y solo después invoca `sdd-archive`
- AND no despacha revisión final ni ningún eje
- AND un paso del guion que falla vuelve a `sdd-implement` como una task con su test, como en un patch
- AND la pregunta del pre-check 5 y la fusión a `main` con etiqueta siguen en `sdd-archive`

### Un spike valida su evidencia en `sdd-validate`

- GIVEN el spike 0030 con `research.md`: O1 «`libres` con 1.000 reservas < 200 ms» medido en 340 ms (`no cumple tal como se definió`), O2 «memoria < 50 MB» `no medido`, sin fichero de evidencia, y O3 «un recepcionista encuentra la sala libre en < 10 s» `no medido con una persona`; la rama solo toca su carpeta de `changes/` desde el `merge-base`
- WHEN `sdd-implement` acaba la última task e invoca `sdd-validate`
- THEN no corre el gate, no recorre guion: contrasta cada fila de objetivo con su evidencia
- AND devuelve O2 a `sdd-implement` como una task con «Evidencia» que lo mide; O1 y O3 no vuelven, porque son resultados
- AND también vuelve una tabla de aguante de menos de 10 repeticiones o sin la peor carga, y una recomendación que se apoya en una fila sin medir
- AND con las filas sostenidas, despacha la revisión final solo con el eje Spec, que lee `research.md`
- AND registra la línea de su modo en el borrador del walkthrough, con una fila por objetivo en el smoke, y solo entonces invoca `sdd-archive`
- AND si `git diff --name-only <merge-base>...HEAD` da un fichero fuera de su carpeta de `changes/`, corre el gate

## Reglas de la capacidad

- **Dónde viven los datos**: la skill en `skills/sdd-validate/`; qué corre, envía y registra cada modo de validación, en `skills/sdd-validate/references/validation-modes.md`; cómo se compone y se ensaya el guion y el entorno, en `skills/sdd-validate/references/dev-validation.md`; la forma del mensaje, en `validation-template.md` de `sdd-templates`; la batería, en `tests/batteries/sdd-validate/`
- **Idioma de los nombres**: skill y ficheros en inglés kebab-case; las líneas de registro, en castellano (`Validado:`, `Validación diferida:`, `Validación en campo:`, `Validación por el agente:`, `no ensayado:`)
- **Límites**: tope de palabras de `sdd-validate`, el de `cli/test/kit/word-budget.test.ts`; el gate de cierre corre una vez al acabar las tasks, y en un spike solo si la rama toca un fichero fuera de su carpeta de `changes/`; cada vuelta corre solo lo que toca el arreglo y no hay tope de vueltas; una vuelta posterior a la revisión final lleva una sola revisión de su diff
- **Avisos**: `no ensayado: <motivo>` y `sin revisar: <sha> — <qué cambia>`
- **Regla ante conflicto**: un hallazgo del dev-lead que cambia la spec es un desvío y para como dice `sdd-implement`; una vuelta nunca abre otra revisión final
