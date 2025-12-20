# 🚂 Guia de Deploy no Railway - Kardum Mobile

## ✅ Passo 1: Criar Conta e Projeto no Railway

1. Acesse [https://railway.app](https://railway.app)
2. Faça login com GitHub (recomendado) ou crie uma conta
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Escolha o repositório `amortus/Kardum-Mobile`
6. Railway irá detectar automaticamente o projeto

## ✅ Passo 2: Configurar Banco de Dados PostgreSQL

1. No dashboard do Railway, clique em **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway criará automaticamente um banco PostgreSQL
3. **IMPORTANTE**: Anote a variável `DATABASE_URL` que será criada automaticamente
4. O Railway já adiciona essa variável ao seu projeto

## ✅ Passo 3: Configurar Variáveis de Ambiente

No seu projeto Railway, vá em **"Variables"** e adicione:

### Variáveis Obrigatórias:

```env
# Porta (Railway define automaticamente, mas você pode definir)
PORT=3000

# Database (já configurado automaticamente pelo Railway quando você adiciona PostgreSQL)
# DATABASE_URL será criado automaticamente

# JWT Secret (GERE UM SECRET SEGURO!)
JWT_SECRET=seu-secret-super-seguro-aqui-mude-isso
JWT_EXPIRES_IN=7d

# Admin (opcional, mas recomendado)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=senha-segura-aqui

# Ambiente
NODE_ENV=production
RAILWAY_ENVIRONMENT=production
```

### Como gerar um JWT_SECRET seguro:

```bash
# No terminal (Linux/Mac)
openssl rand -base64 32

# Ou use um gerador online seguro
# https://randomkeygen.com/
```

## ✅ Passo 4: Atualizar Código para PostgreSQL (IMPORTANTE)

**⚠️ ATENÇÃO**: O código atual usa SQLite. Para Railway, precisamos usar PostgreSQL.

### Opção A: Atualizar database.js para suportar ambos

Edite `server/database.js` para detectar o ambiente:

```javascript
// No início do arquivo
const Database = require('better-sqlite3');
const { Pool } = require('pg');
const path = require('path');

let db;
let dbType = 'sqlite'; // ou 'postgres'

// Detectar qual banco usar
if (process.env.DATABASE_URL) {
    // PostgreSQL (Railway)
    dbType = 'postgres';
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    db = pool;
} else {
    // SQLite (desenvolvimento local)
    const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '../database.sqlite');
    db = new Database(dbPath);
    db.pragma('foreign_keys = ON');
}
```

**Nota**: Isso requer refatoração significativa. Alternativa mais simples abaixo.

### Opção B: Usar SQLite no Railway (temporário)

Railway suporta SQLite, mas **não é recomendado para produção** porque:
- Dados são perdidos quando o container reinicia
- Não escala bem

Para testar rapidamente, você pode:
1. Não adicionar PostgreSQL
2. Usar SQLite (dados serão perdidos em cada deploy)

## ✅ Passo 5: Configurar Build e Deploy

1. Railway detectará automaticamente o `package.json`
2. O `railway.json` já está configurado
3. Railway usará o comando `npm start` do `package.json`

### Verificar configuração:

- ✅ `railway.json` existe e está correto
- ✅ `Procfile` existe (web: node server/index.js)
- ✅ `package.json` tem script `start`

## ✅ Passo 6: Deploy

1. Railway fará deploy automaticamente quando você fizer push no GitHub
2. Ou clique em **"Deploy"** manualmente
3. Acompanhe os logs em **"Deployments"** → **"View Logs"**

## ✅ Passo 7: Configurar Domínio (Opcional)

1. No projeto Railway, vá em **"Settings"** → **"Networking"**
2. Clique em **"Generate Domain"** para um domínio gratuito
3. Ou configure um domínio customizado

## ✅ Passo 8: Testar o Deploy

1. Acesse o domínio fornecido pelo Railway
2. Teste:
   - ✅ Criar conta
   - ✅ Fazer login
   - ✅ Criar deck
   - ✅ Entrar em matchmaking (se tiver outro jogador)

## 🔧 Troubleshooting

### Erro: "Cannot find module"
- Verifique se todas as dependências estão no `package.json`
- Railway instala automaticamente via `npm install`

### Erro: "Database connection failed"
- Verifique se `DATABASE_URL` está configurada
- Se usar PostgreSQL, verifique se o banco foi criado

### Erro: "Port already in use"
- Railway define a porta automaticamente via `PORT`
- Não defina porta fixa, use `process.env.PORT`

### Logs não aparecem
- Verifique **"Deployments"** → **"View Logs"**
- Ou use `railway logs` via CLI

## 📝 Checklist Final

Antes de fazer deploy, verifique:

- [ ] Código está no GitHub
- [ ] `railway.json` configurado
- [ ] `Procfile` existe
- [ ] Variáveis de ambiente configuradas
- [ ] `JWT_SECRET` é seguro e único
- [ ] Banco de dados criado (PostgreSQL recomendado)
- [ ] Código atualizado para PostgreSQL (se necessário)

## 🚀 Comandos Úteis Railway CLI (Opcional)

```bash
# Instalar Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link ao projeto
railway link

# Ver logs
railway logs

# Abrir no navegador
railway open
```

## 📚 Recursos

- [Railway Docs](https://docs.railway.app)
- [Railway Discord](https://discord.gg/railway)
- [PostgreSQL no Railway](https://docs.railway.app/databases/postgresql)

---

**Próximos Passos Recomendados:**

1. ✅ Migrar código para PostgreSQL (importante para produção)
2. ✅ Adicionar migrações de banco de dados
3. ✅ Configurar CI/CD
4. ✅ Adicionar monitoramento
5. ✅ Configurar backup automático do banco

