# 🚀 Configuração Passo a Passo - Railway

## 📋 PASSO 1: Adicionar Variáveis Sugeridas

Na tela de **Variables** que você está vendo:

1. **Clique no botão "Add"** (botão roxo com ✓) abaixo das variáveis sugeridas
   - Isso adiciona automaticamente:
     - `JWT_SECRET`
     - `ADMIN_USERNAME`
     - `ADMIN_PASSWORD`
     - `DATABASE_PATH`

2. **⚠️ IMPORTANTE**: Altere o `JWT_SECRET` para um valor seguro:
   - Clique no ícone `{}` ao lado de `JWT_SECRET`
   - Ou clique em "Edit" na variável
   - Substitua por um secret seguro (veja PASSO 2)

## 🔐 PASSO 2: Gerar JWT_SECRET Seguro

**Opção A - Terminal (Recomendado):**
```bash
# No terminal do Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Ou use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Opção B - Online:**
- Acesse: https://randomkeygen.com/
- Use uma "CodeIgniter Encryption Keys" (64 caracteres)
- Ou "Fort Knox Passwords" (32+ caracteres)

**Opção C - Simples (menos seguro, mas funcional):**
- Use uma string longa e aleatória, exemplo:
  ```
  kardum-mobile-2024-super-secret-jwt-key-change-this-in-production-now
  ```

## 📝 PASSO 3: Editar Variáveis (Obrigatório)

Após adicionar as variáveis sugeridas, edite cada uma:

### 3.1. JWT_SECRET
- Clique em `JWT_SECRET` → Editar
- Cole o secret gerado no PASSO 2
- **NÃO use o valor padrão em produção!**

### 3.2. ADMIN_USERNAME (Opcional)
- Pode deixar como `admin` ou mudar para outro nome
- Exemplo: `kardum_admin`

### 3.3. ADMIN_PASSWORD (Opcional mas Recomendado)
- **MUDE para uma senha segura!**
- Exemplo: `MinhaSenh@Segura123!`
- Use pelo menos 12 caracteres com letras, números e símbolos

### 3.4. DATABASE_PATH
- **Para Railway com PostgreSQL, você pode REMOVER esta variável**
- Ou deixe como está (será ignorada se usar PostgreSQL)

## 🗄️ PASSO 4: Adicionar Banco PostgreSQL

1. No dashboard do Railway, clique em **"+ New"** (canto superior direito)
2. Selecione **"Database"**
3. Escolha **"Add PostgreSQL"**
4. Aguarde o banco ser criado (1-2 minutos)
5. **IMPORTANTE**: O Railway criará automaticamente a variável `DATABASE_URL`
   - Você não precisa fazer nada, ela já estará disponível

## ⚙️ PASSO 5: Adicionar Variáveis Adicionais (Opcional)

Clique em **"+ New Variable"** e adicione:

### JWT_EXPIRES_IN (Opcional)
- **Nome**: `JWT_EXPIRES_IN`
- **Valor**: `7d` (7 dias)
- Isso define por quanto tempo o token de login é válido

### NODE_ENV (Opcional)
- **Nome**: `NODE_ENV`
- **Valor**: `production`
- Isso ativa modo de produção

## ✅ PASSO 6: Verificar Variáveis Finais

Sua lista de variáveis deve ter pelo menos:

```
✅ JWT_SECRET (com valor seguro gerado)
✅ ADMIN_USERNAME (admin ou customizado)
✅ ADMIN_PASSWORD (senha segura)
✅ DATABASE_URL (criada automaticamente pelo PostgreSQL)
✅ DATABASE_PATH (pode remover se usar PostgreSQL)
✅ PORT (criada automaticamente pelo Railway)
```

## 🚀 PASSO 7: Aguardar Deploy

1. Após configurar as variáveis, o Railway fará deploy automaticamente
2. Ou clique em **"Deployments"** → **"Redeploy"**
3. Acompanhe os logs em **"View Logs"**

## ⚠️ IMPORTANTE: Código Atual Usa SQLite

**O código atual ainda usa SQLite**, não PostgreSQL. Para funcionar no Railway com PostgreSQL, você tem 2 opções:

### Opção A: Usar SQLite Temporariamente (Teste Rápido)
- Não adicione PostgreSQL
- Deixe `DATABASE_PATH` como está
- ⚠️ **Dados serão perdidos a cada deploy** (não recomendado para produção)

### Opção B: Migrar para PostgreSQL (Recomendado)
- Precisamos atualizar `server/database.js` para usar PostgreSQL
- Isso requer mudanças no código
- **Posso fazer isso agora se quiser!**

## 🧪 PASSO 8: Testar

Após o deploy completar:

1. Acesse o domínio fornecido pelo Railway
2. Teste criar uma conta
3. Teste fazer login
4. Teste criar um deck

## 📞 Próximos Passos

**Se quiser migrar para PostgreSQL agora**, me avise e eu atualizo o código!

**Se quiser testar com SQLite primeiro**, está tudo pronto para deploy!

---

## 🎯 Checklist Rápido

- [ ] Adicionei variáveis sugeridas (botão "Add")
- [ ] Gerei e configurei JWT_SECRET seguro
- [ ] Mudei ADMIN_PASSWORD para senha segura
- [ ] Adicionei PostgreSQL (se quiser usar)
- [ ] Verifiquei que o deploy está rodando
- [ ] Testei criar conta e login

