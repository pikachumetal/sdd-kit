BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Perfiles de control: arranque y ejecución' {
  It 'la tabla de gates existe y nombra los tres perfiles' {
    $table = Get-KitFile 'skills/sdd-start-task/references/control-profiles.md'
    foreach ($profileName in 'pair', 'delegate', 'unattended') { $table | Should -Match "``$profileName``" }
  }

  It 'la tabla declara las claves de control con su default' {
    $table = Get-KitFile 'skills/sdd-start-task/references/control-profiles.md'
    $keys = 'control.profile', 'control.maxParallelAgents', 'control.silence.betweenStepsMinutes',
      'control.silence.longCommandMinutes', 'merge.into', 'merge.noFf', 'merge.removeWorktree', 'merge.push'
    foreach ($key in $keys) { $table | Should -Match ([regex]::Escape($key)) }
  }

  It 'sdd-start-task enlaza la tabla en vez de copiarla' {
    $skill = Get-KitFile 'skills/sdd-start-task/SKILL.md'
    $skill | Should -Match '\(references/control-profiles\.md\)'
    $skill | Should -Not -Match 'maxParallelAgents'
  }

  It 'los overrides arbitran rulings y merge' {
    $overrides = Get-KitFile 'skills/sdd-start-task/references/overrides-superpowers.md'
    $overrides | Should -Match 'finishing-a-development-branch'
    $overrides | Should -Match '(?i)ruling'
  }

  It 'la review de spec no se propone por defecto' {
    Get-KitFile 'skills/sdd-start-task/references/review-spec.md' | Should -Match '4 señales o más'
  }

  It 'la plantilla de spec admite perfil y enmiendas' {
    $template = Get-KitFile 'skills/sdd-templates/templates/spec-template.md'
    $template | Should -Match '(?m)^profile:'
    $template | Should -Match '## Enmiendas'
  }
}

Describe 'Perfiles de control: cierre, release y migración' {
  It 'el walkthrough crece por adendas y ya no es inmutable' {
    $template = Get-KitFile 'skills/sdd-templates/templates/walkthrough-template.md'
    $template | Should -Not -Match 'inmutable'
    $template | Should -Match '## 6\. Adendas'
    $template | Should -Match 'Validación diferida: <fecha>'
  }

  It 'sdd-end-task enlaza la tabla y aplica la política de merge' {
    $skill = Get-KitFile 'skills/sdd-end-task/SKILL.md'
    $skill | Should -Match 'sdd-start-task/references/control-profiles\.md'
    $skill | Should -Match '🧪'
    $skill | Should -Not -Match 'decidir merge/PR \*\*con el usuario\*\*'
  }

  It 'sdd-end-release valida las tasks diferidas a su smoke' {
    Get-KitFile 'skills/sdd-end-release/SKILL.md' | Should -Match '🧪'
  }

  It 'la migración a v1.2.0 pregunta las claves de control' {
    $migration = Get-KitFile 'skills/sdd-init-brownfield/references/migrations/v1.2.0.md'
    $migration | Should -Match 'control\.profile'
    $migration | Should -Match 'merge'
  }

  It 'las init y la migración enlazan las preguntas de las claves de control sin copiarlas' {
    $block = Get-KitFile 'skills/sdd-start-task/references/control-profiles.md'
    $block | Should -Match '(?m)^## Preguntas de las claves de control'
    ($block | Select-String -Pattern 'Recomendad[ao]' -AllMatches).Matches.Count | Should -BeGreaterOrEqual 3
    $consumers = 'skills/sdd-init-greenfield/SKILL.md', 'skills/sdd-init-brownfield/SKILL.md',
      'skills/sdd-init-brownfield/references/migrations/v1.2.0.md'
    foreach ($consumer in $consumers) {
      Get-KitFile $consumer | Should -Match 'control-profiles\.md#preguntas-de-las-claves-de-control'
    }
    foreach ($init in $consumers[0..1]) { Get-KitFile $init | Should -Not -Match 'maxParallelAgents' }
  }

  It 'el Art. IV ya no reserva todo merge al usuario' {
    Get-KitFile '.docs/sdd/constitution.md' | Should -Not -Match 'el merge es SIEMPRE decisión del usuario'
  }

  It 'el glosario no llama inmutable al walkthrough' {
    Get-KitFile '.docs/sdd/mission.md' | Should -Not -Match 'cierre inmutable'
  }
}

Describe 'Perfiles de control: propuesta de partir una task grande' {
  It 'la primera pregunta propone partir por encima del umbral orientativo' {
    Get-KitFile 'skills/sdd-start-task/SKILL.md' | Should -Match 'más de 3 tasks internas'
  }
}

Describe 'Perfiles de control: aprobación explícita y 🧪 sin validar en la release' {
  It 'elegir un alcance no cuenta como aprobar la spec' {
    Get-KitFile 'skills/sdd-start-task/SKILL.md' | Should -Match '(?i)elegir un alcance'
  }

  It 'la task 🧪 que el smoke no valida conserva la forma con disparador nuevo' {
    Get-KitFile 'skills/sdd-end-release/SKILL.md' | Should -Match 'disparador nuevo'
  }
}

Describe 'Perfiles de control: validación diferida con disparador vago (patch 0037)' {
  It 'control-profiles concreta el disparador en vez de dejar la task EN ESPERA' {
    $section = [regex]::Match((Get-KitFile 'skills/sdd-start-task/references/control-profiles.md'),
      '(?ms)^## Validación diferida\r?$.*?(?=^## )').Value
    $section | Should -Match 'uso más próximo'
    $section | Should -Match 'a cargo de <quien difiere>'
    $section | Should -Match 'mensaje de cierre'
    $section | Should -Not -Match 'Sin las tres condiciones no hay diferido'
  }

  It 'el paso 0 de sdd-end-task no vuelve a preguntar el disparador' {
    $step = [regex]::Match((Get-KitFile 'skills/sdd-end-task/SKILL.md'), '(?m)^0\. .+$').Value
    $step | Should -Match 'uso más próximo'
    $step | Should -Match 'mensaje de cierre'
  }

  It 'el paso 11 de sdd-end-task dice en el mensaje final el disparador concretado' {
    [regex]::Match((Get-KitFile 'skills/sdd-end-task/SKILL.md'), '(?m)^11\. .+$').Value | Should -Match 'lo elegí yo'
  }
}

Describe 'Perfiles de control: el CLAUDE.md del repo no contradice la tabla' {
  It 'la regla 6 nombra las paradas de delegate: spec, desvío y validación final' {
    $rule = [regex]::Match((Get-KitFile 'CLAUDE.md'), '(?m)^6\. .+$').Value
    $rule | Should -Match 'control-profiles\.md'
    foreach ($stop in 'aprobación de la spec', 'desvío', 'validación final') { $rule | Should -Match $stop }
  }
}

Describe 'Merge en el cierre' {
  It 'los dos pasos de rama enlazan la receta' {
    Get-KitFile 'skills/sdd-end-task/SKILL.md' | Should -Match '\(references/merge-recipe\.md\)'
    Get-KitFile 'skills/sdd-end-patch/SKILL.md' | Should -Match '\(\.\./sdd-end-task/references/merge-recipe\.md\)'
  }

  It 'el cierre de patch lee la política de merge' {
    Get-KitFile 'skills/sdd-end-patch/SKILL.md' | Should -Match 'merge\.noFf'
  }

  It 'el Art. IV nombra el cierre de patch' {
    Get-KitFile '.docs/sdd/constitution.md' | Should -Match 'el cierre de task y el de patch'
  }

  It 'la receta regenera el log con el script' {
    Get-KitFile 'skills/sdd-end-task/references/merge-recipe.md' | Should -Match 'Build-EstimationLog\.ps1'
  }

  It 'la receta fija los tres datos del informe de denegación' {
    $recipe = Get-KitFile 'skills/sdd-end-task/references/merge-recipe.md'
    foreach ($item in 'comando', 'texto de la denegación', 'hash') { $recipe | Should -Match $item }
  }

  It 'los dos pasos de rama paran ante la rama destino sacada con cambios sin commitear' {
    foreach ($skill in 'sdd-end-task', 'sdd-end-patch') {
      Get-KitFile "skills/$skill/SKILL.md" | Should -Match 'cambios sin commitear, no fusiones ahí'
    }
  }
}

Describe 'Push autorizado en el cierre: clave y pregunta' {
  It 'el bloque de claves de control tiene cuatro preguntas con su recomendación' {
    $block = [regex]::Match((Get-KitFile 'skills/sdd-start-task/references/control-profiles.md'),
      '(?ms)^## Preguntas de las claves de control\r?$.*').Value
    $block | Should -Match '(?m)^\| 4 \|'
    $block | Should -Match 'merge\.push'
  }

  It 'las init piden los frenos con la pregunta 4 del bloque' {
    foreach ($init in 'sdd-init-greenfield', 'sdd-init-brownfield') {
      Get-KitFile "skills/$init/SKILL.md" | Should -Match 'Frenos: pregunta 4 del mismo bloque'
    }
  }

  It 'la tabla de gates saca el push de la rama de integración de la fila de persona' {
    $table = Get-KitFile 'skills/sdd-start-task/references/control-profiles.md'
    $table | Should -Match '(?m)^\| Push de la rama de integración'
    $table | Should -Match '(?m)^\| Merge a main, tag, cualquier otro push'
  }

  It 'la misión nombra la excepción del push de la rama de integración' {
    Get-KitFile '.docs/sdd/mission.md' | Should -Match 'merge\.push'
  }
}

Describe 'Push autorizado en el cierre: paso de rama' {
  It 'los dos pasos de rama enlazan la sección Push de la receta y nombran merge.push' {
    Get-KitFile 'skills/sdd-end-task/SKILL.md' | Should -Match '\(references/merge-recipe\.md#push\)'
    Get-KitFile 'skills/sdd-end-patch/SKILL.md' | Should -Match '\(\.\./sdd-end-task/references/merge-recipe\.md#push\)'
    foreach ($skill in 'sdd-end-task', 'sdd-end-patch') { Get-KitFile "skills/$skill/SKILL.md" | Should -Match 'merge\.push' }
  }

  It 'la receta empuja al upstream y prohíbe forzar' {
    $section = [regex]::Match((Get-KitFile 'skills/sdd-end-task/references/merge-recipe.md'), '(?ms)^## Push\r?$.*?(?=^## |\z)').Value
    $section | Should -Match '@\{upstream\}'
    $section | Should -Match '--force'
    $section | Should -Match 'en un bloque'
  }
}
