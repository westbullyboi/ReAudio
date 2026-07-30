#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VERSION = process.env.VERSION || '0.1.0';
const DIST_DIR = path.join(__dirname, '../examples/demo-plugin/dist');
const OUTPUT_DIR = path.join(__dirname, '../dist/vst');
const PLUGIN_NAME = 'ReAudio';

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('📦 Packaging VST plugin...');
console.log(`   Plugin: ${PLUGIN_NAME}`);
console.log(`   Version: ${VERSION}`);
console.log(`   Source: ${DIST_DIR}`);
console.log(`   Output: ${OUTPUT_DIR}`);

// Create plugin metadata
const metadata = {
  name: PLUGIN_NAME,
  version: VERSION,
  type: 'WebAudio VST',
  buildDate: new Date().toISOString(),
};

fs.writeFileSync(
  path.join(OUTPUT_DIR, 'plugin.json'),
  JSON.stringify(metadata, null, 2)
);

// Copy dist files to VST output
if (fs.existsSync(DIST_DIR)) {
  execSync(`cp -r ${DIST_DIR}/* ${OUTPUT_DIR}/`);
  console.log('✓ Files copied to VST output directory');
} else {
  console.error(`✗ Distribution directory not found: ${DIST_DIR}`);
  process.exit(1);
}

// Create VST package
const zipName = `${PLUGIN_NAME}-${VERSION}.zip`;
const zipPath = path.join(__dirname, '../dist', zipName);

try {
  execSync(`cd ${OUTPUT_DIR}/.. && zip -r ${zipPath} vst/`);
  console.log(`✓ VST package created: ${zipPath}`);
} catch (error) {
  console.error('✗ Failed to create zip package');
  process.exit(1);
}

console.log('✅ VST packaging complete!');
