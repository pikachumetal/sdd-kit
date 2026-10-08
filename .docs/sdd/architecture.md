# Architecture — sdd-kit

## Estructura del repo

```text
/
├── CLAUDE.md                    (punteros + reglas de la sesión)
├── README.md                    (instalación y catálogo)
├── .claude-plugin/
│   ├── plugin.json              (manifest del plugin, versión)
│   └── marketplace.json         (marketplace self-hosted, source ".")
├── skills/
│   ├── using-sdd/SKILL.md          (puerta de entrada: la inyecta el hook SessionStart)
│   ├── sdd-init-greenfield/SKILL.md
│   ├── sdd-init-brownfield/SKILL.md
│   ├── sdd-start-feature/SKILL.md
│   ├── sdd-end-feature/SKILL.md
│   ├── sdd-start-patch/SKILL.md
│   ├── sdd-end-patch/SKILL.md
│   ├── sdd-roadmap/SKILL.md
│   ├── sdd-end-release/SKILL.md
│   ├── sdd-consult/SKILL.md
│   ├── sdd-config/SKILL.md
│   ├── sdd-feedback/SKILL.md
│   ├── add-to-changelog/SKILL.md
│   ├── sdd-grilling/SKILL.md      (en inglés, + NOTICE MIT: sub-skill de preguntas)
│   └── sdd-templates/           (SKILL.md índice + templates/*.md — fuente única, artefactos y documentos de anclaje)
├── cli/                         (la CLI `sdd`, TypeScript sin build: bin/, src/ por dominio, test/ con Vitest y fixtures/)
├── hooks/                       (hooks.json: SessionStart en forma exec, que ejecuta `sdd hook session-start` e inyecta skills/using-sdd/SKILL.md)
├── .claude/                     (settings.json del repo y hooks/Test-KitSessionSource.ps1: aviso de skills cargadas fuera de la rama)
├── tests/                       (evidencia RED/GREEN por skill + *.Tests.ps1, fixtures/, headless/ (lanzador de sujetos) y batteries/ (baterías por skill))
└── .docs/
    ├── workflow/                (documentación temprana del flujo: greenfield, brownfield, anexo de evidencia)
    └── sdd/                     (artefactos SDD del propio kit — dogfooding)
        ├── capabilities/           (verdad viva por capacidad: un fichero por sustantivo del dominio, fusionado desde el delta de cada spec)
        └── decisions/              (ADR: el porqué de cada regla, NNNN-<slug>.md, inmutables)
```

## Anatomía de una skill del kit

**Placeholders de una receta**: todo hueco de una plantilla o receta declara **su tipo con un ejemplo real del dominio del documento** ([walkthrough](specs/<carpeta>/walkthrough.md)), no solo su contenido semántico. Con <enlace> a secas, dos sujetos escribieron un enlace Markdown y dos la ruta suelta; con el tipo y el ejemplo, 2 de 2 (task 0018, 2026-09-22).

**Un paso que resume una regla de una referencia lleva todas las condiciones que deciden** (umbrales, qué entra y qué no); la referencia se queda con el porqué y el detalle. Un sujeto con el paso delante no siempre abre el enlace: en la feature 0085, con el umbral de «revisado en el hilo» resumido como «commit pequeño de solo docs», 1 de 2 sujetos revisó en el hilo un commit de 26 líneas; con el tamaño y `numstat` en el paso, 2 de 2. No es duplicar (Art. VIII): la plantilla sigue siendo una.

1. **Frontmatter**: `name` (inglés kebab) + `description` que SOLO describe cuándo usarla (nunca resume el workflow — los agentes seguirían la description y se saltarían el cuerpo). Opcionales en uso desde la task 0014: `argument-hint` en las skills de arranque y `user-invocable: false` en `sdd-templates`; descartados `paths` (oculta la `description` hasta tocar un fichero) y `disable-model-invocation`. `claude plugin validate --strict` los acepta; fuera de Claude Code no está verificado. **El `name` también enruta**: renombrar una skill obliga a volver a medir su enrutado, igual que editar su `description`. En la task 0062, con «el cliente ha cambiado la facturación, actualiza lo que haga falta», 2 de 2 sujetos que habían entrado por `sdd-start-feature` se pasaron solos a `sdd-plan`, y 0 de 1 a la misma skill renombrada `sdd-roadmap` hasta darle una salida explícita en el paso 2 de `sdd-start-feature`.
2. **Overview**: principio en 1-2 frases.
3. **Gates/checklist**: pasos numerados; los ⛔ marcan puntos de parada que requieren al usuario.
4. **Predicados**: los módulos opcionales se condicionan a ficheros observables, no a configuración — `estimation.md` (estimación y tiempo real), `changelog.md` (entrada al cerrar), `architecture.md` (se lee en el contexto), `capabilities/<capability>.md` (desde T5: verdad viva del comportamiento, fusionada desde el delta de cada spec al cerrar) y, desde T4, `environments.md` (entorno por worktree: `env:setup` tras crear el worktree, `env:clean` antes de borrarlo; el worktree en sí lo gestiona superpowers). Un predicado bien escrito no solo clasifica: **da forma al trabajo**. En el GREEN del modo lite, el agente acotó el alcance de la spec para dejar fuera un fichero de contrato público y así cumplir una de las condiciones — el predicado se usó como herramienta de diseño, no solo como filtro de entrada. Cuando el predicado habilita un atajo, quien lo activa es el usuario: **habilitar y activar son cosas distintas**, y esa separación es lo que impide que el agente se autoconceda el atajo. Un fichero de configuración que el agente debe leer se **nombra en la skill que lo lee**, con su ruta: en el RED de la task 0061, 2 de 2 sujetos aplicaron `sdd-kit.local.json` solo porque lo vieron al listar `.docs/sdd/`, y en otro worktree nada los habría llevado a buscarlo.
5. **Red flags + tabla de racionalizaciones**: construidas con las frases textuales de los baselines (solo skills de disciplina; las de forma usan receta/contrato).
6. **Ficheros auxiliares (`references/`)**: la unidad de descomposición de una skill es el fichero auxiliar, no otra skill, porque cada skill nueva suma su `description` a la lista cargada en todas las sesiones y añade un salto de invocación que el agente puede saltarse. Un bloque baja a `references/<tema>.md` solo si **(a)** aplica a un subconjunto de invocaciones, no a todas, y **(b)** se necesita después de decidir, no para decidir. Cumplir (a)+(b) lo hace *candidato*; quien decide es su prueba (Art. I). Se referencia con enlace relativo en el punto exacto del flujo, nunca con `@`, que fuerza la carga y quema contexto. El harness inyecta `Base directory for this skill` al invocar y **no** carga los auxiliares por su cuenta: lo que gobierna la decisión se queda en el `SKILL.md`. Medido en la task 0013: con la regla del destino que falta solo en `sdd-end-feature/references/aprendizajes-skills.md`, 0/2 sujetos leyeron el fichero; al subirla al paso 4 del `SKILL.md`, 3/3. Segunda medición en la task 0026: `overrides-superpowers.md`, que el paso 6 solo nombra al pie, no la abrió 1 de 2 sujetos, y los dos leyeron los auxiliares que el paso nombra donde se usan. Con un puntero en uno de esos (`encargo-revision.md`), 2/2.

## Anatomía de la evidencia (tests/)

- `<skill>-red.md`: qué hizo el baseline sin la skill, con racionalizaciones citadas y positivos que no requieren guidance.
- `<skill>-green.md`: mismos escenarios con la skill; veredicto contra cada fallo del RED. El GREEN también puede exhibir huecos de la PROPIA skill (una instrucción que contradice la constitution, un caso sin cubrir): el REFACTOR y su re-verificación se documentan en el mismo fichero.
- `<skill>-ab.md`: A/B de no-regresión, puntual ante una duda concreta (Art. I). Registra los cortes probados, los aceptados y **los descartados con su motivo** — el descarte es el dato caro: evita que la siguiente campaña repita el experimento.
- Las fixtures de las campañas de skills se construyen en el scratchpad de sesión; lo que se versiona, en la carpeta de la spec (`red/`, `green/`), es el molde, el `subject.sh` de la campaña (desde el patch 0076, sobre el lanzador de referencia de `tests/headless/`) y lo que produjo cada sujeto, para que la narrativa verificada de `tests/*.md` apunte a ficheros que se pueden abrir (desde la task 0002).
- `batteries/<skill>/`: la batería de regresión de la skill (`battery.md`, `subject.sh` y molde), que usan todas sus ediciones; método en `tech-stack.md`, «Baterías por skill».
- `cli/test/`: tests Vitest, un directorio por dominio de `cli/src/`; los que crean repos git o lanzan procesos van en `*.slow.test.ts`. Sus fixtures en `cli/test/fixtures/<tema>/` **sí se versionan**: son el contrato del formato que el verbo lee (líneas reales de walkthroughs y patches del kit y de Alybo, la salida literal del hook). Todo código que llame a git limpia `GIT_DIR` y compañía del entorno del hijo: dentro del pre-commit, git las exporta.
- **Un solo lenguaje para lo ejecutable** ([ADR 0011](decisions/0011-node-cli.md)): el código del kit es la CLI `sdd`, en TypeScript que Node ≥ 22.18.0 ejecuta sin compilar ni dependencias, y el hook es uno de sus verbos. Un proyecto consumidor solo necesita Node. proto, pnpm, moon y Vitest son del repo del kit: no viajan en el plugin.
- **Un verbo que lee un artefacto del kit se prueba contra su plantilla**: un test con la plantilla de `sdd-templates` calcada sin tocar y otro con la plantilla calcada y rellenada a medias (task 0070: el validador de capacidades pasó 24 tests y el GREEN, y rechazaba la cabecera de la propia `capability-template.md`).

## Documentos de `.docs/sdd/`

Cada documento es de estado, un artefacto de evento o una ADR (constitution, Art. XI), y tiene quien lo escribe, quien lo lee y una cota. Medidas del 2026-09-30, en palabras. Donde dice «sin cota», el documento crece con cada cierre y nada lo frena todavía.

| Documento | Tipo | Lo escribe | Lo lee | Cota |
| --- | --- | --- | --- | --- |
| `roadmap.md` | estado | `sdd-roadmap` y los cierres de feature, patch y release | los arranques, `sdd-roadmap` y los cierres | `sdd roadmap check`: solo las secciones de la plantilla, solo tablas, y las filas saldadas salen en el corte |
| `capabilities/<capability>.md` | estado | los cierres, al fusionar el delta de una spec | los arranques y `sdd-consult`, por el índice | la forma, con `sdd capability check`; **sin cota** de tamaño (`feature-flow`, 7.927 palabras y 71 requisitos): propuesta «documentos acotados» |
| `constitution.md` | estado | el dev-lead, por una feature | toda sesión que arranca una feature | tope de palabras (`WordBudget.Tests.ps1`) |
| `mission.md`, `architecture.md`, `estimation.md` | estado | el dev-lead y los cierres | toda sesión que arranca una feature | tope de palabras (`WordBudget.Tests.ps1`) |
| `tech-stack.md` | estado, hoy usado como diario | los cierres, con lo aprendido | toda sesión que arranca una feature | tope de palabras (`WordBudget.Tests.ps1`; no cabe en una lectura): un aprendizaje nuevo sustituye o condensa otro |
| `changelog.md` | diario por release | `add-to-changelog` y `sdd-end-release` | `sdd-end-release`, y las personas | solo se lee `[Unreleased]` y la última versión; se parte por versión mayor si pesa |
| `estimation-log.md` | generado | `sdd estimation log` | `writing-plans`, para estimar | una fila por cierre; nadie lo edita |
| `sdd-kit.json` | estado | `sdd-config`, las init y las migraciones | todas las skills | sus claves son las del catálogo de `sdd-config` |
| `decisions/NNNN-<slug>.md` | ADR | la feature que toma o sustituye la decisión | quien toca sus `rutas`, por el enlace de la constitution | inmutable: solo cambia `status` al sustituirse |
| `specs/<carpeta>/` | evento | el arranque y el cierre de cada feature, patch o propuesta | su propia sesión, y quien busca un porqué | una carpeta por evento; no se edita tras el cierre, salvo adendas fechadas |
| `field-reports/` | evento | `sdd-feedback`, copiado literal | el triaje del roadmap | un fichero por ticket; no se edita |
| `releases/vX.Y.Z/` | evento | `sdd-end-release` | las personas | una carpeta por release |
| `tests/*.md` (fuera de `.docs/`) | evento | la campaña RED/GREEN de cada edición de skill | la revisión final y quien reabre la regla | un fichero por campaña |

## Relación con los proyectos consumidores

El kit se instala (plugin de Claude Code); cada proyecto añade encima sus skills de nivel 2 (por stack) y nivel 3 (propias), y sus documentos de anclaje en `.docs/sdd/`. Las skills del kit leen el proyecto por predicados — el mismo kit sirve para un greenfield con TDD y un legacy sin tests sin tocar una línea.
