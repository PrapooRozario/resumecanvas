# ResumeCanvas

A minimal, aesthetic single-page resume builder. Drag and drop blocks to build your resume, toggle between dark and light themes, and export as a pixel-perfect PDF in one click.

![ResumeCanvas](https://img.shields.io/badge/status-in%20development-yellow?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-black?style=flat-square)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Supabase-black?style=flat-square)

---

## Features

- **Drag & drop builder** — drag blocks from the sidebar onto the A4 canvas and reorder them freely
- **10 block types** — Heading, Text, Photo, Experience, Education, Skills, Project Card, Social Links, Divider, Section Wrapper
- **Live preview** — what you see in the builder is exactly what exports
- **PDF export** — exports a pixel-perfect A4 PDF with a custom filename
- **Dark & light theme** — toggle per resume, persisted to your account
- **Auto-save** — every change saves to Supabase automatically after 1.5 seconds
- **Auth** — email/password and Google OAuth via Supabase
- **Secure** — all data behind Row Level Security, only you can access your resumes

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui (New York, neutral) |
| Backend / Auth / DB | Supabase |
| Drag & Drop | @dnd-kit/core + @dnd-kit/sortable |
| PDF Export | html2canvas + jsPDF |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Animation | Framer Motion |
| Icons | Lucide React |
| Fonts | Instrument Serif · Geist · Geist Mono |

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project

### 1. Clone the repo

```bash
git clone https://github.com/PrapooRozario/resumecanvas.git
cd resumecanvas
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Set up the database

Run these SQL migrations in your Supabase project's SQL editor:

```sql
-- Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Resumes
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'My Resume',
  theme TEXT DEFAULT 'dark',
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blocks
CREATE TABLE blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  content JSONB DEFAULT '{}',
  styles JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own profile"
  ON profiles FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can manage own resumes"
  ON resumes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own blocks"
  ON blocks FOR ALL
  USING (resume_id IN (SELECT id FROM resumes WHERE user_id = auth.uid()));
```

### 5. Set up Supabase Storage

In your Supabase dashboard, create a storage bucket called `resume-photos` and set it to **public**.

### 6. Enable Google OAuth (optional)

In your Supabase dashboard go to Authentication → Providers → Google and follow the setup guide. Add your Google OAuth credentials.

### 7. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Project Structure

```
src/
├── components/
│   ├── ui/                  # shadcn/ui base components
│   ├── builder/
│   │   ├── BuilderCanvas    # A4 canvas with droppable zone
│   │   ├── BuilderSidebar   # Block library panel
│   │   ├── BuilderToolbar   # Top bar (title, theme, export)
│   │   ├── DraggableBlock   # Block wrapper with hover controls
│   │   ├── BlockRenderer    # Renders the correct block component
│   │   └── blocks/          # Individual block components
│   ├── resume/
│   │   └── ResumeTemplate   # Read-only resume renderer (used in builder + PDF)
│   ├── layout/
│   │   ├── Navbar
│   │   └── ThemeToggle
│   └── shared/
│       └── EmptyCanvasState
├── lib/
│   ├── supabase.ts          # Supabase client
│   └── utils/
│       └── exportPdf.ts     # html2canvas + jsPDF export logic
├── stores/
│   └── builderStore.ts      # Zustand store for builder state
├── types/
│   └── blocks.ts            # Block type definitions
├── hooks/
│   ├── useAuth.ts
│   └── useResume.ts
└── pages/
    ├── Index.tsx             # Landing page
    ├── Login.tsx
    ├── Register.tsx
    ├── Dashboard.tsx
    └── Builder.tsx
```

---

## Block Types

| Block | Description |
|---|---|
| `heading` | Name or section title (H1 / H2 / H3) |
| `text` | Bio or paragraph with basic rich text |
| `photo` | Profile photo, circle or square |
| `experience` | Job entry — role, company, dates, description |
| `education` | Degree, institution, dates |
| `skills` | Tag cloud or inline list |
| `project_card` | Project title, description, URL, optional image |
| `social_links` | Platform + URL rows |
| `divider` | Horizontal rule (solid / dashed / dotted) |
| `section` | Groups blocks under a labeled section header |

---

## PDF Export

Export uses `html2canvas` + `jsPDF` to capture the rendered `ResumeTemplate` DOM node and convert it to an A4 PDF. A DOM clone is used during capture so the live builder canvas is never mutated.

- Format: A4 (210mm × 297mm)
- Resolution: 2× scale for sharp output
- Filename: user-defined, set in the export modal before download
- The exported PDF matches exactly what you see on screen in both dark and light themes

---

## Design System

```css
--background:   #0a0a0a
--surface:      #111111
--surface-2:    #1a1a1a
--border:       #2a2a2a
--text-primary: #f5f5f5
--text-secondary:#888888
--text-muted:   #555555
--accent:       #e8e8e8
--destructive:  #ff4444
--success:      #22c55e
```

Fonts: `Instrument Serif` for display headings · `Geist` for UI body · `Geist Mono` for dates and metadata.

---

## Roadmap

- [x] Drag & drop block builder
- [x] 10 block types
- [x] PDF export with custom filename
- [x] Dark / light theme toggle
- [x] Auto-save to Supabase
- [x] Google OAuth
- [ ] AI resume writer (rewrite bullet points with one click)
- [ ] ATS score checker (paste a job description, get a match score)
- [ ] Undo / redo in builder
- [ ] Publish resume as a live URL
- [ ] Resume versioning (named snapshots)
- [ ] Multiple resumes (paid plan)
- [ ] Analytics (view / download count)
- [ ] Stripe billing

---

## Contributing

Pull requests are welcome. For major changes please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'add: your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

---

## License

[MIT](LICENSE)

---

<p align="center">Built with ♥ for designers and developers who care about their first impression.</p>