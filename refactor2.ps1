$html = Get-Content -Path "e:\sizeme\index.html" -Encoding UTF8

$appLines1 = $html[4315..5962]
$appLines2 = $html[6009..6084]

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
window.changeQty = changeQty;
"@

$appContent = "import { I18N, C, TOTAL_PRODUCTS, PRODUCTS_META, PRODUCTS, COUPONS } from './data.js';`n`n" + ($appLines1 -join "`n") + "`n`n" + ($appLines2 -join "`n") + "`n`n" + $globals

Set-Content -Path "e:\sizeme\js\app.js" -Value $appContent -Encoding UTF8

$newHtml1 = $html[0..3978]
$newHtml2 = @('  <!-- ================= SCRIPTS ================= -->', '  <script type="module" src="js/app.js"></script>')
$newHtml3 = $html[5964..6006]
$newHtml4 = $html[6086..($html.Length-1)]

$finalHtml = $newHtml1 + $newHtml2 + $newHtml3 + $newHtml4
Set-Content -Path "e:\sizeme\index.html" -Value ($finalHtml -join "`n") -Encoding UTF8

Write-Host "Done!"
