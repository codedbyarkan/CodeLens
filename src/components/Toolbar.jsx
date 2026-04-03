import styles from '../styles/Toolbar.module.css';

const LANGUAGES = [
  'javascript', 'typescript', 'python', 'java',
  'go', 'rust', 'c++', 'php', 'ruby', 'swift',
];

const FOCUS_OPTIONS = [
  { value: 'full',        label: 'Full Review' },
  { value: 'bugs',        label: 'Bugs & Errors' },
  { value: 'security',    label: 'Security Audit' },
  { value: 'performance', label: 'Performance' },
  { value: 'style',       label: 'Code Style' },
];

export default function Toolbar({
  apiKey, onApiKeyChange, keyIsSet,
  language, onLanguageChange,
  focus, onFocusChange,
  onReview, onClear, loading,
}) {
  return (
    <>
      {/* API Key Row */}
      {/* <div className={styles.apiRow}>
        <input
          type="password"
          className={styles.glassInput}
          placeholder="Enter your Gemini API key — get one free at aistudio.google.com"
          value={apiKey}
          onChange={(e) => onApiKeyChange(e.target.value)}
        />
        <span className={`${styles.keyBadge} ${keyIsSet ? styles.keyBadgeSet : styles.keyBadgeNone}`}>
          {keyIsSet ? 'Key Set ✓' : 'No Key'}
        </span>
      </div> */}

      {/* Toolbar Row */}
      <div className={styles.toolbar}>
        <select
          className={styles.glassSelect}
          value={language}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>

        <select
          className={styles.glassSelect}
          value={focus}
          onChange={(e) => onFocusChange(e.target.value)}
        >
          {FOCUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={onReview}
          disabled={loading}
        >
          {loading ? '⟳  Analysing…' : '⟡  Analyse Code'}
        </button>

        <button
          className={`${styles.btn} ${styles.btnGhost}`}
          onClick={onClear}
          disabled={loading}
        >
          Clear
        </button>
      </div>
    </>
  );
}