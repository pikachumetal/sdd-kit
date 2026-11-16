# Medida: Claude Code recorta las skills tras compactar (2026-11-03)

Conclusión: se confirma. Tras una compactación, Claude Code vuelve a adjuntar cada skill invocada cortada a 20.000 caracteres (UTF-16, marcador incluido), y además pone un tope de 25.000 tokens a todas las skills juntas: la invocada hace más tiempo que no cabe no se adjunta.

## Fuente 1 — el código de Claude Code 2.1.317 (`~/.local/bin/claude.exe`)

- `function tyr(e,n){if(bc(e)<=n)return e;let r=n*4-jQn.length;return e.slice(0,r)+jQn}`, con `bc(e)=Math.round(e.length/4)` y `jQn` el marcador `\n\n[... skill content truncated for compaction; use Read on the skill path if you need the full text]`.
- La llamada es `tyr(q.content,Uhr)` con `Uhr=5000` tokens por skill: el corte cae en `5000*4 = 20.000` caracteres.
- Las skills se recorren de la invocada más recientemente a la más antigua y se suman: `if(y+ve>iQe)` con `iQe=25000` tokens, y la que no cabe no se adjunta.
- Al volver a invocar una skill cortada, Claude Code antepone «(Re-invocation of /<skill> — the previously loaded copy was truncated by compaction; the full instructions follow.)».

## Fuente 2 — transcripciones reales (`~/.claude/projects` y `~/.claude-gco/projects`)

- 22 sesiones con el marcador; 39 skills cortadas, todas a exactamente 20.000 caracteres. 26 son del kit: `sdd-implement` (5 sesiones: 0209, 0215, 0216, 0228, 0288), `sdd-propose` (4), `sdd-archive` (4) y `sdd-start-feature` de la 2.x (13, la mayoría de document-manager).
- Tras el corte, el agente releyó la skill con `Read` 1 vez de 26 y la volvió a invocar 2: el aviso del marcador no basta.
- Tope total: 17 de 44 adjuntos tras compactar pasan de 85.000 caracteres (el mayor, 99.364), y en 8 falta una skill que la sesión había invocado (`sdd-propose` en la 0209 y la 0228, entre otras). Es un indicio: se deduce de los ficheros, no se reprodujo.

## El texto que cuenta

El contenido adjunto no es el fichero: Claude Code quita el frontmatter, antepone `Base directory for this skill: <ruta>` y expande `${CLAUDE_PLUGIN_ROOT}`. Un comentario HTML del `SKILL.md` llega literal al agente y cuenta (prueba con una skill de prueba y Haiku, 0,009 $).

| Skill | Fichero (caracteres) | Renderizada con la ruta de la caché del plugin | Sobra del corte |
| --- | --- | --- | --- |
| `sdd-implement` | 61.562 | 61.756 | ~41.900 |
| `sdd-propose` | 33.133 | 32.855 | ~13.000 |
| `sdd-archive` | 30.835 | 30.961 | ~11.100 |
| `sdd-verify` | 22.879 | 22.742 | ~2.800 |
| `sdd-roadmap` | 21.414 | 20.948 | ~1.000 |

## Las demás fuentes del kit

En las versiones que revisó la 0289: superpowers v7.0.1 no tiene ningún `SKILL.md` de 20.000 bytes o más (lo arregló en esa versión con `references/` leídas en el paso y `tests/skill-size/test-skill-size.sh`); OpenSpec v1.16.0 tiene 3 de 12 por encima, sin test ni mención; Spec Kit v1.2.6, una plantilla de comando de 22.340; mattpocock v1.3.2 e impeccable caben todas.
