import http from 'node:http';

// Otra aplicación de la máquina escucha en el puerto de la suite: no conoce /health ni /shutdown, así que `env-up` no la libera.
http.createServer((req, res) => {
  res.statusCode = 404;
  res.end('otra aplicación: no es el entorno de la suite');
}).listen(Number(process.argv[2]));
