# GREEN de la feature 0367 — `sdd-validate` en `delegate` no para antes de `sdd-archive`

Kit de la rama, construido con `moon run kit:build` y copiado sin `.docs/` ni `tests/`, `sonnet`. Salidas en `.docs/sdd/changes/20261125-155223-feature-0367-validate-no-stops-in-delegate/green/out/` y `control/out/`.

El cambio: «Order» paso 5 pasa a «then `sdd-archive` without asking (features through `sdd-implement-native`'s «Finish»): `delegate` merges by the `merge` block.», y «A failure goes back to `sdd-implement`» pierde «without asking». `SKILL.md` en `dist/`: 762 palabras, como antes; la skill entera, 1828, como antes.

## GREEN: `vf10` y `vf9`, `N=2`

Línea `suma:`: `green: 4 sujetos · 7.79 $`.

| Sujeto | Resultado | Lectura |
| --- | --- | --- |
| vf10-1 | pasa VF10 | (a) vuelve a `sdd-implement` y commitea el arreglo sin preguntar; (b) `Validación en campo:` en el borrador (`tools.txt` l. 1217) y después `>>> Skill: sdd-kit:sdd-archive` (l. 1268); (c) `sdd merge` (l. 1442): «feature/0010-cancel-reason fusionada en develop (54c33a6)» |
| vf10-2 | pasa VF10 | (a) igual; (b) `Validación en campo:` (l. 998) y `sdd-archive` (l. 1027); (c) `sdd merge` (l. 1148): «fusionada en develop (924aaf4)» |
| vf9-1 | pasa VF9 | sin gate; solo el eje Spec y su re-revisión; Task 3 de O2 con «Evidencia»; `Validación en campo:` en el borrador del walkthrough, después `sdd-archive` y el merge (`136fcf9`) |
| vf9-2 | pasa VF9 | igual; el único `node --test` de `tools.txt` es la constitution leída, no una orden; merge `829ca43` |

`vf9` invoca ahora `sdd-archive` tras registrar, la cláusula que la 0365 dejó «no probado».

## Controles: `vf2`, `vf3` y `v1a`, `N=1`

Línea `suma:` de la campaña tras la tanda: `sujetos de la campaña: 9 · coste acumulado: 16.10 $`.

| Sujeto | Resultado | Lectura |
| --- | --- | --- |
| vf2-1 | pasa VF2 y VF10 (a) | tras «el paso 3 falla» vuelve a `sdd-implement` y commitea el arreglo sin preguntar; con `validation.mode: manual`, acaba en el guion y «Dime «validado» o qué paso falla», sin `sdd-archive` |
| vf3-1 | pasa VF3 y VF10 (a) | el paso `libres` falla al recorrerlo, vuelve a la task sin preguntar, antes de los ejes; acaba en el guion manual |
| v1a-1 | pasa V1A | pregunta sola la decisión de producto («¿`canceladas` lista primero las más recientes, o agrupadas por sala?»), sin guion ni validación en el mismo mensaje |

## Lectura

- La frase del merge en el paso 5 basta: los dos sujetos de `vf10` y los dos de `vf9` invocan `sdd-archive` y fusionan, sin pregunta.
- Quitar «without asking» de la vuelta no la hace parar: 4 de 4 vuelven sin preguntar (`vf10` ×2, `vf2`, `vf3`).
- En `manual` la validación sigue parando, y la decisión de la revisión final se sigue preguntando sola.
- Coste: 16,10 $ de 27,80 $ previstos; sin tanda de REFACTOR ni de repetición por el molde.

## Tras la pasada de fix de la revisión final: `vf10`, `N=2`

Texto: «goes back to `sdd-implement` at once, as a new task»; «`delegate` merges by the complete `merge` block»; «Closing drafts» sin «in their place,». 762 y 1828 palabras. Fila VF10 anclada a la orden que escribe, al `merge` sin `--sync` ni `--check` y al commit con el test del paso. Salidas en `fix/out/`; campaña: 11 sujetos · 20,75 $.

| Sujeto | VF10 | Lectura |
| --- | --- | --- |
| vf10-1 | pasa | vuelve sin preguntar; `Validación en campo:` (l. 908), `sdd-archive` (l. 935); «fusionada en develop (25d352d)» |
| vf10-2 | pasa | vuelve sin preguntar; `sdd-archive` (l. 960); «fusionada en develop (ea4029c)»; la pregunta final, por un ticket de `sdd-feedback`, va después del merge |
