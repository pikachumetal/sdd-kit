# Review de la spec — rúbrica de complejidad y revisor adversarial

Se aplica en modo full, tras redactar `spec.md` y antes de presentarla en el gate. En modo lite no se aplica.

## 1. Cuenta las señales (observables en la spec)

| Señal | Se cumple si… |
| --- | --- |
| Capacidad nueva | «Decisiones a validar» declara una capacidad nueva en `funcional/` |
| Contrato público | el delta toca una API, un formato de fichero o una interfaz que consume otro módulo o sistema |
| `MODIFIED` / `REMOVED` | el delta cambia o quita un requisito existente |
| Tres o más capacidades | el delta tiene tres o más subsecciones «Capacidad:» |
| Datos o migración | hay cambio de schema, migración o dato persistente nuevo |
| Dependencia externa | entra una librería, servicio o sistema que el proyecto no usaba |
| Área no explorada | la spec toca código o documentos que no has leído en esta sesión |
| Reglas de visibilidad o permiso | el delta introduce un rol, un estado o una condición que decide **qué no debe ver o hacer** alguien (el funcional suele decir qué hace cada rol y callar lo que no debe) |

## 2. Propón el nivel

- **0–1 señales → sin review.**
- **2–3 → un revisor.** Lente **dominio** si pesan capacidad nueva o `MODIFIED`; lente **técnica** si pesan contrato, datos o dependencia.
- **4 o más, o contrato público + datos → dos revisores** en paralelo (una lente cada uno).

Escríbelo como **primera línea** de «Decisiones que he tomado yo — valida estas»: `Review de spec propuesta: <nivel> — señales: <lista>`. **Proponer no es activar**: el usuario activa con su respuesta. Si no responde, la spec se presenta sin review y se anota.

## 3. Despacha el revisor (si el usuario activa)

Subagente `general-purpose`, **modelo Sonnet, effort medium**, uno por lente. Encargo:

> Eres un revisor adversarial de una spec SDD. Tu trabajo es encontrar lo que hará fallar la implementación o el gate, no aprobar. Lee: `<ruta spec.md>`, `.docs/sdd/constitution.md`, `.docs/sdd/mission.md`, `<capacidades tocadas de funcional/>` [lente técnica: y `.docs/sdd/architecture.md`]. No leas código ni otras specs. Busca, en este orden: (1) contradicciones con la verdad viva de `funcional/` — un `ADDED` que cambia un requisito existente es un `MODIFIED` no declarado; (2) requisitos del delta sin escenario GIVEN/WHEN/THEN o con escenario que no se puede verificar; (3) alcance oculto — algo que el Intent promete y el Scope no lista, o al revés; (4) decisiones tomadas en el cuerpo que no están en «Decisiones a validar»; (5) [lente dominio, si la spec introduce un rol, un estado o una condición de acceso] **el complemento**: para cada rol o estado nuevo, qué queda prohibido —qué no ve, qué no puede hacer— y si la spec lo dice; un rol descrito solo por lo que hace es un hueco de visibilidad; (6) [lente técnica] contratos, datos o dependencias que la spec toca sin decirlo. Devuelve SOLO una lista numerada; cada hallazgo en una línea: `<Crítico|Importante|Menor> · <dónde (sección)> · <qué falla> · <qué cambiar>`. Sin preámbulo, sin elogios, máximo diez hallazgos.

## 4. Incorpora los hallazgos antes del gate

Subsección `### Hallazgos de la review` dentro de «Decisiones a validar», una línea por hallazgo: `**Aceptado** — <hallazgo> → <cambio hecho en la spec>` o `**Rechazado** — <hallazgo> → <motivo>`. Los Críticos no se rechazan sin motivo escrito. Después, el gate: el usuario lee las decisiones y los hallazgos, nada más.
