const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function weeklyOccurrences(startDate, untilDate) {
  const dates = [];
  const until = new Date(untilDate).getTime();
  for (let t = new Date(startDate).getTime(); t <= until; t += WEEK_MS) {
    dates.push(new Date(t).toISOString().slice(0, 10));
  }
  return dates;
}

module.exports = { weeklyOccurrences };
