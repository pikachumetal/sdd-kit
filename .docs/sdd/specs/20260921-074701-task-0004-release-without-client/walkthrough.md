---
id: 20260921-074701-task-0004-release-without-client
task: 0004
title: Walkthrough — Carril release opcional y fuera de un contexto de cliente
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-21
---

# Walkthrough — Carril release opcional y fuera de un contexto de cliente

## 1. Cambios realizados

- **`sdd-end-release`** (`cce63e7`, `789d508`):
  - El Overview la presenta como el corte de publicación, que se lanza haya habido apertura o no, y condiciona las release notes a que haya destinatario.
  - Los pasos 5 y 8 solo aplican con `release.hasRecipient: true`.
  - El paso 7 lleva el gate de merge y tag acotado: sin segunda ronda cuando se cumplen las tres condiciones (orden de cierre del usuario, versión escrita o aceptada respondiendo a la propuesta del paso 1, y `hasRecipient: false` escrito por el usuario sin scope movido). Además, en modo `tracker`, lista los ids de ticket.
  - Red flags nuevos: el atajo concedido por el agente y la carpeta de la release sin contenido. Dos filas de racionalización, una con la cita literal del baseline y otra con la autoconcesión en primera persona.
- **`sdd-end-release/references/notas-y-roadmap.md`**: release notes y email solo con destinatario; definición de smoke y hallazgo; la línea `smoke: <fecha> · <N> hallazgos (<qué se ejecutó>; <M> corregidos en la release)`, con `smoke: pendiente` si no se ejecutó.
- **`sdd-start-release`**:
  - El Overview dice que la skill es opcional y la usa el PM o el PO en un equipo, o nadie si la planificación vive en el gestor; con gestor, la fuente del scope es el gestor.
  - El paso 4 define comprometida y en preparación, y con `hasRecipient: false` no pregunta.
  - El paso 5 matiza «Roadmap como única fuente».
- **`.docs/sdd/sdd-kit.json`** de este repo: `"release": { "hasRecipient": true }`.
- **`tests/ReleaseFlow.Tests.ps1`** (escrito por el hilo, movido por el implementador): el marcador del kit declara el campo, las dos skills del carril lo leen y **ninguna skill de task o patch nombra la release**. Esta última es la guarda del modo incremental.
- **Evidencia**: `tests/release-flow-red.md`, `tests/release-flow-green.md`; moldes, lanzadores y salidas en `red/` y `green/` de esta carpeta (ruta más larga: 138 caracteres).
- **Capacidad nueva** `capabilities/release-flow.md`, fusionada en este cierre desde el delta.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3,0h
- Esfuerzo real: 2,2h de implementación (13:13 → 15:25, hora local, por las marcas de los commits) + 1,5h de spec y plan (09:47 → 13:13, descontada la pausa del dev-lead para hablarlo con un compañero, de 10:14 a ~13:00 aproximadamente) = **3,7h en total**, aproximado
- Desviación: −0,8h (−27%) sobre la implementación
- Causa de la desviación: dentro del umbral. Los 24 sujetos corrieron en paralelo y en segundo plano, así que su duración no suma al reloj; lo que sí costó reloj fueron E5 y E5-bis, dos escenarios añadidos a mitad de campaña (~25 min).
- Review de spec: 1 revisor (dominio) · hallazgos 7, aceptados 7
- Coste de subagentes: ~532k tokens en 4 despachos (revisor de spec 103k, implementador 205k con su ronda de arreglos, revisor de task 142k, re-revisor 82k), más 22,10 $ en 24 sujetos headless (RED 11,95 $ con 12 sujetos; GREEN 10,15 $ con 12). Reloj del hilo: **no medido** con contador.

## 3. Desviaciones del plan

- **La spec cambió de modelo dos veces antes de aprobarse.** Primero, el destinatario pasó de ser una línea del roadmap a configuración en `sdd-kit.json`, a petición del dev-lead. Después llegó una enmienda del dev-lead para declarar el modo incremental, y con ella `sdd-end-release` pasó a ser el corte sin apertura previa y no hay interruptor de carril. Una conversación sobre roles en equipo añadió la lista de tickets y el matiz del roadmap con gestor.
- **Recorte por el RED (Art. I), reaprobado por el dev-lead.** Se quedan sin guía nueva, porque el baseline ya los cumplía: cierre sin apertura (6/6), versión propuesta con motivo (6/6), bump con el tooling o sin fichero (6/6) y acta sin fuente cuando no hay destinatario (4/4). Siguen en la capacidad como comportamiento verificado. El test del hilo perdió la aserción del bump.
- **E5, añadido tras leer E1–E4.** Con dos turnos, el agente presentaba versión, merge y tag juntos y la segunda ronda no aparecía. E5 reproduce el orden del caso de campo: la autorización primero y la corrección de versión después.
- **E5-bis, añadido tras el GREEN.** El molde `m1` (código stub, commits vacíos) paraba a los sujetos en el gate de entrada antes del gate de merge. Se creó `m5`, con código y tests reales, y se ejecutó en los dos brazos (3,32 $ más). Ruling en el ledger.
- **Ronda de arreglos de la Task 2.** Se arreglaron los dos Important del revisor, marcados como mandados por el plan (el Overview y el paso 5 contradecían el predicado nuevo), aunque el plan limitaba la superficie a otros pasos; la spec manda. También se partió la fila de racionalización combinada.
- **La capacidad recoge lo verificado, no lo que el delta prometía.** Al fusionar se acotaron tres requisitos a lo que midieron RED y GREEN: la tabla de major, minor y patch; el caso «ficheros de versión sin comando declarado»; y el acta sin fuente, que solo aplica sin destinatario. Queda anotado en el historial de `capabilities/release-flow.md`.
- **Tests RED sin commitear antes del despacho**, por el pre-commit de suite verde: se aparcaron en `red/` y el implementador los movió con `git mv`, igual que en la 0002.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`: 205 pasados, 0 fallos, 6 omitidos (ejecutado por el implementador y en cada pre-commit; el último en `1d1dda0`).
- Test del hilo en RED antes de implementar: 2 fallos y la guarda en verde (salida en `tests/release-flow-red.md`, Task 1 Step 7).

### 4.2 Smoke / tests

- Validado por el dev-lead: **no — validación diferida**. Cita literal (2026-09-21): «validacion diferida, es que estas cosas las podre probar en el dia a dia.» El dev-lead explicó que un cambio de proceso no se prueba como una app («crear un usuario»), y que la campaña de agentes es la mejor prueba disponible hasta usar el kit. Es la misma anomalía aceptada que en las tasks 0001 y 0011, y queda como caso de campo para la task 0008 (validación diferida).
- Verificado por el agente (campaña GREEN, `tests/release-flow-green.md`):

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Release notes sin destinatario (RED 6/6 las escribían) | Corregido: 0/4 en el GREEN; con cliente (E2) siguen escribiéndose |
| 2 | Campo `hasRecipient` ausente | 2/2 preguntan y no lo escriben sin respuesta; el gate queda entero |
| 3 | «Comprometida» sin destinatario (RED 1/2 preguntó) | Corregido: 2/2 «en preparación» sin preguntar |
| 4 | Segunda ronda de merge y tag, en el orden del caso de campo (RED 4/4, E5 y E5-bis) | Corregido: E5-bis 2/2 ejecutan merge y tag citando las tres condiciones; E1 2/2 igual |
| 5 | Smoke contado distinto | Corregido: 5 de 7 cierres ejecutan un smoke real y usan la forma nueva; los otros 2 escriben `pendiente`, que es la salida honesta |
| 6 | Lista de tickets en modo tracker (RED 0/2) | 2/2 presentes, 1/2 como lista explícita |
| 7 | Control con cliente y gestor (no regresión) | Presenta merge y tag y espera; sin atajo |

### 4.3 Residuales / deuda generada

Van al roadmap:

- **Tag antes del merge, de forma transitoria**: 5/6 en el RED y 4 casos en el GREEN. `git merge -F -` falla dentro de una cadena con `;` y el tag se crea igual sobre el `main` viejo. Todos lo detectaron y lo rehicieron. Propuesta: el tag, en un comando aparte, después de comprobar que el merge terminó.
- **Merge de vuelta `main` → `develop`**: la skill no lo nombra; 3/6 sujetos lo dejaron pendiente.
- **El Overview de `sdd-end-release` sigue listando «feedback triado» sin condición** (Minor diferida del re-revisor).
- **El paso 8 de `sdd-end-task` con tasks que solo existen en el gestor** («marcar el módulo/tarea» cuando no hay fila): task aparte, fuera de esta rama porque `sdd-end-task` es fichero caliente de la 0003.
- **Para la 0012**: la pregunta de la entrevista «¿trabajas por releases o de forma incremental?» sobra, porque no hay interruptor. Lo que sí puede preguntar la init es `release.hasRecipient`.

## 5. Aprendizajes

- **Un gate que depende de una respuesta del usuario se mide con dos turnos** (`claude -p --resume <session_id>` con un segundo mensaje fijo), no con uno: la segunda ronda solo existe después de la respuesta. → `tech-stack.md` (Sujetos headless).
- **El orden de los mensajes del caso de campo es parte del fixture.** Con «cierra la release» seguido de «sí, vX, adelante», 0 de 6 sujetos mostraron la segunda ronda; con la autorización primero y la corrección de versión después, 4 de 4. Un baseline que no falla puede ser un guion que no reproduce el caso. → `tech-stack.md` (Fixtures y baselines).
- **El ruido del molde puede tapar el gate que se mide, y la comparación limpia se repite en los dos brazos.** El código stub paró a los sujetos en el gate de entrada, antes del de merge; E5-bis rehízo la medida sobre un molde con código real en RED y GREEN. → `tech-stack.md` (Fixtures y baselines).
- **Un modo que no cambia nada no necesita interruptor.** El modo incremental ya funcionaba; bastó declararlo y dejar `sdd-end-release` usable sin apertura. La configuración (`hasRecipient`) solo aparece donde el comportamiento sí cambia. → roadmap (decisión) y capacidad `release-flow`.
- **Las tareas de proceso se validan tarde por naturaleza**: el dev-lead no puede probar un cambio del kit fuera del uso diario. → roadmap, fila de la task 0008.
- **El hook de comandos peligrosos bloquea un here-string con rutas** («Remove-Item on system path '/' is blocked») aunque no borre nada: dos falsos positivos en esta sesión, al anexar texto con `Add-Content @'…'@`. Escribir con la herramienta de edición. → `tech-stack.md` (Trampas de hooks).
