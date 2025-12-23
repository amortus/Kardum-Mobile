# 📝 PASSO 6 DETALHADO: Adicionar Variáveis Extras

## ⚠️ IMPORTANTE: Onde Adicionar?

**As variáveis vão no SERVIÇO (seu projeto principal), NÃO no banco de dados!**

O banco de dados é apenas para armazenar dados. As variáveis de configuração vão no serviço que roda o jogo.

---

## 🎯 ONDE ESTAMOS?

Você já tem:
- ✅ Variáveis básicas adicionadas (JWT_SECRET, ADMIN_USERNAME, etc.)
- ✅ Banco PostgreSQL criado
- ✅ Variável DATABASE_URL criada automaticamente

**Agora vamos adicionar 2 variáveis extras no SERVIÇO.**

---

## 📍 PASSO A PASSO DETALHADO

### PASSO 6.1: Voltar para a Tela de Variables do SERVIÇO

1. **No dashboard do Railway, você deve ver 2 cards:**
   - Um card com o nome do seu projeto (ex: "web" ou "Kardum Mobile")
   - Um card com o nome do banco (ex: "Postgres" ou "PostgreSQL")

2. **Clique no card do SEU PROJETO (não no banco de dados!)**
   - É o card que tem o nome do seu projeto
   - Geralmente está à esquerda ou acima do card do banco

3. **Agora você está dentro do serviço do seu projeto**

4. **Clique na aba "Variables"**
   - Está no menu superior, ao lado de "Deployments", "Metrics", "Settings"
   - É a mesma tela onde você adicionou as variáveis antes

5. **Você deve ver todas as variáveis que você já adicionou:**
   - JWT_SECRET
   - ADMIN_USERNAME
   - ADMIN_PASSWORD
   - DATABASE_PATH
   - DATABASE_URL (criada automaticamente)
   - PORT (criada automaticamente)

✅ **Você está no lugar certo!**

---

### PASSO 6.2: Adicionar JWT_EXPIRES_IN

1. **Procure o botão "+ New Variable"**
   - Geralmente está no canto superior direito da tela
   - É um botão roxo com um sinal de "+"
   - Pode estar escrito "New Variable" ou só ter um ícone "+"

2. **Clique em "+ New Variable"**
   - Uma janela ou formulário vai abrir

3. **Você verá 2 campos:**
   - **Campo 1:** Nome da variável (Variable Name / Key)
   - **Campo 2:** Valor da variável (Value)

4. **No PRIMEIRO campo (Nome), digite EXATAMENTE:**
   ```
   JWT_EXPIRES_IN
   ```
   - Letras maiúsculas
   - Com underscore (_) entre as palavras
   - Sem espaços antes ou depois
   - Exatamente assim: `JWT_EXPIRES_IN`

5. **No SEGUNDO campo (Valor), digite EXATAMENTE:**
   ```
   7d
   ```
   - Apenas "7d" (o número 7 e a letra d minúscula)
   - Sem espaços
   - Isso significa que o login dura 7 dias

6. **Verifique se está assim:**
   - Nome: `JWT_EXPIRES_IN`
   - Valor: `7d`

7. **Clique no botão "Save" ou "Add" ou "Confirmar"**
   - Geralmente é um botão verde ou roxo na parte inferior da janela
   - Ou pode ser um botão "✓" (check)

8. **A variável deve aparecer na lista!**
   - Você verá `JWT_EXPIRES_IN` na lista de variáveis
   - Com o valor `7d` ao lado

✅ **Primeira variável extra adicionada!**

---

### PASSO 6.3: Adicionar NODE_ENV

1. **Clique em "+ New Variable" novamente**
   - Mesmo botão de antes

2. **Uma nova janela vai abrir**

3. **No PRIMEIRO campo (Nome), digite EXATAMENTE:**
   ```
   NODE_ENV
   ```
   - Letras maiúsculas
   - Com underscore (_) entre as palavras
   - Sem espaços
   - Exatamente assim: `NODE_ENV`

4. **No SEGUNDO campo (Valor), digite EXATAMENTE:**
   ```
   production
   ```
   - Tudo minúsculo
   - Sem espaços
   - Exatamente assim: `production`
   - Isso ativa o modo de produção

5. **Verifique se está assim:**
   - Nome: `NODE_ENV`
   - Valor: `production`

6. **Clique em "Save" ou "Add" ou "Confirmar"**

7. **A variável deve aparecer na lista!**
   - Você verá `NODE_ENV` na lista
   - Com o valor `production` ao lado

✅ **Segunda variável extra adicionada!**

---

## ✅ VERIFICAÇÃO FINAL

Agora você deve ter TODAS essas variáveis na lista:

- ✅ `JWT_SECRET` (sua chave secreta)
- ✅ `ADMIN_USERNAME` (admin ou outro)
- ✅ `ADMIN_PASSWORD` (sua senha segura)
- ✅ `DATABASE_PATH` (pode estar lá)
- ✅ `DATABASE_URL` (criada automaticamente)
- ✅ `PORT` (criada automaticamente)
- ✅ `JWT_EXPIRES_IN` (valor: 7d) ← **NOVA!**
- ✅ `NODE_ENV` (valor: production) ← **NOVA!**

**Se todas estão lá, está perfeito! 🎉**

---

## 🖼️ VISUALIZAÇÃO (Como Deve Ficar)

```
┌─────────────────────────────────────────┐
│  Variables                              │
│                                         │
│  [New Variable] [Shared Variable]      │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ JWT_SECRET        sua-chave...    │ │
│  │ ADMIN_USERNAME    admin           │ │
│  │ ADMIN_PASSWORD    sua-senha...    │ │
│  │ DATABASE_URL      postgresql://...│ │
│  │ DATABASE_PATH     ./database...   │ │
│  │ PORT              3000            │ │
│  │ JWT_EXPIRES_IN    7d              │ │ ← NOVA!
│  │ NODE_ENV          production      │ │ ← NOVA!
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## ❓ DÚVIDAS COMUNS

### "Não encontro o botão + New Variable"
**Solução:**
- Certifique-se de estar na aba "Variables" do SERVIÇO (não do banco)
- Role a página para cima, pode estar no topo
- Procure por um botão roxo ou verde com "+"

### "A janela não abre quando clico"
**Solução:**
- Tente clicar novamente
- Atualize a página (F5) e tente de novo
- Use outro navegador se necessário

### "Não sei se estou no serviço ou no banco"
**Solução:**
- Se você vê "Postgres" ou "PostgreSQL" no título, está no banco
- Volte para o dashboard e clique no card do seu PROJETO
- O card do projeto geralmente tem o nome "web" ou "Kardum Mobile"

### "Já adicionei mas não aparece na lista"
**Solução:**
- Atualize a página (F5)
- Verifique se clicou em "Save"
- Tente adicionar novamente

---

## 🎯 PRÓXIMO PASSO

Depois de adicionar essas 2 variáveis:

**PASSO 7: Verificar Deploy**
- Vá na aba "Deployments"
- Veja se está "Active" (verde)
- Se estiver "Building", aguarde alguns minutos

---

**Você está indo muito bem! Continue assim! 💪**

