import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
  base: '/',
  plugins: [react(), imagetools()],
  assetsInclude: [
    '**/*.{jpg,jpeg,png,JPG,JPEG,PNG}',
    '**/*.{jpg,jpeg,png,JPG,JPEG,PNG}?*'
  ]
});
