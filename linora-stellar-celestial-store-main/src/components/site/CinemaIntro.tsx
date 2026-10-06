import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";

export function CinemaIntro() {
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check if user already entered during this browsing session
    const entered = sessionStorage.getItem("linora-stellar-cosmos-entered");
    if (!entered) {
      setVisible(true);
    }

    const handleReplay = () => {
      setFading(false);
      setVisible(true);
    };

    window.addEventListener("replay-cinema-intro", handleReplay);
    return () => {
      window.removeEventListener("replay-cinema-intro", handleReplay);
    };
  }, []);

  const handleEnterCosmos = () => {
    setFading(true);
    sessionStorage.setItem("linora-stellar-cosmos-entered", "true");
    setTimeout(() => {
      setVisible(false);
    }, 1200);
  };

  if (!visible) return null;

  return (
    <div
      id="cinema-intro"
      className={fading ? "fade-out" : ""}
      role="dialog"
      aria-label="Welcome cinematic intro"
    >
      <div className="curtain-panel curtain-top" />
      <div className="curtain-panel curtain-bottom" />

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <div className="intro-logo tracking-[0.25em]">LINORA</div>
        <div className="intro-sub serif-italic">Light in the Midnight</div>

        <button
          type="button"
          onClick={handleEnterCosmos}
          className="enter-cosmos-btn inline-flex items-center gap-2 group cursor-pointer"
        >
          <Sparkles className="h-4 w-4 text-accent transition-transform group-hover:rotate-45" />
          <span>ENTER THE COSMOS ✨</span>
        </button>
      </div>
    </div>
  );
}

export function replayCinemaIntro() {
  window.dispatchEvent(new CustomEvent("replay-cinema-intro"));
}
