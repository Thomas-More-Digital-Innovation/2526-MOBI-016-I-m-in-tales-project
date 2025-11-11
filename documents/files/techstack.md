# Tech Stack

## What

### 🧱 Core Stack

**Frontend Framework:**

* **SvelteKit** *(best PWA support + simple API usage)*
  or **React + Vite** *(if you prefer React’s ecosystem)*

**Language:**

* **TypeScript** — gives you strong typing for USB/NFC API interactions.

**Backend (optional):**

* None required if all logic is client-side.
* Otherwise, use **Firebase**, **Supabase**, or a **Vercel serverless backend** for syncing data.

**PWA Tools:**

* **Vite PWA Plugin** or **SvelteKit PWA Plugin** for manifest + service worker setup.

---

### ⚙️ Hardware Access (the crucial part)

**API:**

* **WebUSB API** → supports direct communication with USB devices.
* **WebNFC API** → ideal but still limited; only works on Android Chrome for now.
  → For desktop readers, **WebUSB** is the reliable route.

You’ll identify your NFC reader via `navigator.usb.requestDevice()` and handle it like a serial interface (read/write packets).

---

### 🧩 Recommended Stack Summary

| Layer              | Recommended Tech                                               |
| ------------------ | -------------------------------------------------------------- |
| Framework          | **SvelteKit**                                                  |
| Language           | **TypeScript**                                                 |
| USB/NFC Interface  | **WebUSB API** (fallback: native bridge via Electron or Tauri) |
| PWA Setup          | **Vite PWA plugin**                                            |
| Backend (optional) | **Firebase / Supabase / Vercel**                               |
| UI                 | **TailwindCSS + ShadCN UI**                                    |

---

### 💡 Alternative if WebUSB isn’t enough

If the reader requires proprietary drivers or raw HID access:

* Wrap your PWA in **Tauri** or **Electron** to get **native USB** or **HID** access with Node.js.
  → You’ll keep the same frontend (SvelteKit/React) but gain deeper hardware access.

## Why Svelte?

### ⚡ 1. Native PWA support

SvelteKit’s routing and build system make it easy to add a service worker and manifest. You can get installable, offline-ready behavior with almost no boilerplate using `@vite-pwa/sveltekit`.

---

### 🧩 2. Simplicity and size

Svelte compiles to pure JavaScript — no runtime overhead like React’s virtual DOM.
That means faster startup, smaller bundles, and better performance on low-power devices (phones, tablets).

---

### 🔌 3. Direct browser API access

SvelteKit lets you use native APIs (WebUSB, WebNFC, Web Serial) directly in components without extra setup.
No need for special hooks or wrappers — just import and call.

---

### 💬 4. Easy state handling

Reactivity is built-in (`$:` syntax). Perfect for live hardware data, like NFC tag scans or USB messages, without complex state libraries.

---

### 🔧 5. Flexible deployment

You can deploy as:

* A static PWA
* A serverless app (on Vercel, Netlify, etc.)
* Or bundled into **Tauri** for native desktop USB access later.

## Comparisons

| Feature                       | **SvelteKit**                                                      | **React (Vite)**                                             |
| ----------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| 🧱 **Setup**                  | Minimal; routing and SSR included out of the box                   | Needs React Router, manual setup for SSR or static export    |
| ⚡ **Performance**             | Compiles to small, framework-free JS → faster load/start           | Larger runtime, heavier hydration overhead                   |
| 🔌 **WebUSB / WebNFC access** | Direct access in components, no hooks needed                       | Works fine, but needs `useEffect`/state boilerplate          |
| 📱 **PWA integration**        | Simple with `@vite-pwa/sveltekit`                                  | Also possible with `vite-plugin-pwa`, but more manual config |
| 💬 **Reactivity**             | Built-in (`$state():` syntax), super lightweight                          | Needs `useState`, `useEffect`, `useReducer` — more verbose   |
| 🎨 **UI simplicity**          | Minimal code, clean binding between logic and markup               | JSX is flexible but often more verbose                       |
| 🔧 **Deployment**             | Easily deployable as static site, serverless app, or Tauri wrapper | Same, but routing often needs tweaking                       |
| 🧩 **Learning curve**         | Easier for small focused projects                                  | Familiar ecosystem, but more boilerplate                     |
| 🧰 **Ecosystem**              | Smaller but modern and growing fast                                | Huge, mature ecosystem with more libs                        |
| 🧠 **Best for**               | Lightweight PWAs, direct hardware API use, small teams             | Complex enterprise apps needing large UI ecosystems          |
