import React, { useMemo } from "react";
import { getDaysInMonth, getFirstDayOfMonth, isSameDay, isInRange, formatKey, DAYS_SHORT } from "../utils";
import { HOLIDAYS } from "../data";

export default function CalendarGrid({
  year, month, accent, light,
  rangeStart, rangeEnd, hoverDate,
  onDayClick, onDayHover, onDayLeave,
}) {
  const totalDays = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const cells = useMemo(() => {
    const arr = [];
    // Leading blanks
    const prevMonthDays = getDaysInMonth(year, month === 0 ? 11 : month - 1);
    for (let i = 0; i < firstDay; i++) {
      arr.push({ day: prevMonthDays - firstDay + i + 1, type: "prev" });
    }
    // Current month
    for (let d = 1; d <= totalDays; d++) {
      arr.push({ day: d, type: "current" });
    }
    // Trailing blanks
    const remaining = 42 - arr.length;
    for (let i = 1; i <= remaining; i++) {
      arr.push({ day: i, type: "next" });
    }
    return arr;
  }, [year, month, firstDay, totalDays]);

  const effectiveEnd = rangeEnd || hoverDate;

  return (
    <div className="select-none">
      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_SHORT.map((d) => (
          <div
            key={d}
            className={`text-center text-[12px] font-bold tracking-widest uppercase py-1.5 ${
              d === "Sat" || d === "Sun" ? "opacity-90" : "opacity-80"
            }`}
            style={{ color: d === "Sat" || d === "Sun" ? accent : undefined }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((cell, idx) => {
          if (cell.type !== "current") {
            return (
              <div key={`${cell.type}-${idx}`} className="text-center py-1.5 text-sm opacity-20">
                {cell.day}
              </div>
            );
          }

          const date = new Date(year, month, cell.day);
          const key = formatKey(date);
          const holiday = HOLIDAYS[key];
          const isStart = isSameDay(date, rangeStart);
          const isEnd = isSameDay(date, rangeEnd);
          const inRange = isInRange(date, rangeStart, effectiveEnd);
          const isHover = isSameDay(date, hoverDate) && !rangeEnd;
          const isToday = isSameDay(date, new Date());
          const isWeekend = date.getDay() === 0 || date.getDay() === 6;

          let cellClass = "day-cell relative text-center py-1.5 text-sm rounded-lg mx-0.5 ";
          let textClass = "";
          let bgStyle = {};
          let textStyle = {};

          if (isStart || isEnd) {
            bgStyle = { backgroundColor: accent };
            textStyle = { color: "#fff", fontWeight: 600 };
          } else if (inRange) {
            bgStyle = { backgroundColor: `${accent}18` };
            textStyle = { color: accent };
          } else if (isHover) {
            bgStyle = { backgroundColor: `${accent}10` };
            textStyle = { color: accent };
          } else if (isToday) {
            bgStyle = { backgroundColor: light };
            textStyle = { color: accent, fontWeight: 800 };
          } else if (isWeekend) {
            textStyle = { color: accent, opacity: 0.75 };
          }

          return (
            <div
              key={key}
              className={cellClass}
              style={bgStyle}
              onClick={() => onDayClick(date)}
              onMouseEnter={() => onDayHover(date)}
              onMouseLeave={onDayLeave}
              title={holiday || undefined}
            >
              <span className="relative z-10 text-sm leading-none" style={textStyle}>
                {cell.day}
              </span>
              {/* Holiday dot */}
              {holiday && (
                <span
                  className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                  style={{ backgroundColor: isStart || isEnd ? "#fff" : accent, opacity: 0.9 }}
                />
              )}
              {/* Range connector */}
              {inRange && idx % 7 !== 0 && (
                <span
                  className="absolute inset-y-0.5 -left-1 w-1 pointer-events-none"
                  style={{ backgroundColor: `${accent}14` }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
