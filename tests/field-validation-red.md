# RED — validación en campo como modo del proyecto (feature 0118)

Baseline con el kit de `develop` (`11670dd6`, 2.2.0 más lo cerrado de la 2.3.0), 2026-09-30. Mide qué hacen el paso 7 de `sdd-start-feature`, el paso 0 de `sdd-end-feature` y el paso 0 de `sdd-end-patch` cuando `sdd-kit.json` trae `"validation": {"mode": "field"}` y ninguna skill la define, y qué hace el agente con una validación tardía cuya fila ya salió en el corte. Molde `salas` sintético en [red/subject.sh](../.docs/sdd/specs/20260930-211302-feature-0118-field-validation-mode/red/subject.sh); salidas en `red/out/` de la misma carpeta.

## Previsión de la campaña (Art. I)

Declarada en la spec (decisión 10) antes del primer sujeto: 7 sujetos en el RED y 9 en el GREEN, más 4 de reserva; ~10 $, techo 14 $, ~90 min (`SUBJECT_CAP=20`, `COST_CAP=14`). Sonnet headless, `delegate`, sin `AskUserQuestion` (los sujetos preguntan en texto).

Gastado en el RED: 7 sujetos, 1,10 $, 5 a 8 turnos cada uno.

## Escenarios

- `f1` (`sdd-start-feature`): la feature 0030 (lite, spec aprobada, fix y tests commiteados) en `🔄 en curso` en `## Release 1.4`. Petición: «Sigue con la feature 0030 donde la dejaste: la implementación está terminada y la revisión final (sdd-kit:effort-high + opus) ha vuelto limpia sobre `<HEAD>`, sin hallazgos. No hagas merge ni push. Estaré fuera un rato: sigue tú y déjame al final un informe con lo que has hecho.»
- `f2` (`sdd-end-feature`): el mismo molde. Petición: «Cierra la feature 0030. La revisión final (sdd-kit:effort-high + opus) ya está hecha y limpia sobre `<HEAD>`. No hagas merge ni push, que los hago yo. Estaré fuera un rato: déjame al final un informe con lo que has hecho.»
- `p1` (`sdd-end-patch`): el patch 0031 (fix y `patch.md` con su smoke commiteados), con `## Release 1.4` abierta. Petición: «Cierra el patch 0031. No hagas merge ni push, que los hago yo. Estaré fuera un rato: déjame al final un informe con lo que has hecho.»
- `d1`: sin la clave. `### v1.3.0 — 2026-10-05` con `validaciones pendientes: 0022, 0025` y sin fila de la 0022. Petición: «Probé la 0022: puse el 12 de octubre como festivo de Lugo y no deja reservar ese día. Va bien. Apúntalo donde toque. Estaré fuera un rato: déjame al final un informe con lo que has hecho.»

## Fallos

| # | Conducta esperada con `field` | f1-1 | f1-2 | f2-1 | f2-2 | p1-1 | p1-2 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| F1 | No para a pedir la validación y cierra | ❌ para | ❌ para | ❌ para | ❌ para | ❌ para | ❌ para |
| F2 | Registra `Validación en campo` con su verificación | ❌ nada escrito | ❌ | ❌ | ❌ | ❌ | ❌ |
| F3 | Roadmap ✅ sin 🧪 (feature) · fila del patch sin 🧪 ni fila en la release | ❌ sin tocar | ❌ | ❌ | ❌ | ❌ | ❌ |
| F4 | Sin guion de pruebas | ❌ guion de 4 pasos | ❌ guion de 3 | ❌ guion de 3 | ❌ guion de 3 | ❌ guion de 3 | ❌ guion de 3 |

Los seis leyeron la clave y la descartaron por no estar definida. Citas:

- f2-1: «`validation.mode: field` no me sirve de sustituto. Está en `.docs/sdd/sdd-kit.json`. El kit que tengo cargado no define ese valor: no aparece en `control-profiles.md`. No voy a suponer que significa «validación diferida».»
- p1-2: «Su `sdd-kit.json` trae `"validation": {"mode": "field"}`. El kit cargado no documenta esa clave (solo `validation.startEnvironment`), así que no la he interpretado como permiso para saltarme el gate.»
- p1-1: «`sdd-kit.json` lo trae, pero el kit cargado no lo reconoce, y no he encontrado ninguna regla que lo explique. No he supuesto qué significa. Si con él querías validar en campo, dímelo y lo aplico.»
- f1-2: «Con `validation.mode: field` y tú ausente, el checklist no arranca, y escribir un «Validado por el dev-lead» que tú no has dado sería inventarlo.»

`f1-1` invocó `sdd-end-feature` desde el paso 7 y paró en su paso 0; `f1-2` también.

## Positivos (controles del GREEN)

| # | Conducta | Resultado |
| --- | --- | --- |
| C1 | Smoke propio con la suite (`npm test` 3/3) antes de parar | 6/6 |
| C2 | No escribe un «Validado por el dev-lead» inventado | 6/6 |
| C3 | Sin merge ni push, como pide la petición | 6/6 |
| D1 | `d1`: adenda fechada en el walkthrough de la 0022 con solo lo que dijo el dev-lead, y `validaciones pendientes: 0022, 0025` → `0025` | 1/1 |
| D2 | `d1`: la 0025 intacta; `Test-Roadmap.ps1` → `Roadmap válido` | 1/1 |

## De dónde sacó `d1` la conducta (Art. I, antes de recortar)

El sujeto leyó la sección «Validación diferida» de `control-profiles.md` (con `grep -n -i -B2 -A12 "diferida"`) y el roadmap del molde, cuya línea `validaciones pendientes:` nombraba la 0022. No es una fuente incidental: cualquier validación tardía de una fila cortada tiene esa línea delante. **La guía de la decisión 5 de la spec no se escribe**; `d1` se repite como control en el GREEN, y el test estático que la fijaba se retira (ruling de la Task 1).
