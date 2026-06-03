<img src="code/public/Logo.svg" alt="WhisperTag Transparent Logo" width="50%" align="right" />

# WhisperTag

## Project Description

**WhisperTag** (formerly **I'm in Tales**) is an interactive, multi-sensory storytelling platform designed for inclusive education and creative learning. The application integrates a modern React frontend with a Tauri-powered Rust backend to bridge physical objects and digital narrative paths.

By utilizing hardware tag readers, users can place physical tokens representing story items, characters, or actions onto a board. The application translates these physical inputs into dynamic story progression, audio feedback, and visual changes, creating an immersive, tactile storytelling experience.

---

## Tech Stack & Prerequisites

### Frontend Architecture
- **Framework**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **Bundler & Tooling**: Vite, Prettier, Typesafe-i18n
- **Package Manager**: PNPM

### Desktop & Backend Layer
- **Desktop Runtime**: Tauri v2
- **Language**: Rust
- **Dynamic Libraries**: Linkage to `libuFCoder` for hardware NFC interface via `libloading`
- **Compiler Requirements**: Cargo (with `rustc`) 1.95 or higher

### Hardware Requirements
- **NFC Tag Reader**: A **µFR Zero XL** with a USB connection is strictly required to use the tag reading/writing capabilities.
- **Tags**: NDEF-compliant NFC tags calibrated via the in-app tool.

---

## Getting Started

### 1. Prerequisites Setup
Ensure your local environment is configured with:
- **Rust Toolchain**: Cargo and `rustc` 1.95+
- **Node.js**: Node.js v18+ with `pnpm` globally installed
- **USB Driver Permissions (Linux)**: Ensure the user is added to `dialout` or `plugdev` group, or verify that appropriate udev rules are established to access the µFR Zero XL reader.

### 2. Installation
To install the workspace dependencies, run:
```bash
pnpm install
```
Alternatively, if `just` is installed:
```bash
just install
```

### 3. Local Development Run
To compile the Rust backend and launch the Tauri hot-reloaded development environment:
```bash
cd code && pnpm tauri dev
```
Alternatively, if `just` is installed:
```bash
just tauri-dev
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
Copyright (c) 2022 Thomas More - Digital Innovation.
