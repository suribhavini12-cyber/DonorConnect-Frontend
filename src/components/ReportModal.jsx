import { useState } from 'react'
import API from '../api/axios'
import './ReportModal.css'

function ReportModal({ targetUserId, targetRequestId, onClose, onSuccess }) {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!reason.trim() || !description.trim()) {
      setErrorMessage('Reason and description are required.')
      return
    }

    setSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      await API.post('/api/reports', {
        targetUserId: targetUserId || null,
        targetRequestId: targetRequestId || null,
        reason: reason.trim(),
        description: description.trim(),
      })
      setSuccessMessage('Report submitted successfully.')
      setTimeout(() => {
        if (onSuccess) onSuccess()
        if (onClose) onClose()
      }, 1500)
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data.message || 'Failed to submit report.')
      } else {
        setErrorMessage('Unable to connect to backend server.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Submit Report</h3>
          <button className="close-btn" onClick={onClose} disabled={submitting}>
            &times;
          </button>
        </div>

        {successMessage && <div className="alert alert-success">{successMessage}</div>}
        {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Reason for Report:</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Inappropriate behavior, Misleading information"
              required
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label>Detailed Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide specific details about the issue..."
              rows={4}
              required
              disabled={submitting}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="submit-report-btn" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReportModal
