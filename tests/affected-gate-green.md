# GREEN — el gate de cierre corre solo lo afectado (feature 0221)

Kit del working tree de la rama, sujetos headless Sonnet, superpowers 7.0.0. Salidas en `.docs/sdd/specs/20261026-172719-feature-0221-affected-closing-gate/{green,refactor,control}/out/`. RED en [affected-gate-red.md](affected-gate-red.md).

| Escenario | Fase | Resultado | Lectura |
| --- | --- | --- | --- |
| k6 | green, n = 2 | 2/2 | los dos corren `rooms:test` sin filtro antes de commitear (cambia su definición) y la línea `Gate:` nombra cada tarea |
| w2 | green, n = 2 | 2/2 | ven «No tasks affected», no la dan por buena, corren sin filtro solo `bookings:test` y nombran `rooms:test: saltada (fuera del Scope de la spec)`; los dos leyeron `<N>/<M>` como tareas: el texto aclara que son tests |
| g6 | green, n = 2 | G6a 2/2 (con el desempate de la rúbrica), G6b 1/2, G6c 0/2 | uno añadió una pasada sin filtro tras el sync; ninguno puso el sha del sync en `Validación en campo:`, que se commitea antes del sync → enmienda aprobada de la spec y frase «don't add a run without the filter» |
| g6 | refactor, n = 2 | 2/2 | una sola pasada del gate tras el sync, `--verified-at` con su sha, la validación dice que la suite corre sobre el merge de sincronización |
| g5 | green, n = 2 | 0/2 | «suite en verde sobre `HEAD`»: el commit de cierre mueve `HEAD` y los dos corrieron el gate entero o con `--base develop` |
| g5 | refactor, n = 2 | 1/2 | `g5-1` corre `--base <sha de la validación>`; `g5-2` leyó «salvo A o B o C» y aplicó «base por delante» sobre «la validación ya corrió» → precedencia explícita en el paso 1 |
| g5 | control, n = 1 | G5a ✅, G5b ✅, G5c ⚠ | `--base 19b5300` (la validación), `bookings:test: saltada (la base solo tocó test/rooms.test.js…)`; `--verified-at` con el commit de docs que añadió tras el sync, equivalente para `sdd merge` |

Sin controles de `a3` y `w1` (ruling de coste en el ledger de la Task 3); `a3n`, medido tras la revisión final (abajo).

Coste de la campaña: 17 sujetos válidos, 7,05 $, más 4 sujetos (1,28 $) de una tanda RED descartada; previsión aprobada en la spec: 12 sujetos y ~6 $. El dev-lead aprobó la tanda de REFACTOR y el control (2026-10-27).

## Tras la revisión final (fase `final/`, n = 1, texto con la pasada de fix)

| Escenario | Resultado | Lectura |
| --- | --- | --- |
| g5 | G5a ✅, G5b ✅, G5c ✅ | tras el sync, `--base 66c871a` (la validación): `rooms:test: corrió 2/2 · bookings:test: saltada`; `--verified-at` con el merge de sincronización. Repitió el gate antes del cierre porque el borrador no traía los conteos |
| a3n | ✅ (control) | sin otra rama y con la base al día, la suite corre en la validación; gate sin tareas: `` Gate: `node --test --test-concurrency=1` → corrió 5/5 `` |
| k6 | K6 ✅ (rúbrica apretada) | una entrada por tarea: `rooms:test: corrió 1/1` (sin filtro antes, por la definición) · `bookings:test: saltada (…)`; creó un fichero temporal en `src/shared/` para ver el filtro, fuera de lo pedido |

Coste final: 20 sujetos válidos, 8,14 $, más 1,28 $ de la tanda descartada; todas las tandas por encima de la previsión las aprobó el dev-lead. `g6` y `w1` no se re-midieron sobre el texto final (decisión de coste del dev-lead, 2026-10-27): riesgo aceptado.
