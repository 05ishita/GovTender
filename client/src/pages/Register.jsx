import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  useEffect(() => {
    document.title = "Create account | GovTender";
  }, []);
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    phone: "",
    companyName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (!form.role) {
      setError("Please select how you want to use GovTender.");
      return;
    }

    try {
      setLoading(true);

      const newUser = await register(form);

      if (newUser.role === "writer") {
        navigate("/writer-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-blue-700 via-blue-800 to-slate-950 p-12 text-white lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 font-bold">
              GT
            </div>

            <span className="text-xl font-bold">GovTender</span>
          </div>

          <div className="mt-24">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-200">
              Build better bids
            </p>

            <h1 className="mt-4 text-4xl font-bold leading-tight">
              One platform for contractors and specialized bid writers.
            </h1>

            <p className="mt-6 max-w-md text-blue-100">
              Create tender opportunities, showcase expertise, collaborate
              with professionals and use AI-assisted matching.
            </p>
          </div>

          <div className="mt-20 space-y-4">
            {[
              "Specialized government tender marketplace",
              "AI-assisted writer matching",
              "Centralized tender management",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-sm text-blue-50"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                  ÃƒÂ¢Ã…â€œÃ¢â‚¬Å“
                </span>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="mx-auto max-w-lg">
            <div className="mb-8">
              <p className="text-sm font-semibold text-blue-600">
                Get started
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">Create your GovTender account</h2>

              <p className="mt-2 text-sm text-slate-500">
                Join as a contractor or technical bid writer.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  I am joining as
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, role: "contractor" })} aria-pressed={form.role === "contractor"}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      form.role === "contractor"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  ><span className="block font-bold">Contractor</span><span className="mt-1 block text-left text-xs font-normal leading-5">I need a technical writer to help prepare and submit tender bids.</span></button>

                  <button
                    type="button"
                    onClick={() =>
                      setForm({ ...form, role: "writer" })
                    } aria-pressed={form.role === "writer"}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      form.role === "writer"
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  ><span className="block font-bold">Bid Writer</span><span className="mt-1 block text-left text-xs font-normal leading-5">I write technical proposals and want to find tender opportunities.</span></button>
                </div>
              </div>

              <div>
                <label htmlFor="register-name" className="mb-2 block text-sm font-semibold text-slate-700">
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input id="register-name" autoComplete="name" name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Ishita Singh"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input type="email" id="register-email" autoComplete="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="register-password" className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input type={showPassword ? "text" : "password"} id="register-password" autoComplete="new-password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 characters"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-12 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}
                    className="absolute right-1 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone
                  </label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Company
                  </label>

                  <input
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder={
                      form.role === "contractor"
                        ? "Company name"
                        : "Optional"
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600"
              >
                Sign in
              </Link>
            </p>

            <Link
              to="/"
              className="mt-5 block text-center text-sm text-slate-400 hover:text-slate-700"
            >
              ÃƒÂ¢Ã¢â‚¬ Ã‚Â Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;




