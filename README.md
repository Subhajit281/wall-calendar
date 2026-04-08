# Subhajit's Calendar — Interactive Wall Calendar

A polished wall calendar component built with **React**, **Vite**, and **Tailwind CSS**. Translates the physical wall calendar aesthetic into a fully interactive web component — complete with day range selection, per-month themes, an integrated notes panel, and dark mode.

---

## Live Demo

🔗 **[wall-calendar-subhajit.vercel.app](https://wall-calendar-subhajit.vercel.app)**

---

## Features

### Core Requirements
| Feature | Implementation |
|---|---|
| Wall calendar aesthetic | Hero image per month, CSS spiral rings, diagonal SVG wave divider, Playfair Display typography |
| Day range selector | Click start → click end. Visual states for start, end, in-range, hover preview, today, and weekends |
| Integrated notes | Textarea with ruled-paper background. Notes are keyed to each date range and saved to `localStorage` |
| Responsive design | Side-by-side layout on desktop (`lg:`), vertically stacked on mobile with touch-friendly 36px day cells |

### Extra (Creative Features)
- **Per-month dynamic theming** — each of the 12 months has its own accent color and hero image. The entire UI shifts hue as you navigate
- **Page-flip animation** — subtle `rotateX` transition when changing months
- **Dark mode** — full dark theme toggle, top-right corner
- **Holiday markers** — Indian public holidays and international holidays shown as dots on dates, with tooltips
- **Saved notes list** — previously saved range notes appear below the textarea with a delete button
- **Toast notification** — appears after a range is selected, prompting the user to add a note
- **"Today" shortcut** — footer button jumps back to the current month instantly
- **localStorage persistence** — notes survive page refresh, no backend needed

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Install & Run Locally

```bash
git clone https://github.com/Subhajit281/wall-calendar.git
cd wall-calendar
npm install
npm run dev
```

Opens at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── components/
│   ├── WallCalendar.jsx   # Root component — all state lives here
│   ├── CalendarGrid.jsx   # Day cell grid with range highlight logic
│   ├── NotesPanel.jsx     # Notes textarea + saved notes list
│   └── SpiralRings.jsx    # Decorative binding strip (pure CSS, no images)
├── data.js                # 12 month themes (images + palettes) + holidays
├── utils.js               # Pure date utility functions
├── index.css              # Tailwind base + CSS custom properties
└── main.jsx               # Vite entry point
```

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | React 18 + Vite | Fast dev server, instant HMR |
| Styling | Tailwind CSS v3 | Utility-first, no stylesheet bloat |
| Typography | Playfair Display + DM Sans | Editorial serif for headings, clean sans for UI |
| State | React `useState` / `useCallback` | Sufficient for this scope, no Redux needed |
| Persistence | `localStorage` | Client-side only, no backend required |
| Images | Unsplash CDN | No API key, free high-quality photos |
| Icons | None | CSS shapes and Unicode glyphs only |

---

## Design Decisions

**Typography pairing** — Playfair Display for the month name overlay gives the calendar a printed, editorial feel that digital UIs rarely achieve. DM Sans keeps the grid and UI text clean without competing.

**Per-month accent system** — Rather than a single brand color, each month derives its accent hex from its hero image's dominant tone. This means January feels cold and blue, July feels warm and orange, and December feels deep blue-white. Every tinted element — range highlights, notes border, wave divider, holiday dots — inherits this accent automatically.

**No external component library** — Every component is hand-built. This keeps the bundle lean and makes the code straightforward to evaluate.

**Spiral rings** — Built entirely in CSS/JSX with no images, so they scale perfectly at any resolution.

---

## Keyboard & Accessibility

- Semantic HTML throughout (`button`, `textarea`, `img alt`)
- Holiday tooltips via `title` attributes
- `min-height: 36px` on day cells for comfortable touch targets on mobile
- `.no-print` class hides navigation controls when printing
