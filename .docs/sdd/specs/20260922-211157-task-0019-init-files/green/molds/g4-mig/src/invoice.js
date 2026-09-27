function total(lines) {
  return lines.reduce((sum, line) => sum + line.cents, 0);
}

module.exports = { total };
