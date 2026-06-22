import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Redirect to login on 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  register:      (d) => api.post('/auth/register', d),
  login:         (d) => api.post('/auth/login', d),
  getProfile:    ()  => api.get('/auth/profile'),
  updateProfile: (d) => api.put('/auth/profile', d),
}

// ─── Resume ──────────────────────────────────────────────────────────────────
export const resumeApi = {
  upload: (file) => {
    const fd = new FormData()
    fd.append('file', file)
    return api.post('/resume/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
  },
  list:   ()   => api.get('/resume/list'),
  get:    (id) => api.get(`/resume/${id}`),
  delete: (id) => api.delete(`/resume/${id}`),
}

// ─── ATS ─────────────────────────────────────────────────────────────────────
export const atsApi = {
  analyze: (d) => api.post('/ats/analyze', d),
  history: ()  => api.get('/ats/history'),
}

// ─── Tracker ─────────────────────────────────────────────────────────────────
export const trackerApi = {
  list:   ()       => api.get('/applications'),
  create: (d)      => api.post('/applications', d),
  update: (id, d)  => api.put(`/applications/${id}`, d),
  remove: (id)     => api.delete(`/applications/${id}`),
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export const analyticsApi = {
  get: () => api.get('/analytics'),
}

export default api
