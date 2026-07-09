import React, { useState } from 'react';
import {
  Sparkles, Briefcase, Compass, Users, Award, TrendingUp, Menu, X,
  CheckCircle2, ArrowRight, ChevronRight, Laptop, Wifi,
  Square, FileText, Download, ExternalLink,
} from 'lucide-react';

/* ---------------------------------------------------------------
   TOKENS — monochrome, hairline-border, mono-label system
--------------------------------------------------------------- */
const C = {
  ink: '#111111',
  inkSoft: '#3A3A3A',
  paper: '#FFFFFF',
  offwhite: '#FAFAFA',
  line: '#E4E4E7',
  muted: '#7A7A7A',
  mutedLight: '#AFAFAF',
  highlight: '#F5F1E8',
  danger: '#C1443A',
};

const F = {
  display: "'Space Grotesk', system-ui, sans-serif",
  body: "'Inter', system-ui, sans-serif",
  mono: "'IBM Plex Mono', 'Courier New', monospace",
};

/* ---------------------------------------------------------------
   GLOBAL STYLES (animations + small helpers; fonts load via index.css)
--------------------------------------------------------------- */
function GlobalStyles() {
  return (
    <style>{`
      @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes drawPath { from { stroke-dashoffset: 1400; } to { stroke-dashoffset: 0; } }
      .reveal { animation: fadeUp 0.6s ease both; }
      .reveal-delay-1 { animation-delay: 0.06s; }
      .reveal-delay-2 { animation-delay: 0.12s; }
      .reveal-delay-3 { animation-delay: 0.18s; }
      .journey-path { animation: drawPath 1.6s ease forwards; }
      .dot-grid {
        background-image: radial-gradient(${C.mutedLight} 1px, transparent 1px);
        background-size: 14px 14px;
      }
      .hover-fill:hover { background: ${C.ink} !important; color: ${C.paper} !important; }
      .hover-fill:hover svg { color: ${C.paper} !important; stroke: ${C.paper} !important; }
      input, select, textarea, button { font-family: ${F.body}; }
      input:focus-visible, select:focus-visible, textarea:focus-visible, button:focus-visible, a:focus-visible {
        outline: 2px solid ${C.ink}; outline-offset: 2px;
      }
      @media (prefers-reduced-motion: reduce) {
        .reveal, .journey-path { animation: none !important; opacity: 1 !important; }
      }
    `}</style>
  );
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ---------------------------------------------------------------
   HEADER
--------------------------------------------------------------- */
function Header({ onApply }) {
  const [open, setOpen] = useState(false);
  const links = [['about', 'about'], ['journey', 'journey'], ['curriculum', 'curriculum'], ['why join', 'why'], ['eligibility', 'eligibility']];
  return (
    <header style={{ background: C.paper, borderBottom: `1px solid ${C.line}` }} className="sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <button onClick={() => scrollToId('top')} className="flex items-center gap-2.5" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <div className="w-6 h-6 flex items-center justify-center" style={{ border: `1.5px solid ${C.ink}` }}>
            <Square size={11} color={C.ink} strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: F.mono, color: C.ink, fontSize: 15, letterSpacing: '-0.01em' }}>PWD Internship x AgencyCRM</span>
        </button>

        <nav className="hidden md:flex items-center gap-7">
          {links.map(([label, id]) => (
            <button key={id} onClick={() => scrollToId(id)} style={{ background: 'none', border: 'none', color: C.muted, fontSize: 13, fontFamily: F.mono, cursor: 'pointer' }}>
              {label}
            </button>
          ))}
          <button
            onClick={onApply}
            className="hover-fill"
            style={{ background: 'none', color: C.ink, fontWeight: 500, fontSize: 13, fontFamily: F.mono, padding: '8px 16px', border: `1px solid ${C.ink}`, cursor: 'pointer', transition: 'all 0.15s' }}
          >
            apply now
          </button>
        </nav>

        <button className="md:hidden" style={{ background: 'none', border: 'none', color: C.ink }} onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-5 pb-5 flex flex-col gap-4" style={{ borderTop: `1px solid ${C.line}` }}>
          {links.map(([label, id]) => (
            <button key={id} onClick={() => { scrollToId(id); setOpen(false); }} className="text-left" style={{ background: 'none', border: 'none', color: C.muted, fontSize: 14, fontFamily: F.mono, paddingTop: 10 }}>
              {label}
            </button>
          ))}
          <button onClick={() => { onApply(); setOpen(false); }} style={{ background: C.ink, color: C.paper, fontWeight: 500, padding: '10px 16px', border: 'none', fontFamily: F.mono, fontSize: 13 }}>
            apply now
          </button>
        </div>
      )}
    </header>
  );
}

/* ---------------------------------------------------------------
   HERO
--------------------------------------------------------------- */
function NestedSquares() {
  return (
    <div className="hidden lg:flex items-center justify-center" style={{ border: `1px solid ${C.line}`, padding: 28, background: C.paper }}>
      <div className="dot-grid relative flex items-center justify-center" style={{ width: 300, height: 300, border: `1px solid ${C.line}` }}>
        <div className="flex items-center justify-center" style={{ width: 170, height: 170, border: `1.5px solid ${C.ink}`, background: C.paper }}>
          <div style={{ width: 70, height: 70, border: `1.5px solid ${C.ink}`, background: C.paper }} />
        </div>
      </div>
    </div>
  );
}

function Hero({ onApply, onLearnMore }) {
  const badges = [
    [Sparkles, 'AI'], [Briefcase, 'Sales'], [TrendingUp, 'Lead'],
    [Laptop, 'Remote'], [Users, 'PWD'], [Wifi, 'Online'],
  ];
  return (
    <section id="top" style={{ background: C.paper }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-20 sm:pt-24 sm:pb-28 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="reveal" style={{ fontFamily: F.mono, color: C.muted, fontSize: 13, letterSpacing: '0.02em' }}>
            / pwd internship x agencycrm
          </p>

          <h1
            className="reveal reveal-delay-1 text-6xl sm:text-8xl mt-4 mb-6"
            style={{ fontFamily: F.display, color: C.ink, fontWeight: 600, lineHeight: 0.98, letterSpacing: '-0.02em' }}
          >
            PWD internship.
          </h1>

          <h1
            className="reveal reveal-delay-1 text-6xl sm:text-7xl mt-3 mb-6"
            style={{ fontFamily: F.display, color: C.ink, fontWeight: 600, lineHeight: 0.98, letterSpacing: '-0.02em' }}
          >
            build your future.
          </h1>

          <p
            className="reveal reveal-delay-2 text-lg mb-8 max-w-md"
            style={{ color: C.inkSoft, fontFamily: F.body, lineHeight: 1.65 }}
          >
            a real AI internship for persons with disabilities. learn real-world AI skills,
            build confidence, work on actual client projects, and prepare for future career
            opportunities — it replaces a training program with a career path.
          </p>

          <div className="reveal reveal-delay-3 flex flex-wrap items-center gap-3">
            <button
              onClick={onApply}
              className="flex items-center gap-3"
              style={{ background: C.ink, border: 'none', padding: '14px 20px', cursor: 'pointer', maxWidth: 300 }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: C.paper }}>
                <Sparkles size={15} color={C.ink} />
              </div>
              <div className="text-left">
                <p style={{ fontFamily: F.mono, color: C.mutedLight, fontSize: 10, letterSpacing: '0.06em' }}>apply to</p>
                <p style={{ fontFamily: F.body, color: C.paper, fontWeight: 700, fontSize: 16 }}>AI Program — free</p>
              </div>
            </button>

            <button
              onClick={onLearnMore}
              className="hover-fill flex items-center gap-2"
              style={{ background: 'none', color: C.ink, fontWeight: 500, fontSize: 14, fontFamily: F.mono, padding: '14px 20px', border: `1px solid ${C.ink}`, cursor: 'pointer', transition: 'all 0.15s' }}
            >
              learn more <ArrowRight size={15} />
            </button>
          </div>

          <p className="reveal reveal-delay-3 mt-4" style={{ fontFamily: F.mono, color: C.muted, fontSize: 12 }}>
            inclusive-first
          </p>

          <div className="reveal reveal-delay-3 flex gap-2 mt-4">
            {badges.map(([Icon, label]) => (
              <div key={label} title={label} className="w-9 h-9 flex items-center justify-center" style={{ border: `1px solid ${C.line}` }}>
                <Icon size={15} color={C.inkSoft} />
              </div>
            ))}
          </div>
        </div>

        <NestedSquares />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid sm:grid-cols-3" style={{ borderTop: `1px solid ${C.line}` }}>
        {[
          ['01', 'AI Developer', 'build with AI tools, ship real projects'],
          ['02', 'Sales Professional', 'sell what you build, close real clients'],
          ['03', 'Leadership', 'lead and mentor the next cohort'],
        ].map(([n, t, d], i) => (
          <div key={n} className="p-6" style={{ borderRight: i < 2 ? `1px solid ${C.line}` : 'none' }}>
            <p style={{ fontFamily: F.mono, color: C.mutedLight, fontSize: 12 }} className="mb-2">{n}</p>
            <p style={{ fontFamily: F.body, color: C.ink, fontWeight: 700, fontSize: 15 }} className="mb-1">{t}</p>
            <p style={{ fontFamily: F.body, color: C.muted, fontSize: 13 }}>{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   ABOUT
--------------------------------------------------------------- */
function About() {
  return (
    <section id="about" style={{ background: C.offwhite, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }} className="py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <p style={{ fontFamily: F.mono, color: C.muted, fontSize: 13 }} className="mb-4">/ mission</p>
        <h2 style={{ fontFamily: F.display, color: C.ink, fontWeight: 600, letterSpacing: '-0.01em' }} className="text-3xl sm:text-5xl max-w-2xl mb-6">
          everyone deserves the chance to build valuable skills.
        </h2>
        <p style={{ color: C.inkSoft, fontFamily: F.body, lineHeight: 1.75 }} className="text-base sm:text-lg max-w-2xl mb-5">
          AgencyCRM believes everyone deserves an opportunity to build valuable skills —
          regardless of disability. Ability, not disability, is what defines what someone
          can build, sell, and lead.
        </p>
        <p style={{ color: C.inkSoft, fontFamily: F.body, lineHeight: 1.75 }} className="text-base sm:text-lg max-w-2xl">
          Our mission is to empower Persons with Disabilities through AI, technology, sales,
          leadership, and real-world experience — grounded in real work, not simulations. The
          long-term goal is to become one of the leading employers of PWDs, by giving people
          the tools, the practice, and the track record they need to build a genuine career.
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   JOURNEY
--------------------------------------------------------------- */
const PHASES = [
  { n: '01', title: 'AI Developer', sub: 'build', skills: ['AI Tools', 'Website Creation', 'Logo Design', 'Web Apps', 'Mobile Apps', 'GitHub', 'Deploying Projects', 'Automation', 'Real-World Projects'] },
  { n: '02', title: 'Sales Professional', sub: 'sell', skills: ['Resume Building', 'LinkedIn Optimization', 'Prospecting', 'Lead Generation', 'Cold Calling', 'Sales Process', 'Client Communication', 'Proposal Writing'] },
  { n: '03', title: 'Leadership', sub: 'lead', skills: ['Recruiting', 'Team Building', 'Coaching', 'Mentoring', 'Project Management', 'Leadership'] },
];

function JourneyPath() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <section id="journey" style={{ background: C.paper }} className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <p style={{ fontFamily: F.mono, color: C.muted, fontSize: 13 }} className="mb-4">/ the learning journey</p>
        <h2 style={{ fontFamily: F.display, color: C.ink, fontWeight: 600, letterSpacing: '-0.01em' }} className="text-3xl sm:text-5xl mb-6 max-w-xl">
          build. sell. lead.
        </h2>
        <p style={{ color: C.inkSoft, fontFamily: F.body, lineHeight: 1.7 }} className="text-base max-w-2xl mb-14">
          It's not three unrelated tracks — it's one path. Interns start by building real
          skills as an AI Developer, then learn to sell what they've built as a Sales
          Professional, then move into Leadership to recruit, coach, and mentor the next
          cohort coming up behind them.
        </p>

        <svg viewBox="0 0 1200 140" className="w-full h-auto mb-8 hidden sm:block" aria-hidden="true">
          <path d="M 60 110 C 260 110, 260 30, 460 30 S 660 110, 860 110 S 1060 30, 1140 30" fill="none" stroke={C.line} strokeWidth="1.5" />
          <path className="journey-path" d="M 60 110 C 260 110, 260 30, 460 30 S 660 110, 860 110 S 1060 30, 1140 30" fill="none" stroke={C.ink} strokeWidth="1.5" strokeDasharray="1400" />
          {[[60, 110], [460, 30], [860, 110]].map(([x, y], i) => (
            <g key={i}><circle cx={x} cy={y} r="5" fill={C.paper} stroke={C.ink} strokeWidth="1.5" /></g>
          ))}
        </svg>

        <div className="grid sm:grid-cols-3" style={{ border: `1px solid ${C.line}` }}>
          {PHASES.map((p, i) => (
            <button
              key={p.n}
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="p-6 text-left"
              style={{
                background: 'none', cursor: 'pointer',
                borderRight: i < 2 ? `1px solid ${C.line}` : 'none',
                borderLeft: 'none', borderTop: 'none', borderBottom: 'none',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span style={{ fontFamily: F.mono, color: C.muted, fontSize: 12 }}>{p.n} · {p.sub}</span>
                <ChevronRight size={15} color={C.mutedLight} style={{ transform: openIdx === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
              </div>
              <h3 style={{ fontFamily: F.display, color: C.ink, fontWeight: 600 }} className="text-xl mb-3">{p.title}</h3>
              {openIdx === i ? (
                <ul className="flex flex-wrap gap-2 mt-3">
                  {p.skills.map((s) => (
                    <li key={s} style={{ fontFamily: F.mono, fontSize: 11, color: C.inkSoft, border: `1px solid ${C.line}`, padding: '4px 9px' }}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ color: C.muted, fontSize: 13, fontFamily: F.body }}>tap to see what you'll learn →</p>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   CURRICULUM
--------------------------------------------------------------- */
const CURRICULUM_URL = '/agencycrm-internship-curriculum.pdf';

const CURRICULUM_FACTS = [
  ['10 weeks', '≈ 2.5 months'],
  ['mon / wed / fri', '2 hours per session'],
  ['30 sessions', '60 hours total'],
  ['paced for access', 'no rushed timelines'],
];

const CURRICULUM_PHASES = [
  {
    n: '01', weeks: 'weeks 1–6', title: 'AI Developer Foundation',
    text: "Every intern builds the same foundation: AI mindset & tools, easy content wins (social post, email, SMS), design & advertising (flyer, logo, ad), GitHub & deployment, a live website, and a working web app plus a mobile app or game prototype.",
    outcome: 'a live, deployed personal portfolio',
  },
  {
    n: '02', weeks: 'weeks 7–10', title: 'Sales & Monetization',
    text: 'Interns shift from builder to seller: professional profile setup, prospecting and lead enrichment, cold calling, auditing a prospect, building relationship and access, then assembling a proposal, closing, and handing off delivery.',
    outcome: 'the full client pipeline, proposal to signed deal',
  },
  {
    n: '03', weeks: 'post-program', title: 'Leader Track (optional)',
    text: 'Offered to top graduates who show strength in both building and selling. An ongoing loop: hire the next person, train and mentor them through this same curriculum, build a team, and repeat it.',
    outcome: 'a self-sustaining loop under your leadership',
  },
];

function Curriculum() {
  return (
    <section id="curriculum" style={{ background: C.offwhite, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }} className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <p style={{ fontFamily: F.mono, color: C.muted, fontSize: 13 }} className="mb-4">/ curriculum</p>
        <h2 style={{ fontFamily: F.display, color: C.ink, fontWeight: 600, letterSpacing: '-0.01em' }} className="text-3xl sm:text-5xl mb-6 max-w-xl">
          the full 10-week curriculum.
        </h2>
        <p style={{ color: C.inkSoft, fontFamily: F.body, lineHeight: 1.7 }} className="text-base max-w-2xl mb-10">
          Every session, deliverable, and instructor is mapped out in the full program guide. Here's
          the shape of it — read the summary below, or open the full document for the week-by-week detail.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 mb-10" style={{ border: `1px solid ${C.line}` }}>
          {CURRICULUM_FACTS.map(([top, bottom], i) => (
            <div
              key={top} className="p-5"
              style={{ background: C.paper, borderRight: i < 3 ? `1px solid ${C.line}` : 'none', borderBottom: i < 2 ? `1px solid ${C.line}` : 'none' }}
            >
              <p style={{ fontFamily: F.display, color: C.ink, fontWeight: 600 }} className="text-lg mb-1">{top}</p>
              <p style={{ color: C.muted, fontFamily: F.mono, fontSize: 11 }}>{bottom}</p>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 mb-8" style={{ border: `1px solid ${C.line}` }}>
          {CURRICULUM_PHASES.map((p, i) => (
            <div key={p.n} className="p-6" style={{ background: C.paper, borderRight: i < 2 ? `1px solid ${C.line}` : 'none' }}>
              <span style={{ fontFamily: F.mono, color: C.muted, fontSize: 12 }}>{p.n} · {p.weeks}</span>
              <h3 style={{ fontFamily: F.display, color: C.ink, fontWeight: 600 }} className="text-lg mt-3 mb-3">{p.title}</h3>
              <p style={{ color: C.muted, fontFamily: F.body, lineHeight: 1.6 }} className="text-sm mb-3">{p.text}</p>
              <p style={{ color: C.ink, fontFamily: F.mono, fontSize: 11 }}>→ {p.outcome}</p>
            </div>
          ))}
        </div>

        <p style={{ color: C.muted, fontFamily: F.body, lineHeight: 1.6 }} className="text-sm max-w-2xl mb-8">
          Built with a Week 1 accommodations conversation, no-crunch pacing, and multiple ways to show
          mastery — live demo, voice walkthrough, or written summary, whichever works best for you.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={CURRICULUM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover-fill flex items-center gap-2"
            style={{ background: 'none', color: C.ink, fontWeight: 500, fontSize: 14, fontFamily: F.mono, padding: '13px 22px', border: `1px solid ${C.ink}`, cursor: 'pointer', textDecoration: 'none' }}
          >
            <FileText size={15} /> view curriculum
          </a>
          <a
            href={CURRICULUM_URL}
            download="AgencyCRM-Internship-Curriculum.pdf"
            className="flex items-center gap-2"
            style={{ background: C.ink, color: C.paper, fontWeight: 500, fontSize: 14, fontFamily: F.mono, padding: '13px 22px', border: 'none', cursor: 'pointer', textDecoration: 'none' }}
          >
            <Download size={15} /> download PDF
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   WHY JOIN
--------------------------------------------------------------- */
const WHY = [
  { icon: Sparkles, title: 'Learn AI', text: 'Hands-on training with the same AI tools our teams use for real clients.' },
  { icon: Briefcase, title: 'Build a Portfolio', text: 'Ship real projects you can show, not sample exercises that never leave a folder.' },
  { icon: Compass, title: 'Gain Real Experience', text: 'Work inside live client accounts alongside experienced practitioners.' },
  { icon: Users, title: 'Work with Agency Owners', text: 'Direct access to the people running the business, not just a training team.' },
  { icon: TrendingUp, title: 'Develop Leadership Skills', text: 'Progress from doing the work to coaching and leading the next cohort.' },
  { icon: Award, title: 'Future Contractor Opportunities', text: 'Strong performers are considered first for paid contractor roles.' },
];

function WhyJoin() {
  return (
    <section id="why" style={{ background: C.offwhite, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }} className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <p style={{ fontFamily: F.mono, color: C.muted, fontSize: 13 }} className="mb-4">/ why join</p>
        <h2 style={{ fontFamily: F.display, color: C.ink, fontWeight: 600, letterSpacing: '-0.01em' }} className="text-3xl sm:text-5xl mb-12 max-w-xl">
          what you walk away with.
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ border: `1px solid ${C.line}` }}>
          {WHY.map((w, i) => (
            <div
              key={w.title} className="p-6"
              style={{
                background: C.paper,
                borderRight: (i % 3 !== 2) ? `1px solid ${C.line}` : 'none',
                borderBottom: i < 3 ? `1px solid ${C.line}` : 'none',
              }}
            >
              <w.icon size={18} color={C.ink} className="mb-4" />
              <h3 style={{ fontFamily: F.display, color: C.ink, fontWeight: 600 }} className="text-lg mb-2">{w.title}</h3>
              <p style={{ color: C.muted, fontFamily: F.body, lineHeight: 1.6 }} className="text-sm">{w.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   WHO CAN APPLY
--------------------------------------------------------------- */
const ELIGIBILITY = [
  [CheckCircle2, 'Person with Disability (PWD)'],
  [CheckCircle2, 'Willing to learn'],
  [Laptop, 'Access to a computer or laptop'],
  [Wifi, 'Stable internet connection'],
  [CheckCircle2, 'A positive attitude'],
];

function WhoCanApply({ onApply }) {
  return (
    <section id="eligibility" style={{ background: C.paper }} className="py-20 sm:py-28">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <p style={{ fontFamily: F.mono, color: C.muted, fontSize: 13 }} className="mb-4">/ who can apply</p>
        <h2 style={{ fontFamily: F.display, color: C.ink, fontWeight: 600, letterSpacing: '-0.01em' }} className="text-3xl sm:text-5xl mb-10">
          five things. that's the list.
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 text-left max-w-xl mx-auto mb-10">
          {ELIGIBILITY.map(([Icon, label]) => (
            <div key={label} className="flex items-center gap-3 p-4" style={{ border: `1px solid ${C.line}` }}>
              <Icon size={17} color={C.ink} />
              <span style={{ color: C.inkSoft, fontFamily: F.body, fontSize: 14 }}>{label}</span>
            </div>
          ))}
        </div>
        <button onClick={onApply} className="hover-fill" style={{ background: 'none', color: C.ink, fontWeight: 500, fontSize: 14, fontFamily: F.mono, padding: '13px 26px', border: `1px solid ${C.ink}`, cursor: 'pointer', transition: 'all 0.15s' }}>
          start your application →
        </button>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   APPLICATION FORM — links out to a Google Form (backed by a Google Sheet)
--------------------------------------------------------------- */
const GOOGLE_FORM_ID = '1FAIpQLSf9b9rIb-_tVQppk2JjuatSdsoRCa9L-FgFLf2ctaY95Ov-uw';
const GOOGLE_FORM_URL = `https://docs.google.com/forms/d/e/${GOOGLE_FORM_ID}/viewform`;
const GOOGLE_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1pjrglXZZQkDcZEWlCr0IsqonTxux2OCpLMAX-yWKMKo/edit';

function ApplyEmbed() {
  return (
    <section id="apply" style={{ background: C.offwhite, borderTop: `1px solid ${C.line}` }} className="py-20 sm:py-28">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
        <p style={{ fontFamily: F.mono, color: C.muted, fontSize: 13 }} className="mb-4">/ application</p>
        <h2 style={{ fontFamily: F.display, color: C.ink, fontWeight: 600, letterSpacing: '-0.01em' }} className="text-3xl sm:text-5xl mb-6">
          tell us about you.
        </h2>
        <p style={{ color: C.inkSoft, fontFamily: F.body, lineHeight: 1.7 }} className="text-base max-w-lg mx-auto mb-10">
          The application takes about 10 minutes. It opens in a new tab so nothing here
          gets lost — come back to this page any time.
        </p>
        <a
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3"
          style={{ background: C.ink, color: C.paper, fontWeight: 700, fontSize: 16, fontFamily: F.body, padding: '16px 28px', border: `1px solid ${C.ink}`, textDecoration: 'none' }}
        >
          start your application <ArrowRight size={17} />
        </a>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   FOOTER
--------------------------------------------------------------- */
function Footer() {
  return (
    <footer style={{ background: C.paper, borderTop: `1px solid ${C.line}` }} className="py-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span style={{ color: C.muted, fontFamily: F.mono, fontSize: 12 }}>
          © {new Date().getFullYear()} pwd internship x agencycrm
        </span>
        <a
          href={GOOGLE_SHEET_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5"
          style={{ color: C.muted, fontSize: 12, fontFamily: F.mono, textDecoration: 'none' }}
        >
          <ExternalLink size={12} /> view applicants
        </a>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------
   ROOT APP
--------------------------------------------------------------- */
export default function App() {
  const goApply = () => scrollToId('apply');
  const goLearnMore = () => scrollToId('about');

  return (
    <div style={{ fontFamily: F.body }}>
      <GlobalStyles />
      <Header onApply={goApply} />
      <Hero onApply={goApply} onLearnMore={goLearnMore} />
      <About />
      <JourneyPath />
      <Curriculum />
      <WhyJoin />
      <WhoCanApply onApply={goApply} />
      <ApplyEmbed />
      <Footer />
    </div>
  );
}
