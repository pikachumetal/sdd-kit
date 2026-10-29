# RED — el gate de los proyectos por niveles y por lo afectado (feature 0236)

Kit de `develop` en `b8ab5635` (`git archive b8ab5635 skills .claude-plugin cli hooks`), sujetos headless Sonnet, n = 1, superpowers 7.0.0. Salidas en `.docs/sdd/specs/20261029-082734-feature-0236-project-gate-levels/red/out/`. Escenarios y rúbrica en las baterías de `sdd-init` (`n7`), `sdd-upgrade` (`v4`, `g2`) y `sdd-propose` (`pl3`).

## Task 1 — los campos de `operations.md` y quien los propone

| Escenario | Fila | Resultado | Evidencia |
| --- | --- | --- | --- |
| n7 | N7a Nivel | ❌ | `n7-1.texts.txt` [15]: «`unit` · `npm test`», «`e2e` · `npm run e2e`», sin nivel |
| n7 | N7b Sin filtro | ❌ | ningún campo de ficheros que corran el gate entero; `tests/helpers/rooms.ts` solo se nombra como «fuera de lo que Vitest recoge» |
| n7 | N7c Lint | ❌ | «`npm run lint` queda fuera de la CI», sin campo «Lint» |
| n7 | N7d CI de la base | ❌ | la CI solo sirve para proponer el gate; ningún campo con el pipeline ni su orden de lectura |
| v4 | V4a-d | ❌ | `v4-1.state.txt:127`: `## Testing` sale tal cual (`Gate de cierre: npm test.`), sin nivel, «Sin filtro», «Lint» ni «CI de la base» |
| v4 | V4e Nada antes del «sí» | ✅ | escribe `operations.md` tras aprobar la tabla del paso 2 |
| g2 | G2a Aviso del lint | ❌ | `g2-1.texts.txt`: «El paso 9 no tiene aviso: el gate `moon run :typecheck :test :lint` no encadena comandos ni usa variables» |
| g2 | G2b Línea intacta | ✅ | `g2-1.state.txt:128` conserva la línea |
| pl3 | PL3 Verificación por nivel | ✅ | `pl3-1/plan.md:113` y `:141`: «Verificación» `node --test test/cancel.test.js`, sin `test/store.test.js` |

Lectura por regla:

- **Nivel, «Sin filtro», «Lint» y «CI de la base» en la init** (`sdd-init`, fila «How it is tested»): falla, `n7`. Se escribe.
- **Los mismos campos en el paso 2 de la migración** (`v3.0.0.md`): falla, `v4`. Se escribe.
- **Aviso del gate con lint en el paso 9**: falla, `g2`. Se escribe.
- **«Verificación» por nivel en la plantilla del plan**: limpio, `pl3`. No se escribe (Art. I); `pl3` queda en la batería de `sdd-propose` como control.

Coste: 4 sujetos, 2,89 $ (`pl3`, que escribe el plan entero, 1,64 $).

## Task 2 — correr un gate: unitarios, salvaguarda y tras un rojo

| Escenario | Fila | Resultado | Evidencia |
| --- | --- | --- | --- |
| g7 | G7a Sin filtro y unitarios | ❌ | `g7-1.tools.txt:190`: `gate.mjs run … --affected --base develop`; ni `node --test test/app.test.js` ni el gate sin filtro, con `package.json` en la rama |
| g7 | G7b Línea por el build | ❌ | `g7-1/walkthrough.md:42`: `rooms:test: saltada (no toca sus inputs)` |
| t1 | T1a Solo los rojos | ❌ | `t1-1.tools.txt:42`: repite el gate con `--base develop`, `bookings:test` entera (7/7), con un arreglo solo de `README.md` |
| t1 | T1b Línea tras el rojo | ❌ | `t1-1.texts.txt:65`: la línea no nombra la pasada roja ni el arreglo |
| t2 | T2a Rojos, base roja y la saltada | ❌ | `t2-1.tools.txt:28`: el gate con `--base develop`, sin los tests rojos solos ni `--base <rojo>` |
| t2 | T2b Línea tras el rojo | ❌ | `t2-1.texts.txt:83`: la línea no empieza por «tras el rojo» ni marca `rooms:test` como no corrida |

`t2-1` encontró además un rojo del molde: `src/rooms.js` con tres salas rompía `test/rooms.test.js` (`3 !== 2`). No cambia la lectura (el sujeto ya había repetido el gate con `--base develop`); para el GREEN, el molde cambia `rooms.js` sin cambiar las salas.

Lectura por regla: los unitarios enteros y la salvaguarda (`g7`) y la regla tras un rojo (`t1`, `t2`) fallan. Se escriben, en «Running a gate» de `sdd-verify`.

Coste: 3 sujetos, 1,02 $.

## Task 3 — lo que trae la base y el conflicto solo de docs

| Escenario | Fila | Resultado | Evidencia |
| --- | --- | --- | --- |
| g8 | G8a Base con lockfile | ❌ | `g8-1.texts.txt:24`: «La base había avanzado con `test/rooms.test.js` y `package-lock.json`. Ninguno es input de `bookings:test`, así que no repetí la suite» |
| g8 | G8b Línea por el build | ❌ | la misma línea: `saltada` en las dos tareas |
| m1 | M1a-c Juntado y nombrado | ❌ | `m1-1.texts.txt`: «**No terminado.** Falta resolver `tech-stack.md`»: para por una frase que la base añade a la línea que la rama reescribe |
| m2 | M2a-b Para (contraejemplo) | ✅ | `m2-1.texts.txt:311`: «No terminado», con Node 22 frente a Node 24 sin resolver |

Lectura por regla: lo que trae la base en «Sin filtro» (`g8`) y el conflicto de docs que junta (`m1`) fallan; se escriben en el paso 6 de `sdd-archive`. El contraejemplo (`m2`) ya para hoy: es el control de que la regla nueva no lo resuelve.
