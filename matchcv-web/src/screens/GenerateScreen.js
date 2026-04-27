import React from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { ResumePreview, ScoreGauge } from '../components/ResumePreview';
import { SAMPLE_JD } from '../data';
import { api } from '../api';
import { buildCvText, applyOptimizedBullets } from '../mappers';

function StepIndicator({ step, t }) {
  const steps = [t.step1, t.step2, t.step3];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {steps.map((s, i) => {
        const active = i === step;
        const done = i < step;
        return (
          <React.Fragment key={i}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 12px', borderRadius: 999,
              background: active ? 'var(--ink)' : done ? 'var(--success-soft)' : 'var(--surface-2)',
              color: active ? 'var(--bg)' : done ? 'var(--success)' : 'var(--ink-3)',
              fontSize: 12.5, fontWeight: 550, transition: 'all 200ms',
            }}>
              <div style={{
                width: 18, height: 18, borderRadius: 999,
                background: active ? 'var(--bg)' : done ? 'var(--success)' : 'var(--surface-3)',
                color: active ? 'var(--ink)' : done ? '#fff' : 'var(--ink-3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
              }}>
                {done ? <Icon name="check" size={10} stroke={3} /> : i + 1}
              </div>
              {s}
            </div>
            {i < 2 && <div style={{ width: 24, height: 1, background: 'var(--line-2)' }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}


function StreamingStatus({ phase, t }) {
  const phases = [t.thinking, t.matching, t.rewriting, t.scoring];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {phases.map((p, i) => {
        const isDone = i < phase;
        const isActive = i === phase;
        const isPending = i > phase;
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            fontSize: 13, opacity: isPending ? 0.35 : 1,
            color: isDone ? 'var(--ink-3)' : 'var(--ink)', transition: 'opacity 300ms',
          }}>
            <div style={{ width: 14, height: 14, flexShrink: 0 }}>
              {isDone
                ? <Icon name="check" size={14} stroke={2.6} style={{ color: 'var(--success)' }} />
                : isActive
                  ? <div style={{ width: 14, height: 14, border: '2px solid var(--line-2)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'mcv-spin 700ms linear infinite' }} />
                  : <div style={{ width: 6, height: 6, borderRadius: 999, background: 'var(--ink-4)', margin: 4 }} />}
            </div>
            <span style={{ fontWeight: isActive ? 550 : 400, textDecoration: isDone ? 'line-through' : 'none', textDecorationColor: 'var(--ink-4)' }}>
              {p}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function GenerateScreen({ t, lang, profile, onDone, onBack }) {
  const [stage, setStage] = React.useState('edit');
  const [jd, setJd] = React.useState('');
  const [phase, setPhase] = React.useState(0);
  const [reveal, setReveal] = React.useState(0);
  const [previewMode, setPreviewMode] = React.useState('optimized');
  const [optimizedProfile, setOptimizedProfile] = React.useState(null);
  const [score, setScore] = React.useState(0);
  const [improvements, setImprovements] = React.useState([]);
  const [apiErr, setApiErr] = React.useState('');


  const start = async () => {
    if (!jd.trim()) {
      setApiErr(lang === 'pt' ? 'Cole a descrição da vaga antes de continuar.' : 'Paste the job description before continuing.');
      return;
    }
    setStage('streaming');
    setPhase(0); setReveal(0); setApiErr('');

    const revealDur = 3200;
    const rafStart = performance.now() + 800;
    let raf;
    const tick = (now) => {
      const p = Math.max(0, Math.min(1, (now - rafStart) / revealDur));
      setReveal(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    try {
      setPhase(1);
      const cvText = buildCvText(profile);
      setPhase(2);
      const result = await api.llm.optimize(cvText, jd, lang);
      setPhase(3);
      const applied = applyOptimizedBullets(profile, result.optimized_bullets || []);
      setOptimizedProfile(applied);
      setScore(result.faang_ready_score ?? 75);
      setImprovements(result.improvements || []);
      setPhase(4);
      cancelAnimationFrame(raf);
      setReveal(1);
      setTimeout(() => setStage('review'), 600);
    } catch (err) {
      cancelAnimationFrame(raf);
      setApiErr(lang === 'pt' ? 'Erro ao otimizar. Tente novamente.' : 'Optimization failed. Please try again.');
      setStage('edit');
    }
  };

  const downloadPdf = async () => {
    try {
      const blob = await api.cv.generate(jd, lang);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const name = profile?.fullName?.toLowerCase().replace(/\s+/g, '_') || 'cv';
      a.download = `${name}_cv.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      onDone();
    } catch {
      setApiErr(lang === 'pt' ? 'Erro ao gerar PDF.' : 'Failed to generate PDF.');
    }
  };

  const resumeMode = stage === 'edit' ? 'original' : 'optimized';
  const resumeReveal = stage === 'streaming' ? reveal : 1;
  const displayProfile = (stage === 'review' && optimizedProfile) ? optimizedProfile : profile;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr', height: '100%', background: 'var(--bg)' }}>
      {/* Left */}
      <div className="mcv-scroll" style={{
        padding: '28px 32px', overflowY: 'auto',
        borderRight: '1px solid var(--line)',
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <div>
          <button onClick={onBack} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'var(--ink-3)', marginBottom: 14 }}>
            <Icon name="arrowLeft" size={13} />{t.dashboard}
          </button>
          <StepIndicator step={stage === 'edit' ? 0 : stage === 'streaming' ? 1 : 2} t={t} />
        </div>

        {stage === 'edit' && (
          <>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>{t.jdLabel}</label>
              <div style={{ fontSize: 12, color: 'var(--ink-3)', marginBottom: 10 }}>{t.jdHint}</div>
              <textarea
                value={jd}
                onChange={e => setJd(e.target.value)}
                placeholder={SAMPLE_JD[lang]}
                style={{
                  width: '100%', minHeight: 320, resize: 'vertical',
                  padding: '14px 16px', borderRadius: 12,
                  background: 'var(--surface)', border: 'none', outline: 'none',
                  boxShadow: 'inset 0 0 0 1px var(--line-2)',
                  fontSize: 13.5, lineHeight: 1.55, color: 'var(--ink)',
                  fontFamily: 'var(--font-ui)',
                }}
              />
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: 'var(--ink-3)' }}>
                <span>{jd.length} {lang === 'pt' ? 'caracteres' : 'chars'}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <Icon name="globe" size={12} />{lang === 'pt' ? 'Português' : 'English'}
                </span>
              </div>
            </div>
            {apiErr && (
              <div style={{ padding: '10px 12px', borderRadius: 8, fontSize: 12.5, background: 'var(--warn-soft)', color: 'var(--warn)' }}>
                {apiErr}
              </div>
            )}
            <Button variant="accent" size="lg" icon="sparkle" onClick={start} style={{ justifyContent: 'center' }}>
              {t.tailorBtn}
            </Button>
            <div style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 12, fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.55 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--ink-2)', fontWeight: 600, marginBottom: 6 }}>
                <Icon name="info" size={13} />
                {lang === 'pt' ? 'Como funciona' : 'How this works'}
              </div>
              {lang === 'pt'
                ? 'Montamos um texto com seu perfil, enviamos para o modelo com a descrição da vaga, e reescrevemos só os bullets — nunca inventamos experiência que você não tem.'
                : "We assemble your profile into text, send it to the model alongside the job, and rewrite only your bullets — we never invent experience you don't have."}
            </div>
          </>
        )}

        {stage === 'streaming' && (
          <>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>{t.tailoring}</div>
              <StreamingStatus phase={phase} t={t} />
            </div>
          </>
        )}

        {stage === 'review' && (
          <>
            <ScoreGauge value={score} label={t.score} />
            <div style={{ fontSize: 12.5, color: 'var(--ink-3)', lineHeight: 1.5, marginTop: -6 }}>{t.scoreHint}</div>

            <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--surface-2)', borderRadius: 10 }}>
              {['original', 'optimized'].map(m => (
                <button key={m} onClick={() => setPreviewMode(m)} style={{
                  flex: 1, padding: '7px 10px', borderRadius: 7, fontSize: 12.5, fontWeight: 550,
                  background: previewMode === m ? 'var(--surface)' : 'transparent',
                  color: previewMode === m ? 'var(--ink)' : 'var(--ink-3)',
                  boxShadow: previewMode === m ? 'var(--shadow-sm)' : 'none',
                }}>{t[m]}</button>
              ))}
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-3)', marginBottom: 10 }}>
                {t.improvements}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(improvements.length ? improvements : []).map((imp, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, padding: '10px 12px',
                    background: 'var(--surface)', borderRadius: 10,
                    boxShadow: 'inset 0 0 0 1px var(--line)',
                    fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5,
                    animation: `mcv-fadeup ${300 + i * 80}ms ease both`,
                  }}>
                    <div style={{ width: 18, height: 18, borderRadius: 999, background: 'var(--success-soft)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                      <Icon name="check" size={12} stroke={3} />
                    </div>
                    {imp}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <Button variant="accent" size="lg" icon="download" onClick={downloadPdf} style={{ flex: 1, justifyContent: 'center' }}>
                {t.downloadPdf}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Right: preview */}
      <div className="mcv-scroll" style={{
        overflowY: 'auto', padding: '28px 40px',
        background: 'var(--surface-2)',
        backgroundImage: 'radial-gradient(circle at 20% 20%, rgba(47,91,234,0.05), transparent 45%)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 550, letterSpacing: '0.02em', textTransform: 'uppercase' }}>
            {t.preview}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, color: 'var(--ink-3)' }}>
            <Icon name="file" size={13} />{(profile?.fullName?.toLowerCase().replace(/\s+/g, '_') || 'cv') + '_cv.pdf'}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', minHeight: 800 }}>
          <div style={{ width: 612 * 0.85, height: 792 * 0.85 + 60 }}>
            <ResumePreview profile={displayProfile} lang={lang} mode={stage === 'review' ? previewMode : resumeMode} reveal={resumeReveal} scale={0.85} />
          </div>
          {stage === 'streaming' && (
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 40 }}>
              <div style={{ padding: '8px 14px', background: 'var(--ink)', color: 'var(--bg)', borderRadius: 999, fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: 'var(--shadow-lg)' }}>
                <div style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--accent)', animation: 'mcv-pulse 1s ease-in-out infinite' }} />
                {t.rewriting}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
