type WordCloudProps = { initiatives: Array<{ title: string }>; };

const STOPWORDS = [
  'y', 'de', 'la', 'el', 'en', 'para', 'con', 'los', 'las', 'una', 'un', 'por', 'del', 'al', 'se', 'que', 'es', 'sus', 'su', 'o', 'a', 'más', 'muy', 'este', 'esta'
];

export default function WordCloud({ initiatives }: WordCloudProps) {
  const terms: Record<string, number> = {};
  initiatives.forEach(item => {
    item.title?.split(/\s+/).forEach((word: string) => {
      const normalized = word.toLowerCase().replace(/[^a-záéíóúüñ]/gi, '');
      if (!normalized || STOPWORDS.includes(normalized) || normalized.length < 3) return;
      terms[normalized] = (terms[normalized] ?? 0) + 1;
    });
  });

  const sorted = Object.entries(terms).sort((a, b) => b[1] - a[1]).slice(0, 30);

  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: 20, minHeight: 320, boxShadow: '0 16px 40px rgba(15, 23, 42, 0.06)' }}>
      <h3>Nube de palabras</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
        {sorted.length === 0 ? (
          <span>No hay términos suficientes para generar la nube.</span>
        ) : (
          sorted.map(([word, count]) => {
            const size = 14 + Math.min(count * 5, 40);
            return (
              <span key={word} style={{ fontSize: `${size}px`, color: '#1f2937', opacity: 0.85 }}>{word}</span>
            );
          })
        )}
      </div>
    </div>
  );
}
