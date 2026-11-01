# GREEN — retirar la dependencia de superpowers (feature 0279)

Sujetos Sonnet sin `SUPERPOWERS_DIR`, salvo el control. 14 sujetos en esta tanda, RED incluido, 2,68 $, frente a los 14,4 $ previstos: el molde `salas3` salta los pasos 1 a 6 y cada sujeto cuesta ~0,2 $, no los ~1,5 $ estimados. Salidas en `.docs/sdd/specs/20261101-175350-feature-0279-drop-superpowers-dependency/`, en `green/`, `green-s3/` y `green-sp/`.

| Escenario | Qué mide | Resultado | Evidencia |
| --- | --- | --- | --- |
| s1 (2) | Paso 10, con el «sí» | Pasa. Pregunta sin tocar nada; el «sí» quita las dos claves en `chore(sdd): quitar la activación de superpowers` | `green/out/s1-1`, `green-s3/out/s1-1` |
| s2 (2) | Paso 10, con el «no» | Pasa. El fichero no cambia, el marcador sí, y el informe da la edición a mano | `green/out/s2-1`, `green-s3/out/s2-1` |
| s3 | Marketplace compartido | Pasa. Quita `superpowers@…`, conserva el marketplace y dice que lo usa `elements-of-style` | `green-s3/out/s3-1` |
| f1, f2 | Entrada y carga sin la variable | Pasan. Entran por `sdd-kit:sdd-propose` | `green/out/f1-1`, `f2-1` |
| a1 | Tramo de `sdd-propose` | Pasa. Sigue a `sdd-grilling` sin la frase retirada | `green/out/a1-1` |
| fb1 | Ticket sin `superpowers_version` | Pasa. Cabecera con `kit_version: 3.0.0`, leída de `sdd-kit.json`, no el 2.4.0 de las notas | `green/out/fb1-1` |
| n1 | Humo de `sdd-init` | Carga y trabaja. No llega al paso 7: se paró en la aprobación del `CLAUDE.md` | `green/out/n1-1` |
| f1, f2, f3 con superpowers 7.0.1 | Control de competencia | Pasan. La frase de `brainstorming` también entra por `sdd-propose` | `green-sp/out/` |

## Tras la revisión final

Suben la campaña a 21 sujetos y 4,29 $, con la pasada de arreglos en `green-fix/` y `green-fix2/`.

| Escenario | Qué mide | Resultado |
| --- | --- | --- |
| s4 | Paso 10 tras una migración 2.x real, con tablas, gates y persona | Pasa: pregunta tras el marcador; commits del marcador, de reglas y de superpowers por separado |
| s1, s2, s3 | Control tras reescribir el paso 10 | Pasan la rúbrica. **El informe del «no» no sale literal**: solo `green-s3/out/s2-1` lleva «Superpowers sigue declarado»; `green/` y `green-fix/` dan la edición a mano parafraseada y sin la condición del marketplace. Las claves son correctas |
| r1 antes del arreglo, en `red-rules/` | «Revisa las reglas…» con el proyecto en 3.0.0 | Hace la tabla. El defecto que señalaron dos ejes no se reproduce: no abre el paso 10 en su lugar. Sí ofrece aparte quitar superpowers |
| r1, en `green-fix/`, con «rules-review step» | Lo mismo | **Falla R1**: mete quitar superpowers como punto 2 de «¿Aplico estas propuestas?» |
| r1, en `green-fix2/`, con «run only…» | Lo mismo | Pasa R1: tabla correcta y `.claude/settings.json` intacto, y una oferta aparte, sin escribir. Medido en un solo turno y con n = 1. Aparece también el aviso de versión, porque el molde va en 3.0.0 con el kit en 2.3.4 |

## Smoke del hook

Haiku directo, con `--setting-sources project`, porque el lanzador no carga el hook del proyecto. Resumen en `green/smoke/summary.txt`.

| Sesión | Skills del kit | De superpowers | Aviso |
| --- | --- | --- | --- |
| Con el kit | 20 | 0 | Ninguno: `using-sdd` inyectada, `sdd-grilling` invocada |
| Control, sin el plugin | 0 | 0 | `AVISO sdd-kit: esta sesión no tiene cargadas las skills del kit.` |

El control prueba que el hook del proyecto corre, así que el silencio del primero es real.

## Sin medir

- El paso 7 de `sdd-init` con un sujeto: lo cubren `settings.test.ts`, `readme.test.ts` y la paridad. Es una edición que solo quita texto.
- Paso 10 con `false` en un plugin o sin claves: reglas de texto, sin sujeto. Con el fichero roto, el paso 7 falla antes y el paso 10 no llega.
- n = 1 o 2: es humo, no prueba que la conducta aguante bajo presión. El uso real llega por los tickets.
