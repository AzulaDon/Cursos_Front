import { useState } from 'react'
import { C, inputStyle, btnPrimary } from '../theme'

export default function LoginPage({ onLogin }) {
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const ADMIN_EMAIL = 'admin@mysticlearn.mx'
  const ADMIN_PASS  = 'admin123'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASS) {
      onLogin()
    } else {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: C.primary, display: 'flex', fontFamily: "'DM Sans', sans-serif" }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: `linear-gradient(160deg, ${C.secondary} 0%, ${C.primary} 100%)`, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px', borderRight: `1px solid ${C.border}`, position: 'relative', overflow: 'hidden' }}>
        {/* BG decorations */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: C.objects2, opacity: 0.08 }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: C.accentuate, opacity: 0.07 }} />

        <div style={{ maxWidth: 420, zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: C.objects2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#EAEAF0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: C.textPrimary }}>
              Mystic<span style={{ color: C.accentuate }}>Learn</span>
            </span>
          </div>

          <h1 style={{ fontSize: 42, fontWeight: 800, fontFamily: "'Syne', sans-serif", lineHeight: 1.15, color: C.textPrimary, marginBottom: 20 }}>
            Panel de<br /><span style={{ color: C.accentuate }}>Administración</span>
          </h1>
          <p style={{ fontSize: 16, color: C.textSecondary, lineHeight: 1.8, marginBottom: 48 }}>
            Gestiona profesores, cursos, visualizaciones y calificaciones desde un solo lugar.
          </p>

          {/* Feature bullets */}
          {[
            ['👩‍🏫', 'Alta de profesores y especialidades'],
            ['📚', 'Creación y edición de cursos con videos'],
            ['📊', 'Seguimiento de progreso por usuario'],
            ['⭐', 'Revisión de calificaciones y reseñas'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.objects2}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{icon}</div>
              <span style={{ fontSize: 14, color: C.textSecondary }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div style={{ width: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '48px' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: C.textPrimary, marginBottom: 8 }}>Iniciar sesión</h2>
          <p style={{ fontSize: 14, color: C.textDisabled, marginBottom: 36 }}>Acceso exclusivo para administradores</p>

          {/* Hint */}
          <div style={{ background: `${C.objects2}22`, border: `1px solid ${C.objects2}44`, borderRadius: 10, padding: '10px 14px', marginBottom: 28, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
            <div>
              <p style={{ fontSize: 12, color: '#9B94E0', fontWeight: 600, marginBottom: 2 }}>Credenciales de prueba</p>
              <p style={{ fontSize: 12, color: C.textDisabled }}>Email: <span style={{ color: C.textSecondary }}>admin@mysticlearn.mx</span></p>
              <p style={{ fontSize: 12, color: C.textDisabled }}>Contraseña: <span style={{ color: C.textSecondary }}>admin123</span></p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ fontSize: 13, color: C.textSecondary, display: 'block', marginBottom: 8, fontWeight: 500 }}>Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@mysticlearn.mx"
                required
                style={{ ...inputStyle }}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, color: C.textSecondary, display: 'block', marginBottom: 8, fontWeight: 500 }}>Contraseña</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{ ...inputStyle, paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: C.textDisabled, cursor: 'pointer', fontSize: 16 }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: '#E06C7522', border: '1px solid #E06C7544', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#E06C75', display: 'flex', gap: 8, alignItems: 'center' }}>
                <span>⚠️</span> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ ...btnPrimary, width: '100%', padding: '13px', fontSize: 15, marginTop: 8, opacity: loading ? 0.75 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              {loading ? (
                <><span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⏳</span> Verificando...</>
              ) : 'Ingresar al panel →'}
            </button>
          </form>

          <p style={{ fontSize: 12, color: C.textDisabled, textAlign: 'center', marginTop: 32 }}>
            Acceso restringido · Solo personal autorizado
          </p>
        </div>
      </div>
    </div>
  )
}
