$html = Get-Content -Path "e:\sizeme\index.html" -Raw -Encoding UTF8

$startStr = "<script>`n    /* =================== I18N =================== */"
$endStr = "</script>`n`n  <!-- ================= DRAGGABLE WHATSAPP BUTTON ================= -->"

$mainScriptStart = $html.IndexOf($startStr)
$mainScriptEnd = $html.IndexOf($endStr, $mainScriptStart)

if ($mainScriptStart -eq -1 -or $mainScriptEnd -eq -1) {
    Write-Host "Could not find script bounds!"
    exit 1
}

$scriptContent = $html.Substring($mainScriptStart + 9, $mainScriptEnd - ($mainScriptStart + 9))

$dataEndMarker = "    ];`n    // ─────────────────────────────────────────────────────────────────────`n"
$dataEndIndex = $scriptContent.IndexOf($dataEndMarker)
if ($dataEndIndex -ne -1) {
    $dataEndIndex += $dataEndMarker.Length
} else {
    Write-Host "Could not find data end marker!"
    exit 1
}

$dataPart = $scriptContent.Substring(0, $dataEndIndex)
$appPart = $scriptContent.Substring($dataEndIndex)

# Add export keywords
$dataPart = $dataPart -replace 'const I18N =', 'export const I18N ='
$dataPart = $dataPart -replace 'const C =', 'export const C ='
$dataPart = $dataPart -replace 'const TOTAL_PRODUCTS =', 'export const TOTAL_PRODUCTS ='
$dataPart = $dataPart -replace 'const PRODUCTS_META =', 'export const PRODUCTS_META ='
$dataPart = $dataPart -replace 'const PRODUCTS =', 'export const PRODUCTS ='
$dataPart = $dataPart -replace 'const COUPONS =', 'export const COUPONS ='

$appImports = "import { I18N, C, TOTAL_PRODUCTS, PRODUCTS_META, PRODUCTS, COUPONS } from './data.js';`n`n"

$waStartStr = "  <!-- ================= DRAGGABLE WHATSAPP BUTTON ================= -->`n  <script>`n"
$waEndStr = "  </script>`n`n</body>"
$waStart = $html.IndexOf($waStartStr)
$waEnd = $html.IndexOf($waEndStr, $waStart)

if ($waStart -eq -1 -or $waEnd -eq -1) {
    Write-Host "Could not find WA script bounds!"
    exit 1
}

$waScript = $html.Substring($waStart + $waStartStr.Length, $waEnd - ($waStart + $waStartStr.Length))

$globals = @"

/* =================== EXPOSE GLOBALS FOR INLINE HTML HANDLERS =================== */
window.closeMobileNav = closeMobileNav;
window.openSizeCalc = openSizeCalc;
window.closeSizeCalc = closeSizeCalc;
window.calcSize = calcSize;
window.closeCart = closeCart;
window.openCart = openCart;
window.openProductModal = openProductModal;
window.closeProductModal = closeProductModal;
window.calcSize = calcSize;
"@

New-Item -ItemType Directory -Force -Path "e:\sizeme\js" | Out-Null
Set-Content -Path "e:\sizeme\js\data.js" -Value $dataPart -Encoding UTF8
Set-Content -Path "e:\sizeme\js\app.js" -Value ($appImports + $appPart + "`n" + $waScript + "`n" + $globals) -Encoding UTF8

$newHtml = $html.Substring(0, $mainScriptStart) + @"
  <!-- ================= SCRIPTS ================= -->
  <script type="module" src="js/app.js"></script>

</body>
</html>
"@

Set-Content -Path "e:\sizeme\index.html" -Value $newHtml -Encoding UTF8
Write-Host "Refactoring complete!"
