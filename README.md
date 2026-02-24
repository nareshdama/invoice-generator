# Invoice Generator — Walmart-Style Receipt

A React-based receipt generator with Walmart-style thermal receipt layout.

## Features

- **Walmart-style layout** — Store header, ST# OP# TE# TR#, items grouped by department
- **Editable content** — Store details, items (dept, name, qty, price, tax, save), payment
- **Department grouping** — GROCERY, PRODUCE, DAIRY, HOUSEHOLD, etc.
- **Tax codes** — N (none), X (taxable), O (other)
- **Save/discount** — Per-item savings with "YOU SAVED TODAY" total
- **Download JPG** — Export receipt as image via html2canvas
- **Print / PDF** — Print or save as PDF via browser dialog

## How to Use

```bash
npm install
npm run dev
```

1. Edit store details, date/time, tax %, payment method.
2. Add/edit/remove items (dept, name, qty, price, tax code, save).
3. Click **Download JPG** to export as image.
4. Click **Print / Save PDF** — choose "Save as PDF" in the print dialog.

## Tech

- React 18 + Vite
- html2canvas (loaded from CDN for JPG export)

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
