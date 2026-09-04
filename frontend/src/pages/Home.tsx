import { Link } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

export function Home() {
    const { role, setRole } = useRole();

    const stats = [
        { number: '1,200+', label: 'Meals Saved' },
        { number: '50+', label: 'Active Donors' },
        { number: '30+', label: 'Partner NGOs' },
        { number: '24/7', label: 'Availability' },
    ];

    return (
        <div className="home-page">
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">Share Surplus Food, Feed Communities</h1>
                    <p className="hero-subtitle">
                        FoodShare LK connects hotels, bakeries, and restaurants with surplus food
                        to people and organizations who need it — reducing waste and fighting hunger in Sri Lanka.
                    </p>
                    <div className="hero-actions">
                        <Link to="/donate" className="btn btn-primary">
                            Donate Food
                        </Link>
                        <Link to="/browse" className="btn btn-secondary">
                            Find Food
                        </Link>
                    </div>
                </div>
            </section>

            <section className="stats-section">
                <div className="container">
                    <div className="stats-grid">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="problem-section">
                <div className="container">
                    <h2 className="section-title">The Problem</h2>
                    <div className="problem-grid">
                        <div className="problem-card">
                            <h3>Food Waste</h3>
                            <p>
                                Hotels and bakeries discard tons of edible food daily at closing time
                                because there's no fast channel to notify nearby recipients.
                            </p>
                        </div>
                        <div className="problem-card">
                            <h3>No Visibility</h3>
                            <p>
                                NGOs, individuals, and animal shelters don't know what's available,
                                where, or when — leading to missed opportunities.
                            </p>
                        </div>
                        <div className="problem-card">
                            <h3>Manual Coordination</h3>
                            <p>
                                Phone calls and word-of-mouth are slow and unreliable against
                                a closing-time deadline.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="how-it-works">
                <div className="container">
                    <h2 className="section-title">How It Works</h2>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Choose Your Role</h3>
                            <p>Select Donor or Recipient — no login required</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Post or Browse</h3>
                            <p>Donors list surplus food; Recipients search and filter</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Claim & Pickup</h3>
                            <p>Recipients claim listings and arrange pickup directly</p>
                        </div>
                    </div>
                </div>
            </section>

            {role === 'guest' && (
                <section className="role-selection">
                    <div className="container">
                        <h2 className="section-title">Get Started</h2>
                        <p className="role-selection-text">Choose how you'd like to use FoodShare LK:</p>
                        <div className="role-cards">
                            <button
                                onClick={() => setRole('donor')}
                                className="role-card"
                            >
                                <div className="role-icon">🍞</div>
                                <h3>I'm a Donor</h3>
                                <p>Post surplus food from your hotel, bakery, restaurant, or household</p>
                            </button>
                            <button
                                onClick={() => setRole('recipient')}
                                className="role-card"
                            >
                                <div className="role-icon">🤝</div>
                                <h3>I'm a Recipient</h3>
                                <p>Find and claim food for people, NGOs, or animal shelters</p>
                            </button>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}