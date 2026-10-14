BeforeAll {
  . (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')
  $script:SavedGitEnv = Clear-GitEnv
  $script:Node = node -e 'console.log(process.execPath)'
  $script:Check = Join-Path $PSScriptRoot 'upstream/check.ts'

  function New-Root {
    $root = Join-Path $TestDrive ([guid]::NewGuid().ToString('N'))
    $upstream = Join-Path $root 'upstream'
    New-Item -ItemType Directory -Force (Join-Path $upstream 'vacia') | Out-Null
    Set-Content -LiteralPath (Join-Path $upstream 'notas.txt') -Value 'no es un clone'
    return $root
  }

  function New-Source([string]$Root, [string[]]$Tags, [string]$Url = 'https://github.com/acme/juguete') {
    $origin = (Join-Path $Root 'origins/juguete') -replace '\\', '/'
    $clone = Join-Path $Root 'upstream/juguete'
    git init -q -b main $origin
    git -C $origin -c user.name=test -c user.email=test@example.com commit -q --allow-empty -m base
    foreach ($tag in $Tags) { git -C $origin tag $tag }
    git clone -q $origin $clone 2>&1 | Out-Null
    git -C $clone remote set-url origin $Url
    git -C $clone config "url.$origin.insteadOf" $Url
    return [pscustomobject]@{ Origin = $origin; Clone = $clone; Upstream = Join-Path $Root 'upstream' }
  }

  function New-Notices([string]$Root, [string]$Seen, [string]$Repo = 'acme/juguete') {
    $path = Join-Path $Root 'THIRD_PARTY_NOTICES.md'
    $content = @"
# Avisos de terceros

## Fuentes vigiladas

| Fuente | Repo | Versión vista | Fecha |
| --- | --- | --- | --- |
| Juguete | [$Repo](https://github.com/$Repo) | ``$Seen`` | 2026-10-14 |

## Skills y plantillas del kit

- ``skills/juguete/`` adapta algo de [acme/juguete](https://github.com/acme/juguete) — MIT.
"@
    Set-Content -LiteralPath $path -Value $content -Encoding utf8
    return $path
  }

  function Invoke-Check([string]$Notices, [string]$Upstream) {
    $saved = $env:SDD_UPSTREAM_DIR
    if ($Upstream) { $env:SDD_UPSTREAM_DIR = $Upstream } else { Remove-Item Env:\SDD_UPSTREAM_DIR -ErrorAction SilentlyContinue }
    $encoding = [Console]::OutputEncoding
    [Console]::OutputEncoding = [Text.Encoding]::UTF8
    try {
      $output = (& $script:Node $script:Check $Notices 2>&1) -join "`n"
      return [pscustomobject]@{ Output = $output; ExitCode = $LASTEXITCODE }
    } finally {
      [Console]::OutputEncoding = $encoding
      if ($null -eq $saved) { Remove-Item Env:\SDD_UPSTREAM_DIR -ErrorAction SilentlyContinue } else { $env:SDD_UPSTREAM_DIR = $saved }
    }
  }
}

AfterAll {
  Restore-GitEnv $script:SavedGitEnv
}

Describe 'Vigilancia de fuentes (tests/upstream/check.ts)' -Tag 'Slow' {
  It 'S1 todo al día' {
    $root = New-Root
    $source = New-Source $root @('v0.9.0', 'v1.0.0')
    $result = Invoke-Check (New-Notices $root 'v1.0.0') $source.Upstream
    $result.Output | Should -Be 'Fuentes al día: 1.'
    $result.ExitCode | Should -Be 0
  }

  It 'S2 versión nueva en el origen' {
    $root = New-Root
    $source = New-Source $root @('v1.0.0')
    git -C $source.Origin tag v1.1.0
    $result = Invoke-Check (New-Notices $root 'v1.0.0') $source.Upstream
    $result.Output | Should -Match '^Juguete: vista v1\.0\.0, última v1\.1\.0\. Revisa: git -C .+juguete diff v1\.0\.0\.\.v1\.1\.0$'
    $result.ExitCode | Should -Be 1
  }

  It 'S3 otras familias y prereleases no cuentan' {
    $root = New-Root
    $source = New-Source $root @('v1.0.0', 'v1.1.0-beta', '@acme/juguete@9.9.9')
    $result = Invoke-Check (New-Notices $root 'v1.0.0') $source.Upstream
    $result.Output | Should -Be 'Fuentes al día: 1.'
    $result.ExitCode | Should -Be 0
  }

  It 'S4 sin la variable' {
    $root = New-Root
    $result = Invoke-Check (New-Notices $root 'v1.0.0') $null
    $result.Output | Should -Be 'Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.'
    $result.ExitCode | Should -Be 1
  }

  It 'S5 sin clone' {
    $root = New-Root
    $upstream = Join-Path $root 'upstream'
    $result = Invoke-Check (New-Notices $root 'v1.0.0') $upstream
    $result.Output | Should -Be "Juguete: sin clone de acme/juguete en $upstream."
    $result.ExitCode | Should -Be 1
  }

  It 'S6 la vista no es un tag' {
    $root = New-Root
    $source = New-Source $root @('v1.0.0')
    $result = Invoke-Check (New-Notices $root 'v2.0.0') $source.Upstream
    $result.Output | Should -Be 'Juguete: la versión vista v2.0.0 no es un tag del clone.'
    $result.ExitCode | Should -Be 1
  }

  It 'S7 origen inexistente' {
    $root = New-Root
    $source = New-Source $root @('v1.0.0')
    Remove-Item -LiteralPath $source.Origin -Recurse -Force
    $result = Invoke-Check (New-Notices $root 'v1.0.0') $source.Upstream
    $result.Output | Should -Match '^Juguete: no se pudo actualizar el clone: '
    $result.ExitCode | Should -Be 1
  }

  It 'compara 1.10.0 por encima de 1.9.0' {
    $root = New-Root
    $source = New-Source $root @('v1.9.0', 'v1.10.0')
    $result = Invoke-Check (New-Notices $root 'v1.9.0') $source.Upstream
    $result.Output | Should -Match 'vista v1\.9\.0, última v1\.10\.0'
    $result.ExitCode | Should -Be 1
  }

  It 'encuentra el clone aunque el origen lleve .git y otras mayúsculas' {
    $root = New-Root
    $source = New-Source $root @('v1.0.0') -Url 'https://github.com/acme/juguete.git'
    $result = Invoke-Check (New-Notices $root 'v1.0.0' -Repo 'Acme/Juguete') $source.Upstream
    $result.Output | Should -Be 'Fuentes al día: 1.'
    $result.ExitCode | Should -Be 0
  }

  It 'sin tabla' {
    $root = New-Root
    $notices = Join-Path $root 'THIRD_PARTY_NOTICES.md'
    Set-Content -LiteralPath $notices -Value "# Avisos de terceros`n`n- algo adapta algo — MIT." -Encoding utf8
    $result = Invoke-Check $notices (Join-Path $root 'upstream')
    $result.Output | Should -Be "Sin la tabla de «Fuentes vigiladas» en $notices."
    $result.ExitCode | Should -Be 1
  }
}
