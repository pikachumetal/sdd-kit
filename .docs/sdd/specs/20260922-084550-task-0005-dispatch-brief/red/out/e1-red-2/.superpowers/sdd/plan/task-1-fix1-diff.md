## git log --oneline (69c9e63..8425323)
8425323 fix: exigir dos dígitos y rango horario válido en la franja de libres

## git diff --stat
 src/app.js       | 5 +----
 test/app.test.js | 8 ++++++++
 2 files changed, 9 insertions(+), 4 deletions(-)

## git diff -U10
diff --git a/src/app.js b/src/app.js
index cc1e1a7..67b33cc 100644
--- a/src/app.js
+++ b/src/app.js
@@ -1,25 +1,22 @@
 const [command, ...args] = process.argv.slice(2);
 const rooms = ['Norte', 'Sur'];
 const bookings = [{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }];
 
-// Expresión regular del formato de franja (spec 0009)
-const SLOT = /^\d{1,2}:\d{2}-\d{1,2}:\d{2}$/;
+const SLOT = /^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/;
 
 function freeRooms(slot) {
   return rooms.filter((room) => !bookings.some((b) => b.room === room && b.slot === slot));
 }
 
-// Devuelve el mensaje de franja no válida
 function invalidSlot(slot) {
   return `Franja horaria no válida: "${slot ?? ''}". Usa el formato HH:MM-HH:MM (por ejemplo, 10:00-12:00).`;
 }
 
 export function run(cmd, params) {
-  // Si el comando es libres, valida la franja
   if (cmd === 'libres') return SLOT.test(params[0] ?? '') ? freeRooms(params[0]).join(', ') : invalidSlot(params[0]);
   if (cmd === 'reservar' && params.includes('--cada-semana')) return 'reserva semanal creada';
   if (cmd === 'cancelar') return `cancelada ${params[0]} ${params[1]}`;
   return 'salas';
 }
 
 if (command) console.log(run(command, args));
diff --git a/test/app.test.js b/test/app.test.js
index fc5d5b5..e7b2823 100644
--- a/test/app.test.js
+++ b/test/app.test.js
@@ -10,10 +10,18 @@ test('reservar --cada-semana crea la reserva semanal', () => {
   assert.equal(run('reservar', ['Norte', '--cada-semana']), 'reserva semanal creada');
 });
 
 test('cancelar respeta el día', () => {
   assert.equal(run('cancelar', ['mar', '10:00']), 'cancelada mar 10:00');
 });
 
 test('libres rechaza una franja mal formada', () => {
   assert.match(run('libres', ['10-12']), /^Franja horaria no válida/);
 });
+
+test('libres rechaza una hora con un solo dígito', () => {
+  assert.match(run('libres', ['9:00-11:00']), /^Franja horaria no válida/);
+});
+
+test('libres rechaza una hora fuera de rango', () => {
+  assert.match(run('libres', ['24:00-24:30']), /^Franja horaria no válida/);
+});
