/**
 * SizeMe Orders — Google Apps Script
 * ====================================
 * يستقبل بيانات الطلب الكاملة ويحفظها في ورقة "Orders"
 *
 * خطوات النشر:
 * 1. افتح Google Sheets (نفس ملف الـ Ratings أو ملف جديد)
 * 2. Extensions → Apps Script
 * 3. أنشئ ملفاً جديداً باسم "orders" والصق هذا الكود فيه
 * 4. اضغط Save (Ctrl+S)
 * 5. Deploy → New Deployment:
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. انسخ رابط الـ URL وضعه في app.js عند المتغير ORDERS_SHEETS_URL
 *
 * ملاحظة: عند أي تعديل على الكود → Deploy → New Deployment (وليس Manage)
 */

const ORDERS_SHEET_NAME = 'Orders';

/* العناوين الثابتة للأعمدة */
const HEADERS = [
  'Order ID',
  'Timestamp',
  'Name',
  'Phone',
  'Province',
  'Area',
  'Address',
  'Notes',
  'Items',
  'Subtotal',
  'Bulk Discount',
  'Coupon Code',
  'Coupon Discount',
  'Shipping',
  'Total',
  'Payment',
  'Language'
];

function doPost(e) {
  try {
    /* قراءة الـ body — يصل كـ text/plain من الـ frontend */
    var raw  = (e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = JSON.parse(raw);

    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(ORDERS_SHEET_NAME);

    /* إنشاء الورقة تلقائياً مع العناوين إذا لم تكن موجودة */
    if (!sheet) {
      sheet = ss.insertSheet(ORDERS_SHEET_NAME);
      sheet.appendRow(HEADERS);

      /* تنسيق صف العناوين */
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#1a1a1a');
      headerRange.setFontColor('#ffffff');
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 130);   // Order ID
      sheet.setColumnWidth(2, 160);   // Timestamp
      sheet.setColumnWidth(9, 400);   // Items
    }

    /* تحويل مصفوفة المنتجات إلى نص مقروء */
    var items = data.items || [];
    var itemsText = items.map(function(i) {
      return (i.qty || 1) + 'x ' + (i.brand || '') +
             (i.sub   ? ' — ' + i.sub  : '') +
             ' [' + (i.sku   || '—') + ']' +
             ' / ' + (i.color || '—') +
             ' / ' + (i.size  || '—') +
             ' = ' + (i.lineTotal || '');
    }).join('\n');

    /* كتابة الصف */
    sheet.appendRow([
      data.orderId        || '',
      data.timestamp      || new Date().toLocaleString('ar-IQ', { timeZone: 'Asia/Baghdad' }),
      data.name           || '',
      data.phone          || '',
      data.province       || '',
      data.area           || '',
      data.address        || '',
      data.notes          || '',
      itemsText,
      data.subtotal       || 0,
      data.bulkDiscount   || 0,
      data.couponCode     || '',
      data.couponDiscount || 0,
      data.shipping       || 0,
      data.total          || 0,
      data.payment        || '',
      data.lang           || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* دعم GET للاختبار السريع من المتصفح */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'SizeMe Orders Script is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
