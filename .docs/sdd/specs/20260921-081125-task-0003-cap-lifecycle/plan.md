---
id: 20260921-081125-task-0003-cap-lifecycle
task: 0003
title: Plan de implementación — Capabilities, ciclo de vida completo
spec: ./spec.md
status: draft
created: 2026-09-21
---

# Plan de implementación — Capabilities: ciclo de vida completo

## Decisiones que he tomado yo — valida estas

1. **Seis tasks en tres fases**: RED → validador y contenido → GREEN.
   - Las campañas (Tasks 1, 4 y 6) van **en línea**: su lectura es juicio y decide qué guidance se escribe.
   - El validador (Task 2) y el contenido (Task 3) van **por subagente**.
   - La Task 5, forma final, va por subagente si gana la skill y en línea si gana la referencia, porque entonces son cinco líneas.
2. **El contenido se escribe una vez, en forma de referencia**: `skills/sdd-templates/references/capabilities.md`.
   - El brazo skill se construye en el scratchpad a partir de él: mismo texto, movido a `skills/sdd-capability/SKILL.md`, con el inventario insertado con `` !`comando` `` y con los enlaces cambiados por «invoca `sdd-capability`».
   - Así los dos brazos solo difieren en la forma, que es lo que mide el RED.
   - La referencia va primero por la decisión del 2026-09-07: la unidad de descomposición es el fichero auxiliar.
3. **El GREEN se parte en dos fases** para que el validador sea un brazo aislado:
   - Fase A (Task 4): referencia contra skill, sin mencionar el validador.
   - Fase B (Task 6): el brazo ganador más las líneas que mandan ejecutar el validador.
   - El baseline no se repite: es el RED.
   - Total: RED 6 sujetos + fase A 12 + fase B 6 = los 24 aprobados.
4. **Dos sujetos más para el volcado inicial**, en la fase B (E4). El RED del volcado es el caso real del statusline (N=1), pero la guidance nueva necesita su GREEN (Art. I). Coste extra: ~2–4 $.
5. **Criterio de victoria entre referencia y skill.** Gana la skill solo si corrige al menos un fallo del RED que la referencia deja sin corregir, en E1 o E2. Con empate gana la referencia: es más barata en todas las sesiones, porque no suma una `description`.
6. **Modelos, con modelo y effort declarados**:
   - Hilo principal: Opus 5 (1M), para diseño, fixtures y análisis de campañas.
   - Sujetos: `claude -p --model sonnet`.
   - Implementadores de las Tasks 2, 3 y 5: Sonnet, effort high. Interpretan prosa y la Task 2 escribe código nuevo, así que gama media con effort alto.
   - Revisores de task: Sonnet, effort medium.
   - **Revisor final de rama: Opus 5, effort medium.** Hay código ejecutable nuevo, y en T7 la revisión final con un modelo superior cazó dos defectos que dos revisiones Sonnet habían aprobado. No uso `fable` ni `opus xhigh`.
   - El tool `Agent` no fija el effort: se anota como desviación en `tasks.md`.
7. **Interfaz del validador** fijada en este plan (§1.4). Los tests Pester los escribe el hilo antes de despachar, sobre ficheros construidos en un directorio temporal propio, nunca con `$TestDrive` (aprendizaje de la task 0001).
8. **Rutas de menos de 140 caracteres relativos.** Antes de cada commit de evidencia se ejecuta el paso «Longitud de rutas» (§1.6), y un fallo bloquea el commit.
9. **Coste estimado**:
   - Unas 6 h de reloj.
   - Sujetos: 25–45 $ más 2–4 $ del volcado.
   - Implementadores: ~650k tokens (3 × ~220k).
   - Revisores: ~400k de task y ~200k del final.
10. **Riesgo alto asumido**: si un frente no falla en el RED, no se escribe su guidance, se recorta la spec y se te vuelve a pedir la aprobación (Art. I). Es el riesgo que la estimación no puede absorber.

**Goal**: que toda spec decida a qué capacidad pertenece su delta, que task y patch fusionen el delta al cerrar con un solo algoritmo, y que las reglas vivan en un sitio único, con un validador de forma.

**Architecture**: un sitio único con las reglas; su forma, referencia o skill, la decide el GREEN. Cada punto de uso lleva una línea y el enlace o la invocación. `Test-Capabilities.ps1` en `sdd-templates/scripts/`, junto a los otros dos scripts, con tests Pester.

**Tech Stack**: markdown de skills del kit; PowerShell 7 + Pester ≥ 5 para el script; sujetos headless `claude -p --model sonnet` (método de `tech-stack.md` §Sujetos headless).

**Spec**: `./spec.md`

## Restricciones globales

- **Art. X — Calidad de código** (literal de la constitution del kit):
  - **Sin comentarios que repitan el código.** Un comentario existe solo si sin él la línea no se entiende, y antes de escribirlo se intenta que el nombre o una extracción lo hagan innecesario. Lo que se conserva es el *porqué* no deducible (una convención heredada, un límite externo). El bloque de ayuda de `Get-Help` no es un comentario.
  - **Sin comentarios que citen documentos.** Un comentario nunca referencia la constitution, una spec, una task, un requisito ni `capabilities/`: envejece con el documento, no explica un porqué y contamina cualquier comparación entre proyectos. La trazabilidad vive en el commit y en el walkthrough (T14, 2026-09-09; 110 comentarios con cita en los dos retos del equipo).
  - Clean Code: nombres descriptivos en inglés, funciones ≤ 20 líneas y ≤ 3 parámetros, early returns, sin duplicación, sin alias de PowerShell. Texto humano (mensajes, warnings, ayuda) en castellano con tildes (Art. III).
  - El revisor marca el incumplimiento como Important, no como estilo.
- **Art. I — Ley de hierro de skills**: ninguna línea de guidance sin fallo demostrado en el RED. Si el RED no exhibe el fallo, la regla no se escribe.
- **Art. III — Idioma**: texto humano en castellano con tildes; nombres de skill y de fichero en inglés kebab-case.
- **Art. VIII — Una sola fuente de plantillas**: las plantillas viven SOLO en `skills/sdd-templates/templates/`.
- **Gramática del delta** (spec, literal): encabezado `### Capacidad: \`<slug>\``; marcadores `**ADDED — <título>**`, `**MODIFIED — <título>**`, `**REMOVED — <título>**`; `(antes: …)` opcional; `(retira: "<cláusula>")` por cada cláusula que se quita a propósito.
- **Línea de capacidad** (spec, literal): `Capacidad(es) del delta: <nombre> (existente | nueva) — sustantivo: <cuál> — descartada: <alternativa>`; opt-out: `Capacidad(es) del delta: ninguna — <motivo>`.
- **Umbrales** (spec): alarma de fusión con tres o más `ADDED` con «Reglas de la capacidad» propias en una capacidad existente; lente dominio, una capacidad que agrupa tres o más dominios.
- **La fusión no depende de que exista una release.**
- **Rutas del repo < 140 caracteres relativos.**
- **Política de modelos**: modelo **y** effort explícitos al despachar; gama media como suelo para revisores e implementadores que trabajan a partir de prosa; `fable` y `opus xhigh` prohibidos por defecto.
- **Modo de ejecución por defecto**: `subagent-driven-development`; una task va en línea solo con motivo declarado en su campo `Ejecución`.
- **Evidencia = salida leída**, no el exit code.
- **Prohibido `git add -A`**: se commitea por ruta. Nunca `--no-verify`.
- **Nombres propios prohibidos**: ningún ejemplo, fixture o texto del kit nombra a un cliente, proyecto o producto real.
- **No se editan los tests del hilo**: si uno parece incorrecto, el implementador para y lo explica.
- **Fuera de alcance** (spec, decisión 11): campo `Cobertura`, limpiar capacidades cajón existentes, `status: draft` de capacidades, pregunta de modo incremental del init, dependencia respecto a releases.

---

## Phase -1 — Pre-Implementation Gates

- [ ] **Simplicity gate**:
  - El contenido se escribe una sola vez; la forma alternativa se deriva en el scratchpad.
  - El validador solo hace cuatro comprobaciones de forma.
- [ ] **YAGNI gate**:
  - Sin `Cobertura`.
  - Sin comparar requisitos entre capacidades.
  - Sin test de convención de longitud de rutas.
- [ ] **Brownfield gate**:
  - Las specs cerradas con `(antes: …)` no se tocan.
  - Los slugs existentes no se marcan.
  - Brownfield sigue sin volcar.
- [ ] **Constitution check**: Art. I (RED antes), III, VIII, X.

---

## 1. Decisiones técnicas

### 1.1 Estructura de ficheros

**Crear**:

- `skills/sdd-templates/references/capabilities.md`: el sitio único. Contiene:
  - nacimiento: línea de capacidad, test de pertenencia con inventario y `legacy.md`, slug;
  - contenido: regla de reparto;
  - fusión: algoritmo, lo construido y validado, alarma, `legacy.md`, historial `task`/`patch`/`init`;
  - carril patch y frontera;
  - volcado inicial.

  Si gana la skill, pasa a `skills/sdd-capability/SKILL.md` (Task 5).
- `skills/sdd-templates/scripts/Test-Capabilities.ps1`: el validador.
- `tests/Test-Capabilities.Tests.ps1`: tests del validador (hilo).
- `tests/CapabilityRules.Tests.ps1`: tests estructurales de los puntos de uso (hilo).
- `tests/capabilities-red.md`, `tests/capabilities-green.md`: evidencia.
- En la carpeta de la spec: `red/`, `green/` con moldes (`m1/`…`m4/`), lanzador y lo que produjo cada sujeto.
- `tasks.md`: registro vivo.

**Modificar**:

- `skills/sdd-templates/templates/spec-template.md`:
  - línea fija de capacidad en «Decisiones»;
  - gramática del delta;
  - `MODIFIED` de bloque entero con `(antes: …)` opcional y `(retira: …)`;
  - reglas enteras por nombre;
  - regla de reparto junto a la «Regla de contenido».
- `skills/sdd-templates/templates/patch-template.md`: sección `## Delta de capacidades` (gramática del delta, o «ninguno»).
- `skills/sdd-templates/templates/capability-template.md`:
  - regla 1 con el slug en inglés kebab-case aprobado por el dev-lead;
  - regla 3 con fusión por `sdd-end-task` y `sdd-end-patch`, y `MODIFIED` de bloque entero;
  - regla 4: brownfield nunca; greenfield solo con la excepción;
  - historial con `task <id>`, `patch <id>` e `init`.
- `skills/sdd-templates/templates/plan-template.md`: la regla de reparto, una línea en §1.1.
- `skills/sdd-templates/SKILL.md`: filas del script nuevo y de la referencia.
- `skills/sdd-start-task/SKILL.md`: el paso 4 cambia de condicional a obligatorio, con enlace al sitio único.
- `skills/sdd-start-task/references/review-spec.md`:
  - la señal «Capacidad nueva» pasa a «más de una capacidad»;
  - la señal «Tres o más capacidades» se funde con ella;
  - punto 8 de pertenencia, asignado a dominio en §3;
  - los topes de la rúbrica no cambian.
- `skills/sdd-end-task/SKILL.md`:
  - paso numerado nuevo «Fusión en `capabilities/`», que renumera los siguientes;
  - red flag y dos filas de racionalización: «ya está en tech-stack» y «fusiono lo que decía el delta».
- `skills/sdd-end-task/references/aprendizajes-skills.md`: el paso 4 enlaza la fusión y lleva «los anclajes enlazan el valor, no lo copian».
- `skills/sdd-end-patch/SKILL.md`: paso nuevo de fusión con la salida «ninguno», y red flag.
- `skills/sdd-start-patch/SKILL.md`: la frontera en el diagrama y en una fila de racionalización.
- `skills/sdd-init-greenfield/SKILL.md` y `references/estructura.md`: volcado inicial como excepción con condiciones y aviso de nombre.
- `skills/sdd-init-brownfield/references/generacion.md`: «aunque el usuario lo pida», una frase.
- `README.md`: índice de scripts y, si gana la skill, catálogo y recuentos.

**NO se tocan**:

- `.docs/sdd/capabilities/*`: la fusión del delta es del cierre (`sdd-end-task`), tras la validación.
- `mission.md`, `roadmap.md`, `tech-stack.md`, `changelog.md`: se escriben en el cierre, tras integrar develop (regla 4 del roadmap).
- `skills/sdd-*-release`, `add-to-changelog`: son de la task 0004.
- Specs y walkthroughs cerrados: histórico sellado.

### 1.2–1.3 Modelo de datos, migraciones

No aplica. Sin migración nueva (spec, decisión 13).

### 1.4 Contrato del validador

```text
pwsh -NoProfile -File "<Base directory de sdd-templates>/scripts/Test-Capabilities.ps1" -Path <spec.md | patch.md> -ProjectRoot <raíz del proyecto>
```

- **Entrada**: `-Path` a un `spec.md` o un `patch.md`. El tipo se decide por el nombre del fichero. Capacidades en `<ProjectRoot>/.docs/sdd/capabilities/<slug>.md`.
- **Salida**: una línea por caso, `<nombre del fichero>: <capacidad o título>: <mensaje en castellano>`. Sin casos, una línea «Sin problemas de forma.».
- **Códigos de salida**: 0 sin casos; 1 con algún caso; 2 si `-Path` no existe o no es `spec.md` ni `patch.md`, con el mensaje por `Write-Error`.
- **Casos**, los únicos cuatro:
  1. **Línea de capacidad**:
     - `spec.md` sin ninguna línea que contenga `Capacidad(es) del delta:`, dentro o fuera de «Decisiones». El opt-out `ninguna` cuenta como presente.
     - `patch.md` sin encabezado `## Delta de capacidades`.
  2. **Slug de capacidad nueva**: encabezado `### Capacidad: \`<slug>\`` cuyo `<slug>.md` no existe y cuyo slug no casa `^[a-z0-9]+(-[a-z0-9]+)*$`. Un slug con fichero existente nunca se marca.
  3. **`ADDED` duplicado**: `**ADDED — <título>**` bajo una capacidad existente cuyo fichero tiene `### <título>`, en comparación literal tras recortar espacios.
  4. **`MODIFIED` corto**: el bloque del `MODIFIED` es el conjunto de líneas `- GIVEN|WHEN|THEN|AND ` hasta el siguiente marcador `**…**` o encabezado. Se marca si su recuento, más el número de `(retira:` de su línea de marcador, es menor que el recuento del requisito vigente, contado bajo `### <título>` hasta el siguiente encabezado. Un `MODIFIED` cuyo título no existe no se marca (fuera de los cuatro casos).
- **No juzga** el idioma del slug ni la pertenencia.

### 1.5 UX

No aplica.

### 1.6 Dependencias y pasos comunes

- `superpowers` 6.3.0; `claude` CLI; Pester ≥ 5.
- **Longitud de rutas**, antes de cada commit de evidencia:

  ```powershell
  git ls-files --others --cached --exclude-standard -- .docs/sdd/specs/20260921-081125-task-0003-cap-lifecycle tests | Where-Object { $_.Length -ge 140 }
  ```

  Esperado: sin salida.
- **Copia limpia del kit por brazo** en el scratchpad (`kit-<brazo>/`, solo `skills/` y `.claude-plugin/`), y `--plugin-dir` y `--add-dir` a esa copia.

### 1.7 Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| Un frente no falla en el RED | Media | Alto: su guidance no se escribe | Recortar, anotarlo en la evidencia y volver al gate de la spec |
| El molde telegrafía la conducta (una constitution que ya dice «decide la capacidad») | Media | Alto: baseline contaminado | El molde lleva la constitution mínima del caso de campo; se revisa contra la lista de trampas de `tech-stack.md` antes de lanzar |
| La bitácora del molde contradice el árbol (aprendizaje de la task 0002) | Media | Medio: invalida un escenario | Contrastar la bitácora con el árbol antes de lanzar |
| Referencia y skill empatan | Alta | Bajo | Criterio de la decisión 5: gana la referencia |
| El `MODIFIED` corto da falsos positivos con specs abiertas de otras ramas | Baja | Bajo | Solo mira la spec que se le pasa, y `(retira: …)` es la salida |
| Chocar con la 0004 en ficheros calientes | Baja | Medio | La 0004 no toca ninguno de §1.1; el cierre integra develop primero |

### 1.8 Rollout

Directo: entra en la 1.2.0. Sin migración (spec, decisión 13).

### 1.9 Excepciones a la constitution

Ninguna. El effort no fijable es una desviación conocida del Art. IV y se anota en `tasks.md`.

---

## 2. Tasks

### Task 1 — Campaña RED (baseline, kit de develop)

**Modelo**: hilo principal (Opus 5) para moldes y análisis; sujetos `claude -p --model sonnet` (6 runs).
**Ejecución**: `en línea` — la evidencia decide qué guidance se escribe, y leerla es juicio.
**Tests RED**: no aplica (esta task *es* el test).

**Ficheros**: `red/m1/`, `red/m2/`, `red/m3/`, `red/run.sh`, `red/out/` en la carpeta de la spec; `tests/capabilities-red.md`.

- [ ] **Step 1: Molde m1, nacimiento.** Proyecto ficticio de reservas de salas.
  - Una sola capacidad, `rooms-app` (se llama como el producto), con requisitos de tres tasks ya fusionadas: toolchain, docker y entornos.
  - Roadmap con la task 0004 ⏳: «avisos por email al confirmar una reserva», con plantillas propias, cola de envío, reintentos y cuota diaria.
  - Petición: «arranca la task 0004 del roadmap; toma tú las decisiones y lístalas; escribe la spec y para en el gate».
  - Se mide en disco:
    - si propone una capacidad nueva o fusiona en `rooms-app`;
    - si declara la decisión de capacidad;
    - el idioma del slug;
    - si «Capacidad nueva» sube el nivel de review.
- [ ] **Step 2: Molde m2, fusión al cierre.** Task con spec aprobada, implementación hecha y bitácora coherente con el árbol. El delta lleva:
  - un `ADDED`;
  - un `MODIFIED` aditivo que cita solo la cláusula tocada y dice «se conserva todo lo anterior»;
  - una entrada de reglas que añade una frase a una regla larga.

  Además:
  - `capabilities/legacy.md` describe el comportamiento que toca el `MODIFIED`.
  - `tasks.md` registra que se construyó 10 min donde el delta dice 5, por decisión del usuario.
  - El plan pide «documentar la caducidad en tech-stack».

  Petición: «validado: probé el flujo de caducidad y funciona. Cierra la task». Se mide en disco:
  - si fusiona y en qué paso;
  - si el `MODIFIED` conserva el bloque entero;
  - si retira el texto de `legacy.md`;
  - qué valor fusiona, 5 o 10;
  - si copia el valor a `tech-stack.md`.
- [ ] **Step 3: Molde m3, patch.** Patch aplicado cuyo fix cambia un requisito de `capabilities/booking.md`. El usuario decidió el nuevo comportamiento en una frase, que se cita en la petición.
  - Petición: «cierra el patch».
  - Se mide si toca la capacidad, con qué forma de historial, y si `patch.md` dice algo del delta.
- [ ] **Step 4: Lanzar** los 6 sujetos (2 por molde), con la copia limpia del kit de develop y `git init` por run.
- [ ] **Step 5: Evidencia.** `tests/capabilities-red.md` con:
  - escenario, conducta observada y racionalizaciones citadas;
  - los positivos que no necesitan guidance, con el recorte si lo hay;
  - E4, el volcado: el caso del statusline (N=1), citado sin nombre propio.
- [ ] **Step 6: Si algún frente no falla**, recortar la spec y volver al gate antes de seguir.
- [ ] **Step 7: Longitud de rutas** (§1.6) y **commit**: `test(capabilities): campaña RED del ciclo de vida de capacidades`.

### Task 2 — Validador `Test-Capabilities.ps1`

**Modelo**: Sonnet, effort high (código nuevo a partir de un contrato en prosa).
**Tests RED**: hilo principal · `tests/Test-Capabilities.Tests.ps1`, escritos antes de despachar y entregados en el working tree. El pre-commit de este repo rechaza la suite en rojo, así que se commitean con la implementación que los pone en verde; nunca `--no-verify`. Contrato: el implementador no los modifica.

**Interfaces**: produce el contrato de §1.4, que consumen las Tasks 5 y 6.

**Ficheros**: crear `skills/sdd-templates/scripts/Test-Capabilities.ps1`; modificar `skills/sdd-templates/SKILL.md` (fila del script) y `README.md` si lista scripts.

- [ ] **Step 1: Tests (hilo)**, uno por THEN del requisito «Un validador comprueba la forma del delta». Ficheros construidos en un directorio temporal propio, resuelto y verificado; nunca `$TestDrive`, nunca cambio de cwd.
  1. Spec sin línea de capacidad → sale 1, y la salida contiene `Capacidad(es) del delta`.
  2. Spec con opt-out `ninguna — …` → sale 0.
  3. `patch.md` sin `## Delta de capacidades` → sale 1.
  4. `patch.md` con la sección y «ninguno» → sale 0.
  5. Capacidad nueva `Reservas_Sala` → sale 1 y nombra el slug.
  6. Capacidad existente `reservas` (con fichero) → no se marca el slug.
  7. `ADDED` con un título que ya existe en la capacidad → sale 1 y nombra el título.
  8. `MODIFIED` con 2 cláusulas sobre un vigente de 4 → sale 1.
  9. El mismo `MODIFIED` con dos `(retira: …)` → sale 0.
  10. `MODIFIED` con el bloque entero → sale 0.
  11. `-Path` inexistente → sale 2.
  12. Spec correcta sin casos → sale 0 y la salida es «Sin problemas de forma.».
- [ ] **Step 2: Comprobar el RED**: `pwsh -NoProfile -Command "Invoke-Pester tests/Test-Capabilities.Tests.ps1 -Output Detailed"` → falla porque el script no existe.
- [ ] **Step 3: Despachar el implementador** con la cabecera de `encargo-revision.md`: restricciones globales íntegras, contrato de tests y §1.4.
- [ ] **Step 4: Verificación**: `Invoke-Pester tests/` → suite entera en verde, leyendo la salida.
- [ ] **Step 5: Revisión de task** (Sonnet, medium) y **commit** por ruta: `feat(templates): validador de forma del delta de capacidades`.

### Task 3 — Sitio único y puntos de uso (forma referencia)

**Modelo**: Sonnet, effort high (redacta guidance a partir del RED y de la spec).
**Tests RED**: hilo principal · `tests/CapabilityRules.Tests.ps1`, en el working tree antes de despachar, con el mismo contrato que la Task 2.

**Interfaces**: consume la evidencia de la Task 1 (qué frentes fallaron). Produce `skills/sdd-templates/references/capabilities.md`, que la Task 4 transforma en skill.

**Ficheros**: los de §1.1 «Modificar», salvo `README.md` y las líneas del validador (Task 5).

- [ ] **Step 1: Tests (hilo)**, estructurales, un `It` por punto de uso:
  - `spec-template.md` contiene `Capacidad(es) del delta:` y `(retira:`;
  - `patch-template.md` contiene `## Delta de capacidades`;
  - la regla 3 de `capability-template.md` nombra `sdd-end-patch`;
  - `review-spec.md` no tiene la fila «Capacidad nueva» y tiene el punto 8 en la lista de dominio de §3;
  - `sdd-end-task/SKILL.md` tiene un paso numerado que contiene `capabilities/`;
  - `sdd-end-patch/SKILL.md` tiene un paso que contiene `capabilities/`;
  - `sdd-start-patch/SKILL.md` nombra la frontera («una frase»);
  - `sdd-templates/references/capabilities.md` existe y está enlazada desde `sdd-start-task/SKILL.md`, `sdd-end-task/SKILL.md` y `sdd-end-patch/SKILL.md`.
- [ ] **Step 2: Comprobar el RED** → falla.
- [ ] **Step 3: Despachar el implementador.** El encargo lleva la cabecera, `spec.md`, `tests/capabilities-red.md` y la regla «solo guidance para los fallos que el RED exhibe».
  - Red flags y racionalizaciones con las frases textuales del RED.
  - Ejemplos en un dominio distinto del de los moldes (aprendizaje de la task 0011).
- [ ] **Step 4: Verificación**: `Invoke-Pester tests/` en verde.
- [ ] **Step 5: Revisión de task** (Sonnet, medium) y **commit**: `feat(capabilities): reglas en un sitio único y paso de fusión en task y patch`.

### Task 4 — GREEN fase A: referencia contra skill

**Modelo**: hilo principal; sujetos Sonnet (12 runs).
**Ejecución**: `en línea` — mismo motivo que la Task 1, y además construye el brazo skill.

- [ ] **Step 1: Brazo referencia**: copia limpia del kit de la rama.
- [ ] **Step 2: Brazo skill**: la misma copia con el contenido movido a `skills/sdd-capability/SKILL.md`.
  - Frontmatter con `description` que empieza por «Usar».
  - Inventario insertado: `` !`pwsh -NoProfile -Command "Get-ChildItem .docs/sdd/capabilities -Name"` ``.
  - Los enlaces de los puntos de uso cambiados por «invoca `sdd-capability`».
  - Probar a mano una vez que la inserción funciona en `claude -p` antes de lanzar.
- [ ] **Step 3: Lanzar** m1, m2 y m3 × 2 sujetos × 2 brazos, con moldes copiados de `red/` a `green/`.
- [ ] **Step 4: Veredicto** por fallo del RED y por brazo, y la forma ganadora según la decisión 5.
- [ ] **Step 5: Longitud de rutas** y **commit**: `test(capabilities): GREEN fase A, referencia contra skill`.

### Task 5 — Forma final y validador en los puntos de uso

**Modelo**: Sonnet, effort high, si gana la skill.
**Ejecución**: `en línea` si gana la referencia (son cinco líneas); por subagente si gana la skill.
**Tests RED**: hilo · se amplía `tests/CapabilityRules.Tests.ps1`:
- las líneas del validador en `sdd-start-task` paso 4, en el paso de fusión de `sdd-end-task` y en el de `sdd-end-patch`;
- si gana la skill, `skills/sdd-capability/SKILL.md` existe y los puntos de uso la invocan.

- [ ] **Step 1**: si gana la skill, mover el contenido desde `sdd-templates/references/capabilities.md` y actualizar:
  - la fila del catálogo en el `README.md`;
  - los recuentos «11/12 skills» del `README.md`;
  - la lista de `superpowers:*` si cambia.
- [ ] **Step 2**: línea del validador (§1.4) antes del gate de la spec y antes de fusionar, con la ruta del script desde el `Base directory`.
- [ ] **Step 3: Verificación**: `Invoke-Pester tests/` en verde y `claude plugin validate --strict skills/` limpio.
- [ ] **Step 4: Revisión de task** (si fue por subagente) y **commit**: `feat(capabilities): forma final y validador en los puntos de uso`.

### Task 6 — GREEN fase B: ganador con validador, y volcado inicial

**Modelo**: hilo principal; sujetos Sonnet (6 + 2 runs).
**Ejecución**: `en línea`.

- [ ] **Step 1: Relanzar** m1, m2 y m3 × 2 con el kit de la rama tras la Task 5. Se mide qué añade el validador: si lo ejecutan y si corrige algo que el brazo sin él dejó.
- [ ] **Step 2: Molde m4, volcado inicial.** Proyecto de un script de unas 200 líneas, sin `.docs/`.
  - Petición: «inicializa con greenfield; quiero las capacidades iniciales sacadas del código».
  - Se mide:
    - si propone partición y nombres y para a esperar la aprobación;
    - si los slugs están en inglés;
    - si el historial lleva la línea `init`;
    - si avisa de un nombre de producto.
  - 2 sujetos, con la persona simulada de `entrevista-driver.py` si la init pide entrevista.
- [ ] **Step 3: Evidencia**: `tests/capabilities-green.md`, con el veredicto por fallo del RED (corregido, persiste o no aplica). Los huecos de la propia guidance se corrigen y se re-verifican en el mismo fichero.
- [ ] **Step 4: Longitud de rutas** y **commit**: `test(capabilities): GREEN fase B con validador y volcado inicial`.

### Revisión final de rama

Opus 5, effort medium, sobre el diff completo de la rama. Encargo con la cabecera de `encargo-revision.md`: las Restricciones globales como primera sección.

---

## Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec + plan: 1,5h
- Estimación de implementación: 6h (rango 4–8h)
  - Condicionada al RED: un frente recortado baja el coste.
- Base de la estimación:
  - Seis tasks: tres campañas (32 sujetos en paralelo, que no suman reloj; ≈ 10 min de redacción por fichero de evidencia y ~30 min por molde), un script con 12 tests, y ~14 ficheros de guidance de pocas líneas cada uno.
  - Referencia del `estimation-log`: tipo docs, mediana 0,5.
  - La task XL más cercana es la 0002: 3 tasks y 2,5h estimadas.
- Confianza: media.

---

## 3. Validación final

- [ ] Suite Pester en verde (`Invoke-Pester tests/`) y `claude plugin validate --strict skills/`.
- [ ] Cada requisito del delta cubierto (Self-review) y cada fallo del RED con su veredicto en el GREEN.
- [ ] Smoke: `Test-Capabilities.ps1` sobre la `spec.md` de esta task (debe salir 0) y sobre una copia con un `MODIFIED` recortado (debe salir 1).
- [ ] Longitud de rutas limpia en toda la rama.
- [ ] Gate de validación con el dev-lead y, después, `sdd-end-task`. El cierre integra develop primero, fusiona el delta en `capabilities/` y apunta la decisión 14 en la fila de la 0012.

---

## 4. Self-review (cobertura spec → tasks)

- Toda spec declara a qué capacidad pertenece su delta → Task 3 (`spec-template`, `sdd-start-task`), Task 2 (caso 1). ✓
- La pertenencia se decide con el inventario delante (incluye `legacy.md`) → Task 3 (sitio único); inventario insertado en el brazo skill (Tasks 4 y 5). ✓
- El nombre de una capacidad es un sustantivo inglés en kebab-case (con aviso de la init) → Task 3 (`capability-template`, `sdd-init-greenfield`), Task 2 (caso 2), E4 en la Task 6. ✓
- El comportamiento observable vive solo en `capabilities/` → Task 3 (`spec-template`, `plan-template`, `aprendizajes-skills`), medido en m2. ✓
- El delta declara el comportamiento por capacidad (gramática, bloque entero, `retira`) → Task 3 (`spec-template`), Task 2 (casos 3 y 4). ✓
- Un validador comprueba la forma del delta → Task 2, líneas en los puntos de uso en la Task 5. ✓
- El cierre fusiona el delta en la verdad viva (paso propio, construido y validado, alarma, sin release) → Task 3 (`sdd-end-task`), medido en m2. ✓
- Lo que sale de `legacy.md` se borra de `legacy.md` → Task 3, medido en m2. ✓
- El patch fusiona su delta al cerrar → Task 3 (`sdd-end-patch`, `patch-template`, `capability-template`), medido en m3. ✓
- Cambiar un requisito es task, salvo una frase → Task 3 (`sdd-start-patch`), medido en m3. ✓
- El volcado inicial es una excepción de greenfield → Task 3 (`sdd-init-greenfield`, `estructura.md`), E4 en la Task 6. ✓
- Brownfield no vuelca `capabilities/` (aunque se pida) → Task 3 (`generacion.md`). ✓
- Los documentos de anclaje nombran `capabilities/` y la consulta lee la capacidad → sin cambio de comportamiento: se mueven de capacidad en el cierre. N/A. ✓
- `task-flow`: MODIFIED de la rúbrica y ADDED de la pertenencia en la lente dominio → Task 3 (`review-spec`), medido en m1. ✓
- REMOVED ×5 en `task-flow` → fusión del cierre. N/A en el plan. ✓
