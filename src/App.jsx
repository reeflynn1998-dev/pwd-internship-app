import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Sparkles, Briefcase, Compass, Users, Award, TrendingUp, Menu, X,
  CheckCircle2, ArrowRight, ChevronRight, ChevronLeft, Laptop, Wifi,
  Lock, MapPin, Upload, LayoutDashboard, RefreshCw, Trash2, Square, LogOut,
  FileText, Download,
} from 'lucide-react';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { supabase } from './lib/supabaseClient';
import { submitApplication, fetchApplications, deleteAllApplications, updateApplicationStatus } from './lib/api';

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

const LEARNING_PATHS = ['AI Developer', 'Sales', 'Leadership'];

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
   APPLICATION FORM
--------------------------------------------------------------- */
const STEP_LABELS = ['Personal', 'PWD Info', 'Technical', 'Experience', 'Path', 'Finish'];

const EMPTY_FORM = {
  fullName: '', email: '', phone: '', city: '', country: 'Philippines',
  pwdType: '', hasPwdId: '',
  hasComputer: '', internetSpeed: '', deviceType: '',
  occupation: '', skills: '', portfolio: '', resumeName: '',
  learningPath: '',
  whyJoin: '', careerGoals: '', hearAboutUs: '', agreePrivacy: false,
};

function Field({ label, required, children, hint }) {
  return (
    <label className="block mb-5">
      <span style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: '0.03em', color: C.muted }} className="block mb-1.5">
        {label}{required && <span style={{ color: C.danger }}> *</span>}
      </span>
      {children}
      {hint && <span style={{ color: C.muted, fontSize: 12, fontFamily: F.body }} className="block mt-1">{hint}</span>}
    </label>
  );
}

const inputStyle = {
  width: '100%', padding: '11px 12px',
  border: `1px solid ${C.line}`, fontFamily: F.body, fontSize: 14,
  color: C.ink, background: C.paper,
};

// Map camelCase form state to the snake_case columns used in Postgres
function toRecord(form) {
  return {
    full_name: form.fullName,
    email: form.email,
    phone: form.phone,
    city: form.city,
    country: form.country,
    pwd_type: form.pwdType || null,
    has_pwd_id: form.hasPwdId || null,
    has_computer: form.hasComputer || null,
    internet_speed: form.internetSpeed || null,
    device_type: form.deviceType || null,
    occupation: form.occupation || null,
    skills: form.skills || null,
    portfolio: form.portfolio || null,
    resume_name: form.resumeName || null,
    learning_path: form.learningPath,
    why_join: form.whyJoin,
    career_goals: form.careerGoals,
    hear_about_us: form.hearAboutUs || null,
    agree_privacy: form.agreePrivacy,
  };
}

function ApplicationForm({ onSubmitted }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (k) => (e) => {
    const v = e && e.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e;
    setForm((f) => ({ ...f, [k]: v }));
  };

  const validateStep = () => {
    setError('');
    if (step === 0) {
      if (!form.fullName || !form.email || !form.phone || !form.city || !form.country) { setError('Please fill in all required fields.'); return false; }
      if (!/^\S+@\S+\.\S+$/.test(form.email)) { setError('Please enter a valid email address.'); return false; }
    }
    if (step === 2 && !form.hasComputer) { setError('Please tell us whether you own a computer.'); return false; }
    if (step === 4 && !form.learningPath) { setError('Please choose a learning journey to continue.'); return false; }
    return true;
  };

  const next = () => { if (validateStep()) setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1)); };
  const back = () => { setError(''); setStep((s) => Math.max(s - 1, 0)); };

  const submit = async () => {
    setError('');
    if (!form.whyJoin || !form.careerGoals) { setError('Please answer both questions below.'); return; }
    if (!form.agreePrivacy) { setError('Please agree to the Privacy Policy to submit.'); return; }
    setSubmitting(true);
    try {
      await submitApplication(toRecord(form));
      onSubmitted();
    } catch (e) {
      setError(e.message || 'Something went wrong saving your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const progressPct = (step / (STEP_LABELS.length - 1)) * 100;

  return (
    <section id="apply" style={{ background: C.offwhite, borderTop: `1px solid ${C.line}` }} className="py-20 sm:py-28">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <p style={{ fontFamily: F.mono, color: C.muted, fontSize: 13 }} className="mb-4">/ application</p>
        <h2 style={{ fontFamily: F.display, color: C.ink, fontWeight: 600, letterSpacing: '-0.01em' }} className="text-3xl sm:text-5xl mb-8">
          tell us about you.
        </h2>

        <div className="mb-10">
          <div className="relative h-[2px] mb-3" style={{ background: C.line }}>
            <div className="absolute top-0 left-0 h-[2px] transition-all" style={{ width: `${progressPct}%`, background: C.ink }} />
          </div>
          <div className="flex justify-between">
            {STEP_LABELS.map((l, i) => (
              <span key={l} style={{ fontFamily: F.mono, fontSize: 10, color: i <= step ? C.ink : C.mutedLight, fontWeight: i === step ? 700 : 400 }}>
                {String(i + 1).padStart(2, '0')}
              </span>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8" style={{ background: C.paper, border: `1px solid ${C.line}` }}>
          {step === 0 && (
            <div>
              <Field label="Full Name" required><input style={inputStyle} value={form.fullName} onChange={set('fullName')} /></Field>
              <Field label="Email" required><input type="email" style={inputStyle} value={form.email} onChange={set('email')} /></Field>
              <Field label="Phone" required><input type="tel" style={inputStyle} value={form.phone} onChange={set('phone')} /></Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="City / Province" required><input style={inputStyle} value={form.city} onChange={set('city')} /></Field>
                <Field label="Country" required><input style={inputStyle} value={form.country} onChange={set('country')} /></Field>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <Field label="PWD Type" hint="Optional">
                <select style={inputStyle} value={form.pwdType} onChange={set('pwdType')}>
                  <option value="">Select one</option>
                  <option>Physical</option><option>Visual</option><option>Hearing</option>
                  <option>Speech</option><option>Intellectual</option><option>Psychosocial</option>
                  <option>Multiple</option><option>Prefer not to say</option>
                </select>
              </Field>
              <Field label="Do you have a PWD ID?" hint="Optional">
                <div className="flex gap-4 mt-1">
                  {['Yes', 'No'].map((v) => (
                    <label key={v} className="flex items-center gap-2 text-sm" style={{ fontFamily: F.body, color: C.ink }}>
                      <input type="radio" name="hasPwdId" checked={form.hasPwdId === v} onChange={() => set('hasPwdId')(v)} /> {v}
                    </label>
                  ))}
                </div>
              </Field>
            </div>
          )}

          {step === 2 && (
            <div>
              <Field label="Do you own a computer?" required>
                <div className="flex gap-4 mt-1">
                  {['Yes', 'No'].map((v) => (
                    <label key={v} className="flex items-center gap-2 text-sm" style={{ fontFamily: F.body, color: C.ink }}>
                      <input type="radio" name="hasComputer" checked={form.hasComputer === v} onChange={() => set('hasComputer')(v)} /> {v}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Internet Speed">
                <select style={inputStyle} value={form.internetSpeed} onChange={set('internetSpeed')}>
                  <option value="">Select one</option>
                  <option>Slow (under 5 Mbps)</option><option>Moderate (5–20 Mbps)</option>
                  <option>Fast (over 20 Mbps)</option><option>Not sure</option>
                </select>
              </Field>
              <Field label="Device Type">
                <select style={inputStyle} value={form.deviceType} onChange={set('deviceType')}>
                  <option value="">Select one</option>
                  <option>Desktop</option><option>Laptop</option><option>Tablet</option><option>Smartphone only</option>
                </select>
              </Field>
            </div>
          )}

          {step === 3 && (
            <div>
              <Field label="Current Occupation"><input style={inputStyle} value={form.occupation} onChange={set('occupation')} /></Field>
              <Field label="Skills" hint="A short comma-separated list is fine">
                <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.skills} onChange={set('skills')} />
              </Field>
              <Field label="Portfolio" hint="Link to a site, Behance, GitHub — optional">
                <input style={inputStyle} value={form.portfolio} onChange={set('portfolio')} placeholder="https://" />
              </Field>
              <Field label="Resume" hint="Optional — we'll follow up by email for the full file">
                <div className="flex items-center gap-2" style={{ ...inputStyle, display: 'flex', color: C.muted, position: 'relative' }}>
                  <Upload size={15} />
                  {form.resumeName || 'Choose a file'}
                  <input
                    type="file"
                    onChange={(e) => set('resumeName')(e.target.files[0] ? e.target.files[0].name : '')}
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                  />
                </div>
              </Field>
            </div>
          )}

          {step === 4 && (
            <div>
              <span style={{ fontFamily: F.mono, fontSize: 11, letterSpacing: '0.03em', color: C.muted }} className="block mb-3">
                Choose your learning journey <span style={{ color: C.danger }}>*</span>
              </span>
              <div className="grid gap-3">
                {LEARNING_PATHS.map((p) => (
                  <label key={p} className="flex items-center gap-3 p-4 cursor-pointer" style={{ border: `1px solid ${form.learningPath === p ? C.ink : C.line}`, background: form.learningPath === p ? C.highlight : C.paper }}>
                    <input type="radio" name="learningPath" checked={form.learningPath === p} onChange={() => set('learningPath')(p)} />
                    <span style={{ fontFamily: F.body, color: C.ink, fontWeight: 600, fontSize: 14 }}>{p}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <Field label="Why do you want to join?" required>
                <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.whyJoin} onChange={set('whyJoin')} />
              </Field>
              <Field label="What are your career goals?" required>
                <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }} value={form.careerGoals} onChange={set('careerGoals')} />
              </Field>
              <Field label="How did you hear about us?">
                <select style={inputStyle} value={form.hearAboutUs} onChange={set('hearAboutUs')}>
                  <option value="">Select one</option>
                  <option>Facebook</option><option>LinkedIn</option><option>Referral</option>
                  <option>AgencyCRM website</option><option>Other</option>
                </select>
              </Field>
              <label className="flex items-start gap-2 mt-2 text-sm" style={{ fontFamily: F.body, color: C.ink }}>
                <input type="checkbox" checked={form.agreePrivacy} onChange={set('agreePrivacy')} className="mt-1" />
                I agree to the Privacy Policy. <span style={{ color: C.danger }}>*</span>
              </label>
            </div>
          )}

          {error && <p style={{ color: C.danger, fontSize: 13, fontFamily: F.body }} className="mt-4">{error}</p>}

          <div className="flex justify-between mt-8">
            <button onClick={back} disabled={step === 0} className="flex items-center gap-1" style={{ background: 'none', border: 'none', color: step === 0 ? C.mutedLight : C.muted, fontWeight: 500, fontSize: 13, fontFamily: F.mono, cursor: step === 0 ? 'default' : 'pointer' }}>
              <ChevronLeft size={15} /> back
            </button>
            {step < STEP_LABELS.length - 1 ? (
              <button onClick={next} className="flex items-center gap-2" style={{ background: C.ink, color: C.paper, fontWeight: 500, fontSize: 13, fontFamily: F.mono, padding: '11px 22px', border: 'none', cursor: 'pointer' }}>
                next <ChevronRight size={15} />
              </button>
            ) : (
              <button onClick={submit} disabled={submitting} className="flex items-center gap-2" style={{ background: C.ink, color: C.paper, fontWeight: 500, fontSize: 13, fontFamily: F.mono, padding: '11px 22px', border: 'none', cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>
                {submitting ? 'submitting…' : 'submit application'}
              </button>
            )}
          </div>
        </div>

        <p style={{ color: C.muted, fontFamily: F.body, fontSize: 12 }} className="text-center mt-6">
          Your application is saved to a real database — the admin dashboard updates from the same
          source in real time.
        </p>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------
   SUCCESS VIEW
--------------------------------------------------------------- */
function SuccessView({ onHome }) {
  return (
    <div style={{ background: C.paper, minHeight: '100vh' }} className="flex items-center justify-center px-5">
      <div className="text-center max-w-md reveal">
        <div className="w-14 h-14 flex items-center justify-center mx-auto mb-6" style={{ border: `1.5px solid ${C.ink}` }}>
          <CheckCircle2 size={26} color={C.ink} />
        </div>
        <h1 style={{ fontFamily: F.display, color: C.ink, fontWeight: 600, letterSpacing: '-0.01em' }} className="text-3xl mb-3">
          thank you for applying!
        </h1>
        <p style={{ color: C.inkSoft, fontFamily: F.body, lineHeight: 1.6 }} className="mb-8">
          We've successfully received your application. Our team will review your submission and
          reach out to shortlisted applicants.
        </p>
        <button onClick={onHome} style={{ background: C.ink, color: C.paper, fontWeight: 500, fontFamily: F.mono, fontSize: 13, padding: '12px 24px', border: 'none', cursor: 'pointer' }}>
          back to homepage
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   FOOTER
--------------------------------------------------------------- */
function Footer({ onAdmin }) {
  return (
    <footer style={{ background: C.paper, borderTop: `1px solid ${C.line}` }} className="py-10">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span style={{ color: C.muted, fontFamily: F.mono, fontSize: 12 }}>
          © {new Date().getFullYear()} pwd internship x agencycrm
        </span>
        <button onClick={onAdmin} className="flex items-center gap-1.5" style={{ background: 'none', border: 'none', color: C.muted, fontSize: 12, fontFamily: F.mono, cursor: 'pointer' }}>
          <Lock size={12} /> admin
        </button>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------
   ADMIN — real Supabase Auth login
--------------------------------------------------------------- */
function AdminGate({ onSuccess, onBack }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setErr('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    setLoading(false);
    if (error) setErr(error.message);
    else onSuccess();
  };

  return (
    <div style={{ background: C.paper, minHeight: '100vh' }} className="flex items-center justify-center px-5">
      <div className="p-8 w-full max-w-sm" style={{ border: `1px solid ${C.line}` }}>
        <Lock size={18} color={C.ink} className="mb-4" />
        <h1 style={{ fontFamily: F.display, color: C.ink, fontWeight: 600 }} className="text-2xl mb-2">admin login</h1>
        <p style={{ color: C.muted, fontSize: 13, fontFamily: F.body }} className="mb-5">
          Sign in with the admin account you created in your Supabase project.
        </p>
        <div className="mb-3">
          <input type="email" style={inputStyle} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin email" />
        </div>
        <input
          type="password" style={inputStyle} value={pass} onChange={(e) => setPass(e.target.value)}
          placeholder="password"
          onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
        />
        {err && <p style={{ color: C.danger, fontSize: 13 }} className="mt-3">{err}</p>}
        <div className="flex gap-3 mt-5">
          <button onClick={handleLogin} disabled={loading} style={{ background: C.ink, color: C.paper, fontWeight: 500, fontSize: 13, fontFamily: F.mono, padding: '10px 18px', border: 'none', cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
            {loading ? 'signing in…' : 'sign in'}
          </button>
          <button onClick={onBack} style={{ background: 'none', color: C.muted, fontSize: 13, fontFamily: F.mono, border: 'none', cursor: 'pointer' }}>
            back to site
          </button>
        </div>
      </div>
    </div>
  );
}

const PIE_COLORS = [C.ink, C.muted, C.mutedLight, C.line];

// Applicant pipeline: new -> accepted -> active -> graduate -> hired, with rejected as a side branch.
const STATUS_FLOW = ['new', 'accepted', 'active', 'graduate', 'hired'];
const STATUS_LABEL = { new: 'new', accepted: 'accepted', active: 'active intern', graduate: 'graduate', hired: 'hired', rejected: 'rejected' };
const STATUS_NEXT_LABEL = { new: 'accept', accepted: 'activate', active: 'mark graduate', graduate: 'mark hired' };

function StatCard({ label, value, sub }) {
  return (
    <div className="p-5" style={{ border: `1px solid ${C.line}` }}>
      <p style={{ fontFamily: F.mono, color: C.muted, fontSize: 11 }} className="mb-2">{label}</p>
      <p style={{ fontFamily: F.display, color: C.ink, fontWeight: 600 }} className="text-3xl">{value}</p>
      {sub && <p style={{ color: C.mutedLight, fontSize: 12, fontFamily: F.body }} className="mt-1">{sub}</p>}
    </div>
  );
}

function StatusBadge({ status }) {
  const s = status || 'new';
  return (
    <span
      style={{
        fontFamily: F.mono, fontSize: 10, letterSpacing: '0.02em',
        color: s === 'rejected' ? C.danger : C.ink,
        border: `1px solid ${s === 'rejected' ? C.danger : C.line}`,
        padding: '3px 8px', whiteSpace: 'nowrap',
      }}
    >
      {STATUS_LABEL[s] || s}
    </span>
  );
}

function ApplicantRow({ a, onChangeStatus, busy }) {
  const s = a.status || 'new';
  const nextIdx = STATUS_FLOW.indexOf(s);
  const next = nextIdx >= 0 && nextIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[nextIdx + 1] : null;
  return (
    <div className="flex items-center justify-between gap-3 py-3 flex-wrap" style={{ borderBottom: `1px solid ${C.line}` }}>
      <div className="min-w-0">
        <p style={{ color: C.ink, fontSize: 13, fontFamily: F.body, fontWeight: 600 }} className="truncate">{a.full_name || 'Unnamed'}</p>
        <p style={{ color: C.muted, fontSize: 11, fontFamily: F.mono }}>
          {a.learning_path || '—'} · {[a.city, a.country].filter(Boolean).join(', ') || 'Unknown'} · {new Date(a.submitted_at).toLocaleDateString()}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <StatusBadge status={s} />
        {next && (
          <button
            disabled={busy}
            onClick={() => onChangeStatus(a.id, next)}
            className="hover-fill"
            style={{ background: 'none', border: `1px solid ${C.ink}`, color: C.ink, fontFamily: F.mono, fontSize: 11, padding: '5px 10px', cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.5 : 1 }}
          >
            {STATUS_NEXT_LABEL[s]} →
          </button>
        )}
        {s !== 'rejected' ? (
          <button
            disabled={busy}
            onClick={() => onChangeStatus(a.id, 'rejected')}
            style={{ background: 'none', border: 'none', color: C.muted, fontFamily: F.mono, fontSize: 11, cursor: busy ? 'default' : 'pointer' }}
          >
            reject
          </button>
        ) : (
          <button
            disabled={busy}
            onClick={() => onChangeStatus(a.id, 'new')}
            style={{ background: 'none', border: 'none', color: C.muted, fontFamily: F.mono, fontSize: 11, cursor: busy ? 'default' : 'pointer' }}
          >
            reinstate
          </button>
        )}
      </div>
    </div>
  );
}

function AdminDashboard({ onBack }) {
  const [apps, setApps] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [statusError, setStatusError] = useState('');

  const refresh = useCallback(async () => {
    setRefreshing(true);
    setLoadError('');
    try {
      const data = await fetchApplications();
      setApps(data);
    } catch (e) {
      setLoadError(e.message || 'Could not load applications.');
      setApps([]);
    } finally {
      setRefreshing(false);
    }
  }, []);
  useEffect(() => { refresh(); }, [refresh]);

  const stats = useMemo(() => {
    if (!apps) return null;
    const now = new Date();
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startWeek = new Date(startToday); startWeek.setDate(startWeek.getDate() - 7);
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const count = (fromDate) => apps.filter((a) => new Date(a.submitted_at) >= fromDate).length;
    const byPath = LEARNING_PATHS.map((p) => ({ name: p, value: apps.filter((a) => a.learning_path === p).length }));
    const pwdCounts = {};
    apps.forEach((a) => { const k = a.pwd_type || 'Not specified'; pwdCounts[k] = (pwdCounts[k] || 0) + 1; });
    const byPwd = Object.entries(pwdCounts).map(([name, value]) => ({ name, value }));
    const locCounts = {};
    apps.forEach((a) => { const k = [a.city, a.country].filter(Boolean).join(', ') || 'Unknown'; locCounts[k] = (locCounts[k] || 0) + 1; });
    const byLocation = Object.entries(locCounts).sort((a, b) => b[1] - a[1]).slice(0, 6);
    const statusCount = (s) => apps.filter((a) => (a.status || 'new') === s).length;
    return {
      total: apps.length, today: count(startToday), week: count(startWeek), month: count(startMonth),
      accepted: statusCount('accepted'), active: statusCount('active'), graduates: statusCount('graduate'), hired: statusCount('hired'),
      byPath, byPwd, byLocation,
      all: [...apps].sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at)),
    };
  }, [apps]);

  const clearAll = async () => {
    if (!window.confirm('Delete ALL applications from the database? This cannot be undone.')) return;
    try {
      await deleteAllApplications();
      refresh();
    } catch (e) {
      setLoadError(e.message || 'Could not delete applications.');
    }
  };

  const changeStatus = async (id, status) => {
    setUpdatingId(id);
    setStatusError('');
    const prevApps = apps;
    setApps((cur) => cur.map((a) => (a.id === id ? { ...a, status } : a)));
    try {
      await updateApplicationStatus(id, status);
    } catch (e) {
      setApps(prevApps);
      const msg = e.message || '';
      setStatusError(
        /status/i.test(msg)
          ? "Could not update status — make sure you've re-run supabase/schema.sql to add the status column."
          : (msg || 'Could not update status.')
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    onBack();
  };

  return (
    <div style={{ background: C.paper, minHeight: '100vh' }} className="pb-16">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-10">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <LayoutDashboard size={18} color={C.ink} />
            <h1 style={{ fontFamily: F.display, color: C.ink, fontWeight: 600 }} className="text-2xl">applicant dashboard</h1>
          </div>
          <div className="flex gap-3">
            <button onClick={refresh} className="flex items-center gap-1.5" style={{ background: 'none', border: `1px solid ${C.line}`, color: C.muted, fontSize: 12, fontFamily: F.mono, padding: '8px 14px', cursor: 'pointer' }}>
              <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} /> refresh
            </button>
            <button onClick={clearAll} className="flex items-center gap-1.5" style={{ background: 'none', border: `1px solid ${C.line}`, color: C.danger, fontSize: 12, fontFamily: F.mono, padding: '8px 14px', cursor: 'pointer' }}>
              <Trash2 size={13} /> delete all
            </button>
            <button onClick={signOut} className="flex items-center gap-1.5" style={{ background: 'none', border: 'none', color: C.muted, fontSize: 12, fontFamily: F.mono, cursor: 'pointer' }}>
              <LogOut size={13} /> sign out
            </button>
          </div>
        </div>

        {loadError && <p style={{ color: C.danger, fontSize: 13, fontFamily: F.body }} className="mb-6">{loadError}</p>}

        {!stats ? (
          <p style={{ color: C.muted, fontFamily: F.body }}>Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <StatCard label="TOTAL APPLICANTS" value={stats.total} />
              <StatCard label="TODAY" value={stats.today} />
              <StatCard label="THIS WEEK" value={stats.week} />
              <StatCard label="THIS MONTH" value={stats.month} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              <StatCard label="ACCEPTED" value={stats.accepted} />
              <StatCard label="ACTIVE INTERNS" value={stats.active} />
              <StatCard label="GRADUATES" value={stats.graduates} />
              <StatCard label="HIRED CONTRACTORS" value={stats.hired} />
            </div>

            <div className="grid lg:grid-cols-2 gap-5 mb-6">
              <div className="p-6" style={{ border: `1px solid ${C.line}` }}>
                <p style={{ fontFamily: F.mono, color: C.muted, fontSize: 11 }} className="mb-4">by learning journey</p>
                {stats.total === 0 ? <EmptyNote /> : (
                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                      <BarChart data={stats.byPath}>
                        <CartesianGrid stroke={C.line} vertical={false} />
                        <XAxis dataKey="name" tick={{ fill: C.muted, fontSize: 12, fontFamily: F.mono }} axisLine={{ stroke: C.line }} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fill: C.muted, fontSize: 12 }} axisLine={{ stroke: C.line }} tickLine={false} />
                        <Tooltip contentStyle={{ background: C.paper, border: `1px solid ${C.line}`, color: C.ink }} />
                        <Bar dataKey="value" fill={C.ink} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
              <div className="p-6" style={{ border: `1px solid ${C.line}` }}>
                <p style={{ fontFamily: F.mono, color: C.muted, fontSize: 11 }} className="mb-4">by pwd type</p>
                {stats.total === 0 ? <EmptyNote /> : (
                  <div style={{ width: '100%', height: 220 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={stats.byPwd} dataKey="value" nameKey="name" outerRadius={80}>
                          {stats.byPwd.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: C.paper, border: `1px solid ${C.line}`, color: C.ink }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 mb-6" style={{ border: `1px solid ${C.line}` }}>
              <p style={{ fontFamily: F.mono, color: C.muted, fontSize: 11 }} className="mb-4">by location</p>
              {stats.byLocation.length === 0 ? <EmptyNote /> : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {stats.byLocation.map(([loc, n]) => (
                    <div key={loc} className="flex items-center justify-between">
                      <span className="flex items-center gap-2" style={{ color: C.ink, fontSize: 13, fontFamily: F.body }}>
                        <MapPin size={13} color={C.muted} /> {loc}
                      </span>
                      <span style={{ fontFamily: F.mono, color: C.ink, fontSize: 13 }}>{n}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6" style={{ border: `1px solid ${C.line}` }}>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <p style={{ fontFamily: F.mono, color: C.muted, fontSize: 11 }}>
                  applicants ({stats.total}) — click an action to move someone through the pipeline
                </p>
                {statusError && <p style={{ color: C.danger, fontSize: 11, fontFamily: F.body }}>{statusError}</p>}
              </div>
              {stats.all.length === 0 ? <EmptyNote /> : (
                <div className="flex flex-col">
                  {stats.all.map((a) => (
                    <ApplicantRow key={a.id} a={a} onChangeStatus={changeStatus} busy={updatingId === a.id} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EmptyNote() {
  return <p style={{ color: C.muted, fontFamily: F.body, fontSize: 13 }}>No applicants yet — submit the form to see this populate.</p>;
}

/* ---------------------------------------------------------------
   ROOT APP
--------------------------------------------------------------- */
export default function App() {
  const [view, setView] = useState('landing');
  const goApply = () => scrollToId('apply');
  const goLearnMore = () => scrollToId('about');

  // If an admin session already exists (e.g. signed in earlier), skip straight to the
  // dashboard instead of showing the login form again.
  const goAdmin = async () => {
    const { data } = await supabase.auth.getSession();
    setView(data.session ? 'admin' : 'admin-gate');
  };

  if (view === 'success') return (<><GlobalStyles /><SuccessView onHome={() => setView('landing')} /></>);
  if (view === 'admin-gate') return (<><GlobalStyles /><AdminGate onSuccess={() => setView('admin')} onBack={() => setView('landing')} /></>);
  if (view === 'admin') return (<><GlobalStyles /><AdminDashboard onBack={() => setView('landing')} /></>);

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
      <ApplicationForm onSubmitted={() => { setView('success'); window.scrollTo(0, 0); }} />
      <Footer onAdmin={goAdmin} />
    </div>
  );
}
