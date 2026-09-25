# sdd-kit

Once skills para Claude Code que convierten «hazme esta feature» en un flujo con spec, plan, tests en rojo antes del código y un cierre que deja la documentación al día.

La idea es sencilla: **el resultado debería depender del proceso, no de con qué pie se levantó el agente esa mañana**. Dos sesiones con la misma tarea deberían producir los mismos artefactos, pasar por los mismos gates y dejar el mismo rastro.

## El problema que resuelve

Si trabajas con Claude Code en varios proyectos, seguramente has copiado las mismas instrucciones de un repo a otro. Y las copias derivan: rutas distintas, fraseos distintos, pasos que en un repo están y en otro no. Al final cada proyecto tiene su propia versión de «cómo trabajamos» y ninguna está al día.

Esto es la parte de proceso, la que es igual en todos los proyectos, empaquetada en un sitio y actualizable de una vez. Las skills técnicas de cada stack y las específicas de cada proyecto siguen viviendo en su repo; el kit no se mete ahí.

## Cómo se usa

Le dices a Claude lo que quieres y él entra por el carril que toca:

```
> añade autenticación con magic link
```

Arranca `sdd-start-task`: te hace una entrevista, escribe una spec corta que empieza por las decisiones que ha tomado sin ti, y espera tu aprobación antes de tocar código. Luego el plan, otro gate, y la implementación en la propia sesión o, en los planes largos, por subagentes, con los tests escritos antes.

```
> el contador de la home muestra un número de más
```

Eso no necesita spec. Va por `sdd-start-patch`: causa raíz primero, un solo documento, cierre ligero.

```
> ¿por qué decidimos guardar los tokens en la tabla de sesiones?
```

Tampoco es trabajo. `sdd-consult` lee la documentación de anclaje y responde, sin crear carpetas ni ramas.

Cuando terminas, `sdd-end-task` escribe el walkthrough, vuelca los aprendizajes a los documentos vivos, actualiza el changelog y el registro de estimaciones, y te pregunta qué has probado antes de dar nada por cerrado.

## Instalación

Como plugin de Claude Code:

```text
/plugin marketplace add pikachumetal/sdd-kit
/plugin install sdd-kit@sdd-kit
/reload-plugins
```

Necesita [superpowers](https://github.com/obra/superpowers), que se resuelve solo porque el manifest lo declara. Si falta, Claude Code deshabilita el kit y te dice cómo instalarlo. Es ruidoso a propósito: prefiero un error claro a un flujo que se ejecuta a medias sin que nadie se entere.

Para que un compañero que clone tu proyecto tenga el kit sin ir a buscarlo, commitea las dos claves en el `.claude/settings.json` del proyecto: de dónde sale el marketplace y qué plugin activar. Con solo `enabledPlugins`, el plugin aparece activado pero Claude Code no sabe de dónde sacarlo.

```json
{
  "extraKnownMarketplaces": {
    "sdd-kit": {
      "source": { "source": "github", "repo": "pikachumetal/sdd-kit" }
    }
  },
  "enabledPlugins": {
    "sdd-kit@sdd-kit": true
  }
}
```

Si antes lo tenías apuntando a un clon local, `/plugin marketplace add` falla con `Cannot add marketplace "sdd-kit": its network source differs from the one declared for it in settings`. Cambia la fuente de `extraKnownMarketplaces.sdd-kit` a `github` en tu `~/.claude/settings.json` antes de añadirlo. Un mismo nombre de marketplace no admite dos fuentes: la de usuario y la de proyecto tienen que ser idénticas, `ref` incluido.

Si solo quieres una skill suelta, o usas otro agente:

```bash
npx skills add pikachumetal/sdd-kit -a claude-code            # todas
npx skills add pikachumetal/sdd-kit --skill sdd-start-task    # una
```

Este canal no instala los tipos de agente `agents/effort-*.md`: el plan escribe «effort: no disponible en este harness, hereda el de la sesión».

### Enrutado automático

El plugin trae un hook `SessionStart` que, solo en proyectos con `.docs/sdd/`, recuerda al agente que una petición de trabajo entra por `sdd-start-task` antes que por `brainstorming`, un bug pequeño por `sdd-start-patch` y una pregunta por `sdd-consult`. `npx skills add` no instala hooks: quien use ese canal recibe solo las frases de las `description`.

## Las skills

| Skill | Qué hace |
| --- | --- |
| `sdd-init-greenfield` | Arranca un proyecto nuevo. Te entrevista y escribe la documentación de anclaje; sin entrevista no escribe nada. |
| `sdd-init-brownfield` | Onboarding de un codebase que ya existe. Documenta el estado real, no el ideal, y cosecha el `CLAUDE.md` que ya tengas. |
| `sdd-roadmap` | La puerta de entrada al roadmap: algo grande (con su propuesta), algo concreto, items del gestor, una reunión con el cliente, reordenar o preparar una release. Propone; decides tú. No arranca nada. |
| `sdd-start-task` | El carril completo: contexto, spec, plan, tasks, con gate de aprobación en cada paso. |
| `sdd-end-task` | El cierre: walkthrough, aprendizajes a los documentos vivos, estimaciones, changelog, roadmap, rama. |
| `sdd-start-patch` | Carril corto para bugs deterministas de menos de media hora. Causa raíz obligatoria. |
| `sdd-end-patch` | Cierre del patch. El merge lo decides tú. |
| `sdd-end-release` | Corta la release: changelog sellado, notas para quien la va a usar y roadmap colapsado; la retro, si la pides. El tag lo confirmas tú. |
| `sdd-consult` | Preguntar, entender o pensar en voz alta con el contexto cargado, sin generar artefactos. |
| `sdd-config` | La configuración del kit: enseña la que hay y pregunta lo que falta, de una en una. Lo del equipo va a `sdd-kit.json`; tus preferencias, a `sdd-kit.local.json`, que no va a git. |
| `sdd-feedback` | El ticket de mejora del kit sobre esta sesión: lo ofrecen los cierres, o se pide a mano. |
| `add-to-changelog` | Entrada de changelog con formato fijo (Keep a Changelog). |
| `sdd-templates` | Las 21 plantillas canónicas y el script que regenera el registro de estimaciones. |

## Cómo está escrito

Ninguna skill se escribe a ojo. Antes de añadir una instrucción hay que demostrar que hace falta: se lanza un agente sin ella y se mira si falla (RED), y luego con ella y se mira si deja de fallar (GREEN). La evidencia de cada una está en [`tests/`](tests/).

Esto tiene una consecuencia que no esperaba cuando empecé: **más de la mitad de las veces el agente ya lo hacía bien sin que se lo dijeran**, y entonces la instrucción no se escribe. En la release 1.0.0 recortó el alcance nueve veces. Una skill corta que alguien lee entera vale más que una larga que se saltan.

Si quieres entender el flujo antes de instalar nada, en [`.docs/workflow/`](.docs/workflow/) están los tres documentos que lo explican: el de [proyectos nuevos](.docs/workflow/greenfield.md), el de [codebases existentes](.docs/workflow/brownfield.md) y un [anexo](.docs/workflow/evidence-and-references.md) con la evidencia que lo sustenta, 25 fuentes verificadas una a una y etiquetadas según lo que valen.

El kit se usa a sí mismo. Sus features salen por `sdd-start-task`, sus releases por el carril release, y su propia documentación vive en [`.docs/sdd/`](.docs/sdd/). Si quieres ver cómo queda un proyecto que trabaja así, mira ahí: el [roadmap](.docs/sdd/roadmap.md), las [actas de release](.docs/sdd/releases/) y los [tickets de campo](.docs/sdd/field-reports/) que escriben los agentes cuando algo les fricciona.

## Estado

La 1.1.0 está cerrada. La 1.2.0 está abierta con 16 tasks que salieron de siete tickets de campo: agentes que usaron el kit en proyectos reales y reportaron dónde se rompía. Lo que más pesa ahí es `capabilities/`, el fichero por capacidad donde vive el comportamiento del producto; hoy el agente no siempre la crea cuando toca.

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

Los tests validan la anatomía de las skills, los manifests y el script de estimación. Necesitas Pester 5 o superior y `pwsh` 7+:

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
| [`superpowers`](https://github.com/obra/superpowers) | Sí | Se resuelve sola con el plugin. Manual: `claude plugin install superpowers@claude-plugins-official` |
| `grilling` | No | `npx skills add mattpocock/skills --skill grilling` |

Las init y la migración a v1.2.0 ponen `"autoMemoryEnabled": false` en `.claude/settings.json` del proyecto. La memoria automática de Claude Code se queda en una sola máquina, y el kit quiere lo aprendido en los docs, que van en git.

El kit invoca 8 skills de superpowers: `brainstorming`, `writing-plans`, `subagent-driven-development`, `executing-plans`, `systematic-debugging`, `writing-skills`, `requesting-code-review` y `finishing-a-development-branch`. La lista sale de `grep -rhoE "superpowers:[a-z-]+" skills/ | sort -u`, y un test la compara con esta frase para que no diverjan. Versión validada: 6.4.1, revisada el 2026-09-24; en cada minor nuevo se vuelve a testar el mapeo antes de cerrar una release del kit.

`grilling` solo la usa el carril consult y es prescindible: sin ella el interrogatorio se hace igual, una pregunta cada vez. Lo comprobé con dos baselines en [`tests/sdd-consult-degradacion-red.md`](tests/sdd-consult-degradacion-red.md), y es la razón de que el kit no lleve instrucciones para ese caso.

## Idioma

El texto está en castellano porque es la lengua del equipo donde nació esto. Los nombres de skill, los identificadores y todo lo que el kit fija a los proyectos van en inglés. Si alguien lo quiere en otro idioma, se puede hablar.

## Licencia

MIT, en [LICENSE](LICENSE). Úsalo, cópialo, modifícalo y redistribúyelo; lo único que pide es que la nota de copyright viaje con el código.

## Origen

Escribí esto para el equipo con el que trabajo y lo publico en mi cuenta personal por comodidad, para poder instalarlo en cualquier máquina sin copiar carpetas.

Si lo pruebas y algo te chirría, abre un issue. Los tickets de campo de `field-reports/` son justo eso, escritos por agentes, y han sido la mejor fuente de mejoras que he tenido hasta ahora.
