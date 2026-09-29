---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: feature
id: 20260928-222123-feature-0010b-verificacion-e2e
task: 0010b
mode: full
date: 2026-09-28
---

# Ticket para el kit — feature 0010b: el kit no da al agente ojos ni regla de medir para el frontend

## Contexto

- Carril y modo: feature full, retomada tras una pausa; dentro, un patch (0022) abierto y cerrado en su propio worktree.
- Skills del kit usadas: `using-sdd` (hook), `sdd-start-feature` (retomada en el paso 6), `sdd-start-patch`, `sdd-end-patch`, `sdd-consult`, `sdd-feedback`, scripts `Get-NextSddId.ps1`, `Test-Capabilities.ps1`, `Build-EstimationLog.ps1` e `Invoke-SddMerge.ps1`.
- Proyecto: repo de templates de aplicación (Angular + .NET, dos dialectos de BD) con instanciador; una persona (dev-lead) más el agente.
- Modelo del hilo: Opus 5.5.
- Modelos de los subagentes: no aplica.
- Coste en reloj: una sesión larga, de unas 8 h de reloj.
- Coste en tokens: no medido.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El kit no tiene carril ni método para verificar frontend y cambios visuales: «mirarlo en un navegador» no basta

- **Qué pasó**: el proyecto había traducido «verifica la UI en el navegador» en un gate de regresión visual por píxeles, con baselines locales. En la validación manual, un cambio de una línea de CSS (tamaño de texto de un badge) le costó a la skill de UI del proyecto unos 8 minutos: regenerar baselines, recorrido con capturas, barrido de contraste y comparación final. El dev-lead lo rechazó: en otro proyecto ya habían quitado la regresión visual porque estorba al desarrollo. Lo que pedía era otra cosa: que el agente **vea** si lo que construye funciona y está bien compuesto, porque la IA no tiene criterio visual («que el botón esté aquí o allí le da igual mientras se pueda pulsar») y tiende a apelotonar márgenes y padding. En la misma sesión, un detector determinista sobre la página renderizada (`impeccable detect <url>`, que abre un Chrome real y lee el layout calculado) encontró en un minuto lo que las baselines tenían congelado: padding vertical de 0 px contra un borde, un texto que se sale 160 px de su caja, líneas de ~158 caracteres y un patrón de tarjeta típico de UI generada por IA. La regresión por píxeles no podía detectar nada de eso, porque ya estaba en las baselines.
- **Dónde en el kit**:
  - `skills/sdd-start-feature/SKILL.md` paso 6 («Verificación visual»: «mide en estilos computados lo que el campo pide mirar y saca una captura por estado y tema»);
  - `skills/sdd-templates/templates/plan-template.md` (campo «Verificación visual»: «qué mirar es alineación, separación a bordes y contraste»);
  - `skills/sdd-start-patch/SKILL.md` y el modo lite (`skills/sdd-start-feature/references/modo-lite.md`), que no tienen verificación visual.
- **Por qué el kit no lo evitó**:
  - El kit dice **qué** mirar, pero no **con qué**. Deja la medida al ojo del modelo, y ese ojo es justo lo que falla.
  - No pide un criterio escrito antes de mirar, ni una referencia (una pantalla buena del propio sistema de diseño) con la que comparar, ni una rúbrica de crítica.
  - No distingue la verificación funcional (el flujo funciona, con sus estados, la consola y la red) de la calidad de composición (espaciado, jerarquía, densidad).
  - Un patch o una feature lite que tocan la UI no tienen ningún paso visual.
  - Al no dar método, cada proyecto inventa el suyo, y aquí salió uno caro y ciego a lo que importa.
- **Coste**: 8 min por cambio de CSS en la skill del proyecto; dos features del proyecto (el gate y su integración en la skill) que ahora se revierten; una fase de la validación manual repetida; y el hallazgo de fondo (UI apelotonada) sin cubrir en ninguna.
- **Propuesta**: un bloque «Verificación de frontend» del kit, que el plan, el patch y el modo lite referencian cuando la tarea cambia lo que se ve, con cinco pasos:
  1. **Criterio y referencia antes de tocar**: qué debe hacer la pantalla, en frases medibles, y qué pantalla del proyecto sirve de referencia.
  2. **Regla de medir**: un detector determinista sobre la página renderizada, en escritorio y en móvil (hoy `impeccable detect <url> [--viewport 390x844]`, o el que declare el `tech-stack` del proyecto). No se da por terminado con hallazgos abiertos sin justificar.
  3. **Ojos**: capturas en claro y en oscuro, que el agente mira con una rúbrica de composición (jerarquía, ritmo de espaciado, densidad, alineación) y compara con la referencia, en 3 rondas como máximo.
  4. **Manos**: ejecutar el flujo real (interacción, estados de carga, error y deshabilitado), con consola y red sin errores, usando el árbol de accesibilidad para presencia, rol y estado.
  5. **Enseñar**: la presentación de la task o de la validación lleva las capturas y la salida del detector.

  Y una nota explícita: la regresión visual por píxeles no es verificación de frontend. Solo tiene sentido en CI, con entorno fijo y revisión en la PR, y el kit no la propone como gate del bucle de desarrollo.
- **Criterio de aceptación**: GIVEN una task (o un patch) que cambia el padding de un componente WHEN el agente la cierra THEN su presentación incluye la salida del detector en dos viewports sin hallazgos abiertos, una captura por tema, el criterio escrito antes del cambio y la pantalla de referencia; y un RED donde el componente queda con 0 px de padding contra un borde no se cierra como hecho.

### 2. Retomar una feature en pausa no tiene puerta en `using-sdd` ni regla de entrada en `sdd-start-feature`

- **Qué pasó**: al retomar la task en pausa (carpeta con spec y plan aprobados, `tasks.md` vivo), el agente no invocó ninguna skill del kit. Razonó que `sdd-start-feature` es para «arrancar» y que `sdd-consult` es para preguntas, y ejecutó a mano. Así se saltó el diff de la fila del roadmap con la base, justo después de mergear la integración, y el ledger. Lo corrigió el dev-lead: una feature arrancada se retoma con `sdd-start-feature` y se entra en el paso que toque.
- **Dónde en el kit**: `skills/using-sdd/SKILL.md` (tabla de puertas) y `skills/sdd-start-feature/SKILL.md` (Gate 1 y paso 6).
- **Por qué el kit no lo evitó**: ninguna fila de la tabla dice «retomar trabajo con carpeta en `specs/`», y `sdd-start-feature` no tiene regla de entrada para una carpeta que ya existe. Buscando «retom», «reanud», «pausa» o «ya existe» en su `SKILL.md` no sale nada.
- **Coste**: un turno de corrección y los gates del paso 6 sin aplicar hasta que el dev-lead lo detectó.
- **Propuesta**: una fila en `using-sdd`: «Retomar una feature o task en curso o en pausa (hay carpeta en `specs/`) → `sdd-start-feature`». En `sdd-start-feature`, una regla de entrada: con spec y plan aprobados, releerlos, hacer el diff de la fila con la base y entrar en el paso 6 por la task que marca `tasks.md`.
- **Criterio de aceptación**: GIVEN una carpeta de feature con spec y plan aprobados y `tasks.md` con una nota de pausa WHEN el usuario pide «retomamos la X» THEN el agente invoca `sdd-start-feature`, no crea carpeta nueva ni repite el brainstorming, y hace el diff de la fila del roadmap antes de ejecutar la task siguiente.

### 3. Un workaround escrito como decisión en `tech-stack` nunca llega a la deuda

- **Qué pasó**: una feature antigua serializó entera la suite de tests del backend para esquivar una carrera sobre un logger estático, y lo documentó en `tech-stack.md` como decisión de diseño («Tests en serie: … se serializa en el assembly»). Nunca llegó a «Deuda y pendientes» ni a una revisión de release. El dev-lead no lo supo hasta esta sesión y lo calificó de prioritario: la suite tarda cada vez más y la causa tiene un arreglo de una línea.
- **Dónde en el kit**: `skills/sdd-end-feature/SKILL.md` (cierre, fusión de aprendizajes en docs de anclaje) y `skills/sdd-templates/templates/tech-stack-template.md`. No se localiza una regla que distinga decisión de workaround.
- **Por qué el kit no lo evitó**: el cierre fusiona en `tech-stack` lo aprendido sin preguntar si es una decisión («elegimos X por Y») o un rodeo («evitamos X porque rompe Y»). Un rodeo con coste recurrente (tiempo de suite, capacidad desactivada) es deuda.
- **Coste**: una capacidad (paralelismo de tests) desactivada desde el principio sin que el dev-lead lo supiera, y una feature nueva abierta en esta sesión para recuperarla.
- **Propuesta**: en el cierre, toda entrada nueva de `tech-stack` que desactive, serialice o esquive algo por un fallo conocido lleva también su fila en «Deuda técnica» del roadmap, con el coste y la vía de arreglo, y se nombra en el mensaje final del cierre.
- **Criterio de aceptación**: GIVEN una feature cuyo fix desactiva el paralelismo de una suite por un fallo de una librería WHEN se cierra con `sdd-end-feature` THEN el roadmap tiene una fila de deuda con el coste y la causa, y el mensaje final la nombra.

### 4. `Get-NextSddId.ps1 -Reserve` falla en un proyecto con ids heredados con sufijo

- **Qué pasó**: `Get-NextSddId.ps1 -ProjectRoot <raíz> -Reserve` lanzó «Dos artefactos distintos comparten el id 0006» por dos carpetas antiguas `task-0006a-…` y `task-0006b-…`, anteriores a la regla de «nunca sufijos». El agente calculó el id a mano (el siguiente al último de roadmap, carpetas y ramas) y lo registró como ruling.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Get-NextSddId.ps1` (línea ~151, la comprobación de duplicados).
- **Por qué el kit no lo evitó**: el script trata los sufijos heredados como colisión y aborta. No hay modo de migración ni una lista de excepciones.
- **Coste**: la reserva no se hizo (otro worktree podría coger el mismo id) y el cálculo fue manual.
- **Propuesta**: que la comprobación de duplicados ignore, o solo avise de, las carpetas cuyo id lleva sufijo de letra (`0006a`, `0006b`) cuando son históricas (cerradas y fusionadas), y siga reservando el siguiente número libre.
- **Criterio de aceptación**: GIVEN `specs/` con `task-0006a-x` y `task-0006b-y` cerrados WHEN se ejecuta `Get-NextSddId.ps1 -Reserve` THEN reserva el siguiente id libre y, como mucho, avisa de los sufijos heredados.

### 5. `Test-Capabilities.ps1` rechaza los punteros de capacidad que el propio kit permite

- **Qué pasó**: al cerrar el patch, `Test-Capabilities.ps1 -Path .docs/sdd -Artifact <patch.md>` dio error en todas las capacidades de la raíz («falta la sección Requisitos», «el título debe ser…»). En este proyecto son punteros sin requisitos hacia la capacidad real de un subproyecto, por una regla escrita del proyecto. El agente siguió, porque el patch no tocaba ninguna, y lo dejó como pendiente.
- **Dónde en el kit**: `skills/sdd-templates/scripts/Test-Capabilities.ps1` y `skills/sdd-end-patch/SKILL.md` paso 1.
- **Por qué el kit no lo evitó**: el validador no conoce la forma «puntero» (una capacidad que remite a otra ruta sin requisitos propios), así que un proyecto con subproyectos siempre sale en rojo y el rojo pierde valor.
- **Coste**: bajo por ahora: ruido en cada cierre y el riesgo de acostumbrarse a ignorar el validador.
- **Propuesta**: reconocer un puntero (por ejemplo, un fichero cuyo único contenido es un enlace a otra capacidad, o un marcador de frontmatter) y validar la capacidad apuntada en vez del puntero.
- **Criterio de aceptación**: GIVEN `capabilities/x.md` que solo apunta a `sub/.docs/sdd/capabilities/x.md` WHEN corre `Test-Capabilities.ps1` THEN no da error por el puntero y valida la capacidad apuntada.

## Lo que hice por iniciativa propia

- Un spike desechable del detector renderizado (`impeccable detect <url>` en dos páginas y dos viewports) dentro de `sdd-consult`, para contestar con datos en vez de con una opinión. Funcionó: convirtió una discusión abstracta en cuatro hallazgos concretos y cambió la decisión del dev-lead. Candidato a regla: en una consulta sobre calidad de UI, medir antes de recomendar.
- Separar el punto 3 del patch (un test nuevo que ejecuta la suite de tooling sobre una instancia) en una feature propia, al ver que añadía una garantía nueva a una capacidad y costaba minutos, no segundos. Funcionó: el patch se cerró en su carril.

## Funcionó, no tocar

- `sdd-start-patch` con la parada de «¿es de verdad un patch?»: evitó meter una garantía nueva en un patch.
- `Invoke-SddMerge.ps1`: fusionó el patch en la integración sin tocar el checkout principal y sin push, según `merge.push`.
- El registro vivo en `tasks.md` con rulings: permitió reconstruir el estado cuando el dev-lead se perdió («explícame dónde estábamos»).
- La validación con frase literal, incluido el «sí» sin detalle registrado como tal.

## Errores míos, no huecos del kit

- Di por hechos los puertos por defecto del entorno sin leer `.containers/.env`, que el dev-lead había regenerado con puertos aleatorios. Además dejé un bucle de espera de 400 s sobre los puertos equivocados.
- Reproduje a mano solo uno de los specs en rojo y conté 3 fallos cuando eran 5, con dos causas.
- Estimé en «unos 10 s» un test que necesita instalar dependencias en la instancia (son minutos).
- Lancé `worktree:new` sin `--no-open`, y se quedó esperando al editor.
