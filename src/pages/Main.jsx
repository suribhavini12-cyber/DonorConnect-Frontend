
import { Link } from 'react-router-dom'
import './Main.css'

function Main() {
    return (
        <div className="landing-page">

            <section className="landing-hero">
                <div className="landing-hero-content">

                    <div className="landing-eyebrow">
                        <span className="landing-eyebrow-dot"></span>
                        DONORCONNECT
                    </div>

                    <h1>
                        Every donation
                        <span> can save a life.</span>
                    </h1>

                    <p className="landing-hero-text">
                        DonorConnect brings blood donors and people in need together,
                        making it easier to find help when every moment matters.
                    </p>

                    <div className="landing-actions">
                        <Link to="/register" className="landing-primary-btn">
                            Get started
                            <span>→</span>
                        </Link>

                        <Link to="/login" className="landing-secondary-btn">
                            Sign in
                        </Link>
                    </div>

                    <div className="landing-trust">
                        <div className="trust-item">
                            <strong>24/7</strong>
                            <span>Connection</span>
                        </div>

                        <div className="trust-divider"></div>

                        <div className="trust-item">
                            <strong>1 → 1</strong>
                            <span>Human impact</span>
                        </div>

                        <div className="trust-divider"></div>

                        <div className="trust-item">
                            <strong>AI</strong>
                            <span>Information support</span>
                        </div>
                    </div>
                </div>

                <div className="landing-visual">
                    <div className="visual-glow"></div>

                    <div className="visual-ring visual-ring-one"></div>
                    <div className="visual-ring visual-ring-two"></div>

                    <div className="blood-orb">
                        <div className="blood-drop">🩸</div>
                    </div>

                    <div className="floating-card floating-card-top">
                        <span className="floating-icon">♥</span>
                        <div>
                            <strong>Give hope</strong>
                            <small>One donation matters</small>
                        </div>
                    </div>

                    <div className="floating-card floating-card-bottom">
                        <span className="floating-status"></span>
                        <div>
                            <strong>Help is closer</strong>
                            <small>Connect with donors</small>
                        </div>
                    </div>

                    <div className="visual-cross">
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </section>

            <section className="landing-intro">
                <div className="section-heading">
                    <span>ONE PLATFORM. REAL IMPACT.</span>
                    <h2>Built around the people who need each other.</h2>
                </div>

                <div className="landing-benefits">

                    <article className="benefit-card">
                        <div className="benefit-number">01</div>
                        <div className="benefit-icon">♥</div>
                        <h3>For donors</h3>
                        <p>
                            Create your donor profile, choose where you can help,
                            and respond to blood requests that match you.
                        </p>
                    </article>

                    <article className="benefit-card benefit-card-featured">
                        <div className="benefit-number">02</div>
                        <div className="benefit-icon">+</div>
                        <h3>For requesters</h3>
                        <p>
                            Create a blood request and discover potential donors
                            based on blood group, availability and location.
                        </p>
                    </article>

                    <article className="benefit-card">
                        <div className="benefit-number">03</div>
                        <div className="benefit-icon">✦</div>
                        <h3>AI-assisted support</h3>
                        <p>
                            Get helpful blood-donation information through the
                            platform's AI and knowledge-base assistant.
                        </p>
                    </article>

                </div>
            </section>

            <section className="landing-how">
                <div className="how-copy">
                    <span className="section-label">HOW IT WORKS</span>
                    <h2>A simpler path from need to help.</h2>
                    <p>
                        DonorConnect keeps the experience focused: create a profile
                        or request, find the right connection, and take the next step.
                    </p>

                    <Link to="/register" className="text-link">
                        Join DonorConnect <span>→</span>
                    </Link>
                </div>

                <div className="how-steps">

                    <div className="how-step">
                        <div className="step-circle">01</div>
                        <div>
                            <h3>Create your profile</h3>
                            <p>
                                Tell us whether you're here to donate or request blood.
                            </p>
                        </div>
                    </div>

                    <div className="step-line"></div>

                    <div className="how-step">
                        <div className="step-circle">02</div>
                        <div>
                            <h3>Find the right match</h3>
                            <p>
                                Relevant blood requests and potential donors are brought together.
                            </p>
                        </div>
                    </div>

                    <div className="step-line"></div>

                    <div className="how-step">
                        <div className="step-circle">03</div>
                        <div>
                            <h3>Make a difference</h3>
                            <p>
                                Respond, connect and help move someone closer to receiving care.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            <section className="landing-cta">
                <div className="cta-inner">
                    <div>
                        <span className="section-label">YOUR NEXT STEP</span>
                        <h2>Someone's tomorrow could start with you.</h2>
                    </div>

                    <div className="cta-actions">
                        <Link to="/register" className="cta-primary">
                            Create an account
                            <span>→</span>
                        </Link>

                        <Link to="/login" className="cta-secondary">
                            Already a member? Sign in
                        </Link>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <div className="footer-brand">
                    <div className="footer-mark">🩸</div>
                    <div>
                        <strong>DonorConnect</strong>
                        <span>Connecting donors with those in need</span>
                    </div>
                </div>

                <p>Every donation can save a life.</p>
            </footer>

        </div>
    )
}

export default Main
