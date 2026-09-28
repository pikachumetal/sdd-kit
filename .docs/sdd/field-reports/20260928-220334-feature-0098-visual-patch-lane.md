---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: feature
id: 20260928-220334-feature-0098-visual-patch-lane
task: 0098
mode: full
date: 2026-09-29
---

# Ticket para el kit — feature 0098: la revisión final encontró cuatro Important que la rúbrica de la spec daba por «ninguna review»

## Contexto

- Carril y modo: feature full, perfil `delegate`, ejecución Native
- Skills del kit usadas: `using-sdd` (hook), `sdd-start-feature`, `sdd-end-feature`, `add-to-changelog`, `sdd-feedback`. De superpowers: `brainstorming`, `writing-plans`, `executing-plans`
- Proyecto: el propio kit (skills en Markdown, Pester, campañas de sujetos headless), una persona validando
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus (revisor final, `sdd-kit:effort-high`); los sujetos de la campaña en Sonnet
- Coste en reloj: ~1,5 h de implementación, más ~0,4 h de spec y plan
- Coste en tokens: hilo 42,2 M · subagentes 2,0 M en 1 despacho · sesión 15,72 $ · sujetos 8,33 $ (35)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La rúbrica de review de spec no ve el riesgo de una spec de enrutado

- **Qué pasó**: la rúbrica dio 0 señales y «ninguna review» a una spec que añadía una puerta de enrutado con un predicado. La revisión final de rama encontró cuatro Important de diseño, no de implementación:
  - el árbol clasificaba por el diff y no por el origen, así que un bug de CSS entraba por la rama visual;
  - la puerta compacta no decía «cambiar» un binding;
  - la subida a feature a mitad de patch no decía qué hacer con la carpeta y el id;
  - una salvedad del typo.

  Arreglarlos costó una tanda de RED/GREEN de 7 sujetos y una parada para subir el techo de la campaña.
- **Dónde en el kit**: `skills/sdd-start-feature/references/review-spec.md` §1 (tabla de señales).
- **Por qué el kit no lo evitó**: ninguna señal cubre «cambia a qué carril va una petición». El delta era solo `ADDED` en `routing` y no tocaba contrato, datos ni rol. Un predicado de enrutado es un contrato de hecho, porque todo proyecto con el hook lo consume, y su hueco típico es el caso frontera que cae en dos ramas.
- **Coste**: ~20 min de reloj, 1,59 $ en sujetos y una parada del dev-lead por el techo.
- **Propuesta**: una señal más en la rúbrica: «el delta cambia el enrutado (qué skill o carril recibe una petición)». Una lente de dominio que busque, para cada predicado nuevo, el caso frontera que lo cumple sin ser lo que se quería (un bug que cumple el predicado de un ajuste).
- **Criterio de aceptación**: GIVEN la spec de la 0098 tal como se aprobó · WHEN un sujeto aplica la rúbrica · THEN cuenta al menos una señal, propone un revisor, y ese revisor, o la lente, nombra el bug que se arregla solo en CSS.

### 2. La previsión de la campaña no reserva los arreglos de la revisión final

- **Qué pasó**: la previsión y el techo (26 sujetos, techo 32) cubrían RED y GREEN de las tasks. Los arreglos de la revisión final, que también son ediciones de skill y llevan RED/GREEN (Art. I), llevaban la campaña a 35 sujetos, y hubo que parar a subir el techo cuando el dinero iba a 8,33 $ de 22 $.
- **Dónde en el kit**: `.docs/sdd/constitution.md` Art. I, «La previsión cubre la campaña entera», y el paso 4 de `skills/sdd-start-feature/SKILL.md`, que no dice cómo se dimensiona.
- **Por qué el kit no lo evitó**: «la campaña entera» se lee como RED más GREEN de lo planificado. Nada dice que una revisión final con Important en texto de skill abre otra tanda.
- **Coste**: una parada del dev-lead a media validación.
- **Propuesta**: que la previsión declare una reserva para la pasada de fix (p. ej. 20 % de sujetos), y que el techo la incluya.
- **Criterio de aceptación**: GIVEN una spec de skill con una campaña de N sujetos · WHEN el hilo declara la previsión · THEN escribe el techo con la reserva de la pasada de fix, y una pasada de 7 sujetos sobre 28 no para por el techo.

### 3. El tope de palabras de `using-sdd` choca con «el paso lleva todas las condiciones que deciden»

- **Qué pasó**: la spec pedía el predicado entero en cada puerta, que es la regla de `architecture.md`, «Un paso que resume una regla… lleva todas las condiciones». `tests/UsingSdd.Tests.ps1` fija 450 palabras. Me enteré al ejecutar el Pester a mitad de la Task 1 y subí el tope dos veces (510 y 530), como ruling.
- **Dónde en el kit**: el paso 4 de `skills/sdd-start-feature/SKILL.md` (el repaso de coherencia busca dónde se implementa cada `MODIFIED`, pero no qué tests fijan el tamaño de los ficheros tocados) y `tests/UsingSdd.Tests.ps1`.
- **Por qué el kit no lo evitó**: el repaso de coherencia mira el texto y el código que lo aplica, no los tests que acotan esos ficheros.
- **Coste**: dos rulings con coste por sesión en todos los proyectos (~100 tokens) y una fila de deuda para podar con A/B.
- **Propuesta**: en el repaso de coherencia, para cada fichero del Scope, busca los tests que fijan su tamaño o su forma (`Should -BeLessOrEqual`, un recuento de palabras). Si el cambio los supera, ponlo en «Decisiones a validar» antes del gate.
- **Criterio de aceptación**: GIVEN una spec que añade ~60 palabras a `using-sdd` · WHEN el hilo hace el repaso de coherencia · THEN la spec declara en sus decisiones que supera el tope de `UsingSdd.Tests.ps1` y propone subirlo o recortar con A/B.

### 4. El lanzador de sujetos no tiene tope de reloj

- **Qué pasó**: el dev-lead aprobó la spec con la condición de que los sujetos no se encallaran. `lib.sh` tiene `MAX_TURNS`, pero no un tope de tiempo. Lo improvisé en el `subject.sh` y el primer intento (`timeout 720 command claude`) falló, porque `timeout` no ejecuta builtins: la tanda no arrancó.
- **Dónde en el kit**: `tests/headless/lib.sh` (`build_claude_args` y `subject_launch`).
- **Por qué el kit no lo evitó**: el lanzador de referencia no ofrece la variable, así que cada campaña se la inventa.
- **Coste**: una tanda perdida (0 $, ~3 min).
- **Propuesta**: `SUBJECT_TIMEOUT` en `lib.sh`, que envuelva `claude` por su ruta, con un test de `.args` como el de `SUPERPOWERS_DIR`.
- **Criterio de aceptación**: GIVEN `SUBJECT_TIMEOUT=5` y un `claude` falso que duerme 10 s · WHEN `subject_launch` corre · THEN sale a los 5 s y `run.sh` sigue con el siguiente escenario.

### 5. El gate de cierre sale rojo por tres tests `Slow` ajenos en la máquina del dev-lead

- **Qué pasó**: `Invoke-Pester -Path tests` dio 1022/3. Los 3 están en `Measure-SessionTokens.Tests.ps1`, en el bloque «sin -ProjectsRoot», y salen igual sobre `develop` limpio y sin `CLAUDE_CONFIG_DIR`. El pre-commit excluye `Slow` y no los ve.
- **Dónde en el kit**: `tests/Measure-SessionTokens.Tests.ps1`. Queda como fila de deuda en el roadmap.
- **Por qué el kit no lo evitó**: el test lee el `HOME` real, que en esta máquina tiene varias `~/.claude-*`.
- **Coste**: ~5 min en descartarlo, y se repite en cada cierre.
- **Propuesta**: aislar el test del `HOME` real (un `HOME` de fixture).
- **Criterio de aceptación**: GIVEN una máquina con `~/.claude` y `~/.claude-a` reales · WHEN corre `Measure-SessionTokens.Tests.ps1` · THEN pasa 24/24.

## Lo que hice por iniciativa propia

- Metí un ensayo `DRY_RUN=1` de cada escenario nuevo antes de gastar en sujetos: con él vi que el molde se construía bien (git propio, bug plantado, `playwright` copiado). Funcionó.
- Fijé `playwright` a la versión cuyo Chromium ya estaba en la caché, para que ningún sujeto descargara navegador. Funcionó: ningún sujeto llegó al tope.
- Aparté las salidas de un molde inválido como `-molde` en vez de borrarlas, y cuentan para el techo. Funcionó: la evidencia sigue ahí.
- Ante un fallo del gate, lo reproduje sobre `git archive develop` antes de darlo por ajeno. Funcionó, y es candidato a regla del paso 7.
- Miré las capturas antes de citarlas: así vi que un sujeto había sobrescrito la de otro.

## Funcionó, no tocar

- El RED con contra-escenarios. Sin c1 y c2 no se habría visto que la puerta trasera era la edición directa, y no el patch.
- Los topes de `run.sh` (`SUBJECT_CAP` y `COST_CAP`, que cuentan todas las fases) y el vigía sobre la salida de cada tanda.
- El Pester de literales en cada puerta: cazó al instante que renombrar el diamante rompía un test RED ya commiteado.
- La receta del paquete del revisor final (542 líneas y 77 KB sin la carpeta de la spec) y su «Cómo revisar»: el revisor tardó 4 min.

## Errores míos, no huecos del kit

- El molde de f2 llevaba la validación escrita en `patch.md`. El gate del paso 0 la rechazó con razón, y fueron 2 sujetos perdidos.
- Leí mal `f1-1` en el RED y di 0/2 capturas bien cuando era 1/2. Lo corregí antes del GREEN.
- El THEN de la spec dice «sin bindings» mientras las skills dicen «sin cambiar bindings», que es lo que pide la decisión 1. Queda así en `capabilities/routing.md`.
