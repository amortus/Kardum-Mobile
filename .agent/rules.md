# Regras de Auto-Execução do Antigravity

## Comandos de Terminal
- Auto-executar TODOS os comandos de leitura (ls, cat, dir, type, etc)
- Auto-executar comandos de Git (git status, git add, git commit, git push, etc)
- Auto-executar comandos de build/desenvolvimento (npm install, npm run, etc)
- Auto-executar comandos de arquivo (copy, move, del, rm, mkdir, etc)

## Filosofia
- Sempre marcar comandos como SafeToAutoRun=true quando forem:
  - Comandos de leitura/visualização
  - Comandos de desenvolvimento padrão
  - Comandos Git
  - Comandos de build
  - Comandos de arquivo não destrutivos em massa

- Apenas pedir aprovação para:
  - Comandos que deletam múltiplos arquivos de uma vez
  - Comandos que modificam sistema operacional
  - Comandos que fazem deploy para produção

## Edições de Código
- Sempre aplicar edições de código sem pedir confirmação
- Sempre criar arquivos novos sem pedir confirmação
- Sempre fazer refatorações sem pedir confirmação

## Objetivo
Maximizar produtividade eliminando cliques desnecessários enquanto mantém segurança básica.
