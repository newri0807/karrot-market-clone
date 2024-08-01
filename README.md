# 🥕 당근마켓 클론

## 📖 프로젝트 소개

이 프로젝트는 인기 있는 중고 거래 플랫폼인 당근마켓을 클론한 웹 애플리케이션입니다. Next.js와 React를 기반으로 구축되었으며, 사용자 친화적인 인터페이스와 실시간 채팅 기능을 제공합니다.

## 🖼 스크린샷

![당근마켓 클론 스크린샷](https://github.com/user-attachments/assets/1cd10e1f-026f-4612-b3f9-2d3472e6b69a)

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

## 📁 프로젝트 구조

```
03. karrot-market-clone
├─ .eslintrc.json
├─ app
│  ├─ (main)
│  ├─ (tabs)
│  │  ├─ chat
│  │  ├─ home
│  │  ├─ living
│  │  ├─ myPage
│  │  ├─ products
│  │  └─ shop
│  ├─ globals.css
│  ├─ join
│  ├─ layout.tsx
│  ├─ login
│  ├─ not-found.tsx
│  └─ review
├─ components
│  ├─ chat-list.tsx
│  ├─ chatOpen-Button.tsx
│  ├─ close-button.tsx
│  ├─ comment-list.tsx
│  ├─ like-button.tsx
│  ├─ myPage
│  ├─ product-list.tsx
│  └─ ui
├─ components.json
├─ lib
├─ middleware.ts
├─ next.config.mjs
├─ package.json
├─ postcss.config.mjs
├─ prisma
│  ├─ migrations
│  └─ schema.prisma
├─ public
├─ README.md
├─ store
├─ tailwind.config.ts
└─ tsconfig.json
```

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

---

🥕 당근마켓 클론 프로젝트를 즐겨보세요!
