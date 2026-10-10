import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import './AvailableRequests.css'

function AvailableRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    setErrorMessage(null)

    try {
      const response = await API.get('/api/requests')

      const available = (response.data || []).filter(
        (r) =>
          r.status === 'OPEN' ||
          r.status === 'PARTIALLY_RESPONDED'
      )

      setRequests(available)
    } catch (err) {
      if (err.response) {
        setErrorMessage(
          err.response.data.message ||
          'Failed to load blood requests.'
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

  const formatBloodGroup = (bloodGroup) => {
    if (!bloodGroup) return '—'

    return bloodGroup
      .replace('_POSITIVE', '+')
      .replace('_NEGATIVE', '-')
  }

  const formatDate = (date) => {
    if (!date) return 'Not specified'

    return new Date(date).toLocaleString()
  }

  const formatComponent = (component) => {
    if (!component) return 'Not specified'

    return component
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
  }

  if (loading) {
    return (
      <div className="available-page">
        <div className="available-loading">
          <div className="loading-spinner"></div>
          <p>Finding available blood requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="available-page">

      <div className="available-header">

        <div>
          <div className="available-eyebrow">
            <span className="available-dot"></span>
            DONOR NETWORK
          </div>

          <h1>
            Blood requests
            <span> that need you.</span>
          </h1>

          <p>
            Explore active requests that match
            donors available to help their community.
          </p>
        </div>

        <div className="request-count">
          <span>{requests.length}</span>
          <small>
            {requests.length === 1
              ? 'active request'
              : 'active requests'}
          </small>
        </div>

      </div>

      {errorMessage && (
        <div className="available-alert">
          <span className="alert-symbol">!</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {!errorMessage && requests.length === 0 ? (
        <div className="empty-requests">

          <div className="empty-icon">♥</div>

          <h2>No active requests</h2>

          <p>
            There are currently no blood requests
            available for you. Check back soon.
          </p>

        </div>
      ) : (
        <div className="requests-list">

          {requests.map((req) => {

            const urgency =
              req.urgency?.toLowerCase() || 'medium'

            const isPartial =
              req.status === 'PARTIALLY_RESPONDED'

            return (
              <article
                key={req.id}
                className="request-card-item"
              >

                <div className="request-card-top">

                  <div className="request-reference">
                    <span>REQUEST</span>
                    <strong>#{req.id}</strong>
                  </div>

                  <div className="request-status-area">
                    <span
                      className={`urgency-pill urgency-${urgency}`}
                    >
                      {req.urgency || 'MEDIUM'}
                    </span>

                    <StatusBadge
                      status={req.status}
                    />
                  </div>

                </div>

                <div className="request-main">

                  <div className="blood-display">

                    <div className="blood-symbol">
                      ♥
                    </div>

                    <div>
                      <span>Blood group</span>
                      <strong>
                        {formatBloodGroup(
                          req.bloodGroup
                        )}
                      </strong>
                    </div>

                  </div>

                  <div className="request-details">

                    <div className="detail-item">
                      <span className="detail-icon">
                        +
                      </span>

                      <div>
                        <small>Component</small>
                        <strong>
                          {formatComponent(
                            req.bloodComponent
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="detail-item">
                      <span className="detail-icon">
                        #
                      </span>

                      <div>
                        <small>Units needed</small>
                        <strong>
                          {req.unitsRequired}
                        </strong>
                      </div>
                    </div>

                    <div className="detail-item">
                      <span className="detail-icon">
                        ⌖
                      </span>

                      <div>
                        <small>Hospital</small>
                        <strong>
                          {req.hospitalName}
                        </strong>
                      </div>
                    </div>

                    <div className="detail-item">
                      <span className="detail-icon">
                        ◉
                      </span>

                      <div>
                        <small>Location</small>
                        <strong>
                          {req.hospitalLocation}
                        </strong>
                      </div>
                    </div>

                  </div>

                </div>

                <div className="request-meta">

                  <div className="required-date">
                    <span>Required by</span>
                    <strong>
                      {formatDate(req.requiredBy)}
                    </strong>
                  </div>

                  <div className="request-action">

                    {isPartial && (
                      <span className="partial-note">
                        Donors have already responded
                      </span>
                    )}

                    <Link
                      to={`/donor/requests/${req.id}`}
                      className="view-request-btn"
                    >
                      <span>
                        View request
                      </span>

                      <span className="request-arrow">
                        →
                      </span>
                    </Link>

                  </div>

                </div>

              </article>
            )
          })}

        </div>
      )}

    </div>
  )
}

export default AvailableRequests