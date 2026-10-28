import { describe, expect, it } from 'vitest';
import { listeningPids } from './campaign.ts';

const netstat = [
  '  Proto  Dirección local          Dirección remota        Estado           PID',
  '  TCP    0.0.0.0:4310           0.0.0.0:0              ESCUCHANDO       1200',
  '  TCP    [::]:4310              [::]:0                 ESCUCHANDO       1200',
  '  TCP    127.0.0.1:4310         127.0.0.1:52000        ESTABLECIDO      1200',
  '  TCP    0.0.0.0:43100          0.0.0.0:0              ESCUCHANDO       3400',
  '  UDP    0.0.0.0:4310           *:*                                     5600',
].join('\r\n');

describe('listeningPids', () => {
  it('lee los PID que escuchan en el puerto, en IPv4 e IPv6 y en cualquier idioma', () => {
    expect(listeningPids(netstat, 4310)).toEqual([1200, 1200]);
  });

  it('no confunde un puerto con otro que empieza igual', () => {
    expect(listeningPids(netstat, 431)).toEqual([]);
  });
});
