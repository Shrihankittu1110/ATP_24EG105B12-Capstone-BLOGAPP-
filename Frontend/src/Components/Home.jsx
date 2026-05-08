import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../Store/authStore";
import EngageModal from "./EngageModal";
import api from "../api/axios";

function Home() {
  const navigate = useNavigate();
  const user = useAuth((state) => state.currentUser);
  const [isEngageOpen, setIsEngageOpen] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [recommendationsLoading, setRecommendationsLoading] = useState(false);

  const role = user?.role;

  const roleConfig = {
    GUEST: {
      title: "Welcome to MyBlog",
      subtitle: "Discover insightful articles, share your ideas, and explore content from talented authors.",
      primaryLabel: "Get Started",
      secondaryLabel: "Sign In",
      cards: [
        {
          icon: "✍️",
          title: "Write Articles",
          desc: "Share your knowledge and publish articles easily.",
          actionPath: "/register",
        },
        {
          icon: "📖",
          title: "Read Content",
          desc: "Explore articles from different categories and authors.",
          actionPath: "/login",
        },
        {
          icon: "💬",
          title: "Engage",
          desc: "Share recommendations and communicate with all users.",
          actionPath: "/register",
        },
      ],
    },
    USER: {
      badge: "Reader Mode",
      title: `Welcome back, ${user?.firstName || "Reader"}`,
      subtitle: "Your personalized reading space is ready. Browse articles, engage with posts, and keep exploring.",
      primaryLabel: "View Articles",
      cards: [
        {
          icon: "📰",
          title: "View Articles",
          desc: "Open the article feed and read what is trending now.",
          actionPath: "/articles",
        },
        {
          icon: "💬",
          title: "Engage",
          desc: "Comment and interact with other readers and authors.",
          actionPath: "engage",
        },
        {
          icon: "👤",
          title: "My Profile",
          desc: "Open your profile and manage your reader space.",
          actionPath: "/user-profile",
        },
      ],
    },
    AUTHOR: {
      title: `Ready to publish, ${user?.firstName || "Author"}?`,
      subtitle: "Write new articles, edit existing content, and keep your profile updated.",
      primaryLabel: "View Articles",
      cards: [
        {
          icon: "📝",
          title: "Create Draft",
          desc: "Start writing and publish in minutes.",
          actionPath: "/author-profile/write-article",
        },
        {
          icon: "🗂️",
          title: "Manage Posts",
          desc: "Edit, update, or remove your content from the dashboard.",
          actionPath: "/author-profile/articles",
        },
        {
          icon: "📈",
          title: "Track Output",
          desc: "Check published work and open the live article feed.",
          actionPath: "/articles",
        },
      ],
    },
    ADMIN: {
      title: `Control center, ${user?.firstName || "Admin"}`,
      subtitle: "Manage users, oversee articles, and monitor platform activity from one place.",
      primaryLabel: "View Articles",
      cards: [
        {
          icon: "👥",
          title: "Manage Users",
          desc: "View and control registered user accounts.",
          actionPath: "/admin/users",
        },
        {
          icon: "🛡️",
          title: "Manage Articles",
          desc: "Review and govern published content from the article feed.",
          actionPath: "/admin/articles",
        },
        {
          icon: "📊",
          title: "Analytics",
          desc: "Monitor usage and platform performance.",
          actionPath: "/admin/analytics",
        },
      ],
    },
  };

  const ui = roleConfig[role] || roleConfig.GUEST;

  useEffect(() => {
    const loadRecommendations = async () => {
      if (!user || user.role !== "USER") return;

      setRecommendationsLoading(true);

      try {
        const res = await api.get("/user-api/recommendations");
        setRecommendations(res.data?.payload || []);
      } catch {
        setRecommendations([]);
      } finally {
        setRecommendationsLoading(false);
      }
    };

    loadRecommendations();
  }, [user]);

  const openPrimaryPage = () => {
    if (!user) {
      navigate("/register");
      return;
    }

    navigate("/articles");
  };

  const openCardAction = (cardPath) => {
    if (cardPath === "engage") {
      setIsEngageOpen(true);
      return;
    }

    navigate(cardPath);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <section className="text-center">
        {ui.badge && (
          <p className="inline-flex items-center px-3 py-1 rounded-full bg-linear-to-r from-[#0ea5e9]/15 to-[#f97316]/15 text-[#0f766e] text-xs font-semibold uppercase tracking-[0.18em] mb-4 shadow-sm border border-white/70 backdrop-blur-xl">
            {ui.badge}
          </p>
        )}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#0f172a] leading-tight tracking-tight">
          {ui.title}
        </h1>
        <p className="mt-4 text-[#475569] text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed">
          {ui.subtitle}
        </p>

        <div className="mt-8 flex justify-center">
          <button
            onClick={openPrimaryPage}
            className="bg-linear-to-r from-[#0ea5e9] to-[#f97316] text-white font-semibold px-7 py-3 rounded-full hover:shadow-[0_16px_35px_rgba(14,165,233,0.28)] hover:-translate-y-0.5 transition-all shadow-sm"
          >
            {ui.primaryLabel}
          </button>
        </div>
      </section>

      <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {ui.cards.map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={() => openCardAction(card.actionPath)}
              className="rounded-2xl bg-white/75 backdrop-blur-xl border border-white/60 p-7 sm:p-8 text-center hover:-translate-y-1 hover:border-[#f97316]/30 hover:shadow-[0_24px_65px_rgba(249,115,22,0.12)] transition-all duration-300 cursor-pointer shadow-sm"
            >
              <p className="text-2xl mb-2">{card.icon}</p>
              <p className="text-2xl sm:text-3xl font-semibold text-[#0f172a] leading-tight">{card.title}</p>
              <p className="mt-3 text-[#475569] text-base sm:text-lg leading-relaxed">{card.desc}</p>
            </button>
          ))}
      </section>

      {user?.role === "USER" && (
        <section className="mt-12 rounded-3xl border border-white/70 bg-white/75 backdrop-blur-xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#64748b]">For you</p>
              <h2 className="text-2xl font-bold text-[#0f172a] mt-1">Recommended reads</h2>
            </div>

            <button
              type="button"
              onClick={() => navigate("/articles")}
              className="text-sm font-semibold text-[#0ea5e9] hover:text-[#f97316] transition-colors"
            >
              View all
            </button>
          </div>

          {recommendationsLoading ? (
            <p className="text-sm text-[#64748b]">Loading recommendations...</p>
          ) : recommendations.length === 0 ? (
            <p className="text-sm text-[#64748b]">No recommendations yet. Bookmark a few articles to improve your feed.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {recommendations.map((item) => (
                <button
                  key={item._id}
                  type="button"
                  onClick={() => navigate(`/article/${item._id}`, { state: item })}
                  className="rounded-2xl border border-white/70 bg-white/90 p-5 text-left shadow-sm hover:-translate-y-0.5 hover:border-[#0ea5e9]/25 transition-all"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0ea5e9]">{item.category}</p>
                  <h3 className="mt-2 text-lg font-semibold text-[#0f172a]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#475569] leading-relaxed">{item.content?.slice(0, 90)}...</p>
                </button>
              ))}
            </div>
          )}
        </section>
      )}

      <EngageModal
        isOpen={isEngageOpen}
        user={user}
        onClose={() => setIsEngageOpen(false)}
      />
    </div>
  );
}

export default Home;