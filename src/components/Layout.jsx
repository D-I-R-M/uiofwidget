import { Link, useLocation } from 'react-router-dom'
import styles from './Layout.module.css'

export default function Layout({ children }) {
  const loc = useLocation()
  const isHome = loc.pathname === '/'

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>*</span>
            <span className={styles.logoText}>Sugar Journal</span>
          </Link>
          <nav className={styles.nav}>
            <a
              href="https://fastapi-tv77.onrender.com/docs"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.navLink}
            >
              API Docs
            </a>
          </nav>
        </div>
        {isHome && (
          <div className={styles.hero}>
            <h1 className={styles.heroTitle}>
              A learner
              <br />
              <em>living record</em>
            </h1>
            <p className={styles.heroSub}>
              Browse, search, and reflect on journal entries from the Sugar Learning Platform.
            </p>
          </div>
        )}
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <span>Sugar Journal AI API</span>
        <span className={styles.footerDot}>|</span>
        <a
          href="https://github.com/D-I-R-M/fastapi"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </footer>
    </div>
  )
}