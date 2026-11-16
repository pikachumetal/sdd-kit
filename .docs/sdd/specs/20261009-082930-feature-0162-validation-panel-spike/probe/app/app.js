const showStatus = (text) => { document.getElementById('status').textContent = text; };

document.getElementById('save').onclick = async () => {
  const response = await fetch('/api/missing');
  showStatus(`GET /api/missing → ${response.status}`);
};

document.getElementById('export').onclick = () => {
  console.error('probe-app: fallo provocado al exportar');
  showStatus('error de consola lanzado');
};
