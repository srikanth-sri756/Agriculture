# Downloads royalty-free Unsplash photos for the splash Trishul.
# Re-run safely: existing files are skipped unless -Force is passed.
[CmdletBinding()]
param([switch]$Force)

$ErrorActionPreference = "Stop"
$dir = Join-Path $PSScriptRoot "..\public\images\splash"
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

# Curated royalty-free Unsplash photos (License: Unsplash; free for commercial use).
# Format: https://images.unsplash.com/photo-{id}?w=512&auto=format&fit=crop&q=80
$assets = @(
    @{ name = "paddy.jpg";     id = "1568480289356-5a75d0fd47fc" }  # rice paddy field
    @{ name = "wheat.jpg";     id = "1574323347407-f5e1ad6d020b" }  # wheat ears
    @{ name = "bamboo.jpg";    id = "1517502884422-41eaead166d4" }  # bamboo grove
    @{ name = "sunflower.jpg"; id = "1597848212624-a19eb35e2651" }  # sunflower
    @{ name = "marigold.jpg";  id = "1599598425947-5a14f0cf1d2f" }  # marigold
    @{ name = "rose.jpg";      id = "1518895949257-7621c3c786d7" }  # rose
    @{ name = "tomato.jpg";    id = "1592924357228-91a4daadcfea" }  # tomato
    @{ name = "chilli.jpg";    id = "1583664580060-ceb1cae15ebc" }  # red chilli
    @{ name = "corn.jpg";      id = "1601593768799-76d3f4b6f3a3" }  # corn cobs
    @{ name = "cabbage.jpg";   id = "1518977676601-b53f82aba655" }  # cabbage
    @{ name = "carrot.jpg";    id = "1447175008436-054170c2e979" }  # carrots
    @{ name = "cucumber.jpg";  id = "1604977042946-1eecc30f269e" }  # cucumber
    @{ name = "field.jpg";     id = "1500382017468-9049fed747ef" }  # open green field
    @{ name = "leaf.jpg";      id = "1535189487909-a262ad10c165" }  # green herb / leaf
)

foreach ($a in $assets) {
    $out = Join-Path $dir $a.name
    if ((Test-Path $out) -and -not $Force) {
        Write-Host "SKIP  $($a.name) (exists)"
        continue
    }
    $url = "https://images.unsplash.com/photo-$($a.id)?w=512&auto=format&fit=crop&q=80"
    try {
        Write-Host "GET   $($a.name)"
        Invoke-WebRequest -Uri $url -OutFile $out -UseBasicParsing -TimeoutSec 30
    }
    catch {
        Write-Warning "FAIL  $($a.name) -> $($_.Exception.Message)"
    }
}

Write-Host "`nDone. Saved to: $dir"
Write-Host "Tip: replace any photo by overwriting the file with your own image of the same name."
