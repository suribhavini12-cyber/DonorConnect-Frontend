import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'
import './DonorProfile.css'

const BLOOD_GROUPS = [
  { label: 'A+', value: 'A_POSITIVE' },
  { label: 'A-', value: 'A_NEGATIVE' },
  { label: 'B+', value: 'B_POSITIVE' },
  { label: 'B-', value: 'B_NEGATIVE' },
  { label: 'AB+', value: 'AB_POSITIVE' },
  { label: 'AB-', value: 'AB_NEGATIVE' },
  { label: 'O+', value: 'O_POSITIVE' },
  { label: 'O-', value: 'O_NEGATIVE' },
]

function DonorProfile() {
  const { user } = useAuth()
  const [profileExists, setProfileExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const [formData, setFormData] = useState({
    bloodGroup: 'O_POSITIVE',
    preferredLocations: '',
    participationStatus: 'ACTIVE',
    consentToContact: false,
  })

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setLoading(true)
    setMessage(null)
    setErrorMessage(null)

    try {
      const response = await API.get('/api/donors/profile')

      if (response.data) {
        setProfileExists(true)

        setFormData({
          bloodGroup: response.data.bloodGroup || 'O_POSITIVE',
          preferredLocations: response.data.preferredLocations || '',
          participationStatus:
            response.data.participationStatus || 'ACTIVE',
          consentToContact: Boolean(response.data.consentToContact),
        })
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setProfileExists(false)
      } else if (err.response) {
        setErrorMessage(
          err.response.data.message || 'Failed to load profile.'
        )
      } else {
        setErrorMessage('Unable to connect to backend server.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setSaving(true)
    setMessage(null)
    setErrorMessage(null)

    try {
      let response

      if (profileExists) {
        response = await API.put('/api/donors/profile', formData)
        setMessage('Donor profile updated successfully!')
      } else {
        response = await API.post('/api/donors/profile', formData)
        setMessage('Donor profile created successfully!')
        setProfileExists(true)
      }

      if (response.data) {
        setFormData({
          bloodGroup: response.data.bloodGroup,
          preferredLocations: response.data.preferredLocations,
          participationStatus: response.data.participationStatus,
          consentToContact: Boolean(response.data.consentToContact),
        })
      }
    } catch (err) {
      if (err.response) {
        setErrorMessage(
          err.response.data.message || 'Error saving profile.'
        )
      } else {
        setErrorMessage('Unable to connect to backend server.')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleStatusToggle = async (newStatus) => {
    setSaving(true)
    setMessage(null)
    setErrorMessage(null)

    try {
      const response = await API.patch(
        '/api/donors/participation',
        {
          participationStatus: newStatus,
        }
      )

      setFormData((prev) => ({
        ...prev,
        participationStatus: response.data.participationStatus,
      }))

      setMessage(
        `Participation status updated to ${newStatus}.`
      )
    } catch (err) {
      if (err.response) {
        setErrorMessage(
          err.response.data.message ||
          'Failed to update status.'
        )
      } else {
        setErrorMessage(
          'Unable to connect to backend server.'
        )
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading your donor profile...</p>
        </div>
      </div>
    )
  }

  const isActive =
    formData.participationStatus === 'ACTIVE'

  return (
    <div className="profile-page">

      <div className="profile-layout">

        <section className="profile-intro">

          <div className="profile-eyebrow">
            <span className="profile-dot"></span>
            DONOR PROFILE
          </div>

          <h1>
            Your profile can
            <span> help save a life.</span>
          </h1>

          <p className="profile-description">
            Keep your donation preferences up to date so
            DonorConnect can connect you with relevant
            blood requests.
          </p>

          <div className="donor-identity">
            <div className="donor-avatar">
              {(user?.name || 'D')
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {user?.name || 'Donor'}
              </strong>
              <span>
                {user?.email || 'Donor account'}
              </span>
            </div>
          </div>

          <div className="profile-impact">
            <div className="impact-symbol">♥</div>
            <div>
              <strong>Ready to make an impact?</strong>
              <span>
                Your availability helps us find
                meaningful matches.
              </span>
            </div>
          </div>

        </section>

        <section className="profile-card">

          <div className="profile-card-header">
            <div>
              <span className="card-kicker">
                DONATION PREFERENCES
              </span>

              <h2>
                {profileExists
                  ? 'Manage your profile'
                  : 'Create your donor profile'}
              </h2>

              <p>
                {profileExists
                  ? 'Update your information whenever your preferences change.'
                  : 'Complete your profile to become available for matching.'}
              </p>
            </div>

            <div
              className={`availability-badge ${isActive ? 'active' : 'paused'
                }`}
            >
              <span></span>
              {isActive ? 'AVAILABLE' : 'PAUSED'}
            </div>
          </div>

          {message && (
            <div className="profile-alert alert-success">
              <span className="alert-symbol">✓</span>
              <span>{message}</span>
            </div>
          )}

          {errorMessage && (
            <div className="profile-alert alert-error">
              <span className="alert-symbol">!</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="profile-form"
          >

            <div className="form-section">
              <div className="section-title">
                <span className="section-number">01</span>
                <div>
                  <strong>Blood information</strong>
                  <small>
                    Tell us which blood type you can donate.
                  </small>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="bloodGroup">
                  Blood group
                </label>

                <div className="select-wrapper">
                  <span className="field-icon">♥</span>

                  <select
                    id="bloodGroup"
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    required
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option
                        key={bg.value}
                        value={bg.value}
                      >
                        {bg.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">
                <span className="section-number">02</span>
                <div>
                  <strong>Donation area</strong>
                  <small>
                    Add the areas where you are comfortable donating.
                  </small>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="preferredLocations">
                  Preferred locations
                </label>

                <div className="input-wrapper">
                  <span className="field-icon">⌖</span>

                  <input
                    type="text"
                    id="preferredLocations"
                    name="preferredLocations"
                    value={formData.preferredLocations}
                    onChange={handleChange}
                    placeholder="Hyderabad, Secunderabad, Gachibowli"
                    required
                  />
                </div>

                <small className="help-text">
                  Enter areas or cities where you can
                  donate, separated by commas. No exact
                  home address is required.
                </small>
              </div>
            </div>

            <div className="form-section">
              <div className="section-title">
                <span className="section-number">03</span>
                <div>
                  <strong>Your availability</strong>
                  <small>
                    Choose whether you are currently available.
                  </small>
                </div>
              </div>

              <div className="status-options">

                <label
                  className={`status-option ${formData.participationStatus ===
                      'ACTIVE'
                      ? 'selected'
                      : ''
                    }`}
                >
                  <input
                    type="radio"
                    name="participationStatus"
                    value="ACTIVE"
                    checked={
                      formData.participationStatus ===
                      'ACTIVE'
                    }
                    onChange={handleChange}
                  />

                  <span className="custom-radio"></span>

                  <span className="status-content">
                    <strong>Active</strong>
                    <small>
                      I am available for matching.
                    </small>
                  </span>

                  <span className="status-check">
                    ✓
                  </span>
                </label>

                <label
                  className={`status-option ${formData.participationStatus ===
                      'PAUSED'
                      ? 'selected'
                      : ''
                    }`}
                >
                  <input
                    type="radio"
                    name="participationStatus"
                    value="PAUSED"
                    checked={
                      formData.participationStatus ===
                      'PAUSED'
                    }
                    onChange={handleChange}
                  />

                  <span className="custom-radio"></span>

                  <span className="status-content">
                    <strong>Paused</strong>
                    <small>
                      Temporarily unavailable for matching.
                    </small>
                  </span>

                  <span className="status-check">
                    ✓
                  </span>
                </label>

              </div>
            </div>

            <div className="consent-box">
              <label className="consent-label">
                <input
                  type="checkbox"
                  name="consentToContact"
                  checked={formData.consentToContact}
                  onChange={handleChange}
                />

                <span className="custom-checkbox">
                  ✓
                </span>

                <span>
                  <strong>
                    I agree to be contacted
                  </strong>

                  <small>
                    Allow DonorConnect to contact me
                    regarding relevant blood requests.
                  </small>
                </span>
              </label>
            </div>

            <div className="profile-actions">

              <button
                type="submit"
                className="profile-submit"
                disabled={saving}
              >
                <span>
                  {saving
                    ? 'Saving...'
                    : profileExists
                      ? 'Save changes'
                      : 'Create donor profile'}
                </span>

                {!saving && (
                  <span className="button-arrow">
                    →
                  </span>
                )}
              </button>

              {profileExists && (
                <button
                  type="button"
                  className="profile-toggle"
                  disabled={saving}
                  onClick={() =>
                    handleStatusToggle(
                      isActive ? 'PAUSED' : 'ACTIVE'
                    )
                  }
                >
                  <span
                    className={`toggle-indicator ${isActive ? 'active' : 'paused'
                      }`}
                  ></span>

                  {isActive
                    ? 'Pause availability'
                    : 'Become available'}
                </button>
              )}

            </div>

          </form>

        </section>

      </div>

    </div>
  )
}

export default DonorProfile