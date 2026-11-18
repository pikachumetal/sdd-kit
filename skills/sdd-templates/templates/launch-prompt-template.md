# Prompt de arranque — plantilla

> Lo dan `sdd-roadmap` (en su cierre, para la fila que va primero, y con «dame el prompt de la <id>») y `sdd-explore` (para un config, sin fila). No se guarda: va en el chat, en el idioma del usuario, y quien lo pega en otro worktree arranca sin repetir la entrevista.
>
> **Cómo se redacta** (lo lee un agente que no vio esta conversación), en prosa y con listas:
>
> - Cuenta lo que no encuentra mirando: cada decisión con su porqué y su origen. La constitution, el stack y el código los lee solo.
> - Quien lo recibe toma «Decisiones ya tomadas» como palabra del dev-lead y no pregunta. Ahí solo va lo seguro: lo que el dev-lead dijo o aceptó con un «sí» a una propuesta concreta; lo que consta en el roadmap, una propuesta y sus enmiendas, una spec aprobada, una ADR o la constitution; y lo que decidiste porque te lo delegó («decide tú», «elige tú»). Su origen va entre paréntesis: `dev-lead, <AAAA-MM-DD>: «<frase>»`, `<ruta o fila>` o `agente por delegación, <ruta, fila o AAAA-MM-DD>`.
> - Todo lo demás va a `Abierto:`, con tu propuesta: una idea tuya, una duda, lo que te pidió proponer o recomendar («propón tú», «recomiéndame») y aún no ha aceptado. En la duda, `Abierto:`. Su valor no sale en ningún otro sitio del prompt, tampoco en el título ni en el nombre: «subir el mínimo de Node», no «subir Node a 24». Sin nada abierto, la sección no va.
> - Si dos fuentes chocan, manda la enmienda más reciente y después la frase más reciente del dev-lead; lo que así no se resuelve va a `Abierto:` con las dos. Un hecho comprobado no es una decisión: va al alcance o a las lecturas.
> - En positivo: lo que tiene que hacer.
> - Lecturas por ruta y sección, sin copiarlas.
> - El criterio de hecho se comprueba mirando un resultado: un comando, un sujeto, un fichero.
>
> Borra los bloques de ayuda (`>`) al redactar.

### *<emoji del carril: 🩹 patch, ✨ feature, 🪶 lite, ⚙️ config, 🔬 spike> <id> — <nombre de la fila o del cambio>*
***Nombre:*** `<feature | hotfix>/<id>-<slug en inglés kebab-case>`  
***Base:*** `<develop | main>`  
***Carril:*** `<config | patch | lite | feature | spike>`

***Prompt***

```
Arranca <la <id> | este cambio> con sdd-propose, carril <carril>: <el problema y qué cambia, en una o dos frases>.

Alcance:
- <qué cambia, con su fichero>

Fuera de alcance:
- <qué no entra>: <fila que lo lleva>

Decisiones ya tomadas:
- <decisión>, porque <su porqué> (<origen>)

Abierto:
- <lo que no está claro>. Propuesta: <tu recomendación>

Antes de diseñar, lee:
- <ruta>, <sección>[, y la fila <id> del roadmap] | Sin lecturas: los requisitos son los de este prompt.

Salda <fila de deuda y qué parte> | Nada que saldar.

Está hecho cuando <criterio comprobable>.

Perfil <pair | delegate | unattended>. Al fusionar, <`sdd merge --push` | `sdd merge` | lo decide el dev-lead>.
```

*si prefieres hacerlo en esta sesión, di "arráncalo"*

> **Título**: sin id (un config de `sdd-explore`), solo el nombre. **Nombre**: rama y worktree se llaman igual; sin id, `<tipo>/<slug>`. Las dos primeras etiquetas acaban en dos espacios. **Base**: `develop` para lo que sale de la integración (`merge.into` de `.docs/sdd/sdd-kit.json`); `main` para un hotfix. **Carril**: el de la fila («Patch:» → patch) o el que pasó `sdd-explore`; sin ninguno, el que ves. **Bloque**: sin lenguaje, que el terminal lo pinta de azul. **Perfil**: el que dijo el dev-lead o `control.profile`. **Al fusionar**: `merge.push`; sin bloque `merge` completo (`into` y `noFf`), «lo decide el dev-lead».

## Ejemplo

### *✨ 0144 — Documentos y migración*
***Nombre:*** `feature/0144-docs-and-migration`  
***Base:*** `develop`  
***Carril:*** `feature`

***Prompt***

```
Arranca la 0144 con sdd-propose, carril feature: la estructura nueva de documentos de la 3.0.0 y las rutas de la CLI.

Alcance:
- skills/sdd-templates/templates/ y las rutas de cli/src/

Fuera de alcance:
- la migración de los proyectos: 0145

Decisiones ya tomadas:
- ROADMAP.md va en la raíz, porque lo lee quien no abre .docs/ (.docs/sdd/changes/20261007-144256-proposal-0131-kit-rework/proposal.md)

Abierto:
- Si debt.md vive en steering/ o junto a ROADMAP.md. Propuesta: en steering/, porque solo lo leen las skills.

Antes de diseñar, lee:
- .docs/sdd/changes/20261007-144256-proposal-0131-kit-rework/proposal.md, §Documentos

Salda la parte de §Testing de la 0097.

Está hecho cuando `sdd roadmap check` pasa con la estructura nueva.

Perfil delegate. Al fusionar, `sdd merge --push`.
```

*si prefieres hacerlo en esta sesión, di "arráncalo"*
