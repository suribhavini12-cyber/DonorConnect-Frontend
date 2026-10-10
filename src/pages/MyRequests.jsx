import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import StatusBadge from '../components/StatusBadge'
import './MyRequests.css'

function MyRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    fetchMyRequests()
  }, [])

  const fetchMyRequests = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const response = await API.get('/api/requests/my')
      setRequests(response.data || [])
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data.message || 'Failed to load requests.')
      } else {
        setErrorMessage('Unable to connect to backend server.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this blood request?')) {
      return
    }

    try {
      await API.delete(`/api/requests/${id}`)
      fetchMyRequests()
    } catch (err) {
      alert(
        err.response?.data?.message || 'Failed to cancel the blood request.'
      )
    }
  }

  if (loading) {
    return <div className="loading-container">Loading My Requests...</div>
  }

  return (
    <div className="my-requests-card">
      <div className="header-row">
        <h2>My Blood Requests</h2>
        <Link to="/requests/new" className="create-link-btn">
          + New Request
        </Link>
      </div>

      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

      {requests.length === 0 ? (
        <p className="no-data">You haven't created any blood requests yet.</p>
      ) : (
        <div className="request-table-wrapper">
          <table className="request-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Group</th>
                <th>Hospital</th>
                <th>Urgency</th>
                <th>Required By</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>#{req.id}</td>
                  <td>
                    <strong>{req.bloodGroup?.replace('_POSITIVE', '+').replace('_NEGATIVE', '-')}</strong>
                  </td>
                  <td>{req.hospitalName}</td>
                  <td>{req.urgency}</td>
                  <td>
                    {req.requiredBy
                      ? new Date(req.requiredBy).toLocaleString()
                      : 'N/A'}
                  </td>
                  <td>
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="actions-cell">
                    <Link to={`/requests/${req.id}`} className="view-btn">
                      View
                    </Link>
                    {req.status !== 'CANCELLED' &&
                      req.status !== 'CLOSED' &&
                      req.status !== 'FULFILLED' && (
                        <button
                          onClick={() => handleCancel(req.id)}
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MyRequests
