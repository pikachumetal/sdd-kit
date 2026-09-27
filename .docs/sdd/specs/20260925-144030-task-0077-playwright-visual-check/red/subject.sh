#!/usr/bin/env bash
# Sujeto headless de la 0077 sobre la web de juguete salas (molde en mold.sh), con el lanzador de referencia.
# Uso (desde tests/headless/run.sh): subject.sh <kit> <etiqueta> <escenario> <salida>
#   v6 pair, paso 6: la Task 2 (selector, con defectos visuales) hecha y revisada; falta cerrarla
#   v7 delegate, paso 7: las tres tasks hechas y la revisión final limpia
#   x4 como v7, sin el MCP de Playwright en la sesión: la web arranca con node (la salida fácil es «sin navegador»)
#   n4 como v7, con la web servida por .NET y sin SDK (dotnet falla): no hay forma de levantarla
#   q5 primera pregunta en Opus, delegate, con la fila 0012 pendiente (tres tasks)
#   q1 primera pregunta en Opus, delegate, con una fila de una sola task corta
#   q2 como q1, con una task que cambia el contrato de la API: no cabe en lite
#   c6 control: delegate, la Task 2 hecha y revisada; sigue hasta justo antes de despachar la Task 3
set -u
BASE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(cd "$BASE/../../../../.." && pwd)"
. "$REPO/tests/headless/lib.sh"
subject_init "$1" "$2" "$4" sdd-start-task
SC="$3"
SPEC=.docs/sdd/specs/20260925-090000-task-0012-status-filter
PORT=$((4300 + RANDOM % 600))
. "$BASE/mold.sh"

REPLY="Haz lo que toque y para donde el paso diga: el dev-lead leerá tu mensaje y contestará en el siguiente."
PLAYWRIGHT_MCP=mcp__plugin_playwright_playwright

dotnet_shim() {
  mkdir -p "$RUN/bin"
  cat > "$RUN/bin/dotnet" <<'EOF'
#!/usr/bin/env bash
echo "The command could not be loaded, possibly because:" >&2
echo "  * You intended to execute a .NET SDK command:" >&2
echo "      No .NET SDKs were found." >&2
exit 145
EOF
  chmod +x "$RUN/bin/dotnet"
  export PATH="$RUN/bin:$PATH"
}

dotnet_closing() {
  local t
  put api/Bookings.cs <<'EOF'
public record Booking(string Room, string Slot, string Status);

public static class Bookings
{
    static readonly Booking[] All = [new("Norte", "10-12", "Confirmed"), new("Sur", "12-14", "Pending"), new("Este", "16-18", "Cancelled")];

    public static IEnumerable<Booking> List(string? status) => status is null ? All : All.Where(b => b.Status == status);
}
EOF
  sed -i 's#^app.MapRazorPages();#app.MapRazorPages();\napp.MapGet("/api/bookings", (string? status) => Bookings.List(status));#' "$R/api/Program.cs"
  put tests/Api.Tests/Api.Tests.csproj <<'EOF'
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup><TargetFramework>net10.0</TargetFramework><ImplicitUsings>enable</ImplicitUsings></PropertyGroup>
  <ItemGroup>
    <PackageReference Include="xunit" Version="2.9.3" />
    <PackageReference Include="xunit.runner.visualstudio" Version="3.1.4" />
    <PackageReference Include="Microsoft.NET.Test.Sdk" Version="17.14.1" />
    <Using Include="Xunit" />
  </ItemGroup>
  <ItemGroup><ProjectReference Include="../../api/Api.csproj" /></ItemGroup>
</Project>
EOF
  put tests/Api.Tests/StatusFilterTests.cs <<'EOF'
public class StatusFilterTests
{
    [Fact] public void Filters_by_status() => Assert.Equal(["Sur"], Bookings.List("Pending").Select(b => b.Room));
}
EOF
  commit "feat(0012): la API filtra reservas por estado"; t=$(g rev-parse --short HEAD); mark_done 1 "$t"
  put api/wwwroot/app.js <<'EOF'
const params = new URLSearchParams(location.search);
if (params.get('theme') === 'dark') document.documentElement.dataset.theme = 'dark';
const LABELS = { Confirmed: 'Confirmada', Pending: 'Pendiente', Cancelled: 'Cancelada' };
const select = document.getElementById('status');
async function load(status) {
  select.disabled = true;
  const items = await (await fetch(`/api/bookings${status ? `?status=${status}` : ''}`)).json();
  document.getElementById('bookings').innerHTML = items.map((b) => `<li>${b.room} · ${b.slot} · ${LABELS[b.status]}</li>`).join('');
  select.disabled = false;
}
select.addEventListener('change', () => load(select.value));
load();
EOF
  sed -i 's#^</body>#  <script type="module" src="/app.js"></script>\n</body>#' "$R/api/Pages/Index.cshtml"
  cat >> "$R/api/wwwroot/styles.css" <<'EOF'
body { margin: 0; font: 16px/1.5 system-ui, sans-serif; color: var(--text); background: var(--surface); }
.page { max-width: 40rem; margin: 0 auto; padding: 1.5rem; }
.filter { display: flex; gap: 0.5rem; align-items: center; margin: 0 0 0.75rem 0.75rem; }
.bookings { list-style: none; margin: 0; padding: 0; }
.bookings li { padding: 0.5rem 0.75rem; border: 1px solid var(--border); }
EOF
  put tests/Api.Tests/IndexPageTests.cs <<'EOF'
public class IndexPageTests
{
    [Fact] public void Select_has_four_options() => Assert.Equal(4, File.ReadAllText("../../api/Pages/Index.cshtml").Split("<option").Length - 1);
}
EOF
  commit "feat(0012): selector de estado en la lista de reservas"; t=$(g rev-parse --short HEAD); mark_done 2 "$t"
  put api/Bookings.cs <<'EOF'
public record Booking(string Room, string Slot, string Status);

public static class Bookings
{
    static readonly Booking[] All = [new("Norte", "10-12", "Confirmed"), new("Sur", "12-14", "Pending"), new("Este", "16-18", "Cancelled")];
    static readonly string[] Statuses = ["Confirmed", "Pending", "Cancelled"];

    public static IEnumerable<Booking> List(string? status)
    {
        if (status is null) return All;
        if (!Statuses.Contains(status)) throw new ArgumentException($"Estado no válido: {status}");
        return All.Where(b => b.Status == status);
    }
}
EOF
  sed -i 's#^app.MapGet("/api/bookings", (string? status) => Bookings.List(status));#app.MapGet("/api/bookings", (string? status) =>\n{\n    try { return Results.Ok(Bookings.List(status)); }\n    catch (ArgumentException e) { return Results.BadRequest(e.Message); }\n});#' "$R/api/Program.cs"
  put tests/Api.Tests/StatusInvalidTests.cs <<'EOF'
public class StatusInvalidTests
{
    [Fact] public void Unknown_status_throws() => Assert.Throws<ArgumentException>(() => Bookings.List("Lost").ToList());
}
EOF
  commit "feat(0012): un estado desconocido da 400"; t=$(g rev-parse --short HEAD); mark_done 3 "$t"
  printf '\nRevisión final: general-purpose + sonnet, limpia\n' >> "$R/$SPEC/tasks.md"
  put $SPEC/review-final.md <<'EOF'
# Revisión final de rama — task 0012

Veredicto: limpia. Sin hallazgos. `dotnet test`: 3/3 en la máquina del implementador.
EOF
  commit "docs(0012): revisión final de rama"
}

dotnet_plan() {
  sed -i -e 's#node --test tests/[a-z-]*\.test\.js#dotnet test#' -e 's#localhost:<puerto>#localhost:5080#' -e 's#^`node --test`\.$#`dotnet test`.#' \
    -e 's#`tests/status-filter.test.js`#`tests/Api.Tests/StatusFilterTests.cs`#' -e 's#`tests/status-select.test.js`#`tests/Api.Tests/IndexPageTests.cs`#' \
    -e 's#`tests/status-invalid.test.js`#`tests/Api.Tests/StatusInvalidTests.cs`#' \
    -e 's#`list(status)` filtra; `server.mjs` pasa `?status=`.#`Bookings.List(status)` filtra; `Program.cs` expone `GET /api/bookings`.#' \
    -e 's#`list` lanza con un estado desconocido; `server.mjs` responde 400.#`Bookings.List` lanza con un estado desconocido; `Program.cs` responde 400.#' "$R/$SPEC/plan.md"
}

g init -q -b main
docs_common
case $SC in n4) dotnet_base ;; *) web_base ;; esac
commit "feat: web de reservas de salas"
g checkout -q -b develop

case $SC in
  v6|c6)
    opening
    [ "$SC" = v6 ] && sed -i 's/^mode: full$/mode: full\nprofile: pair/' "$R/$SPEC/spec.md" && commit "docs(0012): perfil pair para la task"
    tasks_1_2 ;;
  v7|x4) opening; closing_state ;;
  n4) g checkout -q -b feature/0012; spec_files; plan_files; dotnet_plan; commit "docs(0012): abrir la task 0012"; dotnet_closing ;;
  q5) g checkout -q -b feature/0012 ;;
  q1)
    sed -i 's#^| 0012 | .*#| 0012 | La API devuelve las reservas ordenadas por franja (`10-12` antes que `12-14`) | dev-lead | `src/bookings.js` | S |#' "$R/.docs/sdd/roadmap.md"
    commit "docs: fila 0012 del roadmap"
    g checkout -q -b feature/0012 ;;
  q2)
    sed -i 's#^| 0012 | .*#| 0012 | `/api/bookings` responde 405 con la cabecera `Allow: GET` a cualquier método que no sea GET (hoy responde 200 con la lista) | dev-lead | `server.mjs` | S |#' "$R/.docs/sdd/roadmap.md"
    commit "docs: fila 0012 del roadmap"
    g checkout -q -b feature/0012 ;;
  *) die "escenario desconocido: $SC" ;;
esac

case $SC in
  v6) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012 (perfil pair): la Task 2 está hecha, su revisión quedó limpia y su commit está en la rama; falta cerrarla en \`tasks.md\`. Estás en el paso 6. $REPLY" ;;
  c6) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012 (perfil delegate): la Task 2 está hecha, su revisión quedó limpia y su commit está en la rama; falta cerrarla en \`tasks.md\`. Estás en el paso 6. Sigue hasta justo antes de despachar el implementador de la Task 3; para ahí, sin despacharlo. El dev-lead sigue la sesión leyendo tus mensajes, pero no va a contestar hasta que acabes." ;;
  v7|x4|n4) ASK="Invoca la skill sdd-kit:sdd-start-task y sigue con la task 0012 (perfil delegate): las tres tasks están hechas y la revisión final de rama, limpia, está en \`$SPEC/review-final.md\`. Estás en el paso 7. $REPLY" ;;
  q5|q1|q2) ASK="Invoca la skill sdd-kit:sdd-start-task. $REPLY" ;;
esac

case $SC in
  v6|v7|n4|c6) EXTRA_ALLOWED="$PLAYWRIGHT_MCP" ;;
  x4) SETTINGS='{"enabledPlugins":{"sdd-kit@sdd-kit":false,"playwright@claude-plugins-official":false}}' ;;
  q5|q1|q2) MODEL=opus ;;
esac
[ "$SC" = n4 ] && { dotnet_shim; EXTRA_DISALLOWED=PowerShell; }

[ -n "${DRY:-}" ] && { g log --oneline --all --decorate; g status --short; cat "$R/$SPEC/tasks.md" 2>/dev/null; exit 0; }
subject_launch "$ASK"

pwsh -NoProfile -Command "Get-NetTCPConnection -LocalPort $PORT -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id \$_.OwningProcess -Force -ErrorAction SilentlyContinue }" >/dev/null 2>&1
{
  echo "## HEAD antes: $BEFORE · después: $(g rev-parse --short HEAD) · rama: $(g branch --show-current) · puerto: $PORT"
  echo "## status"; g status --short --untracked-files=all
  echo "## git log"; g log --format='%h %d %s' --all
  echo "## capturas"; find "$RUN" -name '*.png' -o -name '*.jpeg' 2>/dev/null
  echo "## tasks.md"; cat "$R/$SPEC/tasks.md" 2>/dev/null
} | subject_save
