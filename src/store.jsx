import { createContext, useContext, useState } from 'react'

// ── Seed data ──────────────────────────────────────────────────────────────
const SEED_TEACHERS = [
  { id: 1, name: 'María González',  email: 'maria@mysticlearn.mx',  specialty: 'React · TypeScript', avatar: 'MG', avatarBg: '#4E41A6', createdAt: '2025-10-12' },
  { id: 2, name: 'Ana Torres',      email: 'ana@mysticlearn.mx',    specialty: 'IA · Python',        avatar: 'AT', avatarBg: '#42378C', createdAt: '2025-11-03' },
  { id: 3, name: 'Carlos Ruiz',     email: 'carlos@mysticlearn.mx', specialty: 'UI/UX · Figma',      avatar: 'CR', avatarBg: '#D98B79', createdAt: '2026-01-18' },
  { id: 4, name: 'Sofía Vargas',    email: 'sofia@mysticlearn.mx',  specialty: 'Ciberseguridad',     avatar: 'SV', avatarBg: '#4E41A6', createdAt: '2026-02-05' },
]

const SEED_COURSES = [
  {
    id: 1, teacherId: 1, name: 'React & TypeScript: De cero a producción',
    category: 'Desarrollo Web', rating: 4.9, totalRatings: 3841,
    createdAt: '2025-11-01',
    videos: [
      { id: 'v1', title: 'Introducción al curso',         duration: '12:30', order: 1 },
      { id: 'v2', title: 'Configuración del entorno',     duration: '18:45', order: 2 },
      { id: 'v3', title: 'Componentes y props',           duration: '24:10', order: 3 },
      { id: 'v4', title: 'Estado con useState',           duration: '31:20', order: 4 },
      { id: 'v5', title: 'Efectos con useEffect',         duration: '28:55', order: 5 },
    ],
  },
  {
    id: 2, teacherId: 2, name: 'Python para IA: Machine Learning práctico',
    category: 'Inteligencia Artificial', rating: 4.9, totalRatings: 5672,
    createdAt: '2025-12-10',
    videos: [
      { id: 'v6',  title: 'Fundamentos de Python para IA', duration: '20:00', order: 1 },
      { id: 'v7',  title: 'NumPy y Pandas',                duration: '35:00', order: 2 },
      { id: 'v8',  title: 'Regresión lineal',              duration: '40:00', order: 3 },
    ],
  },
  {
    id: 3, teacherId: 3, name: 'Diseño de sistemas con Figma avanzado',
    category: 'UI/UX Design', rating: 4.8, totalRatings: 2105,
    createdAt: '2026-01-20',
    videos: [
      { id: 'v9',  title: 'Introducción a Figma',         duration: '15:00', order: 1 },
      { id: 'v10', title: 'Componentes y variantes',      duration: '22:30', order: 2 },
      { id: 'v11', title: 'Auto Layout avanzado',         duration: '27:00', order: 3 },
      { id: 'v12', title: 'Design Tokens',                duration: '19:45', order: 4 },
    ],
  },
]

const SEED_PROGRESS = [
  { userId: 'u1', userName: 'Pedro Alonso',    userAvatar: 'PA', avatarBg: '#6B6785', courseId: 1, percent: 85, lastSeen: '2026-04-20', videosWatched: 4, totalVideos: 5 },
  { userId: 'u2', userName: 'Laura Méndez',    userAvatar: 'LM', avatarBg: '#4E41A6', courseId: 1, percent: 40, lastSeen: '2026-04-18', videosWatched: 2, totalVideos: 5 },
  { userId: 'u3', userName: 'Ricardo Flores',  userAvatar: 'RF', avatarBg: '#D98B79', courseId: 1, percent: 100, lastSeen: '2026-04-15', videosWatched: 5, totalVideos: 5 },
  { userId: 'u4', userName: 'Carmen Vega',     userAvatar: 'CV', avatarBg: '#42378C', courseId: 2, percent: 67, lastSeen: '2026-04-19', videosWatched: 2, totalVideos: 3 },
  { userId: 'u5', userName: 'Diego Salinas',   userAvatar: 'DS', avatarBg: '#4E41A6', courseId: 2, percent: 33, lastSeen: '2026-04-17', videosWatched: 1, totalVideos: 3 },
  { userId: 'u6', userName: 'Valeria Cruz',    userAvatar: 'VC', avatarBg: '#D98B79', courseId: 3, percent: 75, lastSeen: '2026-04-21', videosWatched: 3, totalVideos: 4 },
  { userId: 'u7', userName: 'Marcos León',     userAvatar: 'ML', avatarBg: '#42378C', courseId: 3, percent: 25, lastSeen: '2026-04-16', videosWatched: 1, totalVideos: 4 },
  { userId: 'u8', userName: 'Isabela Mora',    userAvatar: 'IM', avatarBg: '#6B6785', courseId: 1, percent: 60, lastSeen: '2026-04-20', videosWatched: 3, totalVideos: 5 },
]

const SEED_REVIEWS = [
  { id: 1, userId: 'u3', userName: 'Ricardo Flores', userAvatar: 'RF', avatarBg: '#D98B79', courseId: 1, stars: 5, comment: 'Excelente curso, muy completo y bien explicado.', date: '2026-04-15' },
  { id: 2, userId: 'u1', userName: 'Pedro Alonso',   userAvatar: 'PA', avatarBg: '#6B6785', courseId: 1, stars: 5, comment: 'Aprendí muchísimo. El instructor explica muy claro.', date: '2026-04-20' },
  { id: 3, userId: 'u2', userName: 'Laura Méndez',   userAvatar: 'LM', avatarBg: '#4E41A6', courseId: 1, stars: 4, comment: 'Muy buen contenido, algunos videos podrían ser más cortos.', date: '2026-04-18' },
  { id: 4, userId: 'u4', userName: 'Carmen Vega',    userAvatar: 'CV', avatarBg: '#42378C', courseId: 2, stars: 5, comment: 'La mejor introducción a ML que he encontrado.', date: '2026-04-19' },
  { id: 5, userId: 'u5', userName: 'Diego Salinas',  userAvatar: 'DS', avatarBg: '#4E41A6', courseId: 2, stars: 4, comment: 'Muy completo. Me gustaría más ejercicios prácticos.', date: '2026-04-17' },
  { id: 6, userId: 'u6', userName: 'Valeria Cruz',   userAvatar: 'VC', avatarBg: '#D98B79', courseId: 3, stars: 5, comment: 'Figma nunca había sido tan claro. 100% recomendado.', date: '2026-04-21' },
  { id: 7, userId: 'u7', userName: 'Marcos León',    userAvatar: 'ML', avatarBg: '#42378C', courseId: 3, stars: 3, comment: 'Buen curso pero avanza muy rápido al principio.', date: '2026-04-16' },
]

// ── Context ────────────────────────────────────────────────────────────────
const StoreCtx = createContext(null)

export function StoreProvider({ children }) {
  const [teachers, setTeachers]   = useState(SEED_TEACHERS)
  const [courses,  setCourses]    = useState(SEED_COURSES)
  const [progress]                = useState(SEED_PROGRESS)
  const [reviews]                 = useState(SEED_REVIEWS)
  const [nextTeacherId, setNextTId] = useState(SEED_TEACHERS.length + 1)
  const [nextCourseId,  setNextCId] = useState(SEED_COURSES.length  + 1)
  const [nextReviewId]              = useState(SEED_REVIEWS.length  + 1)

  const AVATAR_COLORS = ['#4E41A6','#D98B79','#42378C','#6B6785']

  function addTeacher(data) {
    const initials = data.name.split(' ').slice(0,2).map(w => w[0]).join('').toUpperCase()
    const teacher = {
      id: nextTeacherId,
      ...data,
      avatar: initials,
      avatarBg: AVATAR_COLORS[nextTeacherId % 4],
      createdAt: new Date().toISOString().slice(0,10),
    }
    setTeachers(prev => [...prev, teacher])
    setNextTId(n => n + 1)
    return teacher
  }

  function updateTeacher(id, data) {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, ...data } : t))
  }

  function deleteTeacher(id) {
    setTeachers(prev => prev.filter(t => t.id !== id))
  }

  function addCourse(data) {
    const course = {
      id: nextCourseId,
      ...data,
      rating: 0,
      totalRatings: 0,
      createdAt: new Date().toISOString().slice(0,10),
      videos: data.videos || [],
    }
    setCourses(prev => [...prev, course])
    setNextCId(n => n + 1)
    return course
  }

  function updateCourse(id, data) {
    setCourses(prev => prev.map(c => c.id === id ? { ...c, ...data } : c))
  }

  function deleteCourse(id) {
    setCourses(prev => prev.filter(c => c.id !== id))
  }

  return (
    <StoreCtx.Provider value={{ teachers, courses, progress, reviews, addTeacher, updateTeacher, deleteTeacher, addCourse, updateCourse, deleteCourse }}>
      {children}
    </StoreCtx.Provider>
  )
}

export const useStore = () => useContext(StoreCtx)
