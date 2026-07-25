import React from 'react';
import { Link } from 'react-router-dom';

// â”€â”€â”€ Icons â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const I = (d: string, size = 20) => (
  <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <path d={d} />
  </svg>
);

const FEATURES = [
  {
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z',
    title: 'Agenda Intelligent',
    desc: 'Calendrier optimisÃ© par IA qui rÃ©duit les temps morts et maximise vos consultations.',
    color: '#10b981',
  },
  {
    icon: 'M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2m-4-2h4a1 1 0 0 1 0 2H9a1 1 0 0 1 0-2z',
    title: 'Dossiers MÃ©dicaux',
    desc: 'AccÃ©dez instantanÃ©ment aux historiques, ordonnances et rÃ©sultats de vos patients.',
    color: '#3b82f6',
  },
  {
    icon: 'M9 7H6a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-3M9 3h6v4H9zM9 12h6M9 16h4',
    title: 'Facturation AutomatisÃ©e',
    desc: 'GÃ©nÃ©rez factures et tiers-payant automatiquement avec tÃ©lÃ©transmission intÃ©grÃ©e.',
    color: '#d4a843',
  },
  {
    icon: 'M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
    title: 'Assistant IA',
    desc: 'Aide au diagnostic, transcription vocale et gÃ©nÃ©ration automatique de comptes-rendus.',
    color: '#a855f7',
  },
  {
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0 1 12 2.944a11.955 11.955 0 0 1-8.618 3.04A12.02 12.02 0 0 0 3 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    title: 'SÃ©curitÃ© Maximale',
    desc: 'Chiffrement bout-en-bout, conformitÃ© RGPD & HIPAA. Vos donnÃ©es restent vÃ´tres.',
    color: '#ef4444',
  },
  {
    icon: 'M15 10l4.553-2.069A1 1 0 0 1 21 8.87v6.26a1 1 0 0 1-1.447.894L15 14M3 8a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z',
    title: 'TÃ©lÃ©consultation',
    desc: 'Consultations vidÃ©o HD intÃ©grÃ©es, partage de documents et ordonnances numÃ©riques.',
    color: '#06b6d4',
  },
];

const STATS = [
  { value: '12 000+', label: 'Praticiens actifs' },
  { value: '2.4M',    label: 'Consultations / mois' },
  { value: '99.9%',   label: 'DisponibilitÃ© SLA' },
  { value: '< 2s',    label: 'Temps de rÃ©ponse' },
];

const PLANS = [
  {
    name: 'Starter',
    price: '49',
    desc: 'Pour les cabinets solo qui dÃ©marrent.',
    features: ['1 praticien', 'Agenda + Dossiers', 'Facturation de base', 'Support email'],
    featured: false,
  },
  {
    name: 'Pro',
    price: '129',
    desc: 'La solution complÃ¨te pour les praticiens exigeants.',
    features: ['Jusqu\'Ã  5 praticiens', 'Toutes les fonctionnalitÃ©s', 'Assistant IA inclus', 'TÃ©lÃ©consultation HD', 'Support prioritaire 24/7'],
    featured: true,
  },
  {
    name: 'Clinique',
    price: '399',
    desc: 'Multi-sites, multi-praticiens, SLA garanti.',
    features: ['Praticiens illimitÃ©s', 'Multi-cabinet', 'API & intÃ©grations', 'Audit HIPAA complet', 'Account manager dÃ©diÃ©'],
    featured: false,
  },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#12051f', color: '#f0f4f8', fontFamily: 'Sora, sans-serif' }}>
      {/* â”€â”€ NAV â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(18, 5, 31, 0.85)', backdropFilter: 'blur(20px)',
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        padding: '0 2rem', height: 64,
        display: 'flex', alignItems: 'center', gap: '2rem',
        maxWidth: '100%',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #FFA586, #B51A2B)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="18" height="18" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 600 }}>Doctic</span>
          <span style={{
            background: 'rgba(255,165,134,0.12)', color: '#FFA586',
            border: '0.5px solid rgba(255,165,134,0.25)',
            fontSize: 10, padding: '2px 7px', borderRadius: 10,
            fontWeight: 500, letterSpacing: '0.06em',
          }}>Medical OS</span>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: '1.5rem', flex: 1, overflow: 'hidden' }}>
          {['FonctionnalitÃ©s', 'Tarifs', 'SÃ©curitÃ©', 'Ã€ propos'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`}
              style={{ fontSize: 14, color: '#8b9ab0', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#f0f4f8')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8b9ab0')}
              className="hidden sm:block">
              {l}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/login" style={{
            padding: '9px 18px', borderRadius: 10, fontSize: 14, fontWeight: 500,
            color: '#8b9ab0',
            background: 'rgba(255,255,255,0.04)',
            border: '0.5px solid rgba(255,255,255,0.08)',
          }}>Connexion</Link>
          <Link to="/dashboard" style={{
            padding: '9px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500,
            background: '#FFA586', color: '#12051f',
          }}>Essai gratuit 14j â†’</Link>
        </div>
      </nav>

      {/* â”€â”€ HERO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section style={{
        minHeight: '90vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '5rem 2rem 4rem',
        position: 'relative', overflow: 'hidden',
        textAlign: 'center',
      }}>
        {/* BG glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400,
          background: 'radial-gradient(ellipse, rgba(255,165,134,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', left: '15%',
          width: 300, height: 300,
          background: 'radial-gradient(ellipse, rgba(181,26,43,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Badge */}
        <div className="animate-fade-up" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,165,134,0.08)', border: '0.5px solid rgba(255,165,134,0.2)',
          borderRadius: 20, padding: '6px 16px', marginBottom: '2rem',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFA586', animation: 'fadeInOut 2s infinite', display: 'block' }} />
          <span style={{ fontSize: 12, color: '#FFA586', fontWeight: 500, letterSpacing: '0.08em' }}>
            PLATEFORME MÃ‰DICALE Â· CERTIFIÃ‰E RGPD & HIPAA
          </span>
        </div>

        <h1 className="animate-fade-up delay-1" style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: 'clamp(2.8rem, 6vw, 5.5rem)',
          fontWeight: 400, lineHeight: 1.08,
          letterSpacing: '-0.02em',
          maxWidth: 820,
          marginBottom: '1.5rem',
        }}>
          La mÃ©decine moderne
          <br />
          <em style={{ color: '#FFA586', fontStyle: 'italic' }}>mÃ©rite un OS moderne.</em>
        </h1>

        <p className="animate-fade-up delay-2" style={{
          fontSize: 18, color: '#8b9ab0', lineHeight: 1.7,
          maxWidth: 580, marginBottom: '2.5rem', fontWeight: 300,
        }}>
          Une plateforme complÃ¨te, intuitive et sÃ©curisÃ©e pour les professionnels
          de santÃ© qui veulent se concentrer sur ce qui compte : leurs patients.
        </p>

        <div className="animate-fade-up delay-3" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}>
          <Link to="/dashboard" style={{
            padding: '14px 32px', borderRadius: 12, fontSize: 15, fontWeight: 500,
            background: '#FFA586', color: '#12051f',
          }}>
            DÃ©marrer gratuitement
          </Link>
          <a href="#fonctionnalitÃ©s" style={{
            padding: '14px 28px', borderRadius: 12, fontSize: 15, fontWeight: 400,
            background: 'rgba(255,255,255,0.05)', color: '#f0f4f8',
            border: '0.5px solid rgba(255,255,255,0.1)',
          }}>
            Voir la dÃ©mo â†’
          </a>
        </div>

        {/* Stats row */}
        <div className="animate-fade-up delay-4" style={{
          display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center',
          borderTop: '0.5px solid rgba(255,255,255,0.07)', paddingTop: '3rem',
        }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '2rem', fontWeight: 500, color: '#f0f4f8' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#4a5568', marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* â”€â”€ FEATURES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="fonctionnalitÃ©s" style={{ padding: '6rem 2rem', background: '#0d1117' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: 11, color: '#FFA586', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 12 }}>
              FONCTIONNALITÃ‰S
            </p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, lineHeight: 1.2, marginBottom: '1rem' }}>
              Tout ce dont vous avez besoin,<br /><em style={{ fontStyle: 'italic', color: '#8b9ab0' }}>rien de superflu.</em>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 16, overflow: 'hidden' }}>
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ DASHBOARD PREVIEW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section style={{ padding: '6rem 2rem', background: '#0a0e14' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#d4a843', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 12 }}>
            APERÃ‡U
          </p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, marginBottom: '1rem' }}>
            Un dashboard pensÃ©<br /><em style={{ fontStyle: 'italic', color: '#8b9ab0' }}>pour votre flux de travail.</em>
          </h2>
          <p style={{ fontSize: 16, color: '#8b9ab0', maxWidth: 520, margin: '0 auto 3rem', fontWeight: 300 }}>
            Tout centralisÃ© : agenda, patients, facturation et analytics en un seul coup d'Å“il.
          </p>

          {/* Mini dashboard mockup */}
          <div style={{
            background: '#161b22', border: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: 20, overflow: 'hidden',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          }}>
            {/* Window bar */}
            <div style={{ background: '#0d1117', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
              {['#ef4444','#f59e0b','#10b981'].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.7 }} />
              ))}
              <div style={{ flex: 1, margin: '0 12px', background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '4px 12px', fontSize: 11, color: '#4a5568', textAlign: 'center' }}>
                app.doctic.ma/dashboard
              </div>
            </div>

            {/* Mockup content */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 180px) 1fr', minHeight: 400 }} className="grid-cols-[180px_1fr] sm:grid-cols-1">
              {/* Fake sidebar */}
              <div style={{ background: '#0d1117', borderRight: '0.5px solid rgba(255,255,255,0.07)', padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 4 }} className="hidden sm:flex">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px', marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#FFA586,#B51A2B)', display:'flex',alignItems:'center',justifyContent:'center' }}>
                    <svg width="12" height="12" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  </div>
                  <span style={{ fontSize: 13, fontFamily:'Playfair Display,serif', fontWeight:600, color:'#f0f4f8' }}>Doctic</span>
                </div>
                {['Tableau de bord','Agenda','Patients','Facturation','Assistant IA'].map((item, i) => (
                  <div key={item} style={{
                    padding:'7px 10px', borderRadius:8, fontSize:12,
                    background: i===0?'rgba(255,165,134,0.12)':'transparent',
                    color: i===0?'#FFA586':'#4a5568',
                    display:'flex',alignItems:'center',gap:8,
                    border: i===0?'0.5px solid rgba(255,165,134,0.2)':'none',
                  }}>
                    <div style={{width:8,height:8,borderRadius:2,background:'currentColor',opacity:0.6,flexShrink:0}}/>
                    {item}
                  </div>
                ))}
              </div>

              {/* Fake main */}
              <div style={{ padding:'1.5rem', display:'flex',flexDirection:'column',gap:'1rem' }}>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(130px, 1fr))',gap:10}}>
                  {[
                    {label:'Patients',val:'1 248',t:'+12%',c:'#10b981'},
                    {label:'RDV aujourd\'hui',val:'9',t:'3 restants',c:'#3b82f6'},
                    {label:'Factures / mois',val:'42 300 MAD',t:'+8%',c:'#d4a843'},
                    {label:'TÃ©lÃ©consults',val:'24',t:'â†‘ 5',c:'#a855f7'},
                  ].map(s => (
                    <div key={s.label} style={{background:'rgba(255,255,255,0.03)',border:'0.5px solid rgba(255,255,255,0.07)',borderRadius:10,padding:'0.85rem'}}>
                      <div style={{fontSize:10,color:'#4a5568',letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:4}}>{s.label}</div>
                      <div style={{fontFamily:'Playfair Display,serif',fontSize:'1.4rem',fontWeight:500,color:'#f0f4f8',lineHeight:1}}>{s.val}</div>
                      <div style={{fontSize:10,color:s.c,marginTop:4}}>{s.t}</div>
                    </div>
                  ))}
                </div>

                {/* Chart placeholder */}
                <div style={{flex:1,background:'rgba(255,255,255,0.02)',border:'0.5px solid rgba(255,255,255,0.06)',borderRadius:12,padding:'1rem',minHeight:160,position:'relative',overflow:'hidden', textAlign: 'left'}}>
                  <div style={{fontSize:12,color:'#4a5568',marginBottom:'0.75rem'}}>ActivitÃ© â€” 7 derniers jours</div>
                  <svg viewBox="0 0 400 80" style={{width:'100%',height:80}}>
                    <defs>
                      <linearGradient id="gr" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#FFA586" stopOpacity="0.3"/>
                        <stop offset="100%" stopColor="#FFA586" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M0 60 C40 50, 60 30, 100 35 S160 20, 200 25 S280 15, 320 20 S380 30, 400 28" fill="none" stroke="#FFA586" strokeWidth="2"/>
                    <path d="M0 60 C40 50, 60 30, 100 35 S160 20, 200 25 S280 15, 320 20 S380 30, 400 28 V80 H0Z" fill="url(#gr)"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ PRICING â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="tarifs" style={{ padding: '6rem 2rem', background: '#0d1117' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p style={{ fontSize: 11, color: '#10b981', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 12 }}>TARIFS</p>
            <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, marginBottom: '0.75rem' }}>
              Transparent. Sans surprise.
            </h2>
            <p style={{ fontSize: 15, color: '#8b9ab0', fontWeight: 300 }}>14 jours d'essai gratuit, sans carte bancaire.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {PLANS.map(plan => (
              <PlanCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ SECURITY â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section id="sÃ©curitÃ©" style={{ padding: '6rem 2rem', background: '#0a0e14' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 11, color: '#ef4444', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, marginBottom: 12 }}>SÃ‰CURITÃ‰</p>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, marginBottom: '1rem' }}>
            Vos donnÃ©es, votre forteresse.
          </h2>
          <p style={{ fontSize: 16, color: '#8b9ab0', maxWidth: 540, margin: '0 auto 3rem', fontWeight: 300, lineHeight: 1.7 }}>
            Architecture multi-tenant isolÃ©e, chiffrement AES-256, sessions Redis sÃ©curisÃ©es
            et audit trail complet pour chaque action.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'RGPD Conforme', icon: 'ðŸ‡ªðŸ‡º', desc: 'DonnÃ©es hÃ©bergÃ©es en UE' },
              { label: 'HIPAA Ready',   icon: 'ðŸ¥', desc: 'Standards mÃ©dicaux US' },
              { label: 'AES-256',       icon: 'ðŸ”’', desc: 'Chiffrement bout-en-bout' },
              { label: 'Audit Trail',   icon: 'ðŸ“‹', desc: 'TraÃ§abilitÃ© complÃ¨te' },
              { label: 'CSRF + Helmet', icon: 'ðŸ›¡ï¸', desc: 'Protection API avancÃ©e' },
              { label: 'Uptime 99.9%',  icon: 'âš¡', desc: 'SLA garanti contractuel' },
            ].map(item => (
              <div key={item.label} style={{
                background: '#161b22', border: '0.5px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '1.25rem',
                display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center',
              }}>
                <span style={{ fontSize: 24 }}>{item.icon}</span>
                <div style={{ fontWeight: 500, fontSize: 14, color: '#f0f4f8' }}>{item.label}</div>
                <div style={{ fontSize: 12, color: '#4a5568', textAlign: 'center' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* â”€â”€ CTA FINAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <section style={{ padding: '6rem 2rem', textAlign: 'center', background: '#0d1117', borderTop: '0.5px solid rgba(255,255,255,0.07)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 400, marginBottom: '1rem' }}>
            PrÃªt Ã  moderniser<br /><em style={{ fontStyle: 'italic', color: '#34d399' }}>votre cabinet ?</em>
          </h2>
          <p style={{ fontSize: 16, color: '#8b9ab0', marginBottom: '2rem', fontWeight: 300, lineHeight: 1.7 }}>
            Rejoignez 12 000 praticiens qui font dÃ©jÃ  confiance Ã  Doctic.
          </p>
          <Link to="/dashboard" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '16px 36px', borderRadius: 12, fontSize: 15, fontWeight: 500,
            background: '#FFA586', color: '#12051f',
          }}>
            DÃ©marrer l'essai gratuit â†’
          </Link>
          <p style={{ fontSize: 12, color: '#4a5568', marginTop: '1rem' }}>
            Aucune carte bancaire requise Â· 14 jours gratuits Â· Annulation facile
          </p>
        </div>
      </section>

      {/* â”€â”€ FOOTER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <footer style={{ padding: '3rem 2rem', borderTop: '0.5px solid rgba(255,255,255,0.07)', background: '#0a0e14' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem', textAlign: 'left' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#FFA586,#B51A2B)', display:'flex',alignItems:'center',justifyContent:'center' }}>
                <svg width="14" height="14" fill="none" stroke="white" strokeWidth={2} viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <span style={{ fontFamily: 'Playfair Display, serif', fontSize: 16, fontWeight: 600 }}>Doctic Medical OS</span>
            </div>
            <p style={{ fontSize: 13, color: '#4a5568', maxWidth: 280, lineHeight: 1.7 }}>
              La plateforme de gestion mÃ©dicale pour les professionnels de santÃ© modernes.
            </p>
          </div>
          {[
            { title: 'Produit', links: ['FonctionnalitÃ©s', 'Tarifs', 'Changelog', 'Roadmap'] },
            { title: 'LÃ©gal', links: ['CGU', 'ConfidentialitÃ©', 'RGPD', 'Mentions lÃ©gales'] },
            { title: 'Support', links: ['Documentation', 'Contact', 'Status', 'CommunautÃ©'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#f0f4f8', marginBottom: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{col.title}</div>
              {col.links.map(l => (
                <div key={l} style={{ fontSize: 13, color: '#4a5568', marginBottom: 6, cursor: 'pointer' }}>{l}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1100, margin: '2rem auto 0', paddingTop: '1.5rem', borderTop: '0.5px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#4a5568' }}>Â© 2026 Doctic â€” Tous droits rÃ©servÃ©s</span>
          <span style={{ fontSize: 12, color: '#4a5568' }}>FabriquÃ© avec soin ðŸ‡²ðŸ‡¦</span>
        </div>
      </footer>
    </div>
  );
}

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FeatureCard({ icon, title, desc, color }: typeof FEATURES[0]) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: '2.5rem', background: hov ? '#161b22' : '#0d1117',
        transition: 'background 0.2s', textAlign: 'left'
      }}>
      <div style={{
        width: 46, height: 46, borderRadius: 12, marginBottom: '1.25rem',
        background: `${color}14`, border: `0.5px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color,
      }}>
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <path d={icon} />
        </svg>
      </div>
      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 500, marginBottom: '0.5rem', color: '#f0f4f8' }}>{title}</h3>
      <p style={{ fontSize: 14, color: '#8b9ab0', lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}

function PlanCard({ name, price, desc, features, featured }: typeof PLANS[0]) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: featured ? 'linear-gradient(145deg, #1a0730, #12051f)' : '#1a0730',
        border: featured ? '1px solid rgba(255,165,134,0.3)' : '0.5px solid rgba(255,255,255,0.07)',
        borderRadius: 16, padding: '2rem',
        transform: hov ? 'translateY(-3px)' : 'none',
        transition: 'all 0.25s',
        position: 'relative', overflow: 'hidden',
        textAlign: 'left'
      }}>
      {featured && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          background: 'rgba(255,165,134,0.15)', color: '#FFA586',
          border: '0.5px solid rgba(255,165,134,0.3)',
          fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, letterSpacing: '0.08em',
        }}>
          RECOMMANDÃ‰
        </div>
      )}
      <div style={{ fontSize: 11, color: '#8b9ab0', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{name}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: '0.5rem' }}>
        <span style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', fontWeight: 500, color: '#f0f4f8' }}>{price}â‚¬</span>
        <span style={{ fontSize: 13, color: '#4a5568' }}>/mois</span>
      </div>
      <p style={{ fontSize: 13, color: '#8b9ab0', marginBottom: '1.5rem', lineHeight: 1.6 }}>{desc}</p>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.75rem', padding: 0 }}>
        {features.map(f => (
          <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#f0f4f8' }}>
            <svg width="14" height="14" fill="none" stroke={featured ? '#10b981' : '#4a5568'} strokeWidth={2.5} viewBox="0 0 24 24">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <Link to="/dashboard" style={{
        display: 'block', textAlign: 'center',
        padding: '11px', borderRadius: 10, fontSize: 14, fontWeight: 500,
        background: featured ? '#FFA586' : 'rgba(255,255,255,0.05)',
        color: featured ? '#12051f' : '#f0f4f8',
        border: featured ? 'none' : '0.5px solid rgba(255,255,255,0.1)',
        transition: 'background 0.2s',
      }}>
        {featured ? 'Choisir Pro â†’' : 'Choisir â†’'}
      </Link>
    </div>
  );
}

