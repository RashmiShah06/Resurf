import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiCompass,
  FiSearch,
  FiFileText,
  FiVideo,
  FiZap,
  FiMessageCircle,
  FiBookOpen,
  FiCheck,
} from "react-icons/fi";


const INK = "#1C2E3A";
const INK_SOFT = "#4B5B66";
const MUTED = "#8A97A0";
const PAPER = "#F4F5F3";
const LINE = "#E2E6E4";
const CHIP = "#E4EEF3";
const CHIP_INK = "#3C7492";
const NAVY = "#1C3144";
const NAVY_DARK = "#142430";
const AMBER = "#C08A3E";
const FRAUNCES = "Fraunces";

function FontImport() {
  return (
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap');`}</style>
  );
}

function WaveDivider({ flip = false, fill = "#FFFFFF" }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      className={`w-full h-16 md:h-20 ${flip ? "rotate-180" : ""}`}
      preserveAspectRatio="none"
    >
      <path
        d="M0,32 C 240,80 480,0 720,24 C 960,48 1200,88 1440,40 L1440,90 L0,90 Z"
        fill={fill}
      />
    </svg>
  );
}

function Landing() {
  return (
    <div className="min-h-screen" style={{ background: PAPER, fontFamily: "Inter, sans-serif" }}>
      <FontImport />
      {/* Navbar*/}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-md border-b" style={{ background: `${PAPER}CC`, borderColor: LINE }}>
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="text-3xl font-semibold tracking-tight" style={{ fontFamily: FRAUNCES, color: INK }}>
            Resurf
          </div>

          <div className="hidden md:flex items-center gap-10 font-medium" style={{ color: INK_SOFT }}>
            <a href="#features" className="hover:opacity-70 transition">Features</a>
            <a href="#how" className="hover:opacity-70 transition">How it Works</a>
            <a href="#contact" className="hover:opacity-70 transition">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login" className="font-medium hover:opacity-70 transition" style={{ color: INK_SOFT }}>
              Login
            </Link>
            <Link
              to="/signup"
              className="text-white text-sm px-4 py-2 rounded-lg transition shadow-md"
              style={{ background: NAVY }}
              onMouseOver={(e) => (e.currentTarget.style.background = NAVY_DARK)}
              onMouseOut={(e) => (e.currentTarget.style.background = NAVY)}
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/*Hero section */}
      <section className="max-w-7xl mx-auto px-8 pt-32 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium"
            style={{ background: CHIP, color: CHIP_INK }}
          >
            <FiCompass className="text-base" /> Built for people who save more than they can find again
          </span>

          <h1
            className="mt-8 text-5xl md:text-7xl leading-tight font-medium"
            style={{ fontFamily: FRAUNCES, color: INK }}
          >
            Never lose a
            <span style={{ color: CHIP_INK }}> valuable resource </span>
            again.
          </h1>

          <p className="mt-8 text-xl max-w-2xl mx-auto leading-9" style={{ color: INK_SOFT }}>
            Save PDFs, YouTube videos, GitHub repositories, articles and notes in one place.
            Rediscover everything instantly with powerful search.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-5">
            <Link
              to="/signup"
              className="text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg transition"
              style={{ background: NAVY }}
              onMouseOver={(e) => (e.currentTarget.style.background = NAVY_DARK)}
              onMouseOut={(e) => (e.currentTarget.style.background = NAVY)}
            >
              Get Started
              <FiArrowRight />
            </Link>
            <a
              href="#how"
              className="px-8 py-4 rounded-2xl hover:bg-white transition border"
              style={{ borderColor: LINE, color: INK_SOFT }}
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/*Preview */}
      <section className="max-w-7xl mx-auto px-8 pb-28">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-[40px]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 20%, rgba(28,49,68,0.18), transparent 55%), radial-gradient(circle at 80% 80%, rgba(60,116,146,0.14), transparent 55%)",
              filter: "blur(40px)",
            }}
          />

          <div className="relative bg-white rounded-3xl shadow-2xl border overflow-hidden" style={{ borderColor: LINE }}>
            <div className="h-14 border-b flex items-center px-6" style={{ background: PAPER, borderColor: LINE }}>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div
                className="ml-8 bg-white border rounded-xl px-4 py-2 w-96 text-sm flex items-center gap-2"
                style={{ borderColor: LINE, color: MUTED }}
              >
                <FiSearch /> Search your knowledge...
              </div>
            </div>

            <div className="grid lg:grid-cols-4 min-h-[550px]">
              {/* Sidebar — mirrors the app's actual nav list exactly */}
              <div className="border-r p-8 flex flex-col justify-between" style={{ background: PAPER, borderColor: LINE }}>
                <div>
                  <h2 className="text-2xl font-medium" style={{ fontFamily: FRAUNCES, color: INK }}>
                    Resurf
                  </h2>

                  <div className="mt-10 space-y-1">
                    <div
                      className="rounded-lg px-4 py-2.5 font-medium text-sm flex items-center gap-3 bg-white"
                      style={{ color: INK, boxShadow: "0 1px 2px rgba(28,46,58,0.06)" }}
                    >
                      Dashboard
                    </div>
                    {["Collections", "Favorites", "Pinned", "Trash"].map((item) => (
                      <div
                        key={item}
                        className="px-4 py-2.5 text-sm cursor-default rounded-lg"
                        style={{ color: INK_SOFT }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className="w-full rounded-lg px-4 py-3 font-semibold text-sm text-white flex items-center justify-center gap-2"
                  style={{ background: NAVY }}
                >
                  <FiCompass /> New
                </button>
              </div>

              {/* Main */}
              <div className="lg:col-span-3 p-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-medium" style={{ fontFamily: FRAUNCES, color: INK }}>Happy Thursday</h2>
                    <p className="mt-2" style={{ color: INK_SOFT }}>Rediscover what matters.</p>
                  </div>
                  <span className="text-xs border rounded-full px-3 py-1" style={{ color: MUTED, borderColor: LINE }}>Example workspace</span>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mt-10">
                  <div className="rounded-2xl p-6 border" style={{ background: "#FFFFFF", borderColor: LINE }}>
                    <p className="text-sm" style={{ color: MUTED }}>Collections</p>
                    <h3 className="text-4xl mt-3 font-medium" style={{ fontFamily: FRAUNCES, color: INK }}>12</h3>
                  </div>
                  <div className="rounded-2xl p-6 border" style={{ background: "#FFFFFF", borderColor: LINE }}>
                    <p className="text-sm" style={{ color: MUTED }}>Topics</p>
                    <h3 className="text-4xl mt-3 font-medium" style={{ fontFamily: FRAUNCES, color: INK }}>38</h3>
                  </div>
                  <div className="rounded-2xl p-6 border" style={{ background: "#FFFFFF", borderColor: LINE }}>
                    <p className="text-sm" style={{ color: MUTED }}>Resources</p>
                    <h3 className="text-4xl mt-3 font-medium" style={{ fontFamily: FRAUNCES, color: INK }}>128</h3>
                  </div>
                </div>

                {/* Search Demo */}
                <div className="mt-12 rounded-2xl p-6" style={{ background: PAPER }}>
                  <p className="text-sm" style={{ color: MUTED }}>Search</p>
                  <h3 className="text-xl mt-2" style={{ color: INK }}>"React hooks pdf"</h3>

                  <div className="mt-6 bg-white rounded-xl p-5 border" style={{ borderColor: LINE }}>
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-semibold flex items-center gap-2" style={{ color: INK }}>
                          <FiFileText style={{ color: CHIP_INK }} /> React Hooks Complete Guide.pdf
                        </h4>
                        <p className="mt-1 text-sm" style={{ color: MUTED }}>Collection · Web Development</p>
                      </div>
                      <span className="font-medium flex items-center gap-1" style={{ color: CHIP_INK }}>
                        Found <FiCheck />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider fill="#FFFFFF" />

      {/*  Why resurf */}
      <section id="features" className="bg-white max-w-7xl mx-auto px-8 py-24 scroll-mt-24">
        <div className="text-center">
          <p className="font-semibold tracking-wide uppercase" style={{ color: CHIP_INK }}>Why Resurf</p>
          <h2 className="mt-4 text-5xl font-medium" style={{ fontFamily: FRAUNCES, color: INK }}>
            Everything you save.
            <br />
            Exactly when you need it.
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg leading-8" style={{ color: INK_SOFT }}>
            Bookmarks pile up. Downloads folders turn into junk drawers. Resurf is the one place things stay findable.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {[
            { icon: FiFileText, title: "Save PDFs", body: "Lecture notes, ebooks, documentation and research papers — all organized in one place." },
            { icon: FiVideo, title: "Never Lose Tutorials", body: "Save YouTube videos, playlists and educational content with meaningful tags." },
            { icon: FiGithub, title: "GitHub Repositories", body: "Keep useful repositories, snippets and developer resources organized forever." },
            { icon: FiZap, title: "Instant Search", body: "Remember only a keyword? Resurf helps you find exactly what you saved." },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-3xl p-8 shadow-lg border hover:-translate-y-2 hover:shadow-2xl transition duration-300"
              style={{ borderColor: LINE }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: CHIP, color: CHIP_INK }}>
                <f.icon />
              </div>
              <h3 className="mt-6 text-xl font-semibold" style={{ color: INK }}>{f.title}</h3>
              <p className="mt-4 leading-7" style={{ color: INK_SOFT }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="pt-32 pb-16 scroll-mt-24" style={{ background: PAPER }}>
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center">
            <p className="uppercase tracking-widest font-semibold" style={{ color: CHIP_INK }}>Experience Resurf</p>
            <h2 className="mt-5 text-5xl font-medium" style={{ fontFamily: FRAUNCES, color: INK }}>
              Search the way you remember.
            </h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg leading-8" style={{ color: INK_SOFT }}>
              You don't need to remember filenames or folders. Just search using whatever you remember.
            </p>
          </div>

          {/* Demo*/}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className="bg-white rounded-[32px] p-8 shadow-xl border" style={{ borderColor: LINE }}>
              <div className="rounded-2xl px-6 py-5 flex items-center gap-4" style={{ background: PAPER }}>
                <FiSearch className="text-2xl" style={{ color: CHIP_INK }} />
                <span className="text-xl" style={{ color: INK_SOFT }}>react hooks pdf</span>
              </div>

              <div className="mt-8 bg-white rounded-2xl p-8 shadow border" style={{ borderColor: LINE }}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm" style={{ color: MUTED }}>PDF</p>
                    <h3 className="text-2xl font-semibold mt-2" style={{ color: INK }}>
                      React Hooks Complete Guide.pdf
                    </h3>
                  </div>
                  <span className="px-4 py-2 rounded-full font-medium flex items-center gap-1" style={{ background: CHIP, color: CHIP_INK }}>
                    Found <FiCheck />
                  </span>
                </div>

                <div className="grid md:grid-cols-3 gap-5 mt-8">
                  <div className="rounded-xl p-5" style={{ background: PAPER }}>
                    <p className="text-sm" style={{ color: MUTED }}>Collection</p>
                    <h4 className="mt-2 font-semibold" style={{ color: INK }}>Web Development</h4>
                  </div>
                  <div className="rounded-xl p-5" style={{ background: PAPER }}>
                    <p className="text-sm" style={{ color: MUTED }}>Saved</p>
                    <h4 className="mt-2 font-semibold" style={{ color: INK }}>March 18</h4>
                  </div>
                  <div className="rounded-xl p-5" style={{ background: PAPER }}>
                    <p className="text-sm" style={{ color: MUTED }}>Source</p>
                    <h4 className="mt-2 font-semibold" style={{ color: INK }}>Google Drive</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-24">
            {[
              { icon: FiMessageCircle, title: "Remember a keyword?", body: "Search using a topic, a single word, or even a vague memory." },
              { icon: FiBookOpen, title: "Everything connected", body: "Resources stay organized inside collections and topics automatically." },
              { icon: FiZap, title: "Find it instantly", body: "Stop scrolling through folders, bookmarks and browser history." },
            ].map((c) => (
              <div
                key={c.title}
                className="bg-white rounded-3xl p-8 border shadow-sm hover:-translate-y-2 hover:shadow-2xl transition duration-300"
                style={{ borderColor: LINE }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: CHIP, color: CHIP_INK }}>
                  <c.icon />
                </div>
                <h4 className="mt-5 text-xl font-semibold" style={{ color: INK }}>{c.title}</h4>
                <p className="mt-4 leading-7" style={{ color: INK_SOFT }}>{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider fill={PAPER} />

      {/* CTA */}
      <section className="pt-0 pb-20" style={{ background: PAPER }}>
        <div className="max-w-6xl mx-auto px-8">
          <div
            className="rounded-[40px] overflow-hidden relative shadow-2xl"
            style={{
              backgroundImage:
                `radial-gradient(circle at 15% 20%, rgba(255,255,255,0.12), transparent 45%), radial-gradient(circle at 85% 85%, rgba(255,255,255,0.08), transparent 50%), linear-gradient(135deg, ${NAVY}, ${NAVY_DARK})`,
            }}
          >

            <div className="relative text-center py-16 px-10">
              <p className="uppercase tracking-[0.35em] text-white/80 text-sm">Ready to start?</p>
              <h2
                className="mt-5 text-5xl md:text-6xl font-medium text-white leading-tight"
                style={{ fontFamily: FRAUNCES }}
              >
                Stop losing good links 
                <br />
                in fifty open tabs.
              </h2>
              <p className="mt-6 text-white/80 max-w-2xl mx-auto text-lg leading-8">
                Build your own searchable knowledge library. Save once. Find forever.
              </p>

              <div className="mt-10 flex flex-col items-center gap-5">
                <Link
                  to="/signup"
                  className="bg-white px-8 py-4 rounded-2xl font-semibold hover:scale-105 transition shadow-lg"
                  style={{ color: NAVY }}
                >
                  Get Started Free
                </Link>
                <p className="text-white/70 text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="text-white underline underline-offset-2 hover:text-white/90">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-white border-t scroll-mt-24" style={{ borderColor: LINE }}>
        <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-medium" style={{ fontFamily: FRAUNCES, color: INK }}>Resurf</span>
            <span className="hidden sm:inline text-sm" style={{ color: MUTED }}>Organize. Search. Rediscover.</span>
          </div>

          <div className="flex items-center gap-6" style={{ color: INK_SOFT }}>
            <a href="#" className="flex items-center gap-2 hover:opacity-70 transition">
              <FiGithub /> GitHub
            </a>
            <a href="#" className="flex items-center gap-2 hover:opacity-70 transition">
              <FiLinkedin /> LinkedIn
            </a>
            <a href="#" className="flex items-center gap-2 hover:opacity-70 transition">
              <FiMail /> Email
            </a>
          </div>

          <p className="text-sm" style={{ color: MUTED }}>© 2026 Resurf</p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
