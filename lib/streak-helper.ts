export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  history: string[];
}

export function getTodayDateString(): string {
  // Trả về ngày định dạng YYYY-MM-DD theo múi giờ địa phương (GMT+7)
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const date = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

export function getYesterdayDateString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const date = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${date}`;
}

export function updateStreakAndXp(xpGained: number): { currentStreak: number; xp: number } {
  if (typeof window === "undefined") {
    return { currentStreak: 0, xp: 0 };
  }

  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();

  // 1. Cập nhật Streak
  const savedStreak = localStorage.getItem("user_streak_data");
  let streakData: StreakData = {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: "",
    history: []
  };

  if (savedStreak) {
    try {
      streakData = JSON.parse(savedStreak);
    } catch (e) {
      console.error("Failed to parse user_streak_data", e);
    }
  }

  const lastDate = streakData.lastActivityDate;
  let newStreak = streakData.currentStreak;

  if (lastDate === today) {
    // Đã học hôm nay, giữ nguyên streak
  } else if (lastDate === yesterday) {
    // Học tiếp liên tục từ hôm qua, tăng streak
    newStreak += 1;
  } else {
    // Bỏ lỡ hoặc bắt đầu chuỗi mới
    newStreak = 1;
  }

  const newLongest = Math.max(newStreak, streakData.longestStreak);
  const updatedHistory = [...(streakData.history || [])];
  if (!updatedHistory.includes(today)) {
    updatedHistory.push(today);
  }

  const newStreakData: StreakData = {
    currentStreak: newStreak,
    longestStreak: newLongest,
    lastActivityDate: today,
    history: updatedHistory
  };

  localStorage.setItem("user_streak_data", JSON.stringify(newStreakData));
  // Đồng bộ với key cũ để duy trì tương thích ngược hiển thị
  localStorage.setItem("user_progress_streak", String(newStreak));

  // 2. Cập nhật XP
  const savedXp = localStorage.getItem("user_progress_xp");
  let currentXp = savedXp ? parseInt(savedXp, 10) : 0;
  currentXp += xpGained;
  localStorage.setItem("user_progress_xp", String(currentXp));

  return { currentStreak: newStreak, xp: currentXp };
}
