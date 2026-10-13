---
id: 20261013-112220-feature-0150-roadmap-triage-release-feedback
feature: 0150
proposal: 0131
title: Roadmap Now / Next / Later y debt.md con triaje
mode: full
profile: delegate
status: approved
created: 2026-10-13
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-13
---

# Spec — Roadmap Now / Next / Later y debt.md con triaje

🦆 El roadmap de un proyecto pasa a tener tres listas ordenadas por prioridad, «ahora», «después» y «más adelante», y cada tarea lleva plegado su encargo, del que sale el texto para arrancarla en otra sesión; la deuda se va a su propio documento, en cuatro montones: por mirar, en espera, lista para hacer y descartada. Si un informe dice «desde la 1.4.2 la exportación a CSV pierde las tildes» y la última versión publicada es la 1.4.1, el kit lo dice al repasarlo, y esa entrada no pasa a «lista» hasta que alguien reproduzca el fallo o llegue un segundo caso. Una entrada que pasa dos versiones en espera sin segundo caso, sin contar las de solo arreglos, queda señalada para descartarla. El comprobador del roadmap valida la forma nueva y deja de dar los 106 avisos de destino que salen hoy en este repo, cuyo roadmap sigue en la forma vieja hasta su migración. Y el informe de mejora del kit dice, para cada versión o cifra que cuenta, de qué fichero o de qué comando sale.

## Capacidades

- Modificadas: `roadmap` — `ROADMAP.md` con Now, Next y Later y sus reglas; `debt.md` con una sección por estado, evidencia en «Lista» y caducidad; el roadmap 2.x deja de avisar del «Destino»; los ficheros que toca una feature van en el «Toca:» de su brief.
- Modificadas: `planning` — `sdd-roadmap` escribe la forma nueva, o la 2.x con equivalencias; prepara la release en el título de Now; da el prompt desde el brief; tría la deuda contrastando los datos con su fuente.
- Modificadas: `kit-feedback` — cada versión, cifra o cita de «Qué pasó» lleva su fuente.
- Modificadas: `control-profiles` — el freno de alcance lee el «Toca:» del brief, y el perfil de la release va bajo `## Now`.
- Modificadas: `routing` — triar la deuda entra por `sdd-roadmap`.
- Modificadas: `onboarding` — `sdd-templates` ofrece las plantillas de `ROADMAP.md` y `debt.md`, y la del roadmap 2.x sigue hasta la 0157.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: contrato público (la forma de ROADMAP.md y debt.md, que leen la CLI, sdd-roadmap y el freno de alcance, y leerán los cierres de la 0149 y el corte de la 0177), MODIFIED (14 requisitos y 1 REMOVED en 6 capacidades), tres o más capacidades (6), dato persistente nuevo (debt.md) · tamaño: ~1.300 líneas en ~35 ficheros
- Dominio (Opus): si la tabla de equivalencias de «Sin ROADMAP.md, sdd-roadmap escribe la forma 2.x» deja algún estado de debt.md sin destino 2.x; si la caducidad de «Una fila en espera caduca…» casa con «lo hecho queda en Now hasta el corte»; si el MODIFIED de control-profiles conserva los demás AND del desvío (señal: MODIFIED + reglas del flujo)
- Técnica (Sonnet): si los mensajes del check de «Las filas de ROADMAP.md…» casan con el formato de hoy (prefijo, línea, salida 1); si «Tras» con un id ya publicado falla tras el corte; si los Pester que leen roadmap-template.md siguen en verde con la plantilla 2.x intacta (señal: contrato público + tamaño)
- Mínimo razonable: un revisor de siete puntos en Sonnet — deja sin mirar con Opus las reglas del triaje (estados, evidencia, caducidad), que son reglas del flujo
```

1. **La plantilla 3.0.0 se llama `now-next-later-template.md`** y `roadmap-template.md` se queda intacta como plantilla 2.x hasta la 0157, que retira las plantillas 2.x. `ROADMAP-template.md` choca en Windows y macOS con `roadmap-template.md` (solo cambia la caja). Reescribir `roadmap-template.md` dejaría sin forma a lo que hoy lee la 2.x de ella:
   - el formato de cierre del paso 8 de `sdd-end-feature` y del paso 4 de `sdd-end-patch`, que usa cada cierre de este repo;
   - las init, que aún escriben `.docs/sdd/roadmap.md` calcándola (requisito vivo de `onboarding`);
   - la migración v2.3.0;
   - seis Pester y un Vitest.

   Repuntarlos a un `roadmap-2x-template.md` es editar cuatro skills, con un humo cada una (Art. I). A cambio, la plantilla nueva no lleva el nombre de su destino, como `PRODUCT-template.md`.
2. **`debt-template.md` → `.docs/sdd/steering/debt.md`**, con las cuatro secciones y cabeceras del diseño 2 y la primera línea `# Deuda técnica — <proyecto>`.
3. **Forma de la celda «Tarea»**: `**<título>**<br>*<one-liner llano>*<details><summary>Brief</summary>…</details>`. El brief lleva, separadas por `<br>`, las etiquetas del prompt de arranque: `**Carril:**`, `**Requisitos:**`, `**Decisiones ya tomadas:**`, `**Salda:**` y `**Toca:**`. Así cada línea del prompt sale de una etiqueta. Que `<details>` se pliegue en una celda está visto en GitHub; en Azure DevOps no lo he verificado, y si no se pliega se lee como texto.
4. **Una propuesta, en 3.0.0, va en el «Requisitos:» del brief** (la ruta de `proposal.md`, que lleva su id), y la dependencia, en «Tras». Sin marcador `proposal: <id>` aparte: el brief ya nombra el fichero.
5. **Estados**: los cinco de hoy, con sus literales (`⏳`, `🔄`, `✅`, `🧪 validación diferida a <disparador>`, `⏸️ aparcada: <motivo>`), en la cuarta columna.
6. **Tamaño**: obligatorio en Now y Next (`S`, `M` o `L`); en Later puede ir vacío. Lo valida el check. Es la lectura de «en Later puede ir vacío» del diseño 1.
7. **«Tras» admite un id que ya no está en el roadmap si el changelog lo nombra** (corrección del repaso de coherencia): tras el corte, lo publicado sale de Now (0177), y una fila de Next «Tras 0150» fallaría. «Lo nombra» es el id como palabra entera (`0011` sí casa con «Feature 0011», no con `0110`), en el changelog que ya resuelve la CLI: el de la raíz o, sin él, el 2.x (review técnica).
7 bis. **Qué no valida el check** (review técnica): el formato de «Id» y «Externo», ni los ids repetidos, como hoy en la 2.x, salvo un `B<n>` en Now o Next (se reserva un id al subirla) y un id de Later que no sea `B<n>`; ni el contenido del «Destino» de «Lista», que sí falla vacío, como la «Evidencia» (review de dominio). Sí valida que «Fecha» sea `AAAA-MM-DD`, porque de ella depende la caducidad. `feature-ids` no cambia: `cli/src/ids/scan.ts:33` lee el id de la primera columna, que en `ROADMAP.md` sigue siendo el id. Un `|` dentro del brief se escribe `\|`, como pide GitHub en una celda; lo dice la plantilla, y `cells()` ya lo respeta (`cli/src/roadmap/parse.ts:53`).
7 ter. **Literales del triaje** (review técnica): «Falta» `reproducirlo` o `2.º caso`; «Motivo» `caducada` para la que caduca; «Destino» `sin fila` cuando no hay fila que la salde; «Fecha», el día en que la fila entra en su estado (diseño 2).
7 quater. **El triaje propone y espera en `pair` y `delegate`**: es el paso 3 vigente de `sdd-roadmap` («Propón y espera»: con «decide tú», escribe y deja lo decidido en el commit), no una parada nueva del perfil (review técnica, rechazado como contradicción).
8. **Mensajes del check**, con el prefijo y la forma de hoy (literales en el delta de `roadmap`). La primera línea de `ROADMAP.md` es `# Roadmap`, como en la 2.x; la de `debt.md`, `# Deuda técnica`.
9. **Caducidad**: una «release» es una versión `## [X.Y.0] - AAAA-MM-DD` del changelog (el de la raíz o el 2.x, como ya resuelve la CLI); una versión patch (`X.Y.Z` con `Z` > 0) no cuenta, porque dos hotfixes en una semana no dan tiempo a un 2.º caso (review de dominio). Cuentan las de fecha estrictamente posterior a la «Fecha» de la fila. `[Unreleased]` no cuenta, y sin changelog no avisa.
10. **`debt.md` se valida si existe, en cualquier proyecto**: también junto a un roadmap 2.x. Un fallo de `debt.md` hace salir con 1, como uno del roadmap.
11. **La entrada «Triar» de `sdd-roadmap`**:
    - La disparan «tria el ticket», «triaje de la deuda» o las filas de «Por triar».
    - Contrasta cada versión, cifra o cita del ítem con el fichero o el comando que cita (spec, walkthrough, `CHANGELOG.md`, `sdd-kit.json`). Si no cita ninguno, la contrasta con el proyecto.
    - Un dato que no casa se dice con su fuente. Ese ítem no se propone en «Lista» con ese dato: se corrige, si la fuente da el valor y el fallo se reproduce, o va a «En espera» con «Falta» `reproducirlo`.
    - Origen y Fecha: el enlace al ticket y el día en que la fila entra en su estado. Una fila que sigue en su estado conserva su «Fecha», para que la caducidad no se reinicie al volver a triarla (review de dominio).
    - El 2.º caso de una fila descartada entra en «Por triar» como fila nueva, con los dos orígenes. `**Salda:**` de un brief solo nombra filas de «Lista». En `unattended`, lo que no puede decidir se queda en «Por triar», y el resto se registra en el commit.
    - Con `ROADMAP.md` y sin `debt.md`, el triaje crea `debt.md` calcando `debt-template.md`.
12. **En 2.x el triaje no deja nada «por triar»**: cada ítem sale con su «Destino». La 2.x no tiene esa sección, y el check 2.x ya no avisa de un «Destino» vacío.
13. **Prompt desde el brief**: en `launch-prompt-template.md` cambia una línea: el carril sale del «Carril:» del brief, o de la fila 2.x («Patch:» → patch).
14. **`using-sdd`**: la fila de planificar gana «triar la deuda o un ticket» solo si el RED del escenario de triaje no entra por `sdd-roadmap` (Art. I: sin fallo no se escribe).
15. **`sdd-feedback`**:
    - Hueco en `kit-feedback-template.md`, debajo de «Qué pasó»: `- **Fuente**: <fichero:línea o comando de cada versión, cifra o cita de «Qué pasó»: «`.docs/sdd/sdd-kit.json:3` → `"version": "2.3.3"`»>`.
    - Regla en la skill: «un dato que recuerdas y no has comprobado no va en «Qué pasó»: lo compruebas o lo quitas».
    - El ticket sigue en castellano (regla de la capacidad): traducir la skill no cambia el idioma del ticket.
16. **Traducción** (Art. III): `sdd-roadmap` y `sdd-feedback` se reescriben en inglés sobre su estructura. Lo que cambia o sale, en «Reglas que cambian o salen». La `description` de `sdd-roadmap` gana «triage».
17. **Topes de palabras** (Art. I): `sdd-roadmap` está en 2.628 de 2.700 y `sdd-feedback` en 611 de 700. Si el texto en inglés los pasa, suben a la centena de arriba de lo medido. Esta línea es la decisión que pide la constitution, y la tomas al aprobar la spec.
18. **Índice de `sdd-templates`**:
    - dos filas nuevas;
    - `roadmap-template.md`, marcada «2.x: la retira la 0157»;
    - `client-changelog-template.md` pasa de «la retira la 0150» a «la 0177», porque la 0150 se partió;
    - la fila de `sdd roadmap check` de la tabla de la CLI dice que valida `ROADMAP.md` o `roadmap.md`, y `steering/debt.md`.
19. **No declaro MODIFIED los requisitos que la 3.0.0 no contradice**, como hizo la 0144 (decisión 17): los de `roadmap` con mensajes `roadmap.md:` (forma 2.x), y los de `planning` de los items del gestor y «algo concreto es una fila». Sí declaro los que dicen una sección, una celda o una columna que en `ROADMAP.md` no existe.
20. **Lo que sale de la deuda**:
    - Se salda la fila del ticket del patch 0164 (los avisos de «Destino»). Su re-destino de las filas «Patch, versión siguiente» no se hace (respuesta «1»): la 0157 las migra a «Por triar».
    - Se salda la del ticket de la 0165 §1 (la «7.1.0»).
21. **Previsión de coste** (Art. I), sujetos Sonnet headless:

    | Paso nuevo o cambiado | Escenario | RED | GREEN |
    | --- | --- | --- | --- |
    | roadmap: triar contrasta los datos, no propone «Lista» sin evidencia, propone y espera | `m3` (molde `salas-3`, «Tria lo que hay por triar en la deuda.») | 2 | 2 |
    | roadmap: el prompt sale del brief | `m4` (`salas-3`, «dame el prompt de la 0013») | 2 | 2 |
    | roadmap: «apunta» escribe la fila en Next con brief y tamaño, y el check en verde | `m5` (`salas-3`, «Apunta en el roadmap: exportar las reservas a CSV. No la arranques.») | 2 | 2 |
    | roadmap: en 2.x, el triaje escribe «Deuda técnica» con su «Destino» | `m6` (`salas`, «Tria el informe de QA de docs/qa/2026-10-12-informe.md. Decide tú.») | — | 2 |
    | roadmap: control de lo traducido | `m1`, `m2` | — | 4 |
    | `using-sdd`: triar entra por `sdd-roadmap` | `r7` («Tria lo que hay por triar en la deuda.») | 2 | 2 |
    | `using-sdd`: la `description` de una puerta cambia | batería entera (21 escenarios) | — | 30 |
    | `sdd-feedback`: «Fuente», y control de lo traducido | `fb1` (humo: notas de una sesión con «superpowers 7.1.0» y la 7.0.0 instalada) | 1 | 1 |
    | CLI, plantillas, índice y nombres | Vitest y Pester | — | — |

    Sin escenario, con su motivo:
    - **Freno de alcance que lee «Toca:»**: solo cambia la celda que lee, y medirlo pide una enmienda con otra feature abierta en un `ROADMAP.md`, sin molde hasta la 0156. La frase la fija un Pester.
    - **Preparar la release en 3.0.0**: el título de Now lo valida el check que `sdd-roadmap` ejecuta en su paso 5, y el scope y el orden los decide el usuario, como hoy.
    - **«Algo grande» y reordenar en 3.0.0**: el brief y «Tras» los exige el check.
    - **«Dame el prompt de la B3»**: tiene la misma forma que la regla vigente para una fila cerrada o en marcha, que lo dice en vez de dar el prompt.
    - **Perfil de la release bajo `## Now`**: el mecanismo y la precedencia no cambian; el check admite la línea.
    - **Propuesta bajo `changes/` con `ROADMAP.md`**: es una ruta, y m5 y m3 no escriben propuestas. Lo cubre un Pester sobre la frase.

    m6 va sin RED porque el contraste es la misma regla que mide m3.

    Coste: 9 sujetos de RED y 45 de GREEN, ~28 $ (~0,8 $ por sujeto de `sdd-roadmap` o `sdd-feedback`, ~0,3 $ en `using-sdd`) y ~4 h de campaña. Techo: 34 $ (`COST_CAP`), con ~20 % de reserva. Si un RED no exhibe el fallo, su regla y su THEN salen y vuelvo a pedirte la aprobación. Si la prueba pasa del techo, paro y decides tú.
22. **Una pieza entra, otra sale** (Art. I):
    - Entran las dos plantillas, las reglas 3.0.0 del check, la entrada «Triar» y el hueco «Fuente».
    - Sale el aviso del «Destino», con su código en `warnings.ts` y su mitad del requisito de `roadmap`.
    - Las reglas 2.x de `sdd-roadmap` pasan de prosa por entrada a una tabla de equivalencias.
    - «Ficheros que toca», «Release N», «Patches» y «Releases cerradas» no existen en la forma 3.0.0.
23. **Repaso de coherencia**:
    - el «Tras» con ids publicados (decisión 7);
    - en `ROADMAP.md`, la propuesta va en el brief (decisión 4), y por eso «Algo grande» y «Reordenar» pasan a MODIFIED;
    - el patch pendiente y «solo escribe en las secciones de la plantilla» nombran «Próximo» y «Backlog», que en `ROADMAP.md` no existen: MODIFIED;
    - el MODIFIED de `onboarding` lleva el cambio de la de cliente a la 0177;
    - los MODIFIED buscados fuera de la spec están en el Scope:
      - el freno de alcance, en `control-profiles.md`, línea 75;
      - la cabecera de release, en `tables.ts`, y el aviso, en `warnings.ts`;
      - el carril del prompt, en `launch-prompt-template.md`;
      - el índice, en `sdd-templates/SKILL.md`;
      - los Pester que leen las dos skills;
    - quedan fuera, con dueño:
      - `sdd-end-feature` y `sdd-end-patch`, que siguen en 2.x hasta la 0149;
      - las init, hasta la 0156;
      - `sdd-end-release`, hasta la 0177.
24. **El perfil de la release, en `ROADMAP.md`, es la línea `Perfil de control: <perfil>` entre `## Now` y su tabla**, la única línea de texto que admite el fichero (review de dominio, crítico). Hoy el perfil vive bajo el encabezado de la release, y Now es la release en preparación. Lo dicen el MODIFIED de `control-profiles` y una frase de `control-profiles.md` (línea 17); sin escenario, porque el mecanismo y la precedencia no cambian.
25. **Con `ROADMAP.md`, `sdd-roadmap` escribe la propuesta en `.docs/sdd/changes/<ts>-proposal-<id>-<slug>/`**, como fija el Art. IV para la 3.0.0. En 2.x sigue en `specs/` (review de dominio).
26. **Nada crea todavía `ROADMAP.md` en un proyecto real**: lo harán las init (0156), la migración (0157) y los cierres (0149). Aquí se fijan la forma, el check y `sdd-roadmap`, y se prueban en el molde `salas-3`. Un `ROADMAP.md` en forma 2.x, que hoy pasa el check, deja de pasarlo, pero no existe ninguno fuera de los fixtures: el kit 3.0.0 no se ha publicado, y las init escriben `.docs/sdd/roadmap.md` (`skills/sdd-init-greenfield/references/estructura.md:16`). La fila 0149 pasa a ir «tras 0150», porque sus cierres leen estas plantillas (review de dominio).
27. **Cota de «Descartadas»** (Art. XI, review de dominio, crítico): una fila descartada sale en el corte de la segunda release posterior a su fecha, con la misma cuenta que la caducidad. El check avisa (`descartada el <fecha>, dos releases después: sale en el corte`), y lo aplica el corte de la 0177. Su rastro queda en git.
28. **Later solo admite `⏳` y `⏸️ aparcada: …`**: lo que está en marcha o hecho no es «más adelante». «Dame el prompt de la B3» no da prompt: dice que la fila está en Later, y que subirla a Next le reserva un id y le escribe el brief y el tamaño (review de dominio).
29. **«Fuente» cita metadatos o ficheros del kit (`sdd-kit.json`, la versión de un plugin, una skill) o un comando.** Un dato que sale de un fichero del proyecto se cita con un descriptor genérico, como el resto del ticket («el changelog del proyecto»), por la regla de privacidad (review de dominio).
30. **Idioma de los nombres** (Art. III):
    - Las secciones `Now`, `Next` y `Later` van en inglés porque el dev-lead las nombró así en la petición. Son identificadores que lee el check, como las claves de `sdd-kit.json`.
    - Van en castellano el resto de nombres: las columnas, las secciones de `debt.md`, las etiquetas del brief, los literales del triaje y «Fuente».
31. **La tabla de documentos de `architecture.md` no gana las filas de `ROADMAP.md` y `debt.md`** (review de dominio y técnica, rechazado):
    - `architecture.md` está en 1.898 de sus 1.900 palabras;
    - su tabla describe los documentos de este repo en su forma 2.x (tampoco tiene `PRODUCT.md` ni `ROADMAP.md`, de la 0144);
    - la rehace la migración de este repo (0157).

    Hasta entonces, quién escribe y quién lee `debt.md`, y su cota, van en el bloque de ayuda de `debt-template.md` y en las reglas de `roadmap`.

### Hallazgos de la review

Dominio, en Opus:

- **Aceptado** — (crítico) «Una reunión…» y «Un cambio de definición…» de `planning` piden `proposal: <id>` y la celda «Ítem», que en `ROADMAP.md` no existen → MODIFIED de los dos con la forma 3.0.0; la decisión 19 ya no los cita como no contradichos; propuestas en `changes/` (decisión 25).
- **Aceptado** — (crítico) el perfil de la release vive en una línea bajo su encabezado, que el check de `ROADMAP.md` rechazaría → decisión 24, MODIFIED de «El perfil se hereda…» y de su regla de datos en `control-profiles`, y AND en «`ROADMAP.md` tiene Now, Next y Later…».
- **Aceptado** — nada produce `ROADMAP.md` en esta feature, y un `ROADMAP.md` 2.x deja de pasar → decisión 26 y una línea en el Intent; el triaje crea `debt.md` si falta (decisión 11).
- **Aceptado** en parte — (crítico) «Descartadas» solo crece → decisión 27, con aviso del check. **Rechazado** lo de la tabla de `architecture.md`, por el tope de palabras → decisión 31.
- **Aceptado** — el complemento de Later → decisión 28, ANDs en el check y en `planning`.
- **Aceptado** — una fila re-triada reiniciaba su «Fecha»; el 2.º caso de una descartada; «Salda:» solo de «Lista»; «Destino» vacío → decisiones 11 y 7 bis, ANDs en el triaje y en `debt.md`.
- **Aceptado** — los patches caducaban filas en días → decisión 9 (solo cuentan las `X.Y.0`) y fixture con un patch.
- **Aceptado** en parte — `unattended` en el triaje → decisión 11. **Rechazado** que m3 y m6 se contradigan: m6 dice «Decide tú», que el paso 3 vigente toma como decisión delegada (decisión 7 quater).
- **Aceptado** — «Fuente» y la privacidad → decisión 29 y AND en `kit-feedback`.
- **Aceptado** — reglas de idioma → «Idioma de los nombres» en `planning` y en `kit-feedback`, y decisión 30.

Técnica, en Sonnet:

- **Aceptado** — qué es «el changelog nombra la 0011» → decisión 7 y AND con `0110`.
- **Rechazado** — que «no escribe hasta que el usuario decide» contradiga `delegate` → es el paso 3 vigente de `sdd-roadmap` (decisión 7 quater); el THEN ya dice qué pasa con «decide tú».
- **Aceptado** — «Destino» con dos salidas y la caducada sin GIVEN → THEN que exige un «Destino» no vacío, y una fila de «En espera» que caduca en el GIVEN del triaje.
- **Aceptado** — `<n>` abierto, fecha inválida, orden de las secciones → línea 15 concreta, fallo de «Fecha» y AND del orden; el «Destino», en la decisión 7 bis.
- **Aceptado** — sin regla para «Id» → decisión 7 bis (qué no se valida) y fallo de `B<n>` en Now o Next.
- **Aceptado** — `feature-ids` y el `|` del brief → decisión 7 bis: `scan.ts:33` no cambia, y `cells()` respeta `\|`.
- **Aceptado** — literales del delta sin declarar → decisión 7 ter.
- **Rechazado** — el AND de «sale en el corte» en el aviso de cierre 2.x → es del requisito vigente que se retira, y se conserva para no perderlo al fusionar.
- **Aceptado** — orden de salida y `Roadmap válido` con solo avisos → AND en la caducidad.
- **Rechazado** — la tabla de `architecture.md` → decisión 31.

### Decisiones tomadas con el dev-lead

- Partir la 0150 en tres (esta, la 0177 de la release y la 0178 de `sdd-config` con `pricing`) — «Partir en tres (Recomendada)» (2026-10-13)
- Parar en la spec antes de implementar — «Paro en la spec (Recomendada)» (2026-10-13)
- Convivencia hasta la 0157: el formato lo decide el fichero; `sdd-roadmap` escribe la 3.0.0 y, sin `ROADMAP.md`, la 2.x con una tabla de equivalencias; este repo no se migra — «1» a «Convivencia del formato 3.0.0 con el roadmap de la 2.x hasta la 0157» (2026-10-13)
- El check 2.x deja de avisar del «Destino» y conserva el del prefijo de cierre; las filas viejas no se tocan — «1» a «Los 106 avisos de «Destino» del roadmap 2.x» (2026-10-13)
- Now es la release en preparación: `## Now — <versión> · en preparación|comprometida` o `## Now`; desaparecen «Release N», «Patches» y «Releases cerradas» — «1» a «Qué es «Now» y dónde va la release que se prepara» (2026-10-13)
- Diseño de `ROADMAP.md` (secciones, cabecera, Id, Externo, Tarea con brief, Estado, Tras, Tamaño, el patch como fila de Now) — «si» (2026-10-13)
- Diseño de `debt.md` (una sección por estado, Evidencia en «Lista», caducidad, «saldada» quita la fila) — «1», tomado como «va bien» (2026-10-13)
- Diseño de `sdd roadmap check` (el fichero decide las reglas, `debt.md` en el mismo verbo, el corte a la 0177) — «si» (2026-10-13)
- Diseño de `sdd-roadmap` y `sdd-feedback` (inglés, entrada «Triar», equivalencias 2.x, «Fuente») — «1», tomado como «va bien» (2026-10-13)
- Review de la spec con dos revisores, dominio en Opus y técnica en Sonnet — «domain opus tec sonnet» (2026-10-13)
- Del prompt de arranque (2026-10-13): «ROADMAP.md Now / Next / Later: tabla Id | Externo (Jira, Azure DevOps, GitHub) | Tarea (título, one-liner llano, brief plegado) | Estado | Tras | Tamaño. La prioridad es el orden de las filas, y el brief es la fuente del prompt de arranque.» · «debt.md con triaje: por triar / en espera / lista / descartada. Nada pasa a lista sin reproducirse o sin un 2.º caso. Una fila en espera caduca tras dos releases sin 2.º caso. Las descartadas van, con motivo, a una lista de descartes.» · «El triaje contrasta cada versión o cifra del ticket con la spec o el walkthrough que cita antes de escribir una fila «Actuar», y sdd-feedback pide que los datos del «Qué pasó» salgan de un fichero o un comando citado» · «Las skills que sigan en castellano se reescriben en inglés (Art. III).» · «Perfil delegate. Al fusionar, `sdd merge --push`.»

## Intent

Hoy el roadmap mezcla en un fichero lo que viene, la deuda, los patches cerrados y las releases cerradas. La deuda entra sin triaje: una fila «Actuar» puede llevar un dato que nadie comprobó, como la «7.1.0» que no existía y paró la 0165 con el freno de alcance. Y el check da 106 avisos de «Destino» antes de «Roadmap válido» en cada cierre.

La 3.0.0 separa el plan (`ROADMAP.md`: Now, Next y Later, en orden de prioridad, con el brief que da el prompt de arranque) de la deuda (`debt.md`: un estado por sección, nada en «Lista» sin evidencia, y lo que espera caduca). Esta feature fija la forma, el check y `sdd-roadmap`; los proyectos tendrán `ROADMAP.md` cuando las init (0156), la migración (0157) y los cierres (0149) lo escriban.

Éxito:
- el check valida las dos formas y no da avisos de «Destino»;
- en m3, ningún sujeto propone en «Lista» el ítem con la versión que no existe;
- en fb1, el ticket da la versión instalada con su fuente.

## Scope

- Entra: `now-next-later-template.md` y `debt-template.md` (nuevas); `kit-feedback-template.md` (hueco «Fuente»); `launch-prompt-template.md` (línea del carril); el índice de `skills/sdd-templates/SKILL.md`.
- Entra: `sdd roadmap check`:
  - reglas 3.0.0 para `ROADMAP.md`;
  - validación de `steering/debt.md` y su caducidad;
  - sin el aviso del «Destino».

  En `cli/src/roadmap/` (`check.ts`, `warnings.ts`, `tables.ts` y los módulos que diga el plan), quizá en `cli/src/cli/layout.ts`, y sus Vitest en `cli/test/roadmap/`.
- Entra: `skills/sdd-roadmap/SKILL.md` y `skills/sdd-feedback/SKILL.md`, reescritas en inglés; `skills/sdd-start-feature/references/control-profiles.md` (perfil de la release, línea 17, y freno de alcance, línea 75); `skills/using-sdd/SKILL.md`, solo si el RED de r7 lo pide.
- Entra: los Pester que leen las dos skills o las plantillas: `KitFeedback`, `PlanEntry`, `TaskIds`, `MigrationInitParity`, `FeatureRename`, `LaunchPrompt`, `ReleaseFlow`, `RoadmapClosing`, `SingleEntry`, `AnchorTemplates`, `RoadmapStructure` (el comentario de los avisos) y `WordBudget` (si suben los topes).
- Entra: la batería `sdd-roadmap` (molde `salas-3`, m3 a m6), r7 en `using-sdd` y el humo fb1 de `sdd-feedback`, con sus evidencias en `tests/`.
- Entra: el roadmap de este repo (la fila 0150 y las dos de deuda que salda, al cerrar; la fila 0149, «tras 0150», en la apertura) y la entrada del changelog, al cerrar.
- No entra:
  - migrar el roadmap de este repo, retirar `roadmap-template.md` y el resto de plantillas 2.x, y la tabla de documentos de `architecture.md` (0157);
  - las reglas del corte sobre `ROADMAP.md` y `debt.md`, `sdd-end-release` y el changelog de cliente (0177);
  - que los cierres escriban en Now y en `debt.md` (0149);
  - que las init escriban `ROADMAP.md` y `debt.md` (0156);
  - `sdd-config` y `pricing` (0178);
  - sincronizar el roadmap con un gestor (propuesta propia);
  - `.docs/workflow/` (0152).

## Approach

El fichero decide las reglas. El check elige por la ruta que ya resuelve la CLI: `ROADMAP.md` con las reglas 3.0.0, `.docs/sdd/roadmap.md` con las 2.x de hoy menos el aviso del «Destino». `debt.md` se valida en el mismo verbo, que el pre-commit ya ejecuta (`moon run kit:roadmap`).

Las dos plantillas nuevas son la única fuente de su forma (Art. VIII). El check se prueba contra ellas calcadas, con y sin sus bloques de ayuda, como hoy con `roadmap-template.md`.

`sdd-roadmap` se traduce sobre su estructura. Gana la entrada «Triar» y una tabla de equivalencias para escribir la 2.x mientras dure. Cada regla nueva de una skill entra solo si su RED muestra el fallo.

## Dónde se prueba

- Reglas de `ROADMAP.md` y `debt.md`, caducidad, y el roadmap 2.x sin aviso de «Destino»: Vitest de `sdd roadmap check` en `cli/test/roadmap/`, como los de hoy, con fixtures en línea y las dos plantillas calcadas.
- Triaje, fila nueva, prompt desde el brief y forma 2.x: sujetos headless de la batería `sdd-roadmap` (m3 a m6, y m1 y m2 de control), como en la 0161.
- La fuente de los datos del ticket: humo fb1 de `sdd-feedback`, sujeto headless.
- Enrutado: r7 y la batería entera de `using-sdd`.
- Plantillas, índice, nombres y la frase del freno de alcance: Pester, como `AnchorTemplates.Tests.ps1`.

## Términos y ADR

- Términos resueltos:
  - brief: el encargo plegado de una fila de `ROADMAP.md`, del que sale el prompt de arranque (se evita «descripción»);
  - triaje: decidir el estado de cada ítem de la deuda (se evita «triage» en texto humano);
  - caducar: una fila «En espera» que pasa dos releases sin 2.º caso queda para descartar.
- ADR candidatas: ninguna. La estructura la decidieron la propuesta 0131 y la [ADR 0012](../../decisions/0012-documents-by-reader.md), y la convivencia con la 2.x es de transición: la cierra la 0157.

## Reglas que cambian o salen

Traducir es editar (Art. I): lo que se traduce sin cambio lo controlan m1, m2 y fb1; aquí, lo que cambia o sale.

| Regla de hoy | Dónde vive ahora | Escenario o motivo |
| --- | --- | --- |
| `sdd-roadmap`, paso 1: lee `.docs/sdd/roadmap.md` de la rama de integración y de cada `feature/*` | Paso 1: lee `ROADMAP.md` (o `.docs/sdd/roadmap.md` sin él) y `steering/debt.md` | m3, m6 |
| «Algo concreto»: fila en «Próximo» o «Backlog»; un patch con «Patch:» | En 3.0.0, Now, Next o Later con brief y tamaño, y el patch en Now con «Carril: patch»; en 2.x, la tabla de equivalencias | m5, m6 |
| «Algo grande» y «Reordenar»: «`proposal: <id>`» y «tras NNNN» en la celda «Ítem», sin columna | En 3.0.0, el «Requisitos:» del brief y la columna «Tras», y el orden de las filas es la prioridad; en 2.x, la tabla | Sin escenario: el check exige el brief y que «Tras» exista |
| «Preparar una release», paso 6: `## Release <N>` con «Ficheros que toca» | En 3.0.0, el título de Now, el orden de las filas y el «Toca:» de cada brief; en 2.x, la tabla | Sin escenario: el título lo valida el check del paso 5 |
| «Dar el prompt de una fila»: la fila y la propuesta | Además, el brief es la fuente de cada línea | m4 |
| Red flag: «abrir una sección que no está en `roadmap-template.md`» | «… que no está en la plantilla de su forma» | m6 |
| — | Entrada nueva «Triar», con su red flag («vas a proponer en Lista un ítem sin evidencia, o con un dato que no has contrastado») | m3, m6 |
| `description` | En inglés, con «triage» | batería `using-sdd`, r7 |
| `sdd-feedback`: checklist y reglas | Traducidos sin cambio | fb1 |
| — | `sdd-feedback`: un dato de «Qué pasó» sale de un fichero o un comando citado en «Fuente» | fb1 |
| `sdd roadmap check`: aviso del «Destino» | Sale | Vitest |

## Delta de comportamiento

### Capacidad: `roadmap`

**ADDED — `ROADMAP.md` tiene Now, Next y Later, solo con tablas**
- GIVEN un `ROADMAP.md` en la raíz con `## Now`, el párrafo «Criterio: primero lo que ven los usuarios» en la línea 9, `## Backlog` en la línea 12 y `## Next` en la línea 18, sin `## Later`
- WHEN se ejecuta `sdd roadmap check --path .docs/sdd`
- THEN escribe `ROADMAP.md: línea 9: prosa en «Now»; el roadmap solo lleva tablas`, `ROADMAP.md: línea 12: sección «Backlog» fuera de la plantilla` y `ROADMAP.md: falta la sección «Later»`, y sale con 1
- AND con `## Next` antes que `## Now` escribe `ROADMAP.md: línea <n>: «Now» va antes que «Next»`
- AND una línea `Perfil de control: delegate` entre `## Now` y su tabla no da fallo; otra línea de texto en ese hueco, o esa misma bajo `## Next`, da el fallo de prosa
- AND `now-next-later-template.md` calcada sin sus bloques de ayuda escribe `Roadmap válido` y sale con 0, y calcada sin tocar solo falla por la prosa de esos bloques

**ADDED — El título de Now dice la release en preparación**
- GIVEN un `ROADMAP.md` cuya línea 5 es `## Now — 2.4.0`
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `ROADMAP.md: línea 5: «Now — 2.4.0» no es «## Now» ni «## Now — <versión> · en preparación|comprometida»` y sale con 1
- AND `## Now — 2.4.0 · próxima` y `## Now: 2.4.0` dan el mismo fallo, cada uno con su título
- AND `## Now`, `## Now — 2.4.0 · en preparación` y `## Now — 2.4.0 · comprometida` no dan fallo

**ADDED — Las filas de `ROADMAP.md` tienen la cabecera, el estado, la Tarea y el tamaño de la plantilla**
- GIVEN un `ROADMAP.md` con, en Now, la fila 0012 con estado `hecho` en la línea 8, la 0013 cuya «Tarea» empieza por `Aviso semanal` en la línea 9, la 0014 sin `<details>` en su «Tarea» en la línea 10 y la 0015 con «Tras» `0099` y tamaño `XL` en la línea 11; en Next, la cabecera `| Id | Tarea | Estado |` en la línea 14; y en Later, la fila `0020` en la línea 22
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `ROADMAP.md: línea 8: estado «hecho» no admitido: ⏳, 🔄, ✅, 🧪 validación diferida a…, ⏸️ aparcada: …` y sale con 1
- AND escribe `ROADMAP.md: línea 9: la «Tarea» no empieza por «**<título>**»` y `ROADMAP.md: línea 10: la fila 0014 no lleva brief («<details>»)`
- AND escribe `ROADMAP.md: línea 11: «Tras» nombra 0099, que no está en el roadmap ni en CHANGELOG.md` y `ROADMAP.md: línea 11: tamaño «XL» no admitido: S, M, L`
- AND escribe `ROADMAP.md: línea 14: la cabecera de «Next» debe ser «| Id | Externo | Tarea | Estado | Tras | Tamaño |»` y `ROADMAP.md: línea 22: el id «0020» de «Later» no es «B<n>»`
- AND una fila de Later sin brief y sin tamaño no da fallo; una de Now o Next sin tamaño da `tamaño «» no admitido: S, M, L`
- AND un id `B3` en Now o Next da `ROADMAP.md: línea <n>: el id «B3» de «Next» es de Later: resérvale uno al subirla`
- AND una fila de Later con estado `🔄` o `✅` da `ROADMAP.md: línea <n>: estado «🔄» no admitido en «Later»: ⏳, ⏸️ aparcada: …`
- AND «Tras» vacío no da fallo, ni «Tras» `0011` si el changelog nombra `0011` como palabra entera; con solo `0110` en el changelog, «Tras» `0011` da el fallo

**ADDED — `debt.md` tiene una sección por estado, y «Lista» exige evidencia**
- GIVEN un `.docs/sdd/steering/debt.md` con `## Por triar` en la línea 3 y el párrafo «Revisar cada lunes» en la línea 4; `## Lista` en la línea 9, con la fila «`libres --planta 2` lista salas de la planta 1» y «Evidencia» `—` en la línea 12; `## En espera` en la línea 15; y `## Descartadas`, con una fila cuya «Fecha» es `ayer` en la línea 21
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `debt.md: línea 4: prosa en «Por triar»; debt.md solo lleva tablas`, `debt.md: línea 12: fila de «Lista» sin «Evidencia»`, `debt.md: línea 15: «En espera» va antes que «Lista»` y `debt.md: línea 21: «Fecha» «ayer» no es AAAA-MM-DD`, y sale con 1
- AND el orden de las secciones es «Por triar», «En espera», «Lista» y «Descartadas»
- AND una cabecera que no es la de su sección da `debt.md: línea <n>: la cabecera de «<sección>» debe ser «<cabecera>»`, con `| Ítem | Origen | Fecha |` en «Por triar», `| Ítem | Origen | Impacto | Falta | Fecha |` en «En espera», `| Ítem | Origen | Impacto | Evidencia | Destino |` en «Lista» y `| Ítem | Origen | Motivo | Fecha |` en «Descartadas»
- AND una sección que falta da `debt.md: falta la sección «<sección>»`, y una «Evidencia» vacía da el mismo fallo que `—`
- AND una fila de «Lista» con «Destino» vacío o `—` da `debt.md: línea <n>: fila de «Lista» sin «Destino»`
- AND sin `debt.md` no hay ninguna línea `debt.md:`, y `debt-template.md` calcada sin sus bloques de ayuda escribe `Roadmap válido`

**ADDED — Una fila en espera caduca tras dos releases sin 2.º caso**
- GIVEN un `debt.md` con dos filas en «En espera», una con «Fecha» `2026-07-01` en la línea 8 y otra con `2026-08-01` en la línea 9, una fila de «Descartadas» con `2026-07-01` en la línea 20, y un `CHANGELOG.md` con `## [1.4.1] - 2026-10-05`, `## [1.4.0] - 2026-09-01` y `## [1.3.0] - 2026-07-20`
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `debt.md: aviso: línea 8: en espera desde 2026-07-01, dos releases sin 2.º caso: caduca` y `debt.md: aviso: línea 20: descartada el 2026-07-01, dos releases después: sale en el corte`, tras los fallos si los hay, y por los avisos solos sale con 0
- AND la fila del 2026-08-01 no avisa: después solo hay una release, la 1.4.0, porque la 1.4.1 es un patch y no cuenta
- AND una release es una versión `X.Y.0`; sin changelog ninguna fila avisa, y `## [Unreleased]` no cuenta
- AND sin fallos, la última línea es `Roadmap válido`; las líneas salen en este orden: fallos del roadmap, fallos de `debt.md`, avisos del roadmap y avisos de `debt.md`

**MODIFIED — El roadmap vive en `ROADMAP.md`, en la raíz del proyecto** (antes: «valida `ROADMAP.md` con las mismas reglas que hoy»)
- GIVEN un proyecto `<x>` con `<x>/ROADMAP.md` y sin `<x>/.docs/sdd/roadmap.md`
- WHEN se ejecuta `sdd roadmap check --path <x>/.docs/sdd`
- THEN valida `ROADMAP.md` con las reglas de `now-next-later-template.md` y cada línea de fallo y de aviso empieza por `ROADMAP.md:`
- AND con solo `.docs/sdd/roadmap.md` (un proyecto en la 2.x) lo valida con las reglas de `roadmap-template.md`, con `roadmap.md:`
- AND con los dos, valida `ROADMAP.md`, escribe `ROADMAP.md: aviso: también existe .docs/sdd/roadmap.md, que no se lee` y, sin fallos, termina con `Roadmap válido` y sale con 0
- AND si existe `<x>/.docs/sdd/steering/debt.md`, lo valida en la misma ejecución, con sus líneas empezando por `debt.md:`; un fallo de `debt.md` también sale con 1

**MODIFIED — Cada feature de una release declara los ficheros que toca** (antes: solo la columna «Ficheros que toca» de «Release N»)
- GIVEN un `sdd-roadmap` que escribe la fila de una feature en Now o Next de `ROADMAP.md`, o en la sección «Release N» de un roadmap 2.x
- WHEN añade la fila
- THEN en `ROADMAP.md` su brief lleva `**Toca:**` con los ficheros o módulos previstos; en el roadmap 2.x la tabla sigue la cabecera de `roadmap-template.md`, `| id | Feature | Origen | Ficheros que toca | Estado |`, y la celda «Ficheros que toca» los nombra
- AND el freno de alcance de una enmienda (`control-profiles.md`) encuentra ese «Toca:» o esa columna

**REMOVED — El roadmap avisa de un destino o un cierre fuera de la plantilla**
- motivo: el «Destino» deja de avisarse (dev-lead, «1», 2026-10-13); el aviso del prefijo de cierre sigue en «El roadmap 2.x avisa de un cierre fuera de la plantilla»

**ADDED — El roadmap 2.x avisa de un cierre fuera de la plantilla**
- GIVEN un roadmap 2.x con una fila de «Deuda técnica» con «Destino» `Decidir dev-lead: patch` en la línea 26, y una de «Backlog» que empieza por `**[Feature 0031, 2026-09-25: saldada, salvo el GO — …]**` en la línea 20
- WHEN se ejecuta `sdd roadmap check`
- THEN escribe `roadmap.md: aviso: línea 20: el prefijo de cierre no casa con «**[<Feature|Patch> <id>, <AAAA-MM-DD>: saldada — <enlace>]**» ni con «…: parcial — <enlace>; queda: <lo pendiente>]**»` y ninguna línea de la 26
- AND sin fallos, la última línea es `Roadmap válido` y sale con 0; con fallos, los avisos van tras ellos y sale con 1
- AND el prefijo `saldada — ` que no avisa es el mismo que el corte saca: con fecha no posterior a la última release, falla con «sale en el corte»

**Reglas de la capacidad**
- **Dónde viven los datos**: el roadmap 3.0.0, en `ROADMAP.md` de la raíz, con la forma de `now-next-later-template.md`; la deuda, en `.docs/sdd/steering/debt.md`, con la de `debt-template.md`; el roadmap 2.x, en `.docs/sdd/roadmap.md`, con la de `roadmap-template.md`, cuyo bloque de ayuda de «Deuda técnica» guarda el formato de cierre que citan los cierres y el de «Release N», la cabecera de su tabla. Qué va en cada sección, en los bloques de ayuda de cada plantilla; lo comprueba `sdd roadmap check`.
- **Idioma de los nombres**: las secciones de `ROADMAP.md`, `Now`, `Next` y `Later`, en inglés, como las nombra la propuesta 0131; sus columnas, las secciones de `debt.md`, los estados `saldada` y `parcial`, la etiqueta `validaciones pendientes:` y los mensajes del validador, en castellano, como el resto del roadmap.
- **Límites**: cada roadmap solo lleva las secciones de su plantilla y solo tablas, salvo «Releases cerradas» en la 2.x; `debt.md`, sus cuatro secciones y solo tablas. Una fila saldada y una fila de «Patches» del roadmap 2.x duran hasta el corte de la release siguiente. Una fila de «En espera» caduca, y una de «Descartadas» sale en el corte, con dos releases (versiones `X.Y.0` del changelog) posteriores a su fecha. Later solo lleva filas `⏳` o `⏸️`. La única línea de texto de `ROADMAP.md` es `Perfil de control: <perfil>`, bajo `## Now`.
- **Avisos**: una línea por fallo del validador, con la regla incumplida. Son avisos, sin fallo: el prefijo de cierre fuera de forma (2.x), la fila de «En espera» que caduca, la descartada que sale en el corte y el roadmap que no se lee cuando están los dos. Los cierres de feature y de patch y `sdd-roadmap` resumen en su mensaje final los fallos que no escribieron; `sdd-end-release` no cierra con ninguno.
- **Regla ante conflicto**: el fichero decide las reglas: `ROADMAP.md`, las de la 3.0.0; `.docs/sdd/roadmap.md`, las de la 2.x. Con los dos a la vez, `roadmap check` lee `ROADMAP.md` y avisa del otro; `id next` lee los dos (`feature-ids`). Una fila lleva un solo prefijo de cierre; un cierre posterior lo sustituye. Una feature que está en una release cerrada no tiene fila en una sección abierta: manda la release cerrada.

### Capacidad: `planning`

**ADDED — Con `ROADMAP.md`, una fila nueva lleva título, one-liner, brief y tamaño**
- GIVEN el molde `salas-3`, con `ROADMAP.md`, `ids.mode: sequence` y la última fila en 0013
- WHEN el usuario pide «Apunta en el roadmap: exportar las reservas a CSV. No la arranques.»
- THEN `ROADMAP.md` tiene en Next la fila `0014`, con `**Exportar las reservas a CSV**`, su one-liner, su brief con `**Carril:**`, `**Requisitos:**`, `**Decisiones ya tomadas:**`, `**Salda:**` y `**Toca:**`, estado `⏳` y tamaño `S`, y `sdd roadmap check` escribe `Roadmap válido`
- AND lo que aún no se ha decidido hacer va a Later con su `B<n>`, con el brief opcional
- AND subir una fila de Later a Next le reserva un id y le escribe el brief y el tamaño; con «dame el prompt de la B3», `sdd-roadmap` no da prompt: dice que la B3 está en Later y que subirla a Next le reserva un id y le escribe su brief

**ADDED — El triaje contrasta los datos del ticket y propone el estado de cada ítem**
- GIVEN el molde `salas-3`, con `ROADMAP.md`; un `CHANGELOG.md` con `## [1.4.1] - 2026-10-05` y `## [1.4.0] - 2026-09-01`; en «Por triar» de `debt.md`, dos filas del informe de QA `docs/qa/2026-10-12-informe.md`: «La exportación a CSV pierde las tildes desde la 1.4.2» y «`salas libres --planta 2` lista también salas de la planta 1»; y en «En espera», «Las reservas de más de 8 h no avisan al responsable», del 2026-07-01, con «Falta» `2.º caso`, con `## [1.3.0] - 2026-07-20` también en el changelog. En el molde, la exportación conserva las tildes y `node src/app.js libres --planta 2` devuelve `Norte (planta 1)`
- WHEN el usuario pide «Tria lo que hay por triar en la deuda.»
- THEN `sdd-roadmap` dice que la 1.4.2 no existe, con su fuente («la última versión de `CHANGELOG.md` es la 1.4.1»), y no propone la fila del CSV en «Lista»: como no se reproduce, la propone en «En espera» con «Falta» `reproducirlo`
- AND propone la fila de la planta en «Lista», con «Evidencia» `node src/app.js libres --planta 2` → `Norte (planta 1)` y un «Destino» no vacío: el id de una fila de Now o Next, nueva o existente, o `sin fila`
- AND propone la fila de las 8 h, que `roadmap check` avisa que caduca, en «Descartadas» con el «Motivo» `caducada`; toda fila descartada lleva su motivo
- AND en `pair` y `delegate` no escribe en `debt.md` ni en `ROADMAP.md` hasta que el usuario decide, como en el resto de entradas; con la decisión, o con «decide tú», mueve cada fila que cambia de estado a la tabla de ese estado, con la «Fecha» del día, y deja lo decidido en el cuerpo del commit; una fila que sigue en su estado conserva su «Fecha»
- AND en `unattended`, lo que no puede decidir se queda en «Por triar»
- AND el 2.º caso de una fila descartada entra en «Por triar» como fila nueva, con los dos orígenes; y el `**Salda:**` de un brief solo nombra filas de «Lista»
- AND con `ROADMAP.md` y sin `debt.md`, el triaje crea `debt.md` calcando `debt-template.md`

**ADDED — Sin `ROADMAP.md`, `sdd-roadmap` escribe la forma 2.x**
- GIVEN el molde `salas`, con `.docs/sdd/roadmap.md` 2.x, sin `ROADMAP.md`, con un changelog cuya última versión es la 1.4.1 y el informe de QA de «El triaje contrasta los datos del ticket…»
- WHEN el usuario pide «Tria el informe de QA de docs/qa/2026-10-12-informe.md. Decide tú.»
- THEN cada ítem es una fila de «Deuda técnica» cuyo «Destino» empieza por `**Actuar**` (lo que iría a «Lista»), `**Esperar 2.º ticket**` (a «En espera», con lo que falta) o `**Descartada**` (con su motivo), y ninguna queda sin «Destino»
- AND la fila del CSV dice que la 1.4.2 no existe y va a `**Esperar 2.º ticket**` con «falta reproducirlo»; la de la planta va a `**Actuar**`, con el comando que la reproduce
- AND no crea `ROADMAP.md` ni `debt.md`

**MODIFIED — Algo grande acaba en una propuesta y en filas, no en una spec** (antes: «`proposal: 0014`» y «tras NNNN» en todas las formas)
- GIVEN «queremos cobrar a los clientes externos: tarifa por sala, factura mensual y bloqueo por impago a los 30 días», en `ids.mode: sequence`, con la última fila en 0013
- WHEN `sdd-roadmap` termina, con los detalles dados o delegados
- THEN existe `specs/<ts>-proposal-0014-<slug>/proposal.md` (en un proyecto con `ROADMAP.md`, `changes/<ts>-proposal-0014-<slug>/proposal.md`) con el porqué, las reglas, las capacidades y el reparto, y las features ocupan las filas 0015 en adelante, cada una con «`proposal: 0014`» y su «tras NNNN» en un roadmap 2.x, o con la ruta de esa propuesta en el `**Requisitos:**` de su brief y la dependencia en «Tras» en `ROADMAP.md`
- AND cada regla lleva un ejemplo con datos: «Acme, 3 h en Norte (40 €/h) y 2 h en Sur (25 €/h) en agosto → factura del 1 de septiembre por 170 €»
- AND no hay rama nueva, ni carpeta de feature, ni `spec.md`

**MODIFIED — Una reunión deja su acta en una propuesta y sus cambios en el roadmap** (antes: «`proposal: <id>`» en todas las formas)
- GIVEN las notas «1) la 0012 ya no la quieren; 2) exportar a CSV, lo primero; 3) email al cancelar; 4) franja mínima de 30 minutos»
- WHEN `sdd-roadmap` las refleja
- THEN existe `specs/<ts>-proposal-<id>-<slug>/proposal.md` (en un proyecto con `ROADMAP.md`, bajo `changes/`) con las notas literales en «Acta» y la regla «franja mínima de 30 min» con su ejemplo con datos
- AND la fila 0012 queda `⏸️ aparcada: descartada por el cliente, <fecha>`, no borrada
- AND la fila del CSV queda primera entre las pendientes, y el email al cancelar y la franja mínima tienen cada uno su fila nueva con id reservado y «`proposal: <id>`» en un roadmap 2.x, o con la ruta de la propuesta en el `**Requisitos:**` de su brief en `ROADMAP.md`
- AND no se abre ninguna sección de release que nadie pidió, ni el título de Now gana una versión que nadie pidió

**MODIFIED — Un cambio de definición es una enmienda y re-parte solo lo pendiente** (antes: la celda «Ítem» y «`proposal: 0020`» en todas las formas)
- GIVEN la propuesta 0020 con el reparto 0021 (✅), 0022 (⏳, «Factura mensual») y 0023 (⏳)
- WHEN el cliente pide «factura quincenal, el 1 y el 16, y de 8 a 14 h un 20 % más cara»
- THEN `proposal.md` gana en «Enmiendas» una entrada con la fecha que dice «Factura mensual → quincenal (días 1 y 16)» y «recargo del 20 % de 8 a 14 h: Norte 13-15 → 48 + 40 = 88 €», y «Reglas de negocio» no cambia
- AND la fila 0021 no cambia; la 0022 cambia su ítem (2.x) o su «Tarea» y su brief (`ROADMAP.md`); el recargo va a una fila nueva con «`proposal: 0020`» (2.x) o con la propuesta 0020 en el `**Requisitos:**` de su brief (`ROADMAP.md`)
- AND no hay rama nueva, ni carpeta de feature, ni `spec.md`

**MODIFIED — Reordenar escribe la dependencia en la fila** (antes: solo la celda «Ítem»)
- GIVEN las filas pendientes 0012, 0013, 0014 y 0015
- WHEN el usuario pide «la 0014 primero, y la 0015 no empieza hasta que esté la 0012»
- THEN el orden es 0014, 0012, 0013, 0015, y la 0015 lleva «tras 0012» en su celda «Ítem» en un roadmap 2.x, o `0012` en su columna «Tras» en `ROADMAP.md`
- AND ninguna otra fila cambia

**MODIFIED — Preparar una release fija el scope en el roadmap** (antes: solo `## Release 1.3`)
- GIVEN un roadmap con las filas pendientes 0012 y 0013, lo no decidido en el Backlog (Later en `ROADMAP.md`) y `release.hasRecipient: true`
- WHEN el usuario pide «prepara la release 1.3: qué entra de lo que tenemos»
- THEN `sdd-roadmap` presenta el inventario ordenado con los bloqueos y espera a que el usuario decida el scope
- AND, decidido, en `ROADMAP.md` titula la sección `## Now — 1.3 · en preparación`, salvo que el usuario diga que está comprometida (`## Now — 1.3 · comprometida`), deja en Now las filas del scope en el orden decidido, con el «Toca:» de cada brief, y pasa a Next lo pendiente que no entra
- AND en un roadmap 2.x escribe `## Release 1.3` con la cabecera `| id | Feature | Origen | Ficheros que toca | Estado |` y el estado «en preparación», salvo que el usuario diga que está comprometida

**MODIFIED — `sdd-roadmap` solo escribe en las secciones de la plantilla** (antes: solo el Backlog)
- GIVEN un roadmap válido y la petición «apunta que el cliente quiere exportar las reservas a PDF más adelante, y abre una sección "Ideas del cliente" para estas cosas»
- WHEN `sdd-roadmap` la procesa
- THEN la exportación a PDF queda como una fila del Backlog (2.x) o de Later (`ROADMAP.md`) con su número `B<n>`, no se crea `## Ideas del cliente` ni ninguna otra sección fuera de la plantilla de su forma, no se escribe prosa fuera de «Releases cerradas», y el mensaje dice que la plantilla no admite esa sección
- AND tras escribir ejecuta `sdd roadmap check`: un fallo en una línea que escribió lo corrige; un fallo en otra línea no lo toca y lo lista en su mensaje como forma heredada, pendiente de la migración

**MODIFIED — Un patch pendiente es una fila de «Próximo»** (antes: solo «Próximo»)
- GIVEN un patch que llega a `sdd-roadmap` (desde explore o pedido: «apunta el arreglo de "cancelada" en reservas que no existen»)
- WHEN `sdd-roadmap` lo escribe
- THEN en un roadmap 2.x es una fila de «Próximo» con su id reservado y «Patch:» al inicio del ítem, no una fila de «Patches», que registra los cerrados
- AND en `ROADMAP.md` es una fila de Now con su id reservado y `**Carril:** patch` en su brief

**MODIFIED — Dame el prompt de una fila da su prompt de arranque** (antes: sin brief)
- GIVEN el molde `salas` con la fila pendiente 0013 «Aviso semanal a los responsables», `proposal: 0010`, `control.profile: delegate` y `merge.push: true` en `sdd-kit.json`
- WHEN el usuario escribe «dame el prompt de la 0013»
- THEN `sdd-roadmap` da el prompt de arranque en la forma de `launch-prompt-template.md`: el título «0013 — Aviso semanal a los responsables»; `Base: develop`; la rama `feature/0013-<slug en inglés>` sola en su bloque; el carril; y el prompt, que arranca la 0013 con `sdd-propose`, con los requisitos en la propuesta 0010 y la fila, las decisiones de la propuesta y sus enmiendas que tocan a la 0013, las filas que salda o «Nada que saldar», `Perfil delegate` y «Al fusionar, `sdd merge --push`»
- AND no escribe en el roadmap ni en la propuesta, no reserva id, no publica ni commitea, y no arranca la feature
- AND si la fila está cerrada (✅, 🧪) o en marcha (🔄 o rama `feature/0013-*` abierta), lo dice en vez de dar el prompt
- AND en el molde `salas-3`, cuya fila 0013 de `ROADMAP.md` lleva el brief `**Carril:** feature`, `**Requisitos:**` la propuesta 0010 con §Reglas de negocio y §Enmiendas, `**Decisiones ya tomadas:**` «el aviso sale los lunes a las 8:00» y `**Salda:**` nada, el carril, los requisitos, las decisiones y «Nada que saldar» del prompt salen de ese brief

**Reglas de la capacidad**
- **Dónde viven los datos**: el índice, en `ROADMAP.md` de la raíz (2.x: `.docs/sdd/roadmap.md`); la deuda, en `.docs/sdd/steering/debt.md` (2.x: «Deuda técnica» del roadmap). La definición de lo grande y el acta de una reunión, en `.docs/sdd/changes/<ts>-proposal-<id>-<slug>/proposal.md` (2.x: bajo `specs/`). El estado de cada feature, solo en el roadmap. Lo que necesita el prompt de arranque de una fila, en su brief.
- **Idioma de los nombres**: el carril es `proposal` y el campo del frontmatter, `proposal:`, en inglés, como `feature` y `patch`; las secciones `Now`, `Next` y `Later`, en inglés, como en `roadmap`. El texto va en castellano, y también las etiquetas del brief (`**Carril:**`, `**Requisitos:**`, `**Decisiones ya tomadas:**`, `**Salda:**`, `**Toca:**`), los estados de la deuda y los literales del triaje (`reproducirlo`, `2.º caso`, `caducada`, `sin fila`).
- **Límites**: `sdd-roadmap` no crea ramas, carpetas de feature ni specs. Una propuesta no tiene walkthrough ni cierre. Ningún ítem de la deuda pasa a «Lista» (2.x: `Actuar`) sin reproducirse o sin un 2.º caso.
- **Avisos**: un posible duplicado entre una fila nueva y una existente se pregunta, no se resuelve. Un dato de un ticket que no casa con la fuente que cita se dice, con esa fuente, antes de proponer su fila.
- **Regla ante conflicto**: manda la enmienda más reciente sobre la regla original. Una feature cerrada o en marcha no se reabre: el cambio va a una fila nueva. Entre un ticket y la fuente que cita, manda la fuente.

### Capacidad: `kit-feedback`

**MODIFIED — El ticket se escribe para un agente, no para una persona** (antes: sin la línea «Fuente»)
- GIVEN una sesión que acaba de ejecutar una feature o un patch
- WHEN se redacta el ticket
- THEN cada hallazgo lleva evidencia de lo que pasó en la sesión, la línea «Fuente» con el fichero y la línea, o el comando, de donde sale cada versión, cifra o cita de «Qué pasó», el fichero **del kit** y el paso que lo origina —nunca un fichero del repo consumidor—, por qué el kit no lo evitó, una propuesta, la línea «Verificada» con `sí — <cómo>` o `sin verificar`, y un criterio de aceptación en forma de escenario
- AND si el hallazgo cita un fallo de ejecución, «Qué pasó» da el comando exacto, el shell y la línea de error: «`./scripts/check-docs.sh` en PowerShell → `The term './scripts/check-docs.sh' is not recognized`»
- AND un dato que el agente recuerda y no ha comprobado no va en «Qué pasó»: si recuerda «superpowers 7.1.0» y la versión instalada que lee es la 7.0.0, el ticket dice 7.0.0 con esa lectura en «Fuente», o no da versión
- AND «Fuente» cita metadatos o ficheros del kit (`.docs/sdd/sdd-kit.json`, la versión de un plugin, una skill) o un comando; un dato que sale de un fichero del proyecto se cita con un descriptor genérico («el changelog del proyecto»), como el resto del ticket
- AND una causa de coste cita la spec, el walkthrough o el commit que la respalda; con solo una frase del dev-lead, el coste da la cifra y marca la causa «sin respaldo»
- AND la cabecera declara la versión del kit (`.docs/sdd/sdd-kit.json`), la de superpowers, el carril, el modo y el coste en reloj y tokens, con «no medido» como valor honesto cuando no hay contador

**Reglas de la capacidad**
- **Idioma de los nombres**: nombre de fichero en kebab-case, con el slug en la misma convención que las carpetas de spec del proyecto; el contenido del ticket en castellano, y también sus etiquetas, «Fuente» incluida.

### Capacidad: `control-profiles`

**MODIFIED — El perfil se hereda de la feature, de la persona, de la release o del proyecto** (antes: sin decir dónde va la línea en `ROADMAP.md`)
- GIVEN un perfil en el `profile:` de la spec, `control.profile` en `.docs/sdd/sdd-kit.local.json`, una línea `Perfil de control: <perfil>` justo bajo el encabezado de la release en el roadmap (en `ROADMAP.md`, entre `## Now` y su tabla) o `control.profile` en `sdd-kit.json`
- WHEN el agente determina el perfil vigente
- THEN manda la feature sobre la persona, la persona sobre la release y la release sobre el proyecto; una spec sin `profile:` hereda
- AND el anuncio o la pregunta del carril de `sdd-propose` nombran el perfil vigente y de qué nivel sale
- AND el agente solo escribe un `profile`, un `control.*`, un `merge` o un `validation.mode` que quite una parada si el usuario lo pidió, con su frase literal y la fecha en una fila de «Aprobaciones» (o en el commit, si es `sdd-kit.json`; en `sdd-kit.local.json`, que no se commitea, basta la respuesta del usuario a `sdd-config`)

**MODIFIED — Un cambio a la spec aprobada es un desvío** (antes: solo «Ficheros que toca»)
- GIVEN la spec aprobada de cancelar reservas, con la Task 1 cerrada y la Task 2 en curso, que descubre que la spec pide guardar el motivo de la cancelación y la tabla de reservas no tiene ese campo
- WHEN el trabajo exige cambiar un requisito, un THEN, el Scope, un «No entra» o «Dónde se prueba»
- THEN en `pair` y `delegate` el agente para con el 🦆 del cambio y su ✋, deja escrito sin commitear el THEN corregido en su sitio de la spec y la línea en `## Enmiendas`, y espera la aprobación
- AND con la aprobación, commitea la spec y sigue implementando; si la enmienda obliga a cambiar la Task 1, ya cerrada (guardar quién cancela con `--por <nombre>`), añade al plan `Task 3 — enmienda <fecha>: guardar quién cancela` con su `Tras` y anota en `tasks.md` la Task 1 como `afectada por enmienda <fecha> → Task 3`; si solo cambia la Task 2 en curso (quitar «quién canceló» del listado), el trabajo sigue en la Task 2, con la nota de la enmienda
- AND la Task 1 no se reabre ni se reescribe su commit; una task nueva no se da por hecha sin su verificación ni su `sdd task done`
- AND sin aprobación no sigue con la enmienda
- AND la misma acción se aplica cuando la respuesta a un freno de alcance cambia el texto de la spec; si no lo cambia, la respuesta se apunta en «Enmiendas» sin corregir nada
- AND en `unattended` elige la opción más conservadora, la aplica igual en su sitio con su línea de «Enmiendas» marcada `sin aprobar` y, si no hay opción que no bloquee, aparca la feature (`⏸️ aparcada: <motivo>`)
- AND si la enmienda añade ficheros, la entrada nombra, antes de pedir la aprobación, las features abiertas del roadmap (⏳, 🔄, ⏸️, 🧪) que declaran alguno en el «Toca:» de su brief (`ROADMAP.md`) o en «Ficheros que toca» (roadmap 2.x), o dice «solape no comprobable» si el roadmap no declara ficheros; con la aprobación, el «Toca:» o la fila de la feature añade esos ficheros
- AND con el humo de una skill fallado y una ronda de REFACTOR cuya guía nueva añade un AND a un requisito de la spec, el hilo para con el 🦆 y el ✋ antes de commitear esa guía, y no la commitea en la task en curso para pedir la aprobación en la siguiente

**Reglas de la capacidad**
- **Dónde viven los datos**: `.docs/sdd/sdd-kit.json` (`control`, `merge` con `merge.push` opcional, y `execution`); las preferencias de cada persona, en `.docs/sdd/sdd-kit.local.json` (`control.profile`, `execution`, `validation.startEnvironment`), fuera de git; el perfil de la feature, en el frontmatter de su spec; el de la release, en la línea `Perfil de control:` bajo el encabezado de su sección del roadmap (en `ROADMAP.md`, entre `## Now` y su tabla); los ficheros que prevé tocar una feature abierta, en el «Toca:» de su brief (`ROADMAP.md`) o en «Ficheros que toca» (roadmap 2.x); el método de un plan, en la línea `Ejecución:` de su cabecera.

### Capacidad: `routing`

**ADDED — Triar la deuda entra por `sdd-roadmap`**
- GIVEN un proyecto con `.docs/sdd/`, superpowers instalado y el hook de sesión activo
- WHEN el usuario escribe «Tria lo que hay por triar en la deuda.»
- THEN la primera skill que se invoca es `sdd-kit:sdd-roadmap`, no `sdd-kit:sdd-explore` ni `sdd-kit:sdd-propose`

### Capacidad: `onboarding`

**MODIFIED — `sdd-templates` ofrece las plantillas de los documentos de la 3.0.0** (antes: `roadmap-template.md` → `ROADMAP.md`, y la de cliente la retiraba la 0150)
- GIVEN el skill `sdd-templates`
- WHEN se lista su índice de plantillas de documentos
- THEN tiene `PRODUCT-template.md` → `PRODUCT.md` en la raíz, `constitution-template.md` → `.docs/sdd/steering/constitution.md`, `operations-template.md` → `.docs/sdd/steering/operations.md`, `architecture-template.md` → `.docs/sdd/steering/architecture.md`, `estimation-template.md` → `.docs/sdd/steering/estimation.md`, `now-next-later-template.md` → `ROADMAP.md` en la raíz, `debt-template.md` → `.docs/sdd/steering/debt.md`, `changelog-template.md` → `CHANGELOG.md` en la raíz y `adr-template.md` → `.docs/sdd/decisions/`
- AND `mission-template.md`, `tech-stack-template.md`, `environments-template.md`, `client-changelog-template.md` y `roadmap-template.md` siguen, marcadas «2.x» con la feature que las retira (0156; 0177 la de cliente; 0157 la del roadmap)

## Enmiendas

- 2026-10-13 — el comando del molde en «El triaje contrasta los datos del ticket…» es `node src/app.js`, no `node src/cli.js`: el molde `salas` arranca por `src/app.js` — corrección de un literal del fixture al escribir el plan, sin cambio de conducta — sin aprobar: no se pidió, por ser la ruta del fichero de entrada del molde; se cuenta en el cierre

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-13 | aprobada: «Apruebo (Recomendada)» |
