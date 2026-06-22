import { useState, useEffect } from 'react'
import { resumeApi, atsApi } from '../services/api'
import { PageHeader, Card, Button, Alert, Select, Textarea } from '../components/ui/index'
import { Search, CheckCircle, XCircle, Lightbulb, TrendingUp } from 'lucide-react'
import { fmt } from '../utils/formatters'

export default function ATSAnalyzer() {
  const [resumes, setResumes]       = useState([])
  const [resumeId, setResumeId]     = useState('')
  const [jobDesc, setJobDesc]       = useState('')
  const [result, setResult]         = useState(null)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [formError, setFormError]   = useState({})

  useEffect(() => {
    resumeApi.list().then(r => {
      setResumes(r.data)
      if (r.data.length) setResumeId(String(r.data[0].id))
    }).catch(() => {})
  }, [])

  const validate = () => {
    const errs = {}
    if (!resumeId) errs.resume = 'Select a resume'
    if (!jobDesc.trim()) errs.job = 'Paste a job description'
    else if (jobDesc.trim().length < 50) errs.job = 'Job description is too short'
    setFormError(errs)
    return !Object.keys(errs).length
  }

  const handleAnalyze = async () => {
    if (!validate()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await atsApi.analyze({ resume_id: parseInt(resumeId), job_description: jobDesc })
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <PageHeader title="ATS Analyzer" subtitle="Check how well your resume matches a job description" />

      <div className="grid grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="space-y-4">
          <Card>
            <h2 className="text-white font-semibold mb-4 text-sm">Configure Analysis</h2>

            {resumes.length === 0 ? (
              <Alert type="info">Upload a resume first to start analyzing</Alert>
            ) : (
              <Select
                label="Resume"
                value={resumeId}
                onChange={e => setResumeId(e.target.value)}
                error={formError.resume}
              >
                {resumes.map(r => <option key={r.id} value={r.id}>{r.filename}</option>)}
              </Select>
            )}

            <div className="mt-4">
              <Textarea
                label="Job Description"
                rows={14}
                placeholder="Paste the full job description here, including the requirements section..."
                value={jobDesc}
                onChange={e => setJobDesc(e.target.value)}
                error={formError.job}
              />
              <div className="text-muted text-xs mt-1 text-right">{jobDesc.length} characters</div>
            </div>

            {error && <Alert type="error" className="mt-3">{error}</Alert>}

            <Button
              onClick={handleAnalyze}
              loading={loading}
              disabled={!resumeId}
              className="w-full justify-center mt-4"
            >
              <Search size={15} />
              {loading ? 'Analyzing...' : 'Run ATS Analysis'}
            </Button>
          </Card>
        </div>

        {/* Results panel */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* Score */}
              <Card className="text-center">
                <div className={`text-6xl font-bold ${fmt.scoreColor(result.ats_score)} mb-1`}>
                  {result.ats_score}%
                </div>
                <div className="text-muted text-sm mb-4">ATS Compatibility Score</div>
                <div className="bg-surface rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-700 ${fmt.scoreBg(result.ats_score)}`}
                    style={{ width: `${result.ats_score}%` }}
                  />
                </div>
              </Card>

              {/* Matching skills */}
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={15} className="text-green-400" />
                  <span className="text-white text-sm font-medium">
                    Matching Skills ({result.matching_skills.length})
                  </span>
                </div>
                {result.matching_skills.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {result.matching_skills.map(s => (
                      <span key={s} className="badge bg-green-900/40 text-green-300 border border-green-800">{s}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted text-sm">No common skills found</p>
                )}
              </Card>

              {/* Missing skills */}
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <XCircle size={15} className="text-red-400" />
                  <span className="text-white text-sm font-medium">
                    Missing Skills ({result.missing_skills.length})
                  </span>
                </div>
                {result.missing_skills.length ? (
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing_skills.map(s => (
                      <span key={s} className="badge bg-red-900/40 text-red-300 border border-red-800">{s}</span>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-400 text-sm">No missing skills — great match!</p>
                )}
              </Card>

              {/* Suggestions */}
              <Card>
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb size={15} className="text-yellow-400" />
                  <span className="text-white text-sm font-medium">Improvement Suggestions</span>
                </div>
                <ul className="space-y-2">
                  {result.suggestions.map((s, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-300">
                      <span className="text-accent mt-0.5 flex-shrink-0">→</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </Card>
            </>
          ) : (
            <Card className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <TrendingUp size={32} className="text-border mx-auto mb-3" />
                <p className="text-muted text-sm">Run an analysis to see results</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
