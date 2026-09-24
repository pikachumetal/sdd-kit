---
id: 20260924-225741-task-0058-session-model-policy
task: 0058
parent: 0055
title: Modelo y effort de la sesión que ejecuta en Native
mode: full
status: approved
created: 2026-09-25
author: Àngel Delgado (con Claude)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-25
---

# Spec — Modelo y effort de la sesión que ejecuta en Native

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: ninguna (sin capacidad nueva, sin contrato público: la etiqueta «Modelo del hilo» que lee el log no cambia, solo ADDED, dos capacidades, todo lo tocado leído en esta sesión)
- Mínimo razonable: ninguna — deja sin cubrir si las opciones nuevas de los dos gates se leen igual en `pair` que en `delegate`; lo mide el GREEN
```

1. **El kit no elige el modelo de la sesión: lo recomienda donde el usuario puede cambiarlo.** La sesión no puede cambiar su propio modelo; solo el usuario, con `/model`. Y un gate con `AskUserQuestion` (la regla del dev-lead para preguntas cerradas) sigue en el mismo turno tras la respuesta, así que decir «cambia de modelo» en el texto del gate no deja hueco para hacerlo. Por eso la pieza es una **opción más en la última parada antes de ejecutar**, que aprueba y además para justo antes de la primera task para que el usuario cambie de modelo. Es una parada que elige el usuario, no una parada nueva del perfil.
2. **Dónde va la opción**: en `pair`, en el gate del plan, cuando el método recomendado o fijado es Native: «Apruebo, con Native, y paras antes de la Task 1 para que baje la sesión a gama media». En `delegate`, en el gate de la spec (el plan aún no existe): «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media». Así el plan lo escribe el modelo que escribió la spec, que es lo que dice superpowers («the plan carries the design»), y la ejecución corre en gama media. En los dos perfiles solo se ofrece si la sesión va con el modelo más capaz, y la opción no es la recomendada: el motivo va en su descripción y decide el usuario.
3. **Qué recomienda el kit**: ejecución Native con gama media, **Sonnet con effort medium**, citando a `executing-plans` («runs well on a mid-tier session model»); el modelo más capaz, para la spec, el plan y la revisión final, que ya va con Opus y effort high (task 0057). **Bajar solo el effort de Opus no es gama media**: piensa menos, pero cada token cuesta lo que un token de Opus, y en una sesión larga pesa sobre todo la relectura del contexto, que no depende del effort. Esto último es razonamiento, no medida: por eso el punto 5.
4. **El plan registra la recomendación**: con Native, la línea `Ejecución` de `plan-template.md` añade una frase literal, igual que la del cambio de método tras compactar: «La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.» En `unattended`, sin paradas, esa frase es lo único que hay, y es suficiente: el modelo lo eligió quien lanzó la sesión.
5. **Qué se mide para no inventarse la cifra**: el walkthrough ya tiene «Modelo del hilo» y «Tokens del hilo». La línea del modelo pasa a pedir **modelo y effort, y los dos de cada fase si cambiaron** («Opus 5.5, effort medium (spec y plan) → Sonnet 5, effort medium (ejecución)»), sin cambiar la etiqueta, que es lo que lee `Build-EstimationLog.ps1`. En el historial, 0 de 20 walkthroughs registran el effort y 1 de 20 registra un cambio de modelo a mitad de task, pero no vale como RED: esos agentes no tenían el effort delante. El RED es un sujeto de cierre al que el dev-lead le da las dos fases (punto 8). La comparación de configuraciones la hará el A/B de la versión siguiente con esos registros; esta task no da ninguna cifra de ahorro.
6. **Cambiar de modelo a mitad de sesión tiene un coste de una vez**: la caché de prompt es por modelo, así que la primera petición tras `/model` relee el contexto sin caché. No lo mido: la descripción de la opción lo dice en una frase y el registro del punto 5 lo deja ver.
7. **Art. IV**: una frase en el párrafo de la política de modelos. No es un cambio mayor de convención: los proyectos no quedan obligados a nada, el kit recomienda y registra. Por eso no reviso las 9 skills.
8. **Campaña del Art. I**, dentro de la previsión y el techo comunes de la 0055, 0057 y 0058 (techo 65 $; gastados 20,25 $ en 47 sujetos al abrir esta task). **Esta task: 10 sujetos, ~15 $ y ~1,5 h**, más una tanda de REFACTOR de 2 como máximo: `SUBJECT_CAP=12`, `COST_CAP=65` común y el fichero `stop`. RED: el gate de la spec en `delegate` (`d4`) y el gate del plan en `pair` (`p5`, que además escribe el plan), ×2 cada uno, con **sesión Opus**: con Sonnet, que ya es gama media, el sujeto no tiene nada que recomendar, y por eso los 8 streams de gate de la 0055, todos en Sonnet, no valen como RED (0 de 8 lo mencionan). Y el cierre (`c1`, Sonnet) ×1, con la petición de cierre diciendo el modelo y el effort de cada fase. GREEN: los mismos. Las AND de «si el usuario la elige…» no llevan sujeto: esa conducta la dicta el texto de la opción que el usuario elige, y la prueba la validación final. Si el RED de un escenario sale limpio, se mira de dónde sacó el sujeto la conducta (en `pair`, el handoff de `writing-plans` trae «Runs well with a mid-tier session model») antes de recortar, y lo recortado se repite en el GREEN como control.
9. **Ficheros**: `constitution.md` (Art. IV), `skills/sdd-start-task/SKILL.md` (gates de los pasos 4 y 5), `plan-template.md` y `walkthrough-template.md`. No toco `control-profiles.md` (0061), `sdd-end-release` (0063) ni `sdd-end-patch`, `patch-template.md` y `capabilities/` (0067): el delta va en esta spec y se funde en `capabilities/` en el cierre, tras integrar lo que haya en `develop`.
10. **Repaso de coherencia**: los literales de las dos opciones, de la frase del plan y del ejemplo del walkthrough coinciden entre decisiones y THEN. Corregí el RED del walkthrough: el historial no vale sin el effort delante, y pasa a un sujeto (puntos 5 y 8, 10 sujetos en vez de 9).

### Decisiones tomadas con el dev-lead

- El A/B de Native frente a SDD sale de la task y pasa a la versión siguiente; queda la política de modelo y effort de la sesión en Native — «RECORTADA el 2026-09-24: el A/B de Native frente a SDD pasa a la versión siguiente, porque el uso real ya dio la comparación», enunciado de la task.
- Spec aprobada por delegación, sin gate — opción elegida en la primera pregunta, 2026-09-25: «Full, apruebo por delegación» («Apruebo la spec por delegación, nos vemos en la validación»).
- Art. I proporcional, previsión y techo comunes con `SUBJECT_CAP` y el fichero `stop`, un commit por hito, avisos de fase en llano — enunciado de la task, 2026-09-25.

## Intent

En Native la sesión implementa todas las tasks, y su modelo y su effort no los declara nadie: el Art. IV fija la política de los subagentes, no la de la sesión. El dev-lead trabaja con Opus y effort medium y baja el effort tras la spec, pero Opus con effort bajado sigue costando como Opus, y superpowers dice que Native va bien con un modelo de gama media. En una suscripción compartida eso lo pagan también los compañeros. Se quiere que el usuario sepa, en el momento en que puede actuar, qué modelo recomienda el kit para ejecutar; que el plan lo diga; y que el walkthrough registre qué modelo y qué effort corrieron en cada fase, para medir el ahorro en vez de suponerlo.

## Scope

- Entra:
  - la opción de parar antes de la Task 1 para bajar la sesión a gama media, en el gate del plan en `pair` y en el gate de la spec en `delegate`;
  - la frase de la recomendación en la línea `Ejecución` de `plan-template.md`, con Native;
  - «Modelo del hilo» del walkthrough con modelo y effort por fase;
  - una frase en el Art. IV.
- No entra:
  - el A/B de Native frente a SDD, y cualquier cifra de ahorro: versión siguiente;
  - el modelo de la sesión con `subagent-driven-development`, donde la sesión orquesta: lo mide el A/B;
  - la aprobación de la spec por delegación desde la primera pregunta: quien la elige se va y no quiere más paradas; queda la frase del plan;
  - medir los tokens del hilo por modelo: «Tokens del hilo» sigue como está.

## Approach

Una recomendación que el kit no puede ejecutar solo sirve si llega donde el usuario puede actuar. La última parada antes de ejecutar ofrece una opción que aprueba y pide parar antes de la Task 1; al elegirla, el agente escribe el plan si falta, junta la apertura en su commit y termina el turno con el cambio que recomienda (`/model`, Sonnet con effort medium) y «di "sigue" cuando esté». La recomendación se apoya en la frase de superpowers, citada, no copiada (Art. IX). El plan lleva la frase literal, y el walkthrough, lo que corrió de verdad.

## Delta de comportamiento

### Capacidad: `task-flow`

**ADDED — El gate del plan en `pair` ofrece parar para bajar la sesión a gama media**
- GIVEN una task en `pair`, una sesión con Opus 5.5 y un plan con `Ejecución: native, porque…`
- WHEN el agente presenta el gate del plan
- THEN entre las opciones está «Apruebo, con Native, y paras antes de la Task 1 para que baje la sesión a gama media», que no es la recomendada, con su motivo: Native va bien en gama media (Sonnet, effort medium) y bajar solo el effort de Opus no es gama media
- AND si el usuario la elige, el agente junta la apertura en su commit y termina el turno antes de la Task 1 diciendo el cambio (`/model`, Sonnet con effort medium)

**ADDED — El gate de la spec en `delegate` ofrece parar tras el plan para bajar la sesión a gama media**
- GIVEN una task en `delegate`, una sesión con Opus 5.5 y la spec lista para el gate
- WHEN el agente presenta la spec
- THEN entre las opciones está «Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que baje la sesión a gama media», que no es la recomendada, con el mismo motivo
- AND si el usuario aprueba sin esa opción, el agente sigue sin parar hasta la validación, como hoy

**ADDED — Con Native, el plan registra el modelo recomendado para la sesión**
- GIVEN un plan cuyo método es Native
- WHEN el agente escribe su línea `Ejecución`
- THEN la línea lleva, literal, «La sesión que ejecuta va bien en gama media (Sonnet, effort medium); el modelo más capaz se reserva para la revisión final.»

### Capacidad: `estimation`

**ADDED — El walkthrough registra el modelo y el effort del hilo en cada fase**
- GIVEN una task cuya spec y plan corrieron con Opus 5.5 y effort medium, y cuya ejecución corrió con Sonnet 5 y effort medium tras un `/model`
- WHEN el agente rellena «Modelo del hilo» del walkthrough
- THEN escribe los dos, con su fase: «Opus 5.5, effort medium (spec y plan) → Sonnet 5, effort medium (ejecución)»
- AND si no sabe el effort de una fase, escribe «effort no registrado» en esa fase, no un valor supuesto

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-25 | aprobada por delegación: «Full, apruebo por delegación» («Apruebo la spec por delegación, nos vemos en la validación») |
