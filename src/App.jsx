import { useState } from 'react';
import Header      from './components/Header';
import Toolbar     from './components/Toolbar';
import CodeEditor  from './components/CodeEditor';
import ReviewPanel from './components/ReviewPanel';
import { main } from './hooks/useGemini';
import styles from './styles/App.module.css';
import './styles/global.css';

export default function App() {
  const [apiKey,   setApiKey]   = useState('');
  const [code,     setCode]     = useState('');
  const [language, setLanguage] = useState('javascript');
  const [focus,    setFocus]    = useState('full');
  const [status,   setStatus]   = useState('idle'); // idle | loading | done | error | nocode | nokey
  const [reviewText, setReviewText] = useState('');
  const [error,    setError]    = useState('');

  const handleReview = async () => {
    if (!code.trim())       { setStatus('nocode'); return; }
    // if (!apiKey.trim())     { setStatus('nokey');  return; }

    setStatus('loading');
    setReviewText('');
    setError('');

    try {
      const result = await main(code, language, focus);
      setReviewText(result);
      setStatus('done');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const handleClear = () => {
    setCode('');
    setReviewText('');
    setError('');
    setStatus('idle');
  };

  return (
    <>
      {/* Ambient background orbs */}
      <div className={styles.orbs}>
        <div className={`${styles.orb} ${styles.orb1}`} />
        <div className={`${styles.orb} ${styles.orb2}`} />
        <div className={`${styles.orb} ${styles.orb3}`} />
      </div>

      <div className={styles.app}>
        <Header />

        <Toolbar
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          keyIsSet={apiKey.trim().length > 8}
          language={language}
          onLanguageChange={setLanguage}
          focus={focus}
          onFocusChange={setFocus}
          onReview={handleReview}
          onClear={handleClear}
          loading={status === 'loading'}
        />

        <div className={styles.split}>
          <CodeEditor code={code} onChange={setCode} />
          <ReviewPanel
            status={status}
            reviewText={reviewText}
            error={error}
          />
        </div>

        <div className={styles.hintBar}>
          <div className={styles.hintDot} />
          <span>
            <strong>Pro tip:</strong> API calls go directly to Gemini from your browser.
            For production apps, proxy via a backend to keep your key private.
          </span>
        </div>
      </div>
    </>
  );
}