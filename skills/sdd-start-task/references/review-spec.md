# Review de la spec — rúbrica de complejidad y revisor adversarial

Se aplica en modo full, tras redactar `spec.md` y antes de presentarla en el gate. En modo lite no se aplica.

## 1. Cuenta las señales (observables en la spec)

| Señal | Se cumple si… |
| --- | --- |
| Capacidad nueva | «Decisiones a validar» declara una capacidad nueva en `capabilities/` |
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

El nivel se presenta como el **bloque que abre** «Decisiones que he tomado yo — valida estas», con esta forma:

```text
Review de spec propuesta: <nivel> — señales: <las contadas>
- Dominio: <qué comprobaría en ESTA spec> (señal: <la que lo motiva>)
- Técnica: <qué comprobaría en ESTA spec> (señal: <la que lo motiva>)
- Mínimo razonable: <el nivel más bajo defendible> — deja sin cubrir <qué>
```

Cada línea de lente **cita un requisito, una sección o un valor de esta spec**. «Comprobaría contradicciones con las capacidades» vale para cualquier spec y no ayuda a decidir; lista solo las lentes que el nivel propone o que el mínimo descarta. La línea del mínimo nombra el **descubierto**, no el precio: lo que cuesta un revisor (~100k tokens) ya se sabe, y lo que el dev-lead no puede ver sin ti es qué se queda sin mirar si recorta.

Ejemplo, en una spec de facturación:

```text
Review de spec propuesta: dos revisores — señales: contrato público (el webhook `invoice.paid` lo consume el portal del cliente), MODIFIED (dos requisitos de `invoicing`), datos (columna `tax_rate`), rol nuevo (gestor de cobros)
- Dominio: si el MODIFIED de «La factura se emite al cerrar el mes» mantiene el aviso a contabilidad que hoy exige la capacidad, y qué NO puede hacer el gestor de cobros (señal: MODIFIED + rol nuevo)
- Técnica: si el payload de `invoice.paid` queda versionado y si `tax_rate` necesita migración con valor por defecto para las facturas ya emitidas (señal: contrato público + datos)
- Mínimo razonable: solo técnica — deja sin mirar el complemento del rol nuevo, el tipo de hueco que no se ve hasta que alguien accede a lo que no debía
```

**Proponer no es activar**: el usuario activa con su respuesta. Si no responde, la spec se presenta sin review y se anota.

## 3. Despacha el revisor (si el usuario activa)

Subagente `general-purpose`, **modelo Sonnet, effort medium**, uno por lente. Los puntos del encargo **se reparten según cuántos revisores despaches**:

- **Un revisor**: su lente recibe los **siete puntos**.
- **Dos revisores**: **dominio** recibe 1, 3, 5, 5 bis y 7; **técnica** recibe 2, 4 y 6, y además lee `architecture.md`. Cada encargo cierra con la frontera: «si un hallazgo pertenece a un punto que no está en tu lista, no lo reportes: lo mira el otro revisor».

Sin el reparto, los puntos comunes se pagan dos veces: 4 de 18 hallazgos duplicados en campo (task 0009, ~100k tokens por revisor) y 8 de 19 —el 42 %— en el RED de esta regla (`tests/spec-review-lenses-red.md`).

Encargo, con los puntos que le tocan:

> Eres un revisor adversarial de una spec SDD, con la lente `<dominio|técnica>`. Tu trabajo es encontrar lo que hará fallar la implementación o el gate, no aprobar. Lee: `<ruta spec.md>`, `.docs/sdd/constitution.md`, `.docs/sdd/mission.md`, `<capacidades tocadas de capabilities/>` [lente técnica: y `.docs/sdd/architecture.md`]. No leas código ni otras specs. Busca, en este orden: (1) contradicciones con la verdad viva de `capabilities/` — un `ADDED` que cambia un requisito existente es un `MODIFIED` no declarado; (2) requisitos del delta sin escenario GIVEN/WHEN/THEN o con escenario que no se puede verificar; (3) alcance oculto — algo que el Intent promete y el Scope no lista, o al revés; (4) decisiones tomadas en el cuerpo que no están en «Decisiones a validar»; (5) [si la spec introduce un rol, un estado o una condición de acceso] **el complemento**: para cada rol o estado nuevo, qué queda prohibido —qué no ve, qué no puede hacer— y si la spec lo dice; un rol descrito solo por lo que hace es un hueco de visibilidad; (5 bis) [si el delta introduce datos, nombres, topes, avisos o una condición de conflicto nuevos] **las cinco reglas por nombre** —dónde viven los datos · idioma de los nombres · límites · avisos · regla ante conflicto—: cada una declarada en «Reglas de la capacidad» o «no aplica», con el valor tomado de las «Reglas de producto» de la constitution o de la capacidad; una regla inventada donde ya había una escrita, o que contradiga la constitution, es Crítico; (6) contratos, datos o dependencias que la spec toca sin decirlo; (7) **los ejemplos**: un ejemplo, un valor o una fixture de la spec que contradiga la constitution, y —aunque la constitution no lo prohíba— cualquiera que nombre un cliente, un proyecto, una persona o un dato reales donde un ejemplo inventado serviría igual; los artefactos se publican y el nombre no se retira del historial. Con dos revisores, termina con la frontera de tu lente. Devuelve SOLO una lista numerada; cada hallazgo en una línea: `<Crítico|Importante|Menor> · <dónde (sección)> · <qué falla> · <qué cambiar>`. Sin preámbulo, sin elogios, máximo diez hallazgos.

## 4. Incorpora los hallazgos antes del gate

Subsección `### Hallazgos de la review` dentro de «Decisiones a validar», una línea por hallazgo: `**Aceptado** — <hallazgo> → <cambio hecho en la spec>` o `**Rechazado** — <hallazgo> → <motivo>`. Los Críticos no se rechazan sin motivo escrito. Después, el gate: el usuario lee las decisiones y los hallazgos, nada más.
