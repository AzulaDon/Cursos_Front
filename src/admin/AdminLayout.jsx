import { useState } from 'react'
import { C } from '../theme'
import TeachersPage  from './TeachersPage'
import CoursesPage   from './CoursesPage'
import ProgressPage  from './ProgressPage'
import ReviewsPage   from './ReviewsPage'
import DashboardPage from './DashboardPage'

const NAV = [
  { id: 'dashboard',  label: 'Dashboard',      icon: '📊' },
  { id: 'teachers',   label: 'Profesores',      icon: '👩‍🏫' },
  { id: 'courses',    label: 'Cursos',          icon: '📚' },
  { id: 'progress',   label: 'Visualizaciones', icon: '📈' },
  { id: 'reviews',    label: 'Calificaciones',  icon: '⭐' },
]

export default function AdminLayout({ onLogout }) {
  const [section, setSection] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  const PAGES = {
    dashboard: <DashboardPage />,
    teachers:  <TeachersPage />,
    courses:   <CoursesPage />,
    progress:  <ProgressPage />,
    reviews:   <ReviewsPage />,
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.primary, fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── SIDEBAR ── */}
      <aside style={{ width: collapsed ? 68 : 240, background: C.secondary, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', transition: 'width 0.25s ease', overflow: 'hidden', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '22px 16px' : '22px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${C.border}` }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: C.objects2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#EAEAF0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          {!collapsed && <span style={{ fontSize: 17, fontWeight: 800, fontFamily: "'Syne', sans-serif", color: C.textPrimary, whiteSpace: 'nowrap' }}>Mystic<span style={{ color: C.accentuate }}>Learn</span></span>}
        </div>

        {/* Admin badge */}
        {!collapsed && (
          <div style={{ margin: '14px 12px 8px', background: `${C.objects2}22`, border: `1px solid ${C.objects2}44`, borderRadius: 10, padding: '10px 14px' }}>
            <p style={{ fontSize: 11, color: '#9B94E0', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8 }}>Panel Admin</p>
            <p style={{ fontSize: 13, color: C.textSecondary, marginTop: 2 }}>admin@mysticlearn.mx</p>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 3, marginTop: collapsed ? 8 : 0 }}>
          {NAV.map(item => {
            const active = section === item.id
            return (
              <button
                key={item.id}
                onClick={() => setSection(item.id)}
                title={collapsed ? item.label : ''}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: collapsed ? '11px 0' : '11px 14px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: active ? C.objects2 : 'transparent',
                  color: active ? C.textPrimary : C.textSecondary,
                  width: '100%', textAlign: 'left', transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{item.label}</span>}
                {!collapsed && active && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: C.accentuate }} />}
              </button>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 10px', borderTop: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            onClick={() => setCollapsed(v => !v)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10, padding: collapsed ? '9px 0' : '9px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: C.textDisabled, cursor: 'pointer', width: '100%', fontSize: 14 }}
          >
            <span style={{ fontSize: 18 }}>{collapsed ? '→' : '←'}</span>
            {!collapsed && 'Colapsar'}
          </button>
          <button
            onClick={onLogout}
            style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 10, padding: collapsed ? '9px 0' : '9px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: '#E06C75', cursor: 'pointer', width: '100%', fontSize: 14 }}
          >
            <span style={{ fontSize: 18 }}>🚪</span>
            {!collapsed && 'Cerrar sesión'}
          </button>
        </div>
      </aside>

      {/* ── CONTENT ── */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Topbar */}
        <div style={{ background: C.secondary, borderBottom: `1px solid ${C.border}`, padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: C.textPrimary, fontFamily: "'Syne', sans-serif" }}>
              {NAV.find(n => n.id === section)?.label}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: C.textDisabled }}>{new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: C.objects2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: C.textPrimary }}>AD</div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '32px' }}>
          {PAGES[section]}
        </div>
      </main>
    </div>
  )
}
