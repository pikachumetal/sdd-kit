# Revisión adversarial de la solución (2026-11-03)

Revisión pedida por el dev-lead («pon un agente opus a hacer una review de la solución propuesta») a un agente Opus, de solo lectura, sobre la versión de la solución anterior a esta propuesta: comprobaciones por literalidad de líneas, `KIT-CHANGES.md` sustituido por texto anotado, `dist/` commiteado y un test de 25.000 tokens por flujo. Las reglas de [proposal.md](proposal.md) ya llevan sus correcciones. Copia literal de su informe; los scripts del experimento están en [review-scripts/](review-scripts/), y los ficheros intermedios (`old.md`, `new.md`, `ours-*.md`, `merged-*.md`) se regeneran con `make-ours.mjs`.

---

## Revisión adversarial de la propuesta 0300

Hay tres huecos graves. Las comprobaciones (a)-(d) no ven la regla 1: un texto de la fuente borrado o recortado sin marca pasa en verde. `git merge-file` solo da el resultado prometido si la fuente anotada conserva los saltos de línea y los finales de línea de la fuente, y hoy no los conserva. Y una fuente que mueve texto a otro fichero rompe la actualización, cosa que superpowers hizo en un patch (7.0.0 → 7.0.1). El resto se sostiene o tiene huecos que se arreglan.

### Experimento con `git merge-file` (comprobado)

Fuente sintética: `subagent-driven-development` de la v7.0.0 con 6 bloques del kit (B1-B6). Cuatro sustituyen: la lista de paradas con «only these», una frase del tier de re-revisión, la viñeta del ledger que la 7.0.1 reescribe y el renombre `superpowers:using-git-worktrees`. Dos añaden: el «primer mensaje» y un «Reproduce before fixing» en el bucle de fix, que la 7.0.1 movió a `references/fix-loop.md`. Fusión con la v7.0.1:

| Variante de la fuente anotada | Conflictos | Detalle |
| --- | --- | --- |
| Con los saltos de línea de superpowers, en LF | **2** | Los dos legítimos: B4, que tocaron los dos, y B5, cuyo bloque de 3 líneas genera un conflicto de 70 líneas porque la fuente movió la sección. B1, B2, B3 y B6 fusionan solas. |
| Con un párrafo por línea, como el kit hoy (`sdd-implement` tiene líneas de hasta 1.478 caracteres) | **5** | 3 de ellos (2, 3 y 5) caen en zonas sin ningún bloque del kit: son ruido del reajuste de líneas. |
| Con los saltos de superpowers, pero en CRLF | **1 conflicto de 918 líneas**, el fichero entero | En esta máquina `core.autocrlf=true`, y `skills/sdd-implement/SKILL.md` está en CRLF (`file` lo dice). |

Las comprobaciones, con un prototipo de (a) y (c), normalizando espacios (`scripts/checks.mjs`):
- Después de resolver los conflictos, (a) da 0 líneas sin marca fuera del original v7.0.1, y (c) da OK en las tres sustituciones que quedan. Al tomar «theirs» en B4 su marca desaparece. Si se hubiera quedado, (c) habría dado rojo por marca vieja, que es lo correcto.
- Nada avisa de que el bloque B5 del kit se perdió al resolver: (b) solo exige que el texto del kit tenga marca, no que siga ahí.
- (a) a nivel de línea con espacios normalizados sí es viable con el markdown real: 441 líneas, 0 falsos rojos. Pero es ciega a borrados y recortes (hallazgo 1).

Escala sobre el kit real, sin marcas: `sdd-tdd` tendría 19 de 246 líneas no literales que pedirían marca, y `sdd-implement` 209 de 355.

### Hallazgos por gravedad

**1. Crítico. (a)-(d) no detectan la regla 1 («sin tocar lo que funciona»).**
- Prueba: en `ours-tampered.md` borré «Never start implementation on a main/master branch…» y quité «→ cheap model» y «→ standard model» del mapeo de tiers. Resultado: `(a) … not literal in original: 0`, todo verde.
- K37, «Rulings, not stalls» pierde texto de superpowers (`research.md` §2.2), es justo este caso.
- Arreglo: la comprobación tiene que ser un diff entre el original en su tag y la salida sin bloques del kit. Cada hunk tiene que quedar cubierto por un bloque marcado, y un borrado puro necesita su propia marca (p. ej. `quita: «…»`). Ese diff es más fuerte que (a) y (b) juntas y las sustituye.

**2. Crítico para la solución 8. La fusión depende de la forma de las líneas, no solo del texto.**
- Hace falta conservar los saltos de línea de la fuente: con un párrafo por línea, 5 conflictos frente a 2. La propuesta solo dice «normalizar espacios», y eso vale para buscar frases, no para `merge-file`, que fusiona por líneas.
- Hace falta LF en los tres ficheros: con CRLF, conflicto de fichero entero. Arreglo: `.gitattributes` con `skills/** text eol=lf`, o fusionar sobre copias normalizadas.
- Migrar las copias de hoy implica volver a cortar las líneas como la fuente.

**3. Grave. Las fuentes mueven texto entre ficheros incluso en un patch.**
- `git diff --stat v7.0.0 v7.0.1`: `subagent-driven-development/SKILL.md` +28/−260 y 7 `references/*.md` nuevos. `executing-plans` −52.
- `merge-file` va fichero a fichero. No sigue un bloque del kit a su fichero nuevo (B5: conflicto de 70 líneas, y el bloque hay que llevarlo a mano a `references/fix-loop.md`). Un fichero nuevo de la fuente no tiene base contra la que fusionar.
- Falta un paso de «ficheros añadidos o quitados en la fuente entre los dos tags → rojo hasta mapearlos» en `upstream.json`.
- «Sencillo salvo si la fuente reescribe» se queda corto: la 7.0.1 es un patch y ya «reescribe» en este sentido.

**4. Grave. Choque entre la copia fiel y el tamaño (soluciones 1/4 frente a 5).**
- El cuerpo de `subagent-driven-development` v7.0.1 ya ocupa 19.250 caracteres: quedan 750 hasta el corte (494 bytes con el test de hoy, que mide bytes). `executing-plans` deja 2.217.
- Cada sustitución del kit alarga el texto. `bash scripts/review-package …` → `node "${CLAUDE_PLUGIN_ROOT}/cli/bin/sdd.js" review package …` suma unos 30 caracteres, y la expansión de `${CLAUDE_PLUGIN_ROOT}` en la caché otros ~70; la fuente usa `scripts/` 4 veces. Además se antepone «Base directory…».
- Conclusión: `sdd-implement-subagent` como copia fiel probablemente no cabe. Cada añadido del kit va a `references/` o se paga con una sustitución igual de larga, y eso hay que decidirlo en la spec antes de partir.

**5. Grave. El test de los 25.000 tokens está mal planteado.**
- Comprobado en el binario de 2.1.317: `Ee=tyr(q.content,Uhr),ve=bc(Ee);if(y+ve>iQe){…continue}`. La suma usa la skill **ya cortada** (5.000 como máximo cada una), y `continue` deja entrar después otras más pequeñas.
- Con 5 skills de menos de 20.000 caracteres, la suma de la propuesta siempre es menor de 25.000: el test es redundante.
- Lo que de verdad se pierde es la skill que dirige la fase cuando la invocaste antes que las demás. Por ejemplo, `sdd-implement` invocada al principio y, después, `implement-subagent`, `tdd`, `verify`, `debugging`, `parallel-agents` y `worktrees`.
- El test útil va por fase: la skill que dirige más todo lo que invoca durante su fase, cada una contada como mín(longitud, 20.000), suma menos de 100.000 caracteres (tokens = caracteres/4, como `bc`). La lista de la propuesta además olvida las dos skills nuevas del split.

**6. Grave. El test de frases repetidas, tal como está, contradice la ADR 0019 y da rojo con la fuente.**
- La 0299 descartó 495 de 630 parejas bajo el umbral y 73 de 148 sobre él (preámbulo del Art. III, frontmatter, tabla de `using-sdd`, plantillas, texto que la fuente ya repite). Una «lista de casos revisados» de ese tamaño es la lista que crece que la ADR 0019 rechaza. Esa ADR también dice «Editar una frase de una skill no toca ningún test», así que la ADR nueva tiene que sustituir esa consecuencia además de la 0013.
- `native` y `subagent` comparten texto de superpowers (racionalizaciones y bloques que `provenance.md` sitúa en `ep.md` y `sdd.md` a la vez), y el test los marcaría. Debe contar solo las parejas donde al menos un lado sea texto del kit, y el build tiene que dejar un mapa de los rangos incluidos.

**7. Medio. La solución 6 (commitear `dist/`) traslada el coste al día a día.**
- Cada cambio de la CLI y de cada skill se commitea dos veces (`cli/src` son 116 ficheros).
- Con varias sesiones en paralelo en worktrees, cada fusión puede chocar dos veces.
- Una sesión de desarrollo carga un `dist/` viejo si no reconstruyes, y la regla 1 de `CLAUDE.md` ya sufre con eso.
- Alternativa, que no he probado: `dist/` ignorado en `develop`, con `start-kit-session.mjs` construyéndolo al arrancar, y publicado en el corte a una rama `dist`. El `marketplace.json` de `main` apuntaría a ella con una fuente `{"source":"github","repo":"pikachumetal/sdd-kit","ref":"dist"}`; la doc admite `ref`/`sha` en una fuente `github`. No he verificado que una auto-referencia al mismo repo funcione.
- Ojo: con git-flow, si en cambio commiteas `dist/` solo en `main`, el merge de vuelta lo devuelve a `develop`.

**8. Medio. La marca: dónde acaba un bloque, y la marca en el frontmatter.**
- La propuesta no define dónde acaba un bloque. Una sustitución a mitad de párrafo (B3) parte el párrafo.
- Una línea `<!-- -->` en el frontmatter YAML no es válida, y `name` y `description` siempre difieren de la fuente.
- Cada renombre (`superpowers:X` → `sdd-X`, `scripts/` → `sdd.js`) pide su marca. En `sdd-debugging` casi todo el 3 % que difiere son rutas y renombres.
- Con «sustituye: S», si S aparece dos veces en la fuente y el kit solo cambia una, (c) da rojo para siempre.

**9. Medio. (d) se esquiva con una línea en blanco.**
- Solo mira dentro del mismo párrafo. La herencia de K1 en `sdd-implement:121` («Only the stops of the Overview stop you») está en otra sección.
- 24 de 60 párrafos de la 7.0.1 tienen alguna palabra absoluta, así que como filtro funciona, pero no basta.

**10. Medio. Tres sitios para la versión de cada fuente.**
- Los `NOTICE` dicen 7.0.0, `THIRD_PARTY_NOTICES.md` «vista» `v7.0.1` y `upstream.json` tendría su propio tag. Es la regla repetida del problema 2, en metadatos.
- Arreglo: una sola fuente de verdad, de la que se generan o se comprueban las otras.

**11. Medio. La comprobación en el pre-commit exige `SDD_UPSTREAM_DIR` en cada máquina, y un tag ya descargado.**
- Hoy `kit:upstream` está fuera del pre-commit y hace `git fetch` por red. La comprobación nueva no debe ir a la red, y tiene que decir «falta el tag X en el clon» en vez de un rojo sin explicación.

**12. Medio. Lo que hay que arrastrar a `dist/` y lo que lo usa.**
- `cli/src/upgrade/verbs.ts:9` y `cli/src/validation/verbs.ts:7` leen `../../../skills/...`, incluidos `validation-panel.js` y `migrations/`. «Skills construidas» tiene que copiar todo lo que no es `.md` y respetar la estructura.
- `session-start.js:57,63` lee la versión y `using-sdd`.
- Las baterías usan `git archive <commit> skills .claude-plugin agents cli hooks` (`tests/headless/battery.mjs:12`) y tienen que pasar a `dist`.
- `.claude/hooks/kit-session-source.mjs` le dice al agente que contraste con `skills/<nombre>/SKILL.md`. Ahí leería la fuente anotada, que trae la frase vieja dentro de «sustituye: «…»». La regla 1 de `CLAUDE.md` y ese hook tienen que apuntar a `dist/skills/`.

**13. Bajo. La clasificación de la solución 4.**
- El X % no está definido.
- `sdd-verify` mezcla 4 fuentes (superpowers, OpenSpec, mattpocock, wondelai): «sin marca = literal del original» no dice de cuál.
- Las plantillas (MADR, mattpocock, impeccable) y los ports de código (`cli/src/tasks/` desde superpowers 6.4.2, `tests/skill-size/check.ts` desde 7.0.1) no entran en la clasificación.

**14. Bajo. La migración desde la 2.3.4 se sostiene, según la doc.**
- La doc lo dice para una fuente de ruta relativa: «Every other marketplace plugin: Claude Code copies the plugin into `cache/<marketplace>/<plugin>/<version>/` … Files outside the plugin directory aren't copied». Con `./dist` solo viaja `dist/`.
- La versión sale de `plugin.json`, que pasa a `dist/.claude-plugin/plugin.json`, y la carpeta vieja de la caché se borra 14 días después.
- Hay que reapuntar `init.slow.test.ts:9`, el test de `workflow-docs` y el paso que sube la versión.
- El «límite admitido» del clon tiene arreglo parcial: la doc documenta `sparsePaths` en la fuente del marketplace. Pero según `README.md:81`, la fuente de usuario y la de proyecto tienen que ser idénticas, así que obligaría a migrar el `settings.json` de cada proyecto. No sé si `sparsePaths` cuenta como diferencia.

### Choques entre soluciones

- **1/4 frente a 5**: la copia fiel no cabe (hallazgo 4).
- **2 (inclusión) frente a 5**: incluir quita la divergencia, pero no ocupa menos: el texto incluido cuenta en cada skill y en la suma.
- **2 (repeticiones) frente a 4 (split)**: las dos copias de superpowers comparten texto de la fuente (hallazgo 6).
- **7 frente a la ADR 0019**: la ADR nueva tiene que sustituirla en parte, no solo a la 0013.
- **6 frente a la regla 1 de `CLAUDE.md`**: la sesión carga `dist/`, pero los avisos remiten a `skills/` (hallazgo 12).

### Problema 9: conceptos de otras fuentes

Se sostiene, con cuatro ajustes:
1. **No cabe en un `upstream.json` por copia.** Los conceptos alimentan skills propias, plantillas, `cli/src/capability`, la constitution y `tech-stack.md`. Hace falta un registro único a nivel de repo, que además resuelve el hallazgo 10 si de él salen la tabla de `THIRD_PARTY_NOTICES.md` y los `NOTICE`.
2. **Versión vista por entrada, no solo por fuente.** Si no, revisar un concepto da por revisados todos.
3. **Rojo si una ruta declarada ya no existe en el tag nuevo.** OpenSpec reorganiza `docs/`, y un diff vacío por ruta movida pasa como «sin cambios». Es el equivalente de la «marca vieja» de (c).
4. **Es donde aterrizan las copias que dejan de serlo** (problema 4: `sdd-grilling`, y `sdd-propose`/`references` o `sdd-archive` si se declaran propias), y también los ports de código. Conviene decirlo en la spec para que no pierdan el seguimiento al reclasificarlas.

No veo nada mejor. Una ventaja extra: el corte puede dejar pasar sin parar una fuente cuyas rutas registradas no cambian, cuando hoy `kit:upstream` falla con cualquier tag nuevo. Fragmentos literales de una segunda fuente dentro de una copia, como los «Quick Diagnostic» de wondelai en `sdd-verify`: no son concepto, son texto copiado. Necesitan la marca con su fuente y la comprobación de literal, no este tipo de entrada.

### Mejores soluciones que veo

- **Para 1, 3 y 7**: cambiar (a)+(b) por el diff cubierto por bloques, con una marca de borrado (hallazgo 1). No rompe nada y cubre la regla 1.
- **Para 8**: la fuente anotada en LF y con los saltos de línea de la fuente, obligado por un test, más un paso de «ficheros añadidos o movidos» en la fuente.
- **Para 5**: el test por fase en vez de por flujo.
- **Para 6**: la rama `dist` publicada en el corte. Esta es menos clara: evita duplicar diffs y conflictos, a cambio de un paso de publicación y de una auto-referencia que no he probado.

### Qué no pude verificar

- Que una fuente `github` que apunta al mismo repo, rama `dist`, funcione.
- Si `sparsePaths` rompe la regla de «fuentes idénticas».
- Instalar de verdad desde `./dist`: lo de la caché sale de la doc, no de una prueba.
- La medida de la suma de 25.000 la saqué del binario 2.1.317; no reproduje una compactación.

### Veredicto

La base aguanta: fuente intermedia más build, `./dist` limpia la caché según la doc, y la fusión de tres vías funciona con 2 conflictos legítimos de 2 posibles. Pero las comprobaciones no cubren la regla 1, la fusión exige una forma de línea (saltos de la fuente y LF) que hoy no se cumple, y la fuente ya mueve texto entre ficheros en un patch. Además, la copia fiel de `subagent-driven-development` 7.0.1 deja 750 caracteres para todo el kit. Con el diff cubierto por bloques, un test de forma de línea, el mapeo de ficheros y el test de tamaño por fase, la propuesta se sostiene. Sin ellos, vuelve a dejar pasar lo que la 3.0.0 dejó pasar.
