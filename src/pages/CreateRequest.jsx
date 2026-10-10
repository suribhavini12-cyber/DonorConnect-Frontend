import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api/axios'
import './CreateRequest.css'

const BLOOD_GROUPS = [
  { label: 'A+', value: 'A_POSITIVE' },
  { label: 'A-', value: 'A_NEGATIVE' },
  { label: 'B+', value: 'B_POSITIVE' },
  { label: 'B-', value: 'B_NEGATIVE' },
  { label: 'AB+', value: 'AB_POSITIVE' },
  { label: 'AB-', value: 'AB_NEGATIVE' },
  { label: 'O+', value: 'O_POSITIVE' },
  { label: 'O-', value: 'O_NEGATIVE' },
]

const URGENCY_LEVELS = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
  { label: 'Critical', value: 'CRITICAL' },
]

function CreateRequest() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const [formData, setFormData] = useState({
    bloodGroup: 'O_POSITIVE',
    bloodComponent: 'Whole Blood',
    unitsRequired: 1,
    hospitalName: '',
    hospitalLocation: '',
    urgency: 'HIGH',
    requiredBy: '',
    description: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    setFieldErrors({})

    let formattedRequiredBy = formData.requiredBy
    if (formattedRequiredBy && formattedRequiredBy.length === 16) {
      formattedRequiredBy += ':00'
    }

    const payload = {
      ...formData,
      unitsRequired: parseInt(formData.unitsRequired, 10),
      requiredBy: formattedRequiredBy,
    }

    try {
      const response = await API.post('/api/requests', payload)
      if (response.data) {
        navigate('/requests')
      }
    } catch (err) {
      if (err.response) {
        const data = err.response.data
        if (data.details) {
          setFieldErrors(data.details)
        } else if (data.message) {
          setErrorMessage(data.message)
        } else {
          setErrorMessage('Failed to create blood request.')
        }
      } else {
        setErrorMessage('Unable to connect to backend server.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="request-form-card">
      <h2>Create Blood Request</h2>
      <p className="subtitle">Submit details to request urgent blood assistance</p>

      {errorMessage && <div className="alert alert-error">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="request-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="bloodGroup">Blood Group</label>
            <select
              id="bloodGroup"
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg.value} value={bg.value}>
                  {bg.label}
                </option>
              ))}
            </select>
            {fieldErrors.bloodGroup && (
              <span className="field-error">{fieldErrors.bloodGroup}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="bloodComponent">Blood Component</label>
            <input
              type="text"
              id="bloodComponent"
              name="bloodComponent"
              value={formData.bloodComponent}
              onChange={handleChange}
              placeholder="e.g. Whole Blood, Red Cells, Platelets"
              required
            />
            {fieldErrors.bloodComponent && (
              <span className="field-error">{fieldErrors.bloodComponent}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="unitsRequired">Units Required</label>
            <input
              type="number"
              id="unitsRequired"
              name="unitsRequired"
              min="1"
              max="100"
              value={formData.unitsRequired}
              onChange={handleChange}
              required
            />
            {fieldErrors.unitsRequired && (
              <span className="field-error">{fieldErrors.unitsRequired}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="urgency">Urgency</label>
            <select
              id="urgency"
              name="urgency"
              value={formData.urgency}
              onChange={handleChange}
              required
            >
              {URGENCY_LEVELS.map((u) => (
                <option key={u.value} value={u.value}>
                  {u.label}
                </option>
              ))}
            </select>
            {fieldErrors.urgency && (
              <span className="field-error">{fieldErrors.urgency}</span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="hospitalName">Hospital Name</label>
          <input
            type="text"
            id="hospitalName"
            name="hospitalName"
            value={formData.hospitalName}
            onChange={handleChange}
            placeholder="Apollo Hospital"
            required
          />
          {fieldErrors.hospitalName && (
            <span className="field-error">{fieldErrors.hospitalName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="hospitalLocation">Hospital Location</label>
          <input
            type="text"
            id="hospitalLocation"
            name="hospitalLocation"
            value={formData.hospitalLocation}
            onChange={handleChange}
            placeholder="Jubilee Hills, Hyderabad"
            required
          />
          {fieldErrors.hospitalLocation && (
            <span className="field-error">{fieldErrors.hospitalLocation}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="requiredBy">Required By Date & Time</label>
          <input
            type="datetime-local"
            id="requiredBy"
            name="requiredBy"
            value={formData.requiredBy}
            onChange={handleChange}
            required
          />
          {fieldErrors.requiredBy && (
            <span className="field-error">{fieldErrors.requiredBy}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide context about the request..."
            required
          ></textarea>
          {fieldErrors.description && (
            <span className="field-error">{fieldErrors.description}</span>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  )
}

export default CreateRequest
