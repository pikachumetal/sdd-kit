# sdd-kit

24 skills para Claude Code que convierten «hazme esta feature» en un flujo con spec, plan, tests en rojo antes del código y un cierre que deja la documentación al día.

La idea es sencilla: **el resultado debería depender del proceso, no de con qué pie se levantó el agente esa mañana**. Dos sesiones con la misma tarea deberían producir los mismos artefactos, pasar por los mismos gates y dejar el mismo rastro.

## El problema que resuelve

Si trabajas con Claude Code en varios proyectos, seguramente has copiado las mismas instrucciones de un repo a otro. Y las copias derivan: rutas distintas, fraseos distintos, pasos que en un repo están y en otro no. Al final cada proyecto tiene su propia versión de «cómo trabajamos» y ninguna está al día.

Esto es la parte de proceso, la que es igual en todos los proyectos, empaquetada en un sitio y actualizable de una vez. Las skills técnicas de cada stack y las específicas de cada proyecto siguen viviendo en su repo; el kit no se mete ahí.

## Cómo se usa

Si ya tienes el kit instalado en tu proyecto, empieza por la [guía de uso](.docs/workflow/usage-guide.md): qué pedir, qué te pregunta el agente en cada parada, qué contestar y qué hacer cuando algo falla.

Se trabaja con tres verbos: **planificar** con `sdd-roadmap`, **hacer** con `sdd-propose`, `sdd-implement` y `sdd-archive`, y **entregar** con `sdd-end-release`. No hace falta nombrar las skills: le dices a Claude lo que quieres y él entra por la que toca.

```
> apunta en el roadmap el pago a plazos, no lo arranques
```

Planificar. `sdd-roadmap` reconoce qué le traes: algo grande (te entrevista y lo parte en features con una propuesta), algo concreto, los items que el PM creó en Azure DevOps o Jira, las notas de una reunión con el cliente, un cambio de orden o la siguiente release. Deja las filas en el roadmap con su id y su orden, te dice cuál va primero y no arranca nada.

```
> añade autenticación con magic link
```

Hacer. Arranca `sdd-propose`: una primera pregunta que confirma carril, modo y perfil, y una spec corta que empieza por las decisiones que ha tomado sin ti. Espera tu aprobación antes de tocar código. Con el perfil por defecto, escribe el plan y lo implementa sin pararte, en la propia sesión o, en los planes largos, por subagentes, con los tests escritos antes. Cuando termina la última task lanza la revisión final en segundo plano y, mientras tanto, verifica lo que se ve y prepara el cierre. Después te pregunta qué has probado, y `sdd-archive` escribe el walkthrough, actualiza el changelog, el roadmap y el registro de estimaciones y fusiona en `develop`.

```
> el contador de la home muestra un número de más
```

Un cambio pequeño con la solución ya fijada no necesita spec: un fallo reproducible, un ajuste o una retirada de presentación, o una petición que dice qué cambia. Va de `sdd-propose` a `sdd-implement`: un solo documento y un cierre corto con `sdd-archive`, la misma skill que cierra una feature. Si la solución la tendría que decidir el agente, es una feature.

```
> cierra la release
```

Entregar. `sdd-end-release` sella el changelog, escribe las notas de la versión si se entregan a alguien, colapsa el roadmap y te presenta el merge a `main` y el tag, que esperan tu confirmación.

```
> ¿por qué decidimos guardar los tokens en la tabla de sesiones?
```

Una pregunta no es trabajo. `sdd-explore` lee la documentación de anclaje y responde, sin crear carpetas ni ramas.

## Instalación

El kit se distribuye solo como plugin de Claude Code, y necesita [Node](https://nodejs.org) 22.18.0 o posterior en el `PATH` (ver [Dependencias](#dependencias)):

```text
/plugin marketplace add pikachumetal/sdd-kit
/plugin install sdd-kit@sdd-kit
/reload-plugins
```

El kit no necesita ningún otro plugin. Si usas [superpowers](https://github.com/obra/superpowers) por tu cuenta, puedes seguir teniéndolo.

Para que un compañero que clone tu proyecto tenga el kit sin ir a buscarlo, commitea en el `.claude/settings.json` del proyecto de dónde sale el marketplace (`extraKnownMarketplaces`), qué plugin activar (`enabledPlugins`) y la memoria automática desactivada (`autoMemoryEnabled`). Con solo `enabledPlugins`, el plugin aparece activado pero Claude Code no sabe de dónde sacarlo. `sdd-init` deja escrito este bloque entero, fusionado con lo que ya tenga el fichero.

`sdd-init` y la migración a v3.0.0 dejan además `.claude/hooks/sdd-kit-loaded.mjs` y su entrada en `hooks.UserPromptSubmit`: si una sesión arranca sin el kit cargado, ese hook avisa en el primer mensaje con la ruta de la versión que declara el proyecto. Va en el proyecto porque el hook del plugin no corre sin el plugin.

<!-- sdd-init: settings -->
```json
{
  "extraKnownMarketplaces": {
    "sdd-kit": {
      "source": { "source": "github", "repo": "pikachumetal/sdd-kit" },
      "autoUpdate": true
    }
  },
  "enabledPlugins": {
    "sdd-kit@sdd-kit": true
  },
  "autoMemoryEnabled": false
}
```

Si antes lo tenías apuntando a un clon local, `/plugin marketplace add` falla con `Cannot add marketplace "sdd-kit": its network source differs from the one declared for it in settings`. Cambia la fuente de `extraKnownMarketplaces.sdd-kit` a `github` en tu `~/.claude/settings.json` antes de añadirlo. Un mismo nombre de marketplace no admite dos fuentes: la de usuario y la de proyecto tienen que ser idénticas, `ref` incluido.

Fija también el modelo en tu `~/.claude/settings.json` (por ejemplo, `"model": "opus"`). Sin esa clave, una sesión puede arrancar en el modelo más caro, y el hilo principal se lleva cerca del 90 % del coste de una sesión. Antes de implementar un plan largo, el kit te ofrece bajar a Sonnet.

### Enrutado automático

La skill `using-sdd` dice por qué skill entra cada petición: una pregunta, algo grande o una reunión, una funcionalidad concreta, un fallo, el cierre de una entrega, tus preferencias o una edición sin más. Si la petición es vaga, hace una sola pregunta antes de elegir. Si el proyecto también tiene superpowers, pasa por delante de su `brainstorming`. El plugin trae un hook `SessionStart` que, solo en proyectos con `.docs/sdd/`, inyecta esa skill al empezar cada sesión, sin que tengas que tocar tu `CLAUDE.md`. Con una versión de Node anterior a la 22.18.0 el hook inyecta igual y añade un aviso; sin Node, Claude Code enseña el error del hook.

## Las skills

| Skill | Qué hace |
| --- | --- |
| `using-sdd` | La puerta de entrada: qué skill toca para lo que acabas de escribir. La inyecta el hook al empezar cada sesión. |
| `sdd-init` | Prepara un proyecto para trabajar con SDD, nuevo o con código: te entrevista, deduce del código lo que puede y escribe cada documento solo cuando lo apruebas, `CLAUDE.md` incluido. Si la sesión se corta, sigue donde lo dejaste. Un proyecto recién sacado de un template cuenta como nuevo. |
| `sdd-upgrade` | Pone el proyecto al día con el kit instalado: aplica en orden las migraciones pendientes, te pregunta antes de borrar o reestructurar nada y apunta la versión aplicada. El arranque de la sesión te la ofrece cuando hay migraciones pendientes. |
| `sdd-roadmap` | La puerta de entrada al roadmap: algo grande (con su propuesta), algo concreto, items del gestor, una reunión con el cliente, reordenar o preparar una release. Propone; decides tú. No arranca nada. |
| `sdd-propose` | La entrada de un cambio: lee el proyecto, clasifica el carril y escribe lo que va antes de implementar (spec y plan, o la apertura del patch). |
| `sdd-implement` | La puerta de la implementación: comprueba la base, elige el método (Native o con un subagente) e invoca su copia, que implementa el plan task a task. También lleva el carril corto del patch: un cambio con la solución ya fijada, un fallo determinista (causa raíz obligatoria; si no lo reproduce, para sin abrir nada), un ajuste o una retirada de presentación, o una petición cerrada, con su verificación y sin revisión final. La invoca `sdd-propose`. |
| `sdd-implement-native` | Implementa el plan task a task en la propia sesión, con los tests de la spec escritos antes, el registro que sobrevive a una compactación y la revisión final de rama con `sdd-verify`. La invoca `sdd-implement`; adaptada de `executing-plans` de superpowers (MIT). |
| `sdd-implement-subagent` | Implementa el plan task a task con un subagente por task y una revisión por task, con los tests de la spec escritos antes, el registro que sobrevive a una compactación y la revisión final de rama con `sdd-verify`. La invoca `sdd-implement`; adaptada de `subagent-driven-development` de superpowers (MIT). |
| `sdd-verify` | La evidencia antes de dar algo por hecho y la revisión final de rama: dos o tres revisores a la vez (spec, código con cinco libros de buen diseño y, si el plan cruza fronteras, arquitectura), una sola tanda de arreglos y una sola re-revisión. La invocan `sdd-implement-native`, `sdd-implement-subagent` y `sdd-archive`; adaptada de `verification-before-completion` y `requesting-code-review` de superpowers (MIT). |
| `sdd-tdd` | Primero el test, verlo fallar y luego el código: también con los tests en rojo que llegan ya escritos, que se ejecutan antes de tocar nada. La carga `sdd-implement-native`, y el subagente de `sdd-implement-subagent`; adaptada de `test-driven-development` de superpowers (MIT). |
| `sdd-debugging` | La causa raíz antes del arreglo: reproducir, comparar con lo que funciona, una hipótesis cada vez y un test en rojo antes del fix. La invoca `sdd-implement-native`; adaptada de `systematic-debugging` de superpowers (MIT). |
| `sdd-worktrees` | El sitio aislado donde se implementa: detecta el worktree que ya existe o crea uno, levanta el entorno de `environments.md` y pasa el gate del proyecto antes de empezar. La invocan `sdd-implement-native` y `sdd-implement-subagent`; adaptada de `using-git-worktrees` de superpowers (MIT). |
| `sdd-parallel-agents` | Varios agentes independientes a la vez, con su modelo y sin pasar del tope de agentes del proyecto. La invocan la review de spec con dos revisores y la revisión final de `sdd-verify`; adaptada de `dispatching-parallel-agents` de superpowers (MIT). |
| `sdd-archive` | El cierre de una feature o de un patch: validación, walkthrough o `patch.md`, aprendizajes, capacidades, ADR, changelog, roadmap y deuda, la base integrada con la suite y el merge con `sdd merge`; al final, qué falta si la pieza es parte de algo partido. |
| `sdd-end-release` | Corta la release: changelog sellado, notas para quien la va a usar y roadmap colapsado; el repaso de la deuda por causa y, si los pides, la estimación y los action items. El merge a `main` y el tag los confirmas tú. |
| `sdd-explore` | Preguntar, entender o pensar en voz alta con el contexto cargado, sin generar artefactos. |
| `sdd-config` | La configuración del kit: enseña la que hay y pregunta lo que falta, de una en una, también la tabla de precios para el coste de cada sesión y si los Minor de la revisión final se arreglan o se difieren. Lo del equipo va a `sdd-kit.json`; tus preferencias, a `sdd-kit.local.json`, que no va a git. |
| `sdd-grilling` | Cómo te pregunta el kit: mira primero, decide él lo que zanja un hecho y te pregunta lo que queda, de una en una, con la recomendada y su razón; lo tuyo, abierto y sin sugerencias, y lo que decide él, marcado como suyo. Qué cubre cada entrevista y cuándo para lo dice la skill que la invoca. Inspirada en `grilling` de Matt Pocock y `brainstorming` de superpowers (MIT). |
| `sdd-rubber-duck` | Cómo te explica el kit las cosas: en palabras del producto y con su glosario, sin rutas ni jerga. En corto, el párrafo 🦆 de una parada; en largo, a petición («explícame cómo viaja un pedido de punta a punta»), por pasos y siguiendo un ejemplo; y si no te ha llegado («no te he entendido»), te lo vuelve a contar con contexto y frases cortas. Adaptada de `teach` y `wait-what` de Matt Pocock (MIT). |
| `sdd-agent-writing` | Escribir y probar lo que lee un agente: una skill nueva («quiero una skill para las migraciones SQL»); editar una entra por `sdd-propose`. Adaptada de `writing-for-agents` de mattpocock/skills y `writing-skills` de superpowers (MIT). |
| `sdd-retro` | Mejora el entorno del proyecto: al cerrar una feature, arregla lo que costó en la sesión por la vía más barata; al cortar una release, agrupa la deuda por causa y propone. |
| `sdd-feedback` | El ticket de mejora del kit sobre esta sesión: lo ofrecen los cierres, o se pide a mano. |
| `add-to-changelog` | Entrada de changelog con formato fijo (Keep a Changelog). |
| `sdd-templates` | Las 24 plantillas canónicas. |

## Cómo está escrito

Ninguna skill se escribe a ojo. Antes de añadir una instrucción hay que demostrar que hace falta: se lanza un agente sin ella y se mira si falla (RED), y luego con ella y se mira si deja de fallar (GREEN). La evidencia de cada una está en [`tests/`](tests/).

Esto tiene una consecuencia que no esperaba cuando empecé: **más de la mitad de las veces el agente ya lo hacía bien sin que se lo dijeran**, y entonces la instrucción no se escribe. En la release 1.0.0 recortó el alcance nueve veces. Una skill corta que alguien lee entera vale más que una larga que se saltan.

Si quieres entender el flujo antes de instalar nada, en [`.docs/workflow/`](.docs/workflow/) están los cuatro documentos que lo explican: la [guía de uso](.docs/workflow/usage-guide.md) del día a día, el de [proyectos nuevos](.docs/workflow/greenfield.md), el de [codebases existentes](.docs/workflow/brownfield.md) y un [anexo](.docs/workflow/evidence-and-references.md) con la evidencia que lo sustenta, 25 fuentes verificadas una a una y etiquetadas según lo que valen.

El kit se usa a sí mismo. Sus features salen por `sdd-propose`, sus releases por `sdd-end-release`, y su propia documentación vive en [`.docs/sdd/`](.docs/sdd/). Si quieres ver cómo queda un proyecto que trabaja así, mira ahí: el [roadmap](ROADMAP.md), las [notas de cada versión](.docs/sdd/releases/) y los [tickets de campo](.docs/sdd/field-reports/) que escriben los agentes cuando algo les fricciona.

## Estado

La versión publicada es la 2.3.4 ([notas](.docs/sdd/releases/v2.3.4/release-notes.md)). El roadmap (`ROADMAP.md`, con Now, Next y Later) tiene una forma fija que se comprueba en cada cierre, un proyecto sin pantalla que probar puede validar en el uso y el carril patch lo decide quién fija la solución.

La [2.2.0](.docs/sdd/releases/v2.2.0/release-notes.md) trajo el cierre en paralelo con la revisión final, la verificación del frontend, los cierres simultáneos y los avisos de arranque. La [2.1.0](.docs/sdd/releases/v2.1.0/release-notes.md) trajo los retoques visuales por el carril patch y el vigía de agentes colgados. La [2.0.0](.docs/sdd/releases/v2.0.0/release-notes.md) trajo los tres verbos, la puerta del roadmap, el enrutado automático, menos paradas y la unidad de trabajo llamada feature.

Pruebo cada cambio con agentes de prueba y en este repositorio, pero la validación de verdad es el uso en proyectos del equipo. Lo que falle allí llega como ticket de `sdd-feedback` y entra en la versión siguiente.

Uso el kit a diario en proyectos propios y del trabajo, así que se mueve bastante.

## Actualizar un proyecto que ya lo usa

Tras actualizar el kit, la sesión te avisa al arrancar si el proyecto va por detrás de las migraciones del kit instalado, y te ofrece aplicarlas; también puedes pedir «actualízame al kit». La skill `sdd-upgrade` mira qué versión tienes aplicada en `.docs/sdd/sdd-kit.json`, ejecuta en orden las migraciones posteriores y escribe el marcador al terminar cada una. Los borrados y renombrados te los pregunta antes. Cada release del kit trae su migración, aunque no cambie nada del proyecto: entonces solo avanza el marcador.

## Desarrollo

Para probar el kit desde tu clon, arranca Claude Code con el plugin del working tree y el instalado deshabilitado:

```text
node start-kit-session.mjs
```

El script construye `dist/` desde tu working tree (`moon run kit:build` hace lo mismo), lanza `claude --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' --plugin-dir <raíz del clon>/dist` y pasa detrás los argumentos que le des (por ejemplo, `--model sonnet`).

No cambies la fuente del marketplace a tu clon: al volver a GitHub chocarías con el error de arriba.

Las herramientas del repo las fija `.prototools` (Node 26, pnpm y moon): `proto install` una vez, y `pnpm install` en cada worktree. La CLI `sdd` está en `cli/`, en TypeScript que Node ejecuta sin compilar. Los tests de la CLI y los de las skills (topes, enlaces, manifests) son Vitest. El pre-commit y `moon` corren sin PowerShell; solo lo usan dos piezas que lo necesitan en Windows: `cli/test/merge/failures.slow.test.ts`, para abrir un fichero en exclusiva, y `tests/headless/real-deps.mjs`, que lista los procesos de cada sujeto de una campaña real para pararlos al acabar.

```text
moon run cli:typecheck cli:test kit:roadmap
```

El hook de pre-commit ejecuta ese conjunto rápido y bloquea el commit si falla. `cli:test-slow` y `kit:test-headless` añaden los lentos. Se activa una vez por clon:

```bash
git config core.hooksPath .githooks
```

Git-flow: `main` estable, `develop` de integración, `feature/<id>` desde `develop`.

## Dependencias

| Dependencia | ¿Obligatoria? | Instalación |
| --- | --- | --- |
| [Node](https://nodejs.org) 22.18.0 o posterior | Sí | El hook de sesión y los verbos de la CLI `sdd` que usan las skills se ejecutan con él. Sin Node, Claude Code enseña el error del hook. Descarga o gestor de versiones (`proto`, `fnm`, `nvm`); `node --version` lo comprueba |
| [impeccable](https://www.npmjs.com/package/impeccable) | No, recomendada si el proyecto tiene interfaz | Sin instalar: `npx impeccable@<versión> detect <url> --viewport 390x844`. Necesita Chrome, Chromium o Edge |
| [Playwright](https://playwright.dev) | No, recomendada si el proyecto tiene interfaz | El MCP de Playwright o el paquete `playwright` en el proyecto |

Las init y la migración a v2.0.0 ponen `"autoMemoryEnabled": false` en `.claude/settings.json` del proyecto. La memoria automática de Claude Code se queda en una sola máquina, y el kit quiere lo aprendido en los docs, que van en git.

El kit invoca 0 skills de superpowers: ninguna. La lista sale de `grep -rhoE "superpowers:[a-z-]+" dist/skills/ | sort -u`, y un test la compara con esta frase para que no diverjan.

impeccable y Playwright son las herramientas con las que se probó la verificación de frontend del kit ([`tests/frontend-verification-green.md`](tests/frontend-verification-green.md)): el proyecto las declara en `## Frontend` de `.docs/sdd/steering/operations.md`, y el kit no las invoca por su nombre.

## Idioma

La documentación está en castellano porque es la lengua del equipo donde nació esto. Las skills se escriben en inglés, la primera `sdd-grilling`; las demás se traducen al reescribirlas, y todas hablan contigo en tu idioma. Los nombres de skill, los identificadores y todo lo que el kit fija a los proyectos van en inglés. Si alguien lo quiere en otro idioma, se puede hablar.

## Licencia

MIT, en [LICENSE](LICENSE). Úsalo, cópialo, modifícalo y redistribúyelo; lo único que pide es que la nota de copyright viaje con el código.

## Origen

Escribí esto para el equipo con el que trabajo y lo publico en mi cuenta personal por comodidad, para poder instalarlo en cualquier máquina sin copiar carpetas.

Si lo pruebas y algo te chirría, abre un issue. Los tickets de campo de `field-reports/` son justo eso, escritos por agentes, y han sido la mejor fuente de mejoras que he tenido hasta ahora.
