# QRLab

**QRLab** is a sleek, modern, cinematic QR Code generator app built with React Native and Expo SDK 57. Featuring liquid glassmorphism, interactive 3D stages, customizable theme presets, instant multi-format exports (PNG/SVG), custom logo embedding, and rich haptic feedback.

---

## Table of Contents

- [QRLab](#qrlab)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Tech Stack](#tech-stack)
  - [Prerequisites](#prerequisites)
  - [Step-by-Step Instructions Flow](#step-by-step-instructions-flow)
    - [1. Clone or Download Repository](#1-clone-or-download-repository)
    - [2. Install Dependencies](#2-install-dependencies)
    - [3. Start the Development Server](#3-start-the-development-server)
    - [4. Launch on Device or Emulator](#4-launch-on-device-or-emulator)
  - [Application Flow \& How to Use](#application-flow--how-to-use)
  - [Project Structure](#project-structure)
  - [Available Scripts](#available-scripts)
  - [Troubleshooting \& Notes](#troubleshooting--notes)
  - [License](#license)

---

## Features

- **Multi-Data QR Generation**: Generate QR codes for URLs, Wi-Fi networks, Plain Text, Contacts (vCard), Emails, SMS, and Phone Numbers.
- **Interactive 3D QR Stage**: Dynamic card preview with responsive lighting, glassmorphism UI, and smooth animations powered by React Native Reanimated.
- **Custom Themes & Styling**: Select from preset color palettes (Cyberpunk, Midnight Neon, Sunset, Glassy White, Obsidian Gold, etc.) or create custom gradient styles.
- **Logo & Design Customization**: Add custom icons/logos inside the QR code center with adjustable error correction levels.
- **Export & Share**: Save high-resolution QR codes directly to device files, or share via native device share sheets.
- **Cross-Platform**: Optimized for iOS, Android, and Web browsers.

---

## Tech Stack

- **Framework**: [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) & [React Native 0.86](https://reactnative.dev/)
- **Routing**: [Expo Router v57](https://docs.expo.dev/router/introduction/) (File-based routing with `src/app`)
- **Animation & FX**: React Native Reanimated 4, Expo Blur, Expo Haptics, Expo Linear Gradient
- **QR Code Rendering**: `react-native-qrcode-svg` & `react-native-svg`
- **Language**: TypeScript 6

---

## Prerequisites

Before starting, ensure you have the following installed on your development machine:

1. **Node.js** (v18.0.0 or higher) - [Download Node.js](https://nodejs.org/)
2. **Package Manager**: `npm` (comes with Node.js) or `yarn` / `pnpm` / `bun`
3. **Expo Go Mobile App** _(Optional for physical device testing)_:
   - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
   - [Android Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
4. **Emulators / Simulators** _(Optional)_:
   - **iOS**: Xcode (Mac required)
   - **Android**: Android Studio & Android Virtual Device (AVD)

---

## Step-by-Step Instructions Flow

Follow these step-by-step instructions to get QRLab up and running:

### 1. Clone or Download Repository

Open your terminal and navigate to your working directory:

```bash
cd "QR Studio"
```

### 2. Install Dependencies

Install all required Node modules:

```bash
npm install
```

### 3. Start the Development Server

Launch the Expo Metro Bundler:

```bash
npx expo start
```

_(Or run `npm start`)_

### 4. Launch on Device or Emulator

Once the terminal bundler menu opens, you can choose how to run the app:

- **Physical Device (Expo Go)**:
  - Open **Expo Go** on Android and scan the QR code printed in terminal.
  - On iOS, open the native **Camera** app, scan the terminal QR code, and tap the link to open in Expo Go.
- **iOS Simulator** (Mac only):
  - Press `i` in the terminal output, or run `npm run ios`.
- **Android Emulator**:
  - Open Android Virtual Device via Android Studio, then press `a` in the terminal output, or run `npm run android`.
- **Web Browser**:
  - Press `w` in the terminal output, or run `npm run web`.

---

## Application Flow & How to Use

```text
┌─────────────────┐      ┌──────────────────┐      ┌────────────────────┐      ┌──────────────────┐
│ 1. Select Type  │ ───► │ 2. Enter Content │ ───► │ 3. Customize Style │ ───► │ 4. Preview/Export│
│ (URL, Wi-Fi...) │      │ (Text, URL, etc) │      │ (Color, Theme, Logo│      │ (Save/Share PNG) │
└─────────────────┘      └──────────────────┘      └────────────────────┘      └──────────────────┘
```

1. **Step 1: Choose QR Type**: Select the payload type from the selector bar (URL, Text, Wi-Fi, Phone, Contact, Email, etc.).
2. **Step 2: Input Details**: Fill in the required fields (e.g. website URL, Wi-Fi SSID & password, or contact information).
3. **Step 3: Customize Style & Theme**:
   - Toggle theme presets to change colors, gradients, and background styles.
   - Adjust logo settings and frame designs.
4. **Step 4: Live 3D Preview & Export**:
   - Interact with the 3D QR Stage to inspect your code.
   - Tap **Save to Files** or **Share** to download the high-definition image.

---

## Project Structure

```text
QR Studio/
├── src/
│   ├── app/                   # Expo Router screens (file-based navigation)
│   │   ├── _layout.tsx        # Root layout & providers
│   │   ├── index.tsx          # Main QR Generator screen
│   │   └── explore.tsx        # Saved history / explore screen
│   ├── components/            # Reusable UI & custom components
│   │   ├── qr-stage-3d.tsx    # 3D interactive QR preview stage
│   │   ├── cinematic-input.tsx# Input controls & form elements
│   │   ├── app-tabs.tsx       # Bottom navigation tabs
│   │   ├── theme-presets-bar.tsx # Preset theme selector
│   │   └── action-buttons-3d.tsx # Export & action buttons
│   ├── constants/             # Application constants & theme tokens
│   ├── hooks/                 # Custom React hooks
│   └── global.css             # Base styles
├── assets/                    # App icons, splash screens, and images
├── scripts/                   # Utility scripts (e.g. project reset)
├── app.json                   # Expo configuration
├── package.json               # Dependencies & scripts
└── tsconfig.json              # TypeScript configuration
```

---

## Available Scripts

In the project directory, you can run:

| Command                 | Description                                            |
| :---------------------- | :----------------------------------------------------- |
| `npm start`             | Starts the Expo Metro development server               |
| `npm run ios`           | Starts Expo dev server and opens iOS Simulator         |
| `npm run android`       | Starts Expo dev server and opens Android Emulator      |
| `npm run web`           | Starts Expo dev server and opens Web browser           |
| `npm run lint`          | Runs ESLint checks across project files                |
| `npm run reset-project` | Resets starter files (moves app code to `app-example`) |

---

## Troubleshooting & Notes

- **Permissions**: Zero unnecessary media permissions required. Saving QR codes uses native system file sharing.
- **Expo SDK Version**: Built for Expo SDK 57 (`v57.0.0`). Check [Expo v57 Docs](https://docs.expo.dev/versions/v57.0.0/) for version-specific guides.
- **Web Compatibility**: Web builds use static rendering support (`expo start --web`). Native haptics fallback gracefully on web browsers.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

npm install --global eas-cli
eas init --id e89ca11f-3417-4cfa-8aa0-cfb262b63014
