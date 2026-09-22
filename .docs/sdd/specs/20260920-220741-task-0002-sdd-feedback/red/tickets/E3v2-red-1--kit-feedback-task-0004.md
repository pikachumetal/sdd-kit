# Feedback del sdd-kit tras la task 0004

Para quien mantiene el kit. Proyecto: Horizon Notes. Kit `sdd-kit` 1.1.0 (canal plugin), `superpowers` 6.3.0.

## Alcance y fuentes

Sesión del 2026-09-19, de 08:40 a 09:20, un solo desarrollador, task 0004 (filtro por etiqueta) en modo lite. Cubre `sdd-start-task` hasta el paso 7 (validación). No se ha ejecutado `sdd-end-task`, así que del cierre, el changelog, el `estimation-log` y la fusión de la capacidad `search` en `capabilities/` no hay nada que contar.

Cada afirmación indica su fuente: *log* (`session-log.md`), *kit* (texto de las skills en 1.1.0) o *comprobado* (lo he leído o ejecutado en el repo al redactar este documento; no consta en el log).

## Lo que ha funcionado

- **Enrutado a lite.** La skill citó las condiciones del predicado una por una, se cumplían todas y el desarrollador confirmó el modo (log 08:43). Es lo que pide `modo-lite.md`.
- **Brainstorming sin desvío de artefactos.** Clasificó el cambio como acotado, pero la spec se escribió y pasó por su gate igualmente (log 08:45–08:52; `spec.md` existe). Sus dos preguntas acabaron como decisiones 2 y 3 de la spec.
- **Spec en 7 minutos, aprobada sin cambios.** La plantilla ligera bastó: decisiones arriba (incluida la capacidad nueva `search`), delta con dos ADDED y escenarios GIVEN/WHEN/THEN, y el bloque de estimación de lite (1 h, base 0003, confianza alta).
- **Tests desde los THEN.** El hilo principal escribió el test en rojo, lo commiteó y despachó al implementador con la ruta como contrato (log 08:55). Los tests pasaron a la primera (09:05). Es el paso 6 tal como está escrito.
- **Gate de validación.** Smoke (09:12), presentación y prueba propia del desarrollador (09:18) fueron pasos separados. La validación consistió en decir qué se probó (`#viaje` y filtro vacío), que es la definición del paso 7.
- Ningún gate estorbó ni pidió datos ya dados (log 09:20).

## Lo que ha fallado

Según la bitácora, nada: no se registra ningún gate que estorbara ni ningún workaround. Lo que sigue sale de contrastar el log con el repo y con el texto del kit; no son fallos que se notaran durante la sesión.

### 1. Un defecto que revisión, smoke y validación dieron por bueno (comprobado)

`extractTags` usa `/#(\w+)/g` y `\w` no cubre letras con tilde:

```
extractTags('viaje a #México y #café #viaje')     ->  ['m', 'caf', 'viaje']
filterByTag([{ body: 'viaje a #café' }], 'café')  ->  []
filterByTag([{ body: 'viaje a #café' }], 'caf')   ->  [nota]
```

Con etiquetas con tilde el filtro no encuentra la nota que debería y encuentra otras por prefijo. En un proyecto en castellano es un caso previsible. No se vio por tres razones:

- La spec define etiqueta como «palabra precedida de `#`» sin fijar qué letras entran, y los tests salen de los THEN de la spec, así que heredan el hueco.
- El revisor de task «no encuentra nada» (log 09:05). El log no guarda su encargo ni su informe.
- Smoke y validación usaron `#viaje` y `#Viaje`, todo ASCII.

Ninguna pieza del kit falló por separado. Lo que muestra es que en lite «tests desde los THEN + revisión limpia + smoke» cubre lo que la spec dice y deja sin cubrir lo que calla. La review de la spec no aplica en lite (`review-spec.md`), y no se puede saber si la habría cazado.

### 2. Huecos del texto del kit en modo lite

- **«Restricciones globales» sin fuente.** El paso 6 y `encargo-revision.md` mandan copiar ese bloque de `plan.md` a cada encargo. Lite no tiene `plan.md` y `spec-template.md` no tiene el bloque (kit). El log solo dice que el implementador recibió «la ruta del test como contrato» (08:55); no dice qué restricciones recibieron implementador y revisor. Falta definir de dónde salen en lite; una opción es el artículo de calidad de código de la constitution.
- **Subagentes sin salida en lite.** La ejecución en línea se declara en el campo `Ejecución` del plan, y lite no tiene plan (kit). Coste registrado: 96k tokens del implementador y 41k del revisor de task, 137k en total sin contar el hilo principal, para un módulo de 23 líneas y su test de 23 (comprobado). El log no lo presenta como queja. Es un dato para decidir si lite debe permitir la ejecución en línea declarándola en la spec.
- **Revisor final.** El paso 7 parte de «revisión final limpia» (kit). El log solo registra un revisor de task. Con una task y un módulo no queda claro si eso basta o si el kit espera además un revisor final.
- **Rama y carpeta con ids distintos (comprobado).** La rama actual es `feature/0007`; el roadmap, la carpeta (`…-task-0004-…`) y la spec dicen 0004. El log no menciona el paso 3 (rama). `Get-NextSddId.ps1` devolvería `0007` con este roadmap (máximo 0006), lo que apunta a que se usó el script pese a existir la fila 0004; `nombrado.md` dice que en `sequence` con fila el id es el de la fila. Es una hipótesis sin confirmar. Si se confirma, el kit no detecta que rama y carpeta llevan ids distintos.

## Datos de estimación (provisionales)

Reloj de 40 min frente a 1 h estimada (ratio ≈ 0,67). El `estimation-log` tiene 0,80 y 0,85 en las dos tasks anteriores, factor 0,83. El real definitivo lo fijará el walkthrough.

## Límites de la evidencia

- El árbol solo contiene `src/search/tagFilter.js` y su test (ni código de vista ni `package.json`), así que el smoke sobre la vista que describe el log no se puede contrastar contra el repo.
- No hay contador de tokens del hilo principal ni copia de los encargos e informes de los subagentes.
- El cierre de la task no se ha ejecutado.
