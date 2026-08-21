// ============================================================
// Smart Campus ERP — Landing Page
// ============================================================
import Link from "next/link";

const features = [
  {
    icon: "🎓",
    title: "Student Management",
    desc: "Complete student lifecycle — admissions, records, grades, and alumni tracking in one platform.",
  },
  {
    icon: "🛡️",
    title: "Campus Safety",
    desc: "AI-powered incident detection, real-time alerts, and integrated emergency response workflows.",
  },
  {
    icon: "📋",
    title: "Smart Attendance",
    desc: "Facial recognition, QR codes, and geofencing for accurate, tamper-proof attendance tracking.",
  },
  {
    icon: "📊",
    title: "Analytics & Insights",
    desc: "Real-time dashboards with predictive analytics for enrollment, performance, and operations.",
  },
  {
    icon: "💬",
    title: "Communication Hub",
    desc: "Announcements, direct messaging, and notification systems connecting students, parents, and faculty.",
  },
  {
    icon: "📅",
    title: "Timetable & Scheduling",
    desc: "AI-optimized class scheduling, room allocation, and exam timetabling with conflict detection.",
  },
];

const roles = [
  { icon: "🎓", name: "Students", desc: "Access grades, schedules, attendance, and campus services" },
  { icon: "👨‍👩‍👧", name: "Parents", desc: "Monitor progress, communicate with faculty, and manage payments" },
  { icon: "👨‍🏫", name: "Faculty", desc: "Manage classes, grades, research, and student interactions" },
  { icon: "🏛️", name: "Administration", desc: "Oversee operations, finances, compliance, and strategic planning" },
  { icon: "🔒", name: "Security", desc: "Monitor safety, respond to incidents, and manage access control" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── Navbar ─── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🏫</span>
            <span className="text-xl font-bold gradient-text">Smart Campus</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#roles" className="hover:text-blue-600 transition-colors">For Everyone</a>
            <a href="#security" className="hover:text-blue-600 transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              AI-Powered Campus Management
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
              The Future of{" "}
              <span className="gradient-text">Campus Management</span>{" "}
              is Here
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl">
              A unified, intelligent ERP platform that brings together student management,
              campus safety, attendance, scheduling, and communication — all powered by AI
              for smarter, safer campuses.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30"
              >
                Start Free Trial
                <span className="ml-2">→</span>
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Explore Features
              </a>
            </div>
            <div className="mt-12 flex flex-wrap gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span> SOC 2 Compliant
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 99.9% Uptime
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 500+ Institutions
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✓</span> 24/7 Support
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything Your Campus Needs
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              A comprehensive suite of tools designed to streamline every aspect of campus operations.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-2xl group-hover:bg-blue-100 transition-colors">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Roles ─── */}
      <section id="roles" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Built for Every Role
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Tailored experiences for every stakeholder in your campus community.
            </p>
          </div>
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {roles.map((r) => (
              <div
                key={r.name}
                className="flex items-start gap-4 p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
              >
                <span className="text-3xl shrink-0">{r.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{r.name}</h3>
                  <p className="mt-1 text-sm text-gray-600">{r.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Security / Trust ─── */}
      <section id="security" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Enterprise-Grade Security
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Your campus data is protected by industry-leading security practices,
              end-to-end encryption, and full regulatory compliance.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-3 text-center">
            {[
              { icon: "🔐", title: "End-to-End Encryption", desc: "All data encrypted in transit and at rest with AES-256" },
              { icon: "🛡️", title: "AI Threat Detection", desc: "Real-time monitoring with automated incident response" },
              { icon: "📜", title: "Full Compliance", desc: "FERPA, COPPA, GDPR, and SOC 2 Type II certified" },
            ].map((s) => (
              <div key={s.title} className="p-6">
                <span className="text-4xl">{s.icon}</span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Transform Your Campus?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Join 500+ institutions already using Smart Campus ERP to create safer, smarter learning environments.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-xl"
            >
              Get Started Free
            </Link>
            <a
              href="#"
              className="inline-flex items-center justify-center px-8 py-4 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors"
            >
              Request Demo
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏫</span>
              <span className="text-white font-semibold">Smart Campus ERP</span>
            </div>
            <p className="text-sm">
              © {new Date().getFullYear()} Smart Campus ERP. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
