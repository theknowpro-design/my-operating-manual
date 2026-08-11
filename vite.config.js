import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const MODULE_EXTS = new Set(['.js', '.mjs', '.cjs', '.ts', '.tsx', '.jsx'])
const staticAssetDirs = ['modules/pdf-engine/assets']

function staticAssetsPlugin() {
  return {
    name: 'mom-static-assets',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const rawUrl = req.url || ''
        const query = rawUrl.includes('?') ? rawUrl.slice(rawUrl.indexOf('?') + 1) : ''
        // Never short-circuit Vite asset module transforms (?import, ?url, etc.)
        // or brandingConfig.js PNG imports become image/png and blank the app.
        if (
          /(?:^|&)(?:import|url|raw|inline|worker)(?:&|=|$)/.test(query)
          || query.includes('import')
        ) {
          next()
          return
        }

        const url = decodeURIComponent(rawUrl.split('?')[0] || '')
        for (const dir of staticAssetDirs) {
          const prefix = `/${dir}/`
          if (!url.startsWith(prefix)) continue
          const filePath = path.join(__dirname, url.slice(1))
          if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) continue
          const ext = path.extname(filePath).toLowerCase()
          if (MODULE_EXTS.has(ext)) {
            next()
            return
          }
          const types = {
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.svg': 'image/svg+xml',
            '.webp': 'image/webp',
          }
          res.setHeader('Content-Type', types[ext] || 'application/octet-stream')
          fs.createReadStream(filePath).pipe(res)
          return
        }
        next()
      })
    },
    closeBundle() {
      const outDir = path.join(__dirname, 'dist')
      for (const dir of staticAssetDirs) {
        const src = path.join(__dirname, dir)
        const dest = path.join(outDir, dir)
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, { recursive: true })
        }
      }
    },
  }
}

export default defineConfig({
  plugins: [
    react({
      include: '**/*.{jsx,js,tsx,ts}',
    }),
    staticAssetsPlugin(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@pdf-engine': path.resolve(__dirname, 'modules/pdf-engine'),
    },
  },
})
