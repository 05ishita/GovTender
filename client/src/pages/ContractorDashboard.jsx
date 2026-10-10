


import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle,
  FileText,
  Plus,
  RefreshCw,
  Users,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const ContractorDashboard = () => {
  const { user } = useAuth();

  const [tenders, setTenders] = useState([]);
  const [applications, setApplications] = useState([]);
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const tendersResponse =
        await api.get("/tenders/my");

      const myTenders =
        tendersResponse.data.tenders || [];

      setTenders(myTenders);

      const applicationResults =
        await Promise.all(
          myTenders.map(async (tender) => {
            try {
              const response = await api.get(
                `/applications/tender/${tender._id}`
              );

              return response.data.applications || [];
            } catch {
              return [];
            }
          })
        );

      const allApplications =
        applicationResults.flat();

      setApplications(allApplications);

      const writersResponse =
        await api.get("/writers");

      setWriters(
        (writersResponse.data.writers || []).slice(
          0,
          4
        )
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    return {
      activeTenders: tenders.filter(
        (tender) => tender.status === "open"
      ).length,

      applications: applications.length,

      shortlisted: applications.filter(
        (application) =>
          application.status === "shortlisted"
      ).length,

      selected: applications.filter(
        (application) =>
          application.status === "selected"
      ).length,
    };
  }, [tenders, applications]);

  const recentTenders = tenders.slice(0, 4);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <RefreshCw
          size={25}
          className="animate-spin text-blue-600"
        />
        <span className="ml-3 text-slate-500">
          Loading your workspace...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Contractor Workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Welcome, {user?.name || "Contractor"}
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your government tenders and find qualified
            bid writers.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/ai-assistant"
            className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100"
          >
            <BrainCircuit size={17} />
            AI RFP Assistant
          </Link>

          <Link
            to="/create-tender"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Post New Tender
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FileText size={21} />}
          label="Active Tenders"
          value={stats.activeTenders}
        />

        <StatCard
          icon={<Users size={21} />}
          label="Applications"
          value={stats.applications}
        />

        <StatCard
          icon={<BriefcaseBusiness size={21} />}
          label="Shortlisted"
          value={stats.shortlisted}
        />

        <StatCard
          icon={<CheckCircle size={21} />}
          label="Selected"
          value={stats.selected}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Recent Tenders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest posted opportunities.
              </p>
            </div>

            <Link
              to="/my-tenders"
              className="text-sm font-semibold text-blue-600 hover:text-blue-800"
            >
              View all
            </Link>
          </div>

          {recentTenders.length === 0 ? (
            <div className="mt-8 rounded-2xl bg-slate-50 p-8 text-center">
              <FileText
                className="mx-auto text-slate-400"
                size={32}
              />

              <h3 className="mt-3 font-bold text-slate-900">
                No tenders yet
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create your first tender to start receiving
                applications.
              </p>

              <Link
                to="/create-tender"
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <Plus size={16} />
                Create Tender
              </Link>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {recentTenders.map((tender) => (
                <div
                  key={tender._id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-100 p-4 hover:bg-slate-50"
                >
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {tender.title}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {tender.category} •{" "}
                      {tender.applicationCount || 0} applications
                    </p>
                  </div>

                  <Link
                    to={`/tenders/${tender._id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
                  >
                    View
                    <ArrowRight size={15} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-blue-600 p-3">
              <BrainCircuit size={21} />
            </div>

            <div>
              <h2 className="font-bold">
                Need help with an RFP?
              </h2>

              <p className="text-xs text-slate-400">
                Let AI analyze it for you.
              </p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-6 text-slate-300">
            Quickly extract requirements, skills, experience,
            deadlines and recommendations from a government
            tender.
          </p>

          <Link
            to="/ai-assistant"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100"
          >
            Open AI Assistant
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Find a Bid Writer
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Explore writers available on GovTender.
            </p>
          </div>

          <Link
            to="/applications"
            className="text-sm font-semibold text-blue-600"
          >
            Manage applications
          </Link>
        </div>

        {writers.length === 0 ? (
          <div className="mt-5 rounded-2xl bg-slate-50 p-6 text-center text-sm text-slate-500">
            No bid writers are available yet.
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {writers.map((writer) => (
              <Link
                key={writer._id}
                to={`/writer/${writer._id}`}
                className="rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">
                    {writer.name
                      ?.charAt(0)
                      ?.toUpperCase() || "W"}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-bold text-slate-900">
                      {writer.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {writer.experience || 0} years experience
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(writer.skills || [])
                    .slice(0, 3)
                    .map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const StatCard = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
        {icon}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
};

export default ContractorDashboard;