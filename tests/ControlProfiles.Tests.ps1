BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }
}

Describe 'Perfiles de control: arranque y ejecución' {
  It 'la tabla de gates existe y nombra los tres perfiles' {
    $table = Get-KitFile 'skills/sdd-start-feature/references/control-profiles.md'
    foreach ($profileName in 'pair', 'delegate', 'unattended') { $table | Should -Match "``$profileName``" }
  }

  It 'la tabla declara las claves de control con su default' {
    $table = Get-KitFile 'skills/sdd-start-feature/references/control-profiles.md'
    $keys = 'control.profile', 'control.maxParallelAgents', 'control.silence.betweenStepsMinutes',
      'control.silence.longCommandMinutes', 'merge.into', 'merge.noFf', 'merge.removeWorktree', 'merge.push'
    foreach ($key in $keys) { $table | Should -Match ([regex]::Escape($key)) }
  }

  It 'sdd-start-feature enlaza la tabla en vez de copiarla' {
    $skill = Get-KitFile 'skills/sdd-start-feature/SKILL.md'
    $skill | Should -Match '\(references/control-profiles\.md\)'
    $skill | Should -Not -Match 'maxParallelAgents'
  }

  It 'los rulings los arbitra sdd-implement y el merge sdd-archive, sin finishing-a-development-branch' {
    Get-KitFile 'skills/sdd-start-feature/references/overrides-superpowers.md' | Should -Not -Match 'finishing-a-development-branch'
    Get-KitFile 'skills/sdd-implement/SKILL.md' | Should -Match '(?i)ruling'
  }

  It 'la review de spec no se propone por defecto' {
    Get-KitFile 'skills/sdd-start-feature/references/review-spec.md' | Should -Match '4 señales o más'
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

  It 'sdd-archive enlaza la tabla y aplica la política de merge' {
    $skill = Get-KitFile 'skills/sdd-archive/SKILL.md'
    $skill | Should -Match 'sdd-start-feature/references/control-profiles\.md'
    $skill | Should -Match '🧪'
    $skill | Should -Not -Match 'decidir merge/PR \*\*con el usuario\*\*'
  }

  It 'sdd-end-release valida las tasks diferidas a su smoke' {
    Get-KitFile 'skills/sdd-end-release/SKILL.md' | Should -Match '🧪'
  }

  It 'la migración a v2.0.0 pregunta las claves de control' {
    $migration = Get-KitFile 'skills/sdd-init/references/migrations/v2.0.0.md'
    $migration | Should -Match 'control\.profile'
    $migration | Should -Match 'merge'
  }

  It 'las init y la migración invocan sdd-config sin copiar sus preguntas' {
    $block = Get-KitFile 'skills/sdd-config/SKILL.md'
    $block | Should -Match '(?m)^## Catálogo'
    ($block | Select-String -Pattern 'Recomendad[ao]' -AllMatches).Matches.Count | Should -BeGreaterOrEqual 3
    $consumers = 'skills/sdd-init-greenfield/SKILL.md', 'skills/sdd-init-brownfield/SKILL.md',
      'skills/sdd-init/references/migrations/v2.0.0.md'
    foreach ($consumer in $consumers) {
      Get-KitFile $consumer | Should -Match '`sdd-config`'
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
  It 'la primera pregunta propone partir según el umbral con tramo 4-5 (patch 0078)' {
    $skill = Get-KitFile 'skills/sdd-propose/SKILL.md'
    $skill | Should -Match 'With 3 or fewer never propose splitting; with more than 5, always; with 4 or 5, only if they touch different capabilities or surfaces \(DB, UI, API\) or one carries a migration'
    $skill | Should -Not -Match 'más de 3 tasks internas'
  }
}

Describe 'Perfiles de control: aprobación explícita y 🧪 sin validar en la release' {
  It 'elegir un alcance no cuenta como aprobar la spec' {
    Get-KitFile 'skills/sdd-propose/SKILL.md' | Should -Match '(?i)choosing a scope'
  }

  It 'la task 🧪 que el smoke no valida conserva la forma con disparador nuevo' {
    Get-KitFile 'skills/sdd-end-release/SKILL.md' | Should -Match 'disparador nuevo'
  }
}

Describe 'Perfiles de control: validación diferida con disparador vago (patch 0037)' {
  It 'control-profiles concreta el disparador en vez de dejar la task EN ESPERA' {
    $section = [regex]::Match((Get-KitFile 'skills/sdd-start-feature/references/control-profiles.md'),
      '(?ms)^## Validación diferida\r?$.*?(?=^## )').Value
    $section | Should -Match 'uso más próximo'
    $section | Should -Match 'a cargo de <quien difiere>'
    $section | Should -Match 'mensaje de cierre'
    $section | Should -Not -Match 'Sin las tres condiciones no hay diferido'
  }

  It 'la validación de sdd-archive no vuelve a preguntar el disparador' {
    $step = [regex]::Match((Get-KitFile 'skills/sdd-archive/SKILL.md'), '(?ms)^1\. \*\*Validation\*\*.+?(?=^2\. )').Value
    $step | Should -Match "don't ask again; make the nearest use concrete"
    $step | Should -Match 'say it in the final message'
  }

  It 'el mensaje final de sdd-archive dice el disparador concretado, y solo él' {
    $skill = Get-KitFile 'skills/sdd-archive/SKILL.md'
    [regex]::Match($skill, '(?ms)^9\. \*\*Final message\*\*.+?(?=^## )').Value | Should -Match 'lo elegí yo'
    [regex]::Match($skill, '(?ms)^8\. \*\*Kit ticket\*\*.+?(?=^9\. )').Value | Should -Not -Match 'lo elegí yo'
  }
}

Describe 'Perfiles de control: la opción de diferir trae su disparador (patch 0080)' {
  It 'control-profiles: elegir la opción es la frase y el disparador' {
    $section = [regex]::Match((Get-KitFile 'skills/sdd-start-feature/references/control-profiles.md'),
      '(?ms)^## Validación diferida\r?$.*?(?=^## )').Value
    $section | Should -Match 'lo pruebo en <uso más próximo>, a cargo de <quien valida>'
    $section | Should -Match 'es la frase literal'
  }

  It 'la validación de sdd-archive y el paso 7 de sdd-start-feature lo aplican' {
    [regex]::Match((Get-KitFile 'skills/sdd-archive/SKILL.md'), '(?ms)^1\. \*\*Validation\*\*.+?(?=^2\. )').Value | Should -Match '«Diferir» without text is the phrase and the trigger'
    [regex]::Match((Get-KitFile 'skills/sdd-start-feature/SKILL.md'), '(?m)^7\. .+$').Value | Should -Match 'sin texto es la frase y el disparador'
  }
}

Describe 'Perfiles de control: el CLAUDE.md del repo no contradice la tabla' {
  It 'la regla de delegate nombra sus paradas: spec, desvío y validación final' {
    $rule = [regex]::Match((Get-KitFile 'CLAUDE.md'), '(?m)^\d+\. \*\*Cuando el dev-lead delega.+$').Value
    $rule | Should -Match 'control-profiles\.md'
    foreach ($stop in 'aprobación de la spec', 'desvío', 'validación final') { $rule | Should -Match $stop }
  }
}

Describe 'Merge en el cierre' {
  BeforeAll {
    $script:Archive = Get-KitFile 'skills/sdd-archive/SKILL.md'
    $script:Recipe = Get-KitFile 'skills/sdd-archive/references/merge-recipe.md'
  }

  It 'el paso del merge enlaza la receta' {
    $script:Archive | Should -Match '\(references/merge-recipe\.md\)'
  }

  It 'el cierre lee la política de merge' {
    $script:Archive | Should -Match 'merge\.noFf'
  }

  It 'el Art. IV nombra el cierre de patch' {
    Get-KitFile '.docs/sdd/constitution.md' | Should -Match 'el cierre de feature y el de patch'
  }

  It 'la receta regenera el log con el script' {
    $script:Recipe | Should -Match 'sdd estimation log'
  }

  It 'la receta fija los tres datos del informe de denegación' {
    foreach ($item in '\*\*command\*\*', '\*\*denial''s text\*\*', '\*\*hash\*\*') { $script:Recipe | Should -Match $item }
  }

  It 'la receta y el paso del merge fusionan con sdd merge' {
    $script:Recipe | Should -Match 'sdd merge --project-root'
    $script:Archive | Should -Match 'sdd\.js" merge'
  }

  It 'la receta pasa como --verify el gate de merge' {
    # Patch 0051: con «la suite del proyecto» y un hook que corre el conjunto rápido, 0/2 sujetos ejecutaron la completa.
    $script:Recipe | Should -Match '--verify "<merge gate>"'
    $script:Recipe | Should -Match '\*\*`--verify`\*\*: the merge gate of `tech-stack\.md` §Testing'
  }

  It 'la receta pasa --push con el push confirmado o autorizado por merge.push y no rehace el merge a mano' {
    $script:Recipe | Should -Match '(?m)^2\. Words of the user in this session confirming the push'
    $script:Recipe | Should -Match '(?m)^3\. `merge\.push: true` \(profile `delegate` or `unattended`\): `--push`'
    $script:Recipe | Should -Match 'Never redo it by hand'
    $script:Recipe | Should -Not -Match 'git worktree add [^\n]*merge-'
  }

  It 'ningún texto de skill lleva caracteres de control' {
    # Un here-string de PowerShell con comillas dobles convierte `b o `v en caracteres de control sin avisar.
    $root = Join-Path $PSScriptRoot '../skills'
    $dirty = Get-ChildItem -LiteralPath $root -Recurse -Filter '*.md' |
      Where-Object { [IO.File]::ReadAllText($_.FullName) -match '[\x00-\x08\x0B\x0C\x0E-\x1F]' } |
      ForEach-Object { $_.FullName }
    $dirty | Should -BeNullOrEmpty
  }

  It 'el cierre para ante la rama destino sacada con cambios sin commitear' {
    $script:Archive | Should -Match 'With `destino sacado:`, stop with its output before writing anything'
  }
}

Describe 'Push autorizado en el cierre: clave y pregunta' {
  It 'el catálogo de sdd-config tiene la pregunta del push' {
    $block = [regex]::Match((Get-KitFile 'skills/sdd-config/SKILL.md'),
      '(?ms)^## Catálogo\r?$.*').Value
    $block | Should -Match '(?m)^\| 4 \|'
    $block | Should -Match 'merge\.push'
  }

  It 'las init piden los frenos a través de sdd-config' {
    foreach ($init in 'sdd-init-greenfield', 'sdd-init-brownfield') {
      Get-KitFile "skills/$init/SKILL.md" | Should -Match 'sdd-config`.*frenos'
    }
  }

  It 'la tabla de gates saca el push de la rama de integración de la fila de persona' {
    $table = Get-KitFile 'skills/sdd-start-feature/references/control-profiles.md'
    $table | Should -Match '(?m)^\| Push de la rama de integración'
    $table | Should -Match '(?m)^\| Merge a main, tag, cualquier otro push'
  }

  It 'la misión nombra la excepción del push de la rama de integración' {
    Get-KitFile '.docs/sdd/mission.md' | Should -Match 'merge\.push'
  }
}

Describe 'Push autorizado en el cierre: paso del merge' {
  It 'la receta empuja con --push del script y no publica sin merge.push' {
    $section = [regex]::Match((Get-KitFile 'skills/sdd-archive/references/merge-recipe.md'), '(?ms)^## Push\r?$.*?(?=^## |\z)').Value
    $section | Should -Match '`--push`'
    $section | Should -Match '`merge\.push` missing or `false`'
  }
}

Describe 'Mensaje final del cierre' {
  It 'el último paso de sdd-archive es el mensaje final y acaba con la línea de terminado' {
    $step = [regex]::Match((Get-KitFile 'skills/sdd-archive/SKILL.md'), '(?ms)^9\. .+?(?=^## )').Value
    $step | Should -Match '^\d+\. \*\*Final message\*\*'
    foreach ($literal in '**Terminado.**', '**No terminado.**', 'worktree', 'ticket') { $step.Contains($literal) | Should -BeTrue -Because "falta $literal" }
  }
}

Describe 'Mensaje final del cierre: solo se borra un worktree enlazado' {
  It 'sdd-archive no ofrece borrar el checkout principal' {
    $skill = Get-KitFile 'skills/sdd-archive/SKILL.md'
    $skill | Should -Match '--git-common-dir'
    $skill | Should -Match 'the line ends at the push'
  }

  It 'la receta decide el push con pair primero' {
    $section = [regex]::Match((Get-KitFile 'skills/sdd-archive/references/merge-recipe.md'), '(?ms)^## Push\r?$.*?(?=^## |\z)').Value
    $section | Should -Match '(?m)^1\. Profile `pair`'
  }
}
