import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  FileText,
  IndianRupee,
  Plus,
  Upload,
  X,
} from "lucide-react";
import api from "../services/api";

const CreateTender = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Government",
    location: "",
    budget: "",
    deadline: "",
    experienceRequired: 1,
    skills: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (
      !form.skills.some(
        (existingSkill) =>
          existingSkill.toLowerCase() === skill.toLowerCase()
      )
    ) {
      setForm({
        ...form,
        skills: [...form.skills, skill],
      });
    }

    setSkillInput("");
  };

  const removeSkill = (skillToRemove) => {
    setForm({
      ...form,
      skills: form.skills.filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title || !form.description || !form.deadline) {
      setError(
        "Tender title, description and application deadline are required."
      );
      return;
    }

    if (form.skills.length === 0) {
      setError("Please add at least one required skill.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("location", form.location);
      formData.append("budget", form.budget);
      formData.append("deadline", form.deadline);
      formData.append(
        "experienceRequired",
        form.experienceRequired
      );
      formData.append("skills", JSON.stringify(form.skills));

      if (document) {
        formData.append("document", document);
      }

      await api.post("/tenders", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Tender posted successfully.");

      setTimeout(() => {
        navigate("/my-tenders");
      }, 800);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create tender. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8">
        <Link
          to="/dashboard"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          Back to dashboard
        </Link>

        <p className="text-sm font-semibold text-blue-600">
          Contractor workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Post a new tender
        </h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          Share the tender requirements so specialized bid writers can
          understand the opportunity and submit proposals.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <FileText size={20} />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Tender information
              </h2>

              <p className="text-sm text-slate-500">
                Basic details about the opportunity.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Tender title *
              </label>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Municipal Infrastructure Development Proposal"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Description *
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={6}
                placeholder="Describe the tender, scope of work, deliverables and important requirements..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >
                  <option>Government</option>
                  <option>Defense</option>
                  <option>Civil Infrastructure</option>
                  <option>Municipal</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>IT & Technology</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. New Delhi"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">
            Budget & timeline
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Help writers understand the commercial and time requirements.
          </p>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Budget
              </label>

              <div className="relative">
                <IndianRupee
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="number"
                  name="budget"
                  value={form.budget}
                  onChange={handleChange}
                  placeholder="50000"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Application deadline *
              </label>

              <div className="relative">
                <CalendarDays
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Experience required
              </label>

              <select
                name="experienceRequired"
                value={form.experienceRequired}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value={0}>Entry level</option>
                <option value={1}>1+ years</option>
                <option value={2}>2+ years</option>
                <option value={3}>3+ years</option>
                <option value={5}>5+ years</option>
                <option value={7}>7+ years</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-bold text-slate-900">
            Required expertise
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add skills that should be present in the selected bid writer.
          </p>

          <div className="mt-5 flex gap-3">
            <input
              value={skillInput}
              onChange={(event) =>
                setSkillInput(event.target.value)
              }
              onKeyDown={handleSkillKeyDown}
              placeholder="e.g. Technical Writing"
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />

            <button
              type="button"
              onClick={addSkill}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800"
            >
              <Plus size={18} />
              Add
            </button>
          </div>

          {form.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700"
                >
                  {skill}

                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="rounded-2xl bg-white p-4 text-blue-600 shadow-sm">
              <Upload size={24} />
            </div>

            <h2 className="mt-4 font-bold text-slate-900">
              Upload RFP / tender document
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              PDF, DOC or DOCX files can be attached for writers to review.
            </p>

            <label className="mt-5 cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:border-blue-400">
              Choose document
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(event) =>
                  setDocument(event.target.files?.[0] || null)
                }
              />
            </label>

            {document && (
              <p className="mt-3 text-sm font-medium text-green-600">
                Selected: {document.name}
              </p>
            )}
          </div>
        </section>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Link
            to="/dashboard"
            className="rounded-xl border border-slate-200 px-6 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Posting tender..." : "Post Tender"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTender;