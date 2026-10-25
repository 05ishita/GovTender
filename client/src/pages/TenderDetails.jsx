import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  FileText,
  IndianRupee,
  MapPin,
  Send,
  UserRound,
} from "lucide-react";
import api, { API_ORIGIN } from "../services/api";
import { useAuth } from "../hooks/useAuth";

const TenderDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedRate, setProposedRate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchTender = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/tenders/${id}`);

      setTender(response.data.tender);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load tender details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchTender();
    }, 0);

    return () => clearTimeout(timer);
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApply = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!coverLetter.trim()) {
      setError("Please write a short proposal before applying.");
      return;
    }

    try {
      setApplying(true);

      await api.post("/applications", {
        tenderId: id,
        coverLetter,
        proposedRate: proposedRate || 0,
      });

      setMessage(
        "Application submitted successfully. The contractor can now review your proposal."
      );

      setCoverLetter("");
      setProposedRate("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to submit your application."
      );
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        <p className="mt-4 text-sm text-slate-500">
          Loading tender...
        </p>
      </div>
    );
  }

  if (error && !tender) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-medium text-red-700">{error}</p>

        <Link
          to="/browse-tenders"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </div>
    );
  }

  if (!tender) return null;

  const isWriter = user?.role === "writer";

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to={isWriter ? "/browse-tenders" : "/my-tenders"}
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <main className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                {tender.category || "Government"}
              </span>

              <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                {tender.status || "open"}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold leading-tight text-slate-900">
              {tender.title}
            </h1>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <CalendarDays size={16} />
                  Application deadline
                </div>

                <p className="mt-2 font-bold text-slate-900">
                  {formatDate(tender.deadline)}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <MapPin size={16} />
                  Location
                </div>

                <p className="mt-2 font-bold text-slate-900">
                  {tender.location || "Not specified"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <IndianRupee size={16} />
                  Budget
                </div>

                <p className="mt-2 font-bold text-slate-900">
                  {tender.budget
                    ? `â‚¹${Number(tender.budget).toLocaleString("en-IN")}`
                    : "Negotiable"}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <UserRound size={16} />
                  Experience
                </div>

                <p className="mt-2 font-bold text-slate-900">
                  {tender.experienceRequired || 0}+ years
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Tender requirements
            </h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600">
              {tender.description}
            </p>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Required expertise
            </h2>

            <div className="mt-5 flex flex-wrap gap-2">
              {(tender.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {tender.documentUrl && (
            <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-red-50 p-3 text-red-600">
                  <FileText size={22} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    Tender document
                  </h2>

                  <p className="text-sm text-slate-500">
                    Review the original tender/RFP document.
                  </p>
                </div>

                <a
                 href={
                    tender.documentUrl?.startsWith("http")
                      ? tender.documentUrl
                      : `${API_ORIGIN}${tender.documentUrl}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="ml-auto rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-300"
                >
                  Open
                </a>
              </div>
            </section>
          )}
        </main>

        {isWriter && (
          <aside>
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5">
                <p className="text-sm font-semibold text-blue-600">
                  Interested in this opportunity?
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Submit your proposal
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Explain why you're a strong fit for this tender.
                </p>
              </div>

              {message && (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  <div className="flex gap-2">
                    <CheckCircle2
                      size={18}
                      className="shrink-0"
                    />
                    {message}
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Your proposal *
                  </label>

                  <textarea
                    value={coverLetter}
                    onChange={(event) =>
                      setCoverLetter(event.target.value)
                    }
                    rows={8}
                    placeholder="Tell the contractor about your relevant experience, approach and why you are suitable..."
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Proposed rate
                  </label>

                  <input
                    type="number"
                    value={proposedRate}
                    onChange={(event) =>
                      setProposedRate(event.target.value)
                    }
                    placeholder="e.g. 25000"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={applying}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={17} />
                  {applying
                    ? "Submitting..."
                    : "Submit Application"}
                </button>
              </form>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default TenderDetails;
