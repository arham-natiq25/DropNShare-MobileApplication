# DropNShare – Complete Guide

This guide explains what each part of the app does, what libraries/components are used and why, how styling works, file structure, and how API calls, `useEffect`, and auth flow are wired.

---

## 1. What is `<Text>` and why is it used? How are styles applied?

### `<Text>` (React Native)

- **What it is:** In React Native there is no HTML. You cannot use `<p>`, `<span>`, or `<h1>`. **`<Text>`** is the component for any readable text. Everything that should be visible as text must be inside `<Text>` (or a component that renders it).
- **Why use it:** So that text is rendered correctly on iOS, Android, and Web. Native and web implementations map `<Text>` to the right platform primitives.
- **Styling:** You pass a `style` prop, usually an object. React Native uses a subset of CSS-like layout (flexbox by default). There is no class name string like in the web; you use JavaScript objects.

**Example:**

```tsx
<Text
  style={{
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  }}>
  Welcome back
</Text>
```

- **`fontSize`** – number (logical pixels).
- **`fontWeight`** – e.g. `'400'`, `'600'`, `'800'`.
- **`color`** – text color (hex or theme value).
- **`letterSpacing`** – spacing between characters.

Other common props: `numberOfLines`, `onPress` (to make text tappable). Styles are **camelCase** (e.g. `fontSize`, not `font-size`).

---

## 2. Other core UI primitives and why they’re used

| Component   | Role |
|------------|------|
| **`<View>`** | Container for layout. Like `<div>`. No text inside unless wrapped in `<Text>`. Used for flexbox (rows, columns, spacing). |
| **`<ScrollView>`** | Scrollable area. `contentContainerStyle` styles the inner content; `style` styles the scroll view itself. |
| **`<Pressable>`** | Tappable area. `onPress`, and `style` can be a function `({ pressed }) => ({ ... })` to show press state. |
| **`<TextInput>`** | Single-line or multi-line text input. Used in `AuthInput` for email/password. |
| **`LinearGradient`** (expo-linear-gradient) | Fills a region with a gradient. Used on auth and upload screens for background. |

---

## 3. File structure (high level)

```
DropNShare/
├── app/                    # Routes (Expo Router = file-based routing)
│   ├── _layout.tsx         # Root layout: ThemeProvider, AuthProvider, Stack
│   ├── index.tsx           # Landing (hero, feature cards, Try now, sidebar)
│   ├── upload.tsx          # Upload screen (picker + API upload)
│   └── (auth)/             # Auth group (no segment in URL)
│       ├── _layout.tsx
│       ├── login.tsx
│       └── signup.tsx
├── components/
│   ├── auth/               # Auth UI
│   │   ├── auth-card.tsx
│   │   ├── auth-header.tsx
│   │   └── auth-input.tsx  # Reusable labeled input (value, onChangeText)
│   ├── main/
│   │   ├── app-sidebar.tsx
│   │   ├── feature-card.tsx
│   │   └── process-card.tsx
│   └── ui/
│       ├── gradient-button.tsx
│       └── logo.tsx
├── constants/
│   └── theme.ts            # GRADIENT_COLORS, Colors (light/dark)
├── contexts/
│   ├── ThemeContext.tsx    # Theme (light/dark/system)
│   └── AuthContext.tsx     # user, login(), register(), logout()
├── hooks/
│   └── use-theme-colors.ts # Maps theme to colors (text, background, etc.)
├── lib/
│   └── api.ts              # API client + token storage (AsyncStorage)
└── package.json
```

- **`app/`** – Screens and layout. `_layout.tsx` wraps children with providers and defines the stack.
- **`components/`** – Reusable UI. Auth and main are grouped by feature; `ui/` is shared.
- **`contexts/`** – React Context for theme and auth so any screen can use `useTheme()` or `useAuth()`.
- **`lib/api.ts`** – Single place for backend URL, token, and all HTTP calls.

---

## 4. How API calls work

### 4.1 Base URL and token

- **`lib/api.ts`** defines **`API_BASE_URL`** (default `http://localhost:8000/api`). Override with **`EXPO_PUBLIC_API_URL`** in `.env` or app config if needed.
- **Token** is stored with **AsyncStorage** under the key `@dropnshare/auth_token`. After login/register, the backend returns a **Sanctum token**; we save it and send it as **`Authorization: Bearer <token>`** on every request that needs auth.

**Where to set production / test API URL**

1. **`.env` (recommended for local / test)**  
   Copy **`.env.example`** to **`.env`** and set:
   ```bash
   EXPO_PUBLIC_API_URL=https://your-api.com/api
   ```
   Use your Laravel API base URL including `/api` (no trailing slash). Restart Metro (`npx expo start --clear`) after changing `.env`.

2. **`app.json` (for builds)**  
   In **`app.json`** under **`expo.extra`** set:
   ```json
   "extra": {
     "apiUrl": "https://your-api.com/api"
   }
   ```
   This is used when **`EXPO_PUBLIC_API_URL`** is not set (e.g. in EAS builds). You can use different values per build with EAS environment variables.

### 4.2 Token helpers

- **`getStoredToken()`** – `AsyncStorage.getItem(AUTH_TOKEN_KEY)`.
- **`setStoredToken(token)`** – Saves or removes the token. Used after login/register and on logout.

### 4.3 Generic `request()` function

All API calls go through **`request<T>(path, options)`**:

1. Builds full URL: `API_BASE_URL + path`.
2. Sets headers: `Content-Type: application/json`, `Accept: application/json` (unless sending `FormData`).
3. Reads token with **`getStoredToken()`** and, if present, adds **`Authorization: Bearer <token>`**.
4. Sends body: either **`JSON.stringify(body)`** or **`formData`** (for file upload).
5. Parses JSON response and returns **`{ data?, error?, status }`**. Non‑2xx responses are treated as errors with a message taken from the JSON or body.

So every call is consistent: same base URL, same auth, same error shape.

### 4.4 Auth endpoints (used by the app)

| Function        | Method | Path           | Body                    | Usage |
|----------------|--------|----------------|-------------------------|--------|
| **`apiRegister`** | POST   | `/auth/register` | `{ name, email, password }` | Signup screen |
| **`apiLogin`**    | POST   | `/auth/login`    | `{ email, password }`       | Login screen |
| **`apiMe`**       | GET    | `/auth/me`       | -                          | Restore session; requires Bearer |
| **`apiLogout`**   | POST   | `/auth/logout`   | -                          | Logout; then clear token |

- **Login/Register:** Screen calls `apiLogin` or `apiRegister` → backend returns `{ token, user }` → we call **`setStoredToken(token)`** and the **AuthContext** updates **`user`** (and redirects).
- **Restore session:** On app load, **AuthContext** (see below) reads the stored token and, if present, calls **`apiMe()`** to set **`user`**.

### 4.5 Upload and download

- **`apiUpload(files)`**  
  - **`files`** is an array of **`{ uri, name, type? }`** (from Expo Document Picker).  
  - Builds **`FormData`** and appends each file as **`files[]`** so Laravel receives an array.  
  - POST to **`/upload`** (with optional Bearer if user is logged in).  
  - Returns **`{ download_url, expires_at }`**. The app shows **`download_url`** and can open it with **`Linking.openURL(download_url)`**.

- **Download**  
  - The backend serves the zip at **`GET /download/{filename}`**.  
  - We don’t call a separate “download API” from the app; we just use the **`download_url`** from the upload response (e.g. open in browser or system download).

So: **API integration = `lib/api.ts` (URL, token, `request`) + auth endpoints + `apiUpload` + using the returned `download_url`.**

---

## 5. How `useEffect` is used

### 5.1 AuthContext – restore session on app load

```tsx
useEffect(() => {
  let cancelled = false;
  (async () => {
    const token = await getStoredToken();
    if (!token) {
      if (!cancelled) setUser(null);
      return;
    }
    const res = await apiMe();
    if (!cancelled) {
      if (res.data?.user) setUser(res.data.user);
      else {
        await setStoredToken(null);
        setUser(null);
      }
    }
  })().finally(() => {
    if (!cancelled) setIsLoading(false);
  });
  return () => { cancelled = true; };
}, []);
```

- **Why `useEffect`:** Run once when the app (and thus `AuthProvider`) mounts.
- **What it does:** Loads stored token → if present, calls **`apiMe()`** → sets **`user`** or clears token and user on failure. **`cancelled`** avoids updating state after unmount. **`setIsLoading(false)`** is called when this process finishes so the UI can show “ready” or “logged in”.

### 5.2 Landing page – sidebar animation

```tsx
useEffect(() => {
  if (sidebarOpen) {
    sidebarTranslate.value = withTiming(0, { duration: ANIM_DURATION });
    backdropOpacity.value = withTiming(0.4, { duration: ANIM_DURATION });
  }
}, [sidebarOpen]);
```

- **Why `useEffect`:** React to **`sidebarOpen`** (open/close). When it becomes true, start the Reanimated animation (translate sidebar in, fade backdrop in). The closing animation is done in **`requestClose`** with a callback so we can set **`sidebarOpen`** to false when the animation ends.

So in this app, **useEffect** is used for: (1) one-time async init (auth restore), (2) syncing UI state to animations (sidebar).

---

## 6. Auth flow (login / signup / logout)

1. **Layout**  
   **`app/_layout.tsx`** wraps the app in **`AuthProvider`**. So every screen can use **`useAuth()`**.

2. **Login screen**  
   - **State:** `email`, `password`, `error`, `loading`.  
   - **Inputs:** **`AuthInput`** with **`value`** and **`onChangeText`** (controlled).  
   - **Submit:** `handleSubmit` → validate → **`login({ email, password })`** from **`useAuth()`**.  
   - **AuthContext** `login()` calls **`apiLogin`** → **`setStoredToken(token)`** and **`setUser(user)`** → screen **`router.replace('/')`**.

3. **Signup screen**  
   - Same idea with **`name`**, **`email`**, **`password`**, **`confirmPassword`**.  
   - **`useAuth().register({ name, email, password })`** → **`apiRegister`** → store token and user → **`router.replace('/')`**.

4. **Logout**  
   - Wherever you add a “Log out” action (e.g. sidebar), call **`useAuth().logout()`**. That calls **`apiLogout`** and **`setStoredToken(null)`**, then **`setUser(null)`**.

5. **Restore**  
   - On mount, **AuthContext**’s **useEffect** (above) runs **`getStoredToken()`** and **`apiMe()`** and sets **`user`** so the user stays “logged in” across restarts.

---

## 7. Upload flow (file picker + API)

1. **Pick files**  
   **`expo-document-picker`** → **`DocumentPicker.getDocumentAsync({ type: '*/*', multiple: true, copyToCacheDirectory: true })`** → user selects files. Result gives **`uri`**, **`name`**, **`mimeType`** per file.

2. **State**  
   **`files`** = array of **`{ uri, name, type? }`**; **`uploadError`**, **`downloadUrl`**, **`uploading`**.

3. **Upload**  
   User taps “Get share link” → **`apiUpload(files)`** in **`lib/api.ts`** builds **FormData** with **`files[]`**, POST to **`/upload`** with optional Bearer. Response **`download_url`** is stored in state.

4. **UI**  
   Show list of picked files (with option to remove). After success, show **`download_url`** and a button that calls **`Linking.openURL(download_url)`** to open the zip download.

So: **Integrating the upload API = pick files (Document Picker) → build FormData → call `apiUpload` → show and open `download_url`.**

---

## 8. Try Now button placement

- **Before:** “Try now” was in the same column as “Upload files” and “Sign up”, above the feature cards.  
- **After:** “Upload files” and “Sign up” stay at the top; the three **feature cards** (Multi-file upload, Instant link, Modern UI) come next; **“Try now”** is **below the feature cards**.  
- **Action:** “Try now” uses **`router.push('/upload')`** so it sends the user to the upload screen (same as “Upload files” from a UX perspective; you can change the label or action later).

---

## 9. Dependencies used for API and upload

| Package | Purpose |
|---------|--------|
| **`@react-native-async-storage/async-storage`** | Persist auth token across app restarts. |
| **`expo-document-picker`** | Let user pick one or many files; returns `uri`/`name`/`mimeType` for **`apiUpload`**. |
| **`expo-linking`** | **`Linking.openURL(download_url)`** to open the download link in browser/system. |

No axios: the app uses the built-in **`fetch`** in **`lib/api.ts`** for all requests.

---

## 10. Quick reference: where things live

| What | Where |
|------|--------|
| API base URL | **`lib/api.ts`** → `API_BASE_URL` (env: `EXPO_PUBLIC_API_URL`) |
| Token storage | **`lib/api.ts`** → `getStoredToken` / `setStoredToken` (AsyncStorage) |
| All HTTP calls | **`lib/api.ts`** → `request`, `apiRegister`, `apiLogin`, `apiMe`, `apiLogout`, `apiUpload` |
| Auth state & actions | **`contexts/AuthContext.tsx`** → `useAuth()` → `user`, `login`, `register`, `logout` |
| Session restore | **`contexts/AuthContext.tsx`** → `useEffect` on mount → `getStoredToken` + `apiMe` |
| Login form submit | **`app/(auth)/login.tsx`** → `handleSubmit` → `useAuth().login()` |
| Signup form submit | **`app/(auth)/signup.tsx`** → `handleSubmit` → `useAuth().register()` |
| File picker + upload | **`app/upload.tsx`** → Document Picker → **`apiUpload(files)`** → show **`download_url`** |

If you follow this flow and the **`lib/api.ts`** implementation, you have “API integrated” end to end: auth (register, login, me, logout) and upload/download via the Laravel backend.
