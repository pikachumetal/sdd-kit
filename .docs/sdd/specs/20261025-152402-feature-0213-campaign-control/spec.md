---
id: 20261025-152402-feature-0213-campaign-control
feature: 0213
parent: 0170
title: Control de campaña en tests/headless/run.sh
mode: full
profile: delegate
status: approved
created: 2026-10-25
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-25
---

# Spec — Control de campaña en `tests/headless/run.sh`

🦆 Hoy quien lanza una campaña de sujetos con `run.sh` vigila a mano lo que el lanzador no controla: que una tanda nueva no pise la anterior, que no corran más de 5 sujetos a la vez, que lo ya lanzado no pase del techo de dólares, y sumar el coste por carpeta. Con esta feature, relanzar `p1` con `SUBJECT=2` cuando `p1-2` ya existe sale como «ya existe p1-2: sube SUBJECT» y no se pierde nada; con `COST_CAP=9`, 7,36 $ gastados y dos sujetos en curso a ~0,8 $, el tercero no sale; y al acabar se lee `green: 6 sujetos · 2.10 $` junto a `green-premature: 3 sujetos · 0.90 $`. Un ensayo en seco ya no ensucia la carpeta de la spec, y un sujeto que intenta lanzar su propio `claude` recibe un error en vez de gastar fuera de la cuenta. `tech-stack.md` gana una tabla con el coste mediano por tipo de sujeto, para que la previsión parta de datos.

## Capacidades

- Ninguna, porque herramientas: `tests/headless/` es el arnés de pruebas del propio repo; ningún proyecto consumidor lo ve.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: contrato público (las variables de run.sh las consumen battery.sh y el subject.sh de cada campaña) · tamaño: ~150 líneas en 6 ficheros
- Técnica: si el recuento de sujetos en curso entre dos run.sh a la vez (decisión 4) cuenta bien con los PID de Git Bash, y si battery.sh sigue dando su veredicto con las salidas en seco fuera de SPEC_DIR (decisión 7)
- Mínimo razonable: ninguna — lo que la técnica miraría lo cubren los casos de Pester de «Dónde se prueba» y la comprobación de la decisión 4 al empezar la Task 1
```

1. **Etiqueta existente**: `run.sh` no lanza una etiqueta que ya tiene `<etiqueta>.tools.txt` en el `out/` de su fase; imprime `ya existe <etiqueta>: sube SUBJECT` y sigue con el siguiente escenario — literal de la fila del roadmap.
2. **`SUBJECT_COST`**: coste estimado por sujeto, opcional; por omisión `COST_CAP / SUBJECT_CAP`, la media de la previsión de la spec — sin variable obligatoria nueva, ninguna campaña existente se rompe.
3. **Techo de coste con lo lanzado**: no se lanza si `gastado + (en curso + 1) × SUBJECT_COST` pasa de `COST_CAP` (estrictamente mayor). Mensaje: `techo de <COST_CAP> $ alcanzado (<gastado> $ gastados, <n> en curso a <SUBJECT_COST> $)`, que conserva el prefijo del mensaje de hoy.
4. **En curso entre lanzadores**: cada sujeto que lanza `run.sh` deja una marca con su PID en `RUNS_DIR/live/<fase>.<etiqueta>` y la borra al terminar. En curso = marcas con el proceso vivo; así dos `run.sh` a la vez sobre el mismo `RUNS_DIR` se ven (el caso de la feature 0091 eran tres llamadas). La Task 1 empieza comprobando que `kill -0` de Git Bash ve el PID de otro `bash`; si no lo ve, la marca sola cuenta como en curso y se dice como desvío.
5. **Cortados sin salida**: una marca cuyo proceso ya no vive y sin `tools.txt` es un sujeto cortado (`TaskStop`, máquina caída): cuenta como sujeto para `SUBJECT_CAP` y como `SUBJECT_COST` en lo gastado, y el informe final lo dice. Salda la segunda mitad de la fila de `COST_CAP` (el sujeto parado antes de `subject_save` que `spent()` no contaba).
6. **`MAX_PARALLEL`**: por omisión 5 (el máximo medido en la feature 0091). Con el tope lleno, `run.sh` espera a que acabe uno, imprime una vez `esperando hueco: <n> sujetos en curso (MAX_PARALLEL=<m>)` y vuelve a mirar parada, techo de sujetos y techo de coste antes de lanzar. El `CHUNK=5` de `battery.sh` sale: lo hace `MAX_PARALLEL`.
7. **Ensayo en seco fuera de la spec**: con `DRY_RUN=1`, las salidas van a `RUNS_DIR/dry/<fase>/out` y el recuento y los techos miran `RUNS_DIR/dry/*/out`, no `SPEC_DIR`; la línea final añade `en seco: salidas en <ruta>`. `battery.sh` da el veredicto sobre esa misma carpeta. Repetir un ensayo con la misma etiqueta da «ya existe»: se borra `RUNS_DIR/dry` o se sube `SUBJECT`.
8. **`claude` anidado bloqueado**: el sujeto arranca con una carpeta por delante en su `PATH` con un `claude` (y `claude.cmd`, para el tool PowerShell) que imprime `claude anidado bloqueado en un sujeto: run.sh no ve su coste` y sale con 1. Elegido frente a `--disallowedTools "Bash(claude:*)"` porque los sujetos de la 0173 lo lanzaron dentro de cadenas (`cd … && claude -p`, `timeout 240 claude`) y desde scripts, que una regla por prefijo no ve. Se comprueba con un sujeto real (decisión 11). Sin opción para permitirlo: ninguna campaña lo ha pedido.
9. **Coste por carpeta al acabar**: antes de la línea final de hoy, una línea por carpeta de `SPEC_DIR` (o de `RUNS_DIR/dry` en seco) con `out/`: `<carpeta>: <n> sujetos · <$> $`, y ` · <k> sin RESULTADO` si los hay; después `cortados sin salida: <n> (contados a <SUBJECT_COST> $ cada uno)` si los hay. Suma desde los `tools.txt` (último `RESULTADO` de cada uno, como `spent()`): los `.jsonl` viven en el scratchpad y no tienen coste si el sujeto no llegó al `result`. La fila pedía «sumado desde los `.jsonl`»; lo que separa válidos de invalidados es la carpeta (`green` frente a `green-premature`), y eso sí lo da. La línea final (`sujetos de la campaña: … · coste acumulado: … $`) no cambia de forma.
10. **Tabla de coste por tipo de sujeto** en `tech-stack.md` («Sujetos headless»): n y coste mediano por tipo (enrutado, primera pregunta, cierre, migración, init y «otros»), sacada una vez de los `=== RESULTADO` de `specs/*/{red,green}/out/*.tools.txt` con un script de un solo uso en el scratchpad, que no se versiona; la tabla dice su fecha y la regla con que clasifica (la skill medida de cada campaña). La regla «El techo de coste y el de sujetos los aplica el lanzador» añade que la previsión parte de esa tabla.
11. **Previsión de coste**: 1 sujeto real con `MODEL=haiku` para comprobar la decisión 8, ~0,05 $ y ~3 min; techo `SUBJECT_CAP=2`, `COST_CAP=0.5`. No es una prueba de skill (Art. I no aplica: no se toca texto de ninguna skill).
12. **`lib.sh` entra**, aunque la fila 0213 solo nombra `run.sh`: el `PATH` del sujeto se monta en `run_claude`. La 0214 también edita `lib.sh`; el choque, si sale, es de pocas líneas.
13. **Tope de `tech-stack.md`**: el texto nuevo (tabla y frases) se compensa con lo que se retira (filas 137 y 160 de `tech-stack.md`, ver «Lo que se retira»), pero el fichero está a 2 palabras de su tope; ver «Topes de palabras».
- `sdd capability merge` sobre una copia de `.docs/sdd`: «Sin delta que fusionar».
- Sin presentación del diseño por secciones: la regla 3 del `CLAUDE.md` del repo (perfil `delegate`, sin preguntas intermedias) manda sobre `spec-writing.md`.
- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo (el sujeto real va solo) · en paralelo hasta `control.maxParallelAgents`.

### Decisiones tomadas con el dev-lead

- Nace de partir la 0170 por umbral; `parent: 0170` — «Partir en 3» (2026-10-25).
- La (d) de «Herramientas de campaña» (coste por carpeta de salida al acabar) entra aquí; la (b), la (c) y la (e) van a la 0214 — prompt de arranque, 2026-10-25.
- Perfil `delegate`; al fusionar, `sdd merge --push` — prompt de arranque, 2026-10-25.

## Intent

Hoy `run.sh` lanza a la vez todos los escenarios que recibe, mira el techo de coste solo con lo ya terminado, cuenta los ensayos en seco como sujetos de la spec y sobrescribe una etiqueta que ya existe; quien lanza la campaña lo suple a mano (tandas de 5, sumas del coste, renombrar carpetas) y las filas de deuda recogen lo que se perdió por no hacerlo: un `p1-2` de 0,62 $, una campaña que acabó en 9,65 $ con techo de 9, una tanda de 10 caída por `fork`, sumas mal hechas tres veces. El éxito es que esas seis cosas las haga el lanzador, cada una con su caso en `tests/HeadlessLauncher.Tests.ps1`, y que la previsión de una campaña parta de una tabla con datos. Fracasa si una campaña de hoy deja de lanzar sin cambiar sus variables.

## Scope

- Entra: decisiones 1 a 10 en `tests/headless/run.sh`, `tests/headless/lib.sh` (decisión 8), `tests/headless/battery.sh` (decisiones 6 y 7) y una carpeta nueva `tests/headless/no-claude/` con los dos `claude` falsos; sus casos en `tests/HeadlessLauncher.Tests.ps1` y `tests/Battery.Tests.ps1`; la cabecera de `run.sh` y `lib.sh` con las variables nuevas; `tech-stack.md` («Sujetos headless»: la tabla, la regla del techo y las líneas que se retiran); las filas de deuda que salda en `roadmap.md`.
- No entra: lo de la 0214 (`seed_transcript`, `MSYS2_ARG_CONV_EXCL`, `subject_ports`, `deny-kill.mjs`, `core.longpaths`, `KIT_DIR` sin `.docs/`, el nombre real como fallo, dos sujetos en paralelo en el repo del kit, molde de cierre vivo, líneas largas en `extract.mjs`, `cualquiera` en «Esperado», perfil de configuración del sujeto); un generador versionado de la tabla de coste; permitir `claude` anidado con una opción; medir el coste de un sujeto cortado desde los `usage` de su `.jsonl`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Lanzar todos los escenarios a la vez | `tech-stack.md:143` («`run.sh` lanza a la vez todos los escenarios de `SCENARIOS`: para ir en serie, una llamada por escenario»); cabecera de `run.sh` | Scope: pasa a «hasta `MAX_PARALLEL` a la vez; `MAX_PARALLEL=1` va en serie» |
| Tandas de 5 a mano | `tech-stack.md:160` (feature 0091); `battery.sh` `CHUNK=5` y su comentario de cabecera | Scope: la línea queda en su hecho medido y nombra `MAX_PARALLEL`; `CHUNK` sale (decisión 6) |
| Una tanda más reutiliza la etiqueta | `tech-stack.md:137` (feature 0032) | Scope: sale; lo impide `run.sh` (decisión 1) |
| Techo de coste con lo terminado y su mensaje `techo de N $ alcanzado (X $)` | `run.sh:31`; `tech-stack.md:184`; `HeadlessLauncher.Tests.ps1:201` | decisión 3: el mensaje gana el paréntesis largo |
| Salidas en seco en `SPEC_DIR` | `run.sh:18`; `battery.sh` (veredicto sobre `$SPEC_DIR/$PHASE/out`); `tech-stack.md:133` («`DRY_RUN=1` recorre la campaña sin `claude -p` ni coste»); los casos de `HeadlessLauncher.Tests.ps1` y `Battery.Tests.ps1` que buscan las salidas en la spec | decisión 7; los tests buscan en `RUNS_DIR/dry` |
| Recuento `before + launched` | `run.sh:23-26` | decisiones 4 y 5: lo sustituyen las marcas de `RUNS_DIR/live` |

- Filas que implementa: 0213 y las de «Deuda técnica» con **Actuar → 0213**: `roadmap.md:169` (`claude -p` anidado), `:186` (la (d) de «Herramientas de campaña»), `:291` (coste por tipo de sujeto), `:314` (etiqueta existente), `:315` (`COST_CAP` y lo lanzado), `:316` (`MAX_PARALLEL`), `:364` (ensayo en seco) → se marcan saldadas al cerrar, la `:186` como parcial si la 0214 no ha cerrado antes. Ninguna aparece en `skills/` ni en `capabilities/`: comprobado con la búsqueda de `0213` en `skills/**` y `.docs/sdd/capabilities/**` (ningún fichero).

## Approach

Todo en el lanzador y su biblioteca, sin tocar el `subject.sh` de ninguna campaña: `run.sh` gana un recuento de sujetos (terminados por `tools.txt`, en curso y cortados por las marcas de `RUNS_DIR/live`) que usan los tres techos y la espera de `MAX_PARALLEL`; la raíz de las salidas es `SPEC_DIR` o, en seco, `RUNS_DIR/dry`; el informe final agrupa por carpeta. El `claude` anidado se corta por `PATH` en `run_claude` de `lib.sh`. La tabla de coste se calcula una vez y se escribe a mano en `tech-stack.md`.

## Dónde se prueba

- Etiqueta existente, techo con lo lanzado, cortados sin salida, `MAX_PARALLEL` (también con dos `run.sh` a la vez), ensayo en seco fuera de `SPEC_DIR` y coste por carpeta: `tests/HeadlessLauncher.Tests.ps1`, en seco como los casos actuales; la concurrencia, con un `subject.sh` que duerme y apunta su entrada y salida.
- Veredicto de `battery.sh` con las salidas en seco y sin `CHUNK`: `tests/Battery.Tests.ps1`, los casos actuales.
- `claude` anidado: `HeadlessLauncher.Tests.ps1` con un `claude` falso que, lanzado como sujeto, ejecuta `claude` y deja lo que recibe; y un sujeto real (decisión 11), cuyo `tools.txt` muestra el mensaje de bloqueo. El sujeto real no se versiona: va al walkthrough.
- Tabla de coste: lectura; el walkthrough guarda el recuento por tipo que dio el script.

## Términos y ADR

- Términos resueltos: **sujeto en curso** — lanzado por `run.sh`, con su proceso vivo y sin `tools.txt`; **sujeto cortado** — con marca, sin proceso y sin `tools.txt`.
- ADR candidatas: ninguna.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `.docs/sdd/tech-stack.md` | 19278 / 19280 | 2 | 19663 (medido + previsto 0, lo nuevo se compensa con lo que sale, + 2 % para la pasada de fix) |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-25 | aprobada (opción «Apruebo») |
