<#
.SYNOPSIS
  Cerrojo de fichero en el directorio común de git, compartido por todos los worktrees de una máquina.
.DESCRIPTION
  Forma parte del kit SDD (skill sdd-templates). Lo cargan con dot-source Invoke-SddMerge.ps1 y Get-NextSddId.ps1.
  El fichero se crea con CreateNew, que es atómico: solo un proceso lo consigue. Dentro va el dueño (rama, worktree,
  PID, máquina y hora) para decir a quién se espera y para liberar el cerrojo de un proceso que ya no existe.
#>

function New-SddLock([string]$Path, [string]$Label, [System.IO.TextWriter]$StatusWriter) {
  return [pscustomobject]@{ Path = $Path; Label = $Label; Writer = $StatusWriter }
}

function New-LockStream([string]$LockPath, [pscustomobject]$Owner) {
  try {
    $stream = [System.IO.FileStream]::new($LockPath, 'CreateNew', 'ReadWrite', [System.IO.FileShare]'Read, Delete')
  }
  catch [System.IO.IOException] {
    return $null
  }
  $json = [pscustomobject]@{
    branch = $Owner.Branch; worktree = $Owner.Worktree; pid = $PID
    host   = [Environment]::MachineName; since = (Get-Date).ToString('o')
  } | ConvertTo-Json -Compress
  $bytes = [Text.Encoding]::UTF8.GetBytes($json)
  $stream.Write($bytes, 0, $bytes.Length)
  $stream.Flush()
  return $stream
}

function Read-LockOwner([string]$LockPath) {
  try {
    $stream = [System.IO.FileStream]::new($LockPath, 'Open', 'Read', [System.IO.FileShare]'ReadWrite, Delete')
  }
  catch [System.IO.IOException] {
    return $null
  }
  try {
    $reader = [System.IO.StreamReader]::new($stream, [Text.Encoding]::UTF8)
    return ($reader.ReadToEnd() | ConvertFrom-Json)
  }
  catch {
    return $null
  }
  finally {
    $stream.Dispose()
  }
}

function Test-OrphanLock([pscustomobject]$Owner) {
  if ($Owner.host -ne [Environment]::MachineName) { return $false }
  return -not (Get-Process -Id $Owner.pid -ErrorAction SilentlyContinue)
}

function Format-LockOwner([pscustomobject]$Owner) {
  # ConvertFrom-Json convierte "since" (ISO 8601) en [datetime]; interpolarlo directo saldría
  # con el formato de la cultura del sistema en vez de uno fijo.
  $since = ([datetime]$Owner.since).ToString('yyyy-MM-dd HH:mm:ss')
  return "$($Owner.branch) ($($Owner.worktree), PID $($Owner.pid)) desde $since."
}

function Enter-SddLock([pscustomobject]$Lock, [pscustomobject]$Self, [double]$TimeoutMinutes) {
  $deadline = (Get-Date).AddMinutes($TimeoutMinutes)
  $lastOwnerKey = $null
  while ($true) {
    $stream = New-LockStream $Lock.Path $Self
    if ($null -ne $stream) { return $stream }
    $owner = Read-LockOwner $Lock.Path
    if ($null -eq $owner) { continue }
    if (Test-OrphanLock $owner) {
      Remove-Item -LiteralPath $Lock.Path -ErrorAction SilentlyContinue
      $Lock.Writer.WriteLine("Cerrojo huérfano: lo tenía $(Format-LockOwner $owner)")
      continue
    }
    $ownerKey = "$($owner.branch)|$($owner.pid)|$($owner.since)"
    if ($ownerKey -ne $lastOwnerKey) {
      $Lock.Writer.WriteLine("Esperando el cerrojo de $($Lock.Label): lo tiene $(Format-LockOwner $owner)")
      $lastOwnerKey = $ownerKey
    }
    if ((Get-Date) -gt $deadline) { throw "cerrojo: no se libera; lo tiene $(Format-LockOwner $owner)" }
    Start-Sleep -Seconds 2
  }
}

function Exit-SddLock([System.IO.FileStream]$Stream, [pscustomobject]$Lock) {
  $Stream.Dispose()
  Remove-Item -LiteralPath $Lock.Path -ErrorAction SilentlyContinue
}
