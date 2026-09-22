---
id: 20260921-162213-task-0014-auto-routing
task: 0014
title: Auto-enrutado del kit frente a superpowers
mode: full
status: approved
created: 2026-09-21
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-21
---

# Spec — Auto-enrutado del kit frente a superpowers

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor (lente técnica) — señales: capacidad nueva (`routing`), contrato público (el hook y su salida los consume Claude Code y conviven con el hook de superpowers; los campos nuevos de frontmatter los lee cualquier agente que instale por `npx`), área no explorada (cómo carga y ejecuta un plugin el `hooks/hooks.json` en Windows y en la extensión de VS Code)
- Dominio: no propongo lente; el comportamiento son tres rutas ya definidas por el kit (task, patch, consult).
- Técnica: si la salida del hook es la que Claude Code espera para `SessionStart` y si el predicado «existe `.docs/sdd/`» se evalúa sobre el directorio de trabajo correcto en un worktree (señal: contrato público + área no explorada); si los campos `argument-hint` y `user-invocable` rompen la instalación en otros agentes (señal: contrato público)
- Mínimo razonable: sin review — deja sin cubrir la portabilidad del hook en Windows y VS Code y el efecto de los campos de frontmatter fuera de Claude Code; ambas cosas se miden después en el smoke, pero no se leen antes.
```

1. **El RED se midió y respalda el hook.** 14 sujetos Sonnet con superpowers real y su hook `SessionStart` (3,82 $): seis peticiones cotidianas dieron 6/6 el kit primero; con casos duros, «Let's build X» dejó a `brainstorming` primero 1 de 3 veces, y «es un cambio pequeño, hazlo rápido» 2 de 3, y en ambos casos el sujeto **nunca llegó al kit** (contestó por el carril «bounded» de `brainstorming`: diseño en el chat, sin spec). Es el fallo de GH #1. Evidencia versionada en `red/`.
2. **Mecanismo elegido por ti en la conversación: hook corto más `description`, sin skill nueva.** Un hook `SessionStart` del kit que solo emite si existe `.docs/sdd/` (coste cero fuera de proyectos SDD) y frases naturales en las `description` de `sdd-start-task`, `sdd-start-patch` y `sdd-consult` (la única capa que llega por `npx skills add`). Los hooks de plugins distintos corren en paralelo y sus contextos se fusionan, así que **no se puede ganar por orden**: se gana por contenido, con el router redactado como instrucción del proyecto, que es lo que `using-superpowers` dice que prevalece sobre sus skills.
3. **Si el GREEN no basta, se escala a la skill `using-sdd` dentro de esta misma task**, sin volver a pedir aprobación de la spec (decisión tuya): el mismo hook inyecta su contenido, igual que superpowers hace con `using-superpowers`. Tiene su propio RED/GREEN (Art. I) y sube el catálogo a 13 skills.
4. **Criterio del GREEN, fijado antes de medir.** Con las mismas peticiones del RED: `h1` y `h4` ×3 cada uno con **6/6** el kit primero (RED: 3/6), y las seis peticiones cotidianas y los controles **sin regresión** (6/6 y controles como abajo). Si algo falla, no se da por bueno: se escala a la decisión 3.
5. **Un control de sobre-disparo.** El router no puede convertir todo en task: «corrige el typo del README» y «renombra la variable `x` a `y`» siguen yendo **directos**, sin skill del kit ni de superpowers. Es la salida «cambio de una frase» que el propio B5 pedía conservar. Son escenarios del GREEN, con RED medido (conducta actual) antes de tocar nada.
6. **Se cambia la exclusión de la `description` de `sdd-start-task`**: hoy dice «no usar… para cambios describibles en una frase», y eso empuja a un «añade un campo» hacia superpowers, cuando el modo lite es un modo de esta misma skill y se ofrece ahí. Pasa a excluir solo la **edición sin comportamiento** (typo, renombrado, formato). Riesgo: sobre-disparo, cubierto por la decisión 5.
7. **Repaso de frontmatter, lo que verifiqué en la doc de skills de Claude Code.** Entran `argument-hint` en `sdd-start-task`, `sdd-start-patch` y `sdd-consult` (el `/skill <ticket>` ya es su uso real) y `user-invocable: false` en `sdd-templates` (Claude sigue pudiendo invocarla; solo sale del menú `/`). **No entran**: `paths` (oculta la `description` hasta tocar un fichero, y las skills de arranque se usan antes) ni `disable-model-invocation` en `sdd-end-release` (su `description` dispara a propósito con «el changelog acumula tasks»). **Riesgo que asumo y que tú validas**: la doc dice que claude.ai y la API rechazan claves fuera de `allowed-tools`, `compatibility`, `description`, `license`, `metadata` y `name`. El kit no se sube a la API, se instala en disco, pero **no está verificado** en los otros agentes que soporta `npx skills add`.
8. **Capacidad nueva `routing`** en `capabilities/`, slug en inglés kebab-case. Podía ir en `task-flow`, pero el enrutado abarca también patch y consult, que no son ciclo de una task.
9. **Sin migración.** Nada cambia en `.docs/sdd/` del proyecto consumidor: el hook viaja con el plugin. El bump de versión y la entrada del changelog son del cierre de la 1.2.0, no de esta task.
10. **Art. IX, hueco demostrado.** `using-superpowers` ordena `brainstorming` antes que cualquier skill y su hook lo inyecta en cada sesión; el paso 4 de `sdd-start-task` invoca `brainstorming`, pero en 4 de 8 casos duros `brainstorming` entró antes y en 2 el kit no llegó a arrancar. Extender aquí es la regla 3 del Art. IX, con la medida como justificación.

## Intent

Hoy el kit compite con superpowers **desde abajo**: sus `description` son una línea de catálogo y superpowers inyecta en cada sesión un bloque imperativo que manda `brainstorming` primero. Un usuario con superpowers instalado pide «añade X» o «es un cambio pequeño» y acaba en el flujo de superpowers, sin carril, sin spec ni walkthrough. GH #1 lo reportó como «me da la sensación de que está usando skills de este en vez de las del kit»; el RED lo reprodujo en 3 de 6 casos con las frases que lo disparan. Se quiere que una petición de trabajo entre por el kit, que `brainstorming` corra **dentro** de `sdd-start-task` y no en su lugar, y que un cambio trivial no cargue con ceremonia.

## Scope

- Entra: hook `SessionStart` del plugin, condicionado a `.docs/sdd/`, con un router corto; frases naturales en las `description` de `sdd-start-task`, `sdd-start-patch` y `sdd-consult`; repaso del frontmatter de las skills según la decisión 7; la nota del README sobre el hook y el límite del canal `npx`; capacidad `routing`; evidencia RED/GREEN en `tests/`.
- Entra (condicional): la skill `using-sdd` inyectada por el mismo hook, solo si el GREEN no cumple la decisión 4.
- No entra: perfiles de control y gates (task 0008), paralelismo y encargos (0005), un hook para el canal `npx` (no lleva hooks), cambiar o desactivar superpowers, ganar por orden de ejecución entre hooks (no existe orden), `paths` y `disable-model-invocation`.

## Approach

Un router de unas 100–150 palabras, redactado como instrucción de este proyecto y no como otra skill: una petición de trabajo va a `sdd-kit:sdd-start-task` antes que a `brainstorming` (que esa skill ya invoca en su paso 4), un bug pequeño y determinista a `sdd-start-patch`, una pregunta o un «¿se puede…?» a `sdd-consult`, y una edición trivial se hace directa. El hook emite solo si existe `.docs/sdd/`; sin él no escribe nada. Las frases naturales de la `description` refuerzan la misma decisión para quien instala por `npx`. Se mide con los mismos sujetos del RED; el criterio de éxito está fijado en la decisión 4 y, si no se cumple, se escala a `using-sdd` (decisión 3) en lugar de afinar el texto a ciegas.

## Delta de comportamiento

### Capacidad: `routing`

**ADDED — Una petición de trabajo entra por el kit, no por brainstorming**
- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pide una feature o un cambio con comportamiento sin nombrar ninguna skill («añade…», «hazme…», «let's build…», «es un cambio pequeño, hazlo rápido»)
- THEN la primera skill que se invoca es `sdd-kit:sdd-start-task`
- AND `superpowers:brainstorming` se invoca después, desde el paso 4 de `sdd-start-task`, nunca antes

**ADDED — Un bug pequeño y determinista entra por el carril patch**
- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario reporta un bug acotado y pide arreglarlo
- THEN la primera skill que se invoca es `sdd-kit:sdd-start-patch`

**ADDED — Una pregunta entra por consult**
- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pregunta cómo funciona algo, o si algo es posible
- THEN la primera skill que se invoca es `sdd-kit:sdd-consult`

**ADDED — Una edición trivial no lleva ceremonia**
- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pide una edición sin comportamiento (un typo, un renombrado, un formato)
- THEN no se invoca ninguna skill del kit ni `superpowers:brainstorming`, y el cambio se hace directo

**ADDED — El router solo existe donde hay SDD**
- GIVEN una sesión que arranca con el plugin instalado
- WHEN el directorio de trabajo no contiene `.docs/sdd/`
- THEN el hook no inyecta ningún contexto
- AND cuando sí lo contiene, inyecta el router, que nombra `sdd-start-task`, `sdd-start-patch` y `sdd-consult`

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-21 | aprobada, sin review («Aprobada, sin review»; condición dicha por el dev-lead: «mientras no perdamos información», garantizada así: evidencia del RED versionada en `red/`, reformular sin borrar la exclusión de la `description`, filas 0014 y B5 del roadmap conservan su detalle, todo lo descartado queda en la spec con su motivo) |
