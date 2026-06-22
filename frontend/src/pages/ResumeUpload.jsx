import { useState, useEffect, useCallback } from 'react'
import { resumeApi } from '../services/api'
import { PageHeader, Card, Button, Alert, EmptyState } from '../components/ui/index'
import { Upload, FileText, Trash2, CheckCircle } from 'lucide-react'
import { fmt } from '../utils/formatters'

export default function ResumeUpload() {
  const [resumes, setResumes]   = useState([])
  const [uploading, setUploading] = useState(false)
  const [success, setSuccess]   = useState('')
  const [error, setError]       = useState('')
  const [dragging, setDragging] = useState(false)

  const load = useCallback(() =>
    resumeApi.list().then(r => setResumes(r.data)).catch(() => {}), [])

  useEffect(() => { load() }, [load])

  const handleFile = async (file) => {
    if (!file) return
    if (!file.name.match(/\.(pdf|docx)$/i)) { setError('Only PDF and DOCX files are accepted'); return }
    setUploading(true); setError(''); setSuccess('')
    try {
      await resumeApi.upload(file)
      setSuccess('Resume uploaded successfully!')
      load()
      setTimeout(() => setSuccess(''), 4000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id) => {
    try { await resumeApi.delete(id); load() } catch {}
  }

  // Drag-and-drop handlers
  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div>
      <PageHeader title="Resumes" subtitle="Upload and manage your resume files" />

      {/* Upload zone */}
      <Card className="mb-6">
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 cursor-pointer transition-colors ${
            dragging ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
          }`}
        >
          <Upload size={30} className={dragging ? 'text-accent mb-3' : 'text-muted mb-3'} />
          <p className="text-white font-medium text-sm">
            {uploading ? 'Uploading...' : 'Drop your resume here or click to browse'}
          </p>
          <p className="text-muted text-xs mt-1">PDF or DOCX — max 10 MB</p>
          <input type="file" accept=".pdf,.docx" className="hidden"
            onChange={(e) => handleFile(e.target.files[0])} disabled={uploading} />
        </label>

        {success && (
          <div className="flex items-center gap-2 text-green-400 text-sm mt-3">
            <CheckCircle size={14} />{success}
          </div>
        )}
        {error && <Alert type="error" className="mt-3">{error}</Alert>}
      </Card>

      {/* Resume list */}
      <h2 className="text-sm font-semibold text-muted uppercase tracking-wide mb-4">
        Uploaded Resumes ({resumes.length})
      </h2>

      {resumes.length === 0 ? (
        <Card><EmptyState icon={FileText} title="No resumes yet" description="Upload your resume to get started" /></Card>
      ) : (
        <div className="space-y-3">
          {resumes.map(r => (
            <Card key={r.id} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={16} className="text-accent" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">{r.filename}</div>
                  <div className="text-muted text-xs mt-0.5">
                    Uploaded {fmt.date(r.upload_date)} · {fmt.words(r.resume_text)} words
                  </div>
                </div>
              </div>
              <Button variant="ghost" onClick={() => handleDelete(r.id)}
                className="text-muted hover:text-red-400 border-none px-2">
                <Trash2 size={15} />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
