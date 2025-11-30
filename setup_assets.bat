@echo off
echo ========================================
echo   KARDUM TCG - Setup de Assets
echo ========================================
echo.

set "SOURCE=client\assets\images\RAW"
set "DEST=client\assets\images"

REM Verificar se a pasta RAW existe
if not exist "%SOURCE%" (
    echo ERRO: Pasta RAW nao encontrada!
    pause
    exit /b 1
)

REM Criar pasta de destino se não existir
if not exist "%DEST%" mkdir "%DEST%"

echo Copiando assets principais...
echo.

REM Copiar Logo e Card Base
copy "%SOURCE%\Logo.png" "%DEST%\Logo.png" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Logo.png
) else (
    echo [ERRO] Falha ao copiar Logo.png
)

copy "%SOURCE%\Card-Base.png" "%DEST%\Card-Base.png" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Card-Base.png
) else (
    echo [ERRO] Falha ao copiar Card-Base.png
)

REM Copiar Background principal
copy "%SOURCE%\Background2.png" "%DEST%\Background2.png" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Background2.png
) else (
    echo [ERRO] Falha ao copiar Background2.png
)

echo.
echo ========================================
echo   Assets copiados com sucesso!
echo ========================================
echo.
echo Os seguintes arquivos estao prontos:
echo  - Logo.png (usado nas telas)
echo  - Card-Base.png (template das cartas)
echo  - Background2.png (background principal)
echo.
echo IMPORTANTE: 
echo Os botoes e frames ja estao sendo carregados
echo diretamente da pasta RAW/exportados via CSS!
echo.
echo Agora voce pode:
echo  1. Abrir o navegador em: http://localhost:3000
echo  2. Limpar cache (Ctrl+F5) para ver as mudancas
echo  3. Aproveitar o novo visual!
echo.
pause
