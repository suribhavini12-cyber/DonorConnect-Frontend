import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import ReportModal from '../components/ReportModal'
import './DonorRequestDetails.css'

function DonorRequestDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [request, setRequest] = useState(null)
  const [donorProfile, setDonorProfile] = useState(null)
  const [existingResponse, setExistingResponse] = useState(null)
  const [message, setMessage] = useState('')
  const [showReportModal, setShowReportModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const reqRes = await API.get(`/api/requests/${id}`)
      setRequest(reqRes.data)

      try {
        const profileRes = await API.get('/api/donors/profile')
        setDonorProfile(profileRes.data)
      } catch (err) {
        setDonorProfile(null)
      }

      try {
        const responsesRes = await API.get('/api/responses/my')
        const myResp = (responsesRes.data || []).find((r) => String(r.requestId) === String(id))
        setExistingResponse(myResp || null)
      } catch (err) {
        setExistingResponse(null)
      }
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data.message || 'Failed to load request details.')
      } else {
        setErrorMessage('Unable to connect to backend server.')
      }
    } finally {
      setLoading(false)
    }
  }

  const isPotentialMatch = () => {
    if (!request || !donorProfile) return false
    if (request.status !== 'OPEN' && request.status !== 'PARTIALLY_RESPONDED') return false
    if (donorProfile.participationStatus !== 'ACTIVE') return false
    if (!donorProfile.consentToContact) return false
    if (donorProfile.bloodGroup !== request.bloodGroup) return false

    const hospitalLoc = request.hospitalLocation ? request.hospitalLocation.trim().toLowerCase() : ''
    const preferred = donorProfile.preferredLocations ? donorProfile.preferredLocations.toLowerCase() : ''
    if (!hospitalLoc || !preferred) return false

    const tokens = preferred.split(',')
    for (let rawToken of tokens) {
      const token = rawToken.trim()
      if (token && (hospitalLoc.includes(token) || token.includes(hospitalLoc))) {
        return true
      }
    }
    return false
  }

  const handleRespond = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await API.post(`/api/requests/${id}/responses`, { message })
      setSuccessMessage('Your response has been submitted successfully!')
      setExistingResponse(response.data)
    } catch (err) {
      if (err.response) {
        if (err.response.status === 409) {
          setErrorMessage('You have already submitted an active response to this request.')
        } else {
          setErrorMessage(err.response.data.message || 'Failed to submit response.')
        }
      } else {
        setErrorMessage('Unable to connect to backend server.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="loading-container">Loading Request Details...</div>
  }

  if (errorMessage && !request) {
    return (
      <div className="details-card">
        <div className="alert alert-error">{errorMessage}</div>
        <Link to="/donor/requests" className="back-btn">
          Back to Available Requests
        </Link>
      </div>
    )
  }

  const matched = isPotentialMatch()
  const activeResponse = existingResponse && existingResponse.responseStatus !== 'WITHDRAWN'

  return (
    <div className="details-card">
      <div className="header-row">
        <h2>Request Details #{request.id}</h2>
        <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
          <button
            onClick={() => setShowReportModal(true)}
            className="action-btn"
            style={{ backgroundColor: '#6c757d', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600' }}
          >
            Report Request
          </button>
          <StatusBadge status={request.status} />
        </div>
      </div>

      <Link to="/donor/requests" className="back-link">
        &larr; Back to Available Requests
      </Link>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

      <div className="details-grid">
        <div className="detail-item">
          <label>Blood Group:</label>
          <span>{request.bloodGroup?.replace('_POSITIVE', '+').replace('_NEGATIVE', '-')}</span>
        </div>
        <div className="detail-item">
          <label>Blood Component:</label>
          <span>{request.bloodComponent}</span>
        </div>
        <div className="detail-item">
          <label>Units Required:</label>
          <span>{request.unitsRequired}</span>
        </div>
        <div className="detail-item">
          <label>Urgency Level:</label>
          <span className={`urgency-text urgency-${request.urgency?.toLowerCase()}`}>
            {request.urgency}
          </span>
        </div>
        <div className="detail-item">
          <label>Hospital Name:</label>
          <span>{request.hospitalName}</span>
        </div>
        <div className="detail-item">
          <label>Hospital Location:</label>
          <span>{request.hospitalLocation}</span>
        </div>
        <div className="detail-item">
          <label>Required By:</label>
          <span>{request.requiredBy ? new Date(request.requiredBy).toLocaleString() : 'N/A'}</span>
        </div>
      </div>

      <div className="description-box">
        <label>Description:</label>
        <p>{request.description}</p>
      </div>

      <div className="response-section">
        {activeResponse ? (
          <div className="already-responded-box">
            <h3>You Have Responded to This Request</h3>
            <p>
              Status: <strong>{existingResponse.responseStatus}</strong>
            </p>
            {existingResponse.message && <p>Message: "{existingResponse.message}"</p>}
            <Link to="/donor/responses" className="manage-responses-btn">
              Manage My Responses
            </Link>
          </div>
        ) : matched ? (
          <div className="respond-box">
            <h3>Respond to Blood Request</h3>
            <form onSubmit={handleRespond}>
              <div className="form-group">
                <label>Optional Message for Requester:</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I am interested in responding to this request."
                  maxLength={500}
                  rows={3}
                  disabled={submitting}
                />
              </div>
              <button type="submit" disabled={submitting} className="submit-response-btn">
                {submitting ? 'Submitting...' : 'Submit Response'}
              </button>
            </form>
          </div>
        ) : (
          <div className="not-matched-box">
            <p>
              <em>
                Note: Only potential donor matches (matching blood group, active status, consent enabled, and preferred location) may respond to this request.
              </em>
            </p>
          </div>
        )}
      </div>

      {showReportModal && (
        <ReportModal
          targetRequestId={request.id}
          targetUserId={request.requesterId}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  )
}

export default DonorRequestDetails
