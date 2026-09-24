---
kit_version: 1.1.0
superpowers_version: 6.4.1
lane: patch
id: 20260924-224042-patch-0066-estimation-log-minutes
task: 0066
mode:
date: 2026-09-25
---

# Ticket para el kit — patch 0066: `Build-EstimationLog.ps1` convierte los minutos y avisa de otras unidades

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback` (y `superpowers:systematic-debugging`)
- Proyecto: el propio repo del kit (PowerShell + Pester, un dev-lead)
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~0,4 h
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. «No reproduce sobre la base actual» es ambiguo cuando el dato que disparó el fallo ya se corrigió a mano

- **Qué pasó**: el ticket del patch 0065 reportaba la fila «30 | 25» del log. Al investigar, el `patch.md` de la 0065 ya decía «0.5h» / «0.4 h» (se corrigió a mano en su cierre) y ninguna fila del corpus llevaba minutos: regenerar el log sobre la base actual no reproducía el síntoma. El defecto del código sí se reproducía con un `patch.md` de prueba («30 min» → `30`). Seguí con el patch, pero la letra del paso 1 («si la investigación no reproduce el fallo sobre la base actual → STOP») admite la lectura contraria.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 1, párrafo «Si la investigación no reproduce el fallo…».
- **Por qué el kit no lo evitó**: el texto no distingue entre reproducir el defecto (el código hace mal la conversión con una entrada mínima) y reproducir el dato concreto del reporte (la fila que salió mal en el corpus).
- **Coste**: bajo en esta sesión (una duda resuelta leyendo el código); un sujeto literal pararía un patch legítimo y re-mediría la fila como «no reproduce».
- **Propuesta**: una frase en el paso 1: reproduce el fallo quien lo dispara con una entrada mínima (un test, un fichero de prueba) sobre el código actual, aunque el dato del reporte ya se haya corregido a mano.
- **Criterio de aceptación**: GIVEN un reporte de un script que convierte mal una entrada y el artefacto del reporte ya corregido a mano, WHEN el sujeto sigue `sdd-start-patch`, THEN abre el patch con un test RED sobre una entrada mínima, en vez de parar por «no reproduce».

### 2. Worktree creado con el id de otra fila del roadmap

- **Qué pasó**: el worktree y la rama se llamaban `0064`, que en el roadmap es la task del renombrado task → feature. El patch reservó `0066` con `Get-NextSddId.ps1 -Reserve` y renombré la rama a `feature/0066` antes del primer commit, porque el dev-lead lo pidió en la petición («si la rama del worktree no lleva el id reservado, renómbrala antes del primer commit»). La carpeta del worktree sigue llamándose `0064`, y el mensaje final manda borrar `D:\…\0064`, que no se parece al id del patch.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 2 y `skills/sdd-start-task/references/nombrado.md`. No dicen qué hacer si la rama ya existe con otro id.
- **Por qué el kit no lo evitó**: el paso 2 reserva el id para la carpeta, pero no compara la rama actual con el id reservado.
- **Coste**: nulo aquí gracias a la instrucción del dev-lead; sin ella, el patch habría salido en `feature/0064`, que choca con la rama de la task 0064 cuando se abra.
- **Propuesta**: en el paso 2, después de reservar: si la rama actual lleva un id distinto del reservado y no tiene commits propios, se renombra (`git branch -m`) antes del primer commit, y se dice.
- **Criterio de aceptación**: GIVEN un worktree en `feature/0064` sin commits propios y la reserva devuelve `0066`, WHEN el sujeto sigue `sdd-start-patch`, THEN el commit del fix sale en `feature/0066`, sin que el usuario lo pida.

## Lo que hice por iniciativa propia

- Acepté `hora` y `horas` como `h`, además de lo pedido (`h`, sin unidad, `min`): tomarlas por unidad desconocida y avisar habría sido ruido. Funcionó; queda en el test «lee hora y horas como h».
- El aviso por unidad desconocida lleva la ruta del fichero, para que se localice sin buscar. Un real en otra unidad deja la fila excluida con el aviso que ya existía, además del nuevo.

## Funcionó, no tocar

- `Get-NextSddId.ps1 -Reserve` dio el id en un segundo, con tres worktrees en paralelo.
- `Invoke-SddMerge.ps1 -Push` fusionó y publicó sin intervención.
- Que el paso 5 de `sdd-end-patch` regenere el log con el script ya dejó ver que el diff solo trae la fila nueva y los agregados.

## Errores míos, no huecos del kit

- Lancé un heredoc a `python` para editar changelog y roadmap; en Windows el `python` del PATH se quedó esperando y tuve que parar el comando. Lo rehíce con Edit.
- La primera versión del test esperaba `—` en la fecha, pero el script la saca de la carpeta: dos tests fallaron por mi esperado, no por el defecto.
