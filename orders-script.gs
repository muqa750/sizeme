/**
 * SizeMe Orders — Google Apps Script
 * ====================================
 * يستقبل بيانات الطلب، يحفظها في ورقة "الطلبات"،
 * ويرسل إشعار بريد إلكتروني فوري عند كل طلب جديد.
 *
 * خطوات النشر:
 * 1. الصق هذا الكود كاملاً في Apps Script
 * 2. شغّل دالة testEmail() مرة واحدة يدوياً لمنح إذن الإيميل
 * 3. Save → Deploy → New Deployment
 *    - Type: Web app | Execute as: Me | Who has access: Anyone
 * 4. انسخ الرابط الجديد وضعه في index.html عند ORDERS_SHEETS_URL
 *
 * الأذونات المطلوبة (تُطلب تلقائياً عند أول تشغيل):
 *   - Google Sheets (قراءة وكتابة)
 *   - Gmail / MailApp (إرسال بريد)
 */

/* ══ الإعدادات ══ */
var ORDERS_SHEET_NAME = 'الطلبات';
var NOTIFY_EMAILS     = ['mustafaqais750@gmail.com', 'waleed789054@gmail.com'];

/* ══ عناوين الأعمدة ══ */
var HEADERS = [
  'رقم الطلب',
  'التاريخ والوقت',
  'الاسم',
  'الهاتف',
  'المحافظة',
  'المدينة',
  'العنوان',
  'ملاحظات',
  'المنتجات',
  'المجموع الفرعي',
  'خصم الكمية',
  'كود الكوبون',
  'خصم الكوبون',
  'الشحن',
  'الإجمالي',
  'طريقة الدفع',
  'اللغة'
];

/* ══════════════════════════════════════════════════════
   doPost — استقبال الطلب وحفظه
══════════════════════════════════════════════════════ */
function doPost(e) {
  try {
    var raw  = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = JSON.parse(raw);
    var items = data.items || [];

    /* ── فتح أو إنشاء ورقة الطلبات ── */
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(ORDERS_SHEET_NAME);

    if (!sheet) {
      sheet = ss.insertSheet(ORDERS_SHEET_NAME);
      setupSheetHeaders(sheet);
    }

    /* ── تنسيق حقل المنتجات (نص متعدد الأسطر) ── */
    var itemsText = formatItemsText(items);

    /* ── إضافة الصف ── */
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

    /* ── تفعيل التفاف النص في خلية المنتجات ── */
    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 9).setWrap(true).setVerticalAlignment('top');

    /* ── تنسيق الأرقام في أعمدة المبالغ ── */
    var numFmt = '#,##0';
    sheet.getRange(lastRow, 10, 1, 6).setNumberFormat(numFmt);

    /* ── تلوين الصف تبادلياً ── */
    if (lastRow % 2 === 0) {
      sheet.getRange(lastRow, 1, 1, HEADERS.length).setBackground('#f7f7f7');
    }

    /* ── إرسال إشعار الإيميل ── */
    sendOrderNotification(data, items);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', orderId: data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('doPost error: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/* ══════════════════════════════════════════════════════
   setupSheetHeaders — تهيئة الشيت عند الإنشاء الأول
══════════════════════════════════════════════════════ */
function setupSheetHeaders(sheet) {
  sheet.appendRow(HEADERS);
  var hRange = sheet.getRange(1, 1, 1, HEADERS.length);
  hRange.setFontWeight('bold')
        .setBackground('#1a1a1a')
        .setFontColor('#ffffff')
        .setHorizontalAlignment('center')
        .setVerticalAlignment('middle');
  sheet.setFrozenRows(1);
  sheet.setRowHeight(1, 36);

  /* عرض الأعمدة */
  sheet.setColumnWidth(1,  150);  // رقم الطلب
  sheet.setColumnWidth(2,  180);  // التاريخ
  sheet.setColumnWidth(3,  130);  // الاسم
  sheet.setColumnWidth(4,  130);  // الهاتف
  sheet.setColumnWidth(5,  110);  // المحافظة
  sheet.setColumnWidth(6,  110);  // المدينة
  sheet.setColumnWidth(7,  180);  // العنوان
  sheet.setColumnWidth(8,  180);  // ملاحظات
  sheet.setColumnWidth(9,  320);  // المنتجات
  sheet.setColumnWidth(10, 120);  // المجموع الفرعي
  sheet.setColumnWidth(11, 100);  // خصم الكمية
  sheet.setColumnWidth(12, 110);  // كود الكوبون
  sheet.setColumnWidth(13, 110);  // خصم الكوبون
  sheet.setColumnWidth(14,  90);  // الشحن
  sheet.setColumnWidth(15, 110);  // الإجمالي
  sheet.setColumnWidth(16, 130);  // طريقة الدفع
  sheet.setColumnWidth(17,  70);  // اللغة
}

/* ══════════════════════════════════════════════════════
   formatItemsText — تنسيق المنتجات كنص متعدد الأسطر
══════════════════════════════════════════════════════ */
function formatItemsText(items) {
  if (!items || items.length === 0) return '—';

  return items.map(function(item, idx) {
    var lines = [
      '[ ' + (idx + 1) + ' ] ' + (item.brand || '') + (item.sub ? ' — ' + item.sub : ''),
      '  الكود  : ' + (item.sku      || '—'),
      '  اللون  : ' + (item.color    || '—'),
      '  القياس : ' + (item.size     || '—'),
      '  الكمية : ' + (item.qty      || 1) + ' قطعة',
      '  السعر  : ' + (item.lineTotal || '—') + ' IQD'
    ];
    return lines.join('\n');
  }).join('\n' + '━'.repeat(28) + '\n');
}

/* ══════════════════════════════════════════════════════
   sendOrderNotification — إرسال إيميل الإشعار
══════════════════════════════════════════════════════ */
function sendOrderNotification(data, items) {
  try {
    /* ── الموضوع: يتضمن اسم الزبون ── */
    var subject = 'طلب جديد من ' + (data.name || 'زبون') + ' — SizeMe #' + (data.orderId || '');

    /* ── جدول المنتجات HTML ── */
    var itemsHtml = (items || []).map(function(item, idx) {
      return (
        '<tr style="border-bottom:1px solid #eee;">' +
          '<td style="padding:8px 12px;font-weight:bold;text-align:center;">' + (idx + 1) + '</td>' +
          '<td style="padding:8px 12px;">' + (item.brand || '') + (item.sub ? '<br><span style="color:#999;font-size:12px;">' + item.sub + '</span>' : '') + '</td>' +
          '<td style="padding:8px 12px;color:#555;">' + (item.sku   || '—') + '</td>' +
          '<td style="padding:8px 12px;">' + (item.color || '—') + '</td>' +
          '<td style="padding:8px 12px;font-weight:bold;">' + (item.size  || '—') + '</td>' +
          '<td style="padding:8px 12px;text-align:center;">' + (item.qty || 1) + '</td>' +
          '<td style="padding:8px 12px;text-align:left;font-weight:bold;">' + (item.lineTotal || '—') + ' IQD</td>' +
        '</tr>'
      );
    }).join('');

    var htmlBody =
      '<div dir="rtl" style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">' +

      /* Header */
      '<div style="background:#1a1a1a;padding:22px 30px;">' +
        '<h2 style="color:#fff;margin:0;font-size:20px;letter-spacing:1px;">SizeMe — طلب جديد</h2>' +
        '<p style="color:#aaa;margin:8px 0 0;font-size:13px;">رقم الطلب: <strong style="color:#fff;letter-spacing:2px;">' + (data.orderId || '—') + '</strong></p>' +
      '</div>' +

      /* Customer Info */
      '<div style="padding:20px 30px;background:#fafafa;border-bottom:1px solid #eee;">' +
        '<h3 style="margin:0 0 12px;font-size:14px;color:#555;text-transform:uppercase;letter-spacing:1px;">معلومات الزبون</h3>' +
        '<table style="width:100%;border-collapse:collapse;font-size:14px;">' +
          '<tr><td style="padding:6px 0;color:#888;width:110px;">الاسم</td><td style="font-weight:bold;color:#1a1a1a;">' + (data.name || '—') + '</td></tr>' +
          '<tr><td style="padding:6px 0;color:#888;">الهاتف</td><td>' + (data.phone || '—') + '</td></tr>' +
          '<tr><td style="padding:6px 0;color:#888;">المحافظة</td><td>' + (data.province || '—') + '</td></tr>' +
          '<tr><td style="padding:6px 0;color:#888;">المدينة</td><td>' + (data.area || '—') + '</td></tr>' +
          '<tr><td style="padding:6px 0;color:#888;">العنوان</td><td>' + (data.address || '—') + '</td></tr>' +
          (data.notes ? '<tr><td style="padding:6px 0;color:#888;">ملاحظات</td><td style="color:#c0392b;">' + data.notes + '</td></tr>' : '') +
        '</table>' +
      '</div>' +

      /* Items */
      '<div style="padding:20px 30px;border-bottom:1px solid #eee;">' +
        '<h3 style="margin:0 0 12px;font-size:14px;color:#555;text-transform:uppercase;letter-spacing:1px;">المنتجات</h3>' +
        '<table style="width:100%;border-collapse:collapse;font-size:13px;">' +
          '<thead><tr style="background:#1a1a1a;color:#fff;">' +
            '<th style="padding:8px 12px;font-weight:normal;">#</th>' +
            '<th style="padding:8px 12px;font-weight:normal;">الماركة</th>' +
            '<th style="padding:8px 12px;font-weight:normal;">الكود</th>' +
            '<th style="padding:8px 12px;font-weight:normal;">اللون</th>' +
            '<th style="padding:8px 12px;font-weight:normal;">القياس</th>' +
            '<th style="padding:8px 12px;font-weight:normal;">الكمية</th>' +
            '<th style="padding:8px 12px;font-weight:normal;">السعر</th>' +
          '</tr></thead>' +
          '<tbody>' + itemsHtml + '</tbody>' +
        '</table>' +
      '</div>' +

      /* Totals */
      '<div style="padding:16px 30px;background:#fafafa;">' +
        '<table style="width:100%;font-size:14px;max-width:280px;margin-right:auto;">' +
          '<tr><td style="padding:4px 0;color:#888;">المجموع الفرعي</td><td style="text-align:left;">' + (data.subtotal || 0) + ' IQD</td></tr>' +
          (data.bulkDiscount   > 0 ? '<tr><td style="padding:4px 0;color:#27ae60;">خصم الكمية</td><td style="text-align:left;color:#27ae60;">- ' + data.bulkDiscount + ' IQD</td></tr>' : '') +
          (data.couponDiscount > 0 ? '<tr><td style="padding:4px 0;color:#27ae60;">كوبون (' + (data.couponCode || '') + ')</td><td style="text-align:left;color:#27ae60;">- ' + data.couponDiscount + ' IQD</td></tr>' : '') +
          '<tr><td style="padding:4px 0;color:#888;">الشحن</td><td style="text-align:left;">' + (data.shipping === 0 ? '<span style="color:#27ae60;">مجاني</span>' : data.shipping + ' IQD') + '</td></tr>' +
          '<tr style="border-top:2px solid #1a1a1a;font-weight:bold;font-size:16px;">' +
            '<td style="padding:10px 0;">الإجمالي</td>' +
            '<td style="text-align:left;color:#1a1a1a;">' + (data.total || 0) + ' IQD</td>' +
          '</tr>' +
        '</table>' +
      '</div>' +

      '<p style="text-align:center;color:#ccc;font-size:11px;padding:12px;margin:0;">SizeMe Order Management System</p>' +
      '</div>';

    var plainBody =
      'طلب جديد من: ' + (data.name || '—') + '\n' +
      'رقم الطلب: ' + (data.orderId || '—') + '\n' +
      'الهاتف: ' + (data.phone || '—') + '\n' +
      'المحافظة: ' + (data.province || '') + ' — ' + (data.area || '') + '\n' +
      'الإجمالي: ' + (data.total || 0) + ' IQD\n' +
      'عدد المنتجات: ' + (items.length) + ' صنف\n\n' +
      formatItemsText(items);

    MailApp.sendEmail({
      to:       NOTIFY_EMAILS.join(','),
      subject:  subject,
      body:     plainBody,
      htmlBody: htmlBody
    });

    Logger.log('Email sent successfully to: ' + NOTIFY_EMAILS.join(', '));

  } catch (mailErr) {
    Logger.log('Email error: ' + mailErr.toString());
    /* نحفظ الخطأ في الشيت نفسه لسهولة التشخيص */
    try {
      var ss    = SpreadsheetApp.getActiveSpreadsheet();
      var log   = ss.getSheetByName('Email Errors') || ss.insertSheet('Email Errors');
      log.appendRow([new Date(), mailErr.toString()]);
    } catch(_) {}
  }
}

/* ══════════════════════════════════════════════════════
   testEmail — شغّل هذه الدالة يدوياً مرة واحدة
   لمنح إذن الإيميل ولاختبار أن كل شيء يعمل
══════════════════════════════════════════════════════ */
function testEmail() {
  var fakeData = {
    orderId:  'SZ-TEST-001',
    name:     'اختبار',
    phone:    '07700000000',
    province: 'بغداد',
    area:     'الكرادة',
    address:  'شارع الاختبار',
    notes:    '',
    subtotal: 150000,
    bulkDiscount: 0,
    couponCode: '',
    couponDiscount: 0,
    shipping: 0,
    total:    150000,
    payment:  'Cash on Delivery',
    lang:     'ar'
  };
  var fakeItems = [{
    brand: 'SizeMe Test',
    sub:   'تي شيرت',
    sku:   'TST-001',
    color: 'أسود',
    size:  '3XL',
    qty:   2,
    lineTotal: '150,000'
  }];

  sendOrderNotification(fakeData, fakeItems);
  Logger.log('Test email sent. Check your inbox and the Logs tab.');
}

/* ══════════════════════════════════════════════════════
   doGet — اختبار بسيط من المتصفح
══════════════════════════════════════════════════════ */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'SizeMe Orders Script is running ✓' }))
    .setMimeType(ContentService.MimeType.JSON);
}
