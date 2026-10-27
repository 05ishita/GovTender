import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Eye,
  FileText,
  Plus,
  Users,
} from "lucide-react";
import api from "../services/api";

const MyTenders = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTenders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tenders/my");

      setTenders(response.data.tenders || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your tenders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchTenders();
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-blue-600">
            Contractor workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            My Tenders
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your posted tender opportunities and review incoming
            applications.
          </p>
        </div>

        <Link
          to="/create-tender"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Post New Tender
        </Link>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
          <p className="mt-4 text-sm text-slate-500">
            Loading your tenders...
          </p>
        </div>
      ) : tenders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <FileText size={28} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-slate-900">
            No tenders yet
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Post your first tender and start connecting with specialized
            government bid writers.
          </p>

          <Link
            to="/create-tender"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Create First Tender
          </Link>
        </div>
      ) : (
        <div className="grid gap-5">
          {tenders.map((tender) => (
            <div
              key={tender._id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex flex-col justify-between gap-5 lg:flex-row">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {tender.category || "Government"}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        tender.status === "closed"
                          ? "bg-slate-100 text-slate-600"
                          : "bg-green-50 text-green-700"
                      }`}
                    >
                      {tender.status || "open"}
                    </span>
                  </div>

                  <h2 className="mt-4 text-xl font-bold text-slate-900">
                    {tender.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                    {tender.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-2">
                      <CalendarDays size={16} />
                      Deadline: {formatDate(tender.deadline)}
                    </span>

                    <span className="flex items-center gap-2">
                      <Users size={16} />
                      {tender.applicationCount || 0} applications
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center">
                  <Link
                    to={`/tenders/${tender._id}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:border-blue-300 hover:text-blue-600"
                  >
                    <Eye size={17} />
                    View Details
                  </Link>
                </div>
              </div>

              {tender.skills?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
                  {tender.skills.slice(0, 8).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTenders;
