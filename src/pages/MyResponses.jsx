import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import ResponseStatusBadge from '../components/ResponseStatusBadge'
import './MyResponses.css'

function MyResponses() {
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    fetchMyResponses()
  }, [])

  const fetchMyResponses = async () => {
    setLoading(true)
    setErrorMessage(null)

    try {
      const res = await API.get('/api/responses/my')
      setResponses(res.data || [])
    } catch (err) {
      if (err.response) {
        setErrorMessage(
          err.response.data.message ||
          'Failed to load your responses.'
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

  const handleWithdraw = async (responseId) => {
    setActionId(responseId)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      await API.patch(`/api/responses/${responseId}`, {
        responseStatus: 'WITHDRAWN',
      })

      setSuccessMessage(
        'Response withdrawn successfully.'
      )

      await fetchMyResponses()
    } catch (err) {
      if (err.response) {
        setErrorMessage(
          err.response.data.message ||
          'Failed to withdraw response.'
        )
      } else {
        setErrorMessage(
          'Unable to connect to backend server.'
        )
      }
    } finally {
      setActionId(null)
    }
  }

  const formatDate = (date) => {
    if (!date) return 'Not available'

    return new Date(date).toLocaleString()
  }

  const formatStatus = (status) => {
    if (!status) return 'Unknown'

    return status
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
  }

  if (loading) {
    return (
      <div className="responses-page">
        <div className="responses-loading">
          <div className="loading-spinner"></div>
          <p>Loading your donor responses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="responses-page">

      <div className="responses-header">

        <div>
          <div className="responses-eyebrow">
            <span className="responses-dot"></span>
            YOUR DONOR ACTIVITY
          </div>

          <h1>
            Responses that
            <span> make a difference.</span>
          </h1>

          <p>
            Keep track of the blood requests you have
            responded to and manage your availability.
          </p>
        </div>

        <div className="response-count">
          <span>{responses.length}</span>
          <small>
            {responses.length === 1
              ? 'response'
              : 'responses'}
          </small>
        </div>

      </div>

      {successMessage && (
        <div className="responses-alert success">
          <span className="alert-symbol">✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="responses-alert error">
          <span className="alert-symbol">!</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {responses.length === 0 ? (
        <div className="empty-responses">

          <div className="empty-response-icon">
            ♥
          </div>

          <h2>No responses yet</h2>

          <p>
            You have not responded to any blood requests.
            Explore available requests to find someone
            who needs your help.
          </p>

          <Link
            to="/donor/requests"
            className="explore-responses-btn"
          >
            <span>Explore blood requests</span>
            <span>→</span>
          </Link>

        </div>
      ) : (
        <div className="responses-list">

          {responses.map((resp) => {

            const canWithdraw =
              resp.responseStatus === 'INTERESTED' ||
              resp.responseStatus === 'CONTACTED'

            return (
              <article
                key={resp.id}
                className="response-item"
              >

                <div className="response-top">

                  <div className="response-reference">
                    <span>RESPONSE</span>
                    <strong>#{resp.id}</strong>
                  </div>

                  <ResponseStatusBadge
                    status={resp.responseStatus}
                  />

                </div>

                <div className="response-main">

                  <div className="request-identity">

                    <div className="response-heart">
                      ♥
                    </div>

                    <div>
                      <span>Blood request</span>

                      <h2>
                        Request #{resp.requestId}
                      </h2>

                      <small>
                        Your response is part of this
                        donor request.
                      </small>
                    </div>

                  </div>

                  <div className="response-status-summary">

                    <span>Status</span>

                    <strong>
                      {formatStatus(
                        resp.responseStatus
                      )}
                    </strong>

                  </div>

                </div>

                {resp.message && (
                  <div className="response-message">

                    <span className="message-label">
                      YOUR MESSAGE
                    </span>

                    <p>
                      “{resp.message}”
                    </p>

                  </div>
                )}

                <div className="response-meta">

                  <div className="response-date">

                    <span>Created</span>

                    <strong>
                      {formatDate(
                        resp.createdAt
                      )}
                    </strong>

                  </div>

                  <div className="response-date">

                    <span>Last updated</span>

                    <strong>
                      {formatDate(
                        resp.updatedAt
                      )}
                    </strong>

                  </div>

                </div>

                <div className="response-actions">

                  <Link
                    to={`/donor/requests/${resp.requestId}`}
                    className="view-response-btn"
                  >
                    <span>View request</span>
                    <span>→</span>
                  </Link>

                  {canWithdraw && (
                    <button
                      onClick={() =>
                        handleWithdraw(resp.id)
                      }
                      disabled={actionId === resp.id}
                      className="withdraw-response-btn"
                    >
                      {actionId === resp.id
                        ? 'Withdrawing...'
                        : 'Withdraw response'}
                    </button>
                  )}

                </div>

              </article>
            )
          })}

        </div>
      )}

    </div>
  )
}

export default MyResponses