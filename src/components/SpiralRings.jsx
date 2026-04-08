import React from "react";

export default function SpiralRings({ count = 14 }) {
  return (
    <div className="relative flex justify-center items-center h-6 w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #d4d0cb 0%, #c0bbb4 50%, #d4d0cb 100%)" }}
      />
      <div className="relative flex gap-[18px] items-center px-4 z-10">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="relative"
            style={{
              width: "14px",
              height: "22px",
            }}
          >
            {/* Ring body */}
            <div
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                border: "2.5px solid #8a8680",
                backgroundColor: "transparent",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.15)",
                position: "absolute",
                top: "4px",
                left: 0,
              }}
            />
            {/* Ring highlight */}
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.25)",
                position: "absolute",
                top: "6px",
                left: "2px",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
