function fmtMonth(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function fmtYear(dateStr) {
  if (!dateStr) return '';
  try {
    return String(new Date(dateStr + 'T12:00:00').getFullYear());
  } catch {
    return dateStr;
  }
}

// Transform all backend resources into the profile shape the UI expects.
export function mapProfile(me, experiences = [], education = [], certifications = [], projects = []) {
  return {
    fullName: me.fullName || me.username || '',
    title: me.title || '',
    email: me.email || '',
    phone: me.phone || '',
    location: me.location || '',
    linkedin: me.linkedin || '',
    plan: (typeof me.plan === 'string' && ['FREE', 'PRO', 'LIFETIME'].includes(me.plan)) ? me.plan : 'FREE',
    summary: { en: me.summary || '', pt: me.summary || '' },
    skills: me.skills || [],
    experiences: experiences.map(e => ({
      id: e.key?.expId ?? e.id,
      company: e.company || '',
      role: e.role || '',
      start: fmtMonth(e.startDate),
      end: fmtMonth(e.endDate),
      current: !!e.isCurrent,
      location: '',
      // description is a single text block — treat it as one bullet
      bullets: e.description ? [{ en: e.description, pt: e.description }] : [],
      optimized: [],
      tips: [],
    })),
    projects: projects.map(p => ({
      id: p.key?.projectId ?? p.id,
      name: p.name || '',
      role: p.role || '',
      description: p.description || '',
      url: p.url || '',
    })),
    education: education.map(e => ({
      id: e.key?.eduId ?? e.id,
      institution: e.institution || '',
      degree: e.degree || '',
      field: e.field || '',
      start: fmtYear(e.startDate),
      end: fmtYear(e.endDate),
    })),
    certifications: certifications.map(c => ({
      id: c.key?.certId ?? c.id,
      name: c.name || '',
      issuer: c.issuer || '',
      year: fmtYear(c.issuedDate),
    })),
  };
}

// Build a plain-text CV string from the mapped profile (used as input to the LLM).
export function buildCvText(profile) {
  const lines = [];
  if (profile.fullName) lines.push(profile.fullName);
  if (profile.title)    lines.push(profile.title);
  if (profile.email)    lines.push(profile.email);
  if (profile.location) lines.push(profile.location);
  lines.push('');

  if (profile.summary?.en) {
    lines.push('Summary');
    lines.push(profile.summary.en);
    lines.push('');
  }

  if (profile.experiences.length) {
    lines.push('Experience');
    for (const exp of profile.experiences) {
      const period = `${exp.start}–${exp.current ? 'Present' : exp.end}`;
      lines.push(`${exp.company} | ${exp.role} | ${period}`);
      for (const b of exp.bullets) lines.push(`• ${b.en}`);
      lines.push('');
    }
  }

  if (profile.projects.length) {
    lines.push('Projects');
    for (const p of profile.projects) {
      lines.push(`${p.name}${p.role ? ` (${p.role})` : ''}: ${p.description}`);
    }
    lines.push('');
  }

  if (profile.skills.length) {
    lines.push('Skills');
    lines.push(profile.skills.join(', '));
    lines.push('');
  }

  if (profile.education.length) {
    lines.push('Education');
    for (const e of profile.education) {
      lines.push(`${e.institution} — ${e.degree} (${e.start}–${e.end})`);
    }
  }

  return lines.join('\n');
}

// Apply flat optimized_bullets list back onto the profile experiences (one bullet per exp).
export function applyOptimizedBullets(profile, optimizedBullets = []) {
  return {
    ...profile,
    experiences: profile.experiences.map((exp, i) => ({
      ...exp,
      optimized: optimizedBullets[i]
        ? [{ en: optimizedBullets[i], pt: optimizedBullets[i] }]
        : exp.bullets,
    })),
  };
}
