<div align="center">
  
  # 🍣 CartKoi
  
  **The ultimate platform connecting local food carts with hungry customers.**
  
  [![UI Design](https://img.shields.io/badge/UI-Glassmorphism-blue?style=for-the-badge)](https://tailwindcss.com/)
  [![Stack](https://img.shields.io/badge/Stack-Next.js%20|%20Supabase-black?style=for-the-badge)](https://nextjs.org/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
  
</div>

<br/>

## 📖 About CartKoi

Food carts are a beloved part of local communities, but they suffer from one major problem: **discoverability**. Because they move around, customers never know exactly where they are or if they are open.

**CartKoi** solves this by providing a premium, centralized platform where:
- 🧑‍💼 **Food Cart Owners** can instantly update their live location, status, and rich menu descriptions.
- 🧑‍🍳 **Employees** can securely log in to help manage stock and location without needing owner credentials.
- 🍔 **Customers** can explore a live, interactive map to discover nearby food carts, view menus, see operating hours, and calculate exactly how far away they are.

---

## ✨ Key Features

### 🗺️ For Customers (Discovery)
- **Live Interactive Map:** Find open food carts near you instantly using Leaflet.js.
- **Real-Time Distance Calculation:** CartKoi uses the Haversine formula to compute exactly how far away a food cart is based on your device's GPS.
- **Advanced Filtering & Search:** Client-side, ultra-fast search functionality to instantly filter carts by name or "Open Now" status.
- **Reviews & Ratings:** Leave reviews and see community ratings before you visit.
- **Native Sharing & Socials:** One-click Web Share API integration to easily send cart locations. Connect directly with the carts via their dynamic Foodpanda, Facebook, and Instagram links.

### 🏢 For Food Cart Owners (Management)
- **Role-Based Access Control (RBAC):** Secure Supabase Auth ensures owners have full control over their business.
- **Dynamic Dashboard:** Update menus, add food descriptions, toggle availability, and set daily operating hours effortlessly.
- **Client-Side Image Compression:** Zero-dependency, hardware-accelerated image compression (via HTML5 Canvas) ensures that when owners upload 5MB camera photos, they are squashed to ~100KB before uploading, saving massive bandwidth and making the app lightning fast.

### 🧑‍🍳 For Employees (Operations)
- **Secure Join System:** Employees can join a cart's management team using a secure 6-character Invite Code.
- **Operational Control:** Employees can update the cart's live GPS location and mark items as "Sold Out" on the fly, without needing access to the owner's financial settings.

---

## 🎨 Design & Architecture

CartKoi is built with a premium, state-of-the-art **Glassmorphism** aesthetic. We bypassed heavy UI frameworks (like Material UI or Chakra) in favor of raw **Tailwind CSS** to create a custom, lightweight, and visually stunning design system.

- **Dynamic Animations:** Powered by `framer-motion` for smooth page transitions, floating map headers, and beautiful micro-interactions.
- **Perceived Performance:** Implementation of custom Skeleton Loading screens rather than generic spinners, making the app feel instantaneously responsive.
- **Mobile First & Responsive:** Fluidly scales from the smallest iPhones to large desktop monitors.

---

## 🛠️ Tech Stack

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet" />
</div>

<br/>

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, Framer Motion
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

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
