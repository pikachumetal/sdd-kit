// Panel de validación del kit: se inyecta en la app con Claude in Chrome o lo sirve `sdd validation serve`.
(function install() {
  const PREFIX = 'sdd-validation-';
  const SOURCE_KEY = `${PREFIX}panel-src`;
  const PANEL_ID = `${PREFIX}panel`;
  let currentId = null;

  const storageKey = () => `${PREFIX}${currentId}`;
  const loadMarks = () => JSON.parse(localStorage.getItem(storageKey()) || '[]');

  const saveMarks = (marks) => {
    localStorage.setItem(storageKey(), JSON.stringify(marks));
    window.sddValidationPanelOnChange?.(marks);
  };

  const saveChanges = (id, changes) => {
    saveMarks(loadMarks().map((mark) => (mark.id === id ? { ...mark, ...changes } : mark)));
  };

  const markStep = (id, status) => {
    saveChanges(id, { status, markedAt: new Date().toISOString() });
    render();
  };

  const button = (label, onClick, active) => {
    const element = document.createElement('button');
    element.textContent = label;
    element.style.cssText = `margin-right:4px;padding:2px 8px;font-weight:${active ? 700 : 400};`;
    element.setAttribute('aria-pressed', String(active));
    element.onclick = onClick;
    return element;
  };

  const stepRow = (mark) => {
    const row = document.createElement('div');
    row.style.cssText = 'margin:6px 0;border-top:1px solid #ccc;padding-top:6px;';
    row.append(document.createTextNode(mark.title), document.createElement('br'));
    row.append(button('OK', () => markStep(mark.id, 'ok'), mark.status === 'ok'));
    row.append(button('KO', () => markStep(mark.id, 'ko'), mark.status === 'ko'));
    const comment = document.createElement('input');
    comment.placeholder = 'Comentario';
    comment.setAttribute('aria-label', `Comentario: ${mark.title}`);
    comment.value = mark.comment;
    comment.style.cssText = 'width:100%;margin-top:4px;';
    comment.oninput = () => saveChanges(mark.id, { comment: comment.value });
    row.append(comment);
    return row;
  };

  const panelElement = () => {
    const existing = document.getElementById(PANEL_ID);
    if (existing) return existing;
    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    panel.style.cssText = 'all:initial;position:fixed;right:16px;bottom:16px;z-index:2147483647;'
      + 'width:300px;max-height:60vh;overflow:auto;background:#fff;color:#111;'
      + 'font:13px system-ui,sans-serif;border:2px solid #333;border-radius:8px;padding:10px;';
    document.body.append(panel);
    return panel;
  };

  function render() {
    const panel = panelElement();
    panel.replaceChildren(document.createTextNode('Validación — marca y di «listo» en la sesión'));
    loadMarks().forEach((mark) => panel.append(stepRow(mark)));
  }

  const mount = (id, steps) => {
    currentId = id;
    if (steps && loadMarks().length === 0) {
      saveMarks(steps.map(({ id: stepId, title }) => ({ id: stepId, title, status: 'pending', comment: '', markedAt: null })));
    }
    render();
  };

  const clear = () => {
    Object.keys(localStorage).filter((key) => key.startsWith(PREFIX)).forEach((key) => localStorage.removeItem(key));
    document.getElementById(PANEL_ID)?.remove();
  };

  localStorage.setItem(SOURCE_KEY, `(${install})()`);
  window.sddValidationPanel = { mount, read: loadMarks, clear };
})();
