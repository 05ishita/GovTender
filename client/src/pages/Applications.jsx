
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const statusStyles = {
  pending: "bg-amber-100 text-amber-700",
  shortlisted: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-700",
  selected: "bg-emerald-100 text-emerald-700",
};

const Applications = () => {
  const { user } = useAuth();
  const isContractor = user?.role === "contractor";

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const loadApplications = async () => {
    setLoading(true);
    setError("");

    try {
      if (isContractor) {
        const { data } = await api.get("/tenders/my");
        const tenders = data.tenders || [];

        const results = await Promise.all(
          tenders.map(async (tender) => {
            const response = await api.get(
              `/applications/tender/${tender._id}`
            );

            return (response.data.applications || []).map(
              (application) => ({
                ...application,
                tender: application.tender || tender,
              })
            );
          })
        );

        setApplications(results.flat());
      } else {
        const { data } = await api.get("/applications/my");
        setApplications(data.applications || []);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load applications. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [isContractor]);

  const updateStatus = async (applicationId, status) => {
    setUpdatingId(applicationId);
    setError("");

    try {
      const { data } = await api.patch(
        `/applications/${applicationId}/status`,
        { status }
      );

      setApplications((current) =>
        current.map((application) =>
          application._id === applicationId
            ? { ...application, ...data.application, status }
            : status === "selected" &&
                application.tender?._id ===
                  current.find(
                    (item) => item._id === applicationId
                  )?.tender?._id
              ? { ...application, status: "rejected" }
              : application
        )
      );

      await loadApplications();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update application status."
      );
    } finally {
      setUpdatingId("");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <RefreshCw className="animate-spin text-blue-600" size={28} />
        <span className="ml-3 text-slate-500">
          Loading applications...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Marketplace
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {isContractor ? "Received Applications" : "My Applications"}
          </h1>
          <p className="mt-2 text-slate-500">
            {isContractor
              ? "Review bid writers and manage proposals for your tenders."
              : "Track your submitted proposals and application status."}
          </p>
        </div>

        <button
          onClick={loadApplications}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <FileText className="mx-auto text-slate-400" size={42} />
          <h2 className="mt-4 text-xl font-bold text-slate-900">
            No applications yet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            {isContractor
              ? "Applications from bid writers will appear here when someone applies to your tender."
              : "Browse open tenders and submit a proposal to start tracking your applications here."}
          </p>

          <Link
            to={isContractor ? "/my-tenders" : "/browse-tenders"}
            className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            {isContractor ? "View My Tenders" : "Browse Tenders"}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const tender = application.tender || {};
            const writer = application.writer || {};

            return (
              <article
                key={application._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-slate-900">
                      {tender.title || "Tender"}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {isContractor
                        ? `Applicant: ${writer.name || "Bid Writer"}`
                        : `Category: ${tender.category || "Government"}`}
                    </p>

                    {isContractor && writer.email && (
                      <p className="mt-1 text-sm text-slate-500">
                        {writer.email}
                      </p>
                    )}
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                      statusStyles[application.status] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {application.status || "pending"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      Match Score
                    </p>
                    <p className="mt-1 text-lg font-bold text-blue-700">
                      {application.matchScore ?? 0}%
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      Proposed Rate
                    </p>
                    <p className="mt-1 text-lg font-bold text-slate-900">
                      ₹{Number(application.proposedRate || 0).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">
                      Submitted
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-800">
                      <Clock size={15} />
                      {application.createdAt
                        ? new Date(application.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-slate-800">
                    {isContractor ? "Writer's Proposal" : "Your Proposal"}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                    {application.coverLetter}
                  </p>
                </div>

                {isContractor && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {writer._id && (
                      <Link
                        to={`/writer/${writer._id}`}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        <Eye size={16} />
                        View Writer
                      </Link>
                    )}

                    {application.status !== "shortlisted" &&
                      application.status !== "selected" &&
                      application.status !== "rejected" && (
                        <button
                          disabled={updatingId === application._id}
                          onClick={() =>
                            updateStatus(application._id, "shortlisted")
                          }
                          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                          Shortlist
                        </button>
                      )}

                    {application.status !== "selected" &&
                      application.status !== "rejected" && (
                        <>
                          <button
                            disabled={updatingId === application._id}
                            onClick={() =>
                              updateStatus(application._id, "selected")
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <CheckCircle size={16} />
                            Select Writer
                          </button>

                          <button
                            disabled={updatingId === application._id}
                            onClick={() =>
                              updateStatus(application._id, "rejected")
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                          >
                            <XCircle size={16} />
                            Reject
                          </button>
                        </>
                      )}
                  </div>
                )}

                {!isContractor && tender._id && (
                  <Link
                    to={`/tenders/${tender._id}`}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
                  >
                    View Tender Details
                    <Eye size={15} />
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Applications;