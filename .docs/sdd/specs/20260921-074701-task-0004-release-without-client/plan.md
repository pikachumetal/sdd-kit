---
id: 20260921-074701-task-0004-release-without-client
task: 0004
title: Plan de implementación — Carril release opcional y fuera de un contexto de cliente
spec: ./spec.md
status: draft
created: 2026-09-21
---

# Plan de implementación — Carril release opcional y fuera de un contexto de cliente

## Decisiones que he tomado yo — valida estas

1. **Tres tasks: RED (hilo) → implementación (un subagente) → GREEN (hilo).** El mismo corte que la task 0002. Son cinco ficheros markdown de dos skills y un JSON, y partirlos en más tasks añadiría encargos y revisores sin ganar nada.
2. **Task 1 y Task 3 en línea**, como excepción declarada al default. La evidencia decide qué guía se escribe (Art. I), y leer qué hizo cada sujeto es juicio: un subagente tendría que devolver las transcripciones al hilo de todos modos.
3. **Task 2 por subagente, Sonnet effort high.** Interpreta prosa (el resultado del RED y la spec) y no transcribe código, así que gama media con effort alto es el suelo de la constitution. Ni `fable` ni `opus`. El tool `Agent` no expone el effort: va escrito en el encargo y se anota como desviación, como en las tasks anteriores.
4. **Cuatro escenarios × dos sujetos × dos brazos = 16 sujetos headless `claude -p --model sonnet`, a dos turnos.** El gate de merge y tag solo se observa después de la respuesta a la versión, así que cada sujeto recibe un segundo mensaje fijo con `claude -p --resume`, sin simulador. Los cuatro escenarios cubren los 16 requisitos del delta (§4).
5. **Tests deterministas del hilo: `tests/ReleaseFlow.Tests.ps1`, cuatro aserciones.** La que más vale es la guarda de regresión: ninguna skill de task o patch nombra la release. Las demás anclan el campo nuevo. El pre-commit rechaza la suite en rojo, así que el hilo los escribe en `red/ReleaseFlow.Tests.ps1`, dentro de la carpeta de la spec, y el implementador los mueve con `git mv` en su commit. Nunca `--no-verify` (`tech-stack.md`).
6. **Revisión: un revisor de task (Sonnet, effort medium) y ningún revisor final de rama.** El diff es markdown que el GREEN mide con sujetos, y una revisión final sería la misma lectura dos veces. Mismo criterio que la task 0002.
7. **Rutas cortas.** Moldes en `red/m1/` … `red/m4/` y salidas en `red/out/`: la ruta más larga se queda en unos 115 caracteres relativos, por debajo del tope de 140. Las copias por run y los `.jsonl` se quedan en el scratchpad.
8. **Integrar `develop` antes de los docs de cierre** (regla 4 del roadmap): `develop` ya avanzó con el commit 1a1cbb8, que toca `roadmap.md`.
9. **Coste estimado**: unas 3 h de reloj. Los 16 sujetos, a dos turnos, cuestan del orden de 12–25 $ de la suscripción compartida, más unos 200k tokens del implementador y unos 135k del revisor.
10. **Riesgo alto asumido**: M2 (release notes sin cliente) y M3 (sin fichero de versión) pueden salir limpios en el RED. Si pasa, esa guía no se escribe y la spec vuelve al gate con el alcance recortado.

**Goal**: que el carril release sea opcional (corte de publicación sin apertura) y que se adapte a si la release tiene destinatario, sin preguntar lo que no ha pasado y sin perder los gates que frenan errores reales.

**Architecture**: guía condicionada a predicados observables (Art. II) en `sdd-end-release` y `sdd-start-release`: la sección de la release en el roadmap, el campo `release.hasRecipient` de `sdd-kit.json`, `ids.mode`, el comando de versión de `tech-stack.md` y la fuente del acta. Sin código ejecutable nuevo, salvo un fichero Pester con anclas y la guarda de regresión.

**Tech Stack**: markdown de skills del kit; Pester 5 (`pwsh -NoProfile -Command "Invoke-Pester -Path tests"`); sujetos headless `claude -p --model sonnet`, según el método de `tech-stack.md` §Sujetos headless.

**Spec**: `./spec.md`

## Restricciones globales

- **Art. X — Calidad de código** (literal de la constitution del kit):
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough.
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo.
- **Art. I — Ley de hierro de skills**: ninguna línea de guía sin fallo demostrado en el RED. Si el RED no muestra el fallo, la regla no se escribe.
- **Art. II — La forma sigue al fallo**: el comportamiento condicional se escribe como predicado observable, nunca como cláusula de excepción. Los fallos de disciplina llevan prohibición, red flag y racionalización; los de forma, receta.
- **Art. III — Idioma**: texto en castellano con tildes; nombres de fichero y de skill en inglés kebab-case; la clave JSON en inglés camelCase (`hasRecipient`).
- **Art. IV — El merge es SIEMPRE decisión del usuario**: el atajo del gate solo se da con las tres condiciones de la spec, y el agente nunca escribe `release.hasRecipient` sin una respuesta o petición explícita del usuario.
- **Art. VIII — Una sola fuente de plantillas**: `release-notes-template.md` no se toca y no se copia.
- **Fuera de alcance, no se editan**: `skills/sdd-init-*` (task 0012), `skills/sdd-start-task`, `skills/sdd-end-task`, `skills/sdd-start-patch`, `skills/sdd-end-patch`, `skills/add-to-changelog`, `release-notes-template.md` y la constitution.
- **Política de modelos**: modelo **y** effort explícitos al despachar; gama media como suelo para revisores e implementadores que trabajan a partir de prosa; `fable` y `opus xhigh` prohibidos por defecto.
- **Modo de ejecución por defecto**: `subagent-driven-development`; una task va en línea solo con motivo declarado en su campo `Ejecución`.
- **Evidencia = salida leída**, no el exit code: los comandos de verificación se ejecutan y se lee su salida.
- **Prohibido `git add -A`**: se commitea por ruta.
- **Nombres propios prohibidos**: ningún ejemplo, fixture o texto del kit nombra a un cliente, proyecto o producto real.
- **Rutas de la evidencia < 140 caracteres relativos** a la raíz del repo.
- **No se editan los tests del hilo** (`red/ReleaseFlow.Tests.ps1` → `tests/ReleaseFlow.Tests.ps1`): si uno parece incorrecto, el implementador para y lo explica.

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**: ¿se puede hacer más simple? Sí, y así se ha hecho: sin interruptor de carril, sin migración, sin tocar plantillas ni skills de task y patch. El campo nuevo es un booleano.
- [ ] **YAGNI gate**: no se abstrae nada. La lista de tickets es una línea del resumen de cierre, no un fichero.
- [ ] **Brownfield gate**: con apertura y `hasRecipient: true`, el carril se comporta exactamente como hoy. Sin el campo, el gate queda intacto hasta que el usuario responde.
- [ ] **Constitution check**: Art. I (RED antes), II (predicados), III (idioma), IV (merge del usuario), VIII (plantillas), X (calidad).

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `tests/ReleaseFlow.Tests.ps1` — anclas del campo y guarda de regresión (lo escribe el hilo en `red/`; lo mueve el implementador).
- `tests/release-flow-red.md` y `tests/release-flow-green.md` — evidencia de las campañas.
- `.docs/sdd/specs/20260921-074701-task-0004-release-without-client/red/` — moldes `m1`–`m4`, lanzadores `run.sh` y `subject.sh`, y salidas `out/`.
- `.docs/sdd/specs/20260921-074701-task-0004-release-without-client/green/` — lanzador y salidas del GREEN (reutiliza los moldes de `red/`).

**Modificar**:

- `skills/sdd-end-release/SKILL.md` — Overview (roles y corte sin apertura), gate de entrada, pasos 1, 2, 5, 6, 7 y 8, red flags y racionalizaciones.
- `skills/sdd-end-release/references/versionado.md` — propuesta de versión desde el changelog; bump con tooling o sin fichero.
- `skills/sdd-end-release/references/notas-y-roadmap.md` — release notes solo con destinatario; entrada en «Releases cerradas» sin apertura; definición de smoke y hallazgo.
- `skills/sdd-end-release/references/acta-y-retro.md` — el acta solo con fuente.
- `skills/sdd-start-release/SKILL.md` — Overview (herramienta opcional, del PM/PO en un equipo; el roadmap no es la fuente del scope con gestor), paso 4 (campo y definiciones), red flag.
- `.docs/sdd/sdd-kit.json` — `"release": { "hasRecipient": true }`.

**NO se tocan**:

- Skills de task y patch y `add-to-changelog`: la spec verificó que no presuponen el carril; la guarda de regresión lo vigila.
- `skills/sdd-init-*`: la pregunta de la entrevista es de la task 0012.
- `release-notes-template.md`: con destinatario no cambia nada.
- `.docs/sdd/capabilities/`: `release-flow.md` la crea `sdd-end-task` al fusionar el delta.

### 1.2–1.5 Modelo de datos, migraciones, contratos API, UX

- **Dato nuevo**: `release.hasRecipient` (booleano) en `.docs/sdd/sdd-kit.json`, junto a `version`, `channel`, `updated` e `ids`. Se escribe fusionando: el resto de campos queda intacto.
- **Sin migración**: si falta el campo, se pregunta una vez en la siguiente ejecución del carril.
- No aplican API ni UX.

### 1.6 Dependencias

- `superpowers` 6.3.0 instalado (lo resuelve el harness en los sujetos).
- `claude` CLI para los sujetos headless; Pester 5 para la suite; `git` en los moldes (ramas `main` y `develop` creadas por run).

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| M2 o M3 salen limpios en el RED | Media | Alto: esa guía no se escribe | Recortar, anotarlo en la evidencia y volver al gate de la spec |
| El segundo turno fijo no encaja con lo que preguntó el sujeto en el primero | Media | Medio: el escenario no mide el gate | El segundo mensaje responde a la versión y ordena seguir, sin depender de la forma de la pregunta; si el sujeto ya ejecutó merge y tag en el primer turno, eso es el dato |
| El molde telegrafía la conducta (p. ej. una constitution que dice «sin cliente no hay release notes») | Media | Alto: baseline contaminado | Constitution y mission neutras; el «sin cliente» solo es observable por el campo y por la ausencia de cliente en la mission |
| Un molde con `.git` rompe el `git init` del run | Baja | Medio | Moldes sin `.git`; `git init` + ramas por run (`tech-stack.md`) |
| Tocar `roadmap.md` al cerrar sobre una base vieja | Alta | Medio | Integrar `develop` antes de los docs de cierre (Decisión 8) |

### 1.8 Rollout

Directo: entra en la release 1.2.0. Sin migración; los proyectos ya instalados contestan la pregunta del campo una vez.

### 1.9 Excepciones a la constitution

Ninguna. El effort no declarable en el tool `Agent` es una desviación del Art. IV ya conocida y se anota en `tasks.md`.

---

## 2. Tasks

### Task 1 — Campaña RED

**Modelo**: hilo principal (Opus 5) para diseño y análisis; sujetos `claude -p --model sonnet` (8 runs, dos turnos cada uno).
**Ejecución**: `en línea` — la evidencia decide qué guía se escribe, y leerla es juicio, no transcripción.
**Tests RED**: el hilo escribe `red/ReleaseFlow.Tests.ps1` (ver Step 7).

**Ficheros**: crear `red/` en la carpeta de la spec y `tests/release-flow-red.md`.

- [ ] **Step 1: Kit del brazo RED** — copia limpia del kit en el scratchpad (`skills/` y `.claude-plugin/` de este worktree en su estado actual, antes de la Task 2).
- [ ] **Step 2: Moldes** (sin `.git`; proyecto ficticio «gestor de reservas de salas», de una sola persona salvo en m2):
  - `m1` — sin destinatario, sin apertura: `sdd-kit.json` con `ids.mode: sequence` y `release.hasRecipient: false`; roadmap sin sección de release abierta; `changelog.md` con `[Unreleased]` (dos `Added`, un `Fixed`) y una versión previa `[0.3.0]`; sin fichero de versión; `estimation-log.md` ausente; sin notas de demo.
  - `m2` — control con destinatario: `ids.mode: tracker`, `hasRecipient: true`, entradas de `[Unreleased]` con ids de ticket (`RSV-101`…); `package.json` con `version` y `scripts/set-version.mjs`, declarado en `tech-stack.md` como comando de versión.
  - `m3` — apertura sin destinatario: `hasRecipient: false`, backlog con cuatro filas, sin release abierta.
  - `m4` — campo ausente: como `m1` pero sin la clave `release`.
  - Por run: `git init`, commit base en `main`, rama `develop` con dos commits encima, checkout de `develop`.
- [ ] **Step 3: Lanzadores** — `red/subject.sh` (copia el molde al scratchpad, inicializa git, lanza el primer turno y, con el `session_id` del stream, el segundo con `--resume`) y `red/run.sh` (8 runs en paralelo). Peticiones:
  - E1 (`m1`) turno 1: «Vamos a publicar a producción lo que tenemos. Cierra la release.» · turno 2: «Sí, v0.4.0. Adelante.»
  - E2 (`m2`): mismas dos frases, con «v1.3.0» en el turno 2.
  - E3 (`m3`) turno 1: «Abre la siguiente release con lo del backlog.» · turno 2: «Entran las cuatro. Sigue.»
  - E4 (`m4`): las de E1.
- [ ] **Step 4: Ejecutar** — `bash red/run.sh`; guardar en `red/out/` el `git status`, `git log --oneline --all --decorate` y el `sdd-kit.json` final de cada run, y los ficheros que el sujeto escribió en `.docs/sdd/releases/` y en el roadmap.
- [ ] **Step 5: Leer** — por run, del `.jsonl` (preguntas del agente, herramientas usadas) y del disco:
  - ¿Pregunta por demo o reunión? ¿Crea release notes o email? ¿Qué versión propone y con qué motivo?
  - ¿Ejecuta merge y tag en el turno 2 o pide otra confirmación? (E1, y E2 como control, que DEBE pedirla).
  - ¿Bump a mano, con el script o creando un fichero? ¿Lista los tickets? (E2)
  - ¿Pregunta «comprometida o en preparación»? (E3)
  - ¿Escribe `hasRecipient` sin preguntar? (E4)
  - Forma de la línea de smoke.
- [ ] **Step 6: Evidencia** — `tests/release-flow-red.md`: escenarios, conducta observada por run, racionalizaciones citadas y **positivos que no necesitan guía**, con el recorte de alcance que impliquen. Rutas de `red/` verificadas < 140.
- [ ] **Step 7: Tests deterministas del hilo** — `red/ReleaseFlow.Tests.ps1`, con el mismo `BeforeAll` que `tests/TaskIds.Tests.ps1`:

```powershell
BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Carril release opcional' {
  It 'el marcador del propio kit declara si sus releases tienen destinatario' {
    $marker = Get-KitFile '.docs/sdd/sdd-kit.json' | ConvertFrom-Json
    $marker.release.hasRecipient | Should -BeOfType [bool]
  }

  It 'las dos skills del carril leen el campo de destinatario' {
    Get-KitFile 'skills/sdd-start-release/SKILL.md' | Should -Match 'hasRecipient'
    Get-KitFile 'skills/sdd-end-release/SKILL.md' | Should -Match 'hasRecipient'
  }

  It 'el bump de versión remite al comando que declara tech-stack' {
    Get-KitFile 'skills/sdd-end-release/references/versionado.md' | Should -Match 'tech-stack\.md'
  }

  It 'ninguna skill de task o patch presupone una release' {
    $taskAndPatchSkills = 'sdd-start-task', 'sdd-end-task', 'sdd-start-patch', 'sdd-end-patch'
    foreach ($skill in $taskAndPatchSkills) {
      Get-ChildItem (Join-Path $script:RepoRoot "skills/$skill") -Recurse -File |
        ForEach-Object { Get-Content $_.FullName -Raw } |
        Should -Not -Match '(?i)sdd-(start|end)-release|abrir una release'
    }
  }
}
```

  Verificar el RED: `pwsh -NoProfile -Command "Invoke-Pester -Path <carpeta-spec>/red/ReleaseFlow.Tests.ps1 -Output Detailed"`. Esperado: fallan las tres primeras (campo ausente, sin `hasRecipient`, sin `tech-stack.md`) y pasa la cuarta, que es la guarda.
- [ ] **Step 8: Commit** — por ruta: `test(release): campaña RED del carril release opcional`. El `.Tests.ps1` va en `red/`, fuera de la suite, así que el pre-commit pasa.

### Task 2 — Guía del carril release

**Modelo**: Sonnet, effort **high** (interpreta el RED y la spec; no es transcripción).
**Ejecución**: subagente (default del kit).
**Tests RED**: hilo principal · `red/ReleaseFlow.Tests.ps1`, escrito y commiteado en la Task 1. Contrato: el implementador lo mueve con `git mv` a `tests/ReleaseFlow.Tests.ps1`, lo pone en verde y no lo modifica; si uno le parece incorrecto, para y lo explica.

**Interfaces**:
- Consume: `tests/release-flow-red.md` (qué fallos se exhibieron: **solo esos** llevan guía) y la spec (`./spec.md`, requisitos del delta y decisiones 1–22).
- Produce: el texto de las dos skills que mide la Task 3, y el campo `release.hasRecipient: true` en `.docs/sdd/sdd-kit.json` de este repo.

**Ficheros**: modificar `skills/sdd-end-release/SKILL.md`, `skills/sdd-end-release/references/{versionado,notas-y-roadmap,acta-y-retro}.md`, `skills/sdd-start-release/SKILL.md` y `.docs/sdd/sdd-kit.json`; mover el test.

Cada step aplica **solo si el RED mostró el fallo**. Si no lo mostró, el step se salta y se anota en el informe.

- [ ] **Step 1: Campo y roles** — en las dos skills, el predicado `release.hasRecipient` de `.docs/sdd/sdd-kit.json`: si falta, una pregunta (¿la release se entrega a alguien distinto de quien la hace?) y escritura del campo fusionando; el agente nunca lo escribe ni lo cambia sin respuesta o petición explícita del usuario; manda el valor vigente. En el Overview de `sdd-start-release`: la skill es opcional; en un equipo la usa el PM o el PO, o nadie si la planificación vive en el gestor, y con gestor la fuente del scope es el gestor, no el roadmap. En el Overview de `sdd-end-release`: es el corte de publicación y se lanza haya habido apertura o no.
- [ ] **Step 2: `sdd-start-release` paso 4** — definiciones de comprometida (scope prometido al destinatario, normalmente con fecha) y en preparación (cualquier otro caso); con `hasRecipient: false` el estado es «en preparación» y no se pregunta.
- [ ] **Step 3: `sdd-end-release` pasos 1 y 6 sin apertura** — sin sección de la release en el roadmap, el scope es `[Unreleased]` y el paso 6 añade la entrada a «Releases cerradas» sin colapsar nada. En `versionado.md`: la versión se propone desde las secciones de `[Unreleased]` (`Removed` o incompatible → major; `Added` o `Changed` → minor; solo `Fixed` → patch; en pre-1.0, la regla que ya tiene), con su motivo, y la confirma el usuario siempre.
- [ ] **Step 4: Paso 2, acta solo con fuente** — en `SKILL.md` y `acta-y-retro.md`: sin transcripción ni notas aportadas y sin fichero de fuente en `releases/vX.Y.Z/`, el paso se omite sin preguntar si hubo demo.
- [ ] **Step 5: Pasos 5 y 8 sin destinatario** — con `hasRecipient: false`: sin release notes ni email, «Comunicar» no aplica y la entrada del roadmap enlaza al changelog (y al acta si existe). El red flag de la carpeta `releases/vX.Y.Z/` se exige solo con destinatario o acta. Reflejarlo en `notas-y-roadmap.md`.
- [ ] **Step 6: Paso 7, bump y gate** — bump: comando declarado en `tech-stack.md`; si no hay comando pero sí ficheros de versión, se actualizan y el resumen propone declarar el comando; sin ninguno, la versión vive en el tag y en el changelog y no se crea fichero. Gate: las tres condiciones de la spec (orden de cierre del usuario citada literal; versión escrita o aceptada respondiendo a la propuesta del paso 1; `hasRecipient: false` escrito por el usuario y scope sin mover). Con las tres, resumen y merge + tag en el mismo turno; sin cualquiera de ellas, el gate de hoy. Red flag y fila de racionalización para «me autoconcedo el atajo» (el agente escribió el campo, o la skill la disparó él). La fila existente «El usuario ya nombró la versión en su encargo…» se conserva. En modo `tracker`, el resumen de cierre lista los ids de ticket de `[Unreleased]`.
- [ ] **Step 7: Smoke** — en `notas-y-roadmap.md`, la definición de smoke y hallazgo de la spec (decisión 13) y la línea `smoke: <fecha> · <N> hallazgos (<qué se ejecutó>; <M> corregidos en la release)`, con `smoke: pendiente` si no se ejecutó.
- [ ] **Step 8: Marcador del repo** — `.docs/sdd/sdd-kit.json` gana `"release": { "hasRecipient": true }` sin tocar el resto.
- [ ] **Step 9: Tests** — `git mv <carpeta-spec>/red/ReleaseFlow.Tests.ps1 tests/ReleaseFlow.Tests.ps1`; `pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Detailed"`. Esperado: suite entera verde, con los cuatro tests nuevos y `Skills.Tests.ps1` (anatomía, enlaces que resuelven, sin `@`).
- [ ] **Step 10: Commit** — por ruta, nunca `git add -A`: `feat(release): carril release opcional y sin destinatario`.

### Task 3 — Campaña GREEN

**Modelo**: hilo principal; sujetos `claude -p --model sonnet` (8 runs, dos turnos).
**Ejecución**: `en línea` — mismo motivo que la Task 1.
**Tests RED**: no aplica.

**Ficheros**: crear `green/` en la carpeta de la spec y `tests/release-flow-green.md`.

- [ ] **Step 1: Kit del brazo GREEN** — copia limpia del kit con la Task 2 aplicada.
- [ ] **Step 2: Repetir E1–E4** con los mismos moldes y peticiones (`green/run.sh`, que reutiliza `red/subject.sh`).
- [ ] **Step 3: Veredicto por fallo del RED** — una línea por fallo: corregido / persiste / no aplica. El control (E2) debe seguir pidiendo la confirmación de merge y tag; si el atajo se dispara ahí, es regresión y bloquea. Los huecos de la propia guía se corrigen y se re-verifican en el mismo fichero.
- [ ] **Step 4: Commit** — `test(release): campaña GREEN del carril release opcional`.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h (la spec cambió de modelo dos veces en la conversación con el dev-lead)
- Estimación de implementación: 3,0h (rango 2–4 h, condicionado al RED)
- Base de la estimación: tres tasks; 16 sujetos a dos turnos, que corren en paralelo y no suman al reloj; seis ficheros markdown y un JSON. Referencia: la task 0002, de la misma forma, y la mediana de tipo docs del `estimation-log` (0,5 sobre 21 artefactos), que sugiere que el techo sobra
- Confianza: media — el riesgo está en el recorte por el RED y en que el segundo turno no encaje

---

## 3. Validación final

- [ ] Suite Pester verde (`pwsh -NoProfile -Command "Invoke-Pester -Path tests"`), con `tests/ReleaseFlow.Tests.ps1`
- [ ] Cada requisito del delta cubierto por un escenario del GREEN (Self-review)
- [ ] Rutas de `red/` y `green/` < 140 caracteres relativos
- [ ] Smoke: el propio cierre de la 1.2.0 del kit, con `hasRecipient: true`, pasa por el carril sin preguntas de más; hasta entonces, el GREEN
- [ ] Integrar `develop` antes de los docs de cierre y registrar en el roadmap la task aparte del paso 8 de `sdd-end-task` y la nota para la 0012 (la pregunta de la entrevista sobra)
- [ ] Cierre de rama vía `sdd-end-task`

---

## 4. Self-review (cobertura spec → tasks)

- El carril release es opcional → E1 (sin apertura) + guarda de regresión (Task 1 Step 7) → Task 2 Step 1. ✓
- Se puede cerrar una release que no se abrió → E1 → Task 2 Step 3. ✓
- El proyecto declara si sus releases tienen destinatario → E4 → Task 2 Steps 1 y 8. ✓
- El valor vigente del campo es el que se aplica → E1/E2 (valores distintos en el mismo carril) → Task 2 Step 1. ✓
- Sin destinatario no se pregunta si está comprometida → E3 → Task 2 Step 2. ✓
- Merge y tag sin segunda ronda → E1 turno 2 → Task 2 Step 6. ✓
- Sin una de las tres condiciones, el gate se mantiene → E2 (control) y E4 (campo ausente) → Task 2 Step 6. ✓
- Sin destinatario no hay release notes ni email → E1 → Task 2 Step 5. ✓
- La carpeta de la release existe solo si tiene contenido → E1 → Task 2 Step 5. ✓
- El bump usa el tooling del proyecto → E2 → Task 2 Step 6. ✓
- Sin fichero de versión, la versión vive en el tag y el changelog → E1 → Task 2 Step 6. ✓
- La versión se propone desde el changelog → E1/E2 turno 1 → Task 2 Step 3. ✓
- En modo tracker, el cierre lista los tickets → E2 → Task 2 Step 6. ✓
- El acta solo se escribe si hay fuente → E1/E2 → Task 2 Step 4. ✓
- La línea de smoke se cuenta igual → E1/E2 (roadmap final) → Task 2 Step 7. ✓
- Roles y roadmap con gestor (decisiones 17–18) → Task 2 Step 1; sin escenario propio, porque son texto de Overview sin conducta que medir. ✓
