/**
 * ObraFit - JavaScript Interactivo
 * Funcionalidades y animaciones del frontend
 */

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  
  // ==========================================
  // 1. NAVBAR - Efecto de scroll
  // ==========================================
  const navbar = document.getElementById('navbar');
  let lastScrollTop = 0;

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Agregar sombra al navbar cuando se hace scroll
    if (scrollTop > 50) {
      navbar.classList.add('shadow-lg');
    } else {
      navbar.classList.remove('shadow-lg');
    }

    lastScrollTop = scrollTop;
  });

  // ==========================================
  // 2. MOBILE MENU - Toggle
  // ==========================================
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
      
      // Cambiar icono del botón
      const icon = mobileMenuButton.querySelector('i');
      if (mobileMenu.classList.contains('hidden')) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      } else {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
      }
    });

    // Cerrar menú al hacer clic en un enlace (mobile)
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', function() {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuButton.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      });
    });
  }

  // ==========================================
  // 3. SMOOTH SCROLL - Enlaces internos
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Evitar scroll si es solo "#"
      if (href === '#') {
        e.preventDefault();
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.offsetTop - 80; // 80px del navbar fijo
        
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==========================================
  // 4. ANIMACIONES AL SCROLL - Intersection Observer
  // ==========================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-fade-in-up');
        // Opcionalmente, dejar de observar después de la animación
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar elementos que deben animarse
  const animatedElements = document.querySelectorAll('.card-hover, .hover-lift');
  animatedElements.forEach(el => observer.observe(el));

  // ==========================================
  // 5. BOTONES DE SCROLL TO TOP
  // ==========================================
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.className = 'fixed bottom-8 right-8 bg-gradient-to-br from-primary-500 to-mint-500 text-white w-12 h-12 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 z-50 hidden items-center justify-center';
  scrollToTopBtn.id = 'scrollToTop';
  document.body.appendChild(scrollToTopBtn);

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollToTopBtn.classList.remove('hidden');
      scrollToTopBtn.classList.add('flex');
    } else {
      scrollToTopBtn.classList.add('hidden');
      scrollToTopBtn.classList.remove('flex');
    }
  });

  scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // ==========================================
  // 6. TOOLTIPS - Inicialización
  // ==========================================
  const tooltips = document.querySelectorAll('[data-tooltip]');
  tooltips.forEach(element => {
    const tooltipText = element.getAttribute('data-tooltip');
    
    element.addEventListener('mouseenter', function() {
      const tooltip = document.createElement('div');
      tooltip.className = 'absolute bg-warm-900 text-white text-sm px-3 py-2 rounded-lg -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap z-50';
      tooltip.textContent = tooltipText;
      tooltip.id = 'tooltip-' + Date.now();
      
      element.style.position = 'relative';
      element.appendChild(tooltip);
    });

    element.addEventListener('mouseleave', function() {
      const tooltip = element.querySelector('[id^="tooltip-"]');
      if (tooltip) {
        tooltip.remove();
      }
    });
  });

  // ==========================================
  // 7. FORMULARIOS - Validación básica
  // ==========================================
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
      let isValid = true;

      inputs.forEach(input => {
        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('border-red-500');
          
          // Crear mensaje de error si no existe
          if (!input.nextElementSibling || !input.nextElementSibling.classList.contains('error-message')) {
            const errorMsg = document.createElement('p');
            errorMsg.className = 'error-message text-red-500 text-sm mt-1';
            errorMsg.textContent = 'Este campo es obligatorio';
            input.parentNode.insertBefore(errorMsg, input.nextSibling);
          }
        } else {
          input.classList.remove('border-red-500');
          const errorMsg = input.nextElementSibling;
          if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
          }
        }
      });

      if (isValid) {
        // Aquí puedes agregar la lógica de envío
        showNotification('Formulario enviado correctamente', 'success');
        form.reset();
      } else {
        showNotification('Por favor, completa todos los campos requeridos', 'error');
      }
    });
  });

  // ==========================================
  // 8. NOTIFICACIONES - Sistema de alertas
  // ==========================================
  window.showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    const icons = {
      success: 'fa-check-circle',
      error: 'fa-times-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };

    const colors = {
      success: 'bg-mint-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-primary-500'
    };

    notification.className = `fixed top-20 right-4 ${colors[type]} text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center gap-3 animate-slide-in-right max-w-md`;
    notification.innerHTML = `
      <i class="fas ${icons[type]} text-xl"></i>
      <span class="font-medium">${message}</span>
      <button class="ml-4 hover:text-gray-200" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;

    document.body.appendChild(notification);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.5s ease-out';
      setTimeout(() => notification.remove(), 500);
    }, 5000);
  };

  // ==========================================
  // 9. MODAL - Sistema de ventanas modales
  // ==========================================
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  };

  // Cerrar modal al hacer clic fuera
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
      const modal = e.target.closest('.modal');
      if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
      }
    }
  });

  // ==========================================
  // 10. TABS - Sistema de pestañas
  // ==========================================
  const tabButtons = document.querySelectorAll('[data-tab]');
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');
      const tabGroup = this.getAttribute('data-tab-group') || 'default';

      // Remover active de todos los botones del grupo
      document.querySelectorAll(`[data-tab-group="${tabGroup}"]`).forEach(btn => {
        btn.classList.remove('active', 'bg-primary-500', 'text-white');
        btn.classList.add('text-warm-600');
      });

      // Agregar active al botón clickeado
      this.classList.add('active', 'bg-primary-500', 'text-white');
      this.classList.remove('text-warm-600');

      // Ocultar todos los contenidos del grupo
      document.querySelectorAll(`[data-tab-content-group="${tabGroup}"]`).forEach(content => {
        content.classList.add('hidden');
      });

      // Mostrar el contenido correspondiente
      const targetContent = document.querySelector(`[data-tab-content="${tabName}"]`);
      if (targetContent) {
        targetContent.classList.remove('hidden');
      }
    });
  });

  // ==========================================
  // 11. CONTADOR ANIMADO
  // ==========================================
  function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        element.textContent = Math.ceil(end);
        clearInterval(timer);
      } else {
        element.textContent = Math.ceil(current);
      }
    }, 16);
  }

  // Inicializar contadores cuando sean visibles
  const counters = document.querySelectorAll('[data-counter]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const endValue = parseInt(element.getAttribute('data-counter'));
        animateCounter(element, 0, endValue, 2000);
        counterObserver.unobserve(element);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  // ==========================================
  // 12. LOADING SPINNER
  // ==========================================
  window.showLoader = function() {
    const loader = document.createElement('div');
    loader.id = 'global-loader';
    loader.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loader.innerHTML = '<div class="spinner"></div>';
    document.body.appendChild(loader);
  };

  window.hideLoader = function() {
    const loader = document.getElementById('global-loader');
    if (loader) {
      loader.remove();
    }
  };

  // ==========================================
  // 13. COPY TO CLIPBOARD
  // ==========================================
  window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
      showNotification('Copiado al portapapeles', 'success');
    }).catch(() => {
      showNotification('Error al copiar', 'error');
    });
  };

  // ==========================================
  // 14. INICIALIZACIÓN COMPLETA
  // ==========================================
  console.log('%c🏗️ ObraFit cargado correctamente', 'color: #0ea5e9; font-size: 16px; font-weight: bold;');
  console.log('%c💪 ¡Bienvenido a tu plataforma de bienestar!', 'color: #14b8a6; font-size: 14px;');

});

// ==========================================
// 15. UTILIDADES GLOBALES
// ==========================================

// Formatear número con separadores
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Generar ID único
function generateId() {
  return 'id-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}

// Debounce para optimizar eventos
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle para limitar ejecución
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
