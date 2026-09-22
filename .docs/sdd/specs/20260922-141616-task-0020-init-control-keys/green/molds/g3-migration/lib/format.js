function formatModel(model) {
  return model?.display_name ?? '?';
}

function formatCost(usd) {
  if (usd == null) return '';
  return `$${usd.toFixed(2)}`;
}

module.exports = { formatModel, formatCost };
