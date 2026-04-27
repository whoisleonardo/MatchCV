export const SAMPLE_PROFILE = {
  fullName: 'Ana Ribeiro',
  title: 'Backend Software Engineer',
  email: 'ana.ribeiro@mail.com',
  phone: '+55 11 98123-4567',
  location: 'São Paulo, Brasil',
  linkedin: 'linkedin.com/in/anaribeiro',
  github: 'github.com/anaribeiro',
  summary: {
    en: 'Backend engineer with 5+ years building distributed systems in Java and Go. I care about clean data models, observable services, and code that other engineers enjoy reading.',
    pt: 'Engenheira backend com 5+ anos construindo sistemas distribuídos em Java e Go. Me importo com modelos de dados limpos, serviços observáveis e código que outros engenheiros gostem de ler.',
  },
  skills: ['Java', 'Spring Boot', 'Go', 'PostgreSQL', 'Cassandra', 'Kafka', 'AWS', 'Docker', 'Kubernetes', 'gRPC', 'Terraform', 'Redis'],
  experiences: [
    {
      id: 1, company: 'Zenlogic', role: 'Senior Backend Engineer',
      start: 'Mar 2023', end: 'Present', current: true, location: 'Remote',
      bullets: [
        { en: 'Built a REST API for customer billing using Spring Boot and PostgreSQL.', pt: 'Construí uma API REST para cobrança de clientes usando Spring Boot e PostgreSQL.' },
        { en: 'Improved the response time of the checkout service by refactoring database queries.', pt: 'Melhorei o tempo de resposta do serviço de checkout refatorando consultas ao banco.' },
        { en: 'Helped the team adopt Kafka for event streaming between services.', pt: 'Ajudei o time a adotar Kafka para streaming de eventos entre serviços.' },
      ],
      optimized: [
        { en: 'Architected Spring Boot billing API serving 2.4M+ monthly transactions across 14 markets, hitting 99.95% availability SLO.', pt: 'Arquitetei API de cobrança em Spring Boot servindo 2,4M+ transações mensais em 14 mercados, com SLO de 99,95% de disponibilidade.' },
        { en: 'Reduced checkout p99 latency 68% (820ms → 260ms) by introducing read replicas, query-level caching, and a new composite index strategy.', pt: 'Reduzi p99 do checkout em 68% (820ms → 260ms) introduzindo read replicas, cache em nível de query e nova estratégia de índice composto.' },
        { en: 'Led Kafka adoption across 6 services, replacing 3 legacy cron pipelines and cutting end-to-end event propagation from 9min → 1.2s.', pt: 'Liderei adoção de Kafka em 6 serviços, substituindo 3 pipelines legacy em cron e reduzindo propagação de eventos de 9min → 1,2s.' },
      ],
      tips: [
        { en: 'Numbers make impact real — add scale (transactions, users, regions).', pt: 'Números tornam o impacto real — adicione escala (transações, usuários, regiões).' },
        { en: 'Always show the before/after of a perf win.', pt: 'Mostre o antes/depois de um ganho de performance.' },
        { en: 'Start with a strong verb: led, shipped, built, cut.', pt: 'Comece com um verbo forte: liderei, entreguei, construí, reduzi.' },
      ],
    },
    {
      id: 2, company: 'Orbita Labs', role: 'Backend Engineer',
      start: 'Jul 2020', end: 'Feb 2023', current: false, location: 'São Paulo',
      bullets: [
        { en: 'Worked on an internal tool for managing user permissions.', pt: 'Trabalhei em uma ferramenta interna para gerenciar permissões de usuários.' },
        { en: 'Wrote integration tests for the main API.', pt: 'Escrevi testes de integração para a API principal.' },
      ],
      optimized: [
        { en: 'Designed RBAC permissions service adopted by 8 internal tools, eliminating 140+ hardcoded auth checks and cutting onboarding time for new engineers by 2 weeks.', pt: 'Projetei serviço RBAC adotado por 8 ferramentas internas, eliminando 140+ checagens de auth hardcoded e cortando onboarding de novos engenheiros em 2 semanas.' },
        { en: 'Raised integration test coverage from 41% → 87% and set up CI gating that caught 23 regressions before release over 6 months.', pt: 'Aumentei cobertura de testes de integração de 41% → 87% e configurei gating no CI que pegou 23 regressões antes do release em 6 meses.' },
      ],
      tips: [
        { en: '"Internal tool" is vague — name its scope and users.', pt: '"Ferramenta interna" é vago — nomeie seu escopo e usuários.' },
        { en: 'Tests are infrastructure — credit the outcome, not the task.', pt: 'Testes são infra — credite o resultado, não a tarefa.' },
      ],
    },
  ],
  projects: [
    { id: 1, name: 'MatchCV', role: 'Creator', description: 'Open-source CV builder that uses an LLM to tailor bullet points to a job posting. Spring Boot + Cassandra + LaTeX.', url: 'github.com/anaribeiro/matchcv' },
    { id: 2, name: 'Quietly', role: 'Contributor', description: 'Small focus timer app for writers. Go backend, SvelteKit web client.', url: 'github.com/quietly-app' },
  ],
  education: [
    { id: 1, institution: 'Universidade de São Paulo', degree: 'B.Sc. Computer Science', field: 'Distributed Systems focus', start: '2016', end: '2020' },
  ],
  certifications: [
    { id: 1, name: 'AWS Certified Solutions Architect — Associate', issuer: 'Amazon Web Services', year: '2024' },
  ],
};

export const SAMPLE_JD = {
  en: `Senior Backend Engineer — Distributed Systems

We're looking for a senior engineer to lead the next generation of our event-streaming platform. You will:
  • Design high-throughput services in Java (Spring Boot) and Go, running on AWS (EKS, MSK/Kafka, RDS).
  • Own observability, performance, and reliability for systems processing millions of events per day.
  • Partner with product to turn vague requirements into clean APIs and well-modeled data.

Nice to have: Cassandra, gRPC, Terraform, experience mentoring mid-level engineers.`,
  pt: `Engenheira(o) Backend Sênior — Sistemas Distribuídos

Procuramos uma pessoa sênior para liderar a próxima geração da nossa plataforma de event-streaming. Você vai:
  • Projetar serviços de alto throughput em Java (Spring Boot) e Go, rodando em AWS (EKS, MSK/Kafka, RDS).
  • Ser dona de observabilidade, performance e confiabilidade para sistemas que processam milhões de eventos por dia.
  • Fazer parceria com produto para transformar requisitos vagos em APIs limpas e dados bem modelados.

Diferenciais: Cassandra, gRPC, Terraform, experiência mentorando pessoas mid-level.`,
};

export const I18N = {
  en: {
    appName: 'MatchCV',
    tagline: 'CV that adapts to the job',
    dashboard: 'Dashboard', profile: 'Profile', generate: 'Generate', history: 'History', settings: 'Settings',
    welcome: 'Welcome back',
    welcomeSub: 'Tailor your CV to any job in under a minute.',
    newCv: 'Tailor a new CV',
    profileStrength: 'Profile strength',
    pStrong: 'Strong — ready to generate',
    yourProfile: 'Your profile',
    experiences: 'Experiences', projects: 'Projects', education: 'Education',
    certifications: 'Certifications', skills: 'Skills', summary: 'Summary',
    edit: 'Edit', add: 'Add',
    recent: 'Recent tailored CVs',
    step1: 'Paste the job', step2: 'AI rewrites', step3: 'Download',
    jdPlaceholder: 'Paste the job description here. Any language works — we will match its tone.',
    jdLabel: 'Job description', jdHint: 'The more detail, the better the match.',
    tailorBtn: 'Tailor my CV', tailoring: 'Tailoring…',
    backToEdit: 'Back to job description', preview: 'Live preview',
    original: 'Original', optimized: 'AI-optimized',
    coachTip: 'Coach tip', score: 'FAANG-ready score',
    scoreHint: 'Blends clarity, specificity, and keyword fit against the job.',
    improvements: 'What we improved',
    downloadPdf: 'Download PDF', emailMe: 'Email to me',
    readyTitle: 'Your CV is ready',
    readySub: 'Compiled with LaTeX. ATS-safe, single page, selectable text.',
    openAgain: 'Tailor another version',
    thinking: 'Reading the job posting…', matching: 'Matching your experience…',
    rewriting: 'Rewriting your bullets…', scoring: 'Scoring…',
    present: 'Present', language: 'Language', theme: 'Theme',
    tweaks: 'Tweaks', light: 'Light', dark: 'Dark',
    poweredBy: 'Powered by MatchCV',
  },
  pt: {
    appName: 'MatchCV',
    tagline: 'Currículo que se adapta à vaga',
    dashboard: 'Início', profile: 'Perfil', generate: 'Gerar', history: 'Histórico', settings: 'Ajustes',
    welcome: 'Boas-vindas de volta',
    welcomeSub: 'Adapte seu currículo a qualquer vaga em menos de um minuto.',
    newCv: 'Adaptar novo CV',
    profileStrength: 'Força do perfil',
    pStrong: 'Forte — pronto para gerar',
    yourProfile: 'Seu perfil',
    experiences: 'Experiências', projects: 'Projetos', education: 'Formação',
    certifications: 'Certificações', skills: 'Habilidades', summary: 'Resumo',
    edit: 'Editar', add: 'Adicionar',
    recent: 'CVs recentes',
    step1: 'Cole a vaga', step2: 'IA reescreve', step3: 'Baixe',
    jdPlaceholder: 'Cole a descrição da vaga aqui. Qualquer idioma funciona — vamos combinar o tom.',
    jdLabel: 'Descrição da vaga', jdHint: 'Quanto mais detalhe, melhor o match.',
    tailorBtn: 'Adaptar meu CV', tailoring: 'Adaptando…',
    backToEdit: 'Voltar para a vaga', preview: 'Prévia ao vivo',
    original: 'Original', optimized: 'Otimizado',
    coachTip: 'Dica da coach', score: 'Nota FAANG-ready',
    scoreHint: 'Mistura clareza, especificidade e casamento de palavras-chave.',
    improvements: 'O que melhoramos',
    downloadPdf: 'Baixar PDF', emailMe: 'Enviar para meu e-mail',
    readyTitle: 'Seu CV está pronto',
    readySub: 'Compilado com LaTeX. ATS-safe, uma página, texto selecionável.',
    openAgain: 'Adaptar outra versão',
    thinking: 'Lendo a vaga…', matching: 'Casando sua experiência…',
    rewriting: 'Reescrevendo os bullets…', scoring: 'Pontuando…',
    present: 'Atual', language: 'Idioma', theme: 'Tema',
    tweaks: 'Ajustes', light: 'Claro', dark: 'Escuro',
    poweredBy: 'Com MatchCV',
  },
};
