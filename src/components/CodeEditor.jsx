import styles from '../styles/CodeEditor.module.css';

export default function CodeEditor({ code, onChange }) {
  const lineCount = code ? code.split('\n').length : 0;

  return (
    <div className={styles.glassPanel}>
      <div className={styles.panelHead}>
        <div className={styles.panelTitle}>
          <div className={`${styles.dot} ${styles.dotCyan}`} />
          Source Code
        </div>
        <span className={styles.panelMeta}>
          {lineCount} {lineCount === 1 ? 'line' : 'lines'}
        </span>
      </div>

      <textarea
        className={styles.codeArea}
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`// Paste your code here…\n// Example:\nfunction fetchUser(id) {\n  var url = 'http://api.example.com/user/' + id;\n  return fetch(url).then(r => r.json());\n}`}
        spellCheck={false}
      />
    </div>
  );
}
