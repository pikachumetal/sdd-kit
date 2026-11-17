---
id: 20260929-073733-feature-0099-frontend-verification
feature: 0099
title: Walkthrough — Verificación de frontend
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-29
---

# Walkthrough — Verificación de frontend

## 1. Cambios realizados

- **Referencia nueva** `skills/sdd-start-feature/references/frontend-verification.md` (`7461d95`, `7ea5c37`, `21c1f70`). Contiene:
  - cuándo se verifica (task full, lite, patch visual) y con qué: `§Frontend`, con sus ocho campos;
  - los cinco pasos: criterio y referencia antes de tocar; detector en dos viewports sin cerrar con hallazgos sin justificar, con los contraejemplos; capturas con la rúbrica, 3 rondas; manos, con el complemento del usuario de pruebas; enseñar;
  - la proporción por carril, el acceso por URL de entrada, qué hacer sin `§Frontend` y la nota de la regresión por píxeles.
- **`tech-stack-template.md`** gana `## Frontend`, con URL, Detector, Viewports, Runner E2E, Acceso, Temas, Pantalla de referencia y Skills de apoyo (`7461d95`).
- **`sdd-start-feature`**:
  - paso 4: la spec propone `§Frontend` si falta (`b4620b6`);
  - paso 6: carga la referencia, cierra solo sin hallazgos sin justificar y admite las cuatro causas de «no probado» (`7461d95`, `7ea5c37`);
  - paso 7: la presentación enseña el criterio, la salida del detector y las capturas;
  - una racionalización y un red flag nuevos.
- **`plan-template.md`**: el campo «Verificación visual» pide el criterio y la pantalla de referencia (`7461d95`).
- **Lite y patch** (`80dc132`):
  - `modo-lite.md` carga la referencia;
  - el paso 4 de `sdd-start-patch` pide la captura del antes y la del después, el detector o el aviso;
  - el paso 0 de `sdd-end-patch` enseña la salida del detector;
  - `patch-template.md` gana la fila del detector.
- **Init** (`b4620b6`): la fila 21 de greenfield y la 5 de brownfield, al final de su tabla para no renumerar, con la ruta de la sesión en `.gitignore`.
- **README**: impeccable y Playwright entran como dependencias opcionales (`b4620b6`).
- **Tests**:
  - `tests/FrontendVerification.Tests.ps1` (19 `It`);
  - `tests/VisualCheck.Tests.ps1`, actualizado a los literales nuevos;
  - la evidencia en `tests/frontend-verification-red.md` y `-green.md`, con el molde `pedidos` en `red/`.
- **Spec**: la enmienda del acceso, aprobada por el dev-lead (`21c1f70`, `6715b88`).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 5 h
- Esfuerzo real: 1,3 h — reloj del hilo, de la apertura (09:48) al último commit y la validación (11:05). La spec y el plan, ~0,4 h aparte.
- Desviación: −3,7 h (−74 %)
- Causa de la desviación: el plan estimó ~15 min por sujeto con navegador, y cada uno tardó entre 58 y 342 s. La campaña de 25 sujetos cerró en ~1,5 h de reloj en segundo plano, solapada con la redacción del texto.
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 52.856.259 — claude-opus-5-5 52.856.259
- Tokens de subagentes: 2.970.324 en 4 despachos — Review spec 0099 lente técnica claude-sonnet-5-5 135.840 / 1 min; Re-revisión tramo 7ea5c37..21c1f70 claude-opus-5-5 549.907 / 1 min; Revisión final de rama 0099 claude-opus-5-5 2.057.414 / 4 min; Review spec 0099 lente dominio claude-sonnet-5-5 227.163 / 1 min
- Coste de la sesión: sin precio (modelos sin precio: claude-sonnet-5-5)
- Coste de sujetos: 11,71 $ en 25 sujetos Sonnet — RED 4,46 $; GREEN 5,59 $; controles de la pasada de fix 1,66 $
- Review de spec: 2 revisores · hallazgos 20, aceptados 20

## 3. Desviaciones del plan

- La URL de entrada del Acceso no estaba en el plan. Sale del RED de k1 y acabó en una enmienda aprobada de la spec.
- Controles de la pasada de fix: 3 sujetos (k1 ×2 y q1 ×1), con cargo a la partida reservada.

### Decisiones tomadas sin el dev-lead

- El detector escanea la URL de entrada del Acceso con `{path}`, porque `impeccable detect` no lleva sesión (en el RED, k1 escaneaba `/login`). El molde ganó `?next=` para el GREEN — coste si está mal: un campo más en el contrato. Quedó cerrado por la enmienda que aprobó el dev-lead.
- El filtro `-like '**Verificación visual**:*'` del Pester cogía la línea de ayuda porque `*` es comodín. Cambiado a `StartsWith`; la aserción no cambia — coste si está mal: ninguno.
- `VisualCheck.Tests.ps1` (0077) se actualizó a los literales nuevos de los pasos 6 y 7, conservando lo que medía — coste si está mal: un control de la 0077 más débil.
- Revisión final: los Important 1 y 2 se arreglaron con RED→GREEN, el 4 en el molde, y el 3 fue a enmienda.
- Minors diferidos, 10 en total. Van también a una fila de deuda del roadmap:
  - el paso 7 no dice qué pasa tras la tercera ronda de composición;
  - la fila de §4 de `patch-template.md` y el paso 4 del patch no tienen «no probado» por un detector que no ejecuta;
  - `generacion.md` de brownfield no recoge la ruta de la sesión;
  - queda texto en singular («la captura») en `sdd-start-patch` y en el paso 2;
  - dos aserciones del Pester (README y `**Acceso**`) pasan aunque se quite lo que fijan;
  - la aserción `'antes del cambio'` difiere del plan (`'antes'`), aunque ya estaba así en la copia RED;
  - la parada de `pair` abrevia el aviso;
  - la propuesta de Acceso sugiere `storageState` aunque sobre;
  - `plan.md` conserva la redacción previa a la enmienda;
  - el test de la enmienda no prohíbe que vuelva la frase sin condición.

## 4. Verificación

### 4.1 Builds

- Sin build.
- Suite completa: `Invoke-Pester -Path tests`, desde la herramienta PowerShell → 1048 pasan, 0 fallan, 10 omitidos · 399 s, sobre `6715b88`.
- Pre-commit verde en los siete commits de la rama.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-29 · «Diferir: lo pruebo en el próximo cambio visual real» · disparador: el próximo cambio visual de un proyecto del equipo con el kit (el template de la 0010b), a cargo del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La task full pasa el detector en dos viewports y no cierra con `cramped-padding` abierto | ejecución real (q1 GREEN 2/2 + control 1/1) | ✅ (RED: 0/2 detector, 1/2 cerraba en rojo) |
| Contraejemplos de la justificación | ejecución real (q1-1: «ya estaba antes» sobre `button`, un uso válido) + suite | ✅ |
| Medidas computadas solo con valor fijado | ejecución real (k1-1) | ✅ |
| Flujo real con la consola limpia | ejecución real (k1-1: 0 errores en 4 estados) | ✅ |
| «no probado» con el detector declarado que no ejecuta | no probado (ningún escenario lo provoca) + suite | — |
| La presentación enseña el criterio, el detector, las capturas o el aviso | ejecución real (q1, k1, n1) | ✅ |
| Lite sobre el entorno del usuario, sin build ni suite nueva | ejecución real (k1 4/4) | ✅ |
| Entrada por URL, sin gastar accesos (enmendado) | ejecución real (k1 4/4; a1 GREEN 0 enlaces) | ✅ (RED: 3 enlaces y un log borrado) |
| La sesión se reutiliza con una entrada limitada | no probado (ningún escenario con entrada limitada y declarada) | — |
| La spec propone `§Frontend` si falta | ejecución real (s1 2/2) | ✅ (RED 0/2) |
| Patch visual: antes y después, detector o aviso, en minutos | ejecución real (n1 2/2, ~100 s) | ✅ (RED 0/2) |
| `Changed` en el cierre del patch | no probado (n1 para en la validación); lo cubre el control de la 0098 | — |
| La init pregunta con qué se verifica | ejecución real (i1 1/1) | ✅ (RED 0/1) |
| Sin interfaz, la init no pregunta | no probado (el patrón «Solo si…», spec decisión 14) + suite | — |

Límite: los sujetos headless no pueden abrir sus capturas, así que la rúbrica de composición no está medida por un agente.

### 4.3 Residuales / deuda generada

- Fila de deuda «Minors diferidos de la verificación de frontend» en el roadmap.
- `pricing` de `sdd-kit.json` no tiene `claude-sonnet-5-5`, y el coste de la sesión sale «sin precio».

## 5. Aprendizajes

- Un sujeto headless no puede mirar sus capturas → `tech-stack.md`, «Sujetos headless».
- `impeccable detect` no lleva sesión, y el escaneo de fichero no carga CSS ni aplica viewport → `tech-stack.md` y la referencia (campo Acceso).
- Los sujetos visuales tardan 1–6 min, no 15 → `tech-stack.md`.
- El comportamiento nuevo → `capabilities/feature-flow.md`, `routing.md` y `onboarding.md` (delta fusionado; `Test-Capabilities.ps1` en verde).

## 6. Adendas
