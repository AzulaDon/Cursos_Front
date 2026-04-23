import { useState, useEffect } from 'react'
import { StoreProvider } from './store'
import LoginPage   from './admin/LoginPage'
import AdminLayout from './admin/AdminLayout'
import { cursos, categorias } from './api'

// ─── Colores ────────────────────────────────────────────────────────────────
const C = { primary:'#181126', secondary:'#2D1F40', objects:'#42378C', objects2:'#4E41A6', accent:'#D98B79', textPrimary:'#EAEAF0', textSecondary:'#B8B5C9', textDisabled:'#6B6785', border:'#42378C33' }

const NAV_LINKS = ['Explorar', 'Mis cursos', 'Instructores', 'Empresas']

const CAT_ICONS = {
  'Desarrollo Web':'⚡','UI/UX Design':'🎨','Inteligencia Artificial':'🤖',
  'Apps Móviles':'📱','Ciberseguridad':'🔐','Cloud & DevOps':'☁️',
  'Data Science':'📊','Videojuegos':'🎮',
}
const DEFAULT_ICON = '📚'

const GRADIENTS = [
  'linear-gradient(135deg,#2D1F40,#4E41A6)',
  'linear-gradient(135deg,#181126,#D98B7955)',
  'linear-gradient(135deg,#2D1F40,#42378C)',
  'linear-gradient(135deg,#181126,#2D1F40)',
  'linear-gradient(135deg,#181126,#4E41A6)',
  'linear-gradient(135deg,#2D1F40,#D98B7944)',
]

function Stars({ r }) {
  return <span style={{color:'#D98B79',fontSize:12}}>{'★'.repeat(Math.floor(r))}{'☆'.repeat(5-Math.floor(r))}</span>
}

function CourseCard({ c, onEnroll, enrolled }) {
  const [h, setH] = useState(false)
  const icon     = CAT_ICONS[c.categoria] ?? DEFAULT_ICON
  const gradient = GRADIENTS[c.id % GRADIENTS.length]
  const rating   = c.promedioEstrellas ?? 0   // nombre real en CursoDTO
  const reviews  = c.totalResenas      ?? 0   // nombre real en CursoDTO
  const docente  = c.docente?.nombre   ?? null // viene como objeto anidado

  return (
    <div
      onMouseEnter={()=>setH(true)}
      onMouseLeave={()=>setH(false)}
      style={{background:C.secondary,borderRadius:16,overflow:'hidden',border:`1px solid ${h?C.objects2:C.border}`,transition:'all .2s',transform:h?'translateY(-4px)':'none',cursor:'pointer',display:'flex',flexDirection:'column'}}
    >
      <div style={{background:gradient,height:130,display:'flex',alignItems:'center',justifyContent:'center',fontSize:48,position:'relative'}}>
        {icon}
        {c.estatus && (
          <span style={{position:'absolute',top:10,left:10,fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:6,background:c.estatus==='ACTIVO'?'#D98B79':'#42378C',color:'#181126',textTransform:'uppercase',letterSpacing:0.5}}>
            {c.estatus}
          </span>
        )}
      </div>
      <div style={{padding:'1rem',flex:1,display:'flex',flexDirection:'column',gap:8}}>
        <p style={{fontSize:10,color:C.textDisabled,textTransform:'uppercase',letterSpacing:1}}>{c.categoria ?? 'General'}</p>
        <h3 style={{fontSize:14,fontWeight:700,color:C.textPrimary,lineHeight:1.4,fontFamily:"'Syne',sans-serif"}}>{c.titulo}</h3>
        {docente && (
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:22,height:22,borderRadius:'50%',background:C.objects2,display:'flex',alignItems:'center',justifyContent:'center',fontSize:9,fontWeight:700,color:C.textPrimary}}>
              {docente.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase()}
            </div>
            <span style={{fontSize:12,color:C.textSecondary}}>{docente}</span>
          </div>
        )}
        {rating > 0 && (
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <Stars r={rating}/>
            <span style={{fontSize:12,fontWeight:700,color:'#D98B79'}}>{rating.toFixed(1)}</span>
            <span style={{fontSize:11,color:C.textDisabled}}>({reviews})</span>
          </div>
        )}
        {c.descripcion && (
          <p style={{fontSize:12,color:C.textDisabled,lineHeight:1.5,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
            {c.descripcion}
          </p>
        )}
        <div style={{marginTop:'auto',paddingTop:8,display:'flex',alignItems:'center',justifyContent:'flex-end',borderTop:`1px solid ${C.border}`}}>
          <button
            onClick={()=>onEnroll(c)}
            style={{background:enrolled?`${C.objects2}44`:'#D98B79',border:'none',borderRadius:8,padding:'7px 14px',color:enrolled?'#9B94E0':'#181126',fontSize:12,fontWeight:700,cursor:'pointer'}}
          >
            {enrolled ? '✓ Inscrito' : 'Inscribirse'}
          </button>
        </div>
      </div>
    </div>
  )
}

function PublicSite({ onAdminClick }) {
  const [activeNav, setActiveNav] = useState('Explorar')
  const [activeCat, setActiveCat] = useState(null)
  const [search,    setSearch]    = useState('')
  const [enrolled,  setEnrolled]  = useState([])
  const [toast,     setToast]     = useState('')
  const [courseList, setCourseList] = useState([])
  const [catList,    setCatList]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  useEffect(() => {
    setLoading(true)
    Promise.all([cursos.getActivos(), categorias.getAll()])
      .then(([cs, cats]) => { setCourseList(cs); setCatList(cats) })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const filtered = courseList.filter(c => {
    const mc = !activeCat || c.categoria === activeCat
    const ms = !search    || c.titulo.toLowerCase().includes(search.toLowerCase())
    return mc && ms
  })

  function enroll(c) {
    if (!enrolled.includes(c.id)) {
      setEnrolled(p => [...p, c.id])
      setToast(`✅ Inscrito en "${c.titulo}"`)
      setTimeout(() => setToast(''), 3000)
    }
  }

  return (
    <div style={{minHeight:'100vh',background:C.primary,fontFamily:"'DM Sans',sans-serif",color:C.textPrimary}}>
      {toast && (
        <div style={{position:'fixed',bottom:32,right:32,background:C.secondary,border:`1px solid ${C.objects}`,borderRadius:12,padding:'12px 20px',fontSize:14,zIndex:999,boxShadow:'0 8px 32px #00000066'}}>
          {toast}
        </div>
      )}

      {/* NAV */}
      <nav style={{background:C.secondary,borderBottom:`1px solid ${C.border}`,position:'sticky',top:0,zIndex:100}}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 32px',height:64,display:'flex',alignItems:'center',gap:24}}>
          <div style={{display:'flex',alignItems:'center',gap:10,flexShrink:0}}>
            <div style={{width:36,height:36,borderRadius:10,background:C.objects2,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#EAEAF0" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{fontSize:20,fontWeight:800,fontFamily:"'Syne',sans-serif"}}>Mystic<span style={{color:'#D98B79'}}>Learn</span></span>
          </div>
          <div style={{flex:1,maxWidth:440,position:'relative'}}>
            <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:C.textDisabled}}>🔍</span>
            <input
              value={search}
              onChange={e=>setSearch(e.target.value)}
              placeholder="Buscar cursos..."
              style={{width:'100%',background:C.primary,border:`1px solid ${C.border}`,borderRadius:10,padding:'8px 12px 8px 34px',color:C.textPrimary,fontSize:14,outline:'none'}}
            />
          </div>
          <div style={{display:'flex',gap:2}}>
            {NAV_LINKS.map(l=>(
              <button key={l} onClick={()=>setActiveNav(l)} style={{background:activeNav===l?`${C.objects2}22`:'transparent',border:'none',borderRadius:8,padding:'6px 14px',color:activeNav===l?'#D98B79':C.textSecondary,fontSize:14,cursor:'pointer',fontWeight:activeNav===l?600:400}}>{l}</button>
            ))}
          </div>
          <div style={{display:'flex',gap:10,flexShrink:0}}>
            {enrolled.length > 0 && (
              <span style={{background:`${C.accent}22`,border:`1px solid ${C.accent}44`,borderRadius:8,padding:'6px 12px',fontSize:13,color:'#D98B79',fontWeight:600}}>
                {enrolled.length} curso{enrolled.length>1?'s':''}
              </span>
            )}
            <button onClick={onAdminClick} style={{background:'transparent',border:`1px solid ${C.border}`,borderRadius:8,padding:'6px 14px',color:C.textSecondary,fontSize:13,cursor:'pointer'}}>Admin 🔐</button>
            <button style={{background:'#D98B79',border:'none',borderRadius:8,padding:'6px 16px',color:'#181126',fontSize:13,fontWeight:700,cursor:'pointer'}}>Registrarse</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{background:'linear-gradient(135deg,#2D1F40 0%,#181126 60%)',borderBottom:`1px solid ${C.border}`,padding:'72px 32px'}}>
        <div style={{maxWidth:1280,margin:'0 auto'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,background:`${C.objects2}22`,border:`1px solid ${C.objects2}55`,borderRadius:20,padding:'6px 14px',marginBottom:24}}>
            <span>🚀</span>
            <span style={{fontSize:13,color:'#9B94E0',fontWeight:500}}>
              {courseList.length > 0 ? `${courseList.length} cursos disponibles` : 'Cargando cursos...'}
            </span>
          </div>
          <h1 style={{fontSize:52,fontWeight:800,fontFamily:"'Syne',sans-serif",lineHeight:1.1,marginBottom:20}}>
            Aprende sin <span style={{color:'#D98B79'}}>límites.</span><br/>Crece sin <span style={{color:'#9B94E0'}}>fronteras.</span>
          </h1>
          <p style={{fontSize:18,color:C.textSecondary,lineHeight:1.7,marginBottom:32,maxWidth:500}}>
            Domina las habilidades más demandadas con instructores expertos.
          </p>
          <div style={{display:'flex',gap:12}}>
            <button style={{background:'#D98B79',border:'none',borderRadius:12,padding:'14px 32px',color:'#181126',fontSize:16,fontWeight:700,cursor:'pointer'}}>Explorar cursos →</button>
            <button style={{background:'transparent',border:`1px solid ${C.objects}`,borderRadius:12,padding:'14px 24px',color:C.textPrimary,fontSize:15,cursor:'pointer'}}>Ver demo gratis</button>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS */}
      {catList.length > 0 && (
        <section style={{maxWidth:1280,margin:'0 auto',padding:'52px 32px 0'}}>
          <h2 style={{fontSize:26,fontWeight:700,fontFamily:"'Syne',sans-serif",marginBottom:20}}>Explorar categorías</h2>
          <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            <button
              onClick={()=>setActiveCat(null)}
              style={{background:!activeCat?C.objects2:C.secondary,border:`1px solid ${!activeCat?C.objects2:C.border}`,borderRadius:10,padding:'9px 18px',color:!activeCat?C.textPrimary:C.textSecondary,fontSize:14,cursor:'pointer',fontWeight:!activeCat?600:400}}
            >
              Todos
            </button>
            {catList.map(cat=>(
              <button
                key={cat}
                onClick={()=>setActiveCat(activeCat===cat?null:cat)}
                style={{background:activeCat===cat?C.objects2:C.secondary,border:`1px solid ${activeCat===cat?C.objects2:C.border}`,borderRadius:10,padding:'9px 18px',color:activeCat===cat?C.textPrimary:C.textSecondary,fontSize:14,cursor:'pointer',display:'flex',alignItems:'center',gap:8,fontWeight:activeCat===cat?600:400}}
              >
                <span>{CAT_ICONS[cat] ?? DEFAULT_ICON}</span>{cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* GRID DE CURSOS */}
      <section style={{maxWidth:1280,margin:'0 auto',padding:'36px 32px 64px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:24}}>
          <h2 style={{fontSize:26,fontWeight:700,fontFamily:"'Syne',sans-serif"}}>
            {activeCat || 'Cursos disponibles'}
            <span style={{fontSize:14,fontWeight:400,color:C.textDisabled,marginLeft:8}}>{filtered.length} cursos</span>
          </h2>
        </div>

        {loading && (
          <div style={{textAlign:'center',padding:'64px 0'}}>
            <p style={{fontSize:36,marginBottom:12}}>⏳</p>
            <p style={{fontSize:15,color:C.textSecondary}}>Cargando cursos...</p>
          </div>
        )}
        {!loading && error && (
          <div style={{textAlign:'center',padding:'64px 0'}}>
            <p style={{fontSize:36,marginBottom:12}}>⚠️</p>
            <p style={{fontSize:15,color:'#E06C75',marginBottom:8}}>No se pudo conectar con el servidor</p>
            <p style={{fontSize:13,color:C.textDisabled}}>{error}</p>
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div style={{textAlign:'center',padding:'64px 0'}}>
            <p style={{fontSize:48,marginBottom:16}}>🔍</p>
            <p style={{fontSize:16,color:C.textSecondary}}>No se encontraron cursos</p>
          </div>
        )}
        {!loading && !error && filtered.length > 0 && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:20}}>
            {filtered.map(c=>(
              <CourseCard key={c.id} c={c} onEnroll={enroll} enrolled={enrolled.includes(c.id)} />
            ))}
          </div>
        )}
      </section>

      <footer style={{background:C.secondary,borderTop:`1px solid ${C.border}`,padding:32,textAlign:'center'}}>
        <p style={{fontSize:13,color:C.textDisabled}}>© 2026 MysticLearn · Todos los derechos reservados</p>
      </footer>
    </div>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────
export default function App() {
  const [view,     setView]     = useState(() => !!localStorage.getItem('token') ? 'admin' : 'public')
  const [loggedIn, setLoggedIn] = useState(() => !!localStorage.getItem('token'))

  function handleLogin() { setLoggedIn(true); setView('admin') }
  function handleLogout() {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    setLoggedIn(false)
    setView('public')
  }

  if (view === 'login' || (view === 'admin' && !loggedIn)) {
    return <StoreProvider><LoginPage onLogin={handleLogin} /></StoreProvider>
  }
  if (view === 'admin' && loggedIn) {
    return <StoreProvider><AdminLayout onLogout={handleLogout} /></StoreProvider>
  }
  return <PublicSite onAdminClick={() => setView('login')} />
}