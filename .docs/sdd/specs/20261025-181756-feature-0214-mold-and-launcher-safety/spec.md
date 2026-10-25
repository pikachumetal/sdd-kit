---
id: 20261025-181756-feature-0214-mold-and-launcher-safety
feature: 0214
parent: 0170
title: Molde y seguridad de tests/headless/lib.sh, extract.mjs y battery.mjs
mode: full
profile: delegate
status: approved
created: 2026-10-25
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-25
---

# Spec — Molde y seguridad de `tests/headless/lib.sh`, `extract.mjs` y `battery.mjs`

🦆 Quien lanza una campaña de sujetos deja de depender de acordarse de cada guarda: un sujeto que intenta `taskkill //IM node.exe` recibe un «denegado» y los MCP del dev-lead siguen vivos, y lo que dejó escuchando en sus puertos se para al acabar. Si la salida de un sujeto lleva el nombre o el email de git de la máquina, no se guarda y se avisa, y la revisión de la evidencia mira todas las carpetas de salidas, también el email. Volcar un fichero de otra rama, sembrar transcripts y montar un molde con rutas largas salen bien a la primera, y una copia del kit con `.docs/` o `tests/` aborta antes de lanzar. El extractor salta y marca una línea del stream que no parsea en vez de caerse, y una batería puede dar por buena cualquier skill.

## Capacidades

- Ninguna, porque herramientas: el lanzador de sujetos de `tests/headless/` es tooling de pruebas de este repo, no comportamiento del kit en un proyecto (`sdd capability index` no tiene capacidad del lanzador).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: ninguna (sin capacidad, sin contrato público: lib.sh lo consumen solo los subject.sh del repo; sin datos ni dependencias; todo el código tocado leído en esta sesión) · tamaño: ~250 líneas en 9 ficheros
- Mínimo razonable: ninguna — el repaso de coherencia lo hago yo; deja sin mirar por un segundo par de ojos los literales de los avisos nuevos
```

1. `deny-kill.mjs` se **copia** a `tests/headless/`, no se mueve: la carpeta de la 0036 es una campaña cerrada y conserva su lanzador (`tech-stack.md`, «Usa el lanzador de referencia»), y su `web.sh` lo carga por ruta relativa.
2. Un `SETTINGS` propio sin `deny-kill.mjs` **aborta** con `[<etiqueta>] SETTINGS sin el hook deny-kill.mjs: añade $DENY_KILL_HOOK a sus PreToolUse`, igual que hoy aborta sin `"sdd-kit@sdd-kit":false`; no se fusiona JSON, para no meter un parser en bash. `lib.sh` exporta `DENY_KILL_HOOK` (ruta Windows del hook) para componerlo.
3. `subject_ports` imprime, separados por comas, `PORT` si está definido y los `PORT=<n>` / `localhost:<n>` (4-5 dígitos) del stream, como el `web.sh` de la 0036. `subject_cleanup` para por PID, con `Get-NetTCPConnection … -State Listen` y `Stop-Process -Id`, lo que escucha en esos puertos, y escribe en `<etiqueta>.err` del scratchpad `puertos del sujeto: <lista> · escuchando al acabar: <lista|ninguno>`. Sin puertos, no llama a `pwsh`.
4. `extract.mjs` lee `user.name` y `user.email` de git de la máquina (sin los `GIT_CONFIG_*`, como hoy) y, si alguno aparece en lo que va a escribir, sale con código 3 y el mensaje `la salida lleva el nombre o el email de git de la máquina: no se guarda` por stderr, sin imprimir el valor. Se retira la sustitución por `<git-user>`: con ella delante, la comprobación nunca vería el nombre.
5. `subject_save` y `subject_keep` no dejan ficheros a medias: escriben a un temporal y lo renombran solo si el extractor sale con 0; con código 3 avisan `[<etiqueta>] … el stream sigue en <run>.jsonl` y el sujeto sale con error.
6. La revisión de la evidencia (`SubjectOutputPrivacy.Tests.ps1`) ya existe; **corrige lo que dije en la sección 2** («un Pester nuevo»): se amplía la existente. Toma como evidencia **toda subcarpeta** de `specs/<tarea>/` (hoy solo `red|green|refactor|battery|fix…`: `campaign/`, `ab/`, `micro/`… escapaban, y ahí están 6 de los 8 ficheros con fugas) y busca también el `user.email`. Lo comprobé: en las subcarpetas solo hay esos 8 ficheros con nombre o email, así que ampliar no da falsos positivos hoy.
7. El barrido sustituye en esos 8 ficheros el nombre por `<git-user>` y el email por `<git-email>` (6 de `patch-0037…/campaign/out/`, 2 de `task-0077…/green/out/`).
8. `subject_show <rev>:<ruta> <copia plana>` vuelca con `MSYS2_ARG_CONV_EXCL='*'` y `git -C "$(cygpath -m "$R")"`, limpia con `clean` y aplica las reglas de `subject_keep` (plana, por debajo de 140). Con `'*'` y la ruta `/d/…` git no encuentra el molde: probado en esta sesión.
9. `seed_transcript <rama>` lee por la entrada estándar líneas `<fecha ISO> <user|assistant> <texto>` y escribe un `.jsonl` con `gitBranch` = rama, `usage` mínimo (`1/0/1`) y modelo `claude-sonnet-5` en `${CLAUDE_CONFIG_DIR:-$HOME/.claude}/projects/<carpeta del molde>/seed-<n>.jsonl`. La carpeta se borra en `subject_cleanup` siempre, también con `KEEP_MOLD=1` (como la carpeta de Claude Code del sujeto).
10. `subject_init` aborta con `[<etiqueta>] la copia del kit lleva .docs/ o tests/: sácala con git archive <commit> skills .claude-plugin` si `KIT_DIR` tiene `.docs/` o `tests/`.
11. `g` pasa `-c core.longpaths=true` siempre.
12. Una línea del stream que no parsea se salta y se marca en la salida con `!!! línea <n> del stream sin parsear (<caracteres> caracteres): <mensaje del error>`; el resto se extrae. En `last`, también se salta. No investigo la causa del `SyntaxError … position 1745` de la 0168: aquel `.jsonl` ya no existe.
13. `Esperado` = `cualquiera` cuenta como pasado todo sujeto terminado (con `=== RESULTADO`), cargue la skill que cargue o ninguna. `t1b` de `tests/batteries/sdd-implement/battery.md` pasa de `ninguna` a `cualquiera`; su `subject.sh` ya cae a `using-sdd` cuando la skill de «Esperado» no existe.
14. `tech-stack.md` se pone al día en las líneas que describen lo que cambia (tabla de abajo), sin reglas nuevas salvo la de la copia del kit, que pasa a valer para toda campaña.
- Política de modelos: sin revisores de la spec · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin sujetos reales (todo en seco con Pester) · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar los ejes de la revisión final

### Decisiones tomadas con el dev-lead

- Partir la 0214 en tres: esta, la 0215 (sujetos en paralelo y perfil de configuración, con sujetos reales) y la 0216 (molde de cierre vivo) — opción «Partir en 3 (Recomendada)», 2026-10-25.
- Diseño por secciones: «si» a las secciones 1 (hook y puertos), 2 (datos personales) y 3 (volcado, siembra, guarda del kit, longpaths); «sigue» tras la 4 (extractor tolerante y `cualquiera`), 2026-10-25.
- De «Herramientas de campaña» entran (b), (c) y (e); la (d) es de la 0213 y la (a) la saldó la 0170 — prompt de arranque, 2026-10-25.

## Intent

Hoy cada campaña de sujetos tiene que acordarse de guardas que el lanzador no da: un sujeto web mató los `node.exe` de la máquina y dejó servidores vivos (0036, 0168); el nombre y el email del dev-lead están versionados en 8 salidas porque la revisión no mira `campaign/` ni el email; un `git show rama:ruta` sale vacío en Git Bash (0075); una copia del kit con `.docs/` dejó al sujeto leer la spec de lo que se medía (0150); `extract.mjs` se cayó a mitad de stream (0168). Éxito: con `lib.sh` y sin código propio en el `subject.sh`, ninguna de esas cinco cosas puede pasar, cada una con su test en seco, y las salidas ya guardadas quedan limpias.

## Scope

- Entra: `deny-kill.mjs` en `tests/headless/` y por defecto en `subject_launch`; `subject_ports` y parada por puerto en `subject_cleanup`; `extract.mjs` falla con nombre o email reales; `SubjectOutputPrivacy.Tests.ps1` amplía carpetas y email; barrido de los 8 ficheros; `subject_show`; `seed_transcript`; guarda de `.docs/`/`tests/` en `subject_init`; `core.longpaths` en `g`; líneas sin parsear en `extract.mjs`; `cualquiera` en `battery.mjs` y en `t1b`; `tech-stack.md`; saldo de las filas de deuda.
- No entra: la reproducción de dos sujetos en paralelo y el perfil de configuración del sujeto (0215); el molde de cierre vivo (0216); el control de campaña de `run.sh` (0213); reescribir los `subject.sh` de campañas cerradas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Sustitución del `user.name` por `<git-user>` en `extract.mjs` | `tests/headless/extract.mjs:44-47`; `tests/SubjectOutputPrivacy.Tests.ps1:145-152` (test que la exige) y `:206` (texto `sustitúyelo por <git-user>`); `tech-stack.md:133` | Scope; decisión 4: el test pasa a exigir código 3 y el texto, a «no se guarda» |
| Carpetas de evidencia `red`, `green`, `refactor`, `battery` y `fix` | `tests/SubjectOutputPrivacy.Tests.ps1:23-25` (`Select-EvidencePath`) y `:171-176` (carpetas que recorre) | Scope; decisión 6: toda subcarpeta de `specs/<tarea>/` |
| Ruta de `deny-kill.mjs` | `tests/DenyKillHook.Tests.ps1:2`; `tech-stack.md:210` | Scope; decisión 1: apuntan a `tests/headless/deny-kill.mjs`. `tests/closing-verification-*.md` y la carpeta de la 0036 son evidencia cerrada: se quedan |
| `subject_ports` del `web.sh` de la 0036 | `tech-stack.md:211` | Scope; decisión 3: la línea nombra `lib.sh` |
| Siembra a mano de transcripts | `tech-stack.md:60` | Scope; decisión 9: la línea nombra `seed_transcript` |
| `-c core.longpaths=true` a mano | `tech-stack.md:162` | Scope; decisión 11: `g` lo pasa |
| Regla de la copia del kit solo para un frente del GREEN | `tech-stack.md:95` | Scope; decisión 10: vale para toda copia del kit de una campaña |
| `Esperado` de `t1b` = `ninguna` | `tests/batteries/sdd-implement/battery.md:43` | Scope; decisión 13 |
| Usos de `lib.sh` en la cabecera | `tests/headless/lib.sh:2-22` | Scope: la cabecera nombra `subject_show`, `seed_transcript`, `subject_ports` y `DENY_KILL_HOOK` |

- Filas que implementa: 0214 (`roadmap.md`, Próximo) → ✅ al cerrar. Filas de deuda saldadas al cerrar, con su marcador: «La siembra de transcripts…» (§0188), «Herramientas de campaña» (b), (c) y (e) — queda la (d) en la 0213 —, «El nombre del usuario sale en las salidas guardadas…», «El lanzador de referencia no vuelca ficheros de otra rama…», «El lanzador de referencia no ayuda a parar…», «`lib.sh` no sirve para una entrevista de varios turnos…», «La copia del kit de una campaña lleva `.docs/` y `tests/`». Otros sitios que nombran la 0214: `patch-0170…/patch.md` y su ticket de campo (históricos, se quedan) y `cli/test/session/window.slow.test.ts:125` (una rama de fixture, no la fila). Comprobado con `git grep -n 0214`.

## Approach

Todo se añade a `tests/headless/` (`lib.sh`, `extract.mjs`, `battery.mjs`, `deny-kill.mjs`), con su caso en el Pester que ya cubre cada pieza; nada se copia a una campaña. Las guardas abortan con un mensaje que dice qué hacer, como las de `subject_init` y `subject_launch` de hoy. El barrido se hace una vez y lo vigila la revisión de la evidencia ampliada.

## Dónde se prueba

- Hook por defecto y `SETTINGS` sin hook: `tests/HeadlessLauncher.Tests.ps1`, en seco, leyendo `<etiqueta>.args`, como «aborta si SETTINGS no deshabilita el kit instalado».
- Casos del hook en su ruta nueva: `tests/DenyKillHook.Tests.ps1`, sin cambiar sus casos.
- `subject_ports` y parada por puerto: `HeadlessLauncher.Tests.ps1`, en seco, con un servidor de node escuchando en un puerto que nombra el stream falso, y que al acabar ya no escucha.
- Fallo con nombre o email y escritura atómica: `SubjectOutputPrivacy.Tests.ps1`, con `Invoke-WithGitUser` como hoy, más un caso de `subject_save` en seco en `HeadlessLauncher.Tests.ps1`.
- Evidencia ampliada y barrido: `SubjectOutputPrivacy.Tests.ps1`, que hoy pasaría en verde con las 8 fugas y tras el cambio da rojo hasta el barrido.
- `subject_show`, `seed_transcript`, guarda de `.docs/`/`tests/` y `core.longpaths`: `HeadlessLauncher.Tests.ps1`, en seco.
- Línea sin parsear: `SubjectOutputPrivacy.Tests.ps1`, junto a los otros casos de `extract.mjs`.
- `cualquiera`: `tests/Battery.Tests.ps1`, como los veredictos de hoy.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `.docs/sdd/tech-stack.md` | 19277 / 19280 | 3 | sin cambio: las líneas que la feature reescribe se aprietan para que el total no pase de 19280 |

## Enmiendas

- 2026-10-25 — se añade «Topes de palabras» (`tech-stack.md`, tope sin cambio) — el repaso de coherencia no vio el tope de `tests/WordBudget.Tests.ps1` y el pre-commit de la Task 1 lo paró; no cambia requisitos, Scope ni «Dónde se prueba» — sin aprobar: ruling de la Task 1, se cuenta en el cierre

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-25 | aprobada (opción «Apruebo») |
