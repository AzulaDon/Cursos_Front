import { useState } from 'react'
import { useStore } from '../store'
import { C, card, inputStyle, btnPrimary, btnSecondary, btnDanger, btnIcon } from '../theme'

const SPECIALTIES = ['React · TypeScript','Vue · JavaScript','Python · Django','IA · Machine Learning','UI/UX · Figma','Ciberseguridad','Cloud · DevOps','Data Science','Flutter · Dart','Node.js · Backend']

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#00000088', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: 24 }}>
      <div style={{ background: C.secondary, borderRadius: 20, border: `1px solid ${C.border}`, width: '100%', maxWidth: 480, padding: '28px 32px', boxShadow: '0 24px 64px #00000066' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: C.textPrimary }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: C.textDisabled, fontSize: 22, cursor: 'pointer', lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function TeacherForm({ initial = {}, onSave, onClose, saving }) {
  const [name,      setName]      = useState(initial.name      || '')
  const [email,     setEmail]     = useState(initial.email     || '')
  const [specialty, setSpecialty] = useState(initial.specialty || '')
  const [custom,    setCustom]    = useState(false)
  const [err,       setErr]       = useState('')

  function submit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !specialty.trim()) { setErr('Todos los campos son requeridos.'); return }
    if (!/\S+@\S+\.\S+/.test(email)) { setErr('Ingresa un correo válido.'); return }
    setErr('')
    onSave({ name: name.trim(), email: email.trim(), specialty: specialty.trim() })
  }

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ fontSize: 13, color: C.textSecondary, display: 'block', marginBottom: 6, fontWeight: 500 }}>Nombre completo *</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej. María González" style={inputStyle} />
      </div>
      <div>
        <label style={{ fontSize: 13, color: C.textSecondary, display: 'block', marginBottom: 6, fontWeight: 500 }}>Correo electrónico *</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="profesor@correo.com" style={inputStyle} />
      </div>
      <div>
        <label style={{ fontSize: 13, color: C.textSecondary, display: 'block', marginBottom: 6, fontWeight: 500 }}>Especialidad *</label>
        {!custom ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={{ ...inputStyle, flex: 1 }}>
              <option value="">Seleccionar...</option>
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button type="button" onClick={() => setCustom(true)} style={{ ...btnIcon, whiteSpace: 'nowrap' }}>Otra</button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={specialty} onChange={e => setSpecialty(e.target.value)} placeholder="Ej. Blockchain · Solidity" style={{ ...inputStyle, flex: 1 }} />
            <button type="button" onClick={() => { setCustom(false); setSpecialty('') }} style={{ ...btnIcon, whiteSpace: 'nowrap' }}>Lista</button>
          </div>
        )}
      </div>
      {err && <p style={{ fontSize: 13, color: '#E06C75', background: '#E06C7511', borderRadius: 8, padding: '8px 12px' }}>⚠️ {err}</p>}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
        <button type="button" onClick={onClose} style={btnSecondary} disabled={saving}>Cancelar</button>
        <button type="submit" style={{ ...btnPrimary, opacity: saving ? 0.7 : 1 }} disabled={saving}>
          {saving ? '⏳ Guardando...' : initial.id ? 'Guardar cambios' : 'Dar de alta'}
        </button>
      </div>
    </form>
  )
}

export default function TeachersPage() {
  const { teachers, courses, addTeacher, updateTeacher, deleteTeacher } = useStore()
  const [modal,   setModal]   = useState(null)
  const [search,  setSearch]  = useState('')
  const [confirm, setConfirm] = useState(null)
  const [toast,   setToast]   = useState('')
  const [saving,  setSaving]  = useState(false)
  const [apiErr,  setApiErr]  = useState('')

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const filtered = teachers.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.email.toLowerCase().includes(search.toLowerCase()) ||
    t.specialty.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSave(data) {
    setSaving(true)
    setApiErr('')
    try {
      if (modal === 'add') {
        await addTeacher(data)
        showToast(`✅ Profesor "${data.name}" dado de alta`)
      } else {
        await updateTeacher(modal.id, data)
        showToast('✅ Profesor actualizado')
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
      await deleteTeacher(confirm.id)
      showToast(`🗑️ Profesor "${confirm.name}" eliminado`)
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
        <div style={{ position: 'fixed', bottom: 28, right: 28, background: C.secondary, border: `1px solid ${C.objects}`, borderRadius: 12, padding: '12px 20px', color: C.textPrimary, fontSize: 14, zIndex: 300, boxShadow: '0 8px 24px #00000055' }}>
          {toast}
        </div>
      )}

      {apiErr && (
        <div style={{ background: '#E06C7522', border: '1px solid #E06C7544', borderRadius: 10, padding: '10px 16px', color: '#E06C75', fontSize: 13 }}>
          ⚠️ {apiErr}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <p style={{ fontSize: 14, color: C.textDisabled }}>{teachers.length} profesores registrados</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Buscar profesor..." style={{ ...inputStyle, width: 240 }} />
          <button onClick={() => { setApiErr(''); setModal('add') }} style={btnPrimary}>+ Dar de alta</button>
        </div>
      </div>

      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: C.primary }}>
              {['Profesor','Correo','Especialidad','Cursos','Desde','Acciones'].map(h => (
                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 12, color: C.textDisabled, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: C.textDisabled, fontSize: 14 }}>No se encontraron profesores</td></tr>
            ) : filtered.map((t, i) => {
              const courseCount = courses.filter(c => c.teacherId === t.id).length
              return (
                <tr key={t.id} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : `${C.primary}55` }}>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: C.textPrimary, flexShrink: 0 }}>
                        {t.avatar}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{t.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: C.textSecondary }}>{t.email}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 12, background: `${C.objects2}22`, color: '#9B94E0', padding: '4px 10px', borderRadius: 8 }}>{t.specialty}</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 13, color: C.textSecondary, textAlign: 'center' }}>
                    <span style={{ fontWeight: 700, color: courseCount > 0 ? C.accentuate : C.textDisabled }}>{courseCount}</span>
                  </td>
                  <td style={{ padding: '14px 20px', fontSize: 12, color: C.textDisabled }}>{t.createdAt}</td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setApiErr(''); setModal(t) }} style={btnIcon}>✏️ Editar</button>
                      <button onClick={() => setConfirm(t)} style={btnDanger}>🗑️</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {modal !== null && (
        <Modal title={modal === 'add' ? 'Dar de alta profesor' : `Editar: ${modal.name}`} onClose={() => setModal(null)}>
          <TeacherForm initial={modal === 'add' ? {} : modal} onSave={handleSave} onClose={() => setModal(null)} saving={saving} />
          {apiErr && <p style={{ fontSize: 13, color: '#E06C75', marginTop: 8 }}>⚠️ {apiErr}</p>}
        </Modal>
      )}

      {confirm && (
        <Modal title="Confirmar eliminación" onClose={() => setConfirm(null)}>
          <p style={{ fontSize: 14, color: C.textSecondary, marginBottom: 8 }}>
            ¿Estás seguro de que deseas eliminar al profesor <strong style={{ color: C.textPrimary }}>{confirm.name}</strong>?
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