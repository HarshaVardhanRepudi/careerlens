import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import {
  LayoutDashboard, FileText, BarChart2, Kanban,
  TrendingUp, User, LogOut, Telescope,
} from 'lucide-react'

const NAV = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard'   },
  { to: '/resume',     icon: FileText,         label: 'Resumes'     },
  { to: '/ats',        icon: BarChart2,        label: 'ATS Analyzer'},
  { to: '/tracker',    icon: Kanban,           label: 'Tracker'     },
  { to: '/analytics',  icon: TrendingUp,       label: 'Analytics'   },
  { to: '/profile',    icon: User,             label: 'Profile'     },
]

export function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <aside className="w-56 flex-shrink-0 bg-panel border-r border-border flex flex-col h-screen">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <Telescope size={16} className="text-white" />
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-none">CareerLens</div>
            <div className="text-muted text-xs mt-0.5">Career Platform</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-muted hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 pb-4 border-t border-border pt-3">
        {user && (
          <div className="px-3 py-2 mb-1">
            <div className="text-white text-sm font-medium truncate">{user.name}</div>
            <div className="text-muted text-xs truncate">{user.email}</div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-sm font-medium text-muted hover:text-red-400 hover:bg-red-900/10 transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
