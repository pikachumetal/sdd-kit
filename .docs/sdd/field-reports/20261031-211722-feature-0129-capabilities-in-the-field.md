---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261031-211722-feature-0129-capabilities-in-the-field
task: 0129
mode: full
date: 2026-10-31
---

# Ticket para el kit — feature 0129: un `MODIFIED` no se puede fusionar con un requisito vivo que lleva huecos entre comillas anidadas, y un RED sin fallo no tiene salida con un THEN aprobado

## Contexto

- Carril y modo: feature full, perfil `delegate`
- Skills del kit usadas: `sdd-propose`, `sdd-start-feature`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: este repo, CLI en Node y skills
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus (ejes Spec y re-revisión), Sonnet (eje Código y sujetos)
- Coste en reloj: 0,63 h de esfuerzo frente a 2 h estimadas de implementación
- Coste en tokens: 11,85 $ de sesión y 0,77 $ en 6 sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un `MODIFIED` de un requisito vivo con huecos entre comillas anidadas no se puede fusionar

- **Qué pasó**: el `MODIFIED` de «La spec y el patch declaran sus capacidades al principio» copió el bloque entero, y `sdd capability merge` respondió `spec.md: «<nombre>» es un hueco de la plantilla: rellénalo o borra lo que no aplique`. El hueco está en el propio requisito vivo. Lo evité con un `ADDED` aparte, dejando sin tocar el requisito que debía cambiar.
- **Fuente**: `.docs/sdd/capabilities/capabilities.md`, líneas `\`<nombre>\`` de ese requisito; salida de `sdd capability merge` en la pasada de coherencia.
- **Dónde en el kit**: `cli/src/capabilities/merge.ts`, `removeInlineCode` y `entryProblem`.
- **Por qué el kit no lo evitó**: `removeInlineCode` no entiende comillas invertidas escapadas ni anidadas, y un vivo que la plantilla no generó nunca pasó por esa comprobación.
- **Coste**: dos iteraciones de la pasada de coherencia y un requisito vivo menos preciso; sin cifra.
- **Propuesta**: comprobar los huecos solo en las líneas del delta que no estén ya, literales, en el requisito vivo.
- **Verificada**: sí — reproducido con `sdd capability merge` en PowerShell en una copia de `.docs/sdd`.
- **Criterio de aceptación**: GIVEN un requisito vivo con una línea que lleva `<nombre>` entre comillas anidadas WHEN un `MODIFIED` copia esa línea tal cual y cambia otra THEN la fusión sustituye el requisito y sale con 0.

### 2. Un RED que no exhibe el fallo choca con un THEN ya aprobado

- **Qué pasó**: el sujeto de plantilla ya separaba los requisitos y no recortaba el `MODIFIED` sin la guía nueva, y el del paso 7 ya saltaba el documento marcado. El Art. I dice que sin fallo en el baseline no se escribe, y la spec aprobada tenía esos THEN. Decidí escribirlos con un ruling, con saldo de palabras igual o menor.
- **Fuente**: `.docs/sdd/constitution.md`, Art. I; carpeta de la spec, `red/marked/template/` y `green/plain/template/`, sin diferencia entre sí.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings»; `skills/sdd-propose/references/spec-writing.md`.
- **Por qué el kit no lo evitó**: la previsión de coste pone el RED después de aprobar la spec, y nada dice qué manda cuando el RED contradice un THEN aprobado.
- **Coste**: 34 palabras de guía sin evidencia de que cambien la conducta.
- **Propuesta**: que la regla diga si un RED sin fallo es un desvío que para o un ruling, sin alargar la skill.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un THEN aprobado cuya guía no exhibe fallo en el RED WHEN el hilo lo mide THEN sigue una regla escrita, y un segundo sujeto hace lo mismo.

### 3. El molde enseñó la respuesta al sujeto, y la evidencia se quedó sin versionar

- **Qué pasó**: el primer RED de migración, con un fichero vecino ya marcado, propuso la marca copiándola del vecino; hubo que repetirlo sin él. Además guardé a los sujetos en el scratchpad y solo los versioné cuando el eje Spec lo marcó Important; al copiarlos, una ruta larga puso en rojo `cli/test/kit/path-length.test.ts`.
- **Fuente**: carpeta de la spec, `red/marked/migration-result.txt` y `red/legacy/migration-result.txt`; `.docs/sdd/architecture.md:60`; salida de `moon run cli:test`, `ninguna ruta relativa llega a 140 caracteres`.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, método de campaña; `skills/sdd-templates/templates/plan-template.md`, Step de la task.
- **Por qué el kit no lo evitó**: la regla de versionar existía y no la apliqué, porque la plantilla del plan no lo pide en la task.
- **Coste**: un sujeto de 0,17 $ y un rojo de gate.
- **Propuesta**: en un molde, ningún fichero muestra ya la conducta que se mide; y la línea de la task con sujeto nombra su carpeta `red/` y `green/`.
- **Verificada**: sí — contrastado con los dos `migration-result.txt`.
- **Criterio de aceptación**: GIVEN un plan con una task con sujeto WHEN se escribe THEN la task nombra la ruta versionada de su evidencia.

## Lo que hice por iniciativa propia

- Medir antes de presentar la spec qué supondría el umbral de 500 por bloque y por línea (291 y 14 de 503), y llevar esa cifra a ✋. Funcionó: el dev-lead aprobó sabiendo el ruido.
- Hacer fallar una `Retiradas` sin motivo, porque ahí se borra un fichero, por enmienda en la revisión final.

## Funcionó, no tocar

- El `merge` a una copia en la pasada de coherencia cazó el hallazgo 1 antes del gate.
- El eje Spec vio que un test no ejercitaba su guarda; quitarla lo confirmó.

## Menores

- `npx vitest run` en `cli/` corre los `.slow` en paralelo y da rojos que solos pasan; el gate es la tarea de moon — `.docs/sdd/tech-stack.md` §Testing.
- `tar --force-local` no existe en el `tar` de Windows, y un sujeto se relanzó — no localizado.
