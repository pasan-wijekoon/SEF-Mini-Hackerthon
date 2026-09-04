import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="page">
      <header className="page-head">
        <h1>How FoodShare LK Works</h1>
        <p className="page-sub">Turning end-of-day surplus into someone's next meal.</p>
      </header>

      <section className="about-section">
        <h2>The problem</h2>
        <p>
          Hotels, bakeries, and restaurants across Sri Lanka discard unsold, still-edible
          food at closing time — simply because there's no fast way to reach the people
          and organizations who could use it. Hospitality and food service account for
          roughly a quarter of the country's food waste.
        </p>
      </section>

      <section className="about-stats">
        <div className="stat"><span className="stat-num">~25%</span><span className="stat-label">of SL food waste is from hospitality</span></div>
        <div className="stat"><span className="stat-num">&lt;1 min</span><span className="stat-label">to post surplus food</span></div>
        <div className="stat"><span className="stat-num">Post → Claim</span><span className="stat-label">full lifecycle, no phone tag</span></div>
      </section>

      <section className="about-section">
        <h2>How it helps</h2>
        <p>
          Donors post surplus food in seconds. Recipients — individuals, NGOs, orphanages,
          elders' homes, and animal shelters — browse, filter, and claim what they need,
          then arrange pickup directly. No manual phone chains, no wasted trips.
        </p>
      </section>

      <section className="about-section">
        <h2>Credits</h2>
        <p>
          Built for the SE3090 Mini Hackathon. Inspired by real efforts like the
          Robin Hood Army Sri Lanka, WGSA, SharePlate, and Saubhagya.
        </p>
      </section>

      <Link to="/browse" className="btn-primary">Find food now</Link>
    </div>
  );
}
