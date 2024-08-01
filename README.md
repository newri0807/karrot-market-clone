# 🥕 당근마켓 클론

## 📖 프로젝트 소개

이 프로젝트는 인기 있는 중고 거래 플랫폼인 당근마켓을 클론한 웹 애플리케이션입니다. Next.js와 React를 기반으로 구축되었으며, 사용자 친화적인 인터페이스와 실시간 채팅 기능을 제공합니다.
(https://github.com/user-attachments/assets/1cd10e1f-026f-4612-b3f9-2d3472e6b69a)

## 🚀 주요 기능

- 사용자 인증 (회원가입/로그인)
- 상품 등록 및 검색
- 실시간 채팅
- 사용자 프로필 관리
- 상품 리뷰 시스템

## 🛠 기술 스택

이 프로젝트는 현대적인 웹 개발 기술을 활용하여 구축되었습니다:

### 핵심 프레임워크 및 라이브러리
- **Next.js (v14.2.4)**: React 기반의 서버 사이드 렌더링(SSR) 프레임워크
- **React (v18)**: 사용자 인터페이스 구축을 위한 JavaScript 라이브러리
- **TypeScript**: 정적 타입 검사를 통한 개발 경험 향상

### 스타일링
- **Tailwind CSS**: 유틸리티-퍼스트 CSS 프레임워크
- **DaisyUI**: Tailwind CSS 기반의 컴포넌트 라이브러리

### 상태 관리 및 폼 처리
- **Zustand**: 간단하고 확장 가능한 상태 관리 라이브러리
- **React Hook Form**: 성능이 뛰어난 폼 유효성 검사 라이브러리
- **Zod**: TypeScript-first 스키마 선언 및 유효성 검사 라이브러리

### 데이터베이스 및 ORM
- **Prisma**: 현대적인 데이터베이스 ORM
- **Vercel Postgres**: 관리형 PostgreSQL 데이터베이스 서비스

### 인증 및 보안
- **Iron Session**: 암호화된 세션 데이터를 쿠키에 저장하는 유틸리티
- **bcrypt**: 패스워드 해싱 라이브러리

### 기타 유틸리티
- **Heroicons**: SVG 아이콘 세트
- **Supabase**: 백엔드 서비스 제공 플랫폼
- **Sharp**: 고성능 이미지 처리 라이브러리

## 🚀 시작하기

1. 저장소를 클론합니다:
   ```
   git clone https://github.com/your-username/carrot-market-clone.git
   ```

2. 프로젝트 디렉토리로 이동합니다:
   ```
   cd carrot-market-clone
   ```

3. 의존성을 설치합니다:
   ```
   npm install
   ```

4. 개발 서버를 실행합니다:
   ```
   npm run dev
   ```

5. 브라우저에서 `http://localhost:3000`을 열어 애플리케이션을 확인합니다.

## 📝 환경 변수 설정

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 변수를 설정하세요:

```
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 기여하기

프로젝트 개선에 기여하고 싶으시다면 언제든 Pull Request를 보내주세요. 대규모 변경사항의 경우, 먼저 이슈를 열어 논의해 주시기 바랍니다.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 연락처

프로젝트에 대한 질문이나 피드백이 있으시면 [이메일 주소]로 연락 주시기 바랍니다.

---

🥕 당근마켓 클론 프로젝트를 즐겨보세요!





## 🎢 파일 구조 
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
