#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const VERSION = process.env.VERSION || '0.1.0';
const DIST_DIR = path.join(__dirname, '../examples/demo-plugin/dist');
const VST3_OUTPUT = path.join(__dirname, '../dist/vst3');
const PLUGIN_NAME = 'ReAudio';

console.log('🔨 Building ReAudio VST3 Plugin Wrapper...');

// Create VST3 output directory
if (!fs.existsSync(VST3_OUTPUT)) {
  fs.mkdirSync(VST3_OUTPUT, { recursive: true });
}

// Generate VST3 plugin bundle
const vst3Bundle = {
  name: PLUGIN_NAME,
  version: VERSION,
  type: 'VST3',
  architecture: process.arch,
  platform: process.platform,
  buildDate: new Date().toISOString(),
  webAudioBundle: {
    size: getDirectorySize(DIST_DIR),
    files: countFiles(DIST_DIR),
  },
};

fs.writeFileSync(
  path.join(VST3_OUTPUT, 'bundle.json'),
  JSON.stringify(vst3Bundle, null, 2)
);

// Copy demo-plugin dist
if (fs.existsSync(DIST_DIR)) {
  execSync(`cp -r ${DIST_DIR}/* ${VST3_OUTPUT}/`);
  console.log('✓ Web Audio bundle copied');
}

// Generate VST3 metadata
const vst3Meta = {
  vstVersion: '30401',
  pluginId: 'ReAudio VST3',
  manufacturerId: 'ReAu',
  flags: {
    isSynth: true,
    hasEditor: true,
    supportsProcessReplacing: true,
  },
  inputs: [
    { name: 'Stereo In', channels: 2 },
  ],
  outputs: [
    { name: 'Stereo Out', channels: 2 },
  ],
};

fs.writeFileSync(
  path.join(VST3_OUTPUT, 'vst3.json'),
  JSON.stringify(vst3Meta, null, 2)
);

console.log('✅ VST3 Plugin wrapper generated!');
console.log(`   Output: ${VST3_OUTPUT}`);
console.log(`   Version: ${VERSION}`);

function getDirectorySize(dir) {
  let size = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach(file => {
    if (file.isDirectory()) {
      size += getDirectorySize(path.join(dir, file.name));
    } else {
      size += fs.statSync(path.join(dir, file.name)).size;
    }
  });
  return size;
}

function countFiles(dir) {
  let count = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach(file => {
    if (file.isDirectory()) {
      count += countFiles(path.join(dir, file.name));
    } else {
      count++;
    }
  });
  return count;
}
