---
id: 20261019-122910-feature-0202-close-loose-ends
feature: 0202
title: Walkthrough — Cierra lo que quedó abierto en la 0193 y la 0201
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-19
---

# Walkthrough — Cierra lo que quedó abierto en la 0193 y la 0201

## 1. Cambios realizados

- **`tech-stack.md`** (`3b8f97e3`): mergiraf 0.20.0 pasa a ser herramienta obligatoria para desarrollar el kit, y entra el descarte del merge driver. Su tope de palabras sube de 18800 a 19280, por decisión del dev-lead. Los tests de Mergiraf ya no se saltan: sin `mergiraf` en el PATH, uno falla con el aviso de instalarlo.
- **Mergiraf solo sobre código** (`03348530`): no se lanza sobre `.docs/` ni sobre `*.md`, así que lo que une lo verifica siempre `--verify`. Tests nuevos:
  - Con `myers`, mover una función y cambiar otra da conflicto, y `sdd merge` lo fusiona con `histogram` sin Mergiraf.
  - Dos imports compatibles se unen.
  - `publishedBack` da «vuelta: no se pudo consultar».
- **Ids repetidos** (`d05c68bf` y la pasada de fix):
  - `sdd roadmap check` avisa, sin fallar, de un id repetido en la primera columna `#` o `id` de una tabla.
  - Tras cada merge del cierre y de `--sync`, `sdd merge` quita de los cinco registros las filas idénticas que quedaron repetidas, con un commit propio, y avisa de las distintas.
  - Lo que ya estaba repetido en la rama destino no se toca. En el cierre, la destino es la rama antes del merge; en `--sync`, la ref de la base.
  - La columna de id es la de la tabla en la que cae cada fila: dos patches del mismo día no son un id repetido.
- **`session tokens`** (`67bfd0e3` y la pasada de fix):
  - Una rama sin transcripts propios se mide por ventana: desde su creación (reflog) hasta su último merge, la creación de otra rama sin transcripts o ahora.
  - Solo cuenta la sesión que creó la rama (`-b`, `-B`, `-c`, `-C`, `--branch` o `git [-C <ruta>] branch`), y solo sus respuestas de ramas ya fusionadas.
  - El reloj es de pared desde la creación.
  - Una rama fusionada no cuenta lo posterior a su último merge.
  - Lo dice una quinta línea, `Medición:`, y el campo `window` del `--json`.
- **Los menores de la 0201** (`27e6d6b7`):
  - `onSolved` y `onUnsolved` en Mergiraf, `abortedMergeError`, sin `void`.
  - La cabecera de una tabla de la base no cuenta como fila con id.
  - Tests: el destino sacado por un fichero sin seguimiento, HEAD intacto y la cabecera en la unión por id.
- **Fixes descubiertos:**
  1. Una fila nueva de la rama partía la tabla.
  2. La ventana contaba una sesión ajena que solo nombraba la rama.
- Commits: apertura `61649b5c`, tasks `3b8f97e3`, `03348530`, `d05c68bf`, `67bfd0e3` y `27e6d6b7`. La pasada de fix y las correcciones de la re-revisión van juntadas en el cierre.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 4 h
- Esfuerzo real: 2,06 h — reloj de la sesión 8,19 h desde 2026-10-19T12:29Z, sin 368 min de espera al dev-lead (6 esperas)
- Desviación: −1,94 h (−49 %)
- Causa de la desviación: la estimación pesó la ventana de `session tokens` como lo más incierto. Salió en una task, aunque la revisión final y las mediciones reales destaparon dos fixes y una ronda más de re-revisión. Es la misma tendencia que la 0193 y la 0201.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 108.795.930 — claude-opus-5-5 108.795.930
- Tokens de subagentes: 7.481.230 en 6 despachos — 0202 final review — Code axis claude-sonnet-5-5 1.121.781 / 2 min; 0202 final review — Spec axis claude-opus-5-5 2.574.993 / 5 min; 0202 final re-review claude-opus-5-5 165.177 / 0 min, en curso; 0202 final re-review claude-opus-5-5 3.145.430 / 365 min; 0202 spec review — dominio claude-opus-5-5 317.958 / 1 min; 0202 spec review — técnica claude-sonnet-5-5 155.891 / 1 min
- Coste de la sesión: 42,12 $ (hilo 34,12 $ + subagentes 8,00 $)
- Medición: por ventana — transcripts de D:\code\.worktrees\sdd-kit\0193-better-merge desde 2026-10-19T12:29Z (la rama no tiene transcripts propios)
- Coste de sujetos: no aplica
- Review de spec: 2 revisores (dominio opus, técnica sonnet) · hallazgos 20, aceptados 18

## 3. Desviaciones del plan

Hay cuatro enmiendas, todas en la spec:
- La ventana también se aplica a un worktree sin carpeta de transcripts (aprobada).
- La cabecera: una tabla con las dos filas (aprobada).
- Solo cuenta la sesión que creó la rama (aprobada).
- Dos aclaraciones sin cambio de THEN: la primera columna de id en `roadmap check`, y el último merge en `countable`.

La decisión 8 de la 0193 («no se buscan duplicados fuera de los trozos en conflicto») queda superada por la limpieza tras fusionar (punto 13 de la spec). El worktree de la feature se borró en una limpieza del dev-lead a mitad del cierre y se recreó desde la rama; solo se perdió un arreglo sin commitear de 4 líneas, rehecho en el cierre.

### Decisiones tomadas sin el dev-lead

Los rulings de `tasks.md`, en resumen:
- Sin `mergirafSolved`: restringir Mergiraf a código basta para que `--verified-at` no se salte lo que une.
- `countable` usa el último merge, para no contar dos veces lo que pasa entre el primero y el del ticket.
- Los tests de limpieza viven en `cleanup.slow.test.ts`.
- Los fallos de los tests de cerrojo eran de ejecutar vitest sin `--test-timeout 120000`.
- Un fallo de push bajo carga no se reprodujo en tres gates.
- La re-revisión se relanzó una vez y verificó ella misma sus correcciones posteriores.

## 4. Verificación

### 4.1 Builds

- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → `cli:test` 1072/1072, `cli:test-slow` 257/257 (con mergiraf 0.20.0), `cli:test-min` 1329/1329, `kit:test` 1325 pass / 0 fail · 604 s · sobre la última corrección, juntada en el cierre.
- Revisión final: Spec opus+high, con arreglos (7 Important, 7 Minor) · Código sonnet+high, con arreglos (1 Important, 6 Minor) · Arquitectura no (plan), sobre `27e6d6b7`. Todo arreglado con su test RED→GREEN, menos 2 hallazgos resueltos por ruling. La re-revisión (opus+high) dejó 2 Important y 5 Minor nuevos; se arreglaron, y el mismo re-revisor los dio por ADDRESSED.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-19 · suite completa verde (cli 1072 + slow 257 + min 1329, kit 1325/0) · medición real de la 0201 y la 0202 con `session tokens` · revisión final Spec y Código sobre 27e6d6b7, re-revisión sin hallazgos abiertos

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Fila idéntica en dos sitios: queda una, con commit propio | suite | `cleanup.slow.test.ts`, en los cinco registros y en `--sync` |
| Filas distintas con el mismo id: se quedan y se avisan | suite | `cleanup.slow.test.ts` |
| Lo ya repetido en la destino no se toca; Added y Changed no se tocan | suite | `cleanup.slow.test.ts` |
| Si el commit de limpieza falla, el merge se deshace | suite | `cleanup.slow.test.ts` |
| Mergiraf une imports compatibles y no toca `.md` ni `.docs/` | suite | `mergiraf.slow.test.ts` |
| `--verified-at` no omite lo que unió Mergiraf | suite | `mergiraf.slow.test.ts` |
| La cabecera no es una fila con id; la misma tabla nueva queda una | suite | `keyed.test.ts`, `registries.slow.test.ts` |
| `roadmap check` avisa de un id repetido, tras los fallos y con 0 | suite | `duplicates.test.ts`; el roadmap del kit da «Roadmap válido» sin avisos falsos |
| `--branch` corta en el último merge, en las cuatro líneas | suite | `window.slow.test.ts` |
| Rama sin transcripts: ventana, quinta línea, `window` en el json | ejecución real | `sdd session tokens` de la 0201 (0,35 h, 5,06 $) y de la 0202, con la línea `Medición:` |
| Ventana: rama viva, fusionada después, otra rama creada, sin reflog, vacía | suite | `window.slow.test.ts` |
| `histogram` resuelve lo que `myers` deja en conflicto | suite | `histogram.slow.test.ts` |
| «vuelta: no se pudo consultar» | suite | `hotfix.test.ts` |
| Sin `mergiraf` en el PATH, el test falla con su aviso | ejecución real | `vitest` con el PATH sin `.cargo/bin`: falla con «mergiraf no está en el PATH…» |

### 4.3 Residuales / deuda generada

Ninguna. Ningún Minor queda diferido y no se abren filas de deuda (punto 2 de la spec).

## 5. Aprendizajes

- Una medición por ventana de tiempo necesita saber qué sesión trabajó en la rama: «nombrar la rama» no basta (un `git worktree list` la nombra), y crearla sí. Queda en el código, con su `shortcut:` para el caso del `/clear`.
- Un test que ajusta la fixture después del RED puede dejar de probar lo que dice. Lo encontró la re-revisión en el test del reloj: cada fixture del RED tiene que seguir distinguiendo el fallo después de los cambios.
- Ejecutar vitest a mano sin `--test-timeout 120000` da falsos fallos en los tests lentos: hay que usar `moon run cli:test-slow`. Ya lo dice `tech-stack.md` («Conjunto rápido y tests lentos»).

## 6. Adendas
