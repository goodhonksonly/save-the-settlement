"use client"

import { useState, useEffect, type CSSProperties } from "react"

interface DoorProps {
  unlockedCount: number
  isOpen?: boolean
}

const LOCKS_VISIBLE_MS = 1500
const DOOR_OPEN_DELAY_MS = 5000
const DOOR_OPEN_DURATION = "20s"

export function Door({ unlockedCount, isOpen = false }: DoorProps) {
  const [showLocks, setShowLocks] = useState(true)
  const [animatedOpen, setAnimatedOpen] = useState(false)

  useEffect(() => {
    setAnimatedOpen(false)
    setShowLocks(true)

    if (!isOpen) return

    const hideLocksTimer = window.setTimeout(() => {
      setShowLocks(false)
    }, LOCKS_VISIBLE_MS)

    const openDoorTimer = window.setTimeout(() => {
      setAnimatedOpen(true)
    }, DOOR_OPEN_DELAY_MS)

    return () => {
      window.clearTimeout(hideLocksTimer)
      window.clearTimeout(openDoorTimer)
    }
  }, [isOpen])

  const doorIsOpen = animatedOpen

  return (
    <div className="flex items-center justify-center min-h-[320px] lg:min-h-[540px]">
      <div
        className="relative scale-[0.75] lg:scale-100"
        style={{
          width: "300px",
          height: "380px",
          perspective: "2000px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        {/* Outer stone frame */}
        <div
          className="absolute rounded-t-sm"
          style={{
            inset: "-18px",
            background:
              "linear-gradient(180deg, #555 0%, #444 20%, #333 80%, #282828 100%)",
            boxShadow:
              "0 24px 70px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.07), inset 2px 0 6px rgba(0,0,0,0.3), inset -2px 0 6px rgba(0,0,0,0.3)",
          }}
        />

        {/* Inner frame reveal */}
        <div
          className="absolute rounded-t-sm"
          style={{
            inset: "-7px",
            background: "linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%)",
            boxShadow: "inset 0 0 12px rgba(0,0,0,0.6)",
          }}
        />

        {/* Dark void behind the doors */}
        <div
          className="absolute inset-0 rounded-t-sm"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, #0a0c0e, #020304)",
          }}
        />

        {/* LEFT DOOR */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "50%",
            height: "100%",
            transformStyle: "preserve-3d",
            transformOrigin: "left center",
            transform: doorIsOpen ? "rotateY(-82deg)" : "rotateY(0deg)",
            transition: doorIsOpen
              ? `transform ${DOOR_OPEN_DURATION} cubic-bezier(0.05, 0.01, 0.08, 1)`
              : "transform 0.6s ease-out",
            zIndex: 3,
          }}
        >
          <DoorLeaf side="left" />
          {[18, 50, 82].map((top) => (
            <Hinge key={top} top={top} side="left" />
          ))}
        </div>

        {/* RIGHT DOOR */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "50%",
            height: "100%",
            transformStyle: "preserve-3d",
            transformOrigin: "right center",
            transform: doorIsOpen ? "rotateY(82deg)" : "rotateY(0deg)",
            transition: doorIsOpen
              ? `transform ${DOOR_OPEN_DURATION} cubic-bezier(0.05, 0.01, 0.08, 1)`
              : "transform 0.6s ease-out",
            zIndex: 3,
          }}
        >
          <DoorLeaf side="right" />
          {[18, 50, 82].map((top) => (
            <Hinge key={top} top={top} side="right" />
          ))}
        </div>

        {/* Lock bars + padlocks */}
        {showLocks && (
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
            left: "-20px",
            right: "-20px",
            bottom: "-18px",
            height: "16px",
            background: "linear-gradient(180deg, #9a9590, #807a75 50%, #6a6560)",
            borderRadius: "2px",
            boxShadow:
              "0 4px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        />
      </div>
    </div>
  )
}

function DoorLeaf({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left"

  const knobPositionStyle: CSSProperties = isLeft
    ? { right: "10px" }
    : { left: "10px" }

  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "linear-gradient(180deg, #d8c8a4 0%, #caba8e 20%, #d2c296 50%, #c6b68a 80%, #cec094 100%)",
        boxShadow: isLeft
          ? "inset -3px 0 8px rgba(0,0,0,0.2)"
          : "inset 3px 0 8px rgba(0,0,0,0.2)",
      }}
    >
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0"
          style={{
            left: `${12 + i * 17}%`,
            width: i % 2 === 0 ? "2px" : "1px",
            background: `rgba(120, 98, 60, ${0.07 + i * 0.012})`,
          }}
        />
      ))}

      {[12, 55].map((top) => (
        <div
          key={top}
          className="absolute"
          style={{
            top: `${top}%`,
            left: "10%",
            right: "10%",
            height: "30%",
            borderRadius: "3px",
            background: "rgba(0,0,0,0.06)",
            boxShadow:
              "inset 2px 2px 5px rgba(0,0,0,0.18), inset -1px -1px 3px rgba(255,255,255,0.12)",
            border: "1px solid rgba(0,0,0,0.1)",
          }}
        />
      ))}

      <div
        className="absolute top-1/2 -translate-y-1/2"
        style={knobPositionStyle}
      >
        <div
          className="w-[14px] h-[28px] rounded-sm mb-1"
          style={{
            background: "linear-gradient(180deg, #c8a830, #8a7010)",
            boxShadow: "0 2px 5px rgba(0,0,0,0.5)",
          }}
        />

        <div
          className="w-[12px] h-[12px] rounded-full -mt-[20px] ml-[1px]"
          style={{
            background: "radial-gradient(circle at 35% 35%, #f0d84a, #a89018)",
            boxShadow:
              "0 2px 6px rgba(0,0,0,0.5), inset 0 1px 2px rgba(255,255,220,0.4)",
          }}
        />
      </div>
    </div>
  )
}

function Hinge({ top, side }: { top: number; side: "left" | "right" }) {
  const isLeft = side === "left"

  const hingePositionStyle: CSSProperties = isLeft
    ? { left: "-9px" }
    : { right: "-9px" }

  return (
    <div
      className="absolute"
      style={{
        top: `${top}%`,
        ...hingePositionStyle,
        width: "11px",
        height: "28px",
        transform: "translateY(-50%)",
        background: "linear-gradient(90deg, #666, #444, #333)",
        borderRadius: isLeft ? "3px 0 0 3px" : "0 3px 3px 0",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.15), 0 2px 5px rgba(0,0,0,0.4)",
        zIndex: 10,
      }}
    >
      {[6, 18].map((t) => (
        <div
          key={t}
          className="absolute left-1/2 -translate-x-1/2 w-[4px] h-[4px] rounded-full"
          style={{
            top: t,
            background: "#222",
            boxShadow: "inset 0 1px 1px rgba(0,0,0,0.8)",
          }}
        />
      ))}
    </div>
  )
}

function LockBar({
  position,
  unlocked,
}: {
  position: 1 | 2 | 3
  unlocked: boolean
}) {
  const topPercent = position === 1 ? 18 : position === 2 ? 50 : 82

  return (
    <div
      className="absolute left-0 right-0"
      style={{ top: `${topPercent}%`, transform: "translateY(-50%)" }}
    >
      <div
        className="absolute h-[13px]"
        style={{
          left: "-16px",
          right: "-16px",
          background: "linear-gradient(180deg, #505050, #3a3a3a 40%, #2a2a2a)",
          boxShadow:
            "0 3px 7px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
          opacity: unlocked ? 0 : 1,
          transition: "opacity 0.8s ease",
        }}
      >
        {[6, 18, 82, 94].map((left) => (
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

      <div
        className="absolute left-1/2 top-0"
        style={{
          transform: `translate(-50%, -50%) ${
            unlocked ? "translateY(15px) scale(0.8)" : ""
          }`,
          opacity: unlocked ? 0 : 1,
          transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-[10px] w-[18px] h-[12px]"
          style={{
            borderRadius: "9px 9px 0 0",
            border: "4px solid #999",
            borderBottom: "none",
          }}
        />

        <div
          className="relative w-[32px] h-[28px] rounded-[3px]"
          style={{
            background:
              "linear-gradient(145deg,#e8c840,#d4b030 30%,#c0a020 60%,#a89018)",
            boxShadow:
              "0 3px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,200,0.4)",
          }}
        >
          <div
            className="absolute inset-[3px] rounded-[2px]"
            style={{
              background: "linear-gradient(145deg,#d8b838,#c4a428 50%,#b09020)",
            }}
          >
            <div className="absolute left-1/2 top-[5px] -translate-x-1/2">
              <div
                className="w-[8px] h-[8px] rounded-full"
                style={{ background: "#2a2520" }}
              />
              <div
                className="w-[3px] h-[7px] mx-auto -mt-[1px]"
                style={{ background: "#2a2520" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
