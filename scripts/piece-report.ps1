param(
    [string]$Filter = "ai"
)

$root = "packages\pieces\community"

Get-ChildItem $root -Directory |
Where-Object { $_.Name -match $Filter } |
ForEach-Object {

    $folder = $_.FullName
    $index = Join-Path $folder "src\index.ts"

    if (!(Test-Path $index)) {
        return
    }

    $content = Get-Content $index -Raw

    $display = ""
    $auth = ""
    $description = ""
    $categories = ""

    if ($content -match 'displayName:\s*[`'"]([^`'"]+)') {
        $display = $matches[1]
    }

    if ($content -match 'auth:\s*([A-Za-z0-9_]+)') {
        $auth = $matches[1]
    }

    if ($content -match 'description:\s*[`'"]([^`'"]+)') {
        $description = $matches[1]
    }

    if ($content -match 'categories:\s*\[(.*?)\]') {
        $categories = $matches[1] -replace '\s+', ' '
    }

    [PSCustomObject]@{
        Piece        = $_.Name
        DisplayName  = $display
        Auth         = $auth
        Categories   = $categories
        Description  = $description
    }

} | Sort-Object Piece | Export-Csv AI-Pieces.csv -NoTypeInformation

Write-Host ""
Write-Host "AI-Pieces.csv generated successfully."