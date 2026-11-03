import { isRegistry } from './registries.ts';

export function destinationExits(path: string, files: string[]): string[] {
  const exits = [`Que quien los hizo los commitee (o los descarte) en '${path}', y relanzar el merge.`];
  if (files.every(isRegistry)) exits.push('Llevarlos a la rama de la feature: solo tocan registros (roadmap, changelog, deuda, estimation-log).');
  exits.push('Dejar el merge para luego.');
  return ['Salidas:', ...exits.map((exit, index) => `  ${index + 1}. ${exit}`)];
}
