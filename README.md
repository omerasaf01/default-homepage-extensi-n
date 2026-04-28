# Default Homepage Extension

A Chrome/Chromium extension that lets you set a default address to open whenever you create a new tab. It can also show a custom Helium-style new tab page with search, shortcuts, notes, and tips.

## Features

- **Custom new tab page** (Helium UI)
  - Live clock and date
  - Quick search with multiple engines
  - Shortcut tiles
  - Quick notes (saved locally)
  - Helpful keyboard tips
- **Auto-redirect** to a default URL after a configurable delay
- **Manual navigation** by entering a URL in the settings

## Project Structure

- `manifest.json` — Extension manifest (MV3)
- `newtab.html` — New tab page markup
- `newtab.js` — New tab logic (clock, search, notes, auto-redirect)
- `newtab.css` — New tab styles (legacy stylesheet; not used by Helium UI)
- `popup.html` — Settings UI
- `popup.js` — Settings logic
- `popup.css` — Settings styles
- `icons/` — Extension icons

## Installation (Developer Mode)

1. Open `chrome://extensions`.
2. Enable **Developer mode** (top-right).
3. Click **Load unpacked**.
4. Select the `default-homepage-extension` folder.

## Usage

1. Click the extension icon to open **Settings**.
2. Enter a **Default address** (e.g., `https://example.com`).
3. Toggle **Auto-redirect on new tab** if you want automatic navigation.
4. Choose the redirect delay.
5. Open a new tab:
   - If auto-redirect is **on**, it will navigate to the saved URL after the delay.
   - If auto-redirect is **off**, the Helium new tab page remains visible.

## Notes

- If you use a URL without a scheme, the extension will prepend `https://`.
- For local files, use a `file://` URL. Your browser may require additional permissions.
- The Helium page stores notes in `localStorage` on the new tab page.

## Troubleshooting

- **New tab page not updating**: Reload the extension from `chrome://extensions`.
- **Auto-redirect not working**: Ensure the default URL is valid and auto-redirect is enabled.
- **Changes not visible**: Close and reopen the new tab page.

## License

See `LICENSE`.
