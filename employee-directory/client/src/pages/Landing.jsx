import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Landing() {
  const { token } = useAuth();

  return (
    <main className="landing-page">
      <nav className="landing-nav" aria-label="Landing navigation">
        <Link className="brand-mark" to="/">
          <span className="brand-symbol"><i /><i /><i /></span>
          <span>People<span className="brand-accent">flow</span></span>
        </Link>
        <div className="landing-nav-links">
          <a href="#capabilities">Capabilities</a>
          <a href="#workspace">Workspace</a>
          <Link to="/login">Log in</Link>
          <Link className="nav-cta" to={token ? '/dashboard' : '/register'}>{token ? 'Open workspace' : 'Get started'} <span>↗</span></Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-copy">
          <p className="hero-kicker"><span /> PEOPLE OPERATIONS, REIMAGINED</p>
          <h1>I Will Grow as an Employee<br /><em>and Rise as a Skilled Web Designer.</em></h1>
          <p className="hero-description">A calmer way to organize people, departments, and the momentum behind your best work.</p>
          <div className="hero-actions">
            <Link className="hero-primary" to={token ? '/dashboard' : '/register'}>{token ? 'Open your workspace' : 'Build your directory'} <span>↗</span></Link>
            <a className="hero-secondary" href="#workspace"><span className="play-icon">▶</span> See the workspace</a>
          </div>
          <div className="hero-proof"><span className="proof-dots"><i /><i /><i /></span><span>Built for teams that care about the details</span></div>
        </div>
        <div className="hero-art" aria-label="Animated people network visualization" role="img">
          <div className="art-halo halo-one" />
          <div className="art-halo halo-two" />
          <div className="network-core"><span className="core-ring" /><span className="core-dot" /></div>
          <span className="orbit orbit-one"><b /></span><span className="orbit orbit-two"><b /></span><span className="orbit orbit-three"><b /></span>
          <div className="floating-label label-top"><span className="label-pulse" />Live team pulse</div>
          <div className="floating-label label-bottom"><strong>24</strong><span>people in motion</span></div>
        </div>
      </section>

      <section className="landing-strip" id="capabilities">
        <span>ONE SHARED SOURCE OF TRUTH</span><span>01 / 03</span>
        <p>From first hire to next chapter, every signal has a place.</p>
      </section>

      <section className="landing-capabilities" id="workspace">
        <article><span className="capability-number">01</span><h2>See the whole picture.</h2><p>Headcount snapshots and clean department views help your team make decisions without digging.</p></article>
        <article><span className="capability-number">02</span><h2>Move with intention.</h2><p>Search, filter, update, and keep every employee record current from one focused workspace.</p></article>
        <article><span className="capability-number">03</span><h2>Keep people in focus.</h2><p>Simple permissions and ownership-aware data keep the right context with the right team.</p></article>
      </section>
    </main>
  );
}

export default Landing;
