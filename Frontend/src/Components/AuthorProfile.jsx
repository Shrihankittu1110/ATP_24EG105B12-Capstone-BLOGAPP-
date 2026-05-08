import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../Store/authStore";

import { navLinkClass, divider, cardClass, bodyText } from "../styles/common";

function AuthorProfile() {
  const currentUser = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const navigate = useNavigate();

  //call t6his function on logout
  const onLogout = async () => {
    //call login route
    await logout();
    //navigate to login component
    navigate("/login");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <section className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/80 shadow-[0_20px_60px_rgba(15,23,42,0.08)] p-6 sm:p-8 mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_28%)] pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-5">
            {currentUser?.profileImageUrl ? (
              <img
                src={currentUser.profileImageUrl}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-white/70 shadow-sm"
                alt="profile"
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-br from-[#0ea5e9]/15 to-[#f97316]/15 text-[#0f172a] flex items-center justify-center text-xl font-semibold border border-white/70 shadow-sm">
                {currentUser?.firstName?.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <p className="inline-flex items-center rounded-full border border-[#0ea5e9]/15 bg-[#0ea5e9]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f766e]">
                Writing Studio
              </p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-[#0f172a] tracking-tight">
                Welcome back, {currentUser?.firstName}
              </h2>
              <p className={`${bodyText} mt-3 max-w-2xl`}>
                Draft, publish, and refine your stories from one focused dashboard. Keep your ideas organized and your publishing flow fast.
              </p>
            </div>
          </div>

          <button
            className="w-full lg:w-auto bg-[#ff3b30] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-[#d62c23] transition shadow-sm"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </section>

      {/* NAVIGATION (TABS STYLE) */}
      <div className="flex gap-3 mb-6 bg-white/75 backdrop-blur-xl border border-white/70 p-2 rounded-full w-full sm:w-fit overflow-x-auto shadow-sm">
        <NavLink
          to="write-article"
          className={({ isActive }) =>
            isActive
              ? "bg-white px-5 py-2 rounded-full text-[#0066cc] text-sm font-semibold shadow-sm whitespace-nowrap"
              : `${navLinkClass} px-5 py-2 whitespace-nowrap`
          }
        >
          Write Article
        </NavLink>
      </div>

      <div className={divider}></div>

      {/* CONTENT */}
      <div className="mt-6">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthorProfile;