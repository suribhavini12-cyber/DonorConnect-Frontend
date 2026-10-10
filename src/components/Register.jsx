import { useState } from 'react'
import API from '../api/axios'
import './Register.css'

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'DONOR',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMessage(null)
    setErrorMessage(null)
    setFieldErrors({})

    try {
      const response = await API.post(
        '/api/auth/register',
        formData
      )

      setSuccessMessage(
        response.data.message || 'Registration completed successfully!'
      )

      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'DONOR',
      })

      setShowPassword(false)
    } catch (err) {
      if (err.response) {
        const data = err.response.data

        if (data.details) {
          setFieldErrors(data.details)
        } else if (data.message) {
          setErrorMessage(data.message)
        } else if (data.error) {
          setErrorMessage(data.error)
        } else {
          setErrorMessage('Registration failed. Please check your inputs.')
        }
      } else {
        setErrorMessage('Unable to connect to backend server.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-card">
      <h2>Create an Account</h2>

      <p className="subtitle">
        Join DonorConnect to donate or request blood
      </p>

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="alert alert-error">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        className="register-form"
      >

        <div className="form-group">
          <label htmlFor="name">Full Name</label>

          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />

          {fieldErrors.name && (
            <span className="field-error">
              {fieldErrors.name}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>

          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="user@example.com"
            required
          />

          {fieldErrors.email && (
            <span className="field-error">
              {fieldErrors.email}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>

          <div className="register-password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              required
            />

            <button
              type="button"
              className="register-password-toggle"
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

          {fieldErrors.password && (
            <span className="field-error">
              {fieldErrors.password}
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="role">Account Type</label>

          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="DONOR">Donor</option>
            <option value="REQUESTER">Requester</option>
          </select>

          {fieldErrors.role && (
            <span className="field-error">
              {fieldErrors.role}
            </span>
          )}
        </div>

        <button
          type="submit"
          className="submit-btn"
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>

      </form>
    </div>
  )
}

export default Register