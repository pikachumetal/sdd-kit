BeforeDiscovery {
  # Se busca el nombre como ruta o fichero, no la palabra suelta: «documento funcional»
  # es castellano correcto en prosa y no lo prohibe ninguna regla de nombrado.
  $script:ForbiddenTokens = @(
    'funcional(/|\.md|-template)'
    'changelog-cliente'
    'legado\.md'
    'estimacion\.md'
    'migracion\.md'
    'flujo-de-task'
    '<capacidad>'
  )

  $script:ForbiddenPaths = @(
    '.docs/sdd/funcional'
    'skills/sdd-templates/templates/funcional-template.md'
    'skills/sdd-templates/templates/changelog-cliente-template.md'
  )
}

BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }

  # El historico sellado (specs/, releases/, changelog.md, roadmap.md) conserva los nombres
  # antiguos a proposito: describe lo que se entrego. Por eso el barrido va por lista blanca
  # de rutas vivas y no por exclusiones, que dejarian el test imposible de poner en verde.
  # estimation-log.md tampoco entra: lo genera un script a partir de los nombres de carpeta
  # de las specs historicas, asi que arrastra los nombres antiguos por construccion.
  $script:LivePaths = @(
    'README.md'
    '.docs/sdd/mission.md'
    '.docs/sdd/constitution.md'
    '.docs/sdd/architecture.md'
    '.docs/sdd/tech-stack.md'
    '.docs/sdd/estimation.md'
  )

  # El contenido de capabilities/ queda fuera del barrido: son requisitos vivos que solo
  # cambian por la fusion del delta al cerrar una task, nunca por edicion manual. Aqui se
  # vigilan sus nombres de fichero, que si son responsabilidad de quien crea la capacidad.
  # Riesgo aceptado a cambio: una fusion mal hecha que reintroduzca un nombre antiguo como
  # ruta vigente —y no como cita de un «antes:»— no la detecta nadie.
  function Get-LiveFile {
    $named = foreach ($relative in $script:LivePaths) {
      $full = Join-Path $script:KitRoot $relative
      if (Test-Path $full) { Get-Item $full }
    }
    # Las migraciones citan los nombres antiguos por necesidad: su trabajo es detectarlos
    # en el proyecto que se migra para renombrarlos. Prohibirselos las dejaria sin sujeto.
    $skills = Get-ChildItem (Join-Path $script:KitRoot 'skills') -Recurse -File -Filter '*.md' |
      Where-Object { $_.FullName -notmatch 'references[\\/]migrations' }
    return @($named) + @($skills)
  }

  function Get-CapabilityName {
    $folder = Join-Path $script:KitRoot '.docs/sdd/capabilities'
    if (-not (Test-Path $folder)) { return @() }
    return @(Get-ChildItem $folder -File -Filter '*.md' | ForEach-Object { $_.BaseName })
  }

  function Get-Offender([string]$Token) {
    $offenders = Get-LiveFile | Where-Object { (Get-Content $_.FullName -Raw) -match $Token }
    return @($offenders | ForEach-Object { $_.FullName.Replace($script:KitRoot, '').TrimStart('\', '/') })
  }
}

Describe 'Convención de nombres' {
  It 'ninguna ruta viva menciona <_>' -ForEach $script:ForbiddenTokens {
    $offenders = Get-Offender $_
    $offenders | Should -BeNullOrEmpty -Because 'los nombres de fichero y carpeta van en inglés kebab-case'
  }

  It 'no existe en disco <_>' -ForEach $script:ForbiddenPaths {
    $full = Join-Path $script:KitRoot $_
    Test-Path $full | Should -BeFalse -Because 'debe estar renombrado a su nombre en inglés'
  }

  It 'ninguna capacidad lleva nombre en castellano' {
    $spanish = Get-CapabilityName | Where-Object { $_ -match 'estimacion|migracion|flujo|legado|funcional' }
    $spanish | Should -BeNullOrEmpty -Because 'una capacidad es un sustantivo del dominio en inglés kebab-case'
  }
}
