import './ResponseStatusBadge.css'

function ResponseStatusBadge({ status }) {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'INTERESTED':
        return 'badge-interested'
      case 'CONTACTED':
        return 'badge-contacted'
      case 'CONFIRMED_BY_REQUESTER':
        return 'badge-confirmed'
      case 'WITHDRAWN':
        return 'badge-withdrawn'
      default:
        return 'badge-default'
    }
  }

  const getFormatText = (status) => {
    switch (status) {
      case 'CONFIRMED_BY_REQUESTER':
        return 'CONFIRMED'
      default:
        return status
    }
  }

  return (
    <span className={`response-status-badge ${getBadgeClass(status)}`}>
      {getFormatText(status)}
    </span>
  )
}

export default ResponseStatusBadge
