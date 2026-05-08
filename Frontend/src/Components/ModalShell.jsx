import { useEffect } from "react";

function ModalShell({ isOpen, onClose, ariaLabel, maxWidthClass = "max-w-lg", children }) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/45 backdrop-blur-sm px-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`w-full ${maxWidthClass} rounded-4xl border border-white/60 bg-white/90 shadow-[0_30px_90px_rgba(15,23,42,0.22)] overflow-hidden`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </div>
  );
}

export default ModalShell;