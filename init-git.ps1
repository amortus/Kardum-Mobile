# Script para inicializar Git e fazer primeiro commit
# Execute este arquivo clicando com botão direito > "Executar com PowerShell"
# Ou no PowerShell: .\init-git.ps1

Set-Location "E:\PROJETOS\Kardum Mobile"

Write-Host "Inicializando repositório Git..." -ForegroundColor Green
git init

Write-Host "`nAdicionando todos os arquivos..." -ForegroundColor Green
git add .

Write-Host "`nFazendo primeiro commit..." -ForegroundColor Green
git commit -m "feat: Initial commit - Kardum TCG Game

- Implementado sistema de jogo de cartas completo
- Deck builder funcional com interface mobile
- Sistema de batalha com IA
- 50+ cartas implementadas das planilhas
- Interface inspirada em Pokemon TCG Pocket
- Sistema de recursos de guerra e fases de turno
- Modais customizados mobile-friendly
- Sistema de confirmação sem alerts nativos
- Deck pane expansível/retrátil para mobile"

Write-Host "`nStatus do repositório:" -ForegroundColor Green
git status

Write-Host "`n✅ Git inicializado com sucesso!" -ForegroundColor Green
Write-Host "Pressione qualquer tecla para fechar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
