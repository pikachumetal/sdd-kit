# Con dos cuentas (CLAUDE_CONFIG_DIR en ~/.claude-<cuenta>), las sesiones de un worktree quedan repartidas entre configuraciones.
function Get-DefaultProjectsRoots {
  $homeConfigs = Get-ChildItem -LiteralPath $HOME -Directory -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -eq '.claude' -or $_.Name -like '.claude-*' } | ForEach-Object FullName
  $configs = @($env:CLAUDE_CONFIG_DIR) + @($homeConfigs) | Where-Object { $_ }
  $unique = $configs | ForEach-Object { [System.IO.Path]::TrimEndingDirectorySeparator([System.IO.Path]::GetFullPath($_)) } | Sort-Object -Unique
  return @($unique | ForEach-Object { Join-Path $_ 'projects' })
}

function Get-TranscriptFolders([string]$WorktreePath, [string[]]$Roots) {
  $name = $WorktreePath -replace '[^A-Za-z0-9]', '-'
  return @($Roots | ForEach-Object { Join-Path $_ $name } | Where-Object { Test-Path -LiteralPath $_ })
}
