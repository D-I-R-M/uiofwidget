const BASE = import.meta.env.VITE_API_URL || 'https://fastapi-tv77.onrender.com'

async function request(path, options) {
  const opts = options || {}
  const res = await fetch(BASE + path, {
    headers: Object.assign({ 'Content-Type': 'application/json' }, opts.headers || {}),
    method: opts.method || 'GET',
    body: opts.body || undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(function() { return { detail: res.statusText } })
    throw new Error(err.detail || 'HTTP ' + res.status)
  }
  return res.json()
}

export const api = {
  listEntries: function(params) {
    const p = params || {}
    const q = new URLSearchParams(p).toString()
    return request('/entries' + (q ? '?' + q : ''))
  },

  getEntry: function(uid) {
    return request('/entries/' + uid)
  },

  searchEntries: function(body) {
    return request('/entries/search', { method: 'POST', body: JSON.stringify(body) })
  },

  saveEntry: function(entry) {
    return request('/entries', { method: 'POST', body: JSON.stringify(entry) })
  },

  deleteEntry: function(uid) {
    return request('/entries/' + uid, { method: 'DELETE' })
  },

  reflect: function(uids, promptHint) {
    return request('/reflect', {
      method: 'POST',
      body: JSON.stringify({ uids: uids, prompt_hint: promptHint || '' }),
    })
  },

  insights: function(filters) {
    return request('/insights', { method: 'POST', body: JSON.stringify(filters || {}) })
  },
}