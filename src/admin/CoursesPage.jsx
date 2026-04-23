import { useState } from 'react'
import { useStore } from '../store'
import { C, card, inputStyle, btnPrimary, btnSecondary, btnDanger, btnIcon } from '../theme'

const CATEGORIES = ['Desarrollo Web','UI/UX Design','Inteligencia Artificial','Apps Móviles','Ciberseguridad','Cloud & DevOps','Data Science','Videojuegos']

function Modal({ title, onClose, children, wide }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#00000088', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24, overflowY: 'auto' }}>
      <div style={{ background: C.secondary, borderRadius: 20, border: `1px solid ${C.border}`, width: '100%', maxWidth: wide ? 700 : 520, padding: '28px 32px', boxShadow: '0 24px 64px #00000066', margin: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: C.textPrimary }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: C.textDisabled, fontSize: 22, cursor: 'pointer' }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function VideoRow({ video, onUpdate, onDelete, onMove, isFirst, isLast }) {
  const [editing, setEditing] = useState(false)
  const [title,   setTitle]   = useState(video.title)
  const [dur,     setDur]     = useState(video.duration)
  const [url,     setUrl]     = useState(video.urlStream || '')

  function save() {
    if (title.trim()) { onUpdate(video.id, { title: title.trim(), duration: dur.trim(), urlStream: url.trim() }); setEditing(false) }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: C.primary, borderRadius: 10, border: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <button onClick={() => onMove(video.id, -1)} disabled={isFirst} style={{ background: 'none', border: 'none', color: isFirst ? C.textDisabled : C.textSecondary, cursor: isFirst ? 'default' : 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}>▲</button>
        <button onClick={() => onMove(video.id,  1)} disabled={isLast}  style={{ background: 'none', border: 'none', color: isLast  ? C.textDisabled : C.textSecondary, cursor: isLast  ? 'default' : 'pointer', fontSize: 12, padding: 0, lineHeight: 1 }}>▼</button>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: C.textDisabled, width: 24, textAlign: 'center' }}>{video.order}</span>
      <span style={{ fontSize: 18 }}>🎬</span>
      {editing ? (
        <>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" style={{ ...inputStyle, flex: 1, padding: '6px 10px', fontSize: 13 }} />
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="URL stream" style={{ ...inputStyle, flex: 1, padding: '6px 10px', fontSize: 13 }} />
          <input value={dur} onChange={e => setDur(e.target.value)} placeholder="mm:ss" style={{ ...inputStyle, width: 70, padding: '6px 8px', fontSize: 13 }} />
          <button onClick={save} style={{ ...btnPrimary, padding: '6px 12px', fontSize: 12 }}>✓</button>
          <button onClick={() => setEditing(false)} style={{ ...btnSecondary, padding: '6px 12px', fontSize: 12 }}>✗</button>
        </>
      ) : (
        <>
          <span style={{ flex: 1, fontSize: 13, color: C.textPrimary }}>{video.title}</span>
          <span style={{ fontSize: 12, color: C.textDisabled, background: `${C.objects}22`, padding: '3px 8px', borderRadius: 6 }}>{video.duration}</span>
          <button onClick={() => setEditing(true)} style={{ ...btnIcon, padding: '5px 10px', fontSize: 12 }}>✏️</button>
          <button onClick={() => onDelete(video.id)} style={{ ...btnDanger, padding: '5px 10px', fontSize: 12 }}>🗑️</button>
        </>
      )}
    </div>
  )
}

function CourseForm({ initial = {}, onSave, onClose, saving }) {
  const { teachers } = useStore()
  const [name,      setName]      = useState(initial.name      || '')
  const [teacherId, setTeacherId] = useState(initial.teacherId || '')
  const [category,  setCategory]  = useState(initial.category  || '')
  const [videos,    setVideos]    = useState(initial.videos    || [])
  const [newTitle,  setNewTitle]  = useState('')
  const [newDur,    setNewDur]    = useState('')
  const [newUrl,    setNewUrl]    = useState('')
  const [err,       setErr]       = useState('')
  const [nextVid,   setNextVid]   = useState(Date.now())

  function addVideo() {
    if (!newTitle.trim()) return
    const v = { id: `v_${nextVid}`, title: newTitle.trim(), duration: newDur.trim() || '0:00', urlStream: newUrl.trim() || 'https://placeholder.com/video.mp4', order: videos.length + 1 }
    setVideos(prev => [...prev, v])
    setNextVid(n => n + 1)
    setNewTitle(''); setNewDur(''); setNewUrl('')
  }

  function updateVideo(id, data) { setVideos(prev => prev.map(v => v.id === id ? { ...v, ...data } : v)) }
  function deleteVideo(id) { setVideos(prev => prev.filter(v => v.id !== id).map((v, i) => ({ ...v, order: i + 1 }))) }
  function moveVideo(id, dir) {
    const idx = videos.findIndex(v => v.id === id)
    const next = idx + dir
    if (next < 0 || next >= videos.length) return
    const arr = [...videos];
    [arr[idx], arr[next]] = [arr[next], arr[idx]]
    setVideos(arr.map((v, i) => ({ ...v, order: i + 1 })))
  }

  function submit(e) {
    e.preventDefault()
    if (!name.trim() || !teacherId || !category) { setErr('Nombre, profesor y categoría son requeridos.'); return }
    setErr('')
    onSave({ name: name.trim(), teacherId: Number(teacherId), category, videos })
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: 13, color: C.textSecondary, display: 'block', marginBottom: 6, fontWeight: 500 }}>Nombre del curso *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej. React avanzado con TypeScript" style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 13, color: C.textSecondary, display: 'block', marginBottom: 6, fontWeight: 500 }}>Profesor *</label>
          <select value={teacherId} onChange={e => setTeacherId(e.target.value)} style={inputStyle}>
            <option value="">Seleccionar...</option>
            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 13, color: C.textSecondary, display: 'block', marginBottom: 6, fontWeight: 500 }}>Categoría *</label>
          <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
            <option value="">Seleccionar...</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label style={{ fontSize: 13, color: C.textSecondary, display: 'block', marginBottom: 10, fontWeight: 500 }}>
          Videos en secuencia <span style={{ color: C.textDisabled }}>({videos.length} videos)</span>
        </label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12, maxHeight: 240, overflowY: 'auto' }}>
          {videos.length === 0 && <p style={{ fontSize: 13, color: C.textDisabled, padding: '12px 0' }}>Aún no hay videos.</p>}
          {videos.map((v, i) => (
            <VideoRow key={v.id} video={v} onUpdate={updateVideo} onDelete={deleteVideo} onMove={moveVideo} isFirst={i === 0} isLast={i === videos.length - 1} />
          ))}
        </div>
        {/* Agregar video */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, background: C.primary, borderRadius: 10, padding: '12px 14px', border: `1px dashed ${C.objects}55` }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 18 }}>➕</span>
            <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Título del video" style={{ ...inputStyle, flex: 1, padding: '6px 10px', fontSize: 13 }} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addVideo())} />
            <input value={newDur} onChange={e => setNewDur(e.target.value)} placeholder="mm:ss" style={{ ...inputStyle, width: 70, padding: '6px 8px', fontSize: 13 }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="URL del stream (https://...)" style={{ ...inputStyle, flex: 1, padding: '6px 10px', fontSize: 13 }} />
            <button type="button" onClick={addVideo} style={{ ...btnPrimary, padding: '6px 14px', fontSize: 13 }}>Agregar</button>
          </div>
        </div>
      </div>

      {err && <p style={{ fontSize: 13, color: '#E06C75', background: '#E06C7511', borderRadius: 8, padding: '8px 12px' }}>⚠️ {err}</p>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 4 }}>
        <button type="button" onClick={onClose} style={btnSecondary} disabled={saving}>Cancelar</button>
        <button type="submit" style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }} disabled={saving}>
          {saving ? '⏳ Guardando...' : initial.id ? 'Guardar cambios' : 'Crear curso'}
        </button>
      </div>
    </form>
  )
}

export default function CoursesPage() {
  const { courses, teachers, addCourse, updateCourse, deleteCourse } = useStore()
  const [modal,   setModal]   = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [search,  setSearch]  = useState('')
  const [toast,   setToast]   = useState('')
  const [expand,  setExpand]  = useState(null)
  const [saving,  setSaving]  = useState(false)
  const [apiErr,  setApiErr]  = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const filtered = courses.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase()) ||
    (teachers.find(t => t.id === c.teacherId)?.name || '').toLowerCase().includes(search.toLowerCase())
  )

  async function handleSave(data) {
    setSaving(true)
    setApiErr('')
    try {
      if (modal === 'add') {
        await addCourse(data)
        showToast(`✅ Curso "${data.name}" creado`)
      } else {
        await updateCourse(modal.id, data)
        showToast('✅ Curso actualizado')
      }
      setModal(null)
    } catch (e) {
      setApiErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setSaving(true)
    try {
      await deleteCourse(confirm.id)
      showToast('🗑️ Curso eliminado')
      setConfirm(null)
    } catch (e) {
      setApiErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, background: C.secondary, border: `1px solid ${C.objects}`, borderRadius: 12, padding: '12px 20px', color: C.textPrimary, fontSize: 14, zIndex: 300, boxShadow: '0 8px 24px #00000055' }}>{toast}</div>
      )}

      {apiErr && (
        <div style={{ background: '#E06C7522', border: '1px solid #E06C7544', borderRadius: 10, padding: '10px 16px', color: '#E06C75', fontSize: 13 }}>
          ⚠️ {apiErr}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 14, color: C.textDisabled }}>{courses.length} cursos · {courses.reduce((a, c) => a + (c.videos?.length ?? 0), 0)} videos en total</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Buscar curso..." style={{ ...inputStyle, width: 240 }} />
          <button onClick={() => { setApiErr(''); setModal('add') }} style={btnPrimary}>+ Crear curso</button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && <div style={{ ...card, textAlign: 'center', color: C.textDisabled, padding: '48px' }}>No se encontraron cursos</div>}
        {filtered.map(course => {
          const teacher = teachers.find(t => t.id === course.teacherId)
          const isOpen  = expand === course.id
          return (
            <div key={course.id} style={{ ...card, padding: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `linear-gradient(135deg, ${C.primary}, ${C.objects2})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>📚</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{course.name}</p>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: C.textSecondary }}>👩‍🏫 {teacher?.name || 'Sin asignar'}</span>
                    <span style={{ fontSize: 11, background: `${C.objects2}22`, color: '#9B94E0', padding: '2px 8px', borderRadius: 6 }}>{course.category}</span>
                    <span style={{ fontSize: 12, color: C.textDisabled }}>🎬 {course.videos?.length ?? 0} videos</span>
                    {course.totalRatings > 0 && <span style={{ fontSize: 12, color: '#F5C842' }}>★ {course.rating} ({course.totalRatings})</span>}
                    <span style={{ fontSize: 11, background: course.estatus === 'ACTIVO' ? `${C.success}22` : `${C.textDisabled}22`, color: course.estatus === 'ACTIVO' ? C.success : C.textDisabled, padding: '2px 8px', borderRadius: 6 }}>{course.estatus}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => setExpand(isOpen ? null : course.id)} style={{ ...btnIcon, padding: '6px 12px' }}>
                    {isOpen ? '▲ Ocultar' : '▼ Videos'}
                  </button>
                  <button onClick={() => { setApiErr(''); setModal(course) }} style={btnIcon}>✏️</button>
                  <button onClick={() => setConfirm(course)} style={btnDanger}>🗑️</button>
                </div>
              </div>

              {isOpen && (
                <div style={{ borderTop: `1px solid ${C.border}`, background: C.primary, padding: '16px 20px' }}>
                  {!course.videos?.length ? (
                    <p style={{ fontSize: 13, color: C.textDisabled }}>Este curso aún no tiene videos.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {course.videos.map(v => (
                        <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 14px', background: C.secondary, borderRadius: 8, border: `1px solid ${C.border}` }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: C.textDisabled, width: 20 }}>{v.order}.</span>
                          <span style={{ fontSize: 18 }}>▶️</span>
                          <span style={{ flex: 1, fontSize: 13, color: C.textPrimary }}>{v.title}</span>
                          <span style={{ fontSize: 12, color: C.textDisabled }}>{v.duration}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {modal !== null && (
        <Modal title={modal === 'add' ? 'Crear nuevo curso' : `Editar: ${modal.name}`} onClose={() => setModal(null)} wide>
          <CourseForm initial={modal === 'add' ? {} : modal} onSave={handleSave} onClose={() => setModal(null)} saving={saving} />
          {apiErr && <p style={{ fontSize: 13, color: '#E06C75', marginTop: 8 }}>⚠️ {apiErr}</p>}
        </Modal>
      )}

      {confirm && (
        <Modal title="Confirmar eliminación" onClose={() => setConfirm(null)}>
          <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 8 }}>
            ¿Eliminar el curso <strong style={{ color: C.textPrimary }}>{confirm.name}</strong>?
          </p>
          <p style={{ fontSize: 13, color: '#E06C75', marginBottom: 24 }}>Esta acción no se puede deshacer.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setConfirm(null)} style={btnSecondary}>Cancelar</button>
            <button onClick={handleDelete} disabled={saving} style={{ ...btnPrimary, background: '#E06C75', opacity: saving ? 0.7 : 1 }}>
              {saving ? '⏳ Eliminando...' : 'Sí, eliminar'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}