const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// The new navigation bar HTML conforming to: Inicio, Servicios, Proyectos, Galeria, Nosotros, Contacto + Configurador 3D
const navHTML = `
        <nav class="hidden lg:flex gap-6 items-center">
            <a class="nav-link font-body-md text-xs text-on-surface-variant hover:text-primary transition-colors pb-1" href="index.html">Inicio</a>
            <a class="nav-link font-body-md text-xs text-on-surface-variant hover:text-primary transition-colors pb-1" href="servicios.html">Servicios</a>
            <a class="nav-link font-body-md text-xs text-on-surface-variant hover:text-primary transition-colors pb-1" href="proyectos.html">Proyectos</a>
            <a class="nav-link font-body-md text-xs text-on-surface-variant hover:text-primary transition-colors pb-1" href="galeria.html">Galería</a>
            <a class="nav-link font-body-md text-xs text-on-surface-variant hover:text-primary transition-colors pb-1" href="nosotros.html">Nosotros</a>
            <a class="nav-link font-body-md text-xs text-on-surface-variant hover:text-primary transition-colors pb-1" href="contacto.html">Contacto</a>
            <a class="nav-link font-body-md text-xs text-primary font-bold flex items-center gap-0.5" href="configurador.html">
                <span class="material-symbols-outlined text-sm">3d_rotation</span> Configurador 3D
            </a>
        </nav>`;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Simple replacement of the nav block
    content = content.replace(/<nav class="hidden lg:flex[^>]*>([\s\S]*?)<\/nav>/i, navHTML);
    content = content.replace(/<nav class="hidden md:flex[^>]*>([\s\S]*?)<\/nav>/i, navHTML);

    // Active state highlighting for each specific file
    const fileToTextMap = {
        'index.html': 'href="index.html">Inicio</a>',
        'servicios.html': 'href="servicios.html">Servicios</a>',
        'proyectos.html': 'href="proyectos.html">Proyectos</a>',
        'galeria.html': 'href="galeria.html">Galería</a>',
        'nosotros.html': 'href="nosotros.html">Nosotros</a>',
        'contacto.html': 'href="contacto.html">Contacto</a>',
        'configurador.html': 'href="configurador.html">'
    };

    const targetText = fileToTextMap[file];
    if (targetText && content.includes(targetText)) {
        if (file === 'configurador.html') {
            content = content.replace(targetText, 'href="configurador.html" class="text-primary font-semibold pb-1 transition-colors">');
        } else {
            content = content.replace(targetText, targetText.replace('class="nav-link font-body-md text-xs text-on-surface-variant hover:text-primary transition-colors pb-1"', 'class="text-primary font-semibold border-b border-primary pb-1 transition-colors text-xs"'));
        }
    }

    // Clean up footer navigation links to match
    const footerNavHTML = `
            <ul class="flex flex-col gap-2 text-sm">
                <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="index.html">Inicio</a></li>
                <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="servicios.html">Servicios</a></li>
                <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="proyectos.html">Proyectos</a></li>
                <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="galeria.html">Galería</a></li>
                <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="nosotros.html">Nosotros</a></li>
                <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="contacto.html">Contacto</a></li>
                <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="configurador.html">Configurador 3D</a></li>
            </ul>`;

    content = content.replace(/<ul class="flex flex-col gap-3">([\s\S]*?)<\/ul>/i, footerNavHTML);
    content = content.replace(/<ul class="flex flex-col gap-2">([\s\S]*?)<\/ul>/i, footerNavHTML);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated Menu Navigation to original layout + Config in ${file}`);
});
