import styles from '../styles/Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <div className={styles.logoIcon}>⌬</div>
        <span className={styles.logoGradient}>CodeLens</span>
      </div>
      <div className={styles.pills}>
        <span className={`${styles.pill} ${styles.pillActive}`}>Gemini</span>
        <span className={styles.pill}>Flash-Preview</span>
      </div>
    </header>
  );
}