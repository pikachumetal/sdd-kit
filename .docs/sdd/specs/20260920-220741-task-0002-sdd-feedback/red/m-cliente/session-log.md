# Bitácora de sesión — task 0007, descuentos por volumen

Proyecto: Nortia Distribución. Kit `sdd-kit` v1.1.0 (canal plugin), `superpowers` 6.3.0.
Interlocutor: Marta Ibáñez, jefa de ventas. Arranco la sesión a las 09:02 del 2026-09-15.

## 09:02 — Arranque

Marta me pide meterle mano a la task 0007 del roadmap: descuentos por volumen, escalados y
rappel, que llevaba varias entregas en «próximo» sin moverse. Invoco `sdd-start-task`.

## 09:05 — Intent

Repasamos juntas el intent: automatizar el escalado por línea de pedido y el rappel de cierre
de periodo, que hasta ahora se aplicaban a mano en el ERP. Le pregunto si el escalado se mide
por línea o por el total del pedido; confirma que por línea, como hace el comercial ahora.
También aclara que el rappel no hace falta que el mayorista lo vea antes del cierre. Con eso
cierro el intent y paso al gate.

## 09:12 — Gate de intent

El gate de intent pide confirmación explícita antes de escribir la spec. Marta aprueba a las
09:14 sin objeciones — este paso no dio ninguna fricción, fue directo.

## 09:16 — Escribiendo la spec

Redacto `spec.md` con el delta de comportamiento sobre la capacidad `pricing`: dos requisitos
ADDED (escalado por volumen, rappel de periodo) y uno MODIFIED (el redondeo del descuento pasa
de truncamiento a bancario, porque el rappel acumulado con truncamiento generaba descuadres que
el jefe de ventas ya había detectado en un cierre anterior). Reviso `capabilities/pricing.md`
para asegurarme de que el requisito que modifico existe tal cual lo recuerdo — existe, viene de
la task 0005.

## 09:38 — Gate de spec

Marta aprueba la spec a las 09:40. Aquí tampoco hubo fricción: el gate obligó a que la spec
recogiera explícitamente el cambio de criterio de redondeo, que si no se me habría quedado
suelto como detalle de implementación sin pasar por su aprobación.

## 09:45 — Plan

Escribo `plan.md` con tres tasks: T1 el modelo de escalado (`VolumeDiscountCalculator`), T2
`ITariffResolver` y `TariffService`, T3 el rappel de cierre de periodo y el redondeo bancario.
Antes de despachar a los tres implementadores, por mi cuenta —no lo pide ninguna skill del
kit— armo una tabla informal de cada THEN de la spec contra el test que lo va a probar en RED,
para no tener que reconstruir esa relación cuando lleguen los tres task-brief por separado. Me
funcionó bien: al revisar los tres PR luego, tenía la tabla a mano y fue mecánico comprobar que
cada test cubría el THEN que le tocaba.

## 10:05 — Despacho de los tres implementadores

Lanzo los tres subagentes implementadores en paralelo, uno por task del plan.

## 10:07 — Fricción con el task-brief de T2

Al preparar el task-brief de T2 (`ITariffResolver` y `TariffService`) se me olvidó pegar el
bloque de interfaces que ya había fijado en el plan — el brief solo llevaba la descripción en
prosa de qué tenía que resolver el servicio, no la firma. El implementador de T2 inventó su
propia firma de `ITariffResolver` (con un parámetro `fechaConsulta` que no estaba en el plan).
Lo detecté en la revisión de las 11:20, al comparar los tres PR entre sí: la firma de T2 no
encajaba con cómo T1 y T3 esperaban consumir la tarifa. Tuvo que hacer una ronda de fix para
alinear la interfaz con el resto.

## 11:20 — Revisión de los tres PR

Reviso T1 (212k tokens de contexto en el subagente), T2 (180k tokens, más la ronda de fix del
punto anterior) y T3 (143k tokens). T1 y T3 pasan a la primera. T3 en concreto tenía el
redondeo bancario bien resuelto y reutilizado entre escalado y rappel, tal como pedía la spec.

## 11:55 — Mi propio descuido

Fusiono los tres branches de los implementadores y hago commit sin correr `dotnet build` antes
— di por hecho que si los tres PR compilaban por separado, compilarían juntos. No fue así: T2
y T3 tocaban el mismo using de `Nortia.Pricing` con un conflicto de nombres que rompía la
build. La rama quedó rota unos 15 minutos hasta que caí en la cuenta, corrí `dotnet build`,
vi el error y lo arreglé. Fue fallo mío, no de ningún paso del kit — el kit no me exime de
compilar antes de comitear.

## 12:15 — Smoke

Con la build ya sana, corro el smoke de la task: pedido con línea que cruza el umbral de
escalado, cierre de periodo con rappel, y visualización del importe redondeado. Los tres casos
pasan a la primera.

## 12:30 — `sdd-end-task`, paso 0

Invoco `sdd-end-task`. El paso 0 pide validar con el usuario que la task está lista para
cerrarse. Se lo pregunto a Marta. Aquí llega la segunda fricción de la sesión.

## 12:31 — Fricción: validación repetida

Me doy cuenta de que es la segunda vez que le hago básicamente la misma pregunta: ya se la hice
en el paso 7 de `sdd-start-task`, cuando cerramos el plan y antes de despachar a los
implementadores, en el sentido de «¿esto es lo que quieres que construya?». Ahora, en el paso 0
de `sdd-end-task`, le vuelvo a preguntar si lo dado por bueno sigue en pie, sin tener ninguna
información nueva que aportarle desde entonces. Marta contesta «ya te lo he dicho» y aprueba
igualmente, pero se nota que la pregunta le sobra.

## 12:40 — Walkthrough y fusión del delta

Escribo el walkthrough de la task y fusiono el delta de la spec en
`.docs/sdd/capabilities/pricing.md`: los dos requisitos ADDED se añaden tal cual, y el
MODIFIED sustituye el texto del redondeo por truncamiento por el de redondeo bancario, con la
entrada correspondiente en el Historial. Este paso no dio ninguna fricción — el delta de la
spec ya venía en el formato exacto que necesitaba el fichero de capacidad, fue prácticamente
copiar y pegar.

## 12:55 — Registro de estimación

Actualizo `estimation-log.md` con la fila de la task 0007: estimado 3h 30m, real 4h 20m,
desviación +23%. Tampoco hubo fricción aquí — el formato de la tabla ya estaba consolidado de
las tasks anteriores.

## 13:05 — Paso 4 de `sdd-end-task`: aprendizajes → docs vivos

Llego al paso de aprendizajes. Tengo uno estructural que anotar: el patrón de «resolver siempre
a través de una interfaz, nunca contra el repositorio directamente» que aplicamos con
`ITariffResolver` merece quedar registrado para que la próxima task de dominio (por ejemplo el
panel de margen de la 0009) lo reutilice sin reinventarlo. El problema es que este proyecto no
tiene `architecture.md` — solo `mission.md`, `constitution.md` y `tech-stack.md` — y ese
aprendizaje no es ninguna de esas tres cosas: no es el porqué del proyecto, no es una regla
no negociable, y no es una versión de librería.

## 13:10 — Fricción: sin sitio donde aterrizar el aprendizaje

Doy vueltas unos veinte minutos mirando los tres documentos que sí existen, dudando entre
crear un `architecture.md` nuevo solo para esta anotación o forzarlo en otro sitio. Al final,
decisión mía, lo meto como una sección breve al final de `tech-stack.md` («Patrones de
dominio») porque es el documento menos malo de los tres que tengo — no porque encaje
naturalmente.

## 13:20 — Cierre

Marco las tres tasks del plan como `done` en `tasks.md` con el hash del commit de fusión de
cada una. Cierro la sesión a las 13:22.

## Resumen de coste

- Tiempo de reloj: 4h 20m (09:02–13:22).
- Subagente T1: 212k tokens. Subagente T2: 180k tokens (incluye la ronda de fix). Subagente
  T3: 143k tokens.
- El hilo principal no llevó contador de tokens en esta sesión.
