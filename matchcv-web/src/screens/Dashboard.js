import React from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { Card, Badge } from '../components/Card';

function ProfileStrengthBar({ profile }) {
  const checks = [
    profile.fullName,
    profile.title,
    profile.email,
    profile.summary?.en,
    profile.experiences.length > 0,
    profile.skills.length > 0,
    profile.education.length > 0,
    profile.projects.length > 0,
  ];
  const value = Math.round((checks.filter(Boolean).length / checks.length) * 100);
  const color = value >= 75 ? 'var(--success)' : value >= 50 ? 'var(--accent)' : 'var(--warn)';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <span style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 500 }}>{value < 60 ? 'Perfil incompleto' : value < 80 ? 'Perfil bom' : 'Perfil forte'}</span>
        <span style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums', color }}>{value}%</span>
      </div>
      <div style={{ height: 6, borderRadius: 999, background: 'var(--surface-3)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${value}%`, borderRadius: 999,
          background: `linear-gradient(90deg, var(--accent), ${color})`,
          transition: 'width 600ms ease',
        }} />
      </div>
    </div>
  );
}

function EmptyState({ icon, title, desc, action, onAction }) {
  return (
    <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
      <Icon name={icon} size={24} style={{ color: 'var(--ink-4)', marginBottom: 4 }} />
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-2)' }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--ink-4)', lineHeight: 1.5 }}>{desc}</div>
      {action && (
        <button onClick={onAction} style={{ marginTop: 4, fontSize: 12, color: 'var(--accent)', fontWeight: 600, fontFamily: 'inherit' }}>
          {action}
        </button>
      )}
    </div>
  );
}

export default function Dashboard({ t, lang, profile, setScreen }) {
  if (!profile) return null;

  const pt = lang === 'pt';

  const sectionTitle = (label, count, icon) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon name={icon} size={15} style={{ color: 'var(--ink-3)' }} />
        <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: '-0.005em' }}>{label}</span>
        <Badge tone="outline">{count}</Badge>
      </div>
      <button style={{ fontSize: 12, color: 'var(--ink-3)', display: 'inline-flex', gap: 4, alignItems: 'center' }}>
        <Icon name="plus" size={12} />{t.add}
      </button>
    </div>
  );

  const firstName = profile.fullName?.split(' ')[0] || profile.fullName || (pt ? 'você' : 'there');

  return (
    <div style={{ padding: '32px 40px 60px', display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 6, fontWeight: 500, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            {new Date().toLocaleDateString(pt ? 'pt-BR' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 600, letterSpacing: '-0.025em', margin: 0, lineHeight: 1.1 }}>
            {t.welcome}{firstName ? `, ${firstName}` : ''}.
          </h1>
          <p style={{ fontSize: 15, color: 'var(--ink-3)', marginTop: 8, marginBottom: 0 }}>{t.welcomeSub}</p>
        </div>
        <Button variant="accent" size="lg" icon="sparkle" iconRight="arrow" onClick={() => setScreen('generate')}>
          {t.newCv}
        </Button>
      </div>

      {/* Upgrade banner for FREE plan */}
      {profile.plan === 'FREE' && (
        <div style={{
          padding: '16px 20px', borderRadius: 12,
          background: 'var(--accent-soft)', color: 'var(--accent-soft-ink)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Icon name="sparkle" size={16} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 13.5 }}>
                {pt ? 'Você está no plano gratuito' : "You're on the free plan"}
              </div>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 2 }}>
                {pt ? 'Limite de 3 gerações por mês. Faça upgrade para ilimitado.' : 'Limited to 3 CVs/month. Upgrade for unlimited.'}
              </div>
            </div>
          </div>
          <Button variant="accent" size="sm" onClick={() => setScreen('plans')}>
            {pt ? 'Ver planos' : 'See plans'}
          </Button>
        </div>
      )}

      {/* Strength + counters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 20 }}>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <ProfileStrengthBar profile={profile} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {[
              { k: t.experiences, v: profile.experiences.length },
              { k: t.projects, v: profile.projects.length },
              { k: t.education, v: profile.education.length },
              { k: t.skills, v: profile.skills.length },
            ].map((s, i) => (
              <div key={i} style={{
                padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 10,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: 12.5, color: 'var(--ink-3)' }}>{s.k}</span>
                <span style={{ fontSize: 15, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{s.v}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>{t.recent}</span>
          </div>
          <EmptyState
            icon="file"
            title={pt ? 'Nenhum CV gerado ainda' : 'No CVs generated yet'}
            desc={pt ? 'Adapte sua primeira vaga para ver o histórico aqui.' : 'Tailor your first job to see history here.'}
            action={pt ? 'Gerar agora →' : 'Generate now →'}
            onAction={() => setScreen('generate')}
          />
        </Card>
      </div>

      {/* Profile sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Card>
          {sectionTitle(t.experiences, profile.experiences.length, 'briefcase')}
          {profile.experiences.length === 0 ? (
            <EmptyState icon="briefcase" title={pt ? 'Nenhuma experiência' : 'No experiences'} desc={pt ? 'Adicione suas experiências profissionais.' : 'Add your work experiences.'} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {profile.experiences.map(e => (
                <div key={e.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{e.company}</span>
                      <span style={{ color: 'var(--ink-4)', margin: '0 6px' }}>·</span>
                      <span style={{ fontSize: 13, color: 'var(--ink-2)' }}>{e.role}</span>
                    </div>
                    <span style={{ fontSize: 11.5, color: 'var(--ink-3)', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', marginLeft: 8 }}>
                      {e.start} — {e.current ? t.present : e.end}
                    </span>
                  </div>
                  {e.bullets.length > 0 && (
                    <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 4 }}>
                      {e.bullets[0].en || e.bullets[0].pt}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          {sectionTitle(t.projects, profile.projects.length, 'code')}
          {profile.projects.length === 0 ? (
            <EmptyState icon="code" title={pt ? 'Nenhum projeto' : 'No projects'} desc={pt ? 'Adicione projetos pessoais ou open source.' : 'Add personal or open-source projects.'} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {profile.projects.map(p => (
                <div key={p.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                    {p.url && <span style={{ fontSize: 11.5, color: 'var(--ink-4)', fontFamily: 'var(--font-mono)' }}>{p.url}</span>}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--ink-3)', marginTop: 3, lineHeight: 1.5 }}>{p.description}</div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          {sectionTitle(t.skills, profile.skills.length, 'bolt')}
          {profile.skills.length === 0 ? (
            <EmptyState icon="bolt" title={pt ? 'Nenhuma habilidade' : 'No skills'} desc={pt ? 'Liste suas principais habilidades técnicas.' : 'List your main technical skills.'} />
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {profile.skills.map((s, i) => <Badge key={i} tone="neutral">{s}</Badge>)}
            </div>
          )}
        </Card>

        <Card>
          {sectionTitle(t.education, profile.education.length, 'school')}
          {profile.education.length === 0 ? (
            <EmptyState icon="school" title={pt ? 'Nenhuma formação' : 'No education'} desc={pt ? 'Adicione sua graduação ou cursos.' : 'Add your degree or courses.'} />
          ) : (
            profile.education.map(e => (
              <div key={e.id} style={{ marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{e.institution}</div>
                <div style={{ fontSize: 13, color: 'var(--ink-2)', marginTop: 2 }}>{e.degree}</div>
                <div style={{ fontSize: 11.5, color: 'var(--ink-3)', marginTop: 3 }}>{e.start} — {e.end}</div>
              </div>
            ))
          )}
          {profile.certifications.length > 0 && (
            <>
              <div style={{ height: 1, background: 'var(--line)', margin: '12px 0' }} />
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--ink-2)', marginBottom: 6 }}>{t.certifications}</div>
              {profile.certifications.map(c => (
                <div key={c.id} style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>
                  {c.name} <span style={{ color: 'var(--ink-4)' }}>· {c.issuer} · {c.year}</span>
                </div>
              ))}
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
