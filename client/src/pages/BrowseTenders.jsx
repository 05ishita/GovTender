import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Eye,
  FileText,
  MapPin,
  Search,
} from "lucide-react";
import api from "../services/api";

const BrowseTenders = () => {
  const [tenders, setTenders] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTenders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/tenders");

      setTenders(response.data.tenders || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load available tenders."
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

  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      !search ||
      tender.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      tender.description
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      tender.skills?.some((skill) =>
        skill.toLowerCase().includes(search.toLowerCase())
      );

    const matchesCategory =
      category === "all" ||
      tender.category?.toLowerCase() === category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <p className="text-sm font-semibold text-blue-600">
          Writer workspace
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900">
          Browse Tenders
        </h1>

        <p className="mt-2 max-w-2xl text-slate-500">
          Discover government, defense, civil and municipal opportunities
          that match your bid writing expertise.
        </p>
      </div>

      <div className="mb-7 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tenders, requirements or skills..."
              className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="all">All Categories</option>
            <option value="Government">Government</option>
            <option value="Defense">Defense</option>
            <option value="Civil Infrastructure">
              Civil Infrastructure
            </option>
            <option value="Municipal">Municipal</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="IT & Technology">IT & Technology</option>
          </select>
        </div>
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
            Finding available tenders...
          </p>
        </div>
      ) : filteredTenders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <FileText
            size={38}
            className="mx-auto text-slate-300"
          />

          <h2 className="mt-4 text-xl font-bold text-slate-900">
            No matching tenders
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Try changing your search or category filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {filteredTenders.map((tender) => (
            <article
              key={tender._id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                  {tender.category || "Government"}
                </span>

                <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  Open
                </span>
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-900">
                {tender.title}
              </h2>

              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                {tender.description}
              </p>

              <div className="mt-5 space-y-2 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CalendarDays size={16} />
                  Deadline: {formatDate(tender.deadline)}
                </div>

                {tender.location && (
                  <div className="flex items-center gap-2">
                    <MapPin size={16} />
                    {tender.location}
                  </div>
                )}
              </div>

              {tender.skills?.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {tender.skills.slice(0, 6).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 border-t border-slate-100 pt-5">
                <Link
                  to={`/tenders/${tender._id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  <Eye size={17} />
                  View Tender
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseTenders;
