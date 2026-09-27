---
id: 20260922-211157-task-0019-init-files
task: 0019
title: Walkthrough — Lo que crean las init: ficheros y configuración
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-23
---

# Walkthrough — Lo que crean las init: ficheros y configuración

## 1. Cambios realizados

- **Partición y alcance** (`02da87b`, en `develop`). La fila 0019 tenía doce frentes vivos, así que se partió en tres: esta, la 0033 (capacidades al nacer) y la 0034 (proceso de la init). La pregunta de `release.hasRecipient` sale de la fila, porque ya la hacen las skills del carril release.
- **Paridad migración–init** (`ba20ef5`). Las migraciones que escriben `sdd-kit.json` (`v1.0.0.md`, `v1.1.0.md` y `v1.2.0.md`) declaran en una línea `**Escribe**:` lo que escriben, y `migrations/README.md` fija esa regla. El test nuevo es `tests/MigrationInitParity.Tests.ps1`: busca cada token declarado en el corpus de cada init (`SKILL.md`, `references/` sin las migraciones y los `.md` enlazados a un salto). Nada más escribirlo destapó que ninguna init nombraba `ids.mode` literal, y ahora las dos lo nombran.
- **Configuración y log** (`80a0617`). Las dos init dejan tres cosas:
  - `.claude/settings.json` con `"autoMemoryEnabled": false`, fusionado; si la clave ya estaba a `true`, preguntan antes de cambiarla.
  - `.gitignore` con `.playwright-mcp/` y `.superpowers/`.
  - `estimation-log.md` generado por `Build-EstimationLog.ps1` desde el kit.

  `migrations/v1.2.0.md` gana dos pasos: configuración y memoria automática (volcado a los docs con gate; sin dev-lead no se borra nada). Además, la red flag de greenfield habla ahora de «filas» y el README explica la memoria desactivada.
- **Proyecto de referencia** (`bc33a97`). Es una entrada de «Convenciones» en `constitution-template.md`, preguntada como pregunta 21 en greenfield y como 7 en brownfield.
- **Tabla de release** (`4dfa57b`). `roadmap-template.md` gana un bloque de ayuda propio para «Release N», con la cabecera `| id | Task | Origen | Ficheros que toca | Estado |`; `sdd-start-release` paso 5 la escribe.
- **GREEN y REFACTOR** (`e1efdc3`). Tras la campaña, la migración sin dev-lead muestra igual la tabla de memoria en el informe, y `sdd-start-release` nunca deja la celda de ficheros «por definir». La evidencia está en `tests/init-files-red.md` y `tests/init-files-green.md`.
- **Integración de `develop`** dos veces: `087f9f9` (cierre de la 0010) y `bbf768f` (cierre de la 0021). Sin conflictos.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3h
- Esfuerzo real: 0,75h — reloj del hilo (23:35 → 00:20 hora local, por las marcas de los commits hasta el cierre de la revisión final; las dos campañas corrieron en segundo plano). Spec, RED y plan, aparte: 0,9h
- Desviación: −2,25h (−75%)
- Causa de la desviación: el plan reservó 1,75 h para la GREEN tomando como referencia la 0020, que llevaba una persona simulada con `--resume` a varios turnos. Aquí los siete escenarios fueron de un turno y corrieron cuatro a la vez en segundo plano, unos 15 min de reloj. Las cuatro tasks de texto se hicieron en línea con el contexto ya cargado.
- Modelo del hilo: Opus 5.5 (1M)
- Tokens del hilo: no medido
- Tokens de subagentes: 316k en 3 despachos — revisor de spec lente técnica Sonnet 92k / 2 min; revisor de spec lente dominio Sonnet 91k / 3 min; revisor final de rama Sonnet 133k / 5 min
- Coste de sujetos: 10,01 $ en 20 sujetos Sonnet — RED 1,87 $ (2 sujetos); GREEN 8,14 $ (18 sujetos en dos rondas)
- Review de spec: 2 revisores · hallazgos 12, aceptados 12

## 3. Desviaciones del plan

- Se integró `develop` antes de la Task 1 y otra vez antes del cierre. El plan no lo preveía; la base se movió con la 0010 y la 0021.
- La GREEN corrió 18 sujetos, no 14: cuatro más para re-verificar los dos REFACTOR, que el plan preveía como paso 4 de la Task 5.

### Decisiones tomadas sin el dev-lead

- La regla «si `autoMemoryEnabled` ya está a `true`, pregunta» sube también al `SKILL.md` de brownfield, y no queda solo en `generacion.md`. El plan decía una línea sin la regla, pero la anatomía de `architecture.md` pide que lo que decide no viva solo en `references/`. Coste si está mal: una frase de más en el `SKILL.md`.
- REFACTOR de `v1.2.0.md`: sin dev-lead, la tabla de memoria va igual en el informe. Motivo: `g4a` la omitió (1/2). Coste si está mal: un informe algo más largo.
- REFACTOR de `sdd-start-release` paso 5: la celda «Ficheros que toca» nunca queda «por definir». Motivo: `g6b` la dejó así (1/2). Coste si está mal: el agente tiene que nombrar una carpeta aunque el código aún no exista.
- El lanzador del RED se corrigió a mitad de campaña: fallaba con un evento que traía `content` como texto. Las fotos se regeneraron desde los streams, sin relanzar sujetos.

## 4. Verificación

### 4.1 Builds

- `Invoke-Pester tests` tras la última integración: «Tests Passed: 347, Failed: 0, Skipped: 6» (hook `pre-commit` del merge `bbf768f`). `tests/MigrationInitParity.Tests.ps1`: 23/23.
- `Build-EstimationLog.ps1` sobre un proyecto con `.docs/sdd/specs/` vacía, antes y después de integrar la 0010: exit 0, cabecera `<!-- AUTO-GENERADO por Build-EstimationLog.ps1 (sdd-kit) …` y 0 filas.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-23 · «ya sabes que la validacion va diferida al uso del kit» · disparador: la primera init o migración a v1.2.0 en un proyecto real del equipo, con el dev-lead como dueño (concretado por el agente a partir de «el uso del kit»).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Paridad: cada token de `**Escribe**:` aparece en las dos init; caso negativo con una clave inventada | suite, 23/23 |
| 2 | G1 greenfield: log del script con 0 filas, `.gitignore` con las dos líneas, sin copia del script | ejecución real, 2/2 |
| 3 | G1/G2: `.claude/settings.json` con `"autoMemoryEnabled": false`, fusionado sin perder `permissions` | contenido correcto 4/4; escritura **no probada**, porque el harness la bloquea en `-p` hasta que el usuario concede el permiso |
| 4 | G3: con la clave a `true`, pregunta y no la cambia | ejecución real, 2/2 |
| 5 | G4: migración sin dev-lead, tabla con destinos, 0 borrados, pendiente | ejecución real, 1/2 → 2/2 tras el REFACTOR |
| 6 | G4b: gate aprobado, vuelca la entrada nueva y borra las tres sin duplicar | ejecución real, 2/2 |
| 7 | G5: la pregunta 21 llega sola tras la 20 | ejecución real, 2/2 |
| 8 | G6: cabecera literal de la tabla de release | ejecución real, 2/2 |
| 9 | G6: celda «Ficheros que toca» con ficheros o módulos | ejecución real, 1/2 → 2/2 tras el REFACTOR |
| 10 | Revisión final de rama (Sonnet, effort en el encargo) | «Ready to merge: Yes»; 0 Critical, 0 Important, 2 Minor |

### 4.3 Residuales / deuda generada

- **Posible falso negativo**: la cita del proyecto de referencia desde el brainstorming de `sdd-start-task`. El RED pasó 2/2 con un campo explícito («replica sus patrones»). El disparador observable sería un campo con solo la ruta, o una task que no parece un portado. Va a la deuda del roadmap.
- **Minor de la revisión final**: el paso 5 de `generacion.md` es un párrafo muy denso, al que esta task añadió tres frases; y el test de paridad compara por subcadena, así que un token corto de una migración futura podría coincidir por casualidad. Los dos van a la deuda del roadmap.
- La escritura real de `.claude/settings.json` queda para la validación diferida: interactivamente es un prompt de permiso.

## 5. Aprendizajes

- En `claude -p`, escribir `.claude/settings.json` pide permiso explícito aunque el modo sea `acceptEdits` («Claude requested permissions to write to …\.claude\settings.json, but you haven't granted it yet»). Un escenario que mide esa escritura verifica el contenido intentado y el permiso pedido, no el fichero en disco. → `tech-stack.md`, sujetos headless
- Un molde puede redirigir la memoria automática del sujeto con `autoMemoryDirectory` (en `settings.local.json`, ruta absoluta) a una carpeta propia. Así se mide un volcado y un borrado de memoria sin tocar la de la máquina. → `tech-stack.md`, sujetos headless
- Los streams archivados de campañas de init anteriores sirvieron de RED gratis para un frente de estructura (10 sujetos, 0 $): las fotos de disco de `out/` son también evidencia reutilizable, no solo los streams. → `tech-stack.md`, entrada existente «Un stream previo puede ser el RED de otra task»
- En PowerShell, un here-string con comillas dobles se come los backticks de Markdown (`` `a `` se convierte en el carácter de campana, `` `t `` en tabulador). Para escribir texto de skills, usa Edit o un here-string con comillas simples. → `tech-stack.md`
- Una migración declara en `**Escribe**:` lo que deja en el proyecto, y un test lo cruza con las init: la regla del Art. V ya tiene quien la vigile. → capacidad `migration` (fusión del delta) y `migrations/README.md`

## 6. Adendas
