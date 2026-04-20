/**
 * SizeMe Rating — Google Apps Script (GET Version)
 * ==================================================
 * طريقة الإرسال: GET request عبر Image Trick
 * يتجاوز CORS بالكامل — لا يحتاج أي إعداد إضافي
 *
 * خطوات النشر:
 * 1. افتح Google Sheets الخاص بك
 * 2. Extensions → Apps Script
 * 3. احذف الكود القديم والصق هذا الكود
 * 4. اضغط Save (Ctrl+S)
 * 5. Deploy → New Deployment:
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. انسخ الرابط الجديد وضعه في index.html (SHEETS_URL)
 *    ملاحظة: إذا غيّرت الكود يجب Deploy → New Deployment مرة أخرى
 */

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Ratings');

    /* إنشاء الورقة تلقائياً إذا لم تكن موجودة */
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      sheet.setName('Ratings');
      /* صف العناوين */
      sheet.appendRow(['Timestamp', 'Rating', 'Score', 'Source']);
    }

    /* استخراج البيانات من معاملات الـ URL */
    var params    = e.parameter || {};
    var rating    = params.rating    || 'unknown';
    var score     = params.score     || '';
    var timestamp = params.timestamp || new Date().toISOString();
    var source    = params.source    || 'sizeme-website';

    /* كتابة الصف الجديد */
    sheet.appendRow([timestamp, rating, score, source]);

    /* رد JSON */
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', rating: rating }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* دعم POST أيضاً */
function doPost(e) {
  return doGet(e);
}
