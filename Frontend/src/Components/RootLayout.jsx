import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../Store/authStore";



function RootLayout() {
  const checkAuth = useAuth((state) => state.checkAuth);
  const loading = useAuth((state) => state.loading);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.16),transparent_34%),linear-gradient(to_bottom,#f8fbff,#eef2ff_48%,#fff7ed)] text-[#0ea5e9]">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 backdrop-blur-xl px-7 py-6 shadow-[0_22px_70px_rgba(15,23,42,0.08)] text-sm font-medium flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-linear-to-r from-[#0ea5e9] to-[#f97316] animate-pulse"></span>
          Loading MyBlog...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(249,115,22,0.16),transparent_28%),linear-gradient(to_bottom,#f8fbff,#eef2ff_48%,#fff7ed)] text-[#0f172a]">
      <Header />
      <main className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default RootLayout;