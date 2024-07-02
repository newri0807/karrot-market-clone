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
│  │  │  ├─ actions.ts
│  │  │  ├─ page.tsx
│  │  │  └─ view
│  │  │     └─ [...id]
│  │  │        ├─ actions.ts
│  │  │        └─ page.tsx
│  │  ├─ home
│  │  │  ├─ @modal
│  │  │  │  ├─ (...)products
│  │  │  │  │  └─ view
│  │  │  │  │     └─ [id]
│  │  │  │  │        └─ page.tsx
│  │  │  │  ├─ default.tsx
│  │  │  │  └─ loading.tsx
│  │  │  ├─ actions.ts
│  │  │  ├─ layout.tsx
│  │  │  ├─ loading.tsx
│  │  │  └─ page.tsx
│  │  ├─ layout.tsx
│  │  ├─ living
│  │  │  ├─ actions.ts
│  │  │  ├─ comment
│  │  │  │  └─ actions.ts
│  │  │  ├─ loading.tsx
│  │  │  ├─ page.tsx
│  │  │  └─ view
│  │  │     └─ [id]
│  │  │        ├─ actions.ts
│  │  │        └─ page.tsx
│  │  ├─ myPage
│  │  │  ├─ actions.ts
│  │  │  ├─ edit
│  │  │  │  ├─ action.ts
│  │  │  │  └─ page.tsx
│  │  │  └─ page.tsx
│  │  ├─ products
│  │  │  ├─ add
│  │  │  │  ├─ actions.ts
│  │  │  │  └─ page.tsx
│  │  │  ├─ edit
│  │  │  │  └─ [id]
│  │  │  │     ├─ actions.ts
│  │  │  │     └─ page.tsx
│  │  │  └─ view
│  │  │     └─ [id]
│  │  │        ├─ actions.ts
│  │  │        ├─ loading.tsx
│  │  │        └─ page.tsx
│  │  └─ shop
│  │     └─ page.tsx
│  ├─ globals.css
│  ├─ join
│  │  ├─ actions.ts
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ layout.tsx
│  ├─ login
│  │  ├─ actions.ts
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ not-found.tsx
│  └─ review
│     └─ [...id]
│        ├─ actions.ts
│        └─ page.tsx
├─ components
│  ├─ chat-list.tsx
│  ├─ chatOpen-Button.tsx
│  ├─ close-button.tsx
│  ├─ comment-list.tsx
│  ├─ like-button.tsx
│  ├─ myPage
│  │  └─ productList.tsx
│  ├─ product-list.tsx
│  └─ ui
│     ├─ Button.tsx
│     ├─ csbutton.tsx
│     ├─ csinput.tsx
│     ├─ Input.tsx
│     ├─ Rating.tsx
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
│  │  ├─ 20240626045838_add_model_post_comment_like
│  │  │  └─ migration.sql
│  │  ├─ 20240627234242_add_realtime_chat
│  │  │  └─ migration.sql
│  │  ├─ 20240628012024_add_read_in_model_message
│  │  │  └─ migration.sql
│  │  ├─ 20240701021413_add_review
│  │  │  └─ migration.sql
│  │  ├─ 20240701023941_eidt_extras
│  │  │  └─ migration.sql
│  │  ├─ 20240702015911_
│  │  │  └─ migration.sql
│  │  ├─ 20240702020152_reset
│  │  │  └─ migration.sql
│  │  ├─ 20240702020245_add_product_id_in_chat_room
│  │  │  └─ migration.sql
│  │  └─ migration_lock.toml
│  └─ schema.prisma
├─ public
│  ├─ next.svg
│  └─ vercel.svg
├─ README.md
├─ store
│  └─ userStore.ts
├─ tailwind.config.ts
└─ tsconfig.json

```
