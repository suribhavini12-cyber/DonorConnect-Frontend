import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import API from '../api/axios'
import './PotentialMatches.css'

function PotentialMatches() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    fetchMatches()
  }, [id])

  const fetchMatches = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const response = await API.get(`/api/requests/${id}/matches`)
      setMatches(response.data || [])
    } catch (err) {
      if (err.response) {
        if (err.response.status === 401) {
          setErrorMessage('Please log in again.')
        } else if (err.response.status === 403) {
          setErrorMessage('You are not authorized to view matches for this request.')
        } else if (err.response.status === 404) {
          setErrorMessage('Request not found.')
        } else {
          setErrorMessage(err.response.data.message || 'Unable to load potential donor matches.')
        }
      } else {
        setErrorMessage('Unable to load potential donor matches.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading-container">Finding Potential Matches...</div>
  }

  return (
    <div className="matches-card">
      <div className="header-row">
        <h2>Potential Donor Matches</h2>
        <Link to={`/requests/${id}`} className="back-link">
          &larr; Back to Request
        </Link>
      </div>

      <div className="safety-disclaimer">
        <p>
          <strong>Safety Note:</strong> These are potential matches based on the information provided by donors and the request. Medical eligibility, blood availability, and donation arrangements must be confirmed with a hospital or authorized blood bank.
        </p>
      </div>

      {errorMessage && (
        <div className="error-container">
          <div className="alert alert-error">{errorMessage}</div>
          <button onClick={fetchMatches} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {!errorMessage && matches.length === 0 && (
        <div className="no-matches-box">
          <p>No potential donor matches found for this request yet.</p>
        </div>
      )}

      {!errorMessage && matches.length > 0 && (
        <div className="matches-grid">
          {matches.map((match, index) => (
            <div key={match.donorId || index} className="match-item">
              <div className="match-header">
                <h3>{match.donorName}</h3>
                <span className="blood-group-tag">
                  {match.bloodGroup?.replace('_POSITIVE', '+').replace('_NEGATIVE', '-')}
                </span>
              </div>
              <div className="match-details">
                <p>
                  <strong>Preferred Locations:</strong> {match.preferredLocations}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className="status-text">{match.participationStatus}</span>
                </p>
                <p>
                  <strong>Consent to Contact:</strong>{' '}
                  {match.consentToContact ? 'Yes' : 'No'}
                </p>
              </div>
              <div className="match-reason-box">
                <p>{match.matchReason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PotentialMatches
