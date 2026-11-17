export type Copied = { sheet: string; range: string; values: string[][] };

// Se guarda en el servidor: tarda entre 1 y 3 s con la base cargada.
export async function copyRange(copied: Copied): Promise<void> {
  await fetch('/api/clipboard', { method: 'POST', body: JSON.stringify(copied) });
}

export async function lastCopied(): Promise<Copied | null> {
  const res = await fetch('/api/clipboard');
  return res.json();
}
