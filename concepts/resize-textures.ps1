# Downscales the source concrete textures to web size using System.Drawing.
# The hero never renders wider than ~1500px, so anything above that is weight
# with no visible benefit.

Add-Type -AssemblyName System.Drawing

$dir = Join-Path $PSScriptRoot 'assets'
$targetWidth = 1500
$quality = 82L

$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
    Where-Object { $_.MimeType -eq 'image/jpeg' }
$eps = New-Object System.Drawing.Imaging.EncoderParameters(1)
$eps.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
    [System.Drawing.Imaging.Encoder]::Quality, $quality)

foreach ($name in @('concrete-clean', 'concrete-dirty')) {
    $src  = Join-Path $dir "$name.jpg"
    $dest = Join-Path $dir "$name-web.jpg"

    $img = [System.Drawing.Image]::FromFile($src)
    try {
        $w = $targetWidth
        $h = [int][Math]::Round($img.Height * $w / $img.Width)

        $bmp = New-Object System.Drawing.Bitmap($w, $h)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        try {
            $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
            $g.DrawImage($img, 0, 0, $w, $h)
        } finally { $g.Dispose() }

        $bmp.Save($dest, $codec, $eps)
        $bmp.Dispose()

        $kb = [int]((Get-Item $dest).Length / 1KB)
        Write-Output "$name : $($img.Width)x$($img.Height) -> ${w}x${h}, ${kb} KB"
    } finally { $img.Dispose() }
}
