/**
 * Portfolio Application - Object-Oriented Structure
 * Manages theme, menu, and application initialization
 */

/**
 * ThemeManager Class
 * Handles theme switching and persistence
 */
class ThemeManager {
  constructor() {
    this.themeKey = 'theme';
    this.defaultTheme = 'light';
    this.htmlElement = document.documentElement;
  }

  getThemeIcon() {
    return document.querySelector('.theme-icon');
  }

  /**
   * Initialize theme from localStorage or default
   */
  init() {
    if (!this.htmlElement) return;
    const savedTheme = localStorage.getItem(this.themeKey) || this.defaultTheme;
    this.setTheme(savedTheme);
    this.updateIcon(savedTheme);
  }

  /**
   * Toggle between light and dark themes
   */
  toggle() {
    if (!this.htmlElement) return;
    const currentTheme = this.htmlElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
    this.saveTheme(newTheme);
    this.updateIcon(newTheme);
  }

  /**
   * Set theme on HTML element
   * @param {string} theme - Theme name ('light' or 'dark')
   */
  setTheme(theme) {
    this.htmlElement.setAttribute('data-theme', theme);
  }

  /**
   * Save theme preference to localStorage
   * @param {string} theme - Theme name
   */
  saveTheme(theme) {
    localStorage.setItem(this.themeKey, theme);
  }

  /**
   * Update theme icon based on current theme
   * @param {string} theme - Theme name
   */
  updateIcon(theme) {
    const themeIcon = this.getThemeIcon();
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }
}

/**
 * MenuManager Class
 * Handles hamburger menu open/close functionality
 */
class MenuManager {
  constructor() {
    this.body = document.body;
  }

  getOverlay() {
    return document.querySelector('.menu-overlay');
  }

  getIcon() {
    return document.querySelector('.hamburger-icon');
  }

  /**
   * Toggle menu open/close state
   */
  toggle() {
    const overlay = this.getOverlay();
    const icon = this.getIcon();
    
    if (!overlay || !icon) return;

    const isOpen = overlay.classList.contains('open');
    
    if (isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open menu
   */
  open() {
    const overlay = this.getOverlay();
    const icon = this.getIcon();
    
    if (!overlay || !icon) return;
    
    // Save current scroll position
    const scrollY = window.scrollY;
    overlay.classList.add('open');
    icon.classList.add('open');
    this.body.classList.add('menu-open');
    this.body.style.overflow = 'hidden';
    this.body.style.position = 'fixed';
    this.body.style.width = '100%';
    this.body.style.top = `-${scrollY}px`;
  }

  /**
   * Close menu
   */
  close() {
    const overlay = this.getOverlay();
    const icon = this.getIcon();
    
    // Restore scroll position
    const scrollY = this.body.style.top;
    if (overlay) overlay.classList.remove('open');
    if (icon) icon.classList.remove('open');
    this.body.classList.remove('menu-open');
    this.body.style.overflow = '';
    this.body.style.position = '';
    this.body.style.width = '';
    this.body.style.height = '';
    this.body.style.top = '';
    
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }

  /**
   * Check if menu is currently open
   * @returns {boolean} - True if menu is open
   */
  isOpen() {
    const overlay = this.getOverlay();
    return overlay?.classList.contains('open') || false;
  }
}

/**
 * PortfolioApp Class
 * Main application controller
 */
class PortfolioApp {
  constructor() {
    this.themeManager = new ThemeManager();
    this.menuManager = new MenuManager();
  }

  /**
   * Initialize the application
   */
  init() {
    this.themeManager.init();
    this.attachEventListeners();
  }

  /**
   * Attach event listeners to DOM elements
   */
  attachEventListeners() {
    // Theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.themeManager.toggle());
    }

    // Hamburger menu toggle
    const hamburgerIcon = document.querySelector('.hamburger-icon');
    if (hamburgerIcon) {
      hamburgerIcon.addEventListener('click', () => this.menuManager.toggle());
    }

    // Close menu when clicking overlay
    const menuOverlay = document.querySelector('.menu-overlay');
    if (menuOverlay) {
      menuOverlay.addEventListener('click', () => this.menuManager.close());
    }

    // Prevent menu close when clicking inside menu links
    const menuLinks = document.querySelector('.menu-links');
    if (menuLinks) {
      menuLinks.addEventListener('click', (e) => e.stopPropagation());
    }
  }
}

// Global functions for backward compatibility with inline onclick handlers
// These need to be available immediately, before DOMContentLoaded
window.toggleTheme = function(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  // Direct implementation - no need for app initialization
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  const themeIcon = document.querySelector('.theme-icon');
  if (themeIcon) {
    themeIcon.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  }
  
  return false;
};

window.toggleMenu = function(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  // Direct implementation - no need for app initialization
  const overlay = document.querySelector('.menu-overlay');
  const icon = document.querySelector('.hamburger-icon');
  
  if (!overlay || !icon) {
    return false;
  }
  
  const isOpen = overlay.classList.contains('open');
  
  if (isOpen) {
    overlay.classList.remove('open');
    icon.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
  } else {
    // Save current scroll position
    const scrollY = window.scrollY;
    overlay.classList.add('open');
    icon.classList.add('open');
    document.body.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;
  }
  
  return false;
};

// Handle menu link clicks - navigate and close menu
window.handleMenuLink = function(e) {
  // Close the menu first
  const overlay = document.querySelector('.menu-overlay');
  const icon = document.querySelector('.hamburger-icon');
  
  if (overlay) overlay.classList.remove('open');
  if (icon) icon.classList.remove('open');
  document.body.classList.remove('menu-open');
  
  // Restore scroll position
  const scrollY = document.body.style.top;
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
  document.body.style.height = '';
  document.body.style.top = '';
  
  if (scrollY) {
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
  }
  
  // Allow default navigation to happen
  // The href will handle the navigation
};

// Initialize theme on page load
function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  const html = document.documentElement;
  html.setAttribute('data-theme', savedTheme);
  
  const themeIcon = document.querySelector('.theme-icon');
  if (themeIcon) {
    themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }
}

// Add direct event listener to theme button as backup
function setupThemeButton() {
  const themeButton = document.getElementById('theme-toggle');
  if (themeButton) {
    // Remove existing listeners and add new one
    const newButton = themeButton.cloneNode(true);
    themeButton.parentNode.replaceChild(newButton, themeButton);
    
    newButton.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.toggleTheme(e);
      return false;
    });
  }
}

// Add direct event listener to hamburger menu as backup
function setupMenuButton() {
  const hamburgerIcon = document.querySelector('.hamburger-icon');
  if (hamburgerIcon) {
    hamburgerIcon.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.toggleMenu(e);
      return false;
    });
  }
  
  const menuOverlay = document.querySelector('.menu-overlay');
  if (menuOverlay) {
    menuOverlay.addEventListener('click', function(e) {
      // Only close if clicking the overlay itself, not the links
      if (e.target === menuOverlay) {
        e.preventDefault();
        e.stopPropagation();
        window.toggleMenu(e);
        return false;
      }
    });
  }
  
  // Close menu on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const overlay = document.querySelector('.menu-overlay');
      if (overlay && overlay.classList.contains('open')) {
        window.toggleMenu(e);
      }
    }
  });
  
  // Close menu when clicking menu links
  const menuLinks = document.querySelectorAll('.menu-links a');
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      // Close menu but allow navigation
      window.handleMenuLink(e);
    });
  });
}

/**
 * Luxury Custom Cursor System
 * Smooth interpolation with easing and interactive scaling
 */
class LuxuryCursor {
  constructor() {
    this.cursor = document.getElementById('custom-cursor');
    this.cursorDot = document.getElementById('cursor-dot');
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.mouseX = 0;
    this.mouseY = 0;
    this.cursorX = 0;
    this.cursorY = 0;
    this.dotX = 0;
    this.dotY = 0;
    this.isHovering = false;
    this.animationFrame = null;
    
    if (!this.isTouchDevice && this.cursor && this.cursorDot) {
      this.init();
    }
  }

  init() {
    // Only initialize on non-touch devices
    if (this.isTouchDevice) {
      return;
    }

    // Show cursor elements
    this.cursor.classList.add('active');
    this.cursorDot.classList.add('active');

    // Mouse move event
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }, { passive: true });

    // Interactive elements
    const interactiveElements = document.querySelectorAll(
      'a, button, .btn, .icon, .menu-icon, .footer-icon, .hamburger-icon, .theme-toggle, input, textarea, select, [onclick]'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        this.isHovering = true;
        this.cursor.classList.add('hover');
        this.cursorDot.classList.add('hover');
      });

      el.addEventListener('mouseleave', () => {
        this.isHovering = false;
        this.cursor.classList.remove('hover');
        this.cursorDot.classList.remove('hover');
      });
    });

    // Click animation
    document.addEventListener('mousedown', () => {
      this.cursor.classList.add('click');
      this.cursorDot.classList.add('click');
    });

    document.addEventListener('mouseup', () => {
      this.cursor.classList.remove('click');
      this.cursorDot.classList.remove('click');
    });

    // Smooth interpolation animation
    this.animate();
  }

  animate() {
    // Smooth easing for outer cursor (slower, more delay) - ease-out effect
    const cursorLerp = 0.12;
    const dx = this.mouseX - this.cursorX;
    const dy = this.mouseY - this.cursorY;
    this.cursorX += dx * cursorLerp;
    this.cursorY += dy * cursorLerp;

    // Faster easing for inner dot (closer to real cursor) - ease-out effect
    const dotLerp = 0.35;
    const dotDx = this.mouseX - this.dotX;
    const dotDy = this.mouseY - this.dotY;
    this.dotX += dotDx * dotLerp;
    this.dotY += dotDy * dotLerp;

    // Apply transforms with will-change optimization
    this.cursor.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px) translate(-50%, -50%)`;
    this.cursorDot.style.transform = `translate(${this.dotX}px, ${this.dotY}px) translate(-50%, -50%)`;

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

/**
 * ScrollAnimationManager Class
 * Handles scroll-triggered animations using Intersection Observer
 */
class ScrollAnimationManager {
  constructor() {
    this.observer = null;
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
  }

  init() {
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: show all elements immediately
      document.querySelectorAll('.scroll-animate').forEach(el => {
        el.classList.add('animate');
      });
      return;
    }

    // Create Intersection Observer
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          // Unobserve after animation to improve performance
          this.observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    // Observe all elements with scroll-animate class
    document.querySelectorAll('.scroll-animate').forEach(el => {
      this.observer.observe(el);
    });

    // Animate hero section immediately on page load (since it's already visible)
    const heroElements = document.querySelectorAll('#profile .scroll-animate');
    if (heroElements.length > 0) {
      // Small delay to ensure smooth initial animation
      setTimeout(() => {
        heroElements.forEach((el, index) => {
          setTimeout(() => {
            el.classList.add('animate');
          }, index * 100); // Stagger hero animations
        });
      }, 100);
    }
  }
}

// Initialize when DOM is ready
function initializeApp() {
  initializeTheme();
  setupThemeButton();
  setupMenuButton();
  
  // Initialize PortfolioApp
  if (!window.portfolioApp) {
    window.portfolioApp = new PortfolioApp();
    window.portfolioApp.init();
  }
  
  // Initialize luxury cursor
  if (!window.luxuryCursor) {
    window.luxuryCursor = new LuxuryCursor();
  }
  
  // Initialize scroll animations
  if (!window.scrollAnimationManager) {
    window.scrollAnimationManager = new ScrollAnimationManager();
    window.scrollAnimationManager.init();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
