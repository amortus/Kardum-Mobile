# ✅ CHECKLIST PASSO A PASSO - Railway

## 📋 COPIE E COLE ESTE CHECKLIST - VÁ MARCANDO CONFORME FAZ

---

## PARTE 1: VARIÁVEIS (5 minutos)

### ☐ PASSO 1: Adicionar Variáveis Sugeridas
- [ ] Estou na tela "Variables" do Railway
- [ ] Vejo 4 variáveis sugeridas na parte de baixo
- [ ] Cliquei no botão roxo "Add" (com ✓)
- [ ] As 4 variáveis apareceram na lista acima

### ☐ PASSO 2: Gerar Chave Secreta
**Escolha UMA opção:**

**OPÇÃO A - Terminal:**
- [ ] Abri o PowerShell (Windows + X → PowerShell)
- [ ] Digitei: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- [ ] Pressionei ENTER
- [ ] Copiei a chave que apareceu (Ctrl+C)

**OPÇÃO B - Site:**
- [ ] Abri: https://randomkeygen.com/
- [ ] Cliquei em uma chave da seção "CodeIgniter Encryption Keys"
- [ ] Copiei a chave inteira (Ctrl+C)

### ☐ PASSO 3: Editar JWT_SECRET
- [ ] Cliquei no ícone `{}` ao lado de `JWT_SECRET`
- [ ] Selecionei todo o texto antigo (Ctrl+A)
- [ ] Colei minha chave secreta (Ctrl+V)
- [ ] Cliquei em "Save"

### ☐ PASSO 4: Editar ADMIN_PASSWORD
- [ ] Cliquei no ícone `{}` ao lado de `ADMIN_PASSWORD`
- [ ] Apaguei o texto `admin123`
- [ ] Digitei uma senha segura (ex: `Kardum2024!Admin`)
- [ ] **ANOTEI A SENHA EM UM LUGAR SEGURO**
- [ ] Cliquei em "Save"

### ☐ PASSO 5: Verificar ADMIN_USERNAME
- [ ] Verifiquei que `ADMIN_USERNAME` existe
- [ ] (Opcional) Mudei para outro nome ou deixei como `admin`

---

## PARTE 2: BANCO DE DADOS (2 minutos)

### ☐ PASSO 6: Criar PostgreSQL
- [ ] Cliquei em "+ New" (canto superior direito)
- [ ] Cliquei em "Database"
- [ ] Cliquei em "Add PostgreSQL"
- [ ] Aguardei 1-2 minutos até criar
- [ ] Vi um novo card aparecer no dashboard

### ☐ PASSO 7: Verificar DATABASE_URL
- [ ] Fui na aba "Variables"
- [ ] Procurei por `DATABASE_URL` na lista
- [ ] Confirmei que ela existe (criada automaticamente)
- [ ] **NÃO PRECISEI FAZER NADA COM ELA**

---

## PARTE 3: VARIÁVEIS EXTRAS (2 minutos)

### ☐ PASSO 8: Adicionar JWT_EXPIRES_IN
- [ ] Cliquei em "+ New Variable"
- [ ] No campo "Nome", digitei: `JWT_EXPIRES_IN`
- [ ] No campo "Valor", digitei: `7d`
- [ ] Cliquei em "Save"

### ☐ PASSO 9: Adicionar NODE_ENV
- [ ] Cliquei em "+ New Variable" novamente
- [ ] No campo "Nome", digitei: `NODE_ENV`
- [ ] No campo "Valor", digitei: `production`
- [ ] Cliquei em "Save"

---

## PARTE 4: VERIFICAÇÃO (1 minuto)

### ☐ PASSO 10: Verificar Todas as Variáveis
Vou na aba "Variables" e verifico se tenho TODAS essas:

- [ ] `JWT_SECRET` (com minha chave secreta, não o padrão)
- [ ] `ADMIN_USERNAME` (admin ou outro)
- [ ] `ADMIN_PASSWORD` (minha senha segura, não admin123)
- [ ] `DATABASE_URL` (criada automaticamente)
- [ ] `DATABASE_PATH` (pode estar lá, não precisa mexer)
- [ ] `JWT_EXPIRES_IN` (valor: 7d)
- [ ] `NODE_ENV` (valor: production)
- [ ] `PORT` (criada automaticamente, não precisa mexer)

**✅ Se todas estão lá, está tudo certo!**

---

## PARTE 5: DEPLOY (3-5 minutos)

### ☐ PASSO 11: Verificar Deploy
- [ ] Fui na aba "Deployments"
- [ ] Vi o deploy mais recente no topo
- [ ] Status está "Active" (verde) OU "Building/Deploying" (aguardando)

**Se está "Building" ou "Deploying":**
- [ ] Aguardando alguns minutos...
- [ ] Status mudou para "Active" ✅

**Se está "Failed" (vermelho):**
- [ ] Cliquei em "View Logs"
- [ ] Anotei o erro que apareceu
- [ ] Vou pedir ajuda com esse erro

**Se não iniciou automaticamente:**
- [ ] Cliquei em "Redeploy" ou "Deploy"

---

## PARTE 6: DOMÍNIO (1 minuto)

### ☐ PASSO 12: Gerar Domínio
- [ ] Fui na aba "Settings"
- [ ] Procurei a seção "Networking" ou "Domains"
- [ ] Cliquei em "Generate Domain" ou "Add Domain"
- [ ] Railway gerou um domínio automaticamente
- [ ] **COPIEI O DOMÍNIO** (ex: `kardum-mobile.up.railway.app`)

### ☐ PASSO 13: Acessar o Jogo
- [ ] Abri meu navegador
- [ ] Colei o domínio na barra de endereço
- [ ] Pressionei ENTER
- [ ] A tela de login do jogo apareceu ✅

**Se não apareceu:**
- [ ] Aguardei mais 1-2 minutos
- [ ] Atualizei a página (F5)
- [ ] Tentei novamente

---

## PARTE 7: TESTAR (5 minutos)

### ☐ PASSO 14: Criar Conta
- [ ] Na tela de login, cliquei em "Criar conta"
- [ ] Preenchi:
  - Username: `meu_usuario` (escolhi um nome)
  - Email: `meuemail@gmail.com` (meu email)
  - Password: `MinhaSenha123` (escolhi uma senha)
- [ ] Cliquei em "Criar Conta"
- [ ] Fui redirecionado para o menu principal ✅

### ☐ PASSO 15: Fazer Login
- [ ] Fiz logout (se necessário)
- [ ] Digitei meu Username
- [ ] Digitei minha Password
- [ ] Cliquei em "Entrar"
- [ ] Entrei no jogo ✅

### ☐ PASSO 16: Criar Deck
- [ ] Cliquei em "Deck Builder" ou "Criar Deck"
- [ ] Escolhi um general
- [ ] Adicionei algumas cartas
- [ ] Dei um nome ao deck
- [ ] Cliquei em "Salvar"
- [ ] O deck foi salvo ✅

---

## 🎉 PRONTO!

### ☐ TUDO FUNCIONANDO
- [ ] Jogo está online
- [ ] Consigo criar conta
- [ ] Consigo fazer login
- [ ] Consigo criar e salvar decks
- [ ] Tudo funcionando perfeitamente! 🚀

---

## ❓ SE ALGO DEU ERRADO

**Anote aqui qual erro apareceu:**
```
Erro: _________________________________________

Onde aconteceu: _______________________________

O que eu estava fazendo: ______________________
```

**E me envie essa informação para eu te ajudar!**

---

## 📝 ANOTAÇÕES PESSOAIS

**Meu domínio do jogo:**
```
_______________________________________________
```

**Minha senha de admin (ANOTADA EM LUGAR SEGURO):**
```
_______________________________________________
```

**Meu username de teste:**
```
_______________________________________________
```

---

**Boa sorte! Você consegue! 💪**

