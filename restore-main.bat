@echo off
echo Restaurando client/js/main.js do Git...
cd /d "E:\PROJETOS\Kardum Mobile"
git checkout HEAD -- client/js/main.js
if %ERRORLEVEL% EQU 0 (
    echo.
    echo Arquivo restaurado com sucesso!
) else (
    echo.
    echo Erro ao restaurar arquivo
)
pause
