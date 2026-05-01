# ✈️ TravelAI — Intelligent Trip Architect

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-blue?logo=google" />
  <img src="https://img.shields.io/badge/Prisma-PostgreSQL-green?logo=prisma" />
  <img src="https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel" />
</div>

<br/>

> **TravelAI** is a premium, AI-powered travel planning platform that crafts personalized day-by-day itineraries in seconds — complete with maps, booking links, packing lists, and PDF export.

---

## ✨ Features

- 🤖 **AI Itinerary Generation** — Powered by Google Gemini 2.5 Flash
- 🗺️ **Interactive Maps** — Leaflet.js with activity markers
- 📧 **Email PDF Export** — Send full itinerary as a styled PDF to your inbox
- 🎙️ **Voice Assistant** — Web Speech API + Gemini for travel Q&A
- 🌅 **Seasonal Suggestions** — AI-curated trending destinations
- 🖼️ **Destination Images** — Unsplash integration with gradient fallbacks
- 👤 **Profile & Preferences** — Save budget, interests for personalized AI
- 🔐 **Authentication** — Email/Name fast entry + Google OAuth

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **AI** | Google Gemini via LangChain |
| **Database** | PostgreSQL (NeonDB) + Prisma ORM |
| **Auth** | Custom JWT + NextAuth (Google OAuth) |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Maps** | Leaflet.js |
| **Email** | Nodemailer + PDFKit |
| **Images** | Unsplash API |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/Travel.git
cd Travel
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp .env.example .env
```
Fill in your keys in `.env` (see `.env.example` for all required variables).

### 4. Set up the database
```bash
npx prisma db push
npx prisma generate
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🔑 Environment Variables

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string (NeonDB recommended) | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key from [aistudio.google.com](https://aistudio.google.com/apikey) | ✅ |
| `UNSPLASH_ACCESS_KEY` | Unsplash API key from [unsplash.com/developers](https://unsplash.com/developers) | ✅ |
| `JWT_SECRET` | Random secret for session tokens | ✅ |
| `AUTH_SECRET` | NextAuth secret | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |
| `SMTP_USER` | Gmail address for email PDF feature | Optional |
| `SMTP_PASS` | Gmail App Password | Optional |

---

## 📸 Screenshots

> Add screenshots here after deployment!

---

## 🤝 Contributing

1. Fork this repository
2. Create your branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/YOUR_USERNAME">YOUR_USERNAME</a>
</div>
