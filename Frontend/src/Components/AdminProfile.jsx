import { useAuth } from "../Store/authStore.js";
import { useNavigate } from "react-router-dom";
import {
  cardClass,
  headingClass,
  mutedText,
  primaryBtn,
} from "../styles/common";

function AdminProfile() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const adminCards = [
    {
      title: "Manage Users",
      desc: "View, block, or activate registered users and authors.",
      path: "/admin/users",
      icon: "👥",
    },
    {
      title: "Manage Articles",
      desc: "Review published content and restore or delete articles.",
      path: "/admin/articles",
      icon: "📝",
    },
    {
      title: "Analytics",
      desc: "Monitor platform activity and view live summary counts.",
      path: "/admin/analytics",
      icon: "📊",
    },
  ];

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-5 sm:p-6 mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 shadow-sm">
        <div className="flex items-center gap-4">
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              alt="admin"
              className="w-16 h-16 rounded-full object-cover border"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-xl font-semibold">
              {currentUser?.firstName?.charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <p className={mutedText}>Admin Panel</p>
            <h2 className="text-xl font-semibold text-[#1d1d1f]">{currentUser?.firstName}</h2>
          </div>
        </div>

        <button
          className="w-full sm:w-auto bg-[#ff3b30] text-white text-sm px-5 py-2 rounded-full hover:bg-[#d62c23] transition"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6 mb-8">
        <div className="rounded-3xl bg-[#f5f5f7] border border-[#e8e8ed] p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6e6e73]">Admin Overview</p>
          <h3 className="mt-2 text-2xl font-bold text-[#1d1d1f]">Manage the platform from one place</h3>
          <p className="mt-2 text-[#6e6e73] leading-relaxed">
            Use the dashboard cards to review users, moderate content, and monitor growth.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-[#e8e8ed] p-6">
          <p className="text-sm font-semibold text-[#1d1d1f]">Quick Stats</p>
          <div className="mt-4 space-y-3 text-sm text-[#6e6e73]">
            <p>Role: Admin</p>
            <p>Access: Full control</p>
            <p>Sections: Users, Articles, Analytics</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {adminCards.map((card) => (
          <button key={card.title} className={`${cardClass} text-left hover:-translate-y-0.5 transition-transform duration-200`} onClick={() => navigate(card.path)}>
            <div className="text-3xl mb-3">{card.icon}</div>
            <h3 className={headingClass}>{card.title}</h3>
            <p className={mutedText}>{card.desc}</p>
          </button>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button className={primaryBtn} onClick={() => navigate("/") }>
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default AdminProfile;