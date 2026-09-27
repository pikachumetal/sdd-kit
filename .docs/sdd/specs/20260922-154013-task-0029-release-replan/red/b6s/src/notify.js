const NOTICE_MINUTES = 30;

function noticeTime(date, slot) {
  const start = new Date(`${date}T${slot}:00`);
  return new Date(start.getTime() - NOTICE_MINUTES * 60 * 1000);
}

module.exports = { noticeTime };
