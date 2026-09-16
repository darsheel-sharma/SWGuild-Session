/**
 * All backend communication goes through this file.
 * Components never call fetch() directly.
 */

const BASE_URL = '/api'

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let errorMessage = `Request failed (${response.status})`
    try {
      const errorData = await response.json()
      if (typeof errorData.detail === 'string') {
        errorMessage = errorData.detail
      } else if (errorData.detail && typeof errorData.detail === 'object') {
        errorMessage = JSON.stringify(errorData.detail)
      } else if (errorData.message) {
        errorMessage = errorData.message
      }
    } catch {
      // JSON parse failed; use the status message
    }
    throw new Error(errorMessage)
  }

  return response.json()
}

export const api = {
  /**
   * POST /api/council/start
   * Convene the council on a question.
   *
   * @param {string} question
   * @returns {Promise<CouncilResponse>}
   */
  startCouncil(question) {
    return request('/council/start', {
      method: 'POST',
      body: JSON.stringify({ question }),
    })
  },

  /**
   * GET /api/agents
   * Fetch agent metadata.
   */
  getAgents() {
    return request('/agents/')
  },

  /**
   * GET /api/health
   */
  health() {
    return request('/health')
  },
}
