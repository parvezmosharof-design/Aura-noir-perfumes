# AURA NOIR Parfums — Modern E-Commerce Application

A bespoke, responsive single-page e-commerce application designed for a startup luxury perfume brand. Built with a rich Obsidian & Champagne Gold aesthetic, featuring separate **Customer** and **Admin** views, an intelligent **Keyword Engine** connected to live auto-suggest search, an isolated **AI Concierge Chatbot**, persistent local storage cart, and WhatsApp integration (`01617870123`).

---

## 🌟 Key Features

### 1. Customer View (Landing Page)
- **Luxury Aesthetic**: Obsidian Black (`#0a0a0d`), Champagne Gold accents (`#d4af37`), and editorial serif typography (*Cormorant Garamond* & *Playfair Display*).
- **Sticky Top Navigation**:
  - Live animated logo mark.
  - Section shortcuts (*Home, Collection, Philosophy, Concierge*).
  - Live Cart button with real-time badge count.
  - Admin Portal shortcut button.
  - Full mobile navigation drawer.
- **Dynamic Search & Auto-Suggest System**:
  - Auto-suggest/autocomplete dropdown pulling directly from keywords defined in the Admin Panel and active product names.
  - Instant filtering across fragrance names, descriptions, notes, and keywords.
- **Flacon Collection & Product Grid**:
  - High-resolution curated perfume bottle photography.
  - Category filters (*Woody & Oriental, Amber & Spices, Floral & Suede, Fresh & Citrus, Gourmand*).
  - Fragrance accord preview badges and star ratings.
  - Quick View details modal.
  - "Add to Cart" with visual toast feedback.
- **Cart Drawer (Persistent LocalStorage)**:
  - Slide-over drawer with backdrop blur.
  - Item counters, quantity increments/decrements, item removal.
  - Live subtotal calculation.
  - **WhatsApp Checkout**: Generates a pre-formatted order summary with item names, quantities, and totals, then redirects directly to WhatsApp (`01617870123`).
- **Contact Form (WhatsApp Integration)**:
  - Fields for *Name, Email, Phone Number, and Message*.
  - Automatically formats the inquiry and redirects to WhatsApp (`01617870123`) using the `wa.me` API.

---

### 2. Isolated Floating Chatbot (`/chatbot`)
- **Modular Isolation**: Completely separated in its own directory (`chatbot/chatbot.js` and `chatbot/chatbot.css`).
- **Luxury Concierge UI**: Floating circular launcher with gold glow, badge indicator, and glassmorphic chat window.
- **5 Preset Q&A Quick Buttons**:
  1. *🔥 Best selling perfumes?*
  2. *📦 Shipping policies & delivery time?*
  3. *⏳ How long does the scent last (longevity)?*
  4. *💬 Can I order via WhatsApp?*
  5. *✨ How to choose my signature scent?*
- **Smart Intent Matching**: Intelligent auto-replies for price queries, shipping, longevity, notes, and direct WhatsApp links.

---

### 3. Admin Panel (Separate View)
- **Secure Authentication**:
  - **Phone / Username**: `01617870123`
  - **Password**: `123456`
  - Session stored securely in `sessionStorage`.
- **Product Management**:
  - Add new perfumes or edit existing flacons.
  - Fields: *Perfume Name, Price, Category, Image URL / Quick Presets / File Upload, Olfactory Notes Accord, Description, and Keywords*.
  - Full inventory table with edit and delete capabilities.
- **Keyword Engine (Critical Feature)**:
  - Adding a perfume name automatically tags it as a searchable keyword.
  - Product keywords are dynamically registered into the system.
  - Admin can add predefined standalone keywords (e.g. *amber, oud, vanilla, extrait*).
  - Active keyword tag cloud with instant delete options.
  - Directly feeds the customer search autocomplete dropdown in real-time.
- **Store Profile Management**:
  - Edit *Shop Name, Owner Name, Contact Phone, WhatsApp Number, Email, Tagline, and Atelier Address*.
  - Real-time synchronization across all storefront banners, headers, footers, and contact forms.

---

## 📁 Project Structure

```
d:\e commerce WEb site\
├── index.html                  # Single-Page Application (Customer & Admin views)
├── package.json                # Project configuration and local dev scripts
├── README.md                   # Complete documentation
├── images/
│   ├── logo.png                # Official brand crest logo (Haute Parfumerie emblem)
│   └── logo.jpg                # High-resolution master asset
├── css/
│   ├── style.css               # Luxury Obsidian & Champagne Gold design system
│   └── responsive.css          # 100% mobile, tablet & desktop optimization
├── js/
│   ├── store.js                # Central state manager (LocalStorage, seed data, keywords)
│   ├── customer.js             # Customer view, search autocomplete, cart & WhatsApp
│   ├── admin.js                # Admin panel, auth, product CRUD & Keyword Engine
│   └── app.js                  # Main coordinator, routing & toast notifications
└── chatbot/
    ├── chatbot.js              # Modular isolated concierge logic & preset Q&As
    └── chatbot.css             # Chatbot UI styling & animations
```

---

## 🚀 How to Run Locally

1. Open a terminal in the project directory:
   ```bash
   cd "d:\e commerce WEb site"
   ```
2. Start the local server:
   ```bash
   npm run dev
   # or: npx serve -s -l 3000 .
   ```
3. Open your browser and navigate to:
   **[http://localhost:3000](http://localhost:3000)**

---

## 🔑 Default Preset Admin Credentials
- **Username / Phone**: `01617870123`
- **Password**: `123456`
