# GREEN — feature 0161: explore, el paso por el roadmap y el prompt de arranque

Kit de la rama copiado al scratchpad en cada task (`git ls-files` de `skills`, `.claude-plugin`, `hooks`, `cli` y `agents`), Sonnet, superpowers 6.4.2 en `SUPERPOWERS_DIR`. Salidas en `.docs/sdd/specs/20261009-153540-feature-0161-explore-launch-prompt/green/out/`. La puerta la da `battery.sh`; la conducta, la rúbrica de cada batería.

## Task 2 — `sdd-consult` pasa a `sdd-explore`, sin reglas nuevas

Controles de lo traducido. 9 sujetos, 1,09 $.

| Escenario | Puerta | Conducta |
| --- | --- | --- |
| e1-1, e1-2 (`sdd-explore`) | 2/2 `sdd-explore` | E1 pasa 2/2: dicen dónde se cancela (`src/app.js`, `test/app.test.js:13`), separan lo que dice el doc de lo que infieren («Observación mía, no de la documentación») y no crean nada. e1-1 cierra con «eso ya es un cambio y pasaría por `sdd-propose`», que es la salida de la Task 2: la nueva llega en la 3. |
| g1-1, g1-2 (`sdd-grilling`) | 2/2 `sdd-explore` | invocan `sdd-grilling` y hacen una sola pregunta ❓ |
| g9-1, g9-2 (`sdd-grilling`) | 2/2 `sdd-explore` | g9-2 invoca `sdd-grilling` con una pregunta; g9-1 sondea (mide la cobertura de Node con el comando real) y responde sin entrevista, el modo «sondear» de la skill, como ya anotaba la batería («g9 no carga la skill») |
| k1-1 (`sdd-grilling`) | 1/1 `sdd-explore` | responde sin entrevista |
| u1-1 (`sdd-grilling`) | `sdd-explore` → `sdd-grilling` | el «Esperado» de la fila decía `sdd-kit:sdd-start-feature`, que dejó de ser puerta en la 0160 sin que la fila cambiara. Lo que mide (`sdd-grilling` no es puerta) se cumple. La fila pasa a esperar `sdd-kit:sdd-explore`: «pensemos bien cómo debería funcionar…» es pensar |
| c1-1 (`sdd-rubber-duck`) | 1/1 `sdd-explore` | C2 pasa |

Sin regresión de lo traducido. Ruling: fila u1 de la batería de `sdd-grilling` actualizada a la puerta vigente.

## Task 3 — Plantilla del prompt de arranque y salida de explore

6 sujetos, 0,58 $. Las salidas de e1 de la Task 2 están en el commit `3102c669`; las de aquí las sustituyen en `green/out/` (control tras editar la skill).

| Escenario | Puerta | Conducta |
| --- | --- | --- |
| e1-1, e1-2 | 2/2 `sdd-explore` | E1 pasa 2/2: dicen dónde se cancela, separan doc de inferencia y no crean rama, carpeta ni fila (`git status` limpio) |
| e2-1 | `sdd-explore` | E2 pasa: «**Subir el mínimo de Node a 22.18 en engines**» sin id ni «—», `Base: develop`, `feature/bump-node-engines-22-18` sola en su bloque, `Carril: config`, prompt que arranca con `sdd-propose` y lleva «Nada que saldar.», «Perfil delegate. Al fusionar, `sdd merge --push`.» y la frase «arráncalo»; `package.json` intacto |
| e2-2 | `sdd-explore` | E2 pasa, con la misma forma (`feature/node-22-18-engines`) |
| e3-1 | `sdd-explore` → `sdd-roadmap` | E3 pasa: «Como quieres hacerlo, va al roadmap: se lo paso a `sdd-roadmap`»; el roadmap propone la fila y espera el OK (`delegate`), sin `sdd-propose` ni rama |
| e3-2 | `sdd-explore` → `sdd-roadmap` | E3 pasa: propone la fila 0008 en «Próximo» y espera; sin rama ni carpeta |

RED → GREEN: e2 0/2 → 2/2, e3 0/2 → 2/2.

## Task 4 — `sdd-roadmap`: «dame el prompt», el patch como fila y el prompt en el cierre

10 sujetos (6 de GREEN y 4 de A/B), 2,36 $.

| Escenario | Puerta | Conducta |
| --- | --- | --- |
| m1-1, m1-2 | 2/2 `sdd-roadmap` | M1 pasa 2/2: «**0013 — Aviso semanal a los responsables**», `Base: develop`, `feature/0013-weekly-manager-notice` sola en su bloque, `Carril: feature`, prompt que arranca la 0013 con `sdd-propose`, requisitos en la propuesta 0010 «§Reglas de negocio (Aviso semanal) y §Enmiendas», «los lunes a las 8:00 (enmienda del 2026-10-03…)», «Nada que saldar.», «Perfil delegate. Al fusionar, `sdd merge --push`.» y la frase «arráncalo»; `git status` limpio |
| m2-1, m2-2 | 2/2 `sdd-roadmap` | M2 pasa 2/2: el cierre da el prompt de la 0009 (`feature/0009-room-occupancy-report`) con la forma fija y la frase «arráncalo» |
| m3-1, m3-2 | 0/2: `sdd-propose` | entran por `sdd-propose`, que propone partir en 3 filas. Ver el A/B |

**A/B de m3** (`ab/out/`): con el kit de la Task 3, antes de tocar `sdd-roadmap`, m3 entra 2 de 2 por `sdd-propose`; con el de la Task 4, también 2 de 2; con el kit de la apertura, que en el RED entró 2 de 2 por `sdd-roadmap`, ahora entra 2 de 2 por `sdd-propose`. El enrutado de esta frase varía sin cambio del kit (2 de 6 por roadmap y 4 de 6 por propose), y las dos puertas son defendibles: `using-sdd` manda a roadmap «una que el criterio de partir partiría», y x1 de la batería de `sdd-propose` espera propose. m3 solo medía el dimensionado, que salió por el RED: se retira de la batería y sus salidas de GREEN se descartan.

RED → GREEN: m1 0/2 → 2/2, m2 (prompt en el cierre) 0/2 → 2/2.

## Task 5 — c2 de `sdd-rubber-duck` y batería entera de `using-sdd`

La regla de decisiones de `sdd-propose` no se escribe: su RED (a5) salió limpio 2 de 2 (enmienda del 2026-10-10). 32 sujetos, 5,92 $. Salidas en `green-duck/out/` y `green-using/out/`: las dos baterías tienen escenarios `c1` y `c2` distintos.

| Batería | Resultado |
| --- | --- |
| `sdd-rubber-duck` (`control`) | c1 1/1 y c2 1/1 `sdd-explore`: «¿Cómo funciona la exportación?» entra por explore, no por el pato. Salda el escenario c2 pendiente de la 0146 |
| `using-sdd` (entera) | 21 de 21 escenarios en verde, con r6 («Dame el prompt de la 0013.» → `sdd-roadmap` 2/2). El renombrado y las `description` nuevas de `sdd-explore` y `sdd-roadmap` no mueven ninguna puerta |

## Coste de la campaña

66 sujetos, 11,80 $ y unas 2,5 h de reloj, frente a la previsión de 59 sujetos y ~32 $ (techo 39 $). Hay más sujetos y menos dinero de lo previsto: cuatro de RED más (e2 rehecho y m3), seis de A/B por la varianza de m3, y sujetos más baratos de lo estimado (~0,18 $ de media).

## Task 6 — el config se fusiona (desvío de la revisión final)

15 sujetos, 2,82 $.

| Escenario | Resultado |
| --- | --- |
| k5-1, k5-2 (`sdd-propose`) | K5 pasa 2/2: commit con `Gate:` en `feature/bump-node-22-18` y `merge: feature/bump-node-22-18 en develop`, sin push «como declara `sdd-kit.json`» |
| tramo `sdd-propose` de `using-sdd` (f1, f2, f3, p1, v1, c1w, pc1, bt1, t1, c2) | 10 de 10 en verde con las `description` de `sdd-start-feature` y `sdd-start-patch` ya legibles: siguen sin robar la puerta a `sdd-propose` |

RED → GREEN: k5 0/2 → 2/2.

## Pasada de fix de la re-revisión

La re-revisión del tramo `afb312aa..659fa8dd` (Opus, «con arreglos», 6 Important) acotó el paso 5 del carril config: solo fusiona una `feature/*` cuyo único commit sobre `merge.into` es el del config, y lo hace por las filas «Merge a develop» y «Push» de la tabla de gates, sin regla propia para el bloque `merge` ausente. Control: k5-1 (`refactor/out/`), `merge: feature/bump-node-22-18 en develop`. El tope de `sdd-propose` sube a 5.000 (mide 4.903; decisión 15 de la spec).
