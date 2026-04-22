import { useStore } from '../store'
import { C, card } from '../theme'

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{ ...card, display: 'flex', gap: 16, alignItems: 'center' }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: 13, color: C.textDisabled, marginBottom: 4 }}>{label}</p>
        <p style={{ fontSize: 28, fontWeight: 800, color: C.textPrimary, fontFamily: "'Syne', sans-serif" }}>{value}</p>
        {sub && <p style={{ fontSize: 12, color: C.textDisabled, marginTop: 2 }}>{sub}</p>}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { teachers, courses, progress, reviews } = useStore()

  const totalStudents = [...new Set(progress.map(p => p.userId))].length
  const avgRating = reviews.length ? (reviews.reduce((a, r) => a + r.stars, 0) / reviews.length).toFixed(1) : '—'
  const completed = progress.filter(p => p.percent === 100).length

  const topCourses = courses.map(c => {
    const enrolled = progress.filter(p => p.courseId === c.id).length
    const avgPct   = progress.filter(p => p.courseId === c.id).reduce((a, p) => a + p.percent, 0) / (enrolled || 1)
    const teacher  = teachers.find(t => t.id === c.teacherId)
    return { ...c, enrolled, avgPct: Math.round(avgPct), teacherName: teacher?.name || '—' }
  }).sort((a, b) => b.enrolled - a.enrolled)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <StatCard icon="👩‍🏫" label="Profesores registrados" value={teachers.length} sub={`Último: ${teachers.at(-1)?.name.split(' ')[0]}`} color={C.objects2} />
        <StatCard icon="📚" label="Cursos activos" value={courses.length} sub={`${courses.reduce((a,c) => a + c.videos.length, 0)} videos en total`} color={C.accentuate} />
        <StatCard icon="👥" label="Estudiantes" value={totalStudents} sub={`${completed} completaron un curso`} color={C.success} />
        <StatCard icon="⭐" label="Rating promedio" value={avgRating} sub={`${reviews.length} reseñas totales`} color="#F5C842" />
      </div>

      {/* Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Top cursos */}
        <div style={{ ...card }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: C.textPrimary, marginBottom: 20 }}>Cursos por inscripción</h3>
          {topCourses.map((c, i) => (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < topCourses.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: C.textDisabled, width: 24 }}>#{i + 1}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</p>
                <p style={{ fontSize: 11, color: C.textDisabled }}>{c.teacherName}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.accentuate }}>{c.enrolled} alumnos</p>
                <p style={{ fontSize: 11, color: C.textDisabled }}>avg {c.avgPct}%</p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent reviews */}
        <div style={{ ...card }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: C.textPrimary, marginBottom: 20 }}>Reseñas recientes</h3>
          {reviews.slice(-4).reverse().map((r, i) => {
            const course = courses.find(c => c.id === r.courseId)
            return (
              <div key={r.id} style={{ paddingBottom: 14, marginBottom: 14, borderBottom: i < 3 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>{r.userName}</span>
                  <span style={{ color: '#F5C842', fontSize: 13 }}>{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</span>
                </div>
                <p style={{ fontSize: 12, color: C.textSecondary, marginBottom: 3 }}>{r.comment}</p>
                <p style={{ fontSize: 11, color: C.textDisabled }}>{course?.name}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
