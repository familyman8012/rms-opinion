# 개발 원칙 (Development Principles)

## 기술 스택

### Core
- **Framework**: Next.js 16.07 (App Router)
- **Database**: Supabase
- **Styling**: Tailwind CSS

### 상태 관리 & 데이터 페칭
- **서버 상태**: React Query (TanStack Query)
- **전역 상태**: Zustand
- **HTTP Client**: Axios
- **폼 관리**: React Hook Form
- **URL 상태**: nuqs (목록 페이지 필터 등)

### UI/UX
- **Toast**: Sonner

---

## 개발 규칙

### 1. Server Action 사용 금지
- Next.js App Router의 Server Action, Form Action 사용하지 않음
- 모든 데이터 통신은 API Route + React Query로 처리

### 2. React Query 사용 패턴

#### ❌ 하지 말 것: Custom Hook으로 감싸기
```typescript
// hooks/useTodos.ts - 이렇게 하지 말 것
export const useTodos = () => {
  return useQuery({
    queryKey: ["todos"],
    queryFn: todosApi.getAll,
  });
};

// 컴포넌트
const { data } = useTodos();
```

#### ✅ 할 것: 컴포넌트에서 직접 사용
```typescript
// 컴포넌트에서 직접 사용
export function TodoList() {
  const [filter, setFilter] = useState('all');
  const queryClient = useQueryClient();

  // Query Key도 사용처에서 직접 정의
  const { data, isLoading } = useQuery({
    queryKey: ['todos', filter], // 직접 정의, 간단명료
    queryFn: () => todosApi.getAll({ status: filter }),
  });

  // Mutation도 직접 사용
  const createMutation = useMutation({
    mutationFn: todosApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos'] // 관련 쿼리 무효화
      });
    }
  });

  return (
    // UI 구현...
  );
}
```

### 3. 낙관적 업데이트(Optimistic Update) 사용 원칙

**문제점:**
1. 롤백 복잡도 증가 - 실패 시 원상복구 로직이 복잡해짐
2. 데이터 불일치 - 클라이언트: "성공!" → 서버: "실패!" → 사용자: "???"
3. 디버깅 어려움 - 실제 데이터인지 낙관적 데이터인지 구분 어려움

**원칙:** 정말 효과적일 때만 사용 (좋아요, 북마크 등 간단한 토글)

### 4. URL 상태 관리 (nuqs)
- 목록 페이지의 필터, 정렬, 페이지네이션 등은 `useState` 대신 `nuqs` 사용
- URL에 상태를 저장하여 공유 가능한 링크 생성

---

## 프로젝트 구조

```
rms-opinion/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # 루트 레이아웃
│   │   ├── page.tsx              # 홈페이지
│   │   ├── (survey)/             # 설문 관련 라우트 그룹
│   │   │   ├── layout.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx      # 설문 응답 페이지
│   │   ├── admin/                # 관리자 페이지
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx          # 대시보드
│   │   │   └── surveys/
│   │   │       ├── page.tsx      # 설문 목록
│   │   │       └── [id]/
│   │   │           └── page.tsx  # 설문 상세/결과
│   │   └── api/                  # API Routes
│   │       └── surveys/
│   │           └── route.ts
│   │
│   ├── components/
│   │   ├── ui/                   # 기본 UI (Button, Input, Select 등)
│   │   ├── layout/               # 레이아웃 (Header, Footer 등)
│   │   ├── widgets/              # 공용 위젯 (DataTable, DatePicker 등)
│   │   └── features/             # 도메인별 컴포넌트
│   │       └── survey/
│   │           ├── SurveyForm.tsx
│   │           └── SurveyResult.tsx
│   │
│   ├── api-client/               # API 클라이언트
│   │   ├── apiClient.ts          # Axios 인스턴스 설정
│   │   └── surveys.ts            # 설문 API
│   │
│   ├── store/                    # Zustand 스토어
│   │   └── surveyStore.ts
│   │
│   ├── hooks/                    # 커스텀 훅
│   │   └── useDebounce.ts
│   │
│   ├── lib/                      # 외부 라이브러리 설정
│   │   ├── supabase/
│   │   │   ├── client.ts         # 클라이언트 Supabase
│   │   │   └── server.ts         # 서버 Supabase
│   │   └── schema/               # Zod 스키마
│   │       └── survey.schema.ts
│   │
│   ├── utils/                    # 유틸리티 함수
│   │   └── format.ts
│   │
│   ├── types/                    # TypeScript 타입
│   │   └── survey.d.ts
│   │
│   └── styles/
│       └── globals.css
│
├── public/
├── .env.local
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Supabase MCP 연결 가이드

### 1. 필요한 정보 (Supabase 대시보드에서 가져올 것)

Supabase 프로젝트 대시보드 → **Project Settings** → **API**에서:

1. **Project URL**: `https://[project-id].supabase.co`
2. **anon/public key**: 클라이언트에서 사용
3. **service_role key**: 서버에서만 사용 (절대 노출 금지)

### 2. 환경 변수 설정 (.env.local)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
```

### 3. Claude Code에서 Supabase MCP 연결

Claude Code 설정 파일 (`~/.claude/settings.json` 또는 프로젝트의 `.claude/settings.json`)에 추가:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server",
        "--supabase-url",
        "https://[project-id].supabase.co",
        "--supabase-key",
        "[service-role-key]"
      ]
    }
  }
}
```

### 4. 연결 확인
MCP 연결 후 Claude Code에서 다음을 확인할 수 있음:
- 테이블 구조 조회
- 스키마 확인
- SQL 쿼리 실행

---

## 다음 단계

1. ✅ 개발 원칙 문서 작성
2. ⏳ Supabase MCP 연결
3. ⏳ 설문 폼 요구사항 정의
4. ⏳ 데이터베이스 스키마 설계
5. ⏳ 프로젝트 초기 설정 (Next.js, 의존성 설치)
6. ⏳ 구현 시작
