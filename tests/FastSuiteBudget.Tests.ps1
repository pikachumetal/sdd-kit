BeforeAll {
  $script:TestsDir = $PSScriptRoot
  # El pre-commit corre este conjunto en cada commit (patch 0043): por encima de este umbral
  # cada commit vuelve a esperar minutos, como antes de marcar los tests lentos.
  $script:BudgetSeconds = 30

  function Measure-FastSuite {
    # En un proceso aparte, como el hook: Pester no admite una ejecución anidada en la misma sesión.
    $command = "`$r = Invoke-Pester -Path '$script:TestsDir' -ExcludeTagFilter Slow -PassThru -Output None; " +
      "`$r.Containers | ForEach-Object { [pscustomobject]@{ File = Split-Path `$_.Item -Leaf; Seconds = [math]::Round(`$_.Duration.TotalSeconds, 1) } } | ConvertTo-Json -Compress"
    $clock = [Diagnostics.Stopwatch]::StartNew()
    $json = pwsh -NoProfile -Command $command
    $clock.Stop()
    return [pscustomobject]@{
      Seconds = [math]::Round($clock.Elapsed.TotalSeconds, 1)
      Files   = @($json | ConvertFrom-Json | Sort-Object Seconds -Descending)
    }
  }
}

# Slow porque ejecuta el conjunto rápido entero: salta en la suite completa de la validación final de la task.
Describe 'Conjunto rápido del pre-commit' -Tag 'Slow' {
  It 'tarda menos del umbral y, si no, nombra el fichero que hay que marcar con Slow' {
    $run = Measure-FastSuite
    $slowest = $run.Files[0]
    $byFile = ($run.Files | ForEach-Object { "$($_.File) $($_.Seconds) s" }) -join '; '
    $run.Seconds | Should -BeLessThan $script:BudgetSeconds -Because (
      "el pre-commit corre este conjunto en cada commit. Marca con -Tag 'Slow' los bloques de " +
      "$($slowest.File) ($($slowest.Seconds) s) que crean repos, lanzan procesos o esperan. Por fichero: $byFile")
  }
}
