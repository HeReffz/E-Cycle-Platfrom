import React from "react";
import { useEffect, useState } from "react";
import { Recycle } from "lucide-react";

function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const duration = 1800;
    const interval = 20;
    const steps = duration / interval;
    let current = 0;

    const timer = setInterval(() => {
      current++;
      const raw = current / steps;
      const eased = 1 - Math.pow(1 - raw, 3);
      setProgress(Math.min(Math.round(eased * 100), 100));

      if (current >= steps) {
        clearInterval(timer);
        setTimeout(() => {
          setFadeOut(true);
          setTimeout(onFinish, 500);
        }, 200);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "#f5f2e8",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "2.5rem",
        transition: "opacity 0.5s ease",
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "all",
      }}
    >
      {/* Logo */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem" }}>
        <div
          style={{
            width: 64, height: 64, borderRadius: "18px",
            background: "rgba(34, 197, 94, 0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "loadPulse 2s ease infinite",
          }}
        >
          <Recycle size={32} color="#22c55e" strokeWidth={2.5} />
        </div>
        <span
          style={{
            fontSize: "1.4rem", fontWeight: 900,
            letterSpacing: "2px", textTransform: "uppercase",
            color: "#111827",
          }}
        >
          E-Cycle
        </span>
        <span style={{ fontSize: "0.78rem", color: "#9ca3af", fontWeight: 500 }}>
          Responsible E-Waste Management
        </span>
      </div>

      {/* Progress */}
      <div style={{ width: 200, display: "flex", flexDirection: "column", gap: "0.6rem" }}>
        <div style={{
          width: "100%", height: 3,
          background: "rgba(34, 197, 94, 0.15)",
          borderRadius: 99, overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #22c55e, #16a34a)",
            borderRadius: 99,
            transition: "width 0.02s linear",
            boxShadow: "0 0 10px rgba(34, 197, 94, 0.5)",
          }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "#9ca3af", fontWeight: 500 }}>
          <span>Memuat platform...</span>
          <span>{progress}%</span>
        </div>
      </div>

      {/* Dots */}
      <div style={{ display: "flex", gap: "0.5rem" }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#22c55e",
              animation: `loadDot 1.2s ease ${i * 0.2}s infinite`,
              opacity: 0.3,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes loadPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34,197,94,0.3); }
          50% { transform: scale(1.04); box-shadow: 0 0 0 12px rgba(34,197,94,0); }
        }
        @keyframes loadDot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

export default LoadingScreen;
