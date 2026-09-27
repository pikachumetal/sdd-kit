---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: patch
id: 20260925-072140-patch-0069-scope-brake-registries
task: 0069
mode:
date: 2026-09-25
---

# Ticket para el kit — patch 0069: los registros compartidos fuera del cruce de ficheros del freno

## Contexto

- Carril y modo: patch, perfil `delegate`
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback`; la referencia `control-profiles.md` como objeto del fix
- Proyecto: el propio kit (Markdown y Pester sobre pwsh 7), una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: sujetos Sonnet headless (8, RED y GREEN); ningún subagente del harness
- Coste en reloj: ~0,8 h, sin una pausa nocturna entre el RED y el GREEN
- Coste en tokens: 2,71 $ en sujetos; hilo no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La fila de deuda que motivó el patch no existía: el triaje dejó dos filas vacías

- **Qué pasó**: la petición citaba la fila «El cruce de ficheros del freno cuenta los registros compartidos». No estaba en el roadmap. El commit de triaje `9b62ba2` dice en su cuerpo «dos filas de deuda nuevas (registros en el cruce de ficheros, mensaje del merge)», pero su diff añade dos filas `| ` vacías (`roadmap.md:162-163`). Hubo que buscar la fila con cinco `grep` y leer el diff del triaje. Al cerrar, se cerró en parcial la fila del ticket 0026 §2, que describía el mismo fallo, y las dos filas vacías siguen en el roadmap.
- **Dónde en el kit**: no se localiza un paso del kit. El triaje de tickets de este repo es manual, y ningún test de `tests/` valida las tablas de `roadmap.md`. `sdd-end-patch` paso 4 da por hecho que la fila que el patch salda existe.
- **Por qué el kit no lo evitó**: ninguna comprobación mira que las filas del roadmap tengan contenido. Un patch que arranca de una fila tampoco comprueba que la fila exista.
- **Coste**: bajo en esta sesión, unos minutos de búsqueda. Pero la fila «mensaje del merge» sigue perdida, y ninguna task la va a recoger.
- **Propuesta**: (a) un test Pester del repo que falle si una tabla de `roadmap.md` tiene una fila con todas las celdas vacías; (b) en `sdd-start-patch` paso 1, si la petición cita una fila del roadmap que no existe, decirlo al usuario y buscar la fila equivalente antes de seguir.
- **Criterio de aceptación**: GIVEN un `roadmap.md` con una fila `| ` en «Deuda técnica», WHEN corre la suite, THEN un test falla y nombra la línea. Hoy los 654 tests pasan con las dos filas vacías.

### 2. Las salidas de los sujetos guardan el nombre de usuario y la ruta del home

- **Qué pasó**: el lanzador de sujetos (`subject.sh` de la 0039, que llama a `tools.mjs` de la 0009) sustituye `$RUN` por `<run>`, pero no el home del usuario. Las salidas de este patch traían `/c/Users/<usuario>/.claude/plugins`, una ruta `AppData\Local\Temp` y el usuario en los listados de `ls -l`. Las limpié con `sed` antes del commit. Medido en la rama: 110 ficheros de `red/out` o `green/out` de 12 carpetas de `specs/`, entre las tasks 0005 y 0061, llevan el nombre de usuario de la máquina.
- **Dónde en el kit**: `.docs/sdd/specs/20260923-120510-task-0009-merge-close/red/tools.mjs`, que reutilizan los lanzadores posteriores, y el método de test de skills de `tech-stack.md`. No es una skill.
- **Por qué el kit no lo evitó**: el saneado solo cubre la carpeta del run. Ni un test ni el pre-commit buscan rutas del home en la evidencia.
- **Coste**: bajo por ahora: es un dato personal del mantenedor en un repo que se publica, y no del dominio de ningún cliente. Crece con cada RED.
- **Propuesta**: `tools.mjs` sustituye también `$HOME` y el usuario (`<home>`, `<user>`). Un test del repo falla si hay rutas `C:\Users\…` o `/c/Users/…` en `specs/*/red|green/out`. Las 110 salidas existentes se sanean en un commit aparte.
- **Criterio de aceptación**: GIVEN una salida de sujeto con `C:\Users\<usuario>\…`, WHEN corre la suite, THEN falla un test que nombra el fichero. Hoy pasa.

### 3. La sesión retomada tras la pausa cargó las skills de la caché

- **Qué pasó**: la sesión arrancó con `Start-KitSession.ps1`. Tras una pausa nocturna se retomó sin el script, y el hook `SessionStart` avisó de que las skills no salían de la rama. Leí `skills/sdd-end-patch/SKILL.md` y `skills/sdd-feedback/SKILL.md` de la rama antes de seguir sus pasos, como pide el `CLAUDE.md`.
- **Dónde en el kit**: `.claude/hooks/Test-KitSessionSource.ps1` y la regla 2 del `CLAUDE.md` del repo.
- **Por qué el kit no lo evitó**: lo evitó. El aviso llegó y la regla dice qué hacer. Lo apunto como sexto reporte del mismo origen (tickets 0003, 0004, 0013, 0005 y patch 0024): pasa al retomar, no solo al arrancar.
- **Coste**: bajo, dos lecturas.
- **Propuesta**: ninguna nueva. Si se repite, que el aviso del hook dé el comando para relanzar con el script y retomar la conversación.
- **Criterio de aceptación**: GIVEN una sesión retomada sin el script, WHEN arranca, THEN el aviso nombra `./Start-KitSession.ps1` con la opción de retomar. Hoy nombra solo el contraste de textos.

## Lo que hice por iniciativa propia

- Monté el RED en el scratchpad antes de abrir el patch, reutilizando el molde `salas` (0044) y el lanzador de la 0039. Solo al reproducir el fallo reservé el id, creé la carpeta y moví ahí el lanzador y las salidas. Así cumplí «sin reproducir no se abre nada» (`sdd-start-patch` paso 1) en una edición de skill, donde reproducir es correr sujetos. Funcionó; `sdd-start-patch` no dice dónde viven los artefactos del RED antes de que exista la carpeta.
- Para cambiar el plan del molde sin tocarlo, redefiní su función en el lanzador (`eval "mold_$(declare -f plan_files)"`). Funcionó, y el molde compartido queda intacto.
- Añadí al RED un control (la base cambia además un fichero de verdad) que se repite en el GREEN, para probar que la exclusión no tapa un solape real. La petición lo pedía; lo apunto porque en un freno que se relaja es lo que distingue el fix de un agujero.

## Funcionó, no tocar

- `Get-NextSddId.ps1 -Reserve` dio 0069 sin choques, con cinco worktrees en paralelo.
- `Invoke-SddMerge.ps1 -Push` fusionó y publicó a la primera. La receta dejó claro que el hook `pre-merge-commit` sustituye a `-VerifyCommand`.
- El formato de cierre `parcial — …; queda: …` de `roadmap-template.md` sirvió tal cual para una fila saldada a medias.
- La cita del RED s1-2 («la regla no distingue por filas, y decidirlo es del dev-lead») fue la mejor evidencia del fallo, y salió de un molde ya existente.

## Errores míos, no huecos del kit

- Lancé la suite completa antes de escribir el GREEN y `patch.md`, y después tuve que comprobar que ningún test recorre esos ficheros para dar el resultado por bueno.
- Busqué la fila del roadmap por el título literal de la petición, y tardé varias búsquedas en ir al diff del triaje.
