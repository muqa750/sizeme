export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #e5e5e5',
      background: '#fff',
      marginTop: 'auto',
      padding: '2.5rem 1.5rem',
      direction: 'rtl',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}>

          {/* Brand */}
          <div>
            <p style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: '1.25rem',
              letterSpacing: '0.15em',
              marginBottom: '0.75rem',
            }}>
              SIZEME
            </p>
            <p style={{ fontSize: '0.78rem', color: '#888', lineHeight: 1.7 }}>
              وجهتك الأولى لملابس الرجال
              <br />ذات المقاسات الخاصة في العراق.
              <br />من 2XL إلى 7XL.
            </p>
          </div>

          {/* Info */}
          <div>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#aaa', marginBottom: '0.875rem' }}>
              معلومات
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { label: 'سياسة الاستبدال والإرجاع' },
                { label: 'حاسبة المقاس' },
                { label: 'تواصل معنا' },
              ].map(l => (
                <span key={l.label} style={{ fontSize: '0.8rem', color: '#888', cursor: 'default' }}>
                  {l.label}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', color: '#aaa', marginBottom: '0.875rem' }}>
              تواصل
            </p>
            <a
              href="https://wa.me/9647739334545"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: '0.8rem', color: '#888', textDecoration: 'none', display: 'block', marginBottom: 8 }}
            >
              📲 واتساب
            </a>
            <p style={{ fontSize: '0.78rem', color: '#aaa', lineHeight: 1.6 }}>
              الدفع عند الاستلام
              <br />التوصيل لجميع محافظات العراق
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div style={{
          borderTop: '1px solid #f0f0f0',
          paddingTop: '1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}>
          <p style={{ fontSize: '0.7rem', color: '#ccc' }}>
            © {new Date().getFullYear()} SizeMe. جميع الحقوق محفوظة.
          </p>
          <p style={{ fontSize: '0.7rem', color: '#ccc', letterSpacing: '0.05em' }}>
            العراق · بغداد
          </p>
        </div>
      </div>
    </footer>
  )
}
