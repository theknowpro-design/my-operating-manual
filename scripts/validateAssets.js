#!/usr/bin/env node

/**
 * Asset Validator Script
 * 
 * Scans asset directories for non-whitelisted media files.
 * Provides warnings without deleting files automatically.
 * 
 * Usage:
 *   node scripts/validateAssets.js
 *   node scripts/validateAssets.js --strict (exits with code 1 on violations)
 *   node scripts/validateAssets.js --quiet (only shows violations)
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  isWhitelistedAsset,
  isLegacyMoneyMakerAsset,
  getApprovedAssets,
} from '../modules/pdf-engine/validators/assetWhitelist.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, '..')

// Parse CLI flags
const flags = {
  strict: process.argv.includes('--strict'),
  quiet: process.argv.includes('--quiet'),
  verbose: process.argv.includes('--verbose'),
}

// Asset directories to scan
const assetDirs = [
  path.join(projectRoot, 'public'),
  path.join(projectRoot, 'public', 'assets'),
  path.join(projectRoot, 'src', 'assets'),
  path.join(projectRoot, 'modules', 'pdf-engine', 'assets'),
]

// File extensions to check
const mediaExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.mp4', '.webm']

const results = {
  checked: 0,
  whitelisted: 0,
  violations: [],
  legacyMoneyMaker: [],
  missing: [],
}

/**
 * Log with color coding for terminal output.
 */
function log(level, message) {
  const colors = {
    info: '\x1b[36m', // cyan
    warn: '\x1b[33m', // yellow
    error: '\x1b[31m', // red
    success: '\x1b[32m', // green
    reset: '\x1b[0m',
  }

  const prefix = `${colors[level]}[${level.toUpperCase()}]${colors.reset}`
  console.log(`${prefix} ${message}`)
}

/**
 * Scan directory for media files (recursively).
 */
function scanDirectory(dir) {
  if (!fs.existsSync(dir)) {
    results.missing.push(dir)
    return
  }

  try {
    const scanRecursive = (currentDir) => {
      const files = fs.readdirSync(currentDir, { withFileTypes: true })

      files.forEach((file) => {
        const fullPath = path.join(currentDir, file.name)

        if (file.isDirectory()) {
          scanRecursive(fullPath)
          return
        }

        const ext = path.extname(file.name).toLowerCase()
        if (!mediaExtensions.includes(ext)) return

        results.checked++

        const filename = file.name
        const relativePath = path.relative(projectRoot, fullPath)

        if (isWhitelistedAsset(filename)) {
          results.whitelisted++
          if (flags.verbose) {
            log('success', `✓ ${relativePath}`)
          }
          return
        }

        // Check for legacy Money Maker assets
        if (isLegacyMoneyMakerAsset(filename)) {
          results.legacyMoneyMaker.push({ filename, path: relativePath })
          log('error', `✗ LEGACY MONEY MAKER: ${relativePath}`)
          return
        }

        // Regular violation
        results.violations.push({ filename, path: relativePath })
        log('warn', `✗ NOT WHITELISTED: ${relativePath}`)
      })
    }

    scanRecursive(dir)
  } catch (err) {
    log('error', `Failed to scan ${dir}: ${err.message}`)
  }
}

/**
 * Main execution.
 */
function main() {
  if (!flags.quiet) {
    log('info', '🔍 Asset Validator')
    log('info', `Checking ${assetDirs.length} asset directories...`)
    log('info', '')
  }

  // Scan all directories
  assetDirs.forEach((dir) => scanDirectory(dir))

  // Report results
  if (!flags.quiet) {
    log('info', '')
    log('info', '📊 Results:')
    log('info', `  Checked: ${results.checked} files`)
    log('info', `  Whitelisted: ${results.whitelisted} files`)

    if (results.missing.length > 0) {
      log('info', `  Missing directories: ${results.missing.length}`)
    }
  }

  // Show violations
  if (results.violations.length > 0) {
    log('warn', '')
    log('warn', `⚠️  ${results.violations.length} non-whitelisted asset(s):`)
    results.violations.forEach(({ path: p }) => {
      log('warn', `    ${p}`)
    })
    log('warn', '')
    log('warn', `Approved assets: ${getApprovedAssets().join(', ')}`)
  }

  // Show legacy Money Maker assets
  if (results.legacyMoneyMaker.length > 0) {
    log('error', '')
    log('error', `❌ ${results.legacyMoneyMaker.length} LEGACY MONEY MAKER asset(s) detected:`)
    results.legacyMoneyMaker.forEach(({ path: p }) => {
      log('error', `    ${p}`)
    })
    log('error', '')
    log('error', 'These should be manually reviewed and deleted if not needed.')
  }

  // Summary
  const hasViolations = results.violations.length > 0 || results.legacyMoneyMaker.length > 0

  if (hasViolations) {
    log('error', '')
    log('error', '❌ Asset validation FAILED')
    log('error', '')
    log('error', 'To fix:')
    log('error', '  1. Review non-whitelisted assets in the list above')
    log('error', '  2. Delete unwanted assets manually')
    log('error', '  3. Add new assets to modules/pdf-engine/validators/assetWhitelist.js if approved')
    log('error', '')

    if (flags.strict) {
      process.exit(1)
    }
  } else if (!flags.quiet) {
    log('success', '')
    log('success', '✓ All assets are whitelisted')
  }
}

main()
