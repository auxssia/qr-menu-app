import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css'; // Import the new CSS Module

export default function LandingPage() {
  return (
    <div>
      <header className={styles.header}>
        <nav className={styles.container}>
          <span className={styles.logo}>komify</span>
          <div className={styles.navLinks}>
            {/* Add other links back later if needed */}
            <Link href="/table/1" className={styles.buttonSecondary}>View Demo</Link>
          </div>
        </nav>
      </header>

      <main>
        <section className={`${styles.heroSection} ${styles.container}`}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroHeadline}>Reimagine Ordering — Fast. Simple. Contactless.</h1>
            <p className={styles.heroSubtext}>With komify, diners scan a QR code, browse your menu, and order instantly. No apps, no hassle.</p>
            <div className={styles.heroCta}>
              <Link href="/login" className={styles.buttonPrimary}>Get Started Free</Link>
              <Link href="/table/1" className={styles.buttonSecondary}>View Demo</Link>
            </div>
          </div>
          <div>
            <Image src="/hero-visual.png" alt="QR menu ordering" width={600} height={500} priority className={styles.heroImage} />
          </div>
        </section>
        {/* We will add the other sections back later */}
      </main>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <span className={styles.logo}>komify</span>
          <div className={styles.footerLinks}>
            <Link href="#">Features</Link>
            <Link href="#">Pricing</Link>
            <Link href="/table/1">Demo</Link>
          </div>
          <p className={styles.copyright}>&copy; 2024 komify. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}