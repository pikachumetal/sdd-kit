---
id: 20261103-130212-feature-0299-own-skills-audit
feature: 0299
title: Auditoría de las skills con las tres reglas del dev-lead
mode: spike
profile: delegate
status: approved
created: 2026-11-03
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-03
---

# Spec — Auditoría de las skills con las tres reglas del dev-lead

🦆 Hoy nadie sabe cuántas veces el kit arregló una frase añadiendo otra al lado en vez de cambiarla. Este spike lo cuenta en las 22 skills: por ejemplo, si `sdd-roadmap` dice «nunca abras una fila sin id» y tres párrafos más abajo «salvo en un triaje», eso es un hallazgo con sus dos frases, su línea y el commit que pegó la segunda. No se cambia ninguna skill: sale una tabla por skill y una propuesta de cuáles se rehacen, cuáles se arreglan y cuáles se quedan.

Validación: agente — el resultado es un documento de medidas; el proyecto valida en campo (`validation.mode: field`) y no hay nada que una persona observe que el agente no haya medido.

## Capacidades

- Ninguna, porque investigación.

## ✋ Decisiones que he tomado yo — valida estas

Sin review de spec: el carril spike no la lleva (la rúbrica de `review-spec.md` es de modo full); el repaso de coherencia lo hago yo.

1. **Tipos de hallazgo y su prueba**, cada uno confirmado leyendo las dos frases:
   - *Contradicción*: dos frases del kit que, aplicadas al mismo caso, mandan cosas distintas.
   - *Excepción pegada*: una frase absoluta («only», «never», «always», «must», «every») seguida, en la misma skill o en otra, de una cláusula que la exceptúa («except», «unless», «not an exception», «instead of», «exception») sin cambiar la absoluta. Si la absoluta ya nombra la salida, es un predicado (Art. II) y se descarta.
   - *La misma regla en dos sitios*: el mismo mandato dicho en dos ficheros o dos secciones, literal (frases compartidas de 6 palabras) o parafraseado si lo encuentra la lectura; se marca si las dos versiones ya difieren.
   - *Texto que solo existe por un ticket*: una frase cuyo único apoyo es la cita de un ticket o de un RED (`(tests/…-red.md, x)`, «ticket de la …», «dev-lead, fecha») y que el `git log -L` muestra añadida junto a una regla que ya decía lo mismo o lo contrario, sin tocarla (regla 3). Una cita que acompaña a la frase que cambió no es hallazgo: es la evidencia del Art. I.
2. **Candidatos mecánicos con un script nuevo, `rules.mjs`, en `scripts/` de esta carpeta**, que reutiliza la segmentación por unidades y las frases de 6 palabras de `audit.mjs` de la 0296: (a) absoluta → excepción en la misma unidad, la siguiente o la misma skill con el mismo sujeto; (b) frases de 6 palabras compartidas entre skills distintas o entre secciones de una misma skill; (c) unidades con cita de ticket. Cada candidato sale con su `fichero:línea` y el commit de `git blame` de la línea. El conteo previo a la spec da 65 líneas con palabra de excepción y 148 con cita de ticket en 78 ficheros (~102.000 palabras).
3. **Freno**: si la suma de candidatos por confirmar pasa de **300**, o la lectura pasa de **4 h**, paro y lo digo con la cifra antes de seguir (frase del enunciado: «si para medirlo bien hace falta más de lo previsto, para y dilo»).
4. **Lo que no se lee**: `skills/sdd-upgrade/references/migrations/` (13 ficheros) — son artefactos de una release que se aplican una vez y no son regla viva; los `NOTICE.md`; y los `tests/` de cada skill. Las plantillas de `sdd-templates/templates/` sí entran: sus bloques `>` son instrucciones al agente. Si la lectura de un fichero queda solo en sus candidatos, la fila lo dice.
5. **«Limpia»** = sin hallazgo confirmado entre los candidatos y lo leído; no «fiel en todo».
6. **Las 11 copias**: solo su capa del kit contra el resto del kit (otras skills incluidas), no contra su fuente; los 5 hallazgos de `fork-audit.md` se citan en su fila, sin repetir la medida.
7. **La tabla de §2 del research** lleva una fila por skill (22) con el número de hallazgos por tipo y el enlace a su detalle; el detalle va en `research.md` §2 bajo la tabla (o en `findings.md` en esta carpeta si `research.md` pasa de ~600 líneas), con `fichero:línea`, las dos frases literales y el commit. Las reglas repetidas entre skills, en su propia tabla.
8. **§5, propuesta en tres cubos**: *se rehace* (más de un hallazgo estructural o contradicciones entre secciones), *se arregla* (hallazgos puntuales, cambiando la frase que falla) y *se queda* (limpia). Leo «y cul ha cambiado» del enunciado como «y cuáles se quedan como están»; si querías otra cosa, dilo en el gate.
9. **Estimación**: 3,5 h (script 0,5 h, confirmar propias 1,5 h, capa del kit de las copias 1 h, research 0,5 h), más el gate de cierre del repo.
- Política de modelos: sin revisores de spec · ejes de la revisión final, los que diga `sdd-verify` para un spike (Spec opus+high, Código sonnet+high si aplica) · sin otros despachos: la lectura la hago en esta sesión, sin subagentes · en paralelo hasta `control.maxParallelAgents` (3).

### Decisiones tomadas con el dev-lead

- Carril spike, perfil `delegate`, sin sujetos, reutilizando los scripts de la 0296 — «Arranca la 0299 con sdd-propose, carril spike… Sin sujetos: es lectura y scripts».
- Un candidato mecánico solo cuenta confirmado leyendo las dos frases; el falso positivo se descarta con su motivo — «cada uno se confirma leyendo las dos frases. Un falso positivo se descarta con su motivo».
- No se cambia ninguna skill, plantilla ni test — «Cambiar cualquier skill, plantilla o test: solo se mide».
- Medir si agrupar las reglas por tema (o «compilar» la skill desde grupos) habría evitado los hallazgos: O5, y su lectura va en §4 y §5 del research — «No podriamos "compilar" el skill… si hay que retocar no lo pondremos detras lo pondremos en su grupo» (2026-11-03, en el gate).
- Base de la medida: commit `8e22a49f`; cada cita va como `skills/<skill>/<fichero>:<línea>` en ese commit más el sha que la introdujo, y sigue valiendo tras la 0300 (dist/ sale byte a byte igual). Lo que cambie la forma de anotar de la 0300 (p. ej. reglas repetidas que deban tener una sola fuente) va a §5 con la etiqueta «para la 0300» — acordado con la sesión `develop`, 2026-11-03.
- El fuente con etiquetas y build («dist») no entra en el spike: lo lleva el dev-lead con la sesión `develop`; el spike solo da el O5 — «tu centrate en tu tarea que e smedir ya sigo hablando con develop de lo de dist» (2026-11-03, en el gate).

## Forma spike

- **Pregunta**: en las skills del kit, ¿dónde se incumplen las tres reglas del dev-lead (partir de la fuente sin tocar lo que funciona; lo distinto sustituye la frase de la fuente; un problema se arregla mejorando la frase que falla, no añadiendo otra)?
- **Objetivos**:
  - O1 — las 11 skills propias, con sus `references/`, auditadas: el 100 % de los candidatos mecánicos confirmado o descartado con motivo.
  - O2 — la capa del kit de las 11 copias, auditada contra el resto del kit con el mismo criterio: 100 % de candidatos resuelto.
  - O3 — cada hallazgo confirmado con `fichero:línea`, tipo, las dos frases literales y el commit que lo introdujo (`git blame` o `git log -L`): 100 %.
  - O4 — las reglas repetidas entre skills distintas, listadas con sus sitios.
  - O5 — por cada hallazgo, la distancia entre sus dos frases (misma unidad · misma sección · otra sección de la skill · otra skill), para decidir si agrupar las reglas por tema dentro de la skill —o generar la skill desde fuentes por grupo— habría evitado el hallazgo (idea del dev-lead en el gate).
  - O6 — `research.md` con una fila por skill de las 22, los descartes, lo no leído y la propuesta de §5.
- **Decisión que desbloquea**: qué skills se rehacen y cuáles se arreglan, para la propuesta de `sdd-roadmap` que rehace el kit (y con ella la 0296 y la 0284).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada: el spike no cambia skills, plantillas, tests ni capacidades | — | — |

- Filas que implementa: 0299 → `roadmap.md:135`; el cierre la marca según `sdd-archive` | nada más: comprobado buscando `0299` en `.docs/` y `skills/` (los demás aciertos son salidas en bruto de RED antiguos, sin relación).

## Enmiendas

- 2026-11-03 — Freno de la decisión 3: con la definición de la decisión 2 salen 915 candidatos (59 + 778 + 78), no 285; el umbral de 5 frases por pareja que puse en la Task 1 lo esquivaba. Los 630 bloques bajo el umbral (`out/shared-low.md`) se leen con 3 subagentes Sonnet, effort medium, unos 210 cada uno, y entran en el research con el resto — aprobada: «1» (a la opción «Leerlos con 3 subagentes Sonnet con effort medium… 3-6 $ y unos 30 min»)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-03 | aprobada (opción «Apruebo») |
