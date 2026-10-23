# Design System — Yatendra Verma Portfolio

> **PART 1 baseline.** Later parts must follow these tokens. Do not introduce one-off colors or shadows.

---

## Color Palette

| Token | Value | Usage |
|---|---|---|
| `--hero-bg-from` | `#EDEDF5` | Hero gradient start |
| `--hero-bg-mid` | `#D3D4E2` | Hero gradient middle |
| `--hero-bg-to` | `#C2C4D6` | Hero gradient end |
| `--navy` | `#1B1F3B` | Headings, primary text |
| `--slate-accent` | `#4A5568` | Buttons primary, active nav |
| `--slate-accent-hover` | `#2D3748` | Button hover |
| `--dark-section-bg` | `#050A14` | Dark section backgrounds |
| `--dark-card-bg` | `#0B1220` | Cards inside dark sections |
| `--dark-card-border` | `#2A3140` | Card borders in dark sections |
| `--light-card-bg` | `#F3F4F6` | Cards inside light sections |
| `--light-card-border` | `#D1D5DB` | Card borders in light sections |
| `--green-available` | `#16A34A` | Open to Work badge |
| `--star-yellow` | `#FACC15` | Star/rating elements |
| `--muted` | `#6B7280` | Muted body text, subtitles |

---

## Typography

- Display: Space Grotesk (--font-display)
- Body: Inter (--font-sans)
- Mono: JetBrains Mono (--font-mono)
- h1 hero: font-bold, text-5xl to 7xl, navy
- Nav links: text-sm font-medium
- Subtitles: text-sm, muted color

---

## Glassmorphism

Light glass card:
  background: rgba(255,255,255,0.25)
  backdrop-filter: blur(12px)
  border: 1.5px solid rgba(255,255,255,0.8)
  border-radius: 12px (rounded-xl)
  box-shadow: 0 4px 24px rgba(27,31,59,0.08)

---

## Buttons

- Primary: bg-[#4A5568] hover:bg-[#2D3748], white text, rounded-md
- Secondary/outline: transparent, border-white, text-white, hover:bg-white/10
- Ghost (resume): border border-[#4A5568]/40, text-navy, hover:bg-slate/10

---

## Navbar

- sticky top-0, backdrop-blur-md, bg-white/70, border-b white/60
- Logo: </> icon + Yatendra Verma
- Center links (desktop): Home, About, Skills, Experience, Projects, Certifications, Contact
- Right: GitHub, LinkedIn, Mail icon links (lucide-react)
- Mobile: hamburger -> full-width glass drawer, Escape closes

---

## Hero

- rounded-3xl card with lavender gradient (#EDEDF5 -> #C2C4D6)
- 3 columns on lg: text | profile image | stats card
- Stats (real values only): LeetCode 200+, Open to Work
- TODO-PROJECTS: fill real Projects count
- TODO-CERTIFICATIONS: fill real Certifications count
