#!/usr/bin/env node

/**
 * Generate PWA Icons for Instagram Moments PH
 * This script creates placeholder icons for development
 * In production, replace these with actual designed icons
 */

// Note: This script uses CommonJS require() which is standard for Node.js scripts
// ESLint rules for TypeScript don't apply to Node.js scripts
const fs = require('fs');
const path = require('path');

// Icon sizes required for PWA
const ICON_SIZES = [
  72, 96, 128, 144, 152, 192, 384, 512
];

// Shortcut icon sizes
const SHORTCUT_SIZES = [96];

// Create a simple SVG icon as a placeholder
function createSVGIcon(size, text = 'IM') {
  const fontSize = Math.max(12, size * 0.3);
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ea580c;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <text x="${size/2}" y="${size/2 + fontSize/3}" 
        font-family="Arial, sans-serif" 
        font-size="${fontSize}" 
        font-weight="bold" 
        text-anchor="middle" 
        fill="white">${text}</text>
</svg>`;
}



// Generate icons
function generateIcons() {
  console.log('🎨 Generating PWA icons for Instagram Moments PH...');
  
  const iconsDir = path.join(__dirname, '../public/icons');
  const screenshotsDir = path.join(__dirname, '../public/screenshots');
  
  // Ensure directories exist
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  // Generate main icons
  ICON_SIZES.forEach(size => {
    const svg = createSVGIcon(size);
    const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
    
    // Save SVG
    fs.writeFileSync(svgPath, svg);
    console.log(`✅ Created icon-${size}x${size}.svg`);
    
    // For development, we'll create a simple PNG placeholder
    // In production, you'd use a proper image processing library
    console.log(`⚠️  icon-${size}x${size}.png - Create manually with proper design tool`);
  });
  
  // Generate shortcut icons
  SHORTCUT_SIZES.forEach(size => {
    const createSvg = createSVGIcon(size, '➕');
    const eventsSvg = createSVGIcon(size, '📅');
    const cameraSvg = createSVGIcon(size, '📷');
    
    const createPath = path.join(iconsDir, `shortcut-create-${size}x${size}.svg`);
    const eventsPath = path.join(iconsDir, `shortcut-events-${size}x${size}.svg`);
    const cameraPath = path.join(iconsDir, `shortcut-camera-${size}x${size}.svg`);
    
    fs.writeFileSync(createPath, createSvg);
    fs.writeFileSync(eventsPath, eventsSvg);
    fs.writeFileSync(cameraPath, cameraSvg);
    
    console.log(`✅ Created shortcut icons for size ${size}x${size}`);
  });
  
  // Create placeholder screenshots
  const screenshots = [
    { name: 'desktop-landing.png', size: '1280x720', desc: 'Landing page on desktop' },
    { name: 'mobile-camera.png', size: '390x844', desc: 'Camera interface on mobile' },
    { name: 'mobile-gallery.png', size: '390x844', desc: 'Photo gallery on mobile' }
  ];
  
  screenshots.forEach(screenshot => {
    const screenshotPath = path.join(screenshotsDir, screenshot.name);
    const placeholderText = `# ${screenshot.size} - ${screenshot.desc}\n\nThis is a placeholder screenshot for ${screenshot.desc}.\n\nIn production, replace this with actual screenshots of your app.`;
    
    fs.writeFileSync(screenshotPath.replace('.png', '.md'), placeholderText);
    console.log(`⚠️  ${screenshot.name} - Create manually with actual app screenshots`);
  });
  
  console.log('\n🎉 PWA icon generation complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Replace SVG icons with proper PNG designs');
  console.log('2. Create actual app screenshots');
  console.log('3. Test PWA installation on various devices');
  console.log('4. Verify offline functionality works correctly');
}

// Run the script
if (require.main === module) {
  generateIcons();
}

module.exports = { generateIcons, createSVGIcon };
