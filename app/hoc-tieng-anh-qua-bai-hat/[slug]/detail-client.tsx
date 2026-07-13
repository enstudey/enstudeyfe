"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Play, 
  Volume2, 
  ChevronLeft, 
  HelpCircle, 
  BookOpen, 
  Info
} from "lucide-react";

interface LyricLine {
  time: number;
  text: string;
  translation: string;
}

interface VocabularyWord {
  word: string;
  time: number;
  meaning: string;
  type: string;
  ipa: string;
  example: string;
}

interface SongData {
  songId: string;
  title: string;
  artist: string;
  youtubeVideoId: string;
  difficulty: string;
  lyricsLines: LyricLine[];
  vocabulary: VocabularyWord[];
}

interface DetailClientProps {
  songData: SongData;
}

interface YTPlayer {
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  playVideo(): void;
  getCurrentTime(): number;
  destroy(): void;
}

// Khai báo kiểu an toàn cho YouTube IFrame Player API
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId: string;
          playerVars?: {
            playsinline?: number;
            rel?: number;
            modestbranding?: number;
            controls?: number;
            fs?: number;
          };
          events?: {
            onReady?: () => void;
            onStateChange?: (event: { data: number }) => void;
            onError?: () => void;
          };
        }
      ) => YTPlayer;
    };
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

let apiLoaded = false;
function loadYoutubeSDK(callback: () => void) {
  if (typeof window === "undefined") return;
  
  if (window.YT && window.YT.Player) {
    callback();
    return;
  }
  
  if (!apiLoaded) {
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else {
      document.head.appendChild(tag);
    }
    apiLoaded = true;
  }

  const previousCallback = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => {
    if (previousCallback) previousCallback();
    callback();
  };
}

export default function LyricsDecoderDetailClient({ songData }: DetailClientProps) {
  const playerRef = useRef<YTPlayer | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [hasAdblockError, setHasAdblockError] = useState(false);

  // Khởi tạo YouTube Player
  useEffect(() => {
    let player: YTPlayer | null = null;
    
    const initPlayer = () => {
      try {
        player = new window.YT.Player("youtube-player-element", {
          videoId: songData.youtubeVideoId,
          playerVars: {
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            controls: 1,
            fs: 1,
          },
          events: {
            onReady: () => {
              setPlayerReady(true);
            },
            onStateChange: (event: { data: number }) => {
              // YT.PlayerState.PLAYING = 1
              if (event.data === 1) {
                setIsPlaying(true);
              } else {
                setIsPlaying(false);
              }
            },
            onError: () => {
              setHasAdblockError(true);
            }
          },
        });
        playerRef.current = player;
      } catch {
        setHasAdblockError(true);
      }
    };

    loadYoutubeSDK(initPlayer);

    return () => {
      if (player && typeof player.destroy === "function") {
        player.destroy();
      }
    };
  }, [songData.youtubeVideoId]);

  // Đồng bộ lyrics theo mốc thời gian của bài hát (polling mỗi 250ms khi đang phát nhạc)
  useEffect(() => {
    if (!isPlaying || !playerReady || !playerRef.current) return;

    const interval = setInterval(() => {
      try {
        const player = playerRef.current;
        if (!player) return;
        const currentTime = player.getCurrentTime();
        
        // Tìm dòng hiện tại dựa vào currentTime
        const matchIdx = songData.lyricsLines.findIndex((line, idx) => {
          const nextLine = songData.lyricsLines[idx + 1];
          return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
        });

        if (matchIdx !== -1 && matchIdx !== activeIdx) {
          setActiveIdx(matchIdx);
          
          // Tự động hiển thị từ vựng nổi bật của dòng đang active (nếu có)
          const currentLineTime = songData.lyricsLines[matchIdx]?.time;
          if (currentLineTime !== undefined) {
            const matchVocab = songData.vocabulary.find(v => Math.abs(v.time - currentLineTime) < 1.0);
            if (matchVocab) {
              setSelectedWord(matchVocab);
            }
          }
        }
      } catch {
        // Bỏ qua lỗi truy cập API YouTube lúc tải
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isPlaying, playerReady, activeIdx, songData.lyricsLines, songData.vocabulary]);

  // Tự động cuộn dòng active lên giữa khung lyrics
  useEffect(() => {
    if (activeIdx === -1) return;
    
    const activeEl = document.getElementById(`lyric-line-${activeIdx}`);
    const container = scrollContainerRef.current;
    
    if (activeEl && container) {
      const containerHeight = container.clientHeight;
      const elOffsetTop = activeEl.offsetTop;
      const elHeight = activeEl.clientHeight;
      
      // Tính toán vị trí cuộn để căn giữa dòng active
      const scrollPosition = elOffsetTop - (containerHeight / 2) + (elHeight / 2);
      
      container.scrollTo({
        top: Math.max(0, scrollPosition),
        behavior: "smooth"
      });
    }
  }, [activeIdx]);

  // Hàm điều khiển tua nhạc (seek) khi click dòng lyrics
  const handleLineClick = (time: number, index: number) => {
    if (playerRef.current && playerReady) {
      playerRef.current.seekTo(time, true);
      // Nếu video đang dừng, tự động bấm phát nhạc
      if (!isPlaying) {
        playerRef.current.playVideo();
      }
      setActiveIdx(index);

      // Cập nhật từ vựng tương ứng khi bấm dòng lyrics
      const currentLineTime = songData.lyricsLines[index]?.time;
      if (currentLineTime !== undefined) {
        const matchVocab = songData.vocabulary.find(v => Math.abs(v.time - currentLineTime) < 1.0);
        if (matchVocab) {
          setSelectedWord(matchVocab);
        }
      }
    }
  };

  // Text-To-Speech (TTS) đọc từ vựng miễn phí
  const handleSpeak = (word: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      // Dừng phát âm hiện tại nếu có
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.85; // tốc độ nói chậm một chút để dễ nghe
      window.speechSynthesis.speak(utterance);
    }
  };

  // Hàm escaping ký tự đặc biệt trong Regex
  const escapeRegExp = (str: string) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  // Render chuỗi lyrics có highlight các từ vựng khó học
  const renderHighlightedText = (text: string) => {
    const sortedVocab = [...songData.vocabulary].sort((a, b) => b.word.length - a.word.length);
    let nodes: React.ReactNode[] = [text];

    for (const vocab of sortedVocab) {
      const wordToMatch = vocab.word;
      const nextNodes: React.ReactNode[] = [];

      for (const node of nodes) {
        if (typeof node !== "string") {
          nextNodes.push(node);
          continue;
        }

        const parts = node.split(new RegExp(`\\b(${escapeRegExp(wordToMatch)})\\b`, "gi"));
        if (parts.length > 1) {
          parts.forEach((part, index) => {
            if (index % 2 === 1) {
              nextNodes.push(
                <button
                  key={`${vocab.word}-${index}`}
                  onClick={(e) => {
                    e.stopPropagation(); // ngăn cản sự kiện tua nhạc của dòng cha
                    setSelectedWord(vocab);
                  }}
                  className="px-1 text-violet-600 dark:text-violet-400 font-bold border-b border-dashed border-violet-500 hover:text-violet-800 dark:hover:text-violet-300 hover:bg-violet-50 dark:hover:bg-violet-950/20 transition-all rounded cursor-pointer"
                  title="Xem định nghĩa chi tiết"
                >
                  {part}
                </button>
              );
            } else if (part) {
              nextNodes.push(part);
            }
          });
        } else {
          nextNodes.push(node);
        }
      }
      nodes = nextNodes;
    }

    return nodes;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Nút quay lại */}
      <div className="mb-6">
        <Link
          href="/hoc-tieng-anh-qua-bai-hat"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          data-testid="btn-back-to-list"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Danh sách bài hát</span>
        </Link>
      </div>

      {/* Header bài hát */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            {songData.title}
          </h1>
          <span className="px-2.5 py-0.5 text-xs font-extrabold uppercase rounded bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-400 border border-violet-200 dark:border-violet-900/50">
            {songData.difficulty}
          </span>
        </div>
        <p className="text-base text-slate-500 dark:text-slate-400">
          Trình bày: <span className="font-semibold">{songData.artist}</span>
        </p>
      </div>

      {/* Layout chính 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Cột trái: Trình phát video YouTube + Giải nghĩa từ vựng */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Trình phát Video */}
          <div className="sticky top-24 z-10 flex flex-col gap-6">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-lg border border-slate-200/50 dark:border-zinc-800/50">
              {hasAdblockError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-zinc-900 text-white">
                  <HelpCircle className="w-12 h-12 text-rose-500 mb-3" />
                  <h3 className="font-bold text-base mb-1">Không thể tải trình phát</h3>
                  <p className="text-xs text-zinc-400 max-w-xs">
                    Có thể do AdBlocker chặn YouTube API. Bạn vẫn có thể đọc lời dịch song ngữ và học từ vựng tĩnh bên phải.
                  </p>
                </div>
              ) : (
                <div id="youtube-player-element" className="w-full h-full" data-testid="yt-player-container"></div>
              )}
            </div>

            {/* Hint & Navigation Instruction */}
            <div className="bg-slate-100/80 dark:bg-zinc-900/50 rounded-xl p-3 border border-slate-200/40 dark:border-zinc-800/40 flex gap-2.5 items-start">
              <Info className="w-4 h-4 text-violet-500 shrink-0 mt-0.5" />
              <p className="text-2xs text-slate-500 dark:text-slate-400 leading-relaxed">
                <span className="font-bold text-slate-700 dark:text-slate-300">Mẹo học tập:</span> Nhấp trực tiếp vào bất kỳ câu hát nào ở danh sách bên phải để tua video đến phân đoạn đó. Nhấp vào từ <span className="underline decoration-dashed decoration-violet-500 font-semibold text-violet-600 dark:text-violet-400">gạch chân</span> để tra nghĩa nhanh.
              </p>
            </div>

            {/* Bảng tra cứu từ vựng chi tiết (Vocabulary Details) */}
            <div 
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 p-5 shadow-sm min-h-[220px] flex flex-col justify-between"
              data-testid="vocab-detail-box"
            >
              {selectedWord ? (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between gap-3 mb-2.5">
                    <span className="text-xs font-extrabold uppercase text-violet-600 bg-violet-50 dark:bg-violet-950/30 dark:text-violet-400 px-2 py-0.5 rounded border border-violet-100 dark:border-violet-900/50">
                      {selectedWord.type}
                    </span>
                    <button
                      onClick={() => handleSpeak(selectedWord.word)}
                      className="inline-flex items-center gap-1 text-2xs font-bold text-slate-600 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 bg-slate-50 dark:bg-zinc-950 px-2 py-1 rounded-lg border border-slate-200/50 dark:border-zinc-800/50 transition-colors cursor-pointer"
                      title="Nghe phát âm chuẩn AI"
                      data-testid="btn-speak-word"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Phát âm</span>
                    </button>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {selectedWord.word}
                  </h3>
                  
                  <p className="text-xs font-semibold text-slate-400 dark:text-zinc-500 mb-3.5">
                    {selectedWord.ipa}
                  </p>

                  <div className="border-t border-slate-100 dark:border-zinc-800/50 pt-3">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2">
                      <span className="text-slate-400 font-medium text-xs block mb-0.5">Nghĩa tiếng Việt</span>
                      {selectedWord.meaning}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-zinc-950 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-900/50">
                      <span className="text-slate-400 font-medium text-3xs block not-italic mb-1 uppercase tracking-wide">Ví dụ minh họa</span>
                      &ldquo;{selectedWord.example}&rdquo;
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-8 text-slate-400 dark:text-zinc-600 my-auto">
                  <BookOpen className="w-10 h-10 mb-2 opacity-60" />
                  <p className="text-xs font-medium">Bấm vào từ vựng được highlight trong lyrics để tra cứu nghĩa nhanh</p>
                </div>
              )}
            </div>

            {/* Vùng AdSense chống CLS & click tặc */}
            <div className="min-h-[100px] border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl flex items-center justify-center bg-slate-50/50 dark:bg-zinc-900/10 p-4">
              <span className="text-3xs text-slate-400 uppercase tracking-widest">Quảng cáo AdSense</span>
            </div>
          </div>
        </div>

        {/* Cột phải: Khung Lời bài hát & Lời dịch song ngữ */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 shadow-sm overflow-hidden">
            {/* Header thanh cuộn */}
            <div className="border-b border-slate-100 dark:border-zinc-800 p-4 bg-slate-50/50 dark:bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-600 animate-pulse"></div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Lời bài hát song ngữ</span>
              </div>
              <span className="text-3xs text-slate-400">Nhấp để đồng bộ video</span>
            </div>

            {/* Khung cuộn lyrics */}
            <div
              ref={scrollContainerRef}
              className="overflow-y-auto h-[450px] sm:h-[550px] p-6 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800"
              data-testid="lyrics-scroll-container"
            >
              {songData.lyricsLines.map((line, index) => {
                const isActive = index === activeIdx;
                
                return (
                  <div
                    key={index}
                    id={`lyric-line-${index}`}
                    onClick={() => handleLineClick(line.time, index)}
                    className={`group relative p-3 sm:p-4 rounded-xl border-l-4 transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-violet-50/80 dark:bg-violet-950/20 border-violet-600 shadow-sm"
                        : "border-transparent hover:bg-slate-50 dark:hover:bg-zinc-850 hover:border-slate-300 dark:hover:border-zinc-700"
                    }`}
                    data-testid={`lyric-line-item-${index}`}
                  >
                    {/* Hover play icon */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-3.5 h-3.5 text-slate-400 fill-current" />
                    </div>

                    {/* Dòng gốc tiếng Anh */}
                    <div 
                      className={`text-sm sm:text-base font-medium tracking-wide leading-relaxed mb-1 pr-6 ${
                        isActive 
                          ? "text-violet-900 dark:text-violet-300 font-bold" 
                          : "text-slate-800 dark:text-slate-250"
                      }`}
                    >
                      {renderHighlightedText(line.text)}
                    </div>

                    {/* Dòng dịch tiếng Việt */}
                    <div 
                      className={`text-xs sm:text-sm pr-6 leading-normal ${
                        isActive 
                          ? "text-violet-750 dark:text-violet-400 font-medium" 
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {line.translation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
