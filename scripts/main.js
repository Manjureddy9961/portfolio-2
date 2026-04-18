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
      
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
      btn.disabled = true;

      const formData = new FormData(form);
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
      };

      const statusEl = document.getElementById('form-status');
      
      if (statusEl) {
        statusEl.textContent = "";
      }

      // Send POST request with JSON to the backend server
      fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(response => response.json())
        .then(data => {
        if (data.success) {
          form.reset();
          btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
          btn.style.background = '#22c55e'; // Success green
          if (statusEl) {
            statusEl.textContent = "Successfully saved to contacts.csv locally!";
            statusEl.style.color = "#22c55e";
          }
        } else {
          btn.innerHTML = 'Error! <i class="fas fa-times"></i>';
          btn.style.background = '#ef4444'; // Error red
          if (statusEl) {
            statusEl.textContent = "Error saving to local backend.";
            statusEl.style.color = "#ef4444";
          }
        }
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }).catch(error => {
        btn.innerHTML = 'Backend Offline <i class="fas fa-times"></i>';
        btn.style.background = '#ef4444'; // Error red
        if (statusEl) {
          statusEl.textContent = "Ensure your Node.js backend (server.js) is running on port 3000.";
          statusEl.style.color = "#ef4444";
        }
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      });
    });
  }

  // --- 9. Scroll Progress Bar ---
  const scrollBar = document.getElementById('scroll-bar');
  window.addEventListener('scroll', () => {
    if (!scrollBar) return;
    const scrollPosition = window.scrollY;
    // Calculate total layout height minus viewport height
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollPosition / documentHeight) * 100;
    scrollBar.style.width = scrollPercentage + '%';
  });

  // --- 10. Custom Cursor ---
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  if (cursorDot && cursorOutline && window.innerWidth > 768) {
    window.addEventListener('mousemove', (e) => {
      cursorDot.style.left = e.clientX + 'px';
      cursorDot.style.top = e.clientY + 'px';
      
      cursorOutline.animate({
        left: e.clientX + 'px',
        top: e.clientY + 'px'
      }, { duration: 500, fill: "forwards" });
    });

    const hoverables = document.querySelectorAll('a, button, input, textarea, .glass-card, .skill-tag, .social-icon');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => cursorOutline.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hover'));
    });
  }

  // --- 11. 3D Card Tilt Effect ---
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if(window.innerWidth < 768) return; // Disable tilt on mobile
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Limit rotation slightly for smooth elegant effect
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      card.style.transition = 'transform 0.1s ease';
      card.style.zIndex = '10'; // Brings hovered card to top perfectly
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      card.style.transition = 'transform 0.5s ease';
      card.style.zIndex = '1';
    });
  });

  // --- 12. Magnetic Buttons & Socials ---
  const magneticElements = document.querySelectorAll('.btn, .social-icon, .project-link');
  magneticElements.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      if(window.innerWidth < 768) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Distance multiplier
      el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
      el.style.transition = 'transform 0.1s ease-out';
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.transform = `translate(0px, 0px)`;
      // Fast bouncy reset curve
      el.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    });
  });

});
