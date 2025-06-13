import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import fg from 'fast-glob'

const __dirname = dirname(fileURLToPath(import.meta.url))

const repoName = 'supabase-JS-SDK';

const inputs = fg.sync('src/**/*.html', { cwd: __dirname, absolute: true })

export default defineConfig({
  base: `/${repoName}/`,
  plugins: [    
        tailwindcss(),  
    ],

  root: resolve(__dirname, 'src'),
  build: {
    emptyOutDir: true,
    rollupOptions: {
      input: inputs,
    },
    outDir: resolve(__dirname, 'dist'),
  },
})
