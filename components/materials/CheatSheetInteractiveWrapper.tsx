"use client";

import React, { useEffect, useState, useRef } from "react";

interface CheatSheetInteractiveWrapperProps {
  topic: string;
  children: React.ReactNode;
  initialGlossary?: Record<string, string>;
}

interface TooltipState {
  term: string;
  definition: string;
  x: number;
  y: number;
}

export default function CheatSheetInteractiveWrapper({
  topic,
  children,
  initialGlossary,
}: CheatSheetInteractiveWrapperProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [glossary, setGlossary] = useState<Record<string, string>>(() => {
    const mapped: Record<string, string> = {};
    if (initialGlossary) {
      Object.keys(initialGlossary).forEach((key) => {
        mapped[key.toLowerCase()] = initialGlossary[key];
      });
    }
    return mapped;
  });

  // 1. Fetch glossary JSON dynamically on mount based on the topic/slug if not passed
  useEffect(() => {
    if (initialGlossary && Object.keys(initialGlossary).length > 0) return;

    const fetchGlossary = async () => {
      try {
        const response = await fetch(`/data/glossary/${topic}.json`);
        if (response.ok) {
          const data = await response.json();
          const mapped: Record<string, string> = {};
          // Support both array and object formats in glossary JSON
          if (Array.isArray(data)) {
            data.forEach((item: { term?: string; definition?: string }) => {
              if (item.term && item.definition) {
                mapped[item.term.toLowerCase()] = item.definition;
              }
            });
          } else {
            Object.keys(data as Record<string, string>).forEach((key) => {
              mapped[key.toLowerCase()] = (data as Record<string, string>)[key];
            });
          }
          setGlossary(mapped);
        }
      } catch (err) {
        // Fallback silently as per specs
        console.warn("Glossary fetch failed, using default dictionary fallback.", err);
      }
    };
    fetchGlossary();
  }, [topic, initialGlossary]);

  // 2. Setup Event Delegation
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Handle toggle answer clicks
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains("toggle-answer-btn")) {
        const answerContent = target.nextElementSibling as HTMLElement;
        if (answerContent && answerContent.classList.contains("answer-content")) {
          const isHidden = answerContent.classList.contains("hidden");
          if (isHidden) {
            answerContent.classList.remove("hidden");
            target.textContent = "Ẩn đáp án";
          } else {
            answerContent.classList.add("hidden");
            target.textContent = "Xem đáp án";
          }
        }
      }
    };

    // Handle glossary hover/tooltip
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains("glossary-term")) {
        const rawTerm = target.getAttribute("data-term") || target.textContent || "";
        const termKey = rawTerm.trim().toLowerCase();

        // Lookup in local dictionary
        const definition = glossary[termKey] || "Đang tải giải nghĩa...";

        const rect = target.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setTooltip({
          term: rawTerm,
          definition,
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top - 10,
        });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && target.classList.contains("glossary-term")) {
        setTooltip(null);
      }
    };

    container.addEventListener("click", handleClick);
    container.addEventListener("mouseover", handleMouseOver);
    container.addEventListener("mouseout", handleMouseOut);

    return () => {
      container.removeEventListener("click", handleClick);
      container.removeEventListener("mouseover", handleMouseOver);
      container.removeEventListener("mouseout", handleMouseOut);
    };
  }, [glossary]);

  // 3. Mount Interactive Quizzes dynamically on client-side
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    const rootsList: { root: { unmount: () => void }; element: Element }[] = [];

    import("react-dom/client").then(({ createRoot }) => {
      if (!isMounted) return;
      const quizBlocks = container.querySelectorAll(".interactive-quiz-block");
      quizBlocks.forEach((block) => {
        if (block.getAttribute("data-mounted") === "true") return;
        block.setAttribute("data-mounted", "true");

        const question = decodeURIComponent(block.getAttribute("data-question") || "");
        const options = JSON.parse(decodeURIComponent(block.getAttribute("data-options") || "[]"));
        const correct = decodeURIComponent(block.getAttribute("data-correct") || "");
        const explanation = decodeURIComponent(block.getAttribute("data-explanation") || "");

        const root = createRoot(block);
        root.render(
          <InteractiveQuiz
            question={question}
            options={options}
            correct={correct}
            explanation={explanation}
          />
        );
        rootsList.push({ root, element: block });
      });
    });

    return () => {
      isMounted = false;
      setTimeout(() => {
        rootsList.forEach(({ root, element }) => {
          try {
            root.unmount();
          } catch {
            // Ignore unmount error if element already deleted from DOM
          }
          element.removeAttribute("data-mounted");
        });
      }, 0);
    };
  }, [children]);

  return (
    <div ref={containerRef} className="relative w-full">
      {children}

      {/* Floating Tooltip with zero CLS impact */}
      {tooltip && (
        <div
          className="absolute z-50 transform -translate-x-1/2 -translate-y-full bg-slate-900 text-white text-xs rounded-xl p-3 max-w-[280px] shadow-xl border border-slate-800 transition-all duration-200"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
          }}
          data-testid="glossary-tooltip"
        >
          <div className="font-extrabold text-violet-400 mb-1">{tooltip.term}</div>
          <div className="leading-relaxed opacity-90">{tooltip.definition}</div>
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-slate-900"></div>
        </div>
      )}
    </div>
  );
}

function InteractiveQuiz({
  question,
  options,
  correct,
  explanation,
}: {
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (option: string) => {
    if (selected) return;
    setSelected(option);
    setShowExplanation(true);
  };

  return (
    <div className="space-y-4">
      <div className="text-xs font-bold text-violet-600 uppercase tracking-widest">
        Câu hỏi luyện tập (Từ vựng trong bài viết)
      </div>
      <div className="text-sm font-semibold text-slate-800 leading-relaxed whitespace-pre-line">
        {question.replace(/\\n/g, "\n")}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
        {options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === correct;

          let btnClass =
            "bg-white border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-700";
          if (selected) {
            if (isCorrect) {
              btnClass = "bg-emerald-50 border-emerald-300 text-emerald-700 font-bold";
            } else if (isSelected) {
              btnClass = "bg-rose-50 border-rose-300 text-rose-700 font-bold";
            } else {
              btnClass = "bg-slate-50 border-slate-100 text-slate-400 opacity-60";
            }
          }

          return (
            <button
              key={option}
              type="button"
              disabled={selected !== null}
              onClick={() => handleSelect(option)}
              className={`w-full text-left px-4 py-3 rounded-xl border text-xs transition duration-200 cursor-pointer ${btnClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected && showExplanation && (
        <div className="space-y-2 mt-4 animate-in fade-in duration-200">
          {selected === correct ? (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
              <span>🎉 Đỉnh quá bạn ơi! Đáp án này chuẩn rồi nè.</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-600">
              <span>✨ Tiếc một xíu nghen... Đọc lời giải chi tiết bên dưới để không bị &quot;bẫy&quot; lần sau nha!</span>
            </div>
          )}
          <div className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            <strong>Giải thích:</strong> {explanation}
          </div>
        </div>
      )}
    </div>
  );
}
