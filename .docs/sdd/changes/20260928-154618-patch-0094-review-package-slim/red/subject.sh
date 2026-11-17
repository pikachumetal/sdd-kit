#!/usr/bin/env bash
# Sujeto headless del patch 0094 (paquete del revisor final que Read no puede leer).
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   v1  rama que borra ficheros grandes (una spec de 500 líneas y cinco fixtures) y trae su spec y su plan:
#       el hilo genera el paquete con la receta de encargo-revision.md del kit y un revisor Sonnet lo lee
#       con la sección «Cómo revisar» del mismo kit. ¿Contiene el cuerpo de los borrados? ¿Algún Read
#       devuelve el error de 25.000 tokens? La green/ reutiliza este script.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
SC="$3"
case $SC in v1) ;; *) die "escenario desconocido: $SC" ;; esac
MOLD_NAME=legal
subject_init "$1" "$2" "$4" sdd-start-feature
FEATURE=20260928-100000-feature-0000-retire-legacy
SPEC=.docs/sdd/specs/$FEATURE
BRIEF="$KIT/skills/sdd-start-feature/references/encargo-revision.md"

lines() { for i in $(seq 1 "$2"); do printf -- "$1\n" "$i" "$i"; done; }

g init -q -b main; g config core.autocrlf false
lines '// app %d: función que valida la fila %d del expediente antes de guardarla en el registro' 200 | put src/app.js
lines 'LEGACY-LINE-%04d · Paso %d de la validación visual: capturar la pantalla, compararla con la referencia y anotar la diferencia en píxeles.' 500 | put docs/legacy-visual-spec.md
for f in 1 2 3 4 5; do lines '  { "fixture": "visual-%d", "pixels": [12, 44, 91, 3, 250, 18], "tolerance": 0.02, "id": %d },' 150 | put tests/fixtures/visual-$f.json; done
row() { printf '| %s | %s |\n' "$1" "$(printf 'Detalle largo de la fila de roadmap con su evidencia, su ticket y su decisión literal. %.0s' $(seq 1 30))"; }
{ echo "# Roadmap"; echo; echo "| Fila | Detalle |"; echo "| --- | --- |"; row "Gate visual"; row "Estimación"; row "Merge"; } | put .docs/sdd/roadmap.md
commit "feat: base del proyecto"
g checkout -q -b develop
g checkout -q -b feature/0000
lines 'Requisito %d: el gate visual se retira sin perder el criterio %d de la revisión de pantallas del expediente.' 250 | put $SPEC/spec.md
lines '- [ ] Paso %d del plan: retirar la pieza %d del gate visual y comprobar que la suite sigue en verde tras el cambio.' 350 | put $SPEC/plan.md
commit "docs(0000): abrir la feature 0000" "Spec aprobada y plan."
g rm -q docs/legacy-visual-spec.md tests/fixtures/visual-*.json
sed -i '20,50s/valida la fila/comprueba sin gate visual la fila/' "$R/src/app.js"
sed -i 's/^| Gate visual | Detalle largo/| Gate visual (retirado) | Detalle largo actualizado/' "$R/.docs/sdd/roadmap.md"
commit "feat(0000): retirar el gate visual" "Borra la spec visual y sus fixtures; la validación ya no captura pantallas."

# La receta del kit, con los huecos rellenos.
# El workspace va dentro del molde, como el de superpowers (.superpowers/sdd/): fuera del cwd, el Read
# del sujeto pedía un permiso que nadie concede.
printf '#!/usr/bin/env bash\nmkdir -p "%s/.superpowers/sdd/spec"; echo "%s/.superpowers/sdd/spec"\n' "$R" "$R" > "$RUN/sdd-workspace"
RECIPE=$(awk '/^## Revisor final/{s=1} /^## Encargo del implementador/{s=0} s' "$BRIEF" | awk '/^```bash/{b=1;next} /^```/{if(b)exit} b')
RECIPE=${RECIPE//<integración>/develop}
RECIPE=${RECIPE//<ruta de sdd-workspace>/$RUN/sdd-workspace}
RECIPE=${RECIPE//<PLAN_FILE>/$SPEC/spec.md}
RECIPE=${RECIPE//<carpeta de la feature>/$FEATURE}
PKG=$(cd "$R" && bash -c "$RECIPE") || die "la receta falló"
PKG_WIN=$(cygpath -w "$PKG")
HOW=$(awk '/^## Revisor final/{s=1} /^## Encargo del implementador/{s=0} s' "$BRIEF" | awk '/^```markdown/{b=1;next} /^```/{if(b)exit} b')
HOW=${HOW//<ruta del paquete que imprime la receta>/$PKG_WIN}

[ -n "${DRY:-}" ] && { echo "$RECIPE"; wc -c -l "$PKG"; exit 0; }

MAX_TURNS=${MAX_TURNS:-40}
ASK="$HOW

Eres el revisor final de la rama \`feature/0000\` frente a \`develop\`. Requisitos: \`$SPEC/spec.md\`. Revisa la rama y escribe tu informe (Strengths; Issues en Critical, Important y Minor; Assessment) en \`review-final.md\`, en la raíz del repo. No cambies nada más."
subject_launch "$ASK"
{
  echo "## Receta"; echo "$RECIPE"
  echo "## Paquete"; echo "bytes: $(wc -c < "$PKG") · líneas: $(wc -l < "$PKG")"
  echo "cuerpo de los borrados (LEGACY-LINE-): $(grep -c 'LEGACY-LINE-' "$PKG")"
  echo "sección «Ficheros borrados»: $(grep -c '^## Ficheros borrados' "$PKG")"
  echo "borrados por nombre: $(grep -cE '^(docs/legacy-visual-spec\.md|tests/fixtures/visual-[1-5]\.json)$' "$PKG")"
  echo "líneas de la carpeta de la spec: $(grep -c "^+Requisito\|^+- \[ \] Paso" "$PKG")"
  echo "tramo de 400 líneas más grande (bytes): $(awk '{ b[int((NR-1)/400)] += length($0) + 1 } END { m = 0; for (k in b) if (b[k] > m) m = b[k]; print m }' "$PKG")"
  echo "## Read con el error de 25.000 tokens"; grep -o 'exceeds maximum allowed tokens ([0-9]*)' "$JSONL" | sort | uniq -c
  echo "## Read del paquete"; grep -o '"name":"Read","input":{[^}]*}' "$JSONL"
} | subject_save
[ -f "$R/review-final.md" ] && subject_keep "$R/review-final.md" review-final.md
exit 0
