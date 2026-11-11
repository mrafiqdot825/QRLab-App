const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('/opt/homebrew/lib/node_modules/goldie/node_modules/@napi-rs/canvas');

const MASTER_IMAGE_PATH = '/Users/muhammadrafiq/.gemini/antigravity/brain/68eac0b1-5c34-4efd-bd76-c5f472475177/.user_uploaded/media_1792937511033_1818d46c.jpg';
const APP_DIR = path.resolve(__dirname, '..');
const WEBSITE_DIR = path.resolve(APP_DIR, '../website');

const CANVAS_COLOR = '#FBEDE6'; // Morrow brand canvas cream
const PLUM_COLOR = '#4A0F3A';   // Morrow brand primary plum

async function main() {
  console.log('Loading master image from:', MASTER_IMAGE_PATH);
  const masterImg = await loadImage(MASTER_IMAGE_PATH);

  // 1. Isolate the 3D Squircle with anti-aliased transparency
  const rawSize = 512;
  const srcX = 530 - rawSize / 2;
  const srcY = 399 - rawSize / 2;

  const rawCanvas = createCanvas(rawSize, rawSize);
  const rawCtx = rawCanvas.getContext('2d');
  rawCtx.drawImage(masterImg, srcX, srcY, rawSize, rawSize, 0, 0, rawSize, rawSize);

  const imgData = rawCtx.getImageData(0, 0, rawSize, rawSize);
  const d = imgData.data;
  const bgR = 253, bgG = 250, bgB = 243;

  const visited = new Uint8Array(rawSize * rawSize);
  const queue = [];

  for (let x = 0; x < rawSize; x++) {
    queue.push(x, 0);
    queue.push(x, rawSize - 1);
    visited[0 * rawSize + x] = 1;
    visited[(rawSize - 1) * rawSize + x] = 1;
  }
  for (let y = 1; y < rawSize - 1; y++) {
    queue.push(0, y);
    queue.push(rawSize - 1, y);
    visited[y * rawSize + 0] = 1;
    visited[y * rawSize + (rawSize - 1)] = 1;
  }

  let head = 0;
  while (head < queue.length) {
    const cx = queue[head++];
    const cy = queue[head++];
    const cidx = (cy * rawSize + cx) * 4;
    const r = d[cidx], g = d[cidx+1], b = d[cidx+2];
    const dist = Math.sqrt((r - bgR)**2 + (g - bgG)**2 + (b - bgB)**2);

    if (dist < 45) {
      const neighbors = [
        [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
      ];
      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < rawSize && ny >= 0 && ny < rawSize) {
          const npos = ny * rawSize + nx;
          if (!visited[npos]) {
            visited[npos] = 1;
            queue.push(nx, ny);
          }
        }
      }
    }
  }

  for (let y = 0; y < rawSize; y++) {
    for (let x = 0; x < rawSize; x++) {
      const pos = y * rawSize + x;
      const idx = pos * 4;
      if (visited[pos]) {
        const r = d[idx], g = d[idx+1], b = d[idx+2];
        const dist = Math.sqrt((r - bgR)**2 + (g - bgG)**2 + (b - bgB)**2);
        if (dist <= 14) {
          d[idx + 3] = 0;
        } else if (dist < 45) {
          const alpha = (dist - 14) / (45 - 14);
          d[idx + 3] = Math.round(alpha * 255);
        }
      }
    }
  }
  rawCtx.putImageData(imgData, 0, 0);

  // Transparent squircle image is now ready in rawCanvas!
  console.log('Isolated transparent 3D squircle successfully.');

  // 2. Generate Master App Icon (icon.png: 1024x1024)
  // 3D squircle with shadow on #FBEDE6 canvas
  {
    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = CANVAS_COLOR;
    ctx.fillRect(0, 0, 1024, 1024);

    const iconTargetSize = 780;
    const iconOffset = (1024 - iconTargetSize) / 2;

    // Soft drop shadow
    ctx.save();
    ctx.shadowColor = 'rgba(74, 15, 58, 0.25)';
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 24;
    ctx.drawImage(rawCanvas, iconOffset, iconOffset, iconTargetSize, iconTargetSize);
    ctx.restore();

    // Re-draw crisp on top
    ctx.drawImage(rawCanvas, iconOffset, iconOffset, iconTargetSize, iconTargetSize);

    const outPath = path.join(APP_DIR, 'assets/images/icon.png');
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    console.log('Saved:', outPath);
  }

  // 3. Generate Android Adaptive Foreground (android-icon-foreground.png: 1024x1024)
  // Transparent background, squircle within 66% safe zone (580x580 centered)
  {
    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext('2d');
    const safeSize = 580;
    const safeOffset = (1024 - safeSize) / 2;

    // Drop shadow
    ctx.save();
    ctx.shadowColor = 'rgba(74, 15, 58, 0.28)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 18;
    ctx.drawImage(rawCanvas, safeOffset, safeOffset, safeSize, safeSize);
    ctx.restore();

    ctx.drawImage(rawCanvas, safeOffset, safeOffset, safeSize, safeSize);

    const outPath = path.join(APP_DIR, 'assets/images/android-icon-foreground.png');
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    console.log('Saved:', outPath);
  }

  // 4. Generate Android Adaptive Background (android-icon-background.png: 1024x1024)
  {
    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = CANVAS_COLOR;
    ctx.fillRect(0, 0, 1024, 1024);

    const outPath = path.join(APP_DIR, 'assets/images/android-icon-background.png');
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    console.log('Saved:', outPath);
  }

  // 5. Generate Android Monochrome Icon (android-icon-monochrome.png: 1024x1024)
  {
    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext('2d');
    const qrSize = 520;
    const startX = (1024 - qrSize) / 2;
    const startY = (1024 - qrSize) / 2;

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
    }

    const eyeSize = Math.round(qrSize * 0.43);
    const eyeCorner = Math.round(eyeSize * 0.32);
    const eyeCutout = Math.round(eyeSize * 0.22);
    const eyeInnerSize = eyeSize - eyeCutout * 2;
    const eyeCoreSize = Math.round(eyeSize * 0.36);
    const eyeCoreOffset = (eyeSize - eyeCoreSize) / 2;

    function drawEye(x, y) {
      ctx.fillStyle = '#FFFFFF';
      roundRect(x, y, eyeSize, eyeSize, eyeCorner);

      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      roundRect(x + eyeCutout, y + eyeCutout, eyeInnerSize, eyeInnerSize, eyeCorner * 0.6);
      ctx.restore();

      ctx.fillStyle = '#FFFFFF';
      roundRect(x + eyeCoreOffset, y + eyeCoreOffset, eyeCoreSize, eyeCoreSize, eyeCorner * 0.4);
    }

    drawEye(startX, startY);
    drawEye(startX + qrSize - eyeSize, startY);
    drawEye(startX, startY + qrSize - eyeSize);

    const brX = startX + qrSize - eyeSize;
    const brY = startY + qrSize - eyeSize;
    const cellSize = eyeSize / 4;
    const dotR = cellSize * 0.35;

    roundRect(brX, brY + cellSize * 0.15, cellSize * 0.8, cellSize * 0.8, dotR);

    // L shape
    ctx.beginPath();
    const lx = brX + cellSize * 1.1;
    const ly = brY + cellSize * 0.15;
    const lw = cellSize * 1.7;
    const lh = cellSize * 1.7;
    const lr = cellSize * 0.35;
    ctx.moveTo(lx + lr, ly);
    ctx.lineTo(lx + cellSize * 0.8 - lr, ly);
    ctx.arcTo(lx + cellSize * 0.8, ly, lx + cellSize * 0.8, ly + lr, lr);
    ctx.lineTo(lx + cellSize * 0.8, ly + cellSize * 0.9);
    ctx.lineTo(lx + lw - lr, ly + cellSize * 0.9);
    ctx.arcTo(lx + lw, ly + cellSize * 0.9, lx + lw, ly + cellSize * 0.9 + lr, lr);
    ctx.lineTo(lx + lw, ly + lh - lr);
    ctx.arcTo(lx + lw, ly + lh, lx + lw - lr, ly + lh, lr);
    ctx.lineTo(lx + lr, ly + lh);
    ctx.arcTo(lx, ly + lh, lx, ly + lh - lr, lr);
    ctx.lineTo(lx, ly + lr);
    ctx.arcTo(lx, ly, lx + lr, ly, lr);
    ctx.closePath();
    ctx.fill();

    roundRect(brX + cellSize * 3.1, brY + cellSize * 0.15, cellSize * 0.8, cellSize * 0.8, dotR);
    roundRect(brX, brY + cellSize * 1.2, cellSize * 0.8, cellSize * 0.8, dotR);
    roundRect(brX + cellSize * 3.1, brY + cellSize * 1.2, cellSize * 0.8, cellSize * 0.8, dotR);
    roundRect(brX, brY + cellSize * 2.2, cellSize * 0.8, cellSize * 0.8, dotR);
    roundRect(brX + cellSize * 1.1, brY + cellSize * 2.2, cellSize * 0.8, cellSize * 0.8, dotR);
    roundRect(brX + cellSize * 2.1, brY + cellSize * 2.2, cellSize * 1.8, cellSize * 0.8, dotR);

    // Subtle outer squircle
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 22;
    ctx.beginPath();
    const pad = 64;
    ctx.roundRect(startX - pad, startY - pad, qrSize + pad * 2, qrSize + pad * 2, (qrSize + pad * 2) * 0.28);
    ctx.stroke();

    const outPath = path.join(APP_DIR, 'assets/images/android-icon-monochrome.png');
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    console.log('Saved:', outPath);
  }

  // 6. Generate Splash Icon (splash-icon.png: 512x512)
  {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');
    const targetSize = 420;
    const offset = (512 - targetSize) / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(74, 15, 58, 0.25)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;
    ctx.drawImage(rawCanvas, offset, offset, targetSize, targetSize);
    ctx.restore();

    ctx.drawImage(rawCanvas, offset, offset, targetSize, targetSize);

    const outPath = path.join(APP_DIR, 'assets/images/splash-icon.png');
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    console.log('Saved:', outPath);
  }

  // 7. Generate Favicon (favicon.png: 512x512)
  {
    const canvas = createCanvas(512, 512);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = CANVAS_COLOR;
    ctx.beginPath();
    ctx.arc(256, 256, 256, 0, Math.PI * 2);
    ctx.fill();

    const targetSize = 380;
    const offset = (512 - targetSize) / 2;
    ctx.drawImage(rawCanvas, offset, offset, targetSize, targetSize);

    const outPath = path.join(APP_DIR, 'assets/images/favicon.png');
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    console.log('Saved:', outPath);
  }

  // 8. Generate Master Logo Lockup (logo.png: 1024x1024)
  {
    const canvas = createCanvas(1024, 1024);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(masterImg, 0, 0, 1024, 1024);

    const outPath = path.join(APP_DIR, 'assets/images/logo.png');
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    console.log('Saved:', outPath);
  }

  // 9. Generate Google Play Store Feature Graphic (1024x500)
  {
    const WIDTH = 1024;
    const HEIGHT = 500;
    const canvas = createCanvas(WIDTH, HEIGHT);
    const ctx = canvas.getContext('2d');

    // Deep Plum Cinematic Background
    const bgGrad = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
    bgGrad.addColorStop(0, '#1E0519');
    bgGrad.addColorStop(0.5, '#2D0A24');
    bgGrad.addColorStop(1, '#160412');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Warm glow top-right
    const glow1 = ctx.createRadialGradient(780, 220, 10, 780, 220, 380);
    glow1.addColorStop(0, 'rgba(106, 27, 84, 0.5)');
    glow1.addColorStop(0.6, 'rgba(74, 15, 58, 0.2)');
    glow1.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Ambient glow bottom-left
    const glow2 = ctx.createRadialGradient(240, 420, 10, 240, 420, 340);
    glow2.addColorStop(0, 'rgba(251, 237, 230, 0.12)');
    glow2.addColorStop(0.6, 'rgba(74, 15, 58, 0.15)');
    glow2.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Left Typography
    ctx.save();
    const badgeX = 80;
    const badgeY = 80;
    const badgeW = 200;
    const badgeH = 32;
    ctx.fillStyle = 'rgba(251, 237, 230, 0.12)';
    ctx.strokeStyle = 'rgba(251, 237, 230, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FBEDE6';
    ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('NEXT-GEN QR CREATOR', badgeX + badgeW / 2, badgeY + badgeH / 2);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 56px system-ui, -apple-system, sans-serif';
    ctx.fillText('QRLab', 80, 172);

    ctx.fillStyle = '#E2D3DC';
    ctx.font = '600 20px system-ui, -apple-system, sans-serif';
    ctx.fillText('Create. Style. Scan.', 80, 214);

    const bullets = [
      '120fps Instant Concurrent Rendering',
      'Luxury 3D Eye Shapes, Dots & Themes',
      '100% On-Device Privacy & Offline',
      'Vector SVG & High-Resolution Formats',
    ];

    ctx.font = '500 14px system-ui, -apple-system, sans-serif';
    bullets.forEach((bullet, index) => {
      const by = 276 + index * 32;
      ctx.fillStyle = "#E2A4CD";
      ctx.beginPath();
      ctx.arc(86, by - 4, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#EFE6EC";
      ctx.fillText(bullet, 100, by);
    });
    ctx.restore();

    // Right: Luxury Floating 3D Icon Card
    ctx.save();
    ctx.translate(760, 250);
    ctx.rotate((4 * Math.PI) / 180);

    const cardW = 320;
    const cardH = 350;
    const cardX = -cardW / 2;
    const cardY = -cardH / 2;

    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 45;
    ctx.shadowOffsetY = 22;

    ctx.fillStyle = '#FBEDE6';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 32);
    ctx.fill();
    ctx.stroke();

    // Draw the 3D squircle on the card
    const iconCardSize = 230;
    ctx.shadowColor = 'transparent';
    ctx.drawImage(rawCanvas, -iconCardSize / 2, cardY + 28, iconCardSize, iconCardSize);

    ctx.fillStyle = '#4A0F3A';
    ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('QRLab Studio', 0, cardY + cardH - 44);

    ctx.fillStyle = '#6B6468';
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.fillText('Custom 3D & Vector Exports', 0, cardY + cardH - 24);

    ctx.restore();

    const outPath = path.join(APP_DIR, 'assets/images/play-store-feature-graphic.png');
    fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
    console.log('Saved:', outPath);
  }

  // 10. Generate Android Mipmap densities
  const densities = [
    { name: 'mdpi', iconSize: 48, adaptiveSize: 108, splashW: 288 },
    { name: 'hdpi', iconSize: 72, adaptiveSize: 162, splashW: 432 },
    { name: 'xhdpi', iconSize: 96, adaptiveSize: 216, splashW: 576 },
    { name: 'xxhdpi', iconSize: 144, adaptiveSize: 324, splashW: 864 },
    { name: 'xxxhdpi', iconSize: 192, adaptiveSize: 432, splashW: 1152 },
  ];

  for (const d of densities) {
    const mipmapDir = path.join(APP_DIR, 'android/app/src/main/res', `mipmap-${d.name}`);
    if (fs.existsSync(mipmapDir)) {
      // ic_launcher.png (square / squircle with background)
      {
        const canvas = createCanvas(d.iconSize, d.iconSize);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = CANVAS_COLOR;
        ctx.beginPath();
        ctx.roundRect(0, 0, d.iconSize, d.iconSize, d.iconSize * 0.22);
        ctx.fill();

        const pad = d.iconSize * 0.08;
        ctx.drawImage(rawCanvas, pad, pad, d.iconSize - pad*2, d.iconSize - pad*2);
        fs.writeFileSync(path.join(mipmapDir, 'ic_launcher.png'), canvas.toBuffer('image/png'));
      }

      // ic_launcher_round.png (circular)
      {
        const canvas = createCanvas(d.iconSize, d.iconSize);
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(d.iconSize/2, d.iconSize/2, d.iconSize/2, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = CANVAS_COLOR;
        ctx.fill();

        const pad = d.iconSize * 0.1;
        ctx.drawImage(rawCanvas, pad, pad, d.iconSize - pad*2, d.iconSize - pad*2);
        fs.writeFileSync(path.join(mipmapDir, 'ic_launcher_round.png'), canvas.toBuffer('image/png'));
      }

      // ic_launcher_foreground.png (108, 162, 216, 324, 432)
      {
        const canvas = createCanvas(d.adaptiveSize, d.adaptiveSize);
        const ctx = canvas.getContext('2d');
        const iconSize = Math.round(d.adaptiveSize * 0.58);
        const offset = (d.adaptiveSize - iconSize) / 2;
        ctx.drawImage(rawCanvas, offset, offset, iconSize, iconSize);
        fs.writeFileSync(path.join(mipmapDir, 'ic_launcher_foreground.png'), canvas.toBuffer('image/png'));
      }

      // ic_launcher_background.png
      {
        const canvas = createCanvas(d.adaptiveSize, d.adaptiveSize);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = CANVAS_COLOR;
        ctx.fillRect(0, 0, d.adaptiveSize, d.adaptiveSize);
        fs.writeFileSync(path.join(mipmapDir, 'ic_launcher_background.png'), canvas.toBuffer('image/png'));
      }

      // ic_launcher_monochrome.png
      {
        const monoImg = await loadImage(path.join(APP_DIR, 'assets/images/android-icon-monochrome.png'));
        const canvas = createCanvas(d.adaptiveSize, d.adaptiveSize);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(monoImg, 0, 0, d.adaptiveSize, d.adaptiveSize);
        fs.writeFileSync(path.join(mipmapDir, 'ic_launcher_monochrome.png'), canvas.toBuffer('image/png'));
      }
      console.log(`Updated Android mipmap-${d.name}`);
    }

    // drawable splashscreen_logo.png
    const drawableDir = path.join(APP_DIR, 'android/app/src/main/res', `drawable-${d.name}`);
    if (fs.existsSync(drawableDir)) {
      const canvas = createCanvas(d.splashW, d.splashW);
      const ctx = canvas.getContext('2d');
      const iconSize = Math.round(d.splashW * 0.72);
      const offset = (d.splashW - iconSize) / 2;
      ctx.drawImage(rawCanvas, offset, offset, iconSize, iconSize);
      fs.writeFileSync(path.join(drawableDir, 'splashscreen_logo.png'), canvas.toBuffer('image/png'));
      console.log(`Updated Android drawable-${d.name}/splashscreen_logo.png`);
    }
  }

  // 11. Update Website Public Assets
  if (fs.existsSync(WEBSITE_DIR)) {
    console.log('Updating website public assets...');
    const webImgDir = path.join(WEBSITE_DIR, 'public/assets/images');
    if (!fs.existsSync(webImgDir)) fs.mkdirSync(webImgDir, { recursive: true });

    // website icon.png (512x512)
    {
      const canvas = createCanvas(512, 512);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(rawCanvas, 32, 32, 448, 448);
      fs.writeFileSync(path.join(webImgDir, 'icon.png'), canvas.toBuffer('image/png'));
      fs.writeFileSync(path.join(webImgDir, 'navbar-logo.png'), canvas.toBuffer('image/png'));
      fs.writeFileSync(path.join(WEBSITE_DIR, 'public/favicon.ico'), canvas.toBuffer('image/png'));
    }

    // website logo.png & logo-badge.jpg
    fs.copyFileSync(path.join(APP_DIR, 'assets/images/logo.png'), path.join(webImgDir, 'logo.png'));
    fs.copyFileSync(path.join(APP_DIR, 'assets/images/logo.png'), path.join(WEBSITE_DIR, 'public/logo.png'));
    fs.copyFileSync(MASTER_IMAGE_PATH, path.join(webImgDir, 'logo-badge.jpg'));

    // website feature graphic
    fs.copyFileSync(
      path.join(APP_DIR, 'assets/images/play-store-feature-graphic.png'),
      path.join(webImgDir, 'play-store-feature-graphic.png')
    );

    console.log('Website assets successfully updated!');
  }

  console.log('\nAll brand assets successfully generated from master logo!');
}

main().catch(console.error);
