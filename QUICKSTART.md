# 🎮 Kardum TCG - Guia de Início Rápido

## ✅ O QUE FOI IMPLEMENTADO

### Frontend (Cliente do Jogo)
- ✅ **Interface Completa**: HTML5 com todas as telas (menu, seleção de dificuldade, campo de batalha, game over)
- ✅ **Design Premium**: CSS com design system completo, cores para cada raça, gradientes, glassmorphism
- ✅ **Sistema de Cartas**: Renderização de cartas com placeholder CSS, estados visuais, animações
- ✅ **Campo de Batalha**: Layout estilo Pokemon TCG Pocket com áreas de jogador, oponente e campo central
- ✅ **Mobile-First**: Totalmente responsivo com otimizações touch-friendly

### Core do Jogo
- ✅ **Game State**: Sistema completo de gerenciamento de estado do jogo
- ✅ **Recursos de Guerra**: Sistema 1-10, +1 por turno
- ✅ **Fases de Turno**: Compra → Estratégia → Combate → Fim
- ✅ **Sistema de Combate**: Com suporte a habilidades especiais (Rush, Taunt, Divine Shield, Lifesteal)
- ✅ **Tipos de Cartas**: General, Defensor, Equipamento, Montaria, Consumível, Habilidade
- ✅ **Validação de Regras**: Todas as regras do GDD implementadas

### IA Single-Player
- ✅ **3 Níveis de Dificuldade**:
  - **Fácil**: Joga aleatoriamente
  - **Médio**: Estratégia básica de curva de mana
  - **Difícil**: Calcula trades favoráveis e lethal

### Database de Cartas
- ✅ **25+ Cartas Placeholder**: Exemplos de todos os tipos e raças
- ✅ **Sistema de Deck**: Criação e validação de decks (30-40 cartas, 1 General)

### Backend (Servidor)
- ✅ **Servidor Node.js**: Express + WebSocket
- ✅ **Banco de Dados**: SQLite com tabelas (users, cards, matches, decks, admin_logs)
- ✅ **Sistema de Autenticação**: JWT básico
- ✅ **Infraestrutura para Matchmaking**: WebSocket configurado (lógica completa a implementar)

### Dashboard de Administrador
- ✅ **Interface Administrativa**: Login, sidebar de navegação
- ✅ **CRUD de Cartas**: Listar, criar, editar, deletar cartas
- ✅ **Visualização de Usuários**: Tabela com stats (ELO, partidas, vitórias)
- ✅ **Estatísticas**: Dashboard com métricas do jogo
- ✅ **Design Profissional**: Interface limpa e moderna

### PWA (Progressive Web App)
- ✅ **Manifest.json**: Configurado para instalação como app
- ✅ **Meta Tags**: PWA pronto para Add to Home Screen

---

## 🚀 COMO EXECUTAR

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

O arquivo `.env.example` já está criado. Copie para `.env`:

```bash
# No Windows WSL (já tem .env.example pronto)
# As configurações padrão já funcionam!
```

Credenciais admin padrão:
- **Username**: `admin`
- **Password**: `admin123`

### 3. Iniciar o Servidor

```bash
npm start
```

O servidor iniciará em `http://localhost:3000`

### 4. Acessar o Jogo

Abra o navegador em:
- **Jogo**: `http://localhost:3000` ou abra diretamente `client/index.html`
- **Dashboard Admin**: `http://localhost:3000/admin`

---

## 🎯 COMO JOGAR

### Single Player

1. No menu principal, clique em **Single Player**
2. Escolha a dificuldade (Fácil, Médio ou Difícil)
3. O jogo começará automaticamente com um deck inicial
4. **Fases do Turno**:
   - **Compra**: Automática (exceto 1º turno do jogador inicial)
   - **Estratégia**: Clique nas cartas da mão para jogá-las
   - **Combate**: Clique em "Passar Turno" (combate automático por enquanto)
5. Ganhe zerando a vida do General inimigo!

### Regras Principais

- **Recursos de Guerra**: Começa com 1, máximo 10, +1 por turno
- **Custo de Cartas**: Cada carta tem um custo de recursos
- **Posicionando**: Defenders não podem atacar no turno que entram (exceto com Rush)
- **Equipamentos**: Apenas 1 por Defensor/General
- **Montarias**: Escolha entre usar como Defensor ou Equipamento
- **Habilidades/Montarias**: Limite de 1 por turno
- **Deck Vazio**: 2 de dano direto ao General por turno

---

## 🔧 DASHBOARD DE ADMINISTRADOR

### Login

1. Acesse `http://localhost:3000/admin`
2. Login:
   - **Usuário**: `admin`
   - **Senha**: `admin123`

### Funcionalidades

- **Visão Geral**: Métricas do jogo (usuários, partidas, cartas)
- **Gerenciar Cartas**:
  - Listar todas as cartas
  - Criar novas cartas
  - Editar cartas existentes
  - Deletar cartas
  - Filtros por tipo e raça
- **Usuários**: Ver todos os jogadores, ELO, estatísticas
- **Logs**: Sistema de auditoria (em desenvolvimento)

---

## 📁 ESTRUTURA DO PROJETO

```
kardum-mobile/
├── client/                    # Jogo (frontend)
│   ├── index.html            # Página principal
│   ├── manifest.json         # PWA manifest
│   ├── css/
│   │   ├── main.css          # Design system principal
│   │   ├── cards.css         # Estilos das cartas
│   │   ├── battlefield.css   # Campo de batalha
│   │   └── mobile.css        # Otimizações mobile
│   └── js/
│       ├── main.js           # Controlador principal
│       ├── core/
│       │   ├── game-state.js      # Estado do jogo
│       │   └── combat-system.js   # Sistema de combate
│       ├── ai/
│       │   └── ai-opponent.js     # IA
│       └── data/
│           └── cards-database.js  # Base de cartas
├── admin/                    # Dashboard admin
│   ├── index.html
│   ├── css/admin.css
│   └── js/admin.js
├── server/                   # Backend
│   ├── index.js             # Servidor principal
│   └── database.js          # Banco SQLite
├── package.json
└── README.md
```

---

## 🎨 FEATURES IMPLEMENTADAS

### ✅ Sistema de Jogo Completo
- Mecânicas de turnos e fases
- Sistema de Recursos de Guerra
- 6 tipos de cartas diferentes
- Combate com habilidades especiais
- Vitória/Derrota

### ✅ IA Funcional
- 3 níveis de dificuldade
- IA toma decisões estratégicas
- Calcula trades e lethal

### ✅ UI Premium
- Design moderno com gradientes
- Cores distintas por raça
- Animações suaves
- Responsivo (desktop + mobile)

### ✅ Backend Robusto
- Servidor Express
- WebSocket para multiplayer
- Banco SQLite
- Sistema de autenticação

### ✅ Dashboard Admin
- CRUD completo de cartas
- Visualização de dados
- Interface profissional

---

## 🚧 PRÓXIMAS IMPLEMENTAÇÕES

### Multiplayer Online
- [ ] Matchmaking com fila (casual e ranqueada)
- [ ] Sistema ELO completo
- [ ] Sincronização em tempo real via WebSocket
- [ ] Reconnect em caso de desconexão

### Melhorias de Gameplay
- [ ] Drag & drop de cartas
- [ ] Animações de ataque com linha visual
- [ ] Números de dano flutuantes
- [ ] Sons e efeitos visuais

### Dashboard Admin
- [ ] Upload de imagens de cartas
- [ ] Importação em lote (CSV/JSON)
- [ ] Gráficos de estatísticas (Chart.js)
- [ ] Sistema de logs completo

### Assets Visuais
- [ ] Integrar modelos de cartas do usuário
- [ ] Arte customizada por raça
- [ ] Ícones de habilidades
- [ ] Backgrounds animados

---

## 📱 MOBILE (PWA)

### Instalar como App

**Android:**
1. Abra o jogo no Chrome
2. Menu → "Adicionar à tela inicial"
3. Ícone do Kardum aparecerá na home

**iOS:**
1. Abra o jogo no Safari
2. Botão Compartilhar → "Adicionar à Tela Inicial"

### Funciona Offline
- Single-player funciona sem internet
- Multiplayer requer conexão

---

## 🐛 TROUBLESHOOTING

### Erro ao instalar dependências
```bash
# Limpar cache do npm
npm cache clean --force
npm install
```

### Porta 3000 em uso
Edite o `.env` e mude `PORT=3000` para outra porta.

### Banco de dados não cria
Verifique se a pasta tem permissões de escrita.

---

## 📄 LICENÇA

MIT

---

## 👨‍💻 DESENVOLVIMENTO

Desenvolvido com:
- HTML5, CSS3, JavaScript (Vanilla)
- Node.js, Express, WebSocket
- SQLite
- Amor por jogos de cartas ❤️

**Versão**: 1.0.0
**Status**: MVP Funcional 🚀
