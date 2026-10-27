import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const profilePath =
    user?.role === "writer" ? "/writer-profile" : "/dashboard";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        to={profilePath}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={17} />
        Back
      </Link>

      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Account
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your GovTender account and profile access.
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-xl font-bold text-blue-700">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{user?.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Role</p>
            <p className="mt-2 font-semibold capitalize text-slate-900">{user?.role}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Profile</p>
            <p className="mt-2 font-semibold text-slate-900">
              {user?.role === "writer" ? "Bid Writer Profile" : "Contractor Workspace"}
            </p>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to={profilePath}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <UserRound size={17} />
            {user?.role === "writer" ? "Edit Profile" : "Open Dashboard"}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-5 py-3 font-semibold text-red-600 hover:bg-red-50"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </section>
    </div>
  );
};

export default Settings;
