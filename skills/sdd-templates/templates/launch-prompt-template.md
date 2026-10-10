# Prompt de arranque — plantilla

> Lo dan `sdd-roadmap` (en su cierre, para la fila que va primero, y con «dame el prompt de la <id>») y `sdd-explore` (para un config, que no lleva fila). No se guarda: va en el chat, en el idioma del usuario, y quien lo pega en otro worktree arranca el cambio sin repetir la entrevista. Tras el prompt, termina con: «si prefieres hacerlo en esta sesión, di "arráncalo"».
>
> **Cómo se redacta** (lo lee un agente, no una persona):
>
> - En imperativo y en positivo: lo que tiene que hacer, no lo que debe evitar.
> - Cada decisión ya tomada, con su literal: «la opción se llama `--planta`», no «decidido el nombre».
> - Los requisitos, por ruta y sección: «`specs/<carpeta>/proposal.md`, §Reglas de negocio», sin copiarlos.
> - Nada que el agente lea solo del proyecto (la constitution, el stack, el código).
>
> Borra los bloques de ayuda (`>`) al redactar.

**<id> — <nombre de la fila o del cambio>**

> Sin id reservado (un config que sale de `sdd-explore`): solo `**<nombre>**`, sin «—».

Base: `<develop | main>`

> `develop` para todo lo que sale de la rama de integración (feature, patch, config): la de `merge.into` en `.docs/sdd/sdd-kit.json`, o la del git-flow de la constitution; `main` para un hotfix.

```text
<feature | hotfix>/<id>-<slug en inglés kebab-case>
```

> La rama y el worktree se llaman igual, y van solos en su bloque. Sin id: `<tipo>/<slug>`.

Carril: <config | patch | lite | feature | spike>

> El de la fila («Patch:» → patch) o el que pasó `sdd-explore`; sin ninguno, el que ves al leer la fila. Va también en la primera línea del prompt: quien lo pega en otro worktree pega solo el segundo bloque.

```text
Arranca <la <id> | este cambio> con sdd-propose, carril <carril>: <enunciado en una o dos frases, con los datos de la fila>.
Requisitos en <ruta>, <sección>[, y en la fila <id> del roadmap] | Requisitos: los de este prompt (un config sin fila ni propuesta).
Decisiones ya tomadas:
- <decisión con su literal>
Salda <fila de deuda y qué parte> | Nada que saldar.
Perfil <pair | delegate | unattended>. Al fusionar, <`sdd merge --push` | `sdd merge` | lo decide el dev-lead>.
```

> «Perfil»: el que dijo el dev-lead para este cambio o, si no, `control.profile` de `.docs/sdd/sdd-kit.json`. «Al fusionar»: `merge.*` de ese fichero (`push: true` → `` `sdd merge --push` ``); sin `merge`, o con `merge` sin `push`, «lo decide el dev-lead».

## Ejemplo

**0144 — Documentos y migración**

Base: `develop`

```text
feature/0144-docs-and-migration
```

Carril: feature

```text
Arranca la 0144 con sdd-propose, carril feature: la estructura nueva de documentos de la 3.0.0, sus plantillas y las rutas de la CLI.
Requisitos en .docs/sdd/specs/20261007-144256-proposal-0131-kit-rework/proposal.md, §Documentos, y en la fila 0144 del roadmap.
Decisiones ya tomadas:
- PRODUCT.md, ROADMAP.md y CHANGELOG.md van en la raíz; el resto, en .docs/sdd/ en minúsculas.
- tech-stack.md pasa a operations.md, sin versiones.
Salda la parte de §Testing de operations-template.md de la 0097.
Perfil delegate. Al fusionar, `sdd merge --push`.
```
