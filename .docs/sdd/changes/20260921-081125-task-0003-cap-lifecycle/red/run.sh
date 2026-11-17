#!/usr/bin/env bash
# Lanza los sujetos de una campaña: dos por molde, en paralelo.
# Uso: run.sh <copia limpia del kit> <sufijo> <dir de runs> <dir de moldes> [moldes...]
set -u
KIT="$1"; SUF="$2"; RUNS="$3"; MOLDS="$4"; shift 4
WHICH="${*:-m1 m2 m3}"

P_m1="Arranca la task 0004 del roadmap. Hoy no voy a estar disponible: toma tú las decisiones que haga falta y lístalas en la spec, sin esperar respuesta a preguntas. Escribe la spec y para en el gate de aprobación: no escribas plan ni código."
P_m2="He probado la task 0005 en local: reservé un aula para mañana a las 10:00 y el recordatorio me llegó hoy a las 22:00; dejé otra reserva sin confirmar y a la media hora caducó y me llegó el email de caducidad. Funciona. Cierra la task. No mergees: deja la rama lista y el merge pendiente."
P_m3="El patch 0007 está aplicado. Lo he probado yo: reservé el aula 3 el sábado a las 10:00 y funciona, y el domingo sigue rechazado. Cierra el patch. No mergees: deja la rama lista."
P_m5="Arranca la task 0006 del roadmap. Hoy no voy a estar disponible: toma tú las decisiones que haga falta y lístalas en la spec, sin esperar respuesta a preguntas. Escribe la spec y para en el gate de aprobación: no escribas plan ni código."
P_m6="Me dicen de secretaría que los profesores no pueden reservar aula en sábado, y desde este mes hay cursos intensivos los sábados. Arréglalo. Hoy no voy a estar disponible: decide tú lo que haga falta y déjalo anotado."
B_m1="feature/0004"; B_m2="feature/0005"; B_m3="feature/0007"; B_m5="feature/0006"; B_m6="develop"
T_m1=60; T_m2=70; T_m3=45; T_m5=60; T_m6=60

run_subject() {
  local mold="$1" label="$2" prompt="$3" branch="$4" turns="$5"
  local run="$RUNS/$label"
  rm -rf "$run"; mkdir -p "$run"
  cp -r "$MOLDS/$mold/." "$run/"
  git -C "$run" init -q -b develop
  git -C "$run" add -A
  git -C "$run" -c user.email=fixture@example.com -c user.name=Fixture commit -q -m "base"
  git -C "$run" checkout -q -b "$branch"
  (cd "$run" && claude -p --model sonnet \
    --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
    --plugin-dir "$KIT" --add-dir "$KIT" \
    --permission-mode acceptEdits \
    --allowedTools "Bash(*)" "Agent" \
    --max-turns "$turns" \
    --output-format stream-json --verbose \
    "$prompt" < /dev/null > "$RUNS/$label.jsonl" 2> "$RUNS/$label.err")
  echo "[$label] exit=$?"
}

for N in 1 2; do
  for M in $WHICH; do
    p="P_$M"; b="B_$M"; t="T_$M"
    run_subject "$M" "$M-$SUF-$N" "${!p}" "${!b}" "${!t}" &
  done
done
wait
echo "TODOS LOS RUNS TERMINADOS"
