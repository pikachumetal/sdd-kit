# Encargo de revisión — cabecera obligatoria

El encargo de **cada eje de la revisión final**, el de su **pasada de fix** en SDD y el de su **re-revisión** empiezan así, antes del encargo del eje ([`sdd-verify`](../SKILL.md), «Final review»). Los del revisor de task y del re-revisor ya la llevan dentro: [task-reviewer-prompt.md](../../sdd-implement/references/task-reviewer-prompt.md) y [re-review-prompt.md](../../sdd-implement/references/re-review-prompt.md) de `sdd-implement`.

```markdown
## Restricciones de código

<copia literal del bloque «De código» de las Restricciones globales de plan.md, artículo de calidad de código incluido; en modo lite, sin plan: el artículo de calidad de código de la constitution, literal>

Incumplir una de estas restricciones es **Important**, aunque la plantilla de abajo no lo mencione. Excepción: un umbral numérico superado en una unidad (una función de 21 líneas con un límite de 20, 4 parámetros con un límite de 3) es Minor; superado en más, Important.

Tests RED: modificarlos es cambiar una aserción, un nombre de test o un dato. El formato que exige el linter o el formateador del proyecto (una línea en blanco, la sangría) no es una modificación.

---

<el encargo del eje a partir de aquí>
```

Por qué así: las plantillas de superpowers solo tienen hueco para restricciones en la del revisor de task; las del revisor final y la re-revisión no lo tienen, y un revisor sin las restricciones aprueba lo que ellas prohíben (T7: comentarios que repetían el código). Medido en `tests/gates-reviews-green.md` (E3): con la instrucción en prosa el bloque llegó a 2 de 3 encargos; el revisor final se quedó sin él en 3 de 3 runs.

Solo viaja el bloque «De código». El de «De proceso» (política de modelos, modo de ejecución, atribución de commits) es para quien despacha: `task-reviewer-prompt.md` de superpowers reserva ese hueco a lo que exige la spec, «not process rules», y un revisor que las lee las audita. Con el bloque entero y «todo incumplimiento es Important», 2 de 2 revisores devolvieron «Needs fixes» sobre un diff correcto: por la línea en blanco que exigía el linter en un test RED, por una función de 21 líneas y por el modo de despacho (`tests/proportional-review-red.md`, R1).

## Revisor final

Cada eje se despacha con el tipo y el modelo de la tabla de «Final review» de `sdd-verify` —Spec y Arquitectura con `subagent_type: sdd-kit:effort-high` + `model: opus`, Código con `subagent_type: sdd-kit:effort-high` + `model: sonnet`—, también en Native, donde los despacha el hilo. Sin esta frase, 2 de 2 sujetos en Native lo despacharon con el modelo de los subagentes del plan y sin effort (`tests/native-adapt-red.md`). Como todo despacho, lleva su vigía de silencio, también en la re-revisión: [Vigía de silencio](../../sdd-start-feature/references/control-profiles.md#vigía-de-silencio).

Sale en segundo plano en cuanto existe el commit de la última task, y el hilo sigue trabajando y commiteando mientras revisa. Por eso los ejes no trabajan en el árbol del hilo, sino en un worktree desanclado en el sha que revisa, `review-<id>-<sha corto>`, junto a los demás worktrees del repo:

```bash
SHA=$(git rev-parse --short HEAD)
REVIEW_DIR="$(dirname "$(git rev-parse --show-toplevel)")/review-<id>-$SHA"
git worktree add --detach "$REVIEW_DIR" "$SHA"
```

La receta del paquete se ejecuta dentro de `$REVIEW_DIR`, y el encargo nombra ese directorio como el único en el que trabaja, con esta frase: «Revisas `<sha>` como si fuera el último commit: trabaja solo en `<REVIEW_DIR>`, y no mires ramas ni commits posteriores (`git log` sin `--all` ni nombres de rama)». Cuando han vuelto todos los ejes, el hilo lo retira con `git worktree remove "$REVIEW_DIR"`. La re-revisión de un tramo `<a>..<b>` se ancla igual, en `<b>`. Revisando un sha antiguo desde el árbol que avanza, 3 de 4 revisores vieron el commit que ya arreglaba el fallo (ticket de la feature 0027 de document-manager, §2); en el RED de la 0096, 2 de 2 hilos commitearon después del despacho (`tests/closing-off-critical-path-red.md`, c1).

El paquete lo prepara el hilo con esta receta, no con `sdd review package`, en los dos métodos. `sdd review package` corta el rango desde la base del arranque y no admite exclusiones: el revisor lee siempre la evidencia de las campañas y, si la rama integró la rama de integración, también el trabajo de otras features (9 MB frente a 179 KB en la feature 0070, 730 KB frente a 78 KB en la 0058). En Git Bash, con `<integración>` la rama de integración de la constitution (`develop` si no fija otra):

```bash
cd "$(git rev-parse --show-toplevel)"
MERGE_BASE=$(git merge-base HEAD <integración> $(git rev-parse -q --verify origin/<integración>))
EXCLUDE=(':(exclude,glob).docs/sdd/specs/**/red/**' ':(exclude,glob).docs/sdd/specs/**/green/**' ':(exclude,glob).docs/sdd/specs/<carpeta de la feature>/**')
WORKSPACE="$(sdd workspace "<plan>")"
OUT="$WORKSPACE/review-final-$(git rev-parse --short HEAD).diff"
{
  echo "# Review package: ${MERGE_BASE}..HEAD"; echo
  echo "## Commits"; git log --oneline "${MERGE_BASE}..HEAD"; echo
  echo "## Files changed"; git diff --stat "$MERGE_BASE" HEAD -- . "${EXCLUDE[@]}"; echo
  echo "## Ficheros borrados"; git diff --name-only --diff-filter=D "$MERGE_BASE" HEAD -- . "${EXCLUDE[@]}"; echo
  echo "## Diff"; git diff -U10 --diff-filter=d "$MERGE_BASE" HEAD -- . "${EXCLUDE[@]}"
} > "$OUT" && echo "$OUT"
```

El merge-base se calcula en el momento de la revisión, también si la rama integró la base a mitad: la base del arranque arrastra lo que trajo el merge. Con remoto, `git fetch` antes: si la rama integró `origin/<integración>` y la local está atrasada, la base local vuelve a traer lo de otras features; sin remoto, `rev-parse` no imprime nada y queda la local. Si las dos han divergido, git elige una sola base: sincronízalas antes. No uses `git diff <integración> HEAD`: si la rama de integración avanzó después del merge, mete al revés sus commits nuevos. En modo lite, sin plan, `<plan>` es `spec.md`. `<carpeta de la feature>` es el nombre de la carpeta de la spec en `.docs/sdd/specs/`: la spec y el plan le llegan al eje Spec por su ruta, en su encargo. Los ficheros borrados van solo por nombre. Con el cuerpo de los borrados y la carpeta de la feature dentro, el paquete de la feature 0000 de LegalRep pesó 235.524 bytes y el primer `Read` del revisor falló con `File content (28006 tokens) exceeds maximum allowed tokens (25000)` (su ticket de campo, §3). Si el tech-stack del proyecto declara otras carpetas de evidencia, añádelas a `EXCLUDE` con la misma forma. Sin la receta, 2 de 2 sujetos metieron en el paquete las 400 líneas de `red/out/` de la spec, y uno lo escribió dentro de la carpeta de la spec (`tests/final-review-package-red.md`).

Tras la cabecera y antes del encargo del eje:

```markdown
## Cómo revisar

Lee el paquete de review `<ruta del paquete que imprime la receta>` en tramos de 400 líneas con `offset` y `limit`: tiene los commits, el resumen, los ficheros borrados por nombre y el diff del resto de la rama, sin la carpeta de la spec. No rehagas el diff con git. No ejecutes la suite, el build ni el lint: la evidencia de tests la traen los informes de cada task, y la suite completa la ejecuta el hilo principal. Si crees que falta una verificación pesada, recomiéndala en tu informe.
```

Por qué: la plantilla del revisor de task de superpowers ya lo dice; la del final da los comandos de `git diff` y pregunta «All tests passing?» sin decir cómo. Con la cabecera sin esta sección, 2 de 2 revisores finales rehicieron el diff y ejecutaron suite y lint (`tests/proportional-review-red.md`, R2); en un proyecto del equipo, 27 minutos por revisor frente a los 7 de uno que solo lee el diff.

En el encargo del eje Spec, si el plan tiene `## Review Focus`, tras «Cómo revisar» va esta sección:

```markdown
## Review Focus

<copia literal de la sección `## Review Focus` del plan: todas sus líneas, enteras>

Comprueba cada línea a propósito: la entrada, el comportamiento esperado y el test o la verificación que la fija. Una línea sin test ni verificación nombrada, o cuyo código no da ese comportamiento, es un hallazgo.
```

Es lo que pedía `executing-plans` de superpowers («the plan's Review Focus section verbatim»), y no basta con remitir al plan: con la remisión («el plan tiene una sección Review Focus, compruébala»), 1 de 2 encargos en Opus salió sin sus líneas (`tests/plan-review-focus-red.md`).

## Encargo del implementador

Vive en [implementer-prompt.md](../../sdd-implement/references/implementer-prompt.md) de `sdd-implement`, con la misma sección «Restricciones de código» y, además, el contrato de los tests RED, la «Verificación» de la task y las reglas del implementador.
