$SourcePath = "D:\reserv\local.properties"
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$EnvPath = Join-Path $ProjectRoot ".env.local"
$GitignorePath = Join-Path $ProjectRoot ".gitignore"

if (!(Test-Path $SourcePath)) {
    Write-Host "ERROR: local.properties not found at $SourcePath" -ForegroundColor Red
    exit 1
}

$map = @{
    "supabase.url" = "VITE_SUPABASE_URL"
    "supabase.anon.key" = "VITE_SUPABASE_ANON_KEY"
    "supabase.service.role.key" = "SUPABASE_SERVICE_ROLE_KEY"
    "openai.api.key" = "OPENAI_API_KEY"

    "SUPABASE_URL" = "VITE_SUPABASE_URL"
    "SUPABASE_ANON_KEY" = "VITE_SUPABASE_ANON_KEY"
    "SUPABASE_SERVICE_ROLE_KEY" = "SUPABASE_SERVICE_ROLE_KEY"
    "OPENAI_API_KEY" = "OPENAI_API_KEY"

    "VITE_SUPABASE_URL" = "VITE_SUPABASE_URL"
    "VITE_SUPABASE_ANON_KEY" = "VITE_SUPABASE_ANON_KEY"
}

$values = @{}

Get-Content $SourcePath | ForEach-Object {
    $line = $_.Trim()

    if ($line -eq "" -or $line.StartsWith("#")) {
        return
    }

    $parts = $line -split "=", 2

    if ($parts.Count -eq 2) {
        $key = $parts[0].Trim()
        $value = $parts[1].Trim()

        if ($map.ContainsKey($key)) {
            $envKey = $map[$key]
            $values[$envKey] = $value
        }
    }
}

$required = @(
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY"
)

$optional = @(
    "OPENAI_API_KEY",
    "SUPABASE_SERVICE_ROLE_KEY"
)

foreach ($key in $required) {
    if (!$values.ContainsKey($key) -or [string]::IsNullOrWhiteSpace($values[$key])) {
        Write-Host "MISSING REQUIRED: $key" -ForegroundColor Red
    } else {
        Write-Host "FOUND: $key" -ForegroundColor Green
    }
}

foreach ($key in $optional) {
    if ($values.ContainsKey($key) -and ![string]::IsNullOrWhiteSpace($values[$key])) {
        Write-Host "FOUND: $key" -ForegroundColor Green
    } else {
        Write-Host "OPTIONAL MISSING: $key" -ForegroundColor Yellow
    }
}

$envLines = @()

$orderedKeys = @(
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
    "OPENAI_API_KEY",
    "SUPABASE_SERVICE_ROLE_KEY"
)

foreach ($key in $orderedKeys) {
    if ($values.ContainsKey($key)) {
        $envLines += "$key=$($values[$key])"
    }
}

Set-Content -Path $EnvPath -Value $envLines -Encoding UTF8

Write-Host ".env.local created/updated successfully at $EnvPath" -ForegroundColor Green

$gitignoreRequired = @(
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",
    "local.properties",
    "*.keystore"
)

if (!(Test-Path $GitignorePath)) {
    New-Item -Path $GitignorePath -ItemType File | Out-Null
}

$gitignoreContent = Get-Content $GitignorePath -ErrorAction SilentlyContinue

foreach ($item in $gitignoreRequired) {
    if ($gitignoreContent -notcontains $item) {
        Add-Content -Path $GitignorePath -Value $item
        Write-Host "Added to .gitignore: $item" -ForegroundColor Cyan
    }
}

Write-Host "Done. Restart Vite dev server: npm run dev" -ForegroundColor Green
