BeforeAll {
  $script:RepoRoot = if ($env:SDD_KIT_ROOT) { Resolve-Path $env:SDD_KIT_ROOT } else { Resolve-Path (Join-Path $PSScriptRoot '..') }

  function Get-KitFile([string]$RelativePath) {
    return Get-Content (Join-Path $script:RepoRoot $RelativePath) -Raw
  }

  $brief = Get-KitFile 'skills/sdd-start-feature/references/encargo-revision.md'
  $script:FinalReviewer = [regex]::Match($brief, '(?ms)^## Revisor final.*?(?=^## Encargo del implementador)').Value
}

Describe 'Paquete del revisor final' {
  It 'corta desde el merge-base actual con la rama de integración y su remota' {
    $script:FinalReviewer | Should -Match ([regex]::Escape('MERGE_BASE=$(git merge-base HEAD <integración> $(git rev-parse -q --verify origin/<integración>))'))
    $script:FinalReviewer | Should -Match 'Con remoto, `git fetch` antes'
  }

  It 'se ejecuta desde la raíz del repo' {
    $script:FinalReviewer | Should -Match ([regex]::Escape('cd "$(git rev-parse --show-toplevel)"'))
  }

  It 'excluye red/ y green/ con glob' {
    $script:FinalReviewer | Should -Match ([regex]::Escape("':(exclude,glob).docs/sdd/specs/**/red/**'"))
    $script:FinalReviewer | Should -Match ([regex]::Escape("':(exclude,glob).docs/sdd/specs/**/green/**'"))
  }

  It 'escribe el paquete en el workspace de superpowers' {
    $script:FinalReviewer | Should -Match 'OUT="\$\(bash "<ruta de sdd-workspace>" "<PLAN_FILE>"\)/review-final-'
  }

  It 'en lite usa spec.md como PLAN_FILE' {
    $script:FinalReviewer | Should -Match 'lite[^\n]*`PLAN_FILE`[^\n]*`spec\.md`'
  }

  It 'el revisor lee el paquete del kit, no el de review-package' {
    $script:FinalReviewer | Should -Not -Match '<ruta que imprime review-package>'
    $script:FinalReviewer | Should -Match 'Lee el paquete de review `<ruta del paquete que imprime la receta>`'
  }

  It 'las filas de executing-plans y subagent-driven-development dicen que la revisión final usa el paquete del kit' {
    $overrides = Get-KitFile 'skills/sdd-start-feature/references/overrides-superpowers.md'
    $overrides | Should -Match '`executing-plans` \(Native\)[^\n]*paquete del revisor final'
    $overrides | Should -Match '\| `subagent-driven-development` \|[^\n]*paquete del revisor final'
  }
}

Describe 'Revisor final en el plan' {
  It 'la plantilla lo fija en el techo y no deja quitarlo' {
    $template = Get-KitFile 'skills/sdd-templates/templates/plan-template.md'
    $template | Should -Match 'revisor final de rama no sigue esta política[^\n]*`sdd-kit:effort-high` \+ `opus`'
    $template | Should -Match 'no hay subagentes que auditar'
  }
}
