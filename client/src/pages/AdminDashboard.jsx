import { useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  Loader2,
  ShieldCheck,
  Users,
} from "lucide-react";

import api from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAdminData = async () => {
    try {
      const [
        statsResponse,
        usersResponse,
        tendersResponse,
      ] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/users"),
        api.get("/admin/tenders"),
      ]);

      setStats(statsResponse.data.stats);
      setUsers(usersResponse.data.users || []);
      setTenders(tendersResponse.data.tenders || []);
    } catch (error) {
      console.error("Admin dashboard error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const toggleVerification = async (
    userId,
    currentStatus
  ) => {
    try {
      await api.patch(`/admin/users/${userId}`, {
        isVerified: !currentStatus,
      });

      await loadAdminData();
    } catch (error) {
      console.error("Verification update error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2
          className="animate-spin text-blue-600"
          size={38}
        />
      </div>
    );
  }

  const cards = [
    {
      label: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
    },
    {
      label: "Contractors",
      value: stats?.contractors || 0,
      icon: BriefcaseBusiness,
    },
    {
      label: "Bid Writers",
      value: stats?.writers || 0,
      icon: Users,
    },
    {
      label: "Total Tenders",
      value: stats?.totalTenders || 0,
      icon: FileText,
    },
    {
      label: "Open Tenders",
      value: stats?.openTenders || 0,
      icon: FileText,
    },
    {
      label: "Applications",
      value: stats?.totalApplications || 0,
      icon: CheckCircle2,
    },
    {
      label: "Selected",
      value: stats?.selectedApplications || 0,
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="space-y-7">
      <div>
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Administration
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Monitor GovTender users, tenders and marketplace activity.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon size={20} />
              </div>

              <p className="mt-4 text-sm text-slate-500">
                {card.label}
              </p>

              <p className="mt-1 text-3xl font-bold">
                {card.value}
              </p>
            </div>
          );
        })}
      </div>

      <section className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">
            User Management
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Verify trusted contractors and bid writers.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4">
                    <p className="font-semibold">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {user.email}
                    </p>
                  </td>

                  <td className="px-6 py-4 text-sm capitalize">
                    {user.role}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    {user.companyName || "—"}
                  </td>

                  <td className="px-6 py-4">
                    {user.isVerified ? (
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Verified
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        toggleVerification(
                          user._id,
                          user.isVerified
                        )
                      }
                      className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700"
                    >
                      {user.isVerified
                        ? "Unverify"
                        : "Verify"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">
            Recent Tenders
          </h2>
        </div>

        <div className="divide-y">
          {tenders.slice(0, 10).map((tender) => (
            <div
              key={tender._id}
              className="flex flex-wrap items-center justify-between gap-4 p-5"
            >
              <div>
                <h3 className="font-semibold">
                  {tender.title}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  {tender.category} •{" "}
                  {tender.contractor?.name || "Contractor"}
                </p>
              </div>

              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                {tender.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;