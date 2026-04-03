import styles from '../styles/ReviewPanel.module.css';

/* ── Badge helper ── */
function getBadgeClass(title) {
  const t = title.toLowerCase();
  if (/bug|error|issue|problem|defect/.test(t))           return styles.badgeBug;
  if (/secur|vulnerab|inject|xss|auth/.test(t))           return styles.badgeSec;
  if (/perform|optim|speed|memory|complex/.test(t))       return styles.badgePerf;
  if (/suggest|improve|consider|refactor|style|readab/.test(t)) return styles.badgeInfo;
  return styles.badgeOk;
}

function getBadgeLabel(title) {
  const t = title.toLowerCase();
  if (/bug|error|issue|problem|defect/.test(t))           return 'issue';
  if (/secur|vulnerab|inject|xss|auth/.test(t))           return 'security';
  if (/perform|optim|speed|memory|complex/.test(t))       return 'perf';
  if (/suggest|improve|consider|refactor|style|readab/.test(t)) return 'suggest';
  return 'ok';
}

/* ── Inline markdown: bold + code ── */
function InlineMarkdown({ text }) {
  const parts = [];
  const regex = /\*\*(.+?)\*\*|`(.+?)`/g;
  let last = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    if (match[1]) parts.push(<strong key={match.index} style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{match[1]}</strong>);
    if (match[2]) parts.push(<code key={match.index} style={{ fontFamily: 'var(--font-mono)', fontSize: '11.5px', background: 'rgba(255,255,255,0.07)', padding: '1px 5px', borderRadius: '4px', color: 'var(--accent-cyan)' }}>{match[2]}</code>);
    last = match.index + match[0].length;
  }

  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

/* ── Parse raw markdown text into sections ── */
function parseReview(text) {
  const lines = text.split('\n');
  const sections = [];
  let current = null;

  lines.forEach((line) => {
    const heading = line.match(/^#{1,3}\s+(.+)|^\*\*(.+)\*\*:?\s*$|^(\d+)\.\s+\*\*(.+)\*\*:?/);
    if (heading) {
      if (current) sections.push(current);
      const title = (heading[1] || heading[2] || heading[4] || '').replace(/\*\*/g, '');
      current = { title, items: [] };
    } else {
      const trimmed = line.replace(/^[-*•]\s*/, '').trim();
      if (trimmed && current) current.items.push(trimmed);
      else if (trimmed) {
        if (!sections.length) sections.push({ title: '', items: [] });
        sections[sections.length - 1].items.push(trimmed);
      }
    }
  });

  if (current) sections.push(current);
  return sections;
}

/* ── Sub-components ── */
function EmptyState({ icon, label, sublabel, isError }) {
  return (
    <div className={styles.emptyState}>
      <div className={`${styles.emptyRing} ${isError ? styles.emptyRingWarn : ''}`}>
        {icon}
      </div>
      <p className={`${styles.emptyLabel} ${isError ? styles.emptyLabelError : ''}`}>
        {label}
      </p>
      {sublabel && <span className={styles.emptySubtext}>{sublabel}</span>}
    </div>
  );
}

function Loader() {
  return (
    <div className={styles.loader}>
      <div className={styles.loaderRing} />
      <span>Running AI analysis…</span>
    </div>
  );
}

function ReviewContent({ sections }) {
  return (
    <>
      {sections.map((sec, i) => (
        <div key={i}>
          {i > 0 && <div className={styles.divider} />}
          <div className={styles.section}>
            {sec.title && (
              <div className={styles.sectionTitle}>
                {sec.title}
                <span className={`${styles.badge} ${getBadgeClass(sec.title)}`}>
                  {getBadgeLabel(sec.title)}
                </span>
              </div>
            )}
            {sec.items.map((item, j) => (
              <div key={j} className={styles.item}>
                <InlineMarkdown text={item} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/* ── Main component ── */
export default function ReviewPanel({ status, reviewText, error }) {
  const renderBody = () => {
    if (status === 'idle') {
      return <EmptyState icon="◈" label="Review will appear here" sublabel="Enter code and hit Analyse" />;
    }
    if (status === 'loading') {
      return <Loader />;
    }
    if (status === 'error') {
      return <EmptyState icon="!" label={error} isError />;
    }
    if (status === 'nocode') {
      return <EmptyState icon="⊘" label="No code to review" isError />;
    }
    // if (status === 'nokey') {
    //   return <EmptyState icon="🔑" label="API key required" sublabel="Paste your Gemini key above" isError />;
    // }
    if (status === 'done' && reviewText) {
      const sections = parseReview(reviewText);
      return <ReviewContent sections={sections} />;
    }
    return null;
  };

  const statusBadge = () => {
    if (status === 'done')  return <span className={`${styles.badge} ${styles.badgeOk}`}>Done</span>;
    if (status === 'error') return <span className={`${styles.badge} ${styles.badgeBug}`}>Error</span>;
    return null;
  };

  return (
    <div className={styles.glassPanel}>
      <div className={styles.panelHead}>
        <div className={styles.panelTitle}>
          <div className={`${styles.dot} ${styles.dotViolet}`} />
          AI Review
        </div>
        {statusBadge()}
      </div>
      <div className={styles.reviewBody}>
        {renderBody()}
      </div>
    </div>
  );
}
