---
status: accepted
date: 2026-10-20
rutas:
  - cli/src/ids/**
  - skills/sdd-propose/**
  - skills/sdd-start-patch/**
  - skills/sdd-start-feature/references/nombrado.md
---

# El id se decide al arrancar, con el push a la integración del remoto como árbitro

## Contexto y problema

En `sequence`, `sdd id next --reserve` reserva con un contador y un cerrojo locales del clon, y `sdd roadmap publish` no hace push. Dos personas en máquinas distintas que planifican antes de que la otra publique sacan el mismo id, y se descubre al fusionar (fila 0203 del roadmap). Hay que decidir dónde se arbitra y cómo sabe el arranque si un id que también está en el remoto es suyo.

## Opciones consideradas

- Arbitrar al arrancar con el push de `develop` al remoto, y decidir la identidad por los commits sin publicar: tus reservas son los ids que añaden los commits de `develop` que no están en `origin/develop`.
- Una etiqueta `sdd-id/<id>` por cada tarea arrancada, siempre, como cerrojo en el remoto.
- Comparar el título de la fila local con el de la remota.
- Comparar con la base común (`git merge-base develop origin/develop`).
- Push al planificar, en `sdd roadmap publish`.

## Decisión

El id reservado es provisional hasta que su tarea arranca. Al arrancar, `sdd id claim` hace fetch, toma como reservas propias los ids que añaden tus commits sin publicar y renumera al siguiente libre los que el remoto ya tiene; después publica `develop`. Con la integración protegida, o sin `merge.push: true`, fija el id con la etiqueta `sdd-id/<id>`, que el remoto rechaza si ya existe. Sin remoto vale el contador local.

Se descartan las otras opciones. La etiqueta siempre deja una por tarea en el remoto. El título de una fila se edita. La base común da por tuya la fila del otro en cuanto tu `develop` ya integró el remoto (hallazgo D1 de la revisión de la spec). El push al planificar publicaría `develop` en cada apunte del roadmap, y el dev-lead quiso el árbitro en el arranque (2026-10-19).

### Consecuencias

- El primero que publica gana, también entre reservas provisionales. El segundo ve «la 0203 pasa a 0205», y el claim renumera su fila, sus referencias y su carpeta, y renombra su rama.
- Arrancar publica `develop`, con sus otros commits sin publicar, solo con `merge.push: true`.
- Dos arranques sin fila a la vez en dos máquinas siguen pudiendo coger el mismo id, y una fila publicada se da por buena sin mirar si otro ya la arrancó.
- Las etiquetas `sdd-id/*` no se borran.

### Confirmación

`cli/test/ids/claim.slow.test.ts` (un remoto *bare* real con dos clones, la carrera entre fetch y push, la integración protegida y la etiqueta de otro clon), `cli/test/ids/renumber.test.ts`, y los escenarios `id1`, `id2` e `id4` de `tests/batteries/sdd-propose/`.
