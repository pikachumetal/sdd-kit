# Lectura de los sujetos — feature 0310

Veredicto de la puerta con `node tests/headless/battery.mjs verdict`; el de la conducta, a mano con la rúbrica de cada batería. Los sujetos van en sonnet; la carpeta de cada tanda guarda `texts.txt`, `tools.txt`, `state.txt` y lo que dejó el sujeto.

| Tanda | Kit | Sujeto | Puerta | Conducta | $ |
| --- | --- | --- | --- | --- | --- |
| GREEN (`green/out`) | `09f226c` | `n2-1` (`sdd-init`) | verde | R1-R4 pasan; el borrador de `operations.md` lleva título, secciones y etiquetas de campo literales de `operations-template.md`, en orden, y omite E2E, Frontend y Entornos diciendo por qué (la plantilla no tiene tablas: se mira en secciones y etiquetas) | 0,23 |
| GREEN (`green/out`) | `e7be078` | `r4-1` (`sdd-retro` → `sdd-end-release`, `add-to-changelog`) | verde | R1-R6 y L pasan; `CHANGELOG.md` sellado en `## [1.4.0]` con `smoke: pendiente` (no corrió smoke) y una línea por entrada (en `tools.txt`: el fichero no se guarda en la salida) | 0,18 |
| GREEN (`green/out`) | `d265042` | `fb1-1` (`sdd-feedback`) | verde | F1, P y L pasan: versión de `sdd-kit.json`, 2.4.0 de las notas descartada, coste «sin respaldo»; dominio como «exportar un listado a hoja de cálculo» | 0,20 |
| REFACTOR (`refactor/out`) | `d265042` | `fb1-1`, `fb1-2` | verde, verde | `fb1-1` pasa; **`fb1-2` rojo en P**: id y título «exportar-excel» / «exportar a Excel». No hizo el repaso del paso 5, que decía «before saving» tras el paso 4, que guarda | 0,39 |
| Control (`control/out`) | `develop` (`dc74103c`) | `fb1-1` | verde | F1, P y L pasan (id «plan-rehecho») | 0,20 |
| Tras la pasada de fix (`fix/out`) | pasada de fix (juntada en el cierre) | `fb1-1` | verde | F1, P y L pasan (slug «exportar-datos»; repasa la privacidad tras guardar) | 0,18 |
| Tras la pasada de fix (`fix/out`), enmienda | pasada de fix (juntada en el cierre) | `fb1-2` | verde | F1, P y L pasan (id «plan-rehecho»; repasa la privacidad con `sed` tras guardar; 3.0.0 de `sdd-kit.json`, 2.4.0 de las notas sin comprobar) | 0,28 |

Campaña: 8 sujetos, 1,65 $ (previsión enmendada: 8 sujetos, 1,37 $). `battery.mjs verdict` da `fb1 · 1/1` sobre `fix/out` porque la batería declara n = 1; los dos sujetos se leen a mano arriba.
