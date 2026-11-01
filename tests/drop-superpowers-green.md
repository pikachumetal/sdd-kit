# GREEN — retirar la dependencia de superpowers (feature 0279)

Sujetos Sonnet sin `SUPERPOWERS_DIR`, salvo el control. 13 sujetos en la campaña, RED incluido, 2,68 $, frente a los 14,4 $ previstos: el molde `salas3` salta los pasos 1 a 6 y cada sujeto cuesta ~0,2 $, no los ~1,5 $ estimados. Salidas en `.docs/sdd/specs/20261101-175350-feature-0279-drop-superpowers-dependency/`, en `green/`, `green-s3/` y `green-sp/`.

| Escenario | Qué mide | Resultado | Evidencia |
| --- | --- | --- | --- |
| s1 (2) | Paso 10, con el «sí» | Pasa. Pregunta sin tocar nada; el «sí» quita las dos claves en `chore(sdd): quitar la activación de superpowers` | `green/out/s1-1`, `green-s3/out/s1-1` |
| s2 (2) | Paso 10, con el «no» | Pasa. El fichero no cambia, el marcador sí, y el informe da la edición a mano | `green/out/s2-1`, `green-s3/out/s2-1` |
| s3 | Marketplace compartido | Pasa. Quita `superpowers@…`, conserva el marketplace y dice que lo usa `elements-of-style` | `green-s3/out/s3-1` |
| f1, f2 | Entrada y carga sin la variable | Pasan. Entran por `sdd-kit:sdd-propose` | `green/out/f1-1`, `f2-1` |
| a1 | Tramo de `sdd-propose` | Pasa. Sigue a `sdd-grilling` sin la frase retirada | `green/out/a1-1` |
| fb1 | Ticket sin `superpowers_version` | Pasa. Cabecera con `kit_version: 3.0.0`, leída de `sdd-kit.json`, no el 2.4.0 de las notas | `green/out/fb1-1` |
| n1 | Humo de `sdd-init` | Carga y trabaja. No llega al paso 7: se paró en la aprobación del `CLAUDE.md` | `green/out/n1-1` |
| f1, f2 con superpowers 7.0.1 | Control de competencia | Pasan. La frase de `brainstorming` también entra por `sdd-propose` | `green-sp/out/` |

## Smoke del hook

Haiku directo, con `--setting-sources project`, porque el lanzador no carga el hook del proyecto. Resumen en `green/smoke/summary.txt`.

| Sesión | Skills del kit | De superpowers | Aviso |
| --- | --- | --- | --- |
| Con el kit | 20 | 0 | Ninguno: `using-sdd` inyectada, `sdd-grilling` invocada |
| Control, sin el plugin | 0 | 0 | `AVISO sdd-kit: esta sesión no tiene cargadas las skills del kit.` |

El control prueba que el hook del proyecto corre, así que el silencio del primero es real.

## Sin medir

- El paso 7 de `sdd-init` con un sujeto: lo cubren `settings.test.ts`, `readme.test.ts` y la paridad. Es una edición que solo quita texto.
- Paso 10 con `false` en un plugin, sin claves o con el fichero roto: reglas de texto, sin sujeto.
- n = 1 o 2: es humo, no prueba que la conducta aguante bajo presión. El uso real llega por los tickets.
