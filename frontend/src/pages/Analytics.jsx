import { useState, useEffect } from 'react'
import { analyticsApi } from '../services/api'
import { PageHeader, Card, StatCard, EmptyState } from '../components/ui/index'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts'
import { TrendingUp, Target, Award, Activity } from 'lucide-react'
import { fmt } from '../utils/formatters'

const PIE_COLORS = ['#6366f1', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981']

const TT_STYLE = {
  contentStyle: { background: '#1e2638', border: '1px solid #2a3349', borderRadius: 8, color: '#e2e8f0', fontSize: 12 },
  cursor: { fill: 'rgba(255,255,255,0.03)' },
}

export default function Analytics() {
  const [data, setData]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    analyticsApi.get()
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-muted text-sm">Loading analytics...</div>

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Visualize your job search progress" />

      {data && (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard label="Total Applications" value={data.total_applications} icon={Target}   color="text-accent"       />
            <StatCard label="Interview Rate"      value={`${data.interview_rate}%`} icon={Activity} color="text-green-400"  />
            <StatCard label="Offer Rate"          value={`${data.offer_rate}%`}     icon={Award}    color="text-yellow-400" />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Status pie */}
            <Card>
              <h2 className="text-white text-sm font-semibold mb-4">Status Distribution</h2>
              {data.status_distribution.some(d => d.count > 0) ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={data.status_distribution.filter(d => d.count > 0)}
                      dataKey="count"
                      nameKey="status"
                      cx="50%" cy="50%"
                      outerRadius={85}
                      label={({ status, count }) => `${status}: ${count}`}
                      labelLine={{ stroke: '#2a3349' }}
                    >
                      {data.status_distribution.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip {...TT_STYLE} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState title="No data yet" description="Add applications to see distribution" />
              )}
            </Card>

            {/* Missing skills bar */}
            <Card>
              <h2 className="text-white text-sm font-semibold mb-4">Top Missing Skills</h2>
              {data.top_missing_skills.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={data.top_missing_skills} layout="vertical">
                    <XAxis type="number" tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="skill" tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                    <Tooltip {...TT_STYLE} />
                    <Bar dataKey="count" fill="#6366f1" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <EmptyState title="No skill data" description="Run ATS analyses to see missing skills" />
              )}
            </Card>
          </div>

          {/* Application trend */}
          <Card>
            <h2 className="text-white text-sm font-semibold mb-4">Application Trend</h2>
            {data.application_trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.application_trend}>
                  <XAxis dataKey="month" tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false}
                    tickFormatter={v => fmt.month(v)} />
                  <YAxis tick={{ fill: '#8892a4', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip {...TT_STYLE} labelFormatter={v => fmt.month(v)} />
                  <Line type="monotone" dataKey="count" name="Applications" stroke="#6366f1"
                    strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState title="No trend data" description="Add date_applied when tracking applications" />
            )}
          </Card>
        </>
      )}
    </div>
  )
}
