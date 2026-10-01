# Omkar Yelsange — Data Portfolio

Dark, recruiter-focused portfolio for a Data Analyst / Data Engineer, built with React, TypeScript, Vite and Tailwind CSS v4.

## Features
- Hero with an animated data pipeline (Raw Data → AWS S3 → Databricks → SQL/PySpark → Power BI); motion is disabled under `prefers-reduced-motion`
- Recruiter snapshot with counts derived from the data files
- Project filters and search, plus a case-study page per project (`/projects/:id`)
- Technology-to-project matrix, skills, experience, education
- GitHub repositories and contribution heatmap, both with error fallbacks
- Light and dark themes (toggle in the navbar, choice remembered) with a violet / sky / pink palette; all colours are tokens at the top of `src/index.css`
- three.js visuals (hero medallion model, site-wide drifting backdrop, small rotating shapes) loaded lazily, with still frames for reduced motion
- Custom cursor ring (desktop only), loading screen (once per session), sticky case-study navigation, SVG chart components
- Contact form (EmailJS), command palette (Ctrl/Cmd+K), SEO metadata, robots.txt, sitemap.xml, JSON-LD

## Structure
```
src/
  components/  UI building blocks (Hero, DataPipeline, Projects, CommandPalette, ...)
  pages/       CaseStudy route
  data/        siteConfig.ts, projects.ts, skills.ts, experience.ts
public/        favicon, robots.txt, sitemap.xml, resume/ (add your PDF), projects/ (screenshots)
```

## Setup
```
npm install
cp .env.example .env   # fill in EmailJS values
npm run dev
npm run build
```

## Environment variables
`VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY`. The EmailJS template should use `{{name}}`, `{{email}}` and `{{message}}`. Never commit `.env`.

## Content rule
Nothing is invented. Blank fields in `projects.ts`, `experience.ts` and `siteConfig.ts` show "To be added" or are hidden until you fill them.

## Deployment
Import the repo in Vercel (framework preset: Vite). Add a rewrite of all paths to `/index.html` so `/projects/:id` works on refresh, and set the EmailJS variables in the project settings.

## Terminal and AI assistant
- **Terminal**: click "Terminal" in the navbar or press the backtick key. Commands: `help`, `about`, `work`, `skills`, `experience`, `education`, `contact`, `projects`, `open <id>`, `goto <section>`, `ask <question>`, `theme dark|light`, `resume`, `github`, `linkedin`, `neofetch`, `clear`, `exit`.
- **AI assistant** ("Ask AI"): suggested questions answer instantly from `src/data/knowledge.json`. Free-text questions go to `api/chat.ts`, a Vercel serverless function that calls Gemini with the same knowledge, so the key never reaches the browser.
- Set `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`) in Vercel → Project → Settings → Environment Variables. Do not prefix it with `VITE_`. Without it, or when running plain `npm run dev`, the assistant falls back to keyword matching over the same knowledge. To test the real API locally, use `npx vercel dev`.
- Keep `src/data/knowledge.json` in sync with your other data files; the assistant only knows what is in it.
