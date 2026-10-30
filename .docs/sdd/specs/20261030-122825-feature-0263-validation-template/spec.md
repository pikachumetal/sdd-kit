---
id: 20261030-122825-feature-0263-validation-template
feature: 0263
title: La validación se presenta siempre igual, y la spec decide quién valida
mode: full
profile: delegate
status: approved
created: 2026-10-30
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-30
---

# Spec — La validación se presenta siempre igual, y la spec decide quién valida

🦆 Cuando el agente termina un cambio, el mensaje de validación tendrá siempre la misma forma: lo hecho, lo que se salió del plan, su smoke, sus suites, lo que no pudo probar y, al final, el guion. Con la reserva de una sala, el guion abre con la rama, el worktree y `node scripts/env-up.mjs` en su propio bloque, sigue con pasos como «cancelar Norte lun → `cancelada Norte lun (sala ocupada)`» y acaba en «dime "validado" o qué paso falla». Si un cambio solo fija la versión de Node, la spec dice `Validación: agente` y nadie te pide abrir `.nvmrc`: queda una línea con lo que midió el agente. Lo que usa una persona, o lo dudoso, lo sigues validando tú.

Validación: agente — solo cambia texto que siguen los agentes: una persona no observaría nada que los sujetos no midan; este repo cierra además con `validation.mode: field`.

## Capacidades

- Modificadas: `feature-flow` — cambia «El trabajo se valida con el usuario antes de cerrar» y entra la forma de la presentación
- Modificadas: `control-profiles` — entra quién valida

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (1 requisito de `feature-flow`) · tamaño: ~120 líneas en 11 ficheros
- Mínimo razonable: ninguna — sin revisor, nadie más relee la spec antes del gate; queda el repaso de coherencia

1. **Un frente sin sujeto**: dijiste un sujeto RED por frente y lanzo dos. «La spec dice quién valida» no lleva sujeto: `spec-template.md` y `patch-template.md` no tienen el hueco, es un fallo estructural que se lee con fichero y línea (`tech-stack.md`, regla de frentes de campo), y un sujeto gastaría sin poder salir de otra forma. Se mide en GREEN.
2. **`AskUserQuestion` no sale en el RED**: en `claude -p` esa herramienta no existe, y `t1` y `t2` preguntaron en prosa, sin intentarla. Ese trozo se apoya en tu reporte, no en la medida. La excepción va escrita igual, y en GREEN se puntúa que el mensaje acabe en la frase.
3. **Diferir se conserva en una línea**: el cierre sigue admitiendo la validación diferida, así que la línea `Diferir: lo pruebo en <uso>, a cargo de <quien valida>` va justo antes de la frase final, que queda literal. Las tres opciones de `sdd-archive` paso 1 salen: «No funciona» pasa a ser «qué paso falla».
4. **Dos piezas que la fila no ordena**: la verificación visual y la línea `Panel:` van tras «lo que no pudo probar» y antes del guion, porque hoy ya son «antes del guion» (`sdd-start-feature` paso 7, `dev-validation.md` §4).
5. **Se añaden ficheros que tu alcance no nombra**: `walkthrough-template.md` §4.2 (la línea nueva, porque hoy dice «sin una de las tres no hay cierre»), `skills/sdd-archive/references/dev-validation.md` (remite a la plantilla para la forma; se quedan la composición, el ensayo, «hands off» y el panel) y `.docs/workflow/usage-guide.md` §Validar de verdad (cuenta el orden viejo).
6. **Línea ausente = `dev-lead`**: las specs y los patches ya abiertos no llevan la línea, y en duda valida el dev-lead. No hay paso de migración.
7. **Dónde va la línea**: justo tras el 🦆, antes de «Capacidades», en spec y en patch; el dev-lead la ve sin bajar.
8. **`agente` necesita un humano que lo apruebe**: en una spec, tu aprobación en el gate. Con la spec aprobada por delegación, o en `unattended`, el agente se la aprobaría a sí mismo: vale `dev-lead`, salvo que tu frase lo nombre. Un patch no tiene gate de spec: `agente` solo con tu frase literal en la petición o en la pregunta del carril.
9. **`field` manda**: con `validation.mode: field` la línea se escribe igual, pero el registro es `Validación en campo:`, sin `Validación por el agente:`. Por eso esta feature cierra en campo.
10. **El guion de una task en `pair`** (`feature-flow`, «En `pair`, cada task cerrada para con su guion de pruebas») no entra: es otra parada, y el reporte habla de la validación final.
11. **Saldo de palabras**: lo mido con `wc -w`. Hoy: `sdd-start-feature/SKILL.md` 1977, `control-profiles.md` 4805, `sdd-archive/SKILL.md` 4616, `dev-validation.md` 1029, `sdd-templates/SKILL.md` 1663; cada uno queda igual o baja, y la cifra final va en el ✋ del cierre. **Te rebato un punto**: en `sdd-templates` el total de la skill sube, porque es el destino de la plantilla y de los huecos; solo se puede cumplir en su `SKILL.md`. El saldo que importa es que el texto salga de los pasos que el agente lee en cada cierre.
12. **Previsión de pruebas** (Art. I): RED hecho, 2 sujetos Sonnet, 0,41 $. GREEN: `t1` y `t3` con n=2, y de control `v1a`, `v1b`, `g1` y `g3` con n=1: 8 sujetos, ~2 $ por tanda; con una tanda de REFACTOR, ~4 $. Tope 8 $. Pasos cambiados: paso 7 de `sdd-start-feature` (`t1`, `v1a`, `v1b`), paso 1 de `sdd-archive` (`t1`, `t3`, `g1`), `dev-validation.md` (`g1`, `g3`), la regla de quién valida de `control-profiles.md` (`t3`); los huecos de spec y patch, leyendo el sujeto `t3`, que parte de la línea escrita; la línea en una spec nueva no la mide ningún sujeto, la comprueba un test de `sdd-templates`.
13. **Repaso de coherencia**: `capability merge` sobre una copia, verde: sustituido «El trabajo se valida con el usuario antes de cerrar», añadidos «El guion arranca por el entorno y acaba en texto» y «La spec dice quién valida». La línea `Validación:` no la pregunta `sdd-propose`: la pide el hueco de la plantilla (Art. II, elemento omitido).
- Política de modelos: sin revisores de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no · sujetos Sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Se conservan y abren el mensaje el 🦆 y «✋ Me salí del plan en…» — «eso estaba bien»
- El guion va el último y acaba en texto con «dime "validado" o qué paso falla», nunca con `AskUserQuestion`, como excepción escrita — prompt de arranque, 2026-10-30
- El guion empieza por rama, worktree y entorno; cada comando en su línea y sin puntuación final; un bloque por terminal; bloques sin lenguaje — prompt de arranque, 2026-10-30
- Valida el agente solo si un humano no observaría nada que él no haya medido ya; lo demás y lo dudoso, el dev-lead; se aprueba en la spec — prompt de arranque, 2026-10-30
- Con `agente` no hay guion y queda `Validación por el agente: <fecha> · <evidencia>`; algo visible al implementar vuelve a `dev-lead` como desvío — prompt de arranque, 2026-10-30

## Intent

Cada agente presenta la validación a su manera. En el RED, `t1` (0263, `red/out/t1-1.texts.txt`) no abre con 🦆 ni ✋, da el smoke tras el guion, no da rama, worktree ni arranque de un proyecto con servidor, y no separa las suites. Y a veces se pide validar lo que no aporta: `t2` (`red/out/t2-1.texts.txt`), en una tarea que solo fija Node 22, pide ejecutar `cat .nvmrc`. El éxito: un sujeto con una tarea con entorno presenta con la forma de la plantilla, y otro con `Validación: agente` cierra sin guion y con su línea de evidencia. Fracasaría, aunque funcione, si `agente` se convierte en un atajo que el agente se concede para no pedir validación, o si las skills crecen.

## Scope

- Entra: `skills/sdd-templates/templates/validation-template.md` (nueva) y su fila en `skills/sdd-templates/SKILL.md`; la línea `Validación:` en `spec-template.md` y `patch-template.md`; la línea de registro en `walkthrough-template.md` §4.2 y en §4 de `patch-template.md`; `skills/sdd-start-feature/SKILL.md` paso 7, `references/control-profiles.md`, `skills/sdd-archive/SKILL.md` paso 1 y `references/dev-validation.md` trazan desde la plantilla; `.docs/workflow/usage-guide.md` §Validar de verdad; escenarios en `tests/batteries/sdd-archive/`.
- No entra: retirar `sdd-start-feature` (0206, que lo hereda); cambiar `validation.mode: field` (el mismo mensaje, sin guion); cambiar `validation.startEnvironment` (con `true`, el guion dice que el entorno está arrancado en vez de dar los comandos); el guion por task de `pair`; preguntar la línea en `sdd-propose`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Orden «🦆, ✋, qué hay, guion, smoke» | `sdd-start-feature/SKILL.md:24`; `capabilities/feature-flow.md:78`; `.docs/workflow/usage-guide.md:140-144` | plantilla; delta `MODIFIED`; Scope |
| Las tres opciones `Validado` · `Diferir` · `No funciona` | `sdd-archive/SKILL.md:29` | plantilla, decisión 3 |
| «La pregunta de validación ofrece diferir» | `control-profiles.md:131`; `capabilities/control-profiles.md:109` | sigue valiendo: la oferta pasa a su línea en texto, decisión 3 |
| «sin una de las tres no hay cierre» | `walkthrough-template.md:68` | Scope: pasa a cuatro |
| «The script opens with it» (el entorno) | `dev-validation.md:16` | sigue valiendo; la forma va a la plantilla |

- Filas que implementa: 0263 → solo la nombra `roadmap.md`, que marca el cierre | comprobado con `grep -r 0263 skills .docs/sdd/capabilities`

## Approach

La plantilla, de chat como `launch-prompt-template.md`, fija forma y orden: 🦆 · «✋ Me salí del plan en…» · smoke en tabla (con los términos de `walkthrough-template.md` §4: `suite`, `ejecución real`, `no probado`) · una línea por suite con `N/N` y sha, o por qué se saltó · lo que no pudo probar · verificación visual y `Panel:` si aplican · guion. El guion: rama, worktree y entorno; un bloque sin lenguaje por terminal, cada comando en su línea sin puntuación final; pasos de uno en uno, los literales del reporte primero, con sus datos y su resultado esperado; cómo parar el entorno; `Diferir:`; «dime "validado" o qué paso falla». Las skills dicen cuándo se presenta y qué se comprueba, y enlazan la plantilla; su texto de forma sale. El agente no lanza nada contra el entorno mientras la persona prueba (0208, se queda en `dev-validation.md`).

## Dónde se prueba

- La forma de la presentación: batería de `sdd-archive`, `t1`, sobre `reservas-e2e-manual`.
- `Validación: agente` sin guion: batería de `sdd-archive`, `t3` (nuevo), sobre `reservas-config-agent`.
- Sin la línea se sigue pidiendo validar: `t2`, control.
- Field y los pasos del reporte no regresan: `v1b`, `g1`, `g3`.
- La plantilla existe y está listada: `cli/test/kit/skills.test.ts`, que ya compara el índice con `templates/`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `feature-flow`

#### MODIFIED — El trabajo se valida con el usuario antes de cerrar (antes: "las decisiones sin el dev-lead, el guion de pruebas y el smoke que ejecutó")

- GIVEN una feature con la implementación terminada y el cierre de la revisión final terminado (sin Critical abiertos ni Important sin adjudicar), en un proyecto con `validation.mode` `manual` o sin la clave, y una spec sin `Validación: agente`
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-archive` presenta el mensaje de `validation-template.md`, empezando por un párrafo con 🦆 sobre lo que cambia para quien usa el producto y siguiendo con «✋ Me salí del plan en…», las decisiones sin el dev-lead, el smoke que ejecutó y el guion de pruebas, el último, y espera la validación explícita (qué probó el usuario y que funciona; «cierra la tarea» no lo es)
- AND el guion de pruebas son pasos numerados, cada uno con una acción en la aplicación y su resultado esperado, compuestos y ensayados como dice «El guion de la validación empieza por el reporte y lo ha corrido el agente» de [`archive`](archive.md). Va separado del smoke.
- AND el smoke da una fila por THEN de la spec con su evidencia, que es uno de tres valores: `suite`, `ejecución real` o `no probado`. Un THEN que se observa en una interfaz (pantalla, respuesta HTTP, salida de una CLI, fichero que produce el cambio) solo cuenta como verificado con `ejecución real`.
- AND un THEN de fallo (un error, un rechazo, un 400) se provoca de verdad con la entrada que falla: con la feature 0012, `curl -i localhost:<puerto>/api/bookings?status=Lost` → `400` con «Estado no válido: Lost», no «lo cubre el test de la task 3»
- AND el smoke dice cuánto tardó la suite completa
- AND un «sí» sin detalle a la pregunta de validación, que ya pedía el detalle, es validación: no se repregunta, y el walkthrough registra la frase literal y «no detalló qué probó»
- AND si el usuario no responde, la feature queda en espera con el smoke documentado; si difiere, se aplica «La validación puede diferirse con condiciones» de [`control-profiles`](control-profiles.md); en `unattended` se difiere al smoke de la release
- AND el walkthrough registra la validación separada de lo verificado por el agente, y las decisiones sin el dev-lead en su propia sección
- AND con `validation.mode: field` no presenta guion ni espera: el smoke por THEN y la suite se ejecutan igual, el mensaje con el que pasa al cierre empieza por el 🦆 y el ✋ de los rulings, y se aplica «Con `validation.mode: field`, la validación es en campo» de [`control-profiles`](control-profiles.md)

#### ADDED — El guion arranca por el entorno y acaba en texto

- GIVEN la 0010, con servidor en `node scripts/env-up.mjs` y parada en `node scripts/env-down.mjs`, lista para validar en `validation.mode` `manual`
- WHEN el agente presenta la validación
- THEN el guion es lo último del mensaje y empieza por la rama, el worktree y el entorno, con un bloque de código sin lenguaje por terminal y cada comando en su línea, sin puntuación al final
- AND sigue con pasos de uno en uno, con sus datos y su resultado esperado, y acaba con cómo parar el entorno y «dime "validado" o qué paso falla», en texto
- AND no usa `AskUserQuestion` para pedir la validación, porque tapa el guion: es una excepción a la norma de preguntar con esa herramienta
- AND con `validation.startEnvironment: true`, el guion dice que el entorno está arrancado, con su puerto, en vez de dar los comandos de arranque

### Capacidad: `control-profiles`

#### ADDED — La spec dice quién valida

- GIVEN una spec o un `patch.md` con la línea `Validación: agente — solo fija Node 22 en package.json y .nvmrc` y un proyecto con `validation.mode` `manual`
- WHEN el agente cierra
- THEN no presenta guion ni espera validación, y el walkthrough (en un patch, `patch.md` §4, debajo de la tabla) registra `Validación por el agente: <fecha> · <evidencia>`, con el smoke y la suite que ejecutó
- AND la fila del roadmap queda ✅
- AND sin la línea, o con `Validación: dev-lead`, valida el dev-lead
- AND con la spec aprobada por delegación o en `unattended`, `agente` solo vale si la frase del dev-lead lo nombra; en un patch, solo con su frase literal en la petición o en la pregunta del carril
- AND si al implementar aparece algo visible para el usuario, la línea vuelve a `dev-lead` como desvío
- AND con `validation.mode: field`, el registro es `Validación en campo:`

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-start-feature/SKILL.md` | 1977 / 2395 | 418 | sin cambio |
| `sdd-start-feature` completa | 11493 / 14152 | 2659 | sin cambio |
| `sdd-archive/SKILL.md` | 4616 / 4900 | 284 | sin cambio |
| `sdd-archive` completa | 9739 / 10000 | 261 | sin cambio |
| `sdd-templates/SKILL.md` | 1663 / 2125 | 462 | sin cambio |
| `sdd-templates` completa | 16064 / 19650 | 3586 | sin cambio |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-30 | aprobada (opción «Apruebo») |
