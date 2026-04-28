// =================== SizeMe Newsletter — Google Apps Script ===================
// 1. انسخ هذا الكود كاملاً في Apps Script
// 2. Deploy → New Deployment → Web App
//    - Execute as: Me
//    - Who has access: Anyone
// 3. انسخ رابط الـ URL وضعه في index.html
// =============================================================================

const SHEET_NAME = 'Newsletter'; // اسم الـ Sheet (غيّره إن أردت)

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const email = (data.email || '').trim().toLowerCase();

    // تحقق بسيط من البريد الإلكتروني
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse({ success: false, error: 'Invalid email' });
    }

    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    let sheet   = ss.getSheetByName(SHEET_NAME);

    // أنشئ الـ Sheet تلقائياً إن لم يكن موجوداً
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['Email', 'Date', 'Source']);
    }

    // تحقق من عدم التكرار
    const emails = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().flat();
    if (emails.includes(email)) {
      return jsonResponse({ success: true, duplicate: true });
    }

    // أضف السطر الجديد
    sheet.appendRow([
      email,
      new Date().toLocaleString('ar-IQ', { timeZone: 'Asia/Baghdad' }),
      'Website Footer'
    ]);

    return jsonResponse({ success: true });

  } catch (err) {
    return jsonResponse({ success: false, error: err.message });
  }
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
