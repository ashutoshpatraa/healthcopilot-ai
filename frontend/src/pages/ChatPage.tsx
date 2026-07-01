import { FormEvent, useState } from 'react'

import { sendChat } from '../services/api'

export function ChatPage() {
  const [message, setMessage] = useState('I have a persistent headache and nausea.')
  const [reply, setReply] = useState('Ask the assistant about symptoms, care paths, or report summaries.')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const response = await sendChat(message)
    setReply(response.reply)
  }

  return (
    <section className="panel">
      <span className="eyebrow">Conversational assistant</span>
      <h2>Medical guidance in natural language</h2>
      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Message
          <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} />
        </label>
        <button className="primary-button" type="submit">Send</button>
      </form>
      <div className="result-card">
        <p>{reply}</p>
      </div>
    </section>
  )
}
