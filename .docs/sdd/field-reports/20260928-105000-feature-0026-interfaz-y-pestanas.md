---
kit_version: 2.0.0 (la feature arrancó con la 1.1.0 y cerró con la 2.0.0)
superpowers_version: 6.4.1
lane: feature
id: 20260928-105000-feature-0026-interfaz-y-pestanas
task: 0026
mode: full
date: 2026-09-28
---

# Ticket para el kit — feature 0026: cierre de una feature 1.x con el kit 2.0.0 recién migrado en la base

## Contexto

- Carril y modo: feature full
- Skills del kit usadas: sdd-start-feature (en 1.1.0), subagent-driven-development de superpowers,
  sdd-end-feature, add-to-changelog y sdd-feedback (en 2.0.0)
- Proyecto: aplicación web interna, backend .NET y frontend React con un editor de documentos embebido
  en iframe; monorepo con moon; un desarrollador, que es el dev-lead
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5 (implementadores, revisores de task y re-revisiones), Opus 5.5
  (revisión final)
- Coste en reloj: 3,5 h de spec y plan, y 6 h de implementación con dos rondas de smoke (aproximado)
- Coste en tokens: 210.976.198 en el hilo y 175.340.536 en 24 despachos de subagentes

## Cómo leer este ticket

Los hallazgos son hipótesis que se prueban con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El implementador no recibe la regla de atribución de commits y firma con el modelo

- **Qué pasó**: el proyecto exige un trailer `Co-Authored-By` literal, sin modelo, y lo lleva en el
  bloque «De proceso» de las restricciones globales. El encargo del implementador solo lleva el bloque
  «De código». Un subagente de la ola del smoke firmó cinco commits con el trailer por defecto del
  harness, que incluye el modelo. Hubo que reescribir los mensajes con `git filter-branch` sobre la rama
  sin publicar y apartar antes con un stash etiquetado los cambios del usuario que había sin commitear.
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md`, «Encargo del
  implementador». El texto justifica que solo viaje «De código» para los revisores, pero el implementador
  es quien commitea.
- **Por qué el kit no lo evitó**: la exclusión de «De proceso» está pensada para que los revisores no
  auditen reglas de proceso, y se aplica también al implementador. Él sí necesita la línea de atribución.
- **Coste**: una reescritura de historia, un stash sobre el árbol del usuario y unos 15 minutos. Si la
  rama hubiera estado publicada, el arreglo habría pedido un force-push.
- **Propuesta**: el encargo del implementador lleva, además del bloque «De código», la línea de
  atribución de commits del bloque «De proceso», literal. El de los revisores sigue sin ella.
- **Criterio de aceptación**: GIVEN un plan cuyas restricciones de proceso fijan un trailer sin modelo, y
  un harness que por defecto firma con el modelo; WHEN se despacha un implementador que hace 3 commits;
  THEN los 3 llevan el trailer literal del plan. Hoy, en el RED observado, 5 de 5 commits de un
  despacho llevaban el del harness.

### 2. Cerrar con la 2.0.0 una feature arrancada en 1.x no tiene camino

- **Qué pasó**: la base migró al kit 2.0.0 mientras la feature estaba en smoke. Al cerrar pasaron tres
  cosas:
  - la skill de cierre había cambiado de nombre (`sdd-end-task` pasó a `sdd-end-feature`), y el agente
    no la encontró hasta que el dev-lead lo dijo;
  - `Test-Capabilities.ps1` falló con tres errores: faltaba el bloque «## Capacidades» en una spec ya
    aprobada, y una capacidad creada en la rama traía «Historial» y no traía «Propósito»;
  - los docs del cierre (capacidades, estimación) tenían otro formato en la rama y en la base.
  El agente añadió el bloque a la spec aprobada, convirtió la capacidad y lo anotó en el walkthrough.
  Ninguna regla dice si eso está permitido.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 0 y paso 4. La skill de migración a la
  2.0.0 tampoco habla de las features en curso; no la he localizado.
- **Por qué el kit no lo evitó**: el cierre supone que la spec y las capacidades se escribieron con la
  misma versión del kit que cierra.
- **Coste**: una intervención del dev-lead para el nombre de la skill, y unos 20 minutos de conversión y
  validación.
- **Propuesta**: en el paso 0, comparar la versión de `sdd-kit.json` de la rama de la feature con la de
  `merge.into`. Si difieren, integrar primero la base (hallazgo 3) y aplicar a los artefactos de la
  feature la conversión que la migración aplicó al resto. Esa conversión debería estar escrita en la
  skill de migración como «qué hacer con las features en curso», con permiso explícito para añadir a una
  spec aprobada el bloque que la versión nueva exige, anotándolo en el walkthrough.
- **Criterio de aceptación**: GIVEN una feature con la spec aprobada en 1.x y la base ya migrada a 2.0.0;
  WHEN se ejecuta el cierre; THEN el paso 0 detecta la diferencia de versión antes de escribir nada, y
  `Test-Capabilities.ps1` pasa sin que el agente improvise la conversión.

### 3. El cierre no dice cuándo integrar la base en la rama de la feature

- **Qué pasó**: la base traía cambios en 24 ficheros de `.docs/sdd/` y en los ficheros de paquetes. Si
  el cierre se hubiera escrito sin integrarla, `Invoke-SddMerge.ps1` habría chocado en ficheros que no
  son registros y el merge habría quedado «de una persona». El agente integró la base en la rama a mano,
  antes de escribir los docs del cierre. La receta del merge prohíbe cualquier `git merge` a mano salvo
  el de los registros, y no distingue el de sincronizar la rama de la feature. En la resolución:
  - el lockfile salió de una unión de los dos lados con claves duplicadas y dejó de cargar;
  - el clasificador de permisos del harness bloqueó al agente la resolución de los ficheros de paquetes
    y de configuración, y el usuario la hizo a mano;
  - la resolución a mano pisó otra ya hecha en un doc, y hubo que rehacerla en el commit de cierre.
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md`, «El merge es un script» y
  «Conflicto solo en los registros»; `skills/sdd-end-feature/SKILL.md` paso 10.
- **Por qué el kit no lo evitó**: el script integra el remoto en la rama destino, no la base en la
  feature, y la receta no contempla que la base haya cambiado docs vivos que el cierre va a tocar.
- **Coste**: unos 30 minutos, dos denegaciones del clasificador y un lockfile roto que el usuario
  detectó.
- **Propuesta**: un paso previo al paso 1 del cierre. Si `git diff --stat <merge-base>..<merge.into>`
  toca `.docs/sdd/**` o `sdd-kit.json`, se integra `merge.into` en la rama de la feature antes de
  escribir el walkthrough. El lockfile no se fusiona: se toma el de la rama y se regenera con el gestor
  de paquetes, y se comprueba con su modo congelado.
- **Criterio de aceptación**: GIVEN una base que cambió capacidades y el lockfile desde el merge-base;
  WHEN se cierra la feature; THEN el cierre integra la base antes de escribir los docs, el lockfile pasa
  la instalación congelada y `Invoke-SddMerge.ps1` fusiona sin conflicto.

### 4. Lo que generan los scripts no pasa el lint del proyecto

- **Qué pasó**: el paso 2 pide pegar sin retocar la línea «Tokens de subagentes» de
  `Measure-SessionTokens.ps1`, y con 24 despachos medía 1.533 caracteres. La regla de longitud de línea
  del proyecto (200) la rechazó y hubo que partirla en varias líneas. `Build-EstimationLog.ps1` escribe
  «sobreestimadas» e «infraestimadas», que el diccionario español del corrector ortográfico del proyecto
  no reconoce; hubo que añadirlas al diccionario del proyecto.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Measure-SessionTokens.ps1`,
  `skills/sdd-templates/scripts/Build-EstimationLog.ps1` y `skills/sdd-end-feature/SKILL.md` paso 2.
- **Por qué el kit no lo evitó**: los scripts no conocen el lint del proyecto, y el paso 2 prohíbe
  retocar la salida.
- **Coste**: dos pasadas más del lint, unos 5 minutos.
- **Propuesta**: que `Measure-SessionTokens.ps1` parta la lista de despachos en líneas de continuación
  de menos de 120 caracteres, y que `Build-EstimationLog.ps1` use las formas del diccionario de la RAE
  («sobrestimadas», «subestimadas»). O bien, que el paso 2 permita partir la línea sin cambiar cifras.
- **Criterio de aceptación**: GIVEN una sesión con 24 despachos; WHEN se pega la salida del script en el
  walkthrough y se regenera el log; THEN markdownlint con MD013 a 200 y cspell con `es-ES` pasan sin
  tocar nada.

### 5. `Invoke-SddMerge.ps1 -Push` aborta si la rama destino no tiene remoto

- **Qué pasó**: con `merge.push: true` y el perfil `delegate`, el paso 10 dice «Pasa `-Push` […] sin
  preguntar». El agente lo pasó y el script abortó con `push: no hay remoto configurado para 'develop'`
  antes de fusionar. La receta sí dice que sin remoto no se pasa `-Push`, pero el paso 10 no lo repite.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 10;
  `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`, línea 137.
- **Por qué el kit no lo evitó**: la condición está solo en la receta, y el script trata como error fatal
  un caso que el mensaje final ya sabe decir («push: no hecho: sin remoto»).
- **Coste**: una ejecución fallida, 1 minuto.
- **Propuesta**: que el script, sin remoto, fusione igual y avise con `push: no hecho: sin remoto`, en
  lugar de abortar.
- **Criterio de aceptación**: GIVEN un repo sin remoto y `merge.push: true`; WHEN se ejecuta
  `Invoke-SddMerge.ps1 -Push`; THEN fusiona, sale con código 0 y avisa de que no hubo push.

### 6. `Measure-SessionTokens.ps1` mide a medias un despacho que sigue en curso

- **Qué pasó**: el script se ejecutó mientras corría la re-revisión del cierre y la contó con «1 min». El
  despacho terminó después, y su cifra en el walkthrough es parcial.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Measure-SessionTokens.ps1`;
  `skills/sdd-end-feature/SKILL.md` paso 2, que no dice cuándo medir respecto al paso 9.
- **Por qué el kit no lo evitó**: el paso 0 manda hacer el paso 9 antes de escribir, pero no dice que la
  medida espere a que acabe.
- **Coste**: una cifra parcial en el walkthrough; bajo.
- **Propuesta**: el paso 2 mide después de que vuelva la re-revisión del paso 9; o el script marca
  «en curso» un despacho sin mensaje final.
- **Criterio de aceptación**: GIVEN una re-revisión despachada y sin terminar; WHEN se ejecuta el script;
  THEN la fila de ese despacho dice «en curso» o el paso 2 no deja medir todavía.

## Lo que hice por iniciativa propia

- Antes de integrar la base, listé sus commits y comparé con la rama los ficheros de paquetes y de
  configuración, porque el dev-lead avisó de la migración del kit. Así vi que la actualización de
  paquetes estaba duplicada en los dos lados. Funcionó: la resolución se centró en los tres ficheros que
  de verdad chocaban.
- Tomé el lockfile de la rama en lugar de fusionarlo, y lo comprobé con la instalación congelada.
  Funcionó; la resolución a mano, en cambio, lo había roto.
- Al fusionar el delta, corregí una regla de la capacidad nueva en la que la spec decía algo distinto de
  lo implementado (dónde vive el estado de la pestaña activa), y lo anoté en «Desviaciones» del
  walkthrough. El kit no dice qué hacer cuando el delta aprobado y la implementación difieren en una
  regla.
- Un script de Python fusionó los 20 requisitos del delta en seis capacidades, con la clave `### <título>`.
  Funcionó y `Test-Capabilities.ps1` lo validó, pero el kit no trae una herramienta para esto. Candidato a
  script del kit.

## Funcionó, no tocar

- La plantilla de re-revisión acotada con la cabecera de restricciones: un revisor Sonnet verificó 8
  puntos del smoke en 1 minuto, sin rehacer el diff ni la suite.
- `Test-Capabilities.ps1` cazó el bloque «Capacidades» que faltaba y la capacidad en formato 1.x antes del
  commit de cierre.
- `Invoke-SddMerge.ps1` sin `-Push` fusionó con `--no-ff` en el worktree de la rama destino y pasó la
  verificación sobre el resultado.
- `Build-EstimationLog.ps1` regeneró el log leyendo el bloque de tiempo del walkthrough sin avisos.

## Errores míos, no huecos del kit

- Pasé `-Push` sin comprobar antes que hubiera remoto, aunque la receta lo decía.
- El script de fusión falló a mitad por la codificación de la consola de Windows, tras escribir la
  primera capacidad; tuve que deshacerla y repetirlo con UTF-8.
- Pregunté al dev-lead de quién eran unos cambios de versiones de paquetes que no eran raros, y luego
  entendí al revés su respuesta y no los metí en ningún commit.
- Le describí un cambio de configuración como «tu cambio» sin mirar de dónde venía, y creyó que yo había
  revertido algo suyo.
