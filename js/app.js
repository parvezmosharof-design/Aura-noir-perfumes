/**
 * ===================================================================
 * AURA NOIR PARFUMS - MAIN APPLICATION CONTROLLER
 * Manages view routing (Customer Landing vs Admin Panel),
 * Toast Notifications, and Global Initialization.
 * ===================================================================
 */

// Global Toast Notification Helper
window.showAppToast = function (message, type = 'info') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast-item toast-${type}`;
  
  let icon = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="16" x2="12" y2="12"></line>
      <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>
  `;
  if (type === 'success') {
    icon = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;
  }

  toast.innerHTML = `
    <div class="toast-icon">${icon}</div>
    <div class="toast-content">${message}</div>
    <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 3800);
};

class MainApp {
  constructor() {
    this.currentView = 'customer';
    this.init();
  }

  init() {
    // Instantiate sub-apps
    window.customerApp = new window.CustomerApp();
    window.adminApp = new window.AdminApp();

    this.bindViewSwitchers();
    this.handleRoute();

    window.addEventListener('hashchange', () => this.handleRoute());
  }

  bindViewSwitchers() {
    // Admin buttons in customer view
    const adminToggleBtns = document.querySelectorAll('.switch-to-admin-btn');
    adminToggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#admin';
      });
    });

    // Back to customer store buttons in admin view
    const customerToggleBtns = document.querySelectorAll('.switch-to-customer-btn');
    customerToggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = '#store';
      });
    });
  }

  handleRoute() {
    const hash = window.location.hash.toLowerCase();
    const customerViewEl = document.getElementById('customer-view');
    const adminViewEl = document.getElementById('admin-view');
    const chatbotLauncher = document.getElementById('chatbot-launcher');
    const chatbotWindow = document.getElementById('chatbot-window');

    if (hash === '#admin') {
      this.currentView = 'admin';
      if (customerViewEl) customerViewEl.style.display = 'none';
      if (adminViewEl) adminViewEl.style.display = 'block';

      // Hide customer chatbot in admin view
      if (chatbotLauncher) chatbotLauncher.style.display = 'none';
      if (chatbotWindow) chatbotWindow.classList.remove('open');

      window.adminApp.checkAuthStatus();
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      this.currentView = 'customer';
      if (customerViewEl) customerViewEl.style.display = 'block';
      if (adminViewEl) adminViewEl.style.display = 'none';

      // Show customer chatbot
      if (chatbotLauncher) chatbotLauncher.style.display = 'flex';

      // Refresh customer products/cart
      window.customerApp.renderProducts();
      window.customerApp.renderCategoryFilters();
      window.customerApp.renderCart();
      window.customerApp.renderProfileData();
    }
  }
}

// Bootstrap once everything is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.mainApp = new MainApp();
});
