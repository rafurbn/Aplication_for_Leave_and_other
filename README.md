# আবেদনপত্র প্রস্তুতকারক (Application Writer PWA)

বাংলাদেশের সরকারি প্রাথমিক বিদ্যালয়ের শিক্ষক ও শিক্ষার্থীদের জন্য দরখাস্ত (আবেদনপত্র) তৈরি, লাইভ A4 প্রিভিউ, প্রিন্ট ও PDF সংরক্ষণ করার অফলাইন-সক্ষম PWA।

## Phase 1 পরিকল্পনা (বর্তমান অবস্থা)

- ব্যবহারকারীর জন্য কোনো লগইন নেই — সব ফরম্যাট সবার জন্য উন্মুক্ত।
- তৈরিকৃত দরখাস্ত ডিভাইসের localStorage-এ সংরক্ষিত হয় (নো-লগইন পলিসি)।
- অ্যাডমিন ড্যাশবোর্ড (`/admin-panel` বা হেডারের অ্যাডমিন বাটন) পাসওয়ার্ড-সুরক্ষিত এবং Socket.io দিয়ে লাইভ অ্যাক্টিভিটি দেখায়।
- ফেজ ২-এ (Google সাইন-ইন/OTP, MongoDB/Firestore) লোকাল ডেটা ক্লাউডে মাইগ্রেট করার সুযোগ যোগ হবে।

## Run locally

Prerequisites: Node.js 20+

```bash
npm ci
npm run dev        # tsx server.ts -> http://localhost:3000
```

Development-এ ডিফল্ট অ্যাডমিন পাসওয়ার্ড `admin123`; production-এ `ADMIN_PASSWORD` কমপক্ষে ১২ অক্ষরের হতে বাধ্য।

## Production

```bash
cp .env.example .env.local   # ADMIN_PASSWORD, NODE_ENV=production
npm run build                # vite build + esbuild server.ts -> server.js
npm start                    # node server.js (dist/ serve করে)
```

`server.js` নোড রানটাইমে শুধু `dependencies` (express, dotenv, socket.io) ব্যবহার করে; `tsx` কেবল ডেভ টুল।

## Structure

```
server.ts                 Express + Socket.io (track/register, track/ping, track/generate, admin API)
src/App.tsx               হোম স্ক্রিন ও জেনারেটর স্প্লিট-ভিউ
src/data/templates.ts     পার্ট ১ (৮টি চাকরিজীবী) ও পার্ট ২ (৭টি শিক্ষার্থী) ফরম্যাট
src/utils/                বাংলা তারিখ/সংখ্যা, ডকুমেন্ট জেনারেশন, localStorage, ভ্যালিডেশন
src/components/           Header, HomeScreen, ApplicationForm, DocumentPreview, AdminPanel, AdSlot, Toast
```

## PDF

ব্রাউজারের `window.print()` → "Save as PDF" ভেক্টর টেক্সট দেয়, অফলাইনে চলে এবং html2canvas-ভিত্তিক র‍্যাস্টার লাইব্রেরি ছাড়াই bundle ছোট রাখে। প্রিন্ট CSS (`src/index.css`) স্ক্রিন-জুম `transform` বাতিল করে A4 মার্জিন সেট করে।

## Metrics persistence

`data/metrics.json` (git-ignored) — রিস্টার্টে আজকের ভিজিটর ও মোট জেনারেশন সংখ্যা মুছে যায় না।
