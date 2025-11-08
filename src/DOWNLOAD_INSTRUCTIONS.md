# How to Download and Run Health Sathi

## Method 1: Quick Setup (Recommended)

### Prerequisites
1. Install **Node.js** (v16 or higher) from [nodejs.org](https://nodejs.org/)
2. Verify installation by opening terminal/command prompt and typing:
   ```bash
   node --version
   npm --version
   ```

### Setup Steps

1. **Create a new React TypeScript project**:
   ```bash
   npx create-react-app health-sathi --template typescript
   cd health-sathi
   ```

2. **Install additional dependencies**:
   ```bash
   npm install lucide-react sonner@2.0.3 class-variance-authority clsx tailwind-merge
   npm install -D tailwindcss@next
   ```

3. **Initialize Tailwind CSS**:
   ```bash
   npx tailwindcss init
   ```

4. **Copy all files from this Figma Make project** to your local project:
   - Replace `src/App.tsx` with the App.tsx from this project
   - Copy all files from `components/` to `src/components/`
   - Copy `styles/globals.css` to `src/styles/globals.css`
   - Replace `package.json` with the one provided
   - Copy `tailwind.config.js`

5. **Update src/index.tsx** to import the global CSS and add the Toaster:
   ```tsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import './styles/globals.css';
   import App from './App';
   import { Toaster } from './components/ui/sonner';

   const root = ReactDOM.createRoot(
     document.getElementById('root') as HTMLElement
   );

   root.render(
     <React.StrictMode>
       <App />
       <Toaster richColors position="top-right" />
     </React.StrictMode>
   );
   ```

6. **Start the development server**:
   ```bash
   npm start
   ```

7. **Open your browser** to [http://localhost:3000](http://localhost:3000)

## Method 2: Download as ZIP

1. **Download the project files**:
   - Copy all the code from each file in this Figma Make project
   - Create the folder structure as shown in the file tree
   - Save each file with the exact same name and path

2. **Follow steps 1, 2, and 6-7 from Method 1**

## Method 3: Manual File Creation

Create each file manually with the provided content:

### Core Files to Create:
```
health-sathi/
├── package.json (copy the provided version)
├── tailwind.config.js
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── index.tsx
│   ├── App.tsx
│   ├── styles/
│   │   └── globals.css
│   └── components/
│       ├── Dashboard.tsx
│       ├── AppointmentManager.tsx
│       ├── MedicineManager.tsx
│       ├── DocumentManager.tsx
│       ├── PatientProfile.tsx
│       └── ui/ (all the UI components)
```

## Troubleshooting

### Common Issues:

1. **"Module not found" errors**:
   - Make sure all dependencies are installed: `npm install`
   - Check that file paths match exactly

2. **Tailwind styles not working**:
   - Ensure `globals.css` is imported in `index.tsx`
   - Verify `tailwind.config.js` content paths are correct

3. **TypeScript errors**:
   - Make sure you created the project with `--template typescript`
   - Check that all import paths are correct

4. **Toast notifications not appearing**:
   - Ensure `<Toaster />` is added to your `index.tsx`
   - Check that `sonner@2.0.3` is installed

### Getting Help:
- Check the browser console for error messages
- Ensure Node.js version is 16 or higher
- Try deleting `node_modules` and running `npm install` again

## Building for Production

Once everything is working:

```bash
npm run build
```

This creates a `build` folder with production-ready files that you can deploy to any web server.

## Deployment Options

- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Use GitHub Actions to deploy
- **Any web hosting**: Upload the `build` folder contents

---

**Note**: This app stores data locally in your browser. For production use with real medical data, consider adding a secure backend database and HIPAA compliance measures.