# KUBI-Sigma-Males-Project
This is the official repo for the KUBI Sigma Males for the Monad Blitz Hackathon

## ✨ Features

🔥 **Real-Time Multi-User Platform** - Powered by Firebase Firestore
- Live confession feed across all users
- Real-time voting and reactions
- Instant reply/roast synchronization
- Connection status indicator

🎮 **Interactive Experience**
- Yik-Yak style anonymous confessions
- Email-style cards with animations
- Upvote/downvote system (vote once per confession)
- Nested reply threads with visual indentation
- Pizza token economy (1 token per confession)
- Wall of Fame showcasing top posts by engagement

🎨 **Beautiful UI/UX**
- GLSL animated hills background
- Custom pizza slice cursor
- Framer Motion animations
- Responsive design
- Dark mode themed

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

   This will install:
   - React 18+ with TypeScript
   - Vite (build tool)
   - Tailwind CSS v4
   - Framer Motion (animations)
   - Lucide React (icons)
   - Three.js (3D graphics)
   - Firebase SDK (real-time database)
   - ShadCN UI components

2. **Configure Firebase (Required for real-time features):**
   
   See **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** for detailed instructions.
   
   Quick steps:
   - Create a Firebase project
   - Enable Firestore Database
   - Update `src/lib/firebase.ts` with your credentials

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

## 🔥 Testing Real-Time Features

### Quick Test (Same Computer)
1. Open the app in Chrome: http://localhost:5174
2. Open the app in Incognito mode  
3. Post a confession in one window
4. Watch it appear instantly in the other! 🎉

### Multi-Device Test
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. On mobile: Navigate to `http://YOUR_IP:5174`
3. Post from phone, see on computer in real-time!

See **[REALTIME_FEATURES.md](./REALTIME_FEATURES.md)** for comprehensive testing guide.

## � Deploy to Production

### Vercel (Recommended - 1 Click Deploy)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone)

**Quick Deploy:**
```bash
npm install -g vercel
vercel
```

**Important:** Add Firebase environment variables to Vercel:
1. Vercel Dashboard → Settings → Environment Variables
2. Add all `VITE_FIREBASE_*` variables (see `.env.template`)
3. Redeploy

See **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** for complete deployment guide.

### Other Options
- **Netlify**: `npm run build` → Deploy `dist` folder
- **Firebase Hosting**: `firebase init hosting && firebase deploy`
- **GitHub Pages**: Use `gh-pages` package

All hosting options work with Firebase real-time features! 🔥

## �📁 Project Structure

```
├── src/
│   ├── components/
│   │   └── ui/
│   │       ├── glsl-hills.tsx           # 3D animated hills background
│   │       ├── email-client-card.tsx    # Confession card component
│   │       ├── avatar.tsx               # Avatar component
│   │       ├── button.tsx               # Button component  
│   │       └── input.tsx                # Input component
│   ├── lib/
│   │   ├── firebase.ts          # Firebase configuration
│   │   ├── firestore.ts         # Firestore service functions
│   │   └── utils.ts             # Utility functions (cn helper)
│   ├── App.tsx                  # Main application component
│   ├── main.tsx                 # Application entry point
│   ├── index.css                # Tailwind CSS v4 styles
│   └── vite-env.d.ts            # Vite TypeScript definitions
├── FIREBASE_SETUP.md            # Firebase setup instructions
├── REALTIME_FEATURES.md         # Real-time features documentation
├── index.html                   # HTML template
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Dependencies and scripts
```

## 🎨 Components

### GLSLHills Component
A Three.js-powered animated 3D hills background using GLSL shaders.

**Props:**
- `width` (string, default: `'100vw'`) - Container width
- `height` (string, default: `'100vh'`) - Container height
- `cameraZ` (number, default: `125`) - Camera Z position
- `planeSize` (number, default: `256`) - Plane geometry size
- `speed` (number, default: `0.5`) - Animation speed

**Usage:**
```tsx
import { GLSLHills } from '@/components/ui/glsl-hills';

<GLSLHills speed={0.3} />
```

### App Component (DynamicPizzaBackground)
A showcase component demonstrating:
- Animated 3D background with GLSL hills
- Custom pizza cursor that follows mouse
- Animated form with floating particles
- Framer Motion animations
- Responsive design

## 🎯 Features

- ✅ React 18 with TypeScript
- ✅ Vite for fast development and building
- ✅ Tailwind CSS v4 with custom theme
- ✅ Framer Motion for smooth animations
- ✅ Three.js for 3D graphics
- ✅ Path aliases (`@/*` for `src/*`)
- ✅ ESLint configuration
- ✅ Dark mode support (via CSS variables)

## 🛠️ Technology Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first CSS framework (CSS-first configuration)
- **Framer Motion** - Animation library
- **Three.js** - 3D graphics library
- **Lucide React** - Icon library

## ⚠️ Important Notes

### Tailwind CSS v4
This project uses Tailwind CSS v4 syntax with CSS-first configuration. If Tailwind v4 is not yet available in npm, you have two options:

1. **Use Tailwind v4 beta/alpha** (if available):
   ```bash
   npm install tailwindcss@next
   ```

2. **Fallback to Tailwind v3** (if v4 isn't available):
   - Install Tailwind v3: `npm install tailwindcss@^3`
   - Create `tailwind.config.js`:
     ```js
     export default {
       content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
       theme: { extend: {} },
       plugins: [],
     }
     ```
   - Update `src/index.css` to use v3 syntax:
     ```css
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ```
   - Remove the `@import "tailwindcss"` and `@theme inline` syntax

## 📝 Notes

- The `App.tsx` file is a showcase/example demonstrating component usage
- Components are designed to be reusable and adaptable
- Tailwind CSS v4 uses CSS variables for theming
- The project uses path aliases (`@/`) for cleaner imports
