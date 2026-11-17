# Tasks — 0348

| Task | Nombre | Estado | Commit |
| --- | --- | --- | --- |
| 1 | `sdd estimation log` cuenta una carpeta movida desde su nacimiento | complete | b2adb3a56 |
| 2 | La migración v3.0.1 y los textos del kit | complete | 313d70b01 |
| 3 | Este repo, migrado | complete | 27bd1acce, 875ba6e35 |
| 4 | `CHANGELOG.md` de la 3.0.1 | complete | 0a02c27e3 |

Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (plan), sobre 0a02c27e3
Pasada de fix: juntada en el cierre, 4 hallazgos RED→GREEN
Re-revisión: 0a02c27e3..pasada de fix (juntada en el cierre), sdd-kit:effort-high + opus, quedan Spec I2 en parte y 3 menores → arreglados después, juntados en el cierre, sin revisar

## Rulings

- Task 1: Ruling: el rojo de la línea base `molds.test.ts > sdd-archive construye en seco el molde reservas-e2e-stale (e1)` («el entorno no responde en http://localhost:59084/health») pasa solo (`Tests  4 passed`); intermitente bajo carga, ajeno a la rama, sin fila en debt.md — sigo y va al ticket — si no es intermitente, el gate de cierre lo repetirá.
- Task 1: Ruling: el RED pasaba sin el arreglo porque git mv deja specs/ vacía en disco y changeFolders la seguía leyendo; el test borra specs/ como hace la migración — sin esa línea el test no prueba nada.
- Task 3: Ruling: el primer git mv falló a mitad con «bad source» en r3-ver/out/rm3-1/void.test.js de la 0152 (fichero presente y versionado; bloqueo transitorio de Windows); repetí el comando 1, que siguió con las 3 entradas restantes y salió con 0 — la migración ya dice reanudar; si no fue transitorio, el retroceso es el de su paso 2.
- Task 3: Ruling: el commit de mover de este repo lleva también la reescritura de los .md que no se mueven (raíz, steering, capabilities, field-reports, releases, decisions, tests/*.md) y THIRD_PARTY_NOTICES, porque root-docs-links.test.ts del pre-commit rechaza los enlaces rotos; las carpetas movidas siguen en R100 y sus .md se reescriben en el segundo commit — --follow intacto; la migración publicada no cambia.
- Final: Ruling: Código I1 (formas como ../sdd/specs/ no se reescriben) — la reescritura sigue la decisión 4 aprobada; la «Verification» ahora las busca y el informe las lista para el dev-lead — coste si está mal: un proyecto con docs en .docs/<otra>/ arregla a mano los enlaces que el informe le lista.
- Final: Ruling: Código M5 / Spec M4 (../specs/ a cualquier profundidad dentro de .docs/sdd/ podría apuntar a un specs/ de la raíz) — es la decisión 4 aprobada; improbable en un proyecto del kit — coste si está mal: un enlace a specs/ de la raíz pasa a changes/ y lo ve el dev-lead en el diff.
- Final: Ruling: Spec I4 (entrada de CHANGELOG antes del corte, frente a la ADR 0020) — el prompt de arranque del dev-lead la pide («la versión 3.0.1 en el plugin y su entrada en CHANGELOG.md») y el corte no la duplica — coste si está mal: el corte reescribe la entrada.
- Final: Ruling: Spec I3 (batería de sdd-upgrade) — las filas O1, V7, V11 y V15 aceptan la 3.0.1; la batería no se lanza aquí ni se añade escenario 3.0.0→3.0.1 (coste de sujetos): la corre entera el corte de la release, como pide operations.md — coste si está mal: un rojo en el corte.
- Final: Ruling: Spec M3 (commit de mover de este repo con la reescritura de lo que no se mueve) — ya en el ledger de la Task 3 y en §3 del walkthrough; la migración publicada no cambia — coste si está mal: ninguno para --follow.
- Final: Ruling: Spec M5 (el paso 6, revisión de reglas, frente a «no hay gate») — el «no gate» del THEN es el del movimiento; la revisión de reglas la pide sdd-upgrade a toda migración y va en su propio commit tras el marcador — coste si está mal: una pregunta de más al dev-lead.
- Final: Ruling: un fichero sin versionar suelto en specs/ sale en «sin versionar» y en «sin nada versionado» — cosmético; el comando para igual y nombra el fichero — coste si está mal: una línea repetida en el informe.
