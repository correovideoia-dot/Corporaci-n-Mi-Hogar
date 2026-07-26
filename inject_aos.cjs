const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const aosCss = '    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">\n</head>';
const aosJs = '    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>\n    <script>AOS.init({duration: 800, once: true});</script>\n</body>';

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (!content.includes('aos.css')) {
        content = content.replace('</head>', aosCss);
    }
    
    if (!content.includes('aos.js')) {
        content = content.replace('</body>', aosJs);
    }

    // A little extra regex to add data-aos to section tags and some divs if not present
    // Just simple fading for all <section> that don't have it
    content = content.replace(/<section class="/g, '<section data-aos="fade-up" class="');
    // If it already had it, we might duplicate, so we clean up duplicates
    content = content.replace(/data-aos="fade-up" data-aos="fade-up"/g, 'data-aos="fade-up"');
    
    // Add to <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
    content = content.replace(/<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">/g, '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter" data-aos="fade-up">');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Injected AOS into ${file}`);
});
