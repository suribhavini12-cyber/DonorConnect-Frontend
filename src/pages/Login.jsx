import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import './Login.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await API.post('/api/auth/login', {
        email,
        password,
      })

      const {
        token,
        id,
        name,
        email: userEmail,
        role,
      } = response.data

      login(token, {
        id,
        name,
        email: userEmail,
        role,
      })

      navigate('/home')
    } catch (err) {
      if (err.response) {
        const data = err.response.data
        setErrorMessage(
          data.message ||
          data.error ||
          'Invalid email or password.'
        )
      } else {
        setErrorMessage(
          'Unable to connect to backend server.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">

      {/* Left Brand Experience */}
      <section className="login-showcase">

        <div className="showcase-glow showcase-glow-one"></div>
        <div className="showcase-glow showcase-glow-two"></div>

        <div className="showcase-content">

          <div className="showcase-brand">
            <div className="showcase-brand-icon">
              ♥
            </div>

            <div>
              <div className="showcase-brand-name">
                DonorConnect
              </div>

              <div className="showcase-brand-tagline">
                Every donation matters
              </div>
            </div>
          </div>

          <div className="showcase-main">

            <span className="showcase-eyebrow">
              <span className="showcase-dot"></span>
              BLOOD DONATION NETWORK
            </span>

            <h1>
              Give a little.
              <br />
              <span>Save a life.</span>
            </h1>

            <p>
              DonorConnect brings donors and people
              in need together through a simple,
              trusted and meaningful connection.
            </p>

          </div>

          <div className="showcase-stat">

            <div className="stat-icon">
              +
            </div>

            <div>
              <strong>One donation</strong>
              <span>can make a lasting difference.</span>
            </div>

          </div>

        </div>

        {/* Decorative blood visual */}
        <div className="showcase-visual">

          <div className="visual-ring visual-ring-one"></div>
          <div className="visual-ring visual-ring-two"></div>

          <div className="visual-drop">
            <span>♥</span>
          </div>

          <div className="visual-card visual-card-one">
            <span>O+</span>
            <div>
              <strong>Donor</strong>
              <small>Ready to help</small>
            </div>
          </div>

          <div className="visual-card visual-card-two">
            <span>+</span>
            <div>
              <strong>Connection</strong>
              <small>Starts here</small>
            </div>
          </div>

        </div>

      </section>

      {/* Login Area */}
      <section className="login-area">

        <div className="login-card">

          <div className="login-header">

            <span className="login-kicker">
              WELCOME BACK
            </span>

            <h2>
              Sign in to
              <span> DonorConnect</span>
            </h2>

            <p className="subtitle">
              Continue your journey of making
              a difference.
            </p>

          </div>

          {errorMessage && (
            <div className="alert alert-error">
              <span className="alert-icon">!</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  @
                </span>

                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  placeholder="you@example.com"
                  required
                />
              </div>

            </div>

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  •
                </span>

                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      aria-hidden="true"
                    >
                      <path
                        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="18"
                      height="18"
                      aria-hidden="true"
                    >
                      <path
                        d="M3 3l18 18"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M10.6 6.2A10.8 10.8 0 0 1 12 6c6 0 9.5 6 9.5 6a17.8 17.8 0 0 1-3.1 3.9M6.1 6.1C3.8 7.6 2.5 12 2.5 12s3.5 6 9.5 6c1.5 0 2.8-.3 4-.8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>

            </div>

            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              <span>
                {loading
                  ? 'Signing in...'
                  : 'Sign in to your account'}
              </span>

              {!loading && (
                <span className="button-arrow">
                  →
                </span>
              )}
            </button>

          </form>

          <div className="login-divider">
            <span></span>
            <small>DONORCONNECT</small>
            <span></span>
          </div>

          <p className="switch-auth">
            New to DonorConnect?
            <Link to="/register">
              Create an account
            </Link>
          </p>

        </div>

        <p className="login-footer">
          Connecting people. Supporting communities.
        </p>

      </section>

    </div>
  )
}

export default Login