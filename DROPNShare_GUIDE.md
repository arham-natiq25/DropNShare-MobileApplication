# DropNShare - Complete Learning Guide

This guide explains everything created in the DropNShare app, how it works, and where to place icons and assets. Perfect for React Native beginners!

---

## 📁 Project Structure Overview

```
DropNShare/
├── app/                    # Screens & routes (Expo Router)
│   ├── _layout.tsx         # Root layout (ThemeProvider, Splash, Stack)
│   ├── index.tsx           # Landing page (main page without login)
│   ├── global.css          # Tailwind/NativeWind global styles
│   └── (auth)/             # Auth group - routes: /login, /signup
│       ├── _layout.tsx     # Auth layout (Stack)
│       ├── login.tsx       # Login screen (design only)
│       └── signup.tsx      # Sign up screen (design only)
│
├── components/             # Reusable UI components
│   ├── auth/               # Auth-specific components
│   │   ├── auth-card.tsx       # Card container for login/signup forms
│   │   ├── auth-header.tsx     # Logo + theme toggle for auth screens
│   │   └── auth-input.tsx      # Styled text input for forms
│   ├── main/               # Main/landing page components
│   │   ├── feature-card.tsx    # Small feature highlight cards
│   │   ├── main-header.tsx     # Header with nav, Login, Sign up
│   │   └── process-card.tsx    # Share safely + Upload/Zip/Share steps
│   └── ui/                 # Generic UI components
│       ├── gradient-button.tsx # Purple-blue gradient button
│       ├── logo.tsx            # DropNShare logo (paper plane + text)
│       └── theme-toggle.tsx    # Sun/Moon icon to switch theme
│
├── contexts/
│   └── ThemeContext.tsx    # Theme state (light/dark/system)
│
├── constants/
│   └── theme.ts            # Colors for light and dark mode
│
├── hooks/
│   └── use-theme-colors.ts # Hook to get colors for current theme
│
├── assets/                 # Images, icons, fonts
│   └── images/
│       ├── icon.png            # App icon
│       ├── splash-icon.png     # Splash screen image
│       └── ...
│
└── app.json                # Expo config (splash, icons)
```

---

## 🎯 What Each Part Does

### 1. **Root Layout** (`app/_layout.tsx`)

- **ThemeProvider**: Wraps the app so any screen can access theme (light/dark/system)
- **SplashScreen**: Keeps the splash visible until the app is ready, then hides it
- **Stack**: Defines navigation – index (/) and (auth) group (/login, /signup)
- **StatusBar**: Updates bar style based on theme (light text on dark, dark text on light)

**Key concept**: The root layout is the first thing that loads. It provides global context (theme) to all child screens.

---

### 2. **Theme System** (`contexts/ThemeContext.tsx` + `hooks/use-theme-colors.ts`)

**How it works**:
- `ThemeProvider` stores `themeMode`: `'light' | 'dark' | 'system'`
- When `'system'`, it uses the device's preference (from `useColorScheme()`)
- `resolvedTheme` is always `'light'` or `'dark'` – the actual theme being used
- `useThemeColors()` returns the color object for the current theme

**Theme toggle**: Tap the sun (in dark mode) or moon (in light mode) to switch. It cycles between light and dark. On first load, the app uses the system theme.

---

### 3. **Auth Layout** (`app/(auth)/_layout.tsx`)

- Groups login and signup screens
- Uses a Stack navigator (no header – we use custom `AuthHeader`)
- Routes: `/login` and `/signup`

**Key concept**: The `(auth)` folder creates a route group. The parentheses mean it doesn't add to the URL – so `(auth)/login.tsx` → `/login`, not `/(auth)/login`.

---

### 4. **Login Screen** (`app/(auth)/login.tsx`)

**Design only** – no authentication logic yet.

- Background gradient (light purple in light mode, dark blue in dark mode)
- `AuthHeader`: Logo + theme toggle
- `AuthCard`: White/dark card with form
- `AuthInput`: Email and Password fields
- `GradientButton`: "Login" button
- Link to Sign up

**Components used**: `AuthHeader`, `AuthCard`, `AuthInput`, `GradientButton`

---

### 5. **Signup Screen** (`app/(auth)/signup.tsx`)

Same structure as login, but with:
- Full name, Email, Password, Confirm fields
- "Create account" button with person-add icon
- Link to Login

---

### 6. **Landing Page** (`app/index.tsx`)

Main page **without** login – the home page.

- **MainHeader**: Logo, Home, Upload, Login, Sign up, theme toggle
- **Hero**: "Drop files. Share a link. Done." + feature badge
- **CTA buttons**: "Start uploading" (gradient) and "Create account" (outline)
- **Feature cards**: Multi-file upload, Instant link, Modern UI
- **Process card**: Share safely + Upload, Zip, Share steps
- **Footer**: © 2026 DropNShare, Portfolio, Email links

---

### 7. **Reusable Components Explained**

| Component | Purpose | Where used |
|-----------|---------|------------|
| **Logo** | Paper plane icon + "DropNShare" text | Header, splash (via app icon) |
| **ThemeToggle** | Sun/Moon button to switch theme | Main header, auth header |
| **GradientButton** | Purple-blue gradient or outline button | Login, Sign up, Start uploading, Create account |
| **AuthCard** | Rounded card for auth forms | Login, Signup |
| **AuthInput** | Styled text input with label | Login, Signup |
| **FeatureCard** | Small card with icon, title, description | Landing page |
| **ProcessCard** | Large card with steps | Landing page |

---

## 📂 Where to Place Icons and Assets

### **Images** → `assets/images/`

| File | Purpose |
|------|---------|
| `icon.png` | App icon (home screen) |
| `splash-icon.png` | Splash screen logo – **replace with your DropNShare logo** |
| `favicon.png` | Web favicon |
| `android-icon-*.png` | Android adaptive icon variants |

### **Icons** (Optional folder) → `assets/icons/`

For custom SVG or PNG icons not in MaterialIcons:

```
assets/
└── icons/
    ├── logo.svg          # Custom DropNShare logo
    ├── paper-plane.svg   # Paper airplane for logo
    ├── sun.svg           # Theme toggle (light mode)
    └── moon.svg          # Theme toggle (dark mode)
```

**Currently**: The app uses `@expo/vector-icons/MaterialIcons` – no extra files needed. Icons like `send`, `wb-sunny`, `dark-mode`, `cloud-upload` come from this package.

### **Fonts** (Optional) → `assets/fonts/`

If you add custom fonts:

```
assets/
└── fonts/
    ├── Inter-Bold.ttf
    └── Inter-Regular.ttf
```

Load them with `expo-font` in `_layout.tsx`.

---

## 🎨 How Themes Work

1. **constants/theme.ts**: Defines `Colors.light` and `Colors.dark` – text, background, card, input, etc.
2. **ThemeContext**: Stores user preference (`light` / `dark` / `system`) and computes `resolvedTheme`
3. **useThemeColors()**: Returns `Colors.light` or `Colors.dark` based on `resolvedTheme`
4. Components use `useThemeColors()` to style themselves – no hardcoded colors

**Example**:
```tsx
const colors = useThemeColors();
<View style={{ backgroundColor: colors.background }}>
  <Text style={{ color: colors.text }}>Hello</Text>
</View>
```

---

## 🧭 Navigation Flow

- **/** → Landing page (`app/index.tsx`)
- **/login** → Login screen (`app/(auth)/login.tsx`)
- **/signup** → Signup screen (`app/(auth)/signup.tsx`)

**To navigate**:
```tsx
import { Link, useRouter } from 'expo-router';

// Using Link (for pressable text/buttons)
<Link href="/(auth)/login">Login</Link>

// Using router (for custom onPress)
const router = useRouter();
router.push('/(auth)/signup');
```

---

## 🚀 Splash Screen

- **Config**: `app.json` → `expo-splash-screen` plugin
- **Colors**: Light `#F5F3FF`, Dark `#0F0D23`
- **Image**: `assets/images/splash-icon.png` – replace with your logo
- **Behavior**: Shown on launch, hidden in `_layout.tsx` when the app is ready

---

## 📝 Next Steps (When You Add Functionality)

1. **Auth logic**: Add state for email/password, API calls for login/signup
2. **Upload**: Implement file picker and upload flow
3. **Protected routes**: Redirect to login if not authenticated
4. **System theme**: Already supported – `themeMode: 'system'` uses device setting

---

## 🔧 Key React Native Concepts Used

- **View**: Container (like `<div>`)
- **Text**: All text must be inside `<Text>`
- **Pressable**: For tap interactions (replaces TouchableOpacity)
- **ScrollView**: Scrollable content
- **StyleSheet / style prop**: Inline styles or `StyleSheet.create()`
- **LinearGradient**: From `expo-linear-gradient` – gradient backgrounds

---

## 📦 Key Packages

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based routing |
| `expo-linear-gradient` | Gradient buttons/backgrounds |
| `@expo/vector-icons` | MaterialIcons, etc. |
| `nativewind` | Tailwind-like styling (className) |
| `expo-splash-screen` | Splash screen control |

---

Enjoy learning! 🎉
