const ok = (value) => ({ ok: true, value });
const fail = (code, message) => ({ ok: false, error: { code, message } });

module.exports = { ok, fail };
