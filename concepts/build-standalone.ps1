# Inlines the concrete textures as data URIs, producing a single self-contained
# file. The source page keeps readable relative paths; only the published copy
# carries the base64, because the artifact host blocks external requests.

$src  = Join-Path $PSScriptRoot 'transformation-homepage.html'
$dest = Join-Path $PSScriptRoot 'transformation-homepage.standalone.html'
$dir  = Join-Path $PSScriptRoot 'assets'

$html = Get-Content -Path $src -Raw -Encoding UTF8

foreach ($name in @('concrete-clean-web', 'concrete-dirty-web')) {
    $file = Join-Path $dir "$name.jpg"
    $b64  = [Convert]::ToBase64String([IO.File]::ReadAllBytes($file))
    $html = $html.Replace("assets/$name.jpg", "data:image/jpeg;base64,$b64")
    Write-Output "inlined $name : $([int]($b64.Length / 1KB)) KB base64"
}

[IO.File]::WriteAllText($dest, $html, (New-Object Text.UTF8Encoding($false)))
Write-Output "wrote $dest : $([int]((Get-Item $dest).Length / 1KB)) KB"
