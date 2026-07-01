import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000',
})

export async function fetchDashboard() {
  const response = await client.get('/api/dashboard')
  return response.data
}

export async function sendSymptoms(symptoms: string[]) {
  const response = await client.post('/api/predict', { symptoms })
  return response.data
}

export async function sendChat(message: string) {
  const response = await client.post('/api/chat', { message })
  return response.data
}
