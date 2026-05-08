import ModalShell from "./ModalShell";

function ProfileModal({ isOpen, user, onClose, onOpenDashboard }) {
  if (!isOpen || !user) return null;

  const details = [
    { label: "First name", value: user.firstName || "-" },
    { label: "Last name", value: user.lastName || "-" },
    { label: "Email", value: user.email || "-" },
    { label: "Role", value: user.role || "-" },
    { label: "Bio", value: user.bio || "Add a short bio in your profile page." },
    { label: "Website", value: user.website || "-" },
    { label: "Status", value: user.isUserActive === false ? "Inactive" : "Active" },
    {
      label: "Joined",
      value: user.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
            dateStyle: "medium",
          })
        : "-",
    },
  ];

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} ariaLabel="Profile details" maxWidthClass="max-w-lg">
        <div className="bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.18),transparent_42%),linear-gradient(135deg,rgba(14,165,233,0.18),rgba(20,184,166,0.16))] px-6 py-6 sm:px-8 sm:py-7">
          <div className="flex items-center gap-4">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="profile"
                className="h-16 w-16 rounded-full object-cover ring-4 ring-white/70"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-white/80 text-[#0ea5e9] flex items-center justify-center text-2xl font-bold ring-4 ring-white/70">
                {user.firstName?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#0f766e]">Profile details</p>
              <h2 className="mt-1 text-2xl font-bold text-[#0f172a] truncate">
                {user.firstName} {user.lastName || ""}
              </h2>
              <p className="mt-1 text-sm text-[#475569] truncate">{user.email}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="h-10 w-10 rounded-full bg-white/80 text-[#0f172a] hover:bg-white transition shadow-sm"
              aria-label="Close profile popup"
            >
              ×
            </button>
          </div>
        </div>

        <div className="px-6 py-6 sm:px-8 sm:py-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {details.map((detail) => (
              <div key={detail.label} className="rounded-2xl border border-white/70 bg-slate-50/80 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b]">{detail.label}</p>
                <p className="mt-2 text-sm font-medium text-[#0f172a] wrap-break-word">{detail.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onOpenDashboard}
              className="flex-1 rounded-full bg-linear-to-r from-[#0ea5e9] to-[#f97316] px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(14,165,233,0.22)] transition hover:-translate-y-0.5"
            >
              Open dashboard
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-[#0f172a] transition hover:border-[#0ea5e9]/30 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
        </div>
    </ModalShell>
  );
}

export default ProfileModal;