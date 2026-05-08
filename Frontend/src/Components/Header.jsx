import { NavLink, useNavigate } from "react-router";
import { useState } from "react";
import { useAuth } from "../Store/authStore";
import ProfileModal from "./ProfileModal";
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
} from "../styles/common";

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const user = useAuth((state) => state.currentUser);
  const logout = useAuth((state) => state.logout);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const unreadCount = user?.notifications?.filter((notification) => !notification.isRead).length || 0;

  // decide profile route based on role
  const getProfilePath = () => {
    if (!user) return "/";

    switch (user.role) {
      case "AUTHOR":
        return "/author-profile";
      case "ADMIN":
        return "/admin-profile";
      default:
        return "/user-profile";
    }
  };

  const openProfileModal = () => setIsProfileOpen(true);

  const closeProfileModal = () => setIsProfileOpen(false);

  const openDashboard = () => {
    closeProfileModal();
    navigate(getProfilePath());
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <>
      <nav className={navbarClass}>
        <div className={navContainerClass}>

          {/* LOGO */}
          <NavLink to="/" className={navBrandClass}>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-r from-[#0ea5e9] to-[#f97316] text-white text-sm font-bold shadow-sm">M</span>
            <span>MyBlog</span>
          </NavLink>

          <ul className={navLinksClass}>

            {/* HOME */}
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  isActive ? navLinkActiveClass : navLinkClass
                }
              >
                Home
              </NavLink>
            </li>

            {/* NOT LOGGED IN */}
            {!isAuthenticated && (
              <>
                <li>
                  <NavLink
                    to="/register"
                    className={({ isActive }) =>
                      isActive ? navLinkActiveClass : navLinkClass
                    }
                  >
                    Register
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive ? navLinkActiveClass : navLinkClass
                    }
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}

            {/* LOGGED IN */}
            {isAuthenticated && (
              <>
                <li>
                  <button
                    type="button"
                    onClick={openDashboard}
                    className="text-base sm:text-lg font-semibold px-4 py-2 rounded-full bg-[#0ea5e9]/10 text-[#0f172a] hover:bg-[#0ea5e9]/15 transition-colors"
                  >
                    Dashboard
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={openProfileModal}
                    className={`${navLinkClass} relative`}
                  >
                    Profile
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-2 min-w-5 h-5 px-1 rounded-full bg-[#ef4444] text-white text-[10px] flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="text-base sm:text-lg font-semibold px-4 py-2 rounded-full bg-[#ef4444] text-white hover:bg-[#dc2626] transition-colors"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

          </ul>
        </div>
      </nav>

      <ProfileModal
        isOpen={isProfileOpen}
        user={user}
        onClose={closeProfileModal}
        onOpenDashboard={openDashboard}
      />
    </>
  );
}

export default Header;