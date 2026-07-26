const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') || f.endsWith('.cjs') || f.endsWith('.js'));

const replacements = [
    { from: /Corporación/g, to: 'Corporación' },
    { from: /Corporación/g, to: 'Corporación' },
    { from: /Galería/g, to: 'Galería' },
    { from: /Galería/g, to: 'Galería' },
    { from: /diseño/g, to: 'diseño' },
    { from: /diseño/g, to: 'diseño' },
    { from: /Ingeniería/g, to: 'Ingeniería' },
    { from: /Ingeniería/g, to: 'Ingeniería' },
    { from: /Navegación/g, to: 'Navegación' },
    { from: /Navegación/g, to: 'Navegación' },
    { from: /Catálogo/g, to: 'Catálogo' },
    { from: /Catálogo/g, to: 'Catálogo' },
    { from: /Perú/g, to: 'Perú' },
    { from: /Perú/g, to: 'Perú' },
    { from: /más/g, to: 'más' },
    { from: /más/g, to: 'más' },
    { from: /automáticos/g, to: 'automáticos' },
    { from: /automáticos/g, to: 'automáticos' },
    { from: /Reparación/g, to: 'Reparación' },
    { from: /Reparación/g, to: 'Reparación' },
    { from: /Mantenimiento y reparación/g, to: 'Mantenimiento y reparación' },
    { from: /Mantenimiento y reparación/g, to: 'Mantenimiento y reparación' },
    { from: /portón/g, to: 'portón' },
    { from: /portón/g, to: 'portón' },
    { from: /Portón/g, to: 'Portón' },
    { from: /Portón/g, to: 'Portón' },
    { from: /fabricación/g, to: 'fabricación' },
    { from: /fabricación/g, to: 'fabricación' },
    { from: /instalación/g, to: 'instalación' },
    { from: /instalación/g, to: 'instalación' },
    { from: /cotización/g, to: 'cotización' },
    { from: /cotización/g, to: 'cotización' },
    { from: /envío/g, to: 'envío' },
    { from: /envío/g, to: 'envío' },
    { from: /garantía/g, to: 'garantía' },
    { from: /garantía/g, to: 'garantía' },
    { from: /Garantía/g, to: 'Garantía' },
    { from: /Garantía/g, to: 'Garantía' },
    { from: /teléfono/g, to: 'teléfono' },
    { from: /teléfono/g, to: 'teléfono' },
    { from: /Teléfono/g, to: 'Teléfono' },
    { from: /Teléfono/g, to: 'Teléfono' },
    { from: /Aquí/g, to: 'Aquí' },
    { from: /Aquí/g, to: 'Aquí' },
    { from: /aquí/g, to: 'aquí' },
    { from: /aquí/g, to: 'aquí' }
];

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    replacements.forEach(rep => {
        content = content.replace(rep.from, rep.to);
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed words in ${file}`);
    }
});
