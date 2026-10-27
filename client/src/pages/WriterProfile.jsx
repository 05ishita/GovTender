import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  CheckCircle,
  Edit3,
  Mail,
  MessageCircle,
  Save,
  User,
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../hooks/useAuth";

const WriterProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isOwnProfile =
    user?.role === "writer" &&
    (!id || id === user.id);

  const [writer, setWriter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    companyName: "",
    bio: "",
    skills: "",
    experience: "",
    industries: "",
    availability: "available",
    expectedRate: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");

      try {
        const response = isOwnProfile
          ? await api.get("/writers/me")
          : await api.get(`/writers/${id}`);

        const data = response.data.writer;

        setWriter(data);

        setForm({
          name: data.name || "",
          phone: data.phone || "",
          companyName: data.companyName || "",
          bio: data.bio || "",
          skills: (data.skills || []).join(", "),
          experience: data.experience || "",
          industries: (data.industries || []).join(", "),
          availability:
            data.availability || "available",
          expectedRate:
            data.expectedRate || "",
        });
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load writer profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id, isOwnProfile]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.put(
        "/writers/me",
        {
          name: form.name,
          phone: form.phone,
          companyName: form.companyName,
          bio: form.bio,
          skills: form.skills
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          experience: Number(form.experience) || 0,
          industries: form.industries
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          availability: form.availability,
          expectedRate:
            Number(form.expectedRate) || 0,
        }
      );

      setWriter(response.data.writer);
      setSuccess(
        "Your writer profile has been updated successfully."
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-slate-500">
        Loading writer profile...
      </div>
    );
  }

  if (error && !writer) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error}
      </div>
    );
  }

  if (!writer) {
    return null;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={17} />
        Back
      </button>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-slate-950 px-6 py-8 text-white sm:px-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 text-2xl font-bold">
                {writer.name?.charAt(0)?.toUpperCase() || "W"}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">
                    {writer.name}
                  </h1>

                  {writer.isVerified && (
                    <CheckCircle
                      size={19}
                      className="text-emerald-400"
                    />
                  )}
                </div>

                <p className="mt-1 text-slate-300">
                  Professional Bid Writer
                </p>
              </div>
            </div>

            {isOwnProfile ? (
              <div className="rounded-xl bg-white/10 px-4 py-2 text-sm text-slate-200">
                <Edit3
                  size={15}
                  className="mr-2 inline"
                />
                Your Profile
              </div>
            ) : (
  <button
    type="button"
    onClick={() => navigate(`/messages/${writer._id}`)}
    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
  >
    <MessageCircle size={17} />
    Message Writer
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-3 sm:p-8">
          <div className="rounded-2xl bg-slate-50 p-5">
            <Briefcase
              size={22}
              className="text-blue-600"
            />
            <p className="mt-3 text-sm text-slate-500">
              Experience
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {writer.experience || 0} years
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <User
              size={22}
              className="text-blue-600"
            />
            <p className="mt-3 text-sm text-slate-500">
              Availability
            </p>
            <p className="mt-1 text-xl font-bold capitalize text-slate-900">
              {writer.availability || "available"}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-5">
            <Mail
              size={22}
              className="text-blue-600"
            />
            <p className="mt-3 text-sm text-slate-500">
              Expected Rate
            </p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              â‚¹
              {Number(
                writer.expectedRate || 0
              ).toLocaleString("en-IN")}
            </p>
          </div>
        </div>
      </div>

      {isOwnProfile ? (
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
              Profile Management
            </p>

            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              Complete your writer profile
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              A detailed profile helps contractors find
              the right writer for their tender.
            </p>
          </div>

          {success && (
            <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <CheckCircle size={17} />
              {success}
            </div>
          )}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Full Name
              </span>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Phone
              </span>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Company / Organization
              </span>
              <input
                name="companyName"
                value={form.companyName}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Experience (Years)
              </span>
              <input
                name="experience"
                type="number"
                min="0"
                value={form.experience}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Expected Rate (â‚¹)
              </span>
              <input
                name="expectedRate"
                type="number"
                min="0"
                value={form.expectedRate}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Availability
              </span>

              <select
                name="availability"
                value={form.availability}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500"
              >
                <option value="available">
                  Available
                </option>
                <option value="busy">
                  Busy
                </option>
                <option value="unavailable">
                  Unavailable
                </option>
              </select>
            </label>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Skills
            </span>

            <input
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="RFP Writing, Proposal Writing, Technical Writing, Compliance"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />

            <p className="mt-1 text-xs text-slate-400">
              Separate multiple skills using commas.
            </p>
          </label>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Industries
            </span>

            <input
              name="industries"
              value={form.industries}
              onChange={handleChange}
              placeholder="Defense, Civil Infrastructure, IT, Healthcare"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />

            <p className="mt-1 text-xs text-slate-400">
              Separate multiple industries using commas.
            </p>
          </label>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">
              Professional Bio
            </span>

            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="5"
              placeholder="Tell contractors about your experience, expertise and type of tenders you handle."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
            />
          </label>

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />
              {saving
                ? "Saving..."
                : "Save Profile"}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              About the Writer
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              {writer.bio ||
                "This writer has not added a professional bio yet."}
            </p>

            {writer.companyName && (
              <p className="mt-4 text-sm text-slate-500">
                Organization:{" "}
                <span className="font-semibold text-slate-800">
                  {writer.companyName}
                </span>
              </p>
            )}
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Skills & Industries
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {(writer.skills || []).map(
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>

            <h3 className="mt-6 text-sm font-bold text-slate-800">
              Industries
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              {(writer.industries || []).map(
                (industry) => (
                  <span
                    key={industry}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                  >
                    {industry}
                  </span>
                )
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default WriterProfile;
