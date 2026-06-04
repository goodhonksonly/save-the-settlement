"use client"

interface DoorProps {
  unlockedCount: number
  isOpen?: boolean
}

export function Door({ unlockedCount, isOpen = false }: DoorProps) {
  return (
    <div className="flex items-center justify-center min-h-[320px] lg:min-h-[540px]">
      <div
        className="relative w-[280px] h-[340px] scale-[0.75] lg:scale-100"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "center center",
        }}
      >
        {/* Outer stone frame */}
        <div
          className="absolute inset-[-14px] rounded-t-sm"
          style={{
            background: "linear-gradient(180deg, #4a4a4a 0%, #3a3a3a 20%, #2d2d2d 80%, #252525 100%)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        />
        {/* Inner frame edge */}
        <div
          className="absolute inset-[-6px] rounded-t-sm"
          style={{
            background: "linear-gradient(180deg, #383838 0%, #2a2a2a 100%)",
          }}
        />

        {/* Dark void behind doors */}
        <div
          className="absolute inset-0 rounded-t-sm"
          style={{ background: "#05080a" }}
        />

        {/* CENTER DIVIDER — vertical strip between the two doors */}
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[4px] z-10"
          style={{
            background: "linear-gradient(180deg, #2a2a2a, #1a1a1a)",
            boxShadow: "0 0 6px rgba(0,0,0,0.6)",
          }}
        />

        {/* ── LEFT DOOR ── hinged on the left, swings left */}
        <div
          className="absolute top-0 bottom-0 left-0"
          style={{
            width: "50%",
            transformStyle: "preserve-3d",
            transformOrigin: "left center",
            transform: isOpen ? "rotateY(-75deg)" : "rotateY(0deg)",
            transition: isOpen
              ? "transform 5s cubic-bezier(0.25, 0.1, 0.1, 1)"
              : "transform 0.5s ease-out",
            zIndex: 2,
          }}
        >
          <DoorPanel side="left" unlockedCount={unlockedCount} isOpen={isOpen} />
          {/* Left door hinges */}
          {[20, 50, 80].map((top) => (
            <div
              key={`hl-${top}`}
              className="absolute"
              style={{
                top: `${top}%`,
                left: "-8px",
                width: "10px",
                height: "22px",
                transform: "translateY(-50%)",
                background: "linear-gradient(90deg, #505050, #353535)",
                borderRadius: "3px 0 0 3px",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.3)",
                zIndex: 10,
              }}
            />
          ))}
        </div>

        {/* ── RIGHT DOOR ── hinged on the right, swings right */}
        <div
          className="absolute top-0 bottom-0 right-0"
          style={{
            width: "50%",
            transformStyle: "preserve-3d",
            transformOrigin: "right center",
            transform: isOpen ? "rotateY(75deg)" : "rotateY(0deg)",
            transition: isOpen
              ? "transform 5s cubic-bezier(0.25, 0.1, 0.1, 1)"
              : "transform 0.5s ease-out",
            zIndex: 2,
          }}
        >
          <DoorPanel side="right" unlockedCount={unlockedCount} isOpen={isOpen} />
          {/* Right door hinges */}
          {[20, 50, 80].map((top) => (
            <div
              key={`hr-${top}`}
              className="absolute"
              style={{
                top: `${top}%`,
                right: "-8px",
                width: "10px",
                height: "22px",
                transform: "translateY(-50%)",
                background: "linear-gradient(90deg, #353535, #505050)",
                borderRadius: "0 3px 3px 0",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 2px 4px rgba(0,0,0,0.3)",
                zIndex: 10,
              }}
            />
          ))}
        </div>

        {/* Lock bars (rendered outside doors so they span full width) */}
        {!isOpen && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
            <LockBar position={1} unlocked={unlockedCount >= 1} />
            <LockBar position={2} unlocked={unlockedCount >= 2} />
            <LockBar position={3} unlocked={unlockedCount >= 3} />
          </div>
        )}

        {/* Stone threshold */}
        <div
          className="absolute left-[-18px] right-[-18px] bottom-[-16px] h-[14px]"
          style={{
            background: "linear-gradient(180deg, #9a9590 0%, #807a75 50%, #6a6560 100%)",
            borderRadius: "2px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        />
      </div>
    </div>
  )
}

function DoorPanel({ side, unlockedCount, isOpen }: { side: "left" | "right"; unlockedCount: number; isOpen: boolean }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        background: isOpen
          ? "#f5f0e0"
          : "linear-gradient(180deg, #d4c4a0 0%, #c8b890 25%, #d0c098 50%, #c4b488 75%, #ccbc90 100%)",
      }}
    >
      {/* Wood grain */}
      {!isOpen && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0"
              style={{
                left: `${10 + i * 15}%`,
                width: i % 2 === 0 ? "2px" : "1px",
                background: `rgba(139, 119, 80, ${0.08 + (i % 3) * 0.02})`,
              }}
            />
          ))}
        </div>
      )}

      {/* Door knob on the meeting edge */}
      {!isOpen && (
        <div
          className="absolute top-1/2 -translate-y-1/2"
          style={{
            [side === "left" ? "right" : "left"]: "8px",
          }}
        >
          <div
            className="w-[10px] h-[10px] rounded-full"
            style={{
              background: "linear-gradient(135deg, #e8c840, #a89018)",
              boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
            }}
          />
        </div>
      )}
    </div>
  )
}

function LockBar({ position, unlocked }: { position: 1 | 2 | 3; unlocked: boolean }) {
  const topPercent = position === 1 ? 20 : position === 2 ? 50 : 80

  return (
    <div
      className="absolute left-0 right-0"
      style={{ top: `${topPercent}%`, transform: "translateY(-50%)" }}
    >
      {/* Metal bar */}
      <div
        className="absolute h-[12px]"
        style={{
          left: "-14px",
          right: "-14px",
          background: "linear-gradient(180deg, #4a4a4a 0%, #3a3a3a 40%, #2a2a2a 100%)",
          boxShadow: "0 3px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          opacity: unlocked ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
      >
        {[8, 20, 80, 92].map((left) => (
          <div
            key={left}
            className="absolute top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full"
            style={{
              left: `${left}%`,
              background: "#1a1a1a",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.8)",
            }}
          />
        ))}
      </div>

      {/* Gold padlock */}
      <div
        className="absolute left-1/2 top-0"
        style={{
          transform: `translate(-50%, -50%) ${unlocked ? "translateY(15px) scale(0.8)" : ""}`,
          opacity: unlocked ? 0 : 1,
          transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* Shackle */}
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-[10px] w-[18px] h-[12px]"
          style={{
            borderRadius: "9px 9px 0 0",
            border: "4px solid #a0a0a0",
            borderBottom: "none",
            background: "transparent",
          }}
        />
        {/* Lock body */}
        <div
          className="relative w-[32px] h-[28px] rounded-[3px]"
          style={{
            background: "linear-gradient(145deg, #e8c840 0%, #d4b030 30%, #c0a020 60%, #a89018 100%)",
            boxShadow: "0 3px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,200,0.4), inset 0 -1px 0 rgba(0,0,0,0.2)",
          }}
        >
          <div
            className="absolute inset-[3px] rounded-[2px]"
            style={{
              background: "linear-gradient(145deg, #d8b838 0%, #c4a428 50%, #b09020 100%)",
            }}
          >
            <div className="absolute left-1/2 top-[5px] -translate-x-1/2">
              <div className="w-[8px] h-[8px] rounded-full" style={{ background: "#2a2520" }} />
              <div className="w-[3px] h-[7px] mx-auto -mt-[1px]" style={{ background: "#2a2520" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
