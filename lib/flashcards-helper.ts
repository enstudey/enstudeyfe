export interface Flashcard {
  id: string;
  word: string;
  ipa: string;
  meaning: string;
  description: string;
  topic: string;
  exam: string;
}

export interface CardProgress {
  cardId: string;
  interval: number;
  repetition: number;
  efactor: number;
  nextReviewDate: string; // ISO string
  lastReviewedAt: string; // ISO string
  ghostDurationMs?: number;
}

export interface TopicStatus {
  topicId: string;
  totalCards: number;
  masteredCards: number;
  masteredPercent: number;
  hp: number;
  status: 'idle' | 'studying' | 'mastered';
  lastStudiedAt: string | null;
}

/**
 * Tính toán Hp của chủ đề dựa trên sự suy giảm trí nhớ qua thời gian (Spaced Repetition Decay)
 * Hp = 100 * e^(-lambda * deltaHours)
 * halfLife = 24 * averageIntervalDays (tối thiểu 24h)
 * lambda = ln(2) / halfLife
 */
export function calculateHp(lastReviewedAtStr: string | null, averageIntervalDays: number): number {
  if (!lastReviewedAtStr) return 100;
  
  const lastReviewed = new Date(lastReviewedAtStr);
  const now = new Date();
  const deltaHours = (now.getTime() - lastReviewed.getTime()) / (1000 * 60 * 60);
  
  if (deltaHours <= 0) return 100;

  // Chu kỳ bán rã tính bằng giờ (tối thiểu 24 giờ)
  const halfLifeHours = Math.max(24, 24 * averageIntervalDays);
  const lambda = Math.log(2) / halfLifeHours;
  const hp = 100 * Math.exp(-lambda * deltaHours);

  return Math.min(100, Math.max(0, Math.round(hp)));
}

/**
 * Nhóm danh sách từ vựng phẳng theo Topic
 */
export function groupVocabByTopic(vocabList: Flashcard[]): Record<string, Flashcard[]> {
  const groups: Record<string, Flashcard[]> = {};
  vocabList.forEach((card) => {
    const topic = card.topic || 'Khác';
    if (!groups[topic]) {
      groups[topic] = [];
    }
    groups[topic].push(card);
  });
  return groups;
}

/**
 * Tính toán chi tiết trạng thái của từng chủ đề
 */
export function getTopicStatusList(
  groupedVocab: Record<string, Flashcard[]>,
  progressMap: Record<string, CardProgress>
): TopicStatus[] {
  return Object.entries(groupedVocab).map(([topicName, cards]) => {
    let masteredCards = 0;
    let totalInterval = 0;
    let studiedCount = 0;
    let latestReviewedAt: string | null = null;

    cards.forEach((card) => {
      const prog = progressMap[card.id];
      if (prog) {
        studiedCount++;
        totalInterval += prog.interval;
        
        // Điều kiện Master: repetition >= 2 và efactor >= 2.0
        if (prog.repetition >= 2 && prog.efactor >= 2.0) {
          masteredCards++;
        }

        if (!latestReviewedAt || new Date(prog.lastReviewedAt) > new Date(latestReviewedAt)) {
          latestReviewedAt = prog.lastReviewedAt;
        }
      }
    });

    const totalCards = cards.length;
    const masteredPercent = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;
    
    // Tính trung bình interval của các từ đã học trong topic, mặc định 1 ngày nếu chưa học từ nào
    const averageIntervalDays = studiedCount > 0 ? totalInterval / studiedCount : 1;
    const hp = calculateHp(latestReviewedAt, averageIntervalDays);

    let status: 'idle' | 'studying' | 'mastered' = 'idle';
    if (masteredPercent >= 80) {
      status = 'mastered';
    } else if (studiedCount > 0) {
      status = 'studying';
    }

    return {
      topicId: topicName,
      totalCards,
      masteredCards,
      masteredPercent,
      hp,
      status,
      lastStudiedAt: latestReviewedAt
    };
  });
}
