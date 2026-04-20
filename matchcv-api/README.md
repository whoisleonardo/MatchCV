# MatchCV API

Backend de geração de currículos otimizados por IA. O usuário cadastra seu perfil, experiências, projetos e educação. Ao acionar a geração, a API envia o CV para um modelo de linguagem (LLM) que reescreve os bullet points com foco na vaga, e então compila um PDF profissional via LaTeX.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Linguagem | Java 21 |
| Framework | Spring Boot 4 |
| Banco de dados | Apache Cassandra |
| Autenticação | Spring Security + JWT (JJWT 0.12, HS256) |
| IA | LM Studio via Cloudflare Tunnel (API compatível com OpenAI) |
| Geração de PDF | LaTeX + `pdflatex` CLI |
| Build | Maven (Maven Wrapper incluso) |

---

## Pré-requisitos

- Java 21+
- Maven (ou use `./mvnw`)
- Docker (para o Cassandra)
- `pdflatex` instalado no sistema (`texlive-full` ou equivalente)
- LM Studio rodando localmente com túnel Cloudflare ativo

---

## Configuração

Copie o arquivo de exemplo e preencha os valores:

```bash
cp .env.example .env
```

| Variável | Descrição |
|---|---|
| `DB_HOST` | Host do Cassandra (padrão: `127.0.0.1`) |
| `DB_PORT` | Porta CQL do Cassandra (padrão: `9042`) |
| `DB_KEYSPACE` | Keyspace do Cassandra (`matchcv_ks`) |
| `JWT_SECRET` | Chave secreta para assinar JWT — mínimo 32 caracteres |
| `ADMIN_API_KEY` | Chave para proteger o endpoint de criação de usuários |
| `LLM_API_URL` | URL do endpoint OpenAI-compatible (ex: LM Studio via túnel) |
| `LLM_MODEL_NAME` | Nome do modelo a ser usado (ex: `qwen2.5-7b-instruct`) |

Gere as chaves secretas com:

```bash
openssl rand -base64 32
```

---

## Subindo o banco

O `docker-compose.yml` está na pasta pai do projeto (`../`):

```bash
cd .. && docker-compose up -d
```

Após subir o Cassandra, execute as migrations na ordem (V1 a V9) usando `cqlsh` ou sua ferramenta preferida.

---

## Rodando a aplicação

```bash
./mvnw spring-boot:run
```

---

## Arquitetura

### Estrutura de pacotes

```
com.matchcv/
├── controller/         Camada HTTP — recebe requests, devolve responses
├── service/            Lógica de negócio
├── repository/         Acesso ao Cassandra via Spring Data
├── model/              Entidades mapeadas para as tabelas
├── dto/
│   ├── (root)          DTOs de autenticação (login, criação de usuário)
│   ├── api/            DTOs de entrada/saída da API pública
│   └── llm/            DTOs internos da integração com o LLM
└── security/           Filtros JWT, filtro de API Key, configuração Spring Security
```

### Diagrama de dependências entre serviços

```
CvController
    └── CvOrchestratorService
            ├── UserProfileRepository        (Cassandra)
            ├── UserExperienceRepository     (Cassandra)
            ├── UserEducationRepository      (Cassandra)
            ├── UserProjectRepository        (Cassandra)
            ├── LlmService                   (LM Studio via HTTP)
            └── PdfGeneratorService          (pdflatex CLI)
```

---

## Banco de dados (Cassandra)

### Keyspace

```
matchcv_ks — SimpleStrategy, replication_factor: 1
```

### Tabelas

#### `user_profiles`
Armazena o perfil completo do usuário.

| Coluna | Tipo | Descrição |
|---|---|---|
| `id` | UUID | Chave primária |
| `full_name` | TEXT | Nome completo |
| `username` | TEXT | Nome de usuário único |
| `title` | TEXT | Título profissional (ex: Software Engineer) |
| `email` | TEXT | E-mail de contato |
| `phone` | TEXT | Telefone de contato |
| `location` | TEXT | Localização |
| `linkedin` | TEXT | URL do LinkedIn |
| `summary` | TEXT | Resumo profissional |
| `skills` | LIST\<TEXT\> | Lista de habilidades |
| `password_hash` | TEXT | Hash BCrypt (nunca exposto na API) |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de atualização |

#### `username_to_uid`
Índice para lookup eficiente por username no login.

| Coluna | Tipo | Descrição |
|---|---|---|
| `username` | TEXT | Chave primária |
| `user_id` | UUID | Referência ao perfil |

#### `user_experiences`
Experiências profissionais. Clustering por `exp_id DESC` (mais recentes primeiro).

| Coluna | Tipo | Descrição |
|---|---|---|
| `user_id` | UUID | Partition key |
| `exp_id` | TIMEUUID | Clustering key (DESC) |
| `company` | TEXT | Nome da empresa |
| `role` | TEXT | Cargo |
| `description` | TEXT | Descrição da experiência |
| `start_date` | DATE | Início |
| `end_date` | DATE | Fim |
| `is_current` | BOOLEAN | Emprego atual |

#### `user_education`
Formação acadêmica. Clustering por `edu_id DESC`.

| Coluna | Tipo |
|---|---|
| `user_id` | UUID (partition) |
| `edu_id` | TIMEUUID (clustering DESC) |
| `institution` | TEXT |
| `degree` | TEXT |
| `field` | TEXT |
| `start_date` | DATE |
| `end_date` | DATE |

#### `user_certifications`
Certificações. Clustering por `cert_id DESC`.

| Coluna | Tipo |
|---|---|
| `user_id` | UUID (partition) |
| `cert_id` | TIMEUUID (clustering DESC) |
| `name` | TEXT |
| `issuer` | TEXT |
| `issued_date` | DATE |
| `expires_at` | DATE |
| `url` | TEXT |

#### `user_projects`
Projetos pessoais e open source. Clustering por `project_id DESC`.

| Coluna | Tipo |
|---|---|
| `user_id` | UUID (partition) |
| `project_id` | TIMEUUID (clustering DESC) |
| `name` | TEXT |
| `role` | TEXT |
| `description` | TEXT |
| `url` | TEXT |
| `date` | DATE |

---

## API

### Segurança por rota

| Rota | Proteção |
|---|---|
| `POST /admin/users` | Header `X-Admin-Key` |
| `POST /auth/login` | Pública |
| `POST /api/**` | JWT obrigatório (`Authorization: Bearer <token>`) |

---

### Autenticação

#### Criar usuário
Uso exclusivo do administrador via Postman.

```
POST /admin/users
X-Admin-Key: <ADMIN_API_KEY>
Content-Type: application/json
```

```json
{
  "fullName": "João Silva",
  "username": "joaosilva",
  "password": "senhasegura123",
  "title": "Software Engineer",
  "email": "joao@email.com",
  "phone": "+55 11 99999-9999",
  "location": "São Paulo, Brasil",
  "linkedin": "https://linkedin.com/in/joaosilva",
  "summary": "Engenheiro backend com 5 anos de experiência...",
  "skills": ["Java", "Spring Boot", "Cassandra", "Docker"]
}
```

**Resposta:** `201 Created` → objeto `UserProfile` (sem `password_hash`)

---

#### Login

```
POST /auth/login
Content-Type: application/json
```

```json
{
  "username": "joaosilva",
  "password": "senhasegura123"
}
```

**Resposta:** `200 OK`

```json
{
  "token": "eyJhbGc...",
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "username": "joaosilva"
}
```

> Use o `token` no header `Authorization: Bearer <token>` em todas as rotas `/api/**`.

---

### Perfil — Experiências

```
POST   /api/profile/experiences
GET    /api/profile/experiences
DELETE /api/profile/experiences/{expId}
```

**Body do POST:**
```json
{
  "company": "Empresa XYZ",
  "role": "Engenheiro Backend",
  "description": "Desenvolvi APIs REST em Java com Spring Boot...",
  "startDate": "2022-01-01",
  "endDate": "2024-06-01",
  "isCurrent": false
}
```

---

### Perfil — Educação

```
POST   /api/profile/education
GET    /api/profile/education
DELETE /api/profile/education/{eduId}
```

**Body do POST:**
```json
{
  "institution": "Universidade Federal de Viçosa",
  "degree": "Bacharelado",
  "field": "Ciência da Computação",
  "startDate": "2017-01-01",
  "endDate": "2021-12-01"
}
```

---

### Perfil — Certificações

```
POST   /api/profile/certifications
GET    /api/profile/certifications
DELETE /api/profile/certifications/{certId}
```

**Body do POST:**
```json
{
  "name": "AWS Certified Developer",
  "issuer": "Amazon Web Services",
  "issuedDate": "2023-05-01",
  "expiresAt": "2026-05-01",
  "url": "https://aws.amazon.com/verification/..."
}
```

---

### Perfil — Projetos

```
POST   /api/profile/projects
GET    /api/profile/projects
DELETE /api/profile/projects/{projectId}
```

**Body do POST:**
```json
{
  "name": "MatchCV",
  "role": "Criador & Engenheiro Full-Stack",
  "description": "API de geração de CVs otimizados por IA com LaTeX e Cassandra.",
  "url": "https://github.com/usuario/matchcv",
  "date": "2025-01-01"
}
```

---

### Geração de CV

O endpoint principal da aplicação. Busca todos os dados do usuário autenticado, envia para a IA otimizar os bullets para a vaga, e retorna um PDF compilado.

```
POST /api/cv/generate
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "jobDescription": "Estamos buscando um engenheiro backend sênior com experiência em sistemas distribuídos, Java, Kafka e AWS...",
  "language": "Portuguese"
}
```

**Resposta:** `200 OK`
```
Content-Type: application/pdf
Content-Disposition: attachment; filename="cv_<userId>.pdf"
Body: <bytes do PDF>
```

---

### Otimização isolada (debug)

Útil para testar a integração com o LLM sem gerar o PDF.

```
POST /api/llm/optimize
Authorization: Bearer <token>
Content-Type: application/json
```

```json
{
  "cv": "Trabalhei na empresa X desenvolvendo APIs...",
  "jobDescription": "Buscamos um engenheiro com foco em performance...",
  "language": "English"
}
```

**Resposta:**
```json
{
  "optimized_bullets": [
    "Engineered high-throughput REST APIs serving [X]M+ requests/day...",
    "Reduced p99 latency by [X]% through query optimization..."
  ],
  "faang_ready_score": 74,
  "improvements": [
    "Add specific metrics to quantify impact",
    "Use stronger action verbs"
  ]
}
```

---

## Fluxo de geração do PDF

```
POST /api/cv/generate
        │
        ▼
CvOrchestratorService
  1. Busca UserProfile          → Cassandra
  2. Busca UserExperiences      → Cassandra
  3. Busca UserEducation        → Cassandra
  4. Busca UserProjects         → Cassandra
  5. Monta texto do CV          → String plano para a IA
        │
        ▼
LlmService (temperatura 0.3)
  - SYSTEM PROMPT: recruiter FAANG + instruções STAR + format JSON
  - USER MESSAGE:
      JOB_DESCRIPTION: <texto da vaga>
      CV_BASE: <perfil + experiências + projetos + educação>
  - Retorna: { optimized_bullets[], faang_ready_score, improvements[] }
        │
        ▼
PdfGeneratorService
  1. Carrega cv_template.tex do classpath
  2. Injeta todos os dados nos placeholders
  3. Escreve .tex em diretório temporário
  4. Executa: pdflatex -interaction=nonstopmode cv.tex
  5. Lê cv.pdf → byte[]
  6. Deleta diretório temporário (finally)
        │
        ▼
ResponseEntity<byte[]>
  Content-Type: application/pdf
  Content-Disposition: attachment; filename="cv_<userId>.pdf"
```

---

## Template LaTeX

O arquivo `src/main/resources/cv_template.tex` define o layout do CV. Os placeholders são substituídos pelo `PdfGeneratorService` antes da compilação:

| Placeholder | Origem |
|---|---|
| `{{fullName}}` | `UserProfile.fullName` |
| `{{title}}` | `UserProfile.title` |
| `{{contact_line}}` | email + phone com `\href`, omitidos se vazios |
| `{{links}}` | `UserProfile.linkedin` |
| `{{summary}}` | `UserProfile.summary` |
| `{{experience_block}}` | `List<UserExperience>` + bullets da IA distribuídos |
| `{{projects_block}}` | `List<UserProject>` |
| `{{skills}}` | `UserProfile.skills` em `longtable` |
| `{{education}}` | `List<UserEducation>` |

> Todos os valores são escapados para LaTeX antes da injeção (`&`, `%`, `$`, `#`, `_`, `{`, `}`, `~`, `^`, `\`).

---

## Migrations

| Arquivo | Descrição |
|---|---|
| `V1__Create_Keyspace.cql` | Cria o keyspace `matchcv_ks` |
| `V2__Create_User_Profiles.cql` | Tabela `user_profiles` |
| `V3__Create_Username_Lookup.cql` | Tabela `username_to_uid` |
| `V4__Create_User_Experiences.cql` | Tabela `user_experiences` |
| `V5__Create_User_Education.cql` | Tabela `user_education` |
| `V6__Create_User_Certifications.cql` | Tabela `user_certifications` |
| `V7__Add_Password_Hash.cql` | Adiciona coluna `password_hash` |
| `V8__Add_Profile_Fields.cql` | Adiciona colunas `email`, `phone`, `title` |
| `V9__Create_User_Projects.cql` | Tabela `user_projects` |

---

## Comandos úteis

```bash
# Compilar
./mvnw clean package

# Rodar
./mvnw spring-boot:run

# Testar
./mvnw test

# Rodar um teste específico
./mvnw test -Dtest=NomeDaClasseTest

# Subir o Cassandra (pasta pai)
cd .. && docker-compose up -d
```
