---
kit_version: 3.0.0
lane: feature
id: 20261108-175154-feature-0012-plan-rehecho
task: 0012
mode: sin determinar
date: 2026-11-08
---

# Ticket para el kit — feature 0012: plan rehecho por una task sin fichero y brief pedido dos veces

## Contexto

- Carril y modo: feature, modo (full|lite) sin determinar: las notas no lo dicen y no hay carpeta de spec 0012 en el proyecto para comprobarlo
- Skills del kit usadas: no consta cuáles; las notas hablan de plan, implementador por task y merge
- Proyecto: aplicación pequeña de Node sin dependencias externas, una función de exportación de datos
- Modelo del hilo: no consta
- Modelos de los subagentes: no consta
- Coste en reloj: unos 40 min por encima de la estimación (cifra de las notas del dev-lead; estimación absoluta no disponible)
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una task del plan sin fichero a tocar obligó a rehacer el plan

- **Qué pasó**: la spec se aprobó a la primera, pero el plan se rehízo una vez porque la task 2 no decía qué fichero tocar. Según las notas, el plan rehecho explica la mayor parte del sobrecoste.
- **Fuente**: notas del dev-lead de la sesión (fichero del proyecto, descriptor genérico); `skills/sdd-templates/templates/plan-template.md:163` → `**Ficheros**: crear/modificar \`path/...\``
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md` línea 163 (campo `Ficheros` de la task) y el paso de revisión del plan en `sdd-propose`/`review-spec.md`; no localizado qué paso comprueba que cada task rellene `Ficheros`.
- **Por qué el kit no lo evitó**: la plantilla ya pide el campo, pero nada que se haya encontrado en las skills lo comprueba antes de aprobar el plan. No he podido releer el plan 0012 para saber si el campo faltaba o estaba vacío.
- **Coste**: unos 40 min sobre la estimación en toda la sesión; la atribución al plan rehecho es la frase del dev-lead, sin respaldo (no hay spec, walkthrough ni commit de la 0012 que la sostengan): causa «sin respaldo».
- **Propuesta**: que la revisión del plan rechace cualquier task sin `Ficheros` rellenado con rutas concretas, antes de la aprobación.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un plan cuya task 2 deja `Ficheros` vacío o con un placeholder, WHEN se ejecuta la revisión del plan, THEN la revisión lo marca como bloqueante y el plan no se aprueba hasta nombrar las rutas.

### 2. El implementador de la task 3 pidió dos veces el mismo contexto

- **Qué pasó**: el implementador de la task 3 pidió dos veces el mismo contexto. El dev-lead atribuye la causa a que la skill no dice cuándo adjuntar el brief.
- **Fuente**: notas del dev-lead (fichero del proyecto, descriptor genérico); `grep -n -i "brief" skills/sdd-implement/SKILL.md` → solo menciona el brief en las líneas 42, 66 y 78 (restricciones de código, relanzamiento), ninguna dice qué debe llevar siempre
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md` (despacho del implementador; solo la línea 78 fija una sección obligatoria del brief) y `skills/sdd-templates/templates/plan-template.md:161` («la task viaja sola»)
- **Por qué el kit no lo evitó**: el kit describe el contenido de la task en el plan, pero no dice qué debe adjuntar el hilo al despachar; no se ha podido ver cuál era el contexto pedido ni si la task 3 cumplía la regla de «viaja sola».
- **Coste**: repetido dos veces en la sesión, sin cifra de minutos; causa «sin respaldo».
- **Propuesta**: que el despacho del implementador enumere lo que el brief lleva siempre (texto de la task, ficheros que nombra, restricciones globales) y que el implementador, si le falta algo, lo pida de una vez en su informe.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una task cuyo texto necesita una firma definida en otra task, WHEN el hilo despacha al implementador, THEN el brief incluye esa firma y el implementador no pide contexto más de una vez.

### 3. El kit cargado no era el que pide el proyecto y las notas citan una tercera versión

- **Qué pasó**: el proyecto pide el kit 3.0.0, la sesión cargó el plugin 2.3.4 (el aviso de inicio lo advirtió) y las notas del dev-lead dicen que se trabajó con la 2.4.0. Las skills ejecutadas pueden ser las de una versión vieja, por lo que los hallazgos 1 y 2 podrían no aplicar a 3.0.0.
- **Fuente**: `.docs/sdd/sdd-kit.json` → `"version": "3.0.0"`; `.claude-plugin/plugin.json` del kit cargado → `"version": "2.3.4"`; la 2.4.0 sale solo de las notas y no se ha podido comprobar
- **Dónde en el kit**: aviso de inicio de sesión (hook de arranque) y `skills/sdd-feedback/SKILL.md` paso 1; no localizado un paso que obligue a registrar la versión realmente cargada.
- **Por qué el kit no lo evitó**: el aviso existe, pero no bloquea ni deja constancia en el ticket de que las skills eran de otra versión.
- **Coste**: no medido.
- **Propuesta**: que el ticket lleve en Contexto la versión del kit cargado además de la del proyecto.
- **Verificada**: sí — contrastado con `.docs/sdd/sdd-kit.json` y `plugin.json` arriba
- **Criterio de aceptación**: GIVEN un proyecto en 3.0.0 con el plugin 2.3.4 cargado, WHEN se escribe el ticket, THEN Contexto indica ambas versiones.

## Lo que hice por iniciativa propia

- Nada que reportar por parte de la sesión de la feature; las notas no recogen iniciativas propias.

## Funcionó, no tocar

- La spec se aprobó a la primera.
- El merge en `develop` sin conflictos.

## Menores

- El pre-commit saltó por un fichero sin final de línea; se arregló en un minuto — no localizado
