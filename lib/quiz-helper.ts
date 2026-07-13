export interface QuizQuestion {
  id: string;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  part: string;
  topic: string;
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Lấy ngẫu nhiên 10 câu hỏi từ kho đề.
 * Ưu tiên các câu hỏi thuộc chủ đề yếu (weakTopics) của học viên.
 */
export function getRandomQuiz(pool: QuizQuestion[], weakTopics: string[] = []): QuizQuestion[] {
  if (!pool || pool.length === 0) return [];

  // Lọc các câu thuộc chủ đề yếu
  const weakQuestions = pool.filter(q => weakTopics.includes(q.topic));
  const normalQuestions = pool.filter(q => !weakTopics.includes(q.topic));

  // Trộn ngẫu nhiên từng nhóm bằng Fisher-Yates
  const shuffledWeak = shuffle(weakQuestions);
  const shuffledNormal = shuffle(normalQuestions);

  // Ghép nhóm yếu lên trước, bù thêm nhóm thường cho đủ 10 câu
  const selected = [...shuffledWeak, ...shuffledNormal].slice(0, 10);

  // Trộn lại lần cuối để các câu hỏi phân bố tự nhiên, không dồn cục các câu chủ đề yếu lên đầu
  return shuffle(selected);
}
