"use client"

interface DoorProps {
  unlockedCount: number
  isOpen?: boolean
}

export function Door({ unlockedCount, isOpen = false }: DoorProps) {
  return (
    <div className="flex items-center justify-center min-h-[320px] lg:min-h-[540px]">
      <div
        className="relative scale-[0.75] lg:scale-100"
        style={{
          width: "280px",
          height: "340px",
          perspective: "1400px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Outer stone frame */}
        <div
          className="absolute rounded-t-sm"
          style={{
            inset: "-14px",
            background: "linear-gradient(180deg, #4a4a4a 0%, #3a3a3a 20%, #2d2d2d 80%, #252525 100%)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
          }}
        />
        {/* Inner frame */}
        <div
          className="absolute rounded-t-sm"
          style={{
            inset: "-6px",
            background: "linear-gradient(180deg, #383838 0%, #2a2a2a 100%)",
          }}
        />
        {/* Dark void */}
        <div className="absolute inset-0 rounded-t-sm" style={{ background: "#030506" }} />

        {/* LEFT DOOR — hinges on left edge, swings away left */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            transformStyle: "preserve-3d",
            transformOrigin: "0% 50%",
            transform: isOpen ? "rotateY(-78deg)" : "rotateY(0deg)",
            transition: isOpen
              ? "transform 5s cubic-bezier(0.15, 0.05, 0.1, 1)"
              : "transform 0.6s ease-out",
            zIndex: 3,
          }}
        >
          {/* Door surface */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #d4c4a0 0%, #c8b890 25%, #d0c098 50%, #c4b488 75%, #ccbc90 100%)",
            }}
          >
            {/* Wood grain */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute top-0 bottom-0" style={{ left: `${15 + i * 18}%`, width: i % 2 === 0 ? "2px" : "1px", background: `rgba(139,119,80,${0.08 + i * 0.015})` }} />
            ))}
            {/* Knob on right edge */}
            <div className="absolute top-1/2 right-2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ background: "linear-gradient(135deg,#e8c840,#a89018)", boxShadow: "0 2px 4px rgba(0,0,0,0.5)" }} />
          </div>
          {/* Left hinges */}
          {[20, 50, 80].map((top) => (
            <div key={top} className="absolute" style={{ top: `${top}%`, left: "-8px", width: "10px", height: "22px", transform: "translateY(-50%)", background: "linear-gradient(90deg,#555,#333)", borderRadius: "3px 0 0 3px", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }} />
          ))}
        </div>

        {/* RIGHT DOOR — hinges on right edge, swings away right */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "100%",
            transformStyle: "preserve-3d",
            transformOrigin: "100% 50%",
            transform: isOpen ? "rotateY(78deg)" : "rotateY(0deg)",
            transition: isOpen
              ? "transform 5s cubic-bezier(0.15, 0.05, 0.1, 1)"
              : "transform 0.6s ease-out",
            zIndex: 3,
          }}
        >
          {/* Door surface */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(180deg, #ccbc90 0%, #c4b488 25%, #d0c098 50%, #c8b890 75%, #d4c4a0 100%)",
            }}
          >
            {/* Wood grain */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="absolute top-0 bottom-0" style={{ left: `${15 + i * 18}%`, width: i % 2 === 0 ? "2px" : "1px", background: `rgba(139,119,80,${0.08 + i * 0.015})` }} />
            ))}
            {/* Knob on left edge */}
            <div className="absolute top-1/2 left-2 -translate-y-1/2 w-3 h-3 rounded-full" style={{ background: "linear-gradient(135deg,#e8c840,#a89018)", boxShadow: "0 2px 4px rgba(0,0,0,0.5)" }} />
          </div>
          {/* Right hinges */}
          {[20, 50, 80].map((top) => (
            <div key={top} className="absolute" style={{ top: `${top}%`, right: "-8px", width: "10px", height: "22px", transform: "translateY(-50%)", background: "linear-gradient(90deg,#333,#555)", borderRadius: "0 3px 3px 0", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }} />
          ))}
        </div>

        {/* Lock bars + padlocks — sit on top of both doors */}
        {!isOpen && (
          <div className="absolute inset-0" style={{ zIndex: 4, pointerEvents: "none" }}>
            <LockBar position={1} unlocked={unlockedCount >= 1} />
            <LockBar position={2} unlocked={unlockedCount >= 2} />
            <LockBar position={3} unlocked={unlockedCount >= 3} />
          </div>
        )}

        {/* Stone threshold */}
        <div
          className="absolute"
          style={{
            left: "-18px", right: "-18px", bottom: "-16px", height: "14px",
            background: "linear-gradient(180deg,#9a9590,#807a75 50%,#6a6560)",
            borderRadius: "2px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        />
      </div>
    </div>
  )
}

function LockBar({ position, unlocked }: { position: 1 | 2 | 3; unlocked: boolean }) {
  const topPercent = position === 1 ? 20 : position === 2 ? 50 : 80
  return (
    <div className="absolute left-0 right-0" style={{ top: `${topPercent}%`, transform: "translateY(-50%)" }}>
      {/* Metal bar */}
      <div
        className="absolute h-[12px]"
        style={{
          left: "-14px", right: "-14px",
          background: "linear-gradient(180deg,#4a4a4a,#3a3a3a 40%,#2a2a2a)",
          boxShadow: "0 3px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          opacity: unlocked ? 0 : 1,
          transition: "opacity 0.6s ease",
        }}
      >
        {[8, 20, 80, 92].map((left) => (
          <div key={left} className="absolute top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full" style={{ left: `${left}%`, background: "#1a1a1a", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.8)" }} />
        ))}
      </div>
      {/* Padlock */}
      <div
        className="absolute left-1/2 top-0"
        style={{
          transform: `translate(-50%,-50%) ${unlocked ? "translateY(15px) scale(0.8)" : ""}`,
          opacity: unlocked ? 0 : 1,
          transition: "all 0.6s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div className="absolute left-1/2 -translate-x-1/2 -top-[10px] w-[18px] h-[12px]" style={{ borderRadius: "9px 9px 0 0", border: "4px solid #a0a0a0", borderBottom: "none" }} />
        <div className="relative w-[32px] h-[28px] rounded-[3px]" style={{ background: "linear-gradient(145deg,#e8c840,#d4b030 30%,#c0a020 60%,#a89018)", boxShadow: "0 3px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,200,0.4)" }}>
          <div className="absolute inset-[3px] rounded-[2px]" style={{ background: "linear-gradient(145deg,#d8b838,#c4a428 50%,#b09020)" }}>
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
