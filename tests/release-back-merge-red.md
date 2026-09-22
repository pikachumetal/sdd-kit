# RED — merge de vuelta, tag tras el merge y Overview de `sdd-end-release` (patch 0028)

Re-medición sobre `develop` (`2fb5b37`) de las tres filas de deuda que dejó la task 0004. El paso 7 de `sdd-end-release` no ha cambiado desde el GREEN de la 0004 (`git diff 1d1dda0 HEAD` solo toca el paso 6), pero la regla de `tech-stack.md` pide reproducir cada frente antes de fijar el alcance.

- Sujetos headless (`claude -p --model sonnet`), plugin instalado deshabilitado y copia del kit de `develop`. Dos turnos por sujeto; el segundo va con `--resume`.
- Molde `m5` y `subject.sh` de la task 0004: `.docs/sdd/specs/20260921-074701-task-0004-release-without-client/red/`. `m5` tiene código y tests reales, `hasRecipient: false`, git-flow `main`/`develop` declarado en su constitution y `main` con el tag `v0.3.0`.
- Lanzador, extractor de comandos git y estado final de cada sujeto: `.docs/sdd/specs/20260922-135817-patch-0028-end-release/campaign/` (`run.sh`, `git-calls.py`, `out/`).
- Las transcripciones `stream-json` se quedan en el scratchpad de la sesión; los comandos git de cada sujeto, con su resultado, se guardan en `out/<sujeto>.git.txt`, porque el tag transitorio no se ve en el estado final.
- Turno 1: «Vamos a publicar a producción lo que tenemos. Cierra la release.» Turno 2: «Sí, v0.4.0. Adelante.»
- Coste: 1,70 $ (r-red-1, r-red-2) + 2,09 $ (r-red2-1, r-red2-2, pedidos por el dev-lead para no descartar el frente 1 con 0/2) = 3,79 $.

Comprobación previa (`tech-stack.md`): (1) el turno 1 carga `sdd-kit:sdd-end-release` en los 4 sujetos, visto en el stream; (2) `m5` trae en el commit base el git-flow y el tag previo; (3) el turno 2 es la respuesta a la propuesta de versión, y con `hasRecipient: false` el atajo del paso 7 permite ejecutar merge y tag en ese turno; (4) una sola lectura; (5) copia del kit tomada de `develop`; (6) el molde no ofrece salida: el merge de vuelta no está escrito en ningún documento del molde.

## Resultado

| Frente | Qué se mide | r-red-1 | r-red-2 | r-red2-1 | r-red2-2 | Veredicto |
| --- | --- | --- | --- | --- | --- | --- |
| 1. Tag antes del merge | ¿El tag se crea aunque el merge falle? | merge y tag en comandos aparte | `git merge … && git tag …` | comandos aparte | comandos aparte | **No se reproduce, 0/4** |
| 2. Merge de vuelta `main` → `develop` | ¿`develop` contiene el merge commit con el tag? | no | no | no | no | **Falla 4/4** |
| 3. Overview | ¿«feedback triado» lleva la condición del paso 2? | — | — | — | — | **Falla** (lectura: `SKILL.md:14`) |

**Frente 1.** En la 0004 el fallo venía de `git merge -F -`, que no se admite: el merge fallaba dentro de una cadena con `;` y el tag se creaba igual. Aquí ningún sujeto usa `-F -`; todos pasan el mensaje con `-m "$(cat <<'EOF' … EOF)"`, y quien encadena usa `&&`, que no crea el tag si el merge falla. El texto de la skill es el mismo, así que lo que cambió es la conducta del sujeto. Va a deuda como **posible falso negativo**: si reaparece `-F -` o `;`, la frase propuesta sigue siendo la misma.

**Frente 2.** En los cuatro, `develop` se queda en el commit de sellado, por detrás del merge commit de `main` que lleva `v0.4.0`. Ninguno lo nombra como pendiente en el informe final; en la 0004 lo nombraban 3 de 6. Resumen literal de r-red-2: «Merge `develop` → `main` (`d12c32a`), tag anotado `v0.4.0` sobre el merge commit.» r-red2-2 vuelve a `develop` con `git checkout develop` y no mergea: «Vuelto a `develop` para seguir trabajo.»

**Forma del fallo** (frente 2): se omite un elemento de algo que ya se produce, porque la skill no lo nombra («merge según el git-flow del proyecto»). La forma adecuada es nombrarlo en la receta del paso 7, condicionado a un predicado observable (el git-flow tiene rama de integración), no con una prohibición.
