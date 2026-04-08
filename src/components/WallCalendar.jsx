import React, { useState, useEffect, useCallback, useRef } from "react";
import CalendarGrid from "./CalendarGrid";
import NotesPanel from "./NotesPanel";
import SpiralRings from "./SpiralRings";
import { MONTHS, formatDate, formatKey, isBefore, isSameDay } from "../utils";
import { MONTH_THEMES, HOLIDAYS } from "../data";

const STORAGE_KEY = "almanac_calendar_state";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* empty */ }
}

export default function WallCalendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [selecting, setSelecting] = useState(false);
  const [notes, setNotes] = useState("");
  const [notesByRange, setNotesByRange] = useState({});
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showRangeToast, setShowRangeToast] = useState(false);
  const calendarRef = useRef();
  const toastRef = useRef();

  const theme = MONTH_THEMES[month];
  const { accent, light } = theme.palette;

  useEffect(() => {
    const s = loadState();
    if (s.notesByRange) setNotesByRange(s.notesByRange);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    setImgLoaded(false);
    setImgError(false);
  }, [month]);

  useEffect(() => {
    if (showRangeToast) {
      clearTimeout(toastRef.current);
      toastRef.current = setTimeout(() => setShowRangeToast(false), 2800);
    }
  }, [showRangeToast]);


  const navigate = useCallback((dir) => {
    setIsFlipping(true);
    setTimeout(() => {
      const nm = month + dir;
      if (nm < 0) {
        setMonth(11);
        setYear((y) => y - 1);
      } else if (nm > 11) {
        setMonth(0);
        setYear((y) => y + 1);
      } else {
        setMonth(nm);
      }
      setRangeStart(null);
      setRangeEnd(null);
      setNotes("");
      setHoverDate(null);
      setSelecting(false);
      setIsFlipping(false);
    }, 350);
  }, [month]);

  const handleDayClick = useCallback((date) => {
    if (!selecting) {
      setRangeStart(date);
      setRangeEnd(null);
      setNotes("");
      setSelecting(true);
    } else {
      if (isSameDay(date, rangeStart)) {
        setSelecting(false);
        setRangeStart(null);
        return;
      }
      const start = isBefore(date, rangeStart) ? date : rangeStart;
      const end = isBefore(date, rangeStart) ? rangeStart : date;
      setRangeStart(start);
      setRangeEnd(end);
      setSelecting(false);
      setShowRangeToast(true);
      const key = `${formatKey(start)}|${formatKey(end)}`;
      setNotes(notesByRange[key] || "");
    }
  }, [selecting, rangeStart, notesByRange]);

  const handleDayHover = useCallback((date) => {
    setHoverDate(date);
  }, []);

  const handleSaveNote = useCallback(() => {
    if (!rangeStart || !rangeEnd || !notes.trim()) return;
    const key = `${formatKey(rangeStart)}|${formatKey(rangeEnd)}`;
    const updated = { ...notesByRange, [key]: notes.trim() };
    setNotesByRange(updated);
    saveState({ notesByRange: updated });
  }, [rangeStart, rangeEnd, notes, notesByRange]);

  const handleDeleteNote = useCallback((key) => {
    const updated = { ...notesByRange };
    delete updated[key];
    setNotesByRange(updated);
    saveState({ notesByRange: updated });
    if (rangeStart && rangeEnd) {
      const currentKey = `${formatKey(rangeStart)}|${formatKey(rangeEnd)}`;
      if (currentKey === key) setNotes("");
    }
  }, [notesByRange, rangeStart, rangeEnd]);

  const handleClearRange = () => {
    setRangeStart(null);
    setRangeEnd(null);
    setNotes("");
    setSelecting(false);
  };

  const rangeLabel = rangeStart && rangeEnd
    ? `${formatDate(rangeStart)} – ${formatDate(rangeEnd)}`
    : rangeStart
    ? `From ${formatDate(rangeStart)} — pick end date`
    : null;

  return (
    <div
      ref={calendarRef}
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 transition-colors duration-500"
      style={{ background: darkMode ? "#0f0e0c" : "#ede9e2" }}
    >
      {/* Floating controls */}
      <div className="fixed top-4 right-4 flex items-center gap-2 z-50 no-print">
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-200 active:scale-90"
          style={{
            backgroundColor: darkMode ? "#2a2927" : "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${darkMode ? "#3a3835" : "rgba(0,0,0,0.08)"}`,
            color: darkMode ? "#f0ede8" : "#1a1916",
          }}
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? "☀" : "◑"}
        </button>
      </div>

      {/* The Calendar Card */}
      <div
        className={`w-full max-w-3xl transition-all duration-300 ${isFlipping ? "page-flip" : "animate-scale-in"}`}
        style={{
          boxShadow: "0 32px 64px -16px rgba(0,0,0,0.25), 0 8px 32px -8px rgba(0,0,0,0.12)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <SpiralRings count={22} />

        <div
          className="paper-texture"
          style={{ backgroundColor: darkMode ? "#1e1d1a" : "#faf9f6" }}
        >
          {/* Image Section */}
          <div className="relative overflow-hidden" style={{ height: "clamp(180px, 35vw, 280px)" }}>
            {!imgLoaded && !imgError && (
              <div className="img-shimmer absolute inset-0" />
            )}

            {!imgError && (
              <img
                src={theme.image}
                alt={theme.caption}
                className={`w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgError(true)}
              />
            )}

            {imgError && (
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${accent}40, ${accent}15)` }}
              />
            )}

            <div
              className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
              style={{
                background: `linear-gradient(to top, ${darkMode ? "#1e1d1a" : "#faf9f6"} 0%, transparent 100%)`,
              }}
            />

            {/* Month/year badge */}
            <div
              className="absolute bottom-4 right-5 text-right"
              style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))" }}
            >
              <div
                className="text-4xl sm:text-5xl font-bold leading-none tracking-tight"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: imgLoaded ? "#fff" : accent,
                  textShadow: imgLoaded ? "0 2px 12px rgba(0,0,0,0.4)" : "none",
                }}
              >
                {MONTHS[month].toUpperCase()}
              </div>
              <div
                className="text-xl tracking-[0.7em] mt-0.5"
                style={{
                  color: imgLoaded ? "rgba(255,255,255,0.8)" : `${accent}90`,
                  fontFamily: "'DM Sans', sans-serif",
                  fontWeight: 600,
                  textShadow: imgLoaded ? "0 1px 4px rgba(0,0,0,0.3)" : "none",
                }}
              >
                {year}
              </div>
            </div>

            {/* Navigation arrows — centered at bottom */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2.5 no-print">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-all duration-150 active:scale-90"
                style={{
                  backgroundColor: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(10px)",
                  color: "#000",
                  border: "2px solid rgba(255,255,255,0.9)",
                }}
              >
                ‹
              </button>
              <button
                onClick={() => navigate(1)}
                className="w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-all duration-150 active:scale-90"
                style={{
                  backgroundColor: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(10px)",
                  color: "#000",
                  border: "2px solid rgba(255,255,255,0.9)",
                }}
              >
                ›
              </button>
            </div>
          </div>

          {/* Diagonal wave divider */}
          <div className="relative" style={{ marginTop: "-1px" }}>
            <svg viewBox="0 0 800 28" className="w-full" style={{ display: "block", height: "30px" }} preserveAspectRatio="none">
              <path
                d="M0,0 L800,0 L800,10 Q650,28 400,18 Q150,8 0,24 Z"
                fill={accent}
                opacity="0.9"
              />
            </svg>
          </div>

          {/* Range status bar */}
          <div
            className="px-5 py-2 flex items-center justify-between transition-all duration-200"
            style={{ backgroundColor: `${accent}14`, minHeight: "38px" }}
          >
            <div className="flex items-center gap-2">
              {selecting && (
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ backgroundColor: accent }}
                />
              )}
              <span className="text-xs" style={{ color: accent, fontWeight: rangeStart ? 500 : 400 }}>
                {rangeLabel || (
                  <span style={{ color: "var(--ink-muted)", fontWeight: 300 }}>
                    Click a date to start selecting a range
                  </span>
                )}
              </span>
            </div>
            {rangeStart && (
              <button
                onClick={handleClearRange}
                className="text-[13px] opacity-90 hover:opacity-100 transition-opacity"
                style={{ color: accent }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Grid + Notes */}
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 p-5 lg:p-6 lg:pr-4">
              <CalendarGrid
                year={year}
                month={month}
                accent={accent}
                light={light}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                hoverDate={selecting ? hoverDate : null}
                onDayClick={handleDayClick}
                onDayHover={handleDayHover}
                onDayLeave={() => setHoverDate(null)}
              />

              {/* Holiday legend */}
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                {Object.entries(
                  Object.fromEntries(
                    Object.entries(HOLIDAYS)
                      .filter(([k]) => {
                        const [y, m] = k.split("-").map(Number);
                        return y === year && m - 1 === month;
                      })
                  )
                ).slice(0, 4).map(([key, name]) => (
                  <div key={key} className="flex items-center gap-1.5 text-[13px]" style={{ color: "var(--ink-muted)" }}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: accent, opacity: 0.9 }} />
                    <span>{key.split("-")[2]} — {name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="hidden lg:block w-px my-6"
              style={{ backgroundColor: `${accent}40` }}
            />
            <div
              className="block lg:hidden h-px mx-5"
              style={{ backgroundColor: `${accent}40` }}
            />

            <div className="w-full lg:w-56 xl:w-64 p-5 lg:p-6 lg:pl-4">
              <NotesPanel
                accent={accent}
                rangeStart={rangeStart}
                rangeEnd={rangeEnd}
                notes={notes}
                onNotesChange={setNotes}
                notesByRange={notesByRange}
                onSaveNote={handleSaveNote}
                onDeleteNote={handleDeleteNote}
              />
            </div>
          </div>

          {/* Footer */}
          <div
            className="px-5 py-3 flex items-center justify-between border-t text-[10px]"
            style={{ borderColor: `${accent}15`, color: "var(--ink-muted)" }}
          >
            <span style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontSize: "12px" }}>
              Subhajit's Calendar
            </span>
            <div className="flex items-center gap-3">
              <span className="opacity-50">{theme.caption}</span>
              <button
                onClick={() => { setYear(today.getFullYear()); setMonth(today.getMonth()); }}
                className="px-2 py-0.5 rounded text-[11px] transition-all duration-150 hover:opacity-80"
                style={{ backgroundColor: `${accent}14`, color: accent }}
              >
                Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {showRangeToast && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-full text-xs font-medium animate-slide-up shadow-lg"
          style={{
            backgroundColor: accent,
            color: "#fff",
            boxShadow: `0 8px 24px ${accent}50`,
            zIndex: 100,
          }}
        >
          Range selected — add a note on the right
        </div>
      )}
    </div>
  );
}
