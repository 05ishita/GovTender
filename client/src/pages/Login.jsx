import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Login = () => {
  useEffect(() => {
    document.title = "Sign in | GovTender";
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
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

    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const loggedInUser = await login(form.email, form.password);

      const from = location.state?.from;

      if (from) {
        navigate(from, { replace: true });
        return;
      }

      if (loggedInUser.role === "writer") {
        navigate("/writer-dashboard", { replace: true });
      } else if (loggedInUser.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="mx-auto grid min-h-[85vh] max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 font-bold">
                GT
              </div>
              <span className="text-xl font-bold">GovTender</span>
            </div>

            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Government Tender Marketplace
            </p>

            <h1 className="max-w-md text-4xl font-bold leading-tight">
              Connect your tender with the right bid writing professional.
            </h1>

            <p className="mt-6 max-w-md text-slate-300">
              Manage opportunities, discover specialized writers and
              streamline your RFP response workflow from one workspace.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="font-semibold text-white">Tender opportunities</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">Organize bid opportunities in one place.</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="font-semibold text-white">Writer discovery</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">Explore writers by skills and expertise.</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/5 p-4">
              <p className="font-semibold text-white">RFP workflow</p>
              <p className="mt-1 text-xs leading-5 text-slate-300">Manage applications and bid responses.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-sm font-semibold text-blue-600">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                Sign in to GovTender
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Access your tender marketplace workspace.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="login-email" className="mb-2 block text-sm font-semibold text-slate-700">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input type="email" id="login-email" autoComplete="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input type={showPassword ? "text" : "password"} id="login-password" autoComplete="current-password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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

              <div className="mb-4 text-right"><Link to="/forgot-password" className="text-sm font-semibold text-blue-700 underline-offset-4 hover:underline">Forgot password?</Link></div>
              <button type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <ArrowRight size={18} />}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create one
              </Link>
            </p>

            <Link
              to="/"
              className="mt-5 block text-center text-sm text-slate-400 hover:text-slate-700"
            >
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

