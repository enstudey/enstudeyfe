"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Music, Sparkles, Play, Lock, ChevronRight, HelpCircle } from "lucide-react";

interface Song {
  songId: string;
  slug: string;
  title: string;
  artist: string;
  difficulty: "A2" | "B1" | "B2";
  category: string;
  duration: string;
  status: "active" | "coming-soon";
  gradient: string;
}

const SONGS_DATA: Song[] = [
  {
    songId: "perfect-ed",
    slug: "perfect",
    title: "Perfect",
    artist: "Ed Sheeran",
    difficulty: "B1",
    category: "Tình yêu & Cảm xúc",
    duration: "4:39",
    status: "active",
    gradient: "from-pink-500 via-purple-500 to-indigo-500",
  },
  {
    songId: "shape-of-you-ed",
    slug: "shape-of-you",
    title: "Shape of You",
    artist: "Ed Sheeran",
    difficulty: "A2",
    category: "Giao tiếp & Đời sống",
    duration: "3:53",
    status: "coming-soon",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    songId: "someone-like-you-adele",
    slug: "someone-like-you",
    title: "Someone Like You",
    artist: "Adele",
    difficulty: "B2",
    category: "Tình cảm & Tâm sự",
    duration: "4:45",
    status: "coming-soon",
    gradient: "from-amber-500 to-red-500",
  },
  {
    songId: "photograph-ed",
    slug: "photograph",
    title: "Photograph",
    artist: "Ed Sheeran",
    difficulty: "A2",
    category: "Kỷ niệm & Ký ức",
    duration: "4:19",
    status: "coming-soon",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    songId: "let-her-go-passenger",
    slug: "let-her-go",
    title: "Let Her Go",
    artist: "Passenger",
    difficulty: "B1",
    category: "Tình yêu & Sự chia ly",
    duration: "4:12",
    status: "coming-soon",
    gradient: "from-indigo-500 to-purple-700",
  }
];

export default function LyricsListClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const filteredSongs = SONGS_DATA.filter((song) => {
    const matchesSearch =
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiff = selectedDifficulty === "ALL" || song.difficulty === selectedDifficulty;
    return matchesSearch && matchesDiff;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div 
          className="fixed bottom-5 right-5 z-50 flex items-center bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700/50 animate-fade-in-up"
          role="alert"
        >
          <Sparkles className="w-5 h-5 text-amber-400 mr-2 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 text-violet-600 dark:text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4 animate-fade-in">
          <Music className="w-3.5 h-3.5" />
          <span>Học Tiếng Anh Qua Lời Bài Hát</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
          Contextual <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">Lyrics Decoder</span>
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400">
          Chinh phục từ vựng, cụm từ giao tiếp và cấu trúc ngữ pháp thông dụng qua những giai điệu bất hủ. Kết hợp nghe nhạc chất lượng cao và tương tác trực quan.
        </p>
      </div>

      {/* Search & Filters Layout */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8 bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="songSearchInput"
            type="text"
            placeholder="Tìm tên bài hát hoặc ca sĩ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            data-testid="input-search-songs"
          />
        </div>

        {/* Difficulty Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">Mức độ:</span>
          {["ALL", "A2", "B1", "B2"].map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                selectedDifficulty === diff
                  ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                  : "bg-slate-50 dark:bg-zinc-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-900"
              }`}
              data-testid={`btn-filter-${diff.toLowerCase()}`}
            >
              {diff === "ALL" ? "Tất cả" : diff}
            </button>
          ))}
        </div>
      </div>

      {/* Songs Grid */}
      {filteredSongs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSongs.map((song) => {
            const isActive = song.status === "active";
            const diffColors = {
              A2: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
              B1: "bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400 border-violet-100 dark:border-violet-900/50",
              B2: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
            };

            return (
              <div
                key={song.songId}
                className="group relative flex flex-col justify-between bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 dark:hover:border-zinc-700 transition-all duration-300 hover:scale-[1.02]"
                data-testid={`song-card-${song.slug}`}
              >
                {/* Album Art Representation */}
                <div className={`relative h-44 bg-gradient-to-br ${song.gradient} flex items-center justify-center p-6 overflow-hidden`}>
                  {/* Decorative vinyl record effect */}
                  <div className="absolute w-36 h-36 rounded-full bg-slate-950/20 backdrop-blur-sm flex items-center justify-center border border-white/10 group-hover:rotate-45 transition-transform duration-700">
                    <div className="w-24 h-24 rounded-full border border-dashed border-white/20 flex items-center justify-center">
                      <Music className="w-10 h-10 text-white/70" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className={`px-2 py-0.5 text-3xs font-extrabold uppercase tracking-wide rounded-md border ${diffColors[song.difficulty]}`}>
                      {song.difficulty}
                    </span>
                    <span className="px-2 py-0.5 text-3xs font-extrabold uppercase tracking-wide rounded-md bg-white/20 text-white backdrop-blur-sm border border-white/10">
                      {song.category}
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 px-1.5 py-0.5 text-3xs font-bold rounded-md bg-slate-900/60 text-white backdrop-blur-sm">
                    {song.duration}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                      {song.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{song.artist}</p>
                  </div>

                  {/* Action Button */}
                  {isActive ? (
                    <Link
                      href={`/hoc-tieng-anh-qua-bai-hat/${song.slug}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-violet-500/10 hover:shadow-violet-500/20"
                      data-testid={`btn-learn-${song.slug}`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Học Ngay</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => showToast(`Bài hát "${song.title}" đang được biên soạn từ vựng và sẽ sớm ra mắt!`)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer hover:bg-slate-200 dark:hover:bg-zinc-750 transition-all"
                      data-testid={`btn-lock-${song.slug}`}
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Sắp ra mắt</span>
                      <HelpCircle className="w-4 h-4 ml-auto text-slate-400/70" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 p-8 shadow-sm">
          <Music className="w-12 h-12 text-slate-350 dark:text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">Không tìm thấy bài hát nào</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Hãy thử tìm kiếm từ khóa khác hoặc thay đổi bộ lọc độ khó.
          </p>
        </div>
      )}
    </div>
  );
}
