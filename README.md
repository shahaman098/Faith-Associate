This is the Faith Associates Next.js website with an on-page Supabase CMS.

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill Supabase URL + anon key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## On-page CMS

1. Go to [/cms](http://localhost:3000/cms) (production: https://faith-associates.vercel.app/cms)
2. Sign in as an editor
3. Use the floating **Edit page** toolbar on any route
4. Click outlined text/images to change them, then **Save draft** or **Publish**

Content lives in Supabase (`site_settings`, `pages`, `entries`, Storage bucket `media`) with a local seed fallback in `src/lib/cms/seed-data.ts`.

```bash
npm run cms:smoke   # login + draft/publish + upload check
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
