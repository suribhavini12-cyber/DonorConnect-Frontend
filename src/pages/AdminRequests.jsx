import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import './AdminRequests.css'

function AdminRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const response = await API.get('/api/admin/requests')
      setRequests(response.data || [])
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data.message || 'Failed to load blood requests.')
      } else {
        setErrorMessage('Unable to connect to backend server.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (reqId, newStatus) => {
    if (!window.confirm(`Update request #${reqId} status to "${newStatus}"?`)) {
      return
    }

    setUpdatingId(reqId)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await API.patch(`/api/admin/requests/${reqId}/status`, {
        status: newStatus,
      })
      setSuccessMessage(`Request #${reqId} status updated to ${newStatus}.`)
      setRequests(requests.map((r) => (r.id === reqId ? response.data : r)))
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data.message || 'Failed to update request status.')
      } else {
        setErrorMessage('Unable to connect to backend server.')
      }
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return <div className="loading-container">Loading Blood Requests...</div>
  }

  return (
    <div className="admin-page-card">
      <div className="header-row">
        <h2>Request Moderation</h2>
        <Link to="/admin" className="back-link">
          &larr; Back to Admin Dashboard
        </Link>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Requester</th>
              <th>Group</th>
              <th>Units</th>
              <th>Hospital & Location</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Required By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.id}>
                <td>#{req.id}</td>
                <td>{req.requesterName}</td>
                <td>
                  <span className="blood-tag-sm">
                    {req.bloodGroup?.replace('_POSITIVE', '+').replace('_NEGATIVE', '-')}
                  </span>
                </td>
                <td>{req.unitsRequired}</td>
                <td>
                  {req.hospitalName} ({req.hospitalLocation})
                </td>
                <td>
                  <span className={`urgency-text urgency-${req.urgency?.toLowerCase()}`}>
                    {req.urgency}
                  </span>
                </td>
                <td>
                  <StatusBadge status={req.status} />
                </td>
                <td>{req.requiredBy ? new Date(req.requiredBy).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <select
                    value={req.status}
                    onChange={(e) => handleStatusChange(req.id, e.target.value)}
                    disabled={updatingId === req.id}
                    className="admin-status-select"
                  >
                    <option value="PENDING_REVIEW">PENDING_REVIEW</option>
                    <option value="OPEN">OPEN</option>
                    <option value="PARTIALLY_RESPONDED">PARTIALLY_RESPONDED</option>
                    <option value="FULFILLED">FULFILLED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="CLOSED">CLOSED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminRequests
