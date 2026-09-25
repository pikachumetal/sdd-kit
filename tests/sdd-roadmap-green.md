# GREEN — una sola puerta de entrada al roadmap y retirada de `sdd-start-release` (task 0062)

> **Nombre**: la skill se llamaba `sdd-plan` cuando se midió esta campaña; el 2026-09-25 pasó a `sdd-roadmap` (enmienda de la spec). Las citas y las salidas de los sujetos conservan el nombre con que se midió.

Mismo molde, mismos guiones y mismo lanzador que el [RED](sdd-roadmap-red.md), con `OUT_NAME=green`, sobre el kit del commit `debb31f` (copia con `git archive`): `sdd-plan` presente y `sdd-start-release` retirada en todos los escenarios. La rama ya lleva `develop` integrado (`b8e7312`), así que el kit medido incluye las tasks 0058, 0063, 0067 y 0068. Salidas en [`green/`](../.docs/sdd/specs/20260924-231636-task-0062-plan-entry/green/).

**Gastado en el GREEN**: 22 sujetos, 5,99 $, ~25 min de reloj en paralelo. **Campaña entera** (RED + GREEN): 44 sujetos y 11,91 $, frente a la previsión de ~40 sujetos y ~15 $ y al techo de 50 sujetos y 25 $.

## Resultados

| Medida | RED | GREEN -1 | GREEN -2 |
| --- | --- | --- | --- |
| p1 · carga `sdd-plan` | — | ✅ | ✅ |
| p1 · el porqué y las reglas en `proposal.md`, no en el roadmap | ❌ 2/2 | ✅ `proposal-0014-cobro-clientes-externos` | ✅ `proposal-0014-facturacion-externos` |
| p1 · reglas con ejemplos con datos | ❌ 2/2 | ✅ («Norte 20 €/h, Sur 35 €/h → Sur 10-12 son 70 €») | ✅ |
| p1 · filas con id reservado, «`proposal: 0014`» y «tras NNNN»; sin rama ni spec | parcial | ✅ 0015–0019 | ✅ 0015–0019 |
| p2 · una fila, sin propuesta ni spec (control) | ✅ 2/2 | ✅ propone la fila y espera (Próximo con id, o Backlog) | ✅ Próximo, `0014` reservado |
| p3 · ids de Azure tal cual | ✅ 2/2 | ✅ | ✅ |
| p3 · no toca filas existentes sin preguntar | ❌ 2/2 | ✅ la 0013 sigue; 4514 marcada «posible duplicado» | ✅ ídem |
| p3 · propone partir la épica ahora | ❌ 2/2 | ✅ cinco hijos para que los cree el PM, sin ids inventados | ✅ ídem |
| p4 · acta con las notas literales | ❌ 2/2 | ✅ `proposal-0017-acme-reunion-1`, sección «Acta» | ✅ `proposal-0014-acme-reunion` |
| p4 · el descarte no se borra | ❌ 1/2 | ✅ `⏸️ aparcada: descartada por Acme, 2026-09-25` | ✅ ídem |
| p4 · no abre una release que nadie pidió | ❌ 1/2 | ✅ | ✅ |
| p5 · orden y «tras 0012» en la fila (control de forma) | ✅ 2/2, en prosa | ✅ «— tras 0012» | ✅ «— tras 0012» |
| p6 · «prepara la release» entra por `sdd-plan` | ❌ 2/2 a `sdd-end-release` | ✅ inventario, orden por riesgo, «Ficheros que toca»; espera la decisión | ✅ ídem, con la deuda como prerrequisito de la 0012 |
| p7 · la primera pregunta señala «tras 0012» (control del recorte) | ✅ 2/2 | ✅ | ✅ |
| p8 · el fix sale en una rama con el id reservado (control) | ✅ 2/2 | ✅ `feature/0014-sala-obligatoria`, deja la 0013 sin renombrar | ✅ ídem |
| p8b · renombra la rama sin id | ❌ 2/2 | ✅ `git branch -m feature/0014-sala-obligatoria` | ✅ ídem |
| p9 · reproduce con una entrada mínima (control del recorte) | ✅ 2/2 | ✅ `toHours('90 min')` | ✅ ídem |
| p10 · enmienda fechada, sin reescribir las reglas | ❌ 2/2 | ✅ «Enmiendas» con fecha y ejemplos con datos | ✅ ídem |
| p10 · no arranca nada | ❌ 2/2 | ✅ solo docs en `develop` | ✅ ídem |
| p10 · no toca la feature cerrada; re-parte solo lo pendiente | ✅ 2/2 | ✅ fila 0024 tras la 0021; la 0022 cambia su ítem | ✅ ídem |

## Lo que dicen los sujetos

- p3-1: «**4514, aforo en salas libres:** parece duplicar la 0013. No había a quién preguntar, así que dejé las dos filas y marqué la duda en la 4514. No fusioné ni sustituí nada».
- p6-1: «Con `control.profile: delegate` te propongo el scope y espero tu decisión».
- p8-1: «Estabas en `feature/0013`, que es el ítem "aforo" del roadmap, así que no la renombré». p8b-2: «la renombré de `feature/fix-sala` a `feature/0014-sala-obligatoria` antes del commit, porque no tenía commits propios». La regla acotada a la rama sin id se aplica justo donde toca, en los dos sentidos.
- p10-1: «añadí una sección "Enmiendas" con fecha de hoy. Las reglas originales quedan intactas y cada cambio lleva su ejemplo con datos».

## Observaciones sin REFACTOR

- **p10 entra por `sdd-start-task`** y se pasa a `sdd-plan` en el mismo turno (2/2). La petición («actualiza lo que haga falta en el proyecto») no trae ningún verbo de planificar de los que nombran la `description` y el router. El resultado es el correcto, así que no se añade guía; si en campo una petición así acaba arrancando una task, el disparador está aquí.
- **p10-2 pasa la tabla del reparto al formato de la plantilla** (columnas Id y Tras, sin estado) sin que se le pida, y lo dice. Es inocuo sobre una propuesta anterior a la plantilla.
- **p2-1 propone la fila y espera** en vez de escribirla: la petición no delega la decisión y el perfil es `delegate`. Es la conducta que pide el paso 3 de la skill; el control (una fila, sin propuesta ni spec) se cumple.

## Veredicto

Los seis frentes con guía pasan 2/2. Los cinco controles (p2, p5, p7, p8, p9) no regresan, incluidos los dos recortes del RED. Sin REFACTOR.

## Verificación tras la revisión final (p11)

La revisión final (Opus) encontró que la regla de «task en marcha» solo aparecía en los cambios de definición de una propuesta. Tras subirla al paso 1 del checklist (`3180924`), un escenario nuevo sobre el kit arreglado: la 0013 🔄 con su rama `feature/0013-aforo` y un commit propio, y las notas de una reunión sobre su mismo tema («proyector y orden por aforo en `salas libres`»).

| Medida | p11-1 | p11-2 |
| --- | --- | --- |
| carga `sdd-plan` | ✅ | ✅ |
| la fila 0013 y su rama no cambian | ✅ | ✅ |
| lo nuevo va a filas nuevas «tras 0013» con «`proposal: 0014`» | ✅ 0015 y 0016 | ✅ 0015 y 0016 |
| acta con las notas literales | ✅ | ✅ |

p11-2: «La 0013 (aforo) sigue en marcha en `feature/0013-aforo`, así que no la modifiqué ni amplié». Dos sujetos más, 0,67 $. **Campaña entera**: 46 sujetos y 12,58 $, dentro del techo de 50 sujetos y 25 $.
La copia de la propuesta de p11-2 se guarda como `…-proposal-0014-salas-libres/`: el sujeto la llamó `…-salas-libres-proyector-orden` y la ruta pasaba de 140 caracteres.

## Tras el renombrado a `sdd-roadmap` (`cda449d`)

El enrutado se vuelve a medir con el nombre nuevo, un sujeto por escenario de entrada (p1, p4, p6, p10):

| Medida | p1-3 | p4-3 | p6-3 | p10-3 |
| --- | --- | --- | --- | --- |
| carga `sdd-roadmap` | ✅ | ✅ | ✅ | ❌ se queda en `sdd-start-task` |
| conducta de su escenario | ✅ propuesta 0014 y filas 0015–0019 | ✅ acta, 0012 aparcada | ✅ propone el scope y espera | ❌ reescribe las reglas de la propuesta (sección «Cambios» sin enmienda) |

En el GREEN, con el nombre `sdd-plan`, los dos p10 entraban por `sdd-start-task` y se pasaban solos; con `sdd-roadmap`, p10-3 no se pasó. **REFACTOR** (`e68cd50`, decidido por el dev-lead al llegar al techo, que sube de 50 a 53 sujetos): el paso 2 de `sdd-start-task` gana una quinta salida, «petición que solo cambia la planificación → `sdd-roadmap`», y la `description` de `sdd-roadmap` recoge «el cliente ha cambiado una regla de algo ya planificado».

| Medida | p10-4 | p10-5 | p2-4 (control) |
| --- | --- | --- | --- |
| carga `sdd-roadmap` directamente | ✅ | ✅ | ✅ |
| enmienda fechada, reglas originales intactas | ✅ | ✅ | — |
| nada arrancado; la 0021 cerrada no se reabre | ✅ | ✅ | ✅ propone una fila, sin propuesta, y espera |

**Campaña entera**: 53 sujetos, 14.47 $, con el techo de sujetos ampliado a 53 por el dev-lead y el de dinero (25 $) sin tocar.
