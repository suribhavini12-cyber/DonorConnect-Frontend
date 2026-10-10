import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import './AdminReports.css'

function AdminReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const response = await API.get('/api/admin/reports')
      setReports(response.data || [])
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data.message || 'Failed to load reports.')
      } else {
        setErrorMessage('Unable to connect to backend server.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (reportId, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark report #${reportId} as ${newStatus}?`)) {
      return
    }

    setUpdatingId(reportId)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await API.patch(`/api/admin/reports/${reportId}`, {
        status: newStatus,
      })
      setSuccessMessage(`Report #${reportId} status updated to ${newStatus}.`)
      setReports(reports.map((r) => (r.id === reportId ? response.data : r)))
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data.message || 'Failed to update report status.')
      } else {
        setErrorMessage('Unable to connect to backend server.')
      }
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return <div className="loading-container">Loading Reports...</div>
  }

  return (
    <div className="admin-page-card">
      <div className="header-row">
        <h2>Moderation Reports</h2>
        <Link to="/admin" className="back-link">
          &larr; Back to Admin Dashboard
        </Link>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

      {reports.length === 0 ? (
        <div className="no-data-box">
          <p>No moderation reports filed yet.</p>
        </div>
      ) : (
        <div className="reports-list">
          {reports.map((report) => (
            <div key={report.id} className="report-card-item">
              <div className="report-card-header">
                <div>
                  <span className="report-id">Report #{report.id}</span>
                  <span className={`report-status-badge status-${report.status?.toLowerCase()}`}>
                    {report.status}
                  </span>
                </div>
                <span className="report-date">
                  Filed: {new Date(report.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="report-details-grid">
                <p>
                  <strong>Reporter:</strong> {report.reporterName || 'Anonymous'} (ID: {report.reporterId})
                </p>
                {report.targetUserName && (
                  <p>
                    <strong>Target User:</strong> {report.targetUserName} (ID: {report.targetUserId})
                  </p>
                )}
                {report.targetRequestId && (
                  <p>
                    <strong>Target Request:</strong> Request #{report.targetRequestId}
                  </p>
                )}
                <p>
                  <strong>Reason:</strong> {report.reason}
                </p>
              </div>

              <div className="report-desc-box">
                <strong>Description:</strong>
                <p>{report.description}</p>
              </div>

              {report.reviewedAt && (
                <div className="report-reviewed-meta">
                  Reviewed by <strong>{report.reviewedByName || 'Admin'}</strong> on{' '}
                  {new Date(report.reviewedAt).toLocaleString()}
                </div>
              )}

              <div className="report-actions-row">
                {report.status !== 'UNDER_REVIEW' && (
                  <button
                    onClick={() => handleUpdateStatus(report.id, 'UNDER_REVIEW')}
                    disabled={updatingId === report.id}
                    className="btn-mod btn-review"
                  >
                    Mark Under Review
                  </button>
                )}
                {report.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleUpdateStatus(report.id, 'RESOLVED')}
                    disabled={updatingId === report.id}
                    className="btn-mod btn-resolve"
                  >
                    Mark Resolved
                  </button>
                )}
                {report.status !== 'DISMISSED' && (
                  <button
                    onClick={() => handleUpdateStatus(report.id, 'DISMISSED')}
                    disabled={updatingId === report.id}
                    className="btn-mod btn-dismiss"
                  >
                    Dismiss Report
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminReports
