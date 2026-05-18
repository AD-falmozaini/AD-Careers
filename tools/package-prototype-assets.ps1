$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$PackageRoot = Join-Path $Root "outputs\csb-migration\prototype-assets"
$ManifestPath = Join-Path $PackageRoot "asset-manifest.csv"
$ReadmePath = Join-Path $PackageRoot "README.md"

New-Item -ItemType Directory -Force -Path $PackageRoot | Out-Null

$HtmlFiles = Get-ChildItem -LiteralPath $Root -Filter "*.html" -File
$CssFiles = Get-ChildItem -LiteralPath $Root -Filter "*.css" -File

$refs = New-Object System.Collections.Generic.List[object]

function Add-AssetRef {
  param(
    [string]$SourceFile,
    [string]$Reference,
    [string]$Context
  )
  if ([string]::IsNullOrWhiteSpace($Reference)) { return }
  if ($Reference -match "^(https?:)?//") { return }
  if ($Reference -match "^(mailto:|tel:|#|javascript:)") { return }
  if ($Reference -match "\.html($|[?#])") { return }
  if ($Reference -match "^data:") { return }

  $clean = ($Reference -split "[?#]")[0]
  if ([string]::IsNullOrWhiteSpace($clean)) { return }
  $clean = [System.Net.WebUtility]::HtmlDecode($clean)
  $sourceDir = Split-Path -Parent $SourceFile
  if ([System.IO.Path]::IsPathRooted($clean)) {
    $full = $clean
  } else {
    $full = Join-Path $sourceDir $clean
  }
  $resolved = Resolve-Path -LiteralPath $full -ErrorAction SilentlyContinue
  if ($resolved) {
    $path = $resolved.Path
    if ((Get-Item -LiteralPath $path).PSIsContainer) { return }
    $rel = [System.IO.Path]::GetRelativePath($Root, $path)
    $refs.Add([pscustomobject]@{
      Source = [System.IO.Path]::GetRelativePath($Root, $SourceFile)
      Reference = $Reference
      AssetRelativePath = $rel
      Context = $Context
    })
  }
}

foreach ($file in $HtmlFiles) {
  $raw = Get-Content -LiteralPath $file.FullName -Raw
  foreach ($m in [regex]::Matches($raw, '(?i)(?:src|href|poster)=["'']([^"'']+)["'']')) {
    Add-AssetRef -SourceFile $file.FullName -Reference $m.Groups[1].Value -Context "html"
  }
  foreach ($m in [regex]::Matches($raw, '(?i)url\(["'']?([^)"'']+)["'']?\)')) {
    Add-AssetRef -SourceFile $file.FullName -Reference $m.Groups[1].Value -Context "inline-css"
  }
}

foreach ($file in $CssFiles) {
  $raw = Get-Content -LiteralPath $file.FullName -Raw
  foreach ($m in [regex]::Matches($raw, '(?i)url\(["'']?([^)"'']+)["'']?\)')) {
    Add-AssetRef -SourceFile $file.FullName -Reference $m.Groups[1].Value -Context "css"
  }
}

$unique = $refs | Sort-Object AssetRelativePath, Source, Context -Unique
$assetGroups = $unique | Group-Object AssetRelativePath

foreach ($group in $assetGroups) {
  $assetPath = Join-Path $Root $group.Name
  $destPath = Join-Path $PackageRoot $group.Name
  $destDir = Split-Path -Parent $destPath
  New-Item -ItemType Directory -Force -Path $destDir | Out-Null
  Copy-Item -LiteralPath $assetPath -Destination $destPath -Force
}

$manifest = foreach ($group in $assetGroups) {
  $assetPath = Join-Path $Root $group.Name
  $item = Get-Item -LiteralPath $assetPath
  [pscustomobject]@{
    AssetRelativePath = $group.Name
    PackageRelativePath = [System.IO.Path]::GetRelativePath($PackageRoot, (Join-Path $PackageRoot $group.Name))
    Extension = $item.Extension
    SizeBytes = $item.Length
    ReferencedBy = (($group.Group | Select-Object -ExpandProperty Source -Unique) -join "; ")
    Contexts = (($group.Group | Select-Object -ExpandProperty Context -Unique) -join "; ")
  }
}

$manifest | Export-Csv -LiteralPath $ManifestPath -NoTypeInformation -Encoding UTF8

$byExt = $manifest | Group-Object Extension | Sort-Object Name | ForEach-Object {
  "- `$($_.Name)`: $($_.Count)"
}

$readme = @"
# Prototype Assets Package

This folder contains the local assets referenced by the Arabian Drilling Careers prototype and prepared for CSB migration.

## Package Path

`$PackageRoot`

## Contents

- Assets are copied using their prototype-relative folder structure.
- `asset-manifest.csv` lists each asset, source page reference, file extension, and size.
- External URLs are not copied.
- HTML pages are not copied as assets.

## Summary

- Total assets: $($manifest.Count)
$($byExt -join "`n")

## Migration Notes

- Upload final approved images/icons/fonts into the CSB image/font library.
- Keep this folder as the migration staging package, not as the production hosting path.
- If an asset is replaced with a higher-resolution or approved corporate version, update the manifest before CSB upload.
"@

Set-Content -LiteralPath $ReadmePath -Value $readme -Encoding UTF8

Write-Output "Packaged $($manifest.Count) assets into $PackageRoot"
Write-Output $ManifestPath
