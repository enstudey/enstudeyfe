## Kế hoạch Triển khai (Refactoring API Modules - Frontend)

Kế hoạch tái cấu trúc tách biệt các luồng gọi API khỏi giao diện UI Components, đưa vào thư mục quản lý tập trung `lib/api/`.

### Thiết kế API / DTO & Client helper

#### 1. API Client Helper (`lib/api/client.ts`)
- Đóng gói logic gọi `fetch` để tự động xử lý baseUrl, thêm header `Authorization` và `Content-Type`.

#### 2. Mistake Bank API Module (`lib/api/mistake-bank.ts`)
- Đóng gói các hàm gọi API ôn tập, lấy danh sách, xóa câu sai.

#### 3. Quiz API Module (`lib/api/quiz.ts`)
- Đóng gói hàm gửi tiến trình thi thử.

---

### Các bước thực hiện

#### Bước 1: Tạo mới Client Helper `lib/api/client.ts`
- **File:** [lib/api/client.ts](file:///C:/Users/tamgt/Projects/enstudey/enstudeyfe/lib/api/client.ts)
- **Ngôn ngữ & Action:** TypeScript | New
- **Mẫu Code dự kiến:**
```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export async function apiFetch<T>(
  path: string, 
  options: RequestInit & { token?: string }
): Promise<T> {
  const { token, headers, ...rest } = options;
  const requestHeaders = new Headers(headers);
  
  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }
  if (!(rest.body instanceof FormData) && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders
  });

  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.json() as Promise<T>;
}
```

#### Bước 2: Tạo mới Module API `lib/api/mistake-bank.ts`
- **File:** [lib/api/mistake-bank.ts](file:///C:/Users/tamgt/Projects/enstudey/enstudeyfe/lib/api/mistake-bank.ts)
- **Ngôn ngữ & Action:** TypeScript | New
- **Mẫu Code dự kiến:**
```typescript
import { apiFetch } from "./client";

export interface MistakeBankItem {
  id: number;
  questionId: number;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  status: "UNSEEN" | "REVIEWED" | "MASTERED";
  mistakeCount: number;
  correctStreak: number;
  lastFailedAt: string;
}

export function fetchMistakes(token: string, query: { page: number; size: number; status?: string; category?: string }) {
  const params = new URLSearchParams({
    page: query.page.toString(),
    size: query.size.toString()
  });
  if (query.status && query.status !== "ALL") params.append("status", query.status);
  if (query.category && query.category !== "ALL") params.append("category", query.category);

  return apiFetch<{ data: MistakeBankItem[]; meta: { page: number; size: number; total: number } }>(
    `/api/v1/mistake-bank?${params.toString()}`,
    { method: "GET", token }
  );
}

export function startPractice(token: string) {
  return apiFetch<{ data: { practiceSessionId: string; questions: any[] } }>(
    "/api/v1/mistake-bank/practice/start",
    { method: "POST", token }
  );
}

export function submitPractice(token: string, practiceSessionId: string, answers: any[]) {
  return apiFetch<any>(
    "/api/v1/mistake-bank/practice/submit",
    {
      method: "POST",
      token,
      body: JSON.stringify({ practiceSessionId, answers })
    }
  );
}

export function deleteMistake(token: string, id: number) {
  return apiFetch<any>(
    `/api/v1/mistake-bank/${id}`,
    { method: "DELETE", token }
  );
}
```

#### Bước 3: Tạo mới Module API `lib/api/quiz.ts`
- **File:** [lib/api/quiz.ts](file:///C:/Users/tamgt/Projects/enstudey/enstudeyfe/lib/api/quiz.ts)
- **Ngôn ngữ & Action:** TypeScript | New
- **Mẫu Code dự kiến:**
```typescript
import { apiFetch } from "./client";

export function submitQuizProgress(token: string, payload: { testType: string; score: number; totalQuestions: number; rawResults: string }) {
  return apiFetch<any>(
    "/api/v1/quizzes/progress",
    {
      method: "POST",
      token,
      body: JSON.stringify(payload)
    }
  );
}
```

#### Bước 4: Refactor `QuizContainer.tsx` để import và sử dụng API Helper
- **File:** [components/quiz/QuizContainer.tsx](file:///C:/Users/tamgt/Projects/enstudey/enstudeyfe/components/quiz/QuizContainer.tsx)
- **Ngôn ngữ & Action:** TypeScript | Modify
- **Mẫu Code dự kiến:**
```typescript
import { submitQuizProgress } from "@/lib/api/quiz";

// Thay thế đoạn gọi fetch trực tiếp bằng hàm:
submitQuizProgress(token, {
  testType: examType,
  score: correctCount,
  totalQuestions: questions.length,
  rawResults: JSON.stringify(rawResults)
})
```

#### Bước 5: Refactor `MistakeBankDashboard.tsx` và `MistakePracticeSession.tsx`
- **Files:**
  - [components/mistake-bank/MistakeBankDashboard.tsx](file:///C:/Users/tamgt/Projects/enstudey/enstudeyfe/components/mistake-bank/MistakeBankDashboard.tsx)
  - [components/mistake-bank/MistakePracticeSession.tsx](file:///C:/Users/tamgt/Projects/enstudey/enstudeyfe/components/mistake-bank/MistakePracticeSession.tsx)
- **Ngôn ngữ & Action:** TypeScript | Modify
- **Mô tả:** Import các hàm `fetchMistakes`, `startPractice`, `submitPractice`, `deleteMistake` từ `lib/api/mistake-bank.ts` và loại bỏ hoàn toàn các đoạn code `fetch` thô.
