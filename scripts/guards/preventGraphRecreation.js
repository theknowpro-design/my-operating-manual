#!/usr/bin/env node

/**
 * Build-Time Guard: Prevent Money Maker Graph System Recreation
 * 
 * This guard runs BEFORE every build to ensure:
 * 1. No Money Maker graph folders exist
 * 2. No deprecated graph PNG assets exist
 * 3. No deprecated graph imports remain in code
 * 
 * Failure to pass these checks blocks the build.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../../');

let hasErrors = false;
const warnings = [];

console.log('\n🛡️  RUNNING BUILD-TIME GUARD: Money Maker Prevention\n');

// ============================================================================
// GUARD 1: Remove graph folders if they exist
// ============================================================================

function guardGraphFolders() {
  console.log('  Checking for Money Maker graph folders...');
  
  const folders = [
    'modules/pdf-engine/assets/graphs',
    'dist/modules/pdf-engine/assets/graphs',
  ];

  folders.forEach(folder => {
    const fullPath = path.join(ROOT, folder);
    if (fs.existsSync(fullPath)) {
      try {
        fs.rmSync(fullPath, { recursive: true, force: true });
        warnings.push(`⚠️  Graph assets detected and removed — Money Maker graph system is deprecated: ${folder}`);
      } catch (err) {
        console.error(`❌ Failed to remove ${folder}: ${err.message}`);
        hasErrors = true;
      }
    }
  });

  // Recreate as empty directories (if parent exists) to maintain structure
  const parentPath = path.join(ROOT, 'modules/pdf-engine/assets');
  if (fs.existsSync(parentPath)) {
    const graphsPath = path.join(parentPath, 'graphs');
    if (!fs.existsSync(graphsPath)) {
      try {
        fs.mkdirSync(graphsPath, { recursive: true });
      } catch (err) {
        console.error(`Warning: Could not recreate empty graphs folder: ${err.message}`);
      }
    }
  }
}

// ============================================================================
// GUARD 2: Scan for deprecated PNG graph assets
// ============================================================================

function scanForDeprecatedPngs() {
  console.log('  Scanning for deprecated graph PNG assets...');

  const deprecatedPatterns = [
    '*income*.png',
    '*monthly*.png',
    '*graph*.png',
    '*niche*.png',
  ];

  const scanDirs = [
    'modules/pdf-engine/assets',
    'src/assets',
    'public',
    'dist',
  ];

  let foundDeprecated = false;

  scanDirs.forEach(dir => {
    const fullPath = path.join(ROOT, dir);
    if (!fs.existsSync(fullPath)) return;

    try {
      const files = fs.readdirSync(fullPath, { recursive: true });
      
      files.forEach(file => {
        if (!file.endsWith('.png')) return;
        
        const fileName = typeof file === 'string' ? file : file.name;
        const lowerName = fileName.toLowerCase();
        
        // Check if matches deprecated patterns
        const isDeprecated = 
          lowerName.includes('income') ||
          lowerName.includes('monthly') ||
          lowerName.includes('niche');
        
        // Exclude approved names
        const isApproved =
          lowerName.includes('teal read me') ||
          lowerName.includes('hero') ||
          lowerName.includes('react') ||
          lowerName.includes('vite');
        
        if (isDeprecated && !isApproved) {
          const fullFilePath = path.join(fullPath, fileName);
          try {
            fs.unlinkSync(fullFilePath);
            warnings.push(`⚠️  Deprecated graph asset removed: ${path.relative(ROOT, fullFilePath)}`);
            foundDeprecated = true;
          } catch (err) {
            console.error(`❌ Failed to delete ${fileName}: ${err.message}`);
            hasErrors = true;
          }
        }
      });
    } catch (err) {
      // Silently skip directories that can't be read
    }
  });

  return foundDeprecated;
}

// ============================================================================
// GUARD 3: Scan codebase for deprecated imports and function calls
// ============================================================================

function scanForDeprecatedCode() {
  console.log('  Scanning for deprecated Money Maker graph code...');

  const deprecatedPatterns = [
    'buildIncomeGraph',
    'resolveNicheGraph',
    'nicheGraphCatalog',
    'insertAdvancedTipsGraph',
    'insertRealWorldScenariosGraph',
  ];

  const skipDirs = ['node_modules', 'dist', '.git', '.cursor'];
  const jsFiles = [];

  function collectJsFiles(dir) {
    try {
      const files = fs.readdirSync(dir);
      
      files.forEach(file => {
        if (skipDirs.some(skip => file === skip)) return;
        
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          collectJsFiles(fullPath);
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
          jsFiles.push(fullPath);
        }
      });
    } catch (err) {
      // Skip unreadable directories
    }
  }

  collectJsFiles(ROOT);

  let foundDeprecated = false;

  jsFiles.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      deprecatedPatterns.forEach(pattern => {
        // Skip files that are the deprecated implementations themselves
        if (filePath.includes('advancedTips.js') ||
            filePath.includes('realWorldScenarios.js') ||
            filePath.includes('buildIncomeGraph.js') ||
            filePath.includes('resolveNicheGraph.js') ||
            filePath.includes('nicheGraphCatalog.js')) {
          return;
        }

        // Look for active imports/calls (not in comments)
        const importRegex = new RegExp(`(?:import|from|require).*${pattern}|\\b${pattern}\\s*\\(`, 'g');
        const matches = content.match(importRegex);
        
        if (matches) {
          // Filter out comments
          const lines = content.split('\n');
          let lineNum = 0;
          let found = false;
          
          lines.forEach((line, idx) => {
            if (line.includes(pattern) && !line.trim().startsWith('//')) {
              if (!found) {
                hasErrors = true;
                found = true;
                warnings.push(
                  `❌ Deprecated Money Maker graph reference detected:\n` +
                  `   File: ${path.relative(ROOT, filePath)}\n` +
                  `   Pattern: ${pattern}\n` +
                  `   Line ${idx + 1}: ${line.trim()}`
                );
              }
            }
          });
        }
      });
    } catch (err) {
      // Skip files that can't be read
    }
  });

  return foundDeprecated;
}

// ============================================================================
// GUARD 4: Verify approved assets are not deleted
// ============================================================================

function verifyApprovedAssets() {
  console.log('  Verifying approved assets...');

  const approvedAssets = [
    'modules/pdf-engine/assets/Teal Read Me Logo.png',
    'src/assets/Teal Read Me Logo.png',
    'src/assets/hero.png',
    'src/assets/react.svg',
    'src/assets/vite.svg',
  ];

  const missing = [];

  approvedAssets.forEach(asset => {
    const fullPath = path.join(ROOT, asset);
    if (!fs.existsSync(fullPath)) {
      missing.push(asset);
    }
  });

  if (missing.length > 0) {
    console.warn(`\n⚠️  WARNING: Some approved assets are missing:`);
    missing.forEach(asset => console.warn(`   - ${asset}`));
    console.warn('(This is OK if you are in a clean checkout without assets yet)\n');
  }
}

// ============================================================================
// Main execution
// ============================================================================

try {
  guardGraphFolders();
  scanForDeprecatedPngs();
  scanForDeprecatedCode();
  verifyApprovedAssets();

  // Print results
  console.log('\n' + '='.repeat(70));
  
  if (warnings.length > 0) {
    console.log('\n📋 GUARD REPORT:\n');
    warnings.forEach(warning => console.log(`  ${warning}`));
  }

  if (hasErrors) {
    console.log('\n❌ BUILD BLOCKED: Deprecated Money Maker graph references detected.');
    console.log('   The codebase contains references to deprecated Money Maker graph functions.');
    console.log('   Please remove these references and try again.\n');
    process.exit(1);
  } else {
    console.log('\n✅ BUILD GUARD PASSED');
    if (warnings.length > 0) {
      console.log(`   (${warnings.length} warning(s) - deprecated assets removed)\n`);
    } else {
      console.log('   No deprecated Money Maker graph system detected\n');
    }
    process.exit(0);
  }
} catch (err) {
  console.error('\n❌ GUARD ERROR:', err.message);
  console.error(err.stack);
  process.exit(1);
}
