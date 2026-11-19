# RED — feature 0359: la spec y el plan en skills de fase

Kit: `HEAD:dist` en `c9b78da5a` (la apertura sobre `develop`). Batería de `sdd-propose`, molde `reservas`, sujetos `sonnet`, `PHASE=red`. Salidas en `.docs/sdd/changes/20261119-113300-feature-0359-spec-plan-phase-skills/red/out/`. 6 sujetos, 1,11 $ (previstos 5,28 $).

| Escenario | Resultado | Filas |
| --- | --- | --- |
| `ss1` («Abierto», `sort()` sobre el día, siete lecturas) | **rojo 0/3** | SW1 0/3 (sin `sdd-spec-writing`, que aún no existe); IQ1 3/3; SS2 0/3; SS3 0/3; SS4 3/3 |
| `rq1` (dos revisores, sin delegar, instrucciones de confirmar y de diálogos) | **rojo 2/3** | RQ1 2/3; RQ1-B 3/3 |

## Lectura por regla

- **Los montones no se enseñan (SS2 0/3).** Los tres sujetos abren con la nota de entendimiento y una pregunta; ninguno reparte lo que falta en contestado, menor y del dev-lead, y lo que deciden solos va sin la fuente de la que sale.
- **«Abierto» sale del montón del dev-lead (SS3 0/3).** `ss1-1`: «Sala sin reservas: `sin reservas <sala>`, como propusiste» y «Fichero de test: `test/semana.test.js`, como propusiste», en «Lo que he decidido yo». `ss1-2`: «El nombre de `test/semana.test.js` lo decido yo y irá a «Decisiones que he tomado yo»». `ss1-3`: «Dos puntos de «Abierto» los dejo para la spec, con tu propuesta como valor provisional … Ambos irán marcados en ✋». Es el fallo de campo del ticket de la 0633 §1: la propuesta del prompt se toma por decisión.
- **Lo visible que impone la técnica sí sube (parte de SS3, 3/3).** Los tres preguntan primero el orden de `sort()` (`jue` antes de `lun`), con dos alternativas. Esa parte de la fila ya pasa hoy; la fila cae por «Abierto» y porque la primera pregunta no cita una propuesta de «Abierto».
- **`sdd-grilling`**: lo invocan `ss1-1` y `ss1-3`; `ss1-2` pregunta sin invocarlo. Es el «5 de 15 no invocan `sdd-grilling`» del Intent.
- **La herramienta de diálogo (RQ1 2/3).** `rq1-2` llama a `ToolSearch` con `select:AskUserQuestion` antes de preguntar. La herramienta está bloqueada en el sujeto y la pregunta acaba en prosa, pero en una sesión real la habría usado, y el texto del turno se habría perdido (ticket de la 0633 §2). Los tres preguntan con los dos revisores, el modelo de cada uno y su coste (RQ1-B 3/3).

## Decisión

Ninguno de los dos sale limpio 3 de 3: la guía que miden entra (Scope «si el RED lo exhibe»). Las filas `tools:` de invocación de las skills de fase (SW1, SW2, RV-S, PW) están en rojo por construcción: las skills no existen en este kit.
