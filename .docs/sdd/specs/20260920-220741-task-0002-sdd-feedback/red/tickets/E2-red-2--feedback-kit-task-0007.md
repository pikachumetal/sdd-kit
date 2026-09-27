# Feedback del kit SDD — task 0007 (Nortia Distribución)

Para quien mantiene `sdd-kit`. Sesión del 2026-09-15, 09:02–13:22 (4h 20m): task 0007 «descuentos por volumen», modo full, tres implementadores en paralelo. Versiones: `sdd-kit` 1.1.0 (canal plugin), `superpowers` 6.3.0.

Fuentes: `session-log.md` contrastado con `.docs/sdd/` del proyecto y con la copia local del kit (`kit-red`, `plugin.json` 1.1.0). No he comparado con el plugin instalado, así que la numeración de pasos puede diferir. Las horas de este documento son las del log. El último apartado lista lo que no cuadra entre el log y los artefactos; conviene aclararlo antes de sacar conclusiones.

## Resumen

- Los gates de intent y spec funcionaron sin fricción. El de spec evitó que un cambio de criterio de redondeo pasara como detalle de implementación.
- Cuatro fallos con parte de causa en el kit: un aprendizaje sin destino cuando falta `architecture.md` (~20 min), ningún hueco para contratos entre tasks paralelas (una ronda de fix en T2), un gate de validación que se sintió repetido, y ningún sitio para los tokens en la estimación.
- Dos cosas no son del kit: el commit sin `dotnet build` (~15 min de rama rota) y el olvido en el brief de T2.
- Una práctica del agente que el kit no pide y funcionó: la matriz THEN → test.

## Lo que ha fallado

### 1. Un aprendizaje estructural no tiene dónde aterrizar (`sdd-end-task`, paso 4)

Qué pasó (log 13:05–13:10). El aprendizaje era «resolver siempre a través de una interfaz, nunca contra el repositorio» (`ITariffResolver`), pensado para reutilizarlo en la 0009. Nortia solo tiene `mission.md`, `constitution.md` y `tech-stack.md`. El agente tardó unos 20 minutos y lo dejó como sección «Patrones de dominio» al final de `tech-stack.md`, «el menos malo de los tres».

Qué dice el kit. `aprendizajes-skills.md` (paso 4) reparte: convención → constitution, cambio estructural → `architecture.md`, versión o herramienta → tech-stack. `walkthrough-template.md` §5 repite esos destinos. Los `init-*` generan `architecture.md`, pero el modo migración de `sdd-init-brownfield` se limita a las migraciones y «nada más» (ni siquiera reescribir `architecture.md`), y no he visto otra vía para añadirlo a un proyecto ya inicializado. `sdd-start-task` (paso 1) tolera que falte («si existen»); `sdd-end-task` no dice qué hacer.

Matiz. La constitution también era un destino posible («convención nueva»). El agente la descartó por entenderla como reglas no negociables. El kit no da criterio para elegir entre constitution y architecture cuando el aprendizaje encaja en las dos.

Propuesta. En el paso 4: si el destino no existe, crearlo mínimo con ese aprendizaje y marcarlo para revisión (o preguntar), en lugar de forzarlo en otro documento. Añadir una línea de desempate constitution vs architecture.

### 2. Contratos entre tasks paralelas: ni la plantilla ni el encargo tienen hueco

Qué pasó (log 10:07 y 11:20). El brief de T2 salió sin la firma de `ITariffResolver`, solo con la descripción en prosa. El implementador inventó un parámetro `fechaConsulta`. Se vio al comparar los tres PR: T1 y T3 consumían la tarifa con otra firma. Hizo falta una ronda de fix en T2, incluida en sus 180k tokens sin desglosar.

Causa inmediata: olvido del agente al montar el brief.

Qué podría haber hecho el kit. `plan-template.md` no tiene sección para interfaces compartidas (§1.4 «Contratos API» es para endpoints). El paso 6 de `sdd-start-task` y `encargo-revision.md` obligan a pegar «Restricciones globales» y «Tests RED» en cada encargo, pero nada dice que las firmas que cruzan tasks viajen igual, y el `task-brief` de superpowers solo extrae el texto de la task.

Propuesta. Una sección «Contratos entre tasks» en la plantilla del plan y una tercera sección en la cabecera del encargo del implementador. Es un solo caso; valorar si basta con esto. Ver también el punto 3 del último apartado.

### 3. La validación del usuario se sintió repetida (`sdd-end-task`, paso 0)

Qué pasó (log 12:30–12:31). Marta contestó «ya te lo he dicho» y aprobó igualmente.

Diagnóstico del log, corregido. El log sitúa la primera pregunta en el paso 7 de `sdd-start-task`, al cerrar el plan. En la copia local del kit el paso 7 es la validación del trabajo terminado (tras la revisión final) y el cierre del plan es el gate del paso 5: eran dos preguntas distintas. El log no registra ningún paso 7 entre el smoke (12:15) y `sdd-end-task` (12:30). Además, la pregunta del paso 0 («¿lo dado por bueno sigue en pie?») no es la que define el kit (qué probó Marta y si funciona), y «ya te lo he dicho» no cuenta como validación según el kit.

Lo que sí es del kit. El mismo gate está escrito dos veces, en el paso 7 de `start-task` y en el paso 0 de `end-task`, con la misma fila de racionalización. Ninguno escribe la validación donde el otro la pueda leer, así que el paso 0 no puede saber que ya se dio.

Propuesta. Un único dueño del gate (el paso 7) que deje constancia escrita, por ejemplo una línea en `tasks.md`; el paso 0 comprueba esa constancia y pregunta solo si falta. Mantener la regla de que «cierra la tarea» no es validar.

### 4. La estimación pide tokens y el kit no los registra

Qué pasó (log, resumen de coste). El `estimation.md` del proyecto pide comparar tiempo y tokens reales por subagente. El plan estimó 150–200k por subagente. Reales: T1 212k (por encima del rango), T2 180k, T3 143k; 535k en total. El hilo principal no llevó contador. Las cifras están en el log de sesión, no en el walkthrough ni en el estimation-log.

Kit. `walkthrough-template.md` §2 y `Build-EstimationLog.ps1` solo manejan horas (Est, Real, Ratio).

Propuesta. O una línea de tokens por subagente en el walkthrough y una columna en el log, o dejar dicho que el kit no los cubre. Decidir también si cuenta el hilo principal.

## No es fallo del kit

Commit sin build (log 11:55). El agente fusionó las tres ramas y commiteó sin `dotnet build`. T2 y T3 chocaban en un `using` de `Nortia.Pricing` y la rama estuvo rota unos 15 minutos. Es fallo del agente, como dice el propio log. Apunte opcional para el kit: el paso 6 no menciona un build tras fusionar ramas de tasks paralelas, y el plan de Nortia no llevaba el «Build verde» de la plantilla (§3, Validación final).

El olvido en el brief de T2 está en el punto 2.

## Lo que ha funcionado

1. Gate de intent (09:05–09:14). La pregunta por línea de pedido o total salió en el intent, Marta confirmó «por línea» y aprobó en dos minutos. La decisión consta en `spec.md`. (Log y artefacto.)
2. Gate de spec (09:38–09:40). Obligó a que el cambio de redondeo (MODIFIED) constara en «Decisiones que he tomado yo» y se aprobara. Sin el gate habría quedado como detalle de implementación. (Log y `spec.md`.)
3. Capacidades como verdad viva (09:16 y 12:40). Comprobar en `capabilities/pricing.md` que el requisito a modificar existía tal cual (venía de la 0005) fue inmediato. La fusión del delta al cierre (ADDED añade, MODIFIED sustituye, entrada en Historial) fue casi copiar y pegar. (Log y `pricing.md`; ver punto 4 del último apartado.)
4. Spec y plan orientaron a los implementadores. T1 y T3 pasaron la revisión a la primera, y T3 reutilizó el redondeo bancario entre escalado y rappel como pedía la spec. (Solo log.)
5. `tasks.md` como registro vivo: tres filas con estado y hash de commit. (Log y `tasks.md`.)
6. Smoke a la primera (12:15): pedido que cruza el umbral, cierre con rappel e importe redondeado. Lo ejecutó el agente, no Marta, así que es verificado por el agente y no validación del usuario. (Solo log.)
7. Matriz THEN → test (09:45), práctica del agente que el kit no pide. Antes de despachar armó una tabla informal de cada THEN de la spec contra el test RED que lo cubre; al revisar los tres PR, comprobar la cobertura fue mecánico. Candidata a entrar en el kit: el Self-review de `plan-template.md` mapea requisito → task, no THEN → test. (Solo log; ver punto 3 del último apartado.)

## Lo que no cuadra entre el log y los artefactos

1. Horas de aprobación. `spec.md` tiene `created` 10:15, intent aprobado a las 10:52 y spec a las 11:40. El log dice 09:14 y 09:40, y sitúa el despacho a las 10:05. Con las horas de `spec.md`, el despacho sería anterior a la aprobación de la spec. No lo he podido reconciliar.
2. Pasos que no constan ni en el log ni en los artefactos: el gate de aprobación del plan (`plan.md` no lleva `status` ni aprobación), la línea «Review de spec propuesta» de `review-spec.md` y el paso 7 previo al cierre. Del cierre, el log recoge los pasos 0–4 y 6; no constan el 5 (revisión de skills), el 7 (changelog), el 8 (roadmap, que sigue «en curso») ni el 10 (rama). No sé si el 1.1.0 instalado ya exigía la review de spec.
3. `plan.md` frente a la plantilla y al log. No tiene bloque de interfaces: el log dice que la firma estaba fijada en el plan, pero solo hay la restricción «`ITariffResolver` es la única puerta de entrada a la tarifa». «Modelo» va sin effort. «Tests RED» nombra métodos y por qué fallan, sin dueño ni ruta. No consta que el hilo principal escribiera y commiteara los tests antes de despachar (paso 6).
4. `spec.md` lista solo los títulos del delta, sin escenarios GIVEN/WHEN/THEN. El log habla de «cada THEN de la spec» y de copiar y pegar el delta. Los escenarios solo aparecen en `pricing.md`, ya fusionada.
5. `estimation-log.md` no tiene el formato que genera hoy `Build-EstimationLog.ps1` (Fecha, Task, Tipo, Est, Real, Ratio, Carpeta, más factor de calibración). Usa Estimado, Real y Desviación en horas/minutos y %, con la cabecera «AUTO-GENERADO por sdd-end-task». Según el log, la fila se añadió a mano; `estimation.md` (referencia del kit) manda regenerarlo con el script. Por tanto el «sin fricción» del log no cuenta como que ese paso funcionara. Detalle menor: 4h 20m sobre 3h 30m es +23,8 %, y el log pone +23 %.
6. `tech-stack.md` no tiene la sección «Patrones de dominio» del punto 1 y no existe `walkthrough.md`. El repo está en un único commit `base` limpio. Es coherente con un cierre a medias; si no lo es, esos cambios no están.
7. Versionado. `sdd-kit.json` del proyecto dice 1.1.0 pero lleva el campo `ids`, que según `migrations/v1.2.0.md` introduce la 1.2.0. Y el `plugin.json` de `kit-red` sigue en 1.1.0 aunque incluye esa migración.
