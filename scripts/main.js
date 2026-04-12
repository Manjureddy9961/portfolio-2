/* scripts/main.js */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Populate Data from config.js ---
  if (window.PORTFOLIO_CONFIG) {
    const config = window.PORTFOLIO_CONFIG;
    
    // Update elements with config data if they exist
    const el = (id) => document.getElementById(id);
    
    if (el('hero-greeting')) el('hero-greeting').textContent = config.personal.heroGreeting;
    if (el('hero-name')) el('hero-name').textContent = config.personal.fullName;
    // We will handle the role with a typing animation
    if (el('hero-desc')) el('hero-desc').textContent = config.personal.shortTagline;
    if (el('about-summary')) el('about-summary').textContent = config.personal.aboutSummary;
    
    // Links
    document.querySelectorAll('.link-whatsapp').forEach(a => a.href = config.contact.whatsapp);
    document.querySelectorAll('.link-linkedin').forEach(a => a.href = config.contact.linkedin);
    document.querySelectorAll('.link-github').forEach(a => a.href = config.contact.github);
    document.querySelectorAll('.link-instagram').forEach(a => a.href = config.contact.instagram);
    document.querySelectorAll('.link-email').forEach(a => a.href = `mailto:${config.contact.email}`);
    
    if (el('contact-email-text')) el('contact-email-text').textContent = config.contact.email;
    if (el('contact-phone-text')) el('contact-phone-text').textContent = config.contact.phone;
    if (el('contact-location-text')) el('contact-location-text').textContent = config.personal.location;

    document.querySelectorAll('.btn-resume').forEach(btn => btn.href = config.assets.resumePdf);
  }

  // --- 2. Remove Preloader ---
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.style.opacity = '0';
      setTimeout(() => preloader.style.display = 'none', 500);
    }, 1000); // 1s fake load time
  }

  // --- 3. Typing Animation ---
  const roles = ["Full Stack Developer", "Designer", "Python & Django Developer", "Problem Solver"];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingElement = document.getElementById('hero-role-typing');
  
  function typeEffect() {
    if(!typingElement) return;
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typeSpeed = 1500; // Pause at end
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500; // Pause before typing next
    }
    setTimeout(typeEffect, typeSpeed);
  }
  
  setTimeout(typeEffect, 1500); // Start typing after loader

  // --- 4. Mobile Menu Toggle ---
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      hamburger.classList.toggle('active');
      if (hamburger.classList.contains('active')) {
        hamburger.innerHTML = '<i class="fas fa-times"></i>';
      } else {
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });

    navLinks.forEach(n => n.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    }));
  }

  // --- 5. Sticky Header & Scroll To Top ---
  const header = document.querySelector('.header');
  const scrollTop = document.querySelector('.scroll-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      if(scrollTop) scrollTop.classList.add('show');
    } else {
      header.classList.remove('scrolled');
      if(scrollTop) scrollTop.classList.remove('show');
    }
  });

  if (scrollTop) {
    scrollTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 6. Scroll Animations (Intersection Observer) ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appear');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
  });

  // --- 7. Dark / Light Mode Toggle ---
  const themeToggleArea = document.getElementById('theme-toggle');
  
  if (themeToggleArea) {
    themeToggleArea.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      themeToggleArea.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
      
      // Update config variables for light mode dynamically (or rely on CSS variables)
    });
  }

  // --- 8. Contact Form Handling ---
  const form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Formspree is integrated via the action attribute in HTML
      // Here we just show a simple UI feedback while submitting
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;

      // In a real scenario with formspree:
      const formData = new FormData(form);
      fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      }).then(response => {
        if (response.ok) {
          form.reset();
          btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
          btn.style.background = '#22c55e'; // Success green
        } else {
          btn.innerHTML = 'Error! Try Again <i class="fas fa-times"></i>';
          btn.style.background = '#ef4444'; // Error red
        }
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }).catch(error => {
        btn.innerHTML = 'Error! Try Again <i class="fas fa-times"></i>';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
        }, 3000);
      });
    });
  }

});
