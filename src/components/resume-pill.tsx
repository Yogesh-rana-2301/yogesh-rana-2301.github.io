"use client";

export function ResumePill() {
  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
      }}
    >
      <a
        href="https://drive.google.com/file/d/1uMRCEwjCTb2Zz70GEFbU-jnQ9TUmZycB/view?usp=share_link"
        target="_blank"
        rel="noopener noreferrer"
        id="resume-download-btn"
        style={{
          pointerEvents: "auto",
          display: "inline-flex",
          alignItems: "center",
          gap: "9px",
          padding: "9px 24px",
          borderRadius: "50px",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.08) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.30)",
          boxShadow:
            "0 4px 24px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.20) inset, 0 -1px 0 rgba(0,0,0,0.08) inset",
          textDecoration: "none",
          cursor: "pointer",
          transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
          position: "relative",
          overflow: "hidden",
          color: "inherit",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.transform = "scale(1.04)";
          el.style.boxShadow =
            "0 8px 32px rgba(0,0,0,0.14), 0 1px 0 rgba(255,255,255,0.24) inset";
          el.style.background =
            "linear-gradient(135deg, rgba(255,255,255,0.30) 0%, rgba(255,255,255,0.14) 100%)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLAnchorElement;
          el.style.transform = "scale(1)";
          el.style.boxShadow =
            "0 4px 24px rgba(0,0,0,0.10), 0 1px 0 rgba(255,255,255,0.20) inset, 0 -1px 0 rgba(0,0,0,0.08) inset";
          el.style.background =
            "linear-gradient(135deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.08) 100%)";
        }}
      >
        {/* Shimmer sweep */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "inherit",
            background:
              "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.26) 50%, transparent 65%)",
            backgroundSize: "200% 100%",
            animation: "resume-pill-shimmer 3s linear infinite",
            pointerEvents: "none",
          }}
        />
        {/* Download icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.7, flexShrink: 0 }}
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span
          style={{
            fontSize: "0.80rem",
            fontWeight: 500,
            letterSpacing: "0.025em",
            opacity: 0.82,
            whiteSpace: "nowrap",
          }}
        >
          Resume
        </span>
        {/* Arrow icon */}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.5, flexShrink: 0 }}
        >
          <path d="M7 17L17 7" />
          <path d="M7 7h10v10" />
        </svg>
      </a>
    </div>
  );
}
