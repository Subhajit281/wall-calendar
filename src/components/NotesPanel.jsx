import React, { useRef, useEffect, useState } from "react";
import { formatDate, rangeDayCount } from "../utils";

export default function NotesPanel({ accent, rangeStart, rangeEnd, notes, onNotesChange, notesByRange, onSaveNote, onDeleteNote }) {
  const textRef = useRef();
  const [hoveredKey, setHoveredKey] = useState(null);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.style.height = "auto";
      textRef.current.style.height = textRef.current.scrollHeight + "px";
    }
  }, [notes]);

  const dayCount = rangeDayCount(rangeStart, rangeEnd);
  const hasRange = rangeStart && rangeEnd;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[10px] tracking-widest uppercase font-semibold"
          style={{ color: accent, opacity: 0.8 }}
        >
          Notes
        </span>
        {hasRange && (
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: `${accent}15`, color: accent }}>
            {dayCount} day{dayCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Range indicator */}
      {hasRange && (
        <div className="mb-3 pb-3 border-b" style={{ borderColor: `${accent}20` }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />
            <span className="text-[12px] font-medium" style={{ color: "var(--ink)" }}>
              {formatDate(rangeStart)}
            </span>
            <span className="text-[12px]" style={{ color: "var(--ink-muted)" }}>→</span>
            <span className="text-[12px] font-medium" style={{ color: "var(--ink)" }}>
              {formatDate(rangeEnd)}
            </span>
          </div>
        </div>
      )}

      {/* Notes textarea with ruled lines */}
      <div className="flex-1 relative overflow-hidden rounded-lg" style={{ minHeight: "120px" }}>
        <div className="ruled-paper absolute inset-0 opacity-40 pointer-events-none" />
        <textarea
          ref={textRef}
          className="notes-input text-sm p-2"
          placeholder={hasRange ? "Add notes for this date range…" : "Select dates to add notes, or write general memos here…"}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={6}
          style={{ lineHeight: "1.9em", fontSize: "13px", minHeight: "114px" }}
        />
      </div>

      {/* Save button */}
      {hasRange && notes.trim() && (
        <button
          onClick={onSaveNote}
          className="mt-3 w-full py-2 rounded-lg text-xs font-medium tracking-wide transition-all duration-150 active:scale-95"
          style={{
            backgroundColor: `${accent}15`,
            color: accent,
            border: `1px solid ${accent}25`,
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${accent}25`}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${accent}15`}
        >
          Save note
        </button>
      )}

      {/* Saved notes list */}
      {notesByRange && Object.keys(notesByRange).length > 0 && (
        <div className="mt-4 space-y-2">
          <div className="text-[10px] tracking-widest uppercase font-semibold" style={{ color: "var(--ink-muted)" }}>
            Saved
          </div>
          {Object.entries(notesByRange).slice(-3).map(([key, note]) => (
            <div
              key={key}
              className="relative p-2 rounded-lg text-xs"
              style={{
                backgroundColor: hoveredKey === key ? `${accent}19` : `${accent}11`,
                borderLeft: `2px solid ${accent}80`,
                transition: "background-color 0.15s ease",
              }}
              onMouseEnter={() => setHoveredKey(key)}
              onMouseLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setHoveredKey(null);
                }
              }}
            >
              {/* Delete button */}
              <button
                onClick={() => onDeleteNote(key)}
                title="Delete this note"
                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150 active:scale-90"
                style={{
                  opacity: hoveredKey === key ? 1 : 0,
                  pointerEvents: "auto",
                  backgroundColor: `${accent}12`,
                  color: accent,
                  fontSize: "8px",
                  lineHeight: 1,
                  border: `1px solid ${accent}30`,
                }}
              >
                ✕
              </button>

              <div className="text-[10px] mb-0.5 pr-6" style={{ color: accent, opacity: 0.65 }}>
                {key.replace("|", " → ")}
              </div>
              <div
                className="pr-5"
                style={{
                  color: "var(--ink)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {note}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}