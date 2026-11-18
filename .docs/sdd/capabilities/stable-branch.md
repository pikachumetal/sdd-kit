# Capacidad — stable-branch

## Propósito

La rama estable: solo recibe hotfix y release, el hotfix se fusiona, se etiqueta y vuelve a la integración, y una vuelta que falla se deshace entera.

## Requisitos

### Un hotfix se fusiona en la rama estable, se etiqueta y vuelve a la integración

- GIVEN `merge.into: develop`, la rama `hotfix/0200-fix-login` salida de `main` y ninguna `release/*` abierta
- WHEN se ejecuta `sdd merge --branch hotfix/0200-fix-login --into main --tag v3.0.1 --order "fusiona el hotfix del login en main" --push`
- THEN bajo un solo cerrojo fusiona la rama en `main` con `--no-ff` y el commit `merge: hotfix/0200-fix-login en main` con la línea `Orden del dev-lead: «fusiona el hotfix del login en main»`, crea la etiqueta anotada `v3.0.1` en ese commit, fusiona la misma rama en `develop` con `--no-ff`, y publica `main`, `develop` y `v3.0.1` en un solo push atómico
- AND escribe `Fusionado hotfix/0200-fix-login en main: <hash>`, `etiqueta v3.0.1 en <hash>`, `Fusionado hotfix/0200-fix-login en develop: <hash>` y `publicado en origin`
- AND con `release/3.1.0` abierta en `origin` (no antecesora de `main`), la vuelta va a `release/3.1.0` y no a `develop`; con dos abiertas en `origin` tras el fetch de `release/*` que hace el script, falla antes de sincronizar ni fusionar nada con `vuelta: hay varias ramas release/ abiertas (release/3.1.0, release/3.2.0); fusiona a mano`; una `release/` solo local no cuenta si hay remoto
- AND una `release/3.2.0` que se borró en `origin` no cuenta como abierta aunque su ref de seguimiento siguiera en local antes del fetch
- AND `--check` decide la vuelta con los refs de seguimiento que ya hay, sin fetch: no crea ni mueve ninguno
- AND una rama `release/3.1.0` con `--into main` vuelve a `develop`
- AND `--into main` sin `--order` sale con 2 con `--into 'main' distinta de merge.into necesita --order "<frase del dev-lead>"`; `--tag` sin ese `--into`, con `--tag solo con --into a la rama estable`; `--tag 'v3.0.1 beta'`, con `--tag: 'v3.0.1 beta' no es un nombre de etiqueta válido`, antes del cerrojo; y una etiqueta que ya existe falla sin tocar nada con `--tag: ya existe 'v3.0.1'`, o con `--tag: ya existe 'v3.0.1' en 'origin'` si solo existe en el remoto
- AND si no se pueden consultar las etiquetas del remoto, falla sin tocar nada, también con `--check`, con `--tag: no se pudo consultar las etiquetas de 'origin'`

### A la rama estable solo llegan ramas hotfix y release

- GIVEN la rama `patch/0201-typo`
- WHEN se ejecuta `sdd merge --branch patch/0201-typo --into main --order "llévalo a main"`
- THEN sale con 1 con `--into: a 'main' solo llegan ramas hotfix/ o release/ (git-flow); 'patch/0201-typo' no lo es`, sin coger el cerrojo ni tocar ningún ref

### Un hotfix cuya vuelta falla se deshace entero

- GIVEN un hotfix que se fusiona en `main` y cuya vuelta a `develop` tiene un conflicto en `skills/x/SKILL.md` en el que los dos lados cambian la misma línea
- WHEN el script llega a la vuelta
- THEN deshace la vuelta, el merge en `main` y la etiqueta, no publica nada y falla con `vuelta: conflicto en skills/x/SKILL.md; se deshacen el merge en 'main' y la etiqueta: porta el arreglo a 'develop' a mano`
- AND con la verificación de la vuelta en rojo, deshace lo mismo y da el error de verificación con su línea `base:`
- AND si el push atómico se rechaza porque `main` o `develop` avanzaron en el remoto, deshace lo mismo y falla con `push: 'main' o 'develop' avanzó en 'origin'; relanza el hotfix`
- AND si `main` y la rama de vuelta tienen remotos distintos, falla antes de tocar nada con `push: 'main' y 'develop' tienen remotos distintos ('origin', 'upstream'); fusiona a mano`; y si no se puede consultar la vuelta en el remoto, con `vuelta: no se pudo consultar 'develop' en 'origin'`
- AND si una de las dos no tiene remoto, el mensaje dice `sin remoto` en su lugar: `push: 'main' y 'develop' tienen remotos distintos ('origin', sin remoto); fusiona a mano`
