// ── Configuración base ─────────────────────────────────────────────────────
const BASE_URL = 'http://localhost:8080'

function getToken() {
  return localStorage.getItem('token')
}

async function request(method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' }
  const token = getToken()
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  })

  const json = await res.json()

  if (!res.ok) {
    const msg = json?.message || `Error ${res.status}`
    throw new Error(msg)
  }

  return json.data ?? json
}

// ── Auth ───────────────────────────────────────────────────────────────────
export const auth = {
  login:    (correo, password)           => request('POST', '/api/auth/login',   { correo, password }),
  registro: (nombre, correo, password)   => request('POST', '/api/auth/registro', { nombre, correo, password, plataforma: 'web' }),
}

// ── Docentes ───────────────────────────────────────────────────────────────
export const docentes = {
  getAll:   ()         => request('GET',    '/api/docentes'),
  getById:  (id)       => request('GET',    `/api/docentes/${id}`),
  create:   (data)     => request('POST',   '/api/docentes',    data),
  update:   (id, data) => request('PUT',    `/api/docentes/${id}`, data),
  delete:   (id)       => request('DELETE', `/api/docentes/${id}`),
}

// ── Cursos ─────────────────────────────────────────────────────────────────
export const cursos = {
  getActivos:      ()          => request('GET',    '/api/cursos'),
  getTodos:        ()          => request('GET',    '/api/cursos/todos'),
  getById:         (id)        => request('GET',    `/api/cursos/${id}`),
  getByCategoria:  (cat)       => request('GET',    `/api/cursos/categoria/${encodeURIComponent(cat)}`),
  buscar:          (q)         => request('GET',    `/api/cursos/buscar?q=${encodeURIComponent(q)}`),
  create:          (data)      => request('POST',   '/api/cursos',       data),
  update:          (id, data)  => request('PUT',    `/api/cursos/${id}`, data),
  delete:          (id)        => request('DELETE', `/api/cursos/${id}`),
}

// ── Categorías ─────────────────────────────────────────────────────────────
export const categorias = {
  getAll: () => request('GET', '/api/categorias'),
}

// ── Videos ────────────────────────────────────────────────────────────────
export const videos = {
  getByCurso: (cursoId)       => request('GET',    `/api/videos/curso/${cursoId}`),
  getById:    (id)            => request('GET',    `/api/videos/${id}`),
  create:     (data)          => request('POST',   '/api/videos',      data),
  update:     (id, data)      => request('PUT',    `/api/videos/${id}`, data),
  delete:     (id)            => request('DELETE', `/api/videos/${id}`),
}

// ── Inscripciones ──────────────────────────────────────────────────────────
export const inscripciones = {
  getMisCursos:    ()        => request('GET',  '/api/inscripciones/mis-cursos'),
  getCompletados:  ()        => request('GET',  '/api/inscripciones/completados'),
  getById:         (id)      => request('GET',  `/api/inscripciones/${id}`),
  verificar:       (cursoId) => request('GET',  `/api/inscripciones/verificar/${cursoId}`),
  inscribirse:     (cursoId) => request('POST', `/api/inscripciones/curso/${cursoId}`),
}

// ── Progreso ───────────────────────────────────────────────────────────────
export const progreso = {
  getByInscripcion:  (inscId)            => request('GET',  `/api/progreso/inscripcion/${inscId}`),
  getByVideo:        (inscId, videoId)   => request('GET',  `/api/progreso/inscripcion/${inscId}/video/${videoId}`),
  guardar:           (inscId, data)      => request('POST', `/api/progreso/inscripcion/${inscId}`, data),
}

// ── Calificaciones ─────────────────────────────────────────────────────────
export const calificaciones = {
  getByCurso:        (cursoId)    => request('GET',  `/api/calificaciones/curso/${cursoId}`),
  getPromedio:       (cursoId)    => request('GET',  `/api/calificaciones/curso/${cursoId}/promedio`),
  getByInscripcion:  (inscId)     => request('GET',  `/api/calificaciones/inscripcion/${inscId}`),
  calificar:         (inscId, data) => request('POST', `/api/calificaciones/inscripcion/${inscId}`, data),
}

// ── Certificados ───────────────────────────────────────────────────────────
export const certificados = {
  getMios:           ()       => request('GET',  '/api/certificados/mis-certificados'),
  getByInscripcion:  (inscId) => request('GET',  `/api/certificados/inscripcion/${inscId}`),
  verificar:         (codigo) => request('GET',  `/api/certificados/verificar/${codigo}`),
  generar:           (inscId) => request('POST', `/api/certificados/generar/${inscId}`),
}

// ── Admin ──────────────────────────────────────────────────────────────────
export const admin = {
  getUsuarios:             () => request('GET', '/api/admin/usuarios'),
  getDashboardProgreso:    () => request('GET', '/api/admin/dashboard/progreso'),
  getDashboardCalificaciones: () => request('GET', '/api/admin/dashboard/calificaciones'),
  getEstadisticas:         () => request('GET', '/api/admin/estadisticas'),
}