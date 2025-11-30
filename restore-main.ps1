# Script para restaurar main.js do Git
# Execute este arquivo clicando com botão direito > "Executar com PowerShell"

Set-Location "E:\PROJETOS\Kardum Mobile"

Write-Host "Restaurando client/js/main.js do último commit..." -ForegroundColor Yellow
git checkout HEAD -- client/js/main.js

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Arquivo client/js/main.js restaurado com sucesso!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Erro ao restaurar arquivo" -ForegroundColor Red
}

Write-Host "`nPressione qualquer tecla para fechar..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
