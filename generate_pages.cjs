const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, 'servicios.html');
const template = fs.readFileSync(templatePath, 'utf8');

// The pattern to replace is everything between <!-- Hero Section --> and <!-- Footer -->
const regex = /<!-- Hero Section -->[\s\S]*?(?=<!-- Footer -->)/;

const pages = [
  {
    name: 'puertas-levadizas.html',
    title: 'Puertas Levadizas',
    content: `<!-- Hero Section -->
    <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg mt-stack-md" data-aos="fade-up">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
            <div>
                <h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6">
                    Puertas Levadizas
                </h1>
                <p class="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg">
                    Especialistas en fabricación, instalación, reparación y automatización para casas, edificios, almacenes y comercios. Alta seguridad estructural y antirrobo.
                </p>
                <div class="flex gap-4">
                    <a href="contacto.html" class="bg-primary-container text-on-primary-fixed font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-colors hover:scale-95 duration-150 shadow-sm">
                        Cotizar ahora
                    </a>
                </div>
            </div>
            <div class="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container shadow-md" data-aos="zoom-in">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCORrjq4fTnXS8IVujaZ1sMcWiyP2MecWi7UqVQvs7r1aH7HspUMGnvHYqCNBb30qglrmdd4IequTawtRWFDzyVymZy-Bg-8DNSvXPHLEW8kt24Dt9WZRkifDverZCjKaHi0QwRVhN351N2E-vo3WHMP6ksemyXL4jQxGWLE8_31KByPE_91083YLrqbMDr9TrADdxn9dmG-ra6M71MhwBriJkptpbj8PTy4IZvYO30oVzbNsPB7MF_9lb40jYiIea1-FpHgQQfuU0j" alt="Puertas Levadizas" class="w-full h-full object-cover">
            </div>
        </div>
    </section>

    <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg border-t border-outline-variant">
        <h2 class="font-headline-md text-headline-md text-on-surface mb-8" data-aos="fade-right">Características Técnicas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div class="bg-surface-container-low p-6 rounded-xl border border-surface-variant hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="100">
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-4">Sistemas de Acero</h3>
                <ul class="list-disc pl-5 text-on-surface-variant space-y-2">
                    <li><strong>Pesado:</strong> Hasta 2.40 m de altura.</li>
                    <li><strong>Extra-largo pesado:</strong> Más de 2.40 m.</li>
                    <li><strong>Extra-largo super pesado:</strong> ~800–900 kg de peso.</li>
                    <li>Fabricado en acero estructural con tratamiento anticorrosivo.</li>
                </ul>
            </div>
            <div class="bg-surface-container-low p-6 rounded-xl border border-surface-variant hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="200">
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-4">Sistema de Resortes</h3>
                <ul class="list-disc pl-5 text-on-surface-variant space-y-2">
                    <li>Resortes americanos de <strong>75 kg, 100 kg y 150 kg</strong>.</li>
                    <li>Ej: Puerta de 200kg usa 2 resortes de 100kg.</li>
                    <li>Puerta de 300kg usa 2x150kg o 4x75kg.</li>
                    <li>Equilibran el peso y reducen desgaste del motor.</li>
                </ul>
            </div>
            <div class="bg-surface-container-low p-6 rounded-xl border border-surface-variant hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="300">
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-4">Automatización</h3>
                <ul class="list-disc pl-5 text-on-surface-variant space-y-2">
                    <li>Motor a cadena o faja.</li>
                    <li>Control remoto de largo alcance: <strong>50 metros</strong>.</li>
                    <li>Marcas: LiftMaster, Powergate.</li>
                    <li>Función de borrado de controles (en caso de robo/pérdida).</li>
                </ul>
            </div>
        </div>
    </section>
    `
  },
  {
    name: 'puertas-seccionales.html',
    title: 'Puertas Seccionales',
    content: `<!-- Hero Section -->
    <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg mt-stack-md" data-aos="fade-up">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
            <div>
                <h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6">
                    Puertas Seccionales
                </h1>
                <p class="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg">
                    Paneles horizontales unidos por bisagras que deslizan por rieles quedando paralelos al techo, optimizando el espacio al máximo.
                </p>
                <div class="flex gap-4">
                    <a href="contacto.html" class="bg-primary-container text-on-primary-fixed font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-colors hover:scale-95 duration-150 shadow-sm">
                        Cotizar ahora
                    </a>
                </div>
            </div>
            <div class="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container shadow-md" data-aos="zoom-in">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMUKd0AaqL7miR6IoyTn8Qe0S_KroplX8TSoSaYRSyAzkAA-5_z_Ic9P3ha_epI-ygSWjSYFp0MCi4CEBp4a4E9BrdWbaEFcuo-76MP8ZptWmHnWGE_HGIwJ6Rf7i8xg54jKk4TAr9BPE-jwhQnMkZYsBOZoibGs3wPF61IbqwUAPDjAdkScZ3OrHvlHHkaCh9DywyOPIfdUXTiKzutfV7YHXjN98cbXFvN6tD1lxUwpWMAS-h7YWtZP1BYJ1I4tWi54pRxRdkA83W" alt="Puertas Seccionales" class="w-full h-full object-cover">
            </div>
        </div>
    </section>

    <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg border-t border-outline-variant">
        <h2 class="font-headline-md text-headline-md text-on-surface mb-8" data-aos="fade-right">Variantes y Opciones</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div class="bg-surface-container-low p-6 rounded-xl border border-surface-variant hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="100">
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-4">Materiales</h3>
                <ul class="list-disc pl-5 text-on-surface-variant space-y-2">
                    <li><strong>Metal:</strong> Paneles metálicos resistentes y de bajo mantenimiento.</li>
                    <li><strong>Madera:</strong> Apariencia natural (estructura de 4 o 5 secciones). Cada panel mide 45-60cm.</li>
                    <li><strong>Importadas:</strong> Prefabricadas con rieles superiores y laterales.</li>
                </ul>
            </div>
            <div class="bg-surface-container-low p-6 rounded-xl border border-surface-variant hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="200">
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-4">Estilos y Diseños</h3>
                <ul class="list-disc pl-5 text-on-surface-variant space-y-2">
                    <li><strong>Con ventanas:</strong> Acrílicos o vidrios reforzados/templados resistentes a golpes.</li>
                    <li><strong>Colores:</strong> Nogal, blanca, negra (sobre la misma estructura seccional).</li>
                    <li>Acabados mate o brillante con barniz impermeable.</li>
                </ul>
            </div>
            <div class="bg-surface-container-low p-6 rounded-xl border border-surface-variant hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="300">
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-4">Puerta Peatonal Integrada</h3>
                <ul class="list-disc pl-5 text-on-surface-variant space-y-2">
                    <li>Ideal en espacios reducidos.</li>
                    <li>Integración perfecta de paneles verticales y horizontales.</li>
                    <li>Compatible con sistema manual o automático (motor).</li>
                </ul>
            </div>
        </div>
    </section>
    `
  },
  {
    name: 'portones-corredizos.html',
    title: 'Portones Corredizos',
    content: `<!-- Hero Section -->
    <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg mt-stack-md" data-aos="fade-up">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
            <div>
                <h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6">
                    Portones Corredizos
                </h1>
                <p class="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg">
                    Deslizamiento recto o en forma de L mediante poleas y rodajes altamente resistentes. Opción ideal de automatización con motor a cremallera.
                </p>
                <div class="flex gap-4">
                    <a href="contacto.html" class="bg-primary-container text-on-primary-fixed font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-colors hover:scale-95 duration-150 shadow-sm">
                        Cotizar ahora
                    </a>
                </div>
            </div>
            <div class="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container shadow-md" data-aos="zoom-in">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDcxmBFRNkGj2KMd6ZW8enWehbyFYsl781WtzO1C8ke0J6c-p_MM9chA6BmiTRr1rqrZHzg9fxwd52LbsLKu8xNcOaHN-VKpJkH6UqYtfWnKugSS-weMhfQJuH9X86Qj-i9HrOUcFEhQGN60DToLcx7s8MRkoOkbcxnSBO-wzCBzD5V4-64olJnEvfNwWyxN7FILrk1qPzK6xiln5xUndyG34MOYc5K8oqnBInYpUA4en9DWMLT5ITuorYPE9Zehy5ewhCtZxkZqZn" alt="Portones Corredizos" class="w-full h-full object-cover">
            </div>
        </div>
    </section>

    <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg border-t border-outline-variant">
        <h2 class="font-headline-md text-headline-md text-on-surface mb-8" data-aos="fade-right">Especificaciones Técnicas</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            <div class="bg-surface-container-low p-6 rounded-xl border border-surface-variant hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="100">
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-4">Ruedas y Rieles</h3>
                <ul class="list-disc pl-5 text-on-surface-variant space-y-2">
                    <li>Ruedas con diseño de ranura en V de acero.</li>
                    <li>Resistentes al agua, corrosión y temperatura.</li>
                    <li>Alivian la vibración, sin ruido.</li>
                    <li>Rieles de precisión compactos y eficaces.</li>
                </ul>
            </div>
            <div class="bg-surface-container-low p-6 rounded-xl border border-surface-variant hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="200">
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-4">Motores y Automatización</h3>
                <ul class="list-disc pl-5 text-on-surface-variant space-y-2">
                    <li>Marcas usadas: Smartlift, Powergate, Zengo para tamaños estándar.</li>
                    <li>Motor <strong>Nice (Italia)</strong> con sistema piñón y cremallera para portones de mayor peso.</li>
                </ul>
            </div>
            <div class="bg-surface-container-low p-6 rounded-xl border border-surface-variant hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="300">
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-4">Materiales y Diseño</h3>
                <ul class="list-disc pl-5 text-on-surface-variant space-y-2">
                    <li>Acero galvanizado (perfiles robustos).</li>
                    <li>Madera: caoba, cedro y tornillo.</li>
                    <li>Posibilidad de incluir puerta peatonal con revestimiento de madera.</li>
                </ul>
            </div>
        </div>
    </section>
    `
  },
  {
    name: 'portones-batientes.html',
    title: 'Portones Batientes',
    content: `<!-- Hero Section -->
    <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg mt-stack-md" data-aos="fade-up">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
            <div>
                <h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6">
                    Portones Batientes
                </h1>
                <p class="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg">
                    Apertura por hojas que giran hacia adentro o afuera. Instalación rápida en 1 a 2 días y funcionamiento impecable en terrenos irregulares.
                </p>
                <div class="flex gap-4">
                    <a href="contacto.html" class="bg-primary-container text-on-primary-fixed font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-colors hover:scale-95 duration-150 shadow-sm">
                        Cotizar ahora
                    </a>
                </div>
            </div>
            <div class="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container shadow-md" data-aos="zoom-in">
                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEh3t7cPM5FMbBY1C2bBLILQ97keecsB1r9pZg2jiZE4ts_oa9v2EEhKwb-PfUfrUx5yhyxG30UwB4qzchF2qCYmEPyidjGJ4JCuFPnb2dgvdPoRG8XaMOtG_XWMuIo4Vrea75eoaaZSsIipV5migZ2Dks2PIImS0jtXSKAyfWWsKNP7oXwXjCazltBAVBTPNEwKv9qPHuTPWgf5Q2LB2eYHHGEJ1i0dJrVSuCMoOzh6ghkvwEjpsXxFxiZUqQd2rHnINKEDNZewPb" alt="Portones Batientes" class="w-full h-full object-cover">
            </div>
        </div>
    </section>

    <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg border-t border-outline-variant">
        <h2 class="font-headline-md text-headline-md text-on-surface mb-8" data-aos="fade-right">Características Principales</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div class="bg-surface-container-low p-6 rounded-xl border border-surface-variant hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="100">
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-4">Estructura y Materiales</h3>
                <ul class="list-disc pl-5 text-on-surface-variant space-y-2">
                    <li>Disponibles en 1 o 2 hojas.</li>
                    <li>No requieren guías ni rieles (solo espacio lateral para abrir).</li>
                    <li>Materiales: Acero galvanizado, hierro, aluminio, madera tratada.</li>
                    <li>Rodajes de acero pivotantes (superior e inferior), muy rígidos.</li>
                </ul>
            </div>
            <div class="bg-surface-container-low p-6 rounded-xl border border-surface-variant hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="200">
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-4">Automatización</h3>
                <ul class="list-disc pl-5 text-on-surface-variant space-y-2">
                    <li>Sistemas manuales o totalmente automáticos.</li>
                    <li>Automatización con <strong>brazo electromecánico</strong>.</li>
                    <li>Compatible con control remoto o aplicaciones móviles.</li>
                </ul>
            </div>
        </div>
    </section>
    `
  },
  {
    name: 'portones-industriales.html',
    title: 'Portones Industriales',
    content: `<!-- Hero Section -->
    <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg mt-stack-md" data-aos="fade-up">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
            <div>
                <h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6">
                    Portones Industriales
                </h1>
                <p class="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg">
                    Soluciones robustas diseñadas para mediano y alto tránsito. Fabricación de portones de gran tamaño para el acceso seguro de maquinaria pesada.
                </p>
                <div class="flex gap-4">
                    <a href="contacto.html" class="bg-primary-container text-on-primary-fixed font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-colors hover:scale-95 duration-150 shadow-sm">
                        Cotizar ahora
                    </a>
                </div>
            </div>
            <div class="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container shadow-md" data-aos="zoom-in">
                <img src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=800&q=80" alt="Portones Industriales" class="w-full h-full object-cover">
            </div>
        </div>
    </section>

    <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg border-t border-outline-variant">
        <h2 class="font-headline-md text-headline-md text-on-surface mb-8" data-aos="fade-right">Ventajas Industriales</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div class="bg-surface-container-low p-6 rounded-xl border border-surface-variant hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="100">
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-4">Aplicaciones</h3>
                <ul class="list-disc pl-5 text-on-surface-variant space-y-2">
                    <li>Tipos: corredizos, levadizos y abatientes.</li>
                    <li>Complementan con barreras automáticas e industriales.</li>
                    <li>Materiales: hierro, metal galvanizado, madera, frentes de rejas.</li>
                    <li>Más de 15 años de experiencia en el sector industrial.</li>
                </ul>
            </div>
            <div class="bg-surface-container-low p-6 rounded-xl border border-surface-variant hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="200">
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-4">Alto Rendimiento</h3>
                <ul class="list-disc pl-5 text-on-surface-variant space-y-2">
                    <li>Motores con capacidad reductora diferenciada.</li>
                    <li>Estudios de movimiento sin resistencia evaluados para mercados exigentes.</li>
                    <li>Hasta <strong>25 años de vida útil</strong> del motor con mantenimiento adecuado.</li>
                </ul>
            </div>
        </div>
    </section>
    `
  },
  {
    name: 'motores.html',
    title: 'Motores y Automatización',
    content: `<!-- Hero Section -->
    <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg mt-stack-md" data-aos="fade-up">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter items-center">
            <div>
                <h1 class="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface mb-6">
                    Motores para Portones
                </h1>
                <p class="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg">
                    Automatiza tu portón manual con nuestros motores de alto rendimiento. Trabajamos con marcas líderes para asegurar máxima potencia y vida útil.
                </p>
                <div class="flex gap-4">
                    <a href="contacto.html" class="bg-primary-container text-on-primary-fixed font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-primary hover:text-on-primary transition-colors hover:scale-95 duration-150 shadow-sm">
                        Cotizar Motor
                    </a>
                </div>
            </div>
            <div class="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container shadow-md" data-aos="zoom-in">
                <img src="https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80" alt="Motores Industriales" class="w-full h-full object-cover">
            </div>
        </div>
    </section>

    <section class="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-lg border-t border-outline-variant">
        <h2 class="font-headline-md text-headline-md text-on-surface mb-8" data-aos="fade-right">Equipos y Características</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            <div class="bg-surface-container-low p-6 rounded-xl border border-surface-variant hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="100">
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-4">Motor LiftMaster 4410</h3>
                <ul class="list-disc pl-5 text-on-surface-variant space-y-2">
                    <li>Transmisión de cadena y riel en T de grado industrial.</li>
                    <li>Piñón doble (dos velocidades posibles).</li>
                    <li>Apto para puertas de garaje livianas o pesadas.</li>
                    <li>Motor de corriente alterna, trabajo pesado, 220V.</li>
                    <li>Fácil programación de controles remotos.</li>
                </ul>
            </div>
            <div class="bg-surface-container-low p-6 rounded-xl border border-surface-variant hover:shadow-lg transition-shadow" data-aos="fade-up" data-aos-delay="200">
                <h3 class="font-headline-sm text-headline-sm text-on-surface mb-4">Marcas y Controles</h3>
                <ul class="list-disc pl-5 text-on-surface-variant space-y-2">
                    <li><strong>LiftMaster y Powergate:</strong> Ideales para puertas levadizas (alcance 50m).</li>
                    <li><strong>Smartlift y Zengo:</strong> Excelentes opciones para portones corredizos estándar.</li>
                    <li><strong>Nice (Italia):</strong> Sistema piñón-cremallera, especial para puertas muy pesadas.</li>
                    <li>Envíos gratis a nivel nacional en accesorios y controles remotos.</li>
                </ul>
            </div>
        </div>
    </section>
    `
  }
];

pages.forEach(page => {
    let newHtml = template.replace(regex, page.content + '\n<!-- Footer -->');
    newHtml = newHtml.replace(/<title>.*?<\/title>/, "<title>" + page.title + " | Corporación Mi Hogar</title>");
    fs.writeFileSync(path.join(__dirname, page.name), newHtml, 'utf8');
    console.log("Created " + page.name);
});
