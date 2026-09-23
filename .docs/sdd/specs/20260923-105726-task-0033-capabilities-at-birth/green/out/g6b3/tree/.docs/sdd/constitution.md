# Constitution — pomodoro-cli

## Principios

1. **Sin dependencias externas** (propuesta): toda la lógica usa solo módulos core de Node.js (`node:fs`, `node:os`, `node:path`); no hay `dependencies` en `package.json`.
2. **Persistencia en ficheros planos** (propuesta): configuración e historial viven en JSON sin cifrar en el home del usuario, sin base de datos ni red.
3. **Lógica de dominio pura, efectos aparte** (propuesta): `timer.js` no muta y no hace I/O; la persistencia y el teclado viven en `config.js`, `history.js` y `bin/cli.js`.
4. **Validar en el borde** (propuesta): `config.js` valida los minutos al cargar y al guardar, antes de persistir.
5. **Retrocompatibilidad por defecto** (regla de oro brownfield): un cambio no rompe lo que ya funciona sin decirlo explícitamente.
6. **Respetar el patrón existente aunque no sea ideal** (regla de oro brownfield): no se introduce un patrón nuevo porque sí.
7. **Cero refactor oportunista** (regla de oro brownfield): una task no reescribe código fuera de su alcance.
8. **Migraciones masivas solo con justificación escrita** (regla de oro brownfield).

## Convenciones

- **Idioma**: identificadores de código en inglés; mensajes de cara al usuario (CLI, notificaciones) en español; el único commit visto ("chore: estado inicial") está en castellano.
- **Ramas** (propuesta, observada en el repo): `main` estable, `develop` de integración.
- **Commits**: sin muestra suficiente para confirmar formato (un solo commit). Propuesto: Conventional Commits con título/cuerpo en castellano — a confirmar.
- **Proyecto de referencia**: no aplica.

## Reglas de producto

- **Dónde viven los datos**: ficheros en el home del usuario — `~/.pomodororc` (configuración) y `~/.pomodoro-history.json` (historial) —, JSON plano sin cifrar.
- **Idioma de los nombres**: identificadores de código en inglés; mensajes de cara al usuario (CLI, notificaciones) en español.
- **Límites**: minutos de trabajo y descansos, enteros entre 1 y 120; retención del historial, 90 días.
- **Avisos**: no aplica — el almacenamiento no contiene datos sensibles ni secretos (solo minutos y timestamps).
- **Regla ante conflicto**: el valor explícito manda sobre el implícito — el fichero de configuración sobrescribe los valores por defecto al cargar, y los cambios de `pomo config` sobrescriben el fichero al guardar.
