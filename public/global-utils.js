(function() {
  'use strict';

  // ─── Floating WhatsApp Button ───
  function addWhatsAppButton() {
    if (document.getElementById('wa-floating-btn')) return;

    const waBtn = document.createElement('a');
    waBtn.id = 'wa-floating-btn';
    waBtn.href = 'https://wa.me/51930618991';
    waBtn.target = '_blank';
    waBtn.rel = 'noopener noreferrer';
    waBtn.setAttribute('aria-label', 'Contactar por WhatsApp');
    waBtn.innerHTML = `<svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
    Object.assign(waBtn.style, {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: '9999',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #25D366, #128C7E)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 6px 24px rgba(37,211,102,0.4)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    });

    waBtn.onmouseenter = function() {
      this.style.transform = 'scale(1.1)';
      this.style.boxShadow = '0 8px 32px rgba(37,211,102,0.6)';
    };
    waBtn.onmouseleave = function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = '0 6px 24px rgba(37,211,102,0.4)';
    };

    // Pulse animation
    const pulse = document.createElement('style');
    pulse.textContent = `
      @keyframes wa-pulse {
        0%, 100% { box-shadow: 0 6px 24px rgba(37,211,102,0.4); }
        50% { box-shadow: 0 6px 36px rgba(37,211,102,0.7); }
      }
      #wa-floating-btn { animation: wa-pulse 2s ease-in-out infinite; }
    `;
    document.head.appendChild(pulse);

    document.body.appendChild(waBtn);

    // Tooltip on first visit
    const tooltip = document.createElement('div');
    tooltip.id = 'wa-tooltip';
    tooltip.textContent = '💬 ¿Necesitas ayuda?';
    Object.assign(tooltip.style, {
      position: 'fixed',
      bottom: '90px',
      right: '24px',
      zIndex: '9998',
      background: 'white',
      color: '#1a1c1c',
      padding: '10px 16px',
      borderRadius: '12px',
      fontSize: '13px',
      fontWeight: '600',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      border: '1px solid #e0c0b1',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      opacity: '1',
      transform: 'translateY(0)',
      pointerEvents: 'none',
      maxWidth: '200px',
    });
    // Arrow pointing down
    const arrow = document.createElement('div');
    Object.assign(arrow.style, {
      position: 'absolute',
      bottom: '-8px',
      right: '20px',
      width: '14px',
      height: '14px',
      background: 'white',
      borderRight: '1px solid #e0c0b1',
      borderBottom: '1px solid #e0c0b1',
      transform: 'rotate(45deg)',
      borderRadius: '0 0 3px 0',
    });
    tooltip.appendChild(arrow);
    document.body.appendChild(tooltip);

    setTimeout(() => {
      tooltip.style.opacity = '0';
      tooltip.style.transform = 'translateY(10px)';
      setTimeout(() => { if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip); }, 600);
    }, 6000);
  }

  // ─── Call to Action Bar ───
  function addCTABar() {
    if (document.getElementById('global-cta-bar')) return;

    const pages = {
      'index.html': { label: 'Cotizar', href: 'contacto.html', icon: 'description' },
      'servicios.html': { label: 'Solicitar Servicio', href: 'contacto.html', icon: 'support' },
      'contacto.html': { label: 'WhatsApp Rápido', href: 'https://wa.me/51930618991', icon: 'chat' },
      'configurador.html': { label: 'Cotizar', href: 'https://wa.me/51930618991', icon: 'sell' },
    };

    const path = window.location.pathname.split('/').pop() || 'index.html';
    const page = pages[path] || pages['index.html'];

    const bar = document.createElement('div');
    bar.id = 'global-cta-bar';
    bar.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;justify-content:center;">
        <span style="font-size:13px;font-weight:500;">📞 ¿Hablamos?</span>
        <a href="tel:+51930618991" style="color:white;text-decoration:none;font-weight:700;font-size:13px;padding:6px 14px;background:rgba(255,255,255,0.15);border-radius:8px;">📱 930 618 991</a>
        <a href="https://wa.me/51930618991" target="_blank" style="color:white;text-decoration:none;font-weight:700;font-size:13px;padding:6px 14px;background:#25D366;border-radius:8px;display:flex;align-items:center;gap:4px;">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>
        ${page.label !== 'WhatsApp Rápido' ? `<a href="${page.href}" style="color:white;text-decoration:none;font-weight:700;font-size:13px;padding:6px 14px;background:#f97316;border-radius:8px;">${page.label}</a>` : ''}
      </div>
    `;
    Object.assign(bar.style, {
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      zIndex: '9997',
      background: 'linear-gradient(135deg, #1a1c1c 0%, #2d2f2f 100%)',
      color: 'white',
      padding: '10px 20px',
      textAlign: 'center',
      fontSize: '13px',
      borderTop: '2px solid #f97316',
      transition: 'transform 0.3s ease',
    });

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    Object.assign(closeBtn.style, {
      position: 'absolute',
      top: '4px',
      right: '10px',
      background: 'none',
      border: 'none',
      color: '#999',
      fontSize: '16px',
      cursor: 'pointer',
      padding: '4px',
    });
    closeBtn.onclick = function(e) {
      e.preventDefault();
      bar.style.transform = 'translateY(100%)';
      setTimeout(() => { if (bar.parentNode) bar.parentNode.removeChild(bar); }, 300);
    };
    bar.appendChild(closeBtn);

    document.body.appendChild(bar);

    // Add padding to body to account for the bar
    document.body.style.paddingBottom = (parseInt(getComputedStyle(document.body).paddingBottom) || 0) + 56 + 'px';
  }

  // ─── ZONAS DE COBERTURA (inline inject for all pages) ───
  function addCoverageSection() {
    if (document.getElementById('coverage-section') || window.location.pathname.includes('configurador')) return;

    const zonas = [
      { zona: 'Lima Norte', distritos: 'Carabayllo, Comas, Independencia, Los Olivos, Puente Piedra, San Martín de Porres, Ancón' },
      { zona: 'Lima Centro', distritos: 'Breña, Jesús María, La Victoria, Lima, Lince, Magdalena, Pueblo Libre, San Isidro, San Miguel, Miraflores, Surquillo, Barranco' },
      { zona: 'Lima Este', distritos: 'Ate, Chaclacayo, Cieneguilla, El Agustino, Lurigancho, San Juan de Lurigancho, Santa Anita, La Molina' },
      { zona: 'Lima Sur', distritos: 'Chorrillos, Lurín, Pachacamac, San Juan de Miraflores, Villa El Salvador, Villa María del Triunfo' },
      { zona: 'Callao', distritos: 'Callao, Bellavista, Ventanilla, La Perla, La Punta, Carmen de La Legua, Mi Perú' },
    ];

    const section = document.createElement('section');
    section.id = 'coverage-section';
    section.setAttribute('data-aos', 'fade-up');
    section.innerHTML = `
      <div style="max-width:1280px;margin:0 auto;padding:48px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
          <h2 style="font-size:28px;font-weight:700;color:#1a1c1c;margin:0 0 8px;">📍 Zonas de Cobertura</h2>
          <p style="color:#584237;font-size:15px;max-width:600px;margin:0 auto;">Llegamos a todo Lima Metropolitana y Provincias. Conoce si tu distrito está cubierto.</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;">
          ${zonas.map(z => `
            <div style="background:white;border-radius:12px;padding:16px;border:1px solid #e0c0b1;box-shadow:0 1px 4px rgba(0,0,0,0.04);">
              <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
                <span style="color:#f97316;font-size:18px;">✓</span>
                <span style="font-weight:700;font-size:14px;color:#1a1c1c;">${z.zona}</span>
              </div>
              <div style="font-size:12px;color:#584237;line-height:1.5;">${z.distritos}</div>
            </div>
          `).join('')}
        </div>
        <div style="text-align:center;margin-top:24px;padding:16px;background:#fef3e7;border-radius:12px;border:1px solid #f97316;">
          <p style="margin:0;font-size:14px;color:#582200;font-weight:500;">
            🚚 También atendemos <strong>todo el Perú</strong> (costa, sierra y selva). 
            <a href="https://wa.me/51930618991" target="_blank" style="color:#f97316;font-weight:700;text-decoration:underline;">Consulta disponibilidad</a>
          </p>
        </div>
      </div>
    `;
    Object.assign(section.style, {
      width: '100%',
      background: '#f9f9f9',
      borderTop: '1px solid #e0c0b1',
    });

    // Insert before footer
    const footer = document.querySelector('footer');
    if (footer) {
      footer.parentNode.insertBefore(section, footer);
    } else {
      document.body.appendChild(section);
    }
  }

  // ─── Init ───
  function init() {
    addWhatsAppButton();
    addCTABar();
    addCoverageSection();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
