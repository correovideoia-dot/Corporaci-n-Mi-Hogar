import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// Helper to get all HTML entry points in the root folder
const getHtmlEntries = () => {
  const entries = {};
  const rootDir = __dirname;
  const files = fs.readdirSync(rootDir);
  
  files.forEach(file => {
    if (file.endsWith('.html')) {
      const name = path.basename(file, '.html');
      entries[name] = path.resolve(rootDir, file);
    }
  });
  
  return entries;
};

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    rollupOptions: {
      input: getHtmlEntries()
    }
  }
});
