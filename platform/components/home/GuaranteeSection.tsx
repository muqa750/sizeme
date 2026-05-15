export default function GuaranteeSection() {
  return (
    <section style={{ background: 'var(--paper)' }}>
      <div
        className="max-w-4xl mx-auto px-5 text-center"
        style={{ padding: '2rem 1.25rem' }}
      >
        <p
          className="kicker"
          style={{ color: 'var(--mute)', letterSpacing: '0.35em' }}
        >
          وعدنا
        </p>
        <h3
          className="serif mt-3"
          style={{
            fontSize: 'clamp(1.25rem, 3.5vw, 1.875rem)',
            color: 'var(--ink)',
            fontWeight: 400,
          }}
        >
          ضمان الاستبدال في حال عدم مناسبة المقاس
        </h3>
        <p
          className="mt-3 mx-auto"
          style={{
            color: 'var(--mute)',
            maxWidth: '32rem',
            lineHeight: 1.75,
            fontSize: '0.875rem',
          }}
        >
          اطلب باطمئنان — فريقنا يتواصل شخصياً لتأكيد الطلب قبل الشحن
        </p>
      </div>
    </section>
  )
}
