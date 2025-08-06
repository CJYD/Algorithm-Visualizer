import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Get algorithm name from dynamic route
  const { name: algorithmName } = req.query

  if (!algorithmName || typeof algorithmName !== 'string') {
    return res.status(400).json({ error: 'Algorithm name is required' })
  }

  try {
    // In development, call local Python server
    // In production, you'll need to set PYTHON_BACKEND_URL environment variable
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://127.0.0.1:8000'
      : process.env.PYTHON_BACKEND_URL

    if (!backendUrl) {
      throw new Error('Backend URL not configured')
    }

    console.log(`Proxying to: ${backendUrl}/api/algorithm/${algorithmName}`)

    const response = await fetch(`${backendUrl}/api/algorithm/${algorithmName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body || {})
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Backend error (${response.status}): ${errorText}`)
    }

    const data = await response.json()
    
    // Forward the response from Python backend
    res.status(200).json(data)

  } catch (error) {
    console.error('API Proxy Error:', error)
    
    // Return helpful error message
    res.status(500).json({ 
      error: 'Failed to process algorithm request',
      details: error instanceof Error ? error.message : 'Unknown error',
      algorithm: algorithmName
    })
  }
}