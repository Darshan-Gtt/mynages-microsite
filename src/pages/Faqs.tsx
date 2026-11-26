import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MessageCircleQuestion, Search, X } from 'lucide-react';
import { FAQ_TOPICS, FAQS, type FaqTopic } from '../data/content';
import { Accordion, Empty } from '../components/ui/Misc';

function highlight(text: string, q: string) {
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

export function FaqsPage() {
  const [params, setParams] = useSearchParams();
  const topic = (params.get('topic') as FaqTopic | null) ?? 'all';
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return FAQS.filter((f) => (topic === 'all' || f.topic === topic))
      .filter((f) => !term || f.question.toLowerCase().includes(term) || f.answer.toLowerCase().includes(term))
      .sort((a, b) => a.topic.localeCompare(b.topic) || a.sortOrder - b.sortOrder);
  }, [topic, q]);

  const setTopic = (t: string) => setParams(t === 'all' ? {} : { topic: t }, { replace: true });
  const term = q.trim();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="section-head" style={{ marginBottom: 0 }}>
            <span className="eyebrow">FAQs</span>
            <h1>Frequently asked questions</h1>
            <div className="faq-search">
              <Search size={18} />
              <input
                placeholder="Search questions — e.g. trial, family, export"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                aria-label="Search FAQs"
              />
              {q && (
                <button onClick={() => setQ('')} aria-label="Clear search"><X size={16} /></button>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container faq-layout">
          <aside className="faq-topics">
            <div className="pill-tabs">
              <button className="pill-tab" aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>All ({FAQS.length})</button>
              {FAQ_TOPICS.map((t) => (
                <button key={t.id} className="pill-tab" aria-pressed={topic === t.id} onClick={() => setTopic(t.id)}>
                  {t.label} ({FAQS.filter((f) => f.topic === t.id).length})
                </button>
              ))}
            </div>
          </aside>
          <div>
            <p className="small muted" style={{ marginBottom: 14 }}>
              {list.length} {list.length === 1 ? 'question' : 'questions'}
              {term && <> matching “{term}”</>}
            </p>
            {list.length ? (
              <Accordion
                key={`${topic}-${term}`}
                defaultOpen={term ? list[0].id : undefined}
                items={list.map((f) => ({
                  id: f.id,
                  title: highlight(f.question, term),
                  body: (
                    <>
                      <p>{highlight(f.answer, term)}</p>
                      <span className="badge" style={{ marginTop: 10 }}>{FAQ_TOPICS.find((t) => t.id === f.topic)?.label}</span>
                    </>
                  ),
                }))}
              />
            ) : (
              <Empty icon={<MessageCircleQuestion size={22} />} title="No questions match your search">
                <p className="small">Try another word, or ask us directly.</p>
                <div className="row-wrap" style={{ justifyContent: 'center' }}>
                  <button className="btn btn-outline btn-sm" onClick={() => { setQ(''); setTopic('all'); }}>Clear filters</button>
                  <Link to="/contact?type=support" className="btn btn-primary btn-sm">Contact us</Link>
                </div>
              </Empty>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
