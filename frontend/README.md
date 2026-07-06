# LuxeMarket - E-Commerce Shopping App

A premium, state-of-the-art e-commerce frontend built using React and Vite, featuring custom light and dark themes, auth session contexts, and seamless backend API connectivity.

---

## Key Features

*   ☀️ **Light & Dark Themes**: Fully custom HSL-tailored palettes, fluid transition speed, and persisted preferences.
*   ✨ **Rich Typography & Aesthetics**: Loaded with modern fonts (*Outfit* and *Plus Jakarta Sans*) with glassmorphic cards and glowing hover styles.
*   🔑 **Security & Verification**: Signup and login validation forms, with session tokens persisted in local storage.
*   📱 **Responsive Grid Layouts**: Adaptive structures designed for desktop, tablet, and mobile browsers.

---

## Getting Started

### Prerequisites

*   Node.js (v18.0.0 or higher)
*   npm (v9.0.0 or higher)

### Installation & Run

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start development server**:
    ```bash
    npm run dev
    ```
3.  Open **`http://localhost:5173/`** in your browser.

---

## File Layout

*   `src/components/`: Reusable layouts (like the responsive `Navbar` header).
*   `src/context/`: State controllers (`ThemeContext` for themes, `AuthContext` for JWT profiles).
*   `src/pages/`: View templates (`LandingPage`, `Login`, and `Signup` routes).
*   `src/index.css`: Global styles, transitions, HSL values, and resets.
