import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  BriefcaseBusiness,
  Clock3,
} from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <FileText size={21} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                GovTender
              </h1>
              <p className="text-xs text-slate-500">
                Tender & Bid Marketplace
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              How It Works
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Features
            </a>

            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>

          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white md:hidden"
          >
            Start
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-2 lg:py-28">

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-300">
              <Sparkles size={16} />
              Specialized RFP & Bid Writing Marketplace
            </div>

            <h2 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Find the right
              <span className="text-blue-400"> bid writer </span>
              for your next tender.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              GovTender connects defense, civil, and municipal contractors
              with qualified technical proposal and RFP writers.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-blue-900/30 hover:bg-blue-500"
              >
                Find a Bid Writer
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-white/5 px-6 py-3.5 font-semibold text-white hover:bg-white/10"
              >
                Join as a Writer
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-blue-400" />
                Verified professionals
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-blue-400" />
                Smart matching
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-blue-400" />
                Secure workflow
              </div>
            </div>
          </div>

          {/* Hero Card */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 shadow-2xl backdrop-blur">
              <div className="rounded-2xl bg-white p-6">

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Recommended Writer
                    </p>
                    <h3 className="mt-1 text-xl font-bold">
                      Technical RFP Specialist
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <Users size={22} />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                    TR
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      Proposal Consultant
                    </p>
                    <p className="text-sm text-slate-500">
                      7+ years experience
                    </p>
                  </div>

                  <div className="ml-auto rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                    92% Match
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <p className="text-xs text-slate-500">Industry</p>
                    <p className="mt-1 text-sm font-semibold">Civil</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <p className="text-xs text-slate-500">Projects</p>
                    <p className="mt-1 text-sm font-semibold">84+</p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-3 text-center">
                    <p className="text-xs text-slate-500">Rating</p>
                    <p className="mt-1 text-sm font-semibold">4.9/5</p>
                  </div>
                </div>

                <Link
                  to="/register"
                  className="mt-6 block w-full rounded-xl bg-blue-600 py-3 text-center font-semibold text-white hover:bg-blue-700"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 md:grid-cols-4">
          <div className="p-7 text-center">
            <p className="text-3xl font-bold text-slate-900">500+</p>
            <p className="mt-1 text-sm text-slate-500">Bid Writers</p>
          </div>

          <div className="p-7 text-center">
            <p className="text-3xl font-bold text-slate-900">1,200+</p>
            <p className="mt-1 text-sm text-slate-500">Tender Projects</p>
          </div>

          <div className="p-7 text-center">
            <p className="text-3xl font-bold text-slate-900">92%</p>
            <p className="mt-1 text-sm text-slate-500">Successful Matches</p>
          </div>

          <div className="p-7 text-center">
            <p className="text-3xl font-bold text-slate-900">4.8/5</p>
            <p className="mt-1 text-sm text-slate-500">Average Rating</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              How It Works
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              One platform for the complete tender workflow
            </h2>

            <p className="mt-4 text-slate-600">
              From posting an opportunity to selecting the right writer,
              manage your complete bid response workflow in one place.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <FileText size={23} />
              </div>

              <h3 className="mt-6 text-xl font-bold">
                1. Post Your Tender
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Create a structured tender or RFP with requirements,
                skills, deadline and budget.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <Search size={23} />
              </div>

              <h3 className="mt-6 text-xl font-bold">
                2. Find the Right Writer
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Discover bid writers based on skills, experience,
                industry and availability.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <BriefcaseBusiness size={23} />
              </div>

              <h3 className="mt-6 text-xl font-bold">
                3. Manage Projects
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                Review applications, select writers and track your
                tender response workflow.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">

          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                Built For Professionals
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Specialized matching for technical proposal work
              </h2>

              <p className="mt-5 leading-8 text-slate-600">
                Find professionals who understand government procurement,
                technical documentation and competitive RFP responses.
              </p>

              <div className="mt-8 space-y-5">

                <div className="flex gap-4">
                  <ShieldCheck className="mt-1 text-blue-600" />
                  <div>
                    <h3 className="font-bold">
                      Professional profiles
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Skills, experience, industries and portfolio information.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Sparkles className="mt-1 text-blue-600" />
                  <div>
                    <h3 className="font-bold">
                      Smart writer matching
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Match opportunities with relevant writer expertise.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Clock3 className="mt-1 text-blue-600" />
                  <div>
                    <h3 className="font-bold">
                      Application workflow
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      Apply, review, shortlist and manage project status.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="rounded-3xl bg-slate-950 p-7 shadow-xl">

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">
                    Example Recommendation
                  </p>
                  <h3 className="mt-1 text-xl font-bold text-white">
                    Recommended Bid Writers
                  </h3>
                </div>

                <Sparkles className="text-blue-400" />
              </div>

              <div className="space-y-4">

                {[
                  ["Technical RFP Specialist", "Civil · RFP · Compliance", "92%"],
                  ["Government Proposal Writer", "Municipal · Proposal", "87%"],
                  ["Bid Response Consultant", "RFP · Documentation", "81%"],
                ].map(([name, skills, match]) => (
                  <div
                    key={name}
                    className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
                  >
                    <div className="flex items-center gap-4">

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
                        {name
                          .split(" ")
                          .map((word) => word[0])
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-white">
                          {name}
                        </h4>
                        <p className="mt-1 text-sm text-slate-400">
                          {skills}
                        </p>
                      </div>

                      <div className="rounded-full bg-green-500/10 px-3 py-1 text-sm font-bold text-green-400">
                        {match}
                      </div>

                    </div>
                  </div>
                ))}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to improve your next tender response?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-blue-100">
            Join GovTender and connect with professionals specialized
            in technical proposal and bid writing.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-600 shadow-lg hover:bg-slate-100"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="font-bold text-white">
              GovTender
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Government Tender & Bid Writers Marketplace
            </p>
          </div>

          <p className="text-sm text-slate-500">
            © 2026 GovTender. All rights reserved.
          </p>

        </div>
      </footer>

    </div>
  );
};

export default Home;