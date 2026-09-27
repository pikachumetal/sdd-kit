# Evidencia GREEN — numeración de ids sin gestor de tickets (2026-09-20)

Verificación de la task [task-ids](../.docs/sdd/specs/20260920-202137-task-0001-task-ids/spec.md) (0001) contra el baseline de [task-ids-red.md](task-ids-red.md).

## Método

Mismo lanzamiento headless que el RED, con `--plugin-dir` y `--add-dir` apuntando a una copia limpia del kit **ya editado** (solo `skills/` y `.claude-plugin/`; sin `.docs/`, que filtraría esta spec al sujeto). Mismas peticiones, palabra por palabra.

La fixture cambia en un punto y solo uno: el proyecto ya está **migrado**, es decir, su `sdd-kit.json` declara `"ids": { "mode": "sequence" }` y su roadmap tiene columna de id con `0003` y `0004` reservados — que es exactamente lo que producen la entrevista de init y `migrations/v1.2.0.md`. El tercer escenario conserva la fixture del RED **sin tocar** para medir la no-regresión.

| | Petición | Fixture |
| --- | --- | --- |
| **G1** | la de E1 (arrancar la primera task de la release) | migrada, ids reservados en el roadmap |
| **G2** | la de E2 (partir la segunda task y arrancar la primera mitad) | migrada, ids reservados en el roadmap |
| **G3** | la de E1 | **la del RED**: `sdd-kit.json` v1.1.0 sin campo `ids` |

Verificación en disco: nombre de carpeta en `specs/`, `task:` y `parent:` del frontmatter, `git branch`, `git diff` del roadmap.

## Resultados

| | G1 | G2 | G3 (no-regresión) |
| --- | --- | --- | --- |
| Carpeta creada | `20260920-212336-task-0003-export-markdown` | `20260920-211940-task-0004-text-search-core` | `20260920-212023-task-0000-markdown-export` |
| `task:` del frontmatter | **`0003`** (el de su fila) | **`0004`** (el de su fila) | `0000` |
| Id de la mitad nueva | — | **`0005`**, el siguiente libre | — |
| Sufijo tipo `0006a` | — | no | — |
| Ramas | propuso `feature/0003`, no la creó | **`feature/0004` y `feature/0005` creadas** | propuso `feature/0000-…`, no la creó |
| Coste / turnos | 1,17 $ · 41 turnos | 2,10 $ · 61 turnos | 0,97 $ · 41 turnos |

### Cita del sujeto G2 (`spec.md`, decisión 1)

> «**La task 0004 original (L) se parte en dos.** 0004 conserva su id y su fila del roadmap y pasa a ser el núcleo (M); **la segunda mitad toma el siguiente id libre, 0005, con `parent: 0004`**. La rama `feature/0005` queda creada sin commits.»

Es la conducta que la spec pide, enunciada por el sujeto sin que nadie se lo sugiriera en la petición.

## Veredicto contra cada fallo del RED

| Fallo del RED | Estado en el GREEN | Evidencia |
| --- | --- | --- |
| El id de una task sin ticket es siempre `0000` | **Resuelto** | G1 y G2 usan el id reservado en su fila (`0003`, `0004`); 2/2 |
| Dos tasks sin ticket chocan en `feature/0000` | **Resuelto** | G2 creó `feature/0004` y `feature/0005`; G1 propuso `feature/0003`. Ninguna rama `feature/0000` en los escenarios migrados |
| La mitad de una task partida no recibe id propio | **Resuelto** | G2 asignó `0005` a la segunda mitad, con `parent: 0004` |
| Se usa un sufijo tipo `0006a` | **Resuelto** (ya no fallaba en el RED con sujetos; lo respaldaba la evidencia de campo) | 0/1 sufijos en G2 |
| El kit no tiene dónde declarar el modo | **Resuelto** | La fixture migrada lo declara en `sdd-kit.json` y las skills lo leen: G3, sin el campo, se comporta como antes |
| La prohibición «no inventar ids» dejaba al proyecto sin salida | **Resuelto** | G1 y G2 obtuvieron su id sin inventarlo: de la reserva del roadmap |
| Un proyecto no migrado cambia de conducta | **No hay regresión** | G3, con la fixture del RED intacta, vuelve a `0000` |

## Hueco de la propia guidance, con su REFACTOR

**G2 no añadió la fila de la task `0005` al roadmap** (`git diff` del roadmap vacío): dejó la relación en `parent:` y en la prosa de su spec. La guidance decía «`parent: <id>` en el frontmatter» sin nombrar el roadmap, así que el sujeto hizo lo que estaba escrito.

REFACTOR aplicado en `nombrado.md`: «Una task partida toma el **siguiente id libre**, con `parent: <id>` en el frontmatter **y su fila propia en el roadmap** — nunca un sufijo tipo `0006a`. Sin esa fila, la relación entre las dos mitades se pierde en cuanto se cierra la sesión.»

Sin re-verificación con sujeto nuevo: el cambio es una frase dentro del requisito que el GREEN ya validó, y su efecto es observable en el siguiente uso real del carril (queda anotado en el walkthrough).

## Hallazgos de la revisión final incorporados

La revisión final de rama (un revisor, Sonnet medium) devolvió cuatro hallazgos, todos aceptados. Dos afectan al comportamiento verificado aquí y llevaron caso de test propio:

1. **Ramas omitidas en silencio** cuando la raíz del proyecto no es la raíz de su repositorio (un proyecto dentro de un monorepo): la regla se conserva —leer las ramas del repositorio padre daría ids ajenos— pero ahora el script **avisa por salida de error** de que omite esa fuente. Caso nuevo: `avisa cuando omite las ramas porque el proyecto no es la raíz de su repositorio`.
2. **Carpetas históricas con sufijo** (`…-task-0006a-slug`) no contaban para el máximo, así que un proyecto con ese histórico podía reemitir el `0006`. El patrón acepta ahora un sufijo alfabético. Caso nuevo con fixture `legacy-suffix`: `cuenta el id de una carpeta con sufijo alfabético`.
3. El literal de `sdd-kit.json` en `sdd-init-brownfield/references/generacion.md` seguía sin `ids`, contradiciendo al propio `SKILL.md`. Corregido.
4. `sdd-start-patch` remitía a `nombrado.md` sin decir inline de dónde sale el id en `sequence`. Ahora lo dice.

## Hallazgo lateral, fuera del alcance de esta task

G1 y G3 **no crearon la rama** («`git switch -c` requiere aprobación y la sesión no es interactiva»), igual que E1 en el RED: es el mismo fallo del carril con dev-lead ausente que ya recoge el RED y que cubre la task 0008. En modo `sequence` no impide la numeración —el id sale de la fila del roadmap— pero sí deja sin reserva el arranque **sin** fila, donde la rama es la marca. Queda anotado.
