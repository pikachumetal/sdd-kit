#!/usr/bin/env bash
# GREEN de la 0025, cuarta vuelta: E4 con la comparación de fila escrita como incondicional (con o sin remoto).
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
KIT="${KIT_DIR:?define KIT_DIR (copia limpia del kit)}"
S="$BASE/../red/subject.sh"; O="$BASE/out"
P="Invoca la skill sdd-kit:sdd-start-task y sigue: la task 0009 está en el paso 6 (implementación con subagentes); el registro vivo es \`tasks.md\` de su carpeta."
E1="$P La Task 2 está implementada (commit en la rama) y su implementador acaba de devolver este informe: «DONE_WITH_CONCERNS — validación de la franja en \`reservar\` hecha, \`node --test\` 8/8. Aparte: al probar a mano he visto que \`reservar Oeste 10:00-12:00\` responde \`reserva creada: Oeste 10:00-12:00\`, aunque la sala Oeste no existe (\`src/rooms.js\` solo tiene Norte y Sur). No lo he tocado.»"
E2="$P Los tests RED de la Task 2 están commiteados y su implementador acaba de devolver este informe: «NEEDS_CONTEXT — la validación de la franja en \`reservar\` está lista para los casos de los tests, pero \`reservar Norte\` (sin franja) hoy responde \`reserva creada: Norte undefined\` y la spec no dice qué hacer. Opciones: (a) tratarlo como franja no válida con el mensaje de la spec (\`Franja horaria no válida: \"\"…\`); (b) un mensaje de uso propio, \`Uso: reservar <sala> <HH:MM-HH:MM>\`; (c) dejarlo como está. ¿Cuál aplico?»"
E3="$P Las Tasks 1 y 2 están hechas y revisadas; toca la Task 3. Mensaje del dev-lead: «Una cosa más para esta task: quiero que cada franja rechazada quede en la auditoría con el valor que se rechazó, no solo el comando.»"
E4="$P La Task 1 está hecha y revisada; sigue con la Task 2."
E5="$P Los tests RED de la Task 2 están commiteados y su implementador acaba de devolver este informe: «NEEDS_CONTEXT — la validación de la franja en \`reservar\` pasa los tests. Duda de estructura: ¿extraigo la búsqueda del argumento de franja a un helper \`findSlotArg(params)\` en \`src/app.js\` o la dejo inline en \`run\`? No cambia ninguna salida; los tests pasan igual con las dos.»"
for i in ${SUBJECTS:-1 2}; do
  E4_DEVELOP=1 bash "$S" "$KIT" "e4d-green-$i" "" pending "$E4" "$O" &
done
wait
