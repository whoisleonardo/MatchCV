import React from 'react';

export function ResumePreview({ profile, lang, mode = 'original', reveal = 1, scale = 1 }) {
  if (!profile) return null;

  const s = {
    page: {
      width: 612,
      minHeight: 792,
      background: '#ffffff',
      color: '#1a1a1a',
      fontFamily: 'var(--font-serif)',
      padding: '48px 54px',
      fontSize: 10.5,
      lineHeight: 1.45,
      transformOrigin: 'top left',
      transform: `scale(${scale})`,
      boxShadow: '0 1px 0 rgba(0,0,0,0.04), 0 12px 40px rgba(20,22,28,0.10), 0 0 0 1px rgba(20,22,28,0.06)',
      letterSpacing: '-0.002em',
    },
    name: { fontSize: 22, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' },
    role: { fontSize: 11.5, color: '#444', marginTop: 2, fontStyle: 'italic' },
    contact: { marginTop: 8, fontSize: 9.5, color: '#555', display: 'flex', flexWrap: 'wrap', gap: '0 10px' },
    rule: { height: 1, background: '#1a1a1a', margin: '14px 0 12px', opacity: 0.85 },
    sectionTitle: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6, marginTop: 14 },
    expHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 },
    company: { fontWeight: 600, fontSize: 11.5 },
    roleText: { fontStyle: 'italic', color: '#333', fontSize: 10.5 },
    dates: { fontSize: 9.5, color: '#666', fontVariantNumeric: 'tabular-nums' },
    bullet: { margin: '3px 0 3px 14px', textIndent: '-10px', paddingLeft: 2, fontSize: 10, lineHeight: 1.5 },
  };

  const pickBullet = (exp) => (mode === 'optimized' ? exp.optimized : exp.bullets).map(x => x[lang]);

  const revealText = (text, idx, total) => {
    if (reveal >= 1) return text;
    const slice = Math.floor(text.length * Math.max(0, Math.min(1, (reveal * total) - idx)));
    if (slice <= 0) return '';
    if (slice >= text.length) return text;
    return text.slice(0, slice);
  };

  let bulletIdx = 0;
  const totalBullets = profile.experiences.reduce((a, e) => a + pickBullet(e).length, 0);

  return (
    <div style={s.page}>
      <div>
        <h1 style={s.name}>{profile.fullName}</h1>
        <div style={s.role}>{profile.title}</div>
        <div style={s.contact}>
          {[profile.email, profile.phone, profile.location, profile.linkedin].filter(Boolean).map((v, i, arr) => (
            <React.Fragment key={i}>
              <span>{v}</span>{i < arr.length - 1 && <span>·</span>}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={s.rule} />

      {profile.summary?.[lang] && (
        <>
          <div style={s.sectionTitle}>{lang === 'pt' ? 'Resumo' : 'Summary'}</div>
          <div style={{ fontSize: 10.5 }}>{profile.summary[lang]}</div>
        </>
      )}

      <div style={s.sectionTitle}>{lang === 'pt' ? 'Experiência' : 'Experience'}</div>
      {profile.experiences.map((exp) => (
        <div key={exp.id} style={{ marginBottom: 10 }}>
          <div style={s.expHeader}>
            <div>
              <span style={s.company}>{exp.company}</span>
              <span style={{ color: '#777', margin: '0 6px' }}>·</span>
              <span style={s.roleText}>{exp.role}</span>
            </div>
            <div style={s.dates}>{exp.start} — {exp.current ? (lang === 'pt' ? 'Atual' : 'Present') : exp.end}</div>
          </div>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {pickBullet(exp).map((text, bi) => {
              const myIdx = bulletIdx++;
              const shown = revealText(text, myIdx, totalBullets);
              const isActive = shown.length > 0 && shown.length < text.length;
              return (
                <li key={bi} style={s.bullet}>
                  • {shown}
                  {isActive && <span style={{ animation: 'mcv-caret 0.9s steps(1) infinite', fontWeight: 700 }}>▎</span>}
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div style={s.sectionTitle}>{lang === 'pt' ? 'Projetos' : 'Projects'}</div>
      {profile.projects.map(p => (
        <div key={p.id} style={{ marginBottom: 6 }}>
          <div style={s.expHeader}>
            <div>
              <span style={s.company}>{p.name}</span>
              <span style={{ color: '#777', margin: '0 6px' }}>·</span>
              <span style={s.roleText}>{p.role}</span>
            </div>
            <div style={s.dates}>{p.url}</div>
          </div>
          <div style={{ fontSize: 10, marginTop: 2 }}>{p.description}</div>
        </div>
      ))}

      {profile.skills?.length > 0 && (
        <>
          <div style={s.sectionTitle}>{lang === 'pt' ? 'Habilidades' : 'Skills'}</div>
          <div style={{ fontSize: 10, color: '#222', lineHeight: 1.6 }}>{profile.skills.join(' · ')}</div>
        </>
      )}

      <div style={s.sectionTitle}>{lang === 'pt' ? 'Formação' : 'Education'}</div>
      {profile.education.map(e => (
        <div key={e.id} style={s.expHeader}>
          <div>
            <span style={s.company}>{e.institution}</span>
            <span style={{ color: '#777', margin: '0 6px' }}>·</span>
            <span style={s.roleText}>{e.degree}</span>
          </div>
          <div style={s.dates}>{e.start} — {e.end}</div>
        </div>
      ))}
    </div>
  );
}

export function ScoreGauge({ value = 0, size = 140, stroke = 10, label }) {
  const [v, setV] = React.useState(0);

  React.useEffect(() => {
    const dur = 1400;
    const start = performance.now();
    let raf;
    const tick = (t) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(value * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (v / 100) * c;
  const toneColor = v < 55 ? 'var(--warn)' : v < 75 ? 'var(--accent)' : 'var(--success)';

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={toneColor} strokeWidth={stroke}
            strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke 400ms ease' }} />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontVariantNumeric: 'tabular-nums',
        }}>
          <div style={{ fontSize: size * 0.3, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--ink)' }}>
            {Math.round(v)}
          </div>
          <div style={{ fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>/ 100</div>
        </div>
      </div>
      {label && <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 500 }}>{label}</div>}
    </div>
  );
}
