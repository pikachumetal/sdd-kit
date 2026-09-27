# RED — un commit por hito (task 0044)

Baseline **desde el archivo**, sin sujetos nuevos (coste cero). Las ramas reales de tasks y patches recientes del kit son la conducta de un agente que sigue las skills vigentes, que no dicen nada de juntar commits. Método permitido en `tech-stack.md` («Un stream previo puede ser el RED de otra task»). Se reproduce con `git log --reverse --format='%h %p | %s' <rango>`.

## R1 — La rama de una task no cuenta sus hitos (task 0040, `489944a^1..489944a^2`)

13 commits para un plan de 3 tasks:

```text
61b5eb1 docs(sdd): RED previo y spec de la task 0040
cb58c08 docs(sdd): hallazgos de la review de spec de la task 0040
8e6b11b merge: integrar develop (task 0006) antes de implementar la 0040
1ffe46f docs(sdd): plan y registro de tasks de la task 0040
8843a37 feat(skills): clave merge.push y su pregunta en las init y la migración (task 0040)
5e157eb feat(skills): push de la rama de integración en el cierre según merge.push (task 0040)
b16db17 feat(skills): paso Mensaje final con la línea de terminado en los dos cierres (task 0040)
6c9d689 fix(skills): el mensaje final relee las decisiones y no confunde push fallido con no terminado (task 0040)
5f9315d fix(skills): el mensaje final lee el walkthrough y no ofrece borrar el checkout principal (task 0040)
547c0f7 test(skills): RED y GREEN del final del cierre (task 0040)
1598afd fix(skills): hallazgos de la revisión de rama de la task 0040
0aea130 docs(sdd): cierre de la task 0040
5748ba2 merge: integrar develop (task 0042) en el cierre de la 0040
```

- **Apertura** en 3 commits (spec, hallazgos, plan) con un merge de `develop` en medio. **Falla**: la apertura no queda en un commit.
- **Tasks**: la task 3 en 3 commits (`b16db17` y dos `fix` de revisión), y su evidencia en otro (`547c0f7`). **Falla**: cada task no queda en un commit.
- **Cierre**: los hallazgos de la revisión de rama (`1598afd`) van aparte del cierre (`0aea130`). **Falla**: el cierre no queda en un commit.
- El merge `8e6b11b` en mitad de la apertura es el caso de la guarda: juntar `61b5eb1..1ffe46f` con `reset --soft` habría metido en el commit de apertura los cambios de la task 0006 que traía `develop`.

## R2 — Otra task, la misma forma (task 0042, `52784e7^1..52784e7^2`)

7 commits para un plan de 2 tasks: spec, plan con spec aprobada, 2 `feat`, 2 `fix` de revisión y el cierre. **Falla** igual: apertura en 2 y tasks con sus `fix` aparte.

## R3 — El patch no queda en fix + cierre (patch 0043, `2577466^1..2577466^2`)

```text
ff8add6 chore(tests): marcar Slow los tests que lanzan procesos y dejar el pre-commit en ~13 s (patch 0043)
76791a9 docs(sdd): cierre del patch 0043
46ee852 docs(sdd): ticket de campo del patch 0043
```

Fix y cierre sí van separados, pero `sdd-end-patch` paso 2 lo deja al criterio de cada uno («Fix y documentación pueden ir en commits separados»), y el ticket de campo añade un tercer commit. **Falla parcial**: la forma sale por costumbre, no por la skill. El ticket escrito tras el merge queda fuera de alcance (lo escribe `sdd-feedback` después del cierre).

## R4 — Los RED «commiteados antes de despachar» chocan con el `pre-commit`

- Ticket de la task 0002 (`field-reports/20260921-064523-task-0002-sdd-feedback-session.md` §1): «Los tests RED se escribieron, se vio que fallaban por el símbolo ausente (10 de 10) y no se pudieron commitear. Solución improvisada: aparcarlos fuera de `tests/`, en la carpeta de la spec, y pedir al implementador que los moviera con `git mv`».
- Ticket de la task 0042 (`field-reports/20260923-171223-task-0042-merge-script.md`): «Yo los aparqué a mano en el scratchpad tras dos commits bloqueados».

**Falla** 2 de 2 en campo: el paso 6 («y los commitea») y `plan-template.md` («escritos y commiteados antes de despachar») no se pueden cumplir sin `--no-verify` en un repo cuyo `pre-commit` corre la suite, y cada agente improvisó dónde aparcarlos.

## Sin RED

- **Guarda de lo ya publicado**: ninguna rama del archivo reescribió commits publicados, porque ninguna juntaba. El riesgo nace de la propia receta del juntado. Se mide en el GREEN (G5, con la guarda del merge como forma).

## Veredicto

Los cuatro frentes que la spec cubre fallan en el archivo. La guidance de forma (Art. II: receta y contrato) está justificada.
