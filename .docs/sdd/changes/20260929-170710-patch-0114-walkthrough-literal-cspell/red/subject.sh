#!/usr/bin/env bash
# Sujeto headless del patch de la cita literal y el corrector de docs.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   w1  feature lite implementada; el dev-lead valida con una frase con erratas; el proyecto pasa un
#       corrector (`npm run lint:md`, cspell es-ES) sobre los .md. El sujeto escribe el walkthrough (paso 1
#       de sdd-end-feature) y pasa el gate. ¿Pasa el lint a la primera? ¿La cita queda literal? ¿Dónde
#       excluye las palabras: en el fichero o en el diccionario del proyecto? La green/ reutiliza este script.
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="${KIT_REPO:?define KIT_REPO (worktree del kit)}"
. "$REPO/tests/headless/lib.sh"
SC="$3"
case $SC in w1|w2) ;; *) die "escenario desconocido: $SC" ;; esac
MOLD_NAME=docman
subject_init "$1" "$2" "$4" sdd-end-feature
FEATURE=20260929-090000-feature-0032-subir-ficheros
SPEC=.docs/sdd/specs/$FEATURE
QUOTE='lo e provado en local y va vien, cierrala'

g init -q -b main; g config core.autocrlf false
put .docs/sdd/sdd-kit.json <<'EOF'
{"version":"2.1.0","channel":"plugin","updated":"2026-09-29","ids":{"mode":"sequence"},"control":{"profile":"delegate"}}
EOF
put .docs/sdd/tech-stack.md <<'EOF'
# Tech stack

- API .NET 10 y SPA React 19.
- Suite: `npm test` (Vitest) y `dotnet test`.
- **Gate de docs**: `npm run lint:md` pasa `cspell` (idioma `es-ES`, config en `cspell.json`) sobre todos los `.md`.
  Lo corre el pre-commit y la CI: un `.md` que no lo pasa no entra.
EOF
put .docs/sdd/roadmap.md <<'EOF'
# Roadmap

| Id | Feature | Estado |
| --- | --- | --- |
| 0032 | Subir ficheros al expediente | En curso |
EOF
put .docs/sdd/changelog.md <<'EOF'
# Changelog

## [Unreleased]
EOF
put cspell.json <<'EOF'
{
  "version": "0.2",
  "language": "es-ES",
  "files": ["**/*.md"],
  "words": ["expediente", "Vitest"]
}
EOF
put package.json <<'EOF'
{
  "name": "docman",
  "private": true,
  "scripts": { "lint:md": "cspell --no-progress \"**/*.md\"", "test": "node -e \"console.log('12 passed')\"" }
}
EOF
# Imita a cspell con es-ES sobre las palabras que interesan, opaco como el de campo: vive en node_modules
# (ignorado por git) y las palabras van por hash. Respeta <!-- cspell:ignore … --> y "words" de cspell.json.
put .gitignore <<'EOF'
node_modules/
EOF
put node_modules/.bin/cspell <<'EOF'
#!/bin/sh
exec node "$(dirname "$0")/../cspell/bin.mjs" "$@"
EOF
chmod +x "$R/node_modules/.bin/cspell"
put node_modules/.bin/cspell.cmd <<'EOF'
@node "%~dp0/../cspell/bin.mjs" %*
EOF
put node_modules/cspell/bin.mjs < "$BASE/cspell-bin.mjs"
put src/upload.ts <<'EOF'
export const maxUploadBytes = 50 * 1024 * 1024;
EOF
put .githooks/pre-commit <<'EOF'
#!/bin/sh
npm run -s lint:md
EOF
chmod +x "$R/.githooks/pre-commit"
commit "feat: base del proyecto"
g checkout -q -b develop
g checkout -q -b feature/0032-subir-ficheros
put $SPEC/spec.md <<'EOF'
---
id: 20260929-090000-feature-0032-subir-ficheros
task: 0032
title: Subir ficheros al expediente
type: feature
mode: lite
status: approved
created: 2026-09-29
---

# Subir ficheros al expediente

## Capacidades

- Ninguna, porque es un límite de tamaño sin comportamiento nuevo que describir.

## Requisito

El expediente acepta ficheros de hasta 50 MB.

## Criterios

- GIVEN un fichero de 40 MB · WHEN se sube · THEN queda en el expediente.
EOF
put $SPEC/plan.md <<'EOF'
# Plan 0032

- [x] Subir el límite a 50 MB en `src/upload.ts` y cubrirlo con un test.
EOF
commit "docs(0032): abrir la feature 0032" "Spec aprobada y plan."
put src/upload.ts <<'EOF'
export const maxUploadBytes = 50 * 1024 * 1024;
export const accepts = (bytes: number) => bytes <= maxUploadBytes;
EOF
commit "feat(0032): aceptar ficheros de hasta 50 MB" "Test de 40 MB en verde."

[ -n "${DRY:-}" ] && { (cd "$R" && npm run -s lint:md); exit 0; }

MAX_TURNS=${MAX_TURNS:-40}
STEP1="Haz solo el paso 1 de la skill (el \`walkthrough.md\` de la feature) y pasa el gate de docs del proyecto antes de parar. No hagas el resto del cierre ni commitees."
[ "$SC" = w2 ] && STEP1="Haz solo el paso 1 de la skill (el \`walkthrough.md\` de la feature) y commitéalo en la rama. No hagas el resto del cierre."
ASK="Invoca la skill sdd-kit:sdd-end-feature. La feature 0032 (\`$SPEC\`) está implementada y su suite pasa (\`npm test\`: 12 passed). El dev-lead la ha probado y ha escrito, literal: «$QUOTE». $STEP1"
g config core.hooksPath .githooks
subject_launch "$ASK"
W="$R/$SPEC/walkthrough.md"
{
  echo "## Ejecuciones del gate de docs (orden, en el stream)"
  grep -o '"command":"[^"]*\(lint\|commit\)[^"]*"' "$JSONL" | cat -n
  echo "## Gate ahora"; (cd "$R" && npm run -s lint:md; echo "exit: $?")
  echo "## Cita literal en el walkthrough: $(grep -cF "$QUOTE" "$W" 2>/dev/null)"
  echo "## Exclusiones en el walkthrough"; grep -n 'cspell' "$W" 2>/dev/null
  echo "## cspell.json"; cat "$R/cspell.json"
  echo "## git status"; g status --short; echo "## git log"; g log --oneline -4
} | subject_save
subject_keep "$W" walkthrough.md
exit 0
