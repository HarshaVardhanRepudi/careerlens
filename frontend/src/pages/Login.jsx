import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Telescope } from 'lucide-react'
import { authApi } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { Input, Button, Alert } from '../components/ui/index'
import { validate, validators } from '../utils/validators'

export default function Login() {
  const { login }    = useAuth()
  const navigate     = useNavigate()
  const [form, set]  = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiErr, setApiErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    set(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate({ email: validators.email, password: validators.required }, form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true); setApiErr('')
    try {
      const res = await authApi.login(form)
      login(res.data.access_token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setApiErr(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
            <Telescope size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-muted text-sm mt-1">Sign in to CareerLens</p>
        </div>

        <div className="card space-y-4">
          {apiErr && <Alert type="error">{apiErr}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Email" name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} error={errors.email} autoFocus />
            <Input label="Password" name="password" type="password" placeholder="••••••••"
              value={form.password} onChange={handleChange} error={errors.password} />
            <Button type="submit" loading={loading} className="w-full justify-center">
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center text-muted text-sm mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-accent hover:text-accent-hover font-medium">Create one</Link>
        </p>
      </div>
    </div>
  )
}
