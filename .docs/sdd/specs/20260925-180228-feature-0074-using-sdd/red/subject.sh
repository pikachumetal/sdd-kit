#!/usr/bin/env bash
# Sujeto de la batería de puertas: una frase de dev, vaga y en castellano, sobre el molde de salas `molde-code`.
# Lo lanza tests/headless/run.sh con SUPERPOWERS_DIR: el sujeto no lleva el CLAUDE.md del dev-lead.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
. "$HERE/../../../../../tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-start-feature
MOLD="$REPO_ROOT/.docs/sdd/specs/20260921-162213-task-0014-auto-routing/red/molde-code"

case "$3" in
  i1) ASK="Quiero empezar a trabajar con SDD en este proyecto." ;;
  c1) ASK="Oye, ¿cómo está montado lo de cancelar reservas? No lo pillo." ;;
  r1) ASK="El cliente quiere un módulo de informes: ocupación por sala, exportar a Excel y un aviso semanal a los responsables. Ponte con ello." ;;
  r2) ASK="Te paso las notas de la reunión de hoy con el cliente: quieren reservas recurrentes, ver las salas libres por la tarde y quitar lo del correo. A ver qué hacemos." ;;
  r3) ASK="Me han asignado en Azure el 412 (exportar reservas a .ics) y el 415 (máximo 2 reservas por persona)." ;;
  r4) ASK="Lo de exportar a calendario tiene que ir antes que los avisos por correo." ;;
  r5) ASK="Apunta en el roadmap lo del filtro por sala, no lo arranques todavía." ;;
  f1) ASK="Mete un filtro por sala en el comando libres." ;;
  f2) ASK="Let's build a waitlist for when a room is full." ;;
  f3) ASK="Es una tontería: que al reservar se pueda poner una nota. Hazlo rápido." ;;
  p1) ASK="Si cancelo una reserva que no existe me dice «cancelada» igual." ;;
  e1) ASK="Ya está todo lo de esta versión: hay que cerrar la entrega y mandarle el correo al cliente." ;;
  s1) ASK="No me gusta que me pares tanto, quiero trabajar con menos preguntas." ;;
  d1) ASK="Hay que mejorar las reservas, que se quejan los usuarios." ;;
  t1) ASK="Corrige el typo «recervas» del README." ;;
  *) die "escenario desconocido: $3" ;;
esac

cp -r "$MOLD/." "$R/"
[ "$3" = i1 ] && rm -r "$R/.docs"
[ "$3" = t1 ] && echo 'Consulta las recervas libres con `libres <franja>`.' >> "$R/README.md"
g init -q -b main
commit "feat: base con cancelación de reservas"
g checkout -q -b develop

MAX_TURNS="${MAX_TURNS:-8}" subject_launch "$ASK"
{ echo "## petición"; echo "$ASK"; echo "## git status"; g status --short; echo "## git log"; g log --oneline --all; } | subject_save
