@echo off
set "SOURCE=C:\Users\Alysson\.gemini\antigravity\brain\034d8d63-f679-41d1-9e32-12735976858d"
set "DEST=client\assets\images"

if not exist "%DEST%" mkdir "%DEST%"

echo Copiando imagens...

copy "%SOURCE%\general_human_portrait_1764279786604.png" "%DEST%\gen_human.png"
copy "%SOURCE%\general_elf_portrait_1764279802567.png" "%DEST%\gen_elf.png"
copy "%SOURCE%\general_orc_portrait_1764279817117.png" "%DEST%\gen_orc.png"
copy "%SOURCE%\general_dwarf_portrait_1764279830946.png" "%DEST%\gen_dwarf.png"
copy "%SOURCE%\general_deva_portrait_1764279846680.png" "%DEST%\gen_deva.png"
copy "%SOURCE%\deck_builder_bg_1764279861473.png" "%DEST%\bg_deckbuilder.png"

echo.
echo Imagens copiadas com sucesso!
pause
