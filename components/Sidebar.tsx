"use client";

import { useTheme } from "./ThemeProvider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const MOTIVATIONAL_QUOTES = [
  "Every task completed is a step toward your goals! 🚀",
  "Small progress is still progress. Keep going! 💪",
  "You're doing amazing! One task at a time. ✨",
  "Today's efforts are tomorrow's achievements! 🌟",
  "Stay focused and make it happen! 🎯",
  "Your productivity is your superpower! ⚡",
  "Dream big, work hard, stay focused! 🔥",
  "Success is the sum of small efforts! 🏆",
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const { theme } = useTheme();
  
  // Get a quote based on the day
  const todayQuote = MOTIVATIONAL_QUOTES[new Date().getDay()];

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-sidebar border-r-2 border-sidebar-border z-40 transition-all duration-300 ease-in-out ${
          isOpen ? "w-[15%] min-w-[240px]" : "w-0"
        } overflow-hidden`}
      >
        <div className="flex flex-col h-full p-5">
          {/* Header */}
          <div className="mb-6 pt-4">
            <h2 className="text-lg font-bold text-sidebar-foreground text-center">📋 To Do</h2>
          </div>

          {/* Motivational Quote - only show here for non-retro themes */}
          {theme !== "retro" && (
            <div className="bg-sidebar-accent rounded-xl p-4 mb-6">
              <p className="text-sm text-sidebar-accent-foreground font-medium text-center italic">
                "{todayQuote}"
              </p>
            </div>
          )}

          {/* Pokemon Card Animation - for retro theme */}
          {theme === "retro" && (
            <div className="flex-1 flex items-center justify-center">
              <LofiGirlAnimation quote={todayQuote} />
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Footer */}
          <div className="text-center text-xs text-muted-foreground">
            <p>To Do List Board v1.0</p>
            <p>Made with 💖</p>
          </div>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed bottom-[20%] z-50 bg-primary text-primary-foreground p-1.5 rounded-r-md shadow-lg hover:brightness-110 transition-all duration-300 ${
          isOpen ? "left-[15%] min-left-[240px]" : "left-0"
        }`}
        style={{ left: isOpen ? "max(15%, 240px)" : "0" }}
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </>
  );
}

// Tamagotchi style cute pet animation working at desk - Pokemon TCG Card style
function LofiGirlAnimation({ quote }: { quote: string }) {
  const [currentApp, setCurrentApp] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentApp((prev) => (prev + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-[220px]">
      {/* Pokemon TCG Card Frame */}
      <div className="bg-gradient-to-br from-yellow-400 via-yellow-300 to-yellow-500 p-1 rounded-xl shadow-2xl">
        {/* Inner border */}
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-700 p-0.5 rounded-lg">
          {/* Card content area */}
          <div className="bg-gradient-to-b from-pink-100 to-pink-200 rounded-lg overflow-hidden">
            
            {/* Card Header - Name plate */}
            <div className="bg-gradient-to-r from-pink-400 via-pink-300 to-pink-400 px-2 py-1 flex items-center justify-between border-b-2 border-yellow-500">
              <span className="text-[10px] font-bold text-gray-800">Tama-Coder</span>
              <span className="text-[8px] font-bold text-gray-900">HP 100</span>
            </div>

            {/* Scene Container - Art box */}
            <div className="mx-1 mt-1 border-2 border-yellow-500 rounded">
              <div className="relative bg-gradient-to-b from-purple-900 via-pink-900 to-orange-900 overflow-hidden aspect-[5/4]">
                
                {/* Window - Night */}
                <div className="absolute top-1 right-1 w-12 h-14 rounded border border-amber-600 bg-indigo-950">
                  {/* Stars */}
                  <div className="absolute top-1 left-1 w-0.5 h-0.5 bg-white rounded-full animate-pulse" />
                  <div className="absolute top-2 right-4 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute top-3 left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse" style={{ animationDelay: "1s" }} />
                  {/* Moon */}
                  <div className="absolute top-1 right-1 w-3 h-3 bg-yellow-100 rounded-full shadow-lg" />
                  {/* City silhouette */}
                  <div className="absolute bottom-0 left-0 right-0 h-5">
                    <div className="absolute bottom-0 left-0.5 w-2 h-4 bg-gray-800" />
                    <div className="absolute bottom-0 left-2.5 w-3 h-5 bg-gray-900" />
                    <div className="absolute bottom-0 right-1 w-2 h-4 bg-gray-800" />
                  </div>
                </div>

                {/* Hanging plant */}
                <div className="absolute top-0 left-2">
                  <div className="w-0.5 h-2 bg-amber-700 mx-auto" />
                  <div className="w-4 h-3 bg-amber-600 rounded-b-full" />
                  <div className="flex justify-center gap-0.5 -mt-0.5">
                    <div className="w-1.5 h-2 bg-green-500 rounded-full transform -rotate-12" />
                    <div className="w-1.5 h-3 bg-green-600 rounded-full" />
                    <div className="w-1.5 h-2 bg-green-500 rounded-full transform rotate-12" />
                  </div>
                </div>

                {/* Desk */}
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-amber-700" />
                <div className="absolute bottom-8 left-0 right-0 h-1.5 bg-amber-800" />

                {/* Monitor on desk - moved left */}
                <div className="absolute bottom-10 left-[25%] -translate-x-1/2">
                  {/* Monitor frame */}
                  <div className="w-14 h-10 bg-gray-800 rounded-t-md p-0.5 shadow-lg">
                    {/* Screen with changing apps */}
                    <div className="w-full h-full bg-gray-900 rounded-sm overflow-hidden flex items-center justify-center transition-all duration-500">
                      {currentApp === 0 && <VSCodeIconSmall />}
                      {currentApp === 1 && <ChromeIconSmall />}
                      {currentApp === 2 && <DiscordIconSmall />}
                      {currentApp === 3 && <SpotifyIconSmall />}
                    </div>
                  </div>
                  {/* Monitor stand */}
                  <div className="w-3 h-1.5 bg-gray-700 mx-auto" />
                  <div className="w-6 h-1 bg-gray-600 mx-auto rounded-b" />
                </div>

                {/* Keyboard in front of Tama */}
                <div className="absolute bottom-9 left-[65%] -translate-x-1/2 z-10">
                  <div className="w-10 h-3 bg-gray-700 rounded-sm shadow-md">
                    {/* Keyboard keys */}
                    <div className="flex gap-0.5 p-0.5">
                      <div className="w-1 h-0.5 bg-gray-500 rounded-sm" />
                      <div className="w-1 h-0.5 bg-gray-500 rounded-sm" />
                      <div className="w-1 h-0.5 bg-gray-500 rounded-sm" />
                      <div className="w-1 h-0.5 bg-gray-500 rounded-sm" />
                      <div className="w-1 h-0.5 bg-gray-500 rounded-sm" />
                    </div>
                    <div className="flex gap-0.5 px-0.5">
                      <div className="w-1 h-0.5 bg-gray-500 rounded-sm" />
                      <div className="w-1 h-0.5 bg-gray-500 rounded-sm" />
                      <div className="w-1 h-0.5 bg-gray-500 rounded-sm" />
                      <div className="w-1 h-0.5 bg-gray-500 rounded-sm" />
                      <div className="w-1 h-0.5 bg-gray-500 rounded-sm" />
                    </div>
                  </div>
                </div>

                {/* Tamagotchi Pet - moved right, minimal movement */}
                <div className="absolute bottom-12 left-[65%] -translate-x-1/2">
                  {/* Main body - cute blob shape */}
                  <div className="relative">
                    {/* Body */}
                    <div className="w-12 h-10 bg-pink-300 rounded-[50%] relative shadow-lg">
                      {/* Body highlight */}
                      <div className="absolute top-1 left-1 w-3 h-2 bg-pink-200 rounded-full opacity-70" />
                      
                      {/* Ears */}
                      <div className="absolute -top-1.5 left-1 w-3 h-4 bg-pink-300 rounded-full transform -rotate-12">
                        <div className="absolute top-0.5 left-0.5 w-1.5 h-2 bg-pink-400 rounded-full" />
                      </div>
                      <div className="absolute -top-1.5 right-1 w-3 h-4 bg-pink-300 rounded-full transform rotate-12">
                        <div className="absolute top-0.5 right-0.5 w-1.5 h-2 bg-pink-400 rounded-full" />
                      </div>
                      
                      {/* Eyes - pixel style */}
                      <div className="absolute top-3 left-2 flex gap-2.5">
                        <div className="relative">
                          <div className="w-2 h-2 bg-gray-900 rounded-sm" />
                          <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-sm" />
                        </div>
                        <div className="relative">
                          <div className="w-2 h-2 bg-gray-900 rounded-sm" />
                          <div className="absolute top-0 left-0 w-1 h-1 bg-white rounded-sm" />
                        </div>
                      </div>
                      
                      {/* Blush marks */}
                      <div className="absolute top-5 left-0.5 w-1.5 h-0.5 bg-pink-400 rounded-full opacity-80" />
                      <div className="absolute top-5 right-0.5 w-1.5 h-0.5 bg-pink-400 rounded-full opacity-80" />
                      
                      {/* Cute mouth */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                        <div className="w-2 h-1 border-b-2 border-gray-800 rounded-full" />
                      </div>
                      
                      {/* Little arms typing - subtle animation */}
                      <div className="absolute -bottom-0.5 left-0 flex justify-between w-full px-0.5">
                        <div className="w-2 h-3 bg-pink-300 rounded-full animate-pulse" style={{ animationDuration: "1.5s" }} />
                        <div className="w-2 h-3 bg-pink-300 rounded-full animate-pulse" style={{ animationDuration: "1.5s", animationDelay: "0.75s" }} />
                      </div>
                    </div>

                    {/* Tiny headphones */}
                    <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-10 h-1.5 bg-purple-500 rounded-t-full" />
                    <div className="absolute top-0.5 -left-0.5 w-2 h-2 bg-purple-500 rounded-full border border-purple-600" />
                    <div className="absolute top-0.5 -right-0.5 w-2 h-2 bg-purple-500 rounded-full border border-purple-600" />
                  </div>
                </div>

                {/* Coffee cup on desk */}
                <div className="absolute bottom-10 right-2">
                  <div className="w-3 h-4 bg-pink-300 rounded-b-lg">
                    <div className="w-full h-0.5 bg-pink-200 rounded-t" />
                  </div>
                  <div className="absolute -top-1 left-0.5 w-0.5 h-1.5 bg-white/50 rounded animate-pulse" />
                </div>

                {/* Book stack */}
                <div className="absolute bottom-10 left-1">
                  <div className="w-4 h-1 bg-purple-400 rounded-sm" />
                  <div className="w-4 h-1 bg-pink-400 rounded-sm" />
                  <div className="w-4 h-1 bg-blue-400 rounded-sm" />
                </div>

                {/* Floating sparkles */}
                <div className="absolute top-8 left-6 text-[6px] animate-pulse" style={{ animationDuration: "3s" }}>💕</div>
                <div className="absolute top-4 left-12 text-[5px] animate-pulse" style={{ animationDuration: "4s" }}>🎵</div>
              </div>
            </div>

            {/* Card info bar */}
            <div className="mx-1 mt-1 flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border border-pink-700" />
              <span className="text-[7px] text-gray-600 font-medium">Productivity Pet</span>
            </div>

            {/* Quote Text Box - Pokemon card description style */}
            <div className="mx-1 mt-1 mb-1 bg-gradient-to-b from-pink-50 to-pink-100 border border-yellow-400 rounded p-1.5">
              <p className="text-[7px] text-gray-700 text-left italic leading-tight">
                "{quote}"
              </p>
            </div>

            {/* Card footer */}
            <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-2 py-0.5 flex justify-between items-center">
              <span className="text-[6px] text-gray-700">illus. Kanban Studio</span>
              <span className="text-[6px] text-gray-700">001/100 ★</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card shadow */}
      <div className="absolute -bottom-2 left-3 right-3 h-3 bg-black/20 rounded-full blur-md" />
    </div>
  );
}

// Smaller App Icons for the card
function VSCodeIconSmall() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-[#1e1e1e] p-0.5">
      <div className="w-5 h-5 relative">
        <div className="absolute inset-0 bg-blue-500" style={{ clipPath: "polygon(0 0, 75% 15%, 75% 85%, 0 100%)" }} />
        <div className="absolute right-0 top-[15%] bottom-[15%] w-[25%] bg-blue-600" />
      </div>
    </div>
  );
}

function ChromeIconSmall() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-white p-0.5">
      <div className="w-5 h-5 rounded-full relative overflow-hidden">
        <div className="absolute inset-0 bg-red-500" style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 50%)" }} />
        <div className="absolute inset-0 bg-yellow-400" style={{ clipPath: "polygon(50% 50%, 100% 50%, 75% 100%, 25% 100%)" }} />
        <div className="absolute inset-0 bg-green-500" style={{ clipPath: "polygon(50% 50%, 25% 100%, 0 50%, 0 0)" }} />
        <div className="absolute inset-[25%] bg-blue-500 rounded-full" />
      </div>
    </div>
  );
}

function DiscordIconSmall() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-[#5865F2] p-0.5">
      <div className="w-5 h-4 bg-white rounded relative">
        <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-[#5865F2] rounded-full" />
        <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#5865F2] rounded-full" />
      </div>
    </div>
  );
}

function SpotifyIconSmall() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full bg-[#191414] p-0.5">
      <div className="w-5 h-5 bg-[#1DB954] rounded-full flex items-center justify-center">
        <div className="flex flex-col gap-0.5">
          <div className="w-2.5 h-0.5 bg-black rounded-full" />
          <div className="w-3 h-0.5 bg-black rounded-full" />
          <div className="w-2.5 h-0.5 bg-black rounded-full" />
        </div>
      </div>
    </div>
  );
}
