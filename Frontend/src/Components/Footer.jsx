import { NavLink } from "react-router";
import { useAuth } from "../Store/authStore";

function Footer() {
  const user = useAuth((state) => state.currentUser);

  const profilePath = () => {
    if (!user) return "/login";

    switch (user.role) {
      case "AUTHOR":
        return "/author-profile";
      case "ADMIN":
        return "/admin-profile";
      default:
        return "/user-profile";
    }
  };

  return (
    <footer className="border-t border-white/70 bg-white/78 backdrop-blur-2xl mt-16 shadow-[0_-10px_45px_rgba(15,23,42,0.05)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-[#0f172a] flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-linear-to-r from-[#0ea5e9] to-[#f97316] text-white text-xs font-bold">M</span>
              MyBlog
            </h3>
            <p className="mt-3 text-sm text-[#475569] leading-relaxed">
              A clean space to write, read, and engage with stories from talented authors.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#0f172a] uppercase tracking-wide">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#475569]">
              <li>
                <NavLink to="/" className="hover:text-[#0ea5e9] transition-colors">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to={profilePath()} className="hover:text-[#0ea5e9] transition-colors">
                  Profile
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className="hover:text-[#0ea5e9] transition-colors">
                  Register
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#0f172a] uppercase tracking-wide">For Writers</h4>
            <ul className="mt-3 space-y-2 text-sm text-[#475569]">
              <li>
                <NavLink to="/author-profile/write-article" className="hover:text-[#0ea5e9] transition-colors">
                  Write Article
                </NavLink>
              </li>
              <li>
                <NavLink to="/author-profile/articles" className="hover:text-[#0ea5e9] transition-colors">
                  My Articles
                </NavLink>
              </li>
              <li>
                <NavLink to={profilePath()} className="hover:text-[#0ea5e9] transition-colors">
                  Dashboard
                </NavLink>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[#0f172a] uppercase tracking-wide">Support</h4>
            <p className="mt-3 text-sm text-[#475569] leading-relaxed">
              Need help? Sign in to manage your profile, article access, and account activity.
            </p>
            <p className="mt-4 text-sm text-[#64748b]">© {new Date().getFullYear()} MyBlog</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer