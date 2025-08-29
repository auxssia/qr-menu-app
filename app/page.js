import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="landing-body">
      <header className="landing-header">
        <nav>
          <span>SwiftOrder</span>
          <Link href="/table/1" className="cta-button-secondary">View Demo</Link>
        </nav>
      </header>

      <main className="landing-main">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Upgrade Your Restaurant Experience. Instantly.</h1>
            <p>A simple, powerful QR ordering system that works in any browser. No app downloads, no hassle.</p>
            <Link href="#how-it-works" className="cta-button-primary">See How It Works</Link>
          </div>
          <div className="hero-image">
            <Image src="/landing-hero.png" alt="QR code ordering on a phone" width={500} height={500} priority />
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works-section">
          <h2>Go from Scan to Serve in 3 Simple Steps</h2>
          <div className="steps-container">
            <div className="step-card">
              <h3>1. Scan</h3>
              <p>Customers scan a unique QR code at their table to instantly pull up your digital menu.</p>
            </div>
            <div className="step-card">
              <h3>2. Order</h3>
              <p>They add items to their cart and place the order directly from their phone.</p>
            </div>
            <div className="step-card">
              <h3>3. Serve</h3>
              <p>The order appears on your kitchen dashboard in real-time, ready to be prepared.</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>Built for Speed and Simplicity</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>⚡ Real-Time Everything</h3>
              <p>Orders and status updates are instant. The kitchen and the customer are always perfectly in sync.</p>
            </div>
            <div className="feature-card">
              <h3>📱 No App Required</h3>
              <p>Works in any mobile browser, eliminating the friction of asking customers to download an app.</p>
            </div>
            <div className="feature-card">
              <h3>⚙️ Full Admin Control</h3>
              <p>Log in to a secure dashboard to add, edit, or delete menu items yourself, anytime.</p>
            </div>
            <div className="feature-card">
              <h3>📈 Built to Scale</h3>
              <p>Start for free and add powerful features like online payments when you&apos;re ready to grow.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <p>&copy; 2024 SwiftOrder. All rights reserved.</p>
      </footer>
    </div>
  );
}