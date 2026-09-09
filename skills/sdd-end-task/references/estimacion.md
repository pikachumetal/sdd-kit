# Tiempo real y estimation-log — detalle

## Paso 2 — Tiempo real

2. **Tiempo real** *(si existe `.docs/sdd/estimation.md`)* — estimado vs real en el walkthrough; si la desviación supera el ±30%, la causa es obligatoria. ¿No conoces el tiempo? Pregunta, y si no hay respuesta, aproxima y márcalo como aproximado — nunca en blanco.

## Paso 3 — estimation-log

3. **estimation-log** *(si existe `.docs/sdd/estimation.md`)* — ejecuta el script del kit, que vive junto a las plantillas: `pwsh -NoProfile -File "<Base directory de esta skill>/../sdd-templates/scripts/Build-EstimationLog.ps1" -Root "<raíz del proyecto>"`. Regenera `estimation-log.md` entero a partir de los walkthroughs y patches: no añadas filas a mano ni busques una copia en el proyecto (si el proyecto arrastra `.tools/sdd/Build-EstimationLog.ps1` o `tools/sdd/`, es una copia antigua: avísalo y no la uses). Si el script avisa de que tu walkthrough no se lee, corrige el bloque de tiempo, no el script. Solo si `pwsh` no está disponible añade la fila a mano (task, tipo, estimado, real, ratio). El walkthrough registra; el log acumula — sin fila no hay calibración.
