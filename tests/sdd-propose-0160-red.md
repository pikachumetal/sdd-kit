# RED — `sdd-propose`, feature 0160

Baseline de las reglas nuevas de la entrada única con el kit del commit de apertura (`9b25ce29`, sin `sdd-propose`): batería `tests/batteries/sdd-propose/`, pasos `ceremony`, `config`, `spike` y `plan`, n=2, Sonnet, 2026-10-09. 16 sujetos, 4,42 $. Salidas en `.docs/sdd/specs/20261009-110857-feature-0160-single-entry-propose/red/out/`. La puerta («Esperado» `sdd-kit:sdd-propose`) sale roja en todos, como corresponde a una skill que no existe; el veredicto que cuenta es el de la conducta, por regla.

| Regla | Escenario | Resultado | Lectura |
| --- | --- | --- | --- |
| Full anuncia y sigue | a1 | **falla 2/2** | los dos paran con la pregunta de confirmación de carril, modo y perfil («¿Confirmas estas cuatro cosas?», a1-1). Con `{"merge": {"push": true}}` en `sdd-kit.local.json`, a1-1 lo da por bueno («Lo aplicaré en el cierre: el merge empujará al remoto») en vez de avisar de que es una clave de política que el fichero local no fija |
| Patch pregunta, con 🦆 y estimación | a2 | **falla 2/2** | los dos abren rama, reservan id, arreglan y commitean sin preguntar el carril (`feature/0012-cancelar-ignora-dia`, a2-1); sin párrafo 🦆 ni estimación; `patch.md` no tiene `Estimación:` ni `Inicio:` |
| El carril de la petición se respeta si concuerda | a3 | pasa 2/2 | con «patch: …» los dos siguen como patch sin preguntar el carril. **Control**: la base nunca pregunta en un patch; la presión la crea la regla nueva «patch pregunta», y sin esta regla el sujeto preguntaría también cuando el carril ya viene dicho |
| Carril por debajo: pregunta con el pesado | a4 | pasa 2/2 | con «patch: avisa cuando una sala pase de 10 reservas en un día» los dos lo pasan a feature, lo preguntan y nombran lo que tendrían que decidir («qué texto sale, dónde y cuándo», a4-2). **Control**: la base pregunta siempre en la primera pregunta de feature; la presión la crea «full anuncia y sigue» |
| Config: pregunta, gate y commit | k1 | **falla 2/2** | los dos editan `package.json` sin preguntar ni ejecutar nada («Era una edición directa de configuración, sin cambio de comportamiento, así que no he pasado por ninguna skill del kit SDD», k1-1); al «Sí.» del turno 2 responden que no habían preguntado nada |
| Config en la rama estable | k3 | **falla 2/2** en lo que comparte con k1 | editan en `main` sin preguntar ni pasar el gate. No commitean, así que «no commitea en `main`» no se exhibe: **control** de la regla nueva, que es la que añade el commit |
| Spike: se clasifica y se anuncia | k2 | **falla 2/2** | los dos entran por `sdd-consult`, miden en un directorio temporal y responden con la tabla en el chat; ninguno lo trata como spike ni deja `research.md` |
| Gate de cierre del plan desde `operations.md` | p2 | **falla 1/2** | p2-1 copia `node --test && node scripts/lint.mjs` de `operations.md`; p2-2 escribe `node --test`, el de la constitution («el gate de cierre, `node --test` entero», p2-2 línea 43) |

## Decisión

Ninguna regla sale: las seis que fallan se escriben con su GREEN, y `a3`, `a4` y la parte de `k3` que no se exhibe se miden como control en el GREEN, porque es la regla nueva —«patch, lite y config preguntan», «full anuncia y sigue», «config commitea»— la que crea la presión que la base no tenía (`tech-stack.md`, «Fixtures y baselines»: un recorte por el RED puede tener que deshacerse en el GREEN).

## Ruido del molde

- La fila «Patch 0007: la cancelación borraba reservas de otro día» del roadmap del molde contradice el fallo plantado en `a2` y `a3`; los cuatro sujetos lo señalan como discrepancia y no tocan el roadmap. No cambia la conducta medida.
- `spec-new.md` de `a2` es la spec de la task 0005 del molde (su fecha es posterior a la del `README.md` copiado), no una spec que escribiera el sujeto.
