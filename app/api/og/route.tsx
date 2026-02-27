import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "Bao's Blog";
  const author = searchParams.get("author") || "Bao Nguyen";
  const coverImage = searchParams.get("cover");

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#020617",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background gradient glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "-100px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-150px",
            right: "-50px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            display: "flex",
          }}
        />

        {/* Cover image (if available) */}
        {coverImage && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              width: "45%",
              height: "100%",
              display: "flex",
            }}
          >
            <img
              src={coverImage}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 0.3,
              }}
              alt=""
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to right, #020617 0%, transparent 100%)",
                display: "flex",
              }}
            />
          </div>
        )}

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px",
            width: coverImage ? "65%" : "100%",
            height: "100%",
          }}
        >
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: "900",
                color: "white",
              }}
            >
              B
            </div>
            <div
              style={{
                fontSize: "28px",
                fontWeight: "900",
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              BAO<span style={{ color: "#6366f1" }}>.DEV</span>
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: title.length > 60 ? "36px" : "48px",
              fontWeight: "800",
              color: "white",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              maxWidth: "700px",
            }}
          >
            {title}
          </div>

          {/* Author + Tag */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "#94a3b8",
                fontSize: "18px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "14px",
                  fontWeight: "700",
                }}
              >
                {author.charAt(0)}
              </div>
              {author}
            </div>
            <div
              style={{
                padding: "6px 16px",
                borderRadius: "100px",
                border: "1px solid rgba(99,102,241,0.4)",
                color: "#6366f1",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Cloud · DevOps · AWS
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
