import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Telescope } from 'lucide-react'
import { authApi } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { Input, Button, Alert } from '../components/ui/index'
import { validate, validators } from '../utils/validators'

export default function Register() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, set]  = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [apiErr, setApiErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    set(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate({
      name:     validators.required,
      email:    validators.email,
      password: validators.password,
    }, form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true); setApiErr('')
    try {
      const res = await authApi.register(form)
      login(res.data.access_token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setApiErr(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
            <Telescope size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-muted text-sm mt-1">Start managing your job search</p>
        </div>

        <div className="card space-y-4">
          {apiErr && <Alert type="error">{apiErr}</Alert>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" name="name" placeholder="Harsha Vardhan"
              value={form.name} onChange={handleChange} error={errors.name} autoFocus />
            <Input label="Email" name="email" type="email" placeholder="you@example.com"
              value={form.email} onChange={handleChange} error={errors.email} />
            <Input label="Password" name="password" type="password" placeholder="Min. 8 characters"
              value={form.password} onChange={handleChange} error={errors.password} />
            <Button type="submit" loading={loading} className="w-full justify-center">
              Create Account
            </Button>
          </form>
        </div>

        <p className="text-center text-muted text-sm mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-accent hover:text-accent-hover font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
