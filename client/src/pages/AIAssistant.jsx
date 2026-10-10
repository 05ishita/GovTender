import { useState } from "react";
import {
  BrainCircuit,
  CheckCircle,
  ClipboardList,
  Clock,
  Lightbulb,
  Loader2,
  ShieldAlert,
  Sparkles,
  Target,
} from "lucide-react";

import api from "../services/api";

const AIAssistant = () => {
  const [rfpText, setRfpText] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeRfp = async () => {
    if (!rfpText.trim()) {
      setError("Please paste your tender or RFP content first.");
      return;
    }

    setLoading(true);
    setError("");
    setAnalysis(null);

    try {
      const response = await api.post("/ai/analyze-rfp", {
        text: rfpText,
      });

      setAnalysis(response.data.analysis);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to analyze the RFP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearAnalysis = () => {
    setRfpText("");
    setAnalysis(null);
    setError("");
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-700">
          <Sparkles size={14} />
          AI Powered
        </div>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          AI RFP Assistant
        </h1>

        <p className="mt-2 max-w-3xl text-slate-500">
          Analyze a government tender or RFP to quickly understand its
          requirements and identify the ideal bid writer profile.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-3 text-blue-700">
                <BrainCircuit size={22} />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  RFP Content
                </h2>

                <p className="text-sm text-slate-500">
                  Paste your tender requirements below.
                </p>
              </div>
            </div>

            <textarea
              value={rfpText}
              onChange={(event) =>
                setRfpText(event.target.value)
              }
              rows={18}
              placeholder={`Example:

Government Department is seeking a qualified contractor for a civil infrastructure project.

The selected bidder must have experience in project management, technical proposal writing and government procurement.

Required experience: 5+ years.
Project location: Delhi NCR.
Proposal deadline: 30 November 2026.

Paste your complete RFP or tender content here...`}
              className="mt-5 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white"
            />

            {error && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={analyzeRfp}
                disabled={loading}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Analyze RFP
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={clearAnalysis}
                className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        <section className="lg:col-span-3">
          {!analysis ? (
            <div className="flex min-h-[600px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <div className="max-w-md">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <BrainCircuit size={30} />
                </div>

                <h2 className="mt-5 text-xl font-bold text-slate-900">
                  Your AI analysis will appear here
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Paste the tender/RFP requirements and click
                  <span className="font-semibold text-slate-700">
                    {" "}
                    Analyze RFP
                  </span>{" "}
                  to generate a structured assessment.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-100 p-3 text-emerald-700">
                    <CheckCircle size={22} />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      RFP Analysis Complete
                    </h2>

                    <p className="text-sm text-slate-500">
                      AI-generated insights from your tender content.
                    </p>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Summary
                  </p>

                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    {analysis.summary ||
                      "No summary was generated."}
                  </p>
                </div>
              </div>

              <AnalysisSection
                icon={<ClipboardList size={20} />}
                title="Key Requirements"
                items={analysis.keyRequirements}
              />

              <AnalysisSection
                icon={<Target size={20} />}
                title="Required Skills"
                items={analysis.requiredSkills}
              />

              <AnalysisSection
                icon={<BriefcaseIcon />}
                title="Experience Requirements"
                items={analysis.experienceRequirements}
              />

              <AnalysisSection
                icon={<Clock size={20} />}
                title="Important Deadlines"
                items={analysis.importantDeadlines}
              />

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                    <Target size={20} />
                  </div>

                  <h2 className="text-lg font-bold text-slate-900">
                    Suggested Writer Profile
                  </h2>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <ProfileBox
                    title="Minimum Experience"
                    value={`${analysis.suggestedWriterProfile?.minimumExperience || 0} years`}
                  />

                  <ProfileBox
                    title="Skills"
                    value={
                      analysis.suggestedWriterProfile?.skills
                        ?.length
                        ? analysis.suggestedWriterProfile.skills.join(
                            ", "
                          )
                        : "Not specified"
                    }
                  />

                  <ProfileBox
                    title="Industries"
                    value={
                      analysis.suggestedWriterProfile?.industries
                        ?.length
                        ? analysis.suggestedWriterProfile.industries.join(
                            ", "
                          )
                        : "Not specified"
                    }
                  />
                </div>
              </div>

              <AnalysisSection
                icon={<ShieldAlert size={20} />}
                title="Risk Factors"
                items={analysis.riskFactors}
              />

              <AnalysisSection
                icon={<Lightbulb size={20} />}
                title="Recommendations"
                items={analysis.recommendations}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const AnalysisSection = ({
  icon,
  title,
  items,
}) => {
  const safeItems = Array.isArray(items)
    ? items
    : [];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
          {icon}
        </div>

        <h2 className="text-lg font-bold text-slate-900">
          {title}
        </h2>
      </div>

      {safeItems.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {safeItems.map((item, index) => (
            <li
              key={`${title}-${index}`}
              className="flex gap-3 text-sm leading-6 text-slate-600"
            >
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-600" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-400">
          No specific information was identified.
        </p>
      )}
    </div>
  );
};

const ProfileBox = ({ title, value }) => {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
        {value}
      </p>
    </div>
  );
};

const BriefcaseIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect
        width="20"
        height="14"
        x="2"
        y="7"
        rx="2"
      />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
};

export default AIAssistant;