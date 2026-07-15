<div align="center">
  
  # 🍣 CartKoi
  
  **The ultimate platform connecting local food carts with hungry customers.**
  
  ![UI Design](https://img.shields.io/badge/UI-Glassmorphism-blue)
  ![Stack](https://img.shields.io/badge/Stack-Next.js%20|%20Supabase-black)
  ![License](https://img.shields.io/badge/License-MIT-green)
  
</div>

<br/>

## 📖 About CartKoi

Food carts are a beloved part of local communities, but they suffer from one major problem: **discoverability**. Because they move around, customers never know exactly where they are or if they are open.

**CartKoi** solves this by providing a premium, centralized platform where:
- **Food Cart Owners** can instantly update their live location, status, and menu.
- **Employees** can securely log in to help manage stock and location without needing owner credentials.
- **Customers** can explore a live, interactive map to discover nearby food carts, view menus, see operating hours, and calculate exactly how far away they are.

---

## ✨ Key Features

### 🗺️ For Customers (Discovery)
- **Live Interactive Map:** Find open food carts near you instantly using Leaflet.js.
- **Real-Time Distance Calculation:** CartKoi uses the Haversine formula to compute exactly how far away a food cart is based on your device's GPS.
- **Advanced Filtering & Search:** Client-side, ultra-fast search functionality to instantly filter carts by name or "Open Now" status.
- **Reviews & Ratings:** Leave reviews and see community ratings before you visit.
- **Native Sharing:** One-click Web Share API integration to easily send cart locations to friends via WhatsApp, Messenger, or Twitter.

### 🏢 For Food Cart Owners (Management)
- **Role-Based Access Control (RBAC):** Secure Supabase Auth ensures owners have full control over their business.
- **Dynamic Dashboard:** Update menus, toggle availability, and set daily operating hours effortlessly.
- **Client-Side Image Compression:** Zero-dependency, hardware-accelerated image compression (via HTML5 Canvas) ensures that when owners upload 5MB camera photos, they are squashed to ~100KB before uploading, saving massive bandwidth and making the app lightning fast.

### 🧑‍🍳 For Employees (Operations)
- **Secure Join System:** Employees can join a cart's management team using a secure 6-character Invite Code.
- **Operational Control:** Employees can update the cart's live GPS location and mark items as "Sold Out" on the fly, without needing access to the owner's financial settings.

---

## 🎨 Design & Architecture

CartKoi is built with a premium, state-of-the-art **Glassmorphism** aesthetic. We bypassed heavy UI frameworks (like Material UI or Chakra) in favor of raw **Tailwind CSS** to create a custom, lightweight, and visually stunning design system.

- **Dynamic Animations:** Powered by `framer-motion` for smooth page transitions, floating map headers, and beautiful micro-interactions.
- **Perceived Performance:** Implementation of custom Skeleton Loading screens (similar to YouTube/Facebook) rather than generic spinners, making the app feel instantaneously responsive.
- **Responsive:** Fluidly scales from the smallest iPhones to large desktop monitors.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Framer Motion
- **Backend/Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (Magic Links & Email/Password)
- **Storage:** Supabase Storage with Row Level Security (RLS)
- **Mapping:** React-Leaflet (Leaflet.js)

---

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cartkoi.git
   cd cartkoi/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env.local` file in the `client` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
