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
