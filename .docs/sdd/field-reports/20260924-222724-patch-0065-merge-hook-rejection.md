---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: patch
id: 20260924-222724-patch-0065-merge-hook-rejection
task: 0065
mode:
date: 2026-09-25
---

# Ticket para el kit — patch 0065: `Invoke-SddMerge.ps1` distingue el hook que rechaza el merge de un conflicto

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback`, y los scripts `Get-NextSddId.ps1`, `Build-EstimationLog.ps1` e `Invoke-SddMerge.ps1`
- Proyecto: el propio kit (plugin de skills en markdown y scripts PowerShell con Pester), un dev-lead
- Modelo del hilo: Claude Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~25 min hasta el merge
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `Build-EstimationLog.ps1` lee «30 min» como 30 horas y no avisa

- **Qué pasó**: la §5 de `patch.md` decía `- Estimación: 30 min` y `- Real: 25 min`. El script generó la fila `| patch | 30 | 25 | 0.83 |` sin avisar, y las horas reales de «sin publicar» pasaron de 50.05 a 75.05. Solo lo vi al leer el `git diff` del log antes del commit de cierre.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Build-EstimationLog.ps1` (`ConvertTo-Hours`, llamado en las líneas 128 y 141), y la §5 de `skills/sdd-templates/templates/patch-template.md` («Estimación: <Xh>»).
- **Por qué el kit no lo evitó**: la plantilla pide horas, pero en un patch de menos de 30 minutos lo natural es escribir minutos. El script toma el número y descarta la unidad. Además, `sdd-end-patch` paso 5 no pide revisar el diff del log.
- **Coste**: habría inflado en 25 h el total de la release y los percentiles del log, y nadie lo habría visto hasta la release.
- **Propuesta**: `ConvertTo-Hours` convierte `min` a horas. Con cualquier otra unidad que no sea `h`, avisa y deja la celda vacía en vez de adivinar.
- **Criterio de aceptación**: GIVEN un `patch.md` con `- Real: 25 min` WHEN se ejecuta `Build-EstimationLog.ps1` THEN la fila lleva `0.42` en «Real (h)». Hoy lleva `25`.

### 2. `sdd-start-patch` no dice qué hacer con una rama que ya existe y no casa con el id reservado

- **Qué pasó**: la sesión arrancó en un worktree que ya tenía la rama `feature/004-patch`, creada antes de reservar el id. `Get-NextSddId.ps1 -Reserve` dio `0065`, y la rama se fusionó con un nombre que no casa con el id. El commit del merge dice `merge: feature/004-patch en develop`.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 2. Nombra la carpeta y el id, pero no la rama.
- **Por qué el kit no lo evitó**: el paso 2 no tiene la comprobación «si la rama ya existe, ¿casa con el id?». La fila 0059 del roadmap ya apunta que la regla «la rama es la reserva» sigue pendiente en `sdd-start-task`.
- **Coste**: bajo. Es trazabilidad: `git log` no enlaza la rama con el patch.
- **Propuesta**: si el patch arranca en una rama ya creada cuyo nombre no lleva el id reservado, el paso 2 la renombra (`git branch -m`) antes del primer commit, o lo dice en el mensaje final.
- **Criterio de aceptación**: GIVEN un worktree en `feature/xyz` sin commits propios y el id reservado `0065` WHEN el agente sigue el paso 2 THEN renombra la rama a `feature/0065-<slug>` o lo anota antes del primer commit.

## Lo que hice por iniciativa propia

- Leí el `git diff` de `estimation-log.md` después de regenerarlo y antes de commitear. Así salió el hallazgo 1. Candidata a línea de `sdd-end-patch` paso 5: «revisa que el diff del log añade una sola fila y que las horas reales de la release suben lo que dice `patch.md`».
- Antes de editar `merge-recipe.md`, comprobé si el texto actual ya cubría el mensaje nuevo. Lo cubría (el prefijo `verificación:` no se reintenta), así que el patch no tocó ninguna skill y se ahorró el ciclo RED→GREEN del Art. I.
- Llevé la contraria al arreglo pedido. Sin ficheros en conflicto, el mensaje culpa siempre al hook, pero otro fallo de git sin conflicto (`not something we can merge`) también caería ahí. Se lo dije al dev-lead con la señal para afinarlo (`MERGE_HEAD` presente) y no lo implementé.

## Funcionó, no tocar

- Test Pester en RED antes del fix con la fixture de `Invoke-SddMerge.Tests.ps1` (repo bare, remoto y worktrees). Añadir un `core.hooksPath` con un `pre-merge-commit` en rojo costó 15 líneas.
- `Get-NextSddId.ps1 -Reserve` reservó el id después de reproducir el fallo, como pide el paso 1 de `sdd-start-patch`.
- `Invoke-SddMerge.ps1 -Push` con `delegate` y `merge.push: true`: fusionó y publicó sin preguntas, y el hook `pre-merge-commit` del repo pasó la suite.

## Errores míos, no huecos del kit

- Escribí la §5 en minutos cuando la plantilla dice `<Xh>`. El hallazgo 1 es que el script lo acepta sin avisar.
