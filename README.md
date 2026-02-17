# KUBI-Sigma-Males-Project
This is the official repo for the KUBI Sigma Males for the Monad Blitz Hackathon

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

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview production build:**
   ```bash
   npm run preview
   ```

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   └── ui/
│   │       └── glsl-hills.tsx    # 3D animated hills background component
│   ├── App.tsx                    # Main showcase component
│   ├── main.tsx                   # Application entry point
│   ├── index.css                  # Tailwind CSS v4 styles with theme variables
│   └── vite-env.d.ts              # Vite TypeScript definitions
├── index.html                     # HTML template
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
