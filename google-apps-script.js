/**
 * SizeMe Rating — Google Apps Script (GET Version)
 * ==================================================
 * يستقبل تقييمات 1-5 لكل فئة من الأداة الجديدة
 *
 * الأعمدة في Google Sheets:
 * Timestamp | Source | Category | Score
 *
 * خطوات النشر:
 * 1. افتح Google Sheets → Extensions → Apps Script
 * 2. احذف الكود القديم، الصق هذا الكود، احفظ (Ctrl+S)
 * 3. Deploy → New Deployment:
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. انسخ الرابط الجديد وضعه في index.html (SHEETS_URL)
 * 5. عند تعديل الكود → Deploy → Manage Deployments → Edit → New version
 */

function doGet(e) {
  try {
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Ratings');

    /* إنشاء الورقة تلقائياً إذا لم تكن موجودة */
    if (!sheet) {
      sheet = ss.insertSheet('Ratings');
      sheet.appendRow(['Timestamp', 'Source', 'Category', 'Score']);
      /* تنسيق رأس الجدول */
      sheet.getRange(1, 1, 1, 4)
           .setFontWeight('bold')
           .setBackground('#1a1a1a')
           .setFontColor('#ffffff');
    }

    var params    = e.parameter || {};
    var timestamp = params.timestamp || new Date().toISOString();
    var source    = params.source    || 'sizeme-website';
    var category  = params.category  || params.rating || 'general';  // دعم النظام القديم
    var score     = params.score     || '';

    /* إضافة صف جديد */
    sheet.appendRow([timestamp, source, category, score]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', category: category, score: score }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* دعم POST أيضاً للتوافق */
function doPost(e) {
  return doGet(e);
}

/* اختبار يدوي — شغّله من محرر Apps Script للتحقق */
function testInsert() {
  var mock = { parameter: {
    timestamp: new Date().toISOString(),
    source: 'test',
    category: 'fabric',
    score: '5'
  }};
  var result = doGet(mock);
  Logger.log(result.getContent());
}
