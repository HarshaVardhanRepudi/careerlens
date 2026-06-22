import { useState, useEffect, useCallback } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { trackerApi } from '../services/api'
import { PageHeader, Card, Button, Input, Select, Alert, EmptyState, StatusBadge } from '../components/ui/index'
import { Modal } from '../components/ui/Modal'
import { Plus, Trash2, GripVertical, Kanban } from 'lucide-react'
import { fmt } from '../utils/formatters'

const COLUMNS = ['Saved', 'Applied', 'Interview', 'Rejected', 'Offer']

const COL_STYLES = {
  Saved:     'border-t-blue-500',
  Applied:   'border-t-purple-500',
  Interview: 'border-t-yellow-500',
  Rejected:  'border-t-red-500',
  Offer:     'border-t-green-500',
}

const EMPTY = { company: '', role: '', status: 'Saved', date_applied: '', notes: '' }

export default function Tracker() {
  const [apps, setApps]         = useState([])
  const [showModal, setModal]   = useState(false)
  const [editApp, setEditApp]   = useState(null)  // null = create, object = edit
  const [form, setForm]         = useState(EMPTY)
  const [formError, setFormError] = useState({})
  const [saving, setSaving]     = useState(false)
  const [apiErr, setApiErr]     = useState('')

  const load = useCallback(() =>
    trackerApi.list().then(r => setApps(r.data)).catch(() => {}), [])

  useEffect(() => { load() }, [load])

  const byStatus = (status) => apps.filter(a => a.status === status)

  // ── Modal helpers ──────────────────────────────────────────────────────────
  const openCreate = () => { setEditApp(null); setForm(EMPTY); setFormError({}); setApiErr(''); setModal(true) }
  const openEdit   = (app) => {
    setEditApp(app)
    setForm({ company: app.company, role: app.role, status: app.status, date_applied: app.date_applied || '', notes: app.notes || '' })
    setFormError({}); setApiErr(''); setModal(true)
  }
  const closeModal = () => setModal(false)

  const validate = () => {
    const errs = {}
    if (!form.company.trim()) errs.company = 'Required'
    if (!form.role.trim())    errs.role    = 'Required'
    setFormError(errs)
    return !Object.keys(errs).length
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true); setApiErr('')
    try {
      if (editApp) {
        await trackerApi.update(editApp.id, form)
      } else {
        await trackerApi.create(form)
      }
      closeModal(); load()
    } catch (err) {
      setApiErr(err.response?.data?.detail || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try { await trackerApi.remove(id); load() } catch {}
  }

  // ── Drag and drop ──────────────────────────────────────────────────────────
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const newStatus = destination.droppableId
    const appId = parseInt(draggableId)

    // Optimistic update
    setApps(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a))

    try {
      await trackerApi.update(appId, { status: newStatus })
    } catch {
      load() // revert on failure
    }
  }

  return (
    <div>
      <PageHeader
        title="Application Tracker"
        subtitle="Drag cards between columns to update status"
        action={
          <Button onClick={openCreate}>
            <Plus size={15} /> Add Application
          </Button>
        }
      />

      {/* Kanban board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-5 gap-3">
          {COLUMNS.map(col => (
            <div key={col} className={`card border-t-2 ${COL_STYLES[col]} p-3`}>
              {/* Column header */}
              <div className="flex items-center justify-between mb-3">
                <StatusBadge status={col} />
                <span className="text-muted text-xs font-mono">{byStatus(col).length}</span>
              </div>

              {/* Droppable column */}
              <Droppable droppableId={col}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`min-h-24 rounded-lg transition-colors ${snapshot.isDraggingOver ? 'bg-accent/5' : ''}`}
                  >
                    {byStatus(col).map((app, index) => (
                      <Draggable key={app.id} draggableId={String(app.id)} index={index}>
                        {(prov, snap) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            className={`bg-surface border border-border rounded-lg p-3 mb-2 cursor-pointer group transition-shadow ${
                              snap.isDragging ? 'shadow-xl border-accent/50' : 'hover:border-muted/50'
                            }`}
                            onClick={() => openEdit(app)}
                          >
                            <div className="flex items-start gap-1.5">
                              <div {...prov.dragHandleProps} className="mt-0.5 text-border group-hover:text-muted flex-shrink-0" onClick={e => e.stopPropagation()}>
                                <GripVertical size={14} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-white text-xs font-semibold truncate">{app.company}</div>
                                <div className="text-muted text-xs truncate mt-0.5">{app.role}</div>
                                {app.date_applied && (
                                  <div className="text-muted/60 text-xs mt-1">{fmt.date(app.date_applied)}</div>
                                )}
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(app.id) }}
                                className="text-border hover:text-red-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                            {app.notes && (
                              <div className="text-muted text-xs mt-2 line-clamp-2 pl-5">{app.notes}</div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {byStatus(col).length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex items-center justify-center h-16 text-muted/40 text-xs">Drop here</div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      {apps.length === 0 && (
        <Card className="mt-4">
          <EmptyState icon={Kanban} title="No applications yet" description="Add your first application to start tracking" />
        </Card>
      )}

      {/* Create / Edit Modal */}
      <Modal open={showModal} onClose={closeModal} title={editApp ? 'Edit Application' : 'Add Application'}>
        <div className="space-y-4">
          {apiErr && <Alert type="error">{apiErr}</Alert>}

          <Input label="Company *" placeholder="e.g. Texas Capital Bank"
            value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
            error={formError.company} />

          <Input label="Role *" placeholder="e.g. Associate Platform Engineer"
            value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            error={formError.role} />

          <Select label="Status" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
            {COLUMNS.map(c => <option key={c} value={c}>{c}</option>)}
          </Select>

          <Input label="Date Applied" type="date"
            value={form.date_applied} onChange={e => setForm(f => ({ ...f, date_applied: e.target.value }))} />

          <div>
            <label className="label">Notes</label>
            <textarea className="input" rows={3} placeholder="Recruiter name, notes, follow-up date..."
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={closeModal} className="flex-1 justify-center">Cancel</Button>
            <Button onClick={handleSave} loading={saving} className="flex-1 justify-center">
              {editApp ? 'Save Changes' : 'Add Application'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
