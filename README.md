This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

```
03. karrot-market-clone
├─ .eslintrc.json
├─ app
│  ├─ (main)
│  │  ├─ favicon.ico
│  │  └─ page.tsx
│  ├─ (tabs)
│  │  ├─ chat
│  │  │  └─ page.tsx
│  │  ├─ home
│  │  │  ├─ @modal
│  │  │  │  ├─ (...)products
│  │  │  │  │  └─ view
│  │  │  │  │     └─ [id]
│  │  │  │  │        └─ page.tsx
│  │  │  │  ├─ default.tsx
│  │  │  │  └─ loading.tsx
│  │  │  ├─ action.tsx
│  │  │  ├─ layout.tsx
│  │  │  ├─ loading.tsx
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ living
│  │  │  └─ page.tsx
│  │  ├─ myPage
│  │  │  └─ page.tsx
│  │  ├─ products
│  │  │  ├─ action-old.tsx
│  │  │  ├─ add
│  │  │  │  ├─ action.tsx
│  │  │  │  └─ page.tsx
│  │  │  ├─ edit
│  │  │  │  └─ [id]
│  │  │  │     ├─ action.tsx
│  │  │  │     └─ page.tsx
│  │  │  ├─ loading-old.tsx
│  │  │  ├─ page-old.tsx
│  │  │  └─ view
│  │  │     └─ [id]
│  │  │        ├─ action.tsx
│  │  │        ├─ loading.tsx
│  │  │        └─ page.tsx
│  │  └─ shop
│  │     └─ page.tsx
│  ├─ globals.css
│  ├─ join
│  │  ├─ action.tsx
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ layout.tsx
│  ├─ login
│  │  ├─ action.tsx
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  └─ not-found.tsx
├─ components
│  ├─ close-button.tsx
│  ├─ product-list.tsx
│  └─ ui
│     ├─ Button.tsx
│     ├─ csbutton.tsx
│     ├─ csinput.tsx
│     ├─ Input.tsx
│     └─ tabMenu.tsx
├─ components.json
├─ lib
│  ├─ check.ts
│  ├─ constants.ts
│  ├─ db.ts
│  ├─ hash.ts
│  ├─ session.ts
│  ├─ type.ts
│  ├─ utils.ts
│  └─ validators.ts
├─ middleware.ts
├─ next.config.mjs
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  ├─ migrations
│  │  ├─ 20240623054355_add_model_product
│  │  │  └─ migration.sql
│  │  ├─ 20240623084638_add_model_product
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ public
│  ├─ c-d-x-PDX_a_82obo-unsplash.jpg
│  ├─ domino-studio-164_6wVEHfI-unsplash.jpg
│  ├─ eniko-kis-KsLPTsYaqIQ-unsplash.jpg
│  ├─ Image_test.png
│  ├─ next.svg
│  ├─ rachit-tank-2cFZ_FB08UM-unsplash.jpg
│  └─ vercel.svg
├─ README.md
├─ tailwind.config.ts
└─ tsconfig.json

```
