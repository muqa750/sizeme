const fs = require('fs');
['index.html', 'js/app.js', 'js/data.js'].forEach(f => {
  try {
    const buf = fs.readFileSync(f);
    if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xFE) {
      const text = buf.toString('utf16le');
      fs.writeFileSync(f, text, 'utf8');
      console.log(`Converted ${f} from UTF-16LE to UTF-8`);
    } else {
      console.log(`${f} is already UTF-8 or not UTF-16LE`);
    }
  } catch (e) {
    console.error(`Error processing ${f}:`, e.message);
  }
});
