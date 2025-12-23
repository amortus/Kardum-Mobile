# 🎯 CONTINUAÇÃO: Passo 6 - Onde Adicionar as Variáveis?

## ⚠️ DIFERENÇA IMPORTANTE

No Railway você tem **2 coisas diferentes**:

1. **SERVIÇO (seu projeto/jogo)** ← **AQUI que você adiciona variáveis!**
2. **BANCO DE DADOS (PostgreSQL)** ← **NÃO adicione variáveis aqui!**

---

## 📍 COMO SABER ONDE ESTÁ?

### Se você está no SERVIÇO (lugar certo):
- Você vê o nome do seu projeto no topo (ex: "web" ou "Kardum Mobile")
- Você vê as abas: "Deployments", "Variables", "Metrics", "Settings"
- Você já viu as variáveis que adicionou antes (JWT_SECRET, ADMIN_USERNAME, etc.)

### Se você está no BANCO DE DADOS (lugar errado):
- Você vê "Postgres" ou "PostgreSQL" no topo
- Você vê abas diferentes: "Data", "Metrics", "Settings"
- Você NÃO vê as variáveis que adicionou antes

---

## ✅ PASSO A PASSO CORRETO

### 1. Voltar para o Dashboard Principal

1. **No topo da página, procure o nome do seu projeto**
   - Pode estar escrito "web", "Kardum Mobile", ou outro nome
   - Geralmente está no canto superior esquerdo

2. **Clique no nome do projeto**
   - Isso te leva de volta para o dashboard principal

3. **Você verá 2 cards:**
   ```
   ┌─────────────────┐  ┌─────────────────┐
   │  web            │  │  Postgres       │
   │  (seu projeto)   │  │  (banco dados)  │
   └─────────────────┘  └─────────────────┘
   ```

4. **Clique no card da ESQUERDA (seu projeto, não o banco!)**

---

### 2. Entrar na Aba Variables

1. **Agora você está dentro do serviço do seu projeto**

2. **No menu superior, clique em "Variables"**
   - Está entre "Deployments" e "Metrics"

3. **Você deve ver todas as variáveis que já adicionou:**
   - JWT_SECRET
   - ADMIN_USERNAME
   - ADMIN_PASSWORD
   - DATABASE_PATH
   - DATABASE_URL
   - PORT

✅ **Você está no lugar CERTO agora!**

---

### 3. Adicionar JWT_EXPIRES_IN

1. **Procure o botão "+ New Variable"**
   - Canto superior direito
   - Botão roxo com "+"

2. **Clique nele**

3. **Aparecerá um formulário com 2 campos:**

   ```
   ┌─────────────────────────────────────┐
   │  New Variable                       │
   │                                     │
   │  Variable Name: [___________]       │
   │  Value:         [___________]       │
   │                                     │
   │  [Cancel]  [Save]                   │
   └─────────────────────────────────────┘
   ```

4. **No campo "Variable Name", digite:**
   ```
   JWT_EXPIRES_IN
   ```

5. **No campo "Value", digite:**
   ```
   7d
   ```

6. **Clique em "Save"**

7. **A variável aparece na lista!**

---

### 4. Adicionar NODE_ENV

1. **Clique em "+ New Variable" novamente**

2. **No campo "Variable Name", digite:**
   ```
   NODE_ENV
   ```

3. **No campo "Value", digite:**
   ```
   production
   ```

4. **Clique em "Save"**

5. **A variável aparece na lista!**

---

## ✅ VERIFICAÇÃO

Sua lista de variáveis deve ter **PELO MENOS** essas 8:

1. ✅ JWT_SECRET
2. ✅ ADMIN_USERNAME
3. ✅ ADMIN_PASSWORD
4. ✅ DATABASE_PATH
5. ✅ DATABASE_URL
6. ✅ PORT
7. ✅ JWT_EXPIRES_IN ← **NOVA!**
8. ✅ NODE_ENV ← **NOVA!**

---

## 🎯 PRÓXIMOS PASSOS (Continuando de onde parou)

### PASSO 7: Verificar Deploy

1. **Ainda na mesma tela (serviço do projeto), clique na aba "Deployments"**
   - Está no menu superior, ao lado de "Variables"

2. **Você verá uma lista de deploys:**
   - O mais recente está no topo
   - Cada deploy tem um status

3. **Verifique o status:**
   - ✅ **"Active" (verde)** = Está funcionando! Pode continuar para o Passo 8
   - ⏳ **"Building" ou "Deploying"** = Aguarde 2-3 minutos e verifique novamente
   - ❌ **"Failed" (vermelho)** = Houve um erro. Clique no deploy e veja os logs

4. **Se estiver "Building":**
   - Aguarde alguns minutos
   - Atualize a página (F5) de vez em quando
   - Quando mudar para "Active", continue

---

### PASSO 8: Gerar Domínio

1. **Ainda no serviço do projeto, clique na aba "Settings"**
   - Está no menu superior

2. **Role a página para baixo até encontrar a seção "Networking" ou "Domains"**

3. **Procure o botão "Generate Domain" ou "Add Domain"**
   - Geralmente é um botão roxo ou verde

4. **Clique nele**

5. **O Railway vai gerar um domínio automaticamente:**
   - Exemplo: `kardum-mobile-production.up.railway.app`
   - Ou: `seu-projeto.up.railway.app`

6. **COPIE ESSE DOMÍNIO!**
   - Selecione o texto
   - Copie (Ctrl+C)
   - **ANOTE EM UM LUGAR SEGURO**

✅ **Domínio gerado!**

---

### PASSO 9: Testar o Jogo

1. **Abra seu navegador** (Chrome, Firefox, Edge, etc.)

2. **Na barra de endereço (onde você digita URLs), cole o domínio:**
   - Cole o domínio que você copiou
   - Exemplo: `kardum-mobile-production.up.railway.app`
   - Pressione ENTER

3. **O que deve acontecer:**
   - A página carrega
   - Você vê a tela de login do jogo Kardum Mobile
   - ✅ **Está funcionando!**

4. **Se não carregar:**
   - Aguarde mais 1-2 minutos (pode estar ainda iniciando)
   - Atualize a página (F5)
   - Verifique se o domínio está correto
   - Se ainda não funcionar, me avise

---

### PASSO 10: Criar Conta de Teste

1. **Na tela de login, procure o link "Criar conta" ou "Register"**
   - Geralmente está abaixo do formulário de login
   - Ou pode ser uma aba ao lado de "Login"

2. **Clique nele**

3. **Preencha o formulário:**
   - **Username:** Escolha um nome (ex: `teste123`)
   - **Email:** Seu email (ex: `meuemail@gmail.com`)
   - **Password:** Escolha uma senha (ex: `senha123`)

4. **Clique em "Criar Conta" ou "Register"**

5. **Você deve ser redirecionado para o menu principal do jogo!**
   - ✅ **Conta criada com sucesso!**

---

### PASSO 11: Fazer Login

1. **Se você saiu, faça login:**
   - Digite seu Username
   - Digite sua Password
   - Clique em "Entrar" ou "Login"

2. **Você entra no jogo!**
   - ✅ **Login funcionando!**

---

### PASSO 12: Criar um Deck

1. **No menu principal, procure "Deck Builder" ou "Criar Deck"**
   - Clique nele

2. **Crie um deck de teste:**
   - Escolha um general
   - Adicione algumas cartas
   - Dê um nome ao deck (ex: "Meu Primeiro Deck")
   - Clique em "Salvar"

3. **O deck deve ser salvo!**
   - ✅ **Deck criado e salvo no banco de dados!**

---

## 🎉 PRONTO! TUDO FUNCIONANDO!

Se você conseguiu:
- ✅ Adicionar as variáveis extras
- ✅ Verificar o deploy (Active)
- ✅ Gerar domínio
- ✅ Acessar o jogo
- ✅ Criar conta
- ✅ Fazer login
- ✅ Criar deck

**PARABÉNS! Seu jogo está online e funcionando! 🚀**

---

## ❓ SE ALGO DEU ERRADO

**Me diga:**
1. Em qual passo você está
2. O que você vê na tela
3. Qual erro apareceu (se houver)

**Vou te ajudar a resolver! 😊**

---

**Você está quase lá! Continue! 💪**

