# Veille - Personal Tech Feed Aggregator

A self-hosted tech news aggregator that collects content from newsletters and YouTube channels.

## Features

- Aggregates 13+ newsletter sources and 10+ YouTube channels
- Password-protected access
- Mark items as read/unread and favorite
- History navigation by date
- Search across all items
- Filter by source type (newsletters/YouTube)
- Enable/disable individual sources
- Keyboard shortcuts (j/k navigate, o open, r read, f favorite)
- Dark mode support
- Auto-refresh every 30 minutes via node-cron
- Mobile responsive

## Quick Start (Development)

1. Start PostgreSQL:
```bash
docker compose up db -d
```

2. Install dependencies and setup database:
```bash
npm install
npx prisma migrate dev
npm run db:seed
```

3. Start the dev server:
```bash
npm run dev
```

4. Open http://localhost:3000 and login with password: `veille2024`

## Production Deployment

1. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
# Edit .env with your settings
```

2. Deploy with Docker Compose:
```bash
docker compose up -d
```

3. Run database migrations:
```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npm run db:seed
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `AUTH_SECRET` | Secret for session tokens | - |
| `AUTH_PASSWORD` | Login password | `veille2024` |

## Sources

### Newsletters
- Bytes, TLDR, Pointer, Software Lead Weekly
- JavaScript Weekly, React Status, Node Weekly
- Hacker News, The Pragmatic Engineer, Changelog
- Frontend Focus, CSS Weekly, Smashing Magazine

### YouTube
- Fireship, Theo (t3.gg), ThePrimeagen
- Traversy Media, Web Dev Simplified
- Jack Herrington, Matt Pocock
- Syntax, Kevin Powell, Coding Garden

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `j` | Next item |
| `k` | Previous item |
| `o` / `Enter` | Open in new tab |
| `r` | Toggle read |
| `f` | Toggle favorite |
