# Tiempo real y estimation-log — detalle

## Paso 2 — Tiempo real

Si la desviación supera el ±30 %, la causa es obligatoria. Sin la línea medida, aproxima y márcalo como aproximado: nunca en blanco.

## Paso 3 — estimation-log

3. **estimation-log** *(si existe `.docs/sdd/estimation.md`)* — ejecuta `sdd estimation log --root "<raíz del proyecto>"`. Regenera `estimation-log.md` entero a partir de los walkthroughs y patches: no añadas filas a mano ni busques una copia en el proyecto (si el proyecto arrastra `.tools/sdd/Build-EstimationLog.ps1` o `tools/sdd/`, es una copia antigua: avísalo y no la uses). Si el script avisa de que tu walkthrough no se lee, corrige el bloque de tiempo, no el script. Solo si el kit no está disponible (instalación parcial de una sola skill), añade la fila a mano (id, tipo, estimado, real, ratio) y dilo en el informe.
