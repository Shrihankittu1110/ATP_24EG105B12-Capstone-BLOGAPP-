import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useAuth } from "../Store/authStore";
import api from "../api/axios";
import {
  pageWrapper,
  headingClass,
  bodyText,
  mutedText,
  cardClass,
  loadingClass,
  errorClass,
  primaryBtn,
  secondaryBtn,
} from "../styles/common";

function AdminUsers() {
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin-api/users");
      setUsers(res.data?.payload || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      if (!q) return true;
      return user.email?.toLowerCase().includes(q) || user.role?.toLowerCase().includes(q);
    });
  }, [query, users]);

  const toggleUserStatus = async (email, currentStatus) => {
    try {
      const res = await api.patch(
        "/admin-api/user",
        { email, isUserActive: !currentStatus },
      );
      toast.success(res.data?.message || "User updated");
      setUsers((prev) => prev.map((user) => (user.email === email ? res.data.payload : user)));
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Failed to update user");
    }
  };

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) return <p className={loadingClass}>Loading users...</p>;

  return (
    <div className={pageWrapper}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className={headingClass}>Manage Users</h1>
          <p className={bodyText}>Activate or block registered users and authors.</p>
        </div>
        <div className="flex gap-3">
          <button className={secondaryBtn} onClick={() => navigate("/admin-profile")}>
            Back to Admin
          </button>
          <button className={primaryBtn} onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by email or role"
        className="w-full md:w-96 mb-6 bg-white border border-[#d2d2d7] rounded-xl px-4 py-3 text-sm text-[#1d1d1f] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/10 focus:border-[#0066cc]"
      />

      {error && <p className={errorClass}>{error}</p>}

      <div className="grid gap-4">
        {filteredUsers.length === 0 ? (
          <p className="text-center text-[#a1a1a6] py-10">No users found</p>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.email} className={cardClass}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-[#1d1d1f]">{user.email}</p>
                  <p className={mutedText}>Role: {user.role}</p>
                  <p className={mutedText}>Status: {user.isUserActive ? "Active" : "Blocked"}</p>
                </div>
                <button
                  onClick={() => toggleUserStatus(user.email, user.isUserActive)}
                  className={user.isUserActive ? "bg-[#ff3b30] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#d62c23] transition-colors" : "bg-[#34c759] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#248a3d] transition-colors"}
                >
                  {user.isUserActive ? "Block" : "Activate"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminUsers;
