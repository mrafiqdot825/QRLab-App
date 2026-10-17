const APP_ROOT = "/Users/muhammadrafiq/Desktop/QR Studio/App";

const config = {
  appRoot: APP_ROOT,
  appPath: `${APP_ROOT}/ios/build/Build/Products/Release-iphonesimulator/QRStudio.app`,
  bundleId: "com.rafiqdev.qrstudio",
  devices: ["iphone-6.9", "pixel-10-pro"],
  locales: ["en-US"],
  appearance: "light",
  frame: {
    variant: "17-pro-blue",
  },
  theme: {
    background: "linear-gradient(160deg, #EBF3FC 0%, #F5F8FC 50%, #FFFFFF 100%)",
    headlineColor: "#0E1B2A",
    subheadColor: "#5A6A7D",
    fontFamily: '-apple-system, "SF Pro Display", system-ui, sans-serif',
    copyHeightRatio: 0.22,
    deviceWidthRatio: 0.86,
    template: "editorial",
    layout: "classic",
  },
  store: {
    name: "QRLab",
    subtitle: { "en-US": "Artistic 3D & Vector QR Maker" },
    developer: "Muhammad Rafiq",
    category: "Productivity",
    rating: 4.9,
    ratingCount: "2.4K Ratings",
    ageRating: "4+",
    price: "Free",
    description: {
      "en-US": "Craft scan-stopping, luxury branded QR codes with real-time interactive preview, custom shapes, eye styling, embedded logos, and crystal-clear vector SVG & PNG export. All generation runs 100% privately on your device.",
    },
  },
  scenes: [
    {
      kind: "screenshot",
      id: "home",
      flow: "store-01-home",
      headline: { "en-US": "Design stunning QR codes" },
      subhead: { "en-US": "Next-gen creator with instant live previews and presets." },
    },
    {
      kind: "screenshot",
      id: "studio",
      flow: "store-02-studio",
      headline: { "en-US": "Real-time 3D styling" },
      subhead: { "en-US": "Customize eye shapes, module patterns, and color themes." },
    },
    {
      kind: "screenshot",
      id: "customize",
      flow: "store-03-customize",
      headline: { "en-US": "Craft your brand identity" },
      subhead: { "en-US": "Ocean Blue, Sunset, Aurora, and Luxury Gold palettes." },
    },
    {
      kind: "screenshot",
      id: "explore",
      flow: "store-04-explore",
      headline: { "en-US": "Curated designer templates" },
      subhead: { "en-US": "Ready-to-use luxury layouts for business, dining, and events." },
    },
    {
      kind: "screenshot",
      id: "settings",
      flow: "store-05-settings",
      headline: { "en-US": "Vector exports & total privacy" },
      subhead: { "en-US": "Crystal-clear SVG and PNG rendering 100% on device." },
    },
    {
      kind: "preview",
      id: "preview",
      segments: [
        { id: "home", flow: "store-preview-01-home", holdSeconds: 2 },
        { id: "studio", flow: "store-preview-02-studio", holdSeconds: 2 },
        { id: "explore", flow: "store-preview-03-explore", holdSeconds: 3 },
      ],
    },
  ],
};

export default config;
