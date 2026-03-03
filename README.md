# WokTool

**The best open-source tooling website — 80+ free browser-based tools for developers and designers.**

No login required. No data leaves your browser. Everything runs client-side.

[![License](https://img.shields.io/badge/License-Apache_2.0-green.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![Open Source](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red)](https://github.com/WokSpec/WokTool)

**Live:** [tools.wokspec.org](https://tools.wokspec.org)

---

## Tools

### 🖼️ Image
| Tool | Description |
|------|-------------|
| Background Remover | Remove backgrounds entirely in-browser — no upload required |
| Image Converter | Convert PNG, JPG, WebP, GIF, AVIF — batch up to 10 files |
| Image Compressor | Compress with quality slider + live before/after comparison |
| Image Resizer | Resize and crop with social media presets and batch mode |
| Social Media Resizer | Upload once, export for every platform |
| Sprite Sheet Packer | Pack PNGs into a sprite atlas + JSON manifest |
| Pixel Art Editor | Browser-based pixel editor with grid, pencil, fill, eraser |
| Favicon Generator | Upload → favicon.ico, PNG variants, apple-touch-icon |
| Color Palette Extractor | Extract dominant colors, export as CSS/JSON/Tailwind |
| Image Diff | Compare two images with pixel diff overlay |
| Media Downloader | Download media from URLs (client-side where possible) |

### 🎨 Design
| Tool | Description |
|------|-------------|
| CSS Generator Suite | Gradient, glassmorphism, box shadow, border radius builders |
| Color Utilities | Hex/RGB/HSL/OKLCH converter, WCAG contrast checker, harmonies |
| Open Graph Preview | Preview links on Twitter/X, Facebook, LinkedIn, Discord |
| Mockup Generator | Drop screenshot into device frames (MacBook, iPhone, etc.) |
| Font Pairer | Browse Google Fonts, pick heading + body pairs with live preview |
| Gradient Generator | Build and export CSS gradients visually |
| Shadow Generator | CSS box-shadow builder with presets |
| Type Scale | Fluid typography scale builder |
| Border Radius | CSS border-radius visual builder |
| Gradient Animator | Animated CSS gradient builder |
| Icon Search | Search 200k+ icons from Iconify |
| Website Palette | Extract color palette from any website URL |

### ⚙️ Dev Tools
| Tool | Description |
|------|-------------|
| JSON Toolkit | Format, validate, minify, diff, convert JSON — all client-side |
| Regex Tester | Live match highlighting, group captures, pattern library |
| Encode / Decode | Base64, URL, HTML entities, Unicode, JWT, Morse, ROT13 |
| Hash Generator | MD5, SHA-1, SHA-256, SHA-512 + HMAC |
| UUID Generator | Generate UUIDs v1, v4, v5 in bulk |
| JWT Debugger | Decode and verify JSON Web Tokens |
| Base Converter | Convert numbers between bases 2–36 |
| Cron Builder | Visual cron expression builder with human-readable output |
| SQL Formatter | Format and highlight SQL queries |
| CSV Tools | Parse, convert, filter, and export CSV data |
| Diff Tool | Text diff with inline and side-by-side views |
| Markdown Editor | Live markdown with syntax highlighting |
| Markdown Preview | Render GitHub-flavored Markdown |
| MD to HTML | Convert Markdown to HTML |
| JSON to Types | Generate TypeScript interfaces from JSON |
| Password Generator | Cryptographically secure password generator |
| Tech Badges | Generate shields.io badges for READMEs |
| Timestamp Converter | Convert between Unix, ISO, and human-readable timestamps |
| HTTP Status Codes | Reference for every HTTP status code |
| Link Checker | Check link health status in bulk |
| Favicon Extractor | Extract favicons from any website |
| OG Analyzer | Analyze Open Graph meta tags from any URL |
| Readme Generator | Template-based README.md generator |
| Changelog Writer | Structured changelog generator |
| Privacy Policy Generator | GDPR-compliant privacy policy generator |
| Code Snippets | Save and share code snippets |
| Asset Manifest | Generate asset manifests for game dev projects |

### 📄 Text & PDF
| Tool | Description |
|------|-------------|
| Text Utilities | Case conversion, lorem ipsum, string manipulation |
| Word Counter | Word, character, sentence, paragraph counter |
| PDF Tools | Merge, split, compress PDF files client-side |

### 🎮 Game Dev
| Tool | Description |
|------|-------------|
| Tilemap Editor | Browser-based tilemap editor |
| Pixel Art Editor | Quick pixel art creation with palette and tools |
| Sprite Sheet Packer | Pack sprites for game engines |
| SFX Browser | Browse and preview free sound effects |

### 🔊 Audio
| Tool | Description |
|------|-------------|
| Audio Tools | Trim, convert, and visualize audio files |
| Transcribe | Audio-to-text with confidence scores |
| AI Music | Generate music with AI |

### ₿ Crypto & Web3
| Tool | Description |
|------|-------------|
| Crypto Utilities | Address validation, hash functions, key utilities |

### 🤝 Collab
| Tool | Description |
|------|-------------|
| Whiteboard | Infinite canvas collaborative whiteboard |
| Snippets | Shared code snippet manager |

---

## Tech Stack

```
Framework:   Next.js 14 (App Router)
Language:    TypeScript 5
Styling:     Tailwind CSS 3
Deploy:      Vercel
```

Most tools are **fully client-side** — they run entirely in your browser with no server required.

---

## Running Locally

```bash
git clone https://github.com/WokSpec/WokTool.git
cd WokTool/apps/web
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

### Optional env vars (for tools that call external APIs)
Copy `.env.example` to `.env.local` and fill in the keys you need:
```bash
cp .env.example .env.local
```

| Variable | Used by |
|----------|---------|
| `PIXABAY_API_KEY` | Icon Search |
| `ASSEMBLYAI_API_KEY` | Transcribe |
| `EXA_API_KEY` | Exa Search |
| `FIRECRAWL_API_KEY` | Link Scraper |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) — adding a new tool is a single file + registry entry.

---

## Part of WokSpec

| Project | Description |
|---------|-------------|
| [WokGen](https://github.com/WokSpec/WokGen) | Free pixel art generation studio |
| [WokPost](https://github.com/WokSpec/WokPost) | AI-powered news aggregator |
| [Chopsticks](https://github.com/WokSpec/Chopsticks) | Open-source Discord bot |
| [WokTool](https://github.com/WokSpec/WokTool) | **This project** |

---

## License

Apache 2.0 — see [LICENSE](./LICENSE).
