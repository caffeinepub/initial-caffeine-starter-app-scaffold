import React, { useState } from "react";

const donationOptions = [
  {
    amount: 11,
    label: "₹11 दान",
    upi: "upi://pay?pa=YOURUPIID@upi&pn=Kuldeep&am=11&cu=INR",
  },
  {
    amount: 21,
    label: "₹21 दान",
    upi: "upi://pay?pa=YOURUPIID@upi&pn=Kuldeep&am=21&cu=INR",
  },
  {
    amount: 51,
    label: "₹51 दान",
    upi: "upi://pay?pa=YOURUPIID@upi&pn=Kuldeep&am=51&cu=INR",
  },
  {
    amount: 111,
    label: "₹111 दान",
    upi: "upi://pay?pa=YOURUPIID@upi&pn=Kuldeep&am=111&cu=INR",
  },
  {
    amount: 501,
    label: "₹501 दान",
    upi: "upi://pay?pa=YOURUPIID@upi&pn=Kuldeep&am=501&cu=INR",
  },
  {
    amount: 1100,
    label: "₹1100 दान",
    upi: "upi://pay?pa=YOURUPIID@upi&pn=Kuldeep&am=1100&cu=INR",
  },
];

export default function DaanPatra() {
  const [showThanks, setShowThanks] = useState(false);
  const [glowFrame, setGlowFrame] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setGlowFrame((f) => (f + 1) % 120), 60);
    return () => clearInterval(id);
  }, []);

  const handleDonate = (upiLink: string) => {
    setShowThanks(false);
    window.location.href = upiLink;
    // Show thanks message after returning (user navigates back)
    setTimeout(() => {
      setShowThanks(true);
    }, 2000);
  };

  // Animated diya glow
  const divaGlow = 0.6 + 0.4 * Math.sin((glowFrame / 120) * 2 * Math.PI);

  return (
    <div
      className="min-h-screen pb-28"
      style={{
        background:
          "linear-gradient(180deg, #1a0533 0%, #2d0a4e 40%, #1a0533 100%)",
      }}
    >
      {/* Hero Header */}
      <div
        className="relative flex flex-col items-center py-10 px-4"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,153,51,0.18) 0%, transparent 100%)",
          borderBottom: "1px solid rgba(255,153,51,0.2)",
        }}
      >
        {/* Diya icon with animated glow */}
        <div
          className="text-6xl mb-3 select-none"
          style={{
            filter: `drop-shadow(0 0 ${16 * divaGlow}px rgba(255,153,51,${divaGlow})) drop-shadow(0 0 ${8 * divaGlow}px rgba(255,215,0,${divaGlow * 0.7}))`,
            transform: `scale(${0.97 + 0.03 * divaGlow})`,
            transition: "none",
          }}
        >
          🪔
        </div>

        {/* Temple top decoration */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg" style={{ color: "rgba(255,153,51,0.6)" }}>
            🔱
          </span>
          <h1
            className="text-2xl font-bold text-center"
            style={{
              color: "#FFD700",
              textShadow:
                "0 0 16px rgba(255,215,0,0.5), 0 2px 4px rgba(0,0,0,0.6)",
              fontFamily: "serif",
              letterSpacing: "0.05em",
            }}
          >
            दान पात्र
          </h1>
          <span className="text-lg" style={{ color: "rgba(255,153,51,0.6)" }}>
            🔱
          </span>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-2 mb-4">
          <div
            className="h-px flex-1 max-w-16"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,153,51,0.7))",
            }}
          />
          <span className="text-sm" style={{ color: "rgba(255,215,0,0.7)" }}>
            🕉️
          </span>
          <div
            className="h-px flex-1 max-w-16"
            style={{
              background:
                "linear-gradient(90deg, rgba(255,153,51,0.7), transparent)",
            }}
          />
        </div>

        {/* Description */}
        <p
          className="text-sm text-center max-w-sm leading-relaxed"
          style={{
            color: "rgba(255,215,0,0.85)",
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}
        >
          यदि आप सनातन धर्म के प्रचार, कथा, भजन और सेवा कार्यों में सहयोग करना चाहें, तो
          दान पात्र में अपनी श्रद्धा अनुसार दान कर सकते हैं।
          <span
            className="block mt-1 font-medium"
            style={{ color: "rgba(255,153,51,0.9)" }}
          >
            यह दान पूरी तरह स्वैच्छिक है।
          </span>
        </p>
      </div>

      {/* Thank you message */}
      {showThanks && (
        <div
          className="mx-4 mt-4 p-4 rounded-2xl text-center border"
          style={{
            background: "rgba(255,153,51,0.15)",
            borderColor: "rgba(255,153,51,0.4)",
            boxShadow: "0 0 20px rgba(255,153,51,0.2)",
          }}
          data-ocid="daan.success_state"
        >
          <div className="text-3xl mb-2">🙏</div>
          <p
            className="font-semibold text-base"
            style={{
              color: "#FFD700",
              textShadow: "0 0 8px rgba(255,215,0,0.4)",
            }}
          >
            दान के लिए धन्यवाद।
          </p>
          <p className="text-sm mt-1" style={{ color: "rgba(255,215,0,0.75)" }}>
            भगवान की कृपा आप पर बनी रहे। 🪷
          </p>
        </div>
      )}

      {/* Donation Buttons */}
      <div className="px-4 mt-6 max-w-md mx-auto">
        <p
          className="text-center text-xs mb-4 font-medium tracking-wider uppercase"
          style={{ color: "rgba(255,153,51,0.7)", letterSpacing: "0.12em" }}
        >
          ✦ अपनी श्रद्धा अनुसार दान चुनें ✦
        </p>

        <div className="grid grid-cols-2 gap-3">
          {donationOptions.map((opt) => (
            <button
              key={opt.amount}
              type="button"
              onClick={() => handleDonate(opt.upi)}
              data-ocid={`daan.donate_${opt.amount}.button`}
              className="relative flex flex-col items-center justify-center py-5 rounded-2xl font-bold text-lg transition-all duration-150 active:scale-95 hover:scale-105"
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,153,51,0.18) 0%, rgba(255,215,0,0.10) 100%)",
                border: "1.5px solid rgba(255,153,51,0.45)",
                color: "#FFD700",
                boxShadow:
                  "0 4px 18px rgba(255,153,51,0.12), inset 0 1px 0 rgba(255,215,0,0.15)",
                textShadow: "0 0 10px rgba(255,215,0,0.4)",
              }}
            >
              {/* Temple arch decoration top */}
              <span
                className="absolute top-1.5 left-0 right-0 flex justify-center gap-3 opacity-40"
                aria-hidden="true"
              >
                <span className="text-[8px]">✦</span>
                <span className="text-[8px]">✦</span>
              </span>

              <span className="text-xl mb-0.5">🪔</span>
              <span className="text-base font-bold">{opt.label}</span>

              {/* Shimmer bottom bar */}
              <span
                className="absolute bottom-2 left-1/2 -translate-x-1/2 h-0.5 rounded-full opacity-60"
                style={{
                  width: "40%",
                  background:
                    "linear-gradient(90deg, transparent, #FFD700, transparent)",
                }}
                aria-hidden="true"
              />
            </button>
          ))}
        </div>

        {/* Supported apps info */}
        <div
          className="mt-5 rounded-2xl p-4 text-center"
          style={{
            background: "rgba(255,215,0,0.07)",
            border: "1px solid rgba(255,215,0,0.15)",
          }}
        >
          <p
            className="text-xs font-medium mb-2"
            style={{ color: "rgba(255,215,0,0.6)" }}
          >
            समर्थित UPI ऐप्स
          </p>
          <div className="flex items-center justify-center gap-4">
            {["PhonePe", "Google Pay", "Paytm"].map((app) => (
              <span
                key={app}
                className="text-xs px-2 py-1 rounded-lg"
                style={{
                  background: "rgba(255,153,51,0.12)",
                  color: "rgba(255,215,0,0.75)",
                  border: "1px solid rgba(255,153,51,0.2)",
                }}
              >
                {app}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom note */}
        <div className="mt-4 flex flex-col items-center gap-1">
          <div
            className="h-px w-2/3 rounded-full"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(255,153,51,0.5), transparent)",
            }}
          />
          <p
            className="text-xs text-center mt-2 italic"
            style={{ color: "rgba(255,215,0,0.4)" }}
          >
            🕉️ दान धर्म का मूल है — हर श्रद्धा स्वीकार है
          </p>
        </div>

        {/* "I donated" button */}
        <button
          type="button"
          onClick={() => setShowThanks(true)}
          data-ocid="daan.confirm_button"
          className="mt-5 w-full py-3 rounded-2xl text-sm font-semibold transition-all active:scale-95"
          style={{
            background: "rgba(255,153,51,0.12)",
            border: "1px solid rgba(255,153,51,0.3)",
            color: "rgba(255,215,0,0.7)",
          }}
        >
          🙏 मैंने दान कर दिया
        </button>
      </div>
    </div>
  );
}
