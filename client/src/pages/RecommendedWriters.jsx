import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Loader2,
  Search,
  ShieldCheck,
  Star,
  UserRound,
} from "lucide-react";

import api from "../services/api";

const getMatchLabel = (score) => {
  if (score >= 80) return "Excellent Match";
  if (score >= 60) return "Strong Match";
  if (score >= 40) return "Good Match";
  return "Potential Match";
};

const RecommendedWriters = () => {
  const { id } = useParams();

  const [tender, setTender] = useState(null);
  const [writers, setWriters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [tenderResponse, writersResponse] =
          await Promise.all([
            api.get(`/tenders/${id}`),
            api.get(`/writers/recommended/${id}`),
          ]);

        setTender(
          tenderResponse.data.tender ||
            tenderResponse.data.data ||
            tenderResponse.data
        );

        setWriters(
          writersResponse.data.writers ||
            writersResponse.data.data ||
            []
        );
      } catch (err) {
        console.error(err);

        setError(
          err.response?.data?.message ||
            "Unable to load recommended writers."
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto animate-spin text-blue-600" size={38} />
          <p className="mt-3 text-sm text-slate-500">
            Finding the best bid writers...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/my-tenders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600"
      >
        <ArrowLeft size={16} />
        Back to My Tenders
      </Link>

      <div className="rounded-3xl bg-slate-950 p-7 text-white">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300">
              <Search size={13} />
              Smart Writer Matching
            </span>

            <h1 className="mt-4 text-3xl font-bold">
              Find the Right Bid Writer
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Writers are ranked according to skills, experience and
              availability for your tender.
            </p>

            {tender?.title && (
              <p className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                <BriefcaseBusiness size={16} />
                {tender.title}
              </p>
            )}
          </div>

          <div className="rounded-2xl bg-white/10 px-6 py-5 text-center">
            <p className="text-3xl font-bold">
              {writers.length}
            </p>
            <p className="text-xs text-slate-400">
              Recommended Writers
            </p>
          </div>
        </div>
      </div>

      {writers.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center">
          <UserRound className="mx-auto text-slate-300" size={45} />
          <h2 className="mt-4 text-xl font-bold">
            No matching writers found
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Add relevant skills and experience requirements to improve
            matching.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {writers.map((writer) => {
            const score = Math.round(
              Number(
                writer.matchScore ??
                  writer.matchPercentage ??
                  writer.score ??
                  0
              )
            );

            return (
              <div
                key={writer._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 font-bold text-blue-700">
                      {writer.name
                        ?.split(" ")
                        .map((x) => x[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase() || "BW"}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-900">
                          {writer.name}
                        </h2>

                        {writer.isVerified && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                            <ShieldCheck size={13} />
                            Verified
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {writer.companyName ||
                          "Government Tender & RFP Specialist"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <BriefcaseBusiness size={13} />
                          {writer.experience || 0} years
                        </span>

                        <span className="flex items-center gap-1">
                          <Clock3 size={13} />
                          {writer.availability || "available"}
                        </span>

                        <span className="flex items-center gap-1">
                          <Star size={13} />
                          {writer.rating || "New"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-64">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase text-slate-400">
                          Match Score
                        </p>
                        <p className="text-2xl font-bold text-slate-900">
                          {score}%
                        </p>
                      </div>

                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {getMatchLabel(score)}
                      </span>
                    </div>

                    <div className="mt-3 h-2 rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-blue-600"
                        style={{
                          width: `${Math.min(score, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-5 border-t pt-5">
                  <div className="flex flex-wrap gap-2">
                    {(writer.skills || [])
                      .slice(0, 8)
                      .map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link
                      to={`/writer/${writer._id}`}
                      className="inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"
                    >
                      View Profile
                      <ExternalLink size={15} />
                    </Link>

                    <Link
                      to={`/messages/${writer._id}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                      Contact Writer
                    </Link>

                    <Link
                      to="/applications"
                      className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700"
                    >
                      <CheckCircle2 size={15} />
                      Applications
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecommendedWriters;