# Tiempo real y estimation-log — detalle

## Paso 2 — Tiempo real

2. **Tiempo real** *(si existe `.docs/sdd/estimation.md`)* — estimado vs real en el walkthrough; si la desviación supera el ±30%, la causa es obligatoria. ¿No conoces el tiempo? Pregunta, y si no hay respuesta, aproxima y márcalo como aproximado — nunca en blanco.

## Paso 3 — estimation-log

3. **estimation-log** *(si existe `.docs/sdd/estimation.md`)* — si el proyecto tiene `.tools/sdd/Build-EstimationLog.ps1` (o `tools/sdd/` en proyectos antiguos), ejecútalo (`pwsh -NoProfile -File .tools/sdd/Build-EstimationLog.ps1`). Si no, añade la fila a mano en `.docs/sdd/estimation-log.md` (créalo si no existe): task, tipo, estimado, real, ratio. El walkthrough registra; el log acumula — sin fila no hay calibración.
