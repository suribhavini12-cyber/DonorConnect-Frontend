import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'
import StatusBadge from '../components/StatusBadge'
import ResponseStatusBadge from '../components/ResponseStatusBadge'
import './RequestDetails.css'

function RequestDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [request, setRequest] = useState(null)
  const [timeline, setTimeline] = useState([])
  const [responses, setResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const [aiSummaryObj, setAiSummaryObj] = useState(null)
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false)
  const [aiSummaryError, setAiSummaryError] = useState(null)

  const [duplicateCheck, setDuplicateCheck] = useState(null)
  const [duplicateLoading, setDuplicateLoading] = useState(false)
  const [duplicateError, setDuplicateError] = useState(null)

  useEffect(() => {
    fetchDetails()
  }, [id])

  const fetchDetails = async () => {
    setLoading(true)
    setErrorMessage(null)

    try {
      const reqRes = await API.get(`/api/requests/${id}`)
      const reqData = reqRes.data
      setRequest(reqData)

      const timelineRes = await API.get(`/api/requests/${id}/timeline`)
      setTimeline(timelineRes.data || [])

      if (
        user?.role === 'REQUESTER' &&
        user?.id === reqData.requesterId
      ) {
        try {
          const respRes = await API.get(
            `/api/requests/${id}/responses`
          )
          setResponses(respRes.data || [])
        } catch (err) {
          setResponses([])
        }
      }
    } catch (err) {
      if (err.response) {
        setErrorMessage(
          err.response.data.message ||
          'Failed to load request details.'
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

  const handleGenerateSummary = async () => {
    setAiSummaryLoading(true)
    setAiSummaryError(null)

    try {
      const response = await API.post(
        '/api/ai/request-summary',
        {
          requestId: Number(id),
        }
      )

      setAiSummaryObj(response.data)
    } catch (err) {
      if (err.response) {
        setAiSummaryError(
          err.response.data.message ||
          'Unable to generate summary.'
        )
      } else {
        setAiSummaryError(
          'Unable to connect to backend server.'
        )
      }
    } finally {
      setAiSummaryLoading(false)
    }
  }

  const handleDuplicateCheck = async () => {
    setDuplicateLoading(true)
    setDuplicateError(null)

    try {
      const response = await API.post(
        '/api/ai/duplicate-check',
        {
          requestId: Number(id),
        }
      )

      setDuplicateCheck(response.data)
    } catch (err) {
      if (err.response) {
        setDuplicateError(
          err.response.data.message ||
          'Unable to run duplicate check.'
        )
      } else {
        setDuplicateError(
          'Unable to connect to backend server.'
        )
      }
    } finally {
      setDuplicateLoading(false)
    }
  }

  const handleStatusChange = async (newStatus) => {
    setUpdating(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await API.patch(
        `/api/requests/${id}/status`,
        {
          status: newStatus,
        }
      )

      setRequest(response.data)
      setSuccessMessage(
        `Status updated to ${newStatus}`
      )

      const timelineRes = await API.get(
        `/api/requests/${id}/timeline`
      )

      setTimeline(timelineRes.data || [])
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
      setUpdating(false)
    }
  }

  const handleResponseStatusUpdate = async (
    responseId,
    newStatus
  ) => {
    setUpdating(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      await API.patch(`/api/responses/${responseId}`, {
        responseStatus: newStatus,
      })

      setSuccessMessage(
        `Donor response status updated to ${newStatus}`
      )

      const respRes = await API.get(
        `/api/requests/${id}/responses`
      )

      setResponses(respRes.data || [])

      const timelineRes = await API.get(
        `/api/requests/${id}/timeline`
      )

      setTimeline(timelineRes.data || [])
    } catch (err) {
      if (err.response) {
        setErrorMessage(
          err.response.data.message ||
          'Failed to update response status.'
        )
      } else {
        setErrorMessage(
          'Unable to connect to backend server.'
        )
      }
    } finally {
      setUpdating(false)
    }
  }

  const formatBloodGroup = (bloodGroup) => {
    if (!bloodGroup) return '—'

    return bloodGroup
      .replace('_POSITIVE', '+')
      .replace('_NEGATIVE', '-')
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

  const formatStatus = (status) => {
    if (!status) return 'Unknown'

    return status
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
  }

  const formatDate = (date) => {
    if (!date) return 'Not specified'
    return new Date(date).toLocaleString()
  }

  if (loading) {
    return (
      <div className="request-details-page">
        <div className="details-loading">
          <div className="loading-spinner"></div>
          <p>Loading request details...</p>
        </div>
      </div>
    )
  }

  if (errorMessage && !request) {
    return (
      <div className="request-details-page">
        <div className="details-error-state">
          <div className="error-icon">!</div>
          <h2>Unable to load request</h2>
          <p>{errorMessage}</p>

          <button
            onClick={() => navigate(-1)}
            className="back-request-btn"
          >
            ← Go back
          </button>
        </div>
      </div>
    )
  }

  const isOwner = user?.id === request?.requesterId
  const canAccessAi =
    isOwner || user?.role === 'ADMIN'

  const urgency =
    request.urgency?.toLowerCase() || 'medium'

  return (
    <div className="request-details-page">
      <div className="details-shell">

        <button
          onClick={() => navigate(-1)}
          className="details-back-link"
        >
          <span>←</span>
          Back
        </button>

        <div className="details-header">
          <div>
            <div className="details-eyebrow">
              <span className="details-dot"></span>
              BLOOD REQUEST
            </div>

            <div className="request-title-row">
              <div className="request-number">
                #{request.id}
              </div>

              <div>
                <h1>Blood request details</h1>
                <p>
                  Review the request information,
                  activity, and donor participation.
                </p>
              </div>
            </div>
          </div>

          <div className="header-status">
            <span
              className={`details-urgency urgency-${urgency}`}
            >
              {request.urgency || 'MEDIUM'}
            </span>

            <StatusBadge status={request.status} />
          </div>
        </div>

        {successMessage && (
          <div className="details-alert success">
            <span className="alert-symbol">✓</span>
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="details-alert error">
            <span className="alert-symbol">!</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="details-layout">

          <main className="details-main">

            <section className="request-overview-card">
              <div className="overview-heading">
                <div>
                  <span className="section-kicker">
                    REQUEST OVERVIEW
                  </span>
                  <h2>Blood needed</h2>
                </div>

                <div className="blood-group-large">
                  {formatBloodGroup(
                    request.bloodGroup
                  )}
                </div>
              </div>

              <div className="overview-grid">

                <div className="overview-item featured">
                  <span>Blood group</span>
                  <strong>
                    {formatBloodGroup(
                      request.bloodGroup
                    )}
                  </strong>
                </div>

                <div className="overview-item">
                  <span>Component</span>
                  <strong>
                    {formatComponent(
                      request.bloodComponent
                    )}
                  </strong>
                </div>

                <div className="overview-item">
                  <span>Units required</span>
                  <strong>
                    {request.unitsRequired}
                  </strong>
                </div>

                <div className="overview-item">
                  <span>Urgency</span>
                  <strong
                    className={`urgency-value urgency-${urgency}`}
                  >
                    {request.urgency}
                  </strong>
                </div>

              </div>
            </section>

            <section className="hospital-card">
              <div className="section-heading">
                <div className="section-icon">
                  +
                </div>

                <div>
                  <span className="section-kicker">
                    DONATION LOCATION
                  </span>
                  <h2>Where help is needed</h2>
                </div>
              </div>

              <div className="hospital-content">
                <div>
                  <span>Hospital</span>
                  <strong>
                    {request.hospitalName}
                  </strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>
                    {request.hospitalLocation}
                  </strong>
                </div>

                <div>
                  <span>Required by</span>
                  <strong>
                    {formatDate(
                      request.requiredBy
                    )}
                  </strong>
                </div>

                <div>
                  <span>Requester</span>
                  <strong>
                    {request.requesterName}
                  </strong>
                </div>
              </div>
            </section>

            <section className="description-card">
              <span className="section-kicker">
                REQUEST MESSAGE
              </span>

              <h2>About this request</h2>

              <p>
                {request.description ||
                  'No additional description was provided.'}
              </p>
            </section>

            {canAccessAi && (
              <section className="ai-tools-card">
                <div className="ai-heading">
                  <div className="ai-icon">
                    ✦
                  </div>

                  <div>
                    <span className="section-kicker">
                      INTELLIGENT ASSISTANCE
                    </span>

                    <h2>AI request tools</h2>

                    <p>
                      Use DonorConnect intelligence to
                      summarize this request or identify
                      possible duplicate requests.
                    </p>
                  </div>
                </div>

                <div className="ai-actions">
                  <button
                    onClick={handleGenerateSummary}
                    disabled={aiSummaryLoading}
                    className="ai-primary-btn"
                  >
                    <span>✦</span>
                    {aiSummaryLoading
                      ? 'Generating...'
                      : 'Generate AI summary'}
                  </button>

                  <button
                    onClick={handleDuplicateCheck}
                    disabled={duplicateLoading}
                    className="ai-secondary-btn"
                  >
                    <span>⌕</span>
                    {duplicateLoading
                      ? 'Checking...'
                      : 'Check for duplicates'}
                  </button>
                </div>

                {aiSummaryError && (
                  <div className="ai-inline-error">
                    <span>{aiSummaryError}</span>

                    <button
                      onClick={handleGenerateSummary}
                    >
                      Retry
                    </button>
                  </div>
                )}

                {aiSummaryObj && (
                  <div className="ai-result-card summary-result">
                    <div className="result-top">
                      <div>
                        <span className="result-label">
                          {aiSummaryObj.source === 'AI'
                            ? 'AI-GENERATED SUMMARY'
                            : 'FALLBACK SUMMARY'}
                        </span>

                        <h3>
                          {aiSummaryObj.source === 'AI'
                            ? 'Request summary'
                            : 'Request summary — AI unavailable'}
                        </h3>
                      </div>

                      <span className="result-source">
                        {aiSummaryObj.source === 'AI'
                          ? 'AI'
                          : 'FALLBACK'}
                      </span>
                    </div>

                    <p>
                      {aiSummaryObj.summary}
                    </p>
                  </div>
                )}

                {duplicateError && (
                  <div className="ai-inline-error">
                    <span>{duplicateError}</span>

                    <button
                      onClick={handleDuplicateCheck}
                    >
                      Retry
                    </button>
                  </div>
                )}

                {duplicateCheck && (
                  <div className="ai-result-card duplicate-result">
                    <div className="result-top">
                      <div>
                        <span className="result-label">
                          DUPLICATE ANALYSIS
                        </span>

                        <h3>
                          {duplicateCheck.source ===
                            'AI'
                            ? 'AI-assisted duplicate check'
                            : 'Fallback duplicate check'}
                        </h3>
                      </div>

                      <span className="result-source">
                        {duplicateCheck.source === 'AI'
                          ? 'AI'
                          : 'FALLBACK'}
                      </span>
                    </div>

                    <div className="duplicate-grid">
                      <div>
                        <span>
                          Possible duplicate
                        </span>

                        <strong>
                          {duplicateCheck.possibleDuplicate
                            ? 'Yes'
                            : 'No'}
                        </strong>
                      </div>

                      <div>
                        <span>Confidence</span>

                        <strong>
                          {(
                            duplicateCheck.confidence *
                            100
                          ).toFixed(0)}
                          %
                        </strong>
                      </div>

                      {duplicateCheck.relatedRequestIds &&
                        duplicateCheck.relatedRequestIds
                          .length > 0 && (
                          <div>
                            <span>
                              Related request IDs
                            </span>

                            <strong>
                              {duplicateCheck.relatedRequestIds.join(
                                ', '
                              )}
                            </strong>
                          </div>
                        )}
                    </div>

                    <div className="duplicate-explanation">
                      <span>Explanation</span>

                      <p>
                        {duplicateCheck.explanation}
                      </p>
                    </div>

                    <small>
                      Advisory only — does not automatically
                      reject or close requests.
                    </small>
                  </div>
                )}
              </section>
            )}

            {isOwner && (
              <section className="donor-responses-card">
                <div className="section-heading response-section-heading">
                  <div className="section-icon">
                    ♥
                  </div>

                  <div>
                    <span className="section-kicker">
                      DONOR PARTICIPATION
                    </span>

                    <h2>
                      Donor responses
                      <span className="section-count">
                        {responses.length}
                      </span>
                    </h2>
                  </div>
                </div>

                {responses.length === 0 ? (
                  <div className="no-responses-state">
                    <div>♥</div>
                    <p>
                      No donor responses have been
                      received yet.
                    </p>
                  </div>
                ) : (
                  <div className="requester-responses-list">
                    {responses.map((resp) => (
                      <article
                        key={resp.id}
                        className="requester-response"
                      >
                        <div className="response-person">
                          <div className="person-avatar">
                            {resp.donorName
                              ?.charAt(0)
                              ?.toUpperCase() || 'D'}
                          </div>

                          <div>
                            <strong>
                              {resp.donorName}
                            </strong>

                            <span>
                              Submitted{' '}
                              {formatDate(
                                resp.createdAt
                              )}
                            </span>
                          </div>
                        </div>

                        <ResponseStatusBadge
                          status={
                            resp.responseStatus
                          }
                        />

                        {resp.message && (
                          <p className="donor-message">
                            “{resp.message}”
                          </p>
                        )}

                        <div className="response-management">
                          {resp.responseStatus ===
                            'INTERESTED' && (
                              <button
                                onClick={() =>
                                  handleResponseStatusUpdate(
                                    resp.id,
                                    'CONTACTED'
                                  )
                                }
                                disabled={updating}
                                className="response-action contact"
                              >
                                Mark contacted
                              </button>
                            )}

                          {resp.responseStatus ===
                            'CONTACTED' && (
                              <button
                                onClick={() =>
                                  handleResponseStatusUpdate(
                                    resp.id,
                                    'CONFIRMED_BY_REQUESTER'
                                  )
                                }
                                disabled={updating}
                                className="response-action confirm"
                              >
                                Confirm donor
                              </button>
                            )}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            <section className="timeline-card">
              <div className="section-heading">
                <div className="section-icon">
                  ↗
                </div>

                <div>
                  <span className="section-kicker">
                    ACTIVITY
                  </span>

                  <h2>Request timeline</h2>
                </div>
              </div>

              {timeline.length === 0 ? (
                <div className="no-timeline">
                  No timeline events recorded.
                </div>
              ) : (
                <div className="timeline-list">
                  {timeline.map((evt) => (
                    <div
                      key={evt.id}
                      className="timeline-item"
                    >
                      <div className="timeline-marker">
                        <span></span>
                      </div>

                      <div className="timeline-content">
                        <div className="timeline-event">
                          {formatStatus(
                            evt.eventType
                          )}
                        </div>

                        <p>
                          {evt.description}
                        </p>

                        <span>
                          By {evt.actorName} ·{' '}
                          {formatDate(
                            evt.createdAt
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

          </main>

          <aside className="details-sidebar">

            <div className="status-card">
              <span className="section-kicker">
                CURRENT STATUS
              </span>

              <div className="status-card-main">
                <StatusBadge
                  status={request.status}
                />

                <p>
                  {request.status === 'OPEN'
                    ? 'This request is currently open for donor participation.'
                    : request.status ===
                      'PARTIALLY_RESPONDED'
                      ? 'Donors have already responded to this request.'
                      : request.status === 'FULFILLED'
                        ? 'This blood request has been fulfilled.'
                        : request.status === 'CANCELLED'
                          ? 'This request has been cancelled.'
                          : request.status === 'CLOSED'
                            ? 'This request is closed.'
                            : 'This request is awaiting further action.'}
                </p>
              </div>
            </div>

            {isOwner &&
              request.status !== 'CANCELLED' &&
              request.status !== 'CLOSED' && (
                <div className="manage-card">
                  <span className="section-kicker">
                    REQUEST MANAGEMENT
                  </span>

                  <h2>Manage this request</h2>

                  <p>
                    Update the request status as the
                    donation process progresses.
                  </p>

                  <div className="manage-actions">
                    {request.status ===
                      'PENDING_REVIEW' && (
                        <button
                          onClick={() =>
                            handleStatusChange('OPEN')
                          }
                          disabled={updating}
                          className="manage-btn open"
                        >
                          {updating
                            ? 'Updating...'
                            : 'Approve & open request'}
                        </button>
                      )}

                    {request.status === 'OPEN' && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(
                              'PARTIALLY_RESPONDED'
                            )
                          }
                          disabled={updating}
                          className="manage-btn partial"
                        >
                          Mark partially responded
                        </button>

                        <button
                          onClick={() =>
                            handleStatusChange(
                              'FULFILLED'
                            )
                          }
                          disabled={updating}
                          className="manage-btn fulfilled"
                        >
                          Mark fulfilled
                        </button>
                      </>
                    )}

                    {request.status ===
                      'PARTIALLY_RESPONDED' && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              'FULFILLED'
                            )
                          }
                          disabled={updating}
                          className="manage-btn fulfilled"
                        >
                          Mark fulfilled
                        </button>
                      )}

                    <button
                      onClick={() =>
                        handleStatusChange(
                          'CANCELLED'
                        )
                      }
                      disabled={updating}
                      className="manage-btn cancel"
                    >
                      Cancel request
                    </button>
                  </div>
                </div>
              )}

            {isOwner &&
              user?.role === 'REQUESTER' && (
                <button
                  onClick={() =>
                    navigate(
                      `/requests/${id}/matches`
                    )
                  }
                  className="matches-card-btn"
                >
                  <span className="matches-icon">
                    ♥
                  </span>

                  <span>
                    <strong>
                      View potential matches
                    </strong>

                    <small>
                      See donors who may match this
                      request
                    </small>
                  </span>

                  <span className="matches-arrow">
                    →
                  </span>
                </button>
              )}

          </aside>
        </div>
      </div>
    </div>
  )
}

export default RequestDetails