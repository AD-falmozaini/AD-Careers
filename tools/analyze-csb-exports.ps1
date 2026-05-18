$ErrorActionPreference = "Stop"

$Root = (Get-Location).Path
$Files = @(
  "C:\Users\Admin\Downloads\SiteBuilderExport2026-05-15-05_32_49.xml",
  "C:\Users\Admin\Downloads\SiteExport_27201_2026-05-15-05_32_32.xml",
  "C:\Users\Admin\Downloads\CategoryExport (3).xml"
)
$OutDir = Join-Path $Root "docs\csb-exports"
$SummaryPath = Join-Path $OutDir "csb-export-analysis.md"
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null

function Escape-Md {
  param([string]$Text)
  if ($null -eq $Text) { return "" }
  return ($Text -replace "\|", "\|" -replace "`r?`n", " ").Trim()
}

function Get-TagCounts {
  param([xml]$Xml)
  $nodes = $Xml.SelectNodes("//*")
  $nodes | Group-Object Name | Sort-Object Count -Descending
}

function Get-SampleNodes {
  param([xml]$Xml, [string[]]$Names)
  $results = @{}
  foreach ($name in $Names) {
    $nodes = @($Xml.SelectNodes("//*[local-name()='$name']")) | Select-Object -First 12
    if ($nodes.Count -gt 0) {
      $results[$name] = $nodes | ForEach-Object {
        $attrs = @{}
        if ($_.Attributes) {
          foreach ($attr in $_.Attributes) {
            $attrs[$attr.Name] = $attr.Value
          }
        }
        $children = @{}
        foreach ($child in $_.ChildNodes) {
          if ($child.NodeType -eq "Element" -and $children.Count -lt 8) {
            $children[$child.Name] = (($child.InnerText -replace "\s+", " ").Trim())
            if ($children[$child.Name].Length -gt 120) {
              $children[$child.Name] = $children[$child.Name].Substring(0, 120)
            }
          }
        }
        [pscustomobject]@{
          Name = $_.Name
          Attributes = ($attrs | ConvertTo-Json -Compress)
          Children = ($children | ConvertTo-Json -Compress)
        }
      }
    }
  }
  return $results
}

function Get-TextMatches {
  param([string]$Raw)
  $patterns = @("Home","Search Jobs","Talent","Category","header","footer","Arabian","Drilling","style","font","color","locale","brand","page","component")
  $lines = $Raw -split "`r?`n"
  $matches = New-Object System.Collections.Generic.List[object]
  for ($i = 0; $i -lt $lines.Length; $i++) {
    foreach ($pattern in $patterns) {
      if ($lines[$i].IndexOf($pattern, [System.StringComparison]::OrdinalIgnoreCase) -ge 0) {
        $text = ($lines[$i] -replace "\s+", " ").Trim()
        if ($text.Length -gt 220) { $text = $text.Substring(0, 220) }
        $matches.Add([pscustomobject]@{ Line = $i + 1; Pattern = $pattern; Text = $text })
        break
      }
    }
    if ($matches.Count -ge 80) { break }
  }
  return $matches
}

$md = New-Object System.Text.StringBuilder
[void]$md.AppendLine("# CSB Export Analysis")
[void]$md.AppendLine("")
[void]$md.AppendLine("Generated from the current CSB exports supplied on 2026-05-15.")
[void]$md.AppendLine("")

$interesting = @("page","Page","component","Component","category","Category","brand","Brand","locale","Locale","style","Style","setting","Setting","navigation","Navigation","menu","Menu","layout","Layout","content","Content","field","Field","item","Item","property","Property")

foreach ($file in $Files) {
  $raw = Get-Content -LiteralPath $file -Raw
  [xml]$xml = $raw
  $item = Get-Item -LiteralPath $file
  [void]$md.AppendLine("## $($item.Name)")
  [void]$md.AppendLine("")
  [void]$md.AppendLine("- Path: ``$file``")
  [void]$md.AppendLine("- Size: $($item.Length) bytes")
  [void]$md.AppendLine("- Root element: ``$($xml.DocumentElement.Name)``")
  [void]$md.AppendLine("")
  [void]$md.AppendLine("### Most Frequent Tags")
  [void]$md.AppendLine("")
  [void]$md.AppendLine("| Tag | Count |")
  [void]$md.AppendLine("|---|---:|")
  foreach ($tag in (Get-TagCounts $xml | Select-Object -First 35)) {
    [void]$md.AppendLine("| ``$(Escape-Md $tag.Name)`` | $($tag.Count) |")
  }
  [void]$md.AppendLine("")

  $samples = Get-SampleNodes -Xml $xml -Names $interesting
  if ($samples.Keys.Count -gt 0) {
    [void]$md.AppendLine("### Sample Structured Objects")
    [void]$md.AppendLine("")
    foreach ($key in ($samples.Keys | Sort-Object)) {
      [void]$md.AppendLine("#### ``$key``")
      [void]$md.AppendLine("")
      [void]$md.AppendLine("| Node | Attributes | Children Preview |")
      [void]$md.AppendLine("|---|---|---|")
      foreach ($sample in $samples[$key]) {
        [void]$md.AppendLine("| $(Escape-Md $sample.Name) | $(Escape-Md $sample.Attributes) | $(Escape-Md $sample.Children) |")
      }
      [void]$md.AppendLine("")
    }
  }

  [void]$md.AppendLine("### Text Matches")
  [void]$md.AppendLine("")
  [void]$md.AppendLine("| Line | Match | Text |")
  [void]$md.AppendLine("|---:|---|---|")
  foreach ($match in (Get-TextMatches $raw)) {
    [void]$md.AppendLine("| $($match.Line) | $(Escape-Md $match.Pattern) | $(Escape-Md $match.Text) |")
  }
  [void]$md.AppendLine("")
}

Set-Content -LiteralPath $SummaryPath -Value $md.ToString() -Encoding UTF8
Write-Output $SummaryPath
