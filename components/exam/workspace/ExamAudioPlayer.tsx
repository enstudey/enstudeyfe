"use client";

import React, { useState, useRef, useEffect } from "react";
import { Volume2, RotateCcw, RotateCw, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamAudioPlayerProps {
  audioUrl: string;
  partTitle?: string;
}

export default function ExamAudioPlayer({
  audioUrl,
  partTitle = "Listening Test",
}: ExamAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    setIsPlaying(true);
    audio.play().catch((e) => console.log("Audio autoplay check", e));

    return () => {
      audio.pause();
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((e) => console.log("Audio play error", e));
      setIsPlaying(true);
    }
  };

  const handleSeek = (secondsDelta: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + secondsDelta));
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col items-center justify-center text-center space-y-3.5 select-none h-full min-h-[240px]">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={() => {
          if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />

      {/* Visual Audio Waveform Disk Indicator */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-50 flex items-center justify-center border-2 border-dashed border-indigo-200 relative shadow-inner">
        <div
          className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-600 transition-all ${
            isPlaying ? "scale-105 shadow-md shadow-indigo-100 animate-pulse" : ""
          }`}
        >
          <Volume2 className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-0.5">
        <span className="inline-flex items-center bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wider">
          {partTitle}
        </span>
        <h4 className="font-extrabold text-xs sm:text-sm text-slate-800">
          Trình phát Audio Listening Guard
        </h4>
        <p className="text-[10px] text-slate-400 font-medium">
          {formatTime(currentTime)} / {formatTime(duration)}
        </p>
      </div>

      {/* Animated Waveform Visual Bars */}
      <div className="flex items-center justify-center gap-1 h-6 w-40">
        {[40, 75, 50, 90, 30, 85, 60, 100, 45, 70, 35, 80].map((h, idx) => (
          <span
            key={idx}
            style={{ height: isPlaying ? `${h}%` : "15%" }}
            className="w-1 bg-indigo-500 rounded-full transition-all duration-300"
          />
        ))}
      </div>

      {/* Control Action Buttons */}
      <div className="flex items-center justify-center gap-2 pt-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSeek(-10)}
          data-testid="btn-audio-rewind-10"
          title="Lùi 10 giây"
          className="rounded-xl h-8 px-2.5 gap-1 text-slate-700 border-slate-200 hover:bg-slate-50 text-xs"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="text-[11px] font-bold">-10s</span>
        </Button>

        <Button
          onClick={togglePlayPause}
          className="w-9 h-9 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs flex items-center justify-center"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleSeek(10)}
          data-testid="btn-audio-forward-10"
          title="Tiến 10 giây"
          className="rounded-xl h-8 px-2.5 gap-1 text-slate-700 border-slate-200 hover:bg-slate-50 text-xs"
        >
          <span className="text-[11px] font-bold">+10s</span>
          <RotateCw className="w-3 h-3" />
        </Button>

        <Button
          variant="secondary"
          size="sm"
          onClick={cycleSpeed}
          data-testid="btn-audio-speed-toggle"
          title="Đổi tốc độ phát"
          className="rounded-xl h-8 px-2.5 font-mono text-[11px] font-black bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100"
        >
          {playbackSpeed.toFixed(2)}x
        </Button>
      </div>
    </div>
  );
}
