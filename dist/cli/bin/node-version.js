const MINIMUM = [22, 18, 0];

function isOlderThanMinimum(version) {
  const actual = version.split('.').map(Number);
  for (let i = 0; i < MINIMUM.length; i++) {
    if (actual[i] !== MINIMUM[i]) return actual[i] < MINIMUM[i];
  }
  return false;
}

export function nodeVersionProblem(version) {
  if (!isOlderThanMinimum(version)) return null;
  return `sdd necesita Node 22.18 o posterior; tienes ${version}`;
}
