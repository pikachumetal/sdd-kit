# sdd-kit

Catorce skills para Claude Code que convierten «hazme esta feature» en un flujo con spec, plan, tests en rojo antes del código y un cierre que deja la documentación al día.

La idea es sencilla: **el resultado debería depender del proceso, no de con qué pie se levantó el agente esa mañana**. Dos sesiones con la misma tarea deberían producir los mismos artefactos, pasar por los mismos gates y dejar el mismo rastro.

## El problema que resuelve

Si trabajas con Claude Code en varios proyectos, seguramente has copiado las mismas instrucciones de un repo a otro. Y las copias derivan: rutas distintas, fraseos distintos, pasos que en un repo están y en otro no. Al final cada proyecto tiene su propia versión de «cómo trabajamos» y ninguna está al día.

Esto es la parte de proceso, la que es igual en todos los proyectos, empaquetada en un sitio y actualizable de una vez. Las skills técnicas de cada stack y las específicas de cada proyecto siguen viviendo en su repo; el kit no se mete ahí.

## Cómo se usa

Si ya tienes el kit instalado en tu proyecto, empieza por la [guía de uso](.docs/workflow/usage-guide.md): qué pedir, qué te pregunta el agente en cada parada, qué contestar y qué hacer cuando algo falla.

Se trabaja con tres verbos: **planificar** con `sdd-roadmap`, **hacer** con `sdd-start-feature` o `sdd-start-patch` y **entregar** con `sdd-end-release`. No hace falta nombrar las skills: le dices a Claude lo que quieres y él entra por la que toca.

```
> apunta en el roadmap el pago a plazos, no lo arranques
```

Planificar. `sdd-roadmap` reconoce qué le traes: algo grande (te entrevista y lo parte en features con una propuesta), algo concreto, los items que el PM creó en Azure DevOps o Jira, las notas de una reunión con el cliente, un cambio de orden o la siguiente release. Deja las filas en el roadmap con su id y su orden, te dice cuál va primero y no arranca nada.

```
> añade autenticación con magic link
```

Hacer. Arranca `sdd-start-feature`: una primera pregunta que confirma carril, modo y perfil, y una spec corta que empieza por las decisiones que ha tomado sin ti. Espera tu aprobación antes de tocar código. Con el perfil por defecto, escribe el plan y lo implementa sin pararte, en la propia sesión o, en los planes largos, por subagentes, con los tests escritos antes. Al final te pregunta qué has probado, y `sdd-end-feature` escribe el walkthrough, actualiza el changelog, el roadmap y el registro de estimaciones y fusiona en `develop`.

```
> el contador de la home muestra un número de más
```

Un fallo pequeño y reproducible no necesita spec. Va por `sdd-start-patch`: causa raíz primero, un solo documento y un cierre corto con `sdd-end-patch`.

```
> cierra la release
```

Entregar. `sdd-end-release` sella el changelog, escribe las notas de la versión si se entregan a alguien, colapsa el roadmap y te presenta el merge a `main` y el tag, que esperan tu confirmación.

```
> ¿por qué decidimos guardar los tokens en la tabla de sesiones?
```

Una pregunta no es trabajo. `sdd-consult` lee la documentación de anclaje y responde, sin crear carpetas ni ramas.

## Instalación

Como plugin de Claude Code:

```text
/plugin marketplace add obra/superpowers-marketplace
/plugin marketplace add pikachumetal/sdd-kit
/plugin install superpowers@superpowers-marketplace
/plugin install sdd-kit@sdd-kit
/reload-plugins
```

El kit necesita [superpowers](https://github.com/obra/superpowers), que se instala desde `superpowers-marketplace`, el marketplace de su autor. Añade los dos marketplaces e instala superpowers antes que el kit, en ese orden. El manifest del kit declara la dependencia: si falta superpowers, Claude Code deshabilita el kit y te dice cómo instalarlo. Es ruidoso a propósito: prefiero un error claro a un flujo que se ejecuta a medias sin que nadie se entere.

El kit no usa `claude-plugins-official`: ese marketplace fija superpowers a un commit y llega tarde a las versiones nuevas. Si tenías `superpowers@claude-plugins-official`, desinstálalo con `claude plugin uninstall superpowers@claude-plugins-official`; con los dos, las skills de superpowers salen duplicadas.

Para que un compañero que clone tu proyecto tenga el kit sin ir a buscarlo, commitea en el `.claude/settings.json` del proyecto de dónde salen los dos marketplaces (`extraKnownMarketplaces`), qué plugins activar (`enabledPlugins`: el kit y superpowers) y la memoria automática desactivada (`autoMemoryEnabled`). Con solo `enabledPlugins`, los plugins aparecen activados pero Claude Code no sabe de dónde sacarlos. Las init y la migración a v2.0.0 escriben `autoMemoryEnabled` y el marketplace de superpowers; el marketplace del kit y `enabledPlugins` los añades tú.

```json
{
  "extraKnownMarketplaces": {
    "sdd-kit": {
      "source": { "source": "github", "repo": "pikachumetal/sdd-kit" }
    },
    "superpowers-marketplace": {
      "source": { "source": "github", "repo": "obra/superpowers-marketplace" }
    }
  },
  "enabledPlugins": {
    "sdd-kit@sdd-kit": true,
    "superpowers@superpowers-marketplace": true
  },
  "autoMemoryEnabled": false
}
```

Si antes lo tenías apuntando a un clon local, `/plugin marketplace add` falla con `Cannot add marketplace "sdd-kit": its network source differs from the one declared for it in settings`. Cambia la fuente de `extraKnownMarketplaces.sdd-kit` a `github` en tu `~/.claude/settings.json` antes de añadirlo. Un mismo nombre de marketplace no admite dos fuentes: la de usuario y la de proyecto tienen que ser idénticas, `ref` incluido.

Fija también el modelo en tu `~/.claude/settings.json` (por ejemplo, `"model": "opus"`). Sin esa clave, una sesión puede arrancar en el modelo más caro, y el hilo principal se lleva cerca del 90 % del coste de una sesión. Antes de implementar un plan largo, el kit te ofrece bajar a Sonnet.

Si solo quieres una skill suelta, o usas otro agente:

```bash
npx skills add pikachumetal/sdd-kit -a claude-code            # todas
npx skills add pikachumetal/sdd-kit --skill sdd-start-feature    # una
```

Este canal no instala los tipos de agente `agents/effort-*.md`: el plan escribe «effort: no disponible en este harness, hereda el de la sesión».

### Enrutado automático

La skill `using-sdd` dice por qué skill entra cada petición: una pregunta, algo grande o una reunión, una funcionalidad concreta, un fallo, el cierre de una entrega, tus preferencias o una edición sin más. Si la petición es vaga, hace una sola pregunta antes de elegir. En un proyecto SDD pasa por delante de `brainstorming` de superpowers. El plugin trae un hook `SessionStart` que, solo en proyectos con `.docs/sdd/`, inyecta esa skill al empezar cada sesión, sin que tengas que tocar tu `CLAUDE.md`. `npx skills add` no instala hooks: quien use ese canal recibe la `description` de `using-sdd` y las del resto.

## Las skills

| Skill | Qué hace |
| --- | --- |
| `using-sdd` | La puerta de entrada: qué skill toca para lo que acabas de escribir. La inyecta el hook al empezar cada sesión. |
| `sdd-init-greenfield` | Arranca un proyecto nuevo. Te entrevista y escribe la documentación de anclaje; sin entrevista no escribe nada. |
| `sdd-init-brownfield` | Onboarding de un codebase que ya existe. Documenta el estado real, no el ideal, y cosecha el `CLAUDE.md` que ya tengas. |
| `sdd-roadmap` | La puerta de entrada al roadmap: algo grande (con su propuesta), algo concreto, items del gestor, una reunión con el cliente, reordenar o preparar una release. Propone; decides tú. No arranca nada. |
| `sdd-start-feature` | El carril completo: contexto, spec, plan, tasks y validación. Dónde te para lo decide el perfil: con `delegate`, el de por defecto, en la spec, en los desvíos y en la validación final. |
| `sdd-end-feature` | El cierre: walkthrough, aprendizajes a los documentos vivos, capacidades, estimaciones, changelog, roadmap y merge a `develop` según la política del proyecto. |
| `sdd-start-patch` | Carril corto para bugs deterministas de menos de media hora. Causa raíz obligatoria; si no reproduce el fallo, para sin abrir nada. |
| `sdd-end-patch` | Cierre del patch: validación, `patch.md`, changelog, roadmap y merge a `develop` según la política del proyecto. |
| `sdd-end-release` | Corta la release: changelog sellado, notas para quien la va a usar y roadmap colapsado; la retro, si la pides. El merge a `main` y el tag los confirmas tú. |
| `sdd-consult` | Preguntar, entender o pensar en voz alta con el contexto cargado, sin generar artefactos. |
| `sdd-config` | La configuración del kit: enseña la que hay y pregunta lo que falta, de una en una. Lo del equipo va a `sdd-kit.json`; tus preferencias, a `sdd-kit.local.json`, que no va a git. |
| `sdd-feedback` | El ticket de mejora del kit sobre esta sesión: lo ofrecen los cierres, o se pide a mano. |
| `add-to-changelog` | Entrada de changelog con formato fijo (Keep a Changelog). |
| `sdd-templates` | Las 21 plantillas canónicas y el script que regenera el registro de estimaciones. |

## Cómo está escrito

Ninguna skill se escribe a ojo. Antes de añadir una instrucción hay que demostrar que hace falta: se lanza un agente sin ella y se mira si falla (RED), y luego con ella y se mira si deja de fallar (GREEN). La evidencia de cada una está en [`tests/`](tests/).

Esto tiene una consecuencia que no esperaba cuando empecé: **más de la mitad de las veces el agente ya lo hacía bien sin que se lo dijeran**, y entonces la instrucción no se escribe. En la release 1.0.0 recortó el alcance nueve veces. Una skill corta que alguien lee entera vale más que una larga que se saltan.

Si quieres entender el flujo antes de instalar nada, en [`.docs/workflow/`](.docs/workflow/) están los cuatro documentos que lo explican: la [guía de uso](.docs/workflow/usage-guide.md) del día a día, el de [proyectos nuevos](.docs/workflow/greenfield.md), el de [codebases existentes](.docs/workflow/brownfield.md) y un [anexo](.docs/workflow/evidence-and-references.md) con la evidencia que lo sustenta, 25 fuentes verificadas una a una y etiquetadas según lo que valen.

El kit se usa a sí mismo. Sus features salen por `sdd-start-feature`, sus releases por `sdd-end-release`, y su propia documentación vive en [`.docs/sdd/`](.docs/sdd/). Si quieres ver cómo queda un proyecto que trabaja así, mira ahí: el [roadmap](.docs/sdd/roadmap.md), las [notas de cada versión](.docs/sdd/releases/) y los [tickets de campo](.docs/sdd/field-reports/) que escriben los agentes cuando algo les fricciona.

## Estado

La 2.0.0 está publicada ([notas de la versión](.docs/sdd/releases/v2.0.0/release-notes.md)). Salió de los tickets de campo de la 1.1.0 y trae los tres verbos, la puerta del roadmap, el enrutado automático, menos paradas y la unidad de trabajo llamada feature. Casi todo se ha probado con agentes de prueba y en este repositorio; la validación de verdad es el uso en proyectos del equipo, y lo que falle llega como ticket de `sdd-feedback` a una 2.0.x.

Uso el kit a diario en proyectos propios y del trabajo, así que se mueve bastante.

## Actualizar un proyecto que ya lo usa

Tras actualizar el kit, pide en el proyecto: «Ponme el proyecto al día con `sdd-init-brownfield`». La skill mira qué versión tienes aplicada en `.docs/sdd/sdd-kit.json`, ejecuta en orden las migraciones posteriores y escribe el marcador al terminar. Los borrados y renombrados te los pregunta antes.

## Desarrollo

Para probar el kit desde tu clon, arranca Claude Code con el plugin del working tree y el instalado deshabilitado:

```powershell
./Start-KitSession.ps1
```

El script lanza `claude --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' --plugin-dir <raíz del clon>` y pasa detrás los argumentos que le des (por ejemplo, `--model sonnet`).

No cambies la fuente del marketplace a tu clon: al volver a GitHub chocarías con el error de arriba.

Los tests validan la anatomía de las skills, los manifests y los scripts del kit. Necesitas Pester 5 o superior y `pwsh` 7+, y lánzalos desde PowerShell: desde Git Bash, tres tests fallan por la página de códigos de la consola.

```powershell
pwsh -NoProfile -Command "Invoke-Pester -Path tests -Output Detailed"
```

El hook de pre-commit los ejecuta, salvo los marcados con `-Tag 'Slow'`, y bloquea el commit si fallan. El comando de arriba los ejecuta todos. Se activa una vez por clon:

```bash
git config core.hooksPath .githooks
```

Git-flow: `main` estable, `develop` de integración, `feature/<id>` desde `develop`.

## Dependencias

| Dependencia | ¿Obligatoria? | Instalación |
| --- | --- | --- |
| [`superpowers`](https://github.com/obra/superpowers) | Sí | Antes que el kit (ver [Instalación](#instalación)). Desde la terminal: `claude plugin marketplace add obra/superpowers-marketplace` y `claude plugin install superpowers@superpowers-marketplace` |
| `grilling` | No | `npx skills add mattpocock/skills --skill grilling` |

Las init y la migración a v2.0.0 ponen `"autoMemoryEnabled": false` en `.claude/settings.json` del proyecto. La memoria automática de Claude Code se queda en una sola máquina, y el kit quiere lo aprendido en los docs, que van en git.

El kit invoca 8 skills de superpowers: `brainstorming`, `writing-plans`, `subagent-driven-development`, `executing-plans`, `systematic-debugging`, `writing-skills`, `requesting-code-review` y `finishing-a-development-branch`. La lista sale de `grep -rhoE "superpowers:[a-z-]+" skills/ | sort -u`, y un test la compara con esta frase para que no diverjan. Versión validada: 6.4.2, revisada el 2026-09-27; en cada minor nuevo se vuelve a testar el mapeo antes de cerrar una release del kit.

`grilling` solo la usa el carril consult y es prescindible: sin ella el interrogatorio se hace igual, una pregunta cada vez. Lo comprobé con dos baselines en [`tests/sdd-consult-degradacion-red.md`](tests/sdd-consult-degradacion-red.md), y es la razón de que el kit no lleve instrucciones para ese caso.

## Idioma

El texto está en castellano porque es la lengua del equipo donde nació esto. Los nombres de skill, los identificadores y todo lo que el kit fija a los proyectos van en inglés. Si alguien lo quiere en otro idioma, se puede hablar.

## Licencia

MIT, en [LICENSE](LICENSE). Úsalo, cópialo, modifícalo y redistribúyelo; lo único que pide es que la nota de copyright viaje con el código.

## Origen

Escribí esto para el equipo con el que trabajo y lo publico en mi cuenta personal por comodidad, para poder instalarlo en cualquier máquina sin copiar carpetas.

Si lo pruebas y algo te chirría, abre un issue. Los tickets de campo de `field-reports/` son justo eso, escritos por agentes, y han sido la mejor fuente de mejoras que he tenido hasta ahora.
