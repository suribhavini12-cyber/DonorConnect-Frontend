import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import './AdminDashboard.css'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const response = await API.get('/api/admin/dashboard')
      setStats(response.data)
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data.message || 'Failed to load admin statistics.')
      } else {
        setErrorMessage('Unable to connect to backend server.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading-container">Loading Admin Dashboard...</div>
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header-row">
        <h2>Admin Moderation Dashboard</h2>
        <div className="admin-nav-links">
          <Link to="/admin/users" className="admin-nav-btn">
            Manage Users
          </Link>
          <Link to="/admin/requests" className="admin-nav-btn">
            Manage Requests
          </Link>
          <Link to="/admin/reports" className="admin-nav-btn warning-badge">
            Moderation Reports
          </Link>
        </div>
      </div>

      {errorMessage && (
        <div className="error-container">
          <div className="alert alert-error">{errorMessage}</div>
          <button onClick={fetchStats} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>User Statistics</h3>
            <div className="stat-row">
              <label>Total Users:</label> <span>{stats.totalUsers}</span>
            </div>
            <div className="stat-row">
              <label>Active Users:</label> <span className="highlight-green">{stats.activeUsers}</span>
            </div>
            <div className="stat-row">
              <label>Donors:</label> <span>{stats.donorCount}</span>
            </div>
            <div className="stat-row">
              <label>Requesters:</label> <span>{stats.requesterCount}</span>
            </div>
            <div className="stat-row">
              <label>Admins:</label> <span>{stats.adminCount}</span>
            </div>
          </div>

          <div className="stat-card">
            <h3>Blood Request Statistics</h3>
            <div className="stat-row">
              <label>Total Requests:</label> <span>{stats.totalRequests}</span>
            </div>
            <div className="stat-row">
              <label>Open Requests:</label> <span className="highlight-blue">{stats.openRequests}</span>
            </div>
            <div className="stat-row">
              <label>Fulfilled Requests:</label> <span className="highlight-green">{stats.fulfilledRequests}</span>
            </div>
            <div className="stat-row">
              <label>Cancelled Requests:</label> <span className="highlight-red">{stats.cancelledRequests}</span>
            </div>
          </div>

          <div className="stat-card">
            <h3>Moderation Reports</h3>
            <div className="stat-row">
              <label>Total Reports:</label> <span>{stats.totalReports}</span>
            </div>
            <div className="stat-row">
              <label>Open Reports:</label> <span className="highlight-orange">{stats.openReports}</span>
            </div>
            <div className="stat-row">
              <label>Resolved Reports:</label> <span className="highlight-green">{stats.resolvedReports}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
