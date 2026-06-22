import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { analyticsApi } from '../services/api'
import { StatCard, Card } from '../components/ui/index'
import { FileText, BarChart2, Kanban, TrendingUp, Target, Award, Activity } from 'lucide-react'

const QUICK_ACTIONS = [
  { to: '/resume',    icon: FileText,   label: 'Upload Resume',   desc: 'Add or update your resume', color: 'text-blue-400' },
  { to: '/ats',       icon: BarChart2,  label: 'ATS Analysis',    desc: 'Check your match score',    color: 'text-green-400' },
  { to: '/tracker',   icon: Kanban,     label: 'Track Application', desc: 'Log a new application',  color: 'text-purple-400' },
  { to: '/analytics', icon: TrendingUp, label: 'View Analytics',  desc: 'See your progress',         color: 'text-yellow-400' },
]

const STATUS_COLORS = {
  Saved: 'bg-blue-900/40 text-blue-300',
  Applied: 'bg-purple-900/40 text-purple-300',
  Interview: 'bg-yellow-900/40 text-yellow-300',
  Rejected: 'bg-red-900/40 text-red-300',
  Offer: 'bg-green-900/40 text-green-300',
}

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    analyticsApi.get().then(r => setData(r.data)).catch(() => {})
  }, [])

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Good to see you{user ? `, ${user.name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-muted text-sm mt-1">Here's your job search at a glance</p>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Applications" value={data.total_applications} icon={Target} color="text-accent" />
          <StatCard label="Interview Rate"      value={`${data.interview_rate}%`} icon={Activity}    color="text-green-400" />
          <StatCard label="Offer Rate"          value={`${data.offer_rate}%`}     icon={Award}       color="text-yellow-400" />
        </div>
      )}

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">Quick Actions</h2>
        <div className="grid grid-cols-4 gap-4">
          {QUICK_ACTIONS.map(({ to, icon: Icon, label, desc, color }) => (
            <Link key={to} to={to} className="card hover:border-accent/50 transition-colors">
              <Icon size={22} className={`${color} mb-3`} />
              <div className="text-white text-sm font-medium">{label}</div>
              <div className="text-muted text-xs mt-1">{desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Pipeline */}
      {data?.status_distribution && (
        <div>
          <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">Application Pipeline</h2>
          <Card>
            <div className="grid grid-cols-5 gap-4">
              {data.status_distribution.map(({ status, count }) => (
                <div key={status} className="text-center">
                  <div className="text-2xl font-bold text-white mb-2">{count}</div>
                  <span className={`badge ${STATUS_COLORS[status] || 'bg-gray-800 text-gray-300'}`}>{status}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
