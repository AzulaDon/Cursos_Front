import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { docentes, cursos, admin, calificaciones } from './api'

const StoreCtx = createContext(null)

const AVATAR_COLORS = ['#4E41A6', '#D98B79', '#42378C', '#6B6785']

function makeAvatar(name) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

// Mapea la respuesta del backend a la forma que usa el frontend
function mapDocente(d, i) {
  return {
    id:        d.id,
    name:      d.nombre,
    email:     d.correo,
    specialty: d.especialidad,
    avatar:    makeAvatar(d.nombre),
    avatarBg:  AVATAR_COLORS[d.id % 4],
    createdAt: d.fechaRegistro?.slice(0, 10) ?? '—',
  }
}

function mapCurso(c) {
  return {
    id:           c.id,
    teacherId:    c.docenteId,
    name:         c.titulo,
    category:     c.categoria ?? '—',
    rating:       c.calificacionPromedio ?? 0,
    totalRatings: c.totalCalificaciones ?? 0,
    estatus:      c.estatus,
    createdAt:    c.fechaCreacion?.slice(0, 10) ?? '—',
    videos:       [],   // se cargan aparte cuando se necesiten
  }
}

function mapProgreso(p) {
  return {
    userId:        String(p.inscripcionId),
    userName:      p.estudiante,
    userAvatar:    makeAvatar(p.estudiante),
    avatarBg:      AVATAR_COLORS[p.inscripcionId % 4],
    courseId:      p.cursoId ?? 0,
    courseName:    p.curso,
    percent:       Math.round(p.avancePorcentaje ?? 0),
    lastSeen:      '—',
    videosWatched: p.videosVistos ?? 0,
    totalVideos:   0,
    finalizado:    p.finalizado,
  }
}

function mapReview(r) {
  return {
    id:          r.id,
    userId:      String(r.inscripcionId),
    userName:    r.usuarioNombre,
    userAvatar:  makeAvatar(r.usuarioNombre),
    avatarBg:    AVATAR_COLORS[r.id % 4],
    courseId:    r.cursoId,
    stars:       r.estrellas,
    comment:     r.comentario ?? '',
    date:        r.fechaResena?.slice(0, 10) ?? '—',
  }
}

export function StoreProvider({ children }) {
  const [teachers,  setTeachers]  = useState([])
  const [courses,   setCourses]   = useState([])
  const [progress,  setProgress]  = useState([])
  const [reviews,   setReviews]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(null)

  // ── Carga inicial ────────────────────────────────────────────────────────
  const loadAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [docentesData, cursosData, progresoData, reviewsData] = await Promise.all([
        docentes.getAll(),
        cursos.getTodos(),
        admin.getDashboardProgreso(),
        admin.getDashboardCalificaciones(),
      ])
      setTeachers(docentesData.map(mapDocente))
      setCourses(cursosData.map(mapCurso))
      setProgress(progresoData.map(mapProgreso))
      setReviews(reviewsData.map(mapReview))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) loadAll()
    else setLoading(false)
  }, [loadAll])

  // ── Docentes ─────────────────────────────────────────────────────────────
  async function addTeacher(data) {
    const res = await docentes.create({
      nombre:       data.name,
      correo:       data.email,
      especialidad: data.specialty,
    })
    const mapped = mapDocente(res)
    setTeachers(prev => [...prev, mapped])
    return mapped
  }

  async function updateTeacher(id, data) {
    const res = await docentes.update(id, {
      nombre:       data.name,
      correo:       data.email,
      especialidad: data.specialty,
    })
    const mapped = mapDocente(res)
    setTeachers(prev => prev.map(t => t.id === id ? mapped : t))
  }

  async function deleteTeacher(id) {
    await docentes.delete(id)
    setTeachers(prev => prev.filter(t => t.id !== id))
  }

  // ── Cursos ────────────────────────────────────────────────────────────────
  async function addCourse(data) {
    // 1. Crear el curso
    const res = await cursos.create({
      docenteId:   data.teacherId,
      titulo:      data.name,
      categoria:   data.category,
      estatus:     'ACTIVO',
    })
    const mapped = mapCurso(res)

    // 2. Crear los videos asociados en secuencia
    const videosCreados = []
    for (const v of data.videos) {
      try {
        const vRes = await import('./api').then(m => m.videos.create({
          cursoId:        mapped.id,
          titulo:         v.title,
          urlStream:      v.urlStream ?? 'https://placeholder.com/video.mp4',
          ordenSecuencia: v.order,
          duracionSeg:    parseDuration(v.duration),
        }))
        videosCreados.push(mapVideo(vRes))
      } catch (_) { /* ignorar errores individuales de video */ }
    }

    const full = { ...mapped, videos: videosCreados }
    setCourses(prev => [...prev, full])
    return full
  }

  async function updateCourse(id, data) {
    const res = await cursos.update(id, {
      docenteId:   data.teacherId,
      titulo:      data.name,
      categoria:   data.category,
      estatus:     data.estatus ?? 'ACTIVO',
    })
    const mapped = { ...mapCurso(res), videos: data.videos ?? [] }
    setCourses(prev => prev.map(c => c.id === id ? mapped : c))
  }

  async function deleteCourse(id) {
    await cursos.delete(id)
    setCourses(prev => prev.filter(c => c.id !== id))
  }

  return (
    <StoreCtx.Provider value={{
      teachers, courses, progress, reviews,
      loading, error,
      loadAll,
      addTeacher, updateTeacher, deleteTeacher,
      addCourse,  updateCourse,  deleteCourse,
    }}>
      {children}
    </StoreCtx.Provider>
  )
}

export const useStore = () => useContext(StoreCtx)

// ── Helpers ────────────────────────────────────────────────────────────────
function mapVideo(v) {
  return {
    id:       v.id,
    title:    v.titulo,
    duration: formatDuration(v.duracionSeg),
    order:    v.ordenSecuencia,
    urlStream: v.urlStream,
  }
}

// "12:30" → 750 segundos
function parseDuration(str = '') {
  const parts = String(str).split(':').map(Number)
  if (parts.length === 2) return (parts[0] * 60) + parts[1]
  if (parts.length === 1 && !isNaN(parts[0])) return parts[0]
  return 0
}

// 750 → "12:30"
function formatDuration(secs = 0) {
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${String(s).padStart(2, '0')}`
}