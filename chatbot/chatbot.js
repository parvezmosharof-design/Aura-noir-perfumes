/**
 * ===================================================================
 * AURA NOIR PARFUMS - ISOLATED CONCIERGE CHATBOT
 * Modular AI Chatbot component with preset Q&As and smart replies
 * ===================================================================
 */

(function () {
  'use strict';

  // Preset Questions & Answers
  const PRESET_KNOWLEDGE = [
    {
      id: 'bestsellers',
      label: '🔥 Best selling perfumes?',
      question: 'What are your best selling perfumes?',
      answer: `Our most acclaimed signatures are:<br><br>
      • <strong>Oud Royale Extrait ($185)</strong> - Rare Cambodian agarwood with Damask rose and dark bourbon vanilla.<br>
      • <strong>Velvet Rose & Saffron ($160)</strong> - Crimson Turkish roses with fiery Kashmiri saffron and suede.<br>
      • <strong>Amber Santal Nectar ($145)</strong> - Australian creamy sandalwood & golden amber elixir.<br>
      • <strong>Noir Leather Intense ($175)</strong> - Tuscan black leather and birch smoke.<br><br>
      You can filter and view each in our collection grid above!`
    },
    {
      id: 'shipping',
      label: '📦 Shipping & Delivery?',
      question: 'What are your shipping policies and delivery time?',
      answer: `We provide insured express shipping for all luxury flacons:<br><br>
      • <strong>Local City Delivery:</strong> 24 to 48 Hours.<br>
      • <strong>Nationwide Shipping:</strong> 2 to 3 Business Days.<br>
      • <strong>Cash on Delivery (COD):</strong> Available upon checkout!<br>
      • <strong>Packaging:</strong> Each perfume arrives cushioned in bespoke velvet magnetic hard-boxes.`
    },
    {
      id: 'longevity',
      label: '⏳ Scent Longevity & Strength?',
      question: 'How long do your perfumes last on skin and fabric?',
      answer: `All AURA NOIR creations are formulated at <strong>Extrait de Parfum (30-35% concentration)</strong> and high-grade Eau de Parfum.<br><br>
      • <strong>Skin Longevity:</strong> 12 to 18+ hours.<br>
      • <strong>On Clothes / Fabric:</strong> Up to 48 hours.<br>
      • <strong>Sillage:</strong> Strong, intoxicating scent trail that leaves an unforgettable impression without being overpowering.`
    },
    {
      id: 'whatsapp_order',
      label: '💬 Can I order via WhatsApp?',
      question: 'Can I place an order directly on WhatsApp?',
      answer: `<strong>Absolutely!</strong> We specialize in personal concierge ordering via WhatsApp.<br><br>
      You can add items to your cart and checkout directly, or reach our concierge directly at: <br>
      <a href="https://wa.me/8801617870123?text=Hello%20AURA%20NOIR%20Parfums,%20I%20would%20like%20to%20inquire%20about%20ordering%20a%20perfume" target="_blank" style="color:#8a640e; font-weight:700;">
        📱 WhatsApp Concierge: 01617870123
      </a>.<br>
      Our team is available 24/7 to assist with your order.`
    },
    {
      id: 'recommendation',
      label: '✨ How to choose my scent?',
      question: 'How do I choose the best perfume for my personality?',
      answer: `Here is our master perfumer's quick guide:<br><br>
      • <strong>If you love bold, mysterious, & evening wear:</strong> Choose <em>Oud Royale</em> or <em>Noir Leather</em>.<br>
      • <strong>If you love romantic, sweet, & warm:</strong> Choose <em>Velvet Rose & Saffron</em> or <em>Amber Santal</em>.<br>
      • <strong>If you love fresh, vibrant, & daytime:</strong> Choose <em>Soleil D'Or</em> or <em>Midnight Bergamot</em>.<br>
      • <strong>If you love comforting luxury:</strong> Choose <em>Smoky Vanilla Wood</em>.`
    }
  ];

  class AuraChatbot {
    constructor() {
      this.isOpen = false;
      this.hasInteracted = false;
      this.init();
    }

    init() {
      this.createChatbotDOM();
      this.bindEvents();
      this.renderPresets();
      this.sendInitialGreeting();
    }

    createChatbotDOM() {
      // Launcher Button
      const launcher = document.createElement('div');
      launcher.id = 'chatbot-launcher';
      launcher.className = 'chatbot-launcher';
      launcher.setAttribute('aria-label', 'Open Concierge Chat');
      launcher.innerHTML = `
        <svg class="launcher-icon launcher-icon-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        <svg class="launcher-icon launcher-icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
        <span class="chatbot-badge" id="chatbot-badge">1</span>
      `;

      // Window Container
      const windowEl = document.createElement('div');
      windowEl.id = 'chatbot-window';
      windowEl.className = 'chatbot-window';
      windowEl.innerHTML = `
        <div class="chatbot-header">
          <div class="chatbot-header-info">
            <div class="chatbot-avatar">AN</div>
            <div class="chatbot-title">
              <h4>AURA NOIR Concierge</h4>
              <div class="chatbot-status">
                <span class="chatbot-status-dot"></span> Online • Fragrance Advisor
              </div>
            </div>
          </div>
          <button class="chatbot-close-btn" id="chatbot-close-btn" aria-label="Close Chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="chatbot-messages" id="chatbot-messages"></div>

        <div class="chatbot-presets-wrapper">
          <div class="chatbot-presets-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            Instant Questions:
          </div>
          <div class="chatbot-presets-container" id="chatbot-presets-container"></div>
        </div>

        <form class="chatbot-input-form" id="chatbot-form">
          <input 
            type="text" 
            class="chatbot-input" 
            id="chatbot-input" 
            placeholder="Ask about perfumes, notes, orders..." 
            autocomplete="off"
            aria-label="Ask concierge"
          />
          <button type="submit" class="chatbot-send-btn" id="chatbot-send-btn" aria-label="Send Message">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      `;

      document.body.appendChild(launcher);
      document.body.appendChild(windowEl);

      this.launcher = launcher;
      this.windowEl = windowEl;
      this.messagesEl = document.getElementById('chatbot-messages');
      this.presetsContainer = document.getElementById('chatbot-presets-container');
      this.form = document.getElementById('chatbot-form');
      this.input = document.getElementById('chatbot-input');
      this.badge = document.getElementById('chatbot-badge');
      this.closeBtn = document.getElementById('chatbot-close-btn');
    }

    bindEvents() {
      this.launcher.addEventListener('click', () => this.toggleChat());
      this.closeBtn.addEventListener('click', () => this.toggleChat(false));

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = this.input.value.trim();
        if (text) {
          this.handleUserMessage(text);
          this.input.value = '';
        }
      });
    }

    renderPresets() {
      this.presetsContainer.innerHTML = '';
      PRESET_KNOWLEDGE.forEach(preset => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'chatbot-preset-btn';
        btn.innerHTML = preset.label;
        btn.addEventListener('click', () => {
          this.handlePresetClick(preset);
        });
        this.presetsContainer.appendChild(btn);
      });
    }

    toggleChat(forceState = null) {
      this.isOpen = forceState !== null ? forceState : !this.isOpen;

      if (this.isOpen) {
        this.windowEl.classList.add('open');
        this.launcher.classList.add('active');
        if (this.badge) this.badge.style.display = 'none';
        setTimeout(() => this.input.focus(), 250);
      } else {
        this.windowEl.classList.remove('open');
        this.launcher.classList.remove('active');
      }
    }

    sendInitialGreeting() {
      const shopName = window.store ? window.store.getProfile().shopName : 'AURA NOIR Parfums';
      setTimeout(() => {
        this.addBotMessage(
          `Greetings! Welcome to <strong>${shopName}</strong>.<br><br>` +
          `I am your personal Haute Parfumerie Concierge. How may I assist your olfactory journey today? You can choose one of the quick questions below or type anything directly!`
        );
      }, 400);
    }

    handlePresetClick(preset) {
      this.addUserMessage(preset.question);
      this.showTypingIndicator();

      setTimeout(() => {
        this.removeTypingIndicator();
        this.addBotMessage(preset.answer);
      }, 650);
    }

    handleUserMessage(userText) {
      this.addUserMessage(userText);
      this.showTypingIndicator();

      setTimeout(() => {
        this.removeTypingIndicator();
        const reply = this.generateSmartReply(userText);
        this.addBotMessage(reply);
      }, 750);
    }

    generateSmartReply(query) {
      const q = query.toLowerCase();

      // Check if querying perfumes
      const products = window.store ? window.store.getProducts() : [];
      const matchedProd = products.find(p => 
        q.includes(p.name.toLowerCase()) || 
        (p.keywords && p.keywords.some(k => q.includes(k.toLowerCase())))
      );

      if (matchedProd) {
        return `We have <strong>${matchedProd.name}</strong> ($${matchedProd.price.toFixed(2)})!<br><br>` +
               `<em>${matchedProd.description}</em><br><br>` +
               `<strong>Olfactory Notes:</strong> ${matchedProd.notes || 'Curated luxury essence'}.<br><br>` +
               `<button onclick="window.customerApp && window.customerApp.addToCart('${matchedProd.id}')" style="background:linear-gradient(135deg, #dfc06a, #b88e28); color:#1a1712; border:none; padding:7px 15px; border-radius:14px; font-weight:700; cursor:pointer; font-size:12.5px; margin-top:6px; box-shadow:0 3px 10px rgba(184, 142, 40, 0.28);">Add to Cart ($${matchedProd.price.toFixed(2)})</button>`;
      }

      // Check price / cost
      if (q.includes('price') || q.includes('cost') || q.includes('range') || q.includes('how much')) {
        return `Our artisanal handcrafted creations range from <strong>$130 to $185</strong> depending on the concentration and rarity of natural absolutes (Oud, Saffron, Damask Rose). Each bottle comes in a luxury presentation box!`;
      }

      // Check shipping / delivery / COD
      if (q.includes('shipping') || q.includes('delivery') || q.includes('cod') || q.includes('cash on delivery') || q.includes('location')) {
        return PRESET_KNOWLEDGE.find(p => p.id === 'shipping').answer;
      }

      // Check longevity / stay / long lasting
      if (q.includes('long') || q.includes('last') || q.includes('stay') || q.includes('projection') || q.includes('sillage')) {
        return PRESET_KNOWLEDGE.find(p => p.id === 'longevity').answer;
      }

      // Check WhatsApp / contact / order / phone
      if (q.includes('whatsapp') || q.includes('phone') || q.includes('call') || q.includes('order') || q.includes('buy') || q.includes('contact')) {
        const phone = window.store ? window.store.getProfile().contactNumber : '01617870123';
        return `You can order directly through our website cart or message our concierge on WhatsApp at <strong>${phone}</strong>.<br><br>` +
               `<a href="https://wa.me/8801617870123?text=Hi,%20I%20would%20like%20to%20order%20from%20AURA%20NOIR" target="_blank" style="display:inline-block; background:#25D366; color:#fff; padding:6px 14px; border-radius:18px; font-size:12px; font-weight:700; text-decoration:none; margin-top:4px;">Chat on WhatsApp 💬</a>`;
      }

      // Check samples / tester
      if (q.includes('sample') || q.includes('discovery') || q.includes('tester')) {
        return `Every bottle order comes with <strong>2 complimentary 3ml discovery vials</strong> of our other private blends so you can experience our full collection with peace of mind!`;
      }

      // Check original / authentic / ingredients
      if (q.includes('original') || q.includes('authentic') || q.includes('genuine') || q.includes('pure')) {
        return `All our perfumes are 100% authentic, hand-blended in small micro-batches using natural French & Grasse perfume absolutes, sustainable Cambodian oud, and pure plant essences.`;
      }

      // Default Fallback
      return `Thank you for your message! Our master concierge is also available directly via WhatsApp at <strong>01617870123</strong> for personalized fragrance consultations.<br><br>` +
             `You can also browse our top blends or use the search bar above to explore by scent notes like <em>Oud, Amber, Vanilla, or Rose</em>.`;
    }

    addUserMessage(text) {
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble user';
      bubble.innerHTML = `${this.escapeHTML(text)}<div class="chat-timestamp">${this.getCurrentTime()}</div>`;
      this.messagesEl.appendChild(bubble);
      this.scrollToBottom();
    }

    addBotMessage(html) {
      const bubble = document.createElement('div');
      bubble.className = 'chat-bubble bot';
      bubble.innerHTML = `${html}<div class="chat-timestamp">${this.getCurrentTime()}</div>`;
      this.messagesEl.appendChild(bubble);
      this.scrollToBottom();
    }

    showTypingIndicator() {
      const indicator = document.createElement('div');
      indicator.className = 'typing-indicator';
      indicator.id = 'typing-indicator';
      indicator.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      `;
      this.messagesEl.appendChild(indicator);
      this.scrollToBottom();
    }

    removeTypingIndicator() {
      const indicator = document.getElementById('typing-indicator');
      if (indicator) indicator.remove();
    }

    scrollToBottom() {
      this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
    }

    getCurrentTime() {
      const now = new Date();
      return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    escapeHTML(str) {
      return str.replace(/[&<>'"]/g, 
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

  // Initialize Chatbot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.auraChatbot = new AuraChatbot();
    });
  } else {
    window.auraChatbot = new AuraChatbot();
  }
})();
