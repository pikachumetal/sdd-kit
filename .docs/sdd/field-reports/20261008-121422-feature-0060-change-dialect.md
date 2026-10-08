---
kit_version: 2.3.2
superpowers_version: 6.4.2
lane: feature
id: 20261008-121422-feature-0060-change-dialect
task: 0060
mode: full
date: 2026-10-08
---

# Ticket para el kit — feature 0060: skill nueva con RED/GREEN sobre instancias reales y delta con tags de dialecto

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native
- Skills del kit usadas: `using-sdd`, `sdd-start-feature`, `sdd-templates` (scripts), `sdd-end-feature`,
  `sdd-feedback`; de superpowers, `brainstorming`, `writing-plans`, `executing-plans`, `test-driven-development`,
  `writing-skills`
- Proyecto: repo de templates de aplicación (monorepo moon, Node + .NET + Angular), un template con tres dialectos
  de BD podados por tag; una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Sonnet 5.5 (12 sujetos RED/GREEN y review técnica de spec), Opus 5.5 (review de
  dominio de spec y revisor final)
- Coste en reloj: ~2,9 h de implementación frente a 7 h estimadas (más ~0,7 h de spec y plan)
- Coste en tokens: hilo 79,5 M; subagentes 27,8 M en 14 despachos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `Merge-CapabilityDelta.ps1` rechaza un delta con tags de dialecto y marcadores `<…>` legítimos

- **Qué pasó**: el delta copiaba un requisito vigente con líneas terminadas en `<!-- db:sqlite -->` (el tag que el
  instanciador del proyecto poda) y un escenario con `<destino>` como parte del texto. `pwsh -NoProfile -File
  Merge-CapabilityDelta.ps1 -Path <tmp>/.docs/sdd -Artifact spec.md` en PowerShell 7 → `spec.md: «<!-- db:sqlite
  -->» es un hueco de la plantilla: rellénalo o borra lo que no aplique` y lo mismo con `«<destino>»`. Se resolvió
  fusionando una copia de la spec con centinelas (`@@DBSQLITE@@`, `@@Ldestino@@`) y restaurándolos en la salida.
  Es la segunda feature seguida con el mismo rodeo: la anterior taggeó a mano después de fusionar.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Merge-CapabilityDelta.ps1` (detección de huecos);
  `skills/sdd-end-feature/SKILL.md` paso 4 («nunca a mano»).
- **Por qué el kit no lo evitó**: el script trata cualquier comentario HTML y cualquier `<palabra>` como hueco de la
  plantilla, sin distinguir los literales de la plantilla de texto propio del proyecto.
- **Coste**: ~15 min en esta feature (dos ejecuciones fallidas, lectura del walkthrough anterior y el script de
  centinelas); en la anterior, el retagueo a mano. Respaldo: walkthrough de esta feature §5 y el de la anterior §3.
- **Propuesta**: que el detector solo marque los huecos literales de `spec-template.md` (los `<…>` de su texto de
  ayuda y de sus campos) o los comentarios con un formato de hueco declarado, y deje pasar los demás `<!-- … -->` y
  `<…>`; o un parámetro `-KeepLiteral <regex>` para declarar los propios del proyecto.
- **Verificada**: sí — reproducido con el comando de arriba en PowerShell 7; el rodeo con centinelas fusionó bien
  (11 bloques sustituidos o añadidos).
- **Criterio de aceptación**: GIVEN un delta `MODIFIED` cuyo bloque copia líneas que terminan en
  `<!-- db:sqlite -->` y un THEN con `<destino>` · WHEN se ejecuta `Merge-CapabilityDelta.ps1` · THEN fusiona y la
  capacidad conserva esas líneas literales; un `<título estable>` sin rellenar sigue fallando.

### 2. Juntar los hitos de task choca con una evidencia de `writing-skills` que cita shas intermedios

- **Qué pasó**: la task de GREEN iteró la skill en seis commits, y cada sujeto instanció el template en uno de ellos
  (el sha quedaba en el commit inicial de su instancia y en `skill-tdd.md`). Juntar el hito, como pide la receta,
  dejaba esos shas fuera de la rama; se dejó sin juntar y se registró como desviación.
- **Dónde en el kit**: `skills/sdd-start-feature/references/commit-milestones.md`, «Guardas».
- **Por qué el kit no lo evitó**: las guardas solo cubren un merge en el rango y un rango ya publicado.
- **Coste**: ~10 min de decidir y justificar; sin cambio de código. Respaldo: walkthrough §3.
- **Propuesta**: una tercera guarda: no se junta si un artefacto de la feature (la evidencia de RED/GREEN) cita
  shas del rango como versión probada; el walkthrough lo dice.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una task cuyos commits intermedios cita la evidencia por sha · WHEN el hilo
  cierra el hito · THEN no lo junta y lo registra, en lugar de juntarlo o improvisar la excepción.

### 3. En el gate de la spec no ofrecí parar antes de la Task 1 para bajar el modelo

- **Qué pasó**: perfil `delegate`, sesión en Opus. La pregunta del gate de la spec y la primera pregunta solo
  ofrecieron el gate normal y la delegación; en el gate no salió la opción «Apruebo; escribe el plan y, si sale
  Native, para antes de la Task 1 para que baje la sesión a gama media». Salió Native y toda la ejecución corrió en
  Opus.
- **Dónde en el kit**: `skills/sdd-start-feature/SKILL.md` paso 4, párrafo del GATE en `delegate`.
- **Por qué el kit no lo evitó**: la regla existe y no la apliqué: la presentación de la spec se hizo en texto libre
  y la pregunta final («¿Apruebas la spec?») no salió de una lista de opciones donde faltara la variante.
- **Coste**: sin respaldo en cifra; la ejecución (2,9 h, 79,5 M tokens de hilo) corrió en el modelo más caro.
- **Propuesta**: que el gate en `delegate` se haga siempre con `AskUserQuestion` y opciones fijas, la variante del
  modelo incluida, en vez de una pregunta en prosa al final de la presentación.
- **Verificada**: sí — contrastado con el paso 4 de `skills/sdd-start-feature/SKILL.md` («En `delegate`, si la
  sesión va con el modelo más capaz, la pregunta ofrece además…»).
- **Criterio de aceptación**: GIVEN `delegate` y sesión en Opus · WHEN el agente presenta la spec · THEN la pregunta
  del gate tiene las opciones «Apruebo» y «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1…».

## Lo que hice por iniciativa propia

- Los sujetos del RED/GREEN trabajaron sobre instancias reales con un script que las monta (instanciar, migración
  propia, commit, worktree), y la conservación de datos se comprobó con `sha256sum` de la BD antes y después.
  Funcionó: detectó tres veces que un sujeto no tocó la BD default, y una contaminación de volúmenes del propio
  ensayo.
- Cuando un hueco de la skill se repitió tres veces en el GREEN (un campo del resumen que se rellena al final), cambié
  la forma —recoger el dato en el paso 0— en lugar de reforzar la frase. Pasó a la primera.
- Las decisiones que dejaba la revisión final y el tercer hallazgo descubierto se preguntaron en un solo
  `AskUserQuestion` de tres preguntas antes de presentar la validación, en lugar de en tres turnos.

## Funcionó, no tocar

- La review de spec con dos lentes encontró los dos Críticos reales (cherry-pick entre repos sin procedimiento y un
  inventario que podía borrar datos del entorno default); 17 de 20 hallazgos aceptados.
- El vigía de silencio por despacho y la receta de conflicto solo en registros del merge (`roadmap.md` y
  `estimation-log.md`) se aplicaron sin fricción.
- El revisor final anclado en un worktree desanclado mientras el hilo escribía los borradores de cierre.

## Menores

- Los borradores de cierre sin commitear dejaron sucio el árbol del template, y un smoke de `init` que depende del
  árbol limpio dio un resultado engañoso; se repitió desde un worktree desanclado —
  `skills/sdd-start-feature/SKILL.md` paso 7 («borradores… sin commitear»).
- `Test-Capabilities.ps1` no sigue los punteros raíz → template y da avisos esperados en cada cierre de este repo —
  `skills/sdd-templates/scripts/Test-Capabilities.ps1`.
- `Measure-SessionTokens.ps1` da «sin precio» sin tabla `pricing` en `sdd-kit.json`, y nada en el kit la propone —
  `skills/sdd-config` (no localizado el paso).
