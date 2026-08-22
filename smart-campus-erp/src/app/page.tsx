// ============================================================
// Smart Campus ERP — Editorial Landing Page (Canva Inspired)
//
// Aesthetic:
//   - Warm editorial typography (Serif Display + Clean Sans)
//   - Color Palette: Moody Dark Charcoal, Pale Oat/Cream (#f4f6d6), Warm Ochre (#bf783e)
//   - Distinct block sections with full-bleed contrast
//   - Pill buttons and storytelling narrative structure
// ============================================================
import Link from "next/link";
import {
  CampusBuildingIcon,
  SecurityIcon,
  StudentsIcon,
  AttendanceIcon,
  DashboardIcon,
  SparklesIcon,
  CheckIcon,
} from "@/components/ui/Icons";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-slate-100 selection:bg-[#bf783e] selection:text-white">
      {/* ─── Top Minimalist Navigation ─── */}
      <nav className="sticky top-0 z-50 bg-[#0e0e0e]/90 backdrop-blur-md border-b border-white/10 transition-all">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
              <CampusBuildingIcon className="w-5 h-5" />
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#f4f6d6]">
              Smart Campus <span className="text-[#bf783e] italic">ERP</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white/80">
            <a href="#story" className="hover:text-[#f4f6d6] transition-colors">
              Our Story
            </a>
            <a href="#services" className="hover:text-[#f4f6d6] transition-colors">
              What We Do
            </a>
            <a href="#impact" className="hover:text-[#f4f6d6] transition-colors">
              Impact
            </a>
            <a href="#portals" className="hover:text-[#f4f6d6] transition-colors">
              Role Portals
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="btn-canva-pill text-xs sm:text-sm"
            >
              <span>Sign In</span>
              <span className="font-sans">→</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Slide 1: Hero Section (Moody Dark Cinema + Editorial Serif) ─── */}
      <section className="relative min-h-[85vh] flex flex-col justify-center px-6 sm:px-10 lg:px-16 py-20 bg-[#0e0e0e] overflow-hidden">
        {/* Ambient Film Tone Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#bf783e_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Soft Sepia Ambient Glow */}
        <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-[#bf783e]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-[#f4f6d6]/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto w-full z-10">
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-[#f4f6d6] text-xs uppercase tracking-widest font-semibold mb-8 backdrop-blur-xs">
            <SparklesIcon className="w-3.5 h-3.5 text-[#bf783e]" />
            <span>Next-Gen Institutional Operating System</span>
          </div>

          {/* Hero Serif Title (matching "Hi, I'm Alex Bennett.") */}
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal text-[#f4f6d6] tracking-tight leading-[1.08] max-w-4xl">
            Hi, <br />
            We&apos;re <span className="italic font-normal text-[#bf783e]">Smart Campus</span>.
          </h1>

          {/* Subtitle (matching "Crafting clever copy that works harder than your morning coffee.") */}
          <p className="mt-8 text-lg sm:text-2xl text-white/75 font-light max-w-2xl leading-relaxed">
            Crafting intelligent operations, student lifecycle systems, and campus safety that
            work harder than your morning coffee.
          </p>

          {/* Hero Action Buttons */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
            <a
              href="#services"
              className="btn-canva-pill text-sm px-8 py-3.5 shadow-md"
            >
              Explore our services
            </a>
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-full border border-white/25 text-[#f4f6d6] hover:bg-white/10 transition-all font-semibold text-sm"
            >
              Access Role Portal →
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Slide 2: "Our Story" Section (Warm Pale Cream #f4f6d6) ─── */}
      <section id="story" className="py-24 sm:py-32 px-6 sm:px-10 lg:px-16 bg-[#f4f6d6] text-[#0e0e0e]">
        <div className="max-w-6xl mx-auto">
          {/* Section Indicator Pill */}
          <div className="mb-12">
            <a
              href="#services"
              className="inline-flex items-center px-6 py-2 rounded-full bg-[#0e0e0e] text-[#f4f6d6] text-xs font-bold uppercase tracking-wider hover:bg-black transition-all"
            >
              Explore our services
            </a>
          </div>

          {/* 2-Column Split: Huge Serif Title on Left, Narrative on Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <h2 className="font-serif text-5xl sm:text-7xl font-normal text-[#0e0e0e] tracking-tight">
                Our story
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-lg sm:text-2xl text-[#1a1a1a] font-normal leading-relaxed">
                After a decade spent untangling fragmented software, paper registers, and delayed
                incident responses across universities big and small, we turned our obsession with
                crisp clarity and proactive safety into a unified campus platform.
              </p>
              <p className="mt-6 text-base sm:text-lg text-[#333333] font-light leading-relaxed">
                Today, we help educational institutions operate smarter, safeguard students with
                instant threat dispatching, and deliver memorable academic experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Slide 3: Editorial Pull-Quote & Visual ─── */}
      <section className="py-20 sm:py-28 px-6 sm:px-10 lg:px-16 bg-[#f4f6d6] text-[#0e0e0e] border-t border-[#e2e4c0]">
        <div className="max-w-5xl mx-auto text-center">
          {/* Italic Serif Pull-Quote */}
          <blockquote className="font-serif text-3xl sm:text-5xl lg:text-6xl italic font-normal text-[#0e0e0e] leading-snug tracking-tight">
            &ldquo;Lead with purpose, automate with precision, deliver with care.&rdquo;
          </blockquote>

          {/* Atmospheric Editorial Visual Banner */}
          <div className="mt-14 relative rounded-3xl overflow-hidden shadow-2xl bg-[#0e0e0e] aspect-[21/9] flex items-center justify-center p-8 sm:p-12 border border-[#0e0e0e]/10">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0e0e0e]/95 via-[#0e0e0e]/80 to-[#bf783e]/30 z-10" />
            <div className="relative z-20 text-left max-w-2xl mr-auto">
              <span className="text-xs uppercase tracking-widest text-[#bf783e] font-bold">
                Institutional Excellence
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-[#f4f6d6] font-normal mt-2 leading-tight">
                Designed for faculty, students, parents, and security officers to thrive in harmony.
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Slide 4: "What We Can Do For You" (Deep Black High Contrast) ─── */}
      <section id="services" className="py-24 sm:py-32 px-6 sm:px-10 lg:px-16 bg-[#0e0e0e] text-[#f4f6d6]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Title */}
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <h2 className="font-serif text-5xl sm:text-7xl font-normal text-[#f4f6d6] tracking-tight leading-[1.1]">
                What we <br />
                do for you
              </h2>
              <p className="mt-6 text-white/60 text-sm sm:text-base font-light max-w-sm">
                A modern suite of modules engineered to eliminate administrative gridlock and
                protect your university community.
              </p>
              <div className="mt-8">
                <Link href="/login" className="btn-canva-pill text-xs">
                  Access Platform →
                </Link>
              </div>
            </div>

            {/* Right Stacked Service Items */}
            <div className="lg:col-span-7 space-y-12 divide-y divide-white/10">
              <div className="pt-2 first:pt-0">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  AI-Powered Campus Safety & Threat Dispatch
                </h3>
                <p className="mt-2.5 text-white/70 text-sm sm:text-base leading-relaxed font-light">
                  Real-time confidential incident reporting, automated triage, and sub-second
                  emergency dispatching to active campus security units.
                </p>
              </div>

              <div className="pt-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Student Lifecycle & Academic Intelligence
                </h3>
                <p className="mt-2.5 text-white/70 text-sm sm:text-base leading-relaxed font-light">
                  Admissions, gradebooks, digital transcripts, GPA analysis, and alumni career
                  tracking consolidated into an authoritative real-time database.
                </p>
              </div>

              <div className="pt-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Automated Attendance & Threshold Alerts
                </h3>
                <p className="mt-2.5 text-white/70 text-sm sm:text-base leading-relaxed font-light">
                  Geofenced lecture verification, quick faculty registers, and automated alerts for
                  at-risk attendance patterns to prevent dropouts.
                </p>
              </div>

              <div className="pt-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Predictive Analytics & Institutional Governance
                </h3>
                <p className="mt-2.5 text-white/70 text-sm sm:text-base leading-relaxed font-light">
                  Real-time executive dashboards with AI-assisted trend modeling for enrollment,
                  tuition collections, and campus resource allocation.
                </p>
              </div>

              <div className="pt-10">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Unified Multi-Role Communication Hub
                </h3>
                <p className="mt-2.5 text-white/70 text-sm sm:text-base leading-relaxed font-light">
                  Emergency broadcasts, parent updates, faculty messaging, and direct announcements
                  connecting all stakeholders without noise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Role Workspaces Showcase ─── */}
      <section id="portals" className="py-24 px-6 sm:px-10 lg:px-16 bg-[#161616] text-[#f4f6d6] border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-[#bf783e] font-bold">
              Tailored Experiences
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl font-normal text-[#f4f6d6] mt-2">
              Dedicated Role Portals
            </h2>
            <p className="text-white/60 text-sm sm:text-base mt-3 font-light">
              Permission-guarded dashboards customized for each member of your institution.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { role: "Students", desc: "View lecture schedules, track attendance, check grades, and report incidents.", badge: "Student Portal" },
              { role: "Parents", desc: "Monitor academic progress, verify attendance, and receive emergency alerts.", badge: "Parent Portal" },
              { role: "Faculty", desc: "Mark class registers, manage student rosters, and message parents directly.", badge: "Faculty Workspace" },
              { role: "Administration", desc: "Query data with Campus AI, audit operations, and manage compliance.", badge: "Command Center" },
              { role: "Security Officers", desc: "Live incident response queue, priority triage, and incident resolution.", badge: "Security Hub" },
              { role: "Finance & Bursar", desc: "Automated tuition invoicing, fee reconciliation, and ledger tracking.", badge: "Finance Portal" },
            ].map((item) => (
              <div
                key={item.role}
                className="p-8 rounded-3xl bg-[#0e0e0e] border border-white/10 hover:border-[#bf783e]/50 transition-all group"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#bf783e] block mb-3">
                  {item.badge}
                </span>
                <h3 className="font-serif text-2xl font-normal text-white group-hover:text-[#f4f6d6] transition-colors">
                  {item.role}
                </h3>
                <p className="mt-2.5 text-white/65 text-xs sm:text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Slide 5: "A Few Things I'm Proud Of" (Warm Ochre / Terracotta #bf783e) ─── */}
      <section id="impact" className="py-24 sm:py-32 px-6 sm:px-10 lg:px-16 bg-[#bf783e] text-[#0e0e0e]">
        <div className="max-w-5xl mx-auto text-center">
          {/* Centered Pill Button matching Slide 5 "Get in touch" */}
          <div className="mb-10">
            <Link
              href="/login"
              className="inline-flex items-center px-8 py-3.5 rounded-full bg-[#f4f6d6] text-[#0e0e0e] font-bold text-sm shadow-lg hover:bg-white transition-all hover:scale-105"
            >
              Sign In to Your Account
            </Link>
          </div>

          {/* Heading matching "A few things I'm proud of" */}
          <h2 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-[#0e0e0e] tracking-tight">
            A few things we&apos;re proud of
          </h2>

          {/* Subheading matching "Proof that the pen really is mightier than the algorithm." */}
          <p className="mt-6 text-base sm:text-xl text-[#0e0e0e]/85 font-light max-w-2xl mx-auto leading-relaxed">
            Proof that thoughtful engineering really is mightier than stacks of legacy paperwork.
          </p>

          {/* Metric Showcase Cards */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
            {[
              { value: "500+", label: "Institutions Worldwide", sub: "Colleges & Universities" },
              { value: "2M+", label: "Active Students", sub: "Managed daily" },
              { value: "99.99%", label: "System Reliability", sub: "FERPA & GDPR Compliant" },
              { value: "< 60s", label: "Incident Dispatch", sub: "Emergency response speed" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-6 rounded-3xl bg-[#0e0e0e] text-[#f4f6d6] shadow-xl border border-black/10"
              >
                <div className="font-serif text-3xl sm:text-4xl font-normal text-[#f4f6d6]">
                  {stat.value}
                </div>
                <div className="font-bold text-xs sm:text-sm text-white mt-2">
                  {stat.label}
                </div>
                <div className="text-[11px] text-white/50 mt-0.5">
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final Minimalist Footer ─── */}
      <footer className="py-14 px-6 sm:px-10 lg:px-16 bg-[#0e0e0e] text-white/50 text-xs border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-[#f4f6d6]">
            <div className="w-7 h-7 rounded-full bg-[#f4f6d6] text-[#0e0e0e] flex items-center justify-center font-bold text-xs">
              🏫
            </div>
            <span className="font-serif text-base font-bold text-[#f4f6d6]">
              Smart Campus <span className="text-[#bf783e] italic">ERP</span>
            </span>
          </div>

          <p>© {new Date().getFullYear()} Smart Campus ERP Inc. All rights reserved.</p>

          <div className="flex gap-6 text-white/70">
            <Link href="/login" className="hover:text-[#f4f6d6] transition-colors">
              Portal Sign In
            </Link>
            <a href="#story" className="hover:text-[#f4f6d6] transition-colors">
              Our Story
            </a>
            <a href="#services" className="hover:text-[#f4f6d6] transition-colors">
              Modules
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
