export const fmt = {
  date: (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—',
  month: (d) => d ? new Date(d + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : d,
  words: (text) => text?.split(/\s+/).length ?? 0,
  scoreColor: (n) => n >= 70 ? 'text-green-400' : n >= 40 ? 'text-yellow-400' : 'text-red-400',
  scoreBg: (n) => n >= 70 ? 'bg-green-500' : n >= 40 ? 'bg-yellow-500' : 'bg-red-500',
}
