export default function GuaranteeSection() {
  return (
    <section style={{ background: 'var(--section-contrast)', color: '#fff' }}>
      <div
        className="max-w-4xl mx-auto px-5 text-center"
        style={{ padding: '4rem 1.25rem' }}
      >
        <p className="kicker" style={{ color: 'rgba(255,255,255,0.5)', letterSpacing: '0.35em' }}>
          وعدنا
        </p>
        <h3
          className="serif mt-3"
          style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)' }}
        >
          ضمان الاستبدال في حال عدم مناسبة المقاس
        </h3>
        <p
          className="mt-4 mx-auto"
          style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '32rem', lineHeight: 1.75 }}
        >
          اطلب باطمئنان — فريقنا يتواصل شخصياً لتأكيد الطلب قبل الشحن
        </p>
      </div>
    </section>
  )
}
