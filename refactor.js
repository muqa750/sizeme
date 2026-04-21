const fs = require('fs');
let html = fs.readFileSync('e:/sizeme/index.html', 'utf8');

const startStr = `<script>\n    /* =================== I18N =================== */`;
const endStr = `</script>\n\n  <!-- ================= DRAGGABLE WHATSAPP BUTTON ================= -->`;

let mainScriptStart = html.indexOf(startStr);
let mainScriptEnd = html.indexOf(endStr, mainScriptStart);

if (mainScriptStart === -1 || mainScriptEnd === -1) {
    console.error("Could not find script bounds!");
    process.exit(1);
}

let scriptContent = html.substring(mainScriptStart + `<script>\n`.length, mainScriptEnd);

const dataEndMarker = `    ];\n    // ─────────────────────────────────────────────────────────────────────\n`;
let dataEndIndex = scriptContent.indexOf(dataEndMarker);
if(dataEndIndex !== -1) {
    dataEndIndex += dataEndMarker.length;
} else {
    console.error("Could not find data end marker!");
    process.exit(1);
}

let dataPart = scriptContent.substring(0, dataEndIndex);
let appPart = scriptContent.substring(dataEndIndex);

// Add export keywords
dataPart = dataPart.replace('const I18N =', 'export const I18N =');
dataPart = dataPart.replace('const C =', 'export const C =');
dataPart = dataPart.replace('const TOTAL_PRODUCTS =', 'export const TOTAL_PRODUCTS =');
dataPart = dataPart.replace('const PRODUCTS_META =', 'export const PRODUCTS_META =');
dataPart = dataPart.replace('const PRODUCTS =', 'export const PRODUCTS =');
dataPart = dataPart.replace('const COUPONS =', 'export const COUPONS =');

let appImports = `import { I18N, C, TOTAL_PRODUCTS, PRODUCTS_META, PRODUCTS, COUPONS } from './data.js';\n\n`;

const waStartStr = `  <!-- ================= DRAGGABLE WHATSAPP BUTTON ================= -->\n  <script>\n`;
const waEndStr = `  </script>\n\n</body>`;
let waStart = html.indexOf(waStartStr);
let waEnd = html.indexOf(waEndStr, waStart);

if (waStart === -1 || waEnd === -1) {
    console.error("Could not find WA script bounds!");
    process.exit(1);
}

let waScript = html.substring(waStart + waStartStr.length, waEnd);

const globals = `
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
`;

fs.mkdirSync('e:/sizeme/js', { recursive: true });
fs.writeFileSync('e:/sizeme/js/data.js', dataPart);
fs.writeFileSync('e:/sizeme/js/app.js', appImports + appPart + '\n' + waScript + '\n' + globals);

let newHtml = html.substring(0, mainScriptStart) + 
`  <!-- ================= SCRIPTS ================= -->
  <script type="module" src="js/app.js"></script>

</body>
</html>`;

fs.writeFileSync('e:/sizeme/index.html', newHtml);
console.log("Refactoring complete!");
