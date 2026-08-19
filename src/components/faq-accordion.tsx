export type Faq = { question: string; answer: string };

export default function FaqAccordion({ faqs, withJsonLd = true }: { faqs: Faq[]; withJsonLd?: boolean }) {
  if (faqs.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <div className="space-y-3">
      {withJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {faqs.map((faq) => (
        <details
          key={faq.question}
          className="group rounded-2xl border border-black/10 bg-white px-6 py-4 open:border-primary/40"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
            {faq.question}
            <span className="shrink-0 text-primary transition group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-muted">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
