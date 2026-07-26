const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// The new navigation bar HTML
const navHTML = `
        <nav class="hidden lg:flex gap-6 items-center">
            <a class="nav-link font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors pb-1" href="index.html">Inicio</a>
            <a class="nav-link font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors pb-1" href="servicios.html">Servicios</a>
            <a class="nav-link font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors pb-1" href="proyectos.html">Proyectos</a>
            <a class="nav-link font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors pb-1" href="galeria.html">Galería</a>
            <a class="nav-link font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors pb-1" href="nosotros.html">Nosotros</a>
            <a class="nav-link font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors pb-1" href="contacto.html">Contacto</a>
            <a class="nav-link font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors pb-1 flex items-center gap-1" href="configurador.html">
                <span class="material-symbols-outlined text-sm">build_circle</span> Configurador
            </a>
        </nav>`;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Simple replacement of the nav block
    content = content.replace(/<nav class="hidden (md|lg):flex[^>]*>([\s\S]*?)<\/nav>/i, navHTML);

    // Active state highlighting for each specific file
    if (file === 'index.html') {
        content = content.replace('href="index.html">Inicio</a>', 'href="index.html" class="text-primary font-semibold border-b-2 border-primary pb-1 transition-colors">Inicio</a>');
    } else if (file === 'servicios.html') {
        content = content.replace('href="servicios.html">Servicios</a>', 'href="servicios.html" class="text-primary font-semibold border-b-2 border-primary pb-1 transition-colors">Servicios</a>');
    } else if (file === 'proyectos.html') {
        content = content.replace('href="proyectos.html">Proyectos</a>', 'href="proyectos.html" class="text-primary font-semibold border-b-2 border-primary pb-1 transition-colors">Proyectos</a>');
    } else if (file === 'galeria.html') {
        content = content.replace('href="galeria.html">Galería</a>', 'href="galeria.html" class="text-primary font-semibold border-b-2 border-primary pb-1 transition-colors">Galería</a>');
    } else if (file === 'nosotros.html') {
        content = content.replace('href="nosotros.html">Nosotros</a>', 'href="nosotros.html" class="text-primary font-semibold border-b-2 border-primary pb-1 transition-colors">Nosotros</a>');
    } else if (file === 'contacto.html') {
        content = content.replace('href="contacto.html">Contacto</a>', 'href="contacto.html" class="text-primary font-semibold border-b-2 border-primary pb-1 transition-colors">Contacto</a>');
    } else if (file === 'configurador.html') {
        content = content.replace('href="configurador.html">', 'href="configurador.html" class="text-primary font-semibold border-b-2 border-primary pb-1 transition-colors">');
    }

    // Fix some weird characters
    content = content.replace(/Â©/g, '©');
    content = content.replace(/diseí±o/g, 'diseño');
    content = content.replace(/clÃ¡sicos/g, 'clásicos');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated Nav in ${file}`);
});
