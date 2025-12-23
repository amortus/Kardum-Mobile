# 🎯 PASSO A PASSO SUPER SIMPLES - Railway

## 👉 Siga na ordem, um passo de cada vez!

---

## 1️⃣ ADICIONAR VARIÁVEIS (2 minutos)

**O que fazer:**
1. Na tela "Variables", clique no botão roxo "Add" (tem um ✓)
2. Pronto! As variáveis foram adicionadas

---

## 2️⃣ CRIAR CHAVE SECRETA (1 minuto)

**Escolha UMA forma:**

**FORMA FÁCIL (Site):**
1. Abra: https://randomkeygen.com/
2. Clique em qualquer chave da seção "CodeIgniter Encryption Keys"
3. Copie a chave (Ctrl+C)

**FORMA TÉCNICA (Terminal):**
1. Abra PowerShell (Windows + X → PowerShell)
2. Digite: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
3. Pressione ENTER
4. Copie a chave que apareceu (Ctrl+C)

---

## 3️⃣ CONFIGURAR JWT_SECRET (30 segundos)

1. Clique no `{}` ao lado de `JWT_SECRET`
2. Selecione tudo (Ctrl+A)
3. Cole sua chave (Ctrl+V)
4. Clique em "Save"

---

## 4️⃣ CONFIGURAR SENHA ADMIN (30 segundos)

1. Clique no `{}` ao lado de `ADMIN_PASSWORD`
2. Apague `admin123`
3. Digite uma senha segura (ex: `Kardum2024!Admin`)
4. **ANOTE A SENHA!**
5. Clique em "Save"

---

## 5️⃣ CRIAR BANCO DE DADOS (2 minutos)

1. Clique em "+ New" (canto superior direito)
2. Clique em "Database"
3. Clique em "Add PostgreSQL"
4. Aguarde 1-2 minutos
5. Pronto! O banco foi criado

**IMPORTANTE:** A variável `DATABASE_URL` foi criada automaticamente. Não precisa fazer nada!

---

## 6️⃣ ADICIONAR VARIÁVEIS EXTRAS (1 minuto)

**Adicionar JWT_EXPIRES_IN:**
1. Clique em "+ New Variable"
2. Nome: `JWT_EXPIRES_IN`
3. Valor: `7d`
4. Salvar

**Adicionar NODE_ENV:**
1. Clique em "+ New Variable"
2. Nome: `NODE_ENV`
3. Valor: `production`
4. Salvar

---

## 7️⃣ VERIFICAR DEPLOY (2-3 minutos)

1. Vá em "Deployments"
2. Veja se está "Active" (verde)
3. Se estiver "Building", aguarde
4. Se estiver "Failed", me avise

---

## 8️⃣ PEGAR DOMÍNIO (30 segundos)

1. Vá em "Settings"
2. Procure "Networking" ou "Domains"
3. Clique em "Generate Domain"
4. **COPIE O DOMÍNIO** (ex: `kardum-mobile.up.railway.app`)

---

## 9️⃣ TESTAR (3 minutos)

1. Abra o domínio no navegador
2. Crie uma conta
3. Faça login
4. Crie um deck
5. **PRONTO! Está funcionando! 🎉**

---

## ❓ PROBLEMAS?

**"Erro ao fazer login"**
→ Verifique se JWT_SECRET está configurado

**"Página não carrega"**
→ Aguarde mais 2 minutos e atualize (F5)

**"Build Failed"**
→ Me envie o erro dos logs

---

## 📝 ANOTE AQUI:

**Meu domínio:**
```
_________________________________
```

**Minha senha admin:**
```
_________________________________
```

---

**É SÓ ISSO! Siga na ordem e vai dar certo! 💪**

