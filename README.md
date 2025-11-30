# Kardum TCG

Jogo de cartas tático para Web e Mobile, inspirado em Pokemon TCG Pocket.

## 🎮 Características

- ✅ Single Player contra IA (3 dificuldades)
- ✅ Multiplayer Online (Casual e Ranqueado)
- ✅ Sistema de ELO/Ranking
- ✅ PWA (Progressive Web App)
- ✅ Dashboard de Administrador
- ✅ 5 Raças: Humanos, Devas, Orcs, Anões, Elfos
- ✅ 8 Classes: Warrior, Barbarian, Druid, Elementalist, Necromancer, Archer, Assassin, Chivalry

## 🚀 Começando

### Pré-requisitos

- Node.js 16+ instalado

### Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Editar .env com suas configurações
```

### Executar o Servidor

```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

### Acessar o Jogo

- **Jogo**: Abra `client/index.html` no navegador ou acesse via servidor
- **Dashboard Admin**: Abra `admin/index.html` ou acesse `http://localhost:3000/admin`

### Desenvolvimento

```bash
# Servir apenas o cliente (frontend)
npm run serve-client

# Servir apenas o admin
npm run serve-admin
```

## 📁 Estrutura do Projeto

```
kardum-mobile/
├── client/          # Frontend do jogo
├── admin/           # Dashboard administrativo
├── server/          # Backend Node.js
└── package.json
```

## 🎯 Como Jogar

1. **Deck**: 30-40 cartas (1 General obrigatório)
2. **Recursos de Guerra**: Começa com 1, máximo 10 (+1 por turno)
3. **Fases do Turno**: Compra → Estratégia → Combate
4. **Vitória**: Zerar a vida do General inimigo

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript ES6+ (Vanilla)
- **Backend**: Node.js, Express, WebSocket
- **Database**: SQLite
- **PWA**: Service Worker, Manifest

## 📝 Licença

MIT
