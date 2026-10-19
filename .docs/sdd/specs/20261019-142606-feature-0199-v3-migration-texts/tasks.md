# Tasks — feature 0199

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Molde, rúbrica y RED | ✅ | 52724aa2 |
| 2 — Pasos de textos, marcador y reglas | ✅ | d1d51441 |
| 3 — GREEN | ✅ | 323ccea3 |

## Rulings

Setup: Ruling: línea base = pre-commit de la apertura 7e9c6af3 (kit:test-fast 1244 verde + cli:test), como en la 0197; el gate completo corre al cierre — coste si mal: un rojo de la base se ve al cierre.
Setup: Ruling: effort — los tipos sdd-kit:effort-high/medium/low están entre los agentes de la sesión.
Task 1: Ruling: el contador de run.sh cuenta todas las fases de SPEC_DIR, el seco incluido, y lancé el RED con SUBJECT_CAP=2: solo salió v1-1. El seco sale de SPEC_DIR (no es un sujeto real) y los techos pasan a los de la spec (11 sujetos, 2,5 $); v1-2 se lanza solo con run.sh SUBJECT=2 — coste si mal: ninguno.
Task 1: Ruling: la «Verificación» de sdd task done es `sdd roadmap check` del molde (sale ≠ 0 si falla); el seco y el RED ya corrieron — coste si mal: ninguno.
Task 2: Ruling: los git grep de la spec y del plan no funcionaban tal cual: --untracked tras el patrón da exit 128, y '.docs/sdd/*.md' sin :(glob) entra en specs/ (falso rojo con la historia). Van con --untracked antes del patrón y :(glob) en las carpetas; enmienda en la spec, sin cambiar la conducta del THEN; delta re-probado con capability merge — coste si mal: ninguno.
Task 2: Ruling: tests/MigrationInitParity.Tests.ps1 fijaba el literal viejo de Select-String de v2.0.0 (fuera de la lista de ficheros del plan): pasa a fijar el git grep nuevo y a negar el viejo — coste si mal: ninguno.
Task 2: Ruling: el RED de v2.0.0 en carpeta temporal sin AGENTS.md: la línea vieja solo da el error de ruta (falso verde), la nueva devuelve la cita de CLAUDE.md y no la de roadmap.md ni specs/.
Task 2: Ruling: WordBudget RED con SKILL.md a 937 sobre 900; topes a 980 y 87600 como la spec.
Task 2: Ruling: tests/ArchiveSkill.Tests.ps1 prohíbe nombrar sdd-end-feature y sdd-end-patch en skills/ salvo las migraciones pasadas; v3.0.0.md los nombra para sustituirlos (paso 5), y entra en la lista de permitidos — coste si mal: ninguno.
Task 3: Ruling: V5 de la 0197 («algún fichero cambia») choca con la decisión 12 aprobada (nombres sin gate corren sin el dev-lead): V5 pasa a «se mueve, se borra o cambia de forma», con el paso 5 y 6 sin gate permitidos sin commit — coste si mal: ninguno.
Task 3: Ruling: el dev-lead acepta pasar del dinero previsto para la ronda de la barra («Sí, v1 ×2 (~0,85 $)», 2026-10-19); COST_CAP a 3,6 — coste si mal: ninguno.
Final: Ruling: V5 relajada en el GREEN (Código I3) — la V5 de la 0197 contradice la decisión 12 aprobada (pasos sin gate corren sin el dev-lead); el eje Spec la acepta; queda en el walkthrough — coste si mal: un cambio de forma sin dev-lead pasaría por paso sin gate.
Final: Ruling: el arreglo de Spec I2 (molde) no se mide con sujetos: la campaña ya pasó el dinero previsto (3,54 $ sobre ~2,5 $) y el dev-lead solo aprobó la ronda 2; el paso 5 excluye specs/ por pathspec y lo fija el Pester — coste si mal: un sujeto que reescriba un walkthrough a mano no se vería hasta el uso.
Final: minor (deferred): el paso 5 no busca en README.md, PRODUCT.md ni ROADMAP.md (Código m1)
Final: minor (deferred): el último punto de la Verificación («tras el marcador, 3.0.0») es circular con el paso 7 (Código m2)
Final: minor (deferred): el paso 8 no dice que se salta si el 7 no hizo commit (Código m3)
Final: minor (deferred): la línea 2.x del paso 6 va truncada con «…» (Código m4)
Final: minor (deferred): la decisión 12 y la nota de V5 dicen que la estimación corre sin dev-lead, pero su predicado (steering/estimation.md) depende del paso 1 (Spec m5)
Final: minor (deferred): V8 falla solo si faltan las dos frases; el plan pedía las dos (Spec m6)
Final: minor (deferred): la evidencia del RED de v2.0.0 solo está en el ledger; va al walkthrough (Spec m7)
Final: minor (deferred): --untracked no ve .claude/ si el proyecto lo ignora (Spec m8)
Final: minor (deferred): la campaña pasó la previsión de dinero con el REFACTOR 1 antes de parar (Spec m9)
Final: Ruling: (re-revisión, Minor) la frase de historia del paso 5 mezcla dos listas con «, y» — se lee y la conducta es la del grep; queda para la 0198, que aplica la migración a este repo — coste si mal: ninguno.
Final: Ruling: (re-revisión, Minor) la tabla de puertas de using-sdd no nombra «revisa las reglas del proyecto contra el kit»; la description de sdd-upgrade sí — va a la 0198/deuda — coste si mal: la frase puede caer en sdd-explore, que no aplica nada.
Final: Ruling: (re-revisión, Minor) «run the last step of that version's migration» da por hecho que acaba en la revisión de reglas; vale para v3.0.0 y lo exige «Writing a new migration»; una release sin migración propia no la tiene — coste si mal: con un parche sin migración, la frase no encuentra paso.

Revisión final: Spec opus+high, with fixes · Código sonnet+high, with fixes · Arquitectura no (plan), sobre 323ccea3
Pasada de fix: juntada en el cierre, 6 hallazgos RED→GREEN
Re-revisión: 323ccea3..pasada de fix (juntada en el cierre), sdd-kit:effort-high + opus, todos resueltos, sin rotura nueva Critical/Important
