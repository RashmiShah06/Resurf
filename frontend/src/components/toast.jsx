import { useEffect } from "react";
import { FiCheckCircle, FiAlertCircle, FiX } from "react-icons/fi";

// Controlled toast: parent owns the `toast` state ({ type, message } | null)
// and passes a setter down as onClose. Auto-dismisses after 3s, but the
// user can also close it manually — same idea as alert()'s "OK" button,
// just not blocking and actually styled to match the app.
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed top-6 right-6 z-50 animate-[toastIn_0.2s_ease]">
      <style>{`
        @keyframes toastIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div
        className={`flex items-start gap-3 rounded-2xl px-4 py-3.5 shadow-lg border max-w-sm ${
          isError
            ? "bg-[#FBEAE3] border-[#E2917A]/40 text-[#8A3A24]"
            : "bg-[#E4EFF6] border-[#1B4965]/25 text-[#123448]"
        }`}
      >
        {isError ? (
          <FiAlertCircle className="mt-0.5 flex-shrink-0" size={18} />
        ) : (
          <FiCheckCircle className="mt-0.5 flex-shrink-0" size={18} />
        )}
        <p className="text-sm font-medium leading-5">{toast.message}</p>
        <button
          onClick={onClose}
          className="ml-auto flex-shrink-0 opacity-60 hover:opacity-100 transition"
          aria-label="Dismiss"
        >
          <FiX size={16} />
        </button>
      </div>
    </div>
  );
}

export default Toast;
