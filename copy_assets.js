const fs = require('fs');
const path = require('path');

const sourceDir = 'C:/Users/Alysson/.gemini/antigravity/brain/034d8d63-f679-41d1-9e32-12735976858d';
const targetDir = 'client/assets/images';

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

const files = [
    { src: 'general_human_portrait_1764279786604.png', dest: 'gen_human.png' },
    { src: 'general_elf_portrait_1764279802567.png', dest: 'gen_elf.png' },
    { src: 'general_orc_portrait_1764279817117.png', dest: 'gen_orc.png' },
    { src: 'general_dwarf_portrait_1764279830946.png', dest: 'gen_dwarf.png' },
    { src: 'general_deva_portrait_1764279846680.png', dest: 'gen_deva.png' },
    { src: 'deck_builder_bg_1764279861473.png', dest: 'bg_deckbuilder.png' }
];

files.forEach(file => {
    try {
        fs.copyFileSync(path.join(sourceDir, file.src), path.join(targetDir, file.dest));
        console.log(`Copied ${file.dest}`);
    } catch (err) {
        console.error(`Error copying ${file.dest}:`, err);
    }
});
