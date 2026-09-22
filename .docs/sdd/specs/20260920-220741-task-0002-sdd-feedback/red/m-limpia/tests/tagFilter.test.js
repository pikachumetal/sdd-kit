const { extractTags, filterByTag } = require('../src/search/tagFilter');

test('extrae etiquetas del cuerpo de una nota', () => {
  expect(extractTags('Idea para #proyecto sobre #notas')).toEqual(['proyecto', 'notas']);
});

test('filtra notas por etiqueta', () => {
  const notes = [
    { title: 'A', body: 'sobre #trabajo' },
    { title: 'B', body: 'sobre #ocio' },
  ];
  expect(filterByTag(notes, 'trabajo')).toEqual([notes[0]]);
});

test('sin etiqueta devuelve todas las notas', () => {
  const notes = [{ title: 'A', body: 'x' }, { title: 'B', body: 'y' }];
  expect(filterByTag(notes, null)).toEqual(notes);
});
