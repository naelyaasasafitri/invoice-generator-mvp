// Simplified Nitro route handlers for demonstration
// In production, these would connect to a real database

export default defineEventHandler(async (event) => {
  const method = event.method
  const url = event.node.req.url || ''
  
  // Health check
  if (url === '/health') {
    return { status: 'ok' }
  }

  return {
    message: 'Invoice Generator MVP API',
    version: '1.0.0',
    note: 'This is a demo API. In production, connect to a real database.'
  }
})
