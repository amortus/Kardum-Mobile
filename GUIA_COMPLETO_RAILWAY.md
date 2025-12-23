# 📖 GUIA COMPLETO PASSO A PASSO - Railway (Para Iniciantes)

## 🎯 O QUE VOCÊ VAI FAZER

Você vai configurar o jogo Kardum Mobile para funcionar online no Railway. Vamos fazer isso em etapas bem simples!

---

## 📝 PARTE 1: CONFIGURAR VARIÁVEIS DE AMBIENTE

### PASSO 1.1: Adicionar Variáveis Sugeridas

Você está na tela de **Variables** do Railway. Veja as variáveis sugeridas na parte de baixo:

1. **Procure o botão roxo com um ✓ (check) que diz "Add"**
   - Está logo abaixo da lista de variáveis sugeridas
   - Clique nele **UMA VEZ**

2. **O que acontece:**
   - As 4 variáveis serão adicionadas automaticamente
   - Você verá elas aparecerem na lista de variáveis acima

✅ **Pronto! Variáveis adicionadas!**

---

### PASSO 1.2: Gerar um JWT_SECRET Seguro

Agora você precisa criar uma chave secreta segura. Vamos fazer isso:

#### Opção A: Usar o Terminal do Windows (Mais Seguro)

1. **Abra o PowerShell do Windows:**
   - Pressione `Windows + X`
   - Clique em "Windows PowerShell" ou "Terminal"
   - Ou procure "PowerShell" no menu Iniciar

2. **Digite exatamente isso e pressione ENTER:**
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

3. **O que vai aparecer:**
   - Uma linha de texto com letras, números e símbolos
   - Exemplo: `aB3dEf9GhIjKlMnOpQrStUvWxYz1234567890AbCdEfGh=`
   - **COPIE ESSE TEXTO INTEIRO** (Ctrl+C)

4. **Se der erro "node não encontrado":**
   - Você precisa instalar Node.js primeiro
   - Vá para: https://nodejs.org/
   - Baixe e instale a versão LTS
   - Depois tente novamente

#### Opção B: Usar Site Online (Mais Fácil)

1. **Abra seu navegador**
2. **Acesse:** https://randomkeygen.com/
3. **Na página, procure a seção "CodeIgniter Encryption Keys"**
4. **Clique em uma das chaves** (a primeira já serve)
5. **COPIE A CHAVE INTEIRA** (Ctrl+C)
   - Exemplo: `aB3dEf9GhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz12`

✅ **Você tem sua chave secreta copiada!**

---

### PASSO 1.3: Editar a Variável JWT_SECRET

Agora vamos colocar essa chave no Railway:

1. **Na tela de Variables do Railway, procure a variável `JWT_SECRET`**
   - Ela está na lista de variáveis que você acabou de adicionar

2. **Clique no ícone `{}` (chaves) que está ao lado direito de `JWT_SECRET`**
   - Ou clique diretamente no nome `JWT_SECRET`

3. **Uma janela vai abrir para editar:**
   - Você verá um campo de texto com o valor atual
   - O valor atual é: `seu_segredo_super_secreto_aqui_mude_em_producao`

4. **Selecione TODO o texto antigo:**
   - Clique no campo de texto
   - Pressione `Ctrl + A` (seleciona tudo)

5. **Cole sua chave secreta:**
   - Pressione `Ctrl + V` (cola o que você copiou)
   - Agora o campo deve ter sua chave secreta

6. **Clique no botão "Save" ou "Confirmar"**
   - Geralmente é um botão verde ou roxo na parte inferior da janela

✅ **JWT_SECRET configurado!**

---

### PASSO 1.4: Editar a Variável ADMIN_PASSWORD

Agora vamos mudar a senha do administrador:

1. **Procure a variável `ADMIN_PASSWORD` na lista**
2. **Clique no ícone `{}` ou no nome da variável**
3. **Uma janela vai abrir**

4. **Escolha uma senha segura:**
   - Use pelo menos 12 caracteres
   - Misture letras MAIÚSCULAS, minúsculas, números e símbolos
   - **Exemplos de senhas seguras:**
     - `Kardum2024!Admin`
     - `MinhaSenh@Segura123`
     - `Admin#Kardum2024`

5. **Digite a senha no campo:**
   - Apague o texto antigo (`admin123`)
   - Digite sua senha nova
   - **ANOTE ESSA SENHA EM UM LUGAR SEGURO!** Você vai precisar dela depois

6. **Clique em "Save" ou "Confirmar"**

✅ **ADMIN_PASSWORD configurado!**

---

### PASSO 1.5: Verificar ADMIN_USERNAME (Opcional)

1. **Procure a variável `ADMIN_USERNAME`**
2. **Se quiser mudar:**
   - Clique para editar
   - Pode deixar como `admin` ou mudar para outro nome
   - Exemplo: `kardum_admin`
3. **Se não quiser mudar, pode deixar como está**

✅ **Variáveis básicas configuradas!**

---

## 🗄️ PARTE 2: ADICIONAR BANCO DE DADOS POSTGRESQL

### PASSO 2.1: Criar o Banco PostgreSQL

1. **No dashboard do Railway, procure o botão "+ New"**
   - Geralmente está no canto superior direito
   - Ou no canto superior esquerdo, dependendo da versão

2. **Clique em "+ New"**
   - Um menu vai aparecer

3. **No menu, procure e clique em "Database"**
   - Pode estar escrito "Database" ou ter um ícone de banco de dados

4. **Outro menu vai aparecer, clique em "Add PostgreSQL"**
   - Ou "PostgreSQL" se for a única opção

5. **Aguarde o Railway criar o banco:**
   - Vai aparecer uma mensagem de "Creating..." ou "Provisioning..."
   - Isso leva de 1 a 2 minutos
   - Você verá um novo card aparecer no dashboard com o nome do banco

✅ **Banco PostgreSQL criado!**

---

### PASSO 2.2: Verificar Variável DATABASE_URL

1. **O Railway criou automaticamente uma variável chamada `DATABASE_URL`**
2. **Vá na aba "Variables" novamente**
3. **Procure por `DATABASE_URL` na lista**
   - Ela deve estar lá automaticamente
   - O valor será algo como: `postgresql://usuario:senha@host:porta/database`

4. **NÃO PRECISA FAZER NADA COM ELA!**
   - Ela já está configurada automaticamente
   - O código vai usar ela sozinho

✅ **DATABASE_URL já está configurada!**

---

## ⚙️ PARTE 3: ADICIONAR VARIÁVEIS OPCIONAIS (Recomendado)

### PASSO 3.1: Adicionar JWT_EXPIRES_IN

1. **Na tela de Variables, procure o botão "+ New Variable"**
   - Geralmente é um botão roxo no canto superior direito

2. **Clique em "+ New Variable"**

3. **Uma janela vai abrir com dois campos:**
   - **Campo 1: Nome da Variável**
   - **Campo 2: Valor da Variável**

4. **No primeiro campo (Nome), digite exatamente:**
   ```
   JWT_EXPIRES_IN
   ```
   - Sem espaços antes ou depois
   - Exatamente assim, com letras maiúsculas

5. **No segundo campo (Valor), digite exatamente:**
   ```
   7d
   ```
   - Apenas "7d" (sete e a letra d minúscula)
   - Isso significa que o login dura 7 dias

6. **Clique em "Save" ou "Add"**

✅ **JWT_EXPIRES_IN adicionado!**

---

### PASSO 3.2: Adicionar NODE_ENV

1. **Clique em "+ New Variable" novamente**

2. **No primeiro campo (Nome), digite:**
   ```
   NODE_ENV
   ```

3. **No segundo campo (Valor), digite:**
   ```
   production
   ```

4. **Clique em "Save" ou "Add"**

✅ **NODE_ENV adicionado!**

---

## ✅ PARTE 4: VERIFICAR TUDO

### PASSO 4.1: Lista de Verificação

Vá na aba "Variables" e verifique se você tem TODAS essas variáveis:

- [ ] `JWT_SECRET` - Deve ter sua chave secreta (não o valor padrão)
- [ ] `ADMIN_USERNAME` - Pode ser `admin` ou outro nome
- [ ] `ADMIN_PASSWORD` - Deve ter sua senha segura (não `admin123`)
- [ ] `DATABASE_URL` - Criada automaticamente pelo PostgreSQL
- [ ] `DATABASE_PATH` - Pode estar lá (não precisa mexer)
- [ ] `JWT_EXPIRES_IN` - Deve ter o valor `7d`
- [ ] `NODE_ENV` - Deve ter o valor `production`
- [ ] `PORT` - Criada automaticamente pelo Railway (não precisa mexer)

✅ **Se todas estão lá, está tudo certo!**

---

## 🚀 PARTE 5: AGUARDAR O DEPLOY

### PASSO 5.1: Verificar se o Deploy Está Rodando

1. **No dashboard do Railway, clique na aba "Deployments"**
   - Está no menu superior, ao lado de "Variables"

2. **Você verá uma lista de deploys:**
   - O mais recente está no topo
   - Pode ter um status: "Building", "Deploying", "Active", ou "Failed"

3. **Se estiver "Building" ou "Deploying":**
   - Aguarde alguns minutos
   - O Railway está instalando tudo e iniciando o servidor

4. **Se estiver "Active" (verde):**
   - ✅ Seu servidor está rodando!
   - Pode pular para a PARTE 6

5. **Se estiver "Failed" (vermelho):**
   - Clique no deploy para ver os logs
   - Procure por erros
   - Me avise qual erro apareceu

---

### PASSO 5.2: Se Precisar Fazer Deploy Manual

1. **Se o deploy não iniciou automaticamente:**
   - Clique no botão "Redeploy" ou "Deploy"
   - Geralmente está na parte superior da tela de Deployments

2. **Aguarde o deploy completar:**
   - Pode levar de 2 a 5 minutos
   - Acompanhe os logs clicando em "View Logs"

✅ **Deploy em andamento!**

---

## 🌐 PARTE 6: ENCONTRAR SEU DOMÍNIO

### PASSO 6.1: Gerar Domínio Gratuito

1. **No dashboard do Railway, clique na aba "Settings"**
   - Está no menu superior

2. **Procure a seção "Networking" ou "Domains"**
   - Role a página para baixo se necessário

3. **Procure o botão "Generate Domain" ou "Add Domain"**
   - Clique nele

4. **O Railway vai gerar um domínio automaticamente:**
   - Algo como: `kardum-mobile-production.up.railway.app`
   - Ou: `seu-projeto.up.railway.app`

5. **COPIE ESSE DOMÍNIO**
   - Você vai precisar dele para acessar o jogo

✅ **Domínio gerado!**

---

### PASSO 6.2: Acessar o Jogo

1. **Abra seu navegador**
2. **Cole o domínio que você copiou na barra de endereço**
3. **Pressione ENTER**

4. **O que deve aparecer:**
   - A tela de login do jogo Kardum Mobile
   - Se aparecer, está funcionando! ✅

5. **Se aparecer erro:**
   - Aguarde mais 1-2 minutos (pode estar ainda iniciando)
   - Tente atualizar a página (F5)
   - Se ainda não funcionar, me avise qual erro apareceu

---

## 🧪 PARTE 7: TESTAR O JOGO

### PASSO 7.1: Criar uma Conta

1. **Na tela de login, procure o link "Criar conta" ou "Register"**
   - Geralmente está abaixo do formulário de login

2. **Clique nele**

3. **Preencha o formulário:**
   - **Username:** Escolha um nome de usuário
     - Exemplo: `meu_usuario`
     - Sem espaços, pode usar letras, números e _
   
   - **Email:** Digite seu email
     - Exemplo: `meuemail@gmail.com`
   
   - **Password:** Escolha uma senha
     - Pelo menos 6 caracteres
     - Exemplo: `MinhaSenha123`

4. **Clique no botão "Criar Conta" ou "Register"**

5. **O que deve acontecer:**
   - Você será redirecionado para o menu principal
   - Ou verá uma mensagem de sucesso

✅ **Conta criada!**

---

### PASSO 7.2: Fazer Login

1. **Se você já tem conta, na tela de login:**
   - Digite seu **Username**
   - Digite sua **Password**
   - Clique em "Entrar" ou "Login"

2. **Você deve entrar no jogo!**

✅ **Login funcionando!**

---

### PASSO 7.3: Criar um Deck

1. **No menu principal, procure a opção "Deck Builder" ou "Criar Deck"**
2. **Clique nela**
3. **Crie um deck de teste:**
   - Escolha um general
   - Adicione algumas cartas
   - Dê um nome ao deck
   - Clique em "Salvar"

4. **O deck deve ser salvo!**

✅ **Deck criado e salvo no banco de dados!**

---

## 🎉 PRONTO! TUDO FUNCIONANDO!

Se você conseguiu:
- ✅ Configurar as variáveis
- ✅ Criar o banco PostgreSQL
- ✅ Fazer o deploy
- ✅ Acessar o jogo pelo domínio
- ✅ Criar conta e fazer login
- ✅ Criar um deck

**PARABÉNS! Seu jogo está online! 🚀**

---

## ❓ PROBLEMAS COMUNS E SOLUÇÕES

### Problema: "Erro ao fazer login"
**Solução:**
- Verifique se o `JWT_SECRET` está configurado corretamente
- Tente criar uma nova conta

### Problema: "Erro de conexão com banco de dados"
**Solução:**
- Verifique se o PostgreSQL foi criado
- Verifique se `DATABASE_URL` existe nas variáveis
- Aguarde mais 2-3 minutos e tente novamente

### Problema: "Página não carrega"
**Solução:**
- Verifique se o deploy está "Active" (verde)
- Aguarde mais 1-2 minutos
- Tente atualizar a página (F5)
- Verifique se está usando o domínio correto

### Problema: "Build Failed"
**Solução:**
- Clique em "View Logs" para ver o erro
- Me envie o erro que apareceu
- Geralmente é problema de variáveis não configuradas

---

## 📞 PRECISA DE AJUDA?

Se algo não funcionou:
1. Me diga em qual PARTE você está
2. Me diga qual erro apareceu (se houver)
3. Tire um print da tela e me mostre

Vou te ajudar a resolver! 😊

---

## 📝 RESUMO RÁPIDO (Para Referência)

1. ✅ Adicionar variáveis sugeridas (botão "Add")
2. ✅ Gerar JWT_SECRET seguro
3. ✅ Editar JWT_SECRET com a chave gerada
4. ✅ Editar ADMIN_PASSWORD com senha segura
5. ✅ Criar banco PostgreSQL (+ New → Database → PostgreSQL)
6. ✅ Adicionar JWT_EXPIRES_IN = 7d
7. ✅ Adicionar NODE_ENV = production
8. ✅ Verificar deploy em "Deployments"
9. ✅ Gerar domínio em "Settings" → "Networking"
10. ✅ Testar criando conta e fazendo login

**Boa sorte! 🍀**

