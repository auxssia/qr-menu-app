import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function LandingPage() {
  return (
    <div>
      <header className={styles.header}>
        <nav className={styles.container}>
          <span className={styles.logo}>komify</span>
          <Link href="/table/1" className={styles.buttonSecondary}>View Demo</Link>
        </nav>
      </header>

      <main className={styles.container}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroHeadline}>Reimagine Ordering — Fast. Simple. Contactless.</h1>
            <p className={styles.heroSubtext}>With komify, diners scan a QR code, browse your menu, and order instantly. No apps, no hassle.</p>
            <div className={styles.heroCta}>
              <Link href="/login" className={styles.buttonPrimary}>Get Started Free</Link>
              <Link href="/menu/my-first-restaurant/1" className={styles.buttonSecondary}>View Demo</Link>
            </div>
          </div>
          <div>
            <Image src="/hero-visual.png" alt="QR menu ordering" width={500} height={500} priority className={styles.heroImage} />
          </div>
        </section>
      </main>
    </div>
  );
}