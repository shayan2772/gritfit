# GritFit

**GritFit** is a premium, mobile-first fitness application built with Next.js 15, Tailwind CSS, and Framer Motion. It features a "luxury" aesthetic, offline PWA capabilities, and AI-powered exercise visualizations.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+
- npm

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/shayan2772/gritfit.git
cd gritfit
npm install
```

### 3. Running Locally
Run the development server (Note: use the `--webpack` flag if you encounter PWA issues with Turbopack):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Building for Production
To create an optimized production build:

```bash
npm run build
npm start
```

## 📱 Features
- **Lift Mode**: Curated exercise library with AI visuals.
- **Run Mode**: Precision timer with immersive animations.
- **Tools**: BMI Calculator and other health utilities.
- **Offline Capable**: Installable as a PWA on iOS/Android.

## ☁️ Deployment
This project is optimized for deployment on [Vercel](https://vercel.com).

To deploy manually via CLI:
```bash
npx vercel
```
