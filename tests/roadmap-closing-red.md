# RED — cierre de filas del roadmap (task 0018)

RED previo a la spec: reproduce los dos frentes de conducta de la fila 0018 antes de fijar el alcance (regla de `tech-stack.md`, «Un baseline limpio no reproduce los fallos de sesiones largas»).

- Sujetos headless (`claude -p --model sonnet`), plugin instalado deshabilitado, copia del kit de `feature/0018` tras integrar `develop` (`910b464`), sin cambios en `sdd-end-task` ni `sdd-end-patch`. Un turno por sujeto.
- Moldes, lanzador y salida: `.docs/sdd/specs/20260922-153902-task-0018-roadmap-closing/red/` (`mt/`, `mp/`, `subject.sh`, `run.sh`, `out/`). Código y tests del molde `m5` de la task 0004. La rama de feature lleva el fix ya commiteado (en el molde, bajo `.f/`).
- Los dos moldes tienen en «Deuda técnica» la misma fila con dos piezas: `libres` sin validar la franja y `cancelar` sin validar el día. El trabajo que se cierra salda solo la primera. Ningún molde tiene filas de deuda ya cerradas, así que no hay una forma que copiar.
- **mt** (`ids.mode: tracker`): la task SALAS-142 viene de Jira, tiene `spec.md` lite aprobada y **no tiene fila** en el roadmap («Próximo» vacío; la fila de deuda dice `ticket en Jira` en Destino). Turno: «Invoca la skill sdd-kit:sdd-end-task y cierra la task SALAS-142. La he probado yo: `node src/app.js libres 25:00-99` da el error de formato y `libres 10:00-12:00` sigue dando Sur. Funciona.»
- **mp** (`ids.mode: sequence`): el patch 0008 tiene `patch.md` completo salvo el hash del commit, y su §1 nombra la fila de deuda de origen. Turno: «Invoca la skill sdd-kit:sdd-end-patch y cierra el patch 0008. Lo he probado yo y funciona.»
- Coste: 1,03 + 0,87 + 0,38 + 0,44 = 2,72 $.

Comprobación previa: (1) los cuatro cargaron `sdd-kit:sdd-end-task` o `sdd-kit:sdd-end-patch`, visto en el stream; (2) spec, patch y fix están en el commit de la rama; (3) un solo turno; (4) una sola lectura; (5) copia del kit de la rama, sin la guía nueva; (6) el molde no ofrece ninguna forma de cierre para copiar.

## Resultado

| Frente | Qué se mide | t-red-1 | t-red-2 | p-red-1 | p-red-2 | Veredicto |
| --- | --- | --- | --- | --- | --- | --- |
| A. Task sin fila, modo tracker | ¿Inventa una fila en «Próximo» o fuera de la deuda? ¿El id del ticket queda en el changelog? | no inventa · changelog con `SALAS-142` | no inventa en «Próximo» · changelog con `SALAS-142` | — | — | **No se reproduce, 2/2** |
| B. Cierre de la fila de deuda | ¿Marca la fila, con qué forma, enlaza el artefacto y conserva el texto original? | reescribe la fila sin la pieza saldada, **sin enlace** | fila nueva `✅ **SALAS-142** …` con enlace al walkthrough; la original se reescribe | reescribe con «(la parte de `libres` ya está corregida en el [patch 0008](…))» | igual que p-red-1, con otra redacción | **Falla: 3 formas en 4 sujetos, 1/4 sin enlace, 4/4 pierden el texto original** |

**Frente A.** Ningún sujeto añade la task a «Próximo» ni la presenta como fila de scope: los dos entienden que en modo `tracker` el alcance vive en el gestor. La trazabilidad queda en el changelog, `- **SALAS-142** — \`libres\` valida la franja…` (t-red-1, línea 9). La fila `✅ **SALAS-142**` de t-red-2 está en la tabla de deuda y es su forma de cerrar la deuda, así que cuenta en el frente B. Va a deuda como **posible falso negativo**: en campo el hueco lo señaló la task 0004 por lectura, y no hay ningún ticket con el fallo observado.

**Frente B.** Los cuatro tocan la fila, así que marcarla no es el hueco. El hueco es la forma. t-red-1 deja `**Sin validación de la entrada de \`cancelar\`**` sin rastro de SALAS-142. t-red-2 añade una fila cerrada nueva en la tabla de deuda. Los dos patches meten el enlace entre paréntesis dentro del título reescrito. Con estas tres formas, ni un `grep` sobre el roadmap distingue las filas cerradas de las abiertas ni queda el texto con que se abrió la fila, que en este repo es la evidencia verificada del hallazgo.

**Forma del fallo** (frente B): el agente cumple, pero con una forma distinta cada vez, porque ninguna skill ni plantilla dice cómo se cierra una fila. Según el Art. II, se corrige con una receta de forma: un solo formato, escrito una vez y citado desde los dos pasos de cierre.
