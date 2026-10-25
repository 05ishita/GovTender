import { Link } from "react-router-dom";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { useEffect } from "react";

export default function ForgotPassword() {
  useEffect(() => {
    document.title = "Reset your password | GovTender";
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <LockKeyhole size={24} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset your password</h1>
        <p className="mt-3 text-sm leading-6 text-slate-700">
          Password recovery is not configured yet. No recovery email has been sent.
          Please contact your workspace administrator for help accessing your account.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-flex min-h-10 items-center gap-2 rounded-lg font-semibold text-blue-700 hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to sign in
        </Link>
      </section>
    </main>
  );
}
