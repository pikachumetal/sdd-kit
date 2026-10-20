---
id: 20261020-115102-feature-0203-single-id-sequence
feature: 0203
title: Ids, una sola numeración y el push a la integración como árbitro
mode: full
profile: delegate
status: approved
created: 2026-10-20
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-20
---

# Spec — Ids, una sola numeración y el push a la integración como árbitro

🦆 Hoy, si Ana y Luis planifican el mismo día en máquinas distintas, `sdd-roadmap` les da la 0203 a los dos, y no se enteran hasta fusionar. Con este cambio el id es provisional hasta que la tarea arranca. Al arrancar, `sdd id claim` mira `origin/develop`: si nadie más ha publicado la 0203, la publica y es tuya («id: 0203 es tuya; publicada en origin/develop»). Si otro la publicó antes, tu tarea pasa al siguiente libre, su fila y lo que la nombra cambian de número y la rama se renombra («la 0203 pasa a 0205»). Y las ideas de Later dejan el `B3`: llevan un id normal, como todo lo demás.

## Capacidades

- Modificadas: `feature-ids` — el id es provisional hasta el arranque; `sdd id claim` lo decide contra la integración del remoto; sin fila, la rama que ya lleva id da su id; el escaneo cuenta las etiquetas `sdd-id/*`
- Modificadas: `roadmap` — `sdd roadmap check` rechaza `B<n>` y, en `sequence`, exige id de la secuencia también en Later
- Modificadas: `planning` — Later y Backlog toman id de la reserva; subir de Later a Next conserva el id
- Modificadas: `migration` — la v3.0.0 lleva el Backlog y las decisiones abiertas a Later con ids de una reserva
- Modificadas: `cli` — el verbo `id claim`

## ✋ Decisiones que he tomado yo — valida estas

Review de spec hecha: dos revisores (dominio en Opus y técnica en Sonnet, effort medium, en paralelo), elegida por el dev-lead — señales: contrato público (verbo nuevo `sdd id claim`, mensajes de `sdd roadmap check`), MODIFIED (13 requisitos y 5 reglas), tres o más capacidades (5), datos (contador y etiqueta `sdd-id/<id>` en el remoto) · tamaño: ~600 líneas en ~20 ficheros. Hallazgos al final de este bloque.

1. **Verbo nuevo `sdd id claim`**, en `cli/src/ids/`, con `--project-root`, `--id` (por defecto el del nombre de la rama actual), `--into` (por defecto `merge.into`) y `--lock-timeout`. Trabaja con el cerrojo de `sdd merge` en el worktree donde está la integración o, si no está en ninguno, en uno temporal, como `roadmap publish`. Si ese worktree tiene cualquier cambio sin commitear, no toca nada: escribe `destino con cambios: <ruta>; límpialo y relanza sdd id claim` y sale con 1. — Motivo: lo mecánico va a la CLI (Principio 4); la vuelta atrás (decisión 7) hace `reset --hard` y no debe pisar trabajo de nadie.
2. **Cuándo un id «ya lo tiene otro»** (cambia lo que aprobaste en la sección 2; ver hallazgo D1): tus reservas sin publicar son los ids que añaden, en una fila de cualquiera de los dos roadmaps o en una carpeta de `changes/`/`specs/`, los commits de `develop` local que no están en `origin/develop` (sin contar merges). Cada una que `origin/develop` ya tenga es de otro y se renumera. Vale aunque tu `develop` ya haya integrado `origin/develop` (un `sdd merge`, un `git pull`): tu commit de reserva sigue sin estar en el remoto. — Motivo: «la base común» dejaba pasar el duplicado en cuanto `develop` se sincronizaba; el commit que añadió tu fila no cambia, y relanzar el verbo da lo mismo.
3. **Se comprueban todas tus reservas sin publicar**, no solo la de la tarea que arranca, porque el push las publica todas. Una 0204 tuya que ya tenga otro en `origin/develop` también se renumera, con su línea `id: la 0204 ya la tiene otro en origin/develop; la 0204 pasa a 0206`. Solo la tarea que arranca renombra su rama. — Motivo: sin eso, el push publicaba duplicados (hallazgo D2).
4. **Una fila ya publicada se da por buena, y el claim dice cuál es**: si la 0203 está en una fila de `origin/develop` y ningún commit tuyo sin publicar la añade, también con tu `develop` atrasado, escribe `id: 0203 ya estaba en origin/develop («<título de la fila>»); nada que publicar`, y el agente compara el título con su tarea. El claim no comprueba si otro ya la arrancó. — Motivo: «arrancada por otro» no se ve en el remoto (las ramas de feature no se publican), y marcarlo pediría tocar el estado de la fila, que la entrevista dejó fuera. El éxito del Intent se acota a eso.
5. **El chore solo existe cuando se renumera**: un solo commit, `chore(roadmap): la 0203 pasa a 0205` (con varias, `chore(roadmap): la 0203 pasa a 0205, la 0204 pasa a 0206`). Sin renumeración, el push publica las reservas que ya commiteó `roadmap publish`. No marca la fila 🔄. — Motivo: lo aprobaste en la sección 2; el 🔄 sería una regla nueva de estado.
6. **El push publica también las otras reservas locales**, y la salida las lista con la forma de `sdd merge`: `push: también publica 1 commit de 'develop' que no es de la 0203:` (con varios, `push: también publica 2 commits de 'develop' que no son de la 0203:`) y una línea `- <hash> <asunto>` por commit. — Motivo: el primero que publica gana, también entre provisionales (sección 2), ya comprobadas por la decisión 3.
7. **Intentos y vuelta atrás**: el verbo guarda el commit de `develop` antes de empezar. Cada intento parte de ese commit: fetch (con las etiquetas `sdd-id/*`), comprobación, el chore si toca, integración de `origin/develop` con la limpieza de registros de `sdd merge` (`syncBaseBranch`) y push. Si el push falla, vuelve a hacer fetch: si `origin/develop` cambió, es «el remoto avanzó» y reintenta, hasta 3 intentos; si no cambió, es la integración protegida (decisión 11). Tras 3 intentos, o si el merge da conflicto, o si el push falla por otra causa, `develop` vuelve al commit guardado y el verbo sale con 1. Tras 3 intentos escribe `push: 'develop' sigue moviéndose en 'origin' tras 3 intentos; relanza sdd id claim en un rato`; en los otros casos, el error de git. **El contador no vuelve atrás**: los ids reservados en un intento quedan consumidos. — Motivo: el mismo tope que `sdd merge --push`; «el contador nunca baja» y «nunca se reutiliza» son reglas vivas (hallazgos T1, T5 y D3).
8. **Renumerar**: el id nuevo sale de la reserva de hoy (`consumeIds`, con su contador y su cerrojo), después del fetch. En los roadmaps y en `.docs/sdd/steering/debt.md` de `develop` local se reescriben solo las líneas que no están tal cual en la versión de `origin/develop` del mismo fichero, y en ellas solo estas formas: la primera celda de la fila (o la segunda si la primera es fecha), la columna «Tras», la columna «Destino» de `debt.md`, `tras <id>`, `parent: <id>`, `Actuar → <id>` y las rutas `-(feature|patch|proposal)-<id>-`. Una carpeta tuya de `changes/` o `specs/` con ese id pasa al nuevo con `git mv` en el mismo commit. Un `0203` suelto en prosa no se toca. — Motivo: si tu `develop` ya integró la 0203 del otro, su fila y lo que la nombra están tal cual en `origin`; las formas son las que nombra la fila 0203, más «Destino», que es donde `debt.md` 3.0.0 escribe el id.
9. **Rama y worktree**: si la rama de la tarea no tiene commits propios frente a `develop`, el verbo hace `git branch -m feature/0203-<slug> feature/0205-<slug>` y, si su worktree no tiene cambios sin commitear, la lleva por fast-forward a la `develop` publicada. Así la rama «nace después del push». La salida escribe `rama: feature/0203-<slug> → feature/0205-<slug>` y `worktree: la carpeta sigue en <ruta>`. Los casos en que no lo hace:
   - con commits propios, ni renombra ni avanza: `rama: tiene commits propios; no se renombra: hazlo tú a feature/0205-<slug>`;
   - si `feature/0205-<slug>` ya existe, no renombra: `rama: ya existe feature/0205-<slug>; no se renombra`;
   - con cambios sin commitear, renombra y no avanza: `rama: cambios sin commitear; no avanza a develop`.

   — Motivo: mover la carpeta con la sesión dentro la rompe; la regla de los commits propios es la de `nombrado.md`.
10. **Mensajes** (los literales, por la salida estándar y con el código 0 salvo los que dicen otra cosa):
    - `id: 0203 es tuya; publicada en origin/develop`
    - `id: 0203 ya estaba en origin/develop; nada que publicar` (con fila tuya ya publicada) y `id: 0203 ya estaba en origin/develop («<título>»); nada que publicar` (fila publicada que tu `develop` no tiene)
    - `push: 'develop' no se publica (merge.push: false); id fijado con la etiqueta sdd-id/0203`
    - `id: la 0203 ya la tiene otro en origin/develop; la 0203 pasa a 0205`
    - `id: 0176 libre en origin/develop` (sin fila)
    - `push: 'develop' no admite push directo; id fijado con la etiqueta sdd-id/0203`
    - `id: 0203 ya fijada con la etiqueta sdd-id/0203` (relanzado con la integración protegida)
    - `sin remoto: la 0203 vale (contador local)`
    - `sin comprobar en el remoto: la raíz del proyecto no es la del repositorio; la 0203 vale (contador local)`
    - los de la decisión 9, `destino con cambios: …` y el de los 3 intentos (código 1)
11. **Integración protegida** (el push falla y, tras otro fetch, `origin/develop` no cambió): empuja la etiqueta `sdd-id/<id>` apuntando al `develop` local; el remoto rechaza una etiqueta que ya existe. La etiqueta es tuya si su commit es ancestro de tu `develop` local, y entonces el relanzado escribe `id: 0203 ya fijada con la etiqueta sdd-id/0203`. Si el remoto la rechaza y su commit no está en tu `develop`, el id es de otro: se renumera y se empuja `sdd-id/0205`. El commit del roadmap viaja con la PR. Las etiquetas no se borran: solo nacen con la integración protegida o con `merge.push: false`, una por tarea arrancada. **Con `merge.push: false`** en `sdd-kit.json`, el claim no publica `develop`: va directo a la etiqueta, y escribe `push: 'develop' no se publica (merge.push: false); id fijado con la etiqueta sdd-id/0203`. — Motivo: punto (e) de la fila; es atómico y no pide permisos sobre `develop`; con `merge.push: false` el equipo decidió que el kit no publique `develop` (dev-lead, 2026-10-20).
12. **El escaneo cuenta las etiquetas `sdd-id/*`** que haya en el repositorio, también en `sdd id next`; `sdd id claim` las trae del remoto en su fetch. — Motivo: sin eso, una reserva posterior podía repetir un id fijado con etiqueta (hallazgo T8).
13. **Sin remoto** (`git remote` vacío, o la integración sin remoto): `sin remoto: la 0203 vale (contador local)`, sin tocar nada. **Proyecto en una subcarpeta de su repositorio**: `sin comprobar en el remoto: la raíz del proyecto no es la del repositorio; la 0203 vale (contador local)`. En **`tracker`**, el mismo aviso que `sdd id next` por la salida de error, y sale con 1. — Motivo: punto (c) de la fila; en una subcarpeta el escaneo ya no lee ramas.
14. **Sin fila** (ninguna fila con ese id en `develop` local ni en `origin/develop`): si la rama ya lleva un id, `sdd id claim` lo usa. Lo da por libre si no aparece en ninguna carpeta, otra rama ni etiqueta del escaneo (sin contar el worktree y la rama de la tarea), ni en `origin/develop`; si aparece, toma el siguiente libre y renombra la rama (decisión 9), sin commit en `develop`. Si la rama no lleva id, `sdd id next --reserve`, `git branch -m` como hoy y después el claim. Sin fila no hay push ni etiqueta: **dos arranques sin fila a la vez en dos máquinas pueden coger el mismo id**, y lo detecta el merge, como hoy. — Motivo: salda la fila de deuda «Con el id ya en el nombre de la rama, la reserva consume otro» con la variante que propone (una tercera fuente), no con la que rebate (que `--reserve` devuelva el id de la rama). Publicar una etiqueta por cada tarea sin fila llenaría el remoto para un caso raro; queda como límite (hallazgo T2).
15. **Ninguna fila nueva lleva `B<n>`**, en 3.0.0 (Later) ni en 2.x (Backlog). En `sequence`, las filas de Later y de Backlog entran en la reserva `--count N` como las demás. En `tracker`, una fila de Later sin ticket lleva `0000`, el comodín de «sin ticket» que ya fija la capacidad. Subir de Later a Next conserva el id. Los `B<n>` que ya existen en un roadmap 2.x se quedan hasta que la migración v3.0.0 los convierte, y `migrations/v2.3.0.md`, publicada, sigue con su `B<n>`. — Motivo: tu corrección de la sección 1 («un único sistema de ids»); el `check` 2.x no valida los ids del Backlog.
16. **`sdd roadmap check` (3.0.0)** lee `ids.mode` de `sdd-kit.json`. En `sequence`, un id de Now, Next o Later que no sea de cuatro cifras distinto de `0000` da `el id «B3» no es de la secuencia: resérvale uno con sdd id next --reserve`. En `tracker`, un `B<n>` da `el id «B3» ya no se usa: usa el del ticket o 0000`. Desaparecen `el id «0020» de «Later» no es «B<n>»` y `el id «B3» de «Next» es de Later: resérvale uno al subirla`. El aviso de id repetido no mira `0000`. — Motivo: una regla por modo en las tres secciones; `—` en `sequence` sería una salida para no numerar (hallazgo D4).
17. **Migración v3.0.0**: las filas del Backlog y las «Decisiones abiertas» pasan a Later con ids de una sola reserva `sdd id next --reserve --count N` en `sequence` (en `tracker`, `0000`), en el orden en que aparecen, después del Backlog. — Motivo: punto (d); una reserva, como pide `sdd-roadmap` para N filas.
18. **`sdd roadmap publish` no cambia**: commitea la reserva en la integración local, sin push. `sdd-roadmap` paso 6 añade que, para otro clon, la reserva es provisional hasta que su tarea arranca. — Motivo: punto (a); el árbitro es el arranque.
19. **Skills que cambian**:
    - `sdd-propose` paso 3 (`sdd id claim` antes de la carpeta; si renumera, la carpeta y el resto usan el id nuevo) y su red flag del paso 3;
    - `sdd-start-patch` paso 2: el claim con fila y sin fila, porque un patch con fila no pasa por el paso 3 de `sdd-propose` (hallazgo D9);
    - `sdd-start-feature/references/nombrado.md`: el id provisional y el claim (la tercera fuente no se escribe en las skills: enmienda del 2026-10-20);
    - `sdd-roadmap`: los pasos 1, 4 y 6 y la tabla de formas;
    - la tabla de la CLI de `sdd-templates/SKILL.md`, con la fila de `sdd id claim`;
    - `now-next-later-template.md`, `roadmap-template.md` y `migrations/v3.0.0.md`;
    - `.docs/workflow/usage-guide.md`, párrafo «Los ids se reservan», con una frase sobre el arranque.

    — Motivo: la búsqueda del repaso de coherencia («Lo que se retira o cambia de forma»).
20. **Una pieza entra, otra sale** (Art. I): de `sdd-roadmap` sale la numeración propia de Later (la columna `B<n>` de la tabla de formas, la frase del paso 4 y «raising it to Next reserves it an id» de los pasos 1 y 7). De `feature-ids` se **acotan** a «sin remoto o en una subcarpeta» el límite «Una sola máquina» y la regla «el segundo en darse cuenta renumera». De `nombrado.md` sale «sin reservar ni recalcular». Entra el paso del claim en tres skills.
21. **Previsión de la prueba** (Art. I): unos 20 sujetos Sonnet en ~2,5 h y ~16 $, con una tanda de REFACTOR incluida. Detalle en «Previsión de la prueba».
22. **Topes de palabras**: suben `sdd-propose` (`SkillMd` y total) y el kit entero; el resto cabe. Detalle en «Topes de palabras».
23. **Fuera**: marcar 🔄 al arrancar; mover la carpeta del worktree; comprobar si otro arrancó ya una fila publicada (decisión 4); arbitrar en el remoto los arranques sin fila (decisión 14); borrar etiquetas `sdd-id/*`; `ids.mode: tracker`; convertir los `B1`-`B20` de este repo, que es de la 0198.
- `sdd capability merge sobre una copia → 12 sustituidos, 6 añadidos, 5 reglas, 0 errores; capability check → 20 válidas` (2026-10-20)
- Política de modelos: revisores de la spec dominio opus + técnica sonnet, effort medium (hechos) · ejes de la revisión final Spec opus+high, Código sonnet+high, Arquitectura sonnet+high (verbo nuevo con git y remoto) · sujetos de la campaña Sonnet, por tandas de `tests/headless/battery.sh` · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec confirmas estos despachos en paralelo

### Hallazgos de la review

- **Aceptado** — D1 (Crítico): la base común deja de separar lo tuyo de lo ajeno cuando `develop` ya integró `origin/develop` → decisión 2 por los commits sin publicar; decisión 8 solo reescribe líneas que no están en `origin`; escenario nuevo con `develop` ya sincronizada.
- **Aceptado** — D2 (Crítico): el push publicaba las otras reservas sin comprobarlas → decisión 3; regla ante conflicto sin «al arrancar».
- **Aceptado** — D3 y T1 (Críticos): devolver el contador contradice «nunca baja» y «nunca se reutiliza» → el contador queda consumido; solo `develop` vuelve atrás (decisión 7).
- **Aceptado** — D4 (Crítico): `—` era una regla nueva donde ya estaba `0000` → `0000` en `tracker`; en `sequence` el `check` exige id de la secuencia también en Later (decisiones 15 y 16).
- **Aceptado** — T2 (Crítico): sin fila no hay árbitro → límite explícito en la decisión 14, el Intent y la regla ante conflicto.
- **Aceptado** — D5: «`sdd id next` lo devuelve» no prueba que esté libre → la comprobación la hace el claim con el escaneo (decisión 14).
- **Aceptado** — D6: el «sale» del Art. I estaba inflado → decisión 20 dice «se acotan».
- **Aceptado** — D7: faltaba «Idioma de los nombres» → regla añadida.
- **Aceptado** — D8: el éxito prometía más de lo que da la decisión 4 → Intent acotado.
- **Aceptado** — D9: un patch con fila no pasaba por el claim → `sdd-start-patch` paso 2 lo ejecuta siempre (decisión 19).
- **Aceptado** — D10: la v2.3.0 contradecía la decisión 15, y «sin remoto» no vale para la subcarpeta → excepción escrita y literal propio (decisiones 10, 13 y 15).
- **Aceptado** — T3: faltaba cómo distinguir protegida de «el remoto avanzó» → otro fetch tras el fallo: si `origin/develop` no cambió, protegida (decisión 7); escenario con los dos casos.
- **Aceptado** — T4: la etiqueta daba falsos positivos y no tenía relanzado → «tuya» si su commit es ancestro de tu `develop`; literal del relanzado (decisión 11).
- **Aceptado** — T5: no se decía qué pasaba con el chore de un intento anterior → cada intento parte del commit guardado y hay un solo chore (decisión 7).
- **Aceptado** — T6: el worktree de la integración podía estar sucio → se aborta antes de tocar nada (decisión 1).
- **Aceptado** — T7: la carrera entre fetch y push no tenía cómo probarse → «Dónde se prueba» declara la inyección.
- **Aceptado** — T8: `sdd id next` no contaba las etiquetas → decisión 12 y `MODIFIED` del escaneo; retención declarada (decisión 11).
- **Aceptado** — T9: faltaban literales y el código de `tracker` → decisión 10 completa; escenario de `tracker` con el código 1.
- **Aceptado** — T10: faltaban la rama destino que ya existe y el worktree sucio → casos de la decisión 9 y escenario.

### Decisiones tomadas con el dev-lead

- Mantener la 0203 entera, sin partir Later — «Mantener entera» (2026-10-20)
- Diseño por secciones: Later con id de la secuencia — «si»; claim y criterio de identidad — «creo que si...» y, tras el ejemplo de Ana y Luis, «si»; renumerar y casos raros — «si ok» (2026-10-20). El criterio de identidad cambió después con la review (hallazgo D1): se valida en el gate.
- Ningún `B<n>` en ninguna forma, también en 2.x — «habiamos hablado tambien no usar ids raros B<NNN> un unico sitema de ids» (2026-10-20)
- Review de la spec con dos revisores — «Dos revisores (Recomendada)» (2026-10-20)
- Aprobación de la spec, con el criterio de identidad de la review y los topes propuestos — «Apruebo (Recomendada)» (2026-10-20)
- Del prompt de arranque: una sola forma de numerar (2026-10-19: «yo la verdad prefiero una sola forma de numerar… cuando estamos con 0174/0200 y de repente me hablas de B1 o B5 me lías»); al arrancar con remoto, fetch, comprobación contra la integración, chore y push, y si se rechaza, fetch y otra comprobación; si el id ya lo tiene otro, el siguiente libre con sus referencias reescritas y «la 0174 pasa a 0203» en la salida; sin remoto, el contador local; con la integración protegida, valorar la etiqueta `sdd-id/<id>`; `tracker` no cambia. Perfil `delegate`; al fusionar, `sdd merge --push`.

## Intent

Hoy `sdd id next --reserve` usa un contador y un cerrojo locales del clon, sin `fetch`, y `sdd roadmap publish` no hace push. Dos personas en máquinas distintas que planifican antes de que la otra publique sacan el mismo id, y se descubre al fusionar. Además el roadmap numera con dos sistemas (`0203` y `B5`), y el dev-lead se pierde al mezclarlos.

Éxito: una reserva provisional que otro clon ya publicó nunca llega a `origin/develop` con el mismo id. El segundo en arrancar ve «la 0203 pasa a 0205» y sigue sin tocar nada a mano, y en el roadmap solo hay una forma de id. Quedan fuera, como límites dichos: dos personas que arrancan la misma fila ya publicada (decisión 4) y dos arranques sin fila a la vez (decisión 14). Sería un fracaso, aunque funcione, que renumerar tocara la fila o las referencias de la tarea del otro, o que un claim fallido dejara `develop` local a medias.

## Scope

- Entra: el verbo `sdd id claim` (decisiones 1-11 y 13); el escaneo con etiquetas (12); la tercera fuente de id sin fila (14); Later y Backlog sin `B<n>` en el `check`, las plantillas, `sdd-roadmap` y la migración v3.0.0 (15-17); el claim en `sdd-propose`, `nombrado.md` y `sdd-start-patch`; la frase de `usage-guide.md`; los deltas de cinco capacidades.
- No entra: lo de la decisión 23; `sdd roadmap publish` sigue sin push (18); el roadmap y el Backlog de este repo (0198).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Numeración propia `B<n>` de Later | `now-next-later-template.md:15` y `:41`; `cli/src/roadmap/now-next-later.ts:14` y `:39-40`; `sdd-roadmap/SKILL.md:23`, `:37`, `:52` y `:71`; `capabilities/roadmap.md:139-140` y `:194`; `capabilities/planning.md:67` y `:97-98` | decisiones 15 y 16; delta `roadmap` y `planning`, `MODIFIED` |
| Numeración propia `B<n>` del Backlog 2.x | `roadmap-template.md:26`; `sdd-roadmap/SKILL.md:23` | decisión 15 |
| Pasos de la migración que dan `B<n>` | `migrations/v3.0.0.md:57-58`; `capabilities/migration.md:223` y `:234-241` | decisión 17; delta `migration`, `MODIFIED` |
| `B<n>` del paso de la v2.3.0 | `migrations/v2.3.0.md:14`; `capabilities/migration.md:194` | se queda: migración publicada de su fecha (decisión 15) |
| «el agente que abre el worktree … sin reservar ni recalcular» | `capabilities/feature-ids.md:40`; `nombrado.md:7` | delta `feature-ids`, `MODIFIED` (`REMOVED` de la línea); decisión 19 |
| Límite «Una sola máquina» y regla «el segundo en darse cuenta renumera» | `capabilities/feature-ids.md:159` y `:161` | se acotan a sin remoto o subcarpeta: delta `feature-ids`, Reglas de la capacidad |
| Las dos fuentes de id sin fila | `nombrado.md:7`; `sdd-start-patch/SKILL.md:28`; `capabilities/feature-ids.md:94` | decisión 14; delta `feature-ids`, `MODIFIED` |
| Lo que lee el escaneo | `capabilities/feature-ids.md:45-52` | decisión 12; delta `feature-ids`, `MODIFIED` |
| Lista de verbos de la CLI | `capabilities/cli.md:13`; tabla de `sdd-templates/SKILL.md:47` | delta `cli`, `MODIFIED`; decisión 19 |
| «Los ids se reservan» | `.docs/workflow/usage-guide.md:201` | decisión 19 |

- Filas que implementa: 0203 y la fila de deuda «Con el id ya en el nombre de la rama, la reserva consume otro» → solo `.docs/sdd/roadmap.md` (la fila 0203 y `Actuar → 0203` de la deuda); las marca el cierre. Comprobado con `grep -rn "0203" skills .docs/sdd/capabilities` → nada.

## Approach

El arranque reclama el id contra `origin/<merge.into>` con un verbo de la CLI, y el push a la integración es el árbitro, como decidió el dev-lead. La identidad («¿es mía?») sale del historial de git, no del texto de la fila: tus reservas son los ids que añaden tus commits sin publicar, y una que el remoto ya tenga es de otro. Las que pierden se renumeran en tu `develop` local, solo en las líneas que no vienen del remoto, y la rama, sin commits propios, se renombra y avanza a lo publicado. Con la integración protegida, una etiqueta `sdd-id/<id>` hace de árbitro. Sin remoto, todo sigue como hoy. Later entra en la misma secuencia, y el `check` lo exige en `sequence`.

## Dónde se prueba

- `sdd id claim` (decisiones 1-11, 13 y 14): Vitest `cli/test/ids/claim.slow.test.ts`, con un remoto *bare* en una carpeta temporal y dos clones, como los tests de push de `cli/test/merge/`. La integración protegida, con un hook `pre-receive` en el *bare* que rechaza `refs/heads/develop`. La carrera entre fetch y push, con un hook `pre-receive` que, en los primeros N pushes, publica antes la fila del otro clon (un `git update-ref` en el *bare* hacia un commit preparado) y rechaza; N = 3 da el agotamiento con su literal y el código 1.
- Renumerar (decisión 8): Vitest unitario sobre las líneas del roadmap y de `debt.md` (`cli/test/ids/renumber.test.ts`), con líneas que están tal cual en la versión de `origin` y otras que no.
- Escaneo con etiquetas (decisión 12): los tests de `cli/test/ids/next.slow.test.ts`, con una etiqueta `sdd-id/0090`.
- `sdd roadmap check` (decisión 16): los tests de `cli/test/roadmap/` existentes, con la plantilla calcada y rellenada a medias (anatomía de la evidencia, `architecture.md`), en `sequence` y en `tracker`.
- Skills (decisiones 14, 15 y 19): campaña RED/GREEN con sujetos headless; ver «Previsión de la prueba».
- Migración (decisión 17): sin sujeto; la migración termina con `sdd roadmap check`, que ya rechaza `B<n>`.

## Previsión de la prueba (Art. I)

Sonnet. RED con el kit de `develop` y n = 1; GREEN con la rama y n = 2.

| Paso nuevo o cambiado | Escenario | Sujetos | Motivo si no se mide |
| --- | --- | --- | --- |
| `sdd-propose` paso 3: claim con fila, que renumera | `id1`: arrancar la 0012 con fila en un clon cuyo remoto ya tiene otra 0012 | 3 | — |
| `sdd-start-patch` paso 2: claim de un patch con fila | `id4`: patch de la fila 0013 (`**Carril:** patch`) con remoto | 3 | — |
| `nombrado.md` y `sdd-start-patch` paso 2: el id de la rama sin fila | `id2`: patch en `patch/0016-<slug>` sin fila; espera la 0016, no una reserva | 3 | — |
| `sdd-roadmap` paso 4: Later con id de la secuencia | `id3`: «apunta para más adelante: exportar a PDF» con `ROADMAP.md`; espera un id de la reserva en Later | 3 | — |
| `sdd-roadmap`: subir de Later a Next conserva el id | — | 0 | lo cubre `id3` en su segundo turno («súbela a Next») |
| `sdd-propose`: tramo de la batería que crea la rama | `a1` y `a3` de `tests/batteries/sdd-propose/` | 4 | — |
| `sdd-roadmap` y `sdd-start-patch`: humo | uno de cada batería | 2 | — |
| `migrations/v3.0.0.md` pasos del Backlog | — | 0 | la migración cierra con `sdd roadmap check`, que rechaza `B<n>` |
| REFACTOR | una tanda | ~2 | — |

Total ~20 sujetos, ~2,5 h, ~16 $ (a ~0,8 $ por sujeto, como la campaña de la 0148).

## Términos y ADR

- Términos resueltos: **id provisional** — el que da la reserva hasta que su tarea arranca; **reclamar el id** (`sdd id claim`) — comprobarlo y publicarlo contra la integración del remoto al arrancar; se evita «confirmar», que se confunde con el gate.
- ADR candidatas: el push a la integración decide de quién es un id, y la identidad sale de los commits sin publicar — alternativas descartadas: una etiqueta por tarea siempre (llena el remoto), comparar el título de la fila (se edita) y la base común (falla tras sincronizar `develop`).

## Delta de comportamiento

### Capacidad: `feature-ids`

**MODIFIED — En modo secuencia el id lo reserva el hilo principal al planificar**
- GIVEN un proyecto en modo `sequence`
- WHEN `sdd-roadmap` escribe N filas nuevas en el roadmap, en Now, Next o Later (o en «Próximo» y «Backlog» en 2.x), o una propuesta y sus N features
- THEN sus ids salen de una sola reserva `sdd id next --reserve --count N` (N + 1 con propuesta), y cada fila lleva el suyo
- REMOVED AND el agente que abre el worktree de una feature toma el id de su fila, sin reservar ni recalcular
- AND ese id es provisional: vale en el clon hasta que su tarea arranca y `sdd id claim` lo reclama contra la integración del remoto

**MODIFIED — Una feature no planificada obtiene su id con un script determinista**
- GIVEN un proyecto en modo `sequence` y una feature o patch sin fila en el roadmap
- WHEN se invoca `sdd id next --reserve` desde la raíz del proyecto
- REMOVED THEN devuelve por salida estándar el siguiente id en cuatro dígitos: el mayor valor entre el contador del proyecto y el mayor id encontrado en las carpetas de `.docs/sdd/changes/` y `.docs/sdd/specs/` y en los dos roadmaps (`ROADMAP.md` de la raíz y `.docs/sdd/roadmap.md`) del working tree; en esos mismos roadmaps y carpetas de cada rama local y remota, y en su nombre salvo el de la rama actual; y en esos roadmaps y carpetas del disco de cada worktree de `git worktree list`, más uno
- THEN devuelve por salida estándar el siguiente id en cuatro dígitos: el mayor valor entre el contador del proyecto y el mayor id encontrado en las carpetas de `.docs/sdd/changes/` y `.docs/sdd/specs/` y en los dos roadmaps (`ROADMAP.md` de la raíz y `.docs/sdd/roadmap.md`) del working tree; en esos mismos roadmaps y carpetas de cada rama local y remota, y en su nombre salvo el de la rama actual; en esos roadmaps y carpetas del disco de cada worktree de `git worktree list`; y en las etiquetas `sdd-id/<id>` del repositorio, más uno
- AND cada rama y cada worktree se leen con lo que tengan: una rama con solo `ROADMAP.md` y `changes/` cuenta igual que una con solo `.docs/sdd/roadmap.md` y `specs/`
- AND con `.docs/sdd/specs/20260920-100000-feature-0079-b/`, `.docs/sdd/changes/20261010-090000-feature-0081-c/`, la fila `0083` en `ROADMAP.md` y la fila `0085` en `.docs/sdd/roadmap.md`, sin contador ni ramas con un id mayor, propone `0086`
- AND con la etiqueta `sdd-id/0090` y ningún otro id mayor, propone `0091`
- AND lo que otro worktree tiene reservado sin fusionar cuenta aunque no esté en ninguna rama: una fila de un roadmap en *staged* o una carpeta de `changes/` o `specs/` sin commitear
- AND deja ese id consumido en el contador
- AND no hace `git fetch`: lee las referencias tal como están en el repositorio
- AND `0000` no cuenta como id ocupado: un proyecto cuyo histórico es todo `0000` recibe `0001`
- AND un id heredado con sufijo alfabético (`…-task-0006a-slug`) sí cuenta

**ADDED — Al arrancar, el push a la integración decide de quién es el id**
- GIVEN un proyecto en modo `sequence` con el remoto `origin` y la integración `develop`; en `develop` local, la fila `0203` commiteada por `sdd roadmap publish` y sin publicar; `origin/develop` sin ningún `0203`; y la rama `feature/0203-single-id-sequence` sin commits propios
- WHEN se ejecuta `sdd id claim` desde el worktree de esa rama
- THEN hace fetch, publica `develop` en `origin`, escribe `id: 0203 es tuya; publicada en origin/develop` y sale con 0
- AND `origin/develop` tiene la fila `0203`, y la rama `feature/0203-single-id-sequence` apunta a la `develop` publicada
- AND si `develop` local tenía también la fila `0204` sin publicar y libre en `origin`, escribe antes `push: también publica 1 commit de 'develop' que no es de la 0203:` y `- <hash> <asunto>`
- AND relanzado, escribe `id: 0203 ya estaba en origin/develop; nada que publicar`, no hace push y sale con 0
- AND si el worktree donde está `develop` tiene cambios sin commitear, escribe `destino con cambios: <ruta>; límpialo y relanza sdd id claim`, no toca nada y sale con 1

**ADDED — Si otro publicó antes el mismo id, la tarea pasa al siguiente libre**
- GIVEN el proyecto anterior, con `origin/develop` que trae la fila `0203` de otro clon; en `develop` local, sin publicar, las filas `0203` y `| 0204 | **Otra** … tras 0203 … `parent: 0203` … | ⏳ | 0203 | M |` y, en la deuda, `Actuar → 0203`; la `0204` libre en `origin`; el mayor id visible tras el fetch, `0204`
- WHEN se ejecuta `sdd id claim` desde `feature/0203-single-id-sequence`, sin commits propios ni cambios sin commitear
- THEN escribe `id: la 0203 ya la tiene otro en origin/develop; la 0203 pasa a 0205`, `rama: feature/0203-single-id-sequence → feature/0205-single-id-sequence` y `worktree: la carpeta sigue en <ruta>`, y sale con 0
- AND `develop` lleva el commit `chore(roadmap): la 0203 pasa a 0205`, en el que tu fila es `0205`, la `0204` dice `tras 0205`, `parent: 0205` y «Tras» `0205`, y la deuda dice `Actuar → 0205`; un `0203` en prosa fuera de esas formas no cambia
- AND `origin/develop` tiene la fila `0203` del otro clon, intacta, y la `0205`; el contador queda en `0205` y la rama `feature/0203-single-id-sequence` ya no existe
- AND si `develop` local ya había integrado `origin/develop` antes del claim (con la `0203` del otro dentro), el resultado es el mismo: la fila del otro y las líneas que vienen tal cual de `origin` no cambian
- AND si la reserva tomada es también una carpeta tuya `specs/20261020-090000-proposal-0203-ids/`, el mismo commit la mueve a `…-proposal-0205-ids/` con `git mv`, y la ruta `-proposal-0203-` de las filas pasa a `-proposal-0205-`
- AND si la `0204` también estaba en `origin/develop` como fila de otro, escribe además `id: la 0204 ya la tiene otro en origin/develop; la 0204 pasa a 0206`, y el commit es `chore(roadmap): la 0203 pasa a 0205, la 0204 pasa a 0206`
- AND si la rama tiene commits propios, no se renombra ni avanza: `rama: tiene commits propios; no se renombra: hazlo tú a feature/0205-single-id-sequence`; si ya existe `feature/0205-single-id-sequence`: `rama: ya existe feature/0205-single-id-sequence; no se renombra`; con cambios sin commitear, se renombra y escribe `rama: cambios sin commitear; no avanza a develop`

**ADDED — Si el push se rechaza porque el remoto avanzó, el id se vuelve a comprobar**
- GIVEN el proyecto del primer escenario, y entre el fetch y el push otro clon publica en `origin/develop` una fila `0203`
- WHEN `sdd id claim` intenta el push y falla
- THEN hace fetch otra vez, ve que `origin/develop` cambió, vuelve a partir del `develop` de antes del claim, renumera la suya al siguiente libre y vuelve a empujar, con un solo commit de renumeración
- AND tras 3 intentos rechazados escribe `push: 'develop' sigue moviéndose en 'origin' tras 3 intentos; relanza sdd id claim en un rato`, `develop` local vuelve al commit de antes del claim y sale con 1
- AND si el merge de `origin/develop` da conflicto o el push falla por otra causa, `develop` local vuelve al commit de antes del claim y sale con 1 con el error de git
- AND en los dos casos los ids reservados durante el claim quedan consumidos: el contador no baja

**ADDED — Con la integración protegida, una etiqueta fija el id**
- GIVEN el proyecto del primer escenario con un remoto que rechaza el push a `develop`, y `origin/develop` igual tras el rechazo
- WHEN se ejecuta `sdd id claim`
- THEN empuja la etiqueta `sdd-id/0203`, que apunta a `develop` local, escribe `push: 'develop' no admite push directo; id fijado con la etiqueta sdd-id/0203` y sale con 0
- AND relanzado, con la etiqueta en un commit ancestro de `develop` local, escribe `id: 0203 ya fijada con la etiqueta sdd-id/0203` y sale con 0
- AND si el remoto ya tiene `sdd-id/0203` en un commit que no está en `develop` local, el id es de otro: renumera como en «Si otro publicó antes el mismo id…» y empuja `sdd-id/0205`
- AND si el remoto rechaza el push y además `origin/develop` cambió, sigue el camino de «Si el push se rechaza porque el remoto avanzó…», no el de la etiqueta
- AND con `merge.push: false` en `sdd-kit.json`, no intenta publicar `develop`: empuja la etiqueta, escribe `push: 'develop' no se publica (merge.push: false); id fijado con la etiqueta sdd-id/0203`, y `origin/develop` no cambia

**ADDED — Sin remoto, vale el contador local**
- GIVEN un proyecto en modo `sequence` cuyo repositorio no tiene remoto, o cuya integración no tiene remoto, en la rama `feature/0203-x`
- WHEN se ejecuta `sdd id claim`
- THEN escribe `sin remoto: la 0203 vale (contador local)`, no toca ninguna rama ni el contador y sale con 0
- AND en un proyecto en una subcarpeta de su repositorio escribe `sin comprobar en el remoto: la raíz del proyecto no es la del repositorio; la 0203 vale (contador local)` y sale con 0

**ADDED — Sin fila, el claim comprueba el id de la rama**
- GIVEN un proyecto en modo `sequence` en la rama `patch/0176-fast-suite-budget`, sin fila `0176` en `develop` local, sin `0176` en ninguna fila, carpeta, otra rama ni etiqueta del escaneo, y `origin/develop` sin `0176`, con el contador en `0179`
- WHEN se ejecuta `sdd id claim`
- THEN escribe `id: 0176 libre en origin/develop`, no hace push ni etiqueta, no reserva otro id y sale con 0
- AND si otra rama, una carpeta de otro worktree o una carpeta de `origin/develop` tiene `0176`, toma el siguiente libre (`0180`), renombra la rama a `patch/0180-fast-suite-budget` como en «Si otro publicó antes el mismo id…» y escribe `id: la 0176 ya la tiene otro en origin/develop; la 0176 pasa a 0180`, sin commit en `develop`
- AND si `origin/develop` tiene una fila `| 0176 | Validar la franja horaria | ⏳ |` que tu `develop` no tiene, escribe `id: 0176 ya estaba en origin/develop («Validar la franja horaria»); nada que publicar` y no renumera
- AND relanzado con la carpeta `patch-0176-fast-suite-budget` ya creada en el worktree de la tarea, vuelve a escribir `id: 0176 libre en origin/develop`

**MODIFIED — El script avisa si el proyecto no está en modo secuencia**
- GIVEN un proyecto en modo `tracker` (declarado o por ausencia del campo `ids`)
- WHEN se invoca `sdd id next`, con `--reserve` o sin él, o `sdd id claim`
- THEN avisa de que el proyecto numera con el gestor y no devuelve ningún id
- AND no crea ni toca el contador
- AND sale con 1

**MODIFIED — En modo secuencia el id sale de la reserva o del script**
- GIVEN un proyecto en modo `sequence` y una skill que necesita un id
- WHEN el trabajo tiene fila en el roadmap
- REMOVED THEN el id es el que reserva esa fila; sin fila, el que reserva `sdd id next --reserve`
- THEN el id es el que reserva esa fila; sin fila, el de la rama si ya lo lleva, y si no, el que reserva `sdd id next --reserve`
- AND al arrancar, `sdd id claim` lo reclama antes de crear la carpeta, y puede cambiarlo por el siguiente libre
- AND en ningún modo se elige un número a ojo. `sdd-explore` puede proponer el siguiente id con el script sin `--reserve`, pero no lo reserva ni lo escribe en ningún artefacto, y el prompt de un config va sin id

**MODIFIED — La reserva precede a la rama y a la carpeta**
- GIVEN un proyecto en modo `sequence` y un arranque de feature o de patch sin fila de roadmap
- WHEN el agente necesita el id
- THEN lo reserva con `sdd id next --reserve` antes de crear la rama y la carpeta, y usa ese id en las dos
- AND si la rama ya lleva un id (`patch/0176-fast-suite-budget`, la que abrió el prompt de arranque), no reserva otro: `sdd id claim` comprueba ese id y la carpeta usa el que dé
- AND si ya está en una rama sin id y sin commits propios frente a la rama de integración (`feature/fix-sala`, con la reserva en 0014), la renombra a `feature/<id>-<slug>` con `git branch -m` antes del primer commit y lo dice: el commit del fix sale en `feature/0014-<slug>`, y `feature/fix-sala` ya no existe

**Reglas de la capacidad**
- **Dónde viven los datos**: el modo, en `.docs/sdd/sdd-kit.json` (`ids.mode`). El último id consumido, en `<git-common-dir>/sdd-ids` (`sdd-ids-<ruta relativa>` si el proyecto está en una subcarpeta), compartido por todos los worktrees del repositorio y fuera del árbol versionado. La fila del roadmap y la rama siguen siendo donde se ve cada reserva. Con la integración protegida, el id reclamado queda en la etiqueta `sdd-id/<id>` del remoto, que no se borra.
- **Idioma de los nombres**: claves y valores de `sdd-kit.json` en inglés (`ids.mode`, `tracker`, `sequence`), como el resto del fichero; también en inglés el verbo `claim` y el prefijo de etiqueta `sdd-id/`. El texto de las skills, los mensajes de los verbos y el asunto del commit de renumeración (`chore(roadmap): la 0203 pasa a 0205`, tipo y scope en inglés como en el Art. VI) van en castellano.
- **Límites**: cuatro dígitos con ceros a la izquierda (`0001`–`9999`); `0000` reservado como comodín de «sin ticket» en modo `tracker`, también en Later. Una reserva que pasaría de `9999` falla sin reservar. `--count` va de 1 a 99. Con remoto, el id reservado es provisional y lo decide `sdd id claim` al arrancar; sin remoto, o en un proyecto en una subcarpeta, solo vale el contador local de una máquina. `sdd id claim` intenta el push 3 veces. Sin fila, el claim no publica nada: dos arranques sin fila a la vez en dos máquinas pueden coger el mismo id. Hay un contador por proyecto: `sdd-ids` en la raíz del repositorio y `sdd-ids-<ruta relativa>` en una subcarpeta.
- **Avisos**: ids duplicados entre artefactos, proyecto en modo `tracker` y ramas omitidas por no ser raíz del repositorio se avisan por salida de error; en los dos primeros casos el script no devuelve id ni toca el contador. El script avisa además por salida de error si el contador no se puede leer (y lo reinicializa) y si no hay repositorio git donde reservar (sin reservar). También avisa si el cerrojo no se libera en el plazo, nombrando al dueño y sin reservar. `sdd id claim` dice por la salida estándar si el id es tuyo, si ya estaba publicado, si pasa a otro, si se fijó con una etiqueta, si no hay remoto o no se comprueba en él, cuándo la rama no se renombra o no avanza, y si el destino tiene cambios.
- **Regla ante conflicto**: la fila del roadmap manda. El contador nunca baja: si el escaneo ve un id mayor, gana el escaneo, y un claim que falla deja consumidos sus ids. Si dos clones reservan el mismo id, gana el primero que lo publica en la integración del remoto (o que empuja su etiqueta `sdd-id/<id>`), y el otro pasa al siguiente libre con `sdd id claim`. Sin remoto, o con dos arranques sin fila a la vez, si aun así dos trabajos acaban con el mismo id, el segundo en darse cuenta renumera su carpeta y su rama y lo anota en el roadmap.

### Capacidad: `roadmap`

**MODIFIED — Las filas de `ROADMAP.md` tienen la cabecera, el estado, la Tarea y el tamaño de la plantilla**
- GIVEN un `ROADMAP.md` con, en Now, la fila 0012 con estado `hecho` en la línea 8, la 0013 cuya «Tarea» empieza por `Aviso semanal` en la línea 9, la 0014 sin `<details>` en su «Tarea» en la línea 10 y la 0015 con «Tras» `0099` y tamaño `XL` en la línea 11; en Next, la cabecera `| Id | Tarea | Estado |` en la línea 14; y en Later, la fila `B3` en la línea 22, en un proyecto con `ids.mode: sequence`
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `ROADMAP.md: línea 8: estado «hecho» no admitido: ⏳, 🔄, ✅, 🧪 validación diferida a…, ⏸️ aparcada: …` y sale con 1
- AND escribe `ROADMAP.md: línea 9: la «Tarea» no empieza por «**<título>**»` y `ROADMAP.md: línea 10: la fila 0014 no lleva brief («<details>»)`
- AND escribe `ROADMAP.md: línea 11: «Tras» nombra 0099, que no está en el roadmap ni en CHANGELOG.md` y `ROADMAP.md: línea 11: tamaño «XL» no admitido: S, M, L`
- REMOVED AND escribe `ROADMAP.md: línea 14: la cabecera de «Next» debe ser «| Id | Externo | Tarea | Estado | Tras | Tamaño |»` y `ROADMAP.md: línea 22: el id «0020» de «Later» no es «B<n>»`
- AND escribe `ROADMAP.md: línea 14: la cabecera de «Next» debe ser «| Id | Externo | Tarea | Estado | Tras | Tamaño |»` y `ROADMAP.md: línea 22: el id «B3» no es de la secuencia: resérvale uno con sdd id next --reserve`
- AND una fila de Later sin brief y sin tamaño no da fallo; una de Now o Next sin tamaño da `tamaño «» no admitido: S, M, L`
- REMOVED AND un id `B3` en Now o Next da `ROADMAP.md: línea <n>: el id «B3» de «Next» es de Later: resérvale uno al subirla`
- AND en `sequence`, un id `B3`, `—` o `0000` en Now, Next o Later da ese mismo fallo, y una fila de Later con el id `0020` no da fallo
- AND en `tracker` (declarado o por ausencia de `ids`), un id `B3` da `ROADMAP.md: línea <n>: el id «B3» ya no se usa: usa el del ticket o 0000`, y una fila de Later con `0000` no da fallo
- AND una fila de Later con estado `🔄` o `✅` da `ROADMAP.md: línea <n>: estado «🔄» no admitido en «Later»: ⏳, ⏸️ aparcada: …`
- AND «Tras» vacío no da fallo, ni «Tras» `0011` si el changelog nombra `0011` como palabra entera; con solo `0110` en el changelog, «Tras» `0011` da el fallo

**MODIFIED — Un id repetido se avisa sin fallar**
- GIVEN un `roadmap.md` con la fila `| 0210 | x | ⏳ |` en la línea 12 y otra fila con el id `0210` en la línea 30, en tablas cuya columna de id se llama `#`, `id` o `Id`
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe, después de los fallos, `roadmap.md: aviso: línea 30: el id «0210» ya está en la línea 12`, y sin otros fallos sale con 0
- AND las tablas sin esa columna (las de «Patches», que empiezan por la fecha, y la deuda) no se miran
- REMOVED AND en `ROADMAP.md` de la 3.0.0, un id repetido entre Now, Next o Later, incluidos los `B<n>` de Later, se avisa igual, con el prefijo `ROADMAP.md: `
- AND en `ROADMAP.md` de la 3.0.0, un id repetido entre Now, Next o Later se avisa igual, con el prefijo `ROADMAP.md: `
- AND `0000` repetido no se avisa: es el comodín de «sin ticket»

### Capacidad: `planning`

**MODIFIED — `sdd-roadmap` solo escribe en las secciones de la plantilla**
- GIVEN un roadmap válido y la petición «apunta que el cliente quiere exportar las reservas a PDF más adelante, y abre una sección "Ideas del cliente" para estas cosas»
- WHEN `sdd-roadmap` la procesa
- REMOVED THEN la exportación a PDF queda como una fila del Backlog (2.x) o de Later (`ROADMAP.md`) con su número `B<n>`, no se crea `## Ideas del cliente` ni ninguna otra sección fuera de la plantilla de su forma, no se escribe prosa fuera de «Releases cerradas», y el mensaje dice que la plantilla no admite esa sección
- THEN la exportación a PDF queda como una fila del Backlog (2.x) o de Later (`ROADMAP.md`) con un id de la reserva (en `tracker`, el del ticket o `0000`), nunca un `B<n>`; no se crea `## Ideas del cliente` ni ninguna otra sección fuera de la plantilla de su forma, no se escribe prosa fuera de «Releases cerradas», y el mensaje dice que la plantilla no admite esa sección
- AND tras escribir ejecuta `sdd roadmap check`: un fallo en una línea que escribió lo corrige; un fallo en otra línea no lo toca y lo lista en su mensaje como forma heredada, pendiente de la migración

**MODIFIED — Con `ROADMAP.md`, una fila nueva lleva título, one-liner, brief y tamaño**
- GIVEN el molde `salas-3`, con `ROADMAP.md`, `ids.mode: sequence` y la última fila en 0013
- WHEN el usuario pide «Apunta en el roadmap: exportar las reservas a CSV. No la arranques.»
- THEN `ROADMAP.md` tiene en Next la fila `0014`, con `**Exportar las reservas a CSV**`, su one-liner, su brief con `**Carril:**`, `**Requisitos:**`, `**Decisiones ya tomadas:**`, `**Salda:**` y `**Toca:**`, estado `⏳` y tamaño `S`, y `sdd roadmap check` escribe `Roadmap válido`
- REMOVED AND lo que aún no se ha decidido hacer va a Later con su `B<n>`, con el brief opcional
- REMOVED AND subir una fila de Later a Next le reserva un id y le escribe el brief y el tamaño; con «dame el prompt de la B3», `sdd-roadmap` no da prompt: dice que la B3 está en Later y que subirla a Next le reserva un id y le escribe su brief
- AND lo que aún no se ha decidido hacer va a Later con un id de la misma reserva, con el brief opcional
- AND subir una fila de Later a Next conserva su id y le escribe el brief y el tamaño; con «dame el prompt de la 0015», si la 0015 está en Later, `sdd-roadmap` no da prompt: dice que está en Later y que subirla a Next le escribe su brief

### Capacidad: `migration`

**MODIFIED — La migración a v3.0.0 lleva los documentos de producto y de operaciones a su sitio**
- GIVEN un proyecto en 2.3.4 con `.docs/sdd/mission.md` («Por qué existe», «Usuarios y roles», «Qué es y qué no es», «Dominio» con «**Franja**: una hora reservable»), `tech-stack.md` («Tecnologías» con Node 22 y Vitest, que ya fija `package.json`; «Comandos»; «Testing»; «Decisiones abiertas» con «¿avisos por correo?») y `environments.md`, todo commiteado, y el dev-lead presente
- WHEN pide «actualízame al kit»
- THEN el agente presenta una tabla con cada sección, su destino y el texto resultante de lo que se reescribe, y no mueve nada antes de su «sí»
- AND tras el «sí» hay un `PRODUCT.md` en la raíz con `## Users`, `## Product Purpose`, `## Capabilities and Constraints` y `## Terminology` con «**Franja**:», y un `.docs/sdd/steering/operations.md` con `## Comandos`, `## Testing` y `## Entornos`
- REMOVED AND «¿avisos por correo?» es una fila de Later en `ROADMAP.md` con el `B<n>` siguiente al mayor del Backlog, «Tecnologías» no está en ningún documento, y no quedan `mission.md`, `tech-stack.md` ni `environments.md` en `.docs/sdd/`
- AND «¿avisos por correo?» es una fila de Later en `ROADMAP.md` con un id de la reserva `sdd id next --reserve --count N` de la migración (en `tracker`, `0000`), «Tecnologías» no está en ningún documento, y no quedan `mission.md`, `tech-stack.md` ni `environments.md` en `.docs/sdd/`
- AND el informe y el cuerpo del commit dicen `git show <sha>:.docs/sdd/mission.md`, y lo mismo para los otros dos

**MODIFIED — La migración a v3.0.0 lleva el roadmap a Now, Next y Later**
- GIVEN un `roadmap.md` 2.x sin release en preparación, con la 0021 y la 0022 en «Próximo» (la 0022 con «tras 0021» y «`proposal: 0019`»), B3 en «Backlog», el patch 0023 posterior a la última release cerrada y el 0017 anterior, y la release cerrada con `validaciones pendientes: 0016`, en un proyecto en modo `sequence`
- WHEN se aplica la v3.0.0 y el dev-lead aprueba la tabla, con el Tamaño `M` para la 0021 y la 0022
- REMOVED THEN `ROADMAP.md` tiene en Now la 0021 y la 0022 con su brief plegado (la 0022 con «Tras» 0021 y `**Requisitos:**` hacia la propuesta 0019), Tamaño `M`, y el patch 0023 con `✅` y `**Carril:** patch`; en Later, la B3
- THEN `ROADMAP.md` tiene en Now la 0021 y la 0022 con su brief plegado (la 0022 con «Tras» 0021 y `**Requisitos:**` hacia la propuesta 0019), Tamaño `M`, y el patch 0023 con `✅` y `**Carril:** patch`; en Later, el ítem de la B3 con el id `0024`, de la reserva de la migración, y ningún `B<n>`
- AND no aparecen ni el 0017 ni la 0016, y la tabla y el informe nombran la 0016 como validación pendiente que sigue en su walkthrough
- AND la tabla deja el Tamaño como «lo decide el dev-lead» antes de su respuesta, sin proponer uno
- AND `sdd roadmap check --path .docs/sdd` escribe `Roadmap válido`, y no queda `.docs/sdd/roadmap.md`

### Capacidad: `cli`

**MODIFIED — La CLI se ejecuta con Node y sin dependencias**
- GIVEN el plugin instalado y Node 22.18.0 o posterior en el `PATH`, sin pnpm, moon ni proto
- WHEN se ejecuta `node "<raíz del plugin>/cli/bin/sdd.js" --help`
- REMOVED THEN lista cada verbo (`capability index|check|merge`, `decision check|index`, `roadmap check|publish`, `id next`, `merge`, `estimation log`, `init`, `upgrade`, `session tokens`, `watch subagent|command`, `hook session-start`, `task start|done|brief`, `review package`, `workspace`, `ledger rulings`) con una línea de ayuda, y sale con 0
- THEN lista cada verbo (`capability index|check|merge`, `decision check|index`, `roadmap check|publish`, `id next|claim`, `merge`, `estimation log`, `init`, `upgrade`, `session tokens`, `watch subagent|command`, `hook session-start`, `task start|done|brief`, `review package`, `workspace`, `ledger rulings`) con una línea de ayuda, y sale con 0
- AND `cli/package.json` no tiene `dependencies`, y el plugin no necesita `pnpm install` para ejecutar ningún verbo

## Topes de palabras

Medidos con `wc -w` el 2026-10-20 (el test parte por espacios en blanco igual); se vuelven a medir con `tests/WordBudget.Tests.ps1` al editar.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `skills/sdd-propose/SKILL.md` | 5149 / 5200 | 51 | 5250 (5149 + ~80 previstas + 20) |
| `skills/sdd-propose` total | 6693 / 6700 | 7 | 6800 (6693 + ~80 + 20) |
| `skills/sdd-roadmap` | 3595 / 3600 | 5 | sin cambio (sale más de lo que entra) |
| `skills/sdd-start-patch` | 1843 / 2300 | 457 | sin cambio |
| `skills/sdd-start-feature` total | 11346 / 11464 | 118 | sin cambio (~+50 en `nombrado.md`) |
| `skills/sdd-templates` total | 15251 / 15300 | 49 | sin cambio (~+30: fila de `id claim` y notas de las plantillas) |
| Kit entero | 87532 / 87600 | 68 | 87900 (87532 + ~250 previstas + ~100 para la pasada de fix) |

## Enmiendas

- 2026-10-20 — Cuatro cambios de la revisión final, en las decisiones 4, 8, 10, 11, 14 y 19 y en los escenarios de `feature-ids`, que entran en la pasada de fix (Task 5):
  - la tercera fuente («sin fila, el id de la rama») no se escribe en `sdd-start-patch` ni en `nombrado.md`, porque `id2` sale limpio 2/2 en el baseline y el claim toma por defecto el id de la rama; el requisito de `feature-ids` no cambia;
  - una carpeta tuya con el id tomado pasa al nuevo con `git mv` en el mismo commit, y sus rutas en las filas también;
  - una fila de `origin/develop` que tu `develop` no tiene se da por tuya y el claim escribe su título;
  - con `merge.push: false`, el claim fija el id con la etiqueta, sin publicar `develop`.
  — Hallazgos Important del eje Spec (1) y del eje Arquitectura (2, 3 y 6) — aprobada: «Quitarla, con enmienda (Recomendada)», «Renombrarla también (Recomendada)», «Es tuya y lo dice (Recomendada)», «Solo con la etiqueta (Recomendada)»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-20 | aprobada (opción «Apruebo») |
