import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import './Home.css'

function Home() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const role = user?.role || 'USER'

  return (
    <div className="home-container">

      {/* Hero Section */}
      <section className="home-hero">

        <div className="hero-content">

          <div className="hero-eyebrow">
            <span className="pulse-dot"></span>
            DONORCONNECT
          </div>

          <h1>
            Every donation
            <span> can save a life.</span>
          </h1>

          <p className="hero-description">
            Connecting people who need blood with donors who can help.
            Together, we make every donation count.
          </p>

          <div className="hero-user">
            <div className="user-avatar">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>

            <div>
              <p className="hero-welcome">
                Welcome back, {user?.name || 'User'}
              </p>
              <p className="hero-email">
                {user?.email || 'N/A'}
              </p>
            </div>

            <span className="role-badge">
              {role}
            </span>
          </div>

        </div>

        {/* Visual blood-drop area */}
        <div className="hero-visual">

          <div className="blood-glow"></div>

          <div className="blood-drop">
            <span>♥</span>
          </div>

          <div className="orbit orbit-one"></div>
          <div className="orbit orbit-two"></div>

          <div className="floating-card floating-card-top">
            <span className="floating-icon">+</span>
            <div>
              <strong>Help someone</strong>
              <small>when they need it most</small>
            </div>
          </div>

          <div className="floating-card floating-card-bottom">
            <span className="floating-icon">♥</span>
            <div>
              <strong>Give hope</strong>
              <small>one donation at a time</small>
            </div>
          </div>

        </div>

      </section>

      {/* Impact strip */}
      <section className="impact-strip">

        <div className="impact-item">
          <span className="impact-number">24/7</span>
          <span className="impact-label">Blood request access</span>
        </div>

        <div className="impact-divider"></div>

        <div className="impact-item">
          <span className="impact-number">1 → 1</span>
          <span className="impact-label">Donor connection</span>
        </div>

        <div className="impact-divider"></div>

        <div className="impact-item">
          <span className="impact-number">∞</span>
          <span className="impact-label">Possibilities to help</span>
        </div>

      </section>

      {/* Actions */}
      <section className="home-actions">

        <div className="section-heading">
          <div>
            <p className="section-kicker">YOUR SPACE</p>
            <h2>What would you like to do?</h2>
          </div>
          <p>
            Choose an action to continue.
          </p>
        </div>

        {role === 'DONOR' && (
          <div className="action-grid donor-grid">

            <Link to="/donor/profile" className="action-card action-primary">
              <div className="action-icon">◉</div>
              <div className="action-card-content">
                <h3>Donor Profile</h3>
                <p>Manage your blood group, location and availability.</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/donor/requests" className="action-card">
              <div className="action-icon">+</div>
              <div className="action-card-content">
                <h3>Available Requests</h3>
                <p>Find blood requests that match your profile.</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/donor/responses" className="action-card">
              <div className="action-icon">✓</div>
              <div className="action-card-content">
                <h3>My Responses</h3>
                <p>Track the requests you have responded to.</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/chat" className="action-card action-ai">
              <div className="action-icon">✦</div>
              <div className="action-card-content">
                <h3>AI Information Assistant</h3>
                <p>Ask questions about blood donation and preparation.</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

          </div>
        )}

        {role === 'REQUESTER' && (
          <div className="action-grid requester-grid">

            <Link to="/requests/new" className="action-card action-primary">
              <div className="action-icon">+</div>
              <div className="action-card-content">
                <h3>Create Blood Request</h3>
                <p>Create a request and connect with potential donors.</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/requests/my" className="action-card">
              <div className="action-icon">▣</div>
              <div className="action-card-content">
                <h3>My Requests</h3>
                <p>View and manage the blood requests you created.</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/chat" className="action-card action-ai">
              <div className="action-icon">✦</div>
              <div className="action-card-content">
                <h3>AI Information Assistant</h3>
                <p>Get general guidance from the DonorConnect knowledge base.</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

          </div>
        )}

        {role === 'ADMIN' && (
          <div className="action-grid admin-grid">

            <Link to="/admin" className="action-card action-primary">
              <div className="action-icon">▦</div>
              <div className="action-card-content">
                <h3>Admin Dashboard</h3>
                <p>Monitor the DonorConnect platform and its activity.</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/admin/users" className="action-card">
              <div className="action-icon">◎</div>
              <div className="action-card-content">
                <h3>User Management</h3>
                <p>Review and manage registered platform users.</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/admin/requests" className="action-card">
              <div className="action-icon">▤</div>
              <div className="action-card-content">
                <h3>Request Moderation</h3>
                <p>Review and manage blood donation requests.</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/admin/reports" className="action-card">
              <div className="action-icon">⚑</div>
              <div className="action-card-content">
                <h3>Reports</h3>
                <p>Review reported activity and moderation cases.</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

            <Link to="/chat" className="action-card action-ai">
              <div className="action-icon">✦</div>
              <div className="action-card-content">
                <h3>AI Information Assistant</h3>
                <p>Access the blood donation knowledge assistant.</p>
              </div>
              <span className="action-arrow">→</span>
            </Link>

          </div>
        )}

      </section>

      {/* Footer action */}
      <div className="home-footer">
        <button onClick={handleLogout} className="logout-btn">
          <span>↗</span>
          Sign out of DonorConnect
        </button>
      </div>

    </div>
  )
}

export default Home