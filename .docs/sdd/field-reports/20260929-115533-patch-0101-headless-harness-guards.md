---
kit_version: 2.0.0 (sdd-kit.json del proyecto; skills del working tree a 2.1.0)
superpowers_version: 6.4.2
lane: patch
id: 20260929-115533-patch-0101-headless-harness-guards
task: 0101
mode:
date: 2026-09-29
---

# Ticket para el kit — patch 0101: tres guardas del arnés headless, cerrado sin fricción salvo el tiempo real

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback` (las tres leídas del working tree: la sesión no salió de `Start-KitSession.ps1`)
- Proyecto: el propio repo del kit (plugin de Claude Code, tests en Pester y bash), una persona
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica
- Coste en reloj: ~0,5 h (de la reserva del id a las 11:34 UTC al merge hacia las 11:52 UTC, más la lectura previa)
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El tiempo real de `patch.md` §5 se escribe sin fuente, antes de que acabe el patch

- **Qué pasó**: escribí «Real: 0.6h» en `patch.md` al redactarlo, antes del commit del fix y del cierre, sin medir nada. `Build-EstimationLog.ps1` lo copió al log y ya cuenta en la calibración del carril patch (24 filas, mediana 1.2). Los tiempos de git (carpeta 11:34 UTC, fix 11:40, cierre 11:50) daban otra cifra.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 3 («tiempo») y `skills/sdd-end-patch/SKILL.md` paso 1 («tiempo invertido. Nunca en blanco»); `patch-template.md` §5.
- **Por qué el kit no lo evitó**: pide que el tiempo no quede en blanco, pero no dice de dónde sale. «Nunca en blanco» empuja a poner un número aunque sea inventado.
- **Coste**: bajo por patch. Pero todas las filas de patch del log de estimación pueden tener el mismo sesgo.
- **Propuesta**: en el paso 1 de `sdd-end-patch`, sacar el real del reloj: desde el timestamp UTC de la carpeta del patch hasta la hora del commit de cierre, más lo que hubo antes de la carpeta si se sabe. Si es una estimación, marcarlo como tal: «Real: ~0.5h (no medido)».
- **Criterio de aceptación**: GIVEN un patch cuya carpeta es de las 11:34 UTC y cuyo cierre se commitea a las 11:50 UTC WHEN `sdd-end-patch` rellena §5 THEN «Real» da una cifra derivada de esas horas (≈0.3h más lo previo) o dice «no medido». Hoy 1 de 1 sujetos (esta sesión) escribió una cifra sin fuente.

## Lo que hice por iniciativa propia

- **La causa raíz se reprodujo con un test RED por pieza, sin invocar `superpowers:systematic-debugging`**. El paso 1 de `sdd-start-patch` lo pide como obligatorio. Aquí las tres causas se veían leyendo `lib.sh`: sin chequeo de `plugin.json` en `subject_init`, `claude` sin tope y `--add-dir` solo del kit. La evidencia fueron tres tests de Pester en rojo antes del fix (sin «define SUPERPOWERS_DIR»; 67 s con un `claude` falso que duerme 60 s; ningún `--add-dir` a la carpeta del sujeto). Funcionó, pero es un desvío del texto: o el kit acepta el RED como reproducción en un defecto de código determinista, o esta sesión debió invocar la skill.
- **`type -P claude` en lugar de `command -v claude`**: el `subject.sh` de la feature 0098 define una función `claude()`, y `command -v` devolvería su nombre. Quedó en `lib.sh` y en `tech-stack.md`.
- **Saldé dos filas de deuda con un patch**: «Patch del arnés headless» y «`lib.sh` no deja al sujeto leer fuera del molde», que pedía el mismo `--add-dir`. El paso 4 de `sdd-end-patch` habla de «una fila». El plural no dio problemas, porque el formato de cierre sirve fila a fila.

## Funcionó, no tocar

- El aviso del hook `SessionStart` («las skills no salen de la rama») llevó a comparar `sdd-start-patch` de la caché con la del working tree. Solo diferían en la variante visual, que no aplicaba.
- `Get-NextSddId.ps1 -Reserve` y el renombrado de `feature/<slug>` a `feature/<id>-<slug>` antes del primer commit, como dice el paso 2.
- La validación diferida resolvió en una sola pregunta: la opción ya traía el uso y el dueño, así que no hizo falta un turno de más.
- `Test-Capabilities.ps1`, `Build-EstimationLog.ps1` e `Invoke-SddMerge.ps1 -Push`: los tres a la primera.

## Errores míos, no huecos del kit

- Llamé a `Get-NextSddId.ps1` con un `-Slug` que no existe; el paso 2 no lo nombra.
- El primer `git commit -F -` con un here-string por tubería en PowerShell falló: git tomó el mensaje como pathspec y no hubo commit. Lo resolví con el mensaje en un fichero del scratchpad.
