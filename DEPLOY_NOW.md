# 🚀 Deploy Rápido no Railway - Passo a Passo

## ✅ O que já está pronto:

- ✅ Código commitado e pushado para GitHub
- ✅ `railway.json` configurado
- ✅ `Procfile` criado
- ✅ `package.json` com todas as dependências

## 📋 Passo a Passo para Deploy:

### 1️⃣ Acesse o Railway

1. Vá para: https://railway.app
2. Faça login com sua conta GitHub
3. Clique em **"New Project"**
4. Selecione **"Deploy from GitHub repo"**
5. Escolha o repositório: `amortus/Kardum-Mobile`

### 2️⃣ Configure Variáveis de Ambiente

No dashboard do projeto Railway, vá em **"Variables"** e adicione:

```env
JWT_SECRET=GERE-UM-SECRET-SEGURO-AQUI-USE-32-CARACTERES
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**⚠️ IMPORTANTE**: Gere um JWT_SECRET seguro:
- Use: https://randomkeygen.com/ (seção "CodeIgniter Encryption Keys")
- Ou execute: `openssl rand -base64 32`

### 3️⃣ (OPCIONAL) Adicionar PostgreSQL

**Para produção, recomendo adicionar PostgreSQL:**

1. No projeto Railway, clique em **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway criará automaticamente e adicionará `DATABASE_URL` às variáveis
3. **NOTA**: O código atual usa SQLite. Para usar PostgreSQL, será necessário atualizar `server/database.js` (veja RAILWAY_DEPLOY.md)

**Para testar rapidamente, você pode pular este passo** (usará SQLite, mas dados serão perdidos em cada deploy)

### 4️⃣ Deploy Automático

Railway fará deploy automaticamente! Acompanhe em:
- **"Deployments"** → Veja o progresso
- **"View Logs"** → Veja os logs em tempo real

### 5️⃣ Obter URL do Projeto

1. Vá em **"Settings"** → **"Networking"**
2. Clique em **"Generate Domain"**
3. Railway criará um domínio como: `kardum-mobile-production.up.railway.app`

### 6️⃣ Testar

Acesse o domínio gerado e teste:
- ✅ Criar conta
- ✅ Fazer login
- ✅ Criar deck
- ✅ Entrar em matchmaking

## 🔧 Troubleshooting Rápido

### Erro: "Cannot find module"
```bash
# Verifique se todas as dependências estão no package.json
# Railway instala automaticamente via npm install
```

### Erro: "Port already in use"
```javascript
// No server/index.js, certifique-se de usar:
const PORT = process.env.PORT || 3000;
```

### Erro: "Database connection failed"
- Se usar SQLite: Normal, dados serão perdidos em cada deploy
- Se usar PostgreSQL: Verifique se `DATABASE_URL` está configurada

### Ver logs
- No Railway: **"Deployments"** → **"View Logs"**
- Ou use Railway CLI: `railway logs`

## 📝 Checklist Rápido

Antes de fazer deploy:

- [x] Código no GitHub ✅
- [x] railway.json configurado ✅
- [x] Procfile criado ✅
- [ ] Variáveis de ambiente configuradas (faça isso!)
- [ ] JWT_SECRET gerado (faça isso!)
- [ ] PostgreSQL adicionado (opcional, mas recomendado)

## 🎯 Próximos Passos (Depois do Deploy)

1. **Migrar para PostgreSQL** (importante para produção)
   - Veja `RAILWAY_DEPLOY.md` para instruções detalhadas

2. **Configurar domínio customizado** (opcional)
   - Settings → Networking → Custom Domain

3. **Monitorar performance**
   - Railway fornece métricas básicas

4. **Backup do banco** (se usar PostgreSQL)
   - Configure backup automático

## 💡 Dica Rápida

Para testar localmente antes de fazer deploy:

```bash
# No terminal
cd "E:\PROJETOS\Kardum Mobile"
npm install
npm start
```

Acesse: http://localhost:3000

---

**🚀 Pronto para deploy!** Siga os passos acima e seu jogo estará online em minutos!

