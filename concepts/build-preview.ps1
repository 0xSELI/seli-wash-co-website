# Verification-only build: same page, same compositing, tiny textures, so the
# result fits the preview pane's snapshot limit. Not a deliverable.

Add-Type -AssemblyName System.Drawing

$dir  = Join-Path $PSScriptRoot 'assets'
$src  = Join-Path $PSScriptRoot 'transformation-homepage.html'
$dest = Join-Path $PSScriptRoot 'transformation-homepage.preview.html'

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }
$eps = New-Object System.Drawing.Imaging.EncoderParameters(1)
$eps.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, 70L)

$html = Get-Content -Path $src -Raw -Encoding UTF8

foreach ($name in @('concrete-clean-web', 'concrete-dirty-web')) {
    $img = [System.Drawing.Image]::FromFile((Join-Path $dir "$name.jpg"))
    $w = 640
    $h = [int][Math]::Round($img.Height * $w / $img.Width)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($img, 0, 0, $w, $h)
    $g.Dispose(); $img.Dispose()

    $ms = New-Object IO.MemoryStream
    $bmp.Save($ms, $codec, $eps)
    $bmp.Dispose()
    $b64 = [Convert]::ToBase64String($ms.ToArray())
    $ms.Dispose()

    $html = $html.Replace("assets/$name.jpg", "data:image/jpeg;base64,$b64")
    Write-Output "$name preview: $([int]($b64.Length / 1KB)) KB base64"
}

[IO.File]::WriteAllText($dest, $html, (New-Object Text.UTF8Encoding($false)))
Write-Output "wrote $([int]((Get-Item $dest).Length / 1KB)) KB"
