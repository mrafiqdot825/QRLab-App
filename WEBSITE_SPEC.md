# QRLab — Official Website Specification & Content Blueprint

> **Purpose:** Comprehensive product, design system, copywriting, and architectural blueprint for building the official landing page and web showcase for **QRLab**.

---

## 1. Executive Summary & Brand Positioning

- **Product Name:** QRLab
- **Primary Tagline:** *Scan-Stopping QR Codes Design.*
- **Secondary Subtitle:** *Artistic 3D & Vector QR Maker with 100% On-Device Privacy.*
- **Developer:** Muhammad Rafiq ([Portfolio](https://mrafiq.vercel.app/) | [Email](mailto:mrafiqdot825@gmail.com))
- **Target Audience:** Freelancers, business owners, graphic designers, restaurant managers, event organizers, and developers looking for high-converting, branded QR codes.
- **Core Value Proposition:** Unlike generic black-and-white QR code generators that rely on paid subscriptions, cloud tracking, and low-res pixelated images, QRLab offers artistic module styling, eye customization, curated luxury palettes, and infinite-resolution vector SVG exports—generated 100% privately on device.

---

## 2. Design System & Visual Identity

### A. Color Palette
| Token | Hex Code | Usage |
|---|---|---|
| **Canvas Background** | `#F4F8FC` / `#F0F8FF` | Page body background (Alice Blue tint) |
| **Surface Card** | `#FFFFFF` | Hero cards, feature cards, modal dialogs |
| **Surface Subtle** | `#EBF3FC` | Badge pills, secondary tags, code blocks |
| **Primary Navy** | `#0E1B2A` | Major titles, headings, high-contrast text |
| **Steel Blue (Brand Accent)** | `#3E6FA6` | Buttons, highlighted links, primary brand icon |
| **Royal Indigo / Accent** | `#635BFF` | Interactive FAB, highlights, CTA gradients |
| **Text Muted / Subtitle** | `#5A6A7D` | Paragraphs, captions, secondary descriptors |
| **Border / Divider** | `#E2E8F0` | Card borders, dividers, subtle outlines |

### B. Curated Theme Presets
Use these gradient definitions for interactive website widgets and swatch switchers:
- **Ocean Blue:** `#F0F8FF` → `#E3F2FD` → `#BBDEFB` (Accent: `#1E40AF`)
- **Aurora:** `#F0FDF4` → `#F4F8FC` → `#E0F2FE` (Accent: `#059669`)
- **Luxury Gold:** `#FFFBEB` → `#FEF3C7` → `#FDE68A` (Accent: `#D97706`)
- **Sunset:** `#FFF7ED` → `#FFEDD5` → `#FED7AA` (Accent: `#EA580C`)
- **Lavender:** `#FAF5FF` → `#F3E8FF` → `#E9D5FF` (Accent: `#7C3AED`)
- **Minimal White:** `#FFFFFF` → `#F8FAFC` → `#F1F5F9` (Accent: `#1E2A38`)

### C. Typography
- **Primary Headings:** `Google Sans`, `SF Pro Display`, or `Inter` (Font-weight: 800 / 700, letter-spacing: `-0.02em`)
- **Body & Subtitles:** `Inter`, `Roboto`, or system-ui (Font-weight: 400 / 500, line-height: `1.6`)
- **Monospace (Data & Payloads):** `JetBrains Mono`, `DM Mono`, or `Fira Code`

---

## 3. Website Information Architecture

```
/ (Landing Page Root)
├── 1. Sticky Navigation Bar
├── 2. Hero Section (Headline, CTA, Interactive Live QR Preview Widget)
├── 3. Social Proof & Metric Strip (6+ Types, Infinite Vector, 100% Private)
├── 4. Visual Customization Showcase (Module Shapes, Eye Styles, Badges)
├── 5. Supported Data Formats Grid (URL, Wi-Fi, vCard, Email, Phone, Text)
├── 6. Curated Designer Templates Gallery (Filterable Tabs)
├── 7. Vector Export & Print Quality Section (SVG vs PNG comparison)
├── 8. Privacy & Offline Safety Guarantee (Zero Cloud, Zero Tracking)
├── 9. Built-in Optical Scanner Highlight
├── 10. Frequently Asked Questions (Accordion)
├── 11. Final Download / App Store CTA Banner
└── 12. Footer (Governance, Privacy Policy, Developer Portfolio, GitHub)
```

---

## 4. Section-by-Section Copy & Layout Blueprint

### Section 1: Navigation Bar
- **Brand Logo:** Icon + `QRLab`
- **Nav Links:** `Features`, `Templates`, `Customization`, `Privacy`, `FAQ`
- **Action Button:** `Get App on Play Store` (opens Google Play or direct download)

---

### Section 2: Hero Section
- **Badge Pill:** `✨ NEXT-GEN QR MAKER • VERSION 2.0`
- **Headline (H1):**
  > **Scan-Stopping QR Codes.**  
  > **Designed in Seconds.**
- **Subheadline:**
  > Craft high-converting, on-brand QR codes with live interactive preview, custom shapes, luxury palettes, and infinite-resolution vector SVG exports. Free, offline, and 100% private.
- **CTAs:**
  - **Primary CTA:** `Download for Android` (with Google Play badge icon)
  - **Secondary CTA:** `Try Live Web Demo ↓` (smooth scrolls to interactive preview)
- **Interactive Hero Visual:**
  - An interactive phone mockup displaying a live generated QR code.
  - Interactive swatch dots that change the QR code foreground tint in real-time when hovered or clicked by the visitor!

---

### Section 3: Trust & Metrics Strip
- **Stat 1:** `6+ Formats` — Full payload support (URL, Wi-Fi, vCard, etc.)
- **Stat 2:** `Vector SVG` — Infinite resolution for print & billboards
- **Stat 3:** `100% On-Device` — Zero servers, zero telemetry, zero risk
- **Stat 4:** `60 FPS Physics` — Fluid, responsive reanimated design

---

### Section 4: Deep Customization Showcase
**Title:** *Craft Your Unique Brand Identity*  
**Subtitle:** *Never settle for plain black modules again. Customize every millimeter.*

| Feature Card | Description | Visual Element |
|---|---|---|
| **Module Shapes** | Switch between sleek Rounded tiles, modern Dots, or crisp classic Squares. | Visual comparison of 3 module variants |
| **Eye Styling** | Redesign the 3 corner locator eyes with Square, Round, or Circle styling. | Macro zoom on corner eye shapes |
| **Brand Badges** | Embed center icons such as Stars, Shields, or custom logos seamlessly. | Badge overlay graphic |
| **Luxury Themes** | Instantly apply pre-configured high-contrast palettes designed by top typographers. | Swatch color palette cards |

---

### Section 5: Supported Data Formats
**Title:** *One Creator. Every QR Use Case.*  
**Subtitle:** *Encode any data payload with optimized barcode encoding for maximum scannability.*

1. **Website & Socials (URL):** Direct users to landing pages, YouTube, Linktree, and portfolios.
2. **Wi-Fi Quick-Connect:** Guests scan to connect instantly without typing complex WPA2 passwords.
3. **Digital vCard (Contacts):** Save name, phone, email, company, and job title straight to phone contacts.
4. **Email Pre-Fill:** Triggers mail app with recipient address, subject line, and body text pre-populated.
5. **Instant Calling (Phone):** Connects clients to support desks, hotlines, and sales agents in one tap.
6. **Plain Text & Notes:** Encode alphanumeric text, serial keys, coupon codes, and private instructions.

---

### Section 6: Curated Designer Templates Gallery
**Title:** *Ready-to-Use Designer Templates*  
**Subtitle:** *Kickstart your design with curated layouts crafted for business, hospitality, and events.*

- **Template 1 — Executive Digital Card:** Polished navy theme with vCard encoding for business cards.
- **Template 2 — Digital Menu Portal:** Warm amber theme for table-top restaurant menus.
- **Template 3 — Design Showcase Link:** Royal purple layout linking to Behance, Dribbble, or GitHub.
- **Template 4 — Interactive CV:** Clean slate gray template for attaching portfolio PDFs to resumes.
- **Template 5 — VIP Pass & RSVP:** Striking coral red layout for tickets, event entry, and coordinates.
- **Template 6 — Cafe Guest Network:** Emerald green Wi-Fi card with one-tap connection.
- **Template 7 — Quick Checkout Pay:** High-converting green layout for payments (PayPal, Stripe, UPI).
- **Template 8 — Multi-Link Hub:** Violet social aggregation hub linking all profiles in one code.

---

### Section 7: Vector Export & Print Quality
**Title:** *From Phone Screen to 50-Foot Billboard.*  
**Subtitle:** *Never worry about blur or pixelation. Your codes scan reliably at any distance.*

- **Infinite SVG Vector Export:** True scalable vector format ready for Adobe Illustrator, Figma, CorelDRAW, and high-volume commercial print houses.
- **Ultra HD 300 DPI PNG:** Export high-density rasters up to 4096 × 4096 pixels with transparent or solid background.
- **Print Safety Calculator:** High error correction code ensures scannability even when printed on curved mugs or textured paper.

---

### Section 8: 100% On-Device Privacy Guarantee
**Title:** *Your Data Never Leaves Your Device.*  
**Subtitle:** *Unlike online QR generators that route your links through suspicious tracking redirects, QRLab is 100% offline.*

- 🛡️ **Zero Cloud Storage:** Everything is processed in-memory and saved in local sandboxed storage.
- 🚫 **No URL Redirects:** Your QR code points directly to your destination URL. No third-party redirect middlemen that can break or expire.
- 🔒 **Zero Telemetry / Zero Ads:** No behavioral tracking, no advertising SDKs, no registration required.

---

### Section 9: Built-in Optical Scanner
- **Fast Real-Time Lens Reader:** Optical barcode scanning with instant action buttons.
- **Torch / Flash Support:** Scan in low-light environments with flashlight toggle.
- **History & Re-Export:** Instantly re-open or edit any scanned payload.

---

### Section 10: Frequently Asked Questions (FAQ)

1. **Do the QR codes generated by QRLab expire?**  
   *No. All QR codes generated are static standard QR codes. They never expire and will work forever as long as your destination link or data remains valid.*
2. **Are there any limits on how many QR codes I can create?**  
   *None. You can generate, customize, and export unlimited QR codes with zero restrictions.*
3. **Can I use the exported QR codes for commercial projects?**  
   *Yes. You hold 100% full commercial and personal rights to all exported files (PNG and SVG).*
4. **Is an internet connection required to create QR codes?**  
   *No. QRLab is fully offline-capable. You can design, customize, and export QR codes completely in airplane mode.*
5. **How does QRLab protect my sensitive data like Wi-Fi passwords?**  
   *Your Wi-Fi keys and personal info are encoded locally into optical patterns on your device. We have no servers, so nothing is ever transmitted or logged.*

---

### Section 11: Call-to-Action (CTA) Banner
- **Heading:** *Ready to Create Scan-Stopping QR Codes?*
- **Subhead:** *Download QRLab today. Fast, free, and completely private.*
- **Button:** `Download on Google Play`
- **Direct APK / Release Link:** Optional GitHub Releases button.

---

### Section 12: Footer
- **Branding:** QRLab by Muhammad Rafiq.
- **Links:**
  - Privacy Policy (`/privacy-policy.html` or direct GitHub link)
  - GitHub Repository (`https://github.com/mrafiqdot825/QR-Studio`)
  - Developer Portfolio (`https://mrafiq.vercel.app/`)
  - Support Email (`mrafiqdot825@gmail.com`)
- **Copyright Notice:** `© 2026 QRLab. Engineered with React Native & Expo.`

---

## 5. Media & Asset Reference Guide

Use these assets located within the project repository when assembling the website:

| Asset Name | Repository Path | Dimensions / Format | Website Usage |
|---|---|---|---|
| **App Icon** | [`assets/images/icon.png`](file:///Users/muhammadrafiq/Desktop/QR%20Studio/assets/images/icon.png) | 1024 × 1024 PNG | Website Favicon, Nav Logo, Hero icon |
| **Play Store Feature Graphic** | [`assets/images/play-store-feature-graphic.png`](file:///Users/muhammadrafiq/Desktop/QR%20Studio/assets/images/play-store-feature-graphic.png) | 1024 × 500 PNG | Social OpenGraph banner (`og:image`) |
| **Hero Phone Mockup** | [`goldie/out/screenshots/pixel-10-pro/en-US/01-home.png`](file:///Users/muhammadrafiq/Desktop/QR%20Studio/goldie/out/screenshots/pixel-10-pro/en-US/01-home.png) | 1080 × 1920 PNG | Hero section device frame mockup |
| **Studio Mockup** | [`goldie/out/screenshots/pixel-10-pro/en-US/02-studio.png`](file:///Users/muhammadrafiq/Desktop/QR%20Studio/goldie/out/screenshots/pixel-10-pro/en-US/02-studio.png) | 1080 × 1920 PNG | Generator & Live Preview feature card |
| **Customization Mockup** | [`goldie/out/screenshots/pixel-10-pro/en-US/03-customize.png`](file:///Users/muhammadrafiq/Desktop/QR%20Studio/goldie/out/screenshots/pixel-10-pro/en-US/03-customize.png) | 1080 × 1920 PNG | Module shape & eye styling showcase |
| **Templates Mockup** | [`goldie/out/screenshots/pixel-10-pro/en-US/04-explore.png`](file:///Users/muhammadrafiq/Desktop/QR%20Studio/goldie/out/screenshots/pixel-10-pro/en-US/04-explore.png) | 1080 × 1920 PNG | Curated Template gallery section |
| **Settings / Privacy Mockup** | [`goldie/out/screenshots/pixel-10-pro/en-US/05-settings.png`](file:///Users/muhammadrafiq/Desktop/QR%20Studio/goldie/out/screenshots/pixel-10-pro/en-US/05-settings.png) | 1080 × 1920 PNG | Privacy & governance security guarantee |
| **Privacy Policy Page** | [`privacy-policy.html`](file:///Users/muhammadrafiq/Desktop/QR%20Studio/privacy-policy.html) | Standalone HTML | Direct legal policy page |

---

## 6. Recommended Web Tech Stack

When creating the website, any of these approaches will yield optimal speed and visual fidelity:
1. **Option A (Fastest Single-Page Site):** HTML5 + Tailwind CSS + Vanilla JS (can be hosted on GitHub Pages or Vercel in 1 file).
2. **Option B (Modern React / Next.js):** Next.js 15 (App Router) + Tailwind CSS + Framer Motion for smooth scroll animations.
3. **Option C (Astro):** Astro + Tailwind CSS for zero-JS ultra-fast static output.

---

## 7. SEO & Open Graph Metadata

```html
<!-- Primary Meta Tags -->
<title>QRLab — Artistic 3D & Vector QR Code Maker</title>
<meta name="title" content="QRLab — Artistic 3D & Vector QR Code Maker">
<meta name="description" content="Craft scan-stopping, custom branded QR codes with live interactive preview, custom shapes, luxury palettes, and infinite vector SVG export. 100% private & offline.">
<meta name="keywords" content="QR code maker, custom QR code generator, vector QR SVG, branded QR codes, Wi-Fi QR, vCard QR, offline QR creator, QRLab">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://mrafiq.vercel.app/qrlab">
<meta property="og:title" content="QRLab — Artistic 3D & Vector QR Code Maker">
<meta property="og:description" content="Design scan-stopping QR codes with custom eye shapes, colors, logo badges, and crystal-clear vector exports. Free & 100% on-device privacy.">
<meta property="og:image" content="https://mrafiq.vercel.app/assets/images/play-store-feature-graphic.png">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:title" content="QRLab — Artistic 3D & Vector QR Code Maker">
<meta property="twitter:description" content="Craft high-converting, on-brand QR codes with vector SVG export and 100% on-device privacy.">
<meta property="twitter:image" content="https://mrafiq.vercel.app/assets/images/play-store-feature-graphic.png">
```

