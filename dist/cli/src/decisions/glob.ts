const UNSUPPORTED = /[?{}[\]!]|^\.\//;

function escapeLiteral(text: string): string {
  return text.replace(/[.+^$()|\\]/g, '\\$&');
}

function segmentPattern(segment: string): string {
  return segment.split('*').map(escapeLiteral).join('[^/]*');
}

export function globToRegExp(glob: string): RegExp | null {
  if (UNSUPPORTED.test(glob)) return null;
  const segments = glob.split('/');
  let pattern = '';
  segments.forEach((segment, index) => {
    const last = index === segments.length - 1;
    if (segment === '**') pattern += last ? '.+' : '(?:.*/)?';
    else pattern += segmentPattern(segment) + (last ? '' : '/');
  });
  return new RegExp(`^${pattern}$`);
}
