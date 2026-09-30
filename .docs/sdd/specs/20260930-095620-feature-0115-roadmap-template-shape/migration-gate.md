# Gate de la migración del roadmap de este repo (paso 1 de `v2.3.0.md`)

Tabla de destinos para aprobar. El roadmap anterior queda entero en `roadmap-before.md`, en esta carpeta: es el de `develop` en `488bdbdc` con las dos filas de la partición de esta feature (0115 y 0123). Nada de lo que «sale» se pierde: está en esos dos sitios.

## Decisiones del dev-lead

1. **Features pendientes**: `## Release <versión>`, con sus cinco columnas, o «Próximo», con «Origen» y «Ficheros» dentro de «Ítem».
2. **Tabla «Patches»** (enmienda a la spec): un patch ya publicado sale en el corte, con la misma regla de fecha que una fila saldada. El GREEN dio cuatro tratamientos distintos en cuatro sujetos.
3. **Duplicados**: qué fila queda de cada par.
4. **La 0015 disuelta**: las etiquetas propuestas.

## Secciones

| Lo que hay hoy | Filas | Destino |
| --- | --- | --- |
| «Próximo», fila 4 (A8, `❌ descartado`) | 1 | Sale: `❌` no es un estado, y el descarte va al resumen de la v2.0.0 |
| «Próximo», fila 1 (estreno real, 🔄) | 1 | Se queda |
| «Próximo», fila 3 (✅ cerrada) | 1 | Sale |
| «Versión siguiente», tres párrafos (corte, criterio de orden, repaso del 2026-09-29) | — | Salen. El orden ya está en «tras NNNN» de cada fila |
| «Versión siguiente», filas 0099, 0096 y 0098 (publicadas en la 2.1.0 y la 2.2.0) | 3 | Salen. Validación en campo |
| «Versión siguiente», 21 filas pendientes (la 0124 entró por `develop` tras la aprobación): 0115, 0123, 0118, 0124, 0116, 0117, 0120, 0121, 0122, 0108, 0097, 0045, 0007, 0034, 0022, 0047, 0048, 0049, 0050, 0054, 0093 | 21 | Decisión 1: `## Release 2.3.0` |
| «Versión siguiente», fila 0015 | 1 | Se disuelve: ver abajo |
| «Pendientes rescatados», 1 (repaso de la deuda) | — | Sale: lo hace esta migración |
| «Pendientes rescatados», 2 (piloto y primera valoración) | — | Sale: es historia; el piloto sigue en la fila 1 de «Próximo» |
| «Pendientes rescatados», 3 (hecho) | — | Sale |
| «Pendientes rescatados», 4 (A13, smoke por tramo) | — | «Backlog», fila B9: «Decidir si el smoke por tramo (A13 de la v1.1.0) sigue vivo» |
| «Validación diferida de la 2.0.0» | 44 | Sale. Validación en campo |
| «Reglas de ejecución en worktrees» (tabla y cinco reglas de la 1.2.0) | 10 | Sale: las reglas vigentes están en `control-profiles.md` y `commit-milestones.md` |
| «Backlog», B8 (saldada por la 0109) | 1 | Sale |
| «Backlog», B1 a B7 | 6 | Se quedan |
| «Deuda técnica», filas saldadas | 42 | Salen |
| «Deuda técnica», filas parciales | 2 | Se quedan |
| «Deuda técnica», «Destino» con «2.0.1» | 59 | «versión siguiente», solo en esa celda |
| «Referencias de vigilancia» | 4 | `tech-stack.md`, sección propia, con CodeMySpec, MySpec y `spec-driven-with-adr` de OpenSpec |
| «Decisiones tomadas» | 24 | Ver abajo |
| «Decisiones pendientes» (una, ya resuelta) | 1 | Sale |
| «Releases cerradas» | 10 | Se queda, y pasa a ser la última sección, tras «Patches» |
| «Patches» | 45 | Decisión 2. Con la enmienda salen las 45: todas son del 2026-09-29 o anteriores, y la v2.2.0 se cortó ese día |

**Validación en campo.** Las 3 filas publicadas, las 44 de la 2.0.0, la B8, las 21 filas 🧪 de «Patches» y la fila 🧪 de la deuda se cierran con una frase en las subsecciones v2.0.0, v2.1.0 y v2.2.0: «Validación: en campo, por los tickets de `sdd-feedback` (dev-lead, 2026-09-29).» No llevan línea `validaciones pendientes:`. Los walkthroughs y los `patch.md` no se tocan.

## Duplicados en «Deuda técnica»

| Par | Propuesta |
| --- | --- |
| «Un lote… / Un sujeto headless lanzado en paralelo acaba en el repo del kit y no en el molde» (líneas 222 y 249 del roadmap anterior) | Queda la 249, que cita el ticket; sale la 222 |
| «`run.sh` no limita cuántos sujetos corren a la vez» (líneas 247 y 259) | Queda la 247; sale la 259 |
| «El trailer `Co-Authored-By`…» (línea 189) y «…no se reproduce» (línea 151) | Queda la 151, que es la re-medición; sale la 189 |

## Decisiones tomadas

| Decisión | Destino |
| --- | --- |
| El nivel de verificación no es configurable por persona ni por rol (2026-09-28) | **Se añade** a `constitution.md`, Art. IV: una frase con la regla y el descarte de la clave `role` |
| Capacidades al estilo OpenSpec (2026-09-25) | Sale: está en `capabilities/capabilities.md` y en el changelog de la 2.0.0 |
| Scripts en PowerShell 7, portables (2026-09-25) | Ya está en `architecture.md`. **Se añade** el descarte de Python y Node, y se quita su «decisión… en el roadmap» |
| Planificar, hacer y entregar; task → feature (2026-09-24) | Sale: está en `planning`, `feature-ids` y el changelog de la 2.0.0 |
| Native por defecto (2026-09-24) | Ya está en el Art. IV. **Se añade** a `tech-stack.md` que `diagnosing-superpowers` no se integra |
| Versión 2.0.0 y corte de alcance (2026-09-23) | Al resumen de la v2.0.0 |
| Art. I proporcional (2026-09-23) | Sale: está en el Art. I |
| A8 y A10 descartados (2026-09-23) | Al resumen de la v2.0.0 |
| Modo incremental; destinatario en `sdd-kit.json` (2026-09-21) | Sale: está en `mission.md` y en `release-flow` |
| Hosting: GitHub público (2026-09-20) | Ya está en `tech-stack.md`. **Se añade** que se publica con el historial y `.docs/` enteros, y se quita su «ver roadmap» |
| Release 1.2.0, los cuatro tramos (2026-09-20) | Al resumen de la v2.0.0 |
| Volcado inicial de capacidades: excepción estricta (2026-09-20) | Sale: está en `capabilities/capabilities.md` |
| Ids: una sola secuencia, sin sufijos (2026-09-20) | Sale: está en `feature-ids` y en `nombrado.md` |
| La carpeta del feedback es `kit-feedback/` (2026-09-20) | Sale: está en `kit-feedback` |
| Sin memoria automática (2026-09-20) | Sale: está en `CLAUDE.md` y en `migration` |
| `capabilities/` va primero (2026-09-20) | **Se añade** a `mission.md`: una frase de prioridad |
| v1.0.0 en vez de v0.6.0 (2026-09-09) | Sale: está en el acta de la v1.0.0 |
| Kit de nivel 2 → segundo plugin (2026-09-09) | Sale: está en `mission.md` y en la B1 |
| Hosting → sigue local-only (2026-09-09) | Sale: sustituida por la del 2026-09-20 |
| Changelog de cliente, opt-in (2026-09-09) | Sale: está en `tech-stack.md` |
| Contrato de entorno por worktree; `sdd-env` no se escribe (2026-09-08) | Sale: está en `mission.md` |
| v0.6.0 es RC hacia v1.0.0 (2026-09-07) | Sale: es de la v1.0.0, ya cerrada |
| La unidad de descomposición de una skill es el fichero auxiliar (2026-09-07) | **Se añade** a `architecture.md`, «Anatomía de una skill», punto 6: una frase |
| Distribución: local-only (2026-09-02) | Sale: sustituida |

## La fila 0015, disuelta

La fila está rota como tabla: su texto contiene `| <id> |` y parte las celdas. Sus piezas vivas pasan a filas de «Deuda técnica», con el texto literal de la pieza y su procedencia. Las que ya se hicieron salen.

**Salen, ya hechas**: fecha de cierre en el log (patch 0056, dos piezas); diferir sin dueño y disparador vago (patch 0037); validación diferida de un patch (patch 0075); delegación en la primera pregunta, avisos llanos, decisión del dev-lead sola, «sí» sin detalle y «no se reproduce» (feature 0053); re-medir reescribe la fila (capacidad `roadmap`); la nota «esta fila acumula…».

**Actuar** (tienen segundo reporte):

| Pieza | Procedencia |
| --- | --- |
| Las reglas del delta de capacidad llevan marca `ADDED`/`MODIFIED` o texto completo de reemplazo | ticket template 0007 §7 · 0019 §3 |
| `- Coste de sujetos:` en §5 de `patch-template.md` | 0037 §3 · patch 0110 §3 |
| En `delegate`, la política de modelos va como decisión de la spec | 0042 · feature 0034 de document-manager §5 |
| «Verificación» del plan con un comando cuya última línea sea el resumen, sin color | 0057 §4 · 0060 §3 |

**Esperar 2.º ticket** (un solo reporte; una fila por pieza):

| Pieza | Procedencia |
| --- | --- |
| Reloj de pared previsto en el gate del plan, perfil `pair` | 0009 |
| Estado de `spec.md` al cerrar | 0009, sin verificar |
| Skills de dominio listadas en el plan | 0009 |
| «Evidencia = salida leída, no el exit code de un pipeline» | 0009 |
| `env:setup` también cuando el worktree ya existía | 0009 |
| Método de test: aprobación en el encargo inicial, generadores de entorno contra directorio temporal | 0009 |
| Toda corrección de proceso del dev-lead acaba en un doc vivo en la misma sesión | ticket template 0007 |
| Volver a medir el síntoma al arrancar un patch desde una fila de deuda; un renombrado mecánico sigue siendo patch | patches 0023 y 0024 |
| Los ficheros de `capabilities/` no se listan en «Crear» de ninguna task | 0018 §2 |
| El formato de cierre cubre la fila saldada sin artefacto | 0018 §4 |
| Salida de respaldo donde una skill del kit invoca a otra | patch 0030 §2 |
| `patch-template.md` §4 pide dos filas cuando el fix es un guardián | patch 0030 §3 |
| Pieza saldada dentro de una fila abierta, como tercera forma del formato de cierre | patch 0035 §1 |
| La tabla de scripts dice que `Get-NextSddId.ps1` lee roadmap y `specs/` de cada rama | patch 0035 §3 |
| Una sola referencia de fecha en los artefactos de un patch | patch 0035 §4 |
| Cómo se amplía un patch ya cerrado y fusionado | patch 0035, ampliación §1 |
| El árbol de `sdd-start-patch` pregunta si el cambio edita una skill | 0042 §4 |
| «¿El plan trae el código?» en «Base de la estimación» | 0016 §2 |
| Una spec ya escrita y sin aprobar en la rama se ofrece retomar o descartar | 0016 |
| `Get-NextSddId.ps1 -Count N` para partir una feature | 0039 §2 |
| Si el dev-lead pidió el ticket antes del merge, entra en el commit de cierre | patch 0051 §1 |
| El paso 5 y el §4 del plan recorren cada viñeta de «Entra» | 0055 §1 |
| El paso 5 de `sdd-end-patch` revisa que el diff del log añade una sola fila | patch 0065 |
| Si la petición de un patch cita una fila que no existe, se dice y se busca la equivalente | patch 0069 §1b |
| Merge de sincronización antes del commit de cierre si la fila solo está en la integración | 0067 §3 |
| Cuando la fila aparece por primera vez en la base, el freno compara en el hilo | 0068 §4 |
| Conflicto de posición en la fila al sincronizar | 0070 §3 |
| Una spec anterior al bloque «Capacidades» lo gana desde su delta | 0062 §4 |

**Salen por duplicadas con filas de deuda que ya existen**: la comparación de la línea que empieza por el id (0019 §2) y el solape de fichero frente al de sección (0031 §2), que ya tienen fila propia en la deuda.

## Integración de `develop` tras la aprobación

`develop` avanzó cinco commits mientras se ejecutaba la feature (hasta `488bdbdc`): triaje de cuatro tickets de document-manager, reserva de la 0124 y cambio de orden. El dev-lead eligió integrar y volver a aplicar esta tabla sobre su roadmap («Integrar y re-migrar ahora», 2026-09-30). La fila 0124 va a `## Release 2.3.0`, las cinco filas de deuda nuevas se quedan y el texto ampliado en `develop` se conserva. Comprobado fila a fila: de las filas de tabla del roadmap de `develop`, 188 se quedan literales (con «2.0.1» → «versión siguiente» en «Destino» y el ancla nueva), y las demás salen por un motivo de esta tabla.

## Filas nuevas

| Sección | Fila |
| --- | --- |
| Pendientes (decisión 1) | Propuesta «documentos acotados»: arquitectura y stack por temas al estilo ADR, umbral de partición en capacidades, constitution y `CLAUDE.md` sin anécdotas. Se escribe con `sdd-roadmap` tras esta feature |
| Pendientes, fila 0120 | Se amplía su celda: los topes de palabras cubren también los documentos de anclaje |
| «Deuda técnica» | Fila del roadmap de una línea, con el enunciado en un fichero de `specs/`. Destino: feature, tras la 0123 |
