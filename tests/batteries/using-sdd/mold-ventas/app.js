function lineTotal(quantity, price, vat) {
  return Math.round(quantity * price * (1 + vat) * 100) / 100;
}

document.querySelectorAll('.lineas tbody tr').forEach((row) => {
  const total = lineTotal(Number(row.dataset.cantidad), Number(row.dataset.precio), Number(row.dataset.iva));
  row.querySelector('.total').textContent = total.toFixed(2).replace('.', ',') + ' €';
});
