import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  CheckCircle,
  Clock3,
  FileText,
  RefreshCw,
  Search,
  UserRound,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const WriterDashboard = () => {
  const { user } = useAuth();

  const [tenders, setTenders] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      const [
        tendersResponse,
        applicationsResponse,
        profileResponse,
      ] = await Promise.all([
        api.get("/tenders"),
        api.get("/applications/my"),
        api.get("/writers/me"),
      ]);

      setTenders(
        tendersResponse.data.tenders || []
      );

      setApplications(
        applicationsResponse.data.applications || []
      );

      setProfile(
        profileResponse.data.writer || null
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load writer dashboard."
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
      availableTenders: tenders.length,

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

  const recommendedTenders = useMemo(() => {
    if (!profile) {
      return tenders.slice(0, 4);
    }

    const writerSkills = (
      profile.skills || []
    ).map((skill) =>
      skill.toLowerCase()
    );

    return [...tenders]
      .map((tender) => {
        const tenderSkills = (
          tender.skills || []
        ).map((skill) =>
          skill.toLowerCase()
        );

        const matches = tenderSkills.filter(
          (skill) =>
            writerSkills.some(
              (writerSkill) =>
                writerSkill.includes(skill) ||
                skill.includes(writerSkill)
            )
        );

        const score =
          tenderSkills.length > 0
            ? Math.round(
                (matches.length /
                  tenderSkills.length) *
                  100
              )
            : 0;

        return {
          ...tender,
          localMatchScore: score,
        };
      })
      .sort(
        (a, b) =>
          b.localMatchScore -
          a.localMatchScore
      )
      .slice(0, 4);
  }, [tenders, profile]);

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <RefreshCw
          size={25}
          className="animate-spin text-blue-600"
        />
        <span className="ml-3 text-slate-500">
          Loading writer workspace...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Bid Writer Workspace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Welcome, {user?.name || "Writer"}
          </h1>

          <p className="mt-2 text-slate-500">
            Find relevant government tenders and manage your
            proposals.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/writer-profile"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <UserRound size={17} />
            My Profile
          </Link>

          <Link
            to="/browse-tenders"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Search size={17} />
            Browse Tenders
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
          label="Available Tenders"
          value={stats.availableTenders}
        />

        <StatCard
          icon={<Clock3 size={21} />}
          label="My Applications"
          value={stats.applications}
        />

        <StatCard
          icon={<Briefcase size={21} />}
          label="Shortlisted"
          value={stats.shortlisted}
        />

        <StatCard
          icon={<CheckCircle size={21} />}
          label="Selected"
          value={stats.selected}
        />
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Recommended Tenders
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Opportunities that may match your skills.
            </p>
          </div>

          <Link
            to="/browse-tenders"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600"
          >
            Browse all
            <ArrowRight size={15} />
          </Link>
        </div>

        {recommendedTenders.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-slate-50 p-8 text-center">
            <FileText
              className="mx-auto text-slate-400"
              size={34}
            />

            <p className="mt-3 font-semibold text-slate-800">
              No open tenders available
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Check again later for new opportunities.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {recommendedTenders.map(
              (tender) => (
                <Link
                  key={tender._id}
                  to={`/tenders/${tender._id}`}
                  className="rounded-2xl border border-slate-200 p-5 transition hover:border-blue-200 hover:shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {tender.title}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {tender.category}
                        {tender.location
                          ? ` • ${tender.location}`
                          : ""}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                      {tender.localMatchScore}% match
                    </span>
                  </div>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
                    {tender.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Deadline:{" "}
                      {new Date(
                        tender.deadline
                      ).toLocaleDateString("en-IN")}
                    </span>

                    <span className="font-semibold text-blue-600">
                      View Details →
                    </span>
                  </div>
                </Link>
              )
            )}
          </div>
        )}
      </section>

      <section className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <p className="text-sm font-semibold text-blue-400">
              PROFILE COMPLETION
            </p>

            <h2 className="mt-2 text-xl font-bold">
              Build a stronger writer profile
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Add your skills, industries, experience and
              availability so contractors can find you more
              easily.
            </p>
          </div>

          <Link
            to="/writer-profile"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100"
          >
            Complete Profile
            <ArrowRight size={16} />
          </Link>
        </div>
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

export default WriterDashboard;