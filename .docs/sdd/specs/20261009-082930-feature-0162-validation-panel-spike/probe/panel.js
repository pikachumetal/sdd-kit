// Desechable: sonda de un spike, no es código del kit.
(function install() {
  const STORAGE_KEY = 'sdd-validation-panel';
  const PANEL_ID = 'sdd-validation-panel';
  const SOURCE_KEY = 'sdd-validation-panel-src';

  const loadTests = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const saveTests = (tests) => localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));

  const saveChanges = (id, changes) => {
    saveTests(loadTests().map((test) => (test.id === id ? { ...test, ...changes } : test)));
  };

  const updateTest = (id, changes) => {
    saveChanges(id, changes);
    render();
  };

  const saveComment = (id, comment) => saveChanges(id, { comment });

  const markTest = (id, status) => updateTest(id, { status, markedAt: new Date().toISOString() });

  const button = (label, onClick, active) => {
    const element = document.createElement('button');
    element.textContent = label;
    element.style.cssText = `margin-right:4px;padding:2px 8px;font-weight:${active ? 700 : 400};`;
    element.onclick = onClick;
    return element;
  };

  const testRow = (test) => {
    const row = document.createElement('div');
    row.style.cssText = 'margin:6px 0;border-top:1px solid #ccc;padding-top:6px;';
    row.append(document.createTextNode(test.title), document.createElement('br'));
    row.append(button('OK', () => markTest(test.id, 'ok'), test.status === 'ok'));
    row.append(button('KO', () => markTest(test.id, 'ko'), test.status === 'ko'));
    const comment = document.createElement('input');
    comment.placeholder = 'Comentario';
    comment.value = test.comment;
    comment.style.cssText = 'width:100%;margin-top:4px;';
    comment.oninput = () => saveComment(test.id, comment.value);
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
    loadTests().forEach((test) => panel.append(testRow(test)));
  }

  const mount = (tests) => {
    if (loadTests().length === 0) {
      saveTests(tests.map(({ id, title }) => ({ id, title, status: 'pending', comment: '', markedAt: null })));
    }
    render();
  };

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SOURCE_KEY);
    document.getElementById(PANEL_ID)?.remove();
  };

  localStorage.setItem(SOURCE_KEY, `(${install})()`);
  window.sddValidationPanel = { mount, read: loadTests, clear };
})();
