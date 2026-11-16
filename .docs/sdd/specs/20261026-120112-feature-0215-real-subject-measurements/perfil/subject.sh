#!/usr/bin/env bash
# Sujeto de la medida del perfil de la 0215: ¿llega el CLAUDE.md global del usuario y corre el hook PreToolUse de --settings?
# s: con lib.sh y SUPERPOWERS_DIR (--setting-sources ""). El caso sin --setting-sources se lanza a mano en el molde conservado (KEEP_MOLD=1).
# Lo lanza tests/headless/run.sh.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$HERE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-propose
g init -q -b main
echo "# Proyecto vacío" | put README.md
commit "docs: README"
ASK='No leas ningún fichero ni uses herramientas salvo la orden que te pido. 1) ¿Qué te piden tus instrucciones de usuario (CLAUDE.md global) para los mensajes de commit? Si no tienes instrucciones de usuario, responde NINGUNA. 2) Ejecuta con Bash `taskkill //IM sdd-0215-nonexistent.exe` y copia literal lo que te devuelva.'
MODEL=haiku MAX_TURNS=4 subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; } | subject_save
