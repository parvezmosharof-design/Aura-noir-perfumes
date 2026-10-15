/**
 * AURA NOIR PARFUMS - Central State Management Store
 * Handles LocalStorage persistence, reactive events, and initial seed data.
 */

const STORAGE_KEYS = {
  PRODUCTS: 'auranoir_products_v1',
  KEYWORDS: 'auranoir_keywords_v1',
  PROFILE: 'auranoir_profile_v1',
  CART: 'auranoir_cart_v1',
  AUTH: 'auranoir_admin_auth_v1'
};

// Default Seed Products
const DEFAULT_PRODUCTS = [
  {
    id: 'prod_1',
    name: 'Oud Royale Extrait',
    category: 'Woody & Oriental',
    price: 185.00,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    description: 'Rare Cambodian agarwood infused with dark Damask rose, smoky amber resin, and rich Madagascan bourbon vanilla.',
    notes: 'Top: Bergamot, Rose | Heart: Pure Oud, Frankincense | Base: Leather, Amber, Vanilla',
    keywords: ['oud', 'royale', 'woody', 'oriental', 'agarwood', 'rose', 'luxury', 'intense', 'smoky'],
    featured: true,
    rating: 4.9,
    reviewsCount: 128
  },
  {
    id: 'prod_2',
    name: 'Amber Santal Nectar',
    category: 'Amber & Warm Spices',
    price: 145.00,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
    description: 'Creamy Australian sandalwood embraced by glowing golden amber, spicy cardamom pod, and warm tonka bean silkiness.',
    notes: 'Top: Cardamom, Cinnamon | Heart: Mysore Sandalwood, Iris | Base: Amber Nectar, Tonka, Musk',
    keywords: ['amber', 'santal', 'sandalwood', 'warm', 'spicy', 'creamy', 'winter', 'cardamom'],
    featured: true,
    rating: 4.8,
    reviewsCount: 94
  },
  {
    id: 'prod_3',
    name: 'Velvet Rose & Saffron',
    category: 'Floral & Spiced Leather',
    price: 160.00,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    description: 'Sensual Turkish crimson roses hand-picked at dawn, laced with fiery Kashmiri saffron and wrapped in soft velvet suede.',
    notes: 'Top: Kashmiri Saffron, Pink Pepper | Heart: Turkish Rose Absolute | Base: Velvet Suede, Patchouli',
    keywords: ['velvet', 'rose', 'saffron', 'floral', 'romantic', 'spiced', 'elegant', 'date night'],
    featured: true,
    rating: 5.0,
    reviewsCount: 156
  },
  {
    id: 'prod_4',
    name: 'Soleil D\'Or Elixir',
    category: 'Fresh & Golden Citrus',
    price: 135.00,
    image: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80',
    description: 'A radiant burst of Mediterranean blood orange and Calabrian neroli kissed by sunny solar ambroxan and cedarwood.',
    notes: 'Top: Blood Orange, Neroli | Heart: Orange Blossom, Jasmine | Base: White Musk, Cedarwood',
    keywords: ['soleil', 'citrus', 'fresh', 'neroli', 'summer', 'daywear', 'uplifting', 'golden'],
    featured: false,
    rating: 4.7,
    reviewsCount: 82
  },
  {
    id: 'prod_5',
    name: 'Noir Leather Intense',
    category: 'Leather & Smoky Wood',
    price: 175.00,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    description: 'A bold, aristocratic blend of Tuscan black leather, birch tar smoke, black violet, and dark vetiver roots.',
    notes: 'Top: Black Violet, Cardamom | Heart: Tuscan Leather, Orris | Base: Birch Tar, Vetiver, Oakmoss',
    keywords: ['noir', 'leather', 'intense', 'smoky', 'bold', 'masculine', 'evening', 'birch'],
    featured: true,
    rating: 4.9,
    reviewsCount: 110
  },
  {
    id: 'prod_6',
    name: 'Midnight Bergamot',
    category: 'Aromatic & Fresh Woods',
    price: 130.00,
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
    description: 'Crisp bergamot peel kissed by cold night air, sparkling aquatic driftwood, cracked sea salt, and aromatic clary sage.',
    notes: 'Top: Sparkling Bergamot, Sea Salt | Heart: Clary Sage, Lavender | Base: Driftwood, White Amber',
    keywords: ['midnight', 'bergamot', 'fresh', 'aquatic', 'aromatic', 'citrus', 'clean'],
    featured: false,
    rating: 4.8,
    reviewsCount: 76
  },
  {
    id: 'prod_7',
    name: 'Jasmin Impérial',
    category: 'Floral & White Musks',
    price: 155.00,
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80',
    description: 'Luminous nocturnal jasmine sambac intertwined with Madagascar ylang-ylang, powdery heliotrope, and cashmere silk.',
    notes: 'Top: Mandarin, Petitgrain | Heart: Sambac Jasmine, Ylang-Ylang | Base: Cashmere Musk, Sandalwood',
    keywords: ['jasmin', 'imperial', 'floral', 'jasmine', 'white musk', 'luxurious', 'spring'],
    featured: false,
    rating: 4.9,
    reviewsCount: 89
  },
  {
    id: 'prod_8',
    name: 'Smoky Vanilla Wood',
    category: 'Gourmand & Woody',
    price: 165.00,
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=800&q=80',
    description: 'Smoked vanilla bean soaked in dark rum barrels, grounded by charred cedar, toasted hazelnut, and golden benzoin.',
    notes: 'Top: Dark Rum, Nutmeg | Heart: Bourbon Vanilla, Toasted Hazelnut | Base: Charred Cedar, Benzoin',
    keywords: ['vanilla', 'smoky', 'gourmand', 'wood', 'sweet', 'cozy', 'rum', 'cedar'],
    featured: true,
    rating: 4.9,
    reviewsCount: 142
  }
];

// Initial Standalone Keywords
const DEFAULT_KEYWORDS = [
  'oud', 'vanilla', 'sandalwood', 'rose', 'luxury', 'amber', 
  'citrus', 'leather', 'bergamot', 'woody', 'long lasting', 
  'eau de parfum', 'oriental', 'fresh', 'floral', 'gourmand',
  'musk', 'saffron', 'summer', 'evening', 'extrait'
];

// Default Profile
const DEFAULT_PROFILE = {
  shopName: 'AURA NOIR Parfums',
  ownerName: 'Parvez Mosharof',
  contactNumber: '01617870123',
  whatsappNumber: '01617870123',
  email: 'concierge@auranoirparfums.com',
  tagline: 'Artisanal Haute Parfumerie & Timeless Niche Fragrances',
  address: 'Gulshan Avenue, Dhaka, Bangladesh',
  currency: '$'
};

class Store {
  constructor() {
    this.init();
  }

  init() {
    // Seed products if not existing
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
    }

    // Seed standalone keywords if not existing
    if (!localStorage.getItem(STORAGE_KEYS.KEYWORDS)) {
      // Collect product names as default keywords as well
      const productKeywords = DEFAULT_PRODUCTS.flatMap(p => [
        p.name.toLowerCase(),
        ...p.keywords.map(k => k.toLowerCase())
      ]);
      const initialKeywords = Array.from(new Set([...DEFAULT_KEYWORDS, ...productKeywords]));
      localStorage.setItem(STORAGE_KEYS.KEYWORDS, JSON.stringify(initialKeywords));
    }

    // Seed profile if not existing
    if (!localStorage.getItem(STORAGE_KEYS.PROFILE)) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
    }

    // Seed cart if not existing
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
  }

  // --- PRODUCTS ---
  getProducts() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
    } catch (e) {
      console.error('Failed to parse products', e);
      return [];
    }
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  }

  addProduct(productData) {
    const products = this.getProducts();
    const newId = 'prod_' + Date.now();
    
    // Parse keywords input
    let keywordsArray = [];
    if (Array.isArray(productData.keywords)) {
      keywordsArray = productData.keywords;
    } else if (typeof productData.keywords === 'string') {
      keywordsArray = productData.keywords
        .split(',')
        .map(k => k.trim().toLowerCase())
        .filter(k => k.length > 0);
    }

    const newProduct = {
      id: newId,
      name: productData.name.trim(),
      category: productData.category || 'Niche Fragrance',
      price: parseFloat(productData.price) || 0,
      image: productData.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      description: productData.description || '',
      notes: productData.notes || 'Curated Artisanal Notes',
      keywords: keywordsArray,
      featured: Boolean(productData.featured),
      rating: 5.0,
      reviewsCount: 1
    };

    products.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    // KEYWORD ENGINE REQUIREMENT:
    // When an admin adds a perfume name, it should automatically be tagged as a keyword.
    // Also, all product keywords must be dynamically saved to the system.
    this.registerKeywords([
      newProduct.name.toLowerCase(),
      ...keywordsArray
    ]);

    this.dispatchUpdate('products');
    return newProduct;
  }

  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;

    let keywordsArray = products[index].keywords;
    if (updatedFields.keywords !== undefined) {
      if (Array.isArray(updatedFields.keywords)) {
        keywordsArray = updatedFields.keywords;
      } else if (typeof updatedFields.keywords === 'string') {
        keywordsArray = updatedFields.keywords
          .split(',')
          .map(k => k.trim().toLowerCase())
          .filter(k => k.length > 0);
      }
    }

    products[index] = {
      ...products[index],
      ...updatedFields,
      price: updatedFields.price !== undefined ? parseFloat(updatedFields.price) : products[index].price,
      keywords: keywordsArray
    };

    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

    // Register any updated keywords including perfume name
    this.registerKeywords([
      products[index].name.toLowerCase(),
      ...keywordsArray
    ]);

    this.dispatchUpdate('products');
    return products[index];
  }

  deleteProduct(id) {
    const products = this.getProducts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    
    // Automatically purge deleted item from cart
    const cart = this.getCart().filter(item => item.productId !== id);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    
    this.dispatchUpdate('products');
    this.dispatchUpdate('cart');
  }

  // --- KEYWORD ENGINE ---
  getAllKeywords() {
    try {
      const standalone = JSON.parse(localStorage.getItem(STORAGE_KEYS.KEYWORDS)) || [];
      // Combine with all product names and product keywords dynamically
      const products = this.getProducts();
      const productKeywords = products.flatMap(p => [
        p.name.toLowerCase(),
        ...(p.keywords || []).map(k => k.toLowerCase())
      ]);

      const merged = Array.from(new Set([...standalone, ...productKeywords]))
        .map(k => k.trim().toLowerCase())
        .filter(k => k.length > 0);

      return merged.sort();
    } catch (e) {
      console.error('Failed to get keywords', e);
      return [];
    }
  }

  getStandaloneKeywords() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.KEYWORDS)) || [];
    } catch (e) {
      return [];
    }
  }

  registerKeywords(newKeywords) {
    const existing = this.getStandaloneKeywords().map(k => k.toLowerCase());
    const toAdd = newKeywords
      .map(k => k.trim().toLowerCase())
      .filter(k => k.length > 0 && !existing.includes(k));

    if (toAdd.length > 0) {
      const updated = [...existing, ...toAdd];
      localStorage.setItem(STORAGE_KEYS.KEYWORDS, JSON.stringify(updated));
      this.dispatchUpdate('keywords');
    }
  }

  addStandaloneKeyword(keyword) {
    const clean = keyword.trim().toLowerCase();
    if (!clean) return false;
    const existing = this.getStandaloneKeywords().map(k => k.toLowerCase());
    if (!existing.includes(clean)) {
      existing.push(clean);
      localStorage.setItem(STORAGE_KEYS.KEYWORDS, JSON.stringify(existing));
      this.dispatchUpdate('keywords');
      return true;
    }
    return false;
  }

  deleteKeyword(keywordToDelete) {
    const clean = keywordToDelete.trim().toLowerCase();
    
    // 1. Remove from standalone keywords
    const existing = this.getStandaloneKeywords().map(k => k.toLowerCase());
    const filtered = existing.filter(k => k !== clean);
    localStorage.setItem(STORAGE_KEYS.KEYWORDS, JSON.stringify(filtered));

    // 2. Also clean from products keywords array to guarantee complete deletion
    const products = this.getProducts();
    let modified = false;
    products.forEach(p => {
      if (p.keywords && p.keywords.some(k => k.toLowerCase() === clean)) {
        p.keywords = p.keywords.filter(k => k.toLowerCase() !== clean);
        modified = true;
      }
    });
    if (modified) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
      this.dispatchUpdate('products');
    }

    this.dispatchUpdate('keywords');
  }

  // --- PROFILE MANAGEMENT ---
  getProfile() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROFILE)) || DEFAULT_PROFILE;
    } catch (e) {
      return DEFAULT_PROFILE;
    }
  }

  updateProfile(profileData) {
    const current = this.getProfile();
    const updated = {
      ...current,
      ...profileData
    };
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    this.dispatchUpdate('profile');
    return updated;
  }

  // --- CART MANAGEMENT ---
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    } catch (e) {
      return [];
    }
  }

  addToCart(productId, quantity = 1) {
    const product = this.getProductById(productId);
    if (!product) return false;

    const cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.productId === productId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        productId,
        quantity,
        addedAt: Date.now()
      });
    }

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.dispatchUpdate('cart');
    return true;
  }

  updateCartQuantity(productId, quantity) {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(item => item.productId !== productId);
    } else {
      const item = cart.find(item => item.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.dispatchUpdate('cart');
  }

  removeFromCart(productId) {
    const cart = this.getCart().filter(item => item.productId !== productId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.dispatchUpdate('cart');
  }

  clearCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    this.dispatchUpdate('cart');
  }

  getCartDetailed() {
    const cart = this.getCart();
    const products = this.getProducts();

    // Cleanly map existing products and ignore stale deleted IDs
    return cart
      .filter(item => products.some(p => p.id === item.productId))
      .map(item => {
        const prod = products.find(p => p.id === item.productId);
        return {
          ...item,
          product: prod
        };
      });
  }

  getCartTotals() {
    const detailed = this.getCartDetailed();
    const itemCount = detailed.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = detailed.reduce((acc, item) => acc + (item.quantity * (item.product.price || 0)), 0);
    return {
      itemCount,
      subtotal
    };
  }

  // --- AUTH MANAGEMENT ---
  // Default preset credentials -> Username/Phone: "01617870123", Password: "123456"
  login(usernameOrPhone, password) {
    const trimmedUser = (usernameOrPhone || '').trim().replace(/[\s\-\(\)]/g, '');
    const trimmedPass = (password || '').trim();

    // Support 01617870123, +8801617870123, 8801617870123
    const isUserValid = (
      trimmedUser === '01617870123' || 
      trimmedUser === '8801617870123' || 
      trimmedUser === '+8801617870123'
    );

    if (isUserValid && trimmedPass === '123456') {
      const session = {
        authenticated: true,
        user: '01617870123',
        loginTime: Date.now()
      };
      sessionStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
      this.dispatchUpdate('auth');
      return true;
    }
    return false;
  }

  logout() {
    sessionStorage.removeItem(STORAGE_KEYS.AUTH);
    this.dispatchUpdate('auth');
  }

  isAuthenticated() {
    try {
      const session = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.AUTH));
      return Boolean(session && session.authenticated);
    } catch (e) {
      return false;
    }
  }

  // Reactive Event Dispatcher
  dispatchUpdate(type) {
    const event = new CustomEvent('store:updated', { detail: { type } });
    window.dispatchEvent(event);
  }
}

// Global Store Instance
window.store = new Store();
