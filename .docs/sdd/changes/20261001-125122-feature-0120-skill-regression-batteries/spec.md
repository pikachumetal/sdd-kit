---
id: 20261001-125122-feature-0120-skill-regression-batteries
feature: 0120
proposal: 0119
title: Baterías de regresión por skill, topes de palabras y «una entra, otra sale»
mode: full
status: approved
created: 2026-10-01
author: Claude (Opus 5.5), con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-01
---

# Spec — Baterías de regresión por skill, topes de palabras y «una entra, otra sale»

## Capacidades

- Ninguna, porque son herramientas y documentos del repo del kit: `tests/`, `tests/headless/`, la constitution, `tech-stack.md` y `architecture.md`. Ninguna skill cambia y ningún proyecto consumidor ve otra conducta.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna. Señales: ninguna (sin capacidad, contrato público, datos ni dependencia externa; he leído el lanzador, el test de `using-sdd`, la batería de la 0074 y el RED de la 0125). Tamaño: ~600 líneas en ~12 ficheros.
- Mínimo razonable: ninguna. Deja sin mirar la redacción del Art. V, que el gate lee entera, y la forma del fichero de batería, que se prueba al pasar la de `using-sdd`.

1. **Una batería es una carpeta, `tests/batteries/<skill>/`**, con tres piezas. Así cualquier campaña la lanza sin copiarla de la carpeta de otra spec (tech-stack, entrada de la task 0039):
   - `battery.md` tiene dos tablas. La de escenarios lleva id, paso (en `using-sdd`, la fila de la tabla de puertas), petición, esperado, n, umbral, modelo y procedencia. La de procedencia lleva cada regla de la skill con su RED o ticket de origen y los escenarios que la cubren.
   - `subject.sh` toma la petición de `battery.md` por id. La petición vive en un solo sitio.
   - El molde, versionado en la carpeta.
2. **El lanzador de baterías es `tests/headless/battery.sh`**, sobre `run.sh`, sin copiarlo.
   - Lee la tabla y lanza los escenarios del tramo pedido (`STEPS`, por paso) o todos, con el n y el modelo de cada fila, en tandas de 5 como máximo.
   - Respeta los techos de sujetos y de coste de `run.sh`.
   - Termina con un resumen por escenario (pasan / n · umbral · verde o rojo) y sale con 1 si hay algún rojo.
   - El veredicto es automático cuando el esperado es una skill o «ninguna»: compara la primera `>>> Skill:` de `tools.txt`. Cuando el esperado es «se lee», imprime la ruta del `texts.txt` para leerlo.
3. **El molde se genera con la versión del kit que se prueba.** El marcador `sdd-kit.json` del molde no se copia: lo escribe `subject.sh` con la versión mayor entre la de `plugin.json` y la última `migrations/v*.md` de la copia del kit.
   - Motivo: el hook avisa de migraciones pendientes si el marcador es menor que esa migración. El molde de la 0074 lleva `1.2.0`, así que hoy cada sujeto de la batería recibiría el aviso «ponte al día con `sdd-init-brownfield`», que es otra puerta.
   - Con la sola `plugin.json` tampoco basta: este repo tiene hoy `plugin.json` en 2.2.0 y `v2.3.0.md` ya escrita.
4. **Primera batería, `using-sdd`**, con una fila por escenario:
   - Las 15 frases de la 0074 (con `r5`).
   - Las de las filas visuales de la 0098 (patch de maquetación y texto visible, que va a feature), con su molde web.

   Se mide con Sonnet, porque los fallos de origen se midieron con Sonnet. Los escenarios de fallo corregido (`r1`, `r3`, `s1`, `d1` y los visuales que fallaban en el RED) van con n=2 y umbral 2 de 2; los controles, con n=1 y umbral 1 de 1. Así salen unos 26 sujetos (19 escenarios, 7 de ellos con n=2), frente a los 28 de la 0074, que solo cubría 14 frases. La pasada de esta feature es el baseline de la batería con el kit de hoy.
5. **Un rojo de la batería no se arregla aquí.** Si una frase cambia de puerta con el kit de hoy, la feature no edita la skill: abre una fila de deuda con la evidencia y sigue. Y no relanza el escenario para sacar verde.
6. **Segundo turno con la salida real del primero: `subject_resume "<mensaje>"` en `lib.sh`.** Reanuda la sesión del sujeto con `claude -p --resume <session_id>`, con los mismos argumentos, y añade el turno al mismo `.jsonl`; el coste se cuenta por el último `result`.
   - La regla de método va a `tech-stack.md`: cuando un fallo es de varios turnos, el segundo se mide con `subject_resume` sobre la sesión del primero. Si se parte en escenarios de un turno, el molde del segundo se monta con lo que dejó el primero, nunca con el relato del ticket (ticket del patch 0125).
   - Sustituye a las dos entradas que dicen que `lib.sh` lanza un solo turno y que los gates a dos turnos van con un lanzador propio.
7. **La pregunta abierta, el molde de «sesión larga», se contesta con un experimento barato, no con un molde.**
   - Relanzo la fila 2 del RED del patch 0125 (`b1` y, en la misma sesión, el mensaje de `b2`) como dos turnos reales con `subject_resume`: n=2, ~1,5 $.
   - **Si reproduce** (despacha la re-revisión de su propia pasada en 1 de 2 o más): los fallos de varios turnos se miden siempre con la historia real, y la fila de deuda de la 0125 se reabre con esa evidencia.
   - **Si no reproduce**: descarto el molde de sesión larga y lo apunto en `tech-stack.md` como descarte con su evidencia. Un relleno de contexto sintético no reproduce una causa que no conocemos, y una sesión larga real cuesta ~0,4 $ por turno. Los fallos de sesión larga los detecta el campo (`validation.mode: field`) y se re-miden con `subject_resume`.
   - Confírmame cuál es el segundo RED de esta semana que no reprodujo: he localizado el de la 0125, y el otro creo que es el de la 0113. Si es otro, lo añado al experimento solo si cabe en el techo.
8. **Topes de palabras en `tests/WordBudget.Tests.ps1`**, que va en el conjunto rápido (solo lee ficheros):
   - un tope por `SKILL.md`;
   - un tope por skill completa: todos sus `.md`, plantillas incluidas, salvo `references/migrations/`, que crece una por release y solo se lee la pendiente;
   - un presupuesto del kit entero;
   - un tope por documento de anclaje (`constitution.md`, `mission.md`, `architecture.md`, `tech-stack.md`).

   Se cuenta como `UsingSdd.Tests.ps1`, con `-split '\s+'`. Una skill sin tope hace fallar el test: una skill nueva entra con su tope. El mensaje de fallo da la medida, el tope y la salida: «recorta, o sube el tope con la decisión del dev-lead escrita en la spec».
9. **Valores iniciales: el tamaño al cerrar, sobre la base al día, redondeado a la centena siguiente.** El presupuesto del kit es el total redondeado a la centena siguiente, no la suma de los topes, para que un crecimiento repartido también frene. Las consecuencias, para que las valides:
   - **Las features en curso (0050, 0124, 0117) se encuentran el tope si cierran después que esta.** Lo suben en su propia spec con tu decisión, o recortan.
   - **`tech-stack.md` (~18.700 palabras) queda congelado.** Cada aprendizaje nuevo de un cierre tiene que sustituir o condensar otro, como pide la ampliación de la fila del 2026-09-30. La alternativa es dejarlo sin tope hasta la propuesta de documentos acotados. No la tomo, porque la fila lo incluye.
10. **El tope de `using-sdd` (530) sale de `UsingSdd.Tests.ps1`** y pasa a la tabla nueva. No hay dos fuentes del mismo tope.
11. **«Una entra, otra sale» va a la constitution como párrafo del Art. I.**
    - El texto: la spec de toda feature o patch del kit dice qué retira o adelgaza; «nada» se justifica y se aprueba en el gate; el presupuesto del kit solo sube por decisión del dev-lead.
    - No toco `spec-template.md`, porque esta feature no edita skills. La regla la lee el agente en la constitution, que se carga en el paso 1. El hueco en la plantilla queda para la 0121.
12. **El criterio de versión mayor va al Art. V**, con la redacción de la fila: es mayor la release tras la cual un proyecto tiene que cambiar algo para seguir trabajando (una frase o un comando que deja de funcionar, un artefacto que cambia de forma, una migración con pasos además del marcador). Con él se decide el número al cortar, y lo aplica la 0122.
13. **El cómo del Art. I va a `tech-stack.md`**, en una subsección nueva «Baterías por skill» dentro de «Cómo se testean las skills». El principio del Art. I no cambia.
    - La subsección dice que una edición lanza el tramo de su paso más un escenario del fallo, y la batería entera en las pasadas de adelgazamiento y al cortar release.
    - Dice también lo de umbral y modelo, que un rojo no se relanza, la procedencia, el marcador generado, `subject_resume` y los topes.
14. **Esta feature cumple su propia regla.** Retira:
    - el tope duplicado de `UsingSdd.Tests.ps1`;
    - de `tech-stack.md`, las entradas que la subsección nueva sustituye: «Batería de puertas, en cada release», «Un gate que aparece después de una respuesta… a dos turnos» y «`lib.sh` lanza un solo turno»;
    - el duplicado «Techo de una campaña de entrevista simulada», que repite la entrada de la entrevista simulada.

    `tech-stack.md` no crece en neto. La constitution sí crece (~150 palabras): justificado porque son dos reglas nuevas que la fila pide ahí, sin texto equivalente que quitar.
15. **`architecture.md` entra en el Scope**, aunque la fila no lo nombra. Su tabla de documentos dice «sin cota» para los cuatro de anclaje, y desde aquí la cota es `WordBudget.Tests.ps1`. «Anatomía de la evidencia» gana `tests/batteries/<skill>/`. Si no se toca, el documento de estado miente.
16. **Previsión de la campaña** (Art. I): ~26 sujetos de la batería (~5 $, ~15 min; los visuales cuestan ~0,3 $ y los de enrutado ~0,15 $), 2 sujetos de dos turnos del experimento (~1,5 $) y un 20 % de reserva. **Techo: 34 sujetos y 8 $.** Los ensayos en seco (`DRY_RUN=1`) no cuentan.

### Decisiones tomadas con el dev-lead

- Feature entera, sin partir, perfil `delegate` — «Entera, delegate» (2026-10-01).
- Spec aprobada — «Apruebo» (2026-10-01).

## Intent

Hoy cada edición de una skill diseña su campaña a medida: la 0040 gastó 15,29 $ en ~30 min de texto. Las baterías que existen viven en la carpeta de la spec que las creó y ya no reproducen el estado de hoy: el molde de la 0074 lleva un marcador 1.2.0 que hoy dispararía el aviso de migración. El kit además solo crece, porque nada frena las palabras.

Esta feature deja tres cosas:

- Una unidad de prueba reutilizable por skill, empezando por `using-sdd`, para que la 0121 pueda adelgazar sin regresiones.
- Topes de palabras con test.
- Las dos reglas de la constitution que la propuesta 0119 pide: «una entra, otra sale» y el criterio de versión mayor.

## Scope

- Entra:
  - `tests/batteries/using-sdd/` (`battery.md`, `subject.sh`, molde);
  - `tests/headless/battery.sh`;
  - `subject_resume` y la versión del marcador en `tests/headless/lib.sh`, con sus casos en `tests/HeadlessLauncher.Tests.ps1`;
  - `tests/WordBudget.Tests.ps1` y el tope que sale de `tests/UsingSdd.Tests.ps1`;
  - la constitution (Art. I y Art. V);
  - `tech-stack.md` (subsección nueva y entradas que sustituye);
  - `architecture.md` (cota y anatomía);
  - una pasada real de la batería;
  - el experimento de dos turnos;
  - las filas de deuda que destapen las dos medidas.
- No entra:
  - editar cualquier `skills/**` (`spec-template.md` incluido);
  - baterías de otras skills (cada una llega con su pasada de adelgazamiento, 0121);
  - mover el «cómo» que hoy está en el Art. I (la propuesta lo deja para cuando el piloto lo confirme);
  - un molde sintético de sesión larga (salvo que el experimento de la decisión 7 lo justifique, y entonces sería un desvío);
  - CI fuera del pre-commit.

## Approach

Primero, las piezas que no cuestan sujetos:

- Los topes con su test, medidos sobre la base al día.
- Las reglas en la constitution.
- El lanzador `battery.sh` y `subject_resume`, probados en seco con Pester.

Después, la batería de `using-sdd`: molde propio con marcador generado, tabla con procedencia, y una pasada real con el kit de la rama, que queda como su baseline.

Luego, el experimento de dos turnos sobre la fila 2 de la 0125, que contesta la pregunta de la sesión larga.

Al final, `tech-stack.md` y `architecture.md`, escritos con lo que dieron las dos medidas. Lo que sustituyen sale en el mismo commit.

## Escenarios de verificación

Sin capacidad, así que sin delta que fusionar. Estos son los THEN que la validación en campo comprueba.

**Topes de palabras**
- GIVEN la base al día y los topes fijados al cerrar
- WHEN se ejecuta el conjunto rápido de Pester
- THEN `WordBudget.Tests.ps1` pasa
- AND una línea de 200 palabras añadida a `skills/using-sdd/SKILL.md` lo hace fallar con la medida, el tope y la salida («recorta, o sube el tope…»)
- AND una carpeta `skills/nueva/SKILL.md` sin tope lo hace fallar
- Se valida en: worktree con la base al día

**Molde con la versión del kit**
- GIVEN una copia del kit con `plugin.json` en 2.2.0 y `migrations/v2.3.0.md`
- WHEN `subject.sh` de la batería monta el molde en seco
- THEN el `sdd-kit.json` del molde dice `2.3.0`

**Tramo de una batería**
- GIVEN `tests/batteries/using-sdd/battery.md`
- WHEN se lanza `battery.sh` en seco con `STEPS=sdd-roadmap`
- THEN solo se lanzan los escenarios de esa fila, cada uno tantas veces como su n y con su modelo en `<etiqueta>.args`

**Veredicto de la batería**
- GIVEN la pasada real de la batería de `using-sdd` con el kit de la rama
- WHEN termina `battery.sh`
- THEN imprime una línea por escenario con pasan/n, umbral y verde o rojo, y sale con 0 solo si todo está verde
- AND cada rojo tiene su fila de deuda con la evidencia, sin edición de la skill

**Segundo turno real**
- GIVEN un sujeto en seco con `subject_launch` y después `subject_resume "<mensaje>"`
- WHEN se leen sus `.args` y su `.jsonl`
- THEN el segundo turno lleva `--resume <session_id del primero>` y los mismos argumentos de aislamiento, y el coste se cuenta por el último `result`

**Sesión larga contestada**
- GIVEN el experimento de dos turnos sobre la fila 2 de la 0125
- WHEN se cierra la feature
- THEN `tech-stack.md` dice si hace falta molde de sesión larga y por qué, con la evidencia del experimento

**Reglas en la constitution**
- GIVEN la constitution de la rama
- WHEN se lee el Art. V y el Art. I
- THEN el Art. V lleva el criterio de versión mayor con sus tres ejemplos, y el Art. I la regla «una entra, otra sale» con el presupuesto del kit

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-01 | aprobada: «Apruebo» |
