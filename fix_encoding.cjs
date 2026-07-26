const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Mapeo manual para asegurar que no se rompan
    const replacements = [
        { from: 'Ã¡', to: 'á' },
        { from: 'Ã©', to: 'é' },
        { from: 'Ã­', to: 'í' },
        { from: 'Ã³', to: 'ó' },
        { from: 'Ãº', to: 'ú' },
        { from: 'Ã±', to: 'ñ' },
        { from: 'Ã‘', to: 'Ñ' },
        { from: 'Â¿', to: '¿' },
        { from: 'Â¡', to: '¡' },
        { from: 'Ã‚Â', to: '' },
        { from: 'ÃƒÂ', to: 'í' }, // A veces í aparece como ÃƒÂ­, lo cual es doble encode
        { from: 'ÃƒÂ³', to: 'ó' },
        { from: 'ÃƒÂ±', to: 'ñ' },
        { from: 'ÃƒÂ¡', to: 'á' },
        { from: 'ÃƒÂ©', to: 'é' },
        { from: 'ÃƒÂº', to: 'ú' },
    ];

    let oldContent = content;
    
    // First try buffer trick, if it doesn't work, use manual replacements
    try {
        // Only works if the string strictly contains latin1 characters
        let newContent = Buffer.from(content, 'latin1').toString('utf8');
        // Check if newContent has fewer weird chars, if it errors, we catch
        if (!newContent.includes('Ã')) {
            content = newContent;
        } else {
            throw new Error('Fallback to manual replacement');
        }
    } catch (e) {
        replacements.forEach(rep => {
            content = content.split(rep.from).join(rep.to);
        });
        
        // Let's do double encode cleanup just in case
        content = content.replace(/ÃƒÂ³/g, 'ó')
                         .replace(/ÃƒÂ±/g, 'ñ')
                         .replace(/ÃƒÂ¡/g, 'á')
                         .replace(/ÃƒÂ©/g, 'é')
                         .replace(/ÃƒÂ/g, 'í') // Assuming what's left is í
                         .replace(/Ã³/g, 'ó')
                         .replace(/Ã±/g, 'ñ')
                         .replace(/Ã¡/g, 'á')
                         .replace(/Ã©/g, 'é')
                         .replace(/Ã/g, 'í'); // Very aggressive, might break some, but let's try manual mappings strictly
                         
        content = oldContent;
        replacements.forEach(rep => {
            content = content.split(rep.from).join(rep.to);
        });
        
        // Handle standalone Ã that might be a corrupted í or something else
        // Let's just rely on the manual replacements.
    }

    // Let's just use the manual replacements directly to be safe
    content = oldContent;
    replacements.forEach(rep => {
        content = content.split(rep.from).join(rep.to);
    });
    
    // Some specific cases from previous file views:
    // CorporaciÃƒÂ³n
    content = content.replace(/ÃƒÂ³/g, 'ó')
                     .replace(/ÃƒÂ±/g, 'ñ')
                     .replace(/ÃƒÂ¡/g, 'á')
                     .replace(/ÃƒÂ©/g, 'é')
                     .replace(/ÃƒÂº/g, 'ú')
                     .replace(/ÃƒÂ­/g, 'í')
                     .replace(/Ã‚Â/g, ''); // Copyright symbol sometimes gets Â
                     
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed encoding in ${file}`);
});
