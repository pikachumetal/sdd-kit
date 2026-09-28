---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: feature
id: 20260928-145021-feature-0021-init-template-bridge
task: 0021
mode: full
date: 2026-09-28
---

# Ticket para el kit — feature 0021: primera feature y primera migración de un repo con dos `.docs/sdd/` sobre el kit 2.0.0

## Contexto

- Carril y modo: feature full (perfil `delegate`, ejecución Native) y, dentro, la migración
  1.1.0 → 2.0.0 de la raíz con `sdd-init-brownfield`.
- Skills del kit usadas: `sdd-start-feature`, `sdd-config`, `sdd-init-brownfield` (migración),
  `sdd-end-feature`, `add-to-changelog`, `sdd-templates` (plantillas y scripts
  `Get-CapabilityIndex`, `Test-Capabilities`, `Measure-SessionTokens`, `Build-EstimationLog`,
  `Invoke-SddMerge`).
- Proyecto: repo de templates de aplicación (Angular + .NET), una persona; tiene un `.docs/sdd/` en
  la raíz y otro dentro de cada template, que viaja al proyecto instanciado.
- Modelo del hilo: Opus 5.5, effort high.
- Modelos de los subagentes: 2 revisores de spec `sdd-kit:effort-medium` + Sonnet; revisor final
  `sdd-kit:effort-high` + Opus.
- Coste en reloj: ~0.7 h de implementación y cierre (marcas de commits), más spec y plan.
- Coste en tokens: hilo 51,7 M (la sesión incluye otra feature previa, ver hallazgo 3); subagentes
  3,2 M.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `Test-Capabilities.ps1` no conoce las capacidades puntero

- **Qué pasó**: el repo guarda la verdad de cada capacidad en el `.docs/sdd/` del template y deja en
  el de la raíz un puntero homónimo sin requisitos (título «# Capacidad — x (puntero)», un aviso
  en blockquote y, desde la migración, «## Propósito»), para que el índice de la raíz esté
  completo. Tras migrar, el validador da 2 errores por puntero (28 en total): «el título debe ser
  «# Capacidad — x»» y «falta la sección «Requisitos»». La migración manda dejarlos como pendientes,
  así que la raíz queda en rojo de forma permanente.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Test-Capabilities.ps1` (secciones admitidas,
  título) y `capability-template.md` (no contempla punteros).
- **Por qué el kit no lo evitó**: el kit supone un `.docs/sdd/` por proyecto; el caso de dos niveles
  no tiene forma escrita.
- **Coste**: el validador de cierre (`sdd-end-feature` paso 4) no se puede usar en verde en la
  raíz; hay que filtrar su salida a mano en cada cierre.
- **Propuesta**: reconocer una capacidad puntero por una marca fija (p. ej. una línea
  `> **Esta capacidad no vive aquí.**` o un campo en el título) y exigirle solo título,
  «Propósito» y la ausencia de requisitos.
- **Criterio de aceptación**: GIVEN `capabilities/auth.md` con «# Capacidad — auth (puntero)», el
  aviso, «## Propósito» con una frase y sin «## Requisitos» · WHEN `Test-Capabilities.ps1 -Path
  .docs/sdd` · THEN no da error para `auth.md`; y un puntero con una línea `- GIVEN` sí lo da.

### 2. Una MODIFIED fusionada arrastra su línea «Se valida en:»

- **Qué pasó**: la spec llevaba un `MODIFIED` con «Se valida en: <fase de otra feature>» bajo su
  escenario, como pide `sdd-start-feature` paso 4. Al fusionar en `capabilities/`, nada dice qué
  hacer con esa línea; la quité a mano porque es del delta, no del requisito vivo.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` paso 4 y `capability-template.md` regla 3
  («`MODIFIED` sustituye entero el requisito»).
- **Por qué el kit no lo evitó**: la regla de fusión copia el bloque entero, y el validador no
  cuenta «Se valida en:» como marca de delta.
- **Coste**: bajo; riesgo de una capacidad viva con una referencia a una feature ya cerrada.
- **Propuesta**: decir en el paso 4 que la línea «Se valida en:» no se fusiona, y que
  `Test-Capabilities.ps1` la trate como marca de delta.
- **Criterio de aceptación**: GIVEN un delta `MODIFIED` con «- Se valida en: …» · WHEN se fusiona y
  se ejecuta `Test-Capabilities.ps1 -Artifact <spec>` · THEN la capacidad no contiene esa línea, y
  si la contiene, el validador falla nombrándola.

### 3. `Measure-SessionTokens.ps1 -Branch` cuenta la sesión entera

- **Qué pasó**: la sesión empezó con otra feature en otra rama y después abrió esta. Con `-Branch
  feature/0021-…`, «Tokens del hilo» dio 51,7 M: todo el transcript, también lo anterior a crear la
  rama. El walkthrough lo tuvo que decir en prosa y la fila del `estimation-log` hereda esa cifra.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Measure-SessionTokens.ps1`.
- **Por qué el kit no lo evitó**: el paso 2 de `sdd-end-feature` avisa de que lo anterior a la rama
  no cuenta, pero el script no lo descuenta.
- **Coste**: la calibración de tokens del `estimation-log` queda inflada para esta feature.
- **Propuesta**: que el script corte en el primer turno posterior a la creación de la rama (o al
  primer commit de la rama) y lo diga en la línea.
- **Criterio de aceptación**: GIVEN un transcript con turnos en `feature/A` y después en
  `feature/B` · WHEN `-Branch feature/B` · THEN «Tokens del hilo» suma solo los turnos desde la
  creación de `feature/B`.

### 4. Una sesión reanudada cargó el kit 1.1.0 con el proyecto en 2.0.0

- **Qué pasó**: el plugin estaba en 2.0.0 en scope `project` y en 1.1.0 en scope `user`. Tras
  reanudar la sesión, la lista de skills era la de 1.1.0 (`sdd-start-task`, sin agentes
  `effort-*`). Nada lo avisó; lo detecté por los nombres de las skills. Hizo falta actualizar el
  scope `user` y `/reload-plugins`.
- **Dónde en el kit**: `hooks/` (SessionStart) y `skills/using-sdd/`.
- **Por qué el kit no lo evitó**: ningún hook compara la versión cargada con la de
  `.docs/sdd/sdd-kit.json`.
- **Coste**: una ronda de diagnóstico; sin detectarlo, la feature habría usado el carril de 1.1.0.
- **Propuesta**: que el hook de SessionStart compare la versión del kit cargado con
  `sdd-kit.json` y avise si la cargada es menor.
- **Criterio de aceptación**: GIVEN `sdd-kit.json` con `"version": "2.0.0"` y el kit 1.1.0 cargado ·
  WHEN arranca la sesión · THEN el hook imprime un aviso con las dos versiones y cómo actualizar.

### 5. La init sobre un template escribe `ids` antes de cerrar la entrevista, y no está escrito

- **Qué pasó**: el revisor final encontró que un test del template exigía `sdd-kit.json` sin `ids`
  mientras quedaran marcadores. Pero greenfield escribe `ids` y las claves en su paso de estructura,
  aunque la entrevista deje secciones en «no sé» con el marcador puesto, así que en ese estado
  intermedio el test daba rojo. Hubo que deducirlo del orden de pasos de la skill.
- **Dónde en el kit**: `.docs/sdd/capabilities/onboarding.md`, requisito «La init sobre un
  template completa solo lo marcado», y `skills/sdd-init-greenfield/SKILL.md` paso 3.
- **Por qué el kit no lo evitó**: el requisito dice qué gana `sdd-kit.json`, pero no cuándo respecto
  a los marcadores que quedan.
- **Coste**: un Important en la revisión final y una pasada de fix.
- **Propuesta**: un AND en ese requisito: «`sdd-kit.json` gana `ids` y las claves aunque queden
  secciones con el marcador».
- **Criterio de aceptación**: GIVEN un template marcado y un dev-lead que responde «no sé» a la
  pregunta de dominio · WHEN termina greenfield · THEN `sdd-kit.json` tiene `ids` y `mission.md`
  conserva el marcador en «Dominio», y el requisito de `onboarding` lo dice.

### 6. La estimación del plan no aplica el factor de calibración

- **Qué pasó**: el plan estimó 4 h y el real fue ~0,5 h (ratio 0,13), con un factor mediano de
  0,68 para `docs` en el propio `estimation-log`. El bloque de estimación pide la «Base» pero no
  que se aplique el factor.
- **Dónde en el kit**: `skills/sdd-templates/templates/plan-template.md`, bloque «Estimación y
  esfuerzo».
- **Por qué el kit no lo evitó**: la plantilla menciona el log como referencia, no como
  corrección.
- **Coste**: el log acumula ratios muy bajos que no calibran.
- **Propuesta**: una línea «Estimación calibrada: <Yh × factor del tipo>» junto a la bruta.
- **Criterio de aceptación**: GIVEN un `estimation-log` con mediana 0,68 para `docs` · WHEN se
  escribe un plan de tipo `docs` de 4 h · THEN el bloque lleva también «calibrada: 2,7 h».

## Lo que hice por iniciativa propia

- La skill puente del template comprueba la versión del kit leyendo la carpeta del «Base directory»
  (`…/sdd-kit/<versión>/…`) antes de delegar en greenfield. Funcionó en lectura; no hay forma
  documentada de que un consumidor pregunte la versión del kit. Candidato: que `using-sdd` o un
  script exponga la versión cargada.
- En el esqueleto que viaja, un test propio replica el criterio de propósito de
  `Test-Capabilities.ps1` (primera sección, ≤ 300, sin líneas `>`), porque el proyecto instanciado
  no tiene el script del kit en su suite. Candidato: publicar el criterio como regla citable o el
  script como comprobación reutilizable.

## Funcionó, no tocar

- La primera pregunta de `sdd-start-feature` (carril, modo, perfil y sus opciones de delegación)
  dejó claro el perfil vigente y de dónde salía.
- La rúbrica de review de spec y el reparto de puntos entre las dos lentes: 11 hallazgos útiles,
  sin duplicados.
- La migración v2.0.0 por predicados: cada paso se saltó o se aplicó con motivo, y su
  «Verificación» dio una lista cerrada que comprobar.
- `sdd-config` desde la migración: una pregunta por turno y con la recomendada, seis turnos.
- `Invoke-SddMerge.ps1` funcionó sin remoto y en el checkout principal.

## Errores míos, no huecos del kit

- Un `git stash --keep-index` innecesario en mitad de una task (lo deshice sin pérdida).
- Un script de sustitución con regex sobre ficheros CRLF que no casó y otro que estropeó la
  cabecera de `tasks.md`; los rehice con edición directa.
- El plan decía «medir solo el primer párrafo del propósito» en su Review Focus, contra su propio
  paso y contra el kit.
