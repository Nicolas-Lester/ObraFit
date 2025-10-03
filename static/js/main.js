// JavaScript principal para ObraFit

document.addEventListener('DOMContentLoaded', function() {
  // Activar tooltips y popovers de Bootstrap
  const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  if (tooltips.length > 0) {
    Array.from(tooltips).forEach(tooltip => {
      new bootstrap.Tooltip(tooltip);
    });
  }

  // Inicializar popovers
  const popovers = document.querySelectorAll('[data-bs-toggle="popover"]');
  if (popovers.length > 0) {
    Array.from(popovers).forEach(popover => {
      new bootstrap.Popover(popover);
    });
  }

  // Efecto de animación en las tarjetas
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.querySelector('.card-icon').style.transform = 'scale(1.2)';
      this.querySelector('.card-icon').style.transition = 'all 0.3s ease';
      this.style.borderColor = '#3498db';
    });
    
    card.addEventListener('mouseleave', function() {
      this.querySelector('.card-icon').style.transform = 'scale(1)';
      this.style.borderColor = 'transparent';
    });
  });

  // Animación para los tips
  const tipItems = document.querySelectorAll('.tip-item');
  tipItems.forEach((tip, index) => {
    // Añadir un pequeño retraso basado en el índice para un efecto escalonado
    setTimeout(() => {
      tip.style.opacity = '1';
      tip.style.transform = 'translateY(0)';
    }, index * 150);
  });

  // Smooth scroll para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      document.querySelector(targetId).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });
  
  // Añadir tooltips a los iconos sociales en el footer
  document.querySelectorAll('.social-icons a').forEach(icon => {
    icon.setAttribute('data-bs-toggle', 'tooltip');
    icon.setAttribute('data-bs-placement', 'top');
    
    if (icon.querySelector('i').classList.contains('fa-facebook')) {
      icon.setAttribute('title', 'Síguenos en Facebook');
    } else if (icon.querySelector('i').classList.contains('fa-instagram')) {
      icon.setAttribute('title', 'Síguenos en Instagram');
    } else if (icon.querySelector('i').classList.contains('fa-youtube')) {
      icon.setAttribute('title', 'Mira nuestros videos');
    }
    
    new bootstrap.Tooltip(icon);
  });
});