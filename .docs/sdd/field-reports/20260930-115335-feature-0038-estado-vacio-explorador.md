---
kit_version: 2.2.0
superpowers_version: 6.4.2
lane: feature
id: 20260930-115335-feature-0038-estado-vacio-explorador
task: 0038
mode: lite
date: 2026-09-30
---

# Ticket para el kit — feature 0038: estado vacío de una lista, cerrado con tres intentos de merge

## Contexto

- Carril y modo: feature lite, perfil `unattended` para esta feature (el proyecto dice `delegate`), spec
  aprobada por delegación
- Skills del kit usadas: `using-sdd`, `sdd-start-feature`, `sdd-templates` (`Get-CapabilityIndex.ps1`,
  `Watch-SubagentSilence.ps1`, `Measure-SessionTokens.ps1`, `Build-EstimationLog.ps1`, `Test-Capabilities.ps1`,
  `Invoke-SddMerge.ps1`), `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`
- Proyecto: monorepo con backend .NET y SPA React + Vite, un desarrollador con un agente, `ids.mode: sequence`,
  sin remoto git
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: claude-sonnet-5-5 (review de spec y revisión final), claude-haiku-4-5 (cuatro
  re-revisiones)
- Coste en reloj: unas 2 h 10 min, del arranque al merge; la implementación, ~1 h, y el resto, preparar el gate
  responsive y desbloquear el merge
- Coste en tokens: ~24 M en el hilo y ~1,2 M en 7 despachos (medido con `Measure-SessionTokens.ps1` a mitad del
  cierre)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un ticket de `sdd-feedback` dejó en rojo el gate de docs de la rama de integración

- **Qué pasó**: el ticket del patch anterior, escrito con esta misma skill y fusionado en la rama de
  integración, tenía 12 líneas de más de 200 caracteres (la regla de longitud de markdownlint del proyecto) y
  dos palabras fuera del diccionario de cspell. El gate de docs del proyecto quedó en rojo en la integración, y
  el merge de esta feature falló en la verificación por un fichero que no era suyo. Arreglarlo pidió un merge de
  sincronización, partir las líneas del ticket ajeno, una re-revisión y relanzar el merge.
- **Dónde en el kit**: `skills/sdd-feedback/SKILL.md`, paso 4 (Guardar), y `templates/kit-feedback-template.md`,
  cuyos bloques de ejemplo invitan a párrafos de una sola línea.
- **Por qué el kit no lo evitó**: `sdd-feedback` no ejecuta el lint de docs del proyecto antes de guardar, y el
  cierre del patch fusionó el ticket sin pasarlo.
- **Coste**: ~25 min y una re-revisión, y dejó la integración en rojo para cualquier otra sesión.
- **Propuesta**: en el paso 4, tras guardar, ejecutar el lint de docs que declare el proyecto (o el gate del
  cierre) sobre el ticket, y partir las líneas largas antes del commit.
- **Criterio de aceptación**: GIVEN un proyecto con markdownlint de longitud de línea 200 en su gate, WHEN
  `sdd-feedback` escribe un ticket con hallazgos de varias frases, THEN el ticket pasa ese lint antes del commit.
  Hoy (RED), el ticket de la sesión anterior falló con MD013 en 12 líneas.

### 2. `Invoke-SddMerge.ps1` no distingue «la base ya está en rojo» de «el merge rompe algo»

- **Qué pasó**: la verificación sobre el resultado del merge falló dos veces por causas previas a la feature:
  primero el lint de docs de la integración (hallazgo 1) y después un test con plazo de 20 s que, en el worktree
  temporal `merge-<id>`, recién creado y sin caché de transformación, se agotaba en el primer import. En la rama
  de la feature, con el mismo árbol, pasaba siempre. El mensaje del script era solo `verificación: código de
  salida 1.`, y la salida del gate se perdió en la consola. Para saber qué fallaba relancé el script, que es lo
  que la receta prohíbe.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Invoke-SddMerge.ps1` (paso de verificación) y
  `skills/sdd-end-feature/references/merge-recipe.md`, «Si el script falla».
- **Por qué el kit no lo evitó**: el script no guarda la salida de la verificación en un fichero que el mensaje
  cite, y la receta no dice cómo diagnosticar sin relanzarlo. Tampoco avisa de que el worktree temporal nace
  sin caché, y ahí un test sensible al tiempo falla aunque en la rama pase.
- **Coste**: dos intentos fallidos, un relanzamiento contra la receta y ~20 min de diagnóstico.
- **Propuesta**: que el script guarde la salida de `-VerifyCommand` en un log y cite su ruta en el mensaje de
  `verificación:`, y que, si falla, ejecute el mismo comando sobre la base sin la feature y diga `base: en rojo`
  cuando la base también falla. En la receta, una línea: un fallo solo en el worktree temporal apunta a una caché
  fría; se reproduce en un worktree limpio antes de tocar nada.
- **Criterio de aceptación**: GIVEN una rama de integración cuyo gate ya falla, WHEN se ejecuta
  `Invoke-SddMerge.ps1 -VerifyCommand <gate>`, THEN el mensaje dice que la base ya estaba en rojo y da la ruta
  del log, sin necesidad de relanzar. Hoy (RED) solo dice `verificación: código de salida 1.`.

### 3. La revisión de los commits pequeños fuera de `.docs/` cuesta más que el cambio

- **Qué pasó**: la excepción «se revisa en el hilo» solo cubre los commits de docs de menos de 20 líneas bajo
  `.docs/` o `*.md` de la raíz. Una frase en el `SKILL.md` de una skill del proyecto (`.claude/skills/`), dos
  palabras en el diccionario de cspell y un cambio solo de saltos de línea verificado con `--word-diff` abrieron
  una re-revisión cada uno: tres despachos para cambios sin código.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md`, paso 6, «Desvío y ruling», y
  `skills/sdd-end-feature/SKILL.md`, paso 9.
- **Por qué el kit no lo evitó**: el predicado se limita a una ruta, y no mira qué tipo de fichero es ni si el
  cambio es solo de formato.
- **Coste**: ~450 k tokens de subagentes y ~8 min de espera en el camino del merge.
- **Propuesta**: ampliar la excepción a cualquier `*.md` del repositorio y a los diccionarios del corrector
  ortográfico, y a los cambios que `git diff --word-diff` muestra sin palabras cambiadas.
- **Criterio de aceptación**: GIVEN un commit que solo añade dos palabras al diccionario de cspell o parte
  líneas de un `.md`, WHEN el hilo decide si abre re-revisión, THEN lo revisa en el hilo y lo anota como
  `revisado en el hilo`. Hoy (RED) despacha un revisor.

### 4. `§Frontend` no tiene sitio para los datos que necesita el gate de maquetado

- **Qué pasó**: el gate responsive del proyecto necesita un paquete de datos real importado y dos variables de
  entorno con los puertos del worktree; sin ellas, falla con `ECONNREFUSED` al puerto por defecto. El entorno de
  la feature estaba vacío. La importación por la interfaz se quedó parada una vez y hubo que relanzarla.
- **Dónde en el kit**: `skills/sdd-start-feature/references/frontend-verification.md`, «Con qué: `§Frontend`».
- **Por qué el kit no lo evitó**: los campos de `§Frontend` (URL, Detector, Viewports, Runner, Acceso, Temas,
  Referencia) no incluyen los datos ni las variables que pide un gate declarado por el proyecto.
- **Coste**: ~25 min preparando el entorno, con un vigía de silencio a los 20 min.
- **Propuesta**: un campo `Datos del gate` (qué fixture, cómo se carga, qué variables necesita) en
  `§Frontend`, que el paso 6 prepara antes de la verificación visual.
- **Criterio de aceptación**: GIVEN un proyecto cuyo gate de maquetado necesita datos importados, WHEN una task
  de UI llega a su «Verificación visual», THEN el hilo carga los datos y fija las variables desde `§Frontend`
  sin descubrirlo por el fallo. Hoy (RED) se descubre con `ECONNREFUSED`.

### 5. El modelo del revisor final choca con la política de modelos del usuario

- **Qué pasó**: `encargo-revision.md` fija el revisor final en `effort-high` + Opus («el techo del kit»). Las
  instrucciones del usuario piden el modelo más barato que resuelva con calidad. Con un diff de ~120 líneas lo
  despaché con Sonnet y `effort-medium`, y lo registré como ruling.
- **Dónde en el kit**: `skills/sdd-start-feature/references/encargo-revision.md`, «Revisor final».
- **Por qué el kit no lo evitó**: la regla no mira el tamaño del diff ni la precedencia de las instrucciones
  del usuario, que el kit reconoce en otros puntos (la review de spec baja un escalón con menos de ~50 líneas).
- **Coste**: bajo; cada sesión decide el conflicto a su manera.
- **Propuesta**: bajar un escalón (Sonnet + `effort-medium`) con un diff de menos de ~200 líneas sin contrato
  público ni datos, igual que la rúbrica de la review de spec.
- **Criterio de aceptación**: GIVEN una rama de ~120 líneas de frontend sin API ni migración, WHEN se despacha
  el revisor final, THEN el encargo usa el escalón bajo y dice por qué. Hoy (RED) la regla pide Opus + high.

## Lo que hice por iniciativa propia

- Reproducir el fallo del gate en un worktree limpio (instalar, borrar la caché y ejecutar) antes de arreglar el
  test, y comprobar el arreglo igual, en frío. Así confirmé la causa en dos ejecuciones, en vez de suponerla.
  Candidato a nota en la receta del merge (hallazgo 2).
- Un merge de sincronización de la integración en la rama de la feature para poder editar un fichero que solo
  existía allí, cuando la receta solo prevé ese merge a mano para un conflicto en los registros. Funcionó sin
  conflictos y entró en una re-revisión.
- Medir el centrado en píxeles con un script de Playwright, además de la captura: el detector no mide la
  composición, y la rúbrica a ojo no da un número que enseñar.
- Localizar un hallazgo del detector sin selector buscando en la página el color calculado que citaba.

## Funcionó, no tocar

- La regla «dos revisores, spec delegada y confirmar antes de paralelizar → un revisor con los siete puntos».
  El revisor encontró un Crítico real (un GIVEN que no permitía uno de sus AND).
- Revisor final en segundo plano y anclado en un worktree desanclado: la verificación visual y los borradores
  de cierre avanzaron mientras revisaba.
- El vigía de silencio sobre la salida de una verificación lenta: avisó a los 20 min de una importación parada.
- `Measure-SessionTokens.ps1`, `Build-EstimationLog.ps1` y `Test-Capabilities.ps1` funcionaron a la primera.
- La primera pregunta con carril, modo lite citando las condiciones, perfil y aprobación delegada juntos, en un
  solo turno.

## Errores míos, no huecos del kit

- Dos veces encadené el commit tras un `grep` del lint, en lugar de tras su código de salida, e hice el commit con
  cspell en rojo.
- Relancé `Invoke-SddMerge.ps1` tras un fallo de verificación solo para ver la salida, contra la receta.
- Ofrecí en una pregunta «partir las líneas en esta rama» sin ver que el fichero solo existía en la integración.
  Hubo que añadir un merge de sincronización que la opción no decía.
- Expliqué el bloqueo del merge con jerga (worktree temporal, caché de transformación, grafo de imports), y el
  usuario respondió «no entiendo nada». La explicación en palabras de producto se entendió a la primera.
