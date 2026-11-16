# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md
Task 1: complete (commits 53ec456..075a6f8, tests: node --test test/cancel.test.js → 2/2 pass)
Task 2: complete (commits 075a6f8..b198fd1, tests: node --test test/cancel.test.js → 3/3 pass)
Final: Eje Arquitectura: no en el plan · señales en el diff: ninguna → no sale
Final: fixed reasonOf no recorta los espacios del motivo — cancelar acepta el motivo con espacios alrededor RED→GREEN, suite 7/7
Final: fixed el test de canceladas dependía del orden — el test viejo en solitario RED, el nuevo GREEN en solitario, suite 7/7
Final: deviation pendiente: el separador — de canceladas (Minor de Código) lo fija el THEN y la decisión 4 de la spec; parado con enmienda sin commitear
Final: Ruling: recortar el motivo no es un desvío — la lista sigue cerrada y ningún THEN cambia; solo deja de rechazar espacios alrededor — si se equivoca, se quita el recorte y su test
Final: Ruling: re-revisión retenida hasta resolver el separador — es única y debe cubrir también la Task 3 si se aprueba — si se equivoca, sale más tarde sin coste
