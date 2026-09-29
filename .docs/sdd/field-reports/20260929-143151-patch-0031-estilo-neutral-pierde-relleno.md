---
kit_version: 2.1.0
superpowers_version: 6.4.2
lane: patch
id: 20260929-143151-patch-0031-estilo-neutral-pierde-relleno
task: 0031
mode:
date: 2026-09-29
---

# Ticket para el kit — patch 0031: fallo de formato en un fichero generado, reproducido sin navegador

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-templates`, `sdd-end-patch`, `sdd-feedback`; de superpowers, `systematic-debugging`
- Proyecto: aplicación web interna, backend .NET y frontend SPA, con un editor de documentos
  ofimáticos embebido; `ids.mode: sequence`, perfil `delegate`, `merge.push: true`; equipo pequeño
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica
- Coste en reloj: unos 45 min en total, de ellos unos 30 de investigación y fix
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La validación llega antes de que el cierre la pida

- **Qué pasó**: el cierre del arranque terminó pidiendo al usuario que probara el fix en el editor
  real. El usuario contestó «testeado ya no pasa», y con esa frase se invocó `sdd-end-patch`. El paso 0
  manda preguntar con `AskUserQuestion`, sola en su turno, con tres opciones. La pregunta no se hizo:
  la frase se tomó como validación.
- **Dónde en el kit**: `skills/sdd-end-patch/SKILL.md` paso 0.
- **Por qué el kit no lo evitó**: el paso 0 dice qué no es validación («cierra el patch», «los tests
  pasan») y qué hacer con un «sí» a la pregunta, pero no qué hacer si el usuario ya ha dicho, sin que
  se le pregunte, que lo ha probado y funciona.
- **Coste**: ninguno esta vez. Queda sin regla un caso ambiguo: otro ejecutor puede volver a
  preguntar (un turno de más) o aceptar una frase más débil.
- **Propuesta**: una línea en el paso 0: una frase espontánea del usuario, dicha después de ver el
  guion, que afirma que probó el fix y funciona, vale como «Validado» sin repetir la pregunta. Se
  apunta literal, con `· no detalló qué probó` si no lo dice.
- **Criterio de aceptación**: GIVEN un patch con el guion de pruebas ya enseñado, WHEN el usuario
  escribe «probado, ya no pasa» y pide cerrar, THEN el cierre apunta `Validado: <fecha> · «probado,
  ya no pasa» · no detalló qué probó` y no hace la pregunta de tres opciones.

### 2. El push se decide sin mirar si la rama destino tiene remoto

- **Qué pasó**: con `merge.push: true` y `delegate`, se lanzó `Invoke-SddMerge.ps1 -Push`. El script
  falló con `push: no hay remoto configurado para 'develop'.`, y hubo que relanzarlo sin `-Push`. La
  receta ya dice que sin remoto no se pasa `-Push`, pero el ejecutor no lo comprobó.
- **Dónde en el kit**: `skills/sdd-end-feature/references/merge-recipe.md` §Push, y
  `skills/sdd-templates/scripts/Invoke-SddMerge.ps1`.
- **Por qué el kit no lo evitó**: la regla depende de que el ejecutor mire el remoto antes de llamar.
  El script sí lo sabe, pero falla en lugar de avisar.
- **Coste**: una ejecución más del script, más la espera del cerrojo.
- **Propuesta**: que el script, con `-Push` y sin remoto, fusione en local y termine con un aviso
  `push: no hecho: sin remoto` en lugar de fallar. O, si fallar es deliberado para no fusionar a
  medias, que la regla de la receta pase a la primera línea de §Push como comprobación previa.
- **Criterio de aceptación**: GIVEN un repo cuya rama destino no tiene remoto y `merge.push: true`,
  WHEN el cierre llama al script con `-Push`, THEN la rama queda fusionada en una sola ejecución y el
  mensaje final dice «push: no hecho: sin remoto».

## Lo que hice por iniciativa propia

- Reproduje el fallo sin navegador con el motor headless del editor. Primero generé el fichero de
  partida y lo abrí y guardé con el motor. Después lo exporté a PDF y leí el PDF como imagen. El PDF
  enseñaba el síntoma visual (una celda punteada) sin levantar la aplicación ni el editor. Funcionó:
  sirvió de prueba de la causa y del fix, y ahorró el flujo de navegador. Candidato a regla en
  `sdd-start-patch` paso 1 para fallos de render de un documento: si el motor exporta a PDF, esa
  exportación es la evidencia visual antes que una captura de navegador.
- La petición pedía preguntar al usuario en qué entorno le pasó. No se preguntó: la causa estaba en
  el fichero que genera el propio sistema, así que no depende del entorno, y el usuario ya había
  descrito cómo lo reproducía. Se dijo en el mensaje. Nadie lo discutió.
- La sección de delta de capacidad de `patch.md` se escribió al arrancar el patch, no al cerrarlo, y
  el cierre solo la fusionó. Funcionó sin fricción.

## Funcionó, no tocar

- La guarda `destino sacado:` de `Invoke-SddMerge.ps1`. Paró el merge ante un cambio ajeno sin
  commitear en el checkout de la rama destino y nombró el fichero. El usuario lo resolvió y el merge
  siguiente salió limpio.
- El orden del arranque (causa raíz, carpeta, test en rojo, fix, un solo commit) con TDD dentro del
  paso 4. El test falló con el motivo esperado antes del fix.
- `Build-EstimationLog.ps1` y `Test-Capabilities.ps1` funcionaron a la primera.

## Errores míos, no huecos del kit

- Lancé el merge con `-Push` sin comprobar el remoto, aunque la receta lo dice (ver el hallazgo 2
  para la parte del kit).
- El primer `git commit -F -` desde PowerShell falló: el here-string no llega por stdin. Se rehízo
  con `-m`.
