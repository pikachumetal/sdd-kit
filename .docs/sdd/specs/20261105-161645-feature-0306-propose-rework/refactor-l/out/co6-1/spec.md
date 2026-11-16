---
id: 20261008-150000-feature-0030-retire-close-notice
feature: 0030
title: Retirar la skill aviso-cierre
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Retirar la skill aviso-cierre

🦆 Hoy, al cerrar una feature, se lanzan dos skills (`aviso-cierre` al empezar el cierre y `resumen-cierre` al acabarlo) y la primera apenas añade nada. Tras este cambio quien cierra recibe **un solo aviso**, el de `resumen-cierre`, que abre diciendo qué feature se cierra (ejemplo inventado: «Cierro la 0099 · Añadir reserva recurrente») y sigue con sus dos pasos de siempre. Cambia el momento: `aviso-cierre` hablaba al empezar el cierre y `resumen-cierre` habla al acabarlo (decisión 11). `aviso-cierre` desaparece. Había una cosa que hacía y que no es un mensaje, «corre el gate», y dos requisitos de `quality-gate` la llaman «el paso 2»: ese número era el de `aviso-cierre`. Al retirarla, esos dos requisitos se reescriben para hablar del gate del cierre sin número y el gate sigue siendo el de `operations.md` (`node --test && node scripts/lint.mjs`). Eso es lo que más te pido que valides (decisión 2).

## Capacidades

- Modificadas: `closing` — el aviso de cierre lo da `resumen-cierre`.
- Modificadas: `quality-gate` — los dos requisitos que citan «el paso 2» hablan del gate del cierre.

## ✋ Decisiones que he tomado yo — valida estas

Política de modelos: los revisores de la spec van en sonnet (el cambio no toca reglas de negocio ni permisos de nadie); la implementación la hace la propia sesión (`execution: native`), sin subagentes.

Review de spec propuesta: dos revisores — señales: MODIFIED («Quien cierra sabe qué se cierra») · tamaño: ~8 líneas en 2 ficheros (tras la review, la rama toca 3 ficheros, ~25 líneas con el test; `closing.md` y `quality-gate.md` los toca el archivado)
- Dominio (sonnet): si el nuevo THEN de «Quien cierra sabe qué se cierra» y los de «El resumen va al final» (`paso 1`, `paso 2`) siguen siendo ciertos con la skill modificada (señal: MODIFIED)
- Técnica (sonnet): si queda alguna referencia a `aviso-cierre` o a la fila 0030 fuera de las tablas de «Lo que se retira» (señal: MODIFIED)
- Mínimo razonable: solo dominio — deja sin mirar las referencias residuales a `aviso-cierre` en el repo

Enfoques (en `delegate` no hay quien elija, los decido yo y el stop de la spec los aprueba):

- **A (elegido)**: `resumen-cierre` gana una **línea de apertura sin numerar** delante de la lista; los pasos 1 y 2 conservan su número. Es el único que deja intactos los THEN de «El resumen va al final», que citan «el paso 1» y «el paso 2».
- B: meter «qué se cierra» como paso 1 y renumerar. Descartado: los THEN `el paso 1 cuenta los commits` y `el paso 2 lista las filas` pasarían a ser falsos y habría que modificar un tercer requisito sin que nadie lo pida.
- C: retirar la skill sin trasladar nada. Descartado: `closing` promete que quien cierra sabe qué se cierra y el Intent pide un solo aviso.

Decisiones:

1. `resumen-cierre` gana una línea de apertura sin numerar: «Di qué feature se cierra, con su número y su título.» (enfoque A, decisión central). Esa redacción es mía: el roadmap solo dice «Retirar la skill aviso-cierre».
2. **El gate no se traslada a ninguna skill**: lo corre el cierre con el comando de `operations.md` (`node --test && node scripts/lint.mjs`; la constitución solo cita `node --test`, el gate real es el de `operations.md`). Como `quality-gate.md:18` y `:23` decían «el paso 2», que era el de `aviso-cierre`, esos dos requisitos pasan a decir «cuando corre el gate del cierre». **Contrato externo, riesgo aceptado**: quién corre el gate en el cierre es el kit (`sdd-archive`), no un fichero de este repo; la única skill del repo que lo nombraba era `aviso-cierre`. Los dos THEN de `quality-gate` no se pueden verificar dentro del repo: llevan `Se valida en:` (abajo). `constitution.md:4` cita solo `node --test` y no la toco: queda desalineada con `operations.md` y es candidata a una fila de deuda. Descartado: pasar el gate a un paso 3 de `resumen-cierre` (correría después del resumen y habría que decir «el paso 3» en `quality-gate`) y dejar `quality-gate` como está (apuntaría a un paso que ya no existe).
3. Se borra el directorio `skills/aviso-cierre/` entero, sin dejar un stub ni un alias. Quien tenga la skill invocada desde fuera del repo (otros proyectos, configuración de usuario) queda como riesgo aceptado: en el repo no hay manifiesto, hook ni cargador que la nombre (`git grep`, sin más hits que los de la tabla).
4. `closing.md` y `quality-gate.md` reciben su delta en el archivado con `sdd capability merge`, no a mano.
5. La fila 0030 la pasa a ✅ el cierre (`sdd-archive`), no esta feature. El roadmap y el changelog seguirán nombrando `aviso-cierre` como historia.
6. `aviso-apertura` queda fuera.
7. Como la constitución pide tests antes que código (art. 2), se añade un test (`test/skills.test.js`) que fija la línea de apertura, el orden y la ausencia de `skills/aviso-cierre`. Solo mira `skills/`: `closing.md` no se toca hasta el archivado (decisión 4) y seguiría nombrando la skill, así que mirarlo en el test dejaría el gate de la rama en rojo. No es lo que pedía el roadmap: es la forma de que el THEN no dependa de «leer el fichero».
8. Delta probado en una copia de `.docs/sdd` con `sdd capability merge` (comando exacto y salida observada en «Dónde se prueba»); `capabilities/` del repo sin tocar.
9. `sin medir`: los dos THEN de `quality-gate` (ver decisión 2). Sin `§Frontend` ni capacidad nueva.
10. El aviso de «qué se cierra» pasa de **al empezar** el cierre a **al acabarlo**, porque `resumen-cierre` dice «Usar al acabar el cierre». No cambio su `description`: nadie lo ha pedido. Si quieres el aviso al empezar, se cambia la `description` y es otra decisión.
11. «En verde» (`node --test && node scripts/lint.mjs`) solo prueba el test nuevo y el lint de tabuladores, no el comportamiento del gate: no lo uso como evidencia del delta de `quality-gate`.
12. El nombre de la aprobadora, «Laura», venía en el frontmatter y no lo he tocado, aunque `mission.md` dice que el proyecto lo usa una sola persona: dime quién aprueba si no es ella.

### Hallazgos de la review

Ronda 1 (dominio y técnica):

- **Aceptado** — Crítico: el gate no es solo `node --test` (`operations.md:11`) → decisión 2 reescrita con el comando de `operations.md`.
- **Aceptado** — Crítico (descubierto al comprobar el hallazgo de dominio sobre `quality-gate`): `quality-gate.md:18` y `:23` citan «el paso 2», el de `aviso-cierre` → MODIFIED de `quality-gate` y su entrada en el Scope y en la tabla.
- **Aceptado** — Crítico: el criterio de éxito y el `git grep` no se cumplían, porque `roadmap.md` y el changelog nombran la skill → el criterio y el grep se limitan a `skills/` y `capabilities/` (decisión 5).
- **Aceptado** — el THEN era más débil que el Intent → el MODIFIED gana un AND con el orden (en la ronda 2 el segundo AND se concreta, ver abajo).
- **Aceptado** — sin test ni comando → test nuevo (decisión 7) y comandos exactos en «Dónde se prueba».
- **Aceptado** — decisiones sin listar en ✋ → decisiones 1, 3, 4, 6 y 7.
- **Aceptado** — la afirmación del delta probado no se podía comprobar → comando y salida en «Dónde se prueba».
- **Aceptado** — sin línea de cargadores externos → decisión 3.
- **Aceptado** — `git grep` de «paso N» solo en capacidades → ampliado a `skills/`, `README.md` y `PRODUCT.md` (un solo hit, `aviso-cierre:9`).
- **Aceptado** — sintaxis POSIX → se dice el shell (Bash, desde la raíz) y se usa `! git grep -q`.
- **Aceptado** — ejemplo con id y título reales → ejemplo inventado en el 🦆.
- **Rechazado** — «Laura» contradice la misión → no es mío: viene del frontmatter; queda en la decisión 12 para que lo decida el dev-lead.
- **Rechazado** — la política de modelos contradice la existencia de un dev-lead → el texto ya no dice «no hay roles en juego»: dice que el cambio no toca permisos.

Ronda 2 (un revisor, siete puntos; sin tercera ronda):

- **Aceptado** — Crítico: el gate queda sin dueño en el repo → decisión 2: contrato externo declarado, riesgo aceptado, y es lo primero que te pido validar.
- **Aceptado** — Crítico: ningún comando prueba los dos MODIFIED de `quality-gate` → llevan `Se valida en:` y «en verde» deja de contar como evidencia (decisión 11).
- **Aceptado** — el aviso pasa de al empezar a al acabar → decisión 10.
- **Aceptado** — «un solo mensaje» sin escenario verificable → Intent, 🦆 y capacidad dicen «un solo aviso», y el AND se retira del delta: que `skills/aviso-cierre` no exista lo comprueba el test, y escribirlo en la capacidad la haría nombrar la skill que se retira.
- **Aceptado** — el AND «no hay otra skill» era una negación global → retirado del delta (ver arriba).
- **Aceptado** — el test sobre `capabilities/` dejaría la rama en rojo hasta archivar → el test solo mira `skills/` (decisión 7); `capabilities/` se comprueba a mano tras el archivado.
- **Aceptado** — comandos del delta con placeholders → comandos exactos y salida observada en «Dónde se prueba».
- **Aceptado** — tamaño declarado → 3 ficheros en la rama; las capacidades las toca el archivado.
- **Aceptado** — constitución y `operations.md` definen el gate distinto → anotado en la decisión 2 como candidata a deuda; no se toca aquí.
- **Sin cambio** — la aprobadora «Laura» → sigue en la decisión 12: no puedo resolverlo yo.

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo aviso.

Éxito: tras el cambio no existe `skills/aviso-cierre/`, ninguna skill ni capacidad (`skills/`, `.docs/sdd/capabilities/`) nombra `aviso-cierre`, y `resumen-cierre` abre diciendo qué feature se cierra y sigue con sus pasos 1 y 2. El roadmap y el changelog la nombran como historia, a propósito. El gate de cierre sigue siendo el de `operations.md`; que se corra una sola vez y pare el cierre en rojo lo hace el kit y no se puede comprobar desde este repo.

## Scope

- Entra:
  - se retira `skills/aviso-cierre/` (el directorio entero, solo contiene `SKILL.md`);
  - `skills/resumen-cierre/SKILL.md` gana la línea de apertura sin numerar; sus pasos 1 y 2 no cambian;
  - `test/skills.test.js`, nuevo, escrito antes que el cambio de las skills;
  - `.docs/sdd/capabilities/closing.md` y `.docs/sdd/capabilities/quality-gate.md` reciben su delta en el archivado (`sdd capability merge`).
- No entra:
  - cambiar `aviso-apertura`;
  - trasladar «Corre el gate» a otra skill (decisión 2);
  - tocar la fila 0030 del roadmap antes del cierre (decisión 5).

## Lo que se retira o cambia de forma

Buscado en todo el repo, fuera de `.docs/sdd/specs/`, con `git grep -niE "aviso-cierre|aviso_cierre|aviso de cierre|close-notice"`, `git grep -nE "0030"`, `git grep -niE "gate"` y `git grep -nE "(pasos?|steps?) [0-9]+\b" -- skills README.md PRODUCT.md .docs/sdd/capabilities`.

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md:2` y `:6` (nombre y título) | se borra el directorio |
| su paso 1 «Di qué se cierra» | `skills/aviso-cierre/SKILL.md:9` | pasa a la línea de apertura de `resumen-cierre` |
| su paso 2 «Corre el gate» | `skills/aviso-cierre/SKILL.md:10` | no se traslada: lo corre el cierre con `operations.md` (decisión 2) |
| `aviso-cierre` en un THEN | `.docs/sdd/capabilities/closing.md:13` | el MODIFIED lo cambia a `resumen-cierre` |
| «el paso 2» como el del gate | `.docs/sdd/capabilities/quality-gate.md:18` y `:23` | MODIFIED: «cuando corre el gate del cierre» |
| la fila 0030 | `.docs/sdd/roadmap.md:9` | la pasa a ✅ el archivado; el título conserva el nombre (historia) |
| «paso 1» / «paso 2» de `resumen-cierre` | `.docs/sdd/capabilities/closing.md:25-26` | siguen ciertos: la apertura no se numera |
| «paso 2» de `aviso-apertura` | `.docs/sdd/capabilities/closing.md:18` | no es de esta skill, no cambia |
| «Gate de cierre» | `.docs/sdd/operations.md:11`, `.docs/sdd/constitution.md:4` | no cambian |

- Filas que implementa: 0030 → solo `.docs/sdd/roadmap.md:9` (`git grep -nE 0030`, repo entero, sin más hits).
- Cargadores o registros de skills por nombre en el repo: ninguno.

## Approach

`resumen-cierre` abre con lo que se cierra; el resto de la skill sigue igual; el gate es el del cierre. Ver enfoques en ✋.

## Dónde se prueba

Todo desde la raíz del repo, en Bash.

- la apertura y el orden: `node --test test/skills.test.js` comprueba que en `skills/resumen-cierre/SKILL.md` hay una línea que dice qué feature se cierra antes del `1.`, y que siguen `1.` (commits) y `2.` (filas);
- que la skill ya no existe: el mismo test comprueba que `skills/aviso-cierre` no existe y que ningún fichero de `skills/` contiene `aviso-cierre`. Tras el archivado, a mano: `test ! -e skills/aviso-cierre && ! git grep -qi "aviso-cierre" -- skills .docs/sdd/capabilities`;
- el delta, sobre una copia (observado hoy, 2026-11-06, antes de implementar):
  `T=$(mktemp -d) && cp -r .docs/sdd "$T/sdd" && node <ruta del kit>/cli/bin/sdd.js capability merge --path "$T/sdd" --artifact .docs/sdd/specs/20261008-150000-feature-0030-retire-close-notice/spec.md`
  salió con 0 y escribió «closing.md: sustituido «Quien cierra sabe qué se cierra»», «quality-gate.md: sustituido «El gate corre una sola vez»» y «quality-gate.md: sustituido «Un gate en rojo para el cierre»»; `grep -c aviso-cierre "$T/sdd/capabilities/closing.md"` dio 0;
- el gate de la rama: `node --test && node scripts/lint.mjs` en verde prueba el test nuevo y el lint de tabuladores, **no** los dos THEN de `quality-gate` (decisión 11).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `resumen-cierre` dice qué feature se cierra
- AND lo dice antes de sus pasos 1 y 2

### Capacidad: `quality-gate`

#### MODIFIED — El gate corre una sola vez

- GIVEN un cierre en marcha
- WHEN corre el gate del cierre
- THEN el gate corre una vez, y no se repite aunque el cierre se retome
- Se valida en: validación post-merge con fecha

#### MODIFIED — Un gate en rojo para el cierre

- GIVEN el gate del cierre con un test en rojo
- WHEN acaba
- THEN el cierre para y dice qué test falló
- Se valida en: validación post-merge con fecha

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
