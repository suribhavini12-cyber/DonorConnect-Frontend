import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import API from '../api/axios'
import './AdminUsers.css'

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    setErrorMessage(null)
    try {
      const response = await API.get('/api/admin/users')
      setUsers(response.data || [])
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data.message || 'Failed to load users list.')
      } else {
        setErrorMessage('Unable to connect to backend server.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async (user) => {
    const actionText = user.active ? 'deactivate' : 'activate'
    if (!window.confirm(`Are you sure you want to ${actionText} user "${user.name}" (${user.email})?`)) {
      return
    }

    setUpdatingId(user.id)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const newActive = !user.active
      const response = await API.patch(`/api/admin/users/${user.id}/status`, {
        active: newActive,
      })
      setSuccessMessage(`User "${user.name}" has been ${newActive ? 'activated' : 'deactivated'}.`)
      setUsers(users.map((u) => (u.id === user.id ? response.data : u)))
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data.message || `Failed to ${actionText} user.`)
      } else {
        setErrorMessage('Unable to connect to backend server.')
      }
    } finally {
      setUpdatingId(null)
    }
  }

  if (loading) {
    return <div className="loading-container">Loading Users List...</div>
  }

  return (
    <div className="admin-page-card">
      <div className="header-row">
        <h2>User Management</h2>
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
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Active</th>
              <th>Created At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>#{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <span className={`role-badge role-${u.role?.toLowerCase()}`}>{u.role}</span>
                </td>
                <td>
                  <span className={`status-pill ${u.active ? 'pill-active' : 'pill-inactive'}`}>
                    {u.active ? 'ACTIVE' : 'DEACTIVATED'}
                  </span>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleToggleStatus(u)}
                    disabled={updatingId === u.id}
                    className={`btn-action ${u.active ? 'btn-deactivate' : 'btn-activate'}`}
                  >
                    {updatingId === u.id
                      ? 'Updating...'
                      : u.active
                      ? 'Deactivate'
                      : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUsers
