---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261031-161045-patch-0265-battery-no-evidence-verdict
task: 0265
mode:
date: 2026-10-31
---

# Ticket para el kit — patch 0265: el veredicto de `battery.mjs` distingue «sin evidencia» de rojo

## Contexto

- Carril y modo: patch, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-start-patch`, `sdd-archive`, `sdd-feedback`
- Proyecto: el propio kit, una persona
- Modelo del hilo: Opus 5.5
- Coste en reloj: 0,10 h medidas antes del cierre, frente a 0,51 h estimadas
- Coste en tokens: 2,52 $ de sesión medidos antes del cierre; sin sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El origen del nombre de git en `tools.txt` sigue sin localizarse, y el mensaje nuevo no lo localiza

- **Qué pasó**: el mecanismo se reprodujo: `extract.mjs tools` sale con 3 y `texts` con 0. Los streams de la 0224 ya no existen, y la copia del kit no lleva el nombre. El mensaje nuevo dice que la salida lleva la identidad, pero no qué llamada la trajo.
- **Fuente**: `patch.md` de la 0265, §2; `tests/headless/extract.mjs`, `write`; salidas `green2/co2-1`, `red/co3-1`, `red/co4-1` y `final/co4-1` de la 0224
- **Dónde en el kit**: `tests/headless/extract.mjs`, `write`
- **Por qué el kit no lo evitó**: la salida con código 3 no nombra la línea, y el molde se borra al acabar
- **Coste**: sin coste en esta sesión; cada caso nuevo deja un sujeto «sin evidencia» que hay que relanzar
- **Propuesta**: si se repite, que `extract.mjs` diga qué llamada o resultado casó, sin imprimir el valor
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un stream con el nombre de git en el resultado de la llamada 7 WHEN corre `extract.mjs tools` THEN sale con 3 y el mensaje nombra esa llamada sin escribir el nombre

### 2. La regla de un test por patch choca con una fila cerrada que pide dos

- **Qué pasó**: el paso 2 dice que dos o más tests de comportamientos nuevos no son un patch, y manda ofrecer lite. La petición decía «carril patch» y nombraba dos tests en su «hecho cuando». Lo mantuve como patch, sin preguntar, porque son síntomas de un mismo veredicto y la solución estaba fijada; ningún paso cubre ese caso.
- **Fuente**: `skills/sdd-propose/SKILL.md` paso 2; fila 0265 de `.docs/sdd/roadmap.md`
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 2, carril patch, y `skills/sdd-roadmap`, donde nace la fila
- **Por qué el kit no lo evitó**: la regla cuenta comportamientos nuevos, y no dice qué pasa al corregir varios síntomas de uno existente
- **Coste**: una decisión de carril sin respaldo; sin parada
- **Propuesta**: que la regla cuente fallos con causa distinta, sustituyendo a «behaviors» en la misma frase, sin alargarla
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una petición «patch» con dos tests sobre el mismo veredicto WHEN `sdd-propose` clasifica THEN sigue como patch sin preguntar; con dos comportamientos nuevos, ofrece lite

## Lo que hice por iniciativa propia

- La forma `` `tools: /A/ antes de /B/` ``: la de la 0260 mira llamada a llamada y no expresa un orden.
- «Sin evidencia» también para un sujeto con `tools.txt` y sin RESULTADO, y salida 3 cuando solo falta evidencia.
- Medí el RED y el resultado con las salidas de la 0224, a coste cero, en vez de lanzar sujetos.
- No invoqué `sdd-debugging`: la causa ya estaba reproducida con un stream mínimo.

## Funcionó, no tocar

- `battery.mjs verdict` sobre salidas ya versionadas da una comprobación real sin gastar en sujetos.
- La regla 7 de `CLAUDE.md`, con el CI de la rama antes de `sdd merge`, no alargó el cierre: el run salió `success` y el merge fue a la primera.

## Menores

- Un script de edición no casó porque los ficheros usan CRLF, y lo había borrado antes de ver su fallo: `tech-stack.md` ya avisa de los finales de línea, la regla existía y no la apliqué — `.docs/sdd/tech-stack.md`.
- Una tanda parcial marca «sin evidencia» a los escenarios que no se lanzaron: se evita filtrando por paso — `tests/headless/battery.mjs`.
