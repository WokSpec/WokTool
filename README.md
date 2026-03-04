# WokTool

80+ free browser-based tools for developers and designers. No login. No data leaves your browser.

**Live:** [tools.wokspec.org](https://tools.wokspec.org) · **License:** [MIT](./LICENSE)

---

## Tools

### Image
| Tool | Description |
|------|-------------|
| Background Remover | Remove backgrounds client-side |
| Image Converter | Convert PNG, JPG, WebP, GIF, AVIF — batch up to 10 |
| Image Compressor | Compress with quality slider + before/after |
| Image Resizer | Resize and crop with social media presets |
| Social Media Resizer | Upload once, export for every platform |
| Sprite Sheet Packer | Pack PNGs into a sprite atlas + JSON manifest |
| Pixel Art Editor | Browser-based canvas editor |
| Favicon Generator | Generate favicon.ico, PNG variants, apple-touch-icon |
| Color Palette Extractor | Extract dominant colors, export as CSS/JSON/Tailwind |
| Image Diff | Compare two images with pixel diff overlay |

### Design
| Tool | Description |
|------|-------------|
| CSS Generator Suite | Gradient, glassmorphism, box shadow, border radius builders |
| Color Utilities | Hex/RGB/HSL/OKLCH converter, WCAG contrast checker, harmonies |
| Open Graph Preview | Preview links on Twitter/X, Facebook, LinkedIn, Discord |
| Mockup Generator | Drop screenshot into device frames (MacBook, iPhone, etc.) |
| Font Pairer | Browse Google Fonts, pick heading + body pairs with live preview |
| Gradient Generator | Build and export CSS gradients visually |
| Icon Search | Search 200k+ icons from Iconify |
| Website Palette | Extract color palette from any URL |

### Dev Tools
| Tool | Description |
|------|-------------|
| JSON Toolkit | Format, validate, minify, diff, convert — all client-side |
| Regex Tester | Live match highlighting, group captures, pattern library |
| Encode / Decode | Base64, URL, HTML entities, Unicode, JWT, Morse, ROT13 |
| Hash Generator | MD5, SHA-1, SHA-256, SHA-512, HMAC |
| UUID Generator | Generate UUIDs v1, v4, v5 in bulk |
| JWT Debugger | Decode and verify JWTs |
| Cron Builder | Visual cron expression builder |
| SQL Formatter | Format and highlight SQL queries |
| CSV Tools | Parse, convert, filter, export |
| Diff Tool | Text diff with inline and side-by-side views |
| Markdown Editor | Live markdown with syntax highlighting |
| JSON to Types | Generate TypeScript interfaces from JSON |
| Password Generator | Cryptographically secure |
| Timestamp Converter | Unix, ISO, human-readable |
| HTTP Status Codes | Reference for every HTTP status |

### Text & PDF
| Tool | Description |
|------|-------------|
| Text Utilities | Case conversion, lorem ipsum, string manipulation |
| Word Counter | Words, characters, sentences, paragraphs |
| PDF Tools | Merge, split, compress — client-side |

### Game Dev
| Tool | Description |
|------|-------------|
| Tilemap Editor | Browser-based tilemap editor |
| Sprite Sheet Packer | Pack sprites for game engines |
| SFX Browser | Browse and preview free sound effects |
| Asset Manifest | Generate asset manifests for game projects |

### Audio
| Tool | Description |
|------|-------------|
| Audio Tools | Trim, convert, visualize audio |
| Transcribe | Audio-to-text with confidence scores |

---

## Stack

```
Framework:   Next.js (App Router)
Language:    TypeScript
Deploy:      Vercel
```

Most tools run entirely client-side — no server required.

---

## Running locally

```bash
git clone https://github.com/WokSpec/WokTool.git
cd WokTool/apps/web
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

### Optional env vars

```bash
cp .env.example .env.local
```

| Variable | Used by |
|----------|---------|
| `PIXABAY_API_KEY` | Icon Search |
| `ASSEMBLYAI_API_KEY` | Transcribe |
| `EXA_API_KEY` | Exa Search |

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). Adding a tool is a single file + one registry entry.

---

## License

[MIT](./LICENSE)
