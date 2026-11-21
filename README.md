# Madar Jobs — Frontend

Frontend for **Madar Jobs** (مدار), a job aggregation platform for Egyptians looking for work in the Gulf. It collects job posts published by labor-deployment offices across Telegram and Facebook into one searchable place.

- **Live:** https://madar-jobs.vercel.app
- **Backend:** https://github.com/Helmy-Ezzat/madar_backend

![Madar Jobs homepage](docs/screenshot.png)

## What I built

- Jobs listing with filters (country, city, category, date) and pagination
- Job details view with loading skeletons
- Register / login with Firebase Authentication
- Arabic-first, fully RTL interface

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, Firebase Auth, Framer Motion

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in your values
npm run dev
```
