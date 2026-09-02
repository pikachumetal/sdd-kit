---
id: 20260902-160308-task-0000-dependencias-declaradas
task: 0000
title: Declaración de dependencias del kit hacia sus consumidores
mode: full
status: approved
created: 2026-09-02
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-02
---

# Spec — Declaración de dependencias del kit

## 1. Contexto

- **Problema u oportunidad**: el kit depende de skills externas y no lo declara de forma utilizable. Estado confirmado en el repo:
  - `.claude-plugin/plugin.json` no tiene campo `dependencies`.
  - `.docs/sdd/tech-stack.md` lo declara en prosa: superpowers con 6 skills invocadas. No menciona `grilling`.
  - `README.md:49` lo declara **distinto**: superpowers con 4 skills (faltan `writing-plans` y `writing-skills`). No menciona `grilling` ni cómo instalar nada.
  - Dos declaraciones incompletas y divergentes es el mismo problema que el Art. VIII resuelve para las plantillas.
  - `grilling` no llega por el mismo canal: es una skill instalada con `npx skills add` (vive en `~/.agents/skills/`, symlinkeada a `~/.claude/skills/`), no un plugin. El patch `20260902-153722` corrigió su invocación, pero un consumidor que no la tenga instalada sigue encontrando una rama muerta.
  - `README.md:5` declara "Estado: **v0.3.0 publicada**". Va dos releases por detrás (v0.4.0 es la vigente) y ninguna está realmente publicada: sin remoto, no se distribuye.
- **Stakeholders**: los devs del equipo que instalan el kit en sus proyectos; el dev-lead, que lo mantiene.
- **Restricciones conocidas**: sin remoto configurado (decisión del usuario, 2026-09-02), así que nada de `claude plugin tag`. El Art. I aplica a la parte de guidance.

## 2. Objetivo

- **Qué construimos (one-liner)**: que el kit declare sus dependencias donde sirvan —resolución automática para el plugin, prerrequisito legible para la skill suelta— y que la rama que depende de `grilling` deje de morir cuando no está instalada.
- **Definición de éxito**:
  1. `plugin.json` declara `superpowers` y `marketplace.json` autoriza la dependencia cross-marketplace; verificable leyendo ambos manifests.
  2. Existe **una sola** declaración humana completa (README), y `tech-stack.md` apunta a ella en vez de repetirla; ninguna lista de skills invocadas queda divergente.
  3. `sdd-consult` y `sdd-init-greenfield` funcionan sin `grilling` instalada: predicado observable con alternativa, demostrado con ciclo RED→GREEN en `tests/`.
  4. `README.md:5` refleja el estado real: v0.4.0 cerrada, sin distribuir.
- **NO objetivos**: degradar `superpowers` (es el motor del flujo: degradarlo es reimplementarlo); las referencias a "crea un todo por paso" de las 8 skills; tags de release; configurar remoto.

## 3. Decisión clave

**Opción elegida — declaración en dos planos, con degradación solo para la dependencia opcional.**

Las dos dependencias no son iguales y no se tratan igual:

- `superpowers` es **dura**: el kit invoca 6 de sus skills y son el motor del flujo. Se declara en el manifest para que Claude Code la resuelva sola. Consecuencia aceptada explícitamente por el usuario (2026-09-02): si no se resuelve, Claude Code **deshabilita el kit entero** con `dependency-unsatisfied` y el comando de instalación en el error. Se prefiere el fallo ruidoso y accionable a un flujo que se ejecuta a medias sin que nadie lo note.
- `grilling` es **opcional**: una rama de una skill. No es un plugin, así que no cabe en `dependencies` en ningún caso. Se declara como prerrequisito humano y la skill degrada por predicado observable.

Hechos verificados en la documentación oficial que fijan la forma (`code.claude.com/docs/en/plugin-dependencies`):

- `dependencies` es un **array** de strings u objetos `{name, version, marketplace}`. La forma tipo npm que asumía el roadmap (`superpowers ^6.3.0`) no es la del schema.
- `name` resuelve **dentro del marketplace del plugin que declara**. El nuestro es `sdd-kit`; superpowers está en `claude-plugins-official` (confirmado: `installed_plugins.json` registra `superpowers@claude-plugins-official`). Es cross-marketplace, y eso está **bloqueado por defecto**: exige `allowCrossMarketplaceDependenciesOn` en nuestro `marketplace.json`.
- **Se declara sin restricción de versión.** Las restricciones se resuelven contra tags git `superpowers--v{version}` del repo de la dependencia; si ninguno satisface el rango, el install falla con `no-matching-tag` y deshabilita nuestro plugin. Poner `^6.3.0` añade un modo de fallo sin comprar nada, porque no controlamos el tagging de un repo ajeno.

**Alternativas descartadas**:

- *Solo declaración humana* — no aprovecha que el campo existe y deja la instalación de la dependencia a que alguien lea el README.
- *Degradar también superpowers* — equivale a reimplementar `brainstorming`, `writing-plans` y compañía dentro del kit. Descartado por el usuario.
- *Eliminar la dependencia de `grilling` inlineando su conducta* — resuelve el problema de raíz pero pierde la skill real cuando sí está instalada. Descartado por el usuario a favor de la degradación.

## 4. Especificación funcional

**Como** dev del equipo que instala el kit en un proyecto, **quiero** que las dependencias estén declaradas, **para** no descubrir por un error opaco que me falta algo.

Comportamiento esperado:

1. **Manifest** — al instalar `sdd-kit`, Claude Code resuelve e instala `superpowers` automáticamente. Si no puede, falla nombrando la dependencia y el comando de instalación.
2. **README** — declaración canónica única: las 6 skills de superpowers que el kit invoca (`brainstorming`, `writing-plans`, `executing-plans`, `systematic-debugging`, `writing-skills`, `finishing-a-development-branch`), `grilling` marcada como opcional con su canal real (`npx skills add`), y el comando de instalación de cada una.
3. **tech-stack** — deja de repetir la lista y apunta al README. Una sola fuente.
4. **Degradación** — en `sdd-consult` (paso 2, modo pensar/estructurar) y en `sdd-init-greenfield:12`: si `grilling` está disponible, se invoca; si no, la skill hace el interrogatorio ella misma —una pregunta cada vez, con recomendación, sin artefactos— y **dice que lo está haciendo así**. Nunca se salta el interrogatorio por no tener la skill.

Edge cases:

- `grilling` instalada pero el usuario prefiere no usarla → sin cambios: `sdd-init-greenfield` ya lo contempla ("o `grilling` si el usuario lo prefiere").
- Consumidor que instala por `npx skills add` en vez de por plugin → el manifest no interviene; le sirve la declaración del README. Es justo por lo que la declaración humana no puede desaparecer.

## 5. Datos

No aplica: el kit es Markdown y manifests JSON, sin schema de datos ni migraciones.

## 6. UX

No aplica (sin interfaz). La superficie visible al consumidor es el README y los mensajes de error de Claude Code, cubiertos en la sección 4.

## 7. Constraints técnicos

### 7.1 Compatibilidad con la constitution

- [x] **Art. I — Ley de hierro de skills**: la degradación de `grilling` edita `sdd-consult` y `sdd-init-greenfield` con guidance nueva → exige RED→GREEN documentado en `tests/`. Las secciones de manifest y README no editan guidance: no lo arrastran.
- [x] **Art. III — Idioma**: castellano con ortografía correcta; nombres en inglés kebab-case.
- [x] **Art. IV — Convenciones a los proyectos**: no se cambia ninguna. La declaración de dependencias es del kit hacia su entorno, no una convención impuesta a los proyectos consumidores.
- [x] **Art. V — Versionado**: sin bump aquí; el corte de versión es acción de `sdd-end-release`. La entrada de changelog va en `[Unreleased]`.
- [x] **Art. VI — Commits**: tipo/scope en inglés, cuerpo en castellano.
- [x] **Art. VII — Dogfooding**: esta task es el dogfooding.
- [x] **Art. VIII — Fuente única**: aplicado por analogía a la declaración de dependencias — README canónico, `tech-stack` apunta.

### 7.2 Dependencias

- Patch `20260902-153722-patch-0000-grilling-reference` (ya cerrado): dejó la invocación de `grilling` correcta. Esta task construye encima.
- Documentación de Claude Code sobre `dependencies` (verificada 2026-09-02).

### 7.3 Excepciones a la constitution

Ninguna.

## 8. Riesgos

| Riesgo | Probabilidad | Impacto | Mitigación |
| --- | --- | --- | --- |
| El kit queda deshabilitado en un entorno donde superpowers no resuelve | Media | Alto | Aceptado conscientemente por el usuario (fallo ruidoso > silencioso). Sin restricción de versión, que es el modo de fallo más probable. El error trae el comando de instalación. |
| `allowCrossMarketplaceDependenciesOn` mal escrito deja el install roto | Baja | Alto | Verificación en el smoke: leer ambos manifests y comprobar que el nombre del marketplace es exactamente `claude-plugins-official`. |
| El RED de la degradación no exhibe el fallo | Media | Bajo | Es evidencia válida de que la guidance sobra (Art. I): recortaría esa parte del alcance, no es un contratiempo. |
| El nombre del marketplace difiere entre entornos del equipo | Baja | Medio | Verificado en este entorno vía `installed_plugins.json`. Si otro dev lo tiene bajo otro nombre, el README documenta la instalación manual como salida. |

## 9. Rollout

Directo. Sin remoto no hay distribución: los cambios quedan en `master` y entran en la próxima release cuando `sdd-end-release` selle `[Unreleased]` como v0.5.0.

## 10. Open questions

Ninguna. Las cuatro decisiones abiertas se cerraron con el usuario el 2026-09-02: degradación por predicado (ni inlinear ni eliminar), alcance solo `grilling`, declaración humana + manifest, y aceptación del fallo ruidoso.

## 11. Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-02 | aprobada |
