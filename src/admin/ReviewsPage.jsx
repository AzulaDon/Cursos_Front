import { useState } from 'react'
import { useStore } from '../store'
import { C, card, inputStyle } from '../theme'

function Stars({ count, size = 16, interactive = false, onSelect }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(s => (
        <span
          key={s}
          onClick={() => interactive && onSelect(s)}
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          style={{ fontSize: size, color: s <= (hover || count) ? '#F5C842' : '#6B678555', cursor: interactive ? 'pointer' : 'default', transition: 'color 0.1s' }}
        >★</span>
      ))}
    </div>
  )
}

function RatingBar({ stars, count, total }) {
  const pct = total ? Math.round((count / total) * 100) : 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
      <Stars count={stars} size={13} />
      <div style={{ flex: 1, background: `${C.objects}33`, borderRadius: 4, height: 8, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: '#F5C842', borderRadius: 4 }} />
      </div>
      <span style={{ fontSize: 12, color: C.textDisabled, width: 28, textAlign: 'right' }}>{count}</span>
    </div>
  )
}

export default function ReviewsPage() {
  const { courses, reviews, teachers } = useStore()
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [filterStars,    setFilterStars]    = useState(0)
  const [search,         setSearch]         = useState('')
  const [sortBy,         setSortBy]         = useState('recent')

  const filtered = reviews
    .filter(r => selectedCourse === 'all' || r.courseId === Number(selectedCourse))
    .filter(r => filterStars === 0 || r.stars === filterStars)
    .filter(r => !search || r.userName.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'recent')     return new Date(b.date) - new Date(a.date)
      if (sortBy === 'stars_desc') return b.stars - a.stars
      if (sortBy === 'stars_asc')  return a.stars - b.stars
      return 0
    })

  // Global stats
  const totalReviews = reviews.length
  const avgGlobal    = totalReviews ? (reviews.reduce((a, r) => a + r.stars, 0) / totalReviews).toFixed(1) : '—'
  const dist         = [5,4,3,2,1].map(s => ({ stars: s, count: reviews.filter(r => r.stars === s).length }))

  // Per-course summary
  const courseSummaries = courses.map(c => {
    const rs   = reviews.filter(r => r.courseId === c.id)
    const avg  = rs.length ? (rs.reduce((a, r) => a + r.stars, 0) / rs.length).toFixed(1) : '—'
    const teacher = teachers.find(t => t.id === c.teacherId)
    return { ...c, reviewCount: rs.length, avg, teacherName: teacher?.name || '—' }
  }).sort((a, b) => b.reviewCount - a.reviewCount)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Top: global rating + distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
        <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <p style={{ fontSize: 13, color: C.textDisabled }}>Rating global</p>
          <p style={{ fontSize: 56, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: '#F5C842', lineHeight: 1 }}>{avgGlobal}</p>
          <Stars count={Math.round(Number(avgGlobal))} size={22} />
          <p style={{ fontSize: 13, color: C.textDisabled }}>{totalReviews} reseñas</p>
        </div>
        <div style={{ ...card }}>
          <p style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, marginBottom: 14 }}>Distribución de estrellas</p>
          {dist.map(({ stars, count }) => (
            <RatingBar key={stars} stars={stars} count={count} total={totalReviews} />
          ))}
        </div>
      </div>

      {/* Course rating table */}
      <div style={{ ...card }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: C.textPrimary, marginBottom: 16 }}>Calificación por curso</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {courseSummaries.map(c => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                <p style={{ fontSize: 12, color: C.textDisabled }}>{c.teacherName}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                <Stars count={Math.round(Number(c.avg) || 0)} size={14} />
                <span style={{ fontSize: 16, fontWeight: 800, color: '#F5C842', fontFamily: "'Syne', sans-serif" }}>{c.avg}</span>
                <span style={{ fontSize: 12, color: C.textDisabled }}>({c.reviewCount} reseñas)</span>
                <button onClick={() => setSelectedCourse(String(c.id))} style={{ background: `${C.objects2}22`, border: `1px solid ${C.objects2}44`, borderRadius: 8, padding: '4px 10px', color: '#9B94E0', fontSize: 12, cursor: 'pointer' }}>Ver</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 220 }}>
          <option value="all">Todos los cursos</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterStars} onChange={e => setFilterStars(Number(e.target.value))} style={{ ...inputStyle, width: 'auto', minWidth: 150 }}>
          <option value={0}>Todas las estrellas</option>
          {[5,4,3,2,1].map(s => <option key={s} value={s}>{s} estrella{s > 1 ? 's' : ''}</option>)}
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Buscar reseña..." style={{ ...inputStyle, width: 220 }} />
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ ...inputStyle, width: 'auto', minWidth: 170 }}>
          <option value="recent">Más reciente</option>
          <option value="stars_desc">Mayor calificación</option>
          <option value="stars_asc">Menor calificación</option>
        </select>
        {selectedCourse !== 'all' && (
          <button onClick={() => setSelectedCourse('all')} style={{ background: 'transparent', border: `1px solid ${C.border}`, borderRadius: 8, padding: '8px 12px', color: C.textDisabled, fontSize: 13, cursor: 'pointer' }}>× Quitar filtro</button>
        )}
        <span style={{ fontSize: 13, color: C.textDisabled }}>{filtered.length} reseñas</span>
      </div>

      {/* Reviews list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.length === 0 && <div style={{ ...card, textAlign: 'center', color: C.textDisabled, padding: '48px' }}>No hay reseñas con los filtros seleccionados</div>}
        {filtered.map(r => {
          const course = courses.find(c => c.id === r.courseId)
          return (
            <div key={r.id} style={{ ...card, display: 'flex', gap: 16 }}>
              {/* Avatar */}
              <div style={{ width: 42, height: 42, borderRadius: '50%', background: r.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: C.textPrimary, flexShrink: 0 }}>
                {r.userAvatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.textPrimary, marginRight: 10 }}>{r.userName}</span>
                    <span style={{ fontSize: 12, color: C.textDisabled }}>{r.date}</span>
                  </div>
                  <Stars count={r.stars} size={16} />
                </div>
                <p style={{ fontSize: 14, color: C.textSecondary, lineHeight: 1.6, marginBottom: 8 }}>{r.comment}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: C.textDisabled }}>Curso:</span>
                  <span style={{ fontSize: 11, background: `${C.objects2}22`, color: '#9B94E0', padding: '3px 8px', borderRadius: 6 }}>{course?.name || '—'}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
