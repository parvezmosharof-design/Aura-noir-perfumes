/**
 * ===================================================================
 * AURA NOIR PARFUMS - ADMIN PANEL LOGIC
 * Manages Authentication (01617870123 / 123456), Profile Settings,
 * Product CRUD with Auto-Keyword Generation, and Standalone Keyword Engine.
 * ===================================================================
 */

class AdminApp {
  constructor() {
    this.currentTab = 'products';
    this.editingProductId = null;
    this.init();
  }

  init() {
    this.bindDOM();
    this.bindEvents();
    this.checkAuthStatus();
  }

  bindDOM() {
    // Auth Views
    this.loginView = document.getElementById('admin-login-view');
    this.dashboardView = document.getElementById('admin-dashboard-view');
    this.loginForm = document.getElementById('admin-login-form');
    this.loginError = document.getElementById('admin-login-error');
    this.logoutBtn = document.getElementById('admin-logout-btn');

    // Navigation Tabs
    this.navTabs = document.querySelectorAll('.admin-nav-item');
    this.tabSections = document.querySelectorAll('.admin-tab-section');

    // Products Management
    this.productForm = document.getElementById('admin-product-form');
    this.productFormTitle = document.getElementById('product-form-title');
    this.productFormSubmitBtn = document.getElementById('product-form-submit-btn');
    this.cancelEditBtn = document.getElementById('product-cancel-edit-btn');
    this.productsTableBody = document.getElementById('admin-products-table-body');
    this.productsCountBadge = document.getElementById('admin-products-count');
    this.imagePresetSelector = document.getElementById('image-presets-selector');
    this.imagePreview = document.getElementById('product-image-preview');
    this.imageInput = document.getElementById('product-image');
    this.fileUploadInput = document.getElementById('product-file-upload');

    // Profile Management
    this.profileForm = document.getElementById('admin-profile-form');
    this.profileSuccessAlert = document.getElementById('profile-save-success');

    // Keyword Engine
    this.keywordInput = document.getElementById('new-keyword-input');
    this.addKeywordBtn = document.getElementById('add-keyword-btn');
    this.keywordListContainer = document.getElementById('admin-keywords-list');
    this.keywordCountEl = document.getElementById('admin-keywords-count');
    this.keywordSearchInput = document.getElementById('keyword-filter-input');
  }

  bindEvents() {
    // Login form submit
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Logout
    if (this.logoutBtn) {
      this.logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    // Tab switching
    this.navTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetTab = tab.getAttribute('data-tab');
        this.switchTab(targetTab);
      });
    });

    // Product image URL preview & quick presets
    if (this.imageInput) {
      this.imageInput.addEventListener('input', (e) => {
        this.updateImagePreview(e.target.value);
      });
    }

    if (this.imagePresetSelector) {
      this.imagePresetSelector.querySelectorAll('.preset-thumb').forEach(btn => {
        btn.addEventListener('click', () => {
          const url = btn.getAttribute('data-url');
          if (this.imageInput) {
            this.imageInput.value = url;
            this.updateImagePreview(url);
          }
        });
      });
    }

    // Product file upload reader (base64)
    if (this.fileUploadInput) {
      this.fileUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target.result;
            if (this.imageInput) {
              this.imageInput.value = dataUrl;
              this.updateImagePreview(dataUrl);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Product form submission (Add or Edit)
    if (this.productForm) {
      this.productForm.addEventListener('submit', (e) => this.handleProductSubmit(e));
    }

    // Cancel edit
    if (this.cancelEditBtn) {
      this.cancelEditBtn.addEventListener('click', () => this.resetProductForm());
    }

    // Profile form submission
    if (this.profileForm) {
      this.profileForm.addEventListener('submit', (e) => this.handleProfileSubmit(e));
    }

    // Keyword Engine: Add Standalone Keyword
    if (this.addKeywordBtn && this.keywordInput) {
      this.addKeywordBtn.addEventListener('click', () => this.handleAddStandaloneKeyword());
      this.keywordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.handleAddStandaloneKeyword();
        }
      });
    }

    // Keyword Filter
    if (this.keywordSearchInput) {
      this.keywordSearchInput.addEventListener('input', () => this.renderKeywordsList());
    }

    // Listen for store updates
    window.addEventListener('store:updated', (e) => {
      const type = e.detail && e.detail.type;
      if (type === 'products' || type === 'keywords') {
        this.renderProductsTable();
        this.renderKeywordsList();
      }
      if (type === 'profile') {
        this.loadProfileIntoForm();
      }
    });
  }

  // --- AUTHENTICATION ---
  // Default credentials: Username/Phone: "01617870123", Password: "123456"
  handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('admin-username').value.trim();
    const pass = document.getElementById('admin-password').value.trim();

    const success = window.store.login(username, pass);
    if (success) {
      if (this.loginError) this.loginError.style.display = 'none';
      this.checkAuthStatus();
      if (window.showAppToast) {
        window.showAppToast('Authenticated as Luxury Store Admin', 'success');
      }
    } else {
      if (this.loginError) {
        this.loginError.style.display = 'block';
        this.loginError.innerHTML = 'Invalid credentials. Default is Phone: <strong>01617870123</strong> & Password: <strong>123456</strong>';
      }
    }
  }

  handleLogout() {
    window.store.logout();
    this.checkAuthStatus();
    if (window.showAppToast) {
      window.showAppToast('Logged out of Admin Panel', 'info');
    }
  }

  checkAuthStatus() {
    const isAuthed = window.store.isAuthenticated();
    if (isAuthed) {
      if (this.loginView) this.loginView.style.display = 'none';
      if (this.dashboardView) this.dashboardView.style.display = 'block';
      this.loadDashboardData();
    } else {
      if (this.loginView) this.loginView.style.display = 'flex';
      if (this.dashboardView) this.dashboardView.style.display = 'none';
    }
  }

  loadDashboardData() {
    this.renderProductsTable();
    this.renderKeywordsList();
    this.loadProfileIntoForm();
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    this.navTabs.forEach(t => {
      if (t.getAttribute('data-tab') === tabName) {
        t.classList.add('active');
      } else {
        t.classList.remove('active');
      }
    });

    this.tabSections.forEach(sec => {
      if (sec.id === `admin-tab-${tabName}`) {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });
  }

  // --- PROFILE MANAGEMENT ---
  loadProfileIntoForm() {
    if (!this.profileForm) return;
    const p = window.store.getProfile();

    document.getElementById('profile-shop-name').value = p.shopName || '';
    document.getElementById('profile-owner-name').value = p.ownerName || '';
    document.getElementById('profile-contact').value = p.contactNumber || '';
    document.getElementById('profile-whatsapp').value = p.whatsappNumber || p.contactNumber || '';
    document.getElementById('profile-email').value = p.email || '';
    document.getElementById('profile-tagline').value = p.tagline || '';
    document.getElementById('profile-address').value = p.address || '';
  }

  handleProfileSubmit(e) {
    e.preventDefault();
    const updated = {
      shopName: document.getElementById('profile-shop-name').value.trim(),
      ownerName: document.getElementById('profile-owner-name').value.trim(),
      contactNumber: document.getElementById('profile-contact').value.trim(),
      whatsappNumber: document.getElementById('profile-whatsapp').value.trim(),
      email: document.getElementById('profile-email').value.trim(),
      tagline: document.getElementById('profile-tagline').value.trim(),
      address: document.getElementById('profile-address').value.trim()
    };

    window.store.updateProfile(updated);

    if (this.profileSuccessAlert) {
      this.profileSuccessAlert.style.display = 'block';
      setTimeout(() => {
        this.profileSuccessAlert.style.display = 'none';
      }, 4000);
    }

    if (window.showAppToast) {
      window.showAppToast('Store profile updated successfully!', 'success');
    }
  }

  // --- PRODUCT MANAGEMENT ---
  updateImagePreview(url) {
    if (this.imagePreview) {
      this.imagePreview.src = url || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80';
    }
  }

  handleProductSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('product-name').value.trim();
    const price = parseFloat(document.getElementById('product-price').value);
    const category = document.getElementById('product-category').value.trim();
    const image = document.getElementById('product-image').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const notes = document.getElementById('product-notes').value.trim();
    const keywordsRaw = document.getElementById('product-keywords').value.trim();

    if (!name || isNaN(price) || price < 0) {
      alert('Please provide a valid Perfume Name and Price.');
      return;
    }

    const payload = {
      name,
      price,
      category: category || 'Niche Fragrance',
      image: image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      description,
      notes,
      keywords: keywordsRaw,
      featured: document.getElementById('product-featured') ? document.getElementById('product-featured').checked : false
    };

    if (this.editingProductId) {
      window.store.updateProduct(this.editingProductId, payload);
      if (window.showAppToast) {
        window.showAppToast(`Perfume "${name}" updated!`, 'success');
      }
    } else {
      window.store.addProduct(payload);
      if (window.showAppToast) {
        window.showAppToast(`New Perfume "${name}" added! Keywords updated.`, 'success');
      }
    }

    this.resetProductForm();
    this.renderProductsTable();
    this.renderKeywordsList();
  }

  editProduct(productId) {
    const prod = window.store.getProductById(productId);
    if (!prod) return;

    this.editingProductId = productId;
    if (this.productFormTitle) this.productFormTitle.textContent = `Edit Perfume: ${prod.name}`;
    if (this.productFormSubmitBtn) this.productFormSubmitBtn.innerHTML = 'Update Fragrance';
    if (this.cancelEditBtn) this.cancelEditBtn.style.display = 'inline-flex';

    document.getElementById('product-name').value = prod.name;
    document.getElementById('product-price').value = prod.price;
    document.getElementById('product-category').value = prod.category;
    document.getElementById('product-image').value = prod.image;
    document.getElementById('product-description').value = prod.description;
    document.getElementById('product-notes').value = prod.notes || '';
    document.getElementById('product-keywords').value = (prod.keywords || []).join(', ');
    if (document.getElementById('product-featured')) {
      document.getElementById('product-featured').checked = Boolean(prod.featured);
    }

    this.updateImagePreview(prod.image);

    // Scroll form into view
    this.productForm.scrollIntoView({ behavior: 'smooth' });
  }

  deleteProduct(productId) {
    const prod = window.store.getProductById(productId);
    if (!prod) return;

    if (confirm(`Are you sure you want to delete "${prod.name}"? This action cannot be undone.`)) {
      window.store.deleteProduct(productId);
      if (this.editingProductId === productId) {
        this.resetProductForm();
      }
      this.renderProductsTable();
      this.renderKeywordsList();
      if (window.showAppToast) {
        window.showAppToast(`"${prod.name}" was removed.`, 'info');
      }
    }
  }

  resetProductForm() {
    this.editingProductId = null;
    if (this.productForm) this.productForm.reset();
    if (this.productFormTitle) this.productFormTitle.textContent = 'Add New Perfume Creation';
    if (this.productFormSubmitBtn) this.productFormSubmitBtn.innerHTML = 'Save Perfume & Register Keywords';
    if (this.cancelEditBtn) this.cancelEditBtn.style.display = 'none';
    this.updateImagePreview('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80');
  }

  renderProductsTable() {
    if (!this.productsTableBody) return;
    const products = window.store.getProducts();

    if (this.productsCountBadge) {
      this.productsCountBadge.textContent = products.length;
    }

    if (products.length === 0) {
      this.productsTableBody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-4">No perfumes in inventory yet. Use the form above to add your first creation.</td>
        </tr>
      `;
      return;
    }

    this.productsTableBody.innerHTML = products.map(p => `
      <tr class="admin-product-row">
        <td>
          <img src="${p.image}" alt="${this.escapeHTML(p.name)}" class="admin-thumb" onerror="this.src='https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=400&q=80'" />
        </td>
        <td>
          <strong>${this.escapeHTML(p.name)}</strong>
          ${p.featured ? '<span class="badge-gold">Featured</span>' : ''}
          <div class="text-muted small">${this.escapeHTML(p.category)}</div>
        </td>
        <td>
          <span class="price-tag">$${p.price.toFixed(2)}</span>
        </td>
        <td>
          <div class="keywords-pill-wrap">
            ${(p.keywords || []).slice(0, 4).map(k => `<span class="kw-mini-tag">${this.escapeHTML(k)}</span>`).join('')}
            ${(p.keywords || []).length > 4 ? `<span class="kw-mini-tag text-gold">+${p.keywords.length - 4} more</span>` : ''}
          </div>
        </td>
        <td>
          <span class="stock-status in-stock">● In Stock</span>
        </td>
        <td>
          <div class="admin-actions">
            <button class="btn-action edit" onclick="window.adminApp.editProduct('${p.id}')" title="Edit">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn-action delete" onclick="window.adminApp.deleteProduct('${p.id}')" title="Delete">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // --- KEYWORD ENGINE MANAGEMENT ---
  // Critical requirement:
  // - Admin adds standalone keywords
  // - Displays all registered keywords (from products + standalone)
  // - Feeds directly into customer autocomplete
  handleAddStandaloneKeyword() {
    const raw = this.keywordInput.value.trim();
    if (!raw) return;

    // Handle single or comma separated additions
    const keywords = raw.split(',').map(k => k.trim()).filter(Boolean);
    let addedCount = 0;

    keywords.forEach(kw => {
      const added = window.store.addStandaloneKeyword(kw);
      if (added) addedCount++;
    });

    this.keywordInput.value = '';
    this.renderKeywordsList();

    if (window.showAppToast) {
      if (addedCount > 0) {
        window.showAppToast(`Added ${addedCount} keyword(s) to Customer Auto-Suggest engine!`, 'success');
      } else {
        window.showAppToast('Keyword already exists in the engine.', 'info');
      }
    }
  }

  deleteKeyword(kw) {
    window.store.deleteKeyword(kw);
    this.renderKeywordsList();
    if (window.showAppToast) {
      window.showAppToast(`Removed keyword "${kw}"`, 'info');
    }
  }

  renderKeywordsList() {
    if (!this.keywordListContainer) return;
    const allKeywords = window.store.getAllKeywords();
    const filter = (this.keywordSearchInput ? this.keywordSearchInput.value.trim() : '').toLowerCase();

    let displayKeywords = allKeywords;
    if (filter) {
      displayKeywords = allKeywords.filter(k => k.toLowerCase().includes(filter));
    }

    if (this.keywordCountEl) {
      this.keywordCountEl.textContent = `${allKeywords.length} Active Search Keywords`;
    }

    if (displayKeywords.length === 0) {
      this.keywordListContainer.innerHTML = `
        <div class="text-muted p-3">No keywords matching "${this.escapeHTML(filter)}".</div>
      `;
      return;
    }

    this.keywordListContainer.innerHTML = displayKeywords.map(kw => `
      <div class="keyword-chip">
        <span class="kw-text">${this.escapeHTML(kw)}</span>
        <button 
          class="kw-delete-btn" 
          onclick="window.adminApp.deleteKeyword('${this.escapeHTML(kw)}')"
          title="Delete keyword"
        >✕</button>
      </div>
    `).join('');
  }

  escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}

// Global reference
window.AdminApp = AdminApp;
