/**
 * ===================================================================
 * AURA NOIR PARFUMS - CUSTOMER VIEW LOGIC
 * Handles Landing Page, Sticky Nav, Product Catalog, Search & Autocomplete,
 * Cart Drawer (LocalStorage), and WhatsApp Contact Form.
 * ===================================================================
 */

class CustomerApp {
  constructor() {
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.selectedSuggestionIndex = -1;
    this.init();
  }

  init() {
    this.bindDOM();
    this.bindEvents();
    this.renderProfileData();
    this.renderProducts();
    this.renderCart();
    this.setupSearchAutocomplete();
  }

  bindDOM() {
    // Navigation & Layout
    this.navEl = document.getElementById('main-navbar');
    this.mobileNavToggle = document.getElementById('mobile-nav-toggle');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.cartTriggerBtn = document.getElementById('cart-trigger-btn');
    this.cartBadge = document.getElementById('cart-badge');
    this.mobileCartBadge = document.getElementById('mobile-cart-badge');

    // Search & Autocomplete
    this.searchInput = document.getElementById('search-input');
    this.searchClearBtn = document.getElementById('search-clear-btn');
    this.autocompleteDropdown = document.getElementById('search-autocomplete');

    // Products
    this.productsGrid = document.getElementById('products-grid');
    this.productsCountEl = document.getElementById('products-count');
    this.categoryFiltersContainer = document.getElementById('category-filters');

    // Cart Drawer
    this.cartDrawer = document.getElementById('cart-drawer');
    this.cartOverlay = document.getElementById('cart-overlay');
    this.cartCloseBtn = document.getElementById('cart-close-btn');
    this.cartItemsContainer = document.getElementById('cart-items-container');
    this.cartSubtotalEl = document.getElementById('cart-subtotal');
    this.cartCheckoutBtn = document.getElementById('cart-checkout-btn');
    this.cartClearBtn = document.getElementById('cart-clear-btn');

    // Contact Form
    this.contactForm = document.getElementById('whatsapp-contact-form');
    this.contactSuccessMsg = document.getElementById('contact-success-msg');

    // Brand Profile Dynamic Placeholders
    this.brandTitleEls = document.querySelectorAll('.dynamic-brand-name');
    this.brandPhoneEls = document.querySelectorAll('.dynamic-brand-phone');
    this.brandEmailEls = document.querySelectorAll('.dynamic-brand-email');
    this.brandTaglineEls = document.querySelectorAll('.dynamic-brand-tagline');
  }

  bindEvents() {
    // Sticky header on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        this.navEl.classList.add('scrolled');
      } else {
        this.navEl.classList.remove('scrolled');
      }
    });

    // Mobile nav toggle
    if (this.mobileNavToggle && this.mobileMenu) {
      this.mobileNavToggle.addEventListener('click', () => {
        this.mobileMenu.classList.toggle('open');
        this.mobileNavToggle.classList.toggle('active');
      });

      // Close mobile nav when clicking links
      this.mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          this.mobileMenu.classList.remove('open');
          this.mobileNavToggle.classList.remove('active');
        });
      });
    }

    // Cart Drawer Open/Close
    if (this.cartTriggerBtn) {
      this.cartTriggerBtn.addEventListener('click', () => this.openCartDrawer());
    }
    const mobileCartTrigger = document.getElementById('mobile-cart-trigger');
    if (mobileCartTrigger) {
      mobileCartTrigger.addEventListener('click', () => this.openCartDrawer());
    }
    if (this.cartCloseBtn) {
      this.cartCloseBtn.addEventListener('click', () => this.closeCartDrawer());
    }
    if (this.cartOverlay) {
      this.cartOverlay.addEventListener('click', () => this.closeCartDrawer());
    }

    // Cart Clear
    if (this.cartClearBtn) {
      this.cartClearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all items in your cart?')) {
          window.store.clearCart();
        }
      });
    }

    // Cart WhatsApp Checkout
    if (this.cartCheckoutBtn) {
      this.cartCheckoutBtn.addEventListener('click', () => this.handleCartCheckout());
    }

    // WhatsApp Contact Form
    if (this.contactForm) {
      this.contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
    }

    // Listen to store updates
    window.addEventListener('store:updated', (e) => {
      const type = e.detail && e.detail.type;
      if (type === 'products' || type === 'keywords') {
        this.renderProducts();
        this.renderCategoryFilters();
      }
      if (type === 'cart') {
        this.renderCart();
      }
      if (type === 'profile') {
        this.renderProfileData();
      }
    });
  }

  renderProfileData() {
    const profile = window.store.getProfile();
    this.brandTitleEls.forEach(el => el.textContent = profile.shopName);
    this.brandPhoneEls.forEach(el => {
      el.textContent = profile.contactNumber;
      if (el.tagName === 'A') el.href = `tel:${profile.contactNumber}`;
    });
    this.brandEmailEls.forEach(el => {
      el.textContent = profile.email;
      if (el.tagName === 'A') el.href = `mailto:${profile.email}`;
    });
    this.brandTaglineEls.forEach(el => el.textContent = profile.tagline);
  }

  // --- SEARCH & AUTOCOMPLETE ENGINE ---
  setupSearchAutocomplete() {
    if (!this.searchInput || !this.autocompleteDropdown) return;

    // Search Input Typing
    this.searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim().toLowerCase();
      this.searchQuery = query;

      if (query.length > 0) {
        if (this.searchClearBtn) this.searchClearBtn.style.display = 'flex';
        this.renderAutocompleteSuggestions(query);
      } else {
        if (this.searchClearBtn) this.searchClearBtn.style.display = 'none';
        this.hideAutocomplete();
      }
      this.renderProducts();
    });

    // Clear search
    if (this.searchClearBtn) {
      this.searchClearBtn.addEventListener('click', () => {
        this.searchInput.value = '';
        this.searchQuery = '';
        this.searchClearBtn.style.display = 'none';
        this.hideAutocomplete();
        this.renderProducts();
        this.searchInput.focus();
      });
    }

    // Keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
    this.searchInput.addEventListener('keydown', (e) => {
      const items = this.autocompleteDropdown.querySelectorAll('.suggestion-item');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.selectedSuggestionIndex = (this.selectedSuggestionIndex + 1) % items.length;
        this.highlightSuggestion(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.selectedSuggestionIndex = (this.selectedSuggestionIndex - 1 + items.length) % items.length;
        this.highlightSuggestion(items);
      } else if (e.key === 'Enter') {
        if (this.selectedSuggestionIndex > -1 && items[this.selectedSuggestionIndex]) {
          e.preventDefault();
          items[this.selectedSuggestionIndex].click();
        }
      } else if (e.key === 'Escape') {
        this.hideAutocomplete();
      }
    });

    // Close autocomplete on click outside
    document.addEventListener('click', (e) => {
      if (!this.searchInput.contains(e.target) && !this.autocompleteDropdown.contains(e.target)) {
        this.hideAutocomplete();
      }
    });

    // Focus input shows top suggestions if not empty
    this.searchInput.addEventListener('focus', () => {
      const query = this.searchInput.value.trim().toLowerCase();
      if (query.length > 0) {
        this.renderAutocompleteSuggestions(query);
      }
    });
  }

  renderAutocompleteSuggestions(query) {
    // Critical: pulls dynamically from keywords defined in Admin + product names
    const allKeywords = window.store.getAllKeywords();
    const products = window.store.getProducts();

    // Match keywords that contain or start with the query
    const matchedKeywords = allKeywords.filter(k => k.includes(query)).slice(0, 7);

    // Also find products matching name
    const matchedProducts = products.filter(p => p.name.toLowerCase().includes(query)).slice(0, 3);

    if (matchedKeywords.length === 0 && matchedProducts.length === 0) {
      this.autocompleteDropdown.innerHTML = `
        <div class="suggestion-no-results">
          <span>No scent or keyword matching "${this.escapeHTML(query)}"</span>
          <div class="suggestion-hints">Try: "oud", "rose", "woody", "vanilla", or "amber"</div>
        </div>
      `;
      this.showAutocomplete();
      return;
    }

    let html = '';

    // If direct perfume bottle matches
    if (matchedProducts.length > 0) {
      html += `<div class="suggestion-category-label">Matching Perfumes</div>`;
      matchedProducts.forEach(prod => {
        html += `
          <div class="suggestion-item suggestion-product-item" data-value="${this.escapeHTML(prod.name)}">
            <img src="${prod.image}" alt="${this.escapeHTML(prod.name)}" class="suggestion-thumb" />
            <div class="suggestion-prod-info">
              <div class="suggestion-title">${this.highlightMatch(prod.name, query)}</div>
              <div class="suggestion-meta">$${prod.price.toFixed(2)} • ${this.escapeHTML(prod.category)}</div>
            </div>
            <span class="suggestion-type-badge">Perfume</span>
          </div>
        `;
      });
    }

    // Matching admin keywords
    if (matchedKeywords.length > 0) {
      html += `<div class="suggestion-category-label">Keywords & Scent Notes</div>`;
      matchedKeywords.forEach(kw => {
        html += `
          <div class="suggestion-item suggestion-keyword-item" data-value="${this.escapeHTML(kw)}">
            <svg class="suggestion-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span class="suggestion-text">${this.highlightMatch(kw, query)}</span>
            <span class="suggestion-tag">Keyword</span>
          </div>
        `;
      });
    }

    this.autocompleteDropdown.innerHTML = html;
    this.selectedSuggestionIndex = -1;
    this.showAutocomplete();

    // Bind click events on suggestions
    this.autocompleteDropdown.querySelectorAll('.suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const value = item.getAttribute('data-value');
        this.searchInput.value = value;
        this.searchQuery = value.toLowerCase();
        this.hideAutocomplete();
        this.renderProducts();

        // Smooth scroll to product grid
        const catalogSection = document.getElementById('collection');
        if (catalogSection) {
          catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  highlightMatch(text, query) {
    const regex = new RegExp(`(${query.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi');
    return this.escapeHTML(text).replace(regex, '<mark class="suggest-highlight">$1</mark>');
  }

  highlightSuggestion(items) {
    items.forEach((item, idx) => {
      if (idx === this.selectedSuggestionIndex) {
        item.classList.add('selected');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('selected');
      }
    });
  }

  showAutocomplete() {
    this.autocompleteDropdown.classList.add('show');
  }

  hideAutocomplete() {
    this.autocompleteDropdown.classList.remove('show');
    this.selectedSuggestionIndex = -1;
  }

  // --- PRODUCT CATALOG RENDERING ---
  renderProducts() {
    if (!this.productsGrid) return;

    let products = window.store.getProducts();

    // Filter by category
    if (this.activeCategory !== 'all') {
      products = products.filter(p => p.category.toLowerCase().includes(this.activeCategory.toLowerCase()));
    }

    // Filter by search query (checks name, description, notes, and keywords)
    if (this.searchQuery) {
      const q = this.searchQuery;
      products = products.filter(p => {
        const inName = p.name.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inNotes = (p.notes || '').toLowerCase().includes(q);
        const inCat = p.category.toLowerCase().includes(q);
        const inKeywords = (p.keywords || []).some(k => k.toLowerCase().includes(q));
        return inName || inDesc || inNotes || inCat || inKeywords;
      });
    }

    if (this.productsCountEl) {
      this.productsCountEl.textContent = `${products.length} Fragrance${products.length === 1 ? '' : 's'} Found`;
    }

    if (products.length === 0) {
      this.productsGrid.innerHTML = `
        <div class="no-products-found">
          <div class="no-products-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3>No Flacons Matched Your Search</h3>
          <p>We couldn't find any creations matching "${this.escapeHTML(this.searchQuery)}". Explore other notes or reset filters.</p>
          <button class="btn btn-outline-gold" onclick="window.customerApp.resetSearch()">Reset All Filters</button>
        </div>
      `;
      return;
    }

    this.productsGrid.innerHTML = products.map(prod => `
      <article class="product-card" data-id="${prod.id}">
        <div class="product-image-wrapper">
          <img 
            src="${prod.image}" 
            alt="${this.escapeHTML(prod.name)}" 
            class="product-image"
            loading="lazy"
            onerror="this.src='https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'"
          />
          ${prod.featured ? '<span class="product-badge">Masterpiece</span>' : ''}
          <div class="product-overlay-actions">
            <button class="btn-quick-view" onclick="window.customerApp.openQuickView('${prod.id}')" title="Quick View">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span>Explore Notes</span>
            </button>
          </div>
        </div>

        <div class="product-content">
          <div class="product-category-row">
            <span class="product-category">${this.escapeHTML(prod.category)}</span>
            <div class="product-rating">
              <span class="star">★</span>
              <span class="rating-value">${prod.rating ? prod.rating.toFixed(1) : '5.0'}</span>
            </div>
          </div>

          <h3 class="product-name" onclick="window.customerApp.openQuickView('${prod.id}')">${this.escapeHTML(prod.name)}</h3>
          
          <p class="product-description">${this.escapeHTML(prod.description)}</p>

          ${prod.notes ? `
            <div class="product-notes-preview">
              <strong>Notes:</strong> ${this.escapeHTML(prod.notes)}
            </div>
          ` : ''}

          <div class="product-footer">
            <div class="product-price-box">
              <span class="product-price-label">Price</span>
              <span class="product-price">$${prod.price.toFixed(2)}</span>
            </div>
            
            <button 
              class="btn btn-add-cart" 
              onclick="window.customerApp.addToCart('${prod.id}')"
              id="add-cart-${prod.id}"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }

  renderCategoryFilters() {
    if (!this.categoryFiltersContainer) return;
    const products = window.store.getProducts();

    // Extract unique categories
    const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

    this.categoryFiltersContainer.innerHTML = categories.map(cat => {
      const isAll = cat === 'all';
      const label = isAll ? 'All Flacons' : cat;
      const isActive = (isAll && this.activeCategory === 'all') || this.activeCategory.toLowerCase() === cat.toLowerCase();

      return `
        <button 
          type="button" 
          class="category-pill ${isActive ? 'active' : ''}" 
          data-category="${cat}"
          onclick="window.customerApp.setCategory('${cat}')"
        >
          ${this.escapeHTML(label)}
        </button>
      `;
    }).join('');
  }

  setCategory(category) {
    this.activeCategory = category;
    this.renderCategoryFilters();
    this.renderProducts();
  }

  resetSearch() {
    this.searchQuery = '';
    this.activeCategory = 'all';
    if (this.searchInput) this.searchInput.value = '';
    if (this.searchClearBtn) this.searchClearBtn.style.display = 'none';
    this.hideAutocomplete();
    this.renderCategoryFilters();
    this.renderProducts();
  }

  // --- CART MANAGEMENT ---
  addToCart(productId, quantity = 1) {
    const success = window.store.addToCart(productId, quantity);
    if (success) {
      const product = window.store.getProductById(productId);
      this.showToast(`Added "${product.name}" to your cart!`, 'success');
      this.openCartDrawer();
    }
  }

  renderCart() {
    const detailedCart = window.store.getCartDetailed();
    const totals = window.store.getCartTotals();

    // Update Badges
    if (this.cartBadge) {
      this.cartBadge.textContent = totals.itemCount;
      this.cartBadge.style.display = totals.itemCount > 0 ? 'flex' : 'none';
    }
    if (this.mobileCartBadge) {
      this.mobileCartBadge.textContent = totals.itemCount;
      this.mobileCartBadge.style.display = totals.itemCount > 0 ? 'inline-flex' : 'none';
    }

    // Subtotal
    if (this.cartSubtotalEl) {
      this.cartSubtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
    }

    // Empty state
    if (detailedCart.length === 0) {
      this.cartItemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <div class="cart-empty-icon">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#9ba1b0" stroke-width="1.2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <h4>Your Flacon Cart is Empty</h4>
          <p>Discover our rare artisanal fragrances and add your signature scent.</p>
          <button class="btn btn-gold" onclick="window.customerApp.closeCartDrawer()">Explore Collection</button>
        </div>
      `;
      if (this.cartCheckoutBtn) {
        this.cartCheckoutBtn.disabled = true;
        this.cartCheckoutBtn.style.opacity = '0.5';
      }
      return;
    }

    if (this.cartCheckoutBtn) {
      this.cartCheckoutBtn.disabled = false;
      this.cartCheckoutBtn.style.opacity = '1';
    }

    // Render items list
    this.cartItemsContainer.innerHTML = detailedCart.map(item => `
      <div class="cart-item" data-id="${item.productId}">
        <img src="${item.product.image}" alt="${this.escapeHTML(item.product.name)}" class="cart-item-image" />
        <div class="cart-item-details">
          <div class="cart-item-header">
            <h4 class="cart-item-title">${this.escapeHTML(item.product.name)}</h4>
            <button 
              class="cart-item-remove-btn" 
              onclick="window.store.removeFromCart('${item.productId}')"
              title="Remove item"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="cart-item-meta">$${(item.product.price || 0).toFixed(2)} each</div>
          
          <div class="cart-item-footer">
            <div class="cart-qty-control">
              <button 
                class="qty-btn" 
                onclick="window.store.updateCartQuantity('${item.productId}', ${item.quantity - 1})"
                aria-label="Decrease quantity"
              >−</button>
              <span class="qty-display">${item.quantity}</span>
              <button 
                class="qty-btn" 
                onclick="window.store.updateCartQuantity('${item.productId}', ${item.quantity + 1})"
                aria-label="Increase quantity"
              >+</button>
            </div>
            <div class="cart-item-total">
              $${(item.quantity * (item.product.price || 0)).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  openCartDrawer() {
    if (this.cartDrawer) this.cartDrawer.classList.add('open');
    if (this.cartOverlay) this.cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeCartDrawer() {
    if (this.cartDrawer) this.cartDrawer.classList.remove('open');
    if (this.cartOverlay) this.cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Checkout via WhatsApp
  handleCartCheckout() {
    const detailed = window.store.getCartDetailed();
    if (!detailed.length) return;

    const totals = window.store.getCartTotals();
    const profile = window.store.getProfile();
    const targetPhone = profile.whatsappNumber || profile.contactNumber || '01617870123';

    // Format clean message for WhatsApp
    let orderMsg = `*NEW ORDER - ${profile.shopName}*\n\n`;
    orderMsg += `Hello Concierge! I would like to place an order for the following fragrance(s):\n\n`;

    detailed.forEach((item, idx) => {
      orderMsg += `${idx + 1}. *${item.product.name}*\n`;
      orderMsg += `   • Quantity: ${item.quantity}\n`;
      orderMsg += `   • Price: $${(item.quantity * item.product.price).toFixed(2)}\n\n`;
    });

    orderMsg += `*Total Order Value:* $${totals.subtotal.toFixed(2)}\n`;
    orderMsg += `*Payment:* Cash on Delivery / Direct Inquiry\n\n`;
    orderMsg += `Please confirm my order and dispatch timeline. Thank you!`;

    // Standard wa.me API format
    // Clean targetPhone (e.g., 01617870123 -> 8801617870123)
    let formattedPhone = targetPhone.replace(/\D/g, '');
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '88' + formattedPhone;
    }

    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(orderMsg)}`;
    window.open(whatsappUrl, '_blank');
  }

  // --- WHATSAPP CONTACT FORM INTEGRATION ---
  // Form with fields: Name, Email, Phone Number, Message.
  // Upon submission, it automatically formats the data and redirects to WhatsApp: "01617870123"
  handleContactSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !phone || !message) {
      alert('Please fill in your Name, Phone Number, and Message.');
      return;
    }

    const profile = window.store.getProfile();
    const targetWhatsApp = profile.whatsappNumber || '01617870123';

    // Format formatted message
    const formattedText = 
      `*INQUIRY - ${profile.shopName}*\n\n` +
      `*Client Name:* ${name}\n` +
      `*Phone Number:* ${phone}\n` +
      `*Email Address:* ${email || 'Not provided'}\n\n` +
      `*Client Message:*\n"${message}"\n\n` +
      `_Sent via AURA NOIR Web Concierge_`;

    let cleanPhone = targetWhatsApp.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '88' + cleanPhone;
    }

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(formattedText)}`;

    // Show visual confirmation
    if (this.contactSuccessMsg) {
      this.contactSuccessMsg.style.display = 'block';
    }

    // Reset form
    this.contactForm.reset();

    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank');
  }

  // Quick View Modal
  openQuickView(productId) {
    const product = window.store.getProductById(productId);
    if (!product) return;

    let modal = document.getElementById('quick-view-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'quick-view-modal';
      modal.className = 'quick-view-modal';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="quick-view-dialog">
        <button class="quick-view-close" onclick="document.getElementById('quick-view-modal').classList.remove('open')">✕</button>
        <div class="quick-view-grid">
          <div class="quick-view-media">
            <img src="${product.image}" alt="${this.escapeHTML(product.name)}" />
          </div>
          <div class="quick-view-info">
            <span class="product-category">${this.escapeHTML(product.category)}</span>
            <h2>${this.escapeHTML(product.name)}</h2>
            <div class="quick-view-price">$${product.price.toFixed(2)}</div>
            <p class="quick-view-desc">${this.escapeHTML(product.description)}</p>
            
            <div class="quick-view-notes">
              <h4>Olfactory Notes & Accord:</h4>
              <p>${this.escapeHTML(product.notes || 'Natural botanicals and rare aromatics.')}</p>
            </div>

            <div class="quick-view-keywords">
              <h4>Fragrance Profile Tags:</h4>
              <div class="keyword-tags-row">
                ${(product.keywords || []).map(k => `<span class="keyword-tag-chip">#${this.escapeHTML(k)}</span>`).join('')}
              </div>
            </div>

            <div class="quick-view-actions">
              <button class="btn btn-gold btn-block" onclick="window.customerApp.addToCart('${product.id}'); document.getElementById('quick-view-modal').classList.remove('open');">
                Add to Cart • $${product.price.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    modal.classList.add('open');
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove('open');
    };
  }

  showToast(message, type = 'info') {
    if (window.showAppToast) {
      window.showAppToast(message, type);
    }
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
window.CustomerApp = CustomerApp;
