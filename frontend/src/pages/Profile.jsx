import { useState } from 'react'
import { authApi } from '../services/api'
import { useAuth } from '../hooks/useAuth'
import { PageHeader, Card, Input, Button, Alert } from '../components/ui/index'
import { User, Save, CheckCircle } from 'lucide-react'
import { validate, validators } from '../utils/validators'
import { fmt } from '../utils/formatters'

export default function Profile() {
  const { user, refreshUser } = useAuth()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [errors, setErrors]   = useState({})
  const [saving, setSaving]   = useState(false)
  const [success, setSuccess] = useState(false)
  const [apiErr, setApiErr]   = useState('')

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: null }))
  }

  const handleSave = async () => {
    const errs = validate({ name: validators.required, email: validators.email }, form)
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true); setApiErr(''); setSuccess(false)
    try {
      await authApi.updateProfile(form)
      await refreshUser()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setApiErr(err.response?.data?.detail || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your account details" />

      <div className="max-w-md">
        {/* Avatar section */}
        <Card className="mb-6">
          <div className="flex items-center gap-4 pb-5 mb-5 border-b border-border">
            <div className="w-14 h-14 bg-accent/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <User size={24} className="text-accent" />
            </div>
            <div>
              <div className="text-white font-semibold">{user?.name}</div>
              <div className="text-muted text-sm">{user?.email}</div>
              <div className="text-muted/60 text-xs mt-1">
                Member since {user ? fmt.date(user.created_at) : ''}
              </div>
            </div>
          </div>

          {/* Edit form */}
          <div className="space-y-4">
            {apiErr && <Alert type="error">{apiErr}</Alert>}
            {success && (
              <Alert type="success">
                <div className="flex items-center gap-2">
                  <CheckCircle size={14} /> Profile updated successfully
                </div>
              </Alert>
            )}

            <Input
              label="Full Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />

            <Button onClick={handleSave} loading={saving} className="w-full justify-center">
              <Save size={15} />
              Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
