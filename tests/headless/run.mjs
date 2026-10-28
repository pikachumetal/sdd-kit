// Lanzador de referencia de una campaña de sujetos headless: las campañas lo usan, no lo copian.
// Uso: SPEC_DIR=<carpeta de la spec> PHASE=<red|green|refactor|ab> SUBJECT_SH=<subject.sh de la campaña> \
//      KIT_DIR=<copia limpia del kit> RUNS_DIR=<carpeta en el scratchpad o en .temp/ del repo> SCENARIOS="p1 p2" SUBJECT=<n> \
//      SUBJECT_CAP=<sujetos> COST_CAP=<$> [SUBJECT_COST=<$>] [MAX_PARALLEL=<n>] node tests/headless/run.mjs
// SUBJECT_CAP y COST_CAP son los de la previsión de la spec y cuentan todas las fases de SPEC_DIR.
// Con DRY_RUN=1 las salidas van a RUNS_DIR/dry/<fase>/out y los techos cuentan solo las de RUNS_DIR/dry.
// Cada sujeto lanzado deja su PID en RUNS_DIR/live/<fase>.<etiqueta> (en seco, RUNS_DIR/dry/live/) mientras corre: con el proceso vivo está en curso,
// y si muere sin dejar <etiqueta>.tools.txt queda cortado y cuenta como sujeto y como SUBJECT_COST.
// Por escenario: espera mientras haya MAX_PARALLEL (5) sujetos en curso bajo RUNS_DIR, de esta fase o de otra; no lanza
// una etiqueta que ya tiene tools.txt en su fase o está en curso («ya existe <etiqueta>: sube SUBJECT»); y no lanza más
// si existe RUNS_DIR/stop («parada a petición»), si se llega a SUBJECT_CAP o si lo gastado más
// (en curso + 1) × SUBJECT_COST (COST_CAP / SUBJECT_CAP) pasa de COST_CAP.
// Cada sujeto: SUBJECT_SH <kit> <escenario>-<n> <escenario> <salida>, con node si es .mjs y con Git Bash si es .sh;
// KIT_DIR va en ruta absoluta, y sin cli/bin/sdd.js en la copia no lanza.
// Al acabar imprime el coste por carpeta de salida (red, green, green-premature…) y los cortados.
// El RED de un patch se lanza con SPEC_DIR en .temp/<id>/ del repo hasta que reproduce: el scratchpad pasa del tope
// de ruta de las salidas. Solo entonces se reserva el id y se copia red/ a la carpeta del patch.
import { CampaignError, readConfig, runCampaign } from './campaign.mjs';
import { realDeps } from './real-deps.mjs';

const deps = realDeps();
try {
  process.exitCode = await runCampaign(readConfig(process.env, process.cwd(), deps.fs), deps);
} catch (error) {
  if (!(error instanceof CampaignError)) throw error;
  console.error(error.message);
  process.exitCode = 1;
}
