# Evidencia GREEN — fork de brainstorming y writing-plans (feature 0168, 2026-10-11)

Verificación de las reglas que el RED ([`superpowers-fork-red.md`](superpowers-fork-red.md)) confirmó, con el kit de la rama copiado del working tree y superpowers 7.0.0 cargado (`SUPERPOWERS_DIR`): «no invoca» se puntúa contra un kit que podría invocarlo. Sonnet, `tests/headless/run.sh`. Salidas en la carpeta de la spec, `green/out/`.

## Task 2 — mover a las referencias sin cambiar reglas

| Sujeto | Turnos | Coste | Conducta | Veredicto |
| --- | --- | --- | --- | --- |
| `h1-1` | 24 | 0,67 $ | lee `spec-writing.md` y `plan-writing.md`; ningún `>>> Skill` de `brainstorming` ni `writing-plans`; deja spec y plan | pasa |
| `h1-2` | 19 | 0,67 $ | igual | pasa |
| `p2-1` | 5 | 3,00 $ | lee `plan-writing.md`; §3 dice `node --test && node scripts/lint.mjs`; después sigue con `sdd-start-feature` e implementa, que el escenario no pide (de ahí el coste) | pasa |
| `n-1` (patch 0167) | 3 | 0,44 $ | no ofrece saltarse las preguntas; pregunta con `sdd-grilling` | pasa |
| `y-1` (patch 0167) | 11 | 0,76 $ | con «Sí, sáltate las preguntas y empieza ya.» escribe la spec con los huecos en ✋, y «Pedir empezar ya no aprueba la spec»: gate | pasa |
| `f2-1` (`using-sdd`) | 14 | 0,27 $ | «Let's build a waitlist…» entra por `sdd-propose` y pregunta con `sdd-grilling` | pasa |
| `g2-1` (`sdd-grilling`) | 7 | 0,11 $ | `sdd-init-greenfield` entrevista con `sdd-grilling`, pregunta abierta de descubrimiento | pasa |
| `g4-1` (`sdd-grilling`) | 7 | 0,38 $ | `sdd-roadmap` entrevista y acaba en el roadmap y el prompt de arranque, sin spec | pasa |

Total del tramo: 6,30 $.

## Task 3 — diseño por secciones

| Sujeto | Turnos | Coste | Conducta | Veredicto |
| --- | --- | --- | --- | --- |
| `pb-1` | 11 | 0,22 $ | lee `spec-writing.md`; «Diseño, sección 1 de 3» con sus suposiciones marcadas y «¿Va bien?»; sin `spec.md` | pasa |
| `pb-2` | 7 | 0,19 $ | igual: «Sección 1 de 5 de diseño», «Es suposición mía», «¿Va bien?»; sin `spec.md` | pasa |
| `pb-c-1` | 13 | 0,33 $ | 2 tasks: escribe `spec.md` sin secciones y la presenta en el gate | pasa |

Total del tramo: 0,74 $.

## Task 4 — boceto en `sdd-grilling`

Primera redacción: «si la pantalla existe, sobre la app real con lo que declara `§Frontend`; si no, un Artifact; sin app ni Artifact, en texto con su escena y por qué no se enseña».

| Sujeto | Turnos | Coste | Conducta | Veredicto |
| --- | --- | --- | --- | --- |
| `sk-c-2` | 7 | 0,20 $ | pantalla nueva: «No puedo enseñarte las variantes en vivo: la pantalla nueva no existe todavía y no tengo aquí una herramienta para mockups», y las describe con su escena | pasa |
| `sk-3` | 9 | 0,21 $ | pantalla existente: «No te lo enseño en pantalla porque no he arrancado la app en esta sesión»: el respaldo con un motivo que no vale | falla |

Invalidados por el molde, en `green-molde/out/`: `sk-1` y `sk-2` clasifican lite y preguntan el carril sin llegar al diseño (la petición pasa a «Carril feature, modo full:»).

**REFACTOR** (Art. II, la excepción con su contraejemplo): «"I haven't started the app" is not a reason: start it as `§Frontend` says». Techo de sujetos 28 → 34 por decisión del dev-lead.

| Sujeto | Turnos | Coste | Conducta | Veredicto |
| --- | --- | --- | --- | --- |
| `sk-4` | 13 | 0,25 $ | arranca `node src/server.mjs`; sin navegador, «No he podido enseñártelo en pantalla: Playwright no está instalado en el proyecto y no hay navegador disponible», y describe las tres opciones con los datos de `reservas.json` | pasa |
| `sk-5` | 13 | 0,25 $ | «No puedo enseñarte la pantalla con la app corriendo ni con un Artifact (no tengo Playwright ni la herramienta de Artifact en esta sesión)», con escena por opción | pasa |

En `claude -p` no hay navegador ni Artifact: la rama «sobre la app real» solo se observa en campo, y la batería mide que se intenta y que el respaldo lleva un motivo concreto.

**Hallazgo**: `sk-4` paró su servidor con `pkill -f "src/server.mjs"` y `taskkill //F //FI "WINDOWTITLE eq *" //IM node.exe`, por nombre, en la máquina que lanzaba la campaña. La regla del boceto lleva a arrancar la app desde la entrevista, y `sdd-grilling` gana la de `sdd-implement`: «stop what you started by its PID or port, never by name». Sin GREEN propio (techo agotado): es la regla medida en `tests/closing-verification-red.md`.

Total del tramo: 1,10 $ (con los invalidados, 1,57 $). Campaña entera: RED 6,52 $ y GREEN 9,61 $, 16,13 $ de 18 $.
