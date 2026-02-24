# Invoice Generator — Thermal Receipt Style

A simple, editable invoice generator with thermal paper receipt–style output.

## Features

- **Editable content** — All fields update the receipt preview in real time
- **Thermal receipt style** — 80mm width, monospace font, dashed borders
- **Line items** — Add/remove items with quantity and price; totals auto-calculate
- **Print** — Print directly or save as PDF via the browser print dialog

## How to Use

1. Open `index.html` in a web browser (double-click or drag into Chrome/Edge/Firefox).
2. Edit the form fields on the left — company, customer, items, etc.
3. Use **+ Add Item** to add more line items; click **×** to remove.
4. Click **Print Receipt** or **Save as PDF** — both open the print dialog.
5. Choose your printer or **Save as PDF** as the destination.

## Files

- `index.html` — Main page with form and receipt preview
- `styles.css` — Thermal receipt styling and layout
- `script.js` — Live preview, totals, print handling

## Thermal Printer Tips

For physical thermal printers (80mm):

- Use **Print** and select your thermal printer.
- In print settings, set paper size to **80mm** or **3.15 in** width.
- Disable headers/footers in the browser print dialog.

---

## Deploy to GitHub & Vercel

### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: Invoice generator with thermal receipt style"

# Create a new repo on GitHub (github.com/new), then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (use GitHub).
2. Click **Add New** → **Project**.
3. Import your GitHub repository.
4. Vercel auto-detects the static site — click **Deploy**.
5. Your invoice generator will be live at `https://your-project.vercel.app`.

**One-click deploy:** [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)
