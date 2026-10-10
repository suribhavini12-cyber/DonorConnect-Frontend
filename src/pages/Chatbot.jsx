import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import './Chatbot.css'

function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello! I am the DonorConnect AI Assistant. Ask me general questions about blood donation, preparation, the donation process, and recovery.',
      sources: [
        {
          title: 'General Blood Donation Process',
          source: 'DonorConnect Knowledge Base'
        }
      ],
      sourceType: 'AI'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  const handleSend = async (e) => {
    if (e) e.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput || loading) return

    if (trimmedInput.length > 1000) {
      setError('Message must not exceed 1000 characters.')
      return
    }

    setError(null)
    const userMsg = { role: 'user', text: trimmedInput }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await api.post('/api/ai/chat', { message: trimmedInput })
      const data = response.data

      const assistantMsg = {
        role: 'assistant',
        text: data.answer || 'No response generated.',
        sources: data.sources || [],
        sourceType: data.sourceType || 'FALLBACK'
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
      console.error('Failed to send chat message:', err)
      const errDetail = err.response?.data?.message || 'Failed to connect to AI Assistant service. Please try again.'
      setError(errDetail)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    if (messages.length > 0 && messages[messages.length - 1].role === 'user') {
      const lastUserMsg = messages[messages.length - 1].text
      setInput(lastUserMsg)
      setMessages((prev) => prev.slice(0, -1))
      setError(null)
    } else {
      setError(null)
    }
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>🩸 Blood Donation Information Assistant</h2>
          <Link to="/home" style={{ color: '#1d3557', textDecoration: 'none', fontWeight: 600 }}>
            &larr; Back to Dashboard
          </Link>
        </div>
        <p className="chatbot-subtitle">
          Grounded RAG Assistant for general blood donation guidance and procedures.
        </p>
      </div>

      {error && (
        <div className="chat-error">
          <span>{error}</span>
          <button onClick={handleRetry} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-message ${msg.role}`}>
            <div className="message-header">
              <span className="sender-name">
                {msg.role === 'user' ? 'You' : 'DonorConnect Assistant'}
              </span>
              {msg.role === 'assistant' && msg.sourceType && (
                <span className={`source-badge ${msg.sourceType.toLowerCase()}`}>
                  {msg.sourceType === 'AI' ? 'AI-generated answer' : 'Fallback / AI unavailable'}
                </span>
              )}
            </div>
            <div className="message-text">{msg.text}</div>

            {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
              <div className="sources-container">
                <div className="sources-title">Sources & References:</div>
                <ul className="sources-list">
                  {msg.sources.map((s, sIdx) => (
                    <li key={sIdx}>
                      <strong>{s.title}</strong> — {s.source}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="chat-loading">
            DonorConnect Assistant is searching knowledge base & generating answer...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Ask a question (e.g. What should I do before donating blood?)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1000}
          disabled={loading}
        />
        <button type="submit" className="send-btn" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>

      <div className="chat-disclaimer">
        Informational advisory only. Does not provide medical diagnosis, individual eligibility determinations, or replace healthcare professionals.
      </div>
    </div>
  )
}

export default Chatbot
