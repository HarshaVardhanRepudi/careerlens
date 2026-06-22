// ─── Button ──────────────────────────────────────────────────────────────────
export function Button({ children, variant = 'primary', className = '', loading, ...props }) {
  const base = 'btn'
  const variants = { primary: 'btn-primary', ghost: 'btn-ghost', danger: 'btn bg-red-900/40 text-red-400 hover:bg-red-900/70 border border-red-900' }
  return (
    <button className={`${base} ${variants[variant]} ${className}`} disabled={loading || props.disabled} {...props}>
      {loading ? <Spinner size={14} /> : null}
      {children}
    </button>
  )
}

// ─── Input ───────────────────────────────────────────────────────────────────
export function Input({ label, error, className = '', ...props }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <input className={`input ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`} {...props} />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

// ─── Textarea ────────────────────────────────────────────────────────────────
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <textarea className={`input resize-none ${error ? 'border-red-500' : ''} ${className}`} {...props} />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

// ─── Select ──────────────────────────────────────────────────────────────────
export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <select className={`input ${className}`} {...props}>{children}</select>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, className = '', ...props }) {
  return <div className={`card ${className}`} {...props}>{children}</div>
}

// ─── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner({ size = 20, className = '' }) {
  return (
    <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3H4z" />
    </svg>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────
const BADGE_VARIANTS = {
  Saved:     'bg-blue-900/40 text-blue-300 border border-blue-800',
  Applied:   'bg-purple-900/40 text-purple-300 border border-purple-800',
  Interview: 'bg-yellow-900/40 text-yellow-300 border border-yellow-800',
  Rejected:  'bg-red-900/40 text-red-300 border border-red-800',
  Offer:     'bg-green-900/40 text-green-300 border border-green-800',
  default:   'bg-gray-800 text-gray-300 border border-gray-700',
}

export function StatusBadge({ status }) {
  const cls = BADGE_VARIANTS[status] || BADGE_VARIANTS.default
  return <span className={`badge ${cls}`}>{status}</span>
}

// ─── Alert ───────────────────────────────────────────────────────────────────
export function Alert({ type = 'error', children }) {
  const styles = {
    error:   'bg-red-950 border-red-800 text-red-300',
    success: 'bg-green-950 border-green-800 text-green-300',
    info:    'bg-blue-950 border-blue-800 text-blue-300',
  }
  return (
    <div className={`border rounded-lg px-4 py-3 text-sm ${styles[type]}`}>{children}</div>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {Icon && <Icon size={36} className="text-muted mb-3" />}
      <p className="text-white font-medium">{title}</p>
      {description && <p className="text-muted text-sm mt-1">{description}</p>}
    </div>
  )
}

// ─── Page Header ─────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-muted mt-1 text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon: Icon, color = 'text-accent' }) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <span className="text-muted text-xs font-medium uppercase tracking-wide">{label}</span>
        {Icon && <Icon size={16} className={color} />}
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
    </Card>
  )
}
