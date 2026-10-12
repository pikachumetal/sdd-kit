# SDD ledger — plan: .docs/sdd/specs/20261010-110000-feature-0019-duplicate-note/plan.md
Task 1: h1 FALLA (green/h1.txt) — el aviso iba tras el Write y la nota quedó sobrescrita.
Task 1: REFACTOR ronda 1 — la comprobación de existencia pasa antes del Write (paso 2 de la skill); h1 PASA (green/h1b.txt).
Task 1: Ruling: no añado «no escribas / espera confirmación» — es un AND nuevo que la spec no tiene (la THEN solo pide el aviso); el sujeto paró por iniciativa propia, la skill no lo exige — si hay que preservar la nota, es una enmienda que aprueba el dev-lead (Art. II) — si me equivoco, un sujeto que avise y luego sobrescriba cumple la spec pero pierde la nota.
Task 1: complete (commits 7ad9a80..09932d6, tests: grep -q 'Veredicto: PASA' .docs/sdd/specs/20261010-110000-feature-0019-duplicate-note/green/h1b.txt → (sin salida))
