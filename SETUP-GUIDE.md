# DropNShare – Step-by-Step Setup Guide (Beginner)

This guide walks you through setting up the **DropNShare** React Native (Expo) app with **NativeWind** (Tailwind for React Native), **Metro** bundler, and everything you need to run the app. Do each step in order.

---

## Part 1: Prerequisites (Do This First)

### Step 1.1 – Install Node.js

1. Go to [https://nodejs.org](https://nodejs.org).
2. Download the **LTS** version (e.g. 20.x or 22.x).
3. Run the installer and follow the prompts (default options are fine).
4. **Verify:** Open a new terminal/PowerShell and run:
   ```bash
   node -v
   npm -v
   ```
   You should see version numbers (e.g. `v20.x.x` and `10.x.x`).

### Step 1.2 – Install a Code Editor (Optional)

- You’re likely using **Cursor** or **VS Code** already. That’s enough.

### Step 1.3 – Install Expo Go on Your Phone (For Testing)

- **Android:** Install “Expo Go” from Google Play Store.  
- **iOS:** Install “Expo Go” from the App Store.

### Step 1.4 – For Android Emulator / Device (Optional)

- **Android Studio:** [https://developer.android.com/studio](https://developer.android.com/studio)  
  - During setup, install **Android SDK** and at least one **Virtual Device**.
- **Physical Android:** Enable **Developer options** and **USB debugging**, then connect via USB.

### Step 1.5 – For iOS Simulator (Mac Only)

- Install **Xcode** from the Mac App Store.
- Open Xcode once and accept the license; it will install simulators.

---

## Part 2: Open the Project and Install Base Dependencies

### Step 2.1 – Open the Project Folder in Terminal

1. Open **PowerShell** or **Command Prompt**.
2. Go to the DropNShare project folder:
   ```bash
   cd "d:\Mobile Application\DropNShare Mobile Application\DropNShare"
   ```
   (Use your actual path if it’s different.)

### Step 2.2 – Install All Dependencies

1. In the same folder, run:
   ```bash
   npm install
   ```
2. Wait until it finishes (no red errors).
3. This installs **React Native**, **Expo**, **expo-router**, **Metro** (used by Expo), and other packages from `package.json`.

### Step 2.3 – Check That the App Runs (No NativeWind Yet)

1. Start the dev server:
   ```bash
   npm start
   ```
2. You should see a **QR code** in the terminal and the **Expo Dev Tools** in the browser.
3. **On phone:** Open **Expo Go**, scan the QR code, and the app should load.
4. **On Android emulator:** In the terminal press `a` to open Android.
5. **On iOS simulator (Mac):** Press `i` to open iOS.
6. Stop the server with `Ctrl + C` when done.

If this works, your base **Expo + Metro** setup is correct. Next we add **NativeWind**.

---

## Part 3: Install and Configure NativeWind (Tailwind for React Native)

Do these steps in order. Your project uses **Expo SDK 54**, so we use the **SDK 50+** style config.

### Step 3.1 – Install NativeWind and Tailwind

In the project folder (`DropNShare`), run:

```bash
npx expo install nativewind@^4.0.1 tailwindcss
```

- You already have `react-native-reanimated` in the project, so you don’t need to install it again.
- If you’re on **Mac** and plan to run iOS, also run:
  ```bash
  npx pod-install
  ```
  (On Windows you can skip this.)

### Step 3.2 – Create Tailwind Config

1. Create the Tailwind config file by running:
   ```bash
   npx tailwindcss init
   ```
2. Open the new file **`tailwind.config.js`** in the **root** of the `DropNShare` folder (same level as `package.json`).
3. Replace its contents with:

   ```js
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
     presets: [require("nativewind/preset")],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

4. Save the file.  
   - The `content` array tells Tailwind which files to scan for class names. You can add more paths later (e.g. `./screens/**/*.{js,jsx,ts,tsx}`) if you create new folders.

### Step 3.3 – Create Global CSS File

1. In the **root** of `DropNShare` (same level as `package.json`), create a new file named **`global.css`**.
2. Put exactly this inside:

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. Save the file.

### Step 3.4 – Add Babel Preset (For NativeWind)

1. In the **root** of `DropNShare`, create a file named **`babel.config.js`** (if it doesn’t exist).
2. Put this inside:

   ```js
   module.exports = function (api) {
     api.cache(true);
     return {
       presets: [
         ["babel-preset-expo", { jsxImportSource: "nativewind" }],
         "nativewind/babel",
       ],
     };
   };
   ```

3. Save the file.  
   - This tells Babel (and Metro) to use NativeWind’s preset. For Expo SDK 50+, you don’t need to add `expo-router/babel` or `react-native-reanimated/plugin` here; Expo handles them.

### Step 3.5 – Create Metro Config (For NativeWind + Metro)

1. In the **root** of `DropNShare`, create a file named **`metro.config.js`**.
2. Put this inside:

   ```js
   const { getDefaultConfig } = require("expo/metro-config");
   const { withNativeWind } = require("nativewind/metro");

   const config = getDefaultConfig(__dirname);

   module.exports = withNativeWind(config, { input: "./global.css" });
   ```

3. Save the file.  
   - This wires **Metro** (the bundler Expo uses) to **NativeWind** and your `global.css`.

### Step 3.6 – Import Global CSS in the Root Layout

1. Open **`app/_layout.tsx`**.
2. At the **very top** of the file (before other imports), add:
   ```ts
   import "../global.css";
   ```
3. Keep all your existing imports and the rest of the file unchanged. Save.

### Step 3.7 – TypeScript Support for NativeWind (Optional but Recommended)

1. In the **root** of `DropNShare`, create a file **`nativewind-env.d.ts`**.
2. Put this inside:

   ```ts
   /// <reference types="nativewind/types" />
   ```

3. Save.  
   - This helps TypeScript understand the `className` prop and avoids type errors when you use Tailwind classes.

---

## Part 4: Run the App and Test NativeWind

### Step 4.1 – Clear Cache and Start

1. In the project folder, run:
   ```bash
   npx expo start --clear
   ```
   The `--clear` flag clears Metro’s cache, which is important after adding NativeWind.
2. Open the app on your device or emulator (scan QR code or press `a` / `i`).

### Step 4.2 – Try a NativeWind Style

1. Open **`app/(tabs)/index.tsx`** (or any screen).
2. On a component that supports `className` (e.g. a `<View>` from React Native), add:
   ```tsx
   <View className="flex-1 bg-blue-500 p-4">
     <Text className="text-white text-xl">Hello NativeWind!</Text>
   </View>
   ```
3. Save. The app should reload and show a blue background and white text.

If you see the styles, **NativeWind and Metro are set up correctly.**

---

## Part 5: Quick Reference – What You Have Now

| Item            | Purpose |
|-----------------|--------|
| **Node.js**     | Runs JavaScript and npm. |
| **npm**         | Installs packages (`package.json`). |
| **Expo**        | React Native framework and tooling. |
| **Metro**       | Bundles your JS/TS and assets (used by Expo). |
| **expo-router** | File-based routing (`app/` folder). |
| **NativeWind**  | Tailwind CSS for React Native (`className`). |
| **Tailwind**    | Generates utility classes used by NativeWind. |
| **global.css**  | Entry point for Tailwind (base, components, utilities). |
| **babel.config.js** | Tells Babel to use NativeWind. |
| **metro.config.js** | Tells Metro to process CSS and NativeWind. |
| **tailwind.config.js** | Tells Tailwind which files to scan and which preset to use. |

---

## Part 6: Common Commands

Run these from the **DropNShare** folder (where `package.json` is):

| Command | What it does |
|--------|----------------|
| `npm install` | Install or update dependencies. |
| `npm start` | Start Expo dev server (Metro). |
| `npx expo start --clear` | Start with cache cleared (use after config changes). |
| `npm run android` | Start and open on Android. |
| `npm run ios` | Start and open on iOS (Mac only). |
| `npm run web` | Run in the browser. |
| `npm run lint` | Run ESLint. |

---

## Part 7: If Something Goes Wrong

1. **“Cannot find module 'nativewind/metro'”**  
   - Run `npm install` again and make sure `nativewind` is in `node_modules`.  
   - Confirm `metro.config.js` is in the project root and has the correct `withNativeWind` setup.

2. **Styles don’t apply / no Tailwind classes**  
   - Ensure **`import "../global.css"`** is at the top of **`app/_layout.tsx`**.  
   - Run **`npx expo start --clear`** and reload the app.  
   - Check that **`tailwind.config.js`** `content` paths include the file you’re editing (e.g. `./app/**/*.{js,jsx,ts,tsx}`).

3. **Metro or Babel errors**  
   - Double-check **`babel.config.js`** and **`metro.config.js`** for typos and that they’re in the **root** of `DropNShare`.  
   - Delete **`node_modules`** and run **`npm install`** again, then **`npx expo start --clear`**.

4. **Expo / React Native version issues**  
   - Prefer installing Expo-related packages with:
     ```bash
     npx expo install <package-name>
     ```
     so versions stay compatible with your Expo SDK.

---

## Summary Checklist

- [ ] Node.js and npm installed and working.
- [ ] Cloned/opened DropNShare project and ran `npm install`.
- [ ] Confirmed app runs with `npm start` (without NativeWind).
- [ ] Installed NativeWind and Tailwind: `npx expo install nativewind@^4.0.1 tailwindcss`.
- [ ] Created and configured `tailwind.config.js` (with `content` and `nativewind/preset`).
- [ ] Created `global.css` with `@tailwind base; components; utilities;`.
- [ ] Created `babel.config.js` with NativeWind preset.
- [ ] Created `metro.config.js` with `withNativeWind` and `input: "./global.css"`.
- [ ] Added `import "../global.css"` in `app/_layout.tsx`.
- [ ] (Optional) Created `nativewind-env.d.ts` for TypeScript.
- [ ] Ran `npx expo start --clear` and tested a Tailwind class on a component.

Once all steps are done, you have the DropNShare React Native app set up with **NativeWind** for styles and **Metro** (via Expo) for bundling. You can follow this guide step by step as a beginner; if you get stuck, use the “If Something Goes Wrong” section and the checklist to narrow down the issue.
