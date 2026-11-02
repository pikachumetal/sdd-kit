---
kit_version: 2.3.4
lane: patch
id: 20261102-135913-patch-0270-capability-merge-fixes
task: 0270
mode:
date: 2026-11-02
---

# Ticket para el kit — patch 0270: `sdd capability merge` compara los huecos con el vivo y rechaza lo que check rechazaría

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-propose`, `sdd-implement` (patch-flow), `sdd-debugging`, `sdd-tdd`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: 0,18 h frente a 0,5 h + 0,07 h estimadas, con este ticket incluido
- Coste en tokens: hilo 3.105.843; sesión 2,71 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La regla «un patch es lo que un test reproduce» no dice qué hacer con dos fallos de un mismo verbo

- **Qué pasó**: la petición traía dos fallos deterministas y la frase «Si esto no cabe en un patch, dilo al clasificar». Hacen falta dos tests que hoy fallan. La regla dice que con dos o más tests de comportamientos nuevos no es patch, y yo no sabía si un rechazo que falta es un fallo o un comportamiento nuevo. Decidí que es patch, porque no hay verbo nuevo ni texto que decidir: el mensaje sale del de `check`. Lo dije al clasificar.
- **Fuente**: `skills/sdd-propose/SKILL.md`, paso 2, carril patch, y fila 0270 del roadmap («Tamaño S»).
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md`, paso 2, y «Is it really a patch?».
- **Por qué el kit no lo evitó**: la regla habla de comportamientos nuevos, y sus ejemplos son peticiones cerradas con varios literales nuevos; `sdd-roadmap` cuenta lo mismo (feature 0264), y aquí escribió «Patch:» con dos fallos.
- **Coste**: ninguno observado: una decisión sin respaldo de un paso, un caso.
- **Propuesta**: si se repite, sustituir la frase por «dos o más tests de comportamientos nuevos; varios fallos deterministas con su causa en el mismo verbo siguen siendo patch», sin alargar el paso.
- **Verificada**: sí — contrastado con `skills/sdd-propose/SKILL.md`, paso 2
- **Criterio de aceptación**: GIVEN una petición con dos fallos deterministas del mismo verbo, sin literales que decidir WHEN `sdd-propose` clasifica THEN sigue en patch sin dudar del carril; y con tres comportamientos nuevos, propone lite.

## Lo que hice por iniciativa propia

- Probé el smoke con el requisito real que la 0129 no pudo fusionar, sobre una copia de `capabilities/`, y no solo con el fixture: confirmó el caso de origen.

## Funcionó, no tocar

- El orden del patch: §2 escrito tras ver los rojos y antes del fix. La expresión que el ticket señalaba quedó explicada con el emparejado real de comillas, sin tocarla.
- El delta de este patch se fusionó con el `merge` ya arreglado, y la copia detectó que no rompía `check`.

## Menores

- Un `cd` en un comando de Bash movió el directorio de PowerShell a `.docs/sdd`, y el siguiente comando falló y creó una carpeta vacía en `.docs/sdd/.temp`; borrada — el `CLAUDE.md` global ya pide rutas absolutas, regla que existía.
- `sdd-archive` paso 1 no dice qué poner en `Validación:` de un patch con `validation.mode: field`; copié la forma del patch 0288 — `skills/sdd-templates/templates/patch-template.md`.
