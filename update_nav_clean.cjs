const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

// The new unified and premium navigation header HTML
const newHeaderHTML = `<!-- TopNavBar -->
<header class="bg-surface/90 backdrop-blur-md border-b border-outline-variant fixed top-0 w-full z-50 flex justify-between items-center px-margin-desktop py-4 mx-auto left-0 right-0">
  <div class="max-w-container-max mx-auto w-full flex justify-between items-center px-4 md:px-gutter">
    <div class="font-headline-sm text-headline-sm font-bold text-on-surface flex items-center gap-2">
      <span class="material-symbols-outlined text-primary text-2xl" style="font-variation-settings: 'FILL' 1;">door_sliding</span>
      Corporación Mi Hogar
    </div>
    <nav class="hidden lg:flex gap-6 items-center">
      <a class="nav-link font-body-md text-xs text-on-surface-variant hover:text-primary transition-colors pb-1" href="index.html">Inicio</a>
      <a class="nav-link font-body-md text-xs text-on-surface-variant hover:text-primary transition-colors pb-1" href="servicios.html">Servicios</a>
      <a class="nav-link font-body-md text-xs text-on-surface-variant hover:text-primary transition-colors pb-1" href="galeria.html">Galería</a>
      <a class="nav-link font-body-md text-xs text-on-surface-variant hover:text-primary transition-colors pb-1" href="nosotros.html">Nosotros</a>
      <a class="nav-link font-body-md text-xs text-on-surface-variant hover:text-primary transition-colors pb-1" href="contacto.html">Contacto</a>
      <a class="nav-link font-body-md text-xs text-primary font-bold flex items-center gap-0.5" href="configurador.html">
        <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1;">3d_rotation</span> Configurador 3D
      </a>
    </nav>
    <div class="hidden lg:block">
      <a href="contacto.html" class="bg-primary-container text-on-primary-fixed font-semibold px-5 py-2.5 rounded-lg hover:bg-primary hover:text-on-primary transition-all hover:scale-95 duration-150 shadow-sm text-xs">Cotizar</a>
    </div>
    <button class="lg:hidden text-on-surface flex items-center">
      <span class="material-symbols-outlined">menu</span>
    </button>
  </div>
</header>`;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // Robust regex to match the TopNavBar comment and replace the entire nav/header block
    content = content.replace(/<!-- TopNavBar -->[\s\S]*?(<\/header>|<\/nav>)/i, newHeaderHTML);

    // Active state highlighting for each specific file
    const fileToTextMap = {
        'index.html': 'href="index.html">Inicio</a>',
        'servicios.html': 'href="servicios.html">Servicios</a>',
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

    // Unify footer navigation links to match
    const footerNavHTML = `
            <ul class="flex flex-col gap-2 text-sm">
                <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="index.html">Inicio</a></li>
                <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="servicios.html">Servicios</a></li>
                <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="galeria.html">Galería</a></li>
                <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="nosotros.html">Nosotros</a></li>
                <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="contacto.html">Contacto</a></li>
                <li><a class="text-on-surface-variant hover:text-primary transition-colors" href="configurador.html">Configurador 3D</a></li>
            </ul>`;

    content = content.replace(/<ul class="flex flex-col gap-3">([\s\S]*?)<\/ul>/i, footerNavHTML);
    content = content.replace(/<ul class="flex flex-col gap-2">([\s\S]*?)<\/ul>/i, footerNavHTML);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated unified header and footer in ${file}`);
});
