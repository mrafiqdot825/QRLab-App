const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('/opt/homebrew/lib/node_modules/goldie/node_modules/@napi-rs/canvas');

const WIDTH = 1024;
const HEIGHT = 500;
const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

async function generate() {
  const iconPath = path.resolve(__dirname, '../assets/images/icon.png');
  const iconImg = await loadImage(iconPath);

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

  ctx.font = '500 15px system-ui, -apple-system, sans-serif';
  bullets.forEach((bullet, index) => {
    const by = 276 + index * 32;
    ctx.fillStyle = '#E2A4CD';
    ctx.beginPath();
    ctx.arc(86, by - 4, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#EFE6EC';
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
  const iconCardSize = 250;
  ctx.shadowColor = 'transparent';
  ctx.drawImage(iconImg, -iconCardSize / 2, cardY + 20, iconCardSize, iconCardSize);

  ctx.fillStyle = '#4A0F3A';
  ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('QRLab Studio', 0, cardY + cardH - 44);

  ctx.fillStyle = '#6B6468';
  ctx.font = '12px system-ui, -apple-system, sans-serif';
  ctx.fillText('Custom 3D & Vector Exports', 0, cardY + cardH - 24);

  ctx.restore();

  const outPath = path.resolve(__dirname, '../assets/images/play-store-feature-graphic.png');
  fs.writeFileSync(outPath, canvas.toBuffer('image/png'));
  console.log(`Generated Play Store Feature Graphic at: ${outPath} (${WIDTH}x${HEIGHT})`);
}

generate().catch(console.error);
