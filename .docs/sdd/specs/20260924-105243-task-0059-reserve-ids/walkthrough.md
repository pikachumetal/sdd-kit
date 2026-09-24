---
id: 20260924-105243-task-0059-reserve-ids
task: 0059
title: Walkthrough — Reservar ids en vez de calcularlos
spec: ./spec.md
status: done
created: 2026-09-24
---

# Walkthrough — Reservar ids en vez de calcularlos

## 1. Cambios realizados

- **Script** (`1c81c98`):
  - `Get-NextSddId.ps1 -Reserve [-Count N] [-LockTimeoutMinutes]` toma el cerrojo `sdd-ids.lock` del directorio común de git, escanea como antes, toma como base el mayor valor entre el contador y el escaneo, y consume los ids en `sdd-ids`.
  - Hay un contador por proyecto: si el proyecto está en una subcarpeta de su repositorio, el fichero es `sdd-ids-<ruta relativa>` (es la enmienda de la spec).
  - Sin `-Reserve`, el script propone contando el contador y no escribe nada.
- **Cerrojo compartido** (`1c81c98`): `Invoke-SddMerge.ps1` pierde sus funciones de cerrojo, que pasan a `SddLock.ps1` (`New-SddLock`, `Enter-SddLock`, `Exit-SddLock`). Las cargan los dos scripts. Los mensajes del merge no cambian, y los del id van a la salida de error, porque la salida estándar es el id.
- **Test** (`1c81c98`): `tests/Get-NextSddId.Tests.ps1` añade 15 casos de `-Reserve`. Entre ellos están dos procesos de dos worktrees compitiendo por un cerrojo retenido, el cerrojo que no se libera, el contador ilegible, el tope 9999, el modo tracker, los duplicados, el caso sin git y el monorepo.
- **Guidance** (`7d04d86`):
  - `nombrado.md`, el paso 2 de `sdd-start-patch` y el paso 3 de `sdd-start-release` («Ids reservados», con `-Reserve -Count N`) pasan a reservar. También cambia `roadmap-fuente.md`.
  - El índice de scripts de `sdd-templates` describe `-Reserve` y `SddLock.ps1` (`1c81c98`).
  - El contrato de texto va en `tests/TaskIds.Tests.ps1`, y la evidencia en `tests/reserve-ids-red.md` y `tests/reserve-ids-green.md`.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 3 h. Es el punto medio del rango 2,5–3,5 h de la spec, que incluía el hito 3.
- Esfuerzo real: 1,3 h — reloj del hilo aproximado por las marcas de los commits:
  - apertura a las 12:58;
  - script a las 13:25;
  - guidance a las 13:36;
  - revisión final y smoke hasta ~13:55;
  - cierre ~0,3 h.
  La espera hasta la validación del dev-lead no cuenta. La spec, ~0,3 h antes, queda fuera de este número.
- Desviación: −1,7 h (−57 %)
- Causa de la desviación: el hito 3 (`sdd-start-task`) no se hizo, porque la 0057 no está en `develop`; eran ~0,5 h. El resto se debe a que los sujetos corrieron en segundo plano mientras se escribía el código o la evidencia, y el cerrojo ya estaba escrito y probado en `Invoke-SddMerge.ps1`. Es el sesgo de sobreestimar la guidance que ya advierte `estimation.md`.
- Modelo del hilo: Opus 5.5 (1M context)
- Tokens del hilo: no medido
- Tokens de subagentes: 142895 en 1 despacho — revisor final Sonnet (effort medium) 143k / 4 min
- Coste de sujetos: 2,95 $ en 9 sujetos Sonnet — RED 2,05 $ (6); GREEN 0,90 $ (3)
- Review de spec: no

## 3. Desviaciones del plan

Es una task lite, sin plan. Se desvió de la spec aprobada en esto:

- **Enmienda aprobada**: pasa a haber un contador por proyecto, en vez de uno por repositorio. El test «sin repositorio git» reservó en el `.git` de la carpeta Temp del dev-lead, que es un repositorio. Aprobada con «Uno por proyecto (Recomendada)».
- **El hito 3 no se hizo.** La 0057 seguía en su rama y no estaba en `develop`. Se aplicó la instrucción del arranque: cerrar sin el hito y anotarlo en la fila.
- **El RED se amplió** de 3 a 6 sujetos a petición del dev-lead («Un sujeto más por escenario»). La primera tanda salió 3/3 limpia, y la segunda sacó el fallo (r1-2).

### Decisiones tomadas sin el dev-lead

- El índice de scripts de `sdd-templates` se actualizó en el hito 1, no en el 2 — describe el script y va con él — coste si está mal: ninguno, es documentación.
- Añadí un test de contrato en `TaskIds.Tests.ps1` (los tres arranques nombran `-Reserve` y la release, `-Reserve -Count`), que la spec no pedía — es la barrera que no depende de una muestra de sujetos — coste si está mal: un test más que mantener.
- Quité la cita «ticket del patch 0027 §1» de un comentario que ya existía en `Get-NextSddId.ps1`, al moverlo — Art. X — coste: ninguno.
- En el test «sin repositorio git» uso `GIT_CEILING_DIRECTORIES` — sin él, el test depende de que el temporal no esté dentro de un repositorio — coste si está mal: el test no cubriría un temporal fuera de git, y eso ya lo cubría el caso anterior.
- Descarté tres Minor de la revisión final:
  - las dos menciones sin `-Reserve` del red flag y de la racionalización de `sdd-start-release`, porque dicen el origen legítimo del id, no un cálculo, y cambiarlas pediría otro RED;
  - un test del rango de `-Count`, porque `ValidateRange` es declarativo;
  - la doble llamada a `Assert-SequenceMode`, que es a propósito: la primera evita crear el cerrojo en modo tracker.
  Coste si está mal: un texto menos homogéneo en release.

## 4. Verificación

### 4.1 Builds

- Sin build. `Invoke-Pester tests/Get-NextSddId.Tests.ps1`: 41/41, en RED primero (11 fallos por «A parameter cannot be found that matches parameter name 'Reserve'»).
- `Invoke-Pester tests/Invoke-SddMerge.Tests.ps1`: 16/16 tras extraer el cerrojo.
- Suite rápida (`-ExcludeTagFilter Slow`): 514/514, también en el pre-commit de cada hito.

### 4.2 Smoke / tests

- Validado por el dev-lead: 2026-09-24 · «si, para mi esta porobada». Ejecutó `Get-NextSddId.ps1 -ProjectRoot <worktree 0059> -Reserve -Count 2` sobre el propio kit y obtuvo `0060` y `0061`. No encontró el contador en `<worktree>\.git\sdd-ids`, porque la ruta que le di era errónea: en un worktree está en el directorio común. El hilo lo comprobó en `D:\code\git\sdd-kit\.git\sdd-ids` (`0061`) y lo borró a petición suya, para devolver 0060 y 0061 a la secuencia.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Propuesta sin `-Reserve` sobre el kit (agente) | `0060`, sin contador creado |
| 2 | 6 procesos reservando a la vez en un repo de prueba (agente) | 0006–0011, 6 distintos; contador `0011`; cerrojo liberado |
| 3 | `-Reserve -Count 2` sobre el kit (dev-lead) | `0060`, `0061`; contador `0061` en el directorio común |
| 4 | Campaña RED/GREEN de la guidance (agente) | RED: 5/6 reservan, r1-2 calcula; GREEN: 3/3 reservan |

### 4.3 Residuales / deuda generada

- **Pendiente, en la fila 0059**: los pasos 2 y 3 de `sdd-start-task`, su red flag («has creado la carpeta antes de la rama») y su racionalización siguen diciendo que la rama es el acto de reserva. Van cuando la 0057 esté en `develop`, con su RED proporcional.
- El GREEN es de un sujeto por escenario, frente a un fallo que apareció 1 de 6. El contrato de texto de `TaskIds.Tests.ps1` es la barrera que no depende de la muestra.

## 5. Aprendizajes

- En un worktree, `.git` es un fichero: el contador y el cerrojo viven en `git rev-parse --git-common-dir`. Lo que se diga al dev-lead para mirarlo tiene que usar esa ruta. → `capabilities/task-ids.md` (regla «Dónde viven los datos»).
- La carpeta temporal de una máquina puede estar dentro de un repositorio git, y lo está en la del dev-lead. Un test «sin git» necesita `GIT_CEILING_DIRECTORIES`, y un script que escribe en el directorio común de un repositorio padre escribe en un `.git` ajeno. → `tech-stack.md` (fixtures).
- La ayuda de un script (`.EXAMPLE`) es guidance que los sujetos leen: 5 de 6 descubrieron `-Reserve` ahí. Quien ejecuta el script sin abrirlo sigue el texto de la skill. Una primera tanda limpia (3/3) casi recorta una guidance que sí hacía falta. → `tech-stack.md` (fixtures y baselines).
- Delta de la spec fusionado en `capabilities/task-ids.md`. → `capabilities/task-ids.md`

## 6. Adendas
