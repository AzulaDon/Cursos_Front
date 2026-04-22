import { useState } from 'react'
import { useStore } from '../store'
import { C, card, inputStyle } from '../theme'

function ProgressBar({ percent }) {
  const color = percent === 100 ? C.success : percent >= 50 ? C.objects2 : C.accentuate
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, background: `${C.objects}33`, borderRadius: 6, height: 8, overflow: 'hidden' }}>
        <div style={{ width: `${percent}%`, height: '100%', background: color, borderRadius: 6, transition: 'width 0.4s ease' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, width: 36, textAlign: 'right' }}>{percent}%</span>
    </div>
  )
}

export default function ProgressPage() {
  const { courses, progress, teachers } = useStore()
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('percent_desc')

  const filtered = progress
    .filter(p => selectedCourse === 'all' || p.courseId === Number(selectedCourse))
    .filter(p => !search || p.userName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'percent_desc') return b.percent - a.percent
      if (sortBy === 'percent_asc')  return a.percent - b.percent
      if (sortBy === 'recent')       return new Date(b.lastSeen) - new Date(a.lastSeen)
      if (sortBy === 'name')         return a.userName.localeCompare(b.userName)
      return 0
    })

  // Summary stats
  const total     = filtered.length
  const completed = filtered.filter(p => p.percent === 100).length
  const inProg    = filtered.filter(p => p.percent > 0 && p.percent < 100).length
  const avgPct    = total ? Math.round(filtered.reduce((a, p) => a + p.percent, 0) / total) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
        {[
          { label: 'Total inscripciones', value: progress.length, color: C.objects2 },
          { label: 'Completados',         value: completed,        color: C.success },
          { label: 'En progreso',         value: inProg,           color: C.accentuate },
          { label: 'Avance promedio',     value: `${avgPct}%`,     color: '#F5C842' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ ...card, padding: '1rem 1.25rem' }}>
            <p style={{ fontSize: 12, color: C.textDisabled, marginBottom: 6 }}>{label}</p>
            <p style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Syne', sans-serif", color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 220 }}>
          <option value="all">Todos los cursos</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Buscar estudiante..." style={{ ...inputStyle, width: 220 }} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 180 }}>
          <option value="percent_desc">Mayor progreso primero</option>
          <option value="percent_asc">Menor progreso primero</option>
          <option value="recent">Más reciente</option>
          <option value="name">Nombre A–Z</option>
        </select>
        <span style={{ fontSize: 13, color: C.textDisabled }}>{filtered.length} registros</span>
      </div>

      {/* Table */}
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: C.primary }}>
              {['Estudiante','Curso','Profesor','Videos vistos','Progreso','Último acceso','Estado'].map(h => (
                <th key={h} style={{ padding: '14px 18px', textAlign: 'left', fontSize: 12, color: C.textDisabled, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: C.textDisabled }}>Sin resultados</td></tr>
            ) : filtered.map((p, i) => {
              const course  = courses.find(c => c.id === p.courseId)
              const teacher = teachers.find(t => t.id === course?.teacherId)
              const status  = p.percent === 100 ? { label: 'Completado', bg: `${C.success}22`, color: C.success }
                            : p.percent > 0     ? { label: 'En progreso', bg: `${C.objects2}22`, color: '#9B94E0' }
                            : { label: 'Sin iniciar', bg: `${C.textDisabled}22`, color: C.textDisabled }
              return (
                <tr key={`${p.userId}-${p.courseId}`} style={{ borderTop: `1px solid ${C.border}`, background: i % 2 === 0 ? 'transparent' : `${C.primary}55` }}>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: p.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: C.textPrimary, flexShrink: 0 }}>
                        {p.userAvatar}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{p.userName}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: C.textSecondary, maxWidth: 200 }}>
                    <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{course?.name || '—'}</span>
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: C.textDisabled, whiteSpace: 'nowrap' }}>{teacher?.name.split(' ')[0] || '—'}</td>
                  <td style={{ padding: '14px 18px', fontSize: 13, color: C.textSecondary, textAlign: 'center' }}>
                    <span style={{ fontWeight: 700, color: C.textPrimary }}>{p.videosWatched}</span>
                    <span style={{ color: C.textDisabled }}> / {p.totalVideos}</span>
                  </td>
                  <td style={{ padding: '14px 18px', minWidth: 160 }}>
                    <ProgressBar percent={p.percent} />
                  </td>
                  <td style={{ padding: '14px 18px', fontSize: 12, color: C.textDisabled, whiteSpace: 'nowrap' }}>{p.lastSeen}</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontSize: 12, fontWeight: 500, background: status.bg, color: status.color, padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                      {status.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Per-course breakdown */}
      <div style={{ ...card }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: C.textPrimary, marginBottom: 20 }}>Resumen por curso</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {courses.map(c => {
            const rows      = progress.filter(p => p.courseId === c.id)
            const avg       = rows.length ? Math.round(rows.reduce((a, p) => a + p.percent, 0) / rows.length) : 0
            const done      = rows.filter(p => p.percent === 100).length
            const teacher   = teachers.find(t => t.id === c.teacherId)
            return (
              <div key={c.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary }}>{c.name}</p>
                    <p style={{ fontSize: 12, color: C.textDisabled }}>{teacher?.name} · {rows.length} estudiantes · {done} completados</p>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.accentuate }}>{avg}% avg</span>
                </div>
                <ProgressBar percent={avg} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
