import './StatusBadge.css'

const STATUS_CONFIG = {
  PENDING_REVIEW: { label: 'Pending Review', className: 'status-pending' },
  OPEN: { label: 'Open', className: 'status-open' },
  PARTIALLY_RESPONDED: { label: 'Partially Responded', className: 'status-partial' },
  FULFILLED: { label: 'Fulfilled', className: 'status-fulfilled' },
  CLOSED: { label: 'Closed', className: 'status-closed' },
  CANCELLED: { label: 'Cancelled', className: 'status-cancelled' },
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    className: 'status-default',
  }

  return <span className={`status-badge ${config.className}`}>{config.label}</span>
}

export default StatusBadge
